const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { initDatabase } = require('./database');
const { autoUpdater } = require('electron-updater');
const audioPackStore = require('./audioPackStore');
const licenseCacheStore = require('./licenseCacheStore');

let mainWindow;
let updaterCheckTimer = null;

const DESKTOP_RUNTIME_AUDIT = process.env.HHK_DESKTOP_RUNTIME_TEST === '1';
const DESKTOP_ACCEPTANCE_AUDIT = process.env.HHK_DESKTOP_ACCEPTANCE_TEST === '1';

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

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitFor(testFn, timeoutMs = 30_000, intervalMs = 500) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const hit = await testFn();
    if (hit) {
      return true;
    }
    await delay(intervalMs);
  }
  return false;
}

async function runDesktopRuntimeAudit(windowRef) {
  if (!DESKTOP_RUNTIME_AUDIT || !windowRef || windowRef.isDestroyed()) {
    return;
  }

  const outputPath = process.env.HHK_DESKTOP_RUNTIME_TEST_OUTPUT
    ? path.resolve(process.env.HHK_DESKTOP_RUNTIME_TEST_OUTPUT)
    : path.join(app.getPath('userData'), 'desktop-runtime-audit.json');

  const sessionRef = windowRef.webContents.session;
  const networkEvents = [];
  let offlineMode = false;

  sessionRef.webRequest.onBeforeRequest((details, callback) => {
    const url = String(details?.url || '');
    const isHttp = /^https?:\/\//i.test(url);
    if (offlineMode && isHttp) {
      networkEvents.push({
        type: 'blocked',
        url,
        timestamp: new Date().toISOString(),
      });
      callback({ cancel: true });
      return;
    }
    if (isHttp) {
      networkEvents.push({
        type: 'allowed',
        url,
        timestamp: new Date().toISOString(),
      });
    }
    callback({});
  });

  const report = {
    startedAt: new Date().toISOString(),
    outputPath,
    clickOk: false,
    runtimeLogs: [],
    consoleRuntimeLogs: [],
    networkEvents: [],
    pass: false,
    reason: '',
  };

  try {
    await delay(2_000);

    await windowRef.webContents.executeJavaScript(`
      (() => {
        try {
          localStorage.setItem('hhk_tts_pack_selected_grade', '1');
        } catch {}
        try {
          window.__HHK_TTS_RUNTIME_LOGS__ = [];
          window.__HHK_TTS_RUNTIME_CONSOLE_LOGS__ = [];
          if (!window.__HHK_TTS_RUNTIME_HOOKED__) {
            const originalInfo = console.info.bind(console);
            console.info = (...args) => {
              try {
                if (args && args[0] === '[TTS_RUNTIME_RESULT]' && args[1]) {
                  const host = window;
                  if (!Array.isArray(host.__HHK_TTS_RUNTIME_CONSOLE_LOGS__)) {
                    host.__HHK_TTS_RUNTIME_CONSOLE_LOGS__ = [];
                  }
                  host.__HHK_TTS_RUNTIME_CONSOLE_LOGS__.push(args[1]);
                }
              } catch {}
              originalInfo(...args);
            };
            window.__HHK_TTS_RUNTIME_HOOKED__ = true;
          }
        } catch {}
        if (location.hash !== '#/lessons/1') {
          location.hash = '#/lessons/1';
        }
        return true;
      })();
    `);

    const lessonReady = await waitFor(async () => {
      return windowRef.webContents.executeJavaScript(`
        (() => {
          const title = document.querySelector('h1');
          const hasReadBtn = Array.from(document.querySelectorAll('button')).some((btn) => {
            const label = String(btn.textContent || '').trim();
            return label.includes('Đọc');
          });
          return Boolean(title) && hasReadBtn;
        })();
      `);
    }, 45_000, 700);

    if (!lessonReady) {
      throw new Error('Khong vao duoc man hinh bai hoc lop 1 hoac khong tim thay nut Doc.');
    }

    offlineMode = true;

    const clickResult = await windowRef.webContents.executeJavaScript(`
      (() => {
        window.__HHK_TTS_RUNTIME_LOGS__ = [];
        window.__HHK_TTS_RUNTIME_CONSOLE_LOGS__ = [];
        const buttons = Array.from(document.querySelectorAll('button'));
        const target = buttons.find((btn) => String(btn.textContent || '').trim().includes('Đọc cả bài'))
          || buttons.find((btn) => String(btn.textContent || '').trim() === 'Đọc')
          || buttons.find((btn) => String(btn.textContent || '').trim().includes('Đọc'));
        if (!target) {
          return { ok: false, reason: 'read-button-not-found' };
        }
        target.click();
        return { ok: true };
      })();
    `);

    report.clickOk = Boolean(clickResult?.ok);
    if (!report.clickOk) {
      throw new Error(String(clickResult?.reason || 'Khong bam duoc nut Doc.'));
    }

    const hasRuntimeLog = await waitFor(async () => {
      return windowRef.webContents.executeJavaScript(`
        (() => {
          const logs = Array.isArray(window.__HHK_TTS_RUNTIME_LOGS__) ? window.__HHK_TTS_RUNTIME_LOGS__ : [];
          return logs.some((item) => item && (item.status === 'completed' || item.status === 'error'));
        })();
      `);
    }, 60_000, 800);

    await delay(1_500);

    report.runtimeLogs = await windowRef.webContents.executeJavaScript(`
      (() => {
        return Array.isArray(window.__HHK_TTS_RUNTIME_LOGS__) ? window.__HHK_TTS_RUNTIME_LOGS__ : [];
      })();
    `);
    report.consoleRuntimeLogs = await windowRef.webContents.executeJavaScript(`
      (() => {
        return Array.isArray(window.__HHK_TTS_RUNTIME_CONSOLE_LOGS__) ? window.__HHK_TTS_RUNTIME_CONSOLE_LOGS__ : [];
      })();
    `);
    report.networkEvents = networkEvents;

    if (!hasRuntimeLog) {
      report.reason = 'Khong thu duoc runtime log completed/error trong thoi gian cho.';
    } else {
      const runtimePool = Array.isArray(report.runtimeLogs) && report.runtimeLogs.length > 0
        ? report.runtimeLogs
        : report.consoleRuntimeLogs;
      const completed = runtimePool.find((item) => item && item.status === 'completed');
      const providerOk = completed?.provider === 'static-manifest';
      const sourceOk = completed?.resolvedSource === 'desktop-offline';
      const keyOk = completed?.assetKey === 'lesson-card:1';
      const assetUrl = String(completed?.assetUrl || '');
      const assetUrlOk = assetUrl.length > 0;
      const hasGoogle = networkEvents.some((evt) => /googleapis|gstatic|google\.com/i.test(String(evt.url || '')));
      const hasBackend = networkEvents.some((evt) => /api\/v1\/tts|ungdungthongminh\.shop|127\.0\.0\.1:5000/i.test(String(evt.url || '')));

      report.pass = Boolean(providerOk && sourceOk && keyOk && assetUrlOk && !hasGoogle && !hasBackend);
      report.reason = report.pass
        ? 'Desktop runtime PASS.'
        : 'Desktop runtime FAIL: khong dat du provider/resolvedSource/assetKey/assetUrl hoac con goi mang Google/backend.';
    }
  } catch (error) {
    report.pass = false;
    report.reason = String(error?.message || error || 'Desktop runtime audit failed.');
    report.networkEvents = networkEvents;
  }

  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8');
  console.log('[DESKTOP_RUNTIME_AUDIT]', JSON.stringify(report));

  setTimeout(() => {
    app.quit();
  }, 500);
}

