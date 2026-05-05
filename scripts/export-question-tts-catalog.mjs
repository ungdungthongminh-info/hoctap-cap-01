import path from 'node:path';
import { REPO_ROOT, nowIso, readJson, writeJson } from './r2-common.mjs';

const OUTPUT = path.join(REPO_ROOT, 'question-tts-catalog-report.json');

function parseQuestionIdFromKey(key) {
  const raw = String(key || '').trim();
  const m = raw.match(/^question:(\d+)$/i);
  if (!m) return null;
  const id = Number(m[1]);
  return Number.isFinite(id) && id > 0 ? id : null;
}

function inferGradeFromQuestionId(id) {
  if (!Number.isFinite(id) || id <= 0) return null;
  if (id >= 199001 && id <= 199200) return 0;
  if (id < 900) return 1;
  if (id < 950) return 2;
  if (id < 1000) return 3;
  if (id < 199001) return 4;
  return 5;
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function resolveProfileId(entry) {
  const profileId = String(entry.profileId || '').trim();
  if (profileId === 'vi-v1' || profileId === 'en-v1') return profileId;
  const lang = String(entry.lang || '').toLowerCase();
  if (lang.startsWith('en')) return 'en-v1';
  return 'vi-v1';
}

function toOutputItem(entry) {
  const questionId = parseQuestionIdFromKey(entry.key);
  if (!questionId) {
    return { ok: false, reason: 'malformed-key' };
  }

  const text = normalizeText(entry.text);
  if (!text) {
    return { ok: false, reason: 'empty-text' };
  }

  const profileId = resolveProfileId(entry);
  const language = profileId === 'en-v1' ? 'en-v1' : 'vi-v1';
  const contentLang = language === 'en-v1' ? 'en-US' : 'vi-VN';
  const grade = Number.isFinite(Number(entry.grade)) ? Number(entry.grade) : inferGradeFromQuestionId(questionId);
  const objectKey = `audio/tts/assets/${profileId}/question/${questionId}.mp3`;

  return {
    ok: true,
    item: {
      key: `question:${questionId}`,
      questionId,
      kind: 'question',
      profileId,
      language,
      lang: contentLang,
      voiceId: String(entry.voiceId || ''),
      subjectCode: String(entry.subjectCode || 'unknown'),
      grade,
      text,
      ssml: String(entry.ssml || ''),
      assetPath: String(entry.assetPath || ''),
      objectKey,
      r2Key: objectKey,
      localRelativePath: `${profileId}/question/${questionId}.mp3`,
      localFileName: `${questionId}.mp3`,
      estimatedCharacters: text.length,
      sourceAvailable: Boolean(entry.available),
    },
  };
}

async function main() {
  const catalogPath = path.join(REPO_ROOT, 'backend', 'data', 'tts', 'catalog.json');
  const fullCatalog = await readJson(catalogPath);
  const entries = (fullCatalog.entries || []).filter((x) => String(x.kind) === 'question');

  const excluded = {
    malformedKey: 0,
    emptyText: 0,
    duplicateKey: 0,
    duplicateText: 0,
  };

  const items = [];
  const seenKeys = new Set();
  const seenText = new Set();

  for (const entry of entries) {
    const mapped = toOutputItem(entry);
    if (!mapped.ok) {
      if (mapped.reason === 'malformed-key') excluded.malformedKey += 1;
      if (mapped.reason === 'empty-text') excluded.emptyText += 1;
      continue;
    }

    const item = mapped.item;
    if (seenKeys.has(item.key)) {
      excluded.duplicateKey += 1;
      continue;
    }

    const textSignature = `${item.profileId}|${item.text.toLowerCase()}`;
    seenKeys.add(item.key);
    if (seenText.has(textSignature)) {
      excluded.duplicateText += 1;
    } else {
      seenText.add(textSignature);
    }
    items.push(item);
  }

  const byLanguage = items.reduce((acc, item) => {
    acc[item.language] = (acc[item.language] || 0) + 1;
    return acc;
  }, {});

  const byGrade = items.reduce((acc, item) => {
    const g = String(item.grade ?? 'unknown');
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});

  const out = {
    generatedAt: nowIso(),
    sourceCatalog: catalogPath,
    expectedTotals: {
      total: 19043,
      'vi-v1': 16318,
      'en-v1': 2725,
    },
    total: items.length,
    totalCharacters: items.reduce((sum, item) => sum + Number(item.estimatedCharacters || 0), 0),
    byLanguage,
    byGrade,
    excluded,
    items,
  };

  await writeJson(OUTPUT, out);
  console.log(JSON.stringify({
    total: out.total,
    byLanguage: out.byLanguage,
    excluded: out.excluded,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
