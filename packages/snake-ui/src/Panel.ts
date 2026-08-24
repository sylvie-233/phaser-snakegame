import * as Phaser from 'phaser'
import { uiColors, uiRadii } from './theme'

export interface PanelOptions {
  width: number
  height: number
  radius?: number
  backgroundColor?: number
  borderColor?: number
  borderWidth?: number
  alpha?: number
}

/**
 * 圆角面板:Graphics 底 + 可选描边。
 * 返回 Container(原点在面板中心),调用方用 panel.add(child) 挂子元素即可,
 * 子元素坐标以面板中心为原点。
 */
export function createPanel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  options: PanelOptions,
): Phaser.GameObjects.Container {
  const {
    width,
    height,
    radius = uiRadii.panel,
    backgroundColor = uiColors.panel,
    borderColor,
    borderWidth = 2,
    alpha = 1,
  } = options

  const g = scene.add.graphics()
  g.fillStyle(backgroundColor, alpha)
  g.fillRoundedRect(-width / 2, -height / 2, width, height, radius)
  if (borderColor !== undefined) {
    g.lineStyle(borderWidth, borderColor, 1)
    g.strokeRoundedRect(-width / 2, -height / 2, width, height, radius)
  }

  return scene.add.container(x, y, [g])
}
