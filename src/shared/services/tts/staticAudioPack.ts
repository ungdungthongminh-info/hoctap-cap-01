import type { StaticTtsManifestFile, StaticTtsManifestEntry } from './staticTtsManifest';
import { unzipSync } from 'fflate';
import { STORAGE_KEYS as APP_STORAGE_KEYS } from '../../constants/storageKeys';
import { BACKEND_API_BASE } from '../webTotalBridge';

const DB_NAME = 'hhk_tts_static_pack';
const DB_VERSION = 1;
const ASSET_STORE = 'assets';
const META_STORE = 'meta';

const STORAGE_KEYS = {
  manifestUrl: 'hhk_tts_pack_manifest_url',
  autoSync: 'hhk_tts_pack_auto_sync',
  selectedGrade: 'hhk_tts_pack_selected_grade',
} as const;

const META_IDS = {
  manifest: 'manifest',
  state: 'state',
  assetIndex: 'asset_index',
} as const;

interface StaticPackAssetRecord {
  key: string;
  blob: Blob;
  byteSize: number;
  updatedAt: number;
}

interface StaticPackMetaRecord<T> {
  id: string;
  value: T;
  updatedAt: number;
}

interface StaticPackState {
  manifestUrl: string;
  contentVersion: string;
  totalEntries: number;
  availableEntries: number;
  downloadedEntries: number;
  totalBytes: number;
  updatedAt: string;
}

export interface StaticAudioPackStats {
  manifestUrl: string;
  hasManifest: boolean;
  contentVersion: string;
  totalEntries: number;
  availableEntries: number;
  downloadedEntries: number;
  missingEntries: number;
  totalBytes: number;
  updatedAt: string;
}

export interface StaticPackSyncProgress {
  phase: 'manifest' | 'downloading' | 'finalizing';
  totalEntries: number;
  processedEntries: number;
  downloadedEntries: number;
  skippedEntries: number;
  failedEntries: number;
  currentKey?: string;
}

export interface StaticPackSyncOptions {
  manifestUrl?: string;
  profileId?: string;
  maxEntries?: number;
  forceRedownload?: boolean;
  onProgress?: (progress: StaticPackSyncProgress) => void;
}

export interface StaticPackSyncResult {
  status: 'up-to-date' | 'completed';
  manifestUrl: string;
  contentVersion: string;
  totalEntries: number;
  availableEntries: number;
  processedEntries: number;
  downloadedEntries: number;
  skippedEntries: number;
  failedEntries: number;
  totalBytes: number;
}

export interface StaticPackGlobalSyncStatus {
  phase: 'idle' | 'syncing' | 'success' | 'error';
  message: string;
  hint: string;
  progress: StaticPackSyncProgress | null;
  canRetry: boolean;
  updatedAt: number;
}

type StaticPackSourceType = 'manifest' | 'zip';

interface StaticPackSource {
  manifestUrl: string;
  manifest: StaticTtsManifestFile;
  sourceType: StaticPackSourceType;
  zipAssets?: Map<string, Uint8Array>;
}

let autoSyncPromise: Promise<StaticPackSyncResult | null> | null = null;
const syncStatusListeners = new Set<() => void>();
let globalSyncStatus: StaticPackGlobalSyncStatus = {
  phase: 'idle',
  message: '',
  hint: '',
  progress: null,
  canRetry: false,
  updatedAt: Date.now(),
};

const ALL_GRADES_BUNDLE_URL = 'bundle://tts-static-pack/all-grades';
const ALL_GRADE_PACKS = [0, 1, 2, 3, 4, 5] as const;

function buildPackProxyUrl(grade: number): string {
  return `${BACKEND_API_BASE}/tts/static-pack/by-grade/${grade}`;
}

const GRADE_PACK_LINKS: Partial<Record<number, string>> = {
  0: buildPackProxyUrl(0),
  1: buildPackProxyUrl(1),
  2: buildPackProxyUrl(2),
  3: buildPackProxyUrl(3),
  4: buildPackProxyUrl(4),
  5: buildPackProxyUrl(5),
  6: buildPackProxyUrl(0),
};

export const STATIC_PACK_GRADE_OPTIONS: Array<{ grade: number; label: string }> = [
  { grade: 0, label: 'Tien Tieu Hoc (Lop La)' },
  { grade: 1, label: 'Lop 1' },
  { grade: 2, label: 'Lop 2' },
  { grade: 3, label: 'Lop 3' },
  { grade: 4, label: 'Lop 4' },
  { grade: 5, label: 'Lop 5' },
];

function normalizePackGrade(value: unknown): number {
  const grade = Number(value);
  if (Number.isFinite(grade) && GRADE_PACK_LINKS[grade] !== undefined) {
    return grade;
  }
  return 1;
}

