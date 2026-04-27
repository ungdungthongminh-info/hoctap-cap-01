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
    label: 'Tap doc - ngat nhip',
    lang: 'vi-VN',
    styleId: 'vi-audit',
    text: 'Be doc cham. Ngat nhip o dau phay, roi doc tiep o cuoi cau.',
    notes: 'Nghe do ro phu am va do mem khi xu ly dau phay.',
  },
  {
    id: 'story-flow',
    label: 'Ke chuyen - tu nhien',
    lang: 'vi-VN',
    styleId: 'vi-audit',
    text: 'Sang nay, be Mai den lop som. Be chao co giao, roi ngoi ngay ngan vao ban.',
    notes: 'Nghe do tu nhien o cau ke chuyen va do roi giua hai ve.',
  },
  {
    id: 'math-prompt',
    label: 'Toan - doc phep tinh',
    lang: 'vi-VN',
    styleId: 'vi-audit',
    text: 'Muoi bon cong ba bang bao nhieu? Con hay suy nghi, roi chon dap an dung.',
    notes: 'Nghe kha nang doc so va nhan nhip o cau hoi toan.',
  },
];

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
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function replaceSpeechSymbols(value: string): string {
  return value
    .replace(/>=/g, ' lon hon hoac bang ')
    .replace(/<=/g, ' be hon hoac bang ')
    .replace(/=/g, ' bang ')
    .replace(/\+/g, ' cong ')
    .replace(/×/g, ' nhan ')
    .replace(/x/g, ' x ')
    .replace(/\//g, ' chia ')
    .replace(/-/g, ' tru ')
    .replace(/>/g, ' lon hon ')
    .replace(/</g, ' be hon ')
    .replace(/:/g, '. ')
    .replace(/;/g, ', ')
    .replace(/…/g, '. ')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
}

function cleanNarrationText(value: string): string {
  return normalizeWhitespace(replaceSpeechSymbols(stripDecorativeEmoji(String(value || ''))))
    .replace(/\s+([,.!?])/g, '$1');
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
  const prompt = cleanNarrationText(question.questionText);

  if (question.questionType === 'true_false') {
    return `${prompt}. Dung. Sai.`;
  }

  if (question.questionType === 'single_choice' || question.questionType === 'multi_choice') {
    const options = safeParseOptions(question as Question);
    if (options.length === 0) {
      return prompt;
    }

    const optionText = options
      .map((option, index) => `Phuong an ${String.fromCharCode(65 + index)}. ${cleanNarrationText(option)}`)
      .join('. ');
    return `${prompt}. ${optionText}.`;
  }

  return prompt;
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
