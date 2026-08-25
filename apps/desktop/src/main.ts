import { app, BrowserWindow } from "electron"
import path from "node:path"
import { existsSync } from "node:fs"

const DEV_SERVER_URL = "http://localhost:5173"
const DEV_RETRY_MAX = 30

// 窗口图标:仅开发模式需要显式设置(electron . 无 exe 图标);打包后由 exe 自带。
// 打包后的 app.asar 不含 assets 目录,existsSync 守卫避免打包模式路径失效。
const windowIcon = path.join(import.meta.dirname, "../assets/snakegame.png")

/** 开发模式加载 Vite dev server;服务器未就绪时每 1s 重试。 */
function loadDevUrl(win: BrowserWindow, tries: number): void {
  win.loadURL(DEV_SERVER_URL).catch(() => {
    if (tries >= DEV_RETRY_MAX) {
      console.error(`[main] 无法连接开发服务器 ${DEV_SERVER_URL}`)
      return
    }
    setTimeout(() => loadDevUrl(win, tries + 1), 1000)
  })
}

function createWindow(): void {
  const win = new BrowserWindow({
    width: 640,
    height: 680,
    minWidth: 600,
    minHeight: 640,
    useContentSize: true,
    autoHideMenuBar: true,
    backgroundColor: "#0f172a",
    title: "贪吃蛇",
    ...(existsSync(windowIcon) ? { icon: windowIcon } : {}),
    webPreferences: {
      preload: path.join(import.meta.dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (app.isPackaged) {
    // 生产:加载 electron-builder extraResources 打进安装包的游戏构建(apps/game/dist)
    void win.loadFile(path.join(process.resourcesPath, "game", "index.html"))
  } else {
    // 开发:直接加载 Vite dev server(由 turbo 并行启动)
    loadDevUrl(win, 0)
  }
}

void app.whenReady().then(() => {
  createWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})
