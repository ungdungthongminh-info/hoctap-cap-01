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
  probePublicUrl,
  readJson,
  sha256File,
  uploadFileToR2,
  writeJson,
} from './r2-common.mjs';

const INPUT_CATALOG = path.join(REPO_ROOT, 'english-lesson-tts-catalog.json');
const GENERATE_REPORT = path.join(REPO_ROOT, 'english-lesson-tts-generate-report.json');
const OUTPUT_JSON = path.join(REPO_ROOT, 'english-lesson-tts-r2-upload-report.json');
const OUTPUT_MD = path.join(REPO_ROOT, 'english-lesson-tts-r2-upload-report.md');
const OUTPUT_DIR = 'F:\\1_A_Disk_D\\Khương Bình\\hhk-tts-audio\\en-v1\\lesson-card';
const PROFILE_ID = 'en-v1';
const SUBJECT_CODE = 'english';
const SAMPLE_SIZE = 20;

function sampleItems(items, count) {
  if (items.length <= count) return [...items];
  const step = items.length / count;
  const picked = [];
  for (let i = 0; i < count; i += 1) {
    picked.push(items[Math.min(items.length - 1, Math.floor(i * step))]);
  }
  return picked;
}

function toMdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function buildMarkdown(report) {
  const lines = [];
  lines.push('# English Lesson TTS R2 Upload Report');
  lines.push('');
  lines.push(`- Generated at: ${report.generatedAt}`);
  lines.push(`- profile: ${report.profile}`);
  lines.push(`- subject: ${report.subject}`);
  lines.push(`- outputDir: ${report.outputDir}`);
  lines.push('');
  lines.push('## Upload Summary');
  lines.push('');
  lines.push(`- totalItems: ${report.totalItems}`);
  lines.push(`- uploaded: ${report.uploaded}`);
  lines.push(`- skippedMatched: ${report.skippedMatched}`);
  lines.push(`- missingLocal: ${report.missingLocal}`);
  lines.push(`- probeSampleCount: ${report.probeSampleCount}`);
  lines.push('');
  lines.push('## Probe Sample');
  lines.push('');
  lines.push('| cardId | status | contentType | isHtml | url |');
  lines.push('|---:|---:|---|---|---|');
  for (const item of report.probeSamples) {
    lines.push(`| ${item.cardId} | ${item.status} | ${toMdCell(item.contentType)} | ${item.isHtml ? 'yes' : 'no'} | ${toMdCell(item.url)} |`);
  }
  return `${lines.join('\n')}\n`;
}

async function localFileInfo(filePath) {
  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile() || Number(stat.size || 0) <= 0) {
      return null;
    }
    return {
      size: Number(stat.size || 0),
      sha256: await sha256File(filePath),
    };
  } catch {
    return null;
  }
}

async function main() {
  ensureNoSecretOrAudioStaged();

  const generateReport = await readJson(GENERATE_REPORT);
  if (String(generateReport.status) !== 'completed' || Number(generateReport.generated || 0) !== 700) {
    throw new Error('Local generation report is not in completed 700/700 state. Upload aborted.');
  }

  const { env, missing } = await loadR2Env();
  if (missing.length) {
    throw new Error(`Missing R2 env keys: ${missing.join(', ')}`);
  }

  const catalog = await readJson(INPUT_CATALOG);
  const items = (catalog.items || [])
    .filter((item) => String(item.profile) === PROFILE_ID)
    .filter((item) => String(item.subject) === SUBJECT_CODE)
    .map((item) => {
      const cardId = Number(item.cardId || 0);
      const localPath = path.join(OUTPUT_DIR, `lesson-card-${cardId}.mp3`);
      return {
        cardId,
        lessonId: Number(item.lessonId || 0),
        expectedObjectKey: String(item.expectedObjectKey || ''),
        expectedR2Url: String(item.expectedR2Url || ''),
        localPath,
      };
    });

  const client = createR2Client(env);
  let uploaded = 0;
  let skippedMatched = 0;
  let missingLocal = 0;

  for (const item of items) {
    const info = await localFileInfo(item.localPath);
    if (!info) {
      missingLocal += 1;
      continue;
    }

    const existing = await headR2Object({ client, bucket: env.R2_BUCKET, key: item.expectedObjectKey });
    if (existing && Number(existing.ContentLength || 0) === info.size && String(existing.Metadata?.sha256 || '') === info.sha256) {
      skippedMatched += 1;
      continue;
    }

    await uploadFileToR2({
      client,
      bucket: env.R2_BUCKET,
      key: item.expectedObjectKey,
      filePath: item.localPath,
      contentType: 'audio/mpeg',
      metadata: {
        sha256: info.sha256,
        size: String(info.size),
        profile: PROFILE_ID,
        source: 'english-lesson-tts',
      },
    });

    uploaded += 1;
  }

  const probeTargets = sampleItems(items, SAMPLE_SIZE);
  const probeSamples = [];
  for (const item of probeTargets) {
    const url = buildR2PublicUrl(env.R2_PUBLIC_BASE_URL, item.expectedObjectKey);
    const probe = await probePublicUrl(url);
    probeSamples.push({
      cardId: item.cardId,
      url,
      status: Number(probe.status || 0),
      contentType: String(probe.contentType || ''),
      isHtml: Boolean(probe.isHtml),
      magic: String(probe.magic || ''),
    });
  }

  const invalidProbes = probeSamples.filter((item) => ![200, 206].includes(item.status)
    || item.contentType.toLowerCase() !== 'audio/mpeg'
    || item.isHtml
    || item.contentType.toLowerCase().includes('text/plain')
    || item.url.toLowerCase().includes('drive.google'));

  const report = {
    generatedAt: nowIso(),
    profile: PROFILE_ID,
    subject: SUBJECT_CODE,
    outputDir: OUTPUT_DIR,
    totalItems: items.length,
    uploaded,
    skippedMatched,
    missingLocal,
    probeSampleCount: probeSamples.length,
    probeSamples,
    pass: missingLocal === 0 && invalidProbes.length === 0,
    invalidProbeCount: invalidProbes.length,
  };

  await writeJson(OUTPUT_JSON, report);
  await fs.writeFile(OUTPUT_MD, buildMarkdown(report), 'utf8');

  console.log(JSON.stringify({
    outputJson: OUTPUT_JSON,
    outputMarkdown: OUTPUT_MD,
    totalItems: report.totalItems,
    uploaded,
    skippedMatched,
    missingLocal,
    probeSampleCount: report.probeSampleCount,
    invalidProbeCount: report.invalidProbeCount,
    pass: report.pass,
  }, null, 2));
}

main().catch((error) => {
  console.error(String(error?.message || error));
  process.exitCode = 1;
});
