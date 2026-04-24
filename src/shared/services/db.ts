/**
 * Database service — gọi SQLite qua Electron IPC
 * Khi chạy trong browser (dev mode không Electron), dùng mock localStorage
 */

const isElectron = typeof window !== 'undefined' && !!window.electronAPI;

export const db = {
  async query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]> {
    if (isElectron) {
      return window.electronAPI.db.query(sql, params) as Promise<T[]>;
    }
    // Mock for browser dev
    console.log('[DB Mock] query:', sql, params);
    return [] as T[];
  },

  async run(sql: string, params?: unknown[]) {
    if (isElectron) {
      return window.electronAPI.db.run(sql, params);
    }
    console.log('[DB Mock] run:', sql, params);
    return { changes: 0, lastInsertRowid: 0 };
  },

  async get<T = unknown>(sql: string, params?: unknown[]): Promise<T | undefined> {
    if (isElectron) {
      return window.electronAPI.db.get(sql, params) as Promise<T | undefined>;
    }
    console.log('[DB Mock] get:', sql, params);
    return undefined;
  },
};
