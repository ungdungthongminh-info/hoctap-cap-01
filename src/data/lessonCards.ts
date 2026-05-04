/**
 * LESSON CARDS — Nội dung giảng dạy cho 20 bài Toán Lớp 1
 * Mỗi bài 4 thẻ: intro → explain (phương pháp Việt Nam) → example → tip
 * Tổng cộng: 80 thẻ
 *
 * Phương pháp xen kẽ:
 *   🖐️ Giơ ngón tay   🪵 Que tính   📏 Tia số   🔢 Tách-gộp
 *   📊 Bảng cộng/trừ   🧮 Bó chục   👀 Trực quan   📐 Đo thực tế
 */

import type { LessonCard } from './seedData';

// Helper tạo card nhanh
function card(
  id: number, lessonId: number,
  cardType: LessonCard['cardType'], title: string, content: string,
  sortOrder: number, exampleJson: string | null = null
): LessonCard {
  return { id, lessonId, cardType, title, content, exampleJson, sortOrder, isActive: 1 };
}

let cid = 0;
const c = (lid: number, type: LessonCard['cardType'], title: string, content: string, order: number, ex: string | null = null) =>
  card(++cid, lid, type, title, content, order, ex);

export const allLessonCards: LessonCard[] = [
  // ═══════════ BÀI 1: Các số 1, 2, 3, 4, 5 ═══════════
  c(1, 'intro', 'Chào mừng đến thế giới số!',
    'Hôm nay con sẽ làm quen với 5 người bạn số đầu tiên: 1, 2, 3, 4, 5. Các bạn ấy ở khắp nơi — trong nhà, ngoài sân, trên bàn học!', 1),
  c(1, 'explain', '🖐️ Đếm bằng ngón tay',
    'Giơ tay lên nào!\n• Giơ 1 ngón: đây là số 1\n• Giơ 2 ngón: đây là số 2\n• Giơ 3 ngón: đây là số 3\n• Giơ 4 ngón: đây là số 4\n• Giơ 5 ngón (cả bàn tay): đây là số 5\n\nMỗi lần đếm, con giơ thêm 1 ngón tay nhé!', 2),
  c(1, 'example', '🪵 Đếm que tính',
    'Con lấy que tính ra:\n• 1 que tính → viết số 1\n• 2 que tính → viết số 2\n• 3 que tính → viết số 3\n• 4 que tính → viết số 4\n• 5 que tính → viết số 5\n\nThử đếm bút chì, cục tẩy, quyển vở trên bàn con xem có bao nhiêu!', 3),
  c(1, 'tip', '⭐ Mẹo nhớ nhanh',
    '• Số 1 như cây gậy thẳng\n• Số 2 như con vịt bơi\n• Số 3 như tai thỏ\n• Số 4 như lá cờ\n• Số 5 như móc câu\n\nViết số ra giấy nhiều lần, vừa viết vừa đọc to nhé!', 4),

  // ═══════════ BÀI 2: Các số 6, 7, 8, 9 ═══════════
  c(2, 'intro', 'Tiếp tục đếm nào!',
    'Con đã biết đếm đến 5 rồi, giỏi lắm! Hôm nay con sẽ gặp thêm 4 người bạn mới: 6, 7, 8, 9. Cần dùng cả hai bàn tay đấy!', 1),
  c(2, 'explain', '🖐️🖐️ Đếm bằng hai bàn tay',
    'Một bàn tay = 5 ngón. Giờ dùng bàn tay còn lại:\n• 5 + 1 ngón = 6 (Sáu)\n• 5 + 2 ngón = 7 (Bảy)\n• 5 + 3 ngón = 8 (Tám)\n• 5 + 4 ngón = 9 (Chín)\n\nBàn tay thứ nhất luôn xòe hết 5 ngón, bàn tay thứ hai thêm dần!', 2),
  c(2, 'example', '📏 Tia số từ 1 đến 9',
    'Hãy nhìn tia số:\n1 — 2 — 3 — 4 — 5 — 6 — 7 — 8 — 9\n\n• Mỗi lần sang phải 1 bước = thêm 1\n• Số đứng sau luôn lớn hơn số đứng trước\n• 6 đứng ngay sau 5, 9 đứng ngay trước 10\n\nVẽ tia số ra giấy và chấm từng số nhé!', 3),
  c(2, 'tip', '⭐ Mẹo nhớ nhanh',
    '• Số 6 = 5 + 1 (một bàn tay + 1 ngón)\n• Số 7 = 5 + 2 (một bàn tay + 2 ngón)\n• Số 8 = 5 + 3 (trông như 2 vòng tròn chồng)\n• Số 9 = 5 + 4 (gần đủ 10 rồi!)\n\nĐếm ngược: 9, 8, 7, 6 cũng quan trọng lắm nhé!', 4),

  // ═══════════ BÀI 3: Số 0 và số 10 ═══════════
  c(3, 'intro', 'Hai số đặc biệt!',
    'Số 0 rất đặc biệt — nó có nghĩa là "không có gì"! Số 10 cũng đặc biệt — nó là 1 CHỤC, cần 2 chữ số để viết!', 1),
  c(3, 'explain', '👀 Hiểu số 0 và số 10',
    '🔴 Số 0 — Không có gì:\n• Có 3 quả táo, ăn hết 3 quả → còn 0 quả\n• Xóa hết bảng → trên bảng có 0 chữ\n\n🔵 Số 10 — Đủ 1 chục:\n• 10 ngón tay = 1 chục\n• 10 que tính bó lại = 1 bó = 1 chục\n• Số 10 gồm chữ số 1 và chữ số 0', 2),
  c(3, 'example', '🧮 Bó que tính — khái niệm chục',
    'Lấy 10 que tính, bó lại bằng dây chun:\n✅ 10 que rời → 1 bó = 1 CHỤC\n\nSố 10 = 1 chục + 0 đơn vị\n\nĐây là bước đầu tiên để con hiểu "hàng chục" và "hàng đơn vị" — rất quan trọng cho những bài sau!', 3),
  c(3, 'tip', '⭐ Ghi nhớ',
    '• 0 thêm vào số nào thì kết quả giữ nguyên: 5 + 0 = 5, 3 - 0 = 3\n• 10 là số đầu tiên có HAI chữ số\n• Đếm: ... 8, 9, 10. Sau 10 sẽ là 11!\n• Số 0 nằm đầu tia số, trước số 1', 4),

  // ═══════════ BÀI 4: So sánh các số đến 10 ═══════════
  c(4, 'intro', 'Số nào to hơn?',
    'Con có 3 kẹo, bạn có 5 kẹo. Ai nhiều hơn? Hôm nay con sẽ học cách so sánh số bằng dấu > (lớn hơn), < (bé hơn), = (bằng).', 1),
  c(4, 'explain', '🐊 Miệng cá sấu',
    'Dấu lớn hơn (>) và bé hơn (<) giống miệng cá sấu:\n\n🐊 Cá sấu LUÔN mở miệng về phía số LỚN hơn!\n\n• 5 > 3 → miệng mở về phía 5 (5 lớn hơn)\n• 2 < 7 → miệng mở về phía 7 (2 bé hơn)\n• 4 = 4 → hai bên bằng nhau, dùng dấu =\n\nNhớ: đầu nhọn chỉ vào số NHỎ!', 2),
  c(4, 'example', '📏 So sánh trên tia số',
    'Nhìn tia số: 0 — 1 — 2 — 3 — 4 — 5 — 6 — 7 — 8 — 9 — 10\n\n• Số đứng bên PHẢI luôn LỚN hơn\n• 7 đứng bên phải 3 → 7 > 3\n• 1 đứng bên trái 6 → 1 < 6\n\nHay dùng que tính: xếp 2 hàng rồi so xem hàng nào dài hơn!', 3),
  c(4, 'tip', '⭐ Mẹo so sánh nhanh',
    '• Số gần 10 thì lớn, gần 0 thì nhỏ\n• Không cần đếm — nhìn chữ số: 8 > 5 vì 8 đứng sau 5\n• Sắp xếp từ bé đến lớn: 2, 5, 7, 9\n• Sắp xếp từ lớn đến bé: 9, 7, 5, 2', 4),

  // ═══════════ BÀI 5: Phép cộng trong phạm vi 5 ═══════════
  c(5, 'intro', 'Gộp lại là cộng!',
    'Có 2 quả cam, mẹ cho thêm 1 quả. Giờ con có tất cả mấy quả? 2 + 1 = 3! Đó chính là phép cộng — gộp các nhóm lại!', 1),
  c(5, 'explain', '🖐️ Cộng bằng ngón tay',
    'Cách làm siêu dễ:\n• Tay trái giơ số thứ nhất (ví dụ: 2 ngón)\n• Tay phải giơ số thứ hai (ví dụ: 1 ngón)\n• Đếm tất cả ngón đang giơ: 1, 2, 3!\n\n2 + 1 = 3 ✅\n\nThử thêm:\n• 1 + 3 = ? (giơ 1 ngón + 3 ngón = 4 ngón → 4)\n• 2 + 3 = ? (giơ 2 + 3 = 5 ngón → 5)', 2),
  c(5, 'example', '🪵 Cộng bằng que tính',
    'Lấy que tính ra:\n• Bên trái: đặt 3 que\n• Bên phải: đặt 2 que\n• Gộp lại: đếm tất cả = 5 que\n→ 3 + 2 = 5\n\nGhi nhớ các phép cộng PV5:\n1+1=2  1+2=3  1+3=4  1+4=5\n2+1=3  2+2=4  2+3=5\n3+1=4  3+2=5\n4+1=5', 3),
  c(5, 'tip', '⭐ Quy tắc vàng',
    '• Đổi chỗ 2 số, kết quả không đổi: 2 + 3 = 3 + 2 = 5\n• Cộng với 0: kết quả giữ nguyên. 4 + 0 = 4\n• Cộng với 1: kết quả là số liền sau. 3 + 1 = 4\n• Kết quả luôn LỚN hơn mỗi số cộng (trừ cộng 0)', 4),

  // ═══════════ BÀI 6: Phép trừ trong phạm vi 5 ═══════════
  c(6, 'intro', 'Bớt đi là trừ!',
    'Có 4 viên kẹo, con ăn 1 viên. Còn lại mấy viên? 4 - 1 = 3! Phép trừ = bớt đi, lấy đi một phần.', 1),
  c(6, 'explain', '🖐️ Trừ bằng ngón tay',
    'Cách làm:\n• Giơ số ngón = số ban đầu (ví dụ: 5 ngón)\n• Gập bớt = số trừ đi (gập 2 ngón)\n• Đếm ngón còn giơ: 3 ngón!\n→ 5 - 2 = 3 ✅\n\nThử thêm:\n• 4 - 1 = ? (giơ 4, gập 1 → còn 3)\n• 3 - 2 = ? (giơ 3, gập 2 → còn 1)\n• 5 - 5 = ? (giơ 5, gập 5 → còn 0)', 2),
  c(6, 'example', '📏 Trừ trên tia số',
    'Dùng tia số: 0 — 1 — 2 — 3 — 4 — 5\n\n4 - 3 = ?\n• Đặt ngón tay lên số 4\n• Nhảy sang TRÁI 3 bước: 4 → 3 → 2 → 1\n• Đến số 1!\n→ 4 - 3 = 1 ✅\n\nTrừ = nhảy sang trái trên tia số!', 3),
  c(6, 'tip', '⭐ Ghi nhớ',
    '• Trừ cho 0: kết quả giữ nguyên. 5 - 0 = 5\n• Trừ cho chính nó: kết quả = 0. 3 - 3 = 0\n• Trừ cho 1: kết quả là số liền trước. 4 - 1 = 3\n• Cộng và trừ ngược nhau: 2 + 3 = 5 → 5 - 3 = 2', 4),

  // ═══════════ BÀI 7: Phép cộng trong phạm vi 10 ═══════════
  c(7, 'intro', 'Cộng số lớn hơn!',
    'Con đã giỏi cộng đến 5 rồi! Giờ mình cộng đến 10 nhé. 6 + 3 = 9, 7 + 2 = 9. Dùng que tính hoặc tia số sẽ dễ dàng thôi!', 1),
  c(7, 'explain', '🪵 Cộng bằng que tính + Đếm thêm',
    'Với số lớn, dùng phương pháp ĐẾM THÊM:\n\n6 + 3 = ?\n• Nhớ số 6 trong đầu\n• Đếm thêm 3: ...7, 8, 9\n→ 6 + 3 = 9 ✅\n\n7 + 3 = ?\n• Nhớ số 7\n• Đếm thêm 3: ...8, 9, 10\n→ 7 + 3 = 10 ✅\n\nMẹo: bắt đầu từ SỐ LỚN hơn rồi đếm thêm!', 2),
  c(7, 'example', '🔢 Tách-gộp để cộng',
    'Phương pháp tách-gộp (rất hay!):\n\n8 + 5 = ?\n• Tách 5 = 2 + 3\n• 8 + 2 = 10 (gộp thành 10 trước!)\n• 10 + 3 = 13... À khoan, bài này chỉ đến 10!\n\nĐúng hơn: 6 + 4 = ?\n• Tách 4 = 4\n• 6 + 4 = 10 ✅\n\nGhi nhớ các cặp = 10: 1+9, 2+8, 3+7, 4+6, 5+5', 3),
  c(7, 'tip', '⭐ Cặp số = 10',
    'Thuộc lòng các cặp cộng bằng 10 rất có ích:\n🔟 1 + 9 = 10\n🔟 2 + 8 = 10\n🔟 3 + 7 = 10\n🔟 4 + 6 = 10\n🔟 5 + 5 = 10\n\nĐây là nền tảng cho phép cộng có nhớ sau này!', 4),

  // ═══════════ BÀI 8: Phép trừ trong phạm vi 10 ═══════════
  c(8, 'intro', 'Trừ số lớn hơn!',
    'Giờ mình trừ với số lớn hơn: 9 - 4, 10 - 7. Vẫn dùng ngón tay, que tính hoặc tia số nhé!', 1),
  c(8, 'explain', '📏 Trừ bằng tia số + Đếm bớt',
    'Dùng tia số: 0 1 2 3 4 5 6 7 8 9 10\n\n9 - 4 = ?\n• Đặt tay lên số 9\n• Nhảy trái 4 bước: 9→8→7→6→5\n→ 9 - 4 = 5 ✅\n\nHoặc đếm bớt:\n• Bắt đầu từ 9\n• Đếm lùi 4: 8, 7, 6, 5\n→ Đáp án = 5', 2),
  c(8, 'example', '🔢 Trừ qua 10',
    '10 - 6 = ?\nDùng que tính: có 10 que, bớt 6 → còn 4\n\n10 - 3 = ?\n10 que bớt 3 → còn 7\n\nGhi nhớ: 10 trừ đi bao nhiêu = bạn của nó!\n10 - 1 = 9    10 - 6 = 4\n10 - 2 = 8    10 - 7 = 3\n10 - 3 = 7    10 - 8 = 2\n10 - 4 = 6    10 - 9 = 1\n10 - 5 = 5    10 - 10 = 0', 3),
  c(8, 'tip', '⭐ Mối liên hệ cộng-trừ',
    'Biết phép cộng → suy ra phép trừ:\n• 6 + 4 = 10 → 10 - 4 = 6 và 10 - 6 = 4\n• 3 + 5 = 8 → 8 - 5 = 3 và 8 - 3 = 5\n\nĐây gọi là "phép tính gia đình" — 3 số luôn đi cùng nhau!', 4),

  // ═══════════ BÀI 9: Bảng cộng trừ trong phạm vi 10 ═══════════
  c(9, 'intro', 'Thuộc lòng bảng tính!',
    'Con đã biết cộng trừ trong phạm vi 10 rồi! Giờ mình luyện để THUỘC LÒNG — tính nhanh mà không cần đếm ngón tay nữa!', 1),
  c(9, 'explain', '📊 Bảng cộng & gia đình phép tính',
    'Mỗi "gia đình" có 3 số và 4 phép tính:\n\nGia đình 3, 4, 7:\n✅ 3 + 4 = 7\n✅ 4 + 3 = 7\n✅ 7 - 3 = 4\n✅ 7 - 4 = 3\n\nGia đình 2, 8, 10:\n✅ 2 + 8 = 10\n✅ 8 + 2 = 10\n✅ 10 - 2 = 8\n✅ 10 - 8 = 2\n\nHọc 1 gia đình = biết 4 phép tính!', 2),
  c(9, 'example', '🏋️ Luyện tập nhanh',
    'Thử tính THẬT NHANH (không dùng ngón tay):\n\n5 + 3 = ?    8 - 5 = ?\n2 + 7 = ?    9 - 6 = ?\n4 + 6 = ?    10 - 7 = ?\n\nĐáp án: 8, 3, 9, 3, 10, 3\n\nNếu chưa nhanh, hãy luyện thêm! Mục tiêu: trả lời trong 3 giây!', 3),
  c(9, 'tip', '⭐ Mẹo học thuộc',
    '• Học theo cặp: biết 3+7=10 thì biết luôn 7+3=10, 10-3=7, 10-7=3\n• Luyện mỗi ngày 5 phút với flashcard\n• Đố ba mẹ, đố bạn bè — vừa chơi vừa nhớ!\n• Các cặp = 10 quan trọng nhất: 1+9, 2+8, 3+7, 4+6, 5+5', 4),

  // ═══════════ BÀI 10: Các số từ 11 đến 20 ═══════════
  c(10, 'intro', 'Vượt qua 10!',
    'Con đã chinh phục các số đến 10. Giờ bước vào thế giới số 2 chữ số: 11, 12... đến 20! Bí mật: mỗi số = 1 CHỤC + mấy ĐƠN VỊ.', 1),
  c(10, 'explain', '🧮 Chục và đơn vị — Bó que tính',
    'Dùng bó que tính:\n🔵 1 bó (10 que) = 1 chục\n🔴 Que rời = đơn vị\n\n• 11 = 1 bó + 1 que rời = 1 chục 1 đơn vị\n• 14 = 1 bó + 4 que rời = 1 chục 4 đơn vị\n• 17 = 1 bó + 7 que rời = 1 chục 7 đơn vị\n• 20 = 2 bó + 0 que rời = 2 chục\n\nĐọc: mười một, mười hai... hai mươi!', 2),
  c(10, 'example', '📏 Tia số 10 đến 20',
    'Tia số mở rộng:\n10 — 11 — 12 — 13 — 14 — 15 — 16 — 17 — 18 — 19 — 20\n\n• 11 đứng ngay sau 10\n• 15 ở giữa (15 = một chục rưỡi)\n• 20 = hai chục tròn\n\nĐếm thuận: 11, 12, 13... 20\nĐếm ngược: 20, 19, 18... 11', 3),
  c(10, 'tip', '⭐ Cách đọc số',
    '• 11: mười một  • 15: mười lăm (không đọc "mười năm"!)\n• 12: mười hai   • 16: mười sáu\n• 13: mười ba    • 17: mười bảy\n• 14: mười bốn   • 18: mười tám\n                 • 19: mười chín\n                 • 20: hai mươi', 4),

  // ═══════════ BÀI 11: Cộng không nhớ PV20 ═══════════
  c(11, 'intro', 'Cộng số lớn — dễ ợt!',
    'Con biết cộng đến 10 rồi. Giờ cộng số lớn hơn: 14 + 3, 12 + 5. Bí quyết: cộng phần đơn vị thôi, phần chục giữ nguyên!', 1),
  c(11, 'explain', '🧮 Cộng đơn vị — giữ chục',
    '14 + 3 = ?\n• 14 gồm: 1 chục và 4 đơn vị\n• Cộng thêm 3 vào phần đơn vị: 4 + 3 = 7\n• Chục giữ nguyên: 1 chục\n→ 14 + 3 = 17 ✅\n\n12 + 5 = ?\n• Đơn vị: 2 + 5 = 7\n• Chục: 1\n→ 12 + 5 = 17 ✅\n\nVì 4+3=7 < 10 nên KHÔNG CÓ NHỚ!', 2),
  c(11, 'example', '🪵 Làm với que tính',
    'Ví dụ: 13 + 6 = ?\n🔵 Bó 1: 10 que (1 chục)\n🔴 Rời: 3 que + thêm 6 que\n→ Que rời: 3 + 6 = 9\n→ Tổng: 1 bó + 9 que = 19\n\n11 + 8 = ?\n→ 1 + 8 = 9 đơn vị. 1 chục giữ nguyên → 19\n\n15 + 4 = ?\n→ 5 + 4 = 9. 1 chục giữ nguyên → 19', 3),
  c(11, 'tip', '⭐ Nhận biết "không nhớ"',
    'Cộng KHÔNG nhớ = tổng đơn vị < 10:\n• 14 + 5: đơn vị 4+5=9 < 10 → không nhớ ✅\n• 13 + 2: đơn vị 3+2=5 < 10 → không nhớ ✅\n• 16 + 7: đơn vị 6+7=13 ≥ 10 → CÓ NHỚ (bài sau!)\n\nKhi không nhớ: chỉ cần cộng đơn vị, giữ nguyên chục!', 4),

  // ═══════════ BÀI 12: Trừ không nhớ PV20 ═══════════
  c(12, 'intro', 'Trừ cũng dễ như cộng!',
    'Trừ không nhớ: 17 - 3, 19 - 5. Trừ phần đơn vị, giữ nguyên chục — giống y hệt cộng!', 1),
  c(12, 'explain', '🧮 Trừ đơn vị — giữ chục',
    '17 - 3 = ?\n• 17 = 1 chục + 7 đơn vị\n• Trừ ở đơn vị: 7 - 3 = 4\n• Chục giữ nguyên: 1\n→ 17 - 3 = 14 ✅\n\n19 - 5 = ?\n• Đơn vị: 9 - 5 = 4\n• Chục: 1\n→ 19 - 5 = 14 ✅\n\nVì 7 > 3 và 9 > 5 → đủ trừ → KHÔNG NHỚ!', 2),
  c(12, 'example', '🪵 Que tính minh họa',
    '18 - 6 = ?\n🔵 1 bó + 🔴 8 que rời\n→ Bớt 6 que rời: 8 - 6 = 2 que\n→ Còn: 1 bó + 2 que = 12 ✅\n\n16 - 4 = ?\n→ 6 - 4 = 2. Giữ 1 chục → 12\n\n20 - 10 = ?\n→ 2 bó - 1 bó = 1 bó = 10', 3),
  c(12, 'tip', '⭐ Nhận biết "không nhớ"',
    'Trừ KHÔNG nhớ = đơn vị đủ trừ (số trên ≥ số dưới):\n• 18 - 5: đơn vị 8 ≥ 5 → không nhớ ✅\n• 15 - 3: đơn vị 5 ≥ 3 → không nhớ ✅\n• 13 - 7: đơn vị 3 < 7 → CÓ NHỚ (bài sau!)', 4),

  // ═══════════ BÀI 13: Cộng có nhớ PV20 ═══════════
  c(13, 'intro', 'Cộng có nhớ — thử thách mới!',
    'Khi tổng đơn vị ≥ 10, ta phải "nhớ" 1 sang hàng chục! Ví dụ: 9 + 5. Nghe khó nhưng có MẸO!', 1),
  c(13, 'explain', '🔢 Phương pháp TÁCH SỐ qua 10',
    'Bí quyết: TÁCH số nhỏ để gộp thành 10!\n\n9 + 5 = ?\n• Tách 5 = 1 + 4\n• 9 + 1 = 10 (gộp đủ 10 trước!)\n• 10 + 4 = 14\n→ 9 + 5 = 14 ✅\n\n8 + 6 = ?\n• Tách 6 = 2 + 4\n• 8 + 2 = 10\n• 10 + 4 = 14\n→ 8 + 6 = 14 ✅\n\nLuôn tìm cách làm tròn 10!', 2),
  c(13, 'example', '🪵 Que tính minh họa',
    '7 + 5 = ?\n🔴 7 que + 🔴 5 que\n• Lấy 3 que từ nhóm 5 bỏ sang nhóm 7: 7+3 = 10 → bó lại!\n• Còn 2 que rời\n→ 1 bó + 2 que = 12 ✅\n\n6 + 8 = ?\n• Bắt đầu từ 8 (số lớn hơn)\n• Tách 6 = 2 + 4\n• 8 + 2 = 10, 10 + 4 = 14 ✅', 3),
  c(13, 'tip', '⭐ Bảng cộng có nhớ cần thuộc',
    'Các phép cộng có nhớ thường gặp:\n9+2=11  9+3=12  9+4=13  9+5=14\n8+3=11  8+4=12  8+5=13  8+6=14\n7+4=11  7+5=12  7+6=13\n6+5=11  6+6=12\n\nMẹo: luôn bắt đầu từ số lớn, tách số nhỏ!', 4),

  // ═══════════ BÀI 14: Trừ có nhớ PV20 ═══════════
  c(14, 'intro', 'Trừ có nhớ — vượt thử thách!',
    'Khi đơn vị không đủ trừ (ví dụ 14 - 8: 4 < 8), phải "mượn" 1 chục. Mình dùng phương pháp TÁCH SỐ!', 1),
  c(14, 'explain', '🔢 Tách qua 10 khi trừ',
    '14 - 8 = ?\nCách 1: Tách 14 = 10 + 4\n• 10 - 8 = 2\n• 2 + 4 = 6\n→ 14 - 8 = 6 ✅\n\nCách 2: Tách 8 = 4 + 4\n• 14 - 4 = 10 (trừ về 10 trước)\n• 10 - 4 = 6\n→ 14 - 8 = 6 ✅\n\n13 - 5 = ?\n• 13 = 10 + 3\n• 10 - 5 = 5\n• 5 + 3 = 8 → 13 - 5 = 8 ✅', 2),
  c(14, 'example', '🪵 Que tính — mở bó',
    '12 - 7 = ?\n🔵 1 bó + 🔴 2 que rời\n• 2 que không đủ bớt 7\n• MỞ BÓ: 10 que + 2 que = 12 que rời\n• Bớt 7 que: 12 - 7 = 5 que\n→ 12 - 7 = 5 ✅\n\nĐây chính là "mượn chục" — mở 1 bó thành 10 que rời!', 3),
  c(14, 'tip', '⭐ Khi nào "có nhớ"?',
    'Trừ có nhớ khi: đơn vị bị trừ < số trừ\n• 11 - 3: 1 < 3 → có nhớ\n• 15 - 9: 5 < 9 → có nhớ\n• 17 - 4: 7 > 4 → KHÔNG nhớ\n\n2 cách nhớ:\n1) Tách số lớn = 10 + mấy, trừ 10 trước\n2) Trừ dần về 10, rồi trừ tiếp', 4),

  // ═══════════ BÀI 15: Các số tròn chục ═══════════
  c(15, 'intro', 'Số tròn chục — toàn số "đẹp"!',
    '10, 20, 30, 40, 50, 60, 70, 80, 90, 100 — đây là các số tròn chục. Đặc điểm: luôn có chữ số 0 ở hàng đơn vị!', 1),
  c(15, 'explain', '🧮 Đếm theo bó — hàng chục',
    'Mỗi bó que = 10 = 1 chục:\n• 1 bó = 10 (một chục)\n• 2 bó = 20 (hai chục)\n• 3 bó = 30 (ba chục)\n• 5 bó = 50 (năm chục)\n• 10 bó = 100 (mười chục = một trăm!)\n\nĐọc: hai mươi, ba mươi... chín mươi, một trăm.\nKhông đọc "mấy mươi không"!', 2),
  c(15, 'example', '📏 Tia số tròn chục',
    'Tia số: 0 — 10 — 20 — 30 — 40 — 50 — 60 — 70 — 80 — 90 — 100\n\n• Mỗi bước = 10\n• 30 và 50: ai lớn hơn? 50 > 30 (đứng bên phải)\n• 80 gần 100 → 80 là số lớn\n• 20 gần 0 → 20 là số nhỏ', 3),
  c(15, 'tip', '⭐ Nhận biết số tròn chục',
    '• Chữ số hàng đơn vị luôn = 0\n• 10, 20, 30... cách nhau 10\n• 100 là số tròn TRĂM đầu tiên\n• Cộng tròn chục: 30 + 40 = 70 (3 bó + 4 bó = 7 bó)', 4),

  // ═══════════ BÀI 16: Các số có hai chữ số ═══════════
  c(16, 'intro', 'Mọi số 2 chữ số!',
    'Ngoài số tròn chục, còn có 25, 37, 48, 63, 91... Mỗi số gồm hàng CHỤC và hàng ĐƠN VỊ.', 1),
  c(16, 'explain', '🧮 Phân tích số — chục & đơn vị',
    'Số 47:\n• Chữ số 4 ở hàng CHỤC → 4 chục = 40\n• Chữ số 7 ở hàng ĐƠN VỊ → 7 đơn vị = 7\n• 47 = 40 + 7\n\nSố 83:\n• 8 chục + 3 đơn vị\n• 83 = 80 + 3\n\nDùng que tính: 47 = 4 bó + 7 que rời', 2),
  c(16, 'example', '📖 Đọc và viết số',
    'Cách đọc:\n• 35: ba mươi lăm (không phải "ba mươi năm"!)\n• 71: bảy mươi mốt (không phải "bảy mươi một"!)\n• 54: năm mươi tư (không phải "năm mươi bốn"!)\n\nLưu ý đặc biệt tiếng Việt:\n• ...1 → mốt (trừ 11: mười một)\n• ...4 → tư\n• ...5 → lăm (trừ 15: mười lăm)', 3),
  c(16, 'tip', '⭐ Số liền trước, liền sau',
    '• Liền trước 50 là 49 (bớt 1)\n• Liền sau 50 là 51 (thêm 1)\n• Liền trước 30 là 29\n• Giữa 67 và 69 là 68\n\nĐếm thuận: 38, 39, 40, 41, 42...\nĐếm ngược: 62, 61, 60, 59, 58...', 4),

  // ═══════════ BÀI 17: So sánh các số đến 100 ═══════════
  c(17, 'intro', 'So sánh số 2 chữ số!',
    'Con đã biết so sánh số đến 10. Giờ so sánh số lớn hơn: 45 và 52, ai lớn? Có quy tắc rất đơn giản!', 1),
  c(17, 'explain', '📐 Quy tắc so sánh',
    'QUY TẮC VÀNG:\n\n1️⃣ So hàng CHỤC trước:\n• 45 vs 52: chục 4 < 5 → 45 < 52 ✅\n• 73 vs 38: chục 7 > 3 → 73 > 38 ✅\n\n2️⃣ Nếu chục BẰNG nhau → so đơn vị:\n• 56 vs 53: chục bằng (5=5), đơn vị 6 > 3 → 56 > 53 ✅\n• 81 vs 87: chục bằng (8=8), đơn vị 1 < 7 → 81 < 87 ✅', 2),
  c(17, 'example', '🔢 Sắp xếp số',
    'Sắp xếp từ bé đến lớn: 72, 27, 70, 29\n\nBước 1: nhìn hàng chục: 7, 2, 7, 2\n→ Nhóm chục 2: 27, 29\n→ Nhóm chục 7: 72, 70\n\nBước 2: so đơn vị trong từng nhóm:\n→ 27 < 29 (7 < 9)\n→ 70 < 72 (0 < 2)\n\nKết quả: 27 < 29 < 70 < 72 ✅', 3),
  c(17, 'tip', '⭐ Mẹo nhanh',
    '• Số có hàng chục lớn hơn → chắc chắn lớn hơn\n• Không cần đếm — chỉ cần so từng hàng!\n• Tất cả số 9x > tất cả số 8x > ... > tất cả số 1x\n• Số gần 100 → lớn. Số gần 0 → nhỏ.', 4),

  // ═══════════ BÀI 18: Cộng trừ không nhớ PV100 ═══════════
  c(18, 'intro', 'Cộng trừ số lớn!',
    'Giờ mình cộng trừ số 2 chữ số! 34 + 25, 67 - 43. Dùng phương pháp ĐẶT TÍNH DỌC — thẳng hàng, dễ tính!', 1),
  c(18, 'explain', '📝 Đặt tính dọc',
    'CỘNG: 34 + 25 = ?\n    34\n  + 25\n  ----\n    59\n\nBước 1: Cộng đơn vị: 4 + 5 = 9 → viết 9\nBước 2: Cộng chục: 3 + 2 = 5 → viết 5\nKết quả: 59 ✅\n\nTRỪ: 67 - 43 = ?\n    67\n  - 43\n  ----\n    24\n\nBước 1: Trừ đơn vị: 7 - 3 = 4\nBước 2: Trừ chục: 6 - 4 = 2\nKết quả: 24 ✅', 2),
  c(18, 'example', '🧮 Nhiều ví dụ',
    '56 + 23 = ?\n  56\n+ 23\n----\n  79 (6+3=9, 5+2=7)\n\n89 - 34 = ?\n  89\n- 34\n----\n  55 (9-4=5, 8-3=5)\n\n41 + 38 = ?\n  41\n+ 38\n----\n  79 (1+8=9, 4+3=7)', 3),
  c(18, 'tip', '⭐ Quy tắc đặt tính',
    '1. Viết thẳng cột: đơn vị dưới đơn vị, chục dưới chục\n2. Tính từ PHẢI sang TRÁI (đơn vị trước)\n3. Kiểm tra: không nhớ nghĩa là mỗi cột < 10\n4. Cộng: kiểm tra bằng phép trừ. Trừ: kiểm tra bằng phép cộng', 4),

  // ═══════════ BÀI 19: Hình học ═══════════
  c(19, 'intro', 'Khám phá thế giới hình!',
    'Xung quanh con đầy hình: cửa sổ hình vuông, bánh xe hình tròn, mái nhà hình tam giác! Hôm nay con sẽ học nhận biết 4 hình cơ bản.', 1),
  c(19, 'explain', '👀 4 hình cơ bản',
    '🟦 HÌNH VUÔNG: 4 cạnh bằng nhau, 4 góc vuông\n→ Ví dụ: gạch lát nền, khăn tay\n\n🟩 HÌNH CHỮ NHẬT: 2 cạnh dài bằng nhau, 2 cạnh ngắn bằng nhau, 4 góc vuông\n→ Ví dụ: quyển sách, cửa ra vào\n\n🔺 HÌNH TAM GIÁC: 3 cạnh, 3 góc\n→ Ví dụ: mái nhà, lá cờ đuôi nheo\n\n🔵 HÌNH TRÒN: không có cạnh, không có góc, tròn đều\n→ Ví dụ: đồng hồ, bánh xe', 2),
  c(19, 'example', '🔎 Tìm hình quanh nhà',
    'Trò chơi: đi quanh nhà tìm hình!\n\n🟦 Hình vuông: ô cửa sổ, viên gạch, hộp rubik\n🟩 Hình chữ nhật: cửa ra vào, màn hình, bàn học\n🔺 Hình tam giác: mái nhà, biển báo, mắc áo\n🔵 Hình tròn: đĩa ăn, đồng xu, nút áo\n\nĐếm xem con tìm được bao nhiêu hình mỗi loại!', 3),
  c(19, 'tip', '⭐ Phân biệt nhanh',
    '• Tròn → không cạnh → hình TRÒN\n• 3 cạnh → hình TAM GIÁC\n• 4 cạnh bằng nhau → hình VUÔNG\n• 4 cạnh, 2 dài 2 ngắn → hình CHỮ NHẬT\n\nLưu ý: hình vuông cũng là hình chữ nhật đặc biệt (4 cạnh đều bằng)!', 4),

  // ═══════════ BÀI 20: Đo độ dài ═══════════
  c(20, 'intro', 'Đo bằng thước!',
    'Cái bút dài mấy? Quyển sách dày bao nhiêu? Để biết chính xác, mình dùng THƯỚC KẺ với đơn vị xăng-ti-mét (cm)!', 1),
  c(20, 'explain', '📐 Cách dùng thước kẻ',
    'Các bước đo:\n1️⃣ Đặt đầu 0 của thước sát MÉP vật cần đo\n2️⃣ Kéo thước thẳng dọc theo vật\n3️⃣ Đọc số ở đầu kia của vật → đó là độ dài\n\nVí dụ: bút chì đặt từ vạch 0 đến vạch 15\n→ Bút chì dài 15 cm\n\nĐơn vị: cm (xăng-ti-mét). Viết: 15 cm', 2),
  c(20, 'example', '📏 Thử đo đồ vật',
    'Thử đo các vật quanh bàn:\n• Cục tẩy: khoảng 3 cm - 5 cm\n• Bút chì: khoảng 15 cm - 18 cm\n• Quyển vở: khoảng 24 cm (cạnh dài)\n• Ngón tay trỏ: khoảng 5 cm - 7 cm\n\nSo sánh: bút chì DÀI hơn cục tẩy vì 15 cm > 4 cm', 3),
  c(20, 'tip', '⭐ Lưu ý khi đo',
    '• Luôn bắt đầu từ vạch 0, KHÔNG PHẢI từ mép thước!\n• Đặt thước THẲNG, không nghiêng\n• 1 cm rất ngắn — bằng chiều ngang đầu ngón tay út\n• So sánh độ dài: số cm LỚN hơn = DÀI hơn\n• Ước lượng trước, rồi đo kiểm tra!', 4),
];
