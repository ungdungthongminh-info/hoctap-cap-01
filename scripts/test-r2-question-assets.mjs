import path from 'node:path';
import { REPO_ROOT, loadR2Env, nowIso, readJson, probePublicUrl, writeJson } from './r2-common.mjs';

const CATALOG = path.join(REPO_ROOT, 'tts-question-generation-catalog.json');
const OUTPUT = path.join(REPO_ROOT, 'tts-question-r2-upload-report.json');

async function main() {
  const { env, missing } = await loadR2Env();
  if (missing.length) throw new Error(`Missing R2 env keys: ${missing.join(', ')}`);

  const base = String(env.R2_PUBLIC_BASE_URL).replace(/\/+$/, '');
  const catalog = await readJson(CATALOG);
  const samples = (catalog.items || []).slice(0, 40);
  const checks = [];

  for (const item of samples) {
    const url = `${base}/${String(item.r2Key).replace(/^\/+/, '')}`;
    const probe = await probePublicUrl(url);
    checks.push({
      key: item.key,
      profileId: item.profileId,
      publicUrl: url,
      httpStatus: probe.status,
      contentType: probe.contentType,
      isHtml: probe.isHtml,
      pass: probe.status === 200 && probe.contentType.toLowerCase().startsWith('audio/') && !probe.isHtml,
    });
  }

  const out = {
    generatedAt: nowIso(),
    sampled: checks.length,
    pass: checks.every((x) => x.pass),
    checks,
  };

  await writeJson(OUTPUT, out);
  console.log(JSON.stringify(out, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
