import type { FeedbackTone } from '../../../shared/services/tts/ttsAssetKeys';

export interface LetterRound {
  image: string;
  hint: string;
  promptSpeech: string;
  answer: string;
  options: Array<{ key: string; icon: string; label: string }>;
}

export interface CountRound {
  image: string;
  promptSpeech: string;
  answer: number;
  options: Array<{ key: number; icon: string }>;
}

export interface TraceRound {
  image: string;
  promptSpeech: string;
  pattern: string;
  points: Array<{ key: string; icon: string }>;
  answer: string;
}

export const letterRounds: LetterRound[] = [
  {
    image: '🧒👩',
    hint: 'Be va me',
    promptSpeech: 'Nhin hinh be va me. Con cham vao tieng ME nhe.',
    answer: 'me',
    options: [
      { key: 'me', icon: '👩', label: 'ME' },
      { key: 'ba', icon: '👨', label: 'BA' },
      { key: 'be', icon: '🧒', label: 'BE' },
    ],
  },
  {
    image: '👶🐄',
    hint: 'Be va bo',
    promptSpeech: 'Con tim tieng BE trong cac lua chon nhe.',
    answer: 'be',
    options: [
      { key: 'be', icon: '👶', label: 'BE' },
      { key: 'bo', icon: '🐄', label: 'BO' },
      { key: 'na', icon: '👧', label: 'NA' },
    ],
  },
  {
    image: '👨🏠',
    hint: 'Ba o nha',
    promptSpeech: 'Con chon tieng BA nhe.',
    answer: 'ba',
    options: [
      { key: 'na', icon: '👧', label: 'NA' },
      { key: 'ba', icon: '👨', label: 'BA' },
      { key: 'me', icon: '👩', label: 'ME' },
    ],
  },
  {
    image: '👧🌸',
    hint: 'Ban Na',
    promptSpeech: 'Con cham vao tieng NA nao.',
    answer: 'na',
    options: [
      { key: 'be', icon: '👶', label: 'BE' },
      { key: 'na', icon: '👧', label: 'NA' },
      { key: 'ba', icon: '👨', label: 'BA' },
    ],
  },
];

export const countRounds: CountRound[] = [
  {
    image: '🍎🍎🍎',
    promptSpeech: 'Co bao nhieu qua tao? Con cham vao so dung.',
    answer: 3,
    options: [
      { key: 2, icon: '2️⃣' },
      { key: 3, icon: '3️⃣' },
      { key: 4, icon: '4️⃣' },
    ],
  },
  {
    image: '⭐ ⭐ ⭐ ⭐ ⭐',
    promptSpeech: 'Dem sao that nhanh. Co may ngoi sao?',
    answer: 5,
    options: [
      { key: 4, icon: '4️⃣' },
      { key: 5, icon: '5️⃣' },
      { key: 6, icon: '6️⃣' },
    ],
  },
  {
    image: '🎈🎈🎈🎈',
    promptSpeech: 'Co may qua bong bay nhe?',
    answer: 4,
    options: [
      { key: 3, icon: '3️⃣' },
      { key: 4, icon: '4️⃣' },
      { key: 5, icon: '5️⃣' },
    ],
  },
  {
    image: '🐟🐟',
    promptSpeech: 'Con dem so ca trong be nhe.',
    answer: 2,
    options: [
      { key: 1, icon: '1️⃣' },
      { key: 2, icon: '2️⃣' },
      { key: 3, icon: '3️⃣' },
    ],
  },
];

export const traceRounds: TraceRound[] = [
  {
    image: '🖍️ ───>',
    promptSpeech: 'To net thang. Con cham diem bat dau ben trai.',
    pattern: 'Net thang',
    answer: 'start',
    points: [
      { key: 'start', icon: '🟢' },
      { key: 'middle', icon: '🟡' },
      { key: 'end', icon: '🔴' },
    ],
  },
  {
    image: '🖍️ ⤿',
    promptSpeech: 'To net cong. Cham diem bat dau mau xanh.',
    pattern: 'Net cong',
    answer: 'start',
    points: [
      { key: 'middle', icon: '🟡' },
      { key: 'start', icon: '🟢' },
      { key: 'end', icon: '🔴' },
    ],
  },
  {
    image: '🖍️ ⭕',
    promptSpeech: 'To net tron. Cham diem bat dau de di vong tron.',
    pattern: 'Net tron',
    answer: 'start',
    points: [
      { key: 'end', icon: '🔴' },
      { key: 'start', icon: '🟢' },
      { key: 'middle', icon: '🟡' },
    ],
  },
];

export const PRE_GRADE_FEEDBACK_TEXT: Record<FeedbackTone, string> = {
  correct: 'Dung roi, con gioi lam!',
  wrong: 'Chua dung dau, minh thu lai cau tiep theo nhe.',
  completed: 'Tuyet voi! Con da hoan thanh mini game.',
};
