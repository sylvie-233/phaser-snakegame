# 贪吃蛇 · Phaser 4 + TypeScript

基于 **TypeScript + Phaser 4** 的网页版贪吃蛇游戏，使用 **pnpm monorepo** 组织，核心逻辑与渲染解耦，便于复用与测试。

## 技术栈

- 游戏框架：Phaser 4
- 编程语言：TypeScript(strict, ES2022)
- 项目结构：pnpm monorepo + Turborepo 2
- 前端构建：Vite 7
- 桌面端：Electron 43 + electron-builder(仅 Windows)
- 代码规范：ESLint 9(flat config) + Prettier 3

## Monorepo 结构

```
apps/
├── game/        # @snake/game     Web 游戏(Vite + Phaser 4)
└── desktop/     # @snake/desktop  Electron 桌面壳(Windows)
packages/
├── config/      # 共享配置包:@snake/tsconfig / @snake/eslint-config / @snake/prettier-config
├── snake-core/  # @snake/core     纯贪吃蛇逻辑(不依赖 Phaser)
└── snake-ui/    # @snake/ui       Phaser UI 组件库(Button / Label / Panel / Modal / Toast)
```

注意：**目录名与包名不一致**(snake-core → `@snake/core`，snake-ui → `@snake/ui`)，依赖时以包名为准。

内部包直接以源码形式被消费：`main` / `exports` 指向 `./src/index.ts`，**没有独立构建步骤**，由 Vite 直接编译。新增内部包时沿用此约定即可。

## 常用命令

```bash
pnpm install       # 安装依赖(根目录执行)
pnpm dev           # 开发:Vite dev server(localhost:5173)+ 并行拉起 Electron
pnpm build         # 全仓生产构建(turbo)
pnpm build:win     # 构建游戏 → electron-builder 打包(Windows 安装包, 产物在 apps/desktop/release/)
pnpm typecheck     # 全仓 tsc --noEmit
pnpm lint          # 全仓 ESLint
pnpm format        # 全仓 Prettier 格式化
pnpm format:check  # 校验格式
```

## 架构约定

- **核心逻辑不依赖 Phaser**：`@snake/core` 的 `SnakeGame` 是纯 TS 类，坐标系原点在左上角、x 向右 y 向下，蛇头在数组首位；`update(deltaMs, stepMs)` 按步进时长推进，用 `pendingDirection` 防止一帧内快速按键导致的 180° 掉头。棋盘与速度参数在 `constants.ts`，`stepDuration(score)` 控制随分数加速。
- **渲染与输入在 `apps/game`**：按 Phaser 场景拆分为 `StartScene` / `GameScene` / `GameOverScene`；`layout.ts` 统一管理棋盘像素尺寸(CELL_SIZE、HUD 高度等)，`drawGrid.ts` 绘制棋盘。
- **UI 组件复用**：`@snake/ui` 提供基于 Phaser 的 UI 组件(注：`@snake/ui` 依赖 Phaser，是 peerDependency)。
- **桌面端**：主进程加载 `apps/game/dist` 或 dev server；开发模式指向 localhost:5173(启动时重试最多 30s)，打包后经 `extraResources` 读取 `resources/game/`。窗口 icon 仅在开发模式显式设置，用 `existsSync` 守卫(打包后 asar 内无 assets)。

## 开发注意事项

- **Phaser 场景实例会被复用**：`scene.start()` 不会重新执行类字段初始化，场景字段不会自动重置。新增/修改场景时，需像 `GameScene.create()` 那样在 `create()` 里手动重建并复位状态(参考 `sceneEnded` 等字段的处理)。
- **Turborepo 缓存**：`turbo.json` 的 `globalDependencies` 声明了共享配置包(tsconfig / eslint / prettier)，改这些配置会让全仓缓存失效；`build` 输出 `dist/**`，`dev` / `preview` 关闭缓存。
- **ESLint**：`@snake/eslint-config` 沉淀团队规则，含 eslint-config-prettier(必须放最后)。`no-unused-vars` 开启但忽略 `_` 前缀变量/参数/捕获错误，**有意未使用的标识符统一用 `_` 前缀**。各应用的 `eslint.config.ts` 按需补充环境 globals。
- **代码风格**：注释使用中文；公共 API 用 JSDoc 描述。
- **包管理器**：使用 pnpm(`onlyBuiltDependencies` 含 electron / esbuild)，Node ≥ 22(桌面端代码用到 `import.meta.dirname`)。
