# Test Bắt Buộc: Desktop Offline TTS Management

## Mục đích test
Kiểm chứng:
1. Tải từng lớp riêng lẻ không ghi đè lẻ khác
2. Tắt mạng vẫn chạy offline đúng lớp
3. Runtime log chứng minh: `provider=static-manifest`, `resolvedSource=desktop-offline`
4. Không gọi Google/backend khi offline

---

## Chuẩn bị

### Build & Deploy
```bash
npm run build
npm run electron:build    # hoặc: npm run electron:dev (dev mode)
```

### Khởi động Desktop App
```bash
# Chạy built app từ release/
START-DESKTOP-TEST.bat

# Hoặc dev mode:
npm run electron:dev
```

---

## Test Case 1: Tải Lớp 1

**Bước:**
1. Mở Desktop app
2. Điều hướng: `Cài đặt > Quản lý offline` (hoặc `/desktop-audio` URL)
3. Tìm card "Lớp 1", bấm nút `Tải Lớp 1`
4. Monitor tiến trình (Dang tai X/Y)
5. Chờ hoàn tất

**Kiểm tra:**
- ✅ Card Lớp 1 trạng thái đổi thành `Day du - san sang dung offline`
- ✅ Thư mục `userData/audio-packs/grade-1/` chứa:
  - `manifest.json` (có `entries`, `summary`)
  - ~700 file MP3
  - `pack-info.json`
- ✅ File `userData/audio-packs/index.json` hiển thị:
  ```json
  {
    "packs": [
      {
        "grade": 1,
        "status": "ready",
        "summary": { "mp3Count": 703, "bytes": ... }
      }
    ]
  }
  ```

---

## Test Case 2: Tải Lớp 2 (không ghi đè Lớp 1)

**Bước:**
1. Card Lớp 2, bấm `Tải Lớp 2`
2. Chờ hoàn tất

**Kiểm tra:**
- ✅ Cả `grade-1/` và `grade-2/` tồn tại 
  - `ls userData/audio-packs/` hiển thị `grade-1`, `grade-2`
- ✅ `index.json` có 2 pack:
  ```json
  {
    "packs": [
      { "grade": 1, "status": "ready" },
      { "grade": 2, "status": "ready" }
    ],
    "totalBytes": 56.0  // ~32 MB lớp 1 + ~24 MB lớp 2
  }
  ```
- ✅ Sidebar "Quản lý offline" hiển thị: "So lop da tai: 2/6"

---

## Test Case 3: Offline Mode - Lớp 1 Audio

**Bước:**
1. Tắt WiFi/mạng
2. Mở bài học **Lớp 1** (e.g., Toán Lớp 1, bài đầu)
3. Bấm nút 🔊 (Đọc) trên một bài tập
4. Nghe audio → ✅ độc lập không cần mạng

**Kiểm tra Runtime Log:**
- Mở DevTools: F12 → Console
- Tìm log: `[TTS_RUNTIME_RESULT]` hoặc `Console log` từ app:
  ```
  provider: "static-manifest"
  resolvedSource: "desktop-offline"
  status: "completed"
  assetKey: "vi-v1-lesson-xx-q-yy"
  assetUrl: "file://../../audio-packs/grade-1/..."
  cacheStatus: "hit"
  ```
- ✅ **Không có** request tới:
  - `googleapis.com` (Google Cloud)
  - `ungdungthongminh.shop` (backend API)
  - Chỉ local file read

---

## Test Case 4: Offline Mode - Lớp 2 Audio

**Bước:**
1. Mạng vẫn tắt
2. Mở bài học **Lớp 2** (khác lớp)
3. Bấm 🔊 trên bài tập
4. Nghe audio → ✅ từ lớp 2 offline, không lấy lớp 1

**Kiểm tra Runtime Log:**
```
provider: "static-manifest"
resolvedSource: "desktop-offline"
assetUrl: "file://../../audio-packs/grade-2/..."  ← grade-2, không phải grade-1
```

---

