# Question TTS Runtime Audit

- Date: 2026-05-05
- Branch: clean-main
- Scope: audit current runtime path for question/practice audio and define MVP fix without regenerating audio

## Summary

- Offline audio pack current flow is for lesson audio, not question/practice audio.
- `drive-packs.json` declares lesson-card packs by grade.
- Public static manifest includes `practice-on-demand` in summary, but current `availableEntries` for that usage is `0`, so no runtime-usable question entries are present.
- `PracticePage` does call TTS on `Nghe câu hỏi`, but current runtime path does not resolve any playable question asset from R2/pack, so playback ends in error and no useful network/audio event is expected.

## Direct Answers

1. Nút "Tải audio cho Lớp" hiện tải loại audio nào?
   - Tải offline audio bài học theo lớp.
   - Nguồn bằng chứng:
     - `public/audio/tts/drive-packs.json` có `contentType = lesson-card`.
     - `TtsSettingsPage` và `staticAudioPack` đều chọn pack theo grade.

2. `drive-packs.json` đang khai báo lesson pack hay question pack?
   - Lesson pack.
   - Không phải question/practice pack.

3. `staticAudioPack` có index question audio không?
   - Có hạ tầng lưu blob generic theo `assetKey` trong IndexedDB.
   - Nhưng hiện không có question pack/manifest khả dụng được sync vào đó.
   - `public/audio/tts/manifest.json` báo `practice-on-demand.total = 19043` nhưng `practice-on-demand.available = 0`.

4. `PracticePage` khi bấm "Nghe câu hỏi" đang gọi gì?
   - Có gọi runtime TTS.
   - Cụ thể: `PracticePage -> speakText(...) -> ttsRuntime.speakTextAsync(...)` với `assetKey = question:{questionId}`.
   - Trạng thái trước khi fix:
     - a) static audio asset: co gang tra trong static pack / static manifest
     - b) browser speechSynthesis: khong vao duoc trong path question strict hien tai
     - c) Google Drive: khong goi truc tiep
     - d) R2 direct mp3: chua co direct resolver runtime cho question
     - e) ket qua thuc te: co goi runtime, nhung khong tim thay playable question audio nen khong phat

5. Nếu question audio đã upload R2 thì runtime lấy objectKey từ đâu?
   - Scripts question TTS đã chuẩn hóa object key theo mẫu:
     - `audio/tts/assets/<profileId>/question/<questionId>.mp3`
   - Nguồn bằng chứng:
     - `scripts/export-question-tts-catalog.mjs`
     - `scripts/upload-question-tts-to-r2.mjs`
   - Nhưng runtime trước khi fix chưa có direct resolver độc lập dùng convention này cho question playback.

6. Có manifest/index nào map `questionId -> R2 mp3` không?
   - Có convention path rõ ràng trong scripts/export/upload/validate question audio.
   - Nhưng không có runtime manifest khả dụng chứa question entries để app resolve lúc bấm nghe.
   - `public/audio/tts/manifest.json` hiện không cung cấp question entries usable vì `practice-on-demand.available = 0` và `entries` chỉ chứa asset available.

7. Có IndexedDB/cache nào chứa question audio không?
   - `hhk_tts_static_pack` có thể lưu blob generic theo `assetKey`, nhưng hiện flow sync pack chỉ phục vụ lesson pack.
   - `localAudioCache` có thể lưu audio backend synth theo text/voice descriptor, không phải cache question R2 theo `questionId`.
   - Kết luận: hiện không có dedicated offline cache question audio từ R2 cho PracticePage.

## Current Runtime Path Before Fix

1. `PracticePage` build `assetKey = question:{questionId}`.
2. `ttsRuntime.speakTextAsync` nhận policy `practice-on-demand`.
3. Runtime chuyển question asset vào strict static path.
4. `tryPlayFromStaticManifest` thử:
   - desktop audio pack
   - IndexedDB static pack blob
   - static manifest entry
5. Vì current manifest không có question entry available, runtime không resolve được URL playable.
6. Question path bị reject ở static branch, không phát audio và không có fallback Drive/CORS hợp lệ để cứu playback.

## MVP Fix Direction

- Giữ lesson audio offline pack như hiện tại.
- Question/practice audio resolve trực tiếp từ R2 khi bấm `Nghe câu hỏi`.
- Path dùng theo convention đã audit pass:
  - `https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev/audio/tts/assets/<profileId>/question/<questionId>.mp3`
- Nếu R2 trả audio hợp lệ thì phát bằng `HTMLAudioElement`.
- Nếu fail thì hiển thị lỗi rõ: `Chưa tải được audio luyện tập`.
- Không fallback âm thầm về Drive.

## Files Audited

- `src/shared/services/tts/staticAudioPack.ts`
- `src/shared/services/tts/ttsRuntime.ts`
- `src/shared/services/tts/ttsAssetKeys.ts`
- `src/shared/services/tts/staticTtsManifest.ts`
- `src/modules/student/pages/PracticePage.tsx`
- `public/app-update.json`
- `public/audio/tts/drive-packs.json`
- `public/audio/tts/manifest.json`
- `scripts/export-question-tts-catalog.mjs`
- `scripts/generate-question-tts-google.mjs`
- `scripts/validate-question-audio.mjs`
- `scripts/upload-question-tts-to-r2.mjs`