# TTS Generation Recovery Plan

**Tạo:** 2026-05-04  
**Nguồn dữ liệu:** `tts-missing-audio-breakdown.json`, `tts-generation-blocker.md`, `public/audio/tts/manifest.json`

---

## Trạng thái credential (3 dòng)

- **Loại credential:** ADC (`authorized_user`) tại `C:\Users\PC\AppData\Roaming\gcloud\application_default_credentials.json` — **không phải service account**.
- **Project đã xóa:** `quota_project_id: "project-b306319a-ed99-49db-8db"` → bị xóa → mọi lệnh gọi TTS đều trả `PERMISSION_DENIED`.
- **Cần để tiếp tục:** Một trong hai — (A) `gcloud auth application-default login` lại với project còn tồn tại + TTS API đã bật, **hoặc** (B) service account JSON hợp lệ đặt tại `./secrets/google-tts-service-account.json` + `GOOGLE_APPLICATION_CREDENTIALS=./secrets/google-tts-service-account.json` trong `backend/.env`.

---

## Tổng số audio cần generate

| Loại | Số lượng |
|------|----------|
| Tổng thiếu (theo breakdown) | **19,743** |
| Tổng thiếu (theo manifest) | 19,749 |
| Chênh lệch | 6 (do audit-type entries) |

---

## Breakdown theo grade

| Grade | Lesson Cards thiếu | Questions thiếu | Tổng |
|-------|--------------------|-----------------|------|
| 0 | 0 | 132 | 132 |
| 1 | 140 | 3,278 | 3,418 |
| 2 | 140 | 3,259 | 3,399 |
| 3 | 140 | 3,786 | 3,926 |
| 4 | 140 | 4,323 | 4,463 |
| 5 | 140 | 4,265 | 4,405 |
| **Tổng** | **700** | **19,043** | **19,743** |

> Grade 0 không thiếu lesson-card — chỉ thiếu question audio (practice-on-demand).

---

## Breakdown theo voice profile

| Profile ID | Voice | Thiếu |
|------------|-------|-------|
| `vi-v1` | vi-VN-Chirp3-HD-Despina (default) | 16,321 |
| `en-v1` | en-US-Neural2-F | 3,425 |
| `vi-v2` | vi-VN-Chirp3-HD-Algenib | 3 |

> Profile `en-v1` và `vi-v2` **không có thư mục trên disk** (`public/audio/tts/assets/`). Chỉ `vi-v1/` tồn tại.

---

## Bước phục hồi

### Bước 1 — Sửa credential

**Option A (cách nhanh, ADC user login):**
```bash
gcloud auth application-default login
gcloud auth application-default set-quota-project <PROJECT_ID_HỢP_LỆ>
```

**Option B (service account — khuyến nghị cho CI/production):**
```bash
# Đặt file JSON vào:
./secrets/google-tts-service-account.json

# Thêm vào backend/.env:
GOOGLE_APPLICATION_CREDENTIALS=./secrets/google-tts-service-account.json
```

Yêu cầu project có **Cloud Text-to-Speech API** đã bật.

### Bước 2 — Verify credential trước khi generate

```bash
cd backend
npx ts-node src/scripts/check-tts-credentials.ts
# hoặc:
gcloud auth application-default print-access-token
```

### Bước 3 — Generate audio thiếu

```bash
cd backend
npm run generate-tts
# hoặc nếu có flag grade:
npm run generate-tts -- --grade=all
```

Output sẽ ghi vào: `public/audio/tts/assets/{profileId}/`

### Bước 4 — Regenerate manifest

```bash
cd f:\1_A_Disk_D\Tool\Hoc_Tap\CAp_01
npx ts-node scripts/generate-static-tts-catalog.ts
```

Manifest mới sẽ cập nhật `availableEntries` và `missingEntries`.

---

## Reports cần rerun sau khi generate

| Report | File | Pass criteria |
|--------|------|---------------|
| Catalog integrity | `tts-catalog-integrity-report.json` | `pass: true`, `missingCount: 0` |
| Web sequential | `web-tts-sequential-report.json` | Yêu cầu rerun browser test sau khi build mới |
| Missing breakdown | `tts-missing-audio-breakdown.json` | Tất cả grade có `lessonCards: 0`, `questions: 0` |

---

## Vấn đề phụ: Web runtime grade-pack gate

**Phát hiện qua audit (`tts-web-runtime-missing-assets.json`):**  
Ngay cả khi tất cả 19,743 file đã được generate, web test vẫn sẽ fail vì `hasStrictDesktopGrade=true` trong `ttsRuntime.ts:~740` chặn playback trước khi đọc file. Lỗi "Chưa có file giọng đọc offline cho lớp N" xuất phát từ grade-download state check, không phải do file thiếu.

**Cần xử lý riêng:**
- Kiểm tra điều kiện `hasStrictDesktopGrade` trong web context
- Web users không nên bị chặn bởi Electron desktop download state
- File: `src/shared/services/tts/ttsRuntime.ts` ~line 740-760

---

## Pass criteria tổng thể

```
tts-catalog-integrity-report.json   → pass: true
tts-missing-audio-breakdown.json    → tất cả grade totalMissing: 0
public/audio/tts/assets/vi-v1/      → 19,749 entries đủ
public/audio/tts/assets/en-v1/      → 3,425 entries đủ (thư mục phải được tạo)
public/audio/tts/assets/vi-v2/      → 3 entries đủ (thư mục phải được tạo)
web-tts-sequential-report.json      → pass: true (sau khi sửa cả grade-gate)
```
