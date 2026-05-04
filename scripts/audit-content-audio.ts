import fs from 'node:fs';
import path from 'node:path';
import { seedLessonCards, seedQuestions } from '../src/data/seedData';
import { buildLessonCardNarrationText, buildQuestionNarrationText } from '../src/shared/services/tts/ttsNarration';

const ABBREV_REGEX = /\b(vd|bt|sgk|hs|gv|tp|q\.)\b/gi;
const DEV_TEXT_REGEX = /(todo|fixme|debug|test-only|lorem ipsum)/i;

function findMathSymbolIssues(text: string): string[] {
  const issues: string[] = [];
  const hasMath = /[+\-×x:\/=]/.test(text);
  if (!hasMath) return issues;

  const badSpacing = text.match(/\d[+\-×x:\/=]\d/g);
  if (badSpacing && badSpacing.length > 0) {
    issues.push(`Math operator spacing suspicious: ${badSpacing.join(', ')}`);
  }
  return issues;
}

function hasQuestionMarkIssue(text: string): boolean {
  const normalized = String(text || '').trim().toLowerCase();
  const maybeQuestion = /(là gì|bao nhiêu|đúng hay sai|ở đâu|khi nào|ai|nào|không)/.test(normalized);
  return maybeQuestion && !normalized.includes('?');
}

function main() {
  const cwd = process.cwd();
  const reportPath = path.join(cwd, 'content-audio-audit-report.json');

  const abbreviationIssues: Array<{ key: string; matches: string[] }> = [];
  const encodingIssues: Array<{ key: string; problem: string }> = [];
  const mathIssues: Array<{ key: string; problems: string[] }> = [];
  const questionMarkIssues: Array<{ key: string; text: string }> = [];
  const devTextIssues: Array<{ key: string; text: string }> = [];

  const lessonCards = seedLessonCards.filter((item) => Number(item.isActive) !== 0);
  const questions = seedQuestions.filter((item) => Number(item.isActive) !== 0);

  let totalItems = 0;

  for (const card of lessonCards) {
    const text = buildLessonCardNarrationText(card);
    const key = `lesson-card:${card.id}`;
    totalItems += 1;

    const abbrev = text.match(ABBREV_REGEX);
    if (abbrev && abbrev.length > 0) abbreviationIssues.push({ key, matches: abbrev });
    if (text.includes('�')) encodingIssues.push({ key, problem: 'Contains replacement character U+FFFD' });
    const math = findMathSymbolIssues(text);
    if (math.length > 0) mathIssues.push({ key, problems: math });
    if (DEV_TEXT_REGEX.test(text)) devTextIssues.push({ key, text });
  }

  for (const q of questions) {
    const text = buildQuestionNarrationText(q);
    const key = `question:${q.id}`;
    totalItems += 1;

    const abbrev = text.match(ABBREV_REGEX);
    if (abbrev && abbrev.length > 0) abbreviationIssues.push({ key, matches: abbrev });
    if (text.includes('�')) encodingIssues.push({ key, problem: 'Contains replacement character U+FFFD' });
    const math = findMathSymbolIssues(text);
    if (math.length > 0) mathIssues.push({ key, problems: math });
    if (hasQuestionMarkIssue(text)) questionMarkIssues.push({ key, text });
    if (DEV_TEXT_REGEX.test(text)) devTextIssues.push({ key, text });
  }

  const pass = abbreviationIssues.length === 0
    && encodingIssues.length === 0
    && mathIssues.length === 0
    && questionMarkIssues.length === 0
    && devTextIssues.length === 0;

  const report = {
    pass,
    summary: {
      totalItems,
      abbreviationCount: abbreviationIssues.length,
      encodingIssueCount: encodingIssues.length,
      mathIssueCount: mathIssues.length,
      questionMarkIssueCount: questionMarkIssues.length,
      devTextIssueCount: devTextIssues.length,
    },
    abbreviationIssues,
    encodingIssues,
    mathIssues,
    questionMarkIssues,
    devTextIssues,
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`Wrote ${reportPath}`);
  console.log(`pass=${pass}`);
}

main();
