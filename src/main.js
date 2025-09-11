const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
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