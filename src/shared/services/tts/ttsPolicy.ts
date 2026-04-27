export type TtsPolicyId =
  | 'lesson-prefetch'
  | 'lesson-read-all'
  | 'practice-on-demand'
  | 'pre-grade-auto'
  | 'feedback-short'
  | 'fallback-native';

export interface TtsPolicy {
  id: TtsPolicyId;
  usage: TtsPolicyId;
  preferBackend: boolean;
  description: string;
}

const TTS_POLICIES: Record<TtsPolicyId, TtsPolicy> = {
  'lesson-prefetch': {
    id: 'lesson-prefetch',
    usage: 'lesson-prefetch',
    preferBackend: true,
    description: 'Warm lesson audio into backend MP3 cache before playback.',
  },
  'lesson-read-all': {
    id: 'lesson-read-all',
    usage: 'lesson-read-all',
    preferBackend: true,
    description: 'Read a lesson card sequence with cache-aware playback.',
  },
  'practice-on-demand': {
    id: 'practice-on-demand',
    usage: 'practice-on-demand',
    preferBackend: true,
    description: 'Fetch audio only when the learner taps nghe.',
  },
  'pre-grade-auto': {
    id: 'pre-grade-auto',
    usage: 'pre-grade-auto',
    preferBackend: true,
    description: 'Keep auto-read for pre-grade flows while still allowing fallback.',
  },
  'feedback-short': {
    id: 'feedback-short',
    usage: 'feedback-short',
    preferBackend: false,
    description: 'Prefer lightweight short feedback with quick fallback.',
  },
  'fallback-native': {
    id: 'fallback-native',
    usage: 'fallback-native',
    preferBackend: false,
    description: 'Force local/native playback.',
  },
};

export function getTtsPolicy(policyId: TtsPolicyId = 'practice-on-demand'): TtsPolicy {
  return TTS_POLICIES[policyId];
}

export function listTtsPolicies(): TtsPolicy[] {
  return Object.values(TTS_POLICIES);
}
