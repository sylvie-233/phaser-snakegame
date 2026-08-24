import { contextBridge } from 'electron';

// 暴露给渲染进程的最小 API(目前仅平台信息,可按需扩展)
contextBridge.exposeInMainWorld('desktop', {
  platform: process.platform,
});
