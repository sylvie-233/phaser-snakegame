import snake from '@snake/eslint-config'
import globals from 'globals'

// Electron 主进程/preload:补充 Node 环境全局变量(process、setTimeout 等)
export default [
  ...snake,
  {
    name: '@snake/desktop-node-globals',
    files: ['src/**/*.ts'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
]
