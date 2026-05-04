import fs from 'node:fs';
import path from 'node:path';
import { seedLessonCards, seedLessons, seedQuestions } from '../src/data/seedData';
import { letterRounds, countRounds, traceRounds } from '../src/modules/student/content/preGradeMiniGameRounds';
import { PRE_GRADE_FEEDBACK_TEXT } from '../src/modules/student/content/preGradeMiniGameRounds';
import { buildLessonCardAssetKey, buildQuestionAssetKey, buildPreGradePromptAssetKey, buildPreGradeFeedbackAssetKey } from '../src/shared/services/tts/ttsAssetKeys';

type GradeReport = {
  lessonCards: { total: number; missingAudio: string[] };
  questions: { total: number; missingAudio: string[] };
  wrongGradeAssets: string[];
  abbreviations: string[];
};

type DesktopAcceptance = {
  rootPath?: string;
  noNativeFallback?: boolean;
  checks?: { noCrossGradeFallback?: boolean };
};

const ABBREV_REGEX = /\b(vd|bt|sgk|hs|gv|tp|q\.)\b/gi;

function readJsonSafe<T>(filePath: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
  } catch {
    return null;
  }
}

function collectAbbrev(text: string, label: string, sink: Set<string>) {
  const matches = text.match(ABBREV_REGEX);
  if (matches && matches.length > 0) {
    sink.add(`${label}: ${matches.join(',')}`);
  }
}

function normalizeToPosix(input: string): string {
  return String(input || '').replace(/\\/g, '/');
}

function findManifestFileForGrade(rootPath: string, grade: number): string | null {
  const gradeDir = path.join(rootPath, `grade-${grade}`);
  if (!fs.existsSync(gradeDir)) return null;
  const direct = path.join(gradeDir, 'manifest.json');
  if (fs.existsSync(direct)) return direct;

  const stack = [gradeDir];
  while (stack.length > 0) {
    const current = stack.pop() as string;
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile() && entry.name === 'manifest.json') {
        return full;
      }
    }
  }
  return null;
}

