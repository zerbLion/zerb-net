// Multi-provider streaming chat abstraction (Gemini / OpenAI / Anthropic).
// Each provider exposes streamChat() -> async iterable of text chunks.

export type ChatMsg = { role: 'user' | 'assistant'; content: string };

export interface ChatOptions {
  system: string;
  messages: ChatMsg[];
  model: string;
  maxOutputTokens: number;
}

const env = (k: string): string | undefined =>
  process.env[k] ?? (import.meta.env as Record<string, string>)[k];

export type Provider = 'gemini' | 'openai' | 'anthropic';

export function resolveProvider(): { provider: Provider; key: string } | null {
  const want = (env('AI_PROVIDER') || 'auto').toLowerCase();
  const keys: Record<Provider, string | undefined> = {
    gemini: env('GEMINI_API_KEY'),
    openai: env('OPENAI_API_KEY'),
    anthropic: env('ANTHROPIC_API_KEY'),
  };
  const order: Provider[] =
    want === 'auto' ? ['gemini', 'openai', 'anthropic'] : [want as Provider];
  for (const p of order) {
    if (keys[p]) return { provider: p, key: keys[p]! };
  }
  return null;
}

const DEFAULT_MODEL: Record<Provider, string> = {
  gemini: 'gemini-2.5-flash',
  openai: 'gpt-4o-mini',
  anthropic: 'claude-haiku-4-5',
};

export function modelFor(provider: Provider): string {
  const m = env('AI_MODEL');
  // Only honor AI_MODEL if it plausibly matches the chosen provider.
  if (m) {
    if (provider === 'gemini' && m.startsWith('gemini')) return m;
    if (provider === 'openai' && m.startsWith('gpt')) return m;
    if (provider === 'anthropic' && m.startsWith('claude')) return m;
  }
  return DEFAULT_MODEL[provider];
}

// Parse an SSE byte stream into individual "data:" payload strings.
async function* sseLines(res: Response): AsyncGenerator<string> {
  const reader = res.body!.getReader();
  const dec = new TextDecoder();
  let buf = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const parts = buf.split('\n');
    buf = parts.pop()!;
    for (const line of parts) {
      const t = line.trim();
      if (t.startsWith('data:')) yield t.slice(5).trim();
    }
  }
}

export async function* streamChat(
  provider: Provider,
  key: string,
  opts: ChatOptions
): AsyncGenerator<string> {
  if (provider === 'gemini') {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${opts.model}:streamGenerateContent?alt=sse&key=${key}`;
    const body = {
      systemInstruction: { parts: [{ text: opts.system }] },
      contents: opts.messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      generationConfig: { maxOutputTokens: opts.maxOutputTokens, temperature: 0.7 },
    };
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`gemini ${res.status}: ${await res.text()}`);
    for await (const data of sseLines(res)) {
      if (data === '[DONE]') break;
      try {
        const j = JSON.parse(data);
        const t = j?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (t) yield t;
      } catch {}
    }
    return;
  }

  if (provider === 'openai') {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: opts.model,
        stream: true,
        max_tokens: opts.maxOutputTokens,
        messages: [
          { role: 'system', content: opts.system },
          ...opts.messages,
        ],
      }),
    });
    if (!res.ok) throw new Error(`openai ${res.status}: ${await res.text()}`);
    for await (const data of sseLines(res)) {
      if (data === '[DONE]') break;
      try {
        const t = JSON.parse(data)?.choices?.[0]?.delta?.content;
        if (t) yield t;
      } catch {}
    }
    return;
  }

  // anthropic
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: opts.model,
      max_tokens: opts.maxOutputTokens,
      system: opts.system,
      stream: true,
      messages: opts.messages,
    }),
  });
  if (!res.ok) throw new Error(`anthropic ${res.status}: ${await res.text()}`);
  for await (const data of sseLines(res)) {
    try {
      const j = JSON.parse(data);
      if (j.type === 'content_block_delta' && j.delta?.text) yield j.delta.text;
    } catch {}
  }
}
