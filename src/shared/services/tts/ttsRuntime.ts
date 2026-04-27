import { clearTtsAudioCache, fetchTtsCacheStats, synthesizeTtsAudio, type TtsCacheStats, type TtsSynthesizeResponse } from './ttsClient';
import {
  clearLocalTtsAudioCache,
  getLocalTtsAudioBlob,
  getLocalTtsAudioCacheStats,
  storeLocalTtsAudioFromUrl,
  type LocalTtsCacheDescriptor,
} from './localAudioCache';
import { getStaticTtsManifestEntry, getStaticTtsManifestSummary, prefetchStaticTtsAsset } from './staticTtsManifest';
import { getTtsPolicy, type TtsPolicyId } from './ttsPolicy';

export type { TtsCacheStats } from './ttsClient';

export type TtsLang = 'vi' | 'en';
export type TtsMode = 'static' | 'advanced' | 'native';
export type TtsCacheMode = 'manual' | 'balanced' | 'aggressive';
export type TtsPlaybackProvider = 'static-manifest' | 'google-cloud' | 'native';
export type TtsPlaybackEvent = 'loading' | 'ready' | 'playing' | 'ended' | 'stopped' | 'error' | 'fallback-native';

export interface TtsInfo {
  hasVietnameseVoice: boolean;
  voices: { name: string; lang: string }[];
  ttsMode: 'advanced' | 'native';
  voicesLoaded: boolean;
}

export interface TtsVoiceCatalogOption {
  id: string;
  label: string;
}

export interface SpeakTextOptions {
  policy?: TtsPolicyId;
  mode?: TtsMode;
  voiceId?: string;
  speed?: number;
  contentVersion?: string;
  assetKey?: string;
  onStatusChange?: (status: TtsPlaybackEvent) => void;
}

export interface TtsPlaybackResult {
  status: 'completed' | 'stopped' | 'error';
  provider: TtsPlaybackProvider;
  cacheStatus?: 'hit' | 'miss' | 'fallback';
  fallbackNative?: boolean;
  error?: string;
}

export interface PrefetchTextResult {
  status: 'prefetched' | 'skipped' | 'fallback';
  cacheStatus?: 'hit' | 'miss' | 'fallback';
  provider?: 'static-manifest' | 'google-cloud' | 'native-fallback';
  warning?: string;
}

export interface TtsRuntimeStatus {
  isLoading: boolean;
  isSpeaking: boolean;
  error: string | null;
  activeProvider: TtsPlaybackProvider | null;
  activeMode: TtsMode;
  lastCacheStatus: 'hit' | 'miss' | 'fallback' | null;
}

const STORAGE_KEYS = {
  mode: 'hhk_tts_mode',
  speed: 'hhk_tts_speed',
  voiceVi: 'hhk_tts_voice_vi',
  voiceEn: 'hhk_tts_voice_en',
  cacheMode: 'hhk_tts_cache_mode',
} as const;

const FEMALE_PREF = '__female__';
const MALE_PREF = '__male__';
const DEFAULT_MODE: TtsMode = 'static';
const DEFAULT_CACHE_MODE: TtsCacheMode = 'balanced';

const GOOGLE_VI_VOICE_OPTIONS: TtsVoiceCatalogOption[] = [
  { id: 'vi-VN-Wavenet-A', label: 'Google Wavenet A' },
  { id: 'vi-VN-Wavenet-B', label: 'Google Wavenet B' },
  { id: 'vi-VN-Wavenet-C', label: 'Google Wavenet C' },
  { id: 'vi-VN-Wavenet-D', label: 'Google Wavenet D' },
  { id: 'vi-VN-Standard-A', label: 'Google Standard A' },
  { id: 'vi-VN-Standard-B', label: 'Google Standard B' },
  { id: 'vi-VN-Standard-C', label: 'Google Standard C' },
  { id: 'vi-VN-Standard-D', label: 'Google Standard D' },
];

