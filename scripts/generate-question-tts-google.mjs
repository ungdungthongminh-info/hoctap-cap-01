import path from 'node:path';
import fs from 'node:fs/promises';
import { REPO_ROOT, nowIso, readJson, resolveScratchPath, writeJson } from './r2-common.mjs';

const CATALOG = path.join(REPO_ROOT, 'tts-question-generation-catalog.json');
const OUTPUT_REPORT = path.join(REPO_ROOT, 'tts-question-generation-report.json');

function getArg(name, fallback = '') {
  const raw = process.argv.find((x) => x.startsWith(`--${name}=`));
  return raw ? raw.slice(name.length + 3) : fallback;
}

function hasGoogleEnv() {
  const required = [
    'GOOGLE_APPLICATION_CREDENTIALS',
    'GOOGLE_CLOUD_PROJECT',
    'GOOGLE_TTS_VOICE_VI',
    'GOOGLE_TTS_AUDIO_ENCODING',
  ];
  return required.every((k) => String(process.env[k] || '').trim());
}

async function main() {
  const profile = getArg('profile', 'vi-v1');
  const catalog = await readJson(CATALOG);
  const scoped = (catalog.items || []).filter((x) => String(x.profileId) === profile);

  if (!hasGoogleEnv()) {
    const report = {
      generatedAt: nowIso(),
      profile,
      status: 'skipped-no-google-credentials',
      totalItems: scoped.length,
      generated: 0,
      skipped: scoped.length,
      failed: 0,
      note: 'Set GOOGLE_APPLICATION_CREDENTIALS, GOOGLE_CLOUD_PROJECT, GOOGLE_TTS_* before running real generation.',
    };
    await writeJson(OUTPUT_REPORT, report);
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  let textToSpeech;
  try {
    const mod = await import('@google-cloud/text-to-speech');
    textToSpeech = mod;
  } catch {
    const report = {
      generatedAt: nowIso(),
      profile,
      status: 'skipped-missing-google-tts-package',
      totalItems: scoped.length,
      generated: 0,
      skipped: scoped.length,
      failed: 0,
      note: 'Install @google-cloud/text-to-speech in root or run generation from backend package.',
    };
    await writeJson(OUTPUT_REPORT, report);
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  const client = new textToSpeech.TextToSpeechClient();
  const voiceName = profile === 'vi-v1'
    ? process.env.GOOGLE_TTS_VOICE_VI
    : process.env.GOOGLE_TTS_VOICE_EN;

  let generated = 0;
  let skipped = 0;
  let failed = 0;
  const failures = [];

  for (let i = 0; i < scoped.length; i += 1) {
    const item = scoped[i];
    const outputDir = resolveScratchPath('question', String(item.outputProfileDir || profile));
    await fs.mkdir(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, String(item.localFileName || `${String(item.key).replace(':', '-')}.mp3`));

    const exists = await fs.stat(outputPath).then(() => true).catch(() => false);
    if (exists) {
      skipped += 1;
      continue;
    }

    const text = String(item.text || '').trim();
    if (!text) {
      failed += 1;
      failures.push({ key: item.key, reason: 'empty-text' });
      continue;
    }

    let ok = false;
    for (let attempt = 1; attempt <= 3 && !ok; attempt += 1) {
      try {
        const [response] = await client.synthesizeSpeech({
          input: { text },
          voice: {
            languageCode: String(item.lang || (profile === 'en-v1' ? 'en-US' : 'vi-VN')),
            name: String(voiceName || item.voiceId || ''),
          },
          audioConfig: { audioEncoding: 'MP3' },
        });
        if (!response.audioContent) throw new Error('empty-audio-content');
        await fs.writeFile(outputPath, response.audioContent, 'binary');
        generated += 1;
        ok = true;
      } catch (error) {
        if (attempt === 3) {
          failed += 1;
          failures.push({ key: item.key, reason: String(error?.message || error) });
        }
        await new Promise((r) => setTimeout(r, 500 * attempt));
      }
    }

    if ((i + 1) % 100 === 0) {
      console.log(`[progress] profile=${profile} processed=${i + 1}/${scoped.length} generated=${generated} skipped=${skipped} failed=${failed}`);
    }
  }

  const report = {
    generatedAt: nowIso(),
    profile,
    status: failed > 0 ? 'completed-with-errors' : 'completed',
    totalItems: scoped.length,
    generated,
    skipped,
    failed,
    failures: failures.slice(0, 200),
  };

  await writeJson(OUTPUT_REPORT, report);
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
