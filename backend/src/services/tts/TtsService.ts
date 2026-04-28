import GoogleTtsAdapter from './GoogleTtsAdapter';
import {
  deleteCache,
  findByCacheKey,
  getCacheStats,
  getMonthlyUsage,
  hashText,
  incrementHitCount,
  saveCacheEntry,
} from './cacheRepo';

export type TtsUsage =
  | 'lesson-prefetch'
  | 'lesson-read-all'
  | 'practice-on-demand'
  | 'pre-grade-auto'
  | 'feedback-short'
  | 'fallback-native';

export interface TtsSynthesizeInput {
  text?: string;
  ssml?: string;
  lang?: string;
  voiceId?: string;
  speed?: number;
  usage?: TtsUsage;
  contentVersion?: string;
}

export interface TtsSynthesizeResult {
  audioPath?: string;
  cacheStatus: 'hit' | 'miss' | 'fallback';
  provider: 'google-cloud' | 'native-fallback';
  voiceId: string;
  lang: string;
  speed: number;
  fallbackNative: boolean;
  warning?: string;
}

const ALLOWED_USAGES = new Set<TtsUsage>([
  'lesson-prefetch',
  'lesson-read-all',
  'practice-on-demand',
  'pre-grade-auto',
  'feedback-short',
  'fallback-native',
]);

function clampSpeed(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(1.8, Math.max(0.6, value));
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(String(value || ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeLang(value?: string): string {
  const raw = String(value || '').trim();
  return raw || GoogleTtsAdapter.defaultLanguage;
}

function normalizeUsage(value?: string): TtsUsage {
  const raw = String(value || '').trim() as TtsUsage;
  if (!ALLOWED_USAGES.has(raw)) {
    throw new Error(`Unsupported usage "${value}".`);
  }
  return raw;
}

function normalizeContentVersion(value?: string): string {
  return String(value || process.env.APP_CONTENT_VERSION || '2026-04-27-v1').trim() || '2026-04-27-v1';
}

function normalizeVoiceId(value: string | undefined): string {
  const raw = String(value || '').trim();
  if (raw) {
    GoogleTtsAdapter.validateVoiceId(raw);
    return raw;
  }

  return GoogleTtsAdapter.defaultVoice;
}

function stripSsmlTags(value: string): string {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function getMonthlyCharLimit(): number {
  return parsePositiveInt(process.env.TTS_MONTHLY_CHAR_LIMIT, 1_000_000);
}

export function validateSynthesizeInput(input: TtsSynthesizeInput) {
  const rawText = String(input.text || '').trim();
  const ssml = String(input.ssml || '').trim();
  const text = rawText || stripSsmlTags(ssml);
  const lang = normalizeLang(input.lang);
  const voiceId = normalizeVoiceId(input.voiceId);
  const speed = clampSpeed(Number(input.speed ?? 1));
  const usage = normalizeUsage(input.usage || 'practice-on-demand');
  const contentVersion = normalizeContentVersion(input.contentVersion);

  if (!rawText && !ssml) {
    throw new Error('Text or ssml is required.');
  }

  GoogleTtsAdapter.validateText(text);

  return {
    text,
    ssml: ssml || undefined,
    cacheText: ssml || text,
    charCount: text.length,
    lang,
    voiceId,
    speed,
    usage,
    contentVersion,
  };
}

export async function synthesizeSpeech(input: TtsSynthesizeInput): Promise<TtsSynthesizeResult> {
  const provider = String(process.env.TTS_PROVIDER || 'google-cloud').trim();
  const normalized = validateSynthesizeInput(input);

  if (provider !== 'google-cloud') {
    return {
      cacheStatus: 'fallback',
      provider: 'native-fallback',
      voiceId: normalized.voiceId,
      lang: normalized.lang,
      speed: normalized.speed,
      fallbackNative: true,
      warning: `TTS provider "${provider}" is disabled.`,
    };
  }

  const lookupKey = {
    provider: GoogleTtsAdapter.provider,
    voice: normalized.voiceId,
    speed: normalized.speed,
    lang: normalized.lang,
    usage: normalized.usage,
    contentVersion: normalized.contentVersion,
    textHash: hashText(normalized.cacheText),
  };

  const cacheHit = await findByCacheKey(lookupKey);
  if (cacheHit) {
    await incrementHitCount(cacheHit.id);
    return {
      audioPath: cacheHit.audioPath,
      cacheStatus: 'hit',
      provider: 'google-cloud',
      voiceId: normalized.voiceId,
      lang: normalized.lang,
      speed: normalized.speed,
      fallbackNative: false,
    };
  }

  const monthlyUsage = await getMonthlyUsage();
  const monthlyLimit = getMonthlyCharLimit();
  if (monthlyUsage + normalized.charCount > monthlyLimit) {
    return {
      cacheStatus: 'fallback',
      provider: 'native-fallback',
      voiceId: normalized.voiceId,
      lang: normalized.lang,
      speed: normalized.speed,
      fallbackNative: true,
      warning: `Monthly TTS character limit reached (${monthlyLimit}).`,
    };
  }

  try {
    const audioBuffer = await GoogleTtsAdapter.synthesize({
      text: normalized.text,
      ssml: normalized.ssml,
      lang: normalized.lang,
      voiceId: normalized.voiceId,
      speed: normalized.speed,
    });

    const saved = await saveCacheEntry({
      key: lookupKey,
      audioBuffer,
      charCount: normalized.charCount,
    });

    return {
      audioPath: saved.audioPath,
      cacheStatus: 'miss',
      provider: 'google-cloud',
      voiceId: normalized.voiceId,
      lang: normalized.lang,
      speed: normalized.speed,
      fallbackNative: false,
    };
  } catch (error) {
    console.error('Google TTS synthesize error:', error);
    return {
      cacheStatus: 'fallback',
      provider: 'native-fallback',
      voiceId: normalized.voiceId,
      lang: normalized.lang,
      speed: normalized.speed,
      fallbackNative: true,
      warning: 'Google Cloud TTS is temporarily unavailable.',
    };
  }
}

export { deleteCache, getCacheStats };
