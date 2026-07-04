// Post-build: fix the legacy-redirect routes in .vercel/output/config.json.
//
// Astro emits redirect routes as `^/old-path$`, which misses two things the
// real old WordPress links need:
//   1. they all end with a trailing slash  →  make it optional (`/?$`)
//   2. Chinese slugs arrive percent-encoded on the wire, and Vercel matches
//      the *encoded* path  →  encode non-ASCII chars in the regex
//
// Runs as part of `npm run build` (see package.json).
import { readFile, writeFile } from 'node:fs/promises';

const cfgPath = new URL('./.vercel/output/config.json', import.meta.url);
const cfg = JSON.parse(await readFile(cfgPath, 'utf8'));

let patched = 0;
for (const route of cfg.routes ?? []) {
  const loc = route.headers?.Location;
  if (!loc || ![301, 302, 307, 308].includes(route.status) || !route.src) continue;
  let src = route.src.replace(/[^\x00-\x7F]/g, (c) => encodeURIComponent(c));
  if (src.endsWith('$') && !src.endsWith('/?$')) src = src.slice(0, -1) + '/?$';
  // never create a self-loop like ^/works/?$ -> /works/
  const literal = src.replace(/^\^/, '').replace(/\/\?\$$/, '');
  if (loc === literal + '/' || loc === literal) continue;
  if (src !== route.src) {
    route.src = src;
    patched++;
  }
}

await writeFile(cfgPath, JSON.stringify(cfg));
console.log(`[patch-vercel-redirects] patched ${patched} redirect routes`);
