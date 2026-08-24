import { app, BrowserWindow } from 'electron';
import path from 'node:path';

const DEV_SERVER_URL = 'http://localhost:5173';
const DEV_RETRY_MAX = 30;

/** 开发模式加载 Vite dev server;服务器未就绪时每 1s 重试。 */
function loadDevUrl(win: BrowserWindow, tries: number): void {
  win.loadURL(DEV_SERVER_URL).catch(() => {
    if (tries >= DEV_RETRY_MAX) {
      console.error(`[main] 无法连接开发服务器 ${DEV_SERVER_URL}`);
      return;
    }
    setTimeout(() => loadDevUrl(win, tries + 1), 1000);
  });
}

function createWindow(): void {
  const win = new BrowserWindow({
    width: 640,
    height: 680,
    minWidth: 600,
    minHeight: 640,
    useContentSize: true,
    autoHideMenuBar: true,
    backgroundColor: '#0f172a',
    title: '贪吃蛇',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (app.isPackaged) {
    // 生产:加载 electron-builder extraResources 打进安装包的游戏构建(apps/game/dist)
    void win.loadFile(path.join(process.resourcesPath, 'game', 'index.html'));
  } else {
    // 开发:直接加载 Vite dev server(由 turbo 并行启动)
    loadDevUrl(win, 0);
  }
}

void app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
