# Production Audible TTS Smoke Test Report

**Date**: 2026-05-04  
**Test Duration**: Full cycle investigation  
**Status**: 🔴 **FAIL** - Root cause identified

---

## Web Domain (production.hoctap-cap-01.vercel.app)

### Test Environment
- **URL**: https://hoctap-cap-01.vercel.app/#/lessons/1
- **Browser**: Playwright (Chromium headless)
- **Grade**: 1 (Lớp 1)
- **Lesson**: "Các số 1, 2, 3, 4, 5" (Lesson card 1-4)
- **Test method**: Browser automation + Network inspection

### Test Steps
1. Navigate to production domain lesson page
2. Click "Đọc cả bài" button
3. Monitor network requests for audio assets
4. Verify audio file download and playability
5. Inspect response content-type and headers

### Network Events Captured

#### Step 1: Asset Availability Check (HEAD requests)
```
HEAD /audio/tts/assets/vi-v1/lesson-card-1.mp3 → ERR_ABORTED
HEAD /audio/tts/assets/vi-v1/lesson-card-2.mp3 → ERR_ABORTED
HEAD /audio/tts/assets/vi-v1/lesson-card-3.mp3 → ERR_ABORTED
HEAD /audio/tts/assets/vi-v1/lesson-card-4.mp3 → ERR_ABORTED
```

#### Step 2: Asset Content Verification (GET request)
```
GET /audio/tts/assets/vi-v1/lesson-card-1.mp3 → 200 OK
  Content-Type: text/html; charset=utf-8 ❌ (WRONG - should be audio/mpeg)
  Content-Length: 6,518 bytes ❌ (way too small for MP3)
  Cache-Control: public, max-age=0, must-revalidate
  ETag: W/"81fa92b668f2407e79844caa7f5efbc5"
  
  Response body: <!DOCTYPE html><html lang="vi">...</html>
               (app shell HTML, NOT MP3 data)
```

### Technical Findings

| Check | Result | Evidence |
|-------|--------|----------|
| Manifest accessible | ✅ PASS | HTTP 200, 4,302 entries, lesson-card:1 present |
| Audio path resolvable | ⚠️ HTTP 200 | Returns 200 but wrong content |
| Audio MIME type | ❌ FAIL | `text/html` instead of `audio/mpeg` |
| Audio content size | ❌ FAIL | 6,518 bytes (HTML) not audio (expected >50KB) |
| Audio playback | ❌ BLOCKED | Cannot play HTML as audio |
| Audible output | ❌ NO | No audio heard (HTML served instead) |

### Root Cause Analysis

**Problem**: Production audio assets are **missing or incorrectly deployed**

**Evidence**:
1. Asset URL returns HTTP 200 (not 404)
2. Response content is **app HTML** (Vercel fallback behavior)
3. Content-Type is `text/html` (not `audio/mpeg`)
4. File size is 6,518 bytes (HTML page, not MP3 audio)

**Why**: 

### Audio Test Result

| Criterion | Status |
|-----------|--------|
| Audio heard by tester | ❌ NO |
| Playback successful | ❌ NO |
| Volume mixer signal | ❌ NO |
| Audible output | ❌ NO |

**Reason**: Server returning HTML instead of MP3 file

---

## Desktop App

**Status**: ⏳ **PENDING**

- Not tested (requires v0.1.2 installation)
- Can test if app is currently installed

---

## Recommendations

### Immediate Actions

1. **Verify audio files exist in repo**:
   ```bash
   ls -la public/audio/tts/assets/vi-v1/ 2>/dev/null || echo "Directory missing"
   ```

2. **Check if audio included in build**:
   ```bash
   npm run build
   ls -la dist/audio/tts/assets/vi-v1/ 2>/dev/null || echo "Not in dist"
   ```

3. **Verify Vercel deployment**:
   - Check Vercel build logs: Are audio files included in final upload?
   - Inspect production file list on Vercel dashboard
   git ls-files | grep "audio/tts/assets" | head -5
   ```
   If empty → audio files not in git → won't deploy

5. **Redeploy to production**:
   - Add audio files to repo if missing
   - Rebuild and push
   - Trigger Vercel redeploy
   - Reverify audio file content-type

### Verification Command

After fix, run:
```bash
curl -I https://hoctap-cap-01.vercel.app/audio/tts/assets/vi-v1/lesson-card-1.mp3
# Should show: Content-Type: audio/mpeg (not text/html)
# Should show: HTTP/2 200
```

---

## Conclusion

| Test | Result |
|------|--------|
| **Web Audio Playback** | 🔴 **FAIL** - Audio assets missing on production |
| **Root Cause** | Missing/wrong audio deployment |
| **Impact** | Users cannot hear TTS on production domain |
| **Fix Required** | Verify audio files in repo + redeploy |

**Status**: Production TTS not audible due to deployment issue. Not user preference issue, not code issue - infrastructure issue.

---

**Test Date**: 2026-05-04 11:19 UTC  
**Tester**: Automated browser inspection  
**Evidence Method**: Network request capture + response analysis  
**Next Step**: Check git repo and Vercel build logs for audio asset deployment
