@echo off
chcp 65001 >nul
title Học Hứng Khởi Tiểu Học - Dev Server
color 0B

echo.
echo  ╔═══════════════════════════════════════════╗
echo  ║   🎓  Học Hứng Khởi Tiểu Học             ║
echo  ║   Đang khởi động...                       ║
echo  ╚═══════════════════════════════════════════╝
echo.

cd /d "%~dp0"

:: Kiểm tra node_modules
if not exist "node_modules" (
    echo  ⚙️  Cài đặt dependencies lần đầu...
    call npm install
    echo.
)

if not exist "backend\node_modules" (
    echo  ⚙️  Cài đặt backend dependencies lần đầu...
    call npm install --prefix backend
    echo.
)

echo  🚀  Khởi động frontend + backend...
echo  📌  Mở trình duyệt tại: http://localhost:5173
echo  🔗  Backend bridge tại: http://localhost:5000
echo  ❌  Nhấn Ctrl+C để tắt server
echo.

:: Mở trình duyệt sau 3 giây
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:5173"

:: Chạy frontend + backend đồng thời
call npx concurrently "npm --prefix backend run dev" "npm run dev -- --host"

pause
