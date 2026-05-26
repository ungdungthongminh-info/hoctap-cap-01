# PowerShell script tự động deploy Cấp 01 lên VPS
# Yêu cầu: SSH key hoặc password cho VPS 140.245.202.65

param(
    [string]$VpsHost = "140.245.202.65",
    [string]$VpsUser = "ubuntu",
    [string]$VpsPassword = "",  # Nếu không có SSH key
    [string]$SshKeyPath = "F:\1_A_Disk_D\khuong-binh\TK\Orcle\vps-web-a1-01-140.245.202.65\ssh-key-2026-05-22.key",
    [string]$LocalBuildPath = "F:\1_A_Disk_D\Tool\hoc-tap-cap-02\CAp_01\dist",
    [string]$RemotePath = "/var/www/apps/cap-01",
    [string]$NginxConf = "/etc/nginx/sites-available/app.hochungkhoi.site",
    [switch]$SkipBuild = $false
)

$ErrorActionPreference = "Stop"

Write-Host "=== Deploy Cấp 01 to VPS ===" -ForegroundColor Cyan
Write-Host "VPS: $VpsUser@$VpsHost" -ForegroundColor Gray
Write-Host "Remote path: $RemotePath" -ForegroundColor Gray
Write-Host ""

# Step 1: Build (nếu cần)
if (-not $SkipBuild) {
    Write-Host "[1/6] Building Cấp 01..." -ForegroundColor Yellow
    Set-Location "F:\1_A_Disk_D\Tool\hoc-tap-cap-02\CAp_01"
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Build failed!"
        exit 1
    }
} else {
    Write-Host "[1/6] Skipping build (using existing dist/)" -ForegroundColor Gray
}

# Step 2: Create archive
Write-Host "[2/6] Creating deployment archive..." -ForegroundColor Yellow
$ZipPath = "F:\1_A_Disk_D\Tool\hoc-tap-cap-02\CAp_01\cap-01-deploy.zip"
if (Test-Path $ZipPath) {
    Remove-Item $ZipPath -Force
}
Compress-Archive -Path "$LocalBuildPath\*" -DestinationPath $ZipPath -Force
Write-Host "    -> Created: $ZipPath ($( (Get-Item $ZipPath).Length / 1MB ) MB)" -ForegroundColor Green

# Step 3: Upload to VPS
Write-Host "[3/6] Uploading to VPS..." -ForegroundColor Yellow

# Kiểm tra có scp không
$scp = Get-Command scp -ErrorAction SilentlyContinue
if (-not $scp) {
    Write-Error "scp not found. Please install OpenSSH or use manual upload."
    exit 1
}

# Upload file
$remoteZipPath = "/tmp/cap-01-deploy.zip"
try {
    if ($VpsPassword) {
        # Dùng plink/pscp với password
        Write-Host "    -> Using password authentication (not recommended)" -ForegroundColor Yellow
        # Cần pscp hoặc plink để xử lý password
        Write-Host "    -> Please upload manually or use SSH key" -ForegroundColor Red
        exit 1
    } elseif (Test-Path $SshKeyPath) {
        # Dùng SSH key
        Write-Host "    -> Uploading via SCP with SSH key..." -ForegroundColor Gray
        Write-Host "    -> Key: $SshKeyPath" -ForegroundColor Gray
        # Escape spaces in path for SCP
        $escapedKeyPath = '"' + $SshKeyPath + '"'
        $escapedZipPath = '"' + $ZipPath + '"'
        scp -i $escapedKeyPath $escapedZipPath "${VpsUser}@${VpsHost}:${remoteZipPath}"
    } else {
        Write-Host "    -> ERROR: SSH key not found at $SshKeyPath" -ForegroundColor Red
        Write-Host "    -> Please check the key path or provide password" -ForegroundColor Red
        exit 1
    }
    Write-Host "    -> Upload complete" -ForegroundColor Green
} catch {
    Write-Error "Upload failed: $_"
    exit 1
}

# Step 4: SSH commands để deploy
Write-Host "[4/6] Running remote deployment..." -ForegroundColor Yellow

$sshCommands = @"
set -e
echo "[Remote] Creating directory..."
sudo mkdir -p `$RemotePath
cd /tmp

# Giải nén và copy
if [ -f "`$remoteZipPath" ]; then
    echo "[Remote] Extracting files..."
    unzip -o "`$remoteZipPath" -d "`$RemotePath/"
    rm "`$remoteZipPath"
