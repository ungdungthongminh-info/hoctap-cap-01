const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { app, shell } = require('electron');
const extract = require('extract-zip');
const { pathToFileURL } = require('url');

const INDEX_FILE_NAME = 'index.json';
const SCHEMA_VERSION = 1;

const GRADE_PACKS = {
  0: { grade: 0, label: 'Tien tieu hoc', fileId: '1tPIXTZ50LqgQxhutmvx8QE7IEc8uybTN', fileName: 'vi-v1-grade-0-pre-k.zip' },
  1: { grade: 1, label: 'Lop 1', fileId: '1xhb4KGGklpH9U2Kl0tA1ER8CWSE3czmq', fileName: 'vi-v1-grade-1.zip' },
  2: { grade: 2, label: 'Lop 2', fileId: '1VY-VkQ9Wtunydd10rCCp_Xs9cTZRucyh', fileName: 'vi-v1-grade-2.zip' },
  3: { grade: 3, label: 'Lop 3', fileId: '1LKgjUtADcVkbDpvCkfzSNCdNoJG94YQv', fileName: 'vi-v1-grade-3.zip' },
  4: { grade: 4, label: 'Lop 4', fileId: '164Xxc7vlATmrBqSHd9EWSXnvk9Q37rFk', fileName: 'vi-v1-grade-4.zip' },
  5: { grade: 5, label: 'Lop 5', fileId: '1PinMxVGHSl-GkekhSvTYp5rLgmcUFOQV', fileName: 'vi-v1-grade-5.zip' },
};

function nowIso() {
  return new Date().toISOString();
}

function ensureGrade(grade) {
  const parsed = Number(grade);
  if (!Number.isFinite(parsed) || !GRADE_PACKS[parsed]) {
    throw new Error(`Grade khong hop le: ${grade}`);
  }
  return parsed;
}

function resolveStorageRoot() {
  return path.join(app.getPath('userData'), 'audio-packs');
}

function getIndexPath(rootPath) {
  return path.join(rootPath, INDEX_FILE_NAME);
}

function getGradeFolderName(grade) {
  return `grade-${grade}`;
}

async function ensureStorage(rootPath) {
  await fsp.mkdir(rootPath, { recursive: true });
  await fsp.mkdir(path.join(rootPath, 'temp'), { recursive: true });
}

async function readJsonSafe(filePath, fallbackValue) {
  try {
    const raw = await fsp.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallbackValue;
  }
}

function buildEmptyIndex(rootPath) {
  return {
    schemaVersion: SCHEMA_VERSION,
    updatedAt: nowIso(),
    storageRoot: rootPath,
    totalBytes: 0,
    packs: [],
  };
}

async function readIndex(rootPath) {
  const indexPath = getIndexPath(rootPath);
  const fallback = buildEmptyIndex(rootPath);
  const data = await readJsonSafe(indexPath, fallback);
  if (!data || typeof data !== 'object') {
    return fallback;
  }
  return {
    schemaVersion: Number(data.schemaVersion || SCHEMA_VERSION),
    updatedAt: String(data.updatedAt || nowIso()),
    storageRoot: String(data.storageRoot || rootPath),
    totalBytes: Number(data.totalBytes || 0),
    packs: Array.isArray(data.packs) ? data.packs : [],
  };
}

async function writeIndex(rootPath, indexData) {
  const indexPath = getIndexPath(rootPath);
  const next = {
    ...indexData,
    schemaVersion: SCHEMA_VERSION,
    storageRoot: rootPath,
    updatedAt: nowIso(),
  };
  const tmpPath = `${indexPath}.tmp`;
  await fsp.writeFile(tmpPath, JSON.stringify(next, null, 2), 'utf8');
  await fsp.rename(tmpPath, indexPath);
  return next;
}

async function statFileSafe(filePath) {
  try {
    return await fsp.stat(filePath);
  } catch {
    return null;
  }
}

