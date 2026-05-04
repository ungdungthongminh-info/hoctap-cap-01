#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const ENV_FILE = path.join(REPO_ROOT, '.env.r2');

// Parse .env.r2 file
const envContent = fs.readFileSync(ENV_FILE, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, value] = trimmed.split('=');
    if (key && value) env[key.trim()] = value.trim();
  }
});

const { R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_ENDPOINT } = env;

const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function reuploadPacksPublic() {
  const packs = [
    { grade: 0, fileName: 'vi-v1-pre-k-2026-04-27-v1.zip' },
    { grade: 1, fileName: 'vi-v1-grade-1-2026-04-27-v1.zip' },
    { grade: 2, fileName: 'vi-v1-grade-2-2026-04-27-v1.zip' },
    { grade: 3, fileName: 'vi-v1-grade-3-2026-04-27-v1.zip' },
    { grade: 4, fileName: 'vi-v1-grade-4-2026-04-27-v1.zip' },
    { grade: 5, fileName: 'vi-v1-grade-5-2026-04-27-v1.zip' },
  ];

  console.log('Re-uploading packs with public-read ACL...\n');

  for (const pack of packs) {
    const scratchPath = `F:\\1_A_Disk_D\\Khương Bình\\hhk-tts-audio\\drive-packs\\${pack.fileName}`;
    const r2Key = `audio/tts/packs/${pack.fileName}`;

    if (!fs.existsSync(scratchPath)) {
      console.log(`✗ Grade ${pack.grade}: File not found at ${scratchPath}`);
      continue;
    }

    try {
      const body = fs.readFileSync(scratchPath);
      
      await s3Client.send(new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: r2Key,
        Body: body,
        ContentType: 'application/zip',
        ACL: 'public-read',
      }));

      console.log(`✓ Grade ${pack.grade}: Re-uploaded with public-read ACL`);
    } catch (error) {
      console.error(`✗ Grade ${pack.grade}: ${error.message}`);
    }
  }

  console.log('\n✓ Packs re-uploaded!');
}

reuploadPacksPublic().catch(err => {
  console.error(err);
  process.exit(1);
});
