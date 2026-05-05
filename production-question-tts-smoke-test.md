# Production Question TTS Smoke Test

- Date: 2026-05-05
- URL: https://hoctap-cap-01.vercel.app
- Scope: question/practice playback via R2 objectKey pattern `audio/tts/assets/<lang>/question/<questionId>.mp3`

## Result

- Status: PARTIAL PASS
- Data pipeline (generate/validate/upload/R2 public) is PASS for both `vi-v1` and `en-v1` question assets.
- Production UI click test on `Nghe cau hoi` did not emit observable question-audio network requests in this run, so browser runtime path is not yet fully verified by click-trace.

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
- Production practice click test (lesson 1, mode practice_5):
   - Action: click `Nghe cau hoi`
   - Observed: no captured request to `audio/tts/assets/*/question/*.mp3` in network instrumentation in this session.

## Sample URLs Tested (Real Production Probe)

- vi-v1 sample URL tested:
   - `https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev/audio/tts/assets/vi-v1/question/1.mp3`
   - HEAD: status `200`, content-type `audio/mpeg`
   - GET range probe: status `206`, content-type `audio/mpeg`, HTML sniff `false`
- en-v1 sample URL tested:
   - `https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev/audio/tts/assets/en-v1/question/1901.mp3`
   - HEAD: status `200`, content-type `audio/mpeg`
   - GET range probe: status `206`, content-type `audio/mpeg`, HTML sniff `false`

## Failure Classification

- generate: PASS
- local: PASS
- upload: PASS
- map: PASS (code mapping implemented)
- CORS: PASS
- runtime: PARTIAL (code path verified, click-trace network for question asset not observed)
- production: PARTIAL (R2 object URLs healthy; UI click path needs one more browser-verified trace)

## Next Action

1. Revoke/regenerate exposed Google TTS API key immediately in Google Cloud Console.
2. Re-run production click-trace with a clean browser profile and capture one concrete request URL from `Nghe cau hoi` button.
3. For `en-v1` in UI, use account/plan path where English subject is accessible (current Free path locks English and redirects to subjects).
4. Commit code-only changes (scripts/runtime/docs), excluding MP3/ZIP/.env/report artifacts.
