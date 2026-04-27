import { useEffect, useState } from 'react';
import {
  clearRuntimeTtsAudioCache,
  fetchRuntimeTtsCacheStats,
  getTtsRuntimeStatus,
  pauseSpeaking,
  prefetchText,
  resumeSpeaking,
  speakTextAsync,
  stopSpeaking,
  subscribeTtsRuntime,
} from '../services/tts/ttsRuntime';
import type { PrefetchTextResult, SpeakTextOptions, TtsCacheStats, TtsLang, TtsPlaybackResult, TtsRuntimeStatus } from '../services/tts/ttsRuntime';

export function useTts() {
  const [status, setStatus] = useState<TtsRuntimeStatus>(getTtsRuntimeStatus());

  useEffect(() => subscribeTtsRuntime(() => setStatus(getTtsRuntimeStatus())), []);

  return {
    speak: (text: string, lang: TtsLang = 'vi', options?: SpeakTextOptions): Promise<TtsPlaybackResult> =>
      speakTextAsync(text, lang, options),
    stop: stopSpeaking,
    pause: pauseSpeaking,
    resume: resumeSpeaking,
    isSpeaking: status.isSpeaking,
    isLoading: status.isLoading,
    error: status.error,
    prefetch: (text: string, lang: TtsLang = 'vi', options?: SpeakTextOptions): Promise<PrefetchTextResult> =>
      prefetchText(text, lang, options),
    getStatus: (): TtsRuntimeStatus => getTtsRuntimeStatus(),
    getCacheStats: (): Promise<TtsCacheStats> => fetchRuntimeTtsCacheStats(),
    clearCache: clearRuntimeTtsAudioCache,
  };
}
