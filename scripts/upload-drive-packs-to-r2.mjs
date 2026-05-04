import path from 'node:path';
import {
  REPO_ROOT,
  buildR2PublicUrl,
  createR2Client,
  ensureNoSecretOrAudioStaged,
  loadR2Env,
  nowIso,
  probePublicUrl,
  readJson,
  resolveScratchPath,
  sha256File,
  readMagic,
  fileLooksHtml,
  uploadFileToR2,
  writeJson,
} from './r2-common.mjs';
import fs from 'node:fs/promises';

const SCRATCH_REPORT = resolveScratchPath('reports', 'r2-drive-pack-upload-report.json');
const REPO_REPORT = path.join(REPO_ROOT, 'r2-drive-pack-upload-report.json');

async function main() {
  ensureNoSecretOrAudioStaged();

  const { env, missing } = await loadR2Env();
  if (missing.length) {
    throw new Error(`Missing R2 env keys: ${missing.join(', ')}`);
  }

  const configPath = path.join(REPO_ROOT, 'public', 'audio', 'tts', 'drive-packs.json');
  const config = await readJson(configPath);
  const client = createR2Client(env);

  const packs = [];
  for (const pack of config.packs || []) {
    const fileName = String(pack.fileName || '').trim();
    const localPath = resolveScratchPath('drive-packs', fileName);
    const r2Key = `audio/tts/packs/${fileName}`;
    const publicUrl = buildR2PublicUrl(env.R2_PUBLIC_BASE_URL, r2Key);

    const stat = await fs.stat(localPath);
    const sha256 = await sha256File(localPath);
    const magic = await readMagic(localPath, 2);
    const isHtml = await fileLooksHtml(localPath);

    let uploadStatus = 'uploaded';
    if (isHtml || magic !== 'PK') {
      uploadStatus = 'skipped-invalid';
    } else {
      await uploadFileToR2({
        client,
        bucket: env.R2_BUCKET,
        key: r2Key,
        filePath: localPath,
        contentType: 'application/zip',
        metadata: {
          sha256,
          size: String(stat.size),
          source: 'drive-pack',
        },
      });
    }

    const probe = await probePublicUrl(publicUrl);

    packs.push({
      grade: pack.grade,
      fileName,
      localPath,
      r2Key,
      publicUrl,
      sizeBytes: stat.size,
      sha256,
      uploadStatus,
      httpStatus: probe.status,
      contentType: probe.contentType,
      magic: probe.magic,
      isHtml: probe.isHtml,
    });
  }

  const report = {
    pass: packs.every((x) => x.uploadStatus === 'uploaded' && x.httpStatus === 200 && !x.isHtml && (x.magic === 'PK')),
    bucket: env.R2_BUCKET,
    publicBaseUrl: env.R2_PUBLIC_BASE_URL,
    generatedAt: nowIso(),
    packs,
  };

  await writeJson(SCRATCH_REPORT, report);
  await writeJson(REPO_REPORT, report);
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
