# Desktop Auto-Update Audit Report

## Scope
- Date: 2026-05-04
- Branch: clean-main
- App version (build local): 0.1.2
- Audit target: desktop production auto-update readiness (no fake pass)

## Evidence Sources
- Build config: package.json (build.publish, win/nsis target, scripts)
- Main process updater: electron/main.js
- Preload bridge: electron/preload.js
- Renderer updater service/UI:
  - src/shared/services/desktopUpdater.ts
  - src/shared/components/AppUpdateBanner.tsx
  - src/shared/components/Sidebar.tsx
- Production artifacts:
  - release/latest.yml
  - release/HocHungKhoi_Desktopapp-Win-0.1.2.exe.blockmap
  - release/win-unpacked/resources/app-update.yml
- Runtime endpoint check (read-only):
  - https://github.com/ungdungthongminh-info/hoctap-cap-01/releases/latest/download/latest.yml
  - https://github.com/ungdungthongminh-info/hoctap-cap-01/releases/latest/download/HocHungKhoi_Desktopapp-Win.exe

## 15-Point Checklist
| # | Check | Status | Evidence |
|---|---|---|---|
| 1 | electron-updater dependency installed | PASS | package.json contains electron-updater |
| 2 | electron-builder publish provider configured (GitHub) | PASS | package.json build.publish owner/repo configured |
| 3 | Updater enabled only for packaged app | PASS | electron/main.js uses app.isPackaged and sets unsupported in dev |
| 4 | Updater state machine exists (idle/checking/available/downloading/downloaded/error) | PASS | electron/main.js updaterState + event handlers |
| 5 | Auto-check on startup and periodic interval | PASS | electron/main.js runCheck() + setInterval(60 min) |
| 6 | IPC handlers for updater actions | PASS | electron/main.js handles updater:get-state/check/download/quit-install |
| 7 | Secure preload bridge for updater | PASS | electron/preload.js exposes updater API via contextBridge |
| 8 | Renderer service subscribes and normalizes updater state | PASS | src/shared/services/desktopUpdater.ts |
| 9 | User-facing update banner actions (check/download/install/retry) | PASS | src/shared/components/AppUpdateBanner.tsx |
| 10 | Sidebar update notice integration | PASS | src/shared/components/Sidebar.tsx |
| 11 | Production package build succeeds | PASS | npm run electron:build completed successfully |
| 12 | Required updater artifacts generated locally | PASS | release/latest.yml, *.blockmap, app-update.yml exist |
| 13 | latest.yml metadata consistent with built installer | PASS | latest.yml points to HocHungKhoi_Desktopapp-Win-0.1.2.exe + sha512 |
| 14 | Public release endpoint reachable for update feed | PASS | latest.yml latest/download redirects to GitHub release asset |
| 15 | End-to-end auto-update smoke (old version -> detect -> download -> quitAndInstall -> relaunch new) | FAIL | Not executed in this audit session (no staged A/B release test run) |

## Additional Findings
- release/win-unpacked/resources/app-update.yml is generated with provider github and correct owner/repo.
- Auto-update is disabled in audit env mode (HHK_DESKTOP_RUNTIME_TEST/HHK_DESKTOP_ACCEPTANCE_TEST), so audit harness cannot be used as updater proof.

## Gate Decision
- AUTO_UPDATE: FAIL
- Reason: Architecture and build artifacts are ready, but missing real end-to-end updater smoke from an older installed version to the new version.

## Required Next Evidence For PASS
1. Install old release (example: 0.1.1) on clean userData path.
2. Publish 0.1.2 assets (installer + latest.yml + blockmap) to GitHub release channel used by updater.
3. From running 0.1.1 packaged app, capture states: checking -> available -> downloading -> downloaded.
4. Trigger install (quitAndInstall or autoInstallOnAppQuit), relaunch app.
5. Verify app version changed to 0.1.2 and user data/license cache remains intact.
