const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { initDatabase } = require('./database');
const { autoUpdater } = require('electron-updater');

let mainWindow;
let updaterCheckTimer = null;

const updaterState = {
  phase: 'idle',
  message: '',
  currentVersion: app.getVersion(),
  latestVersion: '',
  percent: 0,
  bytesPerSecond: 0,
  transferred: 0,
  total: 0,
  canInstall: false,
  isSupported: false,
  checkedAt: '',
};

function toErrorMessage(error) {
  if (!error) return 'Unknown updater error.';
  if (error instanceof Error) return error.message;
  return String(error);
}

function emitUpdaterState(patch = {}) {
  Object.assign(updaterState, patch, {
    checkedAt: new Date().toISOString(),
  });
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('updater:status', { ...updaterState });
  }
}

function setupAutoUpdater() {
  const isSupported = app.isPackaged;
  emitUpdaterState({
    isSupported,
    phase: isSupported ? 'idle' : 'unsupported',
    message: isSupported ? '' : 'Auto-update chi ho tro khi app da dong goi.',
  });

  if (!isSupported) {
    return;
  }

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('checking-for-update', () => {
    emitUpdaterState({
      phase: 'checking',
      message: 'Dang kiem tra ban cap nhat desktop...',
      canInstall: false,
      percent: 0,
      bytesPerSecond: 0,
      transferred: 0,
      total: 0,
    });
  });

  autoUpdater.on('update-available', (info) => {
    emitUpdaterState({
      phase: 'available',
      message: 'Da tim thay ban cap nhat moi. App dang tu tai ve nen.',
      latestVersion: String(info?.version || ''),
      canInstall: false,
    });
  });

  autoUpdater.on('update-not-available', () => {
    emitUpdaterState({
      phase: 'up-to-date',
      message: 'Desktop app dang o ban moi nhat.',
      canInstall: false,
      percent: 0,
      bytesPerSecond: 0,
      transferred: 0,
      total: 0,
    });
  });

  autoUpdater.on('download-progress', (progress) => {
    emitUpdaterState({
      phase: 'downloading',
      message: `Dang tai cap nhat (${Math.round(Number(progress?.percent || 0))}%)...`,
      percent: Number(progress?.percent || 0),
      bytesPerSecond: Number(progress?.bytesPerSecond || 0),
      transferred: Number(progress?.transferred || 0),
      total: Number(progress?.total || 0),
      canInstall: false,
    });
  });

  autoUpdater.on('update-downloaded', (info) => {
    emitUpdaterState({
      phase: 'downloaded',
      message: 'Da tai xong ban cap nhat. Bam Cai dat & khoi dong lai de ap dung.',
      latestVersion: String(info?.version || updaterState.latestVersion || ''),
      canInstall: true,
      percent: 100,
    });
  });

  autoUpdater.on('error', (error) => {
    emitUpdaterState({
      phase: 'error',
      message: `Auto-update gap loi: ${toErrorMessage(error)}`,
      canInstall: false,
    });
  });

  const runCheck = () => autoUpdater.checkForUpdates().catch((error) => {
    emitUpdaterState({
      phase: 'error',
      message: `Khong the kiem tra cap nhat: ${toErrorMessage(error)}`,
      canInstall: false,
    });
    return null;
  });

  setTimeout(() => {
    void runCheck();
  }, 20_000);

  updaterCheckTimer = setInterval(() => {
    void runCheck();
  }, 30 * 60_000);

  ipcMain.handle('updater:get-state', () => ({ ...updaterState }));
  ipcMain.handle('updater:check-for-updates', async () => {
    await runCheck();
    return { ...updaterState };
  });
  ipcMain.handle('updater:download-update', async () => {
    if (!app.isPackaged) {
      emitUpdaterState({
        phase: 'unsupported',
        message: 'Che do dev khong ho tro tai update desktop.',
      });
      return { ...updaterState };
    }
    await autoUpdater.downloadUpdate().catch((error) => {
      emitUpdaterState({
        phase: 'error',
        message: `Khong the tai ban cap nhat: ${toErrorMessage(error)}`,
        canInstall: false,
      });
    });
    return { ...updaterState };
  });
  ipcMain.handle('updater:quit-and-install', () => {
    if (!app.isPackaged) {
      return false;
    }
    autoUpdater.quitAndInstall(false, true);
    return true;
  });
}

function createWindow() {
  const appTitle = app.getName() || 'Hoc Hung Khoi Tieu Hoc';
  const isDev = !app.isPackaged && process.env.NODE_ENV !== 'production';
  const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://127.0.0.1:5190';

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: appTitle,
    icon: path.join(__dirname, '../public/icon.png'),
    backgroundColor: '#FFF7ED',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Dev mode: load from Vite dev server
  if (isDev) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  const db = initDatabase();

  // Expose DB operations via IPC
  ipcMain.handle('db:query', (_event, sql, params) => {
    const stmt = db.prepare(sql);
    return stmt.all(...(params || []));
  });

  ipcMain.handle('db:run', (_event, sql, params) => {
    const stmt = db.prepare(sql);
    return stmt.run(...(params || []));
  });

  ipcMain.handle('db:get', (_event, sql, params) => {
    const stmt = db.prepare(sql);
    return stmt.get(...(params || []));
  });

  createWindow();

  setupAutoUpdater();
});

app.on('window-all-closed', () => {
  if (updaterCheckTimer) {
    clearInterval(updaterCheckTimer);
    updaterCheckTimer = null;
  }
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
