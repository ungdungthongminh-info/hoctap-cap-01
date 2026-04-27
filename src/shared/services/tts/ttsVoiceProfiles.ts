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
    label: 'Ung vien 1 - Wavenet A',
    lang: 'vi-VN',
    voiceId: 'vi-VN-Wavenet-A',
    notes: 'Uu tien cho giong nu doc ro, dung lam giong mac dinh de tao san audio.',
    candidateRank: 1,
    targetPersona: 'female-clear',
    isDefault: true,
  },
  {
    id: 'vi-v2',
    label: 'Ung vien 2 - Wavenet C',
    lang: 'vi-VN',
    voiceId: 'vi-VN-Wavenet-C',
    notes: 'Ung vien du phong de so sanh do mem va nhac nhip khi doc tap doc.',
    candidateRank: 2,
    targetPersona: 'female-clear',
  },
  {
    id: 'vi-v3',
    label: 'Ung vien 3 - Standard A',
    lang: 'vi-VN',
    voiceId: 'vi-VN-Standard-A',
    notes: 'Ung vien tiet kiem hon, dung de doi chieu do ro va nhiet giong.',
    candidateRank: 3,
    targetPersona: 'female-clear',
  },
  {
    id: 'en-v1',
    label: 'English support - Neural2 F',
    lang: 'en-US',
    voiceId: 'en-US-Neural2-F',
    notes: 'Giup giu dong bo cho cac bai tieng Anh can audio tinh.',
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
