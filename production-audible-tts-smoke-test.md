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
  - R2 migration backend/storage da hoan tat: 6/6 ZIP pack tren R2 PASS, 4,288 lesson-card MP3 upload PASS, sample public asset check PASS.
  - Production deploy tu may nay van that bai, nen domain live chua nhan runtime uu tien R2.
  - Lan kiem tra moi nhat, browser console tren domain live van goi `drive.usercontent.google.com` va bi CORS block.
  - `vercel deploy --prod --yes` that bai voi `socket hang up`.
  - `vercel build --prod` thanh cong, nhung `vercel deploy --prebuilt --prod --yes` va `--archive=tgz` deu bi chan boi quota `api-upload-free` (`more than 5000`).
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
- kích thước lớn hơn ngưỡng an toàn (>= 12KB)
- response không chứa HTML/DOCTYPE
- Audio.play() không reject
- và có bằng chứng nghe thật hoặc Volume Mixer signal

## Current Verdict
- Web domain audio file access: FAIL
- Content-Type audio/mpeg: FAIL on live production domain, PASS on direct R2 public URLs
- Audio heard: NO
- Volume mixer signal: NO
- Production audible: FAIL

## Blockers Before Audible Retest
- Deploy lai production thanh cong de domain that dung ban code R2-priority moi.
- Reset/doi quota upload Vercel de cho phep prebuilt deploy.
- Test lai quy trinh: vao lop 1 -> tai pack -> doc -> reload -> doc lai khong tai lai -> ghi nhan bang chung audible that.

## R2 Migration Blockers
- Khong con blocker credential. `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` da duoc nap va dung de upload/test thanh cong.
- `R2_PUBLIC_BASE_URL` da duoc cau hinh la `https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev`.
- Runtime da duoc cap nhat de uu tien R2 URL o web production va chan HTML fallback, nhung production live chua duoc deploy thanh cong.