async function runDesktopAcceptanceAudit(windowRef) {
  if (!DESKTOP_ACCEPTANCE_AUDIT || !windowRef || windowRef.isDestroyed()) {
    return;
  }

  const outputPath = process.env.HHK_DESKTOP_ACCEPTANCE_OUTPUT
    ? path.resolve(process.env.HHK_DESKTOP_ACCEPTANCE_OUTPUT)
    : path.join(app.getPath('userData'), 'desktop-acceptance-report.json');

  const sessionRef = windowRef.webContents.session;
  const networkEvents = [];
  let offlineMode = false;

  sessionRef.webRequest.onBeforeRequest((details, callback) => {
    const url = String(details?.url || '');
    const isHttp = /^https?:\/\//i.test(url);
    if (isHttp) {
      networkEvents.push({
        mode: offlineMode ? 'offline' : 'online',
        type: offlineMode ? 'blocked' : 'allowed',
        url,
        timestamp: new Date().toISOString(),
      });
    }
    if (offlineMode && isHttp) {
      callback({ cancel: true });
      return;
    }
    callback({});
  });

  const report = {
    startedAt: new Date().toISOString(),
    outputPath,
    rootPath: '',
    grade1: {
      manifestExists: false,
      packInfoExists: false,
      mp3Count: 0,
      runtimeLog: null,
    },
    grade2: {
      manifestExists: false,
      packInfoExists: false,
      mp3Count: 0,
      runtimeLog: null,
    },
    gradeFoldersAfterDownload: {
      hasGrade1: false,
      hasGrade2: false,
    },
    offlineNetworkEvents: [],
    noGoogleRequests: false,
    noBackendRequests: false,
    noNativeFallback: false,
    pass: false,
    reason: '',
  };

  const runReadAuditForGrade = async (grade) => {
    const lessonId = await windowRef.webContents.executeJavaScript(`
      (async () => {
        try {
          const raw = localStorage.getItem('hhk_app_state');
          if (raw) {
            const parsed = JSON.parse(raw);
            const lessons = Array.isArray(parsed?.lessons) ? parsed.lessons : [];
            const cards = Array.isArray(parsed?.lessonCards) ? parsed.lessonCards : [];
            const withCards = new Set(
              cards
                .filter((card) => Number(card?.isActive) !== 0)
                .map((card) => Number(card?.lessonId))
                .filter((id) => Number.isFinite(id)),
            );
            const candidate = lessons.find((lesson) => (
              Number(lesson?.grade) === ${grade}
              && String(lesson?.subjectCode || '') === 'math'
              && Number(lesson?.isActive) !== 0
              && withCards.has(Number(lesson?.id))
            ));
            const resolved = Number(candidate?.id);
            if (Number.isFinite(resolved)) return resolved;
          }

          // Fallback from known bundled IDs if app_state is not available yet.
          const resolved = ${grade} === 2 ? 21 : 1;
          if (Number.isFinite(resolved)) return resolved;
        } catch {}

        return ${grade} === 2 ? 21 : 1;
      })();
    `);

    await windowRef.webContents.executeJavaScript(`
      (() => {
        try {
          const reversedSelectedGrade = ${grade} === 1 ? 2 : 1;
          localStorage.setItem('hhk_tts_pack_selected_grade', String(reversedSelectedGrade));
        } catch {}
        try {
          localStorage.setItem('hhk_plan', 'premium');
          localStorage.setItem('hhk_sub_status', 'active');
          localStorage.setItem('hhk_sub_expiry', '2099-12-31T23:59:59.999Z');
          localStorage.setItem('hhk_activation_source', 'license_key');
          localStorage.setItem('hhk_license', 'HHK-AUDIT-ABCDEFGH');
          localStorage.setItem('hhk_unlocked_grades', JSON.stringify([1, 2, 3, 4, 5]));
        } catch {}
        try {
          const raw = localStorage.getItem('hhk_app_state');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.student) {
              parsed.student.grade = ${grade};
              parsed.student.subjectCode = 'math';
              localStorage.setItem('hhk_app_state', JSON.stringify(parsed));
            }
          }
        } catch {}
        try {
          window.__HHK_TTS_RUNTIME_LOGS__ = [];
          window.__HHK_TTS_RUNTIME_CONSOLE_LOGS__ = [];
          if (!window.__HHK_TTS_RUNTIME_HOOKED__) {
            const originalInfo = console.info.bind(console);
            console.info = (...args) => {
              try {
                if (args && args[0] === '[TTS_RUNTIME_RESULT]' && args[1]) {
                  const host = window;
                  if (!Array.isArray(host.__HHK_TTS_RUNTIME_CONSOLE_LOGS__)) {
                    host.__HHK_TTS_RUNTIME_CONSOLE_LOGS__ = [];
                  }
                  host.__HHK_TTS_RUNTIME_CONSOLE_LOGS__.push(args[1]);
                }
              } catch {}
              originalInfo(...args);
            };
            window.__HHK_TTS_RUNTIME_HOOKED__ = true;
          }
        } catch {}
        if (location.hash !== '#/lessons/${lessonId}') {
          location.hash = '#/lessons/${lessonId}';
        }
        return true;
      })();
    `);

    const lessonReady = await waitFor(async () => {
      return windowRef.webContents.executeJavaScript(`
        (() => {
          const title = document.querySelector('h1');
          const hasReadBtn = Array.from(document.querySelectorAll('button')).some((btn) => {
            const label = String(btn.textContent || '').trim();
            return label.includes('Đọc');
          });
          return Boolean(title) && hasReadBtn;
        })();
      `);
    }, 45_000, 700);

    if (!lessonReady) {
      throw new Error(`Khong vao duoc bai hoc cho lop ${grade} hoac khong tim thay nut Doc.`);
    }

    const clickResult = await windowRef.webContents.executeJavaScript(`
      (() => {
        window.__HHK_TTS_RUNTIME_LOGS__ = [];
        window.__HHK_TTS_RUNTIME_CONSOLE_LOGS__ = [];
        const buttons = Array.from(document.querySelectorAll('button'));
        const target = buttons.find((btn) => String(btn.getAttribute('title') || '').includes('Đọc thẻ này'))
          || buttons.find((btn) => String(btn.textContent || '').trim() === 'Đọc')
          || buttons.find((btn) => String(btn.textContent || '').includes('Đọc'));
        if (!target) {
          return { ok: false, reason: 'read-button-not-found' };
        }
        target.click();
        return { ok: true };
      })();
    `);

    if (!clickResult?.ok) {
      throw new Error(String(clickResult?.reason || `Khong bam duoc nut Doc cho lop ${grade}.`));
    }

    await waitFor(async () => {
      return windowRef.webContents.executeJavaScript(`
        (() => {
          const logs = Array.isArray(window.__HHK_TTS_RUNTIME_LOGS__) ? window.__HHK_TTS_RUNTIME_LOGS__ : [];
          const consoleLogs = Array.isArray(window.__HHK_TTS_RUNTIME_CONSOLE_LOGS__) ? window.__HHK_TTS_RUNTIME_CONSOLE_LOGS__ : [];
          const pool = logs.length > 0 ? logs : consoleLogs;
          return pool.some((item) => item && (item.status === 'completed' || item.status === 'error'));
        })();
      `);
    }, 60_000, 800);

    await delay(1_200);

    const runtimeLog = await windowRef.webContents.executeJavaScript(`
      (() => {
        const logs = Array.isArray(window.__HHK_TTS_RUNTIME_LOGS__) ? window.__HHK_TTS_RUNTIME_LOGS__ : [];
        const consoleLogs = Array.isArray(window.__HHK_TTS_RUNTIME_CONSOLE_LOGS__) ? window.__HHK_TTS_RUNTIME_CONSOLE_LOGS__ : [];
        const pool = logs.length > 0 ? logs : consoleLogs;
        const completed = pool.find((item) => item && item.status === 'completed');
        return completed || pool[0] || null;
      })();
    `);

    return runtimeLog;
  };

  try {
    await delay(2_000);

    const storageInfo = await audioPackStore.getStorageInfo();
    report.rootPath = String(storageInfo?.rootPath || '');

    await audioPackStore.downloadPack({ grade: 1, replace: true });
    await audioPackStore.downloadPack({ grade: 2, replace: true });

    const index = await audioPackStore.listPacks();
    const grade1Pack = (index.packs || []).find((item) => Number(item?.grade) === 1) || null;
    const grade2Pack = (index.packs || []).find((item) => Number(item?.grade) === 2) || null;

    const grade1Dir = path.join(report.rootPath, 'grade-1');
    const grade2Dir = path.join(report.rootPath, 'grade-2');
    const grade1ManifestPath = path.join(grade1Dir, 'manifest.json');
    const grade1PackInfoPath = path.join(grade1Dir, 'pack-info.json');
    const grade2ManifestPath = path.join(grade2Dir, 'manifest.json');
    const grade2PackInfoPath = path.join(grade2Dir, 'pack-info.json');

    report.grade1.manifestExists = fs.existsSync(grade1ManifestPath);
    report.grade1.packInfoExists = fs.existsSync(grade1PackInfoPath);
    report.grade1.mp3Count = Number(grade1Pack?.summary?.mp3Count || 0);

    report.grade2.manifestExists = fs.existsSync(grade2ManifestPath);
    report.grade2.packInfoExists = fs.existsSync(grade2PackInfoPath);
    report.grade2.mp3Count = Number(grade2Pack?.summary?.mp3Count || 0);

    report.gradeFoldersAfterDownload.hasGrade1 = fs.existsSync(grade1Dir);
    report.gradeFoldersAfterDownload.hasGrade2 = fs.existsSync(grade2Dir);

    offlineMode = true;
    report.grade1.runtimeLog = await runReadAuditForGrade(1);
    report.grade2.runtimeLog = await runReadAuditForGrade(2);

    const offlineEvents = networkEvents.filter((item) => item.mode === 'offline');
    report.offlineNetworkEvents = offlineEvents;

    report.noGoogleRequests = offlineEvents.every((evt) => !/googleapis|gstatic|google\.com/i.test(String(evt.url || '')));
    report.noBackendRequests = offlineEvents.every((evt) => !/api\/v1\/tts|ungdungthongminh\.shop|127\.0\.0\.1:5000/i.test(String(evt.url || '')));
    report.noNativeFallback = [report.grade1.runtimeLog, report.grade2.runtimeLog].every((entry) => String(entry?.provider || '') !== 'native');

    const runtime1Ok = report.grade1.runtimeLog
      && report.grade1.runtimeLog.provider === 'static-manifest'
      && report.grade1.runtimeLog.resolvedSource === 'desktop-offline'
      && report.grade1.runtimeLog.status === 'completed';
    const runtime2Ok = report.grade2.runtimeLog
      && report.grade2.runtimeLog.provider === 'static-manifest'
      && report.grade2.runtimeLog.resolvedSource === 'desktop-offline'
      && report.grade2.runtimeLog.status === 'completed';
    const runtime1GradeUrlOk = /\/grade-1\//i.test(String(report.grade1.runtimeLog?.assetUrl || ''));
    const runtime2GradeUrlOk = /\/grade-2\//i.test(String(report.grade2.runtimeLog?.assetUrl || ''));

    const grade1FilesOk = report.grade1.manifestExists && report.grade1.packInfoExists && report.grade1.mp3Count >= 700;
    const grade2FilesOk = report.grade2.manifestExists && report.grade2.packInfoExists && report.grade2.mp3Count >= 700;

    report.pass = Boolean(
      grade1FilesOk
      && grade2FilesOk
      && report.gradeFoldersAfterDownload.hasGrade1
      && report.gradeFoldersAfterDownload.hasGrade2
      && runtime1Ok
      && runtime2Ok
      && runtime1GradeUrlOk
      && runtime2GradeUrlOk
      && report.noGoogleRequests
      && report.noBackendRequests
      && report.noNativeFallback,
    );

    report.reason = report.pass
      ? 'Desktop acceptance PASS.'
      : 'Desktop acceptance FAIL: khong dat du file/runtime/network criteria.';
  } catch (error) {
    report.pass = false;
    report.reason = String(error?.message || error || 'Desktop acceptance audit failed.');
  }

  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8');
  console.log('[DESKTOP_ACCEPTANCE_AUDIT]', JSON.stringify(report));

  setTimeout(() => {
    app.quit();
  }, 500);
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

  if (DESKTOP_RUNTIME_AUDIT) {
    mainWindow.webContents.once('did-finish-load', () => {
      void runDesktopRuntimeAudit(mainWindow);
    });
  }

  if (DESKTOP_ACCEPTANCE_AUDIT) {
    mainWindow.webContents.once('did-finish-load', () => {
      void runDesktopAcceptanceAudit(mainWindow);
    });
  }
}

