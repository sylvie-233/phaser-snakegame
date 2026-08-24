import * as Phaser from 'phaser'
import { GAME_WIDTH } from '../layout'
import { drawGridBackground } from './drawGrid'
import { createButton } from '../ui/createButton'

interface GameOverData {
  score: number
  won: boolean
}

const BEST_SCORE_KEY = 'snake.bestScore'
const BG_COLOR = 0x0f172a

function readBestScore(): number {
  try {
    return Number(localStorage.getItem(BEST_SCORE_KEY)) || 0
  } catch {
    return 0
  }
}

function saveBestScore(score: number): void {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score))
  } catch {
    // 隐私模式等无法写入 localStorage 的场景下静默忽略
  }
}

export class GameOverScene extends Phaser.Scene {
  private score = 0
  private won = false
  private navigated = false

  constructor() {
    super('GameOverScene')
  }

  init(data: GameOverData): void {
    this.score = data?.score ?? 0
    this.won = data?.won ?? false
    // 场景实例会被 Phaser 复用,复位防重入标志
    this.navigated = false
  }

  create(): void {
    this.cameras.main.setBackgroundColor(BG_COLOR)
    drawGridBackground(this)

    // 标题
    const title = this.won ? '你赢了!' : '游戏结束'
    const titleColor = this.won ? '#fbbf24' : '#f87171'
    this.add
      .text(GAME_WIDTH / 2, 160, title, {
        fontFamily: 'system-ui, "Microsoft YaHei", sans-serif',
        fontSize: '52px',
        fontStyle: 'bold',
        color: titleColor,
      })
      .setOrigin(0.5)

    // 得分
    this.add
      .text(GAME_WIDTH / 2, 300, `得分: ${this.score}`, {
        fontFamily: 'system-ui, "Microsoft YaHei", sans-serif',
        fontSize: '34px',
        color: '#f8fafc',
      })
      .setOrigin(0.5)

    // 最佳得分 / 新纪录(localStorage 持久化)
    const prevBest = readBestScore()
    const best = Math.max(prevBest, this.score)
    saveBestScore(best)
    const isRecord = this.score > prevBest && this.score > 0
    this.add
      .text(GAME_WIDTH / 2, 365, isRecord ? '新纪录!' : `最佳: ${best}`, {
        fontFamily: 'system-ui, "Microsoft YaHei", sans-serif',
        fontSize: '22px',
        color: isRecord ? '#fbbf24' : '#94a3b8',
      })
      .setOrigin(0.5)

    // 重新开始 / 返回主页 按钮
    createButton(this, GAME_WIDTH / 2 - 135, 500, {
      text: '重新开始',
      onClick: () => this.restart(),
    })
    createButton(this, GAME_WIDTH / 2 + 135, 500, {
      text: '返回主页',
      backgroundColor: 0x334155,
      hoverColor: 0x475569,
      textColor: '#f1f5f9',
      onClick: () => this.backToStart(),
    })
  }

  private restart(): void {
    if (this.navigated) {
      return
    }
    this.navigated = true
    this.scene.start('GameScene')
  }

  private backToStart(): void {
    if (this.navigated) {
      return
    }
    this.navigated = true
    this.scene.start('StartScene')
  }
}
