$env:VITE_WEB = "true"
$env:VITE_BASE_PATH = "/cap-01/"
$env:VITE_BACKEND_API_BASE = "https://hochungkhoi.site/api"

Write-Host "Building with env:" -ForegroundColor Green
Write-Host "  VITE_WEB = $env:VITE_WEB"
Write-Host "  VITE_BASE_PATH = $env:VITE_BASE_PATH"
Write-Host "  VITE_BACKEND_API_BASE = $env:VITE_BACKEND_API_BASE"

npm run build 2>&1 | Tee-Object -FilePath build.log

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Build successful" -ForegroundColor Green
    
    Write-Host "`n--- Checking dist for ai-app references ---" -ForegroundColor Yellow
    $aiAppHits = Get-ChildItem -Recurse dist -Include *.js | Select-String -Pattern 'ai-app','vi-app','/api/v1/ai-app' -SimpleMatch -ErrorAction SilentlyContinue
    if ($aiAppHits) {
        Write-Host "❌ FAIL: Found ai-app references:" -ForegroundColor Red
        $aiAppHits | ForEach-Object { Write-Host "  $_" }
    } else {
        Write-Host "✅ PASS: No ai-app/vi-app references found" -ForegroundColor Green
    }
    
    Write-Host "`n--- Checking dist for correct endpoints ---" -ForegroundColor Yellow
    $endpointHits = Get-ChildItem -Recurse dist -Include *.js | Select-String -Pattern 'licenses/verify','hochungkhoi.site/api' -SimpleMatch -ErrorAction SilentlyContinue
    if ($endpointHits) {
        Write-Host "✅ Found license endpoints:" -ForegroundColor Green
        $endpointHits | Select-Object -First 5 | ForEach-Object { Write-Host "  $_" }
    } else {
        Write-Host "⚠️  No endpoint references found (may be optimized out)" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n❌ Build failed" -ForegroundColor Red
    exit 1
}
