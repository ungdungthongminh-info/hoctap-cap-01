/**
 * GIÁO TRÌNH TOÁN LỚP 1 — ĐẦY ĐỦ 20 BÀI
 * Theo Chương trình GDPT 2018 (Việt Nam)
 * Thứ tự: Số học → Phép tính → Mở rộng → Hình học & Đo lường
 *
 * Phương pháp dạy tích hợp:
 *   🖐️ Giơ ngón tay     🪵 Que tính       📏 Tia số
 *   🔢 Tách-gộp số       📊 Bảng cộng/trừ  🧮 Bó chục
 *   👀 Trực quan          🤲 Đếm thêm/bớt   📐 Đo thực tế
 */

import type { Lesson } from './seedData';

export const allLessons: Lesson[] = [
  // ═══════════ CHƯƠNG 1: CÁC SỐ ĐẾN 10 ═══════════
  {
    id: 1, grade: 1, subjectCode: 'math',
    unitCode: 'C1_so_den_10', lessonCode: 'L01_so_1_5',
    title: 'Các số 1, 2, 3, 4, 5',
    objective: 'Đếm, đọc, viết các số từ 1 đến 5. Nhận biết số lượng đồ vật tương ứng.',
    summarySimple: 'Con học đếm từ 1 đến 5 bằng ngón tay và que tính.',
    tips: 'Giơ ngón tay đếm theo — mỗi ngón là một số!',
    difficulty: 'easy', estimatedMinutes: 10,
    status: 'ready', sortOrder: 1, isActive: 1,
  },
  {
    id: 2, grade: 1, subjectCode: 'math',
    unitCode: 'C1_so_den_10', lessonCode: 'L02_so_6_9',
    title: 'Các số 6, 7, 8, 9',
    objective: 'Đếm, đọc, viết các số từ 6 đến 9. Biết đếm tiếp từ 5.',
    summarySimple: 'Con học đếm từ 6 đến 9. Dùng hai bàn tay để đếm!',
    tips: 'Một bàn tay = 5. Thêm ngón bàn tay kia là 6, 7, 8, 9!',
    difficulty: 'easy', estimatedMinutes: 10,
    status: 'ready', sortOrder: 2, isActive: 1,
  },
  {
    id: 3, grade: 1, subjectCode: 'math',
    unitCode: 'C1_so_den_10', lessonCode: 'L03_so_0_10',
    title: 'Số 0 và số 10',
    objective: 'Hiểu ý nghĩa số 0 (không có gì). Biết số 10 gồm 1 chục.',
    summarySimple: 'Số 0 là không có gì. Số 10 là đủ 1 chục — 10 ngón tay!',
    tips: 'Hai bàn tay xòe ra = 10. Nắm lại hết = 0!',
    difficulty: 'easy', estimatedMinutes: 10,
    status: 'ready', sortOrder: 3, isActive: 1,
  },
  {
    id: 4, grade: 1, subjectCode: 'math',
    unitCode: 'C1_so_den_10', lessonCode: 'L04_so_sanh_10',
    title: 'So sánh các số đến 10',
    objective: 'So sánh hai số dùng dấu >, <, =. Sắp xếp thứ tự.',
    summarySimple: 'Học dấu lớn hơn (>), bé hơn (<), bằng (=). Con cá sấu luôn ăn số lớn!',
    tips: 'Miệng cá sấu 🐊 luôn mở về phía số LỚN hơn!',
    difficulty: 'easy', estimatedMinutes: 12,
    status: 'ready', sortOrder: 4, isActive: 1,
  },

  // ═══════════ CHƯƠNG 2: CỘNG TRỪ TRONG PHẠM VI 10 ═══════════
  {
    id: 5, grade: 1, subjectCode: 'math',
    unitCode: 'C2_cong_tru_10', lessonCode: 'L05_cong_pv5',
    title: 'Phép cộng trong phạm vi 5',
    objective: 'Thực hiện phép cộng có kết quả đến 5. Hiểu ý nghĩa phép cộng là gộp lại.',
    summarySimple: 'Cộng = gộp lại. Dùng ngón tay: giơ 2 ngón + giơ thêm 1 ngón = 3 ngón!',
    tips: 'Giơ ngón tay hai bên rồi đếm tất cả — đó là kết quả phép cộng!',
    difficulty: 'easy', estimatedMinutes: 12,
    status: 'ready', sortOrder: 5, isActive: 1,
  },
  {
    id: 6, grade: 1, subjectCode: 'math',
    unitCode: 'C2_cong_tru_10', lessonCode: 'L06_tru_pv5',
    title: 'Phép trừ trong phạm vi 5',
    objective: 'Thực hiện phép trừ trong phạm vi 5. Hiểu ý nghĩa phép trừ là bớt đi.',
    summarySimple: 'Trừ = bớt đi. Giơ 4 ngón, gập 1 ngón = còn 3 ngón!',
    tips: 'Giơ ngón tay rồi gập bớt — đếm ngón còn lại là kết quả!',
    difficulty: 'easy', estimatedMinutes: 12,
    status: 'ready', sortOrder: 6, isActive: 1,
  },
  {
    id: 7, grade: 1, subjectCode: 'math',
    unitCode: 'C2_cong_tru_10', lessonCode: 'L07_cong_pv10',
    title: 'Phép cộng trong phạm vi 10',
    objective: 'Thực hiện phép cộng có kết quả đến 10. Dùng tách-gộp số và tia số.',
    summarySimple: 'Cộng số lớn hơn dùng que tính hoặc tia số. 6 + 3: đặt 6 que, thêm 3 que, đếm = 9!',
    tips: 'Dùng tia số: đứng ở số thứ nhất, nhảy sang phải thêm!',
    difficulty: 'easy', estimatedMinutes: 15,
    status: 'ready', sortOrder: 7, isActive: 1,
  },
  {
    id: 8, grade: 1, subjectCode: 'math',
    unitCode: 'C2_cong_tru_10', lessonCode: 'L08_tru_pv10',
    title: 'Phép trừ trong phạm vi 10',
    objective: 'Thực hiện phép trừ trong phạm vi 10. Dùng đếm bớt và tia số.',
    summarySimple: 'Trừ = đếm bớt. 9 - 4: đặt 9 que, bớt 4 que, còn 5 que!',
    tips: 'Dùng tia số: đứng ở số lớn, nhảy sang trái bớt đi!',
    difficulty: 'easy', estimatedMinutes: 15,
    status: 'ready', sortOrder: 8, isActive: 1,
  },
  {
    id: 9, grade: 1, subjectCode: 'math',
    unitCode: 'C2_cong_tru_10', lessonCode: 'L09_bang_cong_tru',
    title: 'Bảng cộng và bảng trừ trong phạm vi 10',
    objective: 'Thuộc bảng cộng, trừ PV10. Nhận biết quan hệ cộng-trừ.',
    summarySimple: 'Học thuộc bảng cộng trừ giúp tính nhanh. 3 + 7 = 10 thì 10 - 7 = 3!',
    tips: 'Cộng và trừ là ngược nhau: biết 3 + 4 = 7 → suy ra 7 - 4 = 3!',
    difficulty: 'medium', estimatedMinutes: 15,
    status: 'ready', sortOrder: 9, isActive: 1,
  },

  // ═══════════ CHƯƠNG 3: CÁC SỐ ĐẾN 20 ═══════════
  {
    id: 10, grade: 1, subjectCode: 'math',
    unitCode: 'C3_so_den_20', lessonCode: 'L10_so_11_20',
    title: 'Các số từ 11 đến 20',
    objective: 'Đọc, viết, phân tích các số từ 11 đến 20 theo chục và đơn vị.',
    summarySimple: '11 = 1 chục và 1 đơn vị. Dùng bó que tính: 1 bó (10 que) + vài que rời!',
    tips: '1 bó que = 10. Thêm que rời vào để được 11, 12, 13...',
    difficulty: 'easy', estimatedMinutes: 12,
    status: 'ready', sortOrder: 10, isActive: 1,
  },
  {
    id: 11, grade: 1, subjectCode: 'math',
    unitCode: 'C3_so_den_20', lessonCode: 'L11_cong_kn_pv20',
    title: 'Phép cộng không nhớ trong phạm vi 20',
    objective: 'Cộng dạng 14 + 3, 11 + 5 (không nhớ). Cộng đơn vị với đơn vị.',
    summarySimple: '14 + 3: giữ nguyên 1 chục, cộng 4 + 3 = 7 → được 17!',
    tips: 'Cộng không nhớ: chục giữ nguyên, chỉ cộng phần đơn vị!',
    difficulty: 'easy', estimatedMinutes: 12,
    status: 'ready', sortOrder: 11, isActive: 1,
  },
  {
    id: 12, grade: 1, subjectCode: 'math',
    unitCode: 'C3_so_den_20', lessonCode: 'L12_tru_kn_pv20',
    title: 'Phép trừ không nhớ trong phạm vi 20',
    objective: 'Trừ dạng 17 - 3, 19 - 5 (không nhớ). Trừ đơn vị với đơn vị.',
    summarySimple: '17 - 3: giữ nguyên 1 chục, trừ 7 - 3 = 4 → được 14!',
    tips: 'Trừ không nhớ: chục giữ nguyên, chỉ trừ phần đơn vị!',
    difficulty: 'easy', estimatedMinutes: 12,
    status: 'ready', sortOrder: 12, isActive: 1,
  },
  {
    id: 13, grade: 1, subjectCode: 'math',
    unitCode: 'C3_so_den_20', lessonCode: 'L13_cong_cn_pv20',
    title: 'Phép cộng có nhớ trong phạm vi 20',
    objective: 'Cộng dạng 9 + 5, 8 + 6 (có nhớ). Tách số để làm tròn 10.',
    summarySimple: '9 + 5: tách 5 = 1 + 4. Lấy 9 + 1 = 10, rồi 10 + 4 = 14!',
    tips: 'Cộng có nhớ: tách số nhỏ để gộp thành 10 trước!',
    difficulty: 'medium', estimatedMinutes: 15,
    status: 'ready', sortOrder: 13, isActive: 1,
  },
  {
    id: 14, grade: 1, subjectCode: 'math',
    unitCode: 'C3_so_den_20', lessonCode: 'L14_tru_cn_pv20',
    title: 'Phép trừ có nhớ trong phạm vi 20',
    objective: 'Trừ dạng 14 - 8, 13 - 5 (có nhớ). Tách để trừ qua 10.',
    summarySimple: '14 - 8: tách 14 = 10 + 4. Trừ: 10 - 8 = 2, rồi 2 + 4 = 6!',
    tips: 'Trừ có nhớ: tách số lớn ra thành 10 + mấy, trừ phần 10 trước!',
    difficulty: 'medium', estimatedMinutes: 15,
    status: 'ready', sortOrder: 14, isActive: 1,
  },

  // ═══════════ CHƯƠNG 4: CÁC SỐ ĐẾN 100 ═══════════
  {
    id: 15, grade: 1, subjectCode: 'math',
    unitCode: 'C4_so_den_100', lessonCode: 'L15_so_tron_chuc',
    title: 'Các số tròn chục',
    objective: 'Đọc, viết, so sánh các số tròn chục: 10, 20, 30... 100.',
    summarySimple: '10, 20, 30... là các số tròn chục. 20 = 2 bó que (2 chục). 100 = 10 bó que!',
    tips: 'Số tròn chục luôn có chữ số 0 ở hàng đơn vị!',
    difficulty: 'easy', estimatedMinutes: 12,
    status: 'ready', sortOrder: 15, isActive: 1,
  },
  {
    id: 16, grade: 1, subjectCode: 'math',
    unitCode: 'C4_so_den_100', lessonCode: 'L16_so_2_chu_so',
    title: 'Các số có hai chữ số',
    objective: 'Đọc, viết, phân tích số có 2 chữ số theo hàng chục và đơn vị.',
    summarySimple: 'Số 47 có 4 chục và 7 đơn vị = 4 bó que + 7 que rời.',
    tips: 'Chữ số bên trái là hàng CHỤC, bên phải là hàng ĐƠN VỊ!',
    difficulty: 'easy', estimatedMinutes: 12,
    status: 'ready', sortOrder: 16, isActive: 1,
  },
  {
    id: 17, grade: 1, subjectCode: 'math',
    unitCode: 'C4_so_den_100', lessonCode: 'L17_so_sanh_100',
    title: 'So sánh các số đến 100',
    objective: 'So sánh hai số có 2 chữ số. So hàng chục trước, nếu bằng thì so đơn vị.',
    summarySimple: 'So 45 và 52: hàng chục 4 < 5 → 45 < 52. Dễ ợt!',
    tips: 'So hàng CHỤC trước. Nếu chục bằng nhau thì mới so đơn vị!',
    difficulty: 'medium', estimatedMinutes: 12,
    status: 'ready', sortOrder: 17, isActive: 1,
  },
  {
    id: 18, grade: 1, subjectCode: 'math',
    unitCode: 'C4_so_den_100', lessonCode: 'L18_cong_tru_pv100',
    title: 'Cộng trừ không nhớ trong phạm vi 100',
    objective: 'Cộng trừ dạng 34 + 25, 67 - 43 (không nhớ). Đặt tính dọc.',
    summarySimple: '34 + 25: chục 3+2=5, đơn vị 4+5=9 → được 59! Đặt tính dọc cho dễ.',
    tips: 'Đặt thẳng cột: chục dưới chục, đơn vị dưới đơn vị. Cộng/trừ từ phải sang trái!',
    difficulty: 'medium', estimatedMinutes: 15,
    status: 'ready', sortOrder: 18, isActive: 1,
  },

  // ═══════════ CHƯƠNG 5: HÌNH HỌC VÀ ĐO LƯỜNG ═══════════
  {
    id: 19, grade: 1, subjectCode: 'math',
    unitCode: 'C5_hinh_do', lessonCode: 'L19_hinh_hoc',
    title: 'Hình vuông, hình tròn, hình tam giác, hình chữ nhật',
    objective: 'Nhận dạng 4 hình cơ bản. Biết đặc điểm mỗi hình.',
    summarySimple: 'Hình vuông có 4 cạnh bằng nhau. Hình tròn không có cạnh. Hình tam giác 3 cạnh.',
    tips: 'Tìm hình xung quanh: cửa sổ hình vuông, bánh xe hình tròn, mái nhà hình tam giác!',
    difficulty: 'easy', estimatedMinutes: 12,
    status: 'ready', sortOrder: 19, isActive: 1,
  },
  {
    id: 20, grade: 1, subjectCode: 'math',
    unitCode: 'C5_hinh_do', lessonCode: 'L20_do_do_dai',
    title: 'Đo độ dài — Xăng-ti-mét',
    objective: 'Biết đo độ dài bằng thước kẻ. Đọc vạch cm trên thước.',
    summarySimple: 'Dùng thước kẻ đo: đặt đầu 0 vào mép vật, đọc số ở đầu kia. Đơn vị: cm.',
    tips: 'Luôn đặt đầu 0 của thước sát mép vật cần đo!',
    difficulty: 'easy', estimatedMinutes: 12,
    status: 'ready', sortOrder: 20, isActive: 1,
  },
];
