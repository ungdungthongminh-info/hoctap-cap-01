const fs = require('fs');
const path = require('path');
const os = require('os');
const { app, safeStorage } = require('electron');

const CACHE_FILE_NAME = 'license-cache.json';

function getCacheFilePath() {
  return path.join(app.getPath('userData'), CACHE_FILE_NAME);
}

function ensureParentDir(filePath) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

function encodePayload(text) {
  if (safeStorage.isEncryptionAvailable()) {
    const encrypted = safeStorage.encryptString(text);
    return {
      encoding: 'safeStorage:v1',
      data: encrypted.toString('base64'),
    };
  }

  return {
    encoding: 'plain:v1',
    data: Buffer.from(text, 'utf8').toString('base64'),
  };
}

function decodePayload(payload) {
  if (!payload || typeof payload !== 'object') return null;
  const encoding = String(payload.encoding || '');
  const data = String(payload.data || '');
  if (!data) return null;

  if (encoding === 'safeStorage:v1') {
    if (!safeStorage.isEncryptionAvailable()) {
      return null;
    }
    const encrypted = Buffer.from(data, 'base64');
    return safeStorage.decryptString(encrypted);
  }

  if (encoding === 'plain:v1') {
    return Buffer.from(data, 'base64').toString('utf8');
  }

  return null;
}

function readCache() {
  const filePath = getCacheFilePath();
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const wrapped = JSON.parse(raw);
    const text = decodePayload(wrapped);
    if (!text) return null;
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function writeCache(cache) {
  const normalized = cache && typeof cache === 'object' ? cache : null;
  const filePath = getCacheFilePath();
  ensureParentDir(filePath);

  if (!normalized) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return null;
  }

  const text = JSON.stringify(normalized, null, 2);
  const wrapped = encodePayload(text);
  fs.writeFileSync(filePath, JSON.stringify(wrapped), 'utf8');
  return normalized;
}

function clearCache() {
  const filePath = getCacheFilePath();
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  return true;
}

function getDeviceInfo() {
  return {
    deviceName: os.hostname() || process.env.COMPUTERNAME || 'desktop-windows',
    appVersion: app.getVersion(),
  };
}

module.exports = {
  readCache,
  writeCache,
  clearCache,
  getDeviceInfo,
};
