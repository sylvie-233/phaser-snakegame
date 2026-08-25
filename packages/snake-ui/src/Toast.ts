import * as Phaser from "phaser"
import { UI_FONT_FAMILY, uiColors, uiRadii } from "./theme"

// 弹出框选项
export interface ToastOptions {
  message: string
  /** 停留时长(ms),默认 2000 */
  duration?: number
  backgroundColor?: number
  textColor?: string
}

/**
 * 顶部居中临时提示:淡入停留后自动淡出销毁。
 * 独立于场景布局,叠加在其它内容之上(depth 1000)。
 */
export function showToast(scene: Phaser.Scene, options: ToastOptions): void {
  const { message, duration = 2000 } = options
  const backgroundColor = options.backgroundColor ?? uiColors.panel
  const textColor = options.textColor ?? uiColors.textPrimary

  const text = scene.add.text(0, 0, message, {
    fontFamily: UI_FONT_FAMILY,
    fontSize: "18px",
    color: textColor,
  })
  text.setOrigin(0.5)

  const g = scene.add.graphics()
  const w = text.width + 48
  const h = 52
  g.fillStyle(backgroundColor, 0.95)
  g.fillRoundedRect(-w / 2, -h / 2, w, h, uiRadii.toast)

  const container = scene.add.container(scene.scale.width / 2, 80, [g, text])
  container.setDepth(1000)
  container.setAlpha(0)

  scene.tweens.add({
    targets: container,
    alpha: 1,
    duration: 150,
    ease: "Quad.easeOut",
  })
  scene.tweens.add({
    targets: container,
    alpha: 0,
    delay: duration,
    duration: 250,
    onComplete: () => container.destroy(),
  })
}
