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

function withResolvedAudioUrl(
  entry: Omit<StaticTtsManifestEntry, 'audioUrl'> & { audioUrl?: string },
  options: { preferredProfileId?: string } = {},
): StaticTtsManifestEntry {
  const assetPath = String(entry.assetPath || '').replace(/^\/+/, '');
  const key = String(entry.key || '').trim();
  const profileId = String(entry.profileId || '').trim();
  const preferredProfileId = String(options.preferredProfileId || '').trim();
  const host = typeof window !== 'undefined' ? String(window.location.hostname || '').toLowerCase() : '';
  const isWebProduction = Boolean(host && host !== 'localhost' && host !== '127.0.0.1' && host !== '::1' && !(window as any).electronAPI);
  const lessonCardMatch = key.match(/^lesson-card:(\d+)$/i);
  const lessonCardId = lessonCardMatch ? Number(lessonCardMatch[1]) : NaN;
  const lessonCardProfileId = preferredProfileId === 'en-v1' || preferredProfileId === 'vi-v1'
    ? preferredProfileId
    : profileId;
  const isLessonCardR2Eligible = Number.isFinite(lessonCardId)
    && lessonCardId > 0
    && (lessonCardProfileId === 'vi-v1' || lessonCardProfileId === 'en-v1');
  const questionMatch = key.match(/^question:(\d+)$/i);
  const questionId = questionMatch ? Number(questionMatch[1]) : NaN;
  const isQuestionR2Eligible = Number.isFinite(questionId)
    && questionId > 0
    && (profileId === 'vi-v1' || profileId === 'en-v1');

  const resolvedPath = isLessonCardR2Eligible
    ? `audio/tts/assets/${lessonCardProfileId}/lesson-card-${lessonCardId}.mp3`
    : (isQuestionR2Eligible
      ? `audio/tts/assets/${profileId}/question/${questionId}.mp3`
      : assetPath);

  const audioUrl = (isWebProduction && R2_PUBLIC_BASE_URL && (isLessonCardR2Eligible || isQuestionR2Eligible))
    ? `${R2_PUBLIC_BASE_URL}/${resolvedPath}`
    : (entry.audioUrl || `${import.meta.env.BASE_URL || '/'}${resolvedPath}`.replace(/([^:]\/)\/+/g, '$1'));
  return {
    ...entry,
    assetPath: resolvedPath,
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

export async function getStaticTtsManifestEntry(
  assetKey?: string,
  options: { lang?: 'vi' | 'en' } = {},
): Promise<StaticTtsManifestEntry | null> {
  if (!assetKey) {
    return null;
  }

  const manifest = await loadStaticTtsManifest();
  const raw = manifest?.entries?.[assetKey];
  const preferredProfileId = options.lang === 'en' ? 'en-v1' : 'vi-v1';
  if (raw) {
    return withResolvedAudioUrl(raw, { preferredProfileId });
  }

  // Synthesize minimal entries for direct R2 mapping when key is not present in static manifest.
  const lessonCardMatch = assetKey.match(/^lesson-card:(\d+)$/i);
  const questionMatch = assetKey.match(/^question:(\d+)$/i);
  if (!lessonCardMatch && !questionMatch) {
    return null;
  }

  const fallbackEntry: Omit<StaticTtsManifestEntry, 'audioUrl'> = {
    key: assetKey,
    assetPath: '',
    lang: options.lang === 'en' ? 'en-US' : 'vi-VN',
    usage: lessonCardMatch ? 'lesson-card' : 'question',
    profileId: preferredProfileId,
    contentVersion: manifest?.summary?.contentVersion || import.meta.env.VITE_APP_CONTENT_VERSION || '2026-04-27-v1',
    available: true,
    textHash: '',
  };
  return withResolvedAudioUrl(fallbackEntry, { preferredProfileId });
}

export async function prefetchStaticTtsAsset(
  assetKey?: string,
  options: { lang?: 'vi' | 'en' } = {},
): Promise<StaticTtsManifestEntry | null> {
  const entry = await getStaticTtsManifestEntry(assetKey, options);
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
