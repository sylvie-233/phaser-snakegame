// 棋盘网格参数(单位为格)
export const GRID_COLS = 20
export const GRID_ROWS = 20

// 移动速度:基础步进时长会随分数加快
export const BASE_STEP_MS = 150
export const MIN_STEP_MS = 70
export const STEP_DECREMENT_PER_SCORE = 4

export function stepDuration(score: number): number {
  return Math.max(MIN_STEP_MS, BASE_STEP_MS - score * STEP_DECREMENT_PER_SCORE)
}
