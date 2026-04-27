import {
  clearRuntimeTtsAudioCache,
  fetchRuntimeTtsCacheStats,
  getGoogleVoiceCatalog,
  getPreferredVoice,
  getTtsCacheMode,
  getTtsInfo,
  getTtsMode,
  getTtsRuntimeStatus,
  getTtsSpeed,
  getVoicePreferenceOptions,
  isSpeaking,
  onVoicesReady,
  pauseSpeaking,
  prefetchText,
  resumeSpeaking,
  setPreferredVoice,
  setTtsCacheMode,
  setTtsMode,
  setTtsSpeed,
  speakText,
  speakTextAsync,
  stopSpeaking,
  subscribeTtsRuntime,
} from '../services/tts/ttsRuntime';

/**
 * Sound effects using Web Audio API, no external files required.
 */

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Silently ignore unsupported audio contexts.
  }
}

export function playCorrect() {
  playTone(523, 0.12, 'sine', 0.25);
  setTimeout(() => playTone(659, 0.12, 'sine', 0.25), 100);
  setTimeout(() => playTone(784, 0.2, 'sine', 0.3), 200);
}

export function playWrong() {
  playTone(300, 0.15, 'square', 0.15);
  setTimeout(() => playTone(220, 0.25, 'square', 0.12), 120);
}

export function playClick() {
  playTone(880, 0.05, 'sine', 0.1);
}

export function playFinish() {
  playTone(523, 0.1, 'sine', 0.2);
  setTimeout(() => playTone(659, 0.1, 'sine', 0.2), 100);
  setTimeout(() => playTone(784, 0.1, 'sine', 0.2), 200);
  setTimeout(() => playTone(1047, 0.3, 'sine', 0.3), 300);
}

export function playWarning() {
  playTone(600, 0.1, 'triangle', 0.2);
  setTimeout(() => playTone(600, 0.1, 'triangle', 0.2), 200);
}

export {
  clearRuntimeTtsAudioCache as clearTtsAudioCache,
  fetchRuntimeTtsCacheStats as fetchTtsCacheStats,
  getGoogleVoiceCatalog,
  getPreferredVoice,
  getTtsCacheMode,
  getTtsInfo,
  getTtsMode,
  getTtsRuntimeStatus,
  getTtsSpeed,
  getVoicePreferenceOptions,
  isSpeaking,
  onVoicesReady,
  pauseSpeaking,
  prefetchText,
  resumeSpeaking,
  setPreferredVoice,
  setTtsCacheMode,
  setTtsMode,
  setTtsSpeed,
  speakText,
  speakTextAsync,
  stopSpeaking,
  subscribeTtsRuntime,
};

export type {
  PrefetchTextResult,
  SpeakTextOptions,
  TtsCacheMode,
  TtsInfo,
  TtsLang,
  TtsPlaybackEvent,
  TtsPlaybackProvider,
  TtsPlaybackResult,
  TtsRuntimeStatus,
  TtsVoiceCatalogOption,
} from '../services/tts/ttsRuntime';
