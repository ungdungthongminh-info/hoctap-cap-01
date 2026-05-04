import path from 'node:path';
import fs from 'node:fs/promises';
import {
  REPO_ROOT,
  buildR2PublicUrl,
  createR2Client,
  ensureNoSecretOrAudioStaged,
  headR2Object,
  loadR2Env,
  nowIso,
  readJson,
  resolveScratchPath,
  sha256File,
  uploadFileToR2,
  writeJson,
} from './r2-common.mjs';

const SCRATCH_REPORT = resolveScratchPath('reports', 'r2-lesson-card-mvp-upload-report.json');
const REPO_REPORT = path.join(REPO_ROOT, 'r2-lesson-card-mvp-upload-report.json');

function inScope(item) {
  const key = String(item.assetKey || '');
  const p = String(item.localPath || '').replace(/\\/g, '/');
  return key.startsWith('lesson-card:') && p.includes('/audio/tts/assets/vi-v1/lesson-card-') && p.endsWith('.mp3');
}

async function uploadWithRetry(fn, retries = 3) {
  let lastErr = null;
  for (let i = 0; i < retries; i += 1) {
    try {
      return await fn();
    } catch (error) {
      lastErr = error;
      await new Promise((r) => setTimeout(r, 800 * (i + 1)));
    }
  }
  throw lastErr;
}

async function main() {
  ensureNoSecretOrAudioStaged();
  const { env, missing } = await loadR2Env();
  if (missing.length) throw new Error(`Missing R2 env keys: ${missing.join(', ')}`);

  const source = await readJson(path.join(REPO_ROOT, 'production-web-audio-required-files.json'));
  const items = (source.files || []).filter(inScope);
  const client = createR2Client(env);

  let processed = 0;
  let uploaded = 0;
  let skipped = 0;
  const results = [];

  for (const item of items) {
    processed += 1;
    const relPath = String(item.localPath || '').replace(/\\/g, '/');
    const absolutePath = path.join(REPO_ROOT, relPath);
    const fileName = path.basename(relPath);
    const r2Key = `audio/tts/assets/vi-v1/${fileName}`;
    const publicUrl = buildR2PublicUrl(env.R2_PUBLIC_BASE_URL, r2Key);

    const stat = await fs.stat(absolutePath);
    const sha256 = await sha256File(absolutePath);

    const existing = await headR2Object({ client, bucket: env.R2_BUCKET, key: r2Key });
    const existingSize = Number(existing?.ContentLength || 0);
    const existingSha = String(existing?.Metadata?.sha256 || '');

    let uploadStatus = 'uploaded';
    if (existing && existingSize === stat.size && existingSha === sha256) {
      uploadStatus = 'skipped-matched';
      skipped += 1;
    } else {
      await uploadWithRetry(() => uploadFileToR2({
        client,
        bucket: env.R2_BUCKET,
        key: r2Key,
        filePath: absolutePath,
        contentType: 'audio/mpeg',
        metadata: {
          sha256,
          size: String(stat.size),
          source: 'lesson-card-mvp',
        },
      }));
      uploaded += 1;
    }

    results.push({
      assetKey: item.assetKey,
      localPath: absolutePath,
      r2Key,
      publicUrl,
      sizeBytes: stat.size,
      sha256,
      uploadStatus,
    });

    if (processed % 100 === 0) {
      console.log(`[progress] processed=${processed} uploaded=${uploaded} skipped=${skipped}`);
    }
  }

  const report = {
    generatedAt: nowIso(),
    pass: true,
    bucket: env.R2_BUCKET,
    publicBaseUrl: env.R2_PUBLIC_BASE_URL,
    total: items.length,
    uploaded,
    skipped,
    results,
  };

  await writeJson(SCRATCH_REPORT, report);
  await writeJson(REPO_REPORT, report);
  console.log(JSON.stringify({ total: items.length, uploaded, skipped, pass: true }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
