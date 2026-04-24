import fs from 'fs';
import path from 'path';
import { seedLessons, seedQuestions } from '../src/data/seedData';

const minQuestions = Number(process.env.MIN_QUESTIONS_PER_LESSON || 8);

const qByLesson = new Map<number, number>();
for (const q of seedQuestions) {
  qByLesson.set(q.lessonId, (qByLesson.get(q.lessonId) || 0) + 1);
}

const sparse = seedLessons
  .map((l) => {
    const current = qByLesson.get(l.id) || 0;
    return {
      lessonId: l.id,
      grade: l.grade,
      subjectCode: l.subjectCode,
      title: l.title,
      currentQuestions: current,
      targetQuestions: minQuestions,
      needToAdd: Math.max(0, minQuestions - current),
      priority: current <= 2 ? 'high' : current <= 5 ? 'medium' : 'low',
    };
  })
  .filter((x) => x.needToAdd > 0)
  .sort((a, b) => b.needToAdd - a.needToAdd || a.grade - b.grade || a.subjectCode.localeCompare(b.subjectCode));

const summaryBySubject: Record<string, { lessons: number; needToAdd: number }> = {};
for (const row of sparse) {
  const key = `G${row.grade}-${row.subjectCode}`;
  if (!summaryBySubject[key]) {
    summaryBySubject[key] = { lessons: 0, needToAdd: 0 };
  }
  summaryBySubject[key].lessons += 1;
  summaryBySubject[key].needToAdd += row.needToAdd;
}

const payload = {
  generatedAt: new Date().toISOString(),
  minQuestions,
  sparseLessonCount: sparse.length,
  totalQuestionsToAdd: sparse.reduce((sum, x) => sum + x.needToAdd, 0),
  summaryBySubject,
  plan: sparse,
};

const backupsDir = path.join(process.cwd(), 'backups');
if (!fs.existsSync(backupsDir)) fs.mkdirSync(backupsDir, { recursive: true });

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outFile = path.join(backupsDir, `sparse_lessons_plan_${stamp}.json`);
fs.writeFileSync(outFile, JSON.stringify(payload, null, 2), 'utf8');

console.log(`Sparse plan saved: ${outFile}`);
console.log(`Lessons below ${minQuestions}: ${payload.sparseLessonCount}`);
console.log(`Questions to add: ${payload.totalQuestionsToAdd}`);
