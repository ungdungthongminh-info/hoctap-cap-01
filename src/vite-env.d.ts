/// <reference types="vite/client" />

declare global {
  const __APP_VERSION__: string;
}

interface ElectronAPI {
  db: {
    query: (sql: string, params?: unknown[]) => Promise<unknown[]>;
    run: (sql: string, params?: unknown[]) => Promise<{ changes: number; lastInsertRowid: number }>;
    get: (sql: string, params?: unknown[]) => Promise<unknown>;
  };
  updater: {
    getState: () => Promise<{
      phase: string;
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
    }>;
    checkForUpdates: () => Promise<unknown>;
    downloadUpdate: () => Promise<unknown>;
    quitAndInstall: () => Promise<boolean>;
    onStatus: (handler: (payload: unknown) => void) => () => void;
  };
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
