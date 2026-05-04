import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reportPath = path.join(root, 'tts-catalog-integrity-report.json');
const catalogPath = path.join(root, 'backend', 'data', 'tts', 'catalog.json');
const outPath = path.join(root, 'tts-missing-audio-breakdown.json');

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const missingEntries = (catalog.entries || []).filter((entry) => !entry.available);

const byGrade = {};
for (const grade of ['0', '1', '2', '3', '4', '5']) {
  const gradeInfo = report.grades?.[grade] || {};
  const lessonCards = Array.isArray(gradeInfo.lessonCards?.missingAudio) ? gradeInfo.lessonCards.missingAudio.length : 0;
  const questions = Array.isArray(gradeInfo.questions?.missingAudio) ? gradeInfo.questions.missingAudio.length : 0;
  let feedback = 0;
  let other = 0;

  for (const item of missingEntries) {
    const key = String(item.key || '');
    const inferredGrade = (() => {
      if (key.startsWith('pregrade-') || key.startsWith('feedback:')) return '0';
      return null;
    })();
    if (inferredGrade !== grade) continue;
    if (item.kind === 'feedback') feedback += 1;
    else other += 1;
  }

  byGrade[grade] = { lessonCards, questions, feedback, other };
}

const byVoice = {};
for (const item of missingEntries) {
  const voice = String(item.profileId || 'unknown');
  byVoice[voice] = (byVoice[voice] || 0) + 1;
}

const topMissingExamples = missingEntries.slice(0, 100).map((item) => ({
  key: item.key,
  kind: item.kind,
  profileId: item.profileId,
  assetPath: item.assetPath,
}));

const output = {
  totalMissing: Number(report.summary?.missingCount || missingEntries.length || 0),
  byGrade,
  byVoice,
  topMissingExamples,
};

fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
console.log(`Wrote ${outPath}`);
