import fs from 'fs';
import path from 'path';
import { seedLessons, seedQuestions } from '../src/data/seedData';

const minQuestions = Number(process.env.MIN_QUESTIONS_PER_LESSON || 8);
const owners = (process.env.CONTENT_OWNERS || 'Team-A,Team-B,Team-C').split(',').map((x) => x.trim()).filter(Boolean);
const batchSize = Number(process.env.CONTENT_BATCH_SIZE || 60);

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
      needToAdd: Math.max(0, minQuestions - current),
      priority: current <= 2 ? 'high' : current <= 5 ? 'medium' : 'low',
    };
  })
  .filter((x) => x.needToAdd > 0)
  .sort((a, b) => b.needToAdd - a.needToAdd || a.grade - b.grade || a.subjectCode.localeCompare(b.subjectCode));

const rows = sparse.map((x, idx) => {
  const owner = owners[idx % owners.length];
  const sprint = Math.floor(idx / batchSize) + 1;
  return { ...x, owner, sprint };
});

const byOwner = new Map<string, { lessons: number; needToAdd: number }>();
for (const row of rows) {
  const cur = byOwner.get(row.owner) || { lessons: 0, needToAdd: 0 };
  cur.lessons += 1;
  cur.needToAdd += row.needToAdd;
  byOwner.set(row.owner, cur);
}

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupsDir = path.join(process.cwd(), 'backups');
if (!fs.existsSync(backupsDir)) fs.mkdirSync(backupsDir, { recursive: true });

const jsonPath = path.join(backupsDir, `content_assignment_${stamp}.json`);
const csvPath = path.join(backupsDir, `content_assignment_${stamp}.csv`);
const mdPath = path.join(backupsDir, `content_assignment_${stamp}.md`);

const payload = {
  generatedAt: new Date().toISOString(),
  minQuestions,
  owners,
  batchSize,
  totalLessons: rows.length,
  totalQuestionsToAdd: rows.reduce((sum, r) => sum + r.needToAdd, 0),
  rows,
};
fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2), 'utf8');

const csvHeader = 'lessonId,grade,subjectCode,title,currentQuestions,needToAdd,priority,sprint,owner';
const csvBody = rows
  .map((r) => [r.lessonId, r.grade, r.subjectCode, `"${String(r.title).replace(/"/g, '""')}"`, r.currentQuestions, r.needToAdd, r.priority, r.sprint, r.owner].join(','))
  .join('\n');
fs.writeFileSync(csvPath, `${csvHeader}\n${csvBody}\n`, 'utf8');

const ownerLines = [...byOwner.entries()]
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([owner, v]) => `- ${owner}: ${v.lessons} bài, cần thêm ${v.needToAdd} câu`)
  .join('\n');

const md = [
  '# Content Assignment Plan',
  '',
  `- Generated: ${new Date().toISOString()}`,
  `- Min questions per lesson: ${minQuestions}`,
  `- Total sparse lessons: ${rows.length}`,
  `- Total questions to add: ${rows.reduce((sum, r) => sum + r.needToAdd, 0)}`,
  '',
  '## Owner Summary',
  ownerLines,
  '',
  '## First 50 Tasks',
  '',
  '| lessonId | grade | subject | title | curQ | add | priority | sprint | owner |',
  '|---:|---:|---|---|---:|---:|---|---:|---|',
  ...rows.slice(0, 50).map((r) => `| ${r.lessonId} | ${r.grade} | ${r.subjectCode} | ${r.title} | ${r.currentQuestions} | ${r.needToAdd} | ${r.priority} | ${r.sprint} | ${r.owner} |`),
  '',
].join('\n');
fs.writeFileSync(mdPath, md, 'utf8');

console.log(`Assignment JSON: ${jsonPath}`);
console.log(`Assignment CSV: ${csvPath}`);
console.log(`Assignment MD: ${mdPath}`);
console.log(`Tasks: ${rows.length} lessons, ${rows.reduce((sum, r) => sum + r.needToAdd, 0)} questions to add`);
