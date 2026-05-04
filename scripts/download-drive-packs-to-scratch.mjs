import path from 'node:path';
import fs from 'node:fs/promises';
import {
  REPO_ROOT,
  ensureDir,
  nowIso,
  readJson,
  resolveScratchPath,
  sha256File,
  readMagic,
  fileLooksHtml,
  countZipEntries,
  writeJson,
} from './r2-common.mjs';

const OUTPUT_DIR = resolveScratchPath('drive-packs');
const REPORT_PATH = resolveScratchPath('reports', 'drive-pack-download-report.json');
const FALLBACK_DIRS = [
  OUTPUT_DIR,
  resolveScratchPath('drafts'),
  resolveScratchPath('drafts', 'drive-packs'),
  resolveScratchPath('packs'),
  resolveScratchPath('zip'),
];

function decodeHtmlHref(value) {
  return String(value || '').replace(/&amp;/g, '&').replace(/&#x3d;/gi, '=').replace(/&#61;/g, '=');
}

function extractDriveConfirmUrl(html, baseUrl) {
  const hits = html.match(/(?:href|action)="([^"]+)"/gi) || [];
  for (const token of hits) {
    const m = token.match(/(?:href|action)="([^"]+)"/i);
    if (!m) continue;
    const decoded = decodeHtmlHref(m[1]);
    const hasDownload = decoded.includes('/uc?') || decoded.includes('/download?') || decoded.includes('drive.usercontent.google.com/download');
    const hasConfirm = decoded.includes('confirm=') || decoded.includes('uuid=');
    if (!hasDownload || !hasConfirm) continue;
    try {
      return new URL(decoded, baseUrl).toString();
    } catch {
      continue;
    }
  }
  return null;
}

async function downloadDriveWithConfirm(initialUrl) {
  let url = initialUrl;
  let cookieHeader = '';

  for (let i = 0; i < 4; i += 1) {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    });

    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      cookieHeader = cookieHeader ? `${cookieHeader}; ${setCookie.split(';')[0]}` : setCookie.split(';')[0];
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    const contentType = String(response.headers.get('content-type') || '').toLowerCase();
    const head = bytes.subarray(0, 512).toString('utf8').toLowerCase();
    const isHtml = contentType.startsWith('text/html') || head.includes('<!doctype html') || head.includes('<html');

    if (!isHtml) {
      return { bytes, status: response.status, contentType };
    }

    const confirmUrl = extractDriveConfirmUrl(bytes.toString('utf8'), response.url || url);
    if (!confirmUrl) {
      return { bytes, status: response.status, contentType };
    }

    url = confirmUrl;
  }

  throw new Error('google-drive-html-confirm-page');
}

async function isValidZipFile(filePath) {
  const exists = await fs.stat(filePath).then(() => true).catch(() => false);
  if (!exists) return false;

  const stat = await fs.stat(filePath);
  const magic = await readMagic(filePath, 2).catch(() => '');
  const isHtml = await fileLooksHtml(filePath).catch(() => true);
  const zipEntryCount = await countZipEntries(filePath).catch(() => 0);
  return stat.size > 1024 * 1024 && magic === 'PK' && !isHtml && zipEntryCount > 0;
}

async function findLocalFallbackZip(fileName, skipPath) {
  for (const dir of FALLBACK_DIRS) {
    const candidate = path.join(dir, fileName);
    if (path.resolve(candidate) === path.resolve(skipPath)) {
      continue;
    }
    if (await isValidZipFile(candidate)) {
      return candidate;
    }
  }
  return null;
}

async function main() {
  const configPath = path.join(REPO_ROOT, 'public', 'audio', 'tts', 'drive-packs.json');
  const config = await readJson(configPath);
  await ensureDir(OUTPUT_DIR);

  const packs = [];
  for (const pack of config.packs || []) {
    const fileName = String(pack.fileName || '').trim();
    const driveUrl = String(pack.driveDownloadUrl || '').trim();
    if (!fileName || !driveUrl) {
      packs.push({ grade: pack.grade, fileName, pass: false, reason: 'missing-drive-url' });
      continue;
    }

    const target = path.join(OUTPUT_DIR, fileName);
    const existingTargetValid = await isValidZipFile(target);
    if (existingTargetValid) {
      const stat = await fs.stat(target);
      const magic = await readMagic(target, 2);
      const isHtml = await fileLooksHtml(target);
      const sha256 = await sha256File(target);
      const zipEntryCount = await countZipEntries(target).catch(() => 0);
      packs.push({
        grade: pack.grade,
        fileName,
        localPath: target,
        sizeBytes: stat.size,
        magic,
        isHtml,
        sha256,
        zipEntryCount,
        status: 0,
        contentType: '',
        source: 'local-existing',
        downloadError: '',
        pass: true,
      });
      continue;
    }

    let payload = null;
    let downloadError = '';

    try {
      payload = await downloadDriveWithConfirm(driveUrl);
      await fs.writeFile(target, payload.bytes);
    } catch (error) {
      downloadError = String(error?.message || error || 'unknown-download-error');
    }

    let source = 'drive-download';
    const driveFileValid = await isValidZipFile(target);
    if (!driveFileValid) {
      const fallbackPath = await findLocalFallbackZip(fileName, target);
      if (fallbackPath) {
        await fs.copyFile(fallbackPath, target);
        source = `local-fallback:${fallbackPath}`;
      }
    }

    const finalExists = await fs.stat(target).then(() => true).catch(() => false);
    if (!finalExists) {
      packs.push({
        grade: pack.grade,
        fileName,
        localPath: target,
        pass: false,
        reason: downloadError || 'download-failed-and-no-local-fallback',
      });
      continue;
    }

    const stat = await fs.stat(target);
    const magic = await readMagic(target, 2);
    const isHtml = await fileLooksHtml(target);
    const sha256 = await sha256File(target);
    const zipEntryCount = await countZipEntries(target).catch(() => 0);

    packs.push({
      grade: pack.grade,
      fileName,
      localPath: target,
      sizeBytes: stat.size,
      magic,
      isHtml,
      sha256,
      zipEntryCount,
      status: payload?.status ?? 0,
      contentType: payload?.contentType ?? '',
      source,
      downloadError,
      pass: stat.size > 1024 * 1024 && magic === 'PK' && !isHtml && zipEntryCount > 0,
    });
  }

  const report = {
    generatedAt: nowIso(),
    pass: packs.every((x) => x.pass),
    outputDir: OUTPUT_DIR,
    packs,
  };

  await writeJson(REPORT_PATH, report);
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
