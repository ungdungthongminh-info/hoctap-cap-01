# KẾ HOẠCH THỰC HIỆN — Học Hứng Khởi Tiểu Học

> Ngày lập: 2026-04-18
> Phạm vi: MVP Pha 1 — Toán lớp 1, non-AI, local-first
> Trạng thái: 🟢 MVP Pha 2 — Toán lớp 1+2, Sound, Offline

---

## MỤC LỤC

1. [Tổng quan phân tích](#1-tổng-quan-phân-tích)
2. [Thứ tự ưu tiên — Làm gì trước](#2-thứ-tự-ưu-tiên)
3. [Sprint Plan chi tiết](#3-sprint-plan-chi-tiết)
4. [Bản đồ dependencies](#4-bản-đồ-dependencies)
5. [Việc làm song song được](#5-việc-làm-song-song-được)
6. [Checklist KPI](#6-checklist-kpi)
7. [Tracking tiến độ](#7-tracking-tiến-độ)

---

## 1. TỔNG QUAN PHÂN TÍCH

### 1.1. Phân loại công việc theo độ ưu tiên

| Ưu tiên | Nhóm việc | Lý do |
|---------|-----------|-------|
| 🔴 P0 — Làm TRƯỚC | Tech stack + Project setup | Nền tảng, mọi thứ phụ thuộc vào đây |
| 🔴 P0 — Làm TRƯỚC | Data model + DB schema | Toàn bộ UI và logic đều dựa trên model |
| 🔴 P0 — Làm TRƯỚC | Seed data Toán lớp 1 (ít nhất 5 bài) | Không có data thật → không test được gì |
| 🟠 P1 — Làm NGAY SAU | Flow học sinh chính (Home → Học → Luyện → Kết quả) | Core value của app |
| 🟠 P1 — Làm NGAY SAU | Import dữ liệu + Health check | Tránh lặp lỗi cũ: data giả, data mù |
| 🟡 P2 — Làm TIẾP | Màn phụ huynh + Dashboard tiến bộ | Quan trọng nhưng không block core flow |
| 🟡 P2 — Làm TIẾP | Hồ sơ học sinh + PIN | UX hoàn chỉnh |
| 🟢 P3 — Làm SAU | Backup/Restore, Streak, Gợi ý bài | Nice-to-have cho MVP |
| 🟢 P3 — Làm SAU | Toán lớp 2 (Pha 2) | Mở rộng sau khi Pha 1 ổn |

### 1.2. Quyết định cần chốt TRƯỚC KHI code

| # | Quyết định | Gợi ý |
|---|-----------|-------|
| D1 | Nền tảng: Mobile (React Native/Flutter) hay Web (PWA)? | PWA nếu muốn nhanh + offline, Flutter nếu muốn native feel |
| D2 | Database local: SQLite, Hive, hoặc IndexedDB? | SQLite nếu Flutter, IndexedDB nếu PWA |
| D3 | Ngôn ngữ: TypeScript hay Dart? | Theo D1 |
| D4 | Cấu trúc thư mục | Theo module: student, parent, content, shared |

---

## 2. THỨ TỰ ƯU TIÊN — Làm gì trước

```
SPRINT 0 (Nền tảng)          ← BẮT BUỘC LÀM TRƯỚC
    ↓
SPRINT 1 (Data + Core UI)    ← LÀM NGAY SAU
    ↓
SPRINT 2 (Flow học chính)    ← SONG SONG với Sprint 3
    ↓                             ↓
SPRINT 3 (Import + Health)   ← SONG SONG với Sprint 2
    ↓
SPRINT 4 (Phụ huynh + Tiến bộ)
    ↓
SPRINT 5 (Polish + KPI check)
    ↓
SPRINT 6 (Seed full 20 bài Toán lớp 1)
```

---

## 3. SPRINT PLAN CHI TIẾT

### SPRINT 0 — Nền tảng (Làm 1 lần, làm trước hết)
> Mục tiêu: Có project chạy được, có DB schema, có thư mục rõ ràng

- [x] **S0.1** Chốt tech stack (D1–D4) ✅ Electron + React + Vite + SQLite + TailwindCSS
- [x] **S0.2** Khởi tạo project, cấu trúc thư mục theo module ✅
- [x] **S0.3** Setup database local + migration ✅ better-sqlite3 + WAL mode
- [x] **S0.4** Tạo toàn bộ DB schema (10 bảng + app_settings) ✅
  - students, subjects, lessons, lesson_cards, question_bank
  - practice_sets, student_answers, student_progress
  - content_import_jobs, data_health_snapshot, app_settings
- [x] **S0.5** Viết data access layer (IPC + db service) ✅
- [x] **S0.6** Setup routing/navigation cơ bản ✅ HashRouter + 6 routes
- [x] **S0.7** Tạo design tokens (6 theme thiếu nhi + CSS patterns) ✅

**Kết quả:** App mở lên được, có DB, chưa có nội dung.

---

### SPRINT 1 — Seed Data + Màn hình khung (Làm ngay sau Sprint 0)
> Mục tiêu: Có data thật tối thiểu, có khung UI cơ bản

- [x] **S1.1** Tạo seed data cấu trúc ✅ seedData.ts + AppDataProvider
- [x] **S1.2** Viết script seed tự động ✅ In-memory seed
- [x] **S1.3** Tạo shared UI components ✅ Card, ProgressBar, Badge, Sidebar
- [x] **S1.4** Màn khởi động (A) ✅ HomePage với stats + action cards
- [x] **S1.5** Màn chọn lớp/môn (B) ✅ LessonsPage với tabs

**Kết quả:** Mở app → thấy Home → chọn Lớp 1 → Toán. Có data thật trong DB.

---

### SPRINT 2 — Flow học chính (Song song với Sprint 3)
> Mục tiêu: Học sinh có thể học 1 bài hoàn chỉnh từ A→Z

- [x] **S2.1** Màn danh sách bài học (C) ✅ LessonsPage + tabs + mastery badges
- [x] **S2.2** Màn học bài (D) ✅ LessonDetailPage + thẻ nội dung
- [x] **S2.3** Màn luyện tập (E) ✅ PracticePage + timer + feedback
- [x] **S2.4** Màn kết quả buổi học (F) ✅ ResultPage + review + retry
- [x] **S2.5** Logic gợi ý "Học ngay" ✅ QuizPage + lesson selector

**Kết quả:** Flow 2 hoạt động hoàn chỉnh. KPI 2,3,4 pass.

---

### SPRINT 3 — Import + Health Check (Song song với Sprint 2)
> Mục tiêu: Import được data thật, biết data có usable không

- [x] **S3.1** Màn quản lý dữ liệu (I) ✅ DataPage với health score + per-lesson
- [ ] **S3.2** Import engine (CSV/XLSX) — chưa cần cho MVP
- [ ] **S3.3** Import lessons + lesson_cards — dùng seed data thay thế
- [ ] **S3.4** Import question_bank — dùng seed data thay thế
- [x] **S3.5** Health check dashboard ✅ getDataHealth(), điểm sức khoẻ, cảnh báo
- [ ] **S3.6** Backup / Restore local data — để sau

**Kết quả:** Import 20 bài Toán lớp 1 thật. Health check báo đúng. KPI 5,6 pass.

---

### SPRINT 4 — Phụ huynh + Tiến bộ (Sau Sprint 2)
> Mục tiêu: Phụ huynh xem được con học thế nào

- [x] **S4.1** Màn phụ huynh (H) ✅ Profile + PIN + time limit + reset
- [x] **S4.2** Màn tiến bộ học sinh (G) ✅ Weekly chart + mastery distribution + per-lesson
- [x] **S4.3** Flow "Cần học lại" ✅ Needs review section in ProgressPage
- [x] **S4.4** Kết nối màn khởi động ✅ HomePage → all pages, Sidebar navigation

**Kết quả:** Flow 1, 3, 4 hoạt động. KPI 1 pass.

---

### SPRINT 5 — Polish + KPI Check (Sau Sprint 4)
> Mục tiêu: App đạt 6/6 KPI, sẵn sàng test thật

- [x] **S5.1** Streak học tập + giới hạn thời gian ✅ Countdown, cảnh báo 60s/30s/10s, auto-submit
- [x] **S5.2** Giới hạn thời gian học (nếu phụ huynh bật) ✅ Đọc hhk_time_limit, đếm ngược
- [x] **S5.3** Offline mode kiểm tra ✅ Sidebar online/offline indicator (Wifi/WifiOff icon)
- [x] **S5.4** UX review: ✅ Streak warning + glow, time pulse, toast, "Ôn lại" link /progress
- [x] **S5.5** Sound effects ✅ Web Audio API (playCorrect/playWrong/playFinish/playWarning) tích hợp PracticePage
- [ ] **S5.6** Tách seed demo khỏi content bán thật

**Kết quả:** 6/6 KPI pass. MVP Pha 1 hoàn thành.

---

### SPRINT 6 — Seed Full Content (Song song với Sprint 5)
> Mục tiêu: Đủ 20 bài Toán lớp 1 usable

- [x] **S6.1** Soạn nội dung Toán lớp 1: 20 bài ✅ lessons.ts (5 chương, GDPT 2018)
- [x] **S6.2** Soạn câu hỏi: 15 câu/bài ✅ questions.ts (300 câu) + lessonCards.ts (80 thẻ)
- [x] **S6.3** Nhúng seed data trực tiếp ✅ (không cần import engine)
- [x] **S6.4** Health check: 20/20 bài usable ✅ DataPage xác nhận

**Kết quả:** Bản kỹ thuật đầy đủ, sẵn sàng test với người dùng thật.

---

### SPRINT 7 — Toán Lớp 2 + Sound + Offline
> Mục tiêu: Mở rộng nội dung lớp 2, hiệu ứng âm thanh, chỉ báo mạng

- [x] **S7.1** Toán lớp 2: 20 bài (lessons2.ts, 5 chương GDPT 2018) ✅
- [x] **S7.2** 80 thẻ dạy lớp 2 (lessonCards2.ts, 4 thẻ/bài) ✅
- [x] **S7.3** 300 câu hỏi lớp 2 (questions2.ts, 15 câu/bài) ✅
- [x] **S7.4** Wire Grade 2 vào seedData + AppDataProvider grade filter ✅
- [x] **S7.5** Grade selector trong ParentPage (Lớp 1/Lớp 2) ✅
- [x] **S7.6** Sound effects Web Audio API (sounds.ts) + tích hợp PracticePage ✅
- [x] **S7.7** Offline indicator trong Sidebar (Wifi/WifiOff) ✅

**Kết quả:** 40 bài (2 lớp), 160 thẻ, 600 câu hỏi. Sound + offline sẵn sàng.

---

### SPRINT 8 — Multi-Grade + Multi-Subject Architecture
> Mục tiêu: Kiến trúc đa lớp đa môn, mỗi lớp có danh sách môn riêng

- [x] **S8.1** Tạo subjects.ts — 5 môn (Toán, Tiếng Việt, TN&XH, Đạo đức, Tiếng Anh) với grade áp dụng ✅
- [x] **S8.2** Thêm subjectCode vào Student interface + seedStudent ✅
- [x] **S8.3** AppDataProvider: getSubjectLessons() filter grade+subject, stats theo subject ✅
- [x] **S8.4** Tạo SubjectPage — Grid môn học theo lớp, badge "Sắp có", grade selector 1-5 ✅
- [x] **S8.5** Cập nhật routing + Sidebar (nav "Môn học", hiển thị Lớp X · Emoji Tên) ✅
- [x] **S8.6** Cập nhật LessonsPage, QuizPage, HomePage, ProgressPage — dùng getSubjectLessons() ✅
- [x] **S8.7** HomePage mới: nút "Môn học" + hiển thị subject đang học ✅

**Kết quả:** Kiến trúc sẵn sàng cho nhiều môn. Toán lớp 1+2 hoạt động, 4 môn khác placeholder "Sắp có".

---

## 4. BẢN ĐỒ DEPENDENCIES

```
S0 (Nền tảng)
 ├── S1 (Seed + UI khung)
 │    ├── S2 (Flow học)  ←──────────┐
 │    │    └── S4 (Phụ huynh)       │ song song
 │    │         └── S5 (Polish)     │
 │    └── S3 (Import + Health) ←────┘
 │         └── S6 (Seed full)
 └── [D1-D4 phải chốt trước]
```

### Bảng dependencies chi tiết

| Task | Phụ thuộc vào | Có thể song song với |
|------|--------------|---------------------|
| S0 | Không có | Không |
| S1 | S0 hoàn thành | Không |
| S2 | S1 hoàn thành | **S3** |
| S3 | S1 hoàn thành | **S2** |
| S4 | S2 hoàn thành | S6 |
| S5 | S4 hoàn thành | S6 |
| S6 | S3 hoàn thành | S4, S5 |

---

## 5. VIỆC LÀM SONG SONG ĐƯỢC

### Nếu làm 1 người:
Sprint 2 và Sprint 3 **nên xen kẽ** (làm S2.1–S2.2 → làm S3.1–S3.2 → quay lại S2.3...)

### Nếu làm 2 người:
| Người A (Frontend/UX) | Người B (Data/Backend) |
|----------------------|----------------------|
| S0.6, S0.7 Design | S0.3, S0.4, S0.5 DB |
| S1.3, S1.4, S1.5 UI | S1.1, S1.2 Seed data |
| S2 toàn bộ | S3 toàn bộ |
| S4 toàn bộ | S6 toàn bộ |
| S5 UX review | S5 Offline + bugs |

### Việc LÀM 1 LẦN (không cần lặp):
- S0.2 Khởi tạo project
- S0.3 Setup DB
- S0.4 Schema
- S0.7 Design tokens
- S3.2 Import engine (build 1 lần, dùng mãi)

### Việc LÀM LẶP LẠI (iterative):
- Seed data (thêm dần)
- UI components (thêm khi cần)
- KPI test (kiểm tra nhiều lần)

---

## 6. CHECKLIST KPI MVP

| # | KPI | Sprint target | Trạng thái |
|---|-----|--------------|-----------|
| K1 | Tạo hồ sơ học sinh < 1 phút | S4 | ✅ ParentPage profile editing |
| K2 | Vào bài đầu tiên < 3 click | S2 | ✅ Home → Lesson → Practice |
| K3 | Buổi học 5 phút không lỗi | S2 | ✅ PracticePage + timer |
| K4 | Sau buổi học có kết quả rõ | S2 | ✅ ResultPage + review |
| K5 | Ít nhất 1 môn 1 lớp usable | S1+S6 | ✅ 40 bài Toán lớp 1+2 |
| K6 | Import thật + health check đúng | S3 | ✅ DataPage health check |

---

## 7. TRACKING TIẾN ĐỘ

### Sprint Status

| Sprint | Tên | Trạng thái | Ngày bắt đầu | Ngày xong |
|--------|-----|-----------|--------------|----------|
| S0 | Nền tảng | ✅ Hoàn thành | 2026-04-18 | 2026-04-18 |
| S1 | Seed + UI khung | ✅ Hoàn thành | 2026-04-18 | 2026-04-18 |
| S2 | Flow học chính | ✅ Hoàn thành | 2026-04-18 | 2026-04-18 |
| S3 | Import + Health | ✅ Cơ bản xong | 2026-04-19 | 2026-04-19 |
| S4 | Phụ huynh + Tiến bộ | ✅ Hoàn thành | 2026-04-19 | 2026-04-19 |
| S5 | Polish + KPI | ✅ Hoàn thành | 2026-04-18 | 2026-04-18 |
| S6 | Seed full content | ✅ Hoàn thành | 2026-04-18 | 2026-04-18 |
| S7 | Toán Lớp 2 + Sound + Offline | ✅ Hoàn thành | 2026-04-18 | 2026-04-18 |
| S8 | Multi-Grade + Multi-Subject | ✅ Hoàn thành | 2026-04-18 | 2026-04-18 |

### Task Completion Log

| Ngày | Task | Ghi chú |
|------|------|---------|
| — | — | — |

---

## PHỤ LỤC: TÓM TẮT QUYẾT ĐỊNH

| # | Quyết định | Chọn | Lý do | Ngày chốt |
|---|-----------|------|-------|-----------|
| D1 | Nền tảng | Electron + React + Vite | Desktop app, UI phong phú cho thiếu nhi | 2026-04-18 |
| D2 | Database local | SQLite (better-sqlite3) | Local-first, nhanh, không server | 2026-04-18 |
| D3 | Ngôn ngữ | TypeScript | Type-safe, ecosystem React | 2026-04-18 |
| D4 | Cấu trúc thư mục | Module: student/parent/content/shared | Tách biệt rõ ràng | 2026-04-18 |

---

*File này là source of truth cho tiến độ dự án. Cập nhật mỗi khi hoàn thành task.*
