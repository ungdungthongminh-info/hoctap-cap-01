import fs from 'node:fs/promises';
import path from 'node:path';

const repo = 'F:/1_A_Disk_D/Tool/Hoc_Tap/CAp_01';
const scratch = 'F:/1_A_Disk_D/Khương Bình/hhk-tts-audio';

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function writeJson(filePath, payload) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

async function main() {
  const dl = await readJson(path.join(scratch, 'reports', 'drive-pack-download-report.json'));
  const packs = (dl.packs || []).map((p) => ({
    grade: p.grade,
    fileName: p.fileName,
    localPath: p.localPath,
    r2Key: `audio/tts/packs/${p.fileName}`,
    publicUrl: '',
    sizeBytes: p.sizeBytes,
    sha256: p.sha256,
    uploadStatus: 'skipped-missing-r2-env',
    httpStatus: null,
    contentType: p.contentType || '',
    magic: p.magic || '',
    isHtml: Boolean(p.isHtml),
  }));

  const driveReport = {
    pass: false,
    bucket: 'hhk-tts-audio',
    publicBaseUrl: '',
    generatedAt: new Date().toISOString(),
    reason: 'missing-r2-env',
    packs,
  };

  await writeJson(path.join(scratch, 'reports', 'r2-drive-pack-upload-report.json'), driveReport);
  await writeJson(path.join(repo, 'r2-drive-pack-upload-report.json'), driveReport);

  const lessonUploadReport = {
    generatedAt: new Date().toISOString(),
    pass: false,
    bucket: 'hhk-tts-audio',
    publicBaseUrl: '',
    reason: 'missing-r2-env',
    total: 4288,
    uploaded: 0,
    skipped: 0,
    results: [],
  };
  await writeJson(path.join(scratch, 'reports', 'r2-lesson-card-mvp-upload-report.json'), lessonUploadReport);
  await writeJson(path.join(repo, 'r2-lesson-card-mvp-upload-report.json'), lessonUploadReport);

  const lessonCheckReport = {
    generatedAt: new Date().toISOString(),
    pass: false,
    reason: 'missing-r2-env',
    checks: [],
  };
  await writeJson(path.join(repo, 'r2-lesson-card-mvp-asset-check.json'), lessonCheckReport);

  const questionUploadReport = {
    generatedAt: new Date().toISOString(),
    pass: false,
    reason: 'missing-r2-env',
    totalItems: 19043,
    uploaded: 0,
    skipped: 0,
    missingLocal: 19043,
    details: [],
  };
  await writeJson(path.join(repo, 'tts-question-r2-upload-report.json'), questionUploadReport);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