async function walkFiles(dirPath) {
  const results = [];
  const stack = [dirPath];
  while (stack.length > 0) {
    const current = stack.pop();
    const entries = await fsp.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolute);
      } else if (entry.isFile()) {
        results.push(absolute);
      }
    }
  }
  return results;
}

async function findManifestFile(folderPath) {
  const files = await walkFiles(folderPath);
  const match = files.find((filePath) => path.basename(filePath).toLowerCase() === 'manifest.json');
  return match || null;
}

async function computeFolderStats(folderPath) {
  const files = await walkFiles(folderPath);
  let totalBytes = 0;
  let mp3Count = 0;
  for (const filePath of files) {
    const st = await statFileSafe(filePath);
    if (!st) continue;
    totalBytes += st.size;
    if (filePath.toLowerCase().endsWith('.mp3')) {
      mp3Count += 1;
    }
  }
  return {
    fileCount: files.length,
    mp3Count,
    bytes: totalBytes,
  };
}

function toRelative(rootPath, targetPath) {
  return path.relative(rootPath, targetPath).replace(/\\/g, '/');
}

function buildDownloadCandidates(fileId) {
  return [
    `https://drive.usercontent.google.com/download?id=${encodeURIComponent(fileId)}&export=download&confirm=t`,
    `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`,
  ];
}

function isZipHeader(buffer) {
  return buffer.length >= 4
    && buffer[0] === 0x50
    && buffer[1] === 0x4b
    && (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07)
    && (buffer[3] === 0x04 || buffer[3] === 0x06 || buffer[3] === 0x08);
}

function isHtmlContentType(contentType) {
  const normalized = String(contentType || '').toLowerCase();
  return normalized.includes('text/html') || normalized.includes('application/xhtml');
}

async function assertZipFile(filePath) {
  const handle = await fsp.open(filePath, 'r');
  try {
    const header = Buffer.alloc(4);
    const { bytesRead } = await handle.read(header, 0, 4, 0);
    if (bytesRead < 4 || !isZipHeader(header)) {
      throw new Error('Nguon tai khong tra ve file ZIP audio hop le.');
    }
  } finally {
    await handle.close();
  }
}

