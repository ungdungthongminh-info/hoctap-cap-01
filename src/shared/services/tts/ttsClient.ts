import { BACKEND_API_BASE_CANDIDATES } from '../webTotalBridge';
import type { TtsPolicyId } from './ttsPolicy';

const DEFAULT_CONTENT_VERSION = import.meta.env.VITE_APP_CONTENT_VERSION || '2026-04-27-v1';

export interface TtsSynthesizeRequest {
  text: string;
  ssml?: string;
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

function shouldRetryWithNextBase(response: Response, rawText: string, index: number): boolean {
  if (index >= BACKEND_API_BASE_CANDIDATES.length - 1) {
    return false;
  }

  if (response.status === 404 || response.status === 502 || response.status === 503 || response.status === 504) {
    return true;
  }

  const lower = String(rawText || '').toLowerCase();
  return lower.includes('not found') || lower.includes('page could not be found') || lower.includes('not_found');
}

async function fetchBackendJson<T>(pathname: string, init?: RequestInit): Promise<{ data: T; base: string }> {
  let lastError: Error | null = null;

  for (let index = 0; index < BACKEND_API_BASE_CANDIDATES.length; index += 1) {
    const base = BACKEND_API_BASE_CANDIDATES[index];
    try {
      const response = await fetch(`${base}${pathname}`, init);
      const rawText = await response.text().catch(() => '');
      const payload = rawText ? JSON.parse(rawText) : {};

      if (!response.ok || !payload?.success) {
        if (shouldRetryWithNextBase(response, rawText, index)) {
          continue;
        }
        throw new Error(String(payload?.error || `HTTP ${response.status}`));
      }

      return {
        data: payload.data as T,
        base,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (index < BACKEND_API_BASE_CANDIDATES.length - 1) {
        continue;
      }
    }
  }

  throw lastError ?? new Error('Không kết nối được backend TTS.');
}

export async function synthesizeTtsAudio(request: TtsSynthesizeRequest): Promise<TtsSynthesizeResponse> {
  const { data, base } = await fetchBackendJson<TtsSynthesizeResponse>('/tts/synthesize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: request.text,
      ssml: request.ssml,
      lang: request.lang || 'vi-VN',
      voiceId: request.voiceId,
      speed: request.speed ?? 1,
      usage: request.usage || 'practice-on-demand',
      contentVersion: request.contentVersion || DEFAULT_CONTENT_VERSION,
    }),
  });

  return {
    ...data,
    audioUrl: data.audioUrl ? new URL(data.audioUrl, base).toString() : undefined,
  };
}

export async function fetchTtsCacheStats(): Promise<TtsCacheStats> {
  const { data } = await fetchBackendJson<TtsCacheStats>('/tts/cache-stats');
  return data;
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
  const { data } = await fetchBackendJson<{ deletedRows: number; deletedFiles: number }>(
    `/tts/cache${query ? `?${query}` : ''}`,
    {
      method: 'DELETE',
    },
  );
  return data;
}