function buildSyncHint(phase: StaticPackGlobalSyncStatus['phase']): string {
  if (phase === 'syncing') {
    return 'Dang tai goi tieng doc day du cho moi lop. Ban co the tiep tuc hoc trong khi he thong tai ve.';
  }
  if (phase === 'success') {
    return 'Da tai xong goi tieng doc day du. Ban co the nghe cho moi lop tren trinh duyet nay.';
  }
  if (phase === 'error') {
    return 'Khong the tai goi tieng doc day du. Kiem tra mang, sau do bam Thu lai.';
  }
  return '';
}

function emitSyncStatus(): void {
  syncStatusListeners.forEach((listener) => listener());
}

function setGlobalSyncStatus(patch: Partial<StaticPackGlobalSyncStatus>): void {
  globalSyncStatus = {
    ...globalSyncStatus,
    ...patch,
    updatedAt: Date.now(),
  };
  emitSyncStatus();
}

export function getStaticPackGlobalSyncStatus(): StaticPackGlobalSyncStatus {
  return { ...globalSyncStatus };
}

export function subscribeStaticPackGlobalSyncStatus(listener: () => void): () => void {
  syncStatusListeners.add(listener);
  return () => {
    syncStatusListeners.delete(listener);
  };
}

export function dismissStaticPackGlobalSyncStatus(): void {
  setGlobalSyncStatus({
    phase: 'idle',
    message: '',
    hint: '',
    progress: null,
    canRetry: false,
  });
}

function parseStudentGradeFromStoredState(): number | null {
  try {
    const raw = localStorage.getItem(APP_STORAGE_KEYS.APP_STATE);
    if (!raw) {
      return null;
    }
    const payload = JSON.parse(raw) as { student?: { grade?: unknown } };
    const grade = Number(payload?.student?.grade);
    return Number.isFinite(grade) ? grade : null;
  } catch {
    return null;
  }
}

function resolveDefaultPackUrlByGrade(): string {
  return ALL_GRADES_BUNDLE_URL;
}

export function getStaticPackSelectedGrade(): number {
  const selectedGradeRaw = safeStorageGet(STORAGE_KEYS.selectedGrade);
  if (selectedGradeRaw) {
    return normalizePackGrade(selectedGradeRaw);
  }

  const gradeFromState = parseStudentGradeFromStoredState();
  return normalizePackGrade(gradeFromState);
}

export function setStaticPackSelectedGrade(grade: number): number {
  const normalizedGrade = normalizePackGrade(grade);
  safeStorageSet(STORAGE_KEYS.selectedGrade, String(normalizedGrade));
  return normalizedGrade;
}

export function getStaticPackUrlByGrade(grade: number): string {
  const normalizedGrade = normalizePackGrade(grade);
  return normalizeManifestUrl(String(GRADE_PACK_LINKS[normalizedGrade] || GRADE_PACK_LINKS[1] || ''));
}

function normalizeGoogleDriveUrl(value: string): string {
  const raw = String(value || '').trim();
  if (!raw) {
    return raw;
  }

  try {
    const parsed = new URL(raw, window.location.href);
    const host = parsed.hostname.toLowerCase();
    if (!host.includes('drive.google.com')) {
      return parsed.toString();
    }

    const path = parsed.pathname;
    const directId =
      parsed.searchParams.get('id')
      || path.match(/\/file\/d\/([^/]+)/)?.[1]
      || path.match(/\/d\/([^/]+)/)?.[1]
      || '';
    if (directId) {
      return `https://drive.google.com/uc?export=download&id=${directId}`;
    }

    return parsed.toString();
  } catch {
    return raw;
  }
}

function defaultManifestUrl(): string {
  const fromEnv = String(import.meta.env.VITE_TTS_PACK_MANIFEST_URL || '').trim();
  if (fromEnv) {
    return normalizeGoogleDriveUrl(fromEnv);
  }

  const fromGradePack = resolveDefaultPackUrlByGrade();
  if (fromGradePack) {
    return normalizeGoogleDriveUrl(fromGradePack);
  }

  return `${import.meta.env.BASE_URL || '/'}audio/tts/manifest.json`.replace(/([^:]\/)\/+/g, '$1');
}

function getBundledManifestUrl(): string {
  return `${import.meta.env.BASE_URL || '/'}audio/tts/manifest.json`.replace(/([^:]\/)\/+/g, '$1');
}

function safeStorageGet(key: string): string {
  try {
    return localStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

function safeStorageSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage quota errors.
  }
}

function isNonAudioPackUrl(value: string): boolean {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  return normalized.includes('/#/pricing')
    || normalized.includes('/pricing')
    || normalized.includes('tab=downloads')
    || normalized.includes('/account?')
    || normalized.includes('/desktop-updates/')
    || normalized.endsWith('/app-update.json');
}