function main() {
  const cwd = process.cwd();
  const catalogPath = path.join(cwd, 'backend', 'data', 'tts', 'catalog.json');
  const reportPath = path.join(cwd, 'tts-catalog-integrity-report.json');
  const acceptancePath = path.join(cwd, 'acceptance-audit-report-0to5-rerun10.json');

  const catalog = readJsonSafe<{ entries: Array<{ key: string; text: string; available: boolean; assetPath: string; kind: string }> }>(catalogPath);
  if (!catalog || !Array.isArray(catalog.entries)) {
    throw new Error(`Khong doc duoc catalog tai ${catalogPath}`);
  }

  const acceptance = readJsonSafe<DesktopAcceptance>(acceptancePath);
  const desktopRoot = String(acceptance?.rootPath || '').trim();

  const entryMap = new Map(catalog.entries.map((item) => [String(item.key), item]));

  const lessonsById = new Map(seedLessons.map((lesson) => [Number(lesson.id), lesson]));
  const gradeReports: Record<string, GradeReport> = {};

  let totalTextItems = 0;
  const allMissing: string[] = [];
  const allWrongGrade: string[] = [];
  const allAbbrev: string[] = [];

  for (const grade of [0, 1, 2, 3, 4, 5]) {
    const gradeKey = String(grade);
    const gradeAbbrev = new Set<string>();
    const wrongGradeAssets: string[] = [];

    const cards = seedLessonCards.filter((card) => {
      if (Number(card.isActive) === 0) return false;
      const lesson = lessonsById.get(Number(card.lessonId));
      return Number(lesson?.grade) === grade;
    });

    const questions = seedQuestions.filter((q) => Number(q.isActive) !== 0 && Number(q.grade) === grade);

    const missingCardAudio: string[] = [];
    for (const card of cards) {
      const key = buildLessonCardAssetKey(Number(card.id));
      const entry = entryMap.get(key);
      totalTextItems += 1;
      if (!entry || !entry.available) {
        missingCardAudio.push(key);
        allMissing.push(`grade-${grade}:${key}`);
      }
      collectAbbrev(String(entry?.text || ''), `grade-${grade}:${key}`, gradeAbbrev);
    }

    const missingQuestionAudio: string[] = [];
    for (const q of questions) {
      const key = buildQuestionAssetKey(Number(q.id));
      const entry = entryMap.get(key);
      totalTextItems += 1;
      if (!entry || !entry.available) {
        missingQuestionAudio.push(key);
        allMissing.push(`grade-${grade}:${key}`);
      }
      collectAbbrev(String(entry?.text || ''), `grade-${grade}:${key}`, gradeAbbrev);
    }

    if (grade === 0) {
      letterRounds.forEach((_round, index) => {
        const key = buildPreGradePromptAssetKey('letters', index);
        const entry = entryMap.get(key);
        totalTextItems += 1;
        if (!entry || !entry.available) {
          allMissing.push(`grade-0:${key}`);
        }
        collectAbbrev(String(entry?.text || ''), `grade-0:${key}`, gradeAbbrev);
      });
      countRounds.forEach((_round, index) => {
        const key = buildPreGradePromptAssetKey('counting', index);
        const entry = entryMap.get(key);
        totalTextItems += 1;
        if (!entry || !entry.available) {
          allMissing.push(`grade-0:${key}`);
        }
        collectAbbrev(String(entry?.text || ''), `grade-0:${key}`, gradeAbbrev);
      });
      traceRounds.forEach((_round, index) => {
        const key = buildPreGradePromptAssetKey('tracing', index);
        const entry = entryMap.get(key);
        totalTextItems += 1;
        if (!entry || !entry.available) {
          allMissing.push(`grade-0:${key}`);
        }
        collectAbbrev(String(entry?.text || ''), `grade-0:${key}`, gradeAbbrev);
      });
      (Object.keys(PRE_GRADE_FEEDBACK_TEXT) as Array<keyof typeof PRE_GRADE_FEEDBACK_TEXT>).forEach((tone) => {
        const key = buildPreGradeFeedbackAssetKey(tone);
        const entry = entryMap.get(key);
        totalTextItems += 1;
        if (!entry || !entry.available) {
          allMissing.push(`grade-0:${key}`);
        }
        collectAbbrev(String(entry?.text || ''), `grade-0:${key}`, gradeAbbrev);
      });
    }

    if (desktopRoot) {
      const manifestPath = findManifestFileForGrade(desktopRoot, grade);
      const manifest = manifestPath ? readJsonSafe<{ entries?: Record<string, { key?: string; assetPath?: string }> }>(manifestPath) : null;
      const manifestEntries = manifest?.entries || {};
      const manifestKeys = new Set(Object.keys(manifestEntries));

      for (const key of manifestKeys) {
        if (key.startsWith('lesson-card:')) {
          const cardId = Number(key.split(':')[1]);
          const card = seedLessonCards.find((c) => Number(c.id) === cardId);
          const lesson = card ? lessonsById.get(Number(card.lessonId)) : null;
          const expectedGrade = Number(lesson?.grade);
          if (Number.isFinite(expectedGrade) && expectedGrade !== grade) {
            wrongGradeAssets.push(`${key} in grade-${grade} but expected grade-${expectedGrade}`);
          }
        }
        if (key.startsWith('question:')) {
          const qId = Number(key.split(':')[1]);
          const q = seedQuestions.find((item) => Number(item.id) === qId);
          const expectedGrade = Number(q?.grade);
          if (Number.isFinite(expectedGrade) && expectedGrade !== grade) {
            wrongGradeAssets.push(`${key} in grade-${grade} but expected grade-${expectedGrade}`);
          }
        }

        const assetPath = normalizeToPosix(String(manifestEntries[key]?.assetPath || ''));
        if (assetPath) {
          const absolute = path.join(path.dirname(manifestPath as string), assetPath.replace(/^\/+/, ''));
          if (!fs.existsSync(absolute)) {
            wrongGradeAssets.push(`${key} missing file ${assetPath} in grade-${grade}`);
          }
        }
      }
    }

    allWrongGrade.push(...wrongGradeAssets);
    const gradeAbbrevList = Array.from(gradeAbbrev.values());
    allAbbrev.push(...gradeAbbrevList);

    gradeReports[gradeKey] = {
      lessonCards: { total: cards.length, missingAudio: missingCardAudio },
      questions: { total: questions.length, missingAudio: missingQuestionAudio },
      wrongGradeAssets,
      abbreviations: gradeAbbrevList,
    };
  }

  const totalAudioAssets = catalog.entries.filter((item) => item.available).length;
  const noCrossGradeFallback = Boolean(acceptance?.checks?.noCrossGradeFallback);
  const noNativeFallback = Boolean(acceptance?.noNativeFallback);

  const pass = allMissing.length === 0
    && allWrongGrade.length === 0
    && allAbbrev.length === 0
    && noCrossGradeFallback
    && noNativeFallback;

  const report = {
    pass,
    grades: gradeReports,
    summary: {
      totalTextItems,
      totalAudioAssets,
      missingCount: allMissing.length,
      wrongGradeCount: allWrongGrade.length,
      abbreviationCount: allAbbrev.length,
      noCrossGradeFallback,
      noNativeFallback,
    },
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`Wrote ${reportPath}`);
  console.log(`pass=${report.pass} missing=${report.summary.missingCount} wrongGrade=${report.summary.wrongGradeCount} abbrev=${report.summary.abbreviationCount}`);
}

main();