function setupAudioPackIpc() {
  ipcMain.handle('audioPacks:get-storage-info', async () => audioPackStore.getStorageInfo());
  ipcMain.handle('audioPacks:list', async () => audioPackStore.listPacks());
  ipcMain.handle('audioPacks:download', async (_event, payload) => {
    const grade = Number(payload?.grade);
    const replace = Boolean(payload?.replace);
    return audioPackStore.downloadPack({
      grade,
      replace,
      onProgress: (progress) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('audioPacks:progress', {
            grade,
            ...progress,
            updatedAt: Date.now(),
          });
        }
      },
    });
  });
  ipcMain.handle('audioPacks:remove', async (_event, payload) => {
    const grade = Number(payload?.grade);
    return audioPackStore.removePack({ grade });
  });
  ipcMain.handle('audioPacks:verify', async (_event, payload) => {
    const grade = Number(payload?.grade);
    return audioPackStore.verifyPack({ grade });
  });
  ipcMain.handle('audioPacks:open-folder', async (_event, payload) => {
    const hasGrade = payload && payload.grade !== undefined && payload.grade !== null;
    return audioPackStore.openFolder({ grade: hasGrade ? Number(payload.grade) : undefined });
  });
  ipcMain.handle('audioPacks:get-asset-url', async (_event, payload) => {
    return audioPackStore.getAssetUrl({
      assetKey: String(payload?.assetKey || ''),
      grade: payload?.grade,
    });
  });
}

function setupLicenseCacheIpc() {
  ipcMain.handle('license:cache:get', async () => {
    return licenseCacheStore.readCache();
  });

  ipcMain.handle('license:cache:set', async (_event, payload) => {
    return licenseCacheStore.writeCache(payload || null);
  });

  ipcMain.handle('license:cache:clear', async () => {
    return licenseCacheStore.clearCache();
  });

  ipcMain.handle('license:get-device-info', async () => {
    return licenseCacheStore.getDeviceInfo();
  });
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
  setupAudioPackIpc();
  setupLicenseCacheIpc();
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
