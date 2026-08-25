import { GRID_COLS, GRID_ROWS } from "@snake/core"

export const CELL_SIZE = 30 // 每格像素

export const BOARD_WIDTH = GRID_COLS * CELL_SIZE
export const BOARD_HEIGHT = GRID_ROWS * CELL_SIZE

// 顶部 HUD 高度
export const HUD_HEIGHT = 40

export const GAME_WIDTH = BOARD_WIDTH
export const GAME_HEIGHT = BOARD_HEIGHT + HUD_HEIGHT

export const BOARD_OFFSET_X = 0
export const BOARD_OFFSET_Y = HUD_HEIGHT
