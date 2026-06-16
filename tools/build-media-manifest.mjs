// Phase 2 step 1: build a deterministic map of local video URL -> R2 public URL.
// Run from repo root:  npm run media:manifest
// Output: media-manifest.json  (committed; drives both upload and rewrite)

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { enumerateVideos, ROOT, PUBLIC_BASE } from './lib/r2-media.mjs';

const items = await enumerateVideos();

const manifest = {
  generatedAt: new Date().toISOString(),
  publicBase: PUBLIC_BASE,
  count: items.length,
  videos: Object.fromEntries(
    items.map((it) => [it.origUrl, { key: it.key, url: it.publicUrl }])
  ),
};

const out = join(ROOT, 'media-manifest.json');
await writeFile(out, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

for (const it of items) console.log(`${it.origUrl}\n   -> ${it.publicUrl}`);
console.log(`\n${items.length} videos mapped -> media-manifest.json (base ${PUBLIC_BASE})`);
