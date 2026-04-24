/**
 * MATH EXPANSION — Thêm 15 bài/lớp × 5 lớp = 75 bài mới
 * Mỗi lớp: từ 20 bài lên 35 bài (bài 21-35)
 * Theo chương trình GDPT 2018 — bổ sung chủ đề còn thiếu
 * Lesson IDs: 20001-20075 | Card IDs: 50001+ | Question IDs: 30001+
 */

// ===================== LESSONS =====================
let lid = 20000;
const L = (grade: number, unit: string, code: string, title: string, obj: string, summary: string, tips: string, diff: 'easy'|'medium'|'hard', mins: number, sort: number) => ({
  id: ++lid, grade, subjectCode: 'math' as const,
  unitCode: unit, lessonCode: code,
  title, objective: obj, summarySimple: summary, tips,
  difficulty: diff, estimatedMinutes: mins,
  status: 'ready' as const, sortOrder: sort, isActive: 1,
});

export const mathExpLessons = [
  // ========== LỚP 1 — Bài 21-35 ==========
  L(1,'C1_so_den_10','L21_dem_nhom','Đếm và nhóm đồ vật','Biết đếm và nhóm các vật theo số lượng','Bé tập đếm nhóm vật','Đếm chậm từng nhóm nhé!','easy',10,21),
  L(1,'C1_so_den_10','L22_so_0','Số 0 — không có gì','Hiểu ý nghĩa của số 0','Bé học về số 0','Số 0 là khi không còn gì cả!','easy',8,22),
  L(1,'C2_cong_tru_10','L23_cong_3_so','Cộng 3 số trong phạm vi 10','Biết cộng liên tiếp 3 số','Cộng nhiều số cùng lúc','Cộng từng cặp rồi cộng tiếp nha!','medium',12,23),
  L(1,'C2_cong_tru_10','L24_tru_lien_tiep','Trừ liên tiếp trong phạm vi 10','Thực hiện phép trừ liên tiếp','Trừ nhiều lần liên tục','Trừ từ từ từng bước!','medium',12,24),
  L(1,'C3_so_den_20','L25_so_tron_chuc','Các số tròn chục','Nhận biết 10, 20, 30...','Bé học số tròn chục','10, 20, 30 — toàn số tròn!','easy',10,25),
  L(1,'C3_so_den_20','L26_phan_tich_so','Phân tích số: chục và đơn vị','Biết tách số thành chục và đơn vị','12 = 1 chục và 2 đơn vị','Nhớ: số bên trái là chục!','medium',12,26),
  L(1,'C4_so_den_100','L27_so_50_100','Các số từ 50 đến 100','Đọc viết các số từ 50 đến 100','Bé đếm từ 50 đến 100','Đếm tiếp từ 50 nhé!','easy',10,27),
  L(1,'C4_so_den_100','L28_ss_so_100','So sánh số trong phạm vi 100','So sánh các số đến 100','Số nào lớn hơn, nhỏ hơn?','So chục trước, rồi so đơn vị!','medium',12,28),
  L(1,'C4_so_den_100','L29_sap_xep_so','Sắp xếp số theo thứ tự','Sắp xếp tăng dần, giảm dần','Xếp số từ bé đến lớn','Tìm số nhỏ nhất trước!','medium',12,29),
  L(1,'C5_hinh_do','L30_do_dai_gang','Đo độ dài bằng gang tay','Biết đo bằng gang tay, bước chân','Bé đo bằng tay mình','Gang tay mỗi người khác nhau đó!','easy',10,30),
  L(1,'C5_hinh_do','L31_ngay_gio','Ngày trong tuần và giờ','Biết các ngày trong tuần, đọc giờ tròn','Bé học lịch và đồng hồ','Một tuần có 7 ngày!','easy',12,31),
  L(1,'C5_hinh_do','L32_tien_VN','Tiền Việt Nam đơn giản','Nhận biết các tờ tiền cơ bản','Bé nhận biết tiền Việt','Xem số trên tờ tiền nhé!','medium',10,32),
  L(1,'C1_so_den_10','L33_bai_toan_loi','Bài toán có lời văn đơn giản','Giải bài toán lời văn cộng trừ','Bé đọc đề và giải toán','Đọc kỹ đề, tìm phép tính!','medium',15,33),
  L(1,'C2_cong_tru_10','L34_on_tap_hk1','Ôn tập học kỳ 1','Ôn lại cộng trừ phạm vi 10','Ôn bài giữa năm','Làm lại bài cũ cho nhớ!','easy',15,34),
  L(1,'C5_hinh_do','L35_on_tap_hk2','Ôn tập cuối năm lớp 1','Ôn tập toàn bộ kiến thức lớp 1','Ôn hết bài lớp 1','Cố gắng lên, sắp lên lớp 2 rồi!','medium',15,35),

  // ========== LỚP 2 — Bài 21-35 ==========
  L(2,'C1','L21_cong_co_nho','Cộng có nhớ trong phạm vi 100','Thực hiện phép cộng có nhớ','Cộng mà nhớ sang hàng chục','Nhớ viết số nhớ lên trên!','medium',12,21),
  L(2,'C1','L22_tru_co_nho','Trừ có nhớ trong phạm vi 100','Thực hiện phép trừ có nhớ','Trừ khi hàng đơn vị không đủ','Mượn 1 chục = 10 đơn vị!','medium',12,22),
  L(2,'C2','L23_bang_nhan_3','Bảng nhân 3','Học thuộc bảng nhân 3','3, 6, 9, 12, 15...','Đọc to bảng nhân mỗi ngày!','medium',12,23),
  L(2,'C2','L24_bang_nhan_4','Bảng nhân 4','Học thuộc bảng nhân 4','4, 8, 12, 16, 20...','Nhân 4 = nhân 2 rồi nhân 2!','medium',12,24),
  L(2,'C2','L25_bang_nhan_5','Bảng nhân 5','Học thuộc bảng nhân 5','5, 10, 15, 20, 25...','Kết quả luôn tận cùng 0 hoặc 5!','easy',10,25),
  L(2,'C3','L26_do_cm_m','Xentimét và mét','Làm quen đơn vị cm và m','Bé đo bằng thước cm','1 mét = 100 xentimét!','easy',12,26),
  L(2,'C3','L27_do_kg','Kilôgam — cân nặng','Làm quen đơn vị kg','Bé học cân nặng vật','Dùng cân để đo kg!','easy',10,27),
  L(2,'C3','L28_do_lit','Lít — đo thể tích','Làm quen đon vị lít','Bé đong nước bằng lít','1 chai lớn = 1 lít nước!','easy',10,28),
  L(2,'C4','L29_chia_cho_2','Phép chia cho 2','Hiểu và thực hiện chia cho 2','Chia đều làm 2 phần','Chia 2 = mỗi bên bao nhiêu?','medium',12,29),
  L(2,'C4','L30_chia_cho_5','Phép chia cho 5','Thực hiện chia cho 5','Chia thành 5 nhóm bằng nhau','Dùng bảng nhân 5 ngược lại!','medium',12,30),
  L(2,'C4','L31_gap_lan','Gấp và giảm mấy lần','Hiểu khái niệm gấp/giảm','Gấp 3 lần, giảm 2 lần','Gấp = nhân, Giảm = chia!','medium',12,31),
  L(2,'C5','L32_hinh_chu_nhat','Hình chữ nhật — Hình vuông','Nhận biết và phân biệt Hình chữ nhật, Hình vuông','Bé tìm hình quanh nhà','Hình vuông có 4 cạnh bằng nhau!','easy',10,32),
  L(2,'C5','L33_duong_gap_khuc','Đường gấp khúc và độ dài','Tính độ dài đường gấp khúc','Cộng các đoạn thẳng lại','Đo từng đoạn rồi cộng!','medium',12,33),
  L(2,'C3','L34_on_tap_hk1_l2','Ôn tập học kỳ 1 lớp 2','Ôn lại kiến thức HK1','Ôn cộng trừ, bảng nhân','Làm bài ôn mỗi ngày!','easy',15,34),
  L(2,'C5','L35_on_tap_cuoi_l2','Ôn tập cuối năm lớp 2','Ôn toàn bộ Toán lớp 2','Ôn hết bài lớp 2','Chuẩn bị lên lớp 3 nào!','medium',15,35),

  // ========== LỚP 3 — Bài 21-35 ==========
  L(3,'M3C1','L21_nhan_ngoai_bang','Nhân ngoài bảng','Nhân số có 2 chữ số với số có 1 chữ số','23 × 4 = ?','Nhân từng hàng rồi cộng!','medium',12,21),
  L(3,'M3C1','L22_chia_co_du','Phép chia có dư','Hiểu phép chia có dư','13 ÷ 4 = 3 dư 1','Số dư phải nhỏ hơn số chia!','medium',15,22),
  L(3,'M3C2','L23_nhan_1000','Nhân trong phạm vi 1000','Nhân số có 3 chữ số','125 × 3 = ?','Nhân hàng đơn vị trước!','medium',15,23),
  L(3,'M3C2','L24_chia_1000','Chia trong phạm vi 1000','Chia số có 3 chữ số cho số có 1 chữ số','396 ÷ 3 = ?','Chia từ hàng lớn nhất!','hard',15,24),
  L(3,'M3C3','L25_phan_so_dg','Phân số đơn giản','Làm quen với phân số','1/2, 1/3, 1/4...','Tử số trên, mẫu số dưới!','medium',12,25),
  L(3,'M3C3','L26_ss_phan_so','So sánh phân số cùng mẫu','So sánh 2/5 và 3/5','Cùng mẫu: so tử số','Mẫu giống thì so tử thôi!','medium',12,26),
  L(3,'M3C4','L27_do_km','Kilômét — khoảng cách','Đơn vị đo km','Từ nhà đến trường bao xa?','1 km = 1000 m!','easy',10,27),
  L(3,'M3C4','L28_do_ngay_gio','Ngày, giờ, phút','Đọc giờ phút trên đồng hồ','3 giờ 15 phút = ?','1 giờ = 60 phút!','easy',12,28),
  L(3,'M3C4','L29_do_dien_tich','Diện tích — cm² đơn giản','Làm quen diện tích','Đếm ô vuông = diện tích','Mỗi ô vuông nhỏ = 1 cm²!','medium',12,29),
  L(3,'M3C5','L30_chu_vi_hcn','Chu vi hình chữ nhật','Tính chu vi Hình chữ nhật','(Dài + Rộng) × 2','Cộng 2 cạnh rồi nhân 2!','medium',12,30),
  L(3,'M3C5','L31_chu_vi_hv','Chu vi hình vuông','Tính chu vi hình vuông','Cạnh × 4','Hình vuông 4 cạnh bằng nhau!','easy',10,31),
  L(3,'M3C5','L32_goc_vuong','Góc vuông và góc không vuông','Nhận biết góc vuông','Dùng êke kiểm tra góc','Góc vuông = hình chữ L!','easy',10,32),
  L(3,'M3C3','L33_bai_toan_gap','Bài toán gấp — giảm lần','Giải bài toán gấp/giảm','Gấp 4 lần, giảm 3 lần','Gấp → nhân, Giảm → chia!','medium',15,33),
  L(3,'M3C1','L34_on_hk1_l3','Ôn tập HK1 lớp 3','Ôn nhân chia trong 1000','Ôn lại bài HK1','Luyện thêm cho vững!','easy',15,34),
  L(3,'M3C5','L35_on_cuoi_l3','Ôn tập cuối năm lớp 3','Ôn toàn bộ Toán lớp 3','Tổng ôn lớp 3','Sẵn sàng lên lớp 4!','medium',15,35),

  // ========== LỚP 4 — Bài 21-35 ==========
  L(4,'M4C1','L21_trieu_ty','Hàng triệu, hàng tỷ','Đọc viết số lớn hàng triệu, tỷ','1.000.000 = một triệu','Đếm số chữ số 0 nhé!','medium',12,21),
  L(4,'M4C1','L22_tinh_chat_cong','Tính chất phép cộng','Giao hoán, kết hợp','a + b = b + a','Đổi chỗ kết quả không đổi!','easy',10,22),
  L(4,'M4C2','L23_ps_thap_phan','Phân số thập phân','Phân số có mẫu 10, 100','3/10 = 0,3','Mẫu 10 → 1 số sau dấu phẩy!','medium',12,23),
  L(4,'M4C2','L24_quy_dong_ms','Quy đồng mẫu số','Quy đồng 2 phân số','2/3 và 1/4 → 8/12 và 3/12','Tìm mẫu chung nhỏ nhất!','hard',15,24),
  L(4,'M4C3','L25_cong_tru_ps','Cộng trừ phân số','Cộng trừ Phân số cùng/khác mẫu','2/3 + 1/6 = ?','Quy đồng trước rồi tính!','medium',15,25),
  L(4,'M4C3','L26_nhan_ps','Nhân phân số','Nhân 2 phân số','2/3 × 4/5 = 8/15','Tử nhân tử, mẫu nhân mẫu!','medium',12,26),
  L(4,'M4C3','L27_chia_ps','Chia phân số','Chia 2 phân số','2/3 ÷ 4/5 = ?','Chia = nhân nghịch đảo!','hard',15,27),
  L(4,'M4C4','L28_hinh_binh_hanh','Hình bình hành','Nhận biết và tính diện tích','S = đáy × cao','Tìm đáy và chiều cao!','medium',12,28),
  L(4,'M4C4','L29_hinh_thoi','Hình thoi','Nhận biết và tính diện tích','S = d1 × d2 ÷ 2','Hai đường chéo vuông góc!','medium',12,29),
  L(4,'M4C5','L30_dt_hinh_thang','Diện tích hình thang','Tính diện tích hình thang','S = (a+b) × h ÷ 2','Cộng 2 đáy, nhân cao, chia 2!','hard',15,30),
  L(4,'M4C5','L31_bieu_do','Biểu đồ cột','Đọc và vẽ biểu đồ cột','Bé đọc biểu đồ','Cột cao hơn = số lớn hơn!','easy',12,31),
  L(4,'M4C5','L32_trung_binh_cong','Trung bình cộng','Tính trung bình cộng','Tổng ÷ Số lượng','Cộng tất cả rồi chia đều!','medium',12,32),
  L(4,'M4C4','L33_tinh_chat_nhan','Tính chất phép nhân','Giao hoán, kết hợp, phân phối','a×(b+c) = a×b + a×c','Nhân chia trước, cộng trừ sau!','medium',12,33),
  L(4,'M4C1','L34_on_hk1_l4','Ôn tập HK1 lớp 4','Ôn số lớn, phân số','Ôn bài HK1','Luyện chăm chỉ nhé!','easy',15,34),
  L(4,'M4C5','L35_on_cuoi_l4','Ôn tập cuối năm lớp 4','Ôn toàn bộ Toán lớp 4','Tổng ôn lớp 4','Sắp lên lớp 5 rồi!','medium',15,35),

  // ========== LỚP 5 — Bài 21-35 ==========
  L(5,'M5C1','L21_tp_nhan_chia','Thập phân nhân chia','Nhân chia số thập phân','2,5 × 1,2 = ?','Nhân bình thường rồi đặt dấu phẩy!','medium',15,21),
  L(5,'M5C1','L22_lam_tron_so','Làm tròn số thập phân','Làm tròn đến hàng cần thiết','3,456 ≈ 3,46','Xem chữ số sau hàng làm tròn!','easy',10,22),
  L(5,'M5C2','L23_ti_so_phan_tram','Tỉ số phần trăm','Đổi phân số ↔ phần trăm','3/4 = 75%','Chia tử cho mẫu rồi ×100!','medium',12,23),
  L(5,'M5C2','L24_bai_toan_phan_tram','Bài toán tỉ số phần trăm','Giải bài toán phần trăm thực tế','Giảm giá 20% là bao nhiêu?','Tìm 1% trước rồi nhân!','hard',15,24),
  L(5,'M5C2','L25_ti_le_ban_do','Tỉ lệ bản đồ','Đọc và tính theo tỉ lệ bản đồ','1:100.000 nghĩa là gì?','1 cm trên bản đồ = thực tế!','medium',12,25),
  L(5,'M5C3','L26_the_tich_hhcn','Thể tích hình hộp chữ nhật','Tính thể tích HHCN','V = dài × rộng × cao','Nhân 3 kích thước!','medium',12,26),
  L(5,'M5C3','L27_the_tich_hlp','Thể tích hình lập phương','Tính thể tích HLP','V = a × a × a = a³','Cạnh × cạnh × cạnh!','easy',10,27),
  L(5,'M5C3','L28_the_tich_hinh_tru','Thể tích hình trụ (giới thiệu)','Làm quen thể tích hình trụ','V = S đáy × chiều cao','Tròn nhân cao!','hard',15,28),
  L(5,'M5C4','L29_bieu_do_hinh_quạt','Biểu đồ hình quạt','Đọc biểu đồ hình quạt','Phần nào lớn nhất?','Miếng to nhất = nhiều nhất!','easy',12,29),
  L(5,'M5C4','L30_xac_suat_dg','Xác suất đơn giản','Làm quen khái niệm xác suất','Tung xúc xắc ra số 6?','Có bao nhiêu cách?','medium',12,30),
  L(5,'M5C4','L31_bieu_thuc_chua_x','Biểu thức chứa x','Tìm x trong phương trình đơn giản','x + 5 = 12, x = ?','Chuyển vế đổi dấu!','medium',12,31),
  L(5,'M5C5','L32_on_hinh_hoc','Ôn tập hình học','Ôn chu vi, diện tích, thể tích','Tính S, V các hình','Nhớ công thức từng hình!','medium',15,32),
  L(5,'M5C5','L33_on_so_hoc','Ôn tập số học','Ôn phân số, thập phân, phần trăm','Tính toán tổng hợp','Quy tắc ưu tiên phép tính!','medium',15,33),
  L(5,'M5C5','L34_on_hk1_l5','Ôn tập HK1 lớp 5','Ôn kiến thức nửa năm','Ôn bài giữa năm','Chăm chỉ ôn tập nào!','easy',15,34),
  L(5,'M5C5','L35_tong_on_l5','Tổng ôn tập cuối cấp Tiểu học','Ôn toàn bộ Toán Tiểu học','Sẵn sàng lên THCS!','Bé rất giỏi, cố lên!','hard',20,35),
];