function normalizeManifestUrl(value: string): string {
  const raw = String(value || '').trim();
  if (!raw) {
    return defaultManifestUrl();
  }

  if (raw === ALL_GRADES_BUNDLE_URL) {
    return raw;
  }

  if (isNonAudioPackUrl(raw)) {
    return defaultManifestUrl();
  }

  try {
    const resolved = new URL(raw, window.location.href).toString();
    if (isNonAudioPackUrl(resolved)) {
      return defaultManifestUrl();
    }
    return normalizeGoogleDriveUrl(resolved);
  } catch {
    return normalizeGoogleDriveUrl(raw);
  }
}

function isPresetPackUrl(value: string): boolean {
  const normalized = normalizeGoogleDriveUrl(String(value || '').trim());
  if (!normalized) {
    return false;
  }
  return Object.values(GRADE_PACK_LINKS).some((item) => normalizeGoogleDriveUrl(String(item || '')) === normalized);
}

function isLegacyLocalManifestUrl(value: string): boolean {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized) {
    return false;
  }
  return normalized.endsWith('/audio/tts/manifest.json')
    || normalized.endsWith('\\audio\\tts\\manifest.json')
    || normalized === 'audio/tts/manifest.json'
    || normalized === './audio/tts/manifest.json';
}

function isLegacyBackendGradePackUrl(value: string): boolean {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized) {
    return false;
  }
  return /\/api\/v1\/tts\/static-pack\/by-grade\/\d+/.test(normalized);
}

export function getStaticPackRecommendedUrl(): string {
  return normalizeManifestUrl(resolveDefaultPackUrlByGrade());
}

export function getStaticPackRecommendedLabel(): string {
  return 'Goi day du moi lop';
}

export function getStaticPackManifestUrl(): string {
  const storedRaw = safeStorageGet(STORAGE_KEYS.manifestUrl);
  if (!storedRaw) {
    return getStaticPackRecommendedUrl();
  }
  const normalizedStored = normalizeManifestUrl(storedRaw);
  if (
    isLegacyLocalManifestUrl(normalizedStored)
    || isLegacyBackendGradePackUrl(normalizedStored)
    || isPresetPackUrl(normalizedStored)
  ) {
    // Auto-follow grade pack presets instead of pinning an old grade URL.
    return getStaticPackRecommendedUrl();
  }
  return normalizedStored;
}

export function setStaticPackManifestUrl(manifestUrl: string): string {
  const normalized = normalizeManifestUrl(manifestUrl);
  safeStorageSet(STORAGE_KEYS.manifestUrl, normalized);
  return normalized;
}

export function isStaticPackAutoSyncEnabled(): boolean {
  const raw = safeStorageGet(STORAGE_KEYS.autoSync);
  if (!raw) {
    return true;
  }
  return raw !== '0';
}

export function setStaticPackAutoSyncEnabled(enabled: boolean): void {
  safeStorageSet(STORAGE_KEYS.autoSync, enabled ? '1' : '0');
}

function openDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error || new Error('Failed to open static audio pack DB.'));
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(ASSET_STORE)) {
        const store = db.createObjectStore(ASSET_STORE, { keyPath: 'key' });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        const store = db.createObjectStore(META_STORE, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
}

async function withDb<T>(fn: (db: IDBDatabase) => Promise<T>): Promise<T> {
  const db = await openDb();
  if (!db) {
    throw new Error('IndexedDB is unavailable.');
  }

  try {
    return await fn(db);
  } finally {
    db.close();
  }
}

function runRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onerror = () => reject(request.error || new Error('IndexedDB request failed.'));
    request.onsuccess = () => resolve(request.result);
  });
}

async function readMeta<T>(id: string): Promise<T | null> {
  return withDb(async (db) => {
    const tx = db.transaction(META_STORE, 'readonly');
    const record = await runRequest<StaticPackMetaRecord<T> | undefined>(
      tx.objectStore(META_STORE).get(id),
    ).catch(() => undefined);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error('IndexedDB transaction failed.'));
      tx.onabort = () => reject(tx.error || new Error('IndexedDB transaction aborted.'));
    });
    return record?.value || null;
  }).catch(() => null);
}

async function writeMeta<T>(id: string, value: T): Promise<void> {
  await withDb(async (db) => {
    const tx = db.transaction(META_STORE, 'readwrite');
    tx.objectStore(META_STORE).put({
      id,
      value,
      updatedAt: Date.now(),
    } as StaticPackMetaRecord<T>);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error('IndexedDB transaction failed.'));
      tx.onabort = () => reject(tx.error || new Error('IndexedDB transaction aborted.'));
    });
  });
}

