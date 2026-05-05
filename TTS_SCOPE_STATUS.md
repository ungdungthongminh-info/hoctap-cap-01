# TTS Scope Status

| Scope | Expected | Generated Local | Uploaded R2 | Public 200 | Runtime Mapped | Production Audible |
|---|---:|---:|---:|---:|---:|---:|
| vi-v1 lesson-card | 4288 | 4288 | 4288 | pass | pass | pass |
| vi-v1 question | 16318 | 16318 | 16318 | pass | pass | fail (strict) |
| en-v1 question | 2725 | 2725 | 2725 | pass | pass | blocked |

## Notes (2026-05-05)

- Question catalog confirmed: 19043 total (vi-v1: 16318, en-v1: 2725).
- Full generation completed:
  - vi-v1 validate: pass=true, ok=16318, failed=0
  - en-v1 validate: pass=true, ok=2725, failed=0
- R2 upload completed:
  - vi-v1 upload report: totalItems=16318, uploaded=16298, skipped=20, missingLocal=0, pass=true
  - en-v1 upload report: totalItems=2725, uploaded=2664, skipped=61, missingLocal=0, pass=true
- R2 public asset checks passed:
  - vi-v1 sample 50: pass=true
  - en-v1 sample 50: pass=true
- Runtime question mapping to R2 path is enabled in production web:
  - audio/tts/assets/vi-v1/question/<questionId>.mp3
  - audio/tts/assets/en-v1/question/<questionId>.mp3
- Production smoke test (strict re-test) update:
  - lop 0/1/2/3/4/5 (`#/lessons/9001|1|21|41|61|81/practice`): da vao duoc practice va click `Nghe cau hoi` thanh cong.
  - Tuy nhien session automation khong bat duoc request mp3/zip, cung khong bat duoc event `HTMLMediaElement.play` hay `speechSynthesis.speak` sau click => chua du bang chung de danh dau audible PASS.
  - en-v1 UI: bi gioi han goi Free (mon Tieng Anh bi khoa), chua co click-path production trong session nay.
- Production CORS source confirmed:
  - `/app-update.json` dang tra `tts.manifestUrl` tro toi `drive.usercontent.google.com`.
  - `/audio/tts/drive-packs.json` dang de `r2PublicUrl` rong cho cac pack.
- Local repo fix prepared (pending deploy):
  - `public/app-update.json` da doi `tts.manifestUrl` sang R2 URL.
  - `public/audio/tts/drive-packs.json` da bo sung `r2PublicUrl` cho packs grade 0-5.
