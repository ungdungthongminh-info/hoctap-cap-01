import { seedLessons, seedLessonCards, seedQuestions } from '../src/data/seedData';
import { allSubjects } from '../src/data/subjects';

const minQuestions = Number(process.env.MIN_QUESTIONS_PER_LESSON || 8);
const warnQuestions = Number(process.env.WARN_QUESTIONS_PER_LESSON || 12);

const cardByLesson = new Map<number, number>();
for (const c of seedLessonCards) {
  cardByLesson.set(c.lessonId, (cardByLesson.get(c.lessonId) || 0) + 1);
}

const qByLesson = new Map<number, number>();
for (const q of seedQuestions) {
  qByLesson.set(q.lessonId, (qByLesson.get(q.lessonId) || 0) + 1);
}

const coverage: Array<{
  grade: number;
  subject: string;
  lessonCount: number;
  cardCount: number;
  questionCount: number;
  avgQPerLesson: number;
}> = [];

for (const s of allSubjects) {
  for (const g of s.grades) {
    const key = `${g}-${s.code}`;
    const bucket = seedLessons.filter((l) => `${l.grade}-${l.subjectCode}` === key);
    const lessonCount = bucket.length;
    let cardCount = 0;
    let questionCount = 0;
    for (const l of bucket) {
      cardCount += cardByLesson.get(l.id) || 0;
      questionCount += qByLesson.get(l.id) || 0;
    }
    coverage.push({
      grade: g,
      subject: s.code,
      lessonCount,
      cardCount,
      questionCount,
      avgQPerLesson: lessonCount ? (questionCount / lessonCount) : 0,
    });
  }
}

coverage.sort((a, b) => a.grade - b.grade || a.subject.localeCompare(b.subject));
console.log('grade\tsubject\tlessons\tcards\tquestions\tavgQ');
for (const row of coverage) {
  console.log([
    row.grade,
    row.subject,
    row.lessonCount,
    row.cardCount,
    row.questionCount,
    row.avgQPerLesson.toFixed(2),
  ].join('\t'));
}

const sparse = seedLessons
  .map((l) => ({
    id: l.id,
    grade: l.grade,
    subjectCode: l.subjectCode,
    title: l.title,
    questionCount: qByLesson.get(l.id) || 0,
    cardCount: cardByLesson.get(l.id) || 0,
  }))
  .filter((x) => x.questionCount < minQuestions)
  .sort((a, b) => a.questionCount - b.questionCount || a.grade - b.grade || a.subjectCode.localeCompare(b.subjectCode));

const warning = seedLessons
  .map((l) => ({
    id: l.id,
    grade: l.grade,
    subjectCode: l.subjectCode,
    title: l.title,
    questionCount: qByLesson.get(l.id) || 0,
  }))
  .filter((x) => x.questionCount < warnQuestions)
  .sort((a, b) => a.questionCount - b.questionCount || a.grade - b.grade || a.subjectCode.localeCompare(b.subjectCode));

console.log('');
console.log(`MIN_QUESTIONS_PER_LESSON=${minQuestions}`);
console.log(`Lessons below minimum: ${sparse.length}`);
console.log(`Lessons below warning: ${warning.length}`);

if (sparse.length > 0) {
  console.log('');
  console.log('Top sparse lessons:');
  for (const row of sparse.slice(0, 60)) {
    console.log(`${row.id}\tG${row.grade}\t${row.subjectCode}\tQ=${row.questionCount}\t${row.title}`);
  }
}

if (process.env.CI || process.env.STRICT_DATA_CHECK === '1') {
  if (sparse.length > 0) {
    console.error(`\nData check failed: ${sparse.length} lessons have < ${minQuestions} questions.`);
    process.exit(1);
  }
}
