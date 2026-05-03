const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  db: {
    query: (sql, params) => ipcRenderer.invoke('db:query', sql, params),
    run: (sql, params) => ipcRenderer.invoke('db:run', sql, params),
    get: (sql, params) => ipcRenderer.invoke('db:get', sql, params),
  },
  updater: {
    getState: () => ipcRenderer.invoke('updater:get-state'),
    checkForUpdates: () => ipcRenderer.invoke('updater:check-for-updates'),
    downloadUpdate: () => ipcRenderer.invoke('updater:download-update'),
    quitAndInstall: () => ipcRenderer.invoke('updater:quit-and-install'),
    onStatus: (handler) => {
      if (typeof handler !== 'function') return () => undefined;
      const wrapped = (_event, payload) => handler(payload);
      ipcRenderer.on('updater:status', wrapped);
      return () => ipcRenderer.removeListener('updater:status', wrapped);
    },
  },
  audioPacks: {
    getStorageInfo: () => ipcRenderer.invoke('audioPacks:get-storage-info'),
    list: () => ipcRenderer.invoke('audioPacks:list'),
    download: (payload) => ipcRenderer.invoke('audioPacks:download', payload),
    remove: (payload) => ipcRenderer.invoke('audioPacks:remove', payload),
    verify: (payload) => ipcRenderer.invoke('audioPacks:verify', payload),
    openFolder: (payload) => ipcRenderer.invoke('audioPacks:open-folder', payload),
    getAssetUrl: (payload) => ipcRenderer.invoke('audioPacks:get-asset-url', payload),
    onProgress: (handler) => {
      if (typeof handler !== 'function') return () => undefined;
      const wrapped = (_event, payload) => handler(payload);
      ipcRenderer.on('audioPacks:progress', wrapped);
      return () => ipcRenderer.removeListener('audioPacks:progress', wrapped);
    },
  },
  license: {
    getCache: () => ipcRenderer.invoke('license:cache:get'),
    setCache: (payload) => ipcRenderer.invoke('license:cache:set', payload),
    clearCache: () => ipcRenderer.invoke('license:cache:clear'),
    getDeviceInfo: () => ipcRenderer.invoke('license:get-device-info'),
  },
});
