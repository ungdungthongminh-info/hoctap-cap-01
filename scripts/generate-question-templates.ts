import fs from 'fs';
import path from 'path';
import { seedLessons, seedQuestions, type Question } from '../src/data/seedData';

const minQuestions = Number(process.env.MIN_QUESTIONS_PER_LESSON || 8);
const perFile = Number(process.env.TEMPLATE_CHUNK_SIZE || 100);

const qByLesson = new Map<number, Question[]>();
for (const q of seedQuestions) {
  const arr = qByLesson.get(q.lessonId) || [];
  arr.push(q);
  qByLesson.set(q.lessonId, arr);
}

const templates: Array<Record<string, unknown>> = [];

for (const lesson of seedLessons) {
  const existing = qByLesson.get(lesson.id) || [];
  const missing = Math.max(0, minQuestions - existing.length);
  if (missing <= 0) continue;

  const preferredType = existing[0]?.questionType || 'single_choice';
  const preferredDifficulty = existing[0]?.difficulty || 'easy';
  const preferredSkill = existing[0]?.skillTag || `${lesson.subjectCode}_core`;

  for (let i = 0; i < missing; i++) {
    templates.push({
      lessonId: lesson.id,
      grade: lesson.grade,
      subjectCode: lesson.subjectCode,
      lessonTitle: lesson.title,
      templateIndex: i + 1,
      questionType: preferredType,
      difficulty: preferredDifficulty,
      skillTag: preferredSkill,
      questionText: `TODO: Viết câu hỏi cho bài ${lesson.title} (${i + 1}/${missing})`,
      options: preferredType === 'single_choice' ? ['A', 'B', 'C', 'D'] : null,
      correctAnswer: 'TODO',
      explanationSimple: 'TODO: Giải thích ngắn gọn, dễ hiểu cho học sinh tiểu học',
      isVerified: 0,
      sourceType: 'generated',
    });
  }
}

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outDir = path.join(process.cwd(), 'backups', `question_templates_${stamp}`);
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

for (let i = 0; i < templates.length; i += perFile) {
  const chunk = templates.slice(i, i + perFile);
  const idx = String(Math.floor(i / perFile) + 1).padStart(3, '0');
  const out = path.join(outDir, `templates_${idx}.json`);
  fs.writeFileSync(out, JSON.stringify(chunk, null, 2), 'utf8');
}

const summary = {
  generatedAt: new Date().toISOString(),
  minQuestions,
  templateCount: templates.length,
  chunks: Math.ceil(templates.length / perFile),
};
fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2), 'utf8');

console.log(`Template directory: ${outDir}`);
console.log(`Templates generated: ${templates.length}`);
console.log(`Chunk files: ${summary.chunks}`);
