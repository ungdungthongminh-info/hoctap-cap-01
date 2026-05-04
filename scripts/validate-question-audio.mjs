import path from 'node:path';
import fs from 'node:fs/promises';
import { REPO_ROOT, nowIso, readJson, resolveScratchPath, sha256File, readMagic, fileLooksHtml, writeJson } from './r2-common.mjs';

const CATALOG = path.join(REPO_ROOT, 'tts-question-generation-catalog.json');
const OUTPUT = path.join(REPO_ROOT, 'tts-question-audio-validation-report.json');

async function main() {
  const catalog = await readJson(CATALOG);
  const items = catalog.items || [];
  const checks = [];

  for (const item of items) {
    const outputPath = path.join(resolveScratchPath('question', String(item.outputProfileDir || item.profileId || 'vi-v1')), String(item.localFileName || `${String(item.key).replace(':', '-')}.mp3`));
    const exists = await fs.stat(outputPath).then(() => true).catch(() => false);
    if (!exists) {
      checks.push({ key: item.key, profileId: item.profileId, localPath: outputPath, exists: false, pass: false, reason: 'missing' });
      continue;
    }

    const stat = await fs.stat(outputPath);
    const sha256 = await sha256File(outputPath);
    const magic = await readMagic(outputPath, 3);
    const isHtml = await fileLooksHtml(outputPath);

    checks.push({
      key: item.key,
      profileId: item.profileId,
      localPath: outputPath,
      exists: true,
      sizeBytes: stat.size,
      sha256,
      magic,
      isHtml,
      pass: stat.size > 1024 && !isHtml,
    });
  }

  const out = {
    generatedAt: nowIso(),
    pass: checks.every((x) => x.pass),
    totalItems: checks.length,
    ok: checks.filter((x) => x.pass).length,
    failed: checks.filter((x) => !x.pass).length,
    checks,
  };

  await writeJson(OUTPUT, out);
  console.log(JSON.stringify({ total: out.totalItems, ok: out.ok, failed: out.failed }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
