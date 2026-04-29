@echo off
setlocal
chcp 65001 >nul

cd /d "%~dp0"

set "EXE_MAIN=release\HocHungKhoi_Desktopapp-Win.exe"
set "EXE_FALLBACK=release\win-unpacked\Hoc Hung Khoi Tieu Hoc.exe"

if exist "%EXE_MAIN%" (
    start "" "%EXE_MAIN%"
    exit /b 0
)

if exist "%EXE_FALLBACK%" (
    start "" "%EXE_FALLBACK%"
    exit /b 0
)

echo Khong tim thay file desktop portable.
echo Hay build lai bang lenh: npm run electron:build
pause
exit /b 1
