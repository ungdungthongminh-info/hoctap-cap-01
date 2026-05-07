/**
 * Upload desktop update artifacts to WEB R2 (bucket: ung-dung-thong-minh)
 * Path: /app-updates/app-study-12/
 *
 * Files uploaded:
 *   - HocHungKhoi_Desktopapp-Win-{version}.exe
 *   - HocHungKhoi_Desktopapp-Win-{version}.exe.blockmap
 *   - latest.yml
 *
 * Usage:
 *   node scripts/upload-desktop-update-to-r2.mjs
 *
 * Env vars (or set directly below for one-off use):
 *   R2_WEB_ACCESS_KEY_ID
 *   R2_WEB_SECRET_ACCESS_KEY
 *   R2_WEB_ACCOUNT_ID
 */

import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── WEB R2 config (ung-dung-thong-minh bucket) ──────────────────────────────
const ACCOUNT_ID   = process.env.R2_WEB_ACCOUNT_ID    || 'ce1e1df310b411007ce9aed509dd2d4d';
const ACCESS_KEY   = process.env.R2_WEB_ACCESS_KEY_ID  || '';
const SECRET_KEY   = process.env.R2_WEB_SECRET_ACCESS_KEY || '';
const BUCKET       = 'ung-dung-thong-minh';
const R2_PREFIX    = 'app-updates/app-study-12';
const PUBLIC_BASE  = 'https://pub-90b335e287f24c92bbd5856cb9f116d9.r2.dev';

if (!ACCESS_KEY || !SECRET_KEY) {
  console.error('ERROR: R2_WEB_ACCESS_KEY_ID and R2_WEB_SECRET_ACCESS_KEY must be set.');
  console.error('       Set them as env vars before running this script.');
  process.exit(1);
}

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
});

// ── Detect version from latest.yml ──────────────────────────────────────────
const RELEASE_DIR = path.join(ROOT, 'release');
const latestYmlPath = path.join(RELEASE_DIR, 'latest.yml');

if (!fs.existsSync(latestYmlPath)) {
  console.error(`ERROR: ${latestYmlPath} not found. Run 'npm run electron:build' first.`);
  process.exit(1);
}

const latestYmlContent = fs.readFileSync(latestYmlPath, 'utf8');
const versionMatch = latestYmlContent.match(/^version:\s*(.+)$/m);
if (!versionMatch) {
  console.error('ERROR: Cannot parse version from latest.yml');
  process.exit(1);
}
const VERSION = versionMatch[1].trim();
console.log(`Detected version: ${VERSION}`);

// ── Files to upload ──────────────────────────────────────────────────────────
const EXE_NAME      = `HocHungKhoi_Desktopapp-Win-${VERSION}.exe`;
const BLOCKMAP_NAME = `HocHungKhoi_Desktopapp-Win-${VERSION}.exe.blockmap`;

const uploads = [
  { localPath: path.join(RELEASE_DIR, EXE_NAME),      r2Key: `${R2_PREFIX}/${EXE_NAME}`,      contentType: 'application/octet-stream' },
  { localPath: path.join(RELEASE_DIR, BLOCKMAP_NAME), r2Key: `${R2_PREFIX}/${BLOCKMAP_NAME}`, contentType: 'application/octet-stream' },
  { localPath: latestYmlPath,                          r2Key: `${R2_PREFIX}/latest.yml`,        contentType: 'text/yaml; charset=utf-8' },
].filter(({ localPath }) => {
  if (!fs.existsSync(localPath)) {
    console.warn(`SKIP (not found): ${localPath}`);
    return false;
  }
  return true;
});

if (uploads.length === 0) {
  console.error('ERROR: No files found to upload in release/ directory.');
  process.exit(1);
}

// ── Upload ───────────────────────────────────────────────────────────────────
async function uploadFile({ localPath, r2Key, contentType }) {
  const stat = fs.statSync(localPath);
  const sizeMB = (stat.size / 1024 / 1024).toFixed(1);
  process.stdout.write(`Uploading ${path.basename(localPath)} (${sizeMB} MB) → ${r2Key} ... `);
  const body = fs.createReadStream(localPath);
  await client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: r2Key,
    Body: body,
    ContentType: contentType,
    ContentLength: stat.size,
  }));
  console.log('OK');
}

async function verifyFile(r2Key) {
  try {
    const head = await client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: r2Key }));
    const pub = `${PUBLIC_BASE}/${r2Key}`;
    console.log(`  ✓ ${pub}  (${(head.ContentLength / 1024 / 1024).toFixed(1)} MB)`);
  } catch {
    console.warn(`  ✗ Could not verify: ${r2Key}`);
  }
}

console.log(`\nUploading ${uploads.length} file(s) to R2 bucket: ${BUCKET}\n`);
for (const item of uploads) {
  await uploadFile(item);
}

console.log('\nVerifying uploaded files:');
for (const { r2Key } of uploads) {
  await verifyFile(r2Key);
}

console.log(`\nDone. Update manifest URL:\n  ${PUBLIC_BASE}/${R2_PREFIX}/latest.yml`);
console.log(`Direct EXE download URL:\n  ${PUBLIC_BASE}/${R2_PREFIX}/${EXE_NAME}\n`);
