# TTS Scope Status

| Scope | Expected | Generated Local | Uploaded R2 | Public 200 | Runtime Mapped | Production Audible |
|---|---:|---:|---:|---:|---:|---:|
| vi-v1 lesson-card | 4288 | 4288 | 4288 | pass | pass | pass |
| vi-v1 question | 16318 | 0 | 0 | fail | pass | fail |
| en-v1 question | 2725 | 0 | 0 | fail | pass | fail |

## Notes (2026-05-05)

- Question catalog is confirmed at 19043 total (vi-v1: 16318, en-v1: 2725).
- Generate sample and full run are blocked by missing local Google credentials.
- Runtime question mapping to R2 path has been implemented for production web:
  - `audio/tts/assets/vi-v1/question/<questionId>.mp3`
  - `audio/tts/assets/en-v1/question/<questionId>.mp3`
- No MP3/ZIP/.env files were added to git index.
