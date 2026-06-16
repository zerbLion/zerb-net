// Phase 2 step 3: upload local videos to Cloudflare R2 (S3 API) using the same
// deterministic keys as the manifest. Skips objects already present (HEAD 200).
//
// Run from repo root (reads creds from .env):  npm run media:upload
//
// Required .env vars: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
// R2_BUCKET. Optional: R2_PUBLIC_BASE (only affects printed URLs).

import { readFile } from 'node:fs/promises';
import { AwsClient } from 'aws4fetch';
import { enumerateVideos } from './lib/r2-media.mjs';

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
} = process.env;

const missing = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET']
  .filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing env vars: ${missing.join(', ')}\nFill them in .env (see .env.example).`);
  process.exit(1);
}

const endpoint = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}`;
const aws = new AwsClient({
  accessKeyId: R2_ACCESS_KEY_ID,
  secretAccessKey: R2_SECRET_ACCESS_KEY,
  service: 's3',
  region: 'auto',
});

const CT = {
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.m4v': 'video/x-m4v',
};

const items = await enumerateVideos();
console.log(`Uploading ${items.length} videos to bucket "${R2_BUCKET}"...\n`);

let uploaded = 0, skipped = 0, failed = 0;
for (const it of items) {
  const url = `${endpoint}/${it.key}`;
  const ext = it.key.slice(it.key.lastIndexOf('.')).toLowerCase();
  try {
    const head = await aws.fetch(url, { method: 'HEAD' });
    if (head.status === 200) {
      console.log(`skip  ${it.key}`);
      skipped++;
      continue;
    }
    const body = await readFile(it.absPath);
    const put = await aws.fetch(url, {
      method: 'PUT',
      body,
      headers: { 'Content-Type': CT[ext] || 'application/octet-stream' },
    });
    if (!put.ok) throw new Error(`HTTP ${put.status} ${await put.text()}`);
    console.log(`ok    ${it.key}  (${(body.length / 1048576).toFixed(2)} MB)`);
    uploaded++;
  } catch (e) {
    console.error(`FAIL  ${it.key}  ${e.message}`);
    failed++;
  }
}

console.log(`\nUploaded ${uploaded}, skipped ${skipped}, failed ${failed}.`);
if (failed) process.exitCode = 1;