const GOOGLE_EN_VOICE_OPTIONS: TtsVoiceCatalogOption[] = [
  { id: 'en-US-Neural2-F', label: 'Google Neural2 F' },
  { id: 'en-US-Neural2-D', label: 'Google Neural2 D' },
  { id: 'en-US-Wavenet-F', label: 'Google Wavenet F' },
  { id: 'en-US-Wavenet-D', label: 'Google Wavenet D' },
];

const runtimeStatus: TtsRuntimeStatus = {
  isLoading: false,
  isSpeaking: false,
  error: null,
  activeProvider: null,
  activeMode: DEFAULT_MODE,
  lastCacheStatus: null,
};

const listeners = new Set<() => void>();

let currentAudio: HTMLAudioElement | null = null;
let currentProvider: TtsPlaybackProvider | null = null;
let currentResolver: ((result: TtsPlaybackResult) => void) | null = null;
let currentObjectUrl: string | null = null;
let playbackToken = 0;

function emit(): void {
  listeners.forEach((listener) => listener());
}

function setRuntimeStatus(patch: Partial<TtsRuntimeStatus>): void {
  Object.assign(runtimeStatus, patch);
  emit();
}

function normalizeText(value: string): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function looksLikeGoogleVoiceId(value: string): boolean {
  return /^[a-z]{2}-[A-Z]{2}-[A-Za-z0-9.-]+$/.test(String(value || '').trim());
}

function isLikelyVietnameseVoice(voice: SpeechSynthesisVoice): boolean {
  const lang = normalizeText(voice.lang || '');
  const name = normalizeText(voice.name || '');
  return lang.startsWith('vi') || name.includes('vietnam') || name.includes('tieng viet') || name.includes('viet');
}

function isLikelyEnglishVoice(voice: SpeechSynthesisVoice): boolean {
  const lang = normalizeText(voice.lang || '');
  const name = normalizeText(voice.name || '');
  return lang.startsWith('en') || name.includes('english');
}

function isLikelyFemaleVoice(voice: SpeechSynthesisVoice): boolean {
  const source = `${voice.name} ${voice.voiceURI}`.toLowerCase();
  if (/\bfemale\b/.test(source)) return true;
  const names = [
    'zira', 'aria', 'jenny', 'hazel', 'elsa', 'cortana', 'samantha',
    'karen', 'moira', 'tessa', 'fiona', 'victoria', 'alice', 'susan',
    'salli', 'joanna', 'kendra', 'amy', 'emma', 'nicole', 'olivia',
    'ava', 'ivy', 'kimberly', 'huong', 'linh', 'hoa',
  ];
  return names.some((name) => new RegExp(`\\b${name}\\b`).test(source));
}

function isLikelyMaleVoice(voice: SpeechSynthesisVoice): boolean {
  const source = `${voice.name} ${voice.voiceURI}`.toLowerCase();
  if (/\bmale\b/.test(source) && !/\bfemale\b/.test(source)) return true;
  const names = [
    'david', 'mark', 'james', 'daniel', 'george', 'richard', 'alex',
    'fred', 'rishi', 'matthew', 'brian', 'joey', 'justin', 'kevin',
    'stephen', 'ryan', 'sean', 'ivan', 'guy', 'tony',
  ];
  return names.some((name) => new RegExp(`\\b${name}\\b`).test(source));
}

function pickVoiceByPreference(voices: SpeechSynthesisVoice[], lang: TtsLang, pref: string): SpeechSynthesisVoice | undefined {
  const candidates = voices.filter((voice) => (lang === 'vi' ? isLikelyVietnameseVoice(voice) : isLikelyEnglishVoice(voice)));
  if (candidates.length === 0) return undefined;

  if (pref === FEMALE_PREF) {
    return candidates.find(isLikelyFemaleVoice) || candidates[0];
  }

  if (pref === MALE_PREF) {
    return candidates.find(isLikelyMaleVoice) || candidates[0];
  }

  if (pref && !looksLikeGoogleVoiceId(pref)) {
    return candidates.find((voice) => voice.name === pref) || candidates[0];
  }

  return candidates[0];
}

