# English Lesson Audio Production Smoke Test

- GeneratedAt: 2026-05-06T03:53:06.768Z
- Scope: English lesson-card mapping to R2 en-v1; no generate/upload.
- Method: Network probe against production R2 URLs derived from seed lesson/card IDs (grade 1-5).
- Note: audible cannot be auto-verified in CLI; marked manual-pending.
- AudibleVerified: 2026-05-06 — human audible verified by owner on production browser (speaker/headphone).

| grade | lessonId | cardId | expectedUrl | actualNetworkUrl | status | contentType | audible | result |
|---:|---:|---:|---|---|---:|---|---|---|
| 1 | 461 | 2081 | https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev/audio/tts/assets/en-v1/lesson-card-2081.mp3 | https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev/audio/tts/assets/en-v1/lesson-card-2081.mp3 | 206 | audio/mpeg | pass | PASS |
| 2 | 481 | 2161 | https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev/audio/tts/assets/en-v1/lesson-card-2161.mp3 | https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev/audio/tts/assets/en-v1/lesson-card-2161.mp3 | 206 | audio/mpeg | pass | PASS |
| 3 | 401 | 801 | https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev/audio/tts/assets/en-v1/lesson-card-801.mp3 | https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev/audio/tts/assets/en-v1/lesson-card-801.mp3 | 206 | audio/mpeg | pass | PASS |
| 4 | 421 | 1921 | https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev/audio/tts/assets/en-v1/lesson-card-1921.mp3 | https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev/audio/tts/assets/en-v1/lesson-card-1921.mp3 | 206 | audio/mpeg | pass | PASS |
| 5 | 441 | 2001 | https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev/audio/tts/assets/en-v1/lesson-card-2001.mp3 | https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev/audio/tts/assets/en-v1/lesson-card-2001.mp3 | 206 | audio/mpeg | pass | PASS |

## Regression Network Checks

| case | expectedUrl | actualNetworkUrl | status | contentType | result |
|---|---|---|---:|---|---|
| Question English | https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev/audio/tts/assets/en-v1/question/1901.mp3 | https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev/audio/tts/assets/en-v1/question/1901.mp3 | 206 | audio/mpeg | PASS_NETWORK |
| Question Vietnamese | https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev/audio/tts/assets/vi-v1/question/701.mp3 | https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev/audio/tts/assets/vi-v1/question/701.mp3 | 206 | audio/mpeg | PASS_NETWORK |
| Lesson Vietnamese | https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev/audio/tts/assets/vi-v1/lesson-card-501.mp3 | https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev/audio/tts/assets/vi-v1/lesson-card-501.mp3 | 206 | audio/mpeg | PASS_NETWORK |

## Summary

- English lesson-card network pass: YES (5/5)
- No drive.usercontent.google.com observed: YES
- Regression scope checked: Question English, Question Vietnamese, Lesson Vietnamese.
- PracticePage runtime flow: not modified in this phase (code-path regression by scope isolation).
- Audible verification: 5/5 PASS — human audible verified by owner on production browser (speaker/headphone), 2026-05-06.
