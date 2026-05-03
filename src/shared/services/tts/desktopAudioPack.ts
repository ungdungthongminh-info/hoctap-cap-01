import { STORAGE_KEYS as APP_STORAGE_KEYS } from '../../constants/storageKeys';

function getGradeFromAppState(): number | null {
  try {
    const raw = localStorage.getItem(APP_STORAGE_KEYS.APP_STATE);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { student?: { grade?: unknown } };
    const grade = Number(parsed?.student?.grade);
    return Number.isFinite(grade) ? grade : null;
  } catch {
    return null;
  }
}

function getGradeFromAudioSetting(): number | null {
  try {
    const raw = localStorage.getItem('hhk_tts_pack_selected_grade');
    const grade = Number(raw);
    return Number.isFinite(grade) ? grade : null;
  } catch {
    return null;
  }
}

export function getPreferredDesktopPackGrade(): number | undefined {
  const fromState = getGradeFromAppState();
  if (fromState !== null) {
    return fromState;
  }

  const fromSetting = getGradeFromAudioSetting();
  return fromSetting === null ? undefined : fromSetting;
}

export async function getDesktopAudioAssetUrl(assetKey?: string, preferredGrade?: number): Promise<string | null> {
  if (!assetKey || typeof window === 'undefined') {
    return null;
  }

  const bridge = window.electronAPI?.audioPacks;
  if (!bridge || typeof bridge.getAssetUrl !== 'function') {
    return null;
  }

  try {
    const result = await bridge.getAssetUrl({
      assetKey,
      grade: preferredGrade,
    });
    return String(result?.url || '') || null;
  } catch {
    return null;
  }
}
