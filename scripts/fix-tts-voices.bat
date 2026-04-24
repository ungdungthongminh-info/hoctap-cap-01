@echo off
:: ============================================
:: FIX TTS VOICES - Copy OneCore -> SAPI5
:: Cho phep Chrome/Electron doc voice tieng Viet
:: PHAI CHAY BANG QUYEN ADMIN!
:: ============================================

echo ============================================
echo   FIX GIONG DOC TIENG VIET CHO CHROME
echo ============================================
echo.

:: Check Admin rights
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [LOI] Can chay bang quyen Admin!
    echo Nhan chuot phai vao file nay -^> "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo [1/3] Kiem tra voice OneCore...

reg query "HKLM\SOFTWARE\Microsoft\Speech_OneCore\Voices\Tokens" >nul 2>&1
if %errorlevel% neq 0 (
    echo [LOI] Khong tim thay OneCore voices.
    echo Hay cai dat goi ngon ngu Tieng Viet truoc.
    pause
    exit /b 1
)

echo [2/3] Copy OneCore voices sang SAPI5...

:: Copy all OneCore voice tokens to SAPI5 path
for /f "tokens=*" %%a in ('reg query "HKLM\SOFTWARE\Microsoft\Speech_OneCore\Voices\Tokens" 2^>nul ^| findstr /i "HKLM"') do (
    for %%b in (%%~na) do (
        reg query "HKLM\SOFTWARE\Microsoft\Speech\Voices\Tokens\%%b" >nul 2>&1
        if errorlevel 1 (
            echo   + Copying: %%b
            reg copy "%%a" "HKLM\SOFTWARE\Microsoft\Speech\Voices\Tokens\%%b" /s /f >nul 2>&1
        ) else (
            echo   = Da co: %%b
        )
    )
)

echo [3/3] Xong! Hay khoi dong lai trinh duyet/app.
echo.
echo ============================================
echo   THANH CONG! Khoi dong lai app/Chrome.
echo ============================================
echo.
pause
