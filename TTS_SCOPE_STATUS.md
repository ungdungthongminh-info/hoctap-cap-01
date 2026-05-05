# TTS Scope Status

| Scope | Expected | Generated Local | Uploaded R2 | Public 200 | Runtime Mapped | Production Audible |
|---|---:|---:|---:|---:|---:|---:|
| vi-v1 lesson-card | 4288 | 4288 | 4288 | pass | pass | pass |
| vi-v1 question | 16318 | 16318 | 16318 | pass | pass | **PASS network** (human pending) |
| en-v1 question | 2725 | 2725 | 2725 | pass | pass | blocked (English locked Free tier) |

## Notes (2026-05-05 — latest)

- Question catalog confirmed: 19043 total (vi-v1: 16318, en-v1: 2725).
- Full generation + R2 upload: vi-v1 16318/16318 ok, en-v1 2725/2725 ok.
- R2 public asset checks passed (sample 50 each scope).
- **Production network test PASSED (2026-05-05 after deploy b3d3bb8):**
  - All 6 grades (#/lessons/9001|1|21|41|61|81/practice): R2 request confirmed.
  - Grade 0 auto-read fires `question/199002.mp3` → R2 responds (MediaError in Playwright = expected, no audio device).
  - Grade 1–5 click "Nghe câu hỏi" → R2 request `vi-v1/question/<id>.mp3` confirmed for each.
  - No `drive.usercontent.google.com` requests.
- **UX improvements deployed (b3d3bb8 + subsequent):**
  - Button "Nghe câu hỏi": pill 46px, border-radius 999px, font-weight 600.
  - Toggle "Tự đọc khi sang câu mới" visible cho tất cả grade.
  - Default: grade 0 = ON, grade 1–5 = OFF.
  - Default re-evaluates on lesson.id change (hash-routing safe).
- **Human audible:** chưa xác nhận bằng automation. Cần xác nhận thủ công.