else
    echo "[Remote] ERROR: Zip file not found"
    exit 1
fi

# Kiểm tra file
echo "[Remote] Verifying files..."
ls -la "`$RemotePath/"

# Kiểm tra Nginx config hiện tại
echo "[Remote] Checking Nginx config..."
if ! grep -q "location /cap-01/" "`$NginxConf"; then
    echo "[Remote] Adding Nginx location for /cap-01/..."
    
    # Tạo backup
    TIMESTAMP=\$(date +%Y%m%d%H%M%S)
    sudo cp "`$NginxConf" "`$NginxConf.backup.\$TIMESTAMP"
    
    # Thêm location block
    sudo tee -a "`$NginxConf" > /dev/null << 'EOF'

    # Cấp 01 location - Auto-added by deploy script
    location /cap-01/ {
        alias /var/www/apps/cap-01/;
        index index.html;
        try_files `$uri `$uri/ /cap-01/index.html;
        
        # Cache static assets
        location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
EOF
    echo "[Remote] Nginx config updated"
else
    echo "[Remote] Nginx location /cap-01/ already exists"
fi

# Test Nginx
echo "[Remote] Testing Nginx config..."
sudo nginx -t

# Reload Nginx
echo "[Remote] Reloading Nginx..."
sudo systemctl reload nginx

# Test local
echo "[Remote] Testing local endpoints..."
echo "Test /cap-01/:"
curl -s -o /dev/null -w "%{http_code}" http://localhost/cap-01/ || echo "FAIL"
echo ""
echo "Test /lop-06/:"
curl -s -o /dev/null -w "%{http_code}" http://localhost/lop-06/ || echo "FAIL"
echo ""

echo "[Remote] Deploy complete!"
"@

try {
    if (Test-Path $SshKeyPath) {
        $escapedKeyPath = '"' + $SshKeyPath + '"'
        ssh -i $escapedKeyPath "${VpsUser}@${VpsHost}" $sshCommands
    } else {
        ssh "${VpsUser}@${VpsHost}" $sshCommands
    }
    Write-Host "    -> Remote deployment complete" -ForegroundColor Green
} catch {
    Write-Error "Remote deployment failed: $_"
    exit 1
}

# Step 5: Purge Cloudflare cache
Write-Host "[5/6] Purging Cloudflare cache..." -ForegroundColor Yellow
Write-Host "    -> MANUAL: Go to Cloudflare Dashboard → Caching → Purge Everything" -ForegroundColor Yellow
Write-Host "    -> Or use: ./scripts/purge-cloudflare-cache.py (need API token)" -ForegroundColor Yellow

# Step 6: Final test
Write-Host "[6/6] Testing public URLs..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

try {
    $cap01Response = Invoke-WebRequest -Uri "https://app.hochungkhoi.site/cap-01/" -Method HEAD -UseBasicParsing -TimeoutSec 10
    Write-Host "    -> https://app.hochungkhoi.site/cap-01/ : $($cap01Response.StatusCode) ✅" -ForegroundColor Green
} catch {
    Write-Host "    -> https://app.hochungkhoi.site/cap-01/ : FAILED ❌" -ForegroundColor Red
}

try {
    $lop06Response = Invoke-WebRequest -Uri "https://app.hochungkhoi.site/lop-06/" -Method HEAD -UseBasicParsing -TimeoutSec 10
    Write-Host "    -> https://app.hochungkhoi.site/lop-06/ : $($lop06Response.StatusCode) ✅" -ForegroundColor Green
} catch {
    Write-Host "    -> https://app.hochungkhoi.site/lop-06/ : FAILED ❌" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Deploy Summary ===" -ForegroundColor Cyan
Write-Host "Build: $( if ($SkipBuild) { 'SKIPPED' } else { 'DONE' } )" -ForegroundColor $( if ($SkipBuild) { 'Gray' } else { 'Green' } )
Write-Host "Upload: DONE" -ForegroundColor Green
Write-Host "Nginx: CONFIGURED" -ForegroundColor Green
Write-Host "Cache Purge: MANUAL STEP" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Purge Cloudflare cache from Dashboard" -ForegroundColor White
Write-Host "2. Test: https://app.hochungkhoi.site/cap-01/" -ForegroundColor White
Write-Host "3. Verify: https://app.hochungkhoi.site/lop-06/ still works" -ForegroundColor White