## Test Case 5: Network Check - Không gọi remote khi offline

**Bước:**
1. DevTools → Network tab
2. Tắt mạng
3. Bấm 🔊 → nghe audio
4. Kiểm tra Network tab

**Kết quả:**
- ✅ Query `file://` URLs → ✅ STATUS 200 (local read)
- ✅ Không có bất kỳ request `https://` nào
- ✅ Không có request error 404/503

---

## Test Case 6: Bật mạng lại - Vẫn dùng offline trước

**Bước:**
1. Bật lại WiFi/mạng
2. Bấm 🔊 lại
3. Audio vẫn từ offline (nên nhanh)

**Logic:**
- `getStaticPackAudioBlob()` ưu tiên `desktop-offline` (file://)
- Fallback web IndexedDB
- Cuối cùng Google/backend

---

## Test Case 7: Xóa Lớp 1 - Lớp 2 vẫn tồn tại

**Bước:**
1. Mở Quản lý offline
2. Card Lớp 1, bấm `Xóa`
3. Xác nhận
4. Chờ

**Kiểm tra:**
- ✅ `grade-1/` xóa hết, `grade-2/` vẫn tồn tại
- ✅ `index.json` chỉ còn lớp 2
- ✅ Card Lớp 2 vẫn `Day du`
- ✅ Lớp 1 audio offline **không chạy** (báo lỗi hoặc fallback)

---

## Expected Runtime Log Format

Khi bấm 🔊 offline:
```
[TTS_RUNTIME_RESULT] {
  "status": "completed",
  "provider": "static-manifest",
  "resolvedSource": "desktop-offline",
  "cacheStatus": "hit",
  "assetKey": "vi-v1-lesson-1-q-1",
  "assetUrl": "file://C:/Users/[user]/AppData/Roaming/HocHungKhoi/audio-packs/grade-2/assets/vi-v1-lesson-1-q-1.mp3"
}
```

### Kiểm tra không có backend/Google:
```bash
# Trong DevTools Console, chạy:
performance.getEntriesByType('resource').filter(r => /googleapis|ungdungthongminh|backend/.test(r.name))
# ↑ Kết quả: [] (mảng rỗng)
```

---

## Pass Condition (Bắt buộc)

- ✅ **Lớp 1 & 2 file tồn tại** sau tải → kiểm tra thư mục
- ✅ **Tắt mạng, bấm 🔊** → audio chạy offline
- ✅ **Runtime log**:
  - `provider: "static-manifest"`
  - `resolvedSource: "desktop-offline"`
  - URL chứa `/by-grade/X.zip` hoặc `/grade-X/`
- ✅ **Network tab**:
  - Không có HTTP request (chỉ file://)
  - Không có Google/backend domain

---

## Fail Case (Không chấp nhận)

- ❌ Lớp 1 hoặc 2 _file không tồn tại_ → báo lỗi
- ❌ Tắt mạng → bấm 🔊 → lỗi/không nghe → không phải offline-ready
- ❌ Runtime log hiển thị `resolvedSource: "online-audio"` hoặc `"web-offline-manifest"` (khi tắt mạng)
- ❌ Network tab có request đến googleapis.com hoặc backend
- ❌ Xóa lớp 1 → lớp 2 cũng mất hoặc không chạy offline

---

## Debug Commands

```bash
# Kiểm tra file tồn tại
dir "%APPDATA%\HocHungKhoi\audio-packs"
dir "%APPDATA%\HocHungKhoi\audio-packs\grade-1"
dir "%APPDATA%\HocHungKhoi\audio-packs\grade-2"

# Xem index.json
type "%APPDATA%\HocHungKhoi\audio-packs\index.json"

# Xem pack-info.json
type "%APPDATA%\HocHungKhoi\audio-packs\grade-1\pack-info.json"
```

---

## Summary

Thực hiện tất cả test case trên.  
Nếu **tất cả PASS → Chấp nhận ✅**  
Nếu **bất kỳ FAIL → Reject ❌** (cần fix logic)
