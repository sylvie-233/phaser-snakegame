import * as Phaser from "phaser"
import { GRID_COLS, GRID_ROWS } from "@snake/core"
import { CELL_SIZE, GAME_HEIGHT, GAME_WIDTH } from "../layout"

/** 在整个画布上绘制浅色网格(用于开始页 / 结束页背景)。 */
export function drawGridBackground(scene: Phaser.Scene): void {
  const grid = scene.add.graphics()
  grid.lineStyle(1, 0xffffff, 0.05)
  for (let x = 1; x < GRID_COLS; x++) {
    grid.lineBetween(x * CELL_SIZE, 0, x * CELL_SIZE, GAME_HEIGHT)
  }
  for (let y = 1; y < GRID_ROWS; y++) {
    grid.lineBetween(0, y * CELL_SIZE, GAME_WIDTH, y * CELL_SIZE)
  }
}
