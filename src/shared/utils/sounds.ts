/**
 * Sound effects using Web Audio API — no external files needed.
 * Generates simple tones for correct/wrong/click feedback.
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
    // Silently fail if audio not supported
  }
}

/** Happy ascending chime — correct answer */
export function playCorrect() {
  playTone(523, 0.12, 'sine', 0.25); // C5
  setTimeout(() => playTone(659, 0.12, 'sine', 0.25), 100); // E5
  setTimeout(() => playTone(784, 0.2, 'sine', 0.3), 200); // G5
}

/** Low descending buzz — wrong answer */
export function playWrong() {
  playTone(300, 0.15, 'square', 0.15);
  setTimeout(() => playTone(220, 0.25, 'square', 0.12), 120);
}

/** Soft click — button tap */
export function playClick() {
  playTone(880, 0.05, 'sine', 0.1);
}

/** Celebration fanfare — finish practice */
export function playFinish() {
  playTone(523, 0.1, 'sine', 0.2);
  setTimeout(() => playTone(659, 0.1, 'sine', 0.2), 100);
  setTimeout(() => playTone(784, 0.1, 'sine', 0.2), 200);
  setTimeout(() => playTone(1047, 0.3, 'sine', 0.3), 300);
}

/** Warning beep — time running out */
export function playWarning() {
  playTone(600, 0.1, 'triangle', 0.2);
  setTimeout(() => playTone(600, 0.1, 'triangle', 0.2), 200);
}

/** TTS đọc bài
 *  - Tiếng Việt: dùng Google Translate TTS (vì Windows thường không có voice tiếng Việt)
 *  - Tiếng Anh: dùng Web Speech API (có sẵn trên Windows)
 */

let currentAudio: HTMLAudioElement | null = null;
let googleTtsBusy = false;
let ttsSpeed = 1;
let preferredVoiceVi = '';
let preferredVoiceEn = '';

const FEMALE_PREF = '__female__';
const MALE_PREF = '__male__';

