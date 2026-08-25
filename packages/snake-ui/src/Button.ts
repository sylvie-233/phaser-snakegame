import * as Phaser from "phaser"
import { UI_FONT_FAMILY, uiColors, uiRadii } from "./theme"

// 按钮变体
export type ButtonVariant = "primary" | "secondary" | "danger"

// 按钮大小
export type ButtonSize = "sm" | "md" | "lg"

// 按钮选项
export interface ButtonOptions {
  text: string
  onClick: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  /** 覆盖 size 预设的宽度 / 高度 / 字号 */
  width?: number
  height?: number
  fontSize?: string
  radius?: number
  textColor?: string
  /** 禁用后灰色、不可交互、不触发 onClick */
  disabled?: boolean
}

// 颜色预设
const VARIANT_COLORS: Record<ButtonVariant, { bg: number; hover: number; text: string }> = {
  primary: { bg: uiColors.primary, hover: uiColors.primaryHover, text: uiColors.textOnColor },
  secondary: { bg: uiColors.secondary, hover: uiColors.secondaryHover, text: uiColors.textPrimary },
  danger: { bg: uiColors.danger, hover: uiColors.dangerHover, text: "#ffffff" },
}

// 大小预设
const SIZE_DIMENSIONS: Record<ButtonSize, { width: number; height: number; fontSize: string }> = {
  sm: { width: 160, height: 44, fontSize: "16px" },
  md: { width: 220, height: 56, fontSize: "22px" },
  lg: { width: 280, height: 64, fontSize: "26px" },
}

/** 圆角矩形按钮(Container = Graphics + Text)。自带悬停高亮与按下缩放反馈。 */
export function createButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  options: ButtonOptions,
): Phaser.GameObjects.Container {
  const { text, onClick, variant = "primary", size = "md", disabled = false } = options
  const sizeSpec = SIZE_DIMENSIONS[size]
  const width = options.width ?? sizeSpec.width
  const height = options.height ?? sizeSpec.height
  const radius = options.radius ?? uiRadii.button
  const colors = VARIANT_COLORS[variant]
  const fontSize = options.fontSize ?? sizeSpec.fontSize
  const textColor = options.textColor ?? colors.text

  const g = scene.add.graphics()
  const draw = (color: number): void => {
    g.clear()
    g.fillStyle(color, 1)
    g.fillRoundedRect(-width / 2, -height / 2, width, height, radius)
  }
  draw(disabled ? uiColors.secondary : colors.bg)

  const label = scene.add
    .text(0, 0, text, {
      fontFamily: UI_FONT_FAMILY,
      fontSize,
      fontStyle: "bold",
      color: textColor,
    })
    .setOrigin(0.5)

  const container = scene.add.container(x, y, [g, label])
  container.setSize(width, height)

  if (!disabled) {
    container.setInteractive({ useHandCursor: true })
    container.on("pointerover", () => draw(colors.hover))
    container.on("pointerout", () => {
      draw(colors.bg)
      container.setScale(1)
    })
    container.on("pointerdown", () => container.setScale(0.96))
    container.on("pointerup", () => {
      container.setScale(1)
      onClick()
    })
  }

  return container
}
