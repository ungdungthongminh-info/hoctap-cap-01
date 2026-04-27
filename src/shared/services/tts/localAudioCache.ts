import type { TtsPolicyId } from './ttsPolicy';

const DB_NAME = 'hhk_tts_audio_cache';
const STORE_NAME = 'audio_entries';
const DB_VERSION = 1;

export interface LocalTtsCacheDescriptor {
  text: string;
  lang: string;
  voiceId: string;
  speed: number;
  usage: TtsPolicyId;
  contentVersion?: string;
}

export interface LocalTtsCacheEntry {
  key: string;
  blob: Blob;
  textHash: string;
  lang: string;
  voiceId: string;
  speed: number;
  usage: TtsPolicyId;
  contentVersion: string;
  mimeType: string;
  byteSize: number;
  createdAt: number;
  updatedAt: number;
}

function isIndexedDbAvailable(): boolean {
  return typeof indexedDB !== 'undefined';
}

function normalizeContentVersion(value?: string): string {
  return String(value || import.meta.env.VITE_APP_CONTENT_VERSION || '2026-04-27-v1').trim() || '2026-04-27-v1';
}

function openDb(): Promise<IDBDatabase | null> {
  if (!isIndexedDbAvailable()) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error || new Error('Failed to open local TTS cache.'));
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
}

function runStoreRequest<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then((db) => new Promise<T>((resolve, reject) => {
    if (!db) {
      reject(new Error('IndexedDB is unavailable.'));
      return;
    }

    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const request = action(store);
    request.onerror = () => reject(request.error || new Error('IndexedDB request failed.'));
    request.onsuccess = () => resolve(request.result);
    tx.oncomplete = () => db.close();
    tx.onerror = () => {
      db.close();
      reject(tx.error || new Error('IndexedDB transaction failed.'));
    };
    tx.onabort = () => {
      db.close();
      reject(tx.error || new Error('IndexedDB transaction aborted.'));
    };
  }));
}

function fallbackHash(input: string): string {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

async function sha256Hex(input: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoded = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  return fallbackHash(input);
}

export async function buildLocalTtsCacheKey(descriptor: LocalTtsCacheDescriptor): Promise<{ key: string; textHash: string }> {
  const normalizedText = String(descriptor.text || '').trim();
  const textHash = await sha256Hex(normalizedText);
  const key = [
    normalizeContentVersion(descriptor.contentVersion),
    descriptor.lang,
    descriptor.voiceId,
    descriptor.speed.toFixed(2),
    descriptor.usage,
    textHash,
  ].join('::');

  return { key, textHash };
}

export async function getLocalTtsAudioBlob(descriptor: LocalTtsCacheDescriptor): Promise<Blob | null> {
  if (!isIndexedDbAvailable()) {
    return null;
  }

  const { key } = await buildLocalTtsCacheKey(descriptor);
  const entry = await runStoreRequest<LocalTtsCacheEntry | undefined>('readonly', (store) => store.get(key));
  return entry?.blob || null;
}

export async function storeLocalTtsAudioBlob(descriptor: LocalTtsCacheDescriptor, blob: Blob): Promise<void> {
  if (!isIndexedDbAvailable()) {
    return;
  }

  const { key, textHash } = await buildLocalTtsCacheKey(descriptor);
  const now = Date.now();
  const existing = await runStoreRequest<LocalTtsCacheEntry | undefined>('readonly', (store) => store.get(key)).catch(() => undefined);
  const entry: LocalTtsCacheEntry = {
    key,
    blob,
    textHash,
    lang: descriptor.lang,
    voiceId: descriptor.voiceId,
    speed: descriptor.speed,
    usage: descriptor.usage,
    contentVersion: normalizeContentVersion(descriptor.contentVersion),
    mimeType: blob.type || 'audio/mpeg',
    byteSize: blob.size,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  await runStoreRequest<IDBValidKey>('readwrite', (store) => store.put(entry)).then(() => undefined);
}

export async function storeLocalTtsAudioFromUrl(descriptor: LocalTtsCacheDescriptor, audioUrl: string): Promise<Blob | null> {
  if (!audioUrl) return null;

  const response = await fetch(audioUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch audio for local cache (${response.status}).`);
  }

  const blob = await response.blob();
  await storeLocalTtsAudioBlob(descriptor, blob);
  return blob;
}

export async function clearLocalTtsAudioCache(): Promise<{ deletedEntries: number }> {
  if (!isIndexedDbAvailable()) {
    return { deletedEntries: 0 };
  }

  const db = await openDb();
  if (!db) {
    return { deletedEntries: 0 };
  }

  return new Promise<{ deletedEntries: number }>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const countRequest = store.count();

    countRequest.onerror = () => reject(countRequest.error || new Error('Failed to count local audio cache.'));
    countRequest.onsuccess = () => {
      const deletedEntries = Number(countRequest.result || 0);
      const clearRequest = store.clear();
      clearRequest.onerror = () => reject(clearRequest.error || new Error('Failed to clear local audio cache.'));
      clearRequest.onsuccess = () => resolve({ deletedEntries });
    };

    tx.oncomplete = () => db.close();
    tx.onerror = () => {
      db.close();
      reject(tx.error || new Error('Failed to clear local audio cache.'));
    };
    tx.onabort = () => {
      db.close();
      reject(tx.error || new Error('Failed to clear local audio cache.'));
    };
  });
}

export async function getLocalTtsAudioCacheStats(): Promise<{ entries: number; totalBytes: number }> {
  if (!isIndexedDbAvailable()) {
    return { entries: 0, totalBytes: 0 };
  }

  const db = await openDb();
  if (!db) {
    return { entries: 0, totalBytes: 0 };
  }

  return new Promise<{ entries: number; totalBytes: number }>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error || new Error('Failed to read local audio cache stats.'));
    request.onsuccess = () => {
      const entries = (request.result || []) as LocalTtsCacheEntry[];
      resolve({
        entries: entries.length,
        totalBytes: entries.reduce((sum, entry) => sum + Number(entry.byteSize || entry.blob?.size || 0), 0),
      });
    };

    tx.oncomplete = () => db.close();
    tx.onerror = () => {
      db.close();
      reject(tx.error || new Error('Failed to read local audio cache stats.'));
    };
  });
}
