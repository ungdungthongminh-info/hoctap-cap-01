const path = require('path');
const { app } = require('electron');
app.setPath('userData', path.join(process.env.APPDATA, 'Hoc Hung Khoi Tieu Hoc'));
const store = require('./electron/audioPackStore');
app.whenReady().then(async () => {
  try {
    const grade2Card1 = await store.getAssetUrl({ assetKey: 'lesson-card:1', grade: 2 });
    const grade2Card81 = await store.getAssetUrl({ assetKey: 'lesson-card:81', grade: 2 });
    const grade1Card1 = await store.getAssetUrl({ assetKey: 'lesson-card:1', grade: 1 });
    console.log('GRADE2_CARD1=' + JSON.stringify(grade2Card1));
    console.log('GRADE2_CARD81=' + JSON.stringify(grade2Card81));
    console.log('GRADE1_CARD1=' + JSON.stringify(grade1Card1));
  } catch (err) {
    console.error('CHECK_ERROR', err && err.message ? err.message : err);
  } finally {
    app.quit();
  }
});
