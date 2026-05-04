# Production Drive-Pack TTS Smoke Test

## Scope
- Flow: Drive-first static ZIP pack by grade (lesson-card only)
- Profile: `vi-v1`
- Grades: `0..5`
- Fallback policy: no Google/backend/native fallback when pack is missing

## Drive Mapping Update (2026-05-04)
- `public/audio/tts/drive-packs.json` da duoc cap nhat day du:
	- grade 0 -> `vi-v1-pre-k-2026-04-27-v1.zip` -> `1tPIXTZ50LqgQxhutmvx8QE7IEc8uybTN`
	- grade 1 -> `vi-v1-grade-1-2026-04-27-v1.zip` -> `1xhb4KGGklpH9U2Kl0tA1ER8CWSE3czmq`
	- grade 2 -> `vi-v1-grade-2-2026-04-27-v1.zip` -> `1VY-VkQ9Wtunydd10rCCp_Xs9cTZRucyh`
	- grade 3 -> `vi-v1-grade-3-2026-04-27-v1.zip` -> `1LKgjUtADcVkbDpvCkfzSNCdNoJG94YQv`
	- grade 4 -> `vi-v1-grade-4-2026-04-27-v1.zip` -> `164Xxc7vlATmrBqSHd9EWSXnvk9Q37rFk`
	- grade 5 -> `vi-v1-grade-5-2026-04-27-v1.zip` -> `1PinMxVGHSl-GkekhSvTYp5rLgmcUFOQV`
- `driveDownloadUrl` da set theo format: `https://drive.google.com/uc?export=download&id=<FILE_ID>`

## Validation Matrix
| Check | Result | Evidence |
|---|---|---|
| `public/audio/tts/drive-packs.json` exists and has 6 grade packs | PASS | file includes grades `0..5`, filename/size/hash/assetCount per grade |
| ZIP artifacts exist in `public/audio/tts/packs/` | PASS | 6 files generated: `tts-vi-v1-grade-{0..5}-lesson-card.zip` |
| Frontend build after Drive-flow refactor | PASS | `npm run build` at repo root completed successfully |
| Backend build after proxy refactor | PASS | `npm run build` in `backend/` completed successfully |
| Backend proxy uses dynamic `drive-packs.json` config | PASS | `backend/src/controllers/staticPackProxyController.ts` now reads config file |
| Drive direct download (grade 0) | PASS | status=200, ct=application/octet-stream, magic=PK, filename matched |
| Drive direct download (grade 1) | FAIL | status=200 but ct=text/html, response starts with `<!DOCTYPE html>` (Google Drive interstitial/confirm path can occur) |
| Drive direct download (grade 2) | PASS | status=200, ct=application/octet-stream, magic=PK, filename matched |
| Drive direct download (grade 3) | PASS | status=200, ct=application/octet-stream, magic=PK, filename matched |
| Drive direct download (grade 4) | FAIL | status=200 but ct=text/html, response starts with `<!DOCTYPE html>` (Google Drive interstitial/confirm path can occur) |
| Drive direct download (grade 5) | FAIL | status=200 but ct=text/html, response starts with `<!DOCTYPE html>` (Google Drive interstitial/confirm path can occur) |
| Backend confirm-token fallback when Drive returns HTML | PASS | `backend/src/controllers/staticPackProxyController.ts` now parses confirm URL and retries with cookie carry |
| Backend strict no-HTML-pass guard | PASS | if still HTML after retries -> fail reason `google-drive-html-confirm-page` |
| Deploy Vercel (`vercel --prod --yes`) | FAIL | CLI error: cannot retrieve project settings / broken link config |
| Production lesson page shows new Drive-pack button | FAIL | production UI hien tai chua co nut `Tai goi giong doc lop hien tai` |
| Production lesson playback with Drive-pack flow | NOT EXECUTED | blocked boi deploy fail + 3 file Drive chua public direct zip |
| Audible proof (human-heard or volume mixer/video) | NOT EXECUTED | chua the xac nhan khi flow production chua dat dieu kien |

## Current Gate (Must Fix Before Production PASS)
- Verify lai grade `1, 4, 5` tren production sau deploy voi backend confirm-token logic moi.
- Neu van tra HTML sau confirm retry, backend se fail ro `reason=google-drive-html-confirm-page` (khong PASS HTML).
- Fix Vercel deploy linkage (hien tai CLI bao loi project settings).
- Deploy lai frontend/backend voi config moi.
- Re-run production smoke va capture bang chung audible that (human-heard/volume mixer/video).

## Notes
- Khong co ket luan "co tieng that" trong bao cao nay.
- Khong ket luan voi nguyen nhan "quyen" mot cach don gian khi Drive tra HTML; da them xu ly confirm/interstitial page o backend de loai bo false fail do luong canh bao cua Drive.

## R2 Migration Delta
- Da tao day du script R2 cho download/upload/test packs va lesson-card MVP.
- Da tai thu 6 file Drive ve scratch: grade 0/2/3 la ZIP hop le, grade 1/4/5 tra HTML interstitial.
- Chua upload R2 do thieu gia tri that trong `.env.r2` (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_BASE_URL`, `R2_ENDPOINT`).
