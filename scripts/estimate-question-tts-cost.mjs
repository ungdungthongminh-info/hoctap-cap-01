import path from 'node:path';
import fs from 'node:fs/promises';
import { HeadObjectCommand } from '@aws-sdk/client-s3';
import {
  REPO_ROOT,
  createR2Client,
  loadR2Env,
  nowIso,
  readJson,
  resolveScratchPath,
  writeJson,
} from './r2-common.mjs';

const CATALOG = path.join(REPO_ROOT, 'question-tts-catalog-report.json');
const OUTPUT = path.join(REPO_ROOT, 'question-tts-cost-estimate-report.json');

const COST_PER_1M_CHARS = {
  'vi-v1': 16,
  'en-v1': 16,
};

const CHARS_PER_SECOND = {
  'vi-v1': 11,
  'en-v1': 13,
};

const BYTES_PER_SECOND_MP3 = 6000;

function getArg(name, fallback = '') {
  const raw = process.argv.find((x) => x.startsWith(`--${name}=`));
  return raw ? raw.slice(name.length + 3) : fallback;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function buildLocalPath(item) {
  return resolveScratchPath('audio', 'question', String(item.localRelativePath || `${item.profileId}/question/${item.questionId}.mp3`));
}

async function checkR2Object(client, bucket, key) {
  try {
    const head = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return Number(head?.ContentLength || 0) > 0;
  } catch {
    return false;
  }
}

async function main() {
  const checkR2 = hasFlag('check-r2');
  const sampleLimit = Number(getArg('sample-size', '0')) || 0;
  const catalog = await readJson(CATALOG);
  const allItems = Array.isArray(catalog.items) ? catalog.items : [];
  const items = sampleLimit > 0 ? allItems.slice(0, sampleLimit) : allItems;

  let r2Client = null;
  let r2Env = null;
  if (checkR2) {
    const loaded = await loadR2Env();
    if (loaded.missing.length === 0) {
      r2Client = createR2Client(loaded.env);
      r2Env = loaded.env;
    }
  }

  const byLanguage = {};
  let totalCharacters = 0;
  let totalEstimatedBytes = 0;
  let localExisting = 0;
  let r2Existing = 0;
  let skippable = 0;

  for (const item of items) {
    const language = String(item.language || item.profileId || 'vi-v1');
    const chars = Number(item.estimatedCharacters || 0);
    const cps = CHARS_PER_SECOND[language] || 11;
    const seconds = Math.max(1, Math.ceil(chars / cps));
    const estimatedBytes = seconds * BYTES_PER_SECOND_MP3;

    totalCharacters += chars;
    totalEstimatedBytes += estimatedBytes;

    byLanguage[language] = byLanguage[language] || {
      totalFiles: 0,
      totalCharacters: 0,
      estimatedBytes: 0,
      localExisting: 0,
      r2Existing: 0,
      skippable: 0,
      toGenerate: 0,
      estimatedCostUsdAll: 0,
      estimatedCostUsdToGenerate: 0,
    };

    const stat = byLanguage[language];
    stat.totalFiles += 1;
    stat.totalCharacters += chars;
    stat.estimatedBytes += estimatedBytes;

    const localPath = buildLocalPath(item);
    const hasLocal = await fs.stat(localPath).then(() => true).catch(() => false);
    if (hasLocal) {
      localExisting += 1;
      stat.localExisting += 1;
    }

    let hasR2 = false;
    if (r2Client && r2Env?.R2_BUCKET && item.r2Key) {
      hasR2 = await checkR2Object(r2Client, r2Env.R2_BUCKET, String(item.r2Key));
      if (hasR2) {
        r2Existing += 1;
        stat.r2Existing += 1;
      }
    }

    const itemSkippable = hasLocal || hasR2;
    if (itemSkippable) {
      skippable += 1;
      stat.skippable += 1;
    } else {
      stat.toGenerate += 1;
      stat.estimatedCostUsdToGenerate += (chars / 1000000) * (COST_PER_1M_CHARS[language] || 16);
    }

    stat.estimatedCostUsdAll += (chars / 1000000) * (COST_PER_1M_CHARS[language] || 16);
  }

  for (const value of Object.values(byLanguage)) {
    value.estimatedCostUsdAll = Number(value.estimatedCostUsdAll.toFixed(4));
    value.estimatedCostUsdToGenerate = Number(value.estimatedCostUsdToGenerate.toFixed(4));
  }

  const estimatedCostUsdAll = Number(
    Object.values(byLanguage).reduce((sum, x) => sum + Number(x.estimatedCostUsdAll || 0), 0).toFixed(4),
  );
  const estimatedCostUsdToGenerate = Number(
    Object.values(byLanguage).reduce((sum, x) => sum + Number(x.estimatedCostUsdToGenerate || 0), 0).toFixed(4),
  );

  const out = {
    generatedAt: nowIso(),
    assumptions: {
      costPer1mCharsUsd: COST_PER_1M_CHARS,
      charsPerSecondByLanguage: CHARS_PER_SECOND,
      mp3BytesPerSecond: BYTES_PER_SECOND_MP3,
      note: 'Estimate only. Real billing depends on Google Cloud SKU, voice tier, and region.',
    },
    totalFiles: items.length,
    totalCharacters,
    totalEstimatedBytes,
    localExisting,
    r2Existing,
    skippable,
    byLanguage,
    estimatedCostUsdAll,
    estimatedCostUsdToGenerate,
    checkR2Enabled: Boolean(checkR2 && r2Client),
  };

  await writeJson(OUTPUT, out);
  console.log(JSON.stringify({
    totalFiles: out.totalFiles,
    totalCharacters: out.totalCharacters,
    localExisting: out.localExisting,
    r2Existing: out.r2Existing,
    estimatedCostUsdToGenerate: out.estimatedCostUsdToGenerate,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
