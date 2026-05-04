import path from 'node:path';
import fs from 'node:fs/promises';
import {
  REPO_ROOT,
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

const CATALOG = path.join(REPO_ROOT, 'tts-question-generation-catalog.json');
const OUTPUT = path.join(REPO_ROOT, 'tts-question-r2-upload-report.json');

async function main() {
  ensureNoSecretOrAudioStaged();
  const { env, missing } = await loadR2Env();
  if (missing.length) throw new Error(`Missing R2 env keys: ${missing.join(', ')}`);

  const catalog = await readJson(CATALOG);
  const items = catalog.items || [];
  const client = createR2Client(env);

  let uploaded = 0;
  let skipped = 0;
  let missingLocal = 0;
  const details = [];

  for (const item of items) {
    const localPath = path.join(resolveScratchPath('question', String(item.outputProfileDir || item.profileId || 'vi-v1')), String(item.localFileName || `${String(item.key).replace(':', '-')}.mp3`));
    const exists = await fs.stat(localPath).then(() => true).catch(() => false);
    if (!exists) {
      missingLocal += 1;
      details.push({ key: item.key, localPath, r2Key: item.r2Key, status: 'missing-local' });
      continue;
    }

    const stat = await fs.stat(localPath);
    const sha256 = await sha256File(localPath);
    const existing = await headR2Object({ client, bucket: env.R2_BUCKET, key: item.r2Key });

    if (existing && Number(existing.ContentLength || 0) === stat.size && String(existing.Metadata?.sha256 || '') === sha256) {
      skipped += 1;
      details.push({ key: item.key, localPath, r2Key: item.r2Key, status: 'skipped-matched' });
      continue;
    }

    await uploadFileToR2({
      client,
      bucket: env.R2_BUCKET,
      key: item.r2Key,
      filePath: localPath,
      contentType: 'audio/mpeg',
      metadata: { sha256, size: String(stat.size), source: 'question-tts' },
    });

    uploaded += 1;
    details.push({ key: item.key, localPath, r2Key: item.r2Key, status: 'uploaded' });
  }

  const out = {
    generatedAt: nowIso(),
    totalItems: items.length,
    uploaded,
    skipped,
    missingLocal,
    pass: missingLocal === 0,
    details,
  };

  await writeJson(OUTPUT, out);
  console.log(JSON.stringify({ total: out.totalItems, uploaded, skipped, missingLocal }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
