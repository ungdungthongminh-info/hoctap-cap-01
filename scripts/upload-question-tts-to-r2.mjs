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

const CATALOG = path.join(REPO_ROOT, 'question-tts-catalog-report.json');
const OUTPUT = path.join(REPO_ROOT, 'r2-question-tts-upload-report.json');

function getArg(name, fallback = '') {
  const raw = process.argv.find((x) => x.startsWith(`--${name}=`));
  return raw ? raw.slice(name.length + 3) : fallback;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function getLocalPath(item) {
  return resolveScratchPath('audio', 'question', String(item.localRelativePath || `${item.profileId}/question/${item.questionId}.mp3`));
}

async function main() {
  ensureNoSecretOrAudioStaged();
  const { env, missing } = await loadR2Env();
  if (missing.length) throw new Error(`Missing R2 env keys: ${missing.join(', ')}`);

  const language = getArg('language', '').trim();
  const sample = hasFlag('sample');
  const limit = Number(getArg('limit', '0')) || 0;
  const skipExisting = hasFlag('skip-existing');

  const catalog = await readJson(CATALOG);
  let items = catalog.items || [];
  if (language) {
    items = items.filter((x) => String(x.language || x.profileId) === language);
  }
  if (sample) {
    if (language) {
      items = items.slice(0, 25);
    } else {
      const viItems = items.filter((x) => String(x.language || x.profileId) === 'vi-v1').slice(0, 20);
      const enItems = items.filter((x) => String(x.language || x.profileId) === 'en-v1').slice(0, 5);
      items = [...viItems, ...enItems];
    }
  }
  if (limit > 0) {
    items = items.slice(0, limit);
  }

  const client = createR2Client(env);

  let uploaded = 0;
  let skippedMatched = 0;
  let skippedByFlag = 0;
  let missingLocal = 0;
  const details = [];

  for (const item of items) {
    const localPath = getLocalPath(item);
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
      skippedMatched += 1;
      details.push({ key: item.key, localPath, r2Key: item.r2Key, status: 'skipped-matched' });
      continue;
    }

    if (skipExisting && existing) {
      skippedByFlag += 1;
      details.push({ key: item.key, localPath, r2Key: item.r2Key, status: 'skipped-existing-remote' });
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
    language: language || 'all',
    sample,
    totalItems: items.length,
    uploaded,
    skipped: skippedMatched + skippedByFlag,
    skippedBreakdown: {
      matchedBySizeHash: skippedMatched,
      existingRemote: skippedByFlag,
    },
    missingLocal,
    pass: missingLocal === 0,
    details,
  };

  await writeJson(OUTPUT, out);
  console.log(JSON.stringify({
    total: out.totalItems,
    uploaded,
    skipped: out.skipped,
    missingLocal,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
