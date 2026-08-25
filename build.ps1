# 贪吃蛇 Windows 打包脚本
# 1. 构建游戏(Vite) -> apps/game/dist
# 2. 复制到 Electron 壳并打包 -> apps/desktop/release/
$ErrorActionPreference = 'Stop'

# 确保脚本以 UTF-8 读取、控制台与子进程输出按 UTF-8 解码,避免中文乱码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 > $null

Write-Host "==> [1/2] 构建游戏 (Vite) ..." -ForegroundColor Cyan
pnpm --filter @snake/game build
if ($LASTEXITCODE -ne 0) { throw "游戏构建失败" }

Write-Host "==> [2/2] 打包 Electron 安装包 ..." -ForegroundColor Cyan
pnpm --filter @snake/desktop package
if ($LASTEXITCODE -ne 0) { throw "Electron 打包失败" }

Write-Host ""
Write-Host "打包完成!产物位于 apps/desktop/release/ 目录" -ForegroundColor Green
