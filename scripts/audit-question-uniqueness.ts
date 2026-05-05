/**
 * audit-question-uniqueness.ts
 * Read-only audit: proves whether questionId is globally unique across all seedQuestions.
 * Outputs: question-id-uniqueness-audit.json
 * Run: npx tsx scripts/audit-question-uniqueness.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { seedQuestions } from '../src/data/seedData.ts';

// Windows-safe path: strip leading slash from /F:/... URLs
const _rawPathname = new URL(import.meta.url).pathname;
const _pathname = process.platform === 'win32' ? _rawPathname.replace(/^\//, '') : _rawPathname;
const REPO_ROOT = path.resolve(path.dirname(_pathname), '..');
const OUTPUT = path.join(REPO_ROOT, 'question-id-uniqueness-audit.json');

const byId = new Map<number, number>();
const idLessonSet = new Map<number, Set<number>>();
const idGradeSet = new Map<number, Set<number>>();
const gradeCounts: Record<string, number> = {};
const subjectCounts: Record<string, number> = {};

for (const q of seedQuestions) {
  const id = Number(q.id);
  byId.set(id, (byId.get(id) || 0) + 1);

  if (!idLessonSet.has(id)) idLessonSet.set(id, new Set());
  idLessonSet.get(id)!.add(Number(q.lessonId));

  if (!idGradeSet.has(id)) idGradeSet.set(id, new Set());
  idGradeSet.get(id)!.add(Number(q.grade));

  const g = String(q.grade);
  gradeCounts[g] = (gradeCounts[g] || 0) + 1;

  const s = String(q.subjectCode);
  subjectCounts[s] = (subjectCounts[s] || 0) + 1;
}

const duplicateSamples: Array<{ id: number; count: number }> = [];
let duplicateIdCount = 0;
for (const [id, count] of byId) {
  if (count > 1) {
    duplicateIdCount++;
    if (duplicateSamples.length < 500) duplicateSamples.push({ id, count });
  }
}

const crossLessonSamples: Array<{ id: number; lessonIds: number[] }> = [];
let crossLessonCount = 0;
for (const [id, s] of idLessonSet) {
  if (s.size > 1) {
    crossLessonCount++;
    if (crossLessonSamples.length < 500) crossLessonSamples.push({ id, lessonIds: [...s].sort((a, b) => a - b) });
  }
}

const crossGradeSamples: Array<{ id: number; grades: number[] }> = [];
let crossGradeCount = 0;
for (const [id, s] of idGradeSet) {
  if (s.size > 1) {
    crossGradeCount++;
    if (crossGradeSamples.length < 500) crossGradeSamples.push({ id, grades: [...s].sort((a, b) => a - b) });
  }
}

const total = seedQuestions.length;
const unique = byId.size;
const duplicates = total - unique;

// ID range analysis
const allIds = [...byId.keys()].sort((a, b) => a - b);
const idRangeMin = allIds[0];
const idRangeMax = allIds[allIds.length - 1];

const out = {
  generatedAt: new Date().toISOString(),
  source: 'src/data/seedData.ts (seedQuestions)',
  verdict: duplicateIdCount === 0 && crossLessonCount === 0 ? 'GLOBALLY_UNIQUE' : 'NOT_UNIQUE',
  total,
  unique,
  duplicates,
  duplicateIdCount,
  crossLessonCount,
  crossGradeCount,
  idRangeMin,
  idRangeMax,
  gradeCounts,
  subjectCounts,
  duplicateSamples,
  crossLessonSamples,
  crossGradeSamples,
};

fs.writeFileSync(OUTPUT, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
console.log(`[audit-question-uniqueness] Written to ${OUTPUT}`);
console.log(JSON.stringify({
  verdict: out.verdict,
  total,
  unique,
  duplicates,
  duplicateIdCount,
  crossLessonCount,
  crossGradeCount,
  idRangeMin,
  idRangeMax,
  gradeCounts,
}));
