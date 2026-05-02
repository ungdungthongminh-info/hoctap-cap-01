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
  audioPacks: {
    getStorageInfo: () => Promise<{
      rootPath: string;
      totalBytes: number;
      packCount: number;
      schemaVersion: number;
    }>;
    list: () => Promise<{
      schemaVersion: number;
      updatedAt: string;
      storageRoot: string;
      totalBytes: number;
      packs: Array<{
        grade: number;
        gradeLabel: string;
        status: string;
        contentVersion: string;
        installedAt: string;
        updatedAt: string;
        profiles?: Array<{
          id: string;
          label: string;
          voiceId: string;
        }>;
        summary: {
          bytes: number;
          fileCount: number;
          mp3Count: number;
          availableEntries: number;
          missingEntries: number;
          isPlayableOffline: boolean;
          lessonCoverage?: {
            available: number;
            total: number;
            missing: number;
            ratio: number;
          };
        };
      }>;
    }>;
    download: (payload: { grade: number; replace?: boolean }) => Promise<unknown>;
    remove: (payload: { grade: number }) => Promise<unknown>;
    verify: (payload: { grade: number }) => Promise<unknown>;
    openFolder: (payload?: { grade?: number }) => Promise<{ path: string }>;
    getAssetUrl: (payload: { assetKey: string; grade?: number }) => Promise<{ url: string; grade: number; profileId: string } | null>;
    onProgress: (handler: (payload: {
      grade: number;
      phase: 'downloading' | 'extracting' | 'done';
      downloadedBytes: number;
      totalBytes: number;
      message: string;
      updatedAt: number;
    }) => void) => () => void;
  };
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
