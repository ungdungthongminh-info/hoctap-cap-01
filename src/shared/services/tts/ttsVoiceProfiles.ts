export interface StaticTtsVoiceProfile {
  id: string;
  label: string;
  lang: 'vi-VN' | 'en-US';
  voiceId: string;
  notes: string;
  candidateRank: number;
  targetPersona: 'female-clear' | 'neutral-clear';
  isDefault?: boolean;
}

export const STATIC_TTS_VOICE_PROFILES: StaticTtsVoiceProfile[] = [
  {
    id: 'vi-v1',
    label: 'Giọng chuẩn - Chirp3 HD Despina',
    lang: 'vi-VN',
    voiceId: 'vi-VN-Chirp3-HD-Despina',
    notes: 'Giọng nữ rõ, dùng mặc định để pre-generate audio học bài.',
    candidateRank: 1,
    targetPersona: 'female-clear',
    isDefault: true,
  },
  {
    id: 'vi-v2',
    label: 'Ứng viên 2 - Chirp3 HD Achernar',
    lang: 'vi-VN',
    voiceId: 'vi-VN-Chirp3-HD-Achernar',
    notes: 'Ứng viên đối chiếu độ rõ với giọng chuẩn.',
    candidateRank: 2,
    targetPersona: 'female-clear',
  },
  {
    id: 'vi-v3',
    label: 'Ứng viên 3 - Chirp3 HD Achird',
    lang: 'vi-VN',
    voiceId: 'vi-VN-Chirp3-HD-Achird',
    notes: 'Ứng viên dự phòng khi cần so sánh phụ âm và nhịp.',
    candidateRank: 3,
    targetPersona: 'neutral-clear',
  },
  {
    id: 'en-v1',
    label: 'English support - Neural2 F',
    lang: 'en-US',
    voiceId: 'en-US-Neural2-F',
    notes: 'Giữ đồng bộ cho các bài tiếng Anh cần audio tĩnh.',
    candidateRank: 1,
    targetPersona: 'neutral-clear',
  },
];

export function listStaticVoiceProfiles(lang?: 'vi-VN' | 'en-US'): StaticTtsVoiceProfile[] {
  if (!lang) {
    return [...STATIC_TTS_VOICE_PROFILES];
  }

  return STATIC_TTS_VOICE_PROFILES.filter((profile) => profile.lang === lang);
}

export function getStaticVoiceProfile(profileId: string): StaticTtsVoiceProfile | undefined {
  return STATIC_TTS_VOICE_PROFILES.find((profile) => profile.id === profileId);
}

export function getDefaultStaticVoiceProfile(lang: 'vi-VN' | 'en-US' = 'vi-VN'): StaticTtsVoiceProfile {
  return listStaticVoiceProfiles(lang).find((profile) => profile.isDefault)
    || listStaticVoiceProfiles(lang)[0]
    || STATIC_TTS_VOICE_PROFILES[0];
}
