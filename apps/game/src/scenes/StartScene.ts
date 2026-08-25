import * as Phaser from "phaser"
import { GAME_WIDTH } from "../layout"
import { drawGridBackground } from "./drawGrid"
import { createButton, createLabel, openModal, type ModalHandle } from "@snake/ui"

const BG_COLOR = 0x0f172a
const SNAKE_HEAD_COLOR = 0x4ade80
const SNAKE_BODY_COLOR = 0x22c55e

const CONTROL_ROWS = [
  { key: "方向键 / WASD", desc: "控制蛇移动" },
  { key: "空格 / P", desc: "暂停 / 继续" },
]

export class StartScene extends Phaser.Scene {
  private started = false
  private modal: ModalHandle | null = null

  constructor() {
    super("StartScene")
  }

  create(): void {
    this.cameras.main.setBackgroundColor(BG_COLOR)

    // 场景实例会被 Phaser 复用,复位防重入标志
    this.started = false

    // 与游戏棋盘一致的背景网格
    drawGridBackground(this)

    // 标题
    createLabel(this, GAME_WIDTH / 2, 150, "贪吃蛇", { variant: "heading" })
    createLabel(this, GAME_WIDTH / 2, 208, "Phaser 4 · TypeScript", { variant: "muted" })

    this.drawDecorativeSnake()

    // 开始游戏按钮
    createButton(this, GAME_WIDTH / 2, 500, {
      text: "开始游戏",
      onClick: () => this.startGame(),
    })

    // 按键说明按钮:弹出操作说明弹窗
    createButton(this, GAME_WIDTH / 2, 572, {
      text: "按键说明",
      variant: "secondary",
      size: "sm",
      onClick: () => this.showControls(),
    })
  }

  private startGame(): void {
    if (this.started || this.modal) {
      return
    }
    this.started = true
    this.scene.start("GameScene")
  }

  /** 弹出按键操作说明弹窗(点遮罩或「关闭」按钮关闭)。 */
  private showControls(): void {
    if (this.modal) {
      return
    }
    this.modal = openModal(this, {
      title: "按键操作说明",
      height: 300,
      // 背景是深色 + 浅网格,遮罩调淡让网格透出来
      overlayAlpha: 0.35,
      content: (panel) => {
        CONTROL_ROWS.forEach((row, i) => {
          const y = -45 + i * 60
          panel.add(createLabel(this, -90, y, row.key, { variant: "body", color: "#4ade80" }))
          panel.add(createLabel(this, 40, y, row.desc, { variant: "body" }))
        })
      },
      onClose: () => {
        this.modal = null
      },
    })
  }

  /** 绘制一条装饰性的 S 形蛇,与游戏内蛇的视觉语言一致。 */
  private drawDecorativeSnake(): void {
    // S 形蛇身的局部坐标(每段中心,间距 30)
    const segments = [
      { x: 0, y: 0 },
      { x: -30, y: 0 },
      { x: -60, y: 0 },
      { x: -90, y: 0 },
      { x: -120, y: 30 },
      { x: -120, y: 60 },
      { x: -90, y: 90 },
      { x: -60, y: 90 },
      { x: -30, y: 90 },
      { x: 0, y: 90 },
    ]
    // 局部坐标包围盒中心为 (-60, 45),据此平移使整条蛇居中
    const cx = GAME_WIDTH / 2
    const cy = 330
    const g = this.add.graphics()

    segments.forEach((seg, i) => {
      const x = cx + seg.x + 60 - 15
      const y = cy + seg.y - 45 - 15
      g.fillStyle(i === 0 ? SNAKE_HEAD_COLOR : SNAKE_BODY_COLOR, 1)
      g.fillRoundedRect(x, y, 30, 30, 8)
    })
  }
}
