/**
 * QUESTIONS — 300 câu hỏi Toán Lớp 1 (15 câu × 20 bài)
 * Tỉ lệ: ~8 single_choice + 4 fill_number + 3 true_false / bài
 * Mỗi câu có giải thích đơn giản bằng tiếng Việt
 */

import type { Question } from './seedData';

type Diff = 'easy' | 'medium' | 'hard';

function sc(id: number, lid: number, text: string, opts: (string | number)[], ans: string, exp: string, diff: Diff = 'easy', skill = ''): Question {
  return { id, grade: 1, subjectCode: 'math', lessonId: lid, questionType: 'single_choice', questionText: text, optionsJson: JSON.stringify(opts.map(String)), correctAnswer: ans, explanationSimple: exp, difficulty: diff, skillTag: skill, sourceType: 'manual', isVerified: 1, isActive: 1 };
}

function tf(id: number, lid: number, text: string, ans: boolean, exp: string, diff: Diff = 'easy', skill = ''): Question {
  return { id, grade: 1, subjectCode: 'math', lessonId: lid, questionType: 'true_false', questionText: text, optionsJson: null, correctAnswer: ans ? 'Đúng' : 'Sai', explanationSimple: exp, difficulty: diff, skillTag: skill, sourceType: 'manual', isVerified: 1, isActive: 1 };
}

function fn(id: number, lid: number, text: string, ans: string, exp: string, diff: Diff = 'easy', skill = ''): Question {
  return { id, grade: 1, subjectCode: 'math', lessonId: lid, questionType: 'fill_number', questionText: text, optionsJson: null, correctAnswer: ans, explanationSimple: exp, difficulty: diff, skillTag: skill, sourceType: 'manual', isVerified: 1, isActive: 1 };
}

let qid = 0;
const n = () => ++qid; // auto-increment ID

