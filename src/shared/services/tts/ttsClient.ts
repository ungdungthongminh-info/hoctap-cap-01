import { BACKEND_API_BASE } from '../webTotalBridge';
import type { TtsPolicyId } from './ttsPolicy';

const DEFAULT_CONTENT_VERSION = import.meta.env.VITE_APP_CONTENT_VERSION || '2026-04-27-v1';

export interface TtsSynthesizeRequest {
  text: string;
  lang?: string;
  voiceId?: string;
  speed?: number;
  usage?: TtsPolicyId;
  contentVersion?: string;
}

export interface TtsSynthesizeResponse {
  audioUrl?: string;
  cacheStatus: 'hit' | 'miss' | 'fallback';
  provider: 'google-cloud' | 'native-fallback';
  voiceId: string;
  fallbackNative: boolean;
  warning?: string;
  lang: string;
  speed: number;
}

export interface TtsCacheStats {
  totalFiles: number;
  totalChars: number;
  totalHits: number;
  monthlyCharLimit: number;
  backendReachable?: boolean;
  backendError?: string;
  localDeviceCache?: {
    entries: number;
    totalBytes: number;
  };
  staticManifest?: {
    totalEntries: number;
    availableEntries: number;
    missingEntries: number;
    defaultProfileId: string;
    contentVersion: string;
    generatedAt: string;
    audioBasePath: string;
    voiceProfiles: Array<{
      id: string;
      label: string;
      lang: string;
      voiceId: string;
      notes: string;
      candidateRank: number;
      targetPersona: string;
      isDefault?: boolean;
    }>;
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
  };
  today: {
    files: number;
    chars: number;
  };
  month: {
    files: number;
    chars: number;
  };
  byUsage: Array<{
    usage: string;
    files: number;
    chars: number;
    hits: number;
  }>;
  byDay: Array<{
    day: string;
    files: number;
    chars: number;
  }>;
}

function buildApiUrl(pathname: string): string {
  return `${BACKEND_API_BASE}${pathname}`;
}

async function readJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload?.success) {
    throw new Error(String(payload?.error || `HTTP ${response.status}`));
  }

  return payload.data as T;
}

export async function synthesizeTtsAudio(request: TtsSynthesizeRequest): Promise<TtsSynthesizeResponse> {
  const data = await readJson<TtsSynthesizeResponse>(await fetch(buildApiUrl('/tts/synthesize'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: request.text,
      lang: request.lang || 'vi-VN',
      voiceId: request.voiceId,
      speed: request.speed ?? 1,
      usage: request.usage || 'practice-on-demand',
      contentVersion: request.contentVersion || DEFAULT_CONTENT_VERSION,
    }),
  }));

  return {
    ...data,
    audioUrl: data.audioUrl ? new URL(data.audioUrl, BACKEND_API_BASE).toString() : undefined,
  };
}

export async function fetchTtsCacheStats(): Promise<TtsCacheStats> {
  return readJson<TtsCacheStats>(await fetch(buildApiUrl('/tts/cache-stats')));
}

export async function clearTtsAudioCache(filters: {
  provider?: string;
  contentVersion?: string;
  usage?: TtsPolicyId;
} = {}): Promise<{ deletedRows: number; deletedFiles: number }> {
  const params = new URLSearchParams();
  if (filters.provider) params.set('provider', filters.provider);
  if (filters.contentVersion) params.set('contentVersion', filters.contentVersion);
  if (filters.usage) params.set('usage', filters.usage);

  const query = params.toString();
  return readJson<{ deletedRows: number; deletedFiles: number }>(
    await fetch(`${buildApiUrl('/tts/cache')}${query ? `?${query}` : ''}`, {
      method: 'DELETE',
    }),
  );
}
