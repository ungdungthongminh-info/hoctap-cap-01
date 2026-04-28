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
    hint: 'Bé và mẹ',
    promptSpeech: 'Nhìn hình bé và mẹ. Con chạm vào tiếng MẸ nhé.',
    answer: 'me',
    options: [
      { key: 'me', icon: '👩', label: 'MẸ' },
      { key: 'ba', icon: '👨', label: 'BA' },
      { key: 'be', icon: '🧒', label: 'BÉ' },
    ],
  },
  {
    image: '👶🐄',
    hint: 'Bé và bò',
    promptSpeech: 'Con tìm tiếng BÉ trong các lựa chọn nhé.',
    answer: 'be',
    options: [
      { key: 'be', icon: '👶', label: 'BÉ' },
      { key: 'bo', icon: '🐄', label: 'BÒ' },
      { key: 'na', icon: '👧', label: 'NA' },
    ],
  },
  {
    image: '👨🏠',
    hint: 'Ba ở nhà',
    promptSpeech: 'Con chọn tiếng BA nhé.',
    answer: 'ba',
    options: [
      { key: 'na', icon: '👧', label: 'NA' },
      { key: 'ba', icon: '👨', label: 'BA' },
      { key: 'me', icon: '👩', label: 'MẸ' },
    ],
  },
  {
    image: '👧🌸',
    hint: 'Bạn Na',
    promptSpeech: 'Con chạm vào tiếng NA nào.',
    answer: 'na',
    options: [
      { key: 'be', icon: '👶', label: 'BÉ' },
      { key: 'na', icon: '👧', label: 'NA' },
      { key: 'ba', icon: '👨', label: 'BA' },
    ],
  },
];

export const countRounds: CountRound[] = [
  {
    image: '🍎🍎🍎',
    promptSpeech: 'Có bao nhiêu quả táo? Con chạm vào số đúng.',
    answer: 3,
    options: [
      { key: 2, icon: '2️⃣' },
      { key: 3, icon: '3️⃣' },
      { key: 4, icon: '4️⃣' },
    ],
  },
  {
    image: '⭐ ⭐ ⭐ ⭐ ⭐',
    promptSpeech: 'Đếm sao thật nhanh. Có mấy ngôi sao?',
    answer: 5,
    options: [
      { key: 4, icon: '4️⃣' },
      { key: 5, icon: '5️⃣' },
      { key: 6, icon: '6️⃣' },
    ],
  },
  {
    image: '🎈🎈🎈🎈',
    promptSpeech: 'Có mấy quả bóng bay nhỉ?',
    answer: 4,
    options: [
      { key: 3, icon: '3️⃣' },
      { key: 4, icon: '4️⃣' },
      { key: 5, icon: '5️⃣' },
    ],
  },
  {
    image: '🐟🐟',
    promptSpeech: 'Con đếm số cá trong bể nhé.',
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
    promptSpeech: 'Tô nét thẳng. Con chạm điểm bắt đầu bên trái.',
    pattern: 'Nét thẳng',
    answer: 'start',
    points: [
      { key: 'start', icon: '🟢' },
      { key: 'middle', icon: '🟡' },
      { key: 'end', icon: '🔴' },
    ],
  },
  {
    image: '🖍️ ⤿',
    promptSpeech: 'Tô nét cong. Chạm điểm bắt đầu màu xanh.',
    pattern: 'Nét cong',
    answer: 'start',
    points: [
      { key: 'middle', icon: '🟡' },
      { key: 'start', icon: '🟢' },
      { key: 'end', icon: '🔴' },
    ],
  },
  {
    image: '🖍️ ⭕',
    promptSpeech: 'Tô nét tròn. Chạm điểm bắt đầu để đi vòng tròn.',
    pattern: 'Nét tròn',
    answer: 'start',
    points: [
      { key: 'end', icon: '🔴' },
      { key: 'start', icon: '🟢' },
      { key: 'middle', icon: '🟡' },
    ],
  },
];

export const PRE_GRADE_FEEDBACK_TEXT: Record<FeedbackTone, string> = {
  correct: 'Đúng rồi, con giỏi lắm!',
  wrong: 'Chưa đúng đâu, mình thử lại câu tiếp theo nhé.',
  completed: 'Tuyệt vời! Con đã hoàn thành mini game.',
};