async function upsertAssetWithDb(db: IDBDatabase, key: string, blob: Blob): Promise<number> {
  const tx = db.transaction(ASSET_STORE, 'readwrite');
  const store = tx.objectStore(ASSET_STORE);
  const existing = await runRequest<StaticPackAssetRecord | undefined>(store.get(key)).catch(() => undefined);
  store.put({
    key,
    blob,
    byteSize: blob.size,
    updatedAt: Date.now(),
  } as StaticPackAssetRecord);
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('IndexedDB transaction failed.'));
    tx.onabort = () => reject(tx.error || new Error('IndexedDB transaction aborted.'));
  });
  return Number(existing?.byteSize || 0);
}

async function getAssetBlobWithDb(db: IDBDatabase, key: string): Promise<Blob | null> {
  const tx = db.transaction(ASSET_STORE, 'readonly');
  const record = await runRequest<StaticPackAssetRecord | undefined>(
    tx.objectStore(ASSET_STORE).get(key),
  ).catch(() => undefined);
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('IndexedDB transaction failed.'));
    tx.onabort = () => reject(tx.error || new Error('IndexedDB transaction aborted.'));
  });
  return record?.blob || null;
}

function resolveEntryAudioUrl(entry: { assetPath: string; audioUrl?: string }, manifestUrl: string): string {
  const fromEntry = String(entry.audioUrl || '').trim();
  if (fromEntry) {
    try {
      return new URL(fromEntry, manifestUrl).toString();
    } catch {
      return fromEntry;
    }
  }

  const assetPath = String(entry.assetPath || '').trim();
  if (!assetPath) {
    return '';
  }

  try {
    return new URL(assetPath.replace(/^\/+/, ''), manifestUrl).toString();
  } catch {
    return assetPath;
  }
}

function normalizeAssetPath(value: string): string {
  return String(value || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/^\.\//, '');
}

function isAllGradesBundleUrl(value: string): boolean {
  return String(value || '').trim() === ALL_GRADES_BUNDLE_URL;
}

function isZipSignature(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 4
    && bytes[0] === 0x50
    && bytes[1] === 0x4b
    && (bytes[2] === 0x03 || bytes[2] === 0x05 || bytes[2] === 0x07)
    && (bytes[3] === 0x04 || bytes[3] === 0x06 || bytes[3] === 0x08)
  );
}

function decodeUtf8(bytes: Uint8Array): string {
  return new TextDecoder('utf-8').decode(bytes);
}

async function fetchPayloadBytesWithDriveFallback(
  candidateUrl: string,
): Promise<{ bytes: Uint8Array; finalUrl: string } | null> {
  const response = await fetch(candidateUrl, { cache: 'no-cache' });
  if (!response.ok) {
    return null;
  }

  let payloadBytes = new Uint8Array(await response.arrayBuffer());
  if (!payloadBytes.length) {
    return null;
  }

  if (isZipSignature(payloadBytes)) {
    return { bytes: payloadBytes, finalUrl: candidateUrl };
  }

  const contentType = String(response.headers.get('content-type') || '').toLowerCase();
  const looksLikeHtml = contentType.includes('text/html') || contentType.includes('application/xhtml');
  if (!looksLikeHtml) {
    return { bytes: payloadBytes, finalUrl: candidateUrl };
  }

  // Drive returned an HTML confirmation page. Direct Drive fetches from the browser
  // are CORS-blocked, so we cannot follow the confirm token from client side.
  // Return null to surface a clear error and let the caller try the next candidate.
  return null;
}

function normalizeManifest(
  manifest: StaticTtsManifestFile,
  manifestUrl: string,
): StaticTtsManifestFile {
  const normalizedEntries: StaticTtsManifestFile['entries'] = {};
  Object.entries(manifest.entries || {}).forEach(([key, entry]) => {
    normalizedEntries[key] = {
      ...entry,
      key,
      audioUrl: resolveEntryAudioUrl(entry, manifestUrl),
    };
  });

  return {
    ...manifest,
    entries: normalizedEntries,
  };
}

function isLikelyManifest(value: unknown): value is StaticTtsManifestFile {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const cast = value as Partial<StaticTtsManifestFile>;
  return Boolean(cast.meta && cast.summary && cast.entries && typeof cast.entries === 'object');
}

function parseStaticPackZip(bytes: Uint8Array, manifestUrl: string): StaticPackSource | null {
  try {
    const rawFiles = unzipSync(bytes);
    const files = new Map<string, Uint8Array>();
    Object.entries(rawFiles).forEach(([filePath, fileBytes]) => {
      const normalizedPath = normalizeAssetPath(filePath);
      if (!normalizedPath) {
        return;
      }
      files.set(normalizedPath, fileBytes);
    });

    let manifestBytes = files.get('manifest.json');
    if (!manifestBytes) {
      const nestedManifestPath = Array.from(files.keys()).find((item) => item.toLowerCase().endsWith('/manifest.json'));
      if (nestedManifestPath) {
        manifestBytes = files.get(nestedManifestPath);
      }
    }

    if (!manifestBytes) {
      return null;
    }

    const payload = JSON.parse(decodeUtf8(manifestBytes));
    if (!isLikelyManifest(payload)) {
      return null;
    }

    return {
      manifestUrl,
      manifest: normalizeManifest(payload, manifestUrl),
      sourceType: 'zip',
      zipAssets: files,
    };
  } catch {
    return null;
  }
}

