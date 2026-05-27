Set-Location 'F:\1_A_Disk_D\Tool\hoc-tap-cap-02\CAp_01'

# 1. PricingPage info
Write-Host "=== PricingPage files ==="
Get-ChildItem dist\assets\PricingPage-*.js | Select-Object Name,Length

# 2. PricingPage content check
Get-ChildItem dist\assets\PricingPage-*.js | ForEach-Object {
  Write-Host ""
  Write-Host "==== $($_.Name) ===="
  $matches = Select-String -Path $_.FullName -Pattern "Gói học & kích hoạt","Kích hoạt mã","Mua gói học","Free","Standard","Theo lớp","monthly","yearly","lifetime","Bảng so sánh" -SimpleMatch
  if ($matches) {
    $matches | ForEach-Object { Write-Host "$($_.Pattern): FOUND" }
  }
}

# 3. Support file
Write-Host ""
Write-Host "=== Support files ==="
Get-ChildItem dist\assets\support-*.js | Select-Object Name,Length

Get-ChildItem dist\assets\support-*.js | ForEach-Object {
  Write-Host ""
  Write-Host "==== $($_.Name) ===="
  Get-Content $_.FullName
}

# 4. Audio R2 check
Write-Host ""
Write-Host "=== Audio R2 check ==="
$foundE3 = $false
$found90 = $false
Get-ChildItem dist\assets\*.js | ForEach-Object {
  $content = Get-Content $_.FullName -Raw
  if ($content -match "pub-e3dfe5c479f44fbc906aae6c475603db") {
    if (-not $foundE3) {
      Write-Host "FOUND pub-e3dfe5c479f44fbc906aae6c475603db in $($_.Name)"
      $foundE3 = $true
    }
  }
  if ($content -match "pub-90b335e287f24c92bbd5856cb9f116d9") {
    if (-not $found90) {
      Write-Host "FOUND pub-90b335e287f24c92bbd5856cb9f116d9 in $($_.Name) - ERROR!"
      $found90 = $true
    }
  }
}

if (-not $foundE3) { Write-Host "ERROR: NOT FOUND pub-e3dfe5c479f44fbc906aae6c475603db" }
if (-not $found90) { Write-Host "OK: No pub-90b335e287f24c92bbd5856cb9f116d9 found" }
