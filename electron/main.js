const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { initDatabase } = require('./database');

let mainWindow;

function createWindow() {
  const appTitle = app.getName() || 'Hoc Hung Khoi Tieu Hoc';
  const isDev = !app.isPackaged && process.env.NODE_ENV !== 'production';

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
    mainWindow.loadURL('http://localhost:5173');
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
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
