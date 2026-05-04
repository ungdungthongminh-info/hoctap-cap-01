# Desktop Auto-Update Smoke Test Report

## Objective
- Verify real updater flow in packaged desktop app:
  old version -> detect update -> download -> install -> relaunch new version.

## Execution Summary (Real A/B)
1. Source version installed and launched:
   - Installed app binary from v0.1.1 release asset `HocHungKhoi_Desktopapp-Win.exe`.
   - Baseline executable version: `0.1.1.0`.
2. Target release published on GitHub Releases (v0.1.2):
   - `latest.yml`
   - `HocHungKhoi_Desktopapp-Win-0.1.2.exe.blockmap`
   - `HocHungKhoi_Desktopapp-Win-0.1.2.exe` (250,517,943 bytes)
3. Updater detection and download confirmed from runtime logs:
   - `Checking for update`
   - `Found version 0.1.2`
   - `Downloading update from HocHungKhoi_Desktopapp-Win-0.1.2.exe`
   - `New version 0.1.2 has been downloaded to ...\hoc-hung-khoi-updater\pending\HocHungKhoi_Desktopapp-Win-0.1.2.exe`
4. Cache growth evidence captured in monitor log (`release/ab-update-monitor.log`):
   - `T+180s size=113014343` (old installer)
   - `T+195s size=250517943` (new installer v0.1.2)
5. Install-on-quit and relaunch evidence:
   - Post-close executable version became `0.1.2.0` (`release/close-check.out.txt`).
   - Relaunch succeeded (`ALIVE_AFTER_12S=True`) with v0.1.2 (`release/relaunch-check.out.txt`).

## Data Persistence Checks
1. App data DB remains present at `%APPDATA%\Hoc Hung Khoi Tieu Hoc\hoc-hung-khoi.db`.
2. Audio pack files remain available after update:
   - `AUDIO_PACK_FILES=1411`
3. License cache file state:
   - `LICENSE_CACHE_EXISTS=0` (no local license cache file present in this profile at test time).

## Notes
- Differential update attempted then gracefully fell back to full download because old release blockmap URL expected by updater returned 404 (`.../HocHungKhoi_Desktopapp-Win-0.1.1.exe.blockmap`).
- Full download path still completed successfully and update installed.

## Verdict
- AUTO_UPDATE_SMOKE_E2E: PASS
