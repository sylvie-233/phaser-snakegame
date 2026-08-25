import snake from "@snake/eslint-config"
import globals from "globals"

// UI 组件运行在浏览器渲染环境(Phaser),补充浏览器全局变量
export default [
  ...snake,
  {
    name: "@snake/ui-browser-globals",
    files: ["**/*.ts"],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
]
