@echo off
cd /d "%~dp0"
set VITE_WEB=true
set VITE_BASE_PATH=/cap-01/
set VITE_API_BASE_URL=https://hochungkhoi.site/api
npm run build
