# Production Audible TTS Smoke Test

## Web domain
- URL: https://hoctap-cap-01.vercel.app/#/lessons/1
- Browser: Chromium (automation) + network inspection
- Grade: 1
- Lesson: Các số 1, 2, 3, 4, 5
- Button clicked: Đọc cả bài
- Audio heard by tester: NO
- Volume mixer signal: NO
- Screen recording path/link: N/A (chưa có clip audible thật)
- Result: FAIL
- Notes:
  - Root cause cu van ton tai tren production hien hanh: duong dan MP3 tra ve HTML fallback thay vi audio payload.
  - Da cap nhat `public/audio/tts/drive-packs.json` voi 6 fileId va URL Drive.
  - Kiem tra direct URL tu Drive:
    - PASS (zip that): grade `0, 2, 3`.
    - FAIL (html): grade `1, 4, 5` (status 200 nhung content-type text/html, dau noi dung `<!DOCTYPE html>`). HTML nay co the la Google Drive confirm/interstitial, khong duoc tinh la PASS.
  - Backend da bo sung luong retry confirm-token + cookie carry cho static-pack proxy, va se fail ro `reason=google-drive-html-confirm-page` neu van nhan HTML.
  - Deploy production chua thanh cong (Vercel CLI loi project settings), nen domain that chua nhan ban build moi co nut tai pack theo lop.
  - Theo rule chong false positive: khong duoc ket luan "audio heard" neu chua co bang chung nghe that/volume mixer/video.

## Desktop app
- App version: 0.1.2 (expected)
- Grade: 1
- Lesson: Bài đầu tiên
- Button clicked: Đọc
- Audio heard by tester: NO (chưa có phiên test audible thủ công)
- Volume mixer signal: NO (chưa ghi nhận)
- Screen recording path/link: N/A
- Result: PENDING
- Notes:
  - Chưa có clip/mp4 ghi âm hệ thống cho desktop app trong vòng test này.

## Pass Criteria (anti false-positive)
Một asset audio chỉ PASS khi đồng thời đạt:
- HTTP status = 200
- content-type bắt đầu bằng audio/
- kích thước lớn hơn ngưỡng an toàn (>= 20KB)
- response không chứa HTML/DOCTYPE
- Audio.play() không reject
- và có bằng chứng nghe thật hoặc Volume Mixer signal

## Current Verdict
- Web domain audio file access: FAIL
- Content-Type audio/mpeg: FAIL
- Audio heard: NO
- Volume mixer signal: NO
- Production audible: FAIL

## Blockers Before Audible Retest
- Deploy backend moi de su dung confirm-token logic khi Drive tra interstitial HTML.
- Deploy lai production thanh cong de domain that dung ban code Drive-pack moi.
- Test lai quy trinh: vao lop 1 -> tai pack -> doc -> reload -> doc lai khong tai lai -> ghi nhan bang chung audible that.
