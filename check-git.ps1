cd 'F:\1_A_Disk_D\Tool\hoc-tap-cap-02\CAp_01'

Write-Host "=== Git Status ==="
git status --short

Write-Host ""
Write-Host "=== PricingPage Git Log ==="
git log --oneline -10 -- src/modules/student/pages/PricingPage.tsx

Write-Host ""
Write-Host "=== Create Backup Branch ==="
git branch backup-before-pricing-hotfix
Write-Host "Backup branch created"

Write-Host ""
Write-Host "=== All PricingPage Commits ==="
git log --oneline -- src/modules/student/pages/PricingPage.tsx
