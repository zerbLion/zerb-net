// Shared helpers for Phase 2 (video -> Cloudflare R2 migration).
// Enumerates local video files and computes a DETERMINISTIC, ASCII-safe R2 key
// for each, so the manifest/rewrite step and the upload step always agree.

import { readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, dirname, extname, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const VIDEO_DIR = join(ROOT, 'media', 'videos');

// Default public base = the bucket's r2.dev URL. Override via R2_PUBLIC_BASE.
export const PUBLIC_BASE = (
  process.env.R2_PUBLIC_BASE ||
  'https://pub-a0c77317c3024e5db24448b1f68cdada.r2.dev'
).replace(/\/+$/, '');

const VIDEO_EXT = new Set(['.mp4', '.webm', '.mov', '.m4v']);

function shortHash(s) {
  return createHash('sha1').update(s).digest('hex').slice(0, 6);
}

// ASCII-safe filename. Keeps clean names as-is; only non-ascii/colliding names
// get a short hash suffix so nothing collides and nothing breaks in URLs.
export function asciiKeyName(origName, seen) {
  const ext = extname(origName).toLowerCase();
  const base = basename(origName, extname(origName));
  const cleaned = base
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '');
  const isPlainAscii = /^[\x00-\x7F]*$/.test(base);
  let name;
  if (cleaned && isPlainAscii && !seen.has(cleaned + ext)) {
    name = cleaned + ext;
  } else {
    const stem = cleaned || 'clip';
    name = `${stem}-${shortHash(origName)}${ext}`;
  }
  seen.add(name);
  return name;
}

async function walk(dir) {
  const out = [];
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) out.push(...(await walk(full)));
    else if (VIDEO_EXT.has(extname(ent.name).toLowerCase())) out.push(full);
  }
  return out;
}

// Returns [{ absPath, origUrl, key, publicUrl }] for every local video.
export async function enumerateVideos() {
  const files = (await walk(VIDEO_DIR)).sort();
  const byDir = new Map(); // per-directory "seen" sets for collision-free names
  const items = [];
  for (const absPath of files) {
    const relFromRoot = relative(ROOT, absPath).split('\\').join('/'); // media/videos/...
    const dir = dirname(relFromRoot); // media/videos/projects/<slug>
    if (!byDir.has(dir)) byDir.set(dir, new Set());
    const keyName = asciiKeyName(basename(absPath), byDir.get(dir));
    const keyDir = dir.replace(/^media\//, ''); // videos/projects/<slug>
    const key = `${keyDir}/${keyName}`;
    items.push({
      absPath,
      origUrl: '/' + relFromRoot, // /media/videos/projects/<slug>/<orig>
      key, // videos/projects/<slug>/<asciiName>
      publicUrl: `${PUBLIC_BASE}/${key}`,
    });
  }
  return items;
}
