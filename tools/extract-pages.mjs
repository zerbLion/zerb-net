// Phase 1 migration helper for non-project pages (resume + blog posts).
// Extracts <div class="entry-content"> from each source and writes a raw HTML
// partial for the Astro pages to render via set:html.
//
// Run from repo root:  node tools/extract-pages.mjs

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const targets = [
  { src: 'resume/index.html', out: 'app/src/migrated/resume.html' },
  { src: 'blog/wind/index.html', out: 'app/src/migrated/blog-wind.html' },
  {
    src: 'blog/silence-is-a-eternal-theme/index.html',
    out: 'app/src/migrated/blog-silence-is-a-eternal-theme.html',
  },
];

function extractEntryContent(html) {
  const start = html.indexOf('<div class="entry-content">');
  if (start === -1) return null;
  const end = html.indexOf('<!-- .entry-content -->', start);
  if (end === -1) return null;
  let inner = html.slice(start + '<div class="entry-content">'.length, end);
  inner = inner.replace(/<\/div>\s*$/, '');
  return inner.trim();
}

function clean(html) {
  return html
    .replace(/<p[^>]*class="[^"]*wp-block-paragraph[^"]*"[^>]*>\s*<\/p>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

for (const t of targets) {
  const srcPath = join(root, t.src);
  if (!existsSync(srcPath)) {
    console.log(`SKIP ${t.src} (missing)`);
    continue;
  }
  const html = await readFile(srcPath, 'utf8');
  const body = extractEntryContent(html);
  if (body == null) {
    console.log(`FAIL ${t.src} (no entry-content)`);
    continue;
  }
  const outPath = join(root, t.out);
  await mkdir(dirname(outPath), { recursive: true });
  const cleaned = clean(body);
  await writeFile(outPath, cleaned + '\n', 'utf8');
  const imgs = (cleaned.match(/<img/g) || []).length;
  console.log(`OK   ${t.src} -> ${t.out} (${cleaned.length}b, ${imgs} img)`);
}
