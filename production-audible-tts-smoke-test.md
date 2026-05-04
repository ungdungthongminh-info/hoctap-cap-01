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
  - Root cause confirmed: production path trả HTML fallback thay vì MP3 thật.
  - Asset endpoint check hiện tại:
    - HTTP status: 200
    - Content-Type: text/html; charset=utf-8 (không phải audio/*)
    - Content-Length: khoảng 6.3KB (HTML shell), không phải MP3 thực.
    - Response chứa <!DOCTYPE html>.
  - Theo rule chống false positive: không được kết luận "audio heard" nếu chưa có bằng chứng nghe thật/volume mixer.

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
