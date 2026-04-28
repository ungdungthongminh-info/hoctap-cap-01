import type { LessonCard, Question } from '../../../data/seedData';

export type TtsSsmlStyleId =
  | 'vi-lesson-reading'
  | 'vi-lesson-general'
  | 'vi-practice'
  | 'vi-pregrade'
  | 'vi-feedback'
  | 'vi-audit'
  | 'en-general';

interface SsmlStyleConfig {
  rate: number;
  paragraphBreakMs: number;
  sentenceBreakMs: number;
  commaBreakMs: number;
}

export interface VoiceAuditLine {
  id: string;
  label: string;
  lang: 'vi-VN' | 'en-US';
  styleId: TtsSsmlStyleId;
  text: string;
  notes: string;
}

const SSML_STYLES: Record<TtsSsmlStyleId, SsmlStyleConfig> = {
  'vi-lesson-reading': { rate: 0.9, paragraphBreakMs: 760, sentenceBreakMs: 520, commaBreakMs: 220 },
  'vi-lesson-general': { rate: 0.94, paragraphBreakMs: 680, sentenceBreakMs: 460, commaBreakMs: 190 },
  'vi-practice': { rate: 0.96, paragraphBreakMs: 560, sentenceBreakMs: 360, commaBreakMs: 150 },
  'vi-pregrade': { rate: 0.86, paragraphBreakMs: 820, sentenceBreakMs: 620, commaBreakMs: 260 },
  'vi-feedback': { rate: 0.98, paragraphBreakMs: 420, sentenceBreakMs: 260, commaBreakMs: 120 },
  'vi-audit': { rate: 0.9, paragraphBreakMs: 720, sentenceBreakMs: 520, commaBreakMs: 220 },
  'en-general': { rate: 0.96, paragraphBreakMs: 520, sentenceBreakMs: 360, commaBreakMs: 140 },
};

export const VOICE_AUDIT_LINES: VoiceAuditLine[] = [
  {
    id: 'reading-rhythm',
    label: 'Tập đọc - ngắt nhịp',
    lang: 'vi-VN',
    styleId: 'vi-audit',
    text: 'Bé đọc chậm. Ngắt nhịp ở dấu phẩy, rồi đọc tiếp ở cuối câu.',
    notes: 'Nghe độ rõ phụ âm và độ mềm khi xử lý dấu phẩy.',
  },
  {
    id: 'story-flow',
    label: 'Kể chuyện - tự nhiên',
    lang: 'vi-VN',
    styleId: 'vi-audit',
    text: 'Sáng nay, bé Mai đến lớp sớm. Bé chào cô giáo, rồi ngồi ngay ngắn vào bàn.',
    notes: 'Nghe độ tự nhiên ở câu kể chuyện và độ rơi giữa hai vế.',
  },
  {
    id: 'math-prompt',
    label: 'Toán - đọc phép tính',
    lang: 'vi-VN',
    styleId: 'vi-audit',
    text: 'Mười bốn cộng ba bằng bao nhiêu? Con hãy suy nghĩ, rồi chọn đáp án đúng.',
    notes: 'Nghe khả năng đọc số và nhấn nhịp ở câu hỏi toán.',
  },
];

const MOJIBAKE_TOKEN_RE = /(?:\u00C3.|\u00C2.|\u00C4.|\u00E1\u00BB|\u00E2\u20AC|\u00E2\u20A2|\u00EF\u00B8\u008F)/g;
const CONTROL_CHAR_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;
const REPLACEMENT_CHAR_RE = /\uFFFD/g;

function scoreMojibake(value: string): number {
  return (String(value || '').match(MOJIBAKE_TOKEN_RE) || []).length;
}

function scoreCorruption(value: string): number {
  return (String(value || '').match(CONTROL_CHAR_RE) || []).length
    + (String(value || '').match(REPLACEMENT_CHAR_RE) || []).length;
}

function repairLikelyMojibake(value: string): string {
  const raw = String(value || '');
  if (scoreMojibake(raw) === 0) {
    return raw;
  }

  try {
    const bytes = Uint8Array.from(raw, (char) => char.charCodeAt(0) & 0xff);
    const decoded = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    return scoreMojibake(decoded) < scoreMojibake(raw) ? decoded : raw;
  } catch {
    return raw;
  }
}

function stripUnsafeControlChars(value: string): string {
  return String(value || '')
    .replace(CONTROL_CHAR_RE, ' ')
    .replace(REPLACEMENT_CHAR_RE, ' ');
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripDecorativeEmoji(value: string): string {
  return value.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, ' ');
}

