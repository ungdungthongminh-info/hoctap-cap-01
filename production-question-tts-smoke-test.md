# Production Question TTS Smoke Test

- Date: 2026-05-05
- URL: https://hoctap-cap-01.vercel.app
- Scope: question/practice playback via R2 objectKey pattern `audio/tts/assets/<lang>/question/<questionId>.mp3`

## Result

- Status: PASS (pipeline complete, manual audible check pending)
- Pipeline blocker is resolved. Full generation, validation, upload, and public R2 checks have completed for both `vi-v1` and `en-v1` question assets.

## Verification Signals

- Catalog exported with expected totals: 19043 (vi-v1: 16318, en-v1: 2725).
- Full generation completed:
   - vi-v1 generated locally and validated: 16318/16318 pass
   - en-v1 generated locally and validated: 2725/2725 pass
- Full upload completed:
   - vi-v1 upload report: totalItems=16318, uploaded=16298, skipped=20, missingLocal=0, pass=true
   - en-v1 upload report: totalItems=2725, uploaded=2664, skipped=61, missingLocal=0, pass=true
- Public R2 checks passed:
   - vi-v1 sample-size=50: pass=true
   - en-v1 sample-size=50: pass=true
- Runtime mapping code is active for question keys via R2 object path pattern.

## Failure Classification

- generate: PASS
- local: PASS
- upload: PASS
- map: PASS (code mapping implemented)
- CORS: PASS
- runtime: PASS (R2 mapping and static path resolution)
- production: PENDING (manual in-browser audible playback not re-run in this step)

## Next Action

1. Revoke/regenerate exposed Google TTS API key immediately in Google Cloud Console.
2. Run one manual production audible smoke test on live site for both one `vi-v1` and one `en-v1` question.
3. Commit code-only changes (scripts/runtime/docs), excluding MP3/ZIP/.env/report artifacts.
