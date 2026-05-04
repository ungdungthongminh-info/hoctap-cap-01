# Diff Review TTS (Active Repo: hoctap-cap-01)

## Git Snapshot
- `git remote -v`: `origin https://github.com/ungdungthongminh-info/hoctap-cap-01.git`
- `git branch --show-current`: `clean-main`
- Changed files (effective): `.gitignore`, `electron/main.js`

## Scope Diff Read
- Reviewed requested paths: `electron/main.js`, `electron/preload.js`, `electron/audioPackStore.js`, `src`, `scripts`, `backend`, `public`, `package.json`
- Effective changes only in `.gitignore` and `electron/main.js`
- Therefore full `git diff` review equals these 2 files

## Change Classification Table

| File đổi | Mục đích đổi | Ảnh hưởng TTS runtime thật? | Chỉ vá acceptance/test? | Rủi ro lệch web/app/desktop | Cần giữ hay revert |
|---|---|---|---|---|---|
| `.gitignore` | Ignore thêm report/audit/mp3/audio-packs artifacts | Không (hành vi runtime không đổi) | Không | Thấp | Giữ |
| `electron/main.js` (khối `runDesktopAcceptanceAudit`) | Tăng độ bền acceptance all-grades (resolver fallback, timeout, network criteria, download error handling) | Có ảnh hưởng gián tiếp vì gọi bridge resolver thật (`audioPacks.getAssetUrl`) trong audit; không thay luồng speak chính của renderer | Có một phần test-only rõ ràng: `HHK_DESKTOP_ACCEPTANCE_TEST`, fast-path/cached activation và synthetic cache injection | Trung bình: có nguy cơ hiểu nhầm pass acceptance = runtime production pass nếu không tách test harness khỏi production path | Giữ có điều kiện: giữ phần audit hợp lệ; cần tách/đánh dấu mạnh các đoạn synthetic/test-only và không để production phụ thuộc |

## Findings: Test-only vs Runtime

### Test-only (không được coi là runtime production fix)
- `DESKTOP_ACCEPTANCE_AUDIT` gate bằng env `HHK_DESKTOP_ACCEPTANCE_TEST`.
- `DESKTOP_E2E_LICENSE_KEY` + fast-path cache reuse trong acceptance.
- Synthetic license cache injection trước acceptance run.
- Những đoạn này chỉ chạy trong acceptance path và không phải resolver speak runtime của user flow.

### Runtime thật (có liên quan trực tiếp resolver)
- Runtime speak thực tế nằm ở renderer/service (`ttsRuntime`, `LessonDetailPage`) và Electron bridge `audioPacks:get-asset-url`.
- Trong diff hiện tại chưa có thay đổi ở `src/shared/services/tts/ttsRuntime.ts` hoặc `electron/audioPackStore.js`.
- Kết luận: thay đổi vừa rồi chủ yếu là harness acceptance; không đủ để tuyên bố đã sửa triệt để production runtime.

## Risk Notes
- Nếu giữ nguyên synthetic cache trong `electron/main.js`, cần cảnh báo rõ: chỉ dùng cho audit acceptance, tuyệt đối không được dùng để kết luận business activation thực.
- Acceptance pass hiện tại chứng minh tốt luồng đọc desktop offline all-grades trong môi trường test, nhưng chưa thay thế được audit catalog/audio full data và web sequential runtime evidence.

## Decision
- **Không commit/push tại thời điểm này**.
- Tiếp tục bắt buộc các bước còn thiếu:
  - `tts-catalog-integrity-report.json`
  - `desktop-tts-all-grades-report.json` (run theo lệnh sạch userData + NODE_ENV=production)
  - `web-tts-sequential-report.json`
  - `content-audio-audit-report.json`
- Nếu bất kỳ report `pass=false` thì dừng trước commit.
