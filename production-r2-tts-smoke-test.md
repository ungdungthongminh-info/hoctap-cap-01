# Production R2 TTS Smoke Test

## Status
- Overall: FAIL
- Reason: R2 upload/test is complete and passing, but production deploy is still blocked so the live web domain has not picked up the R2-first runtime.

## What Ran
- Drive pack preparation: PASS 6/6 valid ZIP files.
- Drive pack upload to R2: PASS 6/6 uploaded.
- Drive pack public verification: PASS 6/6 return `200`, `application/zip`, `PK`, non-HTML.
- Lesson-card MVP upload to R2: PASS `4288/4288` uploaded.
- Lesson-card public verification: PASS 6/6 samples return `200`, `audio/mpeg`, non-HTML.
- Frontend build: PASS.
- Backend build: PASS.
- Vercel production deploy: FAIL.

## Deployment Evidence
- `vercel deploy --prod --yes`: FAIL with `socket hang up`.
- `vercel build --prod`: PASS and generated `.vercel/output`.
- `vercel deploy --prebuilt --prod --yes`: FAIL with `api-upload-free` (`more than 5000`).
- `vercel deploy --prebuilt --archive=tgz --prod --yes`: FAIL with the same `api-upload-free` limit.

## Live Domain Evidence
- URL checked: `https://hoctap-cap-01.vercel.app/#/lessons/1`
- Browser console still shows a request to `drive.usercontent.google.com` blocked by CORS.
- This confirms the current live production deployment is still the old Drive-based runtime, not the new R2-priority runtime.

## Key Files
- `r2-drive-pack-upload-report.json`: `pass=true`.
- `r2-lesson-card-mvp-upload-report.json`: `pass=true`, `total=4288`, `uploaded=4288`.
- `r2-lesson-card-mvp-asset-check.json`: `pass=true`.
- `production-r2-tts-asset-check.json`: updated to reflect R2 PASS plus production deploy blocker.

## Next Required Actions
1. Free/reset the Vercel upload quota or deploy from a plan/account that can accept this upload.
2. Re-run `vercel deploy --prebuilt --archive=tgz --prod --yes` after the quota window resets.
3. Re-test `https://hoctap-cap-01.vercel.app/#/lessons/1` and confirm requests switch from Google Drive to R2 URLs.
4. Perform audible verification with browser sound evidence after the live deployment updates.