function clampTtsSpeed(value: number): number {
  if (Number.isNaN(value)) return 1;
  return Math.min(1.6, Math.max(0.6, value));
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
    // Ignore quota and unavailable storage.
  }
}

function safeStorageRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore quota and unavailable storage.
  }
}

export function subscribeTtsRuntime(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getTtsRuntimeStatus(): TtsRuntimeStatus {
  return { ...runtimeStatus };
}

export function getVoicePreferenceOptions() {
  return {
    female: FEMALE_PREF,
    male: MALE_PREF,
  };
}

export function getGoogleVoiceCatalog(lang: TtsLang): TtsVoiceCatalogOption[] {
  return lang === 'vi' ? GOOGLE_VI_VOICE_OPTIONS : GOOGLE_EN_VOICE_OPTIONS;
}

export function getTtsInfo(): TtsInfo {
  if (!('speechSynthesis' in window)) {
    return {
      hasVietnameseVoice: false,
      voices: [],
      ttsMode: 'advanced',
      voicesLoaded: false,
    };
  }

  const voices = window.speechSynthesis.getVoices();
  const hasVi = voices.some((voice) => isLikelyVietnameseVoice(voice));
  return {
    hasVietnameseVoice: hasVi,
    voices: voices.map((voice) => ({ name: voice.name, lang: voice.lang })),
    ttsMode: hasVi ? 'native' : 'advanced',
    voicesLoaded: voices.length > 0,
  };
}

export function onVoicesReady(cb: (info: TtsInfo) => void): () => void {
  if (!('speechSynthesis' in window)) {
    cb(getTtsInfo());
    return () => undefined;
  }

  const initial = getTtsInfo();
  if (initial.voices.length > 0) {
    cb(initial);
    return () => undefined;
  }

  const handler = () => cb(getTtsInfo());
  window.speechSynthesis.addEventListener('voiceschanged', handler);

  const timers = [200, 500, 1000, 2000, 4000].map((ms) => setTimeout(() => cb(getTtsInfo()), ms));
  return () => {
    window.speechSynthesis.removeEventListener('voiceschanged', handler);
    timers.forEach(clearTimeout);
  };
}

export function getTtsMode(): TtsMode {
  const saved = safeStorageGet(STORAGE_KEYS.mode);
  if (saved === 'native') return 'native';
  if (saved === 'advanced' || saved === 'google') return 'advanced';
  return 'static';
}

export function setTtsMode(mode: TtsMode): void {
  safeStorageSet(STORAGE_KEYS.mode, mode);
  setRuntimeStatus({ activeMode: mode });
}

export function getTtsSpeed(): number {
  const saved = Number(safeStorageGet(STORAGE_KEYS.speed));
  return clampTtsSpeed(saved || 1);
}

export function setTtsSpeed(speed: number): void {
  safeStorageSet(STORAGE_KEYS.speed, String(clampTtsSpeed(speed)));
}

export function getPreferredVoice(lang: TtsLang): string {
  return safeStorageGet(lang === 'vi' ? STORAGE_KEYS.voiceVi : STORAGE_KEYS.voiceEn);
}

export function setPreferredVoice(lang: TtsLang, voiceName: string): void {
  const key = lang === 'vi' ? STORAGE_KEYS.voiceVi : STORAGE_KEYS.voiceEn;
  if (voiceName) {
    safeStorageSet(key, voiceName);
    return;
  }

  safeStorageRemove(key);
}

export function getTtsCacheMode(): TtsCacheMode {
  const saved = safeStorageGet(STORAGE_KEYS.cacheMode);
  return saved === 'manual' || saved === 'aggressive' ? saved : DEFAULT_CACHE_MODE;
}

export function setTtsCacheMode(mode: TtsCacheMode): void {
  safeStorageSet(STORAGE_KEYS.cacheMode, mode);
}

function resolveBackendVoiceId(lang: TtsLang, explicitVoiceId?: string): string {
  const candidate = String(explicitVoiceId || getPreferredVoice(lang) || '').trim();
  if (looksLikeGoogleVoiceId(candidate)) {
    return candidate;
  }

  return getGoogleVoiceCatalog(lang)[0]?.id || (lang === 'vi' ? 'vi-VN-Wavenet-A' : 'en-US-Neural2-F');
}

function resolveNativeVoice(lang: TtsLang): SpeechSynthesisVoice | undefined {
  if (!('speechSynthesis' in window)) return undefined;
  const voices = window.speechSynthesis.getVoices();
  return pickVoiceByPreference(voices, lang, getPreferredVoice(lang));
}

function resolveSpeechRate(lang: TtsLang, speed: number): number {
  return clampTtsSpeed((lang === 'en' ? 0.95 : 0.9) * speed);
}

function completePlayback(result: TtsPlaybackResult): void {
  const resolver = currentResolver;
  currentResolver = null;
  currentAudio = null;
  currentProvider = null;
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }
  setRuntimeStatus({
    isLoading: false,
    isSpeaking: false,
    activeProvider: null,
  });
  resolver?.(result);
}