async function fetchStaticPackSource(manifestUrl?: string): Promise<StaticPackSource | null> {
  const resolvedUrl = normalizeManifestUrl(manifestUrl || getStaticPackManifestUrl());
  if (isAllGradesBundleUrl(resolvedUrl)) {
    const sources: StaticPackSource[] = [];
    for (const grade of ALL_GRADE_PACKS) {
      const gradeSource = await fetchStaticPackSource(getStaticPackUrlByGrade(grade));
      if (!gradeSource) {
        // Emergency fallback: use bundled static manifest/assets from current web build
        // when production backend static-pack route is not ready.
        return fetchStaticPackSource(getBundledManifestUrl());
      }
      sources.push(gradeSource);
    }

    const mergedEntries: StaticTtsManifestFile['entries'] = {};
    const mergedZipAssets = new Map<string, Uint8Array>();
    const voiceProfileMap = new Map<string, StaticTtsManifestFile['summary']['voiceProfiles'][number]>();
    const auditSampleMap = new Map<string, StaticTtsManifestFile['summary']['auditSamples'][number]>();
    const usageMap = new Map<string, { usage: string; total: number; available: number }>();
    const contentVersions = new Set<string>();
    const generatedAtCandidates: string[] = [];
    let defaultProfileId = '';
    let allZip = true;

    sources.forEach((source) => {
      Object.entries(source.manifest.entries || {}).forEach(([key, entry]) => {
        mergedEntries[key] = entry;
      });

      (source.manifest.summary?.voiceProfiles || []).forEach((profile) => {
        if (!voiceProfileMap.has(profile.id)) {
          voiceProfileMap.set(profile.id, profile);
        }
      });

      (source.manifest.summary?.auditSamples || []).forEach((sample) => {
        const sampleKey = `${sample.profileId}:${sample.sampleId}`;
        if (!auditSampleMap.has(sampleKey)) {
          auditSampleMap.set(sampleKey, sample);
        }
      });

      (source.manifest.summary?.byUsage || []).forEach((item) => {
        const usage = String(item.usage || '').trim();
        if (!usage) return;
        const current = usageMap.get(usage) || { usage, total: 0, available: 0 };
        current.total += Number(item.total || 0);
        current.available += Number(item.available || 0);
        usageMap.set(usage, current);
      });

      const version = String(source.manifest.summary?.contentVersion || source.manifest.meta?.contentVersion || '').trim();
      if (version) {
        contentVersions.add(version);
      }

      const generatedAt = String(source.manifest.summary?.generatedAt || source.manifest.meta?.generatedAt || '').trim();
      if (generatedAt) {
        generatedAtCandidates.push(generatedAt);
      }

      if (!defaultProfileId) {
        defaultProfileId = String(source.manifest.summary?.defaultProfileId || source.manifest.meta?.defaultProfileId || '').trim();
      }

      if (source.sourceType === 'zip') {
        source.zipAssets?.forEach((bytes, assetPath) => {
          if (!mergedZipAssets.has(assetPath)) {
            mergedZipAssets.set(assetPath, bytes);
          }
        });
      } else {
        allZip = false;
      }
    });

    const totalEntries = Object.keys(mergedEntries).length;
    const availableEntries = Object.values(mergedEntries).filter((entry) => Boolean(entry.available)).length;
    const contentVersion = contentVersions.size === 1
      ? Array.from(contentVersions)[0]
      : Array.from(contentVersions).join('+');
    const generatedAt = generatedAtCandidates.sort().slice(-1)[0] || '';

    return {
      manifestUrl: ALL_GRADES_BUNDLE_URL,
      manifest: {
        meta: {
          contentVersion,
          generatedAt,
          defaultProfileId,
          audioBasePath: 'bundle://tts-static-pack/assets',
        },
        summary: {
          totalEntries,
          availableEntries,
          missingEntries: Math.max(0, totalEntries - availableEntries),
          defaultProfileId,
          contentVersion,
          generatedAt,
          audioBasePath: 'bundle://tts-static-pack/assets',
          voiceProfiles: Array.from(voiceProfileMap.values()),
          auditSamples: Array.from(auditSampleMap.values()),
          byUsage: Array.from(usageMap.values()),
        },
        entries: mergedEntries,
      },
      sourceType: allZip ? 'zip' : 'manifest',
      zipAssets: allZip ? mergedZipAssets : undefined,
    };
  }

  const candidateUrls = [resolvedUrl];

  for (const candidateUrl of candidateUrls) {
    try {
      const payloadResult = await fetchPayloadBytesWithDriveFallback(candidateUrl);
      if (!payloadResult) {
        continue;
      }
      const payloadBytes = payloadResult.bytes;
      if (!payloadBytes.length) {
        continue;
      }

      if (isZipSignature(payloadBytes)) {
        const zipSource = parseStaticPackZip(payloadBytes, payloadResult.finalUrl);
        if (zipSource) {
          return zipSource;
        }
        continue;
      }

      const payload = JSON.parse(decodeUtf8(payloadBytes));
      if (!isLikelyManifest(payload)) {
        continue;
      }

      return {
        manifestUrl: payloadResult.finalUrl,
        manifest: normalizeManifest(payload, payloadResult.finalUrl),
        sourceType: 'manifest',
      };
    } catch {
      // Try next candidate.
    }
  }

  return null;
}