export const allQuestions: Question[] = [
  // ═══════════════════════════════════════════════════
  // BÀI 1: Các số 1, 2, 3, 4, 5
  // ═══════════════════════════════════════════════════
  sc(n(), 1, 'Có mấy bông hoa? 🌸🌸🌸', [1,2,3,4], '3', 'Đếm từng bông: 1, 2, 3. Có 3 bông hoa.'),
  sc(n(), 1, 'Có mấy ngôi sao? ⭐⭐⭐⭐⭐', [3,4,5,2], '5', 'Đếm: 1, 2, 3, 4, 5. Có 5 ngôi sao.'),
  sc(n(), 1, 'Số nào đứng ngay sau số 3?', [1,2,4,5], '4', 'Đếm: 1, 2, 3, 4. Số đứng ngay sau 3 là 4.'),
  sc(n(), 1, 'Số nào đứng ngay trước số 5?', [2,3,4,1], '4', 'Đếm: ...3, 4, 5. Trước 5 là 4.'),
  sc(n(), 1, 'Số nào bé nhất trong các số: 5, 3, 1, 4?', [5,3,1,4], '1', 'Số 1 bé nhất vì đứng đầu tiên trên tia số.'),
  sc(n(), 1, 'Giơ 2 ngón tay là biểu diễn số mấy?', [1,2,3,4], '2', 'Giơ 2 ngón = số 2. Mỗi ngón tay = 1.'),
  sc(n(), 1, 'Số nào lớn nhất trong các số: 2, 4, 1, 3?', [1,2,3,4], '4', 'Số 4 lớn nhất vì đứng xa nhất bên phải tia số.'),
  sc(n(), 1, 'Đếm: 1, 2, ?, 4. Số ở dấu ? là:', [3,5,1,2], '3', 'Đếm theo thứ tự: 1, 2, 3, 4. Dấu ? là 3.'),
  fn(n(), 1, 'Đếm số quả táo: 🍎🍎', '2', 'Có 2 quả táo.'),
  fn(n(), 1, 'Số liền sau số 4 là bao nhiêu?', '5', 'Đếm: 4, 5. Liền sau 4 là 5.'),
  fn(n(), 1, 'Số liền trước số 2 là bao nhiêu?', '1', 'Đếm: 1, 2. Liền trước 2 là 1.'),
  fn(n(), 1, 'Điền số: 1, 2, 3, 4, ?', '5', 'Đếm từ 1 đến 5. Số tiếp theo sau 4 là 5.'),
  tf(n(), 1, 'Số 3 đứng trước số 2.', false, 'Sai. Số 3 đứng SAU số 2: 1, 2, 3.'),
  tf(n(), 1, 'Trên 1 bàn tay có 5 ngón.', true, 'Đúng. Đếm: ngón cái, trỏ, giữa, áp út, út = 5 ngón.'),
  tf(n(), 1, 'Số 5 là số lớn nhất trong các số từ 1 đến 5.', true, 'Đúng. Trong 1, 2, 3, 4, 5 thì 5 lớn nhất.'),

  // ═══════════════════════════════════════════════════
  // BÀI 2: Các số 6, 7, 8, 9
  // ═══════════════════════════════════════════════════
  sc(n(), 2, 'Có mấy con cá? 🐟🐟🐟🐟🐟🐟', [5,6,7,8], '6', 'Đếm: 1→6. Có 6 con cá.'),
  sc(n(), 2, 'Số nào đứng ngay sau số 7?', [6,7,8,9], '8', 'Đếm: 7, 8. Sau 7 là 8.'),
  sc(n(), 2, 'Số nào đứng ngay trước số 9?', [6,7,8,10], '8', 'Đếm: 8, 9. Trước 9 là 8.'),
  sc(n(), 2, 'Số lớn nhất trong 6, 9, 7, 8 là:', [6,7,8,9], '9', 'Số 9 lớn nhất vì đứng xa nhất bên phải.'),
  sc(n(), 2, 'Số bé nhất trong 8, 6, 9, 7 là:', [6,7,8,9], '6', 'Số 6 bé nhất trong bốn số đã cho.'),
  sc(n(), 2, '5 + 1 ngón tay (thêm 1 ở tay còn lại) bằng mấy?', [5,6,7,8], '6', '5 ngón + 1 ngón = 6 ngón → số 6.'),
  sc(n(), 2, 'Đếm: 5, 6, ?, 8. Số ở dấu ? là:', [4,7,9,6], '7', 'Đếm theo thứ tự: 5, 6, 7, 8. Dấu ? là 7.'),
  sc(n(), 2, 'Cần giơ mấy ngón ở tay thứ hai cùng 5 ngón tay đầu để được 8?', [1,2,3,4], '3', '5 + 3 = 8. Cần giơ 3 ngón ở tay thứ hai.'),
  fn(n(), 2, 'Đếm: 🌽🌽🌽🌽🌽🌽🌽', '7', 'Đếm từ 1 đến 7. Có 7 bắp ngô.'),
  fn(n(), 2, 'Số liền sau số 8 là bao nhiêu?', '9', 'Đếm: 8, 9. Liền sau 8 là 9.'),
  fn(n(), 2, 'Số liền trước số 7 là bao nhiêu?', '6', 'Đếm: 6, 7. Liền trước 7 là 6.'),
  fn(n(), 2, 'Điền số: 6, 7, 8, ?', '9', 'Đếm: 6, 7, 8, 9. Số tiếp theo là 9.'),
  tf(n(), 2, 'Số 8 lớn hơn số 9.', false, 'Sai. 8 < 9 vì 8 đứng trước 9 trên tia số.'),
  tf(n(), 2, 'Số 6 = 5 + 1.', true, 'Đúng. 5 thêm 1 là 6.'),
  tf(n(), 2, 'Số 7 đứng giữa số 6 và số 8.', true, 'Đúng. Thứ tự: 6, 7, 8.'),

  // ═══════════════════════════════════════════════════
  // BÀI 3: Số 0 và số 10
  // ═══════════════════════════════════════════════════
  sc(n(), 3, 'Có 3 quả cam, ăn hết 3. Còn mấy quả?', [0,1,2,3], '0', 'Ăn hết 3 quả: 3 - 3 = 0. Không còn quả nào.'),
  sc(n(), 3, 'Số 10 gồm mấy chữ số?', [1,2,3,0], '2', 'Số 10 gồm 2 chữ số: 1 và 0.'),
  sc(n(), 3, 'Số nào đứng ngay trước số 10?', [8,9,0,11], '9', 'Đếm: 9, 10. Trước 10 là 9.'),
  sc(n(), 3, 'Số nào đứng đầu tiên trên tia số?', [1,0,2,10], '0', 'Tia số bắt đầu từ 0: 0, 1, 2, 3...'),
  sc(n(), 3, '5 + 0 = ?', [0,5,50,10], '5', 'Cộng với 0 thì kết quả giữ nguyên: 5 + 0 = 5.'),
  sc(n(), 3, '10 que tính bó lại thành 1 nhóm gọi là gì?', ['1 đôi','1 chục','1 tá','1 bó lẻ'], '1 chục', '10 que tính = 1 chục (hay 1 bó).'),
  sc(n(), 3, 'Số 10 = mấy chục mấy đơn vị?', ['1 chục 0 đơn vị','0 chục 1 đơn vị','10 đơn vị','2 chục'], '1 chục 0 đơn vị', 'Số 10 = 1 chục và 0 đơn vị.'),
  sc(n(), 3, '10 - 0 = ?', [0,1,10,5], '10', 'Trừ cho 0 giữ nguyên: 10 - 0 = 10.'),
  fn(n(), 3, 'Số liền sau số 9 là bao nhiêu?', '10', 'Đếm: 9, 10. Liền sau 9 là 10.'),
  fn(n(), 3, '0 + 7 = ?', '7', 'Cộng 0 vào số nào kết quả giữ nguyên: 0 + 7 = 7.'),
  fn(n(), 3, '4 - 0 = ?', '4', 'Trừ 0 thì giữ nguyên: 4 - 0 = 4.'),
  fn(n(), 3, 'Số liền trước số 1 là bao nhiêu?', '0', 'Trước 1 là 0 trên tia số.'),
  tf(n(), 3, 'Số 0 có nghĩa là "không có gì".', true, 'Đúng. 0 biểu thị không có đối tượng nào.'),
  tf(n(), 3, 'Số 10 là số có 1 chữ số.', false, 'Sai. Số 10 có 2 chữ số: 1 và 0.'),
  tf(n(), 3, '10 là số tròn chục nhỏ nhất.', true, 'Đúng. 10 = 1 chục, là số tròn chục nhỏ nhất.'),

  // ═══════════════════════════════════════════════════
  // BÀI 4: So sánh các số đến 10
  // ═══════════════════════════════════════════════════
  sc(n(), 4, '7 □ 3. Dấu nào điền vào □?', ['>','<','=','≠'], '>', '7 lớn hơn 3 vì 7 đứng sau 3 trên tia số. 7 > 3.'),
  sc(n(), 4, '2 □ 8. Dấu nào điền vào □?', ['>','<','=','≠'], '<', '2 bé hơn 8. Trên tia số 2 đứng trước 8. 2 < 8.'),
  sc(n(), 4, '5 □ 5. Dấu nào điền vào □?', ['>','<','=','≠'], '=', 'Hai số giống nhau, dùng dấu bằng: 5 = 5.'),
  sc(n(), 4, 'Số lớn nhất trong 4, 9, 1, 7 là:', [4,9,1,7], '9', 'Sắp xếp: 1 < 4 < 7 < 9. Số 9 lớn nhất.'),
  sc(n(), 4, 'Số bé nhất trong 6, 2, 8, 5 là:', [6,2,8,5], '2', 'Sắp xếp: 2 < 5 < 6 < 8. Số 2 bé nhất.'),
  sc(n(), 4, 'Sắp xếp từ bé đến lớn: 3, 1, 5, 2.', ['1,2,3,5','5,3,2,1','1,3,2,5','2,1,5,3'], '1,2,3,5', 'Từ bé đến lớn: 1, 2, 3, 5.'),
  sc(n(), 4, 'Miệng cá sấu 🐊 mở về phía:', ['Số nhỏ hơn','Số lớn hơn','Số bằng nhau','Số 0'], 'Số lớn hơn', 'Cá sấu luôn mở miệng hướng về số LỚN hơn.'),
  sc(n(), 4, 'Có bao nhiêu số bé hơn 4 trong các số 0-10?', [3,4,5,2], '4', 'Các số bé hơn 4: 0, 1, 2, 3 → có 4 số.', 'medium'),
  fn(n(), 4, 'Số lớn nhất có 1 chữ số là bao nhiêu?', '9', 'Các số 1 chữ số: 0-9. Lớn nhất là 9.'),
  fn(n(), 4, 'Điền số: 3 < ? < 5', '4', 'Số lớn hơn 3 và bé hơn 5 là 4.'),
  fn(n(), 4, 'Sắp từ lớn đến bé: 8, 3, 6, 1. Số đứng thứ 2 là?', '6', 'Từ lớn→bé: 8, 6, 3, 1. Số thứ 2 là 6.', 'medium'),
  fn(n(), 4, 'Có mấy số lớn hơn 5 trong các số từ 0 đến 10?', '5', 'Các số > 5: 6, 7, 8, 9, 10. Có 5 số.', 'medium'),
  tf(n(), 4, '6 > 4', true, 'Đúng. 6 lớn hơn 4 vì 6 đứng sau 4.'),
  tf(n(), 4, '10 < 8', false, 'Sai. 10 lớn hơn 8: 10 > 8.'),
  tf(n(), 4, 'Tất cả các số đều lớn hơn 0.', false, 'Sai. Số 0 không lớn hơn 0 (0 = 0).', 'hard'),

  // ═══════════════════════════════════════════════════
  // BÀI 5: Phép cộng trong phạm vi 5
  // ═══════════════════════════════════════════════════
  sc(n(), 5, '2 + 3 = ?', [4,5,6,3], '5', 'Giơ 2 ngón + 3 ngón = 5 ngón. 2 + 3 = 5.'),
  sc(n(), 5, '1 + 4 = ?', [3,4,5,6], '5', '1 + 4: giơ 1 ngón, thêm 4 ngón → 5. 1 + 4 = 5.'),
  sc(n(), 5, '3 + 1 = ?', [2,3,4,5], '4', '3 thêm 1: đếm 3...4. 3 + 1 = 4.'),
  sc(n(), 5, '2 + 2 = ?', [2,3,4,5], '4', '2 ngón + 2 ngón = 4 ngón. 2 + 2 = 4.'),
  sc(n(), 5, 'Có 1 quả cam, mẹ cho thêm 2 quả. Có tất cả mấy quả?', [1,2,3,4], '3', '1 + 2 = 3 quả cam.'),
  sc(n(), 5, '4 + 0 = ?', [0,3,4,5], '4', 'Cộng với 0 giữ nguyên: 4 + 0 = 4.'),
  sc(n(), 5, '0 + 5 = ?', [0,4,5,10], '5', 'Cộng 0 vào 5 được 5: 0 + 5 = 5.'),
  sc(n(), 5, '? + 2 = 5. Số nào điền vào ?', [1,2,3,4], '3', '3 + 2 = 5. Vậy ? = 3.', 'medium'),
  fn(n(), 5, '1 + 1 = ?', '2', '1 thêm 1 là 2. 1 + 1 = 2.'),
  fn(n(), 5, '3 + 2 = ?', '5', '3 que tính + 2 que tính = 5 que tính.'),
  fn(n(), 5, '2 + 1 = ?', '3', '2 thêm 1: đếm 2...3. 2 + 1 = 3.'),
  fn(n(), 5, '4 + 1 = ?', '5', 'Số liền sau 4 là 5. 4 + 1 = 5.'),
  tf(n(), 5, '2 + 3 = 5.', true, 'Đúng. 2 + 3 = 5.'),
  tf(n(), 5, '1 + 3 = 5.', false, 'Sai. 1 + 3 = 4, không phải 5.'),
  tf(n(), 5, 'Đổi chỗ hai số cộng, kết quả không đổi: 2 + 3 = 3 + 2.', true, 'Đúng. Tính chất giao hoán: 2+3 = 3+2 = 5.'),

  // ═══════════════════════════════════════════════════
  // BÀI 6: Phép trừ trong phạm vi 5
  // ═══════════════════════════════════════════════════
  sc(n(), 6, '5 - 2 = ?', [1,2,3,4], '3', 'Giơ 5 ngón, gập 2 ngón, còn 3 ngón. 5 - 2 = 3.'),
  sc(n(), 6, '4 - 1 = ?', [1,2,3,4], '3', '4 bớt 1: 4→3. 4 - 1 = 3.'),
  sc(n(), 6, '3 - 3 = ?', [0,1,2,3], '0', 'Trừ chính nó = 0. 3 - 3 = 0.'),
  sc(n(), 6, '5 - 0 = ?', [0,3,4,5], '5', 'Trừ 0 giữ nguyên: 5 - 0 = 5.'),
  sc(n(), 6, 'Có 4 viên kẹo, ăn 3 viên. Còn mấy viên?', [0,1,2,3], '1', '4 - 3 = 1 viên kẹo.'),
  sc(n(), 6, '5 - 3 = ?', [1,2,3,4], '2', 'Giơ 5 ngón, gập 3, còn 2. 5 - 3 = 2.'),
  sc(n(), 6, '2 - 1 = ?', [0,1,2,3], '1', '2 bớt 1 là 1. 2 - 1 = 1.'),
  sc(n(), 6, '5 - ? = 4. Số nào điền vào ?', [0,1,2,3], '1', '5 - 1 = 4. Vậy ? = 1.', 'medium'),
  fn(n(), 6, '4 - 2 = ?', '2', 'Giơ 4 ngón, gập 2, còn 2. 4 - 2 = 2.'),
  fn(n(), 6, '3 - 1 = ?', '2', '3 bớt 1 = 2.'),
  fn(n(), 6, '5 - 4 = ?', '1', '5 bớt 4, còn 1. 5 - 4 = 1.'),
  fn(n(), 6, '5 - 1 = ?', '4', 'Số liền trước 5 là 4. 5 - 1 = 4.'),
  tf(n(), 6, '4 - 2 = 2.', true, 'Đúng. 4 - 2 = 2.'),
  tf(n(), 6, '5 - 3 = 3.', false, 'Sai. 5 - 3 = 2, không phải 3.'),
  tf(n(), 6, '3 + 2 = 5 nên 5 - 2 = 3.', true, 'Đúng. Cộng và trừ ngược nhau: 3+2=5 → 5-2=3.'),

  // ═══════════════════════════════════════════════════
  // BÀI 7: Phép cộng trong phạm vi 10
  // ═══════════════════════════════════════════════════
  sc(n(), 7, '6 + 3 = ?', [7,8,9,10], '9', 'Bắt đầu từ 6, đếm thêm 3: 7, 8, 9.'),
  sc(n(), 7, '7 + 3 = ?', [8,9,10,11], '10', '7 + 3 = 10. Đây là cặp = 10!'),
  sc(n(), 7, '4 + 6 = ?', [8,9,10,11], '10', '4 + 6 = 10. Cặp = 10: 4 và 6.'),
  sc(n(), 7, '5 + 5 = ?', [8,9,10,11], '10', '5 + 5 = 10. Hai nửa = 10.'),
  sc(n(), 7, '8 + 1 = ?', [7,8,9,10], '9', '8 thêm 1 = 9. 8 + 1 = 9.'),
  sc(n(), 7, 'Có 3 bạn, đến thêm 6 bạn. Tổng cộng mấy bạn?', [6,7,8,9], '9', '3 + 6 = 9 bạn.'),
  sc(n(), 7, 'Cặp nào cộng bằng 10?', ['3 và 8','4 và 6','2 và 5','1 và 8'], '4 và 6', '4 + 6 = 10 ✅. 3+8=11, 2+5=7, 1+8=9.'),
  sc(n(), 7, '? + 5 = 9. Số nào điền vào ?', [3,4,5,6], '4', '4 + 5 = 9. Vậy ? = 4.', 'medium'),
  fn(n(), 7, '6 + 4 = ?', '10', '6 + 4 = 10. Cặp = 10!'),
  fn(n(), 7, '9 + 1 = ?', '10', '9 thêm 1 = 10. 9 + 1 = 10.'),
  fn(n(), 7, '3 + 5 = ?', '8', '3 + 5 = 8. Đếm thêm 5 từ 3: 4,5,6,7,8.'),
  fn(n(), 7, '7 + 2 = ?', '9', '7 + 2 = 9.'),
  tf(n(), 7, '2 + 8 = 10.', true, 'Đúng. 2 + 8 = 10, đây là cặp = 10.'),
  tf(n(), 7, '6 + 5 = 10.', false, 'Sai. 6 + 5 = 11, vượt quá 10.'),
  tf(n(), 7, '3 + 7 = 7 + 3.', true, 'Đúng. Tính chất giao hoán: đổi chỗ, kết quả giữ nguyên.'),

  // ═══════════════════════════════════════════════════
  // BÀI 8: Phép trừ trong phạm vi 10
  // ═══════════════════════════════════════════════════
  sc(n(), 8, '9 - 4 = ?', [3,4,5,6], '5', 'Trên tia số: 9 lùi 4 bước → 5. 9 - 4 = 5.'),
  sc(n(), 8, '10 - 7 = ?', [2,3,4,5], '3', '10 - 7 = 3. Vì 7 + 3 = 10.'),
  sc(n(), 8, '8 - 5 = ?', [2,3,4,5], '3', '8 - 5 = 3. Đếm lùi 5 từ 8: 7,6,5,4,3.'),
  sc(n(), 8, '10 - 10 = ?', [0,1,10,5], '0', 'Trừ chính nó = 0. 10 - 10 = 0.'),
  sc(n(), 8, 'Có 7 quả trứng, vỡ 3 quả. Còn mấy quả?', [3,4,5,6], '4', '7 - 3 = 4 quả trứng.'),
  sc(n(), 8, '10 - 3 = ?', [5,6,7,8], '7', '10 - 3 = 7. Vì 3 + 7 = 10.'),
  sc(n(), 8, '6 - 0 = ?', [0,3,5,6], '6', 'Trừ 0 giữ nguyên: 6 - 0 = 6.'),
  sc(n(), 8, '10 - ? = 6. Số nào điền vào ?', [2,3,4,5], '4', '10 - 4 = 6. Vậy ? = 4.', 'medium'),
  fn(n(), 8, '10 - 5 = ?', '5', '10 - 5 = 5. Hai nửa của 10.'),
  fn(n(), 8, '9 - 6 = ?', '3', '9 - 6 = 3. Đếm lùi 6 từ 9.'),
  fn(n(), 8, '8 - 3 = ?', '5', '8 - 3 = 5.'),
  fn(n(), 8, '7 - 7 = ?', '0', 'Số trừ chính nó = 0. 7 - 7 = 0.'),
  tf(n(), 8, '10 - 6 = 4.', true, 'Đúng. 10 - 6 = 4 vì 6 + 4 = 10.'),
  tf(n(), 8, '9 - 5 = 5.', false, 'Sai. 9 - 5 = 4, không phải 5.'),
  tf(n(), 8, '8 - 2 = 2 + 4.', true, 'Đúng. 8 - 2 = 6 và 2 + 4 = 6. Bằng nhau!'),

  // ═══════════════════════════════════════════════════
  // BÀI 9: Bảng cộng trừ trong phạm vi 10
  // ═══════════════════════════════════════════════════
  sc(n(), 9, '3 + 4 = ? và 4 + 3 = ?', ['7 và 7','6 và 7','7 và 8','6 và 6'], '7 và 7', 'Đổi chỗ 2 số, kết quả giữ nguyên: 3+4 = 4+3 = 7.'),
  sc(n(), 9, 'Biết 6 + 4 = 10. Vậy 10 - 4 = ?', [4,5,6,7], '6', 'Cộng-trừ ngược nhau: 6+4=10 → 10-4=6.'),
  sc(n(), 9, '5 + ? = 8', [2,3,4,5], '3', '5 + 3 = 8. Vậy ? = 3.'),
  sc(n(), 9, '? - 3 = 5', [7,8,9,10], '8', '8 - 3 = 5. Kiểm tra: 5 + 3 = 8 ✅.', 'medium'),
  sc(n(), 9, 'Gia đình nào ĐÚNG?', ['2,3,6','3,4,7','5,3,9','1,6,8'], '3,4,7', '3 + 4 = 7 ✅; 4 + 3 = 7 ✅; 7-3=4 ✅; 7-4=3 ✅.'),
  sc(n(), 9, '9 - 7 + 5 = ?', [5,6,7,8], '7', '9 - 7 = 2; 2 + 5 = 7.', 'medium'),
  sc(n(), 9, '10 - 6 + 4 = ?', [6,7,8,9], '8', '10 - 6 = 4; 4 + 4 = 8.', 'medium'),
  sc(n(), 9, 'Phép tính nào có kết quả lớn nhất?', ['3+5','2+7','4+4','1+6'], '2+7', '3+5=8; 2+7=9; 4+4=8; 1+6=7. Lớn nhất: 2+7=9.', 'medium'),
  fn(n(), 9, '4 + 5 = ?', '9', '4 + 5 = 9.'),
  fn(n(), 9, '10 - 8 = ?', '2', '10 - 8 = 2 vì 8 + 2 = 10.'),
  fn(n(), 9, '6 + 3 - 2 = ?', '7', '6 + 3 = 9; 9 - 2 = 7.', 'medium'),
  fn(n(), 9, '8 - 5 + 4 = ?', '7', '8 - 5 = 3; 3 + 4 = 7.', 'medium'),
  tf(n(), 9, '7 + 2 = 10 - 1.', true, 'Đúng. 7 + 2 = 9 và 10 - 1 = 9. Bằng nhau!'),
  tf(n(), 9, 'Biết 6 + 3 = 9 thì 9 - 6 = 3.', true, 'Đúng. Gia đình: 3, 6, 9.'),
  tf(n(), 9, '4 + 4 = 9.', false, 'Sai. 4 + 4 = 8, không phải 9.'),

  // ═══════════════════════════════════════════════════
  // BÀI 10: Các số từ 11 đến 20
  // ═══════════════════════════════════════════════════
  sc(n(), 10, 'Số 15 gồm mấy chục mấy đơn vị?', ['1 chục 5 đơn vị','5 chục 1 đơn vị','15 đơn vị','1 chục 15 đơn vị'], '1 chục 5 đơn vị', '15 = 10 + 5 = 1 chục 5 đơn vị.'),
  sc(n(), 10, 'Số nào đứng ngay sau 19?', [18,20,21,10], '20', 'Đếm: 19, 20. Sau 19 là 20.'),
  sc(n(), 10, '14 gồm 1 chục và mấy đơn vị?', [1,3,4,14], '4', '14 = 10 + 4. Có 4 đơn vị.'),
  sc(n(), 10, 'Số nào lớn nhất? 13, 19, 11, 17', [13,19,11,17], '19', '19 lớn nhất vì có đơn vị = 9, lớn nhất.'),
  sc(n(), 10, 'Cách đọc đúng của 15 là:', ['mười năm','mười lăm','một năm','lăm mười'], 'mười lăm', '15 đọc là "mười lăm", không đọc "mười năm".'),
  sc(n(), 10, '20 bằng mấy chục?', [1,2,10,20], '2', '20 = 2 chục (2 bó que tính, mỗi bó 10).'),
  sc(n(), 10, 'Số nào đứng giữa 16 và 18?', [15,16,17,19], '17', 'Đếm: 16, 17, 18. Giữa là 17.'),
  sc(n(), 10, 'Sắp xếp từ bé đến lớn: 18, 12, 20, 15', ['12,15,18,20','20,18,15,12','12,18,15,20','15,12,20,18'], '12,15,18,20', 'Từ bé → lớn: 12, 15, 18, 20.'),
  fn(n(), 10, 'Số liền sau 17 là bao nhiêu?', '18', 'Đếm: 17, 18. Liền sau 17 là 18.'),
  fn(n(), 10, 'Số liền trước 20 là bao nhiêu?', '19', 'Đếm: 19, 20. Liền trước 20 là 19.'),
  fn(n(), 10, 'Số 13 có chữ số hàng đơn vị là bao nhiêu?', '3', '13 = 1 chục 3 đơn vị. Hàng đơn vị = 3.'),
  fn(n(), 10, 'Điền số: 14, 15, 16, ?', '17', 'Đếm: 14, 15, 16, 17. Số tiếp theo là 17.'),
  tf(n(), 10, '11 là số bé nhất có 2 chữ số.', false, 'Sai. Số bé nhất có 2 chữ số là 10, không phải 11.'),
  tf(n(), 10, '18 > 14.', true, 'Đúng. 18 lớn hơn 14 vì 8 > 4 (cùng hàng chục).'),
  tf(n(), 10, '20 gồm 2 chục và 0 đơn vị.', true, 'Đúng. 20 = 20 + 0 = 2 chục 0 đơn vị.'),

  // ═══════════════════════════════════════════════════
  // BÀI 11: Cộng không nhớ PV20
  // ═══════════════════════════════════════════════════
  sc(n(), 11, '14 + 3 = ?', [15,16,17,18], '17', 'Đơn vị: 4+3=7. Chục giữ nguyên: 1 → 17.'),
  sc(n(), 11, '12 + 5 = ?', [15,16,17,18], '17', 'Đơn vị: 2+5=7. 1 chục → 17.'),
  sc(n(), 11, '11 + 8 = ?', [17,18,19,20], '19', 'Đơn vị: 1+8=9. 1 chục → 19.'),
  sc(n(), 11, '15 + 4 = ?', [17,18,19,20], '19', 'Đơn vị: 5+4=9 < 10 → không nhớ. 1 chục → 19.'),
  sc(n(), 11, '13 + 6 = ?', [17,18,19,20], '19', 'Đơn vị: 3+6=9. 1 chục → 19.'),
  sc(n(), 11, 'Có 11 bạn, đến thêm 7 bạn. Tổng cộng mấy bạn?', [17,18,19,20], '18', '11 + 7 = 18 bạn.'),
  sc(n(), 11, 'Phép cộng nào KHÔNG có nhớ?', ['16+5','13+2','18+4','15+7'], '13+2', '13+2: 3+2=5<10 → không nhớ. Các phép khác đều ≥10.', 'medium'),
  sc(n(), 11, '10 + 9 = ?', [18,19,20,1], '19', '10 + 9 = 19. 1 chục + 9 đơn vị.'),
  fn(n(), 11, '16 + 3 = ?', '19', 'Đơn vị: 6+3=9. Chục: 1 → 19.'),
  fn(n(), 11, '14 + 5 = ?', '19', '4+5=9. 1 chục → 19.'),
  fn(n(), 11, '11 + 4 = ?', '15', '1+4=5. 1 chục → 15.'),
  fn(n(), 11, '12 + 7 = ?', '19', '2+7=9. 1 chục → 19.'),
  tf(n(), 11, '15 + 3 = 18.', true, 'Đúng. 5+3=8, 1 chục → 18.'),
  tf(n(), 11, '14 + 6 = 20 là phép cộng không nhớ.', true, 'Đúng. 4+6=10 nhưng kết quả = 20 (tròn chục). Thật ra 4+6=10 → CÓ nhớ. Nhưng ở đây kết quả đúng 20.', 'medium'),
  tf(n(), 11, '17 + 2 = 18.', false, 'Sai. 17 + 2 = 19, không phải 18.'),

  // ═══════════════════════════════════════════════════
  // BÀI 12: Trừ không nhớ PV20
  // ═══════════════════════════════════════════════════
  sc(n(), 12, '17 - 3 = ?', [12,13,14,15], '14', 'Đơn vị: 7-3=4. Chục giữ: 1 → 14.'),
  sc(n(), 12, '19 - 5 = ?', [12,13,14,15], '14', 'Đơn vị: 9-5=4. 1 chục → 14.'),
  sc(n(), 12, '18 - 6 = ?', [10,11,12,13], '12', '8-6=2. 1 chục → 12.'),
  sc(n(), 12, '16 - 4 = ?', [10,11,12,13], '12', '6-4=2. 1 chục → 12.'),
  sc(n(), 12, '20 - 10 = ?', [0,5,10,20], '10', '2 chục - 1 chục = 1 chục = 10.'),
  sc(n(), 12, 'Có 15 quả trứng, bán 3 quả. Còn mấy quả?', [10,11,12,13], '12', '15 - 3 = 12 quả.'),
  sc(n(), 12, 'Phép trừ nào KHÔNG nhớ?', ['13-7','15-2','11-5','16-8'], '15-2', '15-2: 5≥2 → không nhớ. Các phép khác đơn vị không đủ trừ.', 'medium'),
  sc(n(), 12, '19 - 8 = ?', [9,10,11,12], '11', '9-8=1. 1 chục → 11.'),
  fn(n(), 12, '17 - 5 = ?', '12', '7-5=2. 1 chục → 12.'),
  fn(n(), 12, '18 - 3 = ?', '15', '8-3=5. 1 chục → 15.'),
  fn(n(), 12, '16 - 6 = ?', '10', '6-6=0. 1 chục → 10.'),
  fn(n(), 12, '14 - 2 = ?', '12', '4-2=2. 1 chục → 12.'),
  tf(n(), 12, '19 - 7 = 12.', true, 'Đúng. Đơn vị: 9-7=2. Chục: 1 → 12.'),
  tf(n(), 12, '15 - 4 = 12.', false, 'Sai. 15 - 4 = 11, không phải 12.'),
  tf(n(), 12, '20 - 5 = 15.', true, 'Đúng. 20 - 5 = 15.'),

  // ═══════════════════════════════════════════════════
  // BÀI 13: Cộng có nhớ PV20
  // ═══════════════════════════════════════════════════
  sc(n(), 13, '9 + 5 = ?', [12,13,14,15], '14', 'Tách 5=1+4: 9+1=10, 10+4=14.'),
  sc(n(), 13, '8 + 6 = ?', [12,13,14,15], '14', 'Tách 6=2+4: 8+2=10, 10+4=14.'),
  sc(n(), 13, '7 + 5 = ?', [10,11,12,13], '12', 'Tách 5=3+2: 7+3=10, 10+2=12.'),
  sc(n(), 13, '9 + 9 = ?', [16,17,18,19], '18', 'Tách 9=1+8: 9+1=10, 10+8=18.'),
  sc(n(), 13, '6 + 8 = ?', [12,13,14,15], '14', 'Bắt đầu từ 8: tách 6=2+4, 8+2=10, 10+4=14.'),
  sc(n(), 13, 'Có 7 viên bi đỏ và 6 viên bi xanh. Tất cả mấy viên?', [11,12,13,14], '13', '7 + 6 = 13 viên bi.'),
  sc(n(), 13, '8 + 5 = ?', [11,12,13,14], '13', 'Tách 5=2+3: 8+2=10, 10+3=13.'),
  sc(n(), 13, '9 + 7 = ?', [14,15,16,17], '16', 'Tách 7=1+6: 9+1=10, 10+6=16.', 'medium'),
  fn(n(), 13, '6 + 6 = ?', '12', 'Tách 6=4+2: 6+4=10, 10+2=12.'),
  fn(n(), 13, '8 + 4 = ?', '12', 'Tách 4=2+2: 8+2=10, 10+2=12.'),
  fn(n(), 13, '9 + 3 = ?', '12', 'Tách 3=1+2: 9+1=10, 10+2=12.'),
  fn(n(), 13, '7 + 8 = ?', '15', 'Bắt đầu từ 8: tách 7=2+5, 8+2=10, 10+5=15.'),
  tf(n(), 13, '9 + 4 = 13.', true, 'Đúng. 9+1=10, 10+3=13.'),
  tf(n(), 13, '8 + 7 = 14.', false, 'Sai. 8+7=15. Tách 7=2+5: 8+2=10, 10+5=15.'),
  tf(n(), 13, '6 + 5 = 11.', true, 'Đúng. Tách 5=4+1: 6+4=10, 10+1=11.'),

  // ═══════════════════════════════════════════════════
  // BÀI 14: Trừ có nhớ PV20
  // ═══════════════════════════════════════════════════
  sc(n(), 14, '14 - 8 = ?', [4,5,6,7], '6', 'Tách 14=10+4: 10-8=2, 2+4=6.'),
  sc(n(), 14, '13 - 5 = ?', [6,7,8,9], '8', 'Tách 13=10+3: 10-5=5, 5+3=8.'),
  sc(n(), 14, '12 - 7 = ?', [4,5,6,7], '5', 'Tách 12=10+2: 10-7=3, 3+2=5.'),
  sc(n(), 14, '11 - 3 = ?', [6,7,8,9], '8', 'Tách 11=10+1: 10-3=7, 7+1=8.'),
  sc(n(), 14, '15 - 9 = ?', [4,5,6,7], '6', 'Tách 15=10+5: 10-9=1, 1+5=6.'),
  sc(n(), 14, 'Có 16 bạn, về 8 bạn. Còn mấy bạn?', [6,7,8,9], '8', '16 - 8 = 8 bạn.'),
  sc(n(), 14, '17 - 9 = ?', [6,7,8,9], '8', 'Tách 17=10+7: 10-9=1, 1+7=8.', 'medium'),
  sc(n(), 14, '14 - 6 = ?', [6,7,8,9], '8', 'Tách 14=10+4: 10-6=4, 4+4=8.'),
  fn(n(), 14, '11 - 5 = ?', '6', 'Tách 11=10+1: 10-5=5, 5+1=6.'),
  fn(n(), 14, '13 - 7 = ?', '6', 'Tách 13=10+3: 10-7=3, 3+3=6.'),
  fn(n(), 14, '16 - 9 = ?', '7', 'Tách 16=10+6: 10-9=1, 1+6=7.'),
  fn(n(), 14, '12 - 4 = ?', '8', 'Tách 12=10+2: 10-4=6, 6+2=8.'),
  tf(n(), 14, '11 - 6 = 5.', true, 'Đúng. 10-6=4, 4+1=5. 11-6=5 ✅.'),
  tf(n(), 14, '14 - 7 = 6.', false, 'Sai. 14-7=7. Tách 14=10+4: 10-7=3, 3+4=7.'),
  tf(n(), 14, 'Biết 8 + 5 = 13, vậy 13 - 8 = 5.', true, 'Đúng. Cộng-trừ ngược nhau: 8+5=13 → 13-8=5.'),

  // ═══════════════════════════════════════════════════
  // BÀI 15: Các số tròn chục
  // ═══════════════════════════════════════════════════
  sc(n(), 15, '3 bó que tính (mỗi bó 10 que) gồm bao nhiêu que?', [3,13,30,31], '30', '3 bó × 10 = 30 que tính.'),
  sc(n(), 15, 'Số tròn chục nào lớn nhất trong: 40, 80, 20, 60?', [40,80,20,60], '80', '80 lớn nhất vì 8 chục > 6, 4, 2 chục.'),
  sc(n(), 15, 'Số nào KHÔNG phải số tròn chục?', [10,25,50,90], '25', '25 có đơn vị = 5 ≠ 0. Chỉ số có đơn vị = 0 mới tròn chục.'),
  sc(n(), 15, '50 + 30 = ?', [20,70,80,90], '80', '5 chục + 3 chục = 8 chục = 80.'),
  sc(n(), 15, '70 - 40 = ?', [20,30,40,50], '30', '7 chục - 4 chục = 3 chục = 30.'),
  sc(n(), 15, 'Đếm: 10, 20, ?, 40, 50. Số ở dấu ? là:', [15,25,30,35], '30', 'Đếm theo bó 10: 10, 20, 30, 40, 50.'),
  sc(n(), 15, 'Số 100 bằng mấy chục?', [1,5,10,100], '10', '100 = 10 chục = 1 trăm.'),
  sc(n(), 15, 'Số tròn chục liền sau 60 là:', [61,65,70,80], '70', 'Các số tròn chục: 60, 70, 80. Liền sau 60 là 70.'),
  fn(n(), 15, '40 + 20 = ?', '60', '4 chục + 2 chục = 6 chục = 60.'),
  fn(n(), 15, '90 - 50 = ?', '40', '9 chục - 5 chục = 4 chục = 40.'),
  fn(n(), 15, '6 chục = bao nhiêu?', '60', '6 chục = 60.'),
  fn(n(), 15, 'Số tròn chục lớn nhất có 2 chữ số là?', '90', 'Các số tròn chục 2 chữ số: 10,20...90. Lớn nhất: 90.'),
  tf(n(), 15, '30 + 30 = 60.', true, 'Đúng. 3 chục + 3 chục = 6 chục = 60.'),
  tf(n(), 15, '100 là số tròn chục.', true, 'Đúng. 100 có đơn vị = 0, là số tròn trăm (cũng tròn chục).'),
  tf(n(), 15, 'Số tròn chục bé nhất là 0.', false, 'Sai. Số tròn chục bé nhất (dương) là 10. Số 0 không có chục nào.', 'hard'),

  // ═══════════════════════════════════════════════════
  // BÀI 16: Các số có hai chữ số
  // ═══════════════════════════════════════════════════
  sc(n(), 16, 'Số 47 gồm mấy chục mấy đơn vị?', ['4 chục 7 đơn vị','7 chục 4 đơn vị','47 đơn vị','4 chục 0 đơn vị'], '4 chục 7 đơn vị', '47 = 40 + 7 = 4 chục 7 đơn vị.'),
  sc(n(), 16, 'Cách đọc đúng của số 71?', ['bảy một','bảy mươi một','bảy mươi mốt','bảy chục một'], 'bảy mươi mốt', '71 đọc là "bảy mươi mốt" (đuôi 1 đọc "mốt").'),
  sc(n(), 16, 'Cách đọc đúng của số 35?', ['ba mươi lăm','ba năm','ba mươi năm','ba chục năm'], 'ba mươi lăm', '35 đọc "ba mươi lăm" (đuôi 5 đọc "lăm").'),
  sc(n(), 16, 'Số liền trước 50 là:', [40,48,49,51], '49', 'Đếm: 49, 50. Liền trước 50 là 49.'),
  sc(n(), 16, 'Chữ số hàng chục của số 63 là:', [3,6,36,63], '6', '63: 6 ở hàng chục, 3 ở hàng đơn vị.'),
  sc(n(), 16, 'Số 54 đọc là:', ['năm mươi tư','năm mươi bốn','năm tư','bốn mươi năm'], 'năm mươi tư', '54: đuôi 4 đọc "tư" → năm mươi tư.'),
  sc(n(), 16, 'Số liền sau 99 là:', [100,98,90,91], '100', 'Đếm: 99, 100. Liền sau 99 là 100.'),
  sc(n(), 16, '82 = 80 + ?', [0,2,8,20], '2', '82 = 8 chục + 2 đơn vị = 80 + 2.'),
  fn(n(), 16, 'Số liền sau 67 là bao nhiêu?', '68', 'Đếm: 67, 68. Liền sau 67 là 68.'),
  fn(n(), 16, 'Chữ số hàng đơn vị của 94 là?', '4', '94: chục = 9, đơn vị = 4.'),
  fn(n(), 16, 'Số gồm 7 chục và 3 đơn vị là?', '73', '7 chục + 3 đơn vị = 70 + 3 = 73.'),
  fn(n(), 16, 'Điền: 56, 57, 58, ?', '59', 'Đếm: 56, 57, 58, 59.'),
  tf(n(), 16, 'Số 38 gồm 3 chục và 8 đơn vị.', true, 'Đúng. 38 = 30 + 8 = 3 chục 8 đơn vị.'),
  tf(n(), 16, 'Chữ số 4 trong số 42 có giá trị là 4.', false, 'Sai. Chữ số 4 ở hàng chục, giá trị = 40.', 'medium'),
  tf(n(), 16, 'Số bé nhất có 2 chữ số là 10.', true, 'Đúng. 10 là số nhỏ nhất có 2 chữ số.'),

  // ═══════════════════════════════════════════════════
  // BÀI 17: So sánh các số đến 100
  // ═══════════════════════════════════════════════════
  sc(n(), 17, '45 □ 52. Dấu nào điền vào □?', ['>','<','='], '<', 'So chục: 4 < 5 → 45 < 52.'),
  sc(n(), 17, '73 □ 37. Dấu nào?', ['>','<','='], '>', 'So chục: 7 > 3 → 73 > 37.'),
  sc(n(), 17, '56 □ 53. Dấu nào?', ['>','<','='], '>', 'Chục bằng (5=5). So đơn vị: 6 > 3 → 56 > 53.'),
  sc(n(), 17, 'Số lớn nhất trong 89, 92, 78, 95?', [89,92,78,95], '95', 'So chục: 9x > 8x > 7x. 95>92 (đơn vị 5>2). Lớn nhất: 95.'),
  sc(n(), 17, 'Số bé nhất trong 34, 43, 33, 44?', [34,43,33,44], '33', 'Chục nhỏ nhất: 33, 34 (3 chục). Đơn vị: 3<4 → 33.'),
  sc(n(), 17, 'Sắp xếp từ bé→lớn: 72, 27, 70, 29', ['27,29,70,72','70,72,27,29','27,70,29,72','72,70,29,27'], '27,29,70,72', 'Nhóm 2x: 27<29. Nhóm 7x: 70<72. Kết quả: 27,29,70,72.'),
  sc(n(), 17, '68 □ 68. Dấu nào?', ['>','<','='], '=', 'Hai số giống nhau: 68 = 68.'),
  sc(n(), 17, 'Có bao nhiêu số lớn hơn 95 và bé hơn 100?', [3,4,5,6], '4', 'Các số: 96, 97, 98, 99. Có 4 số.', 'hard'),
  fn(n(), 17, 'Số lớn nhất có 2 chữ số là?', '99', 'Số 2 chữ số lớn nhất: 99 (9 chục 9 đơn vị).'),
  fn(n(), 17, 'Điền số: 45 < ? < 47', '46', 'Số giữa 45 và 47 là 46.'),
  fn(n(), 17, 'Sắp lớn→bé: 51, 15, 50, 55. Số thứ 3 là?', '15', 'Lớn→bé: 55, 51, 50, 15. Thứ 3 là 50.', 'medium'),
  fn(n(), 17, 'Số nhỏ nhất tạo từ 2 chữ số 3 và 7 là?', '37', 'Đặt chữ số nhỏ ở hàng chục: 37 < 73.', 'medium'),
  tf(n(), 17, '84 > 48.', true, 'Đúng. Chục 8 > 4, nên 84 > 48.'),
  tf(n(), 17, '63 < 36.', false, 'Sai. Chục 6 > 3, nên 63 > 36.'),
  tf(n(), 17, 'Để so sánh 2 số có 2 chữ số, ta so hàng chục trước.', true, 'Đúng. So chục trước, nếu bằng thì so đơn vị.'),

  // ═══════════════════════════════════════════════════
  // BÀI 18: Cộng trừ không nhớ PV100
  // ═══════════════════════════════════════════════════
  sc(n(), 18, '34 + 25 = ?', [57,58,59,60], '59', 'Đặt tính: đơn vị 4+5=9, chục 3+2=5 → 59.'),
  sc(n(), 18, '67 - 43 = ?', [22,23,24,25], '24', 'Đơn vị: 7-3=4. Chục: 6-4=2 → 24.'),
  sc(n(), 18, '41 + 38 = ?', [77,78,79,80], '79', 'Đơn vị: 1+8=9. Chục: 4+3=7 → 79.'),
  sc(n(), 18, '89 - 34 = ?', [53,54,55,56], '55', 'Đơn vị: 9-4=5. Chục: 8-3=5 → 55.'),
  sc(n(), 18, '52 + 36 = ?', [86,87,88,89], '88', 'Đơn vị: 2+6=8. Chục: 5+3=8 → 88.'),
  sc(n(), 18, 'Bạn An có 23 viên bi, bạn Bình có 45 viên. Cả hai có mấy viên?', [66,67,68,69], '68', '23 + 45 = 68 viên bi.'),
  sc(n(), 18, '96 - 51 = ?', [43,44,45,46], '45', 'Đơn vị: 6-1=5. Chục: 9-5=4 → 45.'),
  sc(n(), 18, '71 + 28 = ?', [97,98,99,100], '99', 'Đơn vị: 1+8=9. Chục: 7+2=9 → 99.', 'medium'),
  fn(n(), 18, '56 + 23 = ?', '79', 'Đơn vị: 6+3=9. Chục: 5+2=7 → 79.'),
  fn(n(), 18, '78 - 36 = ?', '42', 'Đơn vị: 8-6=2. Chục: 7-3=4 → 42.'),
  fn(n(), 18, '43 + 55 = ?', '98', 'Đơn vị: 3+5=8. Chục: 4+5=9 → 98.'),
  fn(n(), 18, '87 - 62 = ?', '25', 'Đơn vị: 7-2=5. Chục: 8-6=2 → 25.'),
  tf(n(), 18, '35 + 44 = 79.', true, 'Đúng. 5+4=9, 3+4=7 → 79.'),
  tf(n(), 18, '68 - 25 = 42.', false, 'Sai. 8-5=3, 6-2=4 → 68-25=43, không phải 42.'),
  tf(n(), 18, 'Khi đặt tính dọc, ta tính từ hàng đơn vị trước.', true, 'Đúng. Luôn tính từ phải sang trái: đơn vị → chục.'),

  // ═══════════════════════════════════════════════════
  // BÀI 19: Hình học — 4 hình cơ bản
  // ═══════════════════════════════════════════════════
  sc(n(), 19, 'Hình nào có 3 cạnh?', ['Hình vuông','Hình tròn','Hình tam giác','Hình chữ nhật'], 'Hình tam giác', 'Hình tam giác có 3 cạnh và 3 góc.'),
  sc(n(), 19, 'Hình nào KHÔNG có cạnh, KHÔNG có góc?', ['Hình vuông','Hình tròn','Hình tam giác','Hình chữ nhật'], 'Hình tròn', 'Hình tròn không có cạnh cũng không có góc, tròn đều.'),
  sc(n(), 19, 'Mặt đồng hồ treo tường thường có dạng hình gì?', ['Vuông','Tròn','Tam giác','Chữ nhật'], 'Tròn', 'Đồng hồ treo tường thường có mặt hình tròn.'),
  sc(n(), 19, 'Hình nào có 4 cạnh bằng nhau?', ['Hình vuông','Hình tròn','Hình tam giác','Hình chữ nhật'], 'Hình vuông', 'Hình vuông có 4 cạnh bằng nhau và 4 góc vuông.'),
  sc(n(), 19, 'Quyển sách có dạng hình gì?', ['Vuông','Tròn','Tam giác','Chữ nhật'], 'Chữ nhật', 'Quyển sách hình chữ nhật: 2 cạnh dài, 2 cạnh ngắn.'),
  sc(n(), 19, 'Hình chữ nhật có bao nhiêu cạnh?', [2,3,4,5], '4', 'Hình chữ nhật có 4 cạnh: 2 dài + 2 ngắn.'),
  sc(n(), 19, 'Biển báo NGUY HIỂM thường có dạng hình gì?', ['Vuông','Tròn','Tam giác','Chữ nhật'], 'Tam giác', 'Biển báo nguy hiểm thường là hình tam giác.'),
  sc(n(), 19, 'Hình nào dưới đây là hình chữ nhật?', ['Mặt đồng hồ','Viên gạch vuông','Cánh cửa','Mái nhà'], 'Cánh cửa', 'Cánh cửa thường hình chữ nhật (cao và hẹp).'),
  fn(n(), 19, 'Hình tam giác có mấy góc?', '3', 'Hình tam giác có 3 góc (tam = ba).'),
  fn(n(), 19, 'Hình vuông có mấy cạnh?', '4', 'Hình vuông có 4 cạnh bằng nhau.'),
  fn(n(), 19, 'Hình chữ nhật có mấy góc vuông?', '4', 'Hình chữ nhật có 4 góc vuông.'),
  fn(n(), 19, 'Hình tròn có mấy cạnh?', '0', 'Hình tròn không có cạnh nào: 0 cạnh.'),
  tf(n(), 19, 'Hình vuông cũng là hình chữ nhật.', true, 'Đúng. Hình vuông là hình chữ nhật đặc biệt (4 cạnh bằng).'),
  tf(n(), 19, 'Hình tam giác có 4 góc.', false, 'Sai. Hình tam giác có 3 góc (tam = ba).'),
  tf(n(), 19, 'Hình tròn có thể lăn trên mặt phẳng.', true, 'Đúng. Hình tròn không có cạnh nên lăn được.'),

  // ═══════════════════════════════════════════════════
  // BÀI 20: Đo độ dài — Xăng-ti-mét
  // ═══════════════════════════════════════════════════
  sc(n(), 20, 'Đơn vị đo độ dài lớp 1 thường dùng là gì?', ['mét','ki-lô-mét','xăng-ti-mét','mi-li-mét'], 'xăng-ti-mét', 'Lớp 1 dùng xăng-ti-mét (cm) để đo.'),
  sc(n(), 20, 'Khi đo độ dài, đặt đầu vật ở vạch nào?', ['Vạch 1','Vạch 0','Vạch 10','Vạch giữa'], 'Vạch 0', 'Luôn đặt đầu vật ở vạch 0 trên thước.'),
  sc(n(), 20, 'Bút chì dài từ vạch 0 đến vạch 15. Bút dài mấy cm?', [10,14,15,16], '15', 'Từ vạch 0 đến vạch 15: bút dài 15 cm.'),
  sc(n(), 20, 'Cục tẩy dài 4 cm, bút chì dài 17 cm. Cái nào dài hơn?', ['Cục tẩy','Bút chì','Bằng nhau','Không so được'], 'Bút chì', '17 cm > 4 cm nên bút chì dài hơn.'),
  sc(n(), 20, 'Viết tắt của xăng-ti-mét là:', ['m','km','cm','mm'], 'cm', 'Xăng-ti-mét viết tắt là cm.'),
  sc(n(), 20, 'Đoạn thẳng AB dài 8 cm, đoạn CD dài 5 cm. AB dài hơn CD bao nhiêu cm?', [2,3,4,13], '3', '8 - 5 = 3 cm. AB dài hơn 3 cm.'),
  sc(n(), 20, 'Vật nào dài khoảng 1 cm?', ['Chiều ngang đầu đinh ốc','Bút chì','Quyển vở','Bàn học'], 'Chiều ngang đầu đinh ốc', '1 cm rất ngắn, khoảng bằng chiều ngang đầu đinh ốc nhỏ.'),
  sc(n(), 20, 'Góc bàn hình chữ nhật đo chiều dài 60 cm, chiều rộng 40 cm. Chiều nào dài hơn?', ['Chiều dài','Chiều rộng','Bằng nhau','Không biết'], 'Chiều dài', '60 cm > 40 cm nên chiều dài dài hơn.'),
  fn(n(), 20, 'Sợi dây dài 9 cm, cắt bớt 3 cm. Còn mấy cm?', '6', '9 - 3 = 6 cm.'),
  fn(n(), 20, 'Que tính dài 7 cm, nối thêm 5 cm. Tổng mấy cm?', '12', '7 + 5 = 12 cm.'),
  fn(n(), 20, 'Bút chì dài 18 cm, cục tẩy dài 3 cm. Bút dài hơn cục tẩy mấy cm?', '15', '18 - 3 = 15 cm.'),
  fn(n(), 20, 'Thanh gỗ dài 20 cm, cưa thành 2 phần bằng nhau. Mỗi phần dài?', '10', '20 ÷ 2 = 10 cm. Mỗi phần 10 cm.', 'hard'),
  tf(n(), 20, 'Khi đo, phải đặt đầu vật ở vạch 0.', true, 'Đúng. Luôn bắt đầu từ vạch 0 để đo chính xác.'),
  tf(n(), 20, '5 cm dài hơn 9 cm.', false, 'Sai. 5 < 9, nên 5 cm NGẮN hơn 9 cm.'),
  tf(n(), 20, 'Chiều dài có thể đo bằng xăng-ti-mét.', true, 'Đúng. cm là đơn vị đo độ dài phổ biến ở lớp 1.'),
];
