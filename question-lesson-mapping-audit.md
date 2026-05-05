# Question–Lesson–Grade Mapping Audit

> **Thời điểm audit:** 2026-05-05T11:30:00.841Z  
> **Script:** `scripts/audit-question-uniqueness.ts`  
> **Nguồn dữ liệu:** `src/data/seedData.ts` (merge toàn bộ sprint 1→19)  
> **Branch:** `clean-main`

---

## Kết luận chính thức

| Tiêu chí | Giá trị | Đánh giá |
|---|---|---|
| Tổng câu hỏi | 19,043 | ✅ |
| ID unique toàn bộ | 19,043 / 19,043 | ✅ GLOBALLY_UNIQUE |
| Duplicate ID | 0 | ✅ PASS |
| ID bị dùng ở nhiều lesson | 0 | ✅ PASS |
| ID bị dùng ở nhiều grade | 0 | ✅ PASS |

**Verdict: `GLOBALLY_UNIQUE`**

Theo điều kiện ngoại lệ đã thỏa thuận: *"Trừ khi có report chứng minh questionId là unique toàn bộ 19,043 câu"* — điều kiện này đã được chứng minh đầy đủ.

---

## Quyết định kiến trúc key schema

| Phương án | Tên | Trạng thái |
|---|---|---|
| `question:{questionId}` → `audio/tts/assets/{profileId}/question/{questionId}.mp3` | **Flat key (hiện tại)** | ✅ **GIỮ NGUYÊN** |
| `audio/tts/assets/{profileId}/{lang}/{grade}/{lessonId}/{questionId}.mp3` | Hierarchy key | ❌ Không cần thiết |

### Lý do giữ flat key

1. **Uniqueness đã được prove:** mỗi `questionId` xuất hiện đúng 1 lần, không bao giờ conflict giữa lesson/grade.
2. **Breaking change nếu remap:** phải regenerate/rename/re-upload 19,043 file audio, đổi toàn bộ runtime key resolution, invalidate CDN cache — chi phí cao, lợi ích bằng không.
3. **Runtime đã đúng:** chuỗi `buildQuestionAssetKey → manifest lookup → withResolvedAudioUrl → R2 URL` đang hoạt động production.

---

## Phân bổ câu hỏi theo lớp

| Lớp | Nhãn | Số câu |
|---|---|---|
| 0 | Tiền lớp 1 (Pre-Grade) | 132 |
| 1 | Lớp 1 | 3,278 |
| 2 | Lớp 2 | 3,259 |
| 3 | Lớp 3 | 3,786 |
| 4 | Lớp 4 | 4,323 |
| 5 | Lớp 5 | 4,265 |
| **Tổng** | | **19,043** |

## Phân bổ câu hỏi theo môn

| Môn | Số câu |
|---|---|
| math | 2,769 |
| vietnamese | 2,651 |
| nature | 1,635 |
| ethics | 2,698 |
| english | 2,725 |
| science | 1,090 |
| history_geo | 1,088 |
| informatics | 1,633 |
| art | 2,754 |

---

## Chuỗi runtime key resolution

```
PracticePage.tsx
  → speakQuestion()
  → speakText(text, lang, { assetKey: buildQuestionAssetKey(question.id) })

ttsAssetKeys.ts
  → buildQuestionAssetKey(questionId)
  → returns "question:{questionId}"

staticTtsManifest.ts
  → getStaticTtsManifestEntry("question:{questionId}")
  → withResolvedAudioUrl(entry)
  → resolvedPath = "audio/tts/assets/{profileId}/question/{questionId}.mp3"
  → audioUrl = "{R2_PUBLIC_BASE_URL}/{resolvedPath})"  [isWebProduction && isQuestionR2Eligible]

ttsRuntime.ts
  → speakText() plays resolvedAudioUrl via HTMLAudioElement
```

**Nhận xét:** Toàn bộ chuỗi chỉ cần `questionId` dạng số nguyên. Không cần `lessonId` hay `grade` trong object key vì `questionId` là globally unique.

---

## Pipeline key schema

| Bước | Script | Object key |
|---|---|---|
| Catalog export | `export-question-tts-catalog.mjs` | `audio/tts/assets/{profileId}/question/{questionId}.mp3` |
| TTS generation | `generate-question-tts-google.mjs` | local: `{scratchDir}/audio/question/{profileId}/question/{questionId}.mp3` |
| R2 upload | `upload-question-tts-to-r2.mjs` | R2 key = catalog's `r2Key` = objectKey above |
| CDN verify | `test-r2-question-assets.mjs` | `{R2_PUBLIC_BASE_URL}/audio/tts/assets/{profileId}/question/{questionId}.mp3` |

---

## Bằng chứng xác minh

| File | Mô tả | Kết quả |
|---|---|---|
| `question-id-uniqueness-audit.json` | Machine audit — kiểm tra duplicate và cross-lesson toàn bộ 19,043 câu | ✅ 0 duplicate, 0 cross-lesson |
| `r2-question-tts-asset-check.json` | Sanity check R2 CDN — sample 40 URL | ✅ 40/40 pass (200, audio/mpeg) |
| `question-tts-validate-report.json (vi-v1)` | Validate local MP3 files — vi-v1 | ✅ 16,318/16,318 pass |
| `question-tts-validate-report.json (en-v1)` | Validate local MP3 files — en-v1 | ✅ 2,725/2,725 pass |

---

## Phân tích orphan

- Số câu hỏi orphan (không có lessonId hợp lệ): **0**
- Lý do: `getLessonQuestions()` trong `AppDataProvider.tsx` lọc `q.lessonId === lessonId && q.isActive`, đảm bảo không câu hỏi nào được phục vụ nếu không xác định được lesson.

---

## Quyết định cuối

| | Hành động |
|---|---|
| **Remap objectKey sang hierarchy** | ❌ KHÔNG CẦN — questionId đã unique toàn cục |
| **Giữ nguyên TTS pipeline** | ✅ Không regenerate, không re-upload |
| **Giữ nguyên runtime key schema** | ✅ `question:{questionId}` là correct và safe |
| **Có thể commit** | ✅ Sau khi user xác nhận không còn thay đổi pendng |

---

*Tài liệu này là bằng chứng chính thức đáp ứng yêu cầu audit từ sprint planning.*
