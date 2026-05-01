export type DesktopUpdaterPhase =
  | 'idle'
  | 'unsupported'
  | 'checking'
  | 'available'
  | 'up-to-date'
  | 'downloading'
  | 'downloaded'
  | 'error';

export interface DesktopUpdaterState {
  phase: DesktopUpdaterPhase;
  message: string;
  currentVersion: string;
  latestVersion: string;
  percent: number;
  bytesPerSecond: number;
  transferred: number;
  total: number;
  canInstall: boolean;
  isSupported: boolean;
  checkedAt: string;
}

const defaultState: DesktopUpdaterState = {
  phase: 'unsupported',
  message: '',
  currentVersion: typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : '0.1.0',
  latestVersion: '',
  percent: 0,
  bytesPerSecond: 0,
  transferred: 0,
  total: 0,
  canInstall: false,
  isSupported: false,
  checkedAt: '',
};

const listeners = new Set<() => void>();
let state: DesktopUpdaterState = { ...defaultState };
let initialized = false;
let detachNativeListener: (() => void) | null = null;

function normalizeState(input: unknown): DesktopUpdaterState {
  const raw = (input || {}) as Partial<DesktopUpdaterState>;
  return {
    phase: (raw.phase || defaultState.phase) as DesktopUpdaterPhase,
    message: String(raw.message || ''),
    currentVersion: String(raw.currentVersion || defaultState.currentVersion),
    latestVersion: String(raw.latestVersion || ''),
    percent: Number(raw.percent || 0),
    bytesPerSecond: Number(raw.bytesPerSecond || 0),
    transferred: Number(raw.transferred || 0),
    total: Number(raw.total || 0),
    canInstall: Boolean(raw.canInstall),
    isSupported: Boolean(raw.isSupported),
    checkedAt: String(raw.checkedAt || ''),
  };
}

function emit(): void {
  listeners.forEach((listener) => listener());
}

function setState(next: unknown): void {
  state = normalizeState(next);
  emit();
}

function hasDesktopBridge(): boolean {
  return typeof window !== 'undefined' && Boolean(window.electronAPI?.updater);
}

export function getDesktopUpdaterState(): DesktopUpdaterState {
  return { ...state };
}

export function isDesktopUpdaterBridgeAvailable(): boolean {
  return hasDesktopBridge();
}

export function subscribeDesktopUpdater(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function ensureDesktopUpdaterInitialized(): Promise<void> {
  if (initialized) {
    return;
  }
  initialized = true;

  if (!hasDesktopBridge()) {
    setState({ ...defaultState, isSupported: false, phase: 'unsupported' });
    return;
  }

  detachNativeListener = window.electronAPI.updater.onStatus((payload) => {
    setState(payload);
  });

  try {
    const initial = await window.electronAPI.updater.getState();
    setState(initial);
  } catch {
    setState({
      ...defaultState,
      phase: 'error',
      message: 'Khong doc duoc trang thai auto-update desktop.',
      isSupported: true,
    });
  }
}

export async function checkDesktopUpdaterNow(): Promise<void> {
  await ensureDesktopUpdaterInitialized();
  if (!hasDesktopBridge()) {
    return;
  }
  await window.electronAPI.updater.checkForUpdates();
}

export async function downloadDesktopUpdateNow(): Promise<void> {
  await ensureDesktopUpdaterInitialized();
  if (!hasDesktopBridge()) {
    return;
  }
  await window.electronAPI.updater.downloadUpdate();
}

export async function installDesktopUpdateNow(): Promise<boolean> {
  await ensureDesktopUpdaterInitialized();
  if (!hasDesktopBridge()) {
    return false;
  }
  return window.electronAPI.updater.quitAndInstall();
}

export function disposeDesktopUpdater(): void {
  if (detachNativeListener) {
    detachNativeListener();
    detachNativeListener = null;
  }
  initialized = false;
}
