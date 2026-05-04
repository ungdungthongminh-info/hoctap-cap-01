import path from 'node:path';
import { REPO_ROOT, loadR2Env, nowIso, readJson, probePublicUrl, writeJson } from './r2-common.mjs';

const OUTPUT = path.join(REPO_ROOT, 'r2-drive-pack-upload-report.json');

async function main() {
  const { env, missing } = await loadR2Env();
  if (missing.length) throw new Error(`Missing R2 env keys: ${missing.join(', ')}`);

  const config = await readJson(path.join(REPO_ROOT, 'public', 'audio', 'tts', 'drive-packs.json'));
  const packs = [];

  for (const pack of config.packs || []) {
    const key = String(pack.r2Key || `audio/tts/packs/${pack.fileName}`);
    const publicUrl = String(pack.r2PublicUrl || '').trim() || `${String(env.R2_PUBLIC_BASE_URL).replace(/\/+$/, '')}/${key}`;
    const probe = await probePublicUrl(publicUrl);
    packs.push({
      grade: pack.grade,
      fileName: pack.fileName,
      r2Key: key,
      publicUrl,
      httpStatus: probe.status,
      contentType: probe.contentType,
      magic: probe.magic,
      isHtml: probe.isHtml,
      pass: probe.status === 200 && !probe.isHtml && probe.magic === 'PK' && (probe.contentType.startsWith('application/zip') || probe.contentType.startsWith('application/octet-stream')),
    });
  }

  const report = {
    generatedAt: nowIso(),
    pass: packs.every((x) => x.pass),
    packs,
  };

  await writeJson(OUTPUT, report);
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
