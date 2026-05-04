# Production TTS CDN Deployment Plan

## Goal
Deploy web MVP audio assets for vi-v1 lesson-card (grades 0-5) without committing thousands of MP3 files into Git.

## Current State
- Local required assets: 4288 files
- Total size: 134.75 MB
- Production now returns HTML fallback for MP3 paths because files are not deployed.

## Deployment Steps

1. Prepare CDN bucket/storage
- Create bucket/folder: tts-assets/vi-v1/
- Enable public read only for object paths
- Keep write access private via deployment credentials
- Enable HTTPS and custom domain, example: cdn.hoctap-cap-01.vn

2. Upload web MVP assets only
- Upload only files in production-web-audio-required-files.json
- Scope: profile=vi-v1, contentType=lesson-card, grades=0..5
- Do not upload question/luyen tap or en-v1 in this phase

3. Publish manifest assetUrl to CDN
- For each lesson-card key in scope, map asset path to CDN URL
- Example: https://cdn.hoctap-cap-01.vn/tts-assets/vi-v1/lesson-card-1.mp3
- Keep asset key unchanged to avoid runtime key mismatch

4. Runtime fallback rule
- If CDN path missing: return 404/410, not HTML app shell
- Web app fallback behavior:
  - If CDN returns non-audio: mark as invalid asset
  - Auto fallback to on-demand TTS only if policy allows

5. Response header policy
- Content-Type must be audio/mpeg
- Cache-Control recommendation:
  - immutable static assets: public, max-age=31536000, immutable
  - manifest: public, max-age=60
- Enable ETag or strong hash naming

6. Validation checklist after deploy
- MP3 URL returns HTTP 200
- Content-Type starts with audio/
- Content-Length is significantly larger than HTML fallback baseline
- Response body does not contain <!DOCTYPE html>
- Browser Audio.play() resolves
- Human audible check or Volume Mixer signal confirmed

7. Migration phase for question/luyen tap
- Phase 2 uploads: question assets by grade
- Keep separate manifest partitions per usage type
- Add rollout flag to switch question assets gradually

## Suggested Implementation Path

1. Create upload script from report file
- Input: production-web-audio-required-files.json
- Output: upload list and failed list

2. Create CDN-aware manifest build step
- Build alternate manifest for production web
- Preserve local path for desktop/offline mode

3. Add CI validation
- Block deploy if CDN manifest contains non-audio URLs
- Sample-check N assets per grade on every release

## Risk Controls
- Do not remove current local files
- Do not mass-force-add MP3 into Git
- Keep rollback: old manifest + old app build
- Enable staged rollout on one grade first (grade 1), then expand
