import type { Direction, GameStatus, Point } from "./types"

export interface SnakeGameOptions {
  cols: number
  rows: number
}

const OPPOSITE: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
}

/**
 * 贪吃蛇核心逻辑,不依赖 Phaser,便于单独测试与复用。
 * 坐标系:原点在左上角,x 向右,y 向下;蛇头在数组首位。
 */
export class SnakeGame {
  readonly cols: number
  readonly rows: number

  snake: Point[] = []
  direction: Direction = "right"
  food: Point | null = null
  score = 0
  status: GameStatus = "idle"

  private moveAccumulator = 0
  private pendingDirection: Direction | null = null

  constructor({ cols, rows }: SnakeGameOptions) {
    this.cols = cols
    this.rows = rows
    this.reset()
  }

  /** 重置为初始状态(蛇居中、方向向右、随机食物)。 */
  reset(): void {
    const cx = Math.floor(this.cols / 2)
    const cy = Math.floor(this.rows / 2)
    this.snake = [
      { x: cx, y: cy },
      { x: cx - 1, y: cy },
      { x: cx - 2, y: cy },
    ]
    this.direction = "right"
    this.pendingDirection = null
    this.score = 0
    this.moveAccumulator = 0
    this.status = "idle"
    this.food = this.spawnFood()
  }

  /** 开始游戏:若处于开局或结束状态,先重置。 */
  start(): void {
    if (this.status === "idle" || this.status === "gameover" || this.status === "win") {
      this.reset()
    }
    this.status = "running"
  }

  pause(): void {
    if (this.status === "running") {
      this.status = "paused"
    }
  }

  resume(): void {
    if (this.status === "paused") {
      this.status = "running"
    }
  }

  /**
   * 设置蛇的移动方向,同一帧内只记录待转向,防止快速按键导致 180° 掉头。
   */
  setDirection(dir: Direction): void {
    if (dir === OPPOSITE[this.direction]) {
      return
    }
    this.pendingDirection = dir
  }

  /**
   * 按步进时长推进游戏。
   * @param deltaMs 距上次调用经过的时间(ms)
   * @param stepMs  蛇每走一格所需时间(ms),可随分数变化
   */
  update(deltaMs: number, stepMs: number): void {
    if (this.status !== "running") {
      return
    }
    this.moveAccumulator += deltaMs

    let guard = 0
    while (this.moveAccumulator >= stepMs && guard < 10) {
      this.moveAccumulator -= stepMs
      this.tick()
      guard++
      if (this.status !== "running") {
        break
      }
    }
  }

  private tick(): void {
    if (this.pendingDirection) {
      this.direction = this.pendingDirection
      this.pendingDirection = null
    }

    const head = this.snake[0]
    const next = this.nextHead(head)

    // 撞墙
    if (next.x < 0 || next.x >= this.cols || next.y < 0 || next.y >= this.rows) {
      this.status = "gameover"
      return
    }

    const willEat = this.food !== null && next.x === this.food.x && next.y === this.food.y

    // 自撞检测:未吃到食物时蛇尾会移开,允许蛇头进入尾巴当前所在格
    const bodyToCheck = willEat ? this.snake : this.snake.slice(0, -1)
    if (bodyToCheck.some((s) => s.x === next.x && s.y === next.y)) {
      this.status = "gameover"
      return
    }

    this.snake.unshift(next)
    if (willEat) {
      this.score += 1
      this.food = this.spawnFood()
    } else {
      this.snake.pop()
    }
  }

  private nextHead(head: Point): Point {
    switch (this.direction) {
      case "up":
        return { x: head.x, y: head.y - 1 }
      case "down":
        return { x: head.x, y: head.y + 1 }
      case "left":
        return { x: head.x - 1, y: head.y }
      case "right":
        return { x: head.x + 1, y: head.y }
    }
  }

  /** 在空格子中随机生成食物;棋盘满时判胜并返回 null。 */
  private spawnFood(): Point | null {
    const free: Point[] = []
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (!this.snake.some((s) => s.x === x && s.y === y)) {
          free.push({ x, y })
        }
      }
    }
    if (free.length === 0) {
      this.status = "win"
      return null
    }
    return free[Math.floor(Math.random() * free.length)]
  }
}
