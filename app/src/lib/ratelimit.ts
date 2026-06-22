// Rate limiter for the AI endpoint. Two backends, one async signature:
//
//  • Upstash Redis (REST) — shared across ALL serverless instances, so the limits
//    are actually enforced in production. Enabled automatically when
//    UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (or Vercel KV's
//    KV_REST_API_URL / KV_REST_API_TOKEN) are present.
//  • In-memory fallback — used locally / before Redis is connected. Best-effort
//    only (per warm instance), but keeps the assistant working.
//
// Fixed-window counters keyed by IP + window bucket. A rejected request still
// increments its window (slightly stricter — fine for abuse control).

export interface LimitResult {
  ok: boolean;
  reason?: 'minute' | 'day' | 'global';
}

const DAY = 86_400_000;
const MIN = 60_000;

function envVal(...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = process.env[k] ?? (import.meta.env as Record<string, string>)[k];
    if (v) return v;
  }
  return undefined;
}
function num(k: string, d: number): number {
  const v = envVal(k);
  const n = v ? parseInt(v, 10) : NaN;
  return Number.isFinite(n) ? n : d;
}
function limits() {
  return {
    perMin: num('AI_RATE_LIMIT_PER_MIN', 6),
    perDay: num('AI_RATE_LIMIT_PER_DAY', 50),
    globalCap: num('AI_DAILY_GLOBAL_CAP', 1000),
  };
}

// ── Upstash Redis (REST) backend ───────────────────────────────────────────────
const redisUrl = () => envVal('UPSTASH_REDIS_REST_URL', 'KV_REST_API_URL');
const redisTok = () => envVal('UPSTASH_REDIS_REST_TOKEN', 'KV_REST_API_TOKEN');

async function checkRedis(ip: string): Promise<LimitResult> {
  const url = redisUrl()!.replace(/\/$/, '');
  const token = redisTok()!;
  const now = Date.now();
  const minB = Math.floor(now / MIN);
  const dayB = Math.floor(now / DAY);
  const { perMin, perDay, globalCap } = limits();

  const kMin = `rl:min:${ip}:${minB}`;
  const kDay = `rl:day:${ip}:${dayB}`;
  const kGlobal = `rl:global:${dayB}`;

  // One round-trip: INCR each counter and (re)set a TTL so stale windows expire.
  const cmds = [
    ['INCR', kMin], ['EXPIRE', kMin, '120'],
    ['INCR', kDay], ['EXPIRE', kDay, '172800'],
    ['INCR', kGlobal], ['EXPIRE', kGlobal, '172800'],
  ];
  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds),
  });
  if (!res.ok) throw new Error(`upstash ${res.status}`);
  const out = (await res.json()) as Array<{ result?: number; error?: string }>;
  const minCount = out[0]?.result ?? 0;
  const dayCount = out[2]?.result ?? 0;
  const globalCount = out[4]?.result ?? 0;

  if (globalCount > globalCap) return { ok: false, reason: 'global' };
  if (minCount > perMin) return { ok: false, reason: 'minute' };
  if (dayCount > perDay) return { ok: false, reason: 'day' };
  return { ok: true };
}

// ── In-memory fallback ─────────────────────────────────────────────────────────
type Bucket = { minStamps: number[]; dayCount: number; dayStart: number };
const ipBuckets = new Map<string, Bucket>();
let globalDay = { start: 0, count: 0 };

function checkMemory(ip: string): LimitResult {
  const now = Date.now();
  const { perMin, perDay, globalCap } = limits();

  if (now - globalDay.start > DAY) globalDay = { start: now, count: 0 };
  if (globalDay.count >= globalCap) return { ok: false, reason: 'global' };

  let b = ipBuckets.get(ip);
  if (!b || now - b.dayStart > DAY) {
    b = { minStamps: [], dayCount: 0, dayStart: now };
    ipBuckets.set(ip, b);
  }
  b.minStamps = b.minStamps.filter((t) => now - t < MIN);
  if (b.minStamps.length >= perMin) return { ok: false, reason: 'minute' };
  if (b.dayCount >= perDay) return { ok: false, reason: 'day' };

  b.minStamps.push(now);
  b.dayCount++;
  globalDay.count++;

  if (ipBuckets.size > 5000) {
    for (const [k, v] of ipBuckets) if (now - v.dayStart > DAY) ipBuckets.delete(k);
  }
  return { ok: true };
}

let warnedNoRedis = false;
export async function checkRateLimit(ip: string): Promise<LimitResult> {
  if (redisUrl() && redisTok()) {
    try {
      return await checkRedis(ip);
    } catch (e) {
      // Redis hiccup: fail open so a transient outage never breaks the assistant.
      // The provider's own quota + the warm-instance memory cap still backstop.
      console.error('ratelimit: redis error, allowing request', e);
      return { ok: true };
    }
  }
  if (!warnedNoRedis) {
    warnedNoRedis = true;
    console.warn('ratelimit: no Upstash/KV env — in-memory fallback (per-instance only)');
  }
  return checkMemory(ip);
}
