import path from 'node:path';
import { REPO_ROOT, loadR2Env, nowIso, probePublicUrl, writeJson } from './r2-common.mjs';

const OUTPUT = path.join(REPO_ROOT, 'r2-lesson-card-mvp-asset-check.json');
const MIN_AUDIO_BYTES = 12 * 1024;
const GRADE_SAMPLES = [
  { grade: 0, key: 'lesson-card:99001', fileName: 'lesson-card-99001.mp3' },
  { grade: 1, key: 'lesson-card:1', fileName: 'lesson-card-1.mp3' },
  { grade: 2, key: 'lesson-card:81', fileName: 'lesson-card-81.mp3' },
  { grade: 3, key: 'lesson-card:881', fileName: 'lesson-card-881.mp3' },
  { grade: 4, key: 'lesson-card:961', fileName: 'lesson-card-961.mp3' },
  { grade: 5, key: 'lesson-card:1041', fileName: 'lesson-card-1041.mp3' },
];

async function main() {
  const { env, missing } = await loadR2Env();
  if (missing.length) throw new Error(`Missing R2 env keys: ${missing.join(', ')}`);

  const base = String(env.R2_PUBLIC_BASE_URL).replace(/\/+$/, '');
  const items = [];

  for (const sample of GRADE_SAMPLES) {
    const url = `${base}/audio/tts/assets/vi-v1/${sample.fileName}`;
    const probe = await probePublicUrl(url);
    const isAudio = probe.contentType.toLowerCase().startsWith('audio/');
    const largeEnough = Number(probe.contentLength || 0) >= MIN_AUDIO_BYTES;
    items.push({
      ...sample,
      publicUrl: url,
      httpStatus: probe.status,
      contentType: probe.contentType,
      contentLength: probe.contentLength,
      isHtml: probe.isHtml,
      magic: probe.magic,
      playApiStatus: 'not-executed-in-node',
      pass: probe.status === 200 && isAudio && largeEnough && !probe.isHtml,
    });
  }

  const report = {
    generatedAt: nowIso(),
    pass: items.every((x) => x.pass),
    checks: items,
  };

  await writeJson(OUTPUT, report);
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
