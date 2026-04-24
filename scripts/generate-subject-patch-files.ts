import fs from 'fs';
import path from 'path';
import { seedLessons, seedQuestions } from '../src/data/seedData';

const minQuestions = Number(process.env.MIN_QUESTIONS_PER_LESSON || 8);
const outDir = path.join(process.cwd(), 'content-patches', 'drafts');

const qByLesson = new Map<number, number>();
for (const q of seedQuestions) {
  qByLesson.set(q.lessonId, (qByLesson.get(q.lessonId) || 0) + 1);
}

type DraftEntry = {
  lessonId: number;
  grade: number;
  subjectCode: string;
  lessonTitle: string;
  currentQuestions: number;
  needToAdd: number;
  patches: Array<{
    questionType: 'single_choice' | 'true_false' | 'fill_number' | 'ordering' | 'matching' | 'fill_text' | 'multi_choice';
    questionText: string;
    options: string[] | null;
    correctAnswer: string;
    explanationSimple: string;
    difficulty: 'easy' | 'medium' | 'hard';
    skillTag: string;
    isVerified: 0 | 1;
  }>;
};

const grouped = new Map<string, DraftEntry[]>();

for (const lesson of seedLessons) {
  const current = qByLesson.get(lesson.id) || 0;
  const missing = Math.max(0, minQuestions - current);
  if (missing <= 0) continue;

  const key = `${lesson.subjectCode}__g${lesson.grade}`;
  const arr = grouped.get(key) || [];

  const entry: DraftEntry = {
    lessonId: lesson.id,
    grade: lesson.grade,
    subjectCode: lesson.subjectCode,
    lessonTitle: lesson.title,
    currentQuestions: current,
    needToAdd: missing,
    patches: Array.from({ length: missing }, (_, i) => ({
      questionType: 'single_choice',
      questionText: `TODO: [${lesson.subjectCode.toUpperCase()} G${lesson.grade}] ${lesson.title} - câu ${i + 1}`,
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 'A',
      explanationSimple: 'TODO: Giải thích ngắn gọn và thân thiện cho học sinh.',
      difficulty: 'easy',
      skillTag: `${lesson.subjectCode}_core`,
      isVerified: 0,
    })),
  };

  arr.push(entry);
  grouped.set(key, arr);
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let fileCount = 0;
let lessonCount = 0;
let questionCount = 0;

for (const [key, entries] of [...grouped.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const [subjectCode, gradePart] = key.split('__');
  const subjectDir = path.join(outDir, subjectCode);
  if (!fs.existsSync(subjectDir)) fs.mkdirSync(subjectDir, { recursive: true });

  const filePath = path.join(subjectDir, `${gradePart}.patch.json`);
  const payload = {
    generatedAt: new Date().toISOString(),
    minQuestions,
    subjectCode,
    grade: Number(gradePart.replace('g', '')),
    lessons: entries,
  };
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');

  fileCount += 1;
  lessonCount += entries.length;
  questionCount += entries.reduce((sum, x) => sum + x.needToAdd, 0);
}

console.log(`Draft patch files: ${fileCount}`);
console.log(`Lessons in drafts: ${lessonCount}`);
console.log(`Questions to fill: ${questionCount}`);
console.log(`Output: ${outDir}`);
