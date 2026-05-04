import path from 'node:path';
import { REPO_ROOT, nowIso, readJson, writeJson } from './r2-common.mjs';

const CATALOG = path.join(REPO_ROOT, 'tts-question-generation-catalog.json');
const OUTPUT = path.join(REPO_ROOT, 'tts-question-generation-cost-estimate.json');

const COST_PER_1M_CHARS = {
  'vi-v1': 16,
  'en-v1': 16,
};

async function main() {
  const catalog = await readJson(CATALOG);
  const items = catalog.items || [];
  const missingBreakdownPath = path.join(REPO_ROOT, 'tts-missing-audio-by-content-type.json');
  const missingBreakdown = await readJson(missingBreakdownPath).catch(() => null);

  const byProfile = {};
  const byGrade = {};
  const bySubject = {};

  for (const item of items) {
    const chars = Number(item.estimatedCharacters || 0);
    const profile = String(item.profileId || 'unknown');
    const grade = String(item.grade ?? 'unknown');
    const subject = String(item.subjectCode || 'unknown');

    byProfile[profile] = byProfile[profile] || { totalItems: 0, totalCharacters: 0, estimatedCostUsd: 0 };
    byProfile[profile].totalItems += 1;
    byProfile[profile].totalCharacters += chars;

    if (subject !== 'unknown') {
      bySubject[subject] = bySubject[subject] || { totalItems: 0, totalCharacters: 0 };
      bySubject[subject].totalItems += 1;
      bySubject[subject].totalCharacters += chars;
    }

    if (grade !== 'unknown') {
      byGrade[grade] = byGrade[grade] || { totalItems: 0, totalCharacters: 0 };
      byGrade[grade].totalItems += 1;
      byGrade[grade].totalCharacters += chars;
    }
  }

  if (Object.keys(byGrade).length <= 3 && missingBreakdown?.byGrade) {
    Object.keys(byGrade).forEach((k) => delete byGrade[k]);
    const avgChars = Math.round((items.reduce((sum, x) => sum + Number(x.estimatedCharacters || 0), 0) || 0) / Math.max(items.length, 1));
    for (const [grade, stat] of Object.entries(missingBreakdown.byGrade)) {
      const count = Number((stat || {}).question || 0);
      if (!count) continue;
      byGrade[grade] = {
        totalItems: count,
        totalCharacters: count * avgChars,
      };
    }
  }

  if (Object.keys(bySubject).length === 0 && missingBreakdown?.bySubject) {
    const avgChars = Math.round((items.reduce((sum, x) => sum + Number(x.estimatedCharacters || 0), 0) || 0) / Math.max(items.length, 1));
    for (const [subject, stat] of Object.entries(missingBreakdown.bySubject)) {
      const count = Number((stat?.byVoice?.['vi-v1'] || 0) + (stat?.byVoice?.['en-v1'] || 0));
      if (!count) continue;
      bySubject[subject] = {
        totalItems: count,
        totalCharacters: count * avgChars,
      };
    }
  }

  for (const [profile, stat] of Object.entries(byProfile)) {
    const unit = COST_PER_1M_CHARS[profile] ?? 16;
    stat.estimatedCostUsd = Number(((stat.totalCharacters / 1000000) * unit).toFixed(4));
  }

  const totalCharacters = items.reduce((sum, x) => sum + Number(x.estimatedCharacters || 0), 0);
  const estimatedCostUsd = Number(Object.values(byProfile).reduce((sum, x) => sum + Number(x.estimatedCostUsd || 0), 0).toFixed(4));

  const out = {
    generatedAt: nowIso(),
    assumptions: {
      costPer1mCharsUsd: COST_PER_1M_CHARS,
      note: 'Estimate only. Real billing depends on Google Cloud SKU, voice type, and region.',
    },
    totalItems: items.length,
    totalCharacters,
    estimatedCostUsd,
    byProfile,
    byGrade,
    bySubject,
  };

  await writeJson(OUTPUT, out);
  console.log(JSON.stringify({ totalItems: out.totalItems, totalCharacters, estimatedCostUsd }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
