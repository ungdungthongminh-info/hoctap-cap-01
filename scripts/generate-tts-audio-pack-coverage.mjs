import fs from 'node:fs';
import path from 'node:path';
import { seedLessonCards, seedLessons, seedQuestions } from '../src/data/seedData.ts';

const root = process.cwd();
const assetDir = path.join(root, 'public', 'audio', 'tts', 'assets', 'vi-v1');
const manifestPath = path.join(root, 'public', 'audio', 'tts', 'manifest.json');
const outPath = path.join(root, 'tts-audio-pack-coverage-report.json');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const manifestEntries = manifest.entries || {};
const manifestKeys = Object.keys(manifestEntries);
const mp3Files = fs.existsSync(assetDir) ? fs.readdirSync(assetDir).filter((name) => name.endsWith('.mp3')) : [];
const fileSet = new Set(mp3Files);

const lessonsById = new Map(seedLessons.map((lesson) => [Number(lesson.id), Number(lesson.grade)]));
const cardGradeById = new Map(seedLessonCards.map((card) => [Number(card.id), lessonsById.get(Number(card.lessonId))]));
const questionGradeById = new Map(seedQuestions.map((question) => [Number(question.id), Number(question.grade)]));

const perGrade = {
  '0': { manifestKeys: 0, mp3Files: 0 },
  '1': { manifestKeys: 0, mp3Files: 0 },
  '2': { manifestKeys: 0, mp3Files: 0 },
  '3': { manifestKeys: 0, mp3Files: 0 },
  '4': { manifestKeys: 0, mp3Files: 0 },
  '5': { manifestKeys: 0, mp3Files: 0 },
};

const keysPointingToMissingFiles = [];
const orphanFiles = [];
const crossGradeKeys = [];

for (const key of manifestKeys) {
  const entry = manifestEntries[key];
  const assetPath = String(entry?.assetPath || '');
  const fileName = path.basename(assetPath);
  if (!fileSet.has(fileName)) {
    keysPointingToMissingFiles.push({ key, assetPath });
  }

  let grade = null;
  if (key.startsWith('lesson-card:')) {
    const id = Number(key.split(':')[1]);
    grade = cardGradeById.get(id);
  } else if (key.startsWith('question:')) {
    const id = Number(key.split(':')[1]);
    grade = questionGradeById.get(id);
  } else if (key.startsWith('pregrade:') || key.startsWith('feedback:')) {
    grade = 0;
  }

  if (Number.isInteger(grade) && perGrade[String(grade)]) {
    perGrade[String(grade)].manifestKeys += 1;
  }

  if (Number.isInteger(grade) && assetPath.includes('vi-v1')) {
    const baseName = path.basename(assetPath, '.mp3');
    if (key.startsWith('lesson-card:') && !baseName.endsWith(`lesson-card-${key.split(':')[1]}`)) {
      crossGradeKeys.push({ key, assetPath, reason: 'file-name-mismatch' });
    }
    if (key.startsWith('question:') && !baseName.endsWith(`question-${key.split(':')[1]}`)) {
      crossGradeKeys.push({ key, assetPath, reason: 'file-name-mismatch' });
    }
  }
}

for (const fileName of mp3Files) {
  const referenced = manifestKeys.some((key) => path.basename(String(manifestEntries[key]?.assetPath || '')) === fileName);
  if (!referenced) {
    orphanFiles.push(fileName);
  }

  const lessonMatch = fileName.match(/^lesson-card-(\d+)\.mp3$/);
  const questionMatch = fileName.match(/^question-(\d+)\.mp3$/);
  let grade = null;
  if (lessonMatch) grade = cardGradeById.get(Number(lessonMatch[1]));
  if (questionMatch) grade = questionGradeById.get(Number(questionMatch[1]));
  if (fileName.startsWith('feedback-') || fileName.startsWith('pregrade-')) grade = 0;
  if (Number.isInteger(grade) && perGrade[String(grade)]) {
    perGrade[String(grade)].mp3Files += 1;
  }
}

const output = {
  assetDir,
  totalMp3Files: mp3Files.length,
  manifestKeyCount: manifestKeys.length,
  byGrade: perGrade,
  keysPointingToMissingFiles,
  orphanFiles,
  crossGradeKeys,
};

fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
console.log(`Wrote ${outPath}`);
