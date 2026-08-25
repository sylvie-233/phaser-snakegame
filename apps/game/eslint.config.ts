import snake from "@snake/eslint-config"
import globals from "globals"

// 浏览器前端(Vite + Phaser):补充浏览器环境全局变量
export default [
  ...snake,
  {
    name: "@snake/game-browser-globals",
    files: ["**/*.ts"],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
]