export function stopSpeaking(): void {
  playbackToken += 1;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = '';
    currentAudio = null;
  }

  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  const provider = currentProvider || 'native';
  completePlayback({
    status: 'stopped',
    provider,
    cacheStatus: runtimeStatus.lastCacheStatus || undefined,
  });
}

export function pauseSpeaking(): void {
  if (currentAudio) {
    currentAudio.pause();
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
}

export function resumeSpeaking(): void {
  if (currentAudio) {
    void currentAudio.play().catch(() => undefined);
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
}

export function isSpeaking(): boolean {
  return runtimeStatus.isSpeaking || ('speechSynthesis' in window && window.speechSynthesis.speaking);
}

function playNativeSpeech(text: string, lang: TtsLang, speed: number, options: SpeakTextOptions, token: number): Promise<TtsPlaybackResult> {
  return new Promise<TtsPlaybackResult>((resolve) => {
    if (!('speechSynthesis' in window)) {
      setRuntimeStatus({
        isLoading: false,
        isSpeaking: false,
        error: 'This browser does not support speech synthesis.',
        activeProvider: null,
      });
      options.onStatusChange?.('error');
      resolve({
        status: 'error',
        provider: 'native',
        error: 'Speech synthesis is unavailable.',
      });
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    currentProvider = 'native';
    currentResolver = resolve;

    utterance.lang = lang === 'en' ? 'en-US' : 'vi-VN';
    utterance.rate = resolveSpeechRate(lang, speed);
    utterance.pitch = 1.05;
    const voice = resolveNativeVoice(lang);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      if (token !== playbackToken) return;
      setRuntimeStatus({
        isLoading: false,
        isSpeaking: true,
        error: null,
        activeProvider: 'native',
        lastCacheStatus: runtimeStatus.lastCacheStatus,
      });
      options.onStatusChange?.('playing');
    };

    utterance.onend = () => {
      if (token !== playbackToken) return;
      options.onStatusChange?.('ended');
      completePlayback({
        status: 'completed',
        provider: 'native',
        cacheStatus: runtimeStatus.lastCacheStatus || undefined,
      });
    };

    utterance.onerror = () => {
      if (token !== playbackToken) return;
      setRuntimeStatus({
        error: 'Native TTS playback failed.',
      });
      options.onStatusChange?.('error');
      completePlayback({
        status: 'error',
        provider: 'native',
        cacheStatus: runtimeStatus.lastCacheStatus || undefined,
        error: 'Native TTS playback failed.',
      });
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  });
}

function playAudioUrl(
  sourceUrl: string,
  provider: TtsPlaybackProvider,
  cacheStatus: 'hit' | 'miss' | 'fallback' | undefined,
  speed: number,
  options: SpeakTextOptions,
  token: number,
): Promise<TtsPlaybackResult> {
  return new Promise<TtsPlaybackResult>((resolve) => {
    const audio = new Audio(sourceUrl);
    currentAudio = audio;
    currentProvider = provider;
    currentResolver = resolve;
    audio.preload = 'auto';
    audio.playbackRate = clampTtsSpeed(speed);

    const finish = (result: TtsPlaybackResult) => {
      if (token !== playbackToken) return;
      completePlayback(result);
    };

    audio.onplay = () => {
      if (token !== playbackToken) return;
      setRuntimeStatus({
        isLoading: false,
        isSpeaking: true,
        error: null,
        activeProvider: provider,
        lastCacheStatus: cacheStatus || null,
      });
      options.onStatusChange?.('playing');
    };

    audio.onended = () => {
      if (token !== playbackToken) return;
      options.onStatusChange?.('ended');
      finish({
        status: 'completed',
        provider,
        cacheStatus,
      });
    };

    audio.onerror = () => {
      if (token !== playbackToken) return;
      setRuntimeStatus({
        error: 'Cached MP3 playback failed.',
      });
      options.onStatusChange?.('error');
      finish({
        status: 'error',
        provider,
        cacheStatus,
        error: 'Cached MP3 playback failed.',
      });
    };

    void audio.play().catch(() => {
      if (token !== playbackToken) return;
      setRuntimeStatus({
        error: 'Unable to start cached MP3 playback.',
      });
      options.onStatusChange?.('error');
      finish({
        status: 'error',
        provider,
        cacheStatus,
        error: 'Unable to start cached MP3 playback.',
      });
    });
  });
}

function toBackendLang(lang: TtsLang): string {
  return lang === 'en' ? 'en-US' : 'vi-VN';
}

function buildLocalDescriptor(
  text: string,
  lang: TtsLang,
  speed: number,
  voiceId: string,
  usage: TtsPolicyId,
  contentVersion?: string,
): LocalTtsCacheDescriptor {
  return {
    text,
    lang: toBackendLang(lang),
    voiceId,
    speed,
    usage,
    contentVersion,
  };
}

async function tryPlayFromLocalCache(
  descriptor: LocalTtsCacheDescriptor,
  speed: number,
  options: SpeakTextOptions,
  token: number,
): Promise<TtsPlaybackResult | null> {
  try {
    const blob = await getLocalTtsAudioBlob(descriptor);
    if (!blob) {
      return null;
    }

    const objectUrl = URL.createObjectURL(blob);
    currentObjectUrl = objectUrl;
    setRuntimeStatus({
      lastCacheStatus: 'hit',
      error: null,
    });
    options.onStatusChange?.('ready');
    return playAudioUrl(objectUrl, 'google-cloud', 'hit', speed, options, token);
  } catch {
    return null;
  }
}

async function tryPlayFromStaticManifest(
  assetKey: string | undefined,
  speed: number,
  options: SpeakTextOptions,
  token: number,
): Promise<TtsPlaybackResult | null> {
  const entry = await getStaticTtsManifestEntry(assetKey);
  if (!entry?.available) {
    return null;
  }

  try {
    setRuntimeStatus({
      lastCacheStatus: 'hit',
      error: null,
    });
    options.onStatusChange?.('ready');
    return await playAudioUrl(entry.audioUrl, 'static-manifest', 'hit', speed, options, token);
  } catch {
    return null;
  }
}

async function cacheAndResolvePlayableUrl(
  descriptor: LocalTtsCacheDescriptor,
  response: TtsSynthesizeResponse,
): Promise<string | null> {
  if (!response.audioUrl) {
    return null;
  }

  try {
    const blob = await storeLocalTtsAudioFromUrl(descriptor, response.audioUrl);
    if (!blob) {
      return response.audioUrl;
    }
    const objectUrl = URL.createObjectURL(blob);
    currentObjectUrl = objectUrl;
    return objectUrl;
  } catch {
    return response.audioUrl;
  }
}

export async function speakTextAsync(text: string, lang: TtsLang = 'vi', options: SpeakTextOptions = {}): Promise<TtsPlaybackResult> {
  const cleanedText = String(text || '').trim();
  if (!cleanedText) {
    return {
      status: 'stopped',
      provider: 'native',
    };
  }

  const policy = getTtsPolicy(options.policy || 'practice-on-demand');
  const desiredMode = options.mode || getTtsMode();
  const allowAdvancedFallback = desiredMode === 'advanced' && policy.preferBackend;
  const speed = clampTtsSpeed(options.speed ?? getTtsSpeed());
  const backendVoiceId = resolveBackendVoiceId(lang, options.voiceId);
  const localDescriptor = buildLocalDescriptor(
    cleanedText,
    lang,
    speed,
    backendVoiceId,
    policy.usage,
    options.contentVersion,
  );

  stopSpeaking();
  playbackToken += 1;
  const token = playbackToken;

  setRuntimeStatus({
    isLoading: desiredMode !== 'native',
    isSpeaking: false,
    error: null,
    activeProvider: desiredMode === 'native' ? 'native' : null,
    activeMode: desiredMode,
    lastCacheStatus: null,
  });

  if (desiredMode === 'native') {
    return playNativeSpeech(cleanedText, lang, speed, options, token);
  }

  const staticPlayback = await tryPlayFromStaticManifest(options.assetKey, speed, options, token);
  if (staticPlayback) {
    return staticPlayback;
  }

  if (!allowAdvancedFallback) {
    setRuntimeStatus({
      isLoading: false,
      error: options.assetKey ? 'Audio tinh chua duoc tao san cho noi dung nay.' : null,
    });
    options.onStatusChange?.('fallback-native');
    return playNativeSpeech(cleanedText, lang, speed, options, token);
  }

  const localPlayback = await tryPlayFromLocalCache(localDescriptor, speed, options, token);
  if (localPlayback) {
    return localPlayback;
  }

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    setRuntimeStatus({
      isLoading: false,
      error: 'Dang offline va chua co audio da luu tren may.',
    });
    options.onStatusChange?.('fallback-native');
    return playNativeSpeech(cleanedText, lang, speed, options, token);
  }

  options.onStatusChange?.('loading');

  try {
    const response = await synthesizeTtsAudio({
      text: cleanedText,
      lang: toBackendLang(lang),
      voiceId: backendVoiceId,
      speed,
      usage: policy.usage,
      contentVersion: options.contentVersion,
    });

    if (token !== playbackToken) {
      return {
        status: 'stopped',
        provider: 'google-cloud',
        cacheStatus: response.cacheStatus,
      };
    }

    setRuntimeStatus({
      lastCacheStatus: response.cacheStatus,
    });

    if (response.fallbackNative || !response.audioUrl) {
      options.onStatusChange?.('fallback-native');
      setRuntimeStatus({
        isLoading: false,
        error: response.warning || null,
      });
      return playNativeSpeech(cleanedText, lang, speed, options, token);
    }

    options.onStatusChange?.('ready');
    const playableUrl = await cacheAndResolvePlayableUrl(localDescriptor, response);
    if (!playableUrl) {
      options.onStatusChange?.('fallback-native');
      return playNativeSpeech(cleanedText, lang, speed, options, token);
    }
    return playAudioUrl(playableUrl, 'google-cloud', response.cacheStatus, speed, options, token);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'TTS backend unavailable.';
    setRuntimeStatus({
      isLoading: false,
      error: message,
    });

    const retryLocalPlayback = await tryPlayFromLocalCache(localDescriptor, speed, options, token);
    if (retryLocalPlayback) {
      return retryLocalPlayback;
    }

    options.onStatusChange?.('fallback-native');
    return playNativeSpeech(cleanedText, lang, speed, options, token);
  }
}

export function speakText(text: string, lang: TtsLang = 'vi', options: SpeakTextOptions = {}): void {
  void speakTextAsync(text, lang, options);
}

export async function prefetchText(text: string, lang: TtsLang = 'vi', options: SpeakTextOptions = {}): Promise<PrefetchTextResult> {
  const cleanedText = String(text || '').trim();
  if (!cleanedText) {
    return { status: 'skipped' };
  }

  const policy = getTtsPolicy(options.policy || 'lesson-prefetch');
  const desiredMode = options.mode || getTtsMode();
  const allowAdvancedFallback = desiredMode === 'advanced' && policy.preferBackend;

  if (options.assetKey) {
    const staticEntry = await prefetchStaticTtsAsset(options.assetKey);
    if (staticEntry?.available) {
      return {
        status: 'prefetched',
        cacheStatus: 'hit',
        provider: 'static-manifest',
      };
    }
  }

  if (!allowAdvancedFallback) {
    return { status: 'skipped' };
  }

  try {
    const localBlob = await getLocalTtsAudioBlob(buildLocalDescriptor(
      cleanedText,
      lang,
      clampTtsSpeed(options.speed ?? getTtsSpeed()),
      resolveBackendVoiceId(lang, options.voiceId),
      policy.usage,
      options.contentVersion,
    ));
    if (localBlob) {
      return {
        status: 'prefetched',
        cacheStatus: 'hit',
        provider: 'google-cloud',
      };
    }

    const response = await synthesizeTtsAudio({
      text: cleanedText,
      lang: toBackendLang(lang),
      voiceId: resolveBackendVoiceId(lang, options.voiceId),
      speed: clampTtsSpeed(options.speed ?? getTtsSpeed()),
      usage: policy.usage,
      contentVersion: options.contentVersion,
    });

    if (response.fallbackNative) {
      return {
        status: 'fallback',
        cacheStatus: response.cacheStatus,
        provider: response.provider,
        warning: response.warning,
      };
    }

    if (response.audioUrl) {
      await storeLocalTtsAudioFromUrl(
        buildLocalDescriptor(
          cleanedText,
          lang,
          clampTtsSpeed(options.speed ?? getTtsSpeed()),
          resolveBackendVoiceId(lang, options.voiceId),
          policy.usage,
          options.contentVersion,
        ),
        response.audioUrl,
      ).catch(() => null);
    }

    return {
      status: 'prefetched',
      cacheStatus: response.cacheStatus,
      provider: response.provider,
      warning: response.warning,
    };
  } catch {
    return { status: 'fallback' };
  }
}

export async function fetchRuntimeTtsCacheStats(): Promise<TtsCacheStats> {
  const [manifestSummary, stats, local] = await Promise.all([
    getStaticTtsManifestSummary().catch(() => null),
    fetchTtsCacheStats()
      .then((remoteStats) => ({
        ...remoteStats,
        backendReachable: true,
      }))
      .catch((error) => ({
        totalFiles: 0,
        totalChars: 0,
        totalHits: 0,
        monthlyCharLimit: 0,
        today: { files: 0, chars: 0 },
        month: { files: 0, chars: 0 },
        byUsage: [],
        byDay: [],
        backendReachable: false,
        backendError: error instanceof Error ? error.message : 'TTS backend unavailable.',
      } as TtsCacheStats)),
    getLocalTtsAudioCacheStats().catch(() => ({ entries: 0, totalBytes: 0 })),
  ]);
  return {
    ...stats,
    localDeviceCache: local,
    staticManifest: manifestSummary || undefined,
  } as TtsCacheStats;
}

export async function clearRuntimeTtsAudioCache(filters?: {
  provider?: string;
  contentVersion?: string;
  usage?: TtsPolicyId;
}): Promise<{ deletedRows: number; deletedFiles: number; localDeletedEntries: number; warning?: string }> {
  const local = await clearLocalTtsAudioCache().catch(() => ({ deletedEntries: 0 }));
  const remote = await clearTtsAudioCache(filters).catch((error) => ({
    deletedRows: 0,
    deletedFiles: 0,
    warning: error instanceof Error ? error.message : 'Khong xoa duoc advanced TTS cache.',
  }));
  return {
    ...remote,
    localDeletedEntries: local.deletedEntries,
  };
}

setRuntimeStatus({
  activeMode: getTtsMode(),
});
