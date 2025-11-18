const { app, BrowserWindow, ipcMain, dialog, nativeImage } = require('electron/main')
const path = require('node:path')
const fs = require('fs').promises;

ipcMain.handle('dialog:save-text-file', async (event, content, defaultFilename = 'untitledTab.txt') => {
  const { window } = BrowserWindow.fromWebContents(event.sender);

  try {
    const result = await dialog.showSaveDialog(window, {
      title: 'Save Tab',
      defaultFilename: defaultFilename,
      filters: [
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      properties: ['createDirectory']
    });

    if (result.canceled || !result.filePath){
      return false;
    }

    await fs.writeFile(result.filePath, content, 'utf-8');
    return true;

  } catch (err) {

    console.error('failed to save file:', err);
    return false;
  }
})

const createWindow = () => {
  const win = new BrowserWindow({
  icon: nativeImage.createFromPath(path.join(__dirname, '../misc/plectrm256px.png')),
  autoHideMenuBar : true,
  width: 1280,
  height: 720,
  webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: true,
  }
  
  })

  win.webContents.on('did-frame-finish-load', () => {
    if (process.env.NODE_ENV === 'development') {
      win.webContents.openDevTools({ mode: 'detach' });
    }
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})