function normalizeWhitespace(value: string): string {
  return value
    .normalize('NFC')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function replaceSpeechSymbols(value: string): string {
  return value
    .replace(/>=/g, ' lớn hơn hoặc bằng ')
    .replace(/<=/g, ' bé hơn hoặc bằng ')
    .replace(/=>/g, ' dẫn đến ')
    .replace(/_{2,}/g, ' ô trống ')
    .replace(/(\S)\s*=\s*\?/g, '$1 bằng bao nhiêu')
    .replace(/(\S)\s*=\s*(\S)/g, '$1 bằng $2')
    .replace(/(\S)\s*\+\s*(\S)/g, '$1 cộng $2')
    .replace(/(\S)\s*[×*]\s*(\S)/g, '$1 nhân $2')
    .replace(/(\d)\s*[xX]\s*(\d)/g, '$1 nhân $2')
    .replace(/(\S)\s*\/\s*(\S)/g, '$1 chia $2')
    .replace(/\b(lớp|cấp|khối)\s*(\d)\s*-\s*(\d)/gi, '$1 $2 đến $3')
    .replace(/(\d)\s*-\s*(\d)/g, '$1 trừ $2')
    .replace(/\?\s*(cm|mm|dm|m|km|g|kg|ml|l|%)/gi, ' bao nhiêu $1')
    .replace(/…/g, '. ')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
}

function cleanNarrationText(value: string): string {
  const fallback = 'Nội dung này đang được cập nhật. Con xem phần chữ trên màn hình nhé.';
  const raw = String(value || '');
  if ((scoreCorruption(raw) >= 2 && raw.length >= 12) || scoreMojibake(raw) >= 6) {
    return fallback;
  }

  const repaired = repairLikelyMojibake(stripUnsafeControlChars(raw));
  if ((scoreCorruption(repaired) >= 1 && repaired.length >= 8) || scoreMojibake(repaired) >= 4) {
    return fallback;
  }

  const normalized = normalizeWhitespace(replaceSpeechSymbols(stripDecorativeEmoji(stripUnsafeControlChars(repaired))))
    .replace(/\s+([,.!?])/g, '$1');
  if (scoreCorruption(normalized) > 0 || normalized.includes('\uFFFD')) {
    return fallback;
  }
  return normalized;
}

function joinPromptAndSuffix(prompt: string, suffix: string): string {
  const cleanPrompt = cleanNarrationText(prompt);
  const cleanSuffix = cleanNarrationText(suffix);
  if (!cleanPrompt) {
    return cleanSuffix;
  }
  return /[.!?]$/.test(cleanPrompt) ? `${cleanPrompt} ${cleanSuffix}` : `${cleanPrompt}. ${cleanSuffix}`;
}

function toSsmlRate(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

function punctuateForSsml(value: string, style: SsmlStyleConfig): string {
  return value
    .replace(/\n\n/g, ` <break time="${style.paragraphBreakMs}ms"/> `)
    .replace(/\n/g, ` <break time="${Math.max(260, style.paragraphBreakMs - 180)}ms"/> `)
    .replace(/([.!?])\s+/g, `$1 <break time="${style.sentenceBreakMs}ms"/> `)
    .replace(/([,:;])\s+/g, `$1 <break time="${style.commaBreakMs}ms"/> `);
}

function safeParseOptions(question: Question): string[] {
  if (!question.optionsJson) {
    return [];
  }

  try {
    const parsed = JSON.parse(question.optionsJson) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item));
    }
  } catch {
    // Ignore malformed question option data.
  }

  return [];
}

export function buildLessonCardNarrationText(card: Pick<LessonCard, 'title' | 'content'>): string {
  return cleanNarrationText(`${card.title}. ${card.content}`);
}

export function buildQuestionNarrationText(question: Pick<Question, 'questionText' | 'questionType' | 'optionsJson'>): string {
  const prompt = String(question.questionText || '');

  if (question.questionType === 'true_false') {
    return joinPromptAndSuffix(prompt, 'Đúng. Sai.');
  }

  if (question.questionType === 'single_choice' || question.questionType === 'multi_choice') {
    const options = safeParseOptions(question as Question);
    if (options.length === 0) {
      return cleanNarrationText(prompt);
    }

    const optionText = options
      .map((option, index) => `Phương án ${String.fromCharCode(65 + index)}. ${cleanNarrationText(option)}`)
      .join('. ');
    return joinPromptAndSuffix(prompt, optionText.endsWith('.') ? optionText : `${optionText}.`);
  }

  return cleanNarrationText(prompt);
}

export function buildVietnameseSsml(text: string, styleId: TtsSsmlStyleId): string {
  const style = SSML_STYLES[styleId];
  const prepared = punctuateForSsml(escapeXml(cleanNarrationText(text)), style);
  return `<speak><prosody rate="${toSsmlRate(style.rate)}">${prepared}</prosody></speak>`;
}

export function buildEnglishSsml(text: string, styleId: TtsSsmlStyleId = 'en-general'): string {
  const style = SSML_STYLES[styleId];
  const prepared = punctuateForSsml(escapeXml(normalizeWhitespace(String(text || ''))), style);
  return `<speak><prosody rate="${toSsmlRate(style.rate)}">${prepared}</prosody></speak>`;
}

export function buildNarrationSsml(text: string, lang: 'vi-VN' | 'en-US', styleId: TtsSsmlStyleId): string {
  return lang === 'vi-VN' ? buildVietnameseSsml(text, styleId) : buildEnglishSsml(text, styleId);
}
