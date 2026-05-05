# Production Question TTS Smoke Test

- Date: 2026-05-05 (re-test after deploy commit b3d3bb8 + fix commit)
- URL: https://hoctap-cap-01.vercel.app
- Deploy branch: clean-main

## Overall Verdict

- **Network layer: PASS** — tất cả 6 grade tạo request HTTP đến R2 question MP3 sau khi click "Nghe câu hỏi".
- **UX layer: PASS (automation)** — button pill 46px hiển thị, toggle auto-read hiển thị cho mọi grade, default state đúng (grade 0 = ON, grade 1–5 = OFF).
- **Audible (human):** chưa xác nhận bằng automation (MediaError trong Playwright = expected — headless không có audio device). Cần xác nhận thủ công bằng loa/tai nghe.
- **drive.usercontent.google.com:** không xuất hiện trong bất kỳ request nào.

## Required Smoke Table

| grade | lesson URL | questionId hit | R2 URL | Status |
|---:|---|---:|---|---:|
| 0 | #/lessons/9001/practice | 199002 | vi-v1/question/199002.mp3 | ✅ auto-read (grade-0 default ON) |
| 1 | #/lessons/1/practice | 6 | vi-v1/question/6.mp3 | ✅ on click |
| 2 | #/lessons/21/practice | 15203 | vi-v1/question/15203.mp3 | ✅ on click |
| 3 | #/lessons/41/practice | 15402 | vi-v1/question/15402.mp3 | ✅ on click |
| 4 | #/lessons/61/practice | 15604 | vi-v1/question/15604.mp3 | ✅ on click |
| 5 | #/lessons/81/practice | 2803 | vi-v1/question/2803.mp3 | ✅ on click |

## UX Checklist (automation verified)

| Item | Result |
|---|---|
| Nút "Nghe câu hỏi" pill 46px hiển thị | ✅ all grades |
| border-radius 999px | ✅ all grades |
| Toggle "Tự đọc khi sang câu mới" hiển thị | ✅ all grades (kể cả grade 0) |
| Grade 0 default ON | ✅ |
| Grade 1–5 default OFF | ✅ |
| Default đúng khi navigate liên tiếp (hash routing) | ✅ (re-eval on lesson.id change) |
| R2 request sau click (lớp 1–5) | ✅ |
| Auto-read grade 0 gửi request R2 | ✅ (console MediaError = request reached R2) |
| drive.usercontent.google.com | ✅ không xuất hiện |

## UX Checklist (cần xác nhận thủ công)

| Item | Result |
|---|---|
| Nghe được thật bằng loa/tai nghe | ⚠️ chưa xác nhận |
| Không chồng tiếng khi chuyển câu nhanh | ⚠️ chưa xác nhận |
| Toggle bật/tắt auto-read hoạt động đúng | ⚠️ chưa xác nhận |

## Technical Summary

- `playQuestionAudioDirect(questionId, lang)` → `new Audio(R2_URL).play()` — không có HEAD fetch, không qua ttsRuntime.
- Auto-read effect phụ thuộc vào `[currentQuestion?.id]` + guard `autoReadEnabled`.
- Default `autoReadEnabled` re-eval trên `[lesson?.id]` để hoạt động với hash-based routing (component không unmount khi navigate).
- localStorage key `hhk_practice_auto_read_question`: `'1'` = bật, `'0'` = tắt, `null` = chưa set (dùng grade-default).

