import path from 'node:path';
import { REPO_ROOT, nowIso, readJson, writeJson } from './r2-common.mjs';

const OUTPUT = path.join(REPO_ROOT, 'tts-question-generation-catalog.json');

function inferGradeFromKey(key) {
  const id = Number(String(key || '').split(':')[1] || 0);
  if (!Number.isFinite(id) || id <= 0) return null;
  if (id >= 199001 && id <= 199200) return 0;
  if (id < 1000) return 1;
  if (id < 900) return 2;
  if (id < 950) return 3;
  if (id < 1000) return 4;
  return 5;
}

async function main() {
  const catalogPath = path.join(REPO_ROOT, 'backend', 'data', 'tts', 'catalog.json');
  const fullCatalog = await readJson(catalogPath);
  const entries = (fullCatalog.entries || []).filter((x) => x.kind === 'question' && x.available === false);

  const items = entries.map((x) => {
    const profileId = String(x.profileId || 'vi-v1');
    const assetPath = String(x.assetPath || '');
    const fileName = path.basename(assetPath || `${String(x.key).replace(':', '-')}.mp3`);
    return {
      key: x.key,
      kind: 'question',
      profileId,
      lang: x.lang,
      voiceId: x.voiceId,
      subjectCode: String(x.subjectCode || 'unknown'),
      grade: Number.isFinite(Number(x.grade)) ? Number(x.grade) : inferGradeFromKey(x.key),
      text: x.text,
      ssml: x.ssml,
      assetPath,
      localFileName: fileName,
      r2Key: `audio/tts/assets/${profileId}/${fileName}`,
      outputProfileDir: profileId,
      estimatedCharacters: String(x.text || '').length,
    };
  });

  const byProfile = items.reduce((acc, item) => {
    acc[item.profileId] = (acc[item.profileId] || 0) + 1;
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
    totalItems: items.length,
    totalCharacters: items.reduce((sum, item) => sum + item.estimatedCharacters, 0),
    byProfile,
    byGrade,
    items,
  };

  await writeJson(OUTPUT, out);
  console.log(JSON.stringify({ totalItems: out.totalItems, byProfile: out.byProfile }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
