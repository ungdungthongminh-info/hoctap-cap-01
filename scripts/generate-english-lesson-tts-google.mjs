import path from 'node:path';
import fs from 'node:fs/promises';
import {
  REPO_ROOT,
  nowIso,
  readJson,
  resolveScratchPath,
  writeJson,
} from './r2-common.mjs';

const INPUT_CATALOG = path.join(REPO_ROOT, 'english-lesson-tts-catalog.json');
const PLAN_JSON = path.join(REPO_ROOT, 'english-lesson-tts-generate-plan.json');
const PLAN_MD = path.join(REPO_ROOT, 'english-lesson-tts-generate-plan.md');
const REPORT_JSON = path.join(REPO_ROOT, 'english-lesson-tts-generate-report.json');
const REPORT_MD = path.join(REPO_ROOT, 'english-lesson-tts-generate-report.md');

const OUTPUT_DIR_DEFAULT = resolveScratchPath('en-v1', 'lesson-card');
const PROFILE_ID = 'en-v1';
const SUBJECT_CODE = 'english';
const EXPECTED_TOTAL = 700;
const DEFAULT_PRICE_PER_MILLION_CHARS = 16;
const VOICE_CANDIDATES = [
  'en-US-Neural2-F',
  'en-US-Neural2-J',
  'en-US-Neural2-A',
];

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function getArg(name, fallback = '') {
  const raw = process.argv.find((x) => x.startsWith(`--${name}=`));
  return raw ? raw.slice(name.length + 3) : fallback;
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function decodeBase64Audio(content) {
  if (!content) return null;
  return Buffer.from(String(content), 'base64');
}

function toMdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function truncate(value, max = 120) {
  const text = String(value ?? '');
  if (text.length <= max) return text;
  return `${text.slice(0, Math.max(0, max - 3))}...`;
}

function sortByCardId(a, b) {
  return Number(a.cardId) - Number(b.cardId);
}

async function synthesizeWithApiKey({ apiKey, text, voiceName }) {
  const endpoint = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(apiKey)}`;
  const body = {
    input: { text },
    voice: { languageCode: 'en-US', name: voiceName },
    audioConfig: { audioEncoding: 'MP3' },
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const textBody = await response.text();
    throw new Error(`google-tts-http-${response.status}: ${textBody.slice(0, 240)}`);
  }

  const json = await response.json();
  const audioBuffer = decodeBase64Audio(json.audioContent);
  if (!audioBuffer || audioBuffer.length === 0) {
    throw new Error('empty-audio-content');
  }
  return audioBuffer;
}

async function buildGoogleSynthesizer() {
  const apiKey = String(process.env.GOOGLE_TTS_API_KEY || '').trim();
  if (apiKey) {
    return {
      provider: 'google-rest-api-key',
      synthesize: ({ text, voiceName }) => synthesizeWithApiKey({ apiKey, text, voiceName }),
    };
  }

  let textToSpeech;
  try {
    const mod = await import('@google-cloud/text-to-speech');
    textToSpeech = mod;
  } catch {
    return null;
  }

  try {
    const client = new textToSpeech.TextToSpeechClient();
    return {
      provider: 'google-cloud-client',
      synthesize: async ({ text, voiceName }) => {
        const [response] = await client.synthesizeSpeech({
          input: { text },
          voice: { languageCode: 'en-US', name: voiceName },
          audioConfig: { audioEncoding: 'MP3' },
        });
        if (!response.audioContent) {
          throw new Error('empty-audio-content');
        }
        return Buffer.isBuffer(response.audioContent)
          ? response.audioContent
          : Buffer.from(response.audioContent, 'binary');
      },
    };
  } catch {
    return null;
  }
}

function buildMarkdownPlan(plan) {
  const lines = [];
  lines.push('# English Lesson TTS Generate Plan (Dry Run)');
  lines.push('');
  lines.push(`- Generated at: ${plan.generatedAt}`);
  lines.push(`- Catalog: ${plan.catalogPath}`);
  lines.push(`- profile: ${plan.profile}`);
  lines.push(`- subject: ${plan.subject}`);
  lines.push(`- expectedTotal: ${plan.expectedTotal}`);
  lines.push(`- outputDir: ${plan.outputDir}`);
  lines.push('');
  lines.push('## Metrics');
  lines.push('');
  lines.push(`- expectedTotal: ${plan.expectedTotal}`);
  lines.push(`- catalogTotal: ${plan.catalogTotal}`);
  lines.push(`- alreadyLocal: ${plan.alreadyLocal}`);
  lines.push(`- toGenerate: ${plan.toGenerate}`);
  lines.push(`- missingText: ${plan.missingText}`);
  lines.push(`- duplicateCardId: ${plan.duplicateCardId}`);
  lines.push(`- estimatedCost: ${plan.estimatedCostUsd == null ? 'n/a' : `$${plan.estimatedCostUsd}`}`);
  lines.push(`- voice (selected): ${plan.voice.selected || 'pending-owner-approval'}`);
  lines.push(`- voice (candidates): ${plan.voice.candidates.join(', ')}`);
  lines.push('');
  lines.push('## Sample 10');
  lines.push('');
  lines.push('| cardId | lessonId | lessonTitle | text | outputPath | existsLocal |');
  lines.push('|---:|---:|---|---|---|---|');
  for (const item of plan.sample10) {
    lines.push(`| ${item.cardId} | ${item.lessonId} | ${toMdCell(item.lessonTitle)} | ${toMdCell(truncate(item.text, 100))} | ${toMdCell(item.outputPath)} | ${item.existsLocal ? 'yes' : 'no'} |`);
  }

  return `${lines.join('\n')}\n`;
}

function buildMarkdownReport(report) {
  const lines = [];
  lines.push('# English Lesson TTS Generate Report');
  lines.push('');
  lines.push(`- Generated at: ${report.generatedAt}`);
  lines.push(`- status: ${report.status}`);
  lines.push(`- provider: ${report.provider || 'n/a'}`);
  lines.push(`- profile: ${report.profile}`);
  lines.push(`- voice: ${report.voice}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- expectedTotal: ${report.expectedTotal}`);
  lines.push(`- generated: ${report.generated}`);
  lines.push(`- alreadyLocal: ${report.alreadyLocal}`);
  lines.push(`- missingText: ${report.missingText}`);
  lines.push(`- failed: ${report.failed}`);
  lines.push('');
  if ((report.failures || []).length > 0) {
    lines.push('## Failure Samples');
    lines.push('');
    lines.push('| cardId | reason |');
    lines.push('|---:|---|');
    for (const item of report.failures.slice(0, 20)) {
      lines.push(`| ${item.cardId} | ${toMdCell(item.reason)} |`);
    }
  }

  return `${lines.join('\n')}\n`;
}

async function fileSize(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return Number(stat.size || 0);
  } catch {
    return 0;
  }
}

async function loadPlanData({ catalogPath, outputDir }) {
  const catalog = await readJson(catalogPath);
  const items = Array.isArray(catalog.items) ? catalog.items : [];

  const scoped = items
    .filter((item) => String(item.profile) === PROFILE_ID)
    .filter((item) => String(item.subject) === SUBJECT_CODE)
    .filter((item) => /^audio\/tts\/assets\/en-v1\/lesson-card-(\d+)\.mp3$/i.test(String(item.expectedObjectKey || '')))
    .map((item) => {
      const match = String(item.expectedObjectKey).match(/lesson-card-(\d+)\.mp3$/i);
      const cardId = Number(match?.[1] || item.cardId || 0);
      const outputPath = path.join(outputDir, `lesson-card-${cardId}.mp3`);
      return {
        cardId,
        lessonId: Number(item.lessonId || 0),
        lessonTitle: String(item.lessonTitle || ''),
        text: normalizeText(item.text),
        expectedObjectKey: String(item.expectedObjectKey || ''),
        expectedR2Url: String(item.expectedR2Url || ''),
        outputPath,
      };
    })
    .sort(sortByCardId);

  const cardIdSet = new Set();
  let duplicateCardId = 0;
  for (const item of scoped) {
    if (cardIdSet.has(item.cardId)) duplicateCardId += 1;
    cardIdSet.add(item.cardId);
  }

  let missingText = 0;
  let alreadyLocal = 0;
  const withState = [];
  for (const item of scoped) {
    const size = await fileSize(item.outputPath);
    const existsLocal = size > 0;
    const textMissing = item.text.length === 0;
    if (textMissing) missingText += 1;
    if (existsLocal) alreadyLocal += 1;
    withState.push({
      ...item,
      existsLocal,
      size,
      textMissing,
      shouldGenerate: !existsLocal && !textMissing,
    });
  }

  const toGenerate = withState.filter((item) => item.shouldGenerate).length;
  const totalCharsToGenerate = withState
    .filter((item) => item.shouldGenerate)
    .reduce((sum, item) => sum + item.text.length, 0);

  const pricePerMillionChars = Number(process.env.GOOGLE_TTS_PRICE_PER_MILLION_CHARS || DEFAULT_PRICE_PER_MILLION_CHARS);
  const estimatedCostUsd = Number.isFinite(pricePerMillionChars)
    ? Number(((totalCharsToGenerate / 1000000) * pricePerMillionChars).toFixed(4))
    : null;

  return {
    catalogTotal: scoped.length,
    expectedTotal: EXPECTED_TOTAL,
    outputDir,
    duplicateCardId,
    missingText,
    alreadyLocal,
    toGenerate,
    totalCharsToGenerate,
    estimatedCostUsd,
    items: withState,
  };
}

async function runDryPlan({ catalogPath, outputDir, selectedVoice }) {
  const planData = await loadPlanData({ catalogPath, outputDir });
  const plan = {
    generatedAt: nowIso(),
    mode: 'dry-run',
    catalogPath,
    profile: PROFILE_ID,
    subject: SUBJECT_CODE,
    expectedTotal: planData.expectedTotal,
    catalogTotal: planData.catalogTotal,
    alreadyLocal: planData.alreadyLocal,
    toGenerate: planData.toGenerate,
    missingText: planData.missingText,
    duplicateCardId: planData.duplicateCardId,
    outputDir: planData.outputDir,
    estimatedCostUsd: planData.estimatedCostUsd,
    voice: {
      selected: selectedVoice || null,
      candidates: VOICE_CANDIDATES,
    },
    sample10: planData.items.slice(0, 10).map((item) => ({
      cardId: item.cardId,
      lessonId: item.lessonId,
      lessonTitle: item.lessonTitle,
      text: item.text,
      outputPath: item.outputPath,
      existsLocal: item.existsLocal,
    })),
  };

  await writeJson(PLAN_JSON, plan);
  await fs.writeFile(PLAN_MD, buildMarkdownPlan(plan), 'utf8');

  console.log(JSON.stringify({
    planJson: PLAN_JSON,
    planMarkdown: PLAN_MD,
    expectedTotal: plan.expectedTotal,
    catalogTotal: plan.catalogTotal,
    alreadyLocal: plan.alreadyLocal,
    toGenerate: plan.toGenerate,
    missingText: plan.missingText,
    duplicateCardId: plan.duplicateCardId,
    outputDir: plan.outputDir,
    estimatedCostUsd: plan.estimatedCostUsd,
    voiceSelected: plan.voice.selected,
    voiceCandidates: plan.voice.candidates,
  }, null, 2));

  return planData;
}

async function runApply({ catalogPath, outputDir, selectedVoice }) {
  const planData = await loadPlanData({ catalogPath, outputDir });
  const scoped = planData.items.filter((item) => item.shouldGenerate);

  const synthesizer = await buildGoogleSynthesizer();
  if (!synthesizer) {
    throw new Error('Google TTS credentials are not configured. Set GOOGLE_TTS_API_KEY or GOOGLE_APPLICATION_CREDENTIALS.');
  }

  await fs.mkdir(outputDir, { recursive: true });

  const report = {
    generatedAt: nowIso(),
    mode: 'apply',
    status: 'completed',
    provider: synthesizer.provider,
    profile: PROFILE_ID,
    subject: SUBJECT_CODE,
    voice: selectedVoice,
    outputDir,
    expectedTotal: planData.expectedTotal,
    catalogTotal: planData.catalogTotal,
    generated: 0,
    alreadyLocal: planData.alreadyLocal,
    missingText: planData.missingText,
    duplicateCardId: planData.duplicateCardId,
    failed: 0,
    failures: [],
  };

  for (const item of scoped) {
    let ok = false;
    for (let attempt = 1; attempt <= 3 && !ok; attempt += 1) {
      try {
        const audio = await synthesizer.synthesize({ text: item.text, voiceName: selectedVoice });
        await fs.writeFile(item.outputPath, audio);
        const size = await fileSize(item.outputPath);
        if (size <= 0) {
          throw new Error('generated-file-empty');
        }
        report.generated += 1;
        ok = true;
      } catch (error) {
        if (attempt === 3) {
          report.failed += 1;
          report.failures.push({ cardId: item.cardId, reason: String(error?.message || error) });
        }
        await sleep(500 * attempt);
      }
    }
  }

  if (report.failed > 0) {
    report.status = 'completed-with-errors';
  }

  await writeJson(REPORT_JSON, report);
  await fs.writeFile(REPORT_MD, buildMarkdownReport(report), 'utf8');

  console.log(JSON.stringify({
    reportJson: REPORT_JSON,
    reportMarkdown: REPORT_MD,
    status: report.status,
    provider: report.provider,
    voice: report.voice,
    generated: report.generated,
    alreadyLocal: report.alreadyLocal,
    missingText: report.missingText,
    failed: report.failed,
  }, null, 2));
}

async function main() {
  const apply = hasFlag('apply');
  const dryRun = hasFlag('dry-run') || !apply;
  const catalogPath = getArg('catalog', INPUT_CATALOG);
  const outputDir = getArg('output-dir', OUTPUT_DIR_DEFAULT);
  const selectedVoice = getArg('voice', String(process.env.GOOGLE_TTS_VOICE_EN || '').trim());

  if (dryRun) {
    await runDryPlan({ catalogPath, outputDir, selectedVoice });
    return;
  }

  if (!selectedVoice) {
    const message = [
      'Missing --voice for --apply mode.',
      `Please choose one English voice and rerun, for example: ${VOICE_CANDIDATES.join(', ')}`,
    ].join(' ');
    throw new Error(message);
  }

  await runApply({ catalogPath, outputDir, selectedVoice });
}

main().catch((error) => {
  console.error(String(error?.message || error));
  process.exitCode = 1;
});
