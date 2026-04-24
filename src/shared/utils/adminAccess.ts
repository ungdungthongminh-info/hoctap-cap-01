import { SESSION_KEYS } from '../constants/storageKeys';

export function isAdminUnlocked(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEYS.ADMIN_UNLOCKED) === '1';
  } catch {
    return false;
  }
}

export function unlockAdmin(inputPin: string): boolean {
  const expectedPin = import.meta.env.VITE_ADMIN_PIN;
  if (!expectedPin || String(inputPin).trim() !== String(expectedPin).trim()) return false;
  try {
    sessionStorage.setItem(SESSION_KEYS.ADMIN_UNLOCKED, '1');
  } catch {
    // ignore
  }
  return true;
}

export function lockAdmin(): void {
  try {
    sessionStorage.removeItem(SESSION_KEYS.ADMIN_UNLOCKED);
  } catch {
    // ignore
  }
}