// ===================== CARDS =====================
let cid = 50000;
const C = (lessonId: number, type: 'intro'|'explain'|'example'|'tip'|'mini_check', title: string, content: string, order: number) => ({
  id: ++cid, lessonId, cardType: type, title, content,
  exampleJson: null, sortOrder: order, isActive: 1,
});

export const mathExpCards = mathExpLessons.flatMap(l => [
  C(l.id, 'intro', `Giới thiệu: ${l.title}`, l.summarySimple, 1),
  C(l.id, 'explain', `Bài giảng: ${l.title}`, l.objective, 2),
  C(l.id, 'example', `Ví dụ: ${l.title}`, l.tips, 3),
  C(l.id, 'tip', `Mẹo nhớ: ${l.title}`, `💡 ${l.tips}`, 4),
]);

// ===================== QUESTIONS =====================
let qid = 30000;
const Q = (grade: number, lessonId: number, type: 'single_choice'|'true_false'|'fill_number'|'ordering'|'matching'|'fill_text'|'multi_choice', text: string, opts: string, correct: string, explain: string, diff: 'easy'|'medium'|'hard', skill: string) => ({
  id: ++qid, grade, subjectCode: 'math' as const, lessonId,
  questionType: type, questionText: text,
  optionsJson: opts, correctAnswer: correct,
  explanationSimple: explain, difficulty: diff,
  skillTag: skill, sourceType: 'generated' as const,
  isVerified: 1, isActive: 1,
});

