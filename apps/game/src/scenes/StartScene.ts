import * as Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from '../layout'
import { drawGridBackground } from './drawGrid'
import { createButton } from '../ui/createButton'

const BG_COLOR = 0x0f172a
const SNAKE_HEAD_COLOR = 0x4ade80
const SNAKE_BODY_COLOR = 0x22c55e

const CONTROL_ROWS = [
  { key: '方向键 / WASD', desc: '控制蛇移动' },
  { key: '空格 / P', desc: '暂停 / 继续' },
]

export class StartScene extends Phaser.Scene {
  private started = false
  private controlsObjects: Phaser.GameObjects.GameObject[] = []

  constructor() {
    super('StartScene')
  }

  create(): void {
    this.cameras.main.setBackgroundColor(BG_COLOR)

    // 场景实例会被 Phaser 复用,复位防重入标志
    this.started = false

    // 与游戏棋盘一致的背景网格
    drawGridBackground(this)

    // 标题
    this.add
      .text(GAME_WIDTH / 2, 150, '贪吃蛇', {
        fontFamily: 'system-ui, "Microsoft YaHei", sans-serif',
        fontSize: '56px',
        fontStyle: 'bold',
        color: '#f8fafc',
      })
      .setOrigin(0.5)

    this.add
      .text(GAME_WIDTH / 2, 208, 'Phaser 4 · TypeScript', {
        fontFamily: 'system-ui, "Microsoft YaHei", sans-serif',
        fontSize: '16px',
        color: '#64748b',
      })
      .setOrigin(0.5)

    this.drawDecorativeSnake()

    // 开始游戏按钮
    createButton(this, GAME_WIDTH / 2, 500, {
      text: '开始游戏',
      onClick: () => this.startGame(),
    })

    // 按键说明按钮:弹出操作说明面板
    createButton(this, GAME_WIDTH / 2, 572, {
      text: '按键说明',
      width: 200,
      height: 48,
      fontSize: '18px',
      backgroundColor: 0x334155,
      hoverColor: 0x475569,
      textColor: '#f1f5f9',
      onClick: () => this.showControls(),
    })
  }

  private startGame(): void {
    if (this.started || this.controlsObjects.length > 0) {
      return
    }
    this.started = true
    this.scene.start('GameScene')
  }

  /** 弹出按键操作说明面板(点击遮罩或「关闭」按钮关闭)。 */
  private showControls(): void {
    if (this.controlsObjects.length > 0) {
      return
    }

    const overlay = this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.65)
      .setInteractive({ useHandCursor: true })
    overlay.on('pointerdown', () => this.hideControls())

    const panel = this.add.graphics()
    panel.fillStyle(0x1e293b, 1)
    panel.fillRoundedRect(70, 180, 460, 300, 16)
    panel.lineStyle(2, 0x475569, 1)
    panel.strokeRoundedRect(70, 180, 460, 300, 16)

    const title = this.add
      .text(GAME_WIDTH / 2, 235, '按键操作说明', {
        fontFamily: 'system-ui, "Microsoft YaHei", sans-serif',
        fontSize: '26px',
        fontStyle: 'bold',
        color: '#f8fafc',
      })
      .setOrigin(0.5)

    const rows: Phaser.GameObjects.Text[] = []
    CONTROL_ROWS.forEach((row, i) => {
      const y = 315 + i * 60
      rows.push(
        this.add
          .text(240, y, row.key, {
            fontFamily: 'system-ui, "Microsoft YaHei", sans-serif',
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#4ade80',
          })
          .setOrigin(1, 0.5),
      )
      rows.push(
        this.add
          .text(300, y, row.desc, {
            fontFamily: 'system-ui, "Microsoft YaHei", sans-serif',
            fontSize: '18px',
            color: '#cbd5e1',
          })
          .setOrigin(0, 0.5),
      )
    })

    const closeBtn = createButton(this, GAME_WIDTH / 2, 435, {
      text: '关闭',
      width: 160,
      height: 48,
      fontSize: '18px',
      backgroundColor: 0x334155,
      hoverColor: 0x475569,
      textColor: '#f1f5f9',
      onClick: () => this.hideControls(),
    })

    this.controlsObjects.push(overlay, panel, title, closeBtn, ...rows)
  }

  private hideControls(): void {
    for (const obj of this.controlsObjects) {
      obj.destroy()
    }
    this.controlsObjects = []
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
