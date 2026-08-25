import * as Phaser from "phaser"
import { createButton } from "./Button"
import { createLabel } from "./Label"
import { createPanel } from "./Panel"
import { uiColors } from "./theme"

// 模态框选项
export interface ModalOptions {
  title: string
  width?: number
  height?: number
  /** 遮罩不透明度(0~1),默认 0.65。页面背景较亮时可调小,避免背景被完全压黑。 */
  overlayAlpha?: number
  /**
   * 往面板内添加内容。回调收到面板 Container,内容坐标以面板中心为原点,
   * 用 panel.add(child) 挂入(会被面板一并销毁)。
   */
  content?: (panel: Phaser.GameObjects.Container) => void
  /** 关闭按钮文案;传 null 则隐藏关闭按钮(此时应由内容或遮罩关闭)。 */
  closeText?: string | null
  onClose?: () => void
}

export interface ModalHandle {
  close: () => void
}

/**
 * 模态弹窗:半透明遮罩 + 圆角面板 + 标题 + 内容 + 关闭按钮。
 * 点遮罩或关闭按钮关闭;返回 close() 句柄用于程序化关闭。
 */
export function openModal(scene: Phaser.Scene, options: ModalOptions): ModalHandle {
  const { title, onClose } = options
  const overlayAlpha = options.overlayAlpha ?? 0.65
  const closeText = options.closeText === undefined ? "关闭" : options.closeText
  const width = options.width ?? 460
  const height = options.height ?? 300
  const cx = scene.scale.width / 2
  const cy = scene.scale.height / 2

  const created: Phaser.GameObjects.GameObject[] = []
  let destroyed = false

  const close = (): void => {
    if (destroyed) {
      return
    }
    destroyed = true
    for (const obj of created) {
      obj.destroy()
    }
    onClose?.()
  }

  const overlay = scene.add
    .rectangle(cx, cy, scene.scale.width, scene.scale.height, 0x000000, overlayAlpha)
    .setInteractive({ useHandCursor: true })
  overlay.on("pointerdown", close)
  created.push(overlay)

  const panel = createPanel(scene, cx, cy, {
    width,
    height,
    backgroundColor: uiColors.panel,
    borderColor: uiColors.panelBorder,
  })
  created.push(panel)

  const titleLabel = createLabel(scene, cx, cy - height / 2 + 55, title, {
    variant: "subtitle",
  })
  created.push(titleLabel)

  if (closeText !== null) {
    const closeBtn = createButton(scene, cx, cy + height / 2 - 40, {
      text: closeText,
      variant: "secondary",
      size: "sm",
      onClick: close,
    })
    created.push(closeBtn)
  }

  options.content?.(panel)

  return { close }
}
