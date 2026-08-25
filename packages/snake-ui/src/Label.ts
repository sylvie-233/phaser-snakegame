import * as Phaser from "phaser"
import { UI_FONT_FAMILY, uiColors, uiFontSize } from "./theme"

export type LabelVariant = "heading" | "title" | "subtitle" | "body" | "muted" | "accent"

export interface LabelOptions {
  variant?: LabelVariant
  fontSize?: string
  fontStyle?: string
  color?: string
  fontFamily?: string
}

const VARIANT_STYLES: Record<LabelVariant, { fontSize: string; fontStyle: string; color: string }> =
  {
    heading: { fontSize: uiFontSize.heading, fontStyle: "bold", color: uiColors.textPrimary },
    title: { fontSize: uiFontSize.title, fontStyle: "bold", color: uiColors.textPrimary },
    subtitle: { fontSize: uiFontSize.subtitle, fontStyle: "bold", color: uiColors.textPrimary },
    body: { fontSize: uiFontSize.body, fontStyle: "normal", color: uiColors.textSecondary },
    muted: { fontSize: uiFontSize.small, fontStyle: "normal", color: uiColors.textMuted },
    accent: { fontSize: uiFontSize.subtitle, fontStyle: "bold", color: uiColors.accent },
  }

/** 主题化文本:统一字体族与预设字阶,细节可通过 options 覆盖。默认原点居中。 */
export function createLabel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  options: LabelOptions = {},
): Phaser.GameObjects.Text {
  const base = VARIANT_STYLES[options.variant ?? "body"]
  return scene.add
    .text(x, y, text, {
      fontFamily: options.fontFamily ?? UI_FONT_FAMILY,
      fontSize: options.fontSize ?? base.fontSize,
      fontStyle: options.fontStyle ?? base.fontStyle,
      color: options.color ?? base.color,
    })
    .setOrigin(0.5)
}
