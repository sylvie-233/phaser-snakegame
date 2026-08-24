# 贪吃蛇 · Phaser 4 + TypeScript

基于 **Phaser 4** + **TypeScript** 的网页版贪吃蛇游戏,使用 **pnpm monorepo** + **Vite** 构建。

## 项目结构

```
.
├── apps/
│   ├── game/                 # 游戏应用(Vite + Phaser 4)
│   │   ├── src/
│   │   │   ├── main.ts       # Phaser 游戏入口与配置
│   │   │   ├── layout.ts     # 画布/棋盘布局尺寸
│   │   │   ├── ui/
│   │   │   │   └── createButton.ts # 可复用圆角按钮(悬停高亮/按下缩放)
│   │   │   └── scenes/
│   │   │       ├── StartScene.ts    # 开始页(开始游戏按钮)
│   │   │       ├── GameScene.ts     # 对局:渲染、输入、HUD、暂停
│   │   │       ├── GameOverScene.ts # 结束页(重新开始 / 返回主页按钮)
│   │   │       └── drawGrid.ts      # 全屏网格背景助手
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   └── desktop/              # Electron 桌面壳(TS + import,esbuild 编译)
│       ├── src/
│       │   ├── main.ts       # 主进程:dev 加载 Vite URL,生产加载 resources/game
│       │   └── preload.ts    # 预加载脚本(contextBridge)
│       └── package.json      # electron-builder 配置(extraResources 打包游戏)
├── packages/
│   └── snake-core/           # 纯贪吃蛇逻辑(不依赖 Phaser,可独立复用/测试)
│       └── src/
│           ├── SnakeGame.ts  # 核心状态机:移动/吃食/碰撞/判胜
│           ├── constants.ts  # 棋盘与速度参数
│           ├── types.ts      # Point / Direction / GameStatus
│           └── index.ts
├── build.ps1           # Windows 打包脚本:构建游戏 + 打包 Electron
├── pnpm-workspace.yaml
├── turbo.json          # Turborepo 任务管线
├── tsconfig.base.json
└── .npmrc              # 依赖镜像 + 构建脚本授权
```

核心玩法逻辑位于 `@snake/core`,渲染与输入完全解耦,便于单测或移植到其它框架。

## 快速开始

```bash
pnpm install     # 安装依赖
pnpm dev         # Web 开发服务器 → http://localhost:5173
pnpm build       # 生产构建(经 Turborepo 缓存),输出到 apps/game/dist
pnpm preview     # 预览 Web 构建
pnpm typecheck   # 全仓 TypeScript 类型检查(覆盖 core + game + desktop)
```

任务编排使用 **Turborepo**(`turbo.json`):`typecheck` 自动覆盖所有子包,`build` 带增量缓存(二次运行直接命中缓存)。缓存目录 `.turbo/` 已被 gitignore。`pnpm install` 由 pnpm workspace 管理依赖,`turbo` 仅负责任务调度与缓存。

## 桌面端(Electron / Windows)

```bash
pnpm dev:desktop   # 开发:Turbo 并行起 Vite + Electron,窗口直接加载 http://localhost:5173
pnpm build:win     # 打包:构建游戏 → electron-builder 出安装包
```

- 桌面壳代码在 `apps/desktop/src/`(TypeScript + import,esbuild 编译主进程为 CJS)
- dev 编排交给 **Turborepo**(`turbo run dev` 并行运行 `@snake/game` 的 vite 与 `@snake/desktop` 的 electron);`main.ts` 通过 `app.isPackaged` 区分模式,dev 下加载开发服务器 URL 并自动重试等待 vite 就绪
- 生产模式:游戏构建产物由 electron-builder 的 **`extraResources`** 直接打进 `resources/game/`,`main.ts` 用 `process.resourcesPath` 加载(无需手工复制)
- 打包产物位于 `apps/desktop/release/`(NSIS 安装包 + portable 免安装版)
- 依赖二进制走 npmmirror(见 `.npmrc`),避免下载超时

> **注意**:若你的机器环境变量里设置了 `ELECTRON_RUN_AS_NODE=1`,Electron 会被当成 Node 运行导致无法启动。`pnpm dev:desktop` 已通过 PowerShell 自动清除该变量;如仍遇到问题,可在系统环境变量中移除它。

## 操作方式

| 按键 | 作用 |
| --- | --- |
| 方向键 / WASD | 控制方向 |
| 空格 / P | 暂停 / 继续 |

开始页与结束页使用**按钮**交互:开始页有「开始游戏」与「按键说明」(点击弹出操作说明面板)两个按钮;结束页有「重新开始」与「返回主页」两个按钮。游戏内操作用键盘(方向键/WASD 移动,空格/P 暂停)。

## 游戏规则

- 吃到食物 +1 分,蛇身增长,移动速度随分数加快
- 撞墙或撞到自身 → 游戏结束
- 填满整个棋盘 → 通关胜利
