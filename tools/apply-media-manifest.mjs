// Phase 2 step 2: rewrite /media/videos/... references to their R2 public URLs.
// Run from repo root:  npm run media:apply
// Targets the migrated Astro bodies (app/src/project-bodies/*.html). The old
// static export under project/ is left untouched (it is being replaced).

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { ROOT } from './lib/r2-media.mjs';

const manifest = JSON.parse(
  await readFile(join(ROOT, 'media-manifest.json'), 'utf8')
);
const map = manifest.videos; // origUrl -> { key, url }

const bodiesDir = join(ROOT, 'app', 'src', 'project-bodies');
const files = (await readdir(bodiesDir)).filter((f) => f.endsWith('.html'));

let totalReplaced = 0;
let unresolved = [];

for (const f of files) {
  const path = join(bodiesDir, f);
  let html = await readFile(path, 'utf8');
  let replaced = 0;

  // Replace both raw and percent-encoded occurrences of each known origUrl.
  for (const [origUrl, { url }] of Object.entries(map)) {
    const encoded = '/' + origUrl.slice(1).split('/').map(encodeURIComponent).join('/');
    for (const needle of new Set([origUrl, encoded])) {
      if (html.includes(needle)) {
        html = html.split(needle).join(url);
        replaced++;
      }
    }
  }

  // Flag any video refs we could not map (filename drift, new files, etc.)
  for (const m of html.matchAll(/\/media\/videos\/[^"')\s]+/g)) {
    unresolved.push(`${f}: ${m[0]}`);
  }

  if (replaced > 0) {
    await writeFile(path, html, 'utf8');
    totalReplaced += replaced;
    console.log(`${f}: rewrote ${replaced} ref(s)`);
  }
}

console.log(`\nTotal rewritten: ${totalReplaced}`);
if (unresolved.length) {
  console.log('\nUNRESOLVED /media/videos refs (check manifest / filenames):');
  unresolved.forEach((u) => console.log('  ' + u));
  process.exitCode = 1;
} else {
  console.log('No unresolved /media/videos references remain. ✓');
}