async function streamDownload(url, outputPath, onProgress) {
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Tai zip that bai (${response.status})`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (isHtmlContentType(contentType)) {
    throw new Error(`Nguon tai tra ve HTML thay vi ZIP (${contentType}).`);
  }

  const totalBytes = Number(response.headers.get('content-length') || 0);
  let downloadedBytes = 0;
  const reader = response.body.getReader();
  const writeStream = fs.createWriteStream(outputPath);

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = Buffer.from(value);
      downloadedBytes += chunk.length;
      if (!writeStream.write(chunk)) {
        await new Promise((resolve) => writeStream.once('drain', resolve));
      }

      if (onProgress) {
        onProgress({
          phase: 'downloading',
          downloadedBytes,
          totalBytes,
          message: totalBytes > 0
            ? `Dang tai ${(downloadedBytes / totalBytes * 100).toFixed(1)}%`
            : `Dang tai ${Math.round(downloadedBytes / 1024)} KB`,
        });
      }
    }
  } finally {
    await new Promise((resolve, reject) => {
      writeStream.end(() => resolve());
      writeStream.on('error', reject);
    });
  }

  return { downloadedBytes, totalBytes };
}

async function downloadGradeZip({ grade, zipPath, onProgress }) {
  const config = GRADE_PACKS[grade];
  const candidates = buildDownloadCandidates(config.fileId);
  let lastError = null;

  for (const candidateUrl of candidates) {
    try {
      const result = await streamDownload(candidateUrl, zipPath, onProgress);
      await assertZipFile(zipPath);
      return result;
    } catch (error) {
      await fsp.rm(zipPath, { force: true }).catch(() => undefined);
      lastError = error;
    }
  }

  throw lastError || new Error('Khong the tai file zip tu Drive.');
}

function upsertPack(indexData, nextPack) {
  const packs = Array.isArray(indexData.packs) ? [...indexData.packs] : [];
  const idx = packs.findIndex((item) => Number(item.grade) === Number(nextPack.grade));
  if (idx >= 0) {
    packs[idx] = nextPack;
  } else {
    packs.push(nextPack);
  }
  return packs.sort((a, b) => Number(a.grade) - Number(b.grade));
}

function recalcTotalBytes(indexData) {
  return (Array.isArray(indexData.packs) ? indexData.packs : [])
    .reduce((acc, item) => acc + Number(item?.summary?.bytes || 0), 0);
}

function buildLessonCoverage(summary) {
  const byUsage = Array.isArray(summary?.byUsage) ? summary.byUsage : [];
  const lesson = byUsage.find((item) => String(item?.usage || '') === 'lesson-read-all') || null;
  const total = Number(lesson?.total || 0);
  const available = Number(lesson?.available || 0);
  return {
    available,
    total,
    missing: Math.max(0, total - available),
    ratio: total > 0 ? Math.round((available / total) * 100) : 0,
  };
}

async function updatePackInfoFile({ rootPath, grade, payload }) {
  const gradeDir = path.join(rootPath, getGradeFolderName(grade));
  const packInfoPath = path.join(gradeDir, 'pack-info.json');
  await fsp.writeFile(packInfoPath, JSON.stringify(payload, null, 2), 'utf8');
}

async function getStorageInfo() {
  const rootPath = resolveStorageRoot();
  await ensureStorage(rootPath);
  const indexData = await readIndex(rootPath);
  return {
    rootPath,
    totalBytes: Number(indexData.totalBytes || 0),
    packCount: Array.isArray(indexData.packs) ? indexData.packs.length : 0,
    schemaVersion: SCHEMA_VERSION,
  };
}

async function listPacks() {
  const rootPath = resolveStorageRoot();
  await ensureStorage(rootPath);
  const indexData = await readIndex(rootPath);
  return indexData;
}

async function downloadPack({ grade, replace = false, onProgress }) {
  const normalizedGrade = ensureGrade(grade);
  const rootPath = resolveStorageRoot();
  await ensureStorage(rootPath);

  const indexData = await readIndex(rootPath);
  const packCfg = GRADE_PACKS[normalizedGrade];
  const gradeDir = path.join(rootPath, getGradeFolderName(normalizedGrade));
  const tempDir = path.join(rootPath, 'temp');
  const tempZipPath = path.join(tempDir, `${getGradeFolderName(normalizedGrade)}.zip`);

  if (replace) {
    await fsp.rm(gradeDir, { recursive: true, force: true });
  }

  await fsp.mkdir(gradeDir, { recursive: true });
  await fsp.mkdir(tempDir, { recursive: true });

  onProgress?.({
    phase: 'downloading',
    downloadedBytes: 0,
    totalBytes: 0,
    message: `Bat dau tai goi ${packCfg.label}`,
  });

  const { downloadedBytes, totalBytes } = await downloadGradeZip({
    grade: normalizedGrade,
    zipPath: tempZipPath,
    onProgress,
  });

  onProgress?.({
    phase: 'extracting',
    downloadedBytes,
    totalBytes,
    message: 'Dang giai nen goi audio...',
  });

  await fsp.rm(gradeDir, { recursive: true, force: true });
  await fsp.mkdir(gradeDir, { recursive: true });
  await extract(tempZipPath, { dir: gradeDir });
  await fsp.rm(tempZipPath, { force: true });

  const manifestAbsolutePath = await findManifestFile(gradeDir);
  let manifestData = null;
  if (manifestAbsolutePath) {
    manifestData = await readJsonSafe(manifestAbsolutePath, null);
  }
  const folderStats = await computeFolderStats(gradeDir);
  const summary = manifestData?.summary || null;
  const availableEntries = Number(summary?.availableEntries || 0);
  const lessonCoverage = buildLessonCoverage(summary);
  const status = availableEntries > 0
    ? (folderStats.mp3Count >= availableEntries ? 'ready' : 'partial')
    : (folderStats.mp3Count > 0 ? 'downloaded' : 'error');

  const profiles = Array.isArray(summary?.voiceProfiles)
    ? summary.voiceProfiles
      .filter((profile) => profile && typeof profile === 'object')
      .map((profile) => ({
        id: String(profile.id || ''),
        label: String(profile.label || profile.id || ''),
        voiceId: String(profile.voiceId || ''),
      }))
    : [];

  const packRecord = {
    grade: normalizedGrade,
    gradeLabel: packCfg.label,
    status,
    contentVersion: String(summary?.contentVersion || manifestData?.meta?.contentVersion || ''),
    installedAt: nowIso(),
    updatedAt: nowIso(),
    source: {
      type: 'drive-proxy',
      fileId: packCfg.fileId,
    },
    manifestFile: manifestAbsolutePath ? toRelative(rootPath, manifestAbsolutePath) : '',
    packInfoFile: `${getGradeFolderName(normalizedGrade)}/pack-info.json`,
    profiles,
    summary: {
      bytes: folderStats.bytes,
      fileCount: folderStats.fileCount,
      mp3Count: folderStats.mp3Count,
      availableEntries,
      missingEntries: Math.max(0, availableEntries - folderStats.mp3Count),
      isPlayableOffline: folderStats.mp3Count > 0,
      lessonCoverage,
    },
  };

  await updatePackInfoFile({
    rootPath,
    grade: normalizedGrade,
    payload: {
      ...packRecord,
      generatedAt: nowIso(),
    },
  });

  const nextIndex = {
    ...indexData,
    packs: upsertPack(indexData, packRecord),
  };
  nextIndex.totalBytes = recalcTotalBytes(nextIndex);
  const savedIndex = await writeIndex(rootPath, nextIndex);

  onProgress?.({
    phase: 'done',
    downloadedBytes,
    totalBytes,
    message: `Da tai xong ${packCfg.label}`,
  });

  return {
    pack: packRecord,
    index: savedIndex,
  };
}

async function removePack({ grade }) {
  const normalizedGrade = ensureGrade(grade);
  const rootPath = resolveStorageRoot();
  await ensureStorage(rootPath);
  const indexData = await readIndex(rootPath);

  const gradeDir = path.join(rootPath, getGradeFolderName(normalizedGrade));
  await fsp.rm(gradeDir, { recursive: true, force: true });

  const packs = (Array.isArray(indexData.packs) ? indexData.packs : [])
    .filter((item) => Number(item.grade) !== normalizedGrade);

  const nextIndex = {
    ...indexData,
    packs,
  };
  nextIndex.totalBytes = recalcTotalBytes(nextIndex);
  const savedIndex = await writeIndex(rootPath, nextIndex);

  return savedIndex;
}

async function verifyPack({ grade }) {
  const normalizedGrade = ensureGrade(grade);
  const rootPath = resolveStorageRoot();
  await ensureStorage(rootPath);
  const indexData = await readIndex(rootPath);
  const gradeDir = path.join(rootPath, getGradeFolderName(normalizedGrade));
  const existing = (Array.isArray(indexData.packs) ? indexData.packs : [])
    .find((item) => Number(item.grade) === normalizedGrade);

  const stats = await statFileSafe(gradeDir);
  if (!stats || !stats.isDirectory()) {
    if (!existing) {
      return {
        ok: false,
        message: 'Pack chua ton tai tren may.',
        index: indexData,
      };
    }

    const packs = indexData.packs.filter((item) => Number(item.grade) !== normalizedGrade);
    const nextIndex = {
      ...indexData,
      packs,
    };
    nextIndex.totalBytes = recalcTotalBytes(nextIndex);
    const savedIndex = await writeIndex(rootPath, nextIndex);
    return {
      ok: false,
      message: 'Pack da mat tren o dia va da duoc xoa khoi index.',
      index: savedIndex,
    };
  }

  const folderStats = await computeFolderStats(gradeDir);
  const manifestAbsolutePath = await findManifestFile(gradeDir);
  const manifestData = manifestAbsolutePath ? await readJsonSafe(manifestAbsolutePath, null) : null;
  const availableEntries = Number(manifestData?.summary?.availableEntries || 0);
  const lessonCoverage = buildLessonCoverage(manifestData?.summary || null);

  const refreshed = {
    ...(existing || {
      grade: normalizedGrade,
      gradeLabel: GRADE_PACKS[normalizedGrade].label,
      installedAt: nowIso(),
      updatedAt: nowIso(),
      source: {
        type: 'drive-proxy',
        fileId: GRADE_PACKS[normalizedGrade].fileId,
      },
    }),
    status: availableEntries > 0
      ? (folderStats.mp3Count >= availableEntries ? 'ready' : 'partial')
      : (folderStats.mp3Count > 0 ? 'downloaded' : 'error'),
    manifestFile: manifestAbsolutePath ? toRelative(rootPath, manifestAbsolutePath) : '',
    updatedAt: nowIso(),
    summary: {
      bytes: folderStats.bytes,
      fileCount: folderStats.fileCount,
      mp3Count: folderStats.mp3Count,
      availableEntries,
      missingEntries: Math.max(0, availableEntries - folderStats.mp3Count),
      isPlayableOffline: folderStats.mp3Count > 0,
      lessonCoverage,
    },
  };

  const nextIndex = {
    ...indexData,
    packs: upsertPack(indexData, refreshed),
  };
  nextIndex.totalBytes = recalcTotalBytes(nextIndex);
  const savedIndex = await writeIndex(rootPath, nextIndex);

  return {
    ok: true,
    message: 'Da kiem tra xong pack tren may.',
    pack: refreshed,
    index: savedIndex,
  };
}

async function openFolder({ grade } = {}) {
  const rootPath = resolveStorageRoot();
  await ensureStorage(rootPath);

  const target = grade === undefined || grade === null
    ? rootPath
    : path.join(rootPath, getGradeFolderName(ensureGrade(grade)));

  await fsp.mkdir(target, { recursive: true });
  const openResult = await shell.openPath(target);
  if (openResult) {
    throw new Error(openResult);
  }
  return { path: target };
}

async function getAssetUrl({ assetKey, grade }) {
  const safeAssetKey = String(assetKey || '').trim();
  if (!safeAssetKey) {
    return null;
  }

  const rootPath = resolveStorageRoot();
  await ensureStorage(rootPath);
  const indexData = await readIndex(rootPath);
  const packs = Array.isArray(indexData.packs) ? indexData.packs : [];
  if (packs.length === 0) {
    return null;
  }

  const prioritized = (() => {
    const normalizedGrade = grade === undefined || grade === null ? null : Number(grade);
    if (normalizedGrade === null || !Number.isFinite(normalizedGrade)) {
      return packs;
    }
    return packs
      .slice()
      .sort((a, b) => {
        const aScore = Number(a.grade) === normalizedGrade ? 0 : 1;
        const bScore = Number(b.grade) === normalizedGrade ? 0 : 1;
        if (aScore !== bScore) return aScore - bScore;
        return Number(a.grade) - Number(b.grade);
      });
  })();

  for (const pack of prioritized) {
    const manifestRel = String(pack?.manifestFile || '').trim();
    if (!manifestRel) {
      continue;
    }
    const manifestPath = path.join(rootPath, manifestRel);
    const manifestData = await readJsonSafe(manifestPath, null);
    const entry = manifestData?.entries?.[safeAssetKey];
    if (!entry || !entry.available) {
      continue;
    }
    const assetPath = String(entry.assetPath || '').replace(/^\/+/, '');
    if (!assetPath) {
      continue;
    }
    const resolvedPath = path.join(path.dirname(manifestPath), assetPath);
    const exists = await statFileSafe(resolvedPath);
    if (!exists || !exists.isFile()) {
      continue;
    }

    return {
      grade: Number(pack.grade),
      url: pathToFileURL(resolvedPath).toString(),
      profileId: String(entry.profileId || ''),
    };
  }

  return null;
}

module.exports = {
  getStorageInfo,
  listPacks,
  downloadPack,
  removePack,
  verifyPack,
  openFolder,
  getAssetUrl,
};
