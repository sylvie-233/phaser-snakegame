import * as Phaser from 'phaser'

export interface ButtonOptions {
  text: string
  onClick: () => void
  /** 按钮宽度,默认 220 */
  width?: number
  /** 按钮高度,默认 56 */
  height?: number
  radius?: number
  fontSize?: string
  textColor?: string
  backgroundColor?: number
  hoverColor?: number
}

/**
 * 创建一个圆角矩形按钮(Container = Graphics + Text)。
 * 自带悬停高亮与按下缩放反馈,点击(pointerup)触发 onClick。
 */
export function createButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  options: ButtonOptions,
): Phaser.GameObjects.Container {
  const {
    text,
    onClick,
    width = 220,
    height = 56,
    radius = 12,
    fontSize = '22px',
    textColor = '#0f172a',
    backgroundColor = 0x22c55e,
    hoverColor = 0x4ade80,
  } = options

  const g = scene.add.graphics()
  const draw = (color: number): void => {
    g.clear()
    g.fillStyle(color, 1)
    g.fillRoundedRect(-width / 2, -height / 2, width, height, radius)
  }
  draw(backgroundColor)

  const label = scene.add
    .text(0, 0, text, {
      fontFamily: 'system-ui, "Microsoft YaHei", sans-serif',
      fontSize,
      fontStyle: 'bold',
      color: textColor,
    })
    .setOrigin(0.5)

  const container = scene.add.container(x, y, [g, label])
  container.setSize(width, height)
  container.setInteractive({ useHandCursor: true })

  container.on('pointerover', () => draw(hoverColor))
  container.on('pointerout', () => {
    draw(backgroundColor)
    container.setScale(1)
  })
  container.on('pointerdown', () => container.setScale(0.96))
  container.on('pointerup', () => {
    container.setScale(1)
    onClick()
  })

  return container
}
