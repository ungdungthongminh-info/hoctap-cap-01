import path from 'node:path';
import fs from 'node:fs/promises';
import { REPO_ROOT, nowIso, readJson, resolveScratchPath, sha256File, readMagic, fileLooksHtml, writeJson } from './r2-common.mjs';

const CATALOG = path.join(REPO_ROOT, 'question-tts-catalog-report.json');
const OUTPUT = path.join(REPO_ROOT, 'question-tts-validate-report.json');

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

async function readBytes(filePath, length = 8) {
  const fd = await fs.open(filePath, 'r');
  try {
    const buffer = Buffer.alloc(length);
    const { bytesRead } = await fd.read(buffer, 0, length, 0);
    return buffer.subarray(0, bytesRead);
  } finally {
    await fd.close();
  }
}

function isMp3Magic(buffer) {
  if (!buffer || buffer.length < 2) return false;
  if (buffer.length >= 3 && buffer.subarray(0, 3).toString('ascii') === 'ID3') return true;
  return buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0;
}

async function main() {
  const language = getArg('language', '').trim();
  const limit = Number(getArg('limit', '0')) || 0;
  const sample = hasFlag('sample');

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

  const checks = [];

  for (const item of items) {
    const outputPath = getLocalPath(item);
    const exists = await fs.stat(outputPath).then(() => true).catch(() => false);
    if (!exists) {
      checks.push({ key: item.key, profileId: item.profileId, localPath: outputPath, exists: false, pass: false, reason: 'missing' });
      continue;
    }

    const stat = await fs.stat(outputPath);
    const sha256 = await sha256File(outputPath);
    const magic = await readMagic(outputPath, 3);
    const firstBytes = await readBytes(outputPath, 8);
    const isHtml = await fileLooksHtml(outputPath);
    const mp3Magic = isMp3Magic(firstBytes);
    const pass = stat.size > 1024 && !isHtml && mp3Magic;

    checks.push({
      key: item.key,
      profileId: item.profileId,
      localPath: outputPath,
      exists: true,
      sizeBytes: stat.size,
      sha256,
      magic,
      firstBytesHex: firstBytes.toString('hex'),
      mp3Magic,
      isHtml,
      pass,
    });
  }

  const sampleVoiceAudit = checks
    .filter((x) => x.pass && x.profileId === 'vi-v1')
    .slice(0, 3)
    .map((x) => ({ key: x.key, localPath: x.localPath }));

  const out = {
    generatedAt: nowIso(),
    language: language || 'all',
    sample,
    pass: checks.every((x) => x.pass),
    totalItems: checks.length,
    ok: checks.filter((x) => x.pass).length,
    failed: checks.filter((x) => !x.pass).length,
    voiceAuditSamples: sampleVoiceAudit,
    checks,
  };

  await writeJson(OUTPUT, out);
  console.log(JSON.stringify({ total: out.totalItems, ok: out.ok, failed: out.failed }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
