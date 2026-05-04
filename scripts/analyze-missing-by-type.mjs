/**
 * analyze-missing-by-type.mjs
 * Phân tích 19,749 entry thiếu trong catalog theo content-type, grade, subject, voice profile
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, '..');

const catalog = JSON.parse(readFileSync(join(root, 'backend/data/tts/catalog.json'), 'utf-8'));
const integrity = JSON.parse(readFileSync(join(root, 'tts-catalog-integrity-report.json'), 'utf-8'));

const allEntries = catalog.entries;
const missingEntries = allEntries.filter(e => !e.available);

console.log('Total catalog entries:', allEntries.length);
console.log('Total missing entries:', missingEntries.length);

// --- Question ID → Subject mapping (from source file analysis) ---
const ID_SUBJECT_MAP = [
  { from: 1,      to: 300,    grade: 1, subject: 'math' },
  { from: 301,    to: 600,    grade: 2, subject: 'math' },
  { from: 701,    to: 1100,   grade: 1, subject: 'vietnamese' },
  { from: 1101,   to: 1500,   grade: 1, subject: 'nature' },
  { from: 1501,   to: 1900,   grade: 1, subject: 'ethics' },
  { from: 1901,   to: 2200,   grade: 3, subject: 'english' },
  { from: 2201,   to: 2500,   grade: 3, subject: 'math' },
  { from: 2501,   to: 2800,   grade: 4, subject: 'math' },
  { from: 2801,   to: 3100,   grade: 5, subject: 'math' },
  { from: 3101,   to: 3400,   grade: 2, subject: 'vietnamese' },
  { from: 3401,   to: 3700,   grade: 3, subject: 'vietnamese' },
  { from: 3701,   to: 4000,   grade: 4, subject: 'vietnamese' },
  { from: 4001,   to: 4300,   grade: 5, subject: 'vietnamese' },
  { from: 4301,   to: 4600,   grade: 2, subject: 'nature' },
  { from: 4601,   to: 4900,   grade: 3, subject: 'nature' },
  { from: 4901,   to: 5200,   grade: 2, subject: 'ethics' },
  { from: 5201,   to: 5500,   grade: 3, subject: 'ethics' },
  { from: 5501,   to: 5800,   grade: 4, subject: 'ethics' },
  { from: 5801,   to: 6100,   grade: 5, subject: 'ethics' },
  { from: 6101,   to: 6400,   grade: 4, subject: 'english' },
  { from: 6401,   to: 6700,   grade: 5, subject: 'english' },
  { from: 6701,   to: 7000,   grade: 1, subject: 'english' },
  { from: 7001,   to: 7300,   grade: 2, subject: 'english' },
  { from: 7301,   to: 7600,   grade: 4, subject: 'science' },
  { from: 7601,   to: 7900,   grade: 5, subject: 'science' },
  { from: 7901,   to: 8200,   grade: 4, subject: 'history_geo' },
  { from: 8201,   to: 9000,   grade: 5, subject: 'history_geo' },
  { from: 9001,   to: 9500,   grade: 3, subject: 'informatics' },
  { from: 9501,   to: 10000,  grade: 4, subject: 'informatics' },
  { from: 10001,  to: 10500,  grade: 5, subject: 'informatics' },
  { from: 11001,  to: 11500,  grade: 1, subject: 'art' },
  { from: 11501,  to: 12000,  grade: 2, subject: 'art' },
  { from: 12001,  to: 12500,  grade: 3, subject: 'art' },
  { from: 12501,  to: 13000,  grade: 4, subject: 'art' },
  { from: 13001,  to: 13500,  grade: 5, subject: 'art' },
  { from: 15001,  to: 29999,  grade: 'multi', subject: 'extra_multi' },
  { from: 30001,  to: 30999,  grade: 'multi', subject: 'math_expand' },
  { from: 31001,  to: 31999,  grade: 'multi', subject: 'vietnamese_expand' },
  { from: 32001,  to: 39999,  grade: 'multi', subject: 'expand_other' },
  { from: 199001, to: 199999, grade: 0,       subject: 'pre-grade' },
];

function getSubjectForId(id) {
  for (const r of ID_SUBJECT_MAP) {
    if (id >= r.from && id <= r.to) return { subject: r.subject, grade: r.grade };
  }
  return { subject: 'unknown', grade: null };
}

// --- By kind ---
const byKind = {};
for (const e of missingEntries) {
  byKind[e.kind] = (byKind[e.kind] || 0) + 1;
}
console.log('\n=== MISSING BY KIND ===');
for (const [k, v] of Object.entries(byKind).sort((a, b) => b[1] - a[1])) {
  console.log(` ${k}: ${v}`);
}

// --- By voice profile ---
const byVoice = {};
const byVoiceKind = {};
for (const e of missingEntries) {
  byVoice[e.profileId] = (byVoice[e.profileId] || 0) + 1;
  if (!byVoiceKind[e.profileId]) byVoiceKind[e.profileId] = {};
  byVoiceKind[e.profileId][e.kind] = (byVoiceKind[e.profileId][e.kind] || 0) + 1;
}
console.log('\n=== MISSING BY VOICE PROFILE ===');
for (const [p, v] of Object.entries(byVoice).sort((a, b) => b[1] - a[1])) {
  const kindsStr = Object.entries(byVoiceKind[p]).map(([k, c]) => `${k}: ${c}`).join(', ');
  console.log(` ${p}: ${v} (${kindsStr})`);
}

// --- By grade (from integrity report) ---
const gradeData = integrity.grades || {};
const byGrade = {};
for (const [g, data] of Object.entries(gradeData)) {
  const lcMissing = (data.lessonCards?.missingAudio || []).length;
  const qMissing = (data.questions?.missingAudio || []).length;
  byGrade[g] = { total: lcMissing + qMissing, lessonCard: lcMissing, question: qMissing };
}
const auditMissing = missingEntries.filter(e => e.kind === 'audit');
if (auditMissing.length > 0) {
  byGrade['other'] = { total: auditMissing.length, lessonCard: 0, question: 0, audit: auditMissing.length };
}
console.log('\n=== MISSING BY GRADE ===');
for (const [g, d] of Object.entries(byGrade).sort((a, b) => a[0].localeCompare(b[0]))) {
  const detail = Object.entries(d).filter(([k]) => k !== 'total').map(([k, v]) => `${k}:${v}`).join(', ');
  console.log(` Grade ${g}: total=${d.total} (${detail})`);
}

// --- By subject (question entries only, mapped from ID ranges) ---
const bySubject = {};
for (const e of missingEntries.filter(e => e.kind === 'question')) {
  const idNum = parseInt(e.key.replace('question:', ''), 10);
  const { subject } = getSubjectForId(idNum);
  if (!bySubject[subject]) bySubject[subject] = { total: 0, byVoice: {} };
  bySubject[subject].total++;
  bySubject[subject].byVoice[e.profileId] = (bySubject[subject].byVoice[e.profileId] || 0) + 1;
}
console.log('\n=== MISSING QUESTIONS BY SUBJECT ===');
for (const [s, d] of Object.entries(bySubject).sort((a, b) => b[1].total - a[1].total)) {
  const voiceStr = Object.entries(d.byVoice).map(([p, c]) => `${p}:${c}`).join(', ');
  console.log(` ${s}: ${d.total} (${voiceStr})`);
}

// --- Write JSON report ---
const outPath = join(root, 'tts-missing-audio-by-content-type.json');
const report = {
  generatedAt: new Date().toISOString(),
  source: 'backend/data/tts/catalog.json + tts-catalog-integrity-report.json',
  totalMissing: 19743,
  note: '19749 catalog-missing (incl. 6 audit samples); 19743 = app content missing',
  byContentType: {
    'lesson-card': { missing: byKind['lesson-card'] || 0, note: 'flashcard bài học (en-v1 only)' },
    'question':    { missing: byKind['question'] || 0,    note: 'câu hỏi luyện tập (vi-v1 + en-v1)' },
    'pregrade-prompt': { missing: 0, note: 'tất cả 11 entries đã available' },
    'feedback':    { missing: 0,                          note: 'tất cả 3 entries đã available' },
    'audit':       { missing: byKind['audit'] || 0,       note: 'voice quality samples - không phải app content' },
  },
  byGrade,
  bySubject,
  byVoiceProfile: Object.fromEntries(
    Object.entries(byVoice).map(([p, total]) => [p, { total, byKind: byVoiceKind[p] }])
  ),
  topExamplesByType: {
    'lesson-card': missingEntries.filter(e => e.kind === 'lesson-card').slice(0, 5).map(e => ({ key: e.key, profileId: e.profileId, text: e.text?.substring(0, 60) })),
    'question':    missingEntries.filter(e => e.kind === 'question').slice(0, 5).map(e => ({ key: e.key, profileId: e.profileId, text: e.text?.substring(0, 60) })),
  }
};

writeFileSync(outPath, JSON.stringify(report, null, 2));
console.log('\n✅ Written:', outPath);
