# Deploy hotfix script for PricingPage
$ErrorActionPreference = "Stop"

$sshKey = "F:\1_A_Disk_D\khuong-binh\TK\Orcle\vps-web-a1-01-140.245.202.65 - ssh-key-2026-05-22.key"
$vpsIP = "140.245.202.65"
$vpsUser = "root"
$localDist = "F:\1_A_Disk_D\Tool\hoc-tap-cap-02\CAp_01\dist"
$remotePath = "/var/www/apps/cap-01"

Write-Host "=== Deploy Hotfix PricingPage ===" -ForegroundColor Cyan
Write-Host "VPS: $vpsIP"
Write-Host "Path: $remotePath"
Write-Host ""

# Check if dist exists
if (-not (Test-Path $localDist)) {
    Write-Error "dist folder not found at $localDist"
    exit 1
}

# Check SSH key
if (-not (Test-Path $sshKey)) {
    Write-Error "SSH key not found at $sshKey"
    exit 1
}

# Set permissions on SSH key
icacls "$sshKey" /inheritance:r /grant:r "$($env:USERNAME):(R)" | Out-Null

Write-Host "1. Creating remote backup..." -ForegroundColor Yellow
ssh -i "$sshKey" -o StrictHostKeyChecking=no "$vpsUser@$vpsIP" "if [ -d $remotePath ]; then cp -r $remotePath ${remotePath}.backup.$(date +%Y%m%d%H%M%S); fi"

Write-Host "2. Removing old files..." -ForegroundColor Yellow
ssh -i "$sshKey" -o StrictHostKeyChecking=no "$vpsUser@$vpsIP" "rm -rf $remotePath/*"

Write-Host "3. Uploading new build..." -ForegroundColor Yellow
scp -i "$sshKey" -o StrictHostKeyChecking=no -r "$localDist\*" "$vpsUser@$vpsIP`:$remotePath/"

Write-Host "4. Setting permissions..." -ForegroundColor Yellow
ssh -i "$sshKey" -o StrictHostKeyChecking=no "$vpsUser@$vpsIP" "chown -R www-data:www-data $remotePath && chmod -R 755 $remotePath"

Write-Host "5. Testing deployment..." -ForegroundColor Yellow
$response = curl -s -o /dev/null -w "%{http_code}" "https://app.hochungkhoi.site/cap-01/"
Write-Host "   HTTP Status: $response"

if ($response -eq "200") {
    Write-Host ""
    Write-Host "✅ Deploy thành công!" -ForegroundColor Green
} else {
    Write-Warning "HTTP status: $response"
}
