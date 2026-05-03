import { getPreferredDesktopPackGrade } from './src/shared/services/tts/desktopAudioPack.ts';
import { STORAGE_KEYS } from './src/shared/constants/storageKeys.ts';
const store = new Map<string, string>();
(globalThis as any).localStorage = {
  getItem: (k: string) => (store.has(k) ? String(store.get(k)) : null),
  setItem: (k: string, v: string) => { store.set(k, String(v)); },
  removeItem: (k: string) => { store.delete(k); },
};
function runCase(name: string) { console.log(name, getPreferredDesktopPackGrade()); }
localStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify({ student: { grade: 1 } }));
localStorage.setItem('hhk_tts_pack_selected_grade', '2');
runCase('CASE_state1_setting2');
localStorage.removeItem(STORAGE_KEYS.APP_STATE);
runCase('CASE_noState_setting2');
localStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify({ student: { grade: 2 } }));
localStorage.setItem('hhk_tts_pack_selected_grade', '1');
runCase('CASE_state2_setting1');
