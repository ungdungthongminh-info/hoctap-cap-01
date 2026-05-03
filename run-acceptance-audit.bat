@echo off
setlocal enabledelayedexpansion
set HHK_DESKTOP_ACCEPTANCE_TEST=1
set HHK_DESKTOP_E2E_LICENSE_KEY=WSTL-MOPSVT3L-B08995
set HHK_DESKTOP_ACCEPTANCE_OUTPUT=f:\1_A_Disk_D\Tool\Hoc_Tap\CAp_01\acceptance-audit-report.json
cd /d "f:\1_A_Disk_D\Tool\Hoc_Tap\CAp_01"
start "" /wait "release\win-unpacked\Hoc Hung Khoi Tieu Hoc.exe"
echo Done. Checking for report...
ping localhost -n 2 > nul
if exist "acceptance-audit-report.json" (
    echo Report found!
    type acceptance-audit-report.json
) else (
    echo Report not found.
)
