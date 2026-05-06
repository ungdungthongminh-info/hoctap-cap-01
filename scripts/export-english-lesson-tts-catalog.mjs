import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFile } from 'node:fs/promises';
import { seedLessons, seedLessonCards } from '../src/data/seedData';
import { buildLessonCardNarrationText } from '../src/shared/services/tts/ttsNarration';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const OUTPUT_JSON = path.join(REPO_ROOT, 'english-lesson-tts-catalog.json');
const OUTPUT_MD = path.join(REPO_ROOT, 'english-lesson-tts-catalog.md');
const OUTPUT_CSV = path.join(REPO_ROOT, 'english-lesson-tts-catalog.csv');

const PROFILE_ID = 'en-v1';
const SUBJECT_CODE = 'english';
const R2_BASE_URL = 'https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev';
const TOO_LONG_THRESHOLD = 4500;

function nowIso() {
  return new Date().toISOString();
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function escapeMdCell(value) {
  return String(value ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ')
    .trim();
}

function truncate(value, max = 90) {
  const text = String(value ?? '');
  if (text.length <= max) return text;
  return `${text.slice(0, Math.max(0, max - 3))}...`;
}

function gradeSort(a, b) {
  return Number(a.grade) - Number(b.grade)
    || Number(a.lessonId) - Number(b.lessonId)
    || Number(a.cardId) - Number(b.cardId);
}

function parseArgs(argv) {
  const args = new Set(argv.slice(2));
  return {
    noProbe: args.has('--no-probe'),
  };
}

async function probeHead(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', cache: 'no-cache' });
    const contentType = String(res.headers.get('content-type') || '');
    return {
      status: res.status,
      contentType,
      exists: res.ok,
      playable: res.ok && /audio\//i.test(contentType),
    };
  } catch (error) {
    return {
      status: 0,
      contentType: '',
      exists: false,
      playable: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function buildMarkdown(report) {
  const lines = [];
  lines.push('# English Lesson TTS Catalog (Dry Run)');
  lines.push('');
  lines.push(`- Generated at: ${report.generatedAt}`);
  lines.push('- Mode: dry-run only (no Google TTS, no upload, no runtime/manifest edits).');
  lines.push(`- profile: ${report.scope.profile}`);
  lines.push(`- Subject: ${report.scope.subject}`);
  lines.push(`- Probe mode: ${report.probeMode}`);
  lines.push('- Output files: english-lesson-tts-catalog.json, english-lesson-tts-catalog.md, english-lesson-tts-catalog.csv');
  lines.push('');
  lines.push('## Dry-run Metrics');
  lines.push('');
  lines.push(`- totalLessons: ${report.metrics.totalLessons}`);
  lines.push(`- totalCards: ${report.metrics.totalCards}`);
  lines.push(`- duplicateCardIds: ${report.metrics.duplicateCardIds}`);
  lines.push(`- missingText: ${report.metrics.missingText}`);
  lines.push(`- tooLongText: ${report.metrics.tooLongText} (threshold=${report.metrics.tooLongThreshold})`);
  lines.push(`- existingR2Objects: ${report.metrics.existingR2Objects}`);
  lines.push(`- missingR2Objects: ${report.metrics.missingR2Objects}`);
  lines.push(`- estimatedGenerateCount: ${report.metrics.estimatedGenerateCount}`);
  lines.push('');
  lines.push('## Coverage By Grade');
  lines.push('');
  lines.push('| grade | lessons | cards | missingText | tooLong | existingR2 | missingR2 | estimatedGenerate |');
  lines.push('|---:|---:|---:|---:|---:|---:|---:|---:|');
  for (const row of report.metrics.byGrade) {
    lines.push(`| ${row.grade} | ${row.lessons} | ${row.cards} | ${row.missingText} | ${row.tooLongText} | ${row.existingR2Objects} | ${row.missingR2Objects} | ${row.estimatedGenerateCount} |`);
  }
  lines.push('');
  lines.push('## Catalog Table');
  lines.push('');
  lines.push('| grade | lessonId | cardId | subject | lessonTitle | text | profile | expectedObjectKey | expectedR2Url |');
  lines.push('|---:|---:|---:|---|---|---|---|---|---|');
  for (const item of report.items) {
    lines.push(`| ${item.grade} | ${item.lessonId} | ${item.cardId} | ${item.subject} | ${escapeMdCell(item.lessonTitle)} | ${escapeMdCell(truncate(item.text, 130))} | ${item.profile} | ${escapeMdCell(item.expectedObjectKey)} | ${escapeMdCell(item.expectedR2Url)} |`);
  }

  return `${lines.join('\n')}\n`;
}

function toCsvCell(value) {
  const text = String(value ?? '');
  if (!/[",\n\r]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function buildCsv(items) {
  const header = 'grade,lessonId,cardId,subject,lessonTitle,text,profile,expectedObjectKey,expectedR2Url';
  const rows = items.map((item) => [
    item.grade,
    item.lessonId,
    item.cardId,
    item.subject,
    item.lessonTitle,
    item.text,
    item.profile,
    item.expectedObjectKey,
    item.expectedR2Url,
  ].map(toCsvCell).join(','));
  return `${[header, ...rows].join('\n')}\n`;
}

async function main() {
  const cli = parseArgs(process.argv);
  const shouldProbe = !cli.noProbe;

  const lessons = seedLessons
    .filter((lesson) => Number(lesson.isActive) !== 0)
    .filter((lesson) => lesson.subjectCode === SUBJECT_CODE)
    .filter((lesson) => Number(lesson.grade) >= 1 && Number(lesson.grade) <= 5);

  const lessonMap = new Map(lessons.map((lesson) => [Number(lesson.id), lesson]));
  const lessonIds = new Set(lessons.map((lesson) => Number(lesson.id)));

  const cards = seedLessonCards
    .filter((card) => Number(card.isActive) !== 0)
    .filter((card) => lessonIds.has(Number(card.lessonId)));

  const rows = cards.map((card) => {
    const lesson = lessonMap.get(Number(card.lessonId));
    const text = normalizeText(buildLessonCardNarrationText(card));
    const grade = Number(lesson?.grade ?? 0);
    const lessonId = Number(card.lessonId);
    const cardId = Number(card.id);
    const expectedObjectKey = `audio/tts/assets/${PROFILE_ID}/lesson-card-${cardId}.mp3`;
    const expectedR2Url = `${R2_BASE_URL}/${expectedObjectKey}`;

    return {
      grade,
      lessonId,
      cardId,
      subject: SUBJECT_CODE,
      lessonTitle: String(lesson?.title || ''),
      text,
      profile: PROFILE_ID,
      expectedObjectKey,
      expectedR2Url,
    };
  }).sort(gradeSort);

  const duplicateCardIds = rows.length - new Set(rows.map((row) => row.cardId)).size;
  const missingText = rows.filter((row) => row.text.length === 0).length;
  const tooLongText = rows.filter((row) => row.text.length > TOO_LONG_THRESHOLD).length;

  const probeResults = [];
  if (shouldProbe) {
    for (const row of rows) {
      const head = await probeHead(row.expectedR2Url);
      probeResults.push({
        cardId: row.cardId,
        ...head,
      });
    }
  }

  const probeMap = new Map(probeResults.map((result) => [result.cardId, result]));

  const enrichedRows = rows.map((row) => {
    const probe = probeMap.get(row.cardId) || { status: 0, contentType: '', exists: false, playable: false };
    const shouldGenerate = !probe.exists && row.text.length > 0 && row.text.length <= TOO_LONG_THRESHOLD;
    return {
      ...row,
      r2Status: Number(probe.status || 0),
      r2ContentType: String(probe.contentType || ''),
      r2Exists: Boolean(probe.exists),
      r2Playable: Boolean(probe.playable),
      shouldGenerate,
      flags: {
        missingText: row.text.length === 0,
        tooLongText: row.text.length > TOO_LONG_THRESHOLD,
      },
    };
  });

  const existingR2Objects = enrichedRows.filter((row) => row.r2Exists).length;
  const missingR2Objects = enrichedRows.length - existingR2Objects;
  const estimatedGenerateCount = enrichedRows.filter((row) => row.shouldGenerate).length;

  const lessonCountByGrade = new Map();
  for (const lesson of lessons) {
    const g = Number(lesson.grade);
    lessonCountByGrade.set(g, (lessonCountByGrade.get(g) || 0) + 1);
  }

  const byGrade = [1, 2, 3, 4, 5].map((grade) => {
    const rowsForGrade = enrichedRows.filter((row) => row.grade === grade);
    return {
      grade,
      lessons: Number(lessonCountByGrade.get(grade) || 0),
      cards: rowsForGrade.length,
      missingText: rowsForGrade.filter((row) => row.flags.missingText).length,
      tooLongText: rowsForGrade.filter((row) => row.flags.tooLongText).length,
      existingR2Objects: rowsForGrade.filter((row) => row.r2Exists).length,
      missingR2Objects: rowsForGrade.filter((row) => !row.r2Exists).length,
      estimatedGenerateCount: rowsForGrade.filter((row) => row.shouldGenerate).length,
    };
  });

  const report = {
    generatedAt: nowIso(),
    mode: 'dry-run',
    probeMode: shouldProbe ? 'enabled' : 'disabled (--no-probe)',
    scope: {
      profile: PROFILE_ID,
      subject: SUBJECT_CODE,
      grades: [1, 2, 3, 4, 5],
      constraints: {
        noGoogleTtsCalls: true,
        noUpload: true,
        noRuntimeOrManifestChanges: true,
        noQuestionPipelineChanges: true,
      },
    },
    metrics: {
      totalLessons: lessons.length,
      totalCards: enrichedRows.length,
      duplicateCardIds,
      missingText,
      tooLongText,
      tooLongThreshold: TOO_LONG_THRESHOLD,
      existingR2Objects,
      missingR2Objects,
      estimatedGenerateCount,
      byGrade,
    },
    items: enrichedRows,
  };

  const markdown = buildMarkdown({
    generatedAt: report.generatedAt,
    scope: report.scope,
    metrics: report.metrics,
    probeMode: report.probeMode,
    items: enrichedRows,
  });
  const csv = buildCsv(enrichedRows);

  await writeFile(OUTPUT_JSON, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await writeFile(OUTPUT_MD, markdown, 'utf8');
  await writeFile(OUTPUT_CSV, csv, 'utf8');

  console.log(JSON.stringify({
    outputJson: OUTPUT_JSON,
    outputMarkdown: OUTPUT_MD,
    outputCsv: OUTPUT_CSV,
    probeMode: report.probeMode,
    totalLessons: report.metrics.totalLessons,
    totalCards: report.metrics.totalCards,
    existingR2Objects: report.metrics.existingR2Objects,
    missingR2Objects: report.metrics.missingR2Objects,
    estimatedGenerateCount: report.metrics.estimatedGenerateCount,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
