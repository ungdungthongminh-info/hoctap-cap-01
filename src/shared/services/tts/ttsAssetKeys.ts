export type PreGradeMode = 'letters' | 'counting' | 'tracing';
export type FeedbackTone = 'correct' | 'wrong' | 'completed';

export function buildLessonCardAssetKey(cardId: number): string {
  return `lesson-card:${cardId}`;
}

export function buildQuestionAssetKey(questionId: number): string {
  return `question:${questionId}`;
}

export function buildPreGradePromptAssetKey(mode: PreGradeMode, index: number): string {
  return `pregrade:${mode}:${index}:prompt`;
}

export function buildPreGradeFeedbackAssetKey(tone: FeedbackTone): string {
  return `feedback:${tone}`;
}

export function buildVoiceAuditAssetKey(profileId: string, sampleId: string): string {
  return `audit:${profileId}:${sampleId}`;
}