function normalizeText(s: string): string {
  return (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function isLikelyVietnameseVoice(v: SpeechSynthesisVoice): boolean {
  const lang = normalizeText(v.lang || '');
  const name = normalizeText(v.name || '');
  return lang.startsWith('vi') || name.includes('vietnam') || name.includes('tieng viet') || name.includes('viet');
}

function isLikelyEnglishVoice(v: SpeechSynthesisVoice): boolean {
  const lang = normalizeText(v.lang || '');
  const name = normalizeText(v.name || '');
  return lang.startsWith('en') || name.includes('english');
}

function isLikelyFemaleVoice(v: SpeechSynthesisVoice): boolean {
  const s = `${v.name} ${v.voiceURI}`.toLowerCase();
  if (/\bfemale\b/.test(s)) return true;
  // Tên giọng nữ phổ biến (Windows, macOS, Chrome, Edge)
  const names = [
    'zira', 'aria', 'jenny', 'hazel', 'elsa', 'cortana', 'samantha',
    'karen', 'moira', 'tessa', 'fiona', 'victoria', 'alice', 'susan',
    'salli', 'joanna', 'kendra', 'amy', 'emma', 'nicole', 'olivia',
    'ava', 'ivy', 'kimberly', 'huong', 'linh', 'hoa',
  ];
  return names.some((n) => new RegExp('\\b' + n + '\\b').test(s));
}

function isLikelyMaleVoice(v: SpeechSynthesisVoice): boolean {
  const s = `${v.name} ${v.voiceURI}`.toLowerCase();
  // 'male' nhưng KHÔNG phải 'female'
  if (/\bmale\b/.test(s) && !/\bfemale\b/.test(s)) return true;
  const names = [
    'david', 'mark', 'james', 'daniel', 'george', 'richard', 'alex',
    'fred', 'rishi', 'matthew', 'brian', 'joey', 'justin', 'kevin',
    'stephen', 'ryan', 'sean', 'ivan', 'guy', 'tony',
  ];
  return names.some((n) => new RegExp('\\b' + n + '\\b').test(s));
}

function pickVoiceByPreference(voices: SpeechSynthesisVoice[], lang: 'vi' | 'en', pref: string): SpeechSynthesisVoice | undefined {
  const candidates = voices.filter((v) => (lang === 'vi' ? isLikelyVietnameseVoice(v) : isLikelyEnglishVoice(v)));
  if (candidates.length === 0) return undefined;

  if (pref === FEMALE_PREF) {
    return candidates.find(isLikelyFemaleVoice) || candidates[0];
  }

  if (pref === MALE_PREF) {
    return candidates.find(isLikelyMaleVoice) || candidates[0];
  }

  if (pref) {
    return candidates.find((v) => v.name === pref) || candidates[0];
  }

  return candidates[0];
}

function clampTtsSpeed(value: number): number {
  if (Number.isNaN(value)) return 1;
  return Math.min(1.6, Math.max(0.6, value));
}

/** Đọc tiếng Việt bằng Google Translate TTS (online, miễn phí) */
function speakVietnamese(text: string): void {
  // Google TTS giới hạn ~200 ký tự mỗi request
  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    if (remaining.length <= 200) {
      chunks.push(remaining);
      break;
    }
    // Tách tại dấu chấm, dấu phẩy hoặc khoảng trắng gần vị trí 200
    let splitAt = remaining.lastIndexOf('. ', 200);
    if (splitAt < 50) splitAt = remaining.lastIndexOf(', ', 200);
    if (splitAt < 50) splitAt = remaining.lastIndexOf(' ', 200);
    if (splitAt < 50) splitAt = 200;
    chunks.push(remaining.substring(0, splitAt + 1));
    remaining = remaining.substring(splitAt + 1).trimStart();
  }

  let idx = 0;
  googleTtsBusy = true;

  function playNext() {
    if (idx >= chunks.length) {
      googleTtsBusy = false;
      currentAudio = null;
      return;
    }
    const encoded = encodeURIComponent(chunks[idx]);
    const url = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=vi&q=${encoded}`;
    currentAudio = new Audio(url);
    currentAudio.playbackRate = clampTtsSpeed(0.9 * ttsSpeed);
    currentAudio.onended = () => { idx++; playNext(); };
    currentAudio.onerror = () => {
      // Fallback: Web Speech API (sẽ đọc giọng Anh nếu không có voice Việt)
      googleTtsBusy = false;
      currentAudio = null;
      speakWithWebSpeech(text, 'vi');
    };
    currentAudio.play().catch(() => {
      googleTtsBusy = false;
      currentAudio = null;
      speakWithWebSpeech(text, 'vi');
    });
  }
  playNext();
}

/** Fallback: Web Speech API (dùng cho Tiếng Anh hoặc khi offline) */
function speakWithWebSpeech(text: string, lang: 'vi' | 'en'): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'en' ? 'en-US' : 'vi-VN';
  utterance.rate = clampTtsSpeed((lang === 'en' ? 0.9 : 0.85) * ttsSpeed);
  utterance.pitch = 1.1;
  // Prefer user-selected voice, supports special gender preferences.
  const voices = window.speechSynthesis.getVoices();
  const preferred = lang === 'vi' ? preferredVoiceVi : preferredVoiceEn;
  const voice = pickVoiceByPreference(voices, lang, preferred);
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

export function speakText(text: string, lang: 'vi' | 'en' = 'vi'): void {
  stopSpeaking();
  if (lang === 'vi') {
    const info = getTtsInfo();
    // Dùng Web Speech API nếu:
    // 1. User chọn mode native
    // 2. Auto mode + có voice tiếng Việt native
    // 3. User đã chọn giọng cụ thể + có voice native (Google TTS không hỗ trợ đổi giọng)
    const hasVoicePref = preferredVoiceVi !== '';
    const useNative = forceTtsMode === 'native' ||
      (forceTtsMode === 'auto' && info.hasVietnameseVoice) ||
      (forceTtsMode !== 'google' && hasVoicePref && info.hasVietnameseVoice);
    if (useNative) {
      speakWithWebSpeech(text, 'vi');
    } else {
      speakVietnamese(text);
    }
  } else {
    speakWithWebSpeech(text, 'en');
  }
}

export function stopSpeaking(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.onended = null;
    currentAudio.onerror = null;
    currentAudio = null;
    googleTtsBusy = false;
  }
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

export function isSpeaking(): boolean {
  return googleTtsBusy || ('speechSynthesis' in window && window.speechSynthesis.speaking);
}

/** Lấy thông tin TTS: voices đã cài, có voice tiếng Việt nội bộ không */
export interface TtsInfo {
  hasVietnameseVoice: boolean;
  voices: { name: string; lang: string }[];
  ttsMode: 'google' | 'native';
  voicesLoaded: boolean;
}

export function getTtsInfo(): TtsInfo {
  if (!('speechSynthesis' in window)) {
    return { hasVietnameseVoice: false, voices: [], ttsMode: 'google', voicesLoaded: false };
  }
  const voices = window.speechSynthesis.getVoices();
  const hasVi = voices.some((v) => isLikelyVietnameseVoice(v));
  return {
    hasVietnameseVoice: hasVi,
    voices: voices.map((v) => ({ name: v.name, lang: v.lang })),
    ttsMode: hasVi ? 'native' : 'google',
    voicesLoaded: voices.length > 0,
  };
}

/** Lắng nghe khi voices load xong (async trên nhiều trình duyệt) */
export function onVoicesReady(cb: (info: TtsInfo) => void): () => void {
  if (!('speechSynthesis' in window)) { cb(getTtsInfo()); return () => {}; }

  // Voices có thể đã load
  const info = getTtsInfo();
  if (info.voices.length > 0) { cb(info); return () => {}; }

  // Lắng nghe voiceschanged event
  const handler = () => cb(getTtsInfo());
  window.speechSynthesis.addEventListener('voiceschanged', handler);

  // Retry nhiều lần (voices có thể load chậm)
  const timers = [200, 500, 1000, 2000, 4000].map((ms) =>
    setTimeout(() => {
      const i = getTtsInfo();
      if (i.voices.length > 0) cb(i);
    }, ms)
  );

  return () => {
    window.speechSynthesis.removeEventListener('voiceschanged', handler);
    timers.forEach(clearTimeout);
  };
}

/** Cho phép user chọn mode TTS (native nếu đã cài voice Việt, hoặc Google) */
let forceTtsMode: 'auto' | 'google' | 'native' = 'auto';

export function setTtsMode(mode: 'auto' | 'google' | 'native'): void {
  forceTtsMode = mode;
  try { localStorage.setItem('hhk_tts_mode', mode); } catch { /* */ }
}

export function getTtsMode(): 'auto' | 'google' | 'native' {
  return forceTtsMode;
}

export function setTtsSpeed(speed: number): void {
  ttsSpeed = clampTtsSpeed(speed);
  try { localStorage.setItem('hhk_tts_speed', String(ttsSpeed)); } catch { /* */ }
}

export function getTtsSpeed(): number {
  return ttsSpeed;
}

export function setPreferredVoice(lang: 'vi' | 'en', voiceName: string): void {
  if (lang === 'vi') {
    preferredVoiceVi = voiceName;
    try { localStorage.setItem('hhk_tts_voice_vi', voiceName); } catch { /* */ }
    return;
  }
  preferredVoiceEn = voiceName;
  try { localStorage.setItem('hhk_tts_voice_en', voiceName); } catch { /* */ }
}

export function getVoicePreferenceOptions() {
  return {
    female: FEMALE_PREF,
    male: MALE_PREF,
  };
}

export function getPreferredVoice(lang: 'vi' | 'en'): string {
  return lang === 'vi' ? preferredVoiceVi : preferredVoiceEn;
}

// Load saved preference
try {
  const saved = localStorage.getItem('hhk_tts_mode');
  if (saved === 'google' || saved === 'native') forceTtsMode = saved;
} catch { /* */ }

try {
  const savedSpeed = localStorage.getItem('hhk_tts_speed');
  if (savedSpeed) ttsSpeed = clampTtsSpeed(Number(savedSpeed));
} catch { /* */ }

try {
  preferredVoiceVi = localStorage.getItem('hhk_tts_voice_vi') || '';
  preferredVoiceEn = localStorage.getItem('hhk_tts_voice_en') || '';
} catch { /* */ }