export async function fetchStaticPackManifest(manifestUrl?: string): Promise<StaticTtsManifestFile | null> {
  const source = await fetchStaticPackSource(manifestUrl);
  return source?.manifest || null;
}

export async function getCachedStaticPackManifest(): Promise<StaticTtsManifestFile | null> {
  const manifest = await readMeta<StaticTtsManifestFile>(META_IDS.manifest);
  return manifest && isLikelyManifest(manifest) ? manifest : null;
}

export async function getStaticPackAudioBlob(assetKey: string): Promise<Blob | null> {
  const safeKey = String(assetKey || '').trim();
  if (!safeKey) {
    return null;
  }

  return withDb(async (db) => {
    const tx = db.transaction(ASSET_STORE, 'readonly');
    const record = await runRequest<StaticPackAssetRecord | undefined>(
      tx.objectStore(ASSET_STORE).get(safeKey),
    ).catch(() => undefined);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error('IndexedDB transaction failed.'));
      tx.onabort = () => reject(tx.error || new Error('IndexedDB transaction aborted.'));
    });
    const blob = record?.blob || null;
    return isLikelyAudioBlob(blob) ? blob : null;
  }).catch(() => null);
}

function toStateFromManifest(
  manifest: StaticTtsManifestFile,
  manifestUrl: string,
  downloadedEntries: number,
  totalBytes: number,
): StaticPackState {
  const availableEntries = Object.values(manifest.entries || {}).filter((entry) => entry.available).length;
  return {
    manifestUrl,
    contentVersion: String(manifest.summary?.contentVersion || manifest.meta?.contentVersion || ''),
    totalEntries: Number(manifest.summary?.totalEntries || Object.keys(manifest.entries || {}).length),
    availableEntries,
    downloadedEntries,
    totalBytes,
    updatedAt: new Date().toISOString(),
  };
}

function toStats(state: StaticPackState | null): StaticAudioPackStats {
  if (!state) {
    return {
      manifestUrl: getStaticPackManifestUrl(),
      hasManifest: false,
      contentVersion: '',
      totalEntries: 0,
      availableEntries: 0,
      downloadedEntries: 0,
      missingEntries: 0,
      totalBytes: 0,
      updatedAt: '',
    };
  }

  return {
    manifestUrl: state.manifestUrl,
    hasManifest: true,
    contentVersion: state.contentVersion,
    totalEntries: state.totalEntries,
    availableEntries: state.availableEntries,
    downloadedEntries: state.downloadedEntries,
    missingEntries: Math.max(0, state.availableEntries - state.downloadedEntries),
    totalBytes: state.totalBytes,
    updatedAt: state.updatedAt,
  };
}

export async function getStaticAudioPackStats(): Promise<StaticAudioPackStats> {
  const state = await readMeta<StaticPackState>(META_IDS.state);
  return toStats(state);
}

async function clearStore(storeName: string): Promise<void> {
  await withDb(async (db) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).clear();
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error('IndexedDB transaction failed.'));
      tx.onabort = () => reject(tx.error || new Error('IndexedDB transaction aborted.'));
    });
  });
}

export async function clearStaticAudioPack(): Promise<void> {
  await Promise.all([
    clearStore(ASSET_STORE).catch(() => undefined),
    clearStore(META_STORE).catch(() => undefined),
  ]);
}

function pickEntriesToSync(
  manifest: StaticTtsManifestFile,
  options: StaticPackSyncOptions,
): Array<StaticTtsManifestEntry> {
  const profileFilter = String(options.profileId || '').trim();
  const maxEntries = Number(options.maxEntries || 0);
  const list = Object.values(manifest.entries || {})
    .filter((entry) => entry.available)
    .filter((entry) => (profileFilter ? entry.profileId === profileFilter : true))
    .map((entry) => ({
      ...entry,
      audioUrl: String(entry.audioUrl || ''),
    }));

  if (maxEntries > 0) {
    return list.slice(0, maxEntries);
  }

  return list;
}

