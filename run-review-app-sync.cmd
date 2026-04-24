@echo off
setlocal

REM Usage:
REM   run-review-app-sync.cmd [--appId app-study-12] [--customerId cus-demo] [--local http://localhost:3900] [--live https://websalestotal.vercel.app]
REM You can pass AI_APP_SHARED_KEY from environment or set it below.

if "%AI_APP_SHARED_KEY%"=="" (
  echo [WARN] AI_APP_SHARED_KEY is empty. AI license endpoints will be skipped.
)

set APP_ID=app-study-12
set CUSTOMER_ID=cus-demo
set LOCAL_BASE=http://localhost:3900
set LIVE_BASE=https://websalestotal.vercel.app

:parse
if "%~1"=="" goto run
if /I "%~1"=="--appId" (
  set APP_ID=%~2
  shift
  shift
  goto parse
)
if /I "%~1"=="--customerId" (
  set CUSTOMER_ID=%~2
  shift
  shift
  goto parse
)
if /I "%~1"=="--local" (
  set LOCAL_BASE=%~2
  shift
  shift
  goto parse
)
if /I "%~1"=="--live" (
  set LIVE_BASE=%~2
  shift
  shift
  goto parse
)
if /I "%~1"=="--no-live" (
  set NO_LIVE=--no-live
  shift
  goto parse
)

echo [WARN] Unknown arg: %~1
shift
goto parse

:run
node "%~dp0review-app-sync-cli.mjs" --appId "%APP_ID%" --customerId "%CUSTOMER_ID%" --local "%LOCAL_BASE%" --live "%LIVE_BASE%" %NO_LIVE%
set EXIT_CODE=%ERRORLEVEL%

echo.
echo ExitCode=%EXIT_CODE%
exit /b %EXIT_CODE%
