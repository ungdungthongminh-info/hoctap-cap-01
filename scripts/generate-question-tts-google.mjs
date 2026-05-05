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
const OUTPUT_REPORT = path.join(REPO_ROOT, 'question-tts-generate-report.json');
const DEFAULT_CHECKPOINT = path.join(REPO_ROOT, 'question-tts-generate-checkpoint.json');

function getArg(name, fallback = '') {
  const raw = process.argv.find((x) => x.startsWith(`--${name}=`));
  return raw ? raw.slice(name.length + 3) : fallback;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function decodeBase64Audio(content) {
  if (!content) return null;
  return Buffer.from(String(content), 'base64');
}

function getLanguageCode(profile) {
  return profile === 'en-v1' ? 'en-US' : 'vi-VN';
}

function getDefaultVoice(profile) {
  if (profile === 'en-v1') {
    return process.env.GOOGLE_TTS_VOICE_EN || 'en-US-Neural2-F';
  }
  return process.env.GOOGLE_TTS_VOICE_VI || 'vi-VN-Chirp3-HD-Despina';
}

function getLocalPath(item) {
  return resolveScratchPath('audio', 'question', String(item.localRelativePath || `${item.profileId}/question/${item.questionId}.mp3`));
}

async function hasR2Object(client, bucket, key) {
  try {
    const head = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return Number(head?.ContentLength || 0) > 0;
  } catch {
    return false;
  }
}

async function synthesizeWithApiKey({ apiKey, text, voiceName, languageCode }) {
  const endpoint = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(apiKey)}`;
  const body = {
    input: { text },
    voice: { languageCode, name: voiceName },
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
      synthesize: ({ text, voiceName, languageCode }) => synthesizeWithApiKey({ apiKey, text, voiceName, languageCode }),
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
      synthesize: async ({ text, voiceName, languageCode }) => {
        const [response] = await client.synthesizeSpeech({
          input: { text },
          voice: { languageCode, name: voiceName },
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

async function readCheckpoint(filePath) {
  const exists = await fs.stat(filePath).then(() => true).catch(() => false);
  if (!exists) {
    return { processedKeys: [] };
  }
  const parsed = JSON.parse(await fs.readFile(filePath, 'utf8'));
  return {
    processedKeys: Array.isArray(parsed.processedKeys) ? parsed.processedKeys : [],
  };
}

async function writeCheckpoint(filePath, payload) {
  await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

async function main() {
  const language = getArg('language', getArg('profile', 'vi-v1')).trim() || 'vi-v1';
  const limit = Number(getArg('limit', '0')) || 0;
  const dryRun = hasFlag('dry-run');
  const skipExisting = hasFlag('skip-existing');
  const concurrency = Math.max(1, Number(getArg('concurrency', '2')) || 2);
  const checkpointArg = getArg('checkpoint', '');
  const useCheckpoint = hasFlag('checkpoint') || Boolean(checkpointArg);
  const checkpointPath = checkpointArg || DEFAULT_CHECKPOINT;
  const explicitVoice = getArg('voice', '').trim();

  const catalog = await readJson(CATALOG);
  let scoped = (catalog.items || []).filter((x) => String(x.language || x.profileId) === language);
  if (limit > 0) {
    scoped = scoped.slice(0, limit);
  }

  const checkpointState = useCheckpoint ? await readCheckpoint(checkpointPath) : { processedKeys: [] };
  const doneKeys = new Set(checkpointState.processedKeys);

  const r2Loaded = skipExisting ? await loadR2Env() : { missing: ['disabled'], env: null };
  const r2Client = (skipExisting && r2Loaded.missing.length === 0) ? createR2Client(r2Loaded.env) : null;

  const synthesizer = dryRun ? { provider: 'dry-run', synthesize: async () => Buffer.alloc(1) } : await buildGoogleSynthesizer();
  if (!dryRun && !synthesizer) {
    const report = {
      generatedAt: nowIso(),
      language,
      status: 'skipped-no-google-credentials',
      totalItems: scoped.length,
      generated: 0,
      skipped: scoped.length,
      failed: 0,
      note: 'Set GOOGLE_TTS_API_KEY or GOOGLE_APPLICATION_CREDENTIALS before running generation.',
    };
    await writeJson(OUTPUT_REPORT, report);
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  const counters = {
    generated: 0,
    skippedLocal: 0,
    skippedR2: 0,
    skippedCheckpoint: 0,
    failed: 0,
  };
  const failures = [];
  let processed = 0;

  const queue = [...scoped];
  async function worker() {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) continue;
      processed += 1;

      if (useCheckpoint && doneKeys.has(item.key)) {
        counters.skippedCheckpoint += 1;
        continue;
      }

      const text = String(item.text || '').trim();
      if (!text) {
        counters.failed += 1;
        failures.push({ key: item.key, reason: 'empty-text' });
        continue;
      }

      const localPath = getLocalPath(item);
      await fs.mkdir(path.dirname(localPath), { recursive: true });

      if (skipExisting) {
        const hasLocal = await fs.stat(localPath).then(() => true).catch(() => false);
        if (hasLocal) {
          counters.skippedLocal += 1;
          doneKeys.add(item.key);
          continue;
        }

        if (r2Client && r2Loaded.env?.R2_BUCKET && item.r2Key) {
          const hasRemote = await hasR2Object(r2Client, r2Loaded.env.R2_BUCKET, String(item.r2Key));
          if (hasRemote) {
            counters.skippedR2 += 1;
            doneKeys.add(item.key);
            continue;
          }
        }
      }

      if (dryRun) {
        counters.generated += 1;
        doneKeys.add(item.key);
        continue;
      }

      const languageCode = getLanguageCode(language);
      const voiceName = explicitVoice || getDefaultVoice(language);

      let ok = false;
      for (let attempt = 1; attempt <= 3 && !ok; attempt += 1) {
        try {
          const buffer = await synthesizer.synthesize({
            text,
            voiceName,
            languageCode,
          });
          await fs.writeFile(localPath, buffer);
          counters.generated += 1;
          doneKeys.add(item.key);
          ok = true;
        } catch (error) {
          if (attempt === 3) {
            counters.failed += 1;
            failures.push({ key: item.key, reason: String(error?.message || error) });
          }
          await sleep(500 * attempt);
        }
      }

      if (useCheckpoint && doneKeys.size % 50 === 0) {
        await writeCheckpoint(checkpointPath, {
          updatedAt: nowIso(),
          processedKeys: Array.from(doneKeys),
        });
      }

      if (processed % 25 === 0) {
        console.log(`[progress] language=${language} processed=${processed}/${scoped.length} generated=${counters.generated} skippedLocal=${counters.skippedLocal} skippedR2=${counters.skippedR2} failed=${counters.failed}`);
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, Math.max(queue.length, 1)) }, () => worker()));

  if (useCheckpoint) {
    await writeCheckpoint(checkpointPath, {
      updatedAt: nowIso(),
      processedKeys: Array.from(doneKeys),
    });
  }

  const report = {
    generatedAt: nowIso(),
    language,
    dryRun,
    concurrency,
    skipExisting,
    checkpoint: useCheckpoint ? checkpointPath : null,
    provider: synthesizer?.provider || null,
    status: counters.failed > 0 ? 'completed-with-errors' : 'completed',
    totalItems: scoped.length,
    generated: counters.generated,
    skipped: counters.skippedCheckpoint + counters.skippedLocal + counters.skippedR2,
    skippedBreakdown: {
      checkpoint: counters.skippedCheckpoint,
      local: counters.skippedLocal,
      r2: counters.skippedR2,
    },
    failed: counters.failed,
    failures: failures.slice(0, 300),
  };

  await writeJson(OUTPUT_REPORT, report);
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
