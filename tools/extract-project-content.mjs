// Phase 1 migration helper.
// Extracts the <div class="entry-content"> body from each WordPress-exported
// project/<slug>/index.html and writes it to app/src/project-bodies/<slug>.html
// for the Astro detail template ([slug].astro) to render via set:html.
//
// Run from repo root:  node tools/extract-project-content.mjs

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const projectsDir = join(root, 'project');
const outDir = join(root, 'app', 'src', 'project-bodies');

function extractEntryContent(html) {
  const start = html.indexOf('<div class="entry-content">');
  if (start === -1) return null;
  const end = html.indexOf('<!-- .entry-content -->', start);
  if (end === -1) return null;
  // inner = between opening div and the closing comment's </div>
  let inner = html.slice(start + '<div class="entry-content">'.length, end);
  // the closing </div> sits right before the comment
  inner = inner.replace(/<\/div>\s*$/, '');
  return inner.trim();
}

function clean(html) {
  return (
    html
      // drop empty paragraphs that only add vertical gaps
      .replace(/<p[^>]*class="[^"]*wp-block-paragraph[^"]*"[^>]*>\s*<\/p>/g, '')
      // tidy excessive blank lines
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}

const slugs = (await readdir(projectsDir, { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });

let ok = 0;
const report = [];
for (const slug of slugs) {
  const file = join(projectsDir, slug, 'index.html');
  if (!existsSync(file)) {
    report.push(`SKIP ${slug} (no index.html)`);
    continue;
  }
  const html = await readFile(file, 'utf8');
  const body = extractEntryContent(html);
  if (body == null) {
    report.push(`FAIL ${slug} (no entry-content)`);
    continue;
  }
  const cleaned = clean(body);
  await writeFile(join(outDir, `${slug}.html`), cleaned + '\n', 'utf8');
  const imgs = (cleaned.match(/<img/g) || []).length;
  const vids = (cleaned.match(/<video/g) || []).length;
  ok++;
  report.push(`OK   ${slug}  (${cleaned.length}b, ${imgs} img, ${vids} video)`);
}

console.log(report.join('\n'));
console.log(`\nExtracted ${ok}/${slugs.length} project bodies -> ${outDir}`);
