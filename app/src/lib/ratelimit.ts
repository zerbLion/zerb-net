// Best-effort in-memory rate limiter. Works for local dev and a single warm
// serverless instance. For strict production limits across instances, swap the
// store for Vercel KV / Upstash (same check signature).

type Bucket = { minStamps: number[]; dayCount: number; dayStart: number };

const ipBuckets = new Map<string, Bucket>();
let globalDay = { start: 0, count: 0 };

const DAY = 86_400_000;
const MIN = 60_000;

function num(k: string, d: number): number {
  const v = process.env[k] ?? (import.meta.env as Record<string, string>)[k];
  const n = v ? parseInt(v, 10) : NaN;
  return Number.isFinite(n) ? n : d;
}

export interface LimitResult {
  ok: boolean;
  reason?: 'minute' | 'day' | 'global';
}

export function checkRateLimit(ip: string): LimitResult {
  const now = Date.now();
  const perMin = num('AI_RATE_LIMIT_PER_MIN', 6);
  const perDay = num('AI_RATE_LIMIT_PER_DAY', 50);
  const globalCap = num('AI_DAILY_GLOBAL_CAP', 1000);

  // global daily ceiling
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

  // count this request
  b.minStamps.push(now);
  b.dayCount++;
  globalDay.count++;

  // opportunistic cleanup
  if (ipBuckets.size > 5000) {
    for (const [k, v] of ipBuckets) if (now - v.dayStart > DAY) ipBuckets.delete(k);
  }
  return { ok: true };
}
