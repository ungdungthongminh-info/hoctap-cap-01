import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { unzipSync } from 'fflate';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
export const SCRATCH_ROOT = process.env.HHK_TTS_SCRATCH_ROOT || 'F:\\1_A_Disk_D\\Khương Bình\\hhk-tts-audio';
export const R2_REQUIRED_ENV_KEYS = [
  'R2_ACCOUNT_ID',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET',
  'R2_PUBLIC_BASE_URL',
  'R2_ENDPOINT',
];

export function resolveScratchPath(...parts) {
  return path.join(SCRATCH_ROOT, ...parts);
}

export function parseDotEnv(content) {
  const result = {};
  for (const line of String(content || '').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx < 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (key) result[key] = value;
  }
  return result;
}

function normalizeEnvValue(value) {
  return String(value || '').trim();
}

function isPlaceholderValue(value) {
  const v = normalizeEnvValue(value);
  if (!v) return true;
  if (v.includes('<') || v.includes('>')) return true;
  if (v === '...') return true;
  return false;
}

async function readRepoEnvFile() {
  const envPath = path.join(REPO_ROOT, '.env.r2');
  const exists = await fsp.stat(envPath).then(() => true).catch(() => false);
  if (!exists) {
    return { envPath, exists: false, parsed: {} };
  }

  const text = await fsp.readFile(envPath, 'utf8');
  return { envPath, exists: true, parsed: parseDotEnv(text) };
}

export async function getR2Config() {
  const { envPath, exists, parsed } = await readRepoEnvFile();
  const merged = { ...parsed, ...process.env };

  const missingKeys = R2_REQUIRED_ENV_KEYS.filter((key) => isPlaceholderValue(merged[key]));
  const source = {
    filePath: envPath,
    envFileExists: exists,
    fromFile: R2_REQUIRED_ENV_KEYS.filter((key) => !isPlaceholderValue(parsed[key])),
    fromShell: R2_REQUIRED_ENV_KEYS.filter((key) => !isPlaceholderValue(process.env[key])),
  };

  return {
    ok: missingKeys.length === 0,
    env: merged,
    missingKeys,
    source,
  };
}

export async function loadR2Env() {
  const cfg = await getR2Config();
  return {
    env: cfg.env,
    missing: cfg.missingKeys,
    envPath: cfg.source.filePath,
    source: cfg.source,
  };
}

export function createR2Client(env) {
  return new S3Client({
    region: 'auto',
    endpoint: env.R2_ENDPOINT,
    forcePathStyle: true,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });
}

export function normalizePublicBaseUrl(url) {
  return String(url || '').trim().replace(/\/+$/, '');
}

export function buildR2PublicUrl(baseUrl, key) {
  return `${normalizePublicBaseUrl(baseUrl)}/${String(key || '').replace(/^\/+/, '')}`;
}

export function sha256File(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('error', reject);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

export async function readMagic(filePath, count = 4) {
  const fd = await fsp.open(filePath, 'r');
  try {
    const buffer = Buffer.alloc(count);
    const { bytesRead } = await fd.read(buffer, 0, count, 0);
    return buffer.subarray(0, bytesRead).toString('ascii');
  } finally {
    await fd.close();
  }
}

export async function fileLooksHtml(filePath) {
  const fd = await fsp.open(filePath, 'r');
  try {
    const buffer = Buffer.alloc(512);
    const { bytesRead } = await fd.read(buffer, 0, 512, 0);
    const text = buffer.subarray(0, bytesRead).toString('utf8').toLowerCase();
    return text.includes('<!doctype html') || text.includes('<html');
  } finally {
    await fd.close();
  }
}

export async function countZipEntries(filePath) {
  const raw = await fsp.readFile(filePath);
  const entries = unzipSync(new Uint8Array(raw.buffer, raw.byteOffset, raw.byteLength));
  return Object.keys(entries).length;
}

export async function ensureDir(dirPath) {
  await fsp.mkdir(dirPath, { recursive: true });
}

export function ensureNoSecretOrAudioStaged() {
  let staged = '';
  try {
    staged = execSync('git diff --cached --name-only', { cwd: REPO_ROOT, stdio: ['ignore', 'pipe', 'pipe'] }).toString('utf8');
  } catch {
    staged = '';
  }

  const lines = staged.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
  const blocked = lines.filter((p) => {
    const low = p.toLowerCase();
    return low.includes('.env') || low.endsWith('.mp3') || low.endsWith('.zip') || low.includes('hhk-tts-audio');
  });

  if (blocked.length > 0) {
    const err = new Error(`Blocked staged files detected: ${blocked.join(', ')}`);
    err.code = 'STAGED_SECRET_OR_AUDIO';
    throw err;
  }
}

export async function uploadFileToR2({ client, bucket, key, filePath, contentType, metadata }) {
  const body = await fsp.readFile(filePath);
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
    Metadata: metadata,
    ACL: 'public-read',
  }));
}

export async function headR2Object({ client, bucket, key }) {
  try {
    return await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
  } catch {
    return null;
  }
}

export async function probePublicUrl(url) {
  const response = await fetch(url, { method: 'GET', cache: 'no-cache' });
  const ct = String(response.headers.get('content-type') || '');
  const cl = Number(response.headers.get('content-length') || 0);
  const bytes = Buffer.from(await response.arrayBuffer());
  const head = bytes.subarray(0, 512).toString('utf8').toLowerCase();
  const isHtml = head.includes('<!doctype html') || head.includes('<html');
  const magic = bytes.length >= 2 ? bytes.subarray(0, 2).toString('ascii') : '';
  return {
    status: response.status,
    contentType: ct,
    contentLength: cl || bytes.length,
    isHtml,
    magic,
  };
}

export async function writeJson(filePath, payload) {
  await ensureDir(path.dirname(filePath));
  await fsp.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

export async function readJson(filePath) {
  return JSON.parse(await fsp.readFile(filePath, 'utf8'));
}

export function nowIso() {
  return new Date().toISOString();
}