function guessMimeTypeFromPath(assetPath: string): string {
  const lower = normalizeAssetPath(assetPath).toLowerCase();
  if (lower.endsWith('.mp3')) return 'audio/mpeg';
  if (lower.endsWith('.wav')) return 'audio/wav';
  if (lower.endsWith('.ogg')) return 'audio/ogg';
  return 'application/octet-stream';
}

function isAudioLikeContentType(contentType: string): boolean {
  const normalized = String(contentType || '').trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return normalized.startsWith('audio/')
    || normalized.includes('octet-stream')
    || normalized.includes('mpeg');
}

function isLikelyAudioBlob(blob: Blob | null | undefined): boolean {
  if (!blob || blob.size <= 0) {
    return false;
  }

  const normalized = String(blob.type || '').trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return isAudioLikeContentType(normalized);
}

async function fetchValidatedAudioBlob(audioUrl: string): Promise<Blob> {
  const response = await fetch(audioUrl, { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const contentType = String(response.headers.get('content-type') || '').toLowerCase();
  if (!isAudioLikeContentType(contentType)) {
    throw new Error(`Invalid audio content-type: ${contentType || 'unknown'}`);
  }

  const blob = await response.blob();
  if (!isLikelyAudioBlob(blob)) {
    throw new Error(`Invalid audio blob type: ${blob.type || 'unknown'}`);
  }

  return blob;
}

export async function syncStaticAudioPack(options: StaticPackSyncOptions = {}): Promise<StaticPackSyncResult> {
  const manifestUrl = normalizeManifestUrl(options.manifestUrl || getStaticPackManifestUrl());
  setGlobalSyncStatus({
    phase: 'syncing',
    message: 'Dang tai goi tieng doc day du...',
    hint: buildSyncHint('syncing'),
    progress: {
      phase: 'manifest',
      totalEntries: 0,
      processedEntries: 0,
      downloadedEntries: 0,
      skippedEntries: 0,
      failedEntries: 0,
    },
    canRetry: false,
  });
  options.onProgress?.({
    phase: 'manifest',
    totalEntries: 0,
    processedEntries: 0,
    downloadedEntries: 0,
    skippedEntries: 0,
    failedEntries: 0,
  });

  const source = await fetchStaticPackSource(manifestUrl);
  if (!source) {
    throw new Error(
      'Khong tai duoc goi tieng doc day du tu backend hoac goi tich hop san. Kiem tra mang va thu lai.',
    );
  }
  const manifest = source.manifest;

  const state = await readMeta<StaticPackState>(META_IDS.state);
  const nextContentVersion = String(manifest.summary?.contentVersion || manifest.meta?.contentVersion || '');
  let assetIndex = await readMeta<Record<string, string>>(META_IDS.assetIndex) || {};
  let totalBytesFromState = Number(state?.totalBytes || 0);

  if (state && (state.manifestUrl !== manifestUrl || state.contentVersion !== nextContentVersion)) {
    await clearStore(ASSET_STORE).catch(() => undefined);
    assetIndex = {};
    totalBytesFromState = 0;
  }

  const availableEntries = Object.values(manifest.entries || {}).filter((entry) => entry.available).length;
  if (
    !options.forceRedownload
    && state
    && state.manifestUrl === manifestUrl
    && state.contentVersion === nextContentVersion
    && state.downloadedEntries >= availableEntries
  ) {
    const result: StaticPackSyncResult = {
      status: 'up-to-date',
      manifestUrl,
      contentVersion: state.contentVersion,
      totalEntries: state.totalEntries,
      availableEntries: state.availableEntries,
      processedEntries: 0,
      downloadedEntries: 0,
      skippedEntries: state.downloadedEntries,
      failedEntries: 0,
      totalBytes: state.totalBytes,
    };
    setGlobalSyncStatus({
      phase: 'success',
      message: 'Goi tieng doc day du da san sang, khong can tai them.',
      hint: buildSyncHint('success'),
      progress: null,
      canRetry: false,
    });
    return result;
  }

  const entries = pickEntriesToSync(manifest, options);
  const totalEntries = entries.length;

  let processedEntries = 0;
  let downloadedEntries = 0;
  let skippedEntries = 0;
  let failedEntries = 0;
  let totalBytes = totalBytesFromState;
  let pendingIndexWrites = 0;
  const db = await openDb();
  if (!db) {
    throw new Error('Trình duyệt không hỗ trợ IndexedDB để lưu audio pack offline.');
  }

  try {
    for (const entry of entries) {
      const cachedBlob = await getAssetBlobWithDb(db, entry.key).catch(() => null);
      const alreadySynced = assetIndex[entry.key] === entry.textHash && isLikelyAudioBlob(cachedBlob);
      if (alreadySynced && !options.forceRedownload) {
        processedEntries += 1;
        skippedEntries += 1;
        options.onProgress?.({
          phase: 'downloading',
          totalEntries,
          processedEntries,
          downloadedEntries,
          skippedEntries,
          failedEntries,
          currentKey: entry.key,
        });
        continue;
      }

      let blob: Blob | null = null;
      try {
        if (source.sourceType === 'zip') {
          const assetPath = normalizeAssetPath(entry.assetPath);
          const bytes = source.zipAssets?.get(assetPath);
          if (!bytes) {
            throw new Error(`Missing asset in zip: ${assetPath}`);
          }
          const byteCopy = new Uint8Array(bytes.length);
          byteCopy.set(bytes);
          blob = new Blob([byteCopy], { type: guessMimeTypeFromPath(assetPath) });
          if (!isLikelyAudioBlob(blob)) {
            throw new Error(`Invalid bundled audio blob: ${assetPath}`);
          }
        } else {
          blob = await fetchValidatedAudioBlob(entry.audioUrl);
        }
        const previousByteSize = await upsertAssetWithDb(db, entry.key, blob);
        totalBytes += blob.size - previousByteSize;
        if (totalBytes < 0) totalBytes = 0;
        downloadedEntries += 1;
        assetIndex[entry.key] = entry.textHash;
        pendingIndexWrites += 1;
        if (pendingIndexWrites >= 25) {
          await writeMeta(META_IDS.assetIndex, assetIndex);
          pendingIndexWrites = 0;
        }
      } catch {
        failedEntries += 1;
      } finally {
        processedEntries += 1;
        options.onProgress?.({
          phase: 'downloading',
          totalEntries,
          processedEntries,
          downloadedEntries,
          skippedEntries,
          failedEntries,
          currentKey: entry.key,
        });
        setGlobalSyncStatus({
          phase: 'syncing',
          message: `Dang tai audio pack (${processedEntries}/${totalEntries})`,
          hint: buildSyncHint('syncing'),
          progress: {
            phase: 'downloading',
            totalEntries,
            processedEntries,
            downloadedEntries,
            skippedEntries,
            failedEntries,
            currentKey: entry.key,
          },
          canRetry: false,
        });
      }
    }
  } finally {
    db.close();
  }

  options.onProgress?.({
    phase: 'finalizing',
    totalEntries,
    processedEntries,
    downloadedEntries,
    skippedEntries,
    failedEntries,
  });
  setGlobalSyncStatus({
    phase: 'syncing',
    message: 'Dang chot du lieu audio local...',
    hint: buildSyncHint('syncing'),
    progress: {
      phase: 'finalizing',
      totalEntries,
      processedEntries,
      downloadedEntries,
      skippedEntries,
      failedEntries,
    },
    canRetry: false,
  });

  const mergedDownloadedEntries = Object.keys(assetIndex).length;
  const nextState = toStateFromManifest(
    manifest,
    manifestUrl,
    mergedDownloadedEntries,
    totalBytes,
  );

  await writeMeta(META_IDS.assetIndex, assetIndex);
  await writeMeta(META_IDS.manifest, manifest);
  await writeMeta(META_IDS.state, nextState);

  const result: StaticPackSyncResult = {
    status: 'completed',
    manifestUrl,
    contentVersion: nextState.contentVersion,
    totalEntries: nextState.totalEntries,
    availableEntries: nextState.availableEntries,
    processedEntries,
    downloadedEntries,
    skippedEntries,
    failedEntries,
    totalBytes: nextState.totalBytes,
  };

  setGlobalSyncStatus({
    phase: 'success',
    message: `Dong bo audio thanh cong (${result.downloadedEntries} file moi, ${result.skippedEntries} da co san).`,
    hint: buildSyncHint('success'),
    progress: null,
    canRetry: false,
  });

  return result;
}

export async function ensureStaticPackAutoSync(): Promise<StaticPackSyncResult | null> {
  if (!isStaticPackAutoSyncEnabled()) {
    setGlobalSyncStatus({
      phase: 'idle',
      message: '',
      hint: '',
      progress: null,
      canRetry: false,
    });
    return null;
  }

  if (autoSyncPromise) {
    return autoSyncPromise;
  }

  autoSyncPromise = syncStaticAudioPack().catch((error) => {
    const message = error instanceof Error ? error.message : 'Khong the dong bo audio pack.';
    setGlobalSyncStatus({
      phase: 'error',
      message,
      hint: buildSyncHint('error'),
      progress: null,
      canRetry: true,
    });
    return null;
  }).finally(() => {
    autoSyncPromise = null;
  });

  return autoSyncPromise;
}

export async function retryStaticPackAutoSync(): Promise<StaticPackSyncResult | null> {
  return ensureStaticPackAutoSync();
}