// Helper tạo câu hỏi theo pattern
function mathQ(grade: number, lid: number, diff: 'easy'|'medium'|'hard', questions: Array<[string, string, string, string, string]>) {
  return questions.map(([text, opts, correct, explain, skill]) =>
    Q(grade, lid, opts.startsWith('[') ? 'single_choice' as const : (opts === '' ? 'fill_number' as const : 'true_false' as const), text, opts, correct, explain, diff, skill)
  );
}

export const mathExpQuestions = [
  // ===== LỚP 1 — 15 bài × ~8 câu = ~120 câu =====
  // Bài 21: Đếm và nhóm
  ...mathQ(1, 20001, 'easy', [
    ['Đếm số quả táo: 🍎🍎🍎🍎🍎. Có bao nhiêu quả?', '["3","4","5","6"]', '5', 'Đếm từng quả: 1,2,3,4,5', 'dem_so'],
    ['Nhóm nào có 3 con vật?', '["🐶🐱🐰","🐶🐱","🐶🐱🐰🐬"]', '🐶🐱🐰', 'Đếm: chó, mèo, thỏ = 3 con', 'dem_so'],
    ['4 + 3 = ?', '', '7', '4 cộng 3 bằng 7', 'phep_cong'],
    ['Có 6 bông hoa, thêm 2 bông. Có tất cả bao nhiêu?', '["7","8","9","6"]', '8', '6 + 2 = 8 bông hoa', 'bai_toan_loi'],
    ['8 > 5 đúng hay sai?', '["Đúng","Sai"]', 'Đúng', '8 lớn hơn 5', 'so_sanh'],
    ['Sắp xếp tăng dần: 5, 2, 8', '["2, 5, 8","8, 5, 2","5, 2, 8"]', '2, 5, 8', 'Nhỏ nhất là 2, rồi 5, rồi 8', 'sap_xep'],
  ]),
  // Bài 22: Số 0
  ...mathQ(1, 20002, 'easy', [
    ['Có 3 kẹo, ăn hết 3 kẹo. Còn lại bao nhiêu?', '', '0', '3 - 3 = 0, không còn kẹo nào', 'phep_tru'],
    ['5 + 0 = ?', '["0","5","50","10"]', '5', 'Cộng 0 thì giữ nguyên', 'phep_cong'],
    ['0 + 7 = ?', '', '7', '0 cộng 7 bằng 7', 'phep_cong'],
    ['Số nào nhỏ nhất trong các số: 3, 0, 5, 1?', '["0","1","3","5"]', '0', '0 là số nhỏ nhất', 'so_sanh'],
    ['9 - 0 = 9 đúng hay sai?', '["Đúng","Sai"]', 'Đúng', 'Trừ 0 thì giữ nguyên', 'phep_tru'],
  ]),
  // Bài 23-35 Lớp 1 (rút gọn mỗi bài ~5-6 câu)
  ...mathQ(1, 20003, 'medium', [
    ['2 + 3 + 4 = ?', '', '9', '2+3=5, 5+4=9', 'phep_cong'], ['1 + 5 + 3 = ?', '["8","9","10","7"]', '9', '1+5=6, 6+3=9', 'phep_cong'],
    ['4 + 2 + 1 = ?', '', '7', '4+2=6, 6+1=7', 'phep_cong'], ['3 + 3 + 3 = ?', '["6","9","8","10"]', '9', '3+3=6, 6+3=9', 'phep_cong'],
    ['2 + 5 + 2 = 9 đúng hay sai?', '["Đúng","Sai"]', 'Đúng', '2+5=7, 7+2=9. Đúng!', 'phep_cong'],
  ]),
  ...mathQ(1, 20004, 'medium', [
    ['9 - 3 - 2 = ?', '', '4', '9-3=6, 6-2=4', 'phep_tru'], ['10 - 4 - 3 = ?', '["2","3","4","1"]', '3', '10-4=6, 6-3=3', 'phep_tru'],
    ['8 - 2 - 2 = ?', '', '4', '8-2=6, 6-2=4', 'phep_tru'], ['7 - 1 - 5 = ?', '["0","1","2","3"]', '1', '7-1=6, 6-5=1', 'phep_tru'],
    ['10 - 5 - 5 = 0 đúng hay sai?', '["Đúng","Sai"]', 'Đúng', '10-5=5, 5-5=0', 'phep_tru'],
  ]),
  ...mathQ(1, 20005, 'easy', [
    ['Số tròn chục nào sau đây: 15, 20, 33?', '["15","20","33"]', '20', '20 có hàng đơn vị là 0', 'so_tron_chuc'],
    ['30 đọc là?', '["Ba mươi","Mười ba","Ba trăm"]', 'Ba mươi', '30 = ba mươi', 'doc_so'],
    ['50 gồm mấy chục?', '', '5', '50 = 5 chục', 'phan_tich_so'],
    ['Số tròn chục lớn nhất có 2 chữ số?', '["90","100","80","99"]', '90', '90 là số tròn chục lớn nhất < 100', 'so_sanh'],
  ]),
  ...mathQ(1, 20006, 'medium', [
    ['15 gồm mấy chục và mấy đơn vị?', '["1 chục 5 đơn vị","5 chục 1 đơn vị"]', '1 chục 5 đơn vị', '15 = 10 + 5', 'phan_tich_so'],
    ['Số 18: hàng chục là?', '', '1', '18 có 1 ở hàng chục', 'phan_tich_so'],
    ['12 = 10 + ?', '', '2', '12 = 1 chục + 2 đơn vị', 'phan_tich_so'],
    ['Số nào có 1 chục 7 đơn vị?', '["71","17","70","107"]', '17', '1 chục 7 đơn vị = 17', 'phan_tich_so'],
  ]),
  ...mathQ(1, 20007, 'easy', [['55 đọc là?', '["Năm mươi lăm","Năm lăm","Lăm mươi năm"]', 'Năm mươi lăm', '55 = năm mươi lăm', 'doc_so'],['Viết số: bảy mươi hai', '', '72', 'Bảy mươi hai = 72', 'viet_so'],['Số liền sau 99 là?', '', '100', '99 + 1 = 100', 'day_so'],['67 > 76 đúng hay sai?', '["Đúng","Sai"]', 'Sai', '67 < 76 vì 6 < 7 ở hàng chục', 'so_sanh']]),
  ...mathQ(1, 20008, 'medium', [['45 ○ 54, điền dấu?', '["<",">","="]', '<', '45 < 54', 'so_sanh'],['Sắp xếp tăng dần: 82, 28, 55', '["28, 55, 82","82, 55, 28","55, 28, 82"]', '28, 55, 82', 'Nhỏ nhất 28, rồi 55, rồi 82', 'sap_xep'],['Số lớn nhất: 91, 19, 90?', '["91","19","90"]', '91', '91 > 90 > 19', 'so_sanh'],['99 là số lớn nhất có 2 chữ số đúng hay sai?', '["Đúng","Sai"]', 'Đúng', '99 là số có 2 chữ số lớn nhất', 'so_sanh']]),
  ...mathQ(1, 20009, 'medium', [['Sắp xếp giảm dần: 34, 78, 56', '["78, 56, 34","34, 56, 78"]', '78, 56, 34', '78 > 56 > 34', 'sap_xep'],['Số liền trước 50 là?', '', '49', '50 - 1 = 49', 'day_so'],['Các số chẵn từ 2 đến 10: 2, 4, 6, ?, 10', '', '8', '2, 4, 6, 8, 10', 'day_so'],['Số 100 có 3 chữ số đúng hay sai?', '["Đúng","Sai"]', 'Đúng', '100 = 1-0-0 = 3 chữ số', 'phan_tich_so']]),
  ...mathQ(1, 20010, 'easy', [['Bàn dài 5 gang tay. Đo bằng gì?', '["Gang tay","Thước kẻ","Cân"]', 'Gang tay', 'Đo bằng gang tay', 'do_luong'],['Kim ngắn chỉ 3, kim dài chỉ 12. Mấy giờ?', '["3 giờ","12 giờ","9 giờ"]', '3 giờ', 'Kim ngắn = giờ, kim dài chỉ 12 = giờ tròn', 'do_luong'],['Thước kẻ dùng để đo gì?', '["Cân nặng","Độ dài","Nhiệt độ"]', 'Độ dài', 'Thước kẻ đo độ dài', 'do_luong'],['1 bước chân dài hơn 1 gang tay đúng hay sai?', '["Đúng","Sai"]', 'Đúng', 'Bước chân dài hơn gang tay', 'do_luong']]),
  ...mathQ(1, 20011, 'easy', [['Hôm nay thứ Hai, ngày mai là thứ mấy?', '["Thứ Ba","Thứ Tư","Chủ Nhật"]', 'Thứ Ba', 'Sau thứ Hai là thứ Ba', 'thoi_gian'],['1 tuần có mấy ngày?', '', '7', '1 tuần = 7 ngày', 'thoi_gian'],['Kim ngắn chỉ 7. Đó là mấy giờ?', '', '7', 'Kim ngắn chỉ số giờ', 'thoi_gian'],['Tháng 1 có 31 ngày đúng hay sai?', '["Đúng","Sai"]', 'Đúng', 'Tháng 1 luôn có 31 ngày', 'thoi_gian']]),
  ...mathQ(1, 20012, 'medium', [['Tờ tiền nào nhỏ nhất?', '["1.000đ","5.000đ","10.000đ"]', '1.000đ', '1000 < 5000 < 10000', 'tien_te'],['Mua kẹo 2.000đ, đưa 5.000đ. Thối bao nhiêu?', '', '3000', '5000 - 2000 = 3000đ', 'tien_te'],['10.000đ = mấy tờ 5.000đ?', '', '2', '10000 ÷ 5000 = 2 tờ', 'tien_te']]),
  ...mathQ(1, 20013, 'medium', [['An có 5 kẹo, Bình cho thêm 3 kẹo. An có tất cả bao nhiêu?', '', '8', '5 + 3 = 8 kẹo', 'bai_toan_loi'],['Có 9 con chim, bay đi 4 con. Còn lại mấy con?', '["4","5","6","3"]', '5', '9 - 4 = 5 con', 'bai_toan_loi'],['Mẹ mua 6 quả cam và 3 quả táo. Hỏi mẹ mua tất cả bao nhiêu quả?', '', '9', '6 + 3 = 9 quả', 'bai_toan_loi'],['Bài toán "thêm" dùng phép gì?', '["Cộng","Trừ","Nhân"]', 'Cộng', 'Thêm = cộng', 'bai_toan_loi']]),
  ...mathQ(1, 20014, 'easy', [['5 + 4 = ?', '', '9', '5 + 4 = 9', 'phep_cong'],['10 - 7 = ?', '', '3', '10 - 7 = 3', 'phep_tru'],['Số lớn nhất có 1 chữ số?', '["9","10","8"]', '9', '9 là số lớn nhất 1 chữ số', 'so_sanh'],['3 + 6 = 6 + 3 đúng hay sai?', '["Đúng","Sai"]', 'Đúng', 'Đổi chỗ các số hạng, tổng không đổi', 'phep_cong']]),
  ...mathQ(1, 20015, 'medium', [['17 + 2 = ?', '', '19', '17 + 2 = 19', 'phep_cong'],['20 - 8 = ?', '', '12', '20 - 8 = 12', 'phep_tru'],['Hình tam giác có mấy cạnh?', '', '3', 'Tam giác có 3 cạnh', 'hinh_hoc'],['Số chẵn liền sau 18 là?', '["19","20","16"]', '20', 'Số chẵn liền sau 18 là 20', 'day_so']]),

  // ===== LỚP 2-5: Mỗi bài ~5 câu (compact) =====
  // LỚP 2
  ...mathQ(2, 20016, 'medium', [['37 + 25 = ?', '', '62', '7+5=12, viết 2 nhớ 1, 3+2+1=6', 'cong_co_nho'],['48 + 36 = ?', '["74","84","94","64"]', '84', '8+6=14, viết 4 nhớ 1, 4+3+1=8', 'cong_co_nho'],['56 + 27 = ?', '', '83', '6+7=13, viết 3 nhớ 1', 'cong_co_nho'],['Cộng có nhớ là khi tổng hàng đơn vị ≥ 10 đúng hay sai?', '["Đúng","Sai"]', 'Đúng', 'Đúng! Khi ≥ 10 thì nhớ 1 sang hàng chục', 'cong_co_nho']]),
  ...mathQ(2, 20017, 'medium', [['63 - 28 = ?', '', '35', '13-8=5, 5-2=3 → 35', 'tru_co_nho'],['52 - 17 = ?', '["35","45","25","55"]', '35', '12-7=5, 4-1=3 → 35', 'tru_co_nho'],['80 - 43 = ?', '', '37', '10-3=7, 7-4=3 → 37', 'tru_co_nho'],['Trừ có nhớ: mượn 1 chục = 10 đơn vị đúng hay sai?', '["Đúng","Sai"]', 'Đúng', 'Mượn 1 chục thêm 10 đơn vị', 'tru_co_nho']]),
  ...mathQ(2, 20018, 'medium', [['3 × 6 = ?', '', '18', '3×6=18', 'bang_nhan'],['3 × 9 = ?', '["24","27","21","30"]', '27', '3×9=27', 'bang_nhan'],['3 × 4 + 3 = 3 × ?', '["5","4","6"]', '5', '3×4+3 = 12+3 = 15 = 3×5', 'bang_nhan'],['Bảng nhân 3: 3,6,9,12,?,18', '', '15', '12+3=15', 'bang_nhan']]),
  ...mathQ(2, 20019, 'medium', [['4 × 7 = ?', '', '28', '4×7=28', 'bang_nhan'],['4 × 8 = ?', '["24","28","32","36"]', '32', '4×8=32', 'bang_nhan'],['4 × 5 = ?', '', '20', '4×5=20', 'bang_nhan'],['4 × 9 > 35 đúng hay sai?', '["Đúng","Sai"]', 'Đúng', '4×9=36 > 35', 'bang_nhan']]),
  ...mathQ(2, 20020, 'easy', [['5 × 6 = ?', '', '30', '5×6=30', 'bang_nhan'],['5 × 8 = ?', '["30","35","40","45"]', '40', '5×8=40', 'bang_nhan'],['5 × 5 = ?', '', '25', '5×5=25', 'bang_nhan'],['Kết quả nhân 5 luôn tận cùng 0 hoặc 5 đúng hay sai?', '["Đúng","Sai"]', 'Đúng', 'Đúng! 5×bất kỳ luôn có tận cùng 0 hoặc 5', 'bang_nhan']]),
  ...mathQ(2, 20021, 'easy', [['1m = ? cm', '', '100', '1 mét = 100 xentimét', 'do_luong'],['Bút chì dài khoảng bao nhiêu cm?', '["15cm","150cm","1cm"]', '15cm', 'Bút chì khoảng 15cm', 'do_luong'],['2m = ? cm', '', '200', '2 × 100 = 200cm', 'do_luong']]),
  ...mathQ(2, 20022, 'easy', [['Quả dưa hấu nặng khoảng?', '["3 kg","3 g","30 kg"]', '3 kg', 'Dưa hấu khoảng 3 kg', 'do_luong'],['1 kg = 1000 g đúng hay sai?', '["Đúng","Sai"]', 'Đúng', '1 kilôgam = 1000 gam', 'do_luong'],['Con gà nặng 2 kg, con vịt nặng 3 kg. Tổng?', '', '5', '2+3=5 kg', 'do_luong']]),
  ...mathQ(2, 20023, 'easy', [['1 chai nước lớn chứa ? lít', '["1 lít","10 lít","100 lít"]', '1 lít', 'Chai nước thông thường chứa 1 lít', 'do_luong'],['Can 5 lít, đã dùng 2 lít. Còn ? lít', '', '3', '5-2=3 lít', 'do_luong'],['Đong nước dùng đơn vị gì?', '["Lít","Mét","Kg"]', 'Lít', 'Nước đong bằng lít', 'do_luong']]),
  ...mathQ(2, 20024, 'medium', [['12 ÷ 2 = ?', '', '6', '12 chia 2 = 6', 'phep_chia'],['18 ÷ 2 = ?', '["8","9","10","7"]', '9', '18÷2=9', 'phep_chia'],['Có 14 kẹo chia đều 2 bạn. Mỗi bạn?', '', '7', '14÷2=7', 'phep_chia'],['20 ÷ 2 = 10 đúng hay sai?', '["Đúng","Sai"]', 'Đúng', '20÷2=10', 'phep_chia']]),
  ...mathQ(2, 20025, 'medium', [['25 ÷ 5 = ?', '', '5', '25÷5=5', 'phep_chia'],['40 ÷ 5 = ?', '["6","7","8","9"]', '8', '40÷5=8', 'phep_chia'],['35 ÷ 5 = ?', '', '7', '35÷5=7', 'phep_chia']]),
  ...mathQ(2, 20026, 'medium', [['Gấp 4 lần số 5 = ?', '', '20', '5×4=20', 'gap_giam'],['24 giảm 3 lần = ?', '["6","7","8","9"]', '8', '24÷3=8', 'gap_giam'],['Gấp 2 lần = phép gì?', '["Nhân","Chia","Cộng"]', 'Nhân', 'Gấp = nhân', 'gap_giam'],['Giảm mấy lần dùng phép chia đúng hay sai?', '["Đúng","Sai"]', 'Đúng', 'Giảm mấy lần = chia cho bấy nhiêu', 'gap_giam']]),
  ...mathQ(2, 20027, 'easy', [['Hình vuông có mấy cạnh bằng nhau?', '', '4', 'Hình vuông có 4 cạnh bằng nhau', 'hinh_hoc'],['Hình nào có 4 góc vuông?', '["Hình tròn","Hình chữ nhật","Hình tam giác"]', 'Hình chữ nhật', 'Hình chữ nhật có 4 góc vuông', 'hinh_hoc'],['Hình chữ nhật có 2 cạnh dài bằng nhau đúng hay sai?', '["Đúng","Sai"]', 'Đúng', 'Hình chữ nhật có 2 cạnh dài + 2 cạnh ngắn bằng nhau', 'hinh_hoc']]),
  ...mathQ(2, 20028, 'medium', [['Đường gấp khúc có 3 đoạn: 4cm, 5cm, 3cm. Tổng dài?', '', '12', '4+5+3=12cm', 'do_luong'],['Đường gấp khúc gồm các đoạn thẳng nối nhau đúng hay sai?', '["Đúng","Sai"]', 'Đúng', 'Đường gấp khúc = nhiều đoạn thẳng nối', 'hinh_hoc'],['Chu vi tam giác cạnh 3, 4, 5 cm?', '', '12', '3+4+5=12cm', 'hinh_hoc']]),
  ...mathQ(2, 20029, 'easy', [['45 + 28 = ?', '', '73', '5+8=13, viết 3 nhớ 1', 'cong_co_nho'],['3 × 7 = ?', '', '21', '3×7=21', 'bang_nhan'],['100 - 36 = ?', '["64","54","74"]', '64', '10-6=4, 9-3=6 → 64', 'tru_co_nho']]),
  ...mathQ(2, 20030, 'medium', [['4 × 9 = ?', '', '36', '4×9=36', 'bang_nhan'],['72 - 38 = ?', '', '34', '12-8=4, 6-3=3 → 34', 'tru_co_nho'],['5 × 7 + 5 = ?', '["35","40","45"]', '40', '35+5=40', 'bang_nhan'],['50 ÷ 5 = ?', '', '10', '50÷5=10', 'phep_chia']]),

  // ===== LỚP 3 =====
  ...mathQ(3, 20031, 'medium', [['23 × 4 = ?', '', '92', '3×4=12 viết 2 nhớ 1, 2×4=8+1=9', 'nhan_ngoai_bang'],['15 × 6 = ?', '["80","90","96","85"]', '90', '5×6=30 viết 0 nhớ 3, 1×6=6+3=9', 'nhan_ngoai_bang'],['32 × 3 = ?', '', '96', '2×3=6, 3×3=9 → 96', 'nhan_ngoai_bang'],['41 × 2 = 82 đúng hay sai?', '["Đúng","Sai"]', 'Đúng', '1×2=2, 4×2=8 → 82', 'nhan_ngoai_bang']]),
  ...mathQ(3, 20032, 'medium', [['13 ÷ 4 = ? dư ?', '["3 dư 1","4 dư 1","3 dư 2"]', '3 dư 1', '4×3=12, 13-12=1', 'chia_co_du'],['17 ÷ 5 = ?', '["3 dư 2","4 dư 2","3 dư 3"]', '3 dư 2', '5×3=15, 17-15=2', 'chia_co_du'],['Số dư phải nhỏ hơn số chia đúng hay sai?', '["Đúng","Sai"]', 'Đúng', 'Số dư luôn < số chia', 'chia_co_du'],['20 ÷ 3 = ?', '["6 dư 2","7 dư 1","6 dư 1"]', '6 dư 2', '3×6=18, 20-18=2', 'chia_co_du']]),
  ...mathQ(3, 20033, 'medium', [['125 × 3 = ?', '', '375', '5×3=15 viết 5 nhớ 1', 'nhan_1000'],['234 × 2 = ?', '["468","458","478"]', '468', '4×2=8, 3×2=6, 2×2=4', 'nhan_1000'],['300 × 3 = ?', '', '900', '3×3=9, thêm 2 số 0', 'nhan_1000']]),
  ...mathQ(3, 20034, 'hard', [['396 ÷ 3 = ?', '', '132', 'Chia từng chữ số', 'chia_1000'],['845 ÷ 5 = ?', '["168","169","170","167"]', '169', '8÷5=1 dư 3, 34÷5=6 dư 4, 45÷5=9', 'chia_1000'],['600 ÷ 4 = ?', '', '150', '6÷4=1 dư 2, 20÷4=5, 0÷4=0', 'chia_1000']]),
  ...mathQ(3, 20035, 'medium', [['1/2 nghĩa là gì?', '["Một phần hai","Hai phần một","Hai"]', 'Một phần hai', 'Tử/Mẫu = 1/2 = một nửa', 'phan_so'],['Pizza chia 4 phần, ăn 1. Còn lại?', '["3/4","1/4","2/4"]', '3/4', '4-1=3, còn 3 phần = 3/4', 'phan_so'],['1/3 > 1/4 đúng hay sai?', '["Đúng","Sai"]', 'Đúng', 'Cùng tử, mẫu nhỏ hơn thì Phân số lớn hơn', 'phan_so']]),
  ...mathQ(3, 20036, 'medium', [['So sánh: 2/5 ○ 3/5', '["<",">","="]', '<', 'Cùng mẫu 5: 2 < 3', 'phan_so'],['4/7 ○ 2/7 = ?', '["<",">","="]', '>', '4 > 2 nên 4/7 > 2/7', 'phan_so'],['1/5 + 3/5 = ?', '["4/5","4/10","3/5"]', '4/5', 'Cùng mẫu: 1+3=4, giữ mẫu 5', 'phan_so']]),
  ...mathQ(3, 20037, 'easy', [['1 km = ? m', '', '1000', '1 km = 1000 m', 'do_luong'],['Quãng đường HN-HP khoảng 100 km nghĩa là?', '["100.000 m","10.000 m","1.000 m"]', '100.000 m', '100 × 1000 = 100.000 m', 'do_luong'],['5 km = ? m', '', '5000', '5 × 1000 = 5000 m', 'do_luong']]),
  ...mathQ(3, 20038, 'easy', [['1 giờ = ? phút', '', '60', '1 giờ = 60 phút', 'thoi_gian'],['2 giờ 15 phút = ? phút', '["135","125","145"]', '135', '2×60+15=135', 'thoi_gian'],['Kim phút chỉ 6, nghĩa là?', '["30 phút","6 phút","15 phút"]', '30 phút', 'Kim phút chỉ 6 = 30 phút', 'thoi_gian']]),
  ...mathQ(3, 20039, 'medium', [['Hình vuông cạnh 3cm có diện tích?', '["9 cm²","12 cm²","6 cm²"]', '9 cm²', '3×3=9 cm²', 'dien_tich'],['Đếm 12 ô vuông = ? cm²', '', '12', 'Mỗi ô = 1 cm²', 'dien_tich'],['Diện tích đo bằng cm², m² đúng hay sai?', '["Đúng","Sai"]', 'Đúng', 'Cm² và m² là đơn vị diện tích', 'dien_tich']]),
  ...mathQ(3, 20040, 'medium', [['Chu vi Hình chữ nhật dài 5cm, rộng 3cm?', '', '16', '(5+3)×2=16cm', 'chu_vi'],['Chu vi Hình chữ nhật = (dài + rộng) × 2 đúng hay sai?', '["Đúng","Sai"]', 'Đúng', 'Công thức chu vi Hình chữ nhật', 'chu_vi'],['Hình chữ nhật dài 8m, rộng 4m. Chu vi = ?', '["24m","32m","20m"]', '24m', '(8+4)×2=24m', 'chu_vi']]),
  ...mathQ(3, 20041, 'easy', [['Chu vi hình vuông cạnh 6cm?', '', '24', '6×4=24cm', 'chu_vi'],['Chu vi hình vuông = cạnh × ?', '', '4', 'Chu vi Hình vuông = cạnh × 4', 'chu_vi'],['Hình vuông cạnh 10m, Chu vi = ?', '["40m","100m","20m"]', '40m', '10×4=40m', 'chu_vi']]),
  ...mathQ(3, 20042, 'easy', [['Góc vuông giống hình chữ gì?', '["L","O","S"]', 'L', 'Góc vuông = hình chữ L', 'hinh_hoc'],['Dùng dụng cụ gì kiểm tra góc vuông?', '["Êke","Compa","Thước kẻ"]', 'Êke', 'Dùng êke đo góc vuông', 'hinh_hoc']]),
  ...mathQ(3, 20043, 'medium', [['Gấp 4 lần số 8 = ?', '', '32', '8×4=32', 'gap_giam'],['45 giảm 5 lần = ?', '', '9', '45÷5=9', 'gap_giam'],['Tuổi mẹ gấp 5 lần tuổi con. Con 6 tuổi, mẹ?', '["25","30","35"]', '30', '6×5=30 tuổi', 'gap_giam']]),
  ...mathQ(3, 20044, 'easy', [['156 × 4 = ?', '', '624', '6×4=24 viết 4 nhớ 2', 'nhan_1000'],['1/2 + 1/2 = ?', '["1","2/4","1/2"]', '1', '1/2+1/2=2/2=1', 'phan_so']]),
  ...mathQ(3, 20045, 'medium', [['Chu vi Hình chữ nhật dài 12cm, rộng 6cm?', '', '36', '(12+6)×2=36cm', 'chu_vi'],['250 × 4 = ?', '', '1000', '25×4=100, thêm 0', 'nhan_1000'],['17 ÷ 3 = ? dư ?', '["5 dư 2","6 dư 1","5 dư 3"]', '5 dư 2', '3×5=15, 17-15=2', 'chia_co_du']]),

  // ===== LỚP 4 =====
  ...mathQ(4, 20046, 'medium', [['Viết số: ba triệu hai trăm nghìn', '', '3200000', '3.200.000', 'so_lon'],['1.000.000 có mấy chữ số 0?', '["5","6","7"]', '6', 'Một triệu có 6 số 0', 'so_lon'],['Số 5.678.900 có chữ số 6 ở hàng?', '["Trăm nghìn","Chục nghìn","Nghìn"]', 'Trăm nghìn', '6 ở vị trí trăm nghìn', 'so_lon']]),
  ...mathQ(4, 20047, 'easy', [['15 + 27 = 27 + 15 đúng hay sai?', '["Đúng","Sai"]', 'Đúng', 'Tính chất giao hoán', 'tinh_chat'],['(12 + 8) + 5 = 12 + (8 + 5) đúng hay sai?', '["Đúng","Sai"]', 'Đúng', 'Tính chất kết hợp', 'tinh_chat'],['47 + 53 = ?', '', '100', '47+53=100', 'tinh_chat']]),
  ...mathQ(4, 20048, 'medium', [['3/10 = ? (thập phân)', '["0,3","0,03","3,0"]', '0,3', 'Mẫu 10 → 1 số sau dấu phẩy', 'phan_so_tp'],['25/100 = ?', '["0,25","2,5","0,025"]', '0,25', 'Mẫu 100 → 2 số sau dấu phẩy', 'phan_so_tp'],['0,7 = ?/10', '', '7', '0,7 = 7/10', 'phan_so_tp']]),
  ...mathQ(4, 20049, 'hard', [['QĐ 2/3 và 1/4. MSC = ?', '["12","7","6"]', '12', 'BCNN(3,4)=12', 'quy_dong'],['2/3 = ?/12', '', '8', '2×4/3×4 = 8/12', 'quy_dong'],['1/4 = ?/12', '', '3', '1×3/4×3 = 3/12', 'quy_dong']]),
  ...mathQ(4, 20050, 'medium', [['2/3 + 1/6 = ?', '["5/6","3/9","1/2"]', '5/6', 'QĐ: 4/6+1/6=5/6', 'ps_cong_tru'],['4/5 - 1/5 = ?', '', '3/5', 'Cùng mẫu: 4-1=3', 'ps_cong_tru'],['3/4 + 1/4 = 1 đúng hay sai?', '["Đúng","Sai"]', 'Đúng', '3/4+1/4=4/4=1', 'ps_cong_tru']]),
  ...mathQ(4, 20051, 'medium', [['2/3 × 4/5 = ?', '["8/15","6/8","8/8"]', '8/15', 'Tử×tử=8, Mẫu×mẫu=15', 'ps_nhan'],['1/2 × 1/2 = ?', '', '1/4', '1×1=1, 2×2=4', 'ps_nhan'],['3 × 2/5 = ?', '["6/5","5/6","6/15"]', '6/5', '3×2=6, mẫu giữ 5', 'ps_nhan']]),
  ...mathQ(4, 20052, 'hard', [['2/3 ÷ 4/5 = ?', '["10/12","8/15","5/6"]', '10/12', '2/3 × 5/4 = 10/12', 'ps_chia'],['1/2 ÷ 3 = ?', '["1/6","3/2","1/3"]', '1/6', '1/2 × 1/3 = 1/6', 'ps_chia'],['Chia Phân số = nhân nghịch đảo đúng hay sai?', '["Đúng","Sai"]', 'Đúng', 'a÷b/c = a×c/b', 'ps_chia']]),
  ...mathQ(4, 20053, 'medium', [['S hình bình hành đáy 8cm, cao 5cm?', '', '40', '8×5=40 cm²', 'dien_tich'],['S = đáy × cao dùng cho hình gì?', '["Bình hành","Tam giác","Tròn"]', 'Bình hành', 'S HBH = đáy × cao', 'dien_tich']]),
  ...mathQ(4, 20054, 'medium', [['S hình thoi d1=6, d2=8?', '', '24', '6×8÷2=24 cm²', 'dien_tich'],['Hình thoi có 2 đường chéo vuông góc đúng hay sai?', '["Đúng","Sai"]', 'Đúng', '2 đường chéo HT vuông góc', 'dien_tich']]),
  ...mathQ(4, 20055, 'hard', [['S hình thang a=6, b=10, h=4?', '', '32', '(6+10)×4÷2=32 cm²', 'dien_tich'],['Công thức S hình thang?', '["(a+b)×h÷2","a×b÷2","a×h"]', '(a+b)×h÷2', 'S=(đáy lớn + đáy nhỏ)×cao÷2', 'dien_tich']]),
  ...mathQ(4, 20056, 'easy', [['Biểu đồ cột: cột A=5, cột B=8. Cột nào cao hơn?', '["A","B"]', 'B', '8 > 5', 'thong_ke'],['Đọc biểu đồ: lớp có 15 nam, 20 nữ. Tổng?', '', '35', '15+20=35', 'thong_ke']]),
  ...mathQ(4, 20057, 'medium', [['Trung bình cộng: 4, 6, 8?', '', '6', '(4+6+8)÷3=18÷3=6', 'trung_binh'],['TBC 10, 20, 30, 40 = ?', '["20","25","30"]', '25', '100÷4=25', 'trung_binh']]),
  ...mathQ(4, 20058, 'medium', [['a × (b + c) = ?', '["a×b + a×c","a×b × a×c","(a+b)×c"]', 'a×b + a×c', 'Tính chất phân phối', 'tinh_chat'],['25 × 4 = ?', '', '100', '25×4=100', 'tinh_chat']]),
  ...mathQ(4, 20059, 'easy', [['3/4 + 1/4 = ?', '', '1', '3/4+1/4=4/4=1', 'ps_cong_tru'],['1.000.000 × 5 = ?', '["5.000.000","500.000","50.000.000"]', '5.000.000', '1 triệu × 5 = 5 triệu', 'so_lon']]),
  ...mathQ(4, 20060, 'medium', [['S Hình chữ nhật dài 12cm, rộng 7cm?', '', '84', '12×7=84 cm²', 'dien_tich'],['TBC: 15, 25, 20 = ?', '', '20', '60÷3=20', 'trung_binh'],['5/6 - 1/3 = ?', '["1/2","4/3","2/6"]', '1/2', 'QĐ: 5/6-2/6=3/6=1/2', 'ps_cong_tru']]),

  // ===== LỚP 5 =====
  ...mathQ(5, 20061, 'medium', [['2,5 × 1,2 = ?', '', '3', '25×12=300, đặt dấu phẩy: 3,00=3', 'thap_phan'],['0,8 × 0,5 = ?', '["0,4","4","0,04"]', '0,4', '8×5=40, 2 số sau phẩy: 0,40=0,4', 'thap_phan'],['7,2 ÷ 0,9 = ?', '', '8', '72÷9=8', 'thap_phan']]),
  ...mathQ(5, 20062, 'easy', [['Làm tròn 3,456 đến hàng phần mười?', '["3,5","3,4","3,46"]', '3,5', '3,456 → 3,5 (5≥5 nên làm tròn lên)', 'lam_tron'],['7,82 ≈ ? (hàng đơn vị)', '', '8', '7,82 → 8 (8≥5)', 'lam_tron']]),
  ...mathQ(5, 20063, 'medium', [['3/4 = ?%', '', '75', '3÷4=0,75 → 75%', 'phan_tram'],['0,2 = ?%', '["2%","20%","200%"]', '20%', '0,2 × 100 = 20%', 'phan_tram'],['50% = phân số nào?', '["1/2","1/5","5/10"]', '1/2', '50/100=1/2', 'phan_tram']]),
  ...mathQ(5, 20064, 'hard', [['Áo giá 200.000đ, giảm 15%. Giá mới?', '', '170000', '200.000 × 15% = 30.000, 200.000-30.000=170.000', 'phan_tram'],['Lớp có 40 Học sinh, 60% nữ. Có bao nhiêu nữ?', '["20","24","28"]', '24', '40×60%=40×0,6=24', 'phan_tram']]),
  ...mathQ(5, 20065, 'medium', [['Bản đồ tỉ lệ 1:100.000. 5cm = ? km', '', '5', '5×100.000=500.000cm=5km', 'ti_le'],['1:50.000 nghĩa là 1cm = ? m', '["50","500","5000"]', '500', '50.000cm=500m', 'ti_le']]),
  ...mathQ(5, 20066, 'medium', [['V hộp chữ nhật: dài 5, rộng 3, cao 4?', '', '60', '5×3×4=60', 'the_tich'],['V = dài × rộng × cao dùng cho hình gì?', '["Hộp chữ nhật","Hình vuông","Hình tròn"]', 'Hộp chữ nhật', 'HHCN có V=d×r×c', 'the_tich']]),
  ...mathQ(5, 20067, 'easy', [['V hình lập phương cạnh 4cm?', '', '64', '4×4×4=64 cm³', 'the_tich'],['V = a³ nghĩa là?', '["a×a×a","a×3","3×a"]', 'a×a×a', 'a³ = a nhân a nhân a', 'the_tich']]),
  ...mathQ(5, 20068, 'hard', [['Hình trụ bán kính 3cm, cao 10cm. V ≈ ?', '["282,6 cm³","94,2 cm³","188,4 cm³"]', '282,6 cm³', 'V=π×r²×h=3,14×9×10=282,6', 'the_tich']]),
  ...mathQ(5, 20069, 'easy', [['Biểu đồ quạt: 25% xanh, 50% đỏ, 25% vàng. Phần nào lớn nhất?', '["Xanh","Đỏ","Vàng"]', 'Đỏ', '50% > 25%', 'thong_ke'],['Phần 1/4 trên biểu đồ quạt = ?%', '', '25', '1/4=25%', 'thong_ke']]),
  ...mathQ(5, 20070, 'medium', [['Tung xúc xắc, xác suất ra số 6?', '["1/6","1/3","1/2"]', '1/6', '1 mặt số 6 trong 6 mặt', 'xac_suat'],['Tung đồng xu, xác suất sấp?', '["1/2","1/4","1/3"]', '1/2', '1 mặt sấp trong 2 mặt', 'xac_suat']]),
  ...mathQ(5, 20071, 'medium', [['x + 5 = 12, x = ?', '', '7', 'x=12-5=7', 'bieu_thuc'],['x × 3 = 24, x = ?', '', '8', 'x=24÷3=8', 'bieu_thuc'],['2 × x - 4 = 10, x = ?', '["5","7","8"]', '7', '2x=14, x=7', 'bieu_thuc']]),
  ...mathQ(5, 20072, 'medium', [['S hình thang (5+9)×4÷2 = ?', '', '28', '14×4÷2=28', 'hinh_hoc'],['Chu vi hình tròn đường kính 10cm ≈ ?', '["31,4cm","20cm","15,7cm"]', '31,4cm', 'C=π×d=3,14×10=31,4', 'hinh_hoc']]),
  ...mathQ(5, 20073, 'medium', [['3/5 + 0,4 = ?', '["1","0,8","1,4"]', '1', '3/5=0,6, 0,6+0,4=1', 'tong_hop'],['20% của 50 = ?', '', '10', '50×0,2=10', 'phan_tram']]),
  ...mathQ(5, 20074, 'easy', [['1/2 + 1/3 = ?', '["5/6","2/5","1/5"]', '5/6', 'QĐ: 3/6+2/6=5/6', 'phan_so'],['2,5 + 3,7 = ?', '', '6.2', '2,5+3,7=6,2', 'thap_phan']]),
  ...mathQ(5, 20075, 'hard', [['V HHCN dài 10cm, rộng 5cm, cao 4cm?', '', '200', '10×5×4=200cm³', 'the_tich'],['25% của 400 = ?', '', '100', '400×25/100=100', 'phan_tram'],['TBC: 80, 90, 70, 100 = ?', '["80","85","90"]', '85', '340÷4=85', 'trung_binh']]),
];
