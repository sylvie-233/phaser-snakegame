import * as Phaser from 'phaser'
import { GRID_COLS, GRID_ROWS, SnakeGame, stepDuration } from '@snake/core'
import type { Direction } from '@snake/core'
import {
  BOARD_HEIGHT,
  BOARD_OFFSET_X,
  BOARD_OFFSET_Y,
  BOARD_WIDTH,
  CELL_SIZE,
  GAME_HEIGHT,
  GAME_WIDTH,
} from '../layout'

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  KeyW: 'up',
  KeyS: 'down',
  KeyA: 'left',
  KeyD: 'right',
}

const SNAKE_HEAD_COLOR = 0x4ade80
const SNAKE_BODY_COLOR = 0x22c55e
const FOOD_COLOR = 0xff6b6b
const BG_COLOR = 0x0f172a

export class GameScene extends Phaser.Scene {
  private snakeGame = new SnakeGame({ cols: GRID_COLS, rows: GRID_ROWS })

  private boardGraphics!: Phaser.GameObjects.Graphics
  private scoreText!: Phaser.GameObjects.Text

  private overlayGraphics!: Phaser.GameObjects.Graphics
  private overlayTitle!: Phaser.GameObjects.Text
  private overlayHint!: Phaser.GameObjects.Text
  private overlayKey = ''
  private sceneEnded = false

  constructor() {
    super('GameScene')
  }

  create(): void {
    this.cameras.main.setBackgroundColor(BG_COLOR)

    this.boardGraphics = this.add.graphics()

    this.scoreText = this.add.text(12, 10, '', {
      fontFamily: 'system-ui, "Microsoft YaHei", sans-serif',
      fontSize: '18px',
      color: '#e2e8f0',
    })

    this.setupOverlay()
    this.setupKeyboard()

    // 场景实例会被 Phaser 复用(类字段不随 scene.start 重新初始化),这里重建并复位状态
    this.sceneEnded = false
    this.snakeGame = new SnakeGame({ cols: GRID_COLS, rows: GRID_ROWS })
    this.snakeGame.start()
    this.refreshHud()
    this.draw()
  }

  private setupKeyboard(): void {
    this.input.keyboard!.on('keydown', (event: KeyboardEvent) => {
      const dir = KEY_TO_DIRECTION[event.code]

      if (dir) {
        if (this.snakeGame.status === 'running' || this.snakeGame.status === 'paused') {
          this.snakeGame.setDirection(dir)
        }
        return
      }

      if (event.code === 'Space' || event.code === 'KeyP') {
        this.togglePause()
      }
    })
  }

  private togglePause(): void {
    if (this.snakeGame.status === 'running') {
      this.snakeGame.pause()
      this.showOverlay('已暂停', '按 空格 / P 继续')
    } else if (this.snakeGame.status === 'paused') {
      this.snakeGame.resume()
      this.hideOverlay()
    }
  }

  update(_time: number, delta: number): void {
    this.snakeGame.update(delta, stepDuration(this.snakeGame.score))
    this.draw()
    this.refreshHud()

    this.checkGameOver()
  }

  /** 游戏结束 / 胜利时,携带结果切到 GameOverScene(仅触发一次)。 */
  private checkGameOver(): void {
    if (
      this.sceneEnded ||
      (this.snakeGame.status !== 'gameover' && this.snakeGame.status !== 'win')
    ) {
      return
    }
    this.sceneEnded = true
    this.scene.start('GameOverScene', {
      score: this.snakeGame.score,
      won: this.snakeGame.status === 'win',
    })
  }

  private draw(): void {
    const g = this.boardGraphics
    g.clear()

    // 棋盘背景
    g.fillStyle(BG_COLOR, 1)
    g.fillRect(BOARD_OFFSET_X, BOARD_OFFSET_Y, BOARD_WIDTH, BOARD_HEIGHT)

    // 网格线
    g.lineStyle(1, 0xffffff, 0.06)
    for (let x = 1; x < GRID_COLS; x++) {
      g.lineBetween(
        BOARD_OFFSET_X + x * CELL_SIZE,
        BOARD_OFFSET_Y,
        BOARD_OFFSET_X + x * CELL_SIZE,
        BOARD_OFFSET_Y + BOARD_HEIGHT,
      )
    }
    for (let y = 1; y < GRID_ROWS; y++) {
      g.lineBetween(
        BOARD_OFFSET_X,
        BOARD_OFFSET_Y + y * CELL_SIZE,
        BOARD_OFFSET_X + BOARD_WIDTH,
        BOARD_OFFSET_Y + y * CELL_SIZE,
      )
    }

    // 食物
    const food = this.snakeGame.food
    if (food) {
      const fx = BOARD_OFFSET_X + food.x * CELL_SIZE + CELL_SIZE / 2
      const fy = BOARD_OFFSET_Y + food.y * CELL_SIZE + CELL_SIZE / 2
      g.fillStyle(FOOD_COLOR, 1)
      g.fillCircle(fx, fy, CELL_SIZE / 2 - 2)
    }

    // 蛇身
    const snake = this.snakeGame.snake
    for (let i = 0; i < snake.length; i++) {
      const seg = snake[i]
      const x = BOARD_OFFSET_X + seg.x * CELL_SIZE
      const y = BOARD_OFFSET_Y + seg.y * CELL_SIZE
      g.fillStyle(i === 0 ? SNAKE_HEAD_COLOR : SNAKE_BODY_COLOR, 1)
      g.fillRoundedRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2, 4)
    }
  }

  private refreshHud(): void {
    this.scoreText.setText(`得分: ${this.snakeGame.score}`)
  }

  private setupOverlay(): void {
    this.overlayGraphics = this.add.graphics()
    this.overlayGraphics.fillStyle(0x000000, 0.55)
    this.overlayGraphics.fillRect(BOARD_OFFSET_X, BOARD_OFFSET_Y, BOARD_WIDTH, BOARD_HEIGHT)

    this.overlayTitle = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30, '', {
        fontFamily: 'system-ui, "Microsoft YaHei", sans-serif',
        fontSize: '40px',
        color: '#f8fafc',
      })
      .setOrigin(0.5)

    this.overlayHint = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, '', {
        fontFamily: 'system-ui, "Microsoft YaHei", sans-serif',
        fontSize: '18px',
        color: '#cbd5e1',
      })
      .setOrigin(0.5)

    this.hideOverlay()
  }

  private showOverlay(title: string, hint: string): void {
    const key = `${title}|${hint}`
    if (this.overlayKey === key) {
      return
    }
    this.overlayKey = key
    this.overlayTitle.setText(title)
    this.overlayHint.setText(hint)
    this.overlayTitle.setVisible(true)
    this.overlayHint.setVisible(true)
    this.overlayGraphics.setVisible(true)
  }

  private hideOverlay(): void {
    this.overlayKey = ''
    this.overlayTitle.setVisible(false)
    this.overlayHint.setVisible(false)
    this.overlayGraphics.setVisible(false)
  }
}
