# Production Question TTS Smoke Test

- Date: 2026-05-05
- URL: https://hoctap-cap-01.vercel.app
- Scope: question/practice playback via R2 objectKey pattern `audio/tts/assets/<lang>/question/<questionId>.mp3`

## Result

- Status: FAIL (blocked before production-audible check)
- Primary blocker: missing Google TTS credentials in local environment (`GOOGLE_TTS_API_KEY` or `GOOGLE_APPLICATION_CREDENTIALS`).

## Verification Signals

- Catalog exported with expected totals: 19043 (vi-v1: 16318, en-v1: 2725).
- Runtime mapping code updated to map question keys to R2 object paths.
- Sample generate did not produce files because credentials are missing.
- Sample validate report: 25/25 missing local files.
- Sample upload report: 0 uploaded, 25 missing local.
- Sample R2 asset check: 404 HTML for sample question objects.

## Failure Classification

- generate: FAIL (credentials missing)
- local: FAIL (no sample MP3 generated)
- upload: FAIL (no local files to upload)
- map: PASS (code mapping implemented)
- CORS: PASS for pack ZIP origin test
- runtime: PENDING (needs generated+uploaded question assets)
- production: PENDING (blocked by missing assets)

## Next Action

1. Set local Google TTS credential (API key or service account) without committing to git.
2. Re-run sample commands:
   - `node scripts/generate-question-tts-google.mjs --language=vi-v1 --limit=20 --voice=vi-VN-Chirp3-HD-Despina --skip-existing --concurrency=2 --checkpoint`
   - `node scripts/generate-question-tts-google.mjs --language=en-v1 --limit=5 --skip-existing --concurrency=2 --checkpoint`
   - `node scripts/validate-question-audio.mjs --sample`
   - `node scripts/upload-question-tts-to-r2.mjs --sample --skip-existing`
   - `node scripts/test-r2-question-assets.mjs --sample`
3. Continue full run only after sample passes.
