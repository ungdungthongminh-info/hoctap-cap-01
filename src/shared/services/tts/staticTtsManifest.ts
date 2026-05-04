import { getDefaultStaticVoiceProfile, listStaticVoiceProfiles, type StaticTtsVoiceProfile } from './ttsVoiceProfiles';
import { fetchStaticPackManifest, getCachedStaticPackManifest, getStaticPackManifestUrl } from './staticAudioPack';

export interface StaticTtsManifestEntry {
  key: string;
  assetPath: string;
  audioUrl: string;
  lang: string;
  usage: string;
  profileId: string;
  contentVersion: string;
  available: boolean;
  textHash: string;
}

export interface StaticTtsManifestSummary {
  totalEntries: number;
  availableEntries: number;
  missingEntries: number;
  defaultProfileId: string;
  contentVersion: string;
  generatedAt: string;
  audioBasePath: string;
  voiceProfiles: StaticTtsVoiceProfile[];
  auditSamples: Array<{
    key: string;
    label: string;
    profileId: string;
    sampleId: string;
    available: boolean;
  }>;
  byUsage: Array<{
    usage: string;
    total: number;
    available: number;
  }>;
}

export interface StaticTtsManifestFile {
  meta: {
    contentVersion: string;
    generatedAt: string;
    defaultProfileId: string;
    audioBasePath: string;
  };
  summary: StaticTtsManifestSummary;
  entries: Record<string, Omit<StaticTtsManifestEntry, 'audioUrl'> & { audioUrl?: string }>;
}

const STATIC_MANIFEST_PATH = `${import.meta.env.BASE_URL || '/'}audio/tts/manifest.json`.replace(/([^:]\/)\/+/g, '$1');
const DEFAULT_R2_PUBLIC_BASE_URL = 'https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev';
const R2_PUBLIC_BASE_URL = String(import.meta.env.VITE_R2_PUBLIC_BASE_URL || DEFAULT_R2_PUBLIC_BASE_URL).trim().replace(/\/+$/, '');

let manifestPromise: Promise<StaticTtsManifestFile | null> | null = null;

export function invalidateStaticTtsManifestCache(): void {
  manifestPromise = null;
}

function withResolvedAudioUrl(entry: Omit<StaticTtsManifestEntry, 'audioUrl'> & { audioUrl?: string }): StaticTtsManifestEntry {
  const assetPath = String(entry.assetPath || '').replace(/^\/+/, '');
  const host = typeof window !== 'undefined' ? String(window.location.hostname || '').toLowerCase() : '';
  const isWebProduction = Boolean(host && host !== 'localhost' && host !== '127.0.0.1' && host !== '::1' && !(window as any).electronAPI);
  const isLessonCardViV1 = assetPath.startsWith('audio/tts/assets/vi-v1/lesson-card-');
  const audioUrl = (isWebProduction && R2_PUBLIC_BASE_URL && isLessonCardViV1)
    ? `${R2_PUBLIC_BASE_URL}/${assetPath}`
    : (entry.audioUrl || `${import.meta.env.BASE_URL || '/'}${assetPath}`.replace(/([^:]\/)\/+/g, '$1'));
  return {
    ...entry,
    audioUrl,
  };
}

async function fetchManifest(): Promise<StaticTtsManifestFile | null> {
  const cachedPackManifest = await getCachedStaticPackManifest();
  if (cachedPackManifest) {
    return cachedPackManifest;
  }

  const configuredManifestUrl = getStaticPackManifestUrl();
  const configuredManifest = await fetchStaticPackManifest(configuredManifestUrl);
  if (configuredManifest) {
    return configuredManifest;
  }

  try {
    const response = await fetch(STATIC_MANIFEST_PATH, { cache: 'no-cache' });
    if (!response.ok) {
      return null;
    }
    return await response.json() as StaticTtsManifestFile;
  } catch {
    return null;
  }
}

export async function loadStaticTtsManifest(force = false): Promise<StaticTtsManifestFile | null> {
  if (force || !manifestPromise) {
    manifestPromise = fetchManifest();
  }
  const manifest = await manifestPromise;
  if (!force && manifest && Number(manifest.summary?.availableEntries || 0) === 0) {
    manifestPromise = fetchManifest();
    return manifestPromise;
  }
  return manifest;
}

export async function getStaticTtsManifestEntry(assetKey?: string): Promise<StaticTtsManifestEntry | null> {
  if (!assetKey) {
    return null;
  }

  const manifest = await loadStaticTtsManifest();
  const raw = manifest?.entries?.[assetKey];
  return raw ? withResolvedAudioUrl(raw) : null;
}

export async function prefetchStaticTtsAsset(assetKey?: string): Promise<StaticTtsManifestEntry | null> {
  const entry = await getStaticTtsManifestEntry(assetKey);
  if (!entry?.available) {
    return entry;
  }

  try {
    await fetch(entry.audioUrl, { cache: 'force-cache' });
  } catch {
    // Leave runtime fallback decisions to playback.
  }

  return entry;
}

export async function getStaticTtsManifestSummary(): Promise<StaticTtsManifestSummary> {
  const manifest = await loadStaticTtsManifest();
  if (manifest?.summary) {
    return manifest.summary;
  }

  const fallbackProfile = getDefaultStaticVoiceProfile('vi-VN');
  return {
    totalEntries: 0,
    availableEntries: 0,
    missingEntries: 0,
    defaultProfileId: fallbackProfile.id,
    contentVersion: import.meta.env.VITE_APP_CONTENT_VERSION || '2026-04-27-v1',
    generatedAt: '',
    audioBasePath: `${import.meta.env.BASE_URL || '/'}audio/tts/assets`,
    voiceProfiles: listStaticVoiceProfiles(),
    auditSamples: [],
    byUsage: [],
  };
}
