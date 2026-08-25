// @snake/ui — 全局主题:字体、配色、圆角、字阶
// 全仓 UI 视觉语言的唯一来源,避免各场景手写魔法值。

export const UI_FONT_FAMILY = 'system-ui, "Microsoft YaHei", sans-serif'

export const uiColors = {
  /** 页面 / 棋盘背景 */
  background: 0x0f172a,
  /** 面板底色与描边 */
  panel: 0x1e293b,
  panelBorder: 0x475569,
  /** 主按钮(绿色系) */
  primary: 0x22c55e,
  primaryHover: 0x4ade80,
  /** 次按钮(灰蓝系) */
  secondary: 0x334155,
  secondaryHover: 0x475569,
  /** 危险操作(红色系) */
  danger: 0xef4444,
  dangerHover: 0xf87171,
  /** 文字 */
  textPrimary: "#f8fafc",
  textSecondary: "#cbd5e1",
  textMuted: "#94a3b8",
  /** 彩色背景上的深色文字 */
  textOnColor: "#0f172a",
  /** 强调色(胜利 / 新纪录) */
  accent: "#fbbf24",
} as const

export const uiRadii = {
  button: 12,
  panel: 16,
  toast: 10,
} as const

/** 文本字阶(px) */
export const uiFontSize = {
  heading: "56px",
  title: "40px",
  subtitle: "26px",
  body: "18px",
  small: "16px",
} as const
