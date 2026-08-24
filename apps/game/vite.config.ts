import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    target: 'es2022',
  },
  optimizeDeps: {
    // 工作区内的 TS 源码包按源码处理,不参与依赖预构建
    exclude: ['@snake/core'],
  },
});
