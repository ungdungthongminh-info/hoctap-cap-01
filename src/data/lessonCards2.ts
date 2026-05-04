/**
 * THẺ NỘI DUNG — Toán Lớp 2 (80 thẻ, 4/bài)
 * IDs: 81–160 | lessonIds: 21–40
 */
import type { LessonCard } from './seedData';

let cid = 80; // Tiếp nối từ lessonCards.ts (Grade 1 = 1-80)
const card = (lid: number, type: LessonCard['cardType'], title: string, content: string, sort: number, ex: string | null = null): LessonCard => ({
  id: ++cid, lessonId: lid, cardType: type, title, content, exampleJson: ex, sortOrder: sort, isActive: 1,
});

export const allLessonCards2: LessonCard[] = [
  // === BÀI 21: Ôn tập cộng phạm vi 20 ===
  card(21, 'intro', 'Nhớ lại phép cộng', 'Phép cộng là gộp hai nhóm lại. Ví dụ: 8 quả cam + 5 quả cam = 13 quả cam 🍊', 1),
  card(21, 'explain', 'Tách số để cộng', 'Khi cộng có nhớ, ta tách số. Ví dụ: 8+5 → tách 5 = 2+3 → 8+2=10, 10+3=13', 2),
  card(21, 'example', 'Ví dụ tính nhẩm', '9+4 = ? → Tách 4 = 1+3 → 9+1=10, 10+3=13 ✅', 3, '{"pheptinh":"9+4=13","cach":"9+1+3"}'),
  card(21, 'tip', 'Mẹo nhớ nhanh', 'Luôn cộng để được 10 trước! Số 9 cần thêm 1, số 8 cần thêm 2, số 7 cần thêm 3 💡', 4),

  // === BÀI 22: Ôn tập trừ phạm vi 20 ===
  card(22, 'intro', 'Nhớ lại phép trừ', 'Phép trừ là bớt đi. Ví dụ: 15 cái kẹo, ăn 7 cái, còn 8 cái kẹo 🍬', 1),
  card(22, 'explain', 'Tách số để trừ', 'Khi trừ có nhớ: 15-7 → tách 7=5+2 → 15-5=10, 10-2=8', 2),
  card(22, 'example', 'Ví dụ tính nhẩm', '13-6 = ? → Tách 6=3+3 → 13-3=10, 10-3=7 ✅', 3, '{"pheptinh":"13-6=7","cach":"13-3-3"}'),
  card(22, 'tip', 'Mẹo nhớ nhanh', 'Trừ xuống 10 trước rồi trừ tiếp! Luôn nhớ: cộng và trừ là phép ngược nhau 🔄', 4),

  // === BÀI 23: Bảng cộng và bảng trừ ===
  card(23, 'intro', 'Bảng cộng', 'Bảng cộng giúp ta tính nhanh. Hãy học thuộc bảng cộng trong phạm vi 20! 📊', 1),
  card(23, 'explain', 'Mối liên hệ cộng-trừ', 'Nếu 8+5=13 thì 13-8=5 và 13-5=8. Biết phép cộng → suy ra phép trừ!', 2),
  card(23, 'example', 'Thực hành', '7+6=13 → 13-7=6 → 13-6=7. Ba phép tính liên quan nhau! ✅', 3, '{"lienhe":"7+6=13, 13-7=6, 13-6=7"}'),
  card(23, 'tip', 'Học thuộc dần', 'Mỗi ngày học 2-3 phép tính mới, ôn lại phép tính cũ. Sau 1 tuần sẽ thuộc hết! 🌟', 4),

  // === BÀI 24: Bài toán có lời văn (phạm vi 20) ===
  card(24, 'intro', 'Bài toán lời văn', 'Bài toán lời văn kể một câu chuyện. Em cần tìm phép tính phù hợp để giải 📖', 1),
  card(24, 'explain', 'Các bước giải', 'B1: Đọc kỹ đề. B2: Tìm dữ kiện (số liệu). B3: Xác định phép tính. B4: Tính toán và viết đáp số', 2),
  card(24, 'example', 'Ví dụ', 'An có 8 viên bi. Bình cho thêm 5 viên. Hỏi An có bao nhiêu viên bi? → 8+5=13 (viên bi) ✅', 3, '{"baitoan":"8+5=13"}'),
  card(24, 'tip', 'Từ khóa quan trọng', '"thêm", "cho", "tất cả" → CỘNG. "bớt", "ăn", "mất", "còn lại" → TRỪ 🔑', 4),

  // === BÀI 25: Cộng không nhớ (phạm vi 100) ===
  card(25, 'intro', 'Mở rộng sang số lớn', 'Bây giờ ta cộng các số có 2 chữ số! Ví dụ: 34+25 🎯', 1),
  card(25, 'explain', 'Đặt tính dọc', 'Viết số hàng đơn vị thẳng cột, hàng chục thẳng cột. Cộng từ PHẢI sang TRÁI', 2),
  card(25, 'example', '34 + 25 = ?', 'Hàng đơn vị: 4+5=9. Hàng chục: 3+2=5. Kết quả: 59 ✅', 3, '{"datthinh":"34+25=59"}'),
  card(25, 'tip', 'Cẩn thận thẳng cột', 'Đặt tính ngay ngắn, số nào thẳng cột số đó. Cộng từ bên phải trước! ✏️', 4),

  // === BÀI 26: Cộng có nhớ (phạm vi 100) ===
  card(26, 'intro', 'Khi cộng đơn vị ≥ 10', 'Nếu hàng đơn vị cộng ra ≥10, viết số đơn vị, nhớ 1 sang hàng chục 🧮', 1),
  card(26, 'explain', 'Cách thực hiện', '37+28: Hàng đơn vị 7+8=15 → viết 5, nhớ 1. Hàng chục: 3+2+1(nhớ)=6. Kết quả: 65', 2),
  card(26, 'example', '37 + 28 = ?', 'đơn vị: 7+8=15 → viết 5 nhớ 1. Chục: 3+2+1=6. Kết quả: 65 ✅', 3, '{"datthinh":"37+28=65"}'),
  card(26, 'tip', 'Ghi số nhớ', 'Viết số 1 nhỏ ở trên cột hàng chục để không quên cộng thêm! ✍️', 4),

  // === BÀI 27: Trừ không nhớ (phạm vi 100) ===
  card(27, 'intro', 'Trừ số có 2 chữ số', 'Trừ hàng đơn vị trước, rồi trừ hàng chục. Ví dụ: 68-23 ✏️', 1),
  card(27, 'explain', 'Đặt tính dọc', 'Viết thẳng cột. Trừ từ PHẢI sang TRÁI', 2),
  card(27, 'example', '68 - 23 = ?', 'đơn vị: 8-3=5. Chục: 6-2=4. Kết quả: 45 ✅', 3, '{"datthinh":"68-23=45"}'),
  card(27, 'tip', 'Kiểm tra bằng cộng', 'Lấy kết quả + số trừ = số bị trừ. Ví dụ: 45+23=68 ✓ 🔍', 4),

  // === BÀI 28: Trừ có nhớ (phạm vi 100) ===
  card(28, 'intro', 'Khi đơn vị không trừ được', 'Nếu hàng đơn vị bé hơn → mượn 1 chục 🏦', 1),
  card(28, 'explain', 'Cách mượn', '52-17: đơn vị 2 không trừ được 7 → mượn 1 chục. 12-7=5. Chục: 5-1(trả)-1=3. Kết quả: 35', 2),
  card(28, 'example', '52 - 17 = ?', 'đơn vị: 2<7 → mượn: 12-7=5. Chục: 5-1-1=3. Kết quả: 35 ✅', 3, '{"datthinh":"52-17=35"}'),
  card(28, 'tip', 'Nhớ trả', 'Đã mượn thì phải trả! Hàng chục trừ thêm 1 nữa nhé 💡', 4),

  // === BÀI 29: Bài toán lời văn (cộng, phạm vi 100) ===
  card(29, 'intro', 'Bài toán cộng lớn hơn', 'Giải bài toán có lời văn với các số trong phạm vi 100 📝', 1),
  card(29, 'explain', 'Nhận biết phép cộng', '"tất cả", "cả hai", "tổng cộng", "gộp lại" → phải dùng phép CỘNG', 2),
  card(29, 'example', 'Ví dụ', 'Lớp 2A có 35 bạn, lớp 2B có 28 bạn. Hỏi hai lớp có bao nhiêu bạn? → 35+28=63 bạn ✅', 3, '{"baitoan":"35+28=63"}'),
  card(29, 'tip', 'Viết đáp số đầy đủ', 'Luôn ghi đơn vị sau số: "63 bạn", "45 quả", "27 cái" ✏️', 4),

  // === BÀI 30: Bài toán lời văn (trừ, phạm vi 100) ===
  card(30, 'intro', 'Bài toán trừ lớn hơn', 'Giải bài toán có lời văn dạng trừ với số trong phạm vi 100 📝', 1),
  card(30, 'explain', 'Nhận biết phép trừ', '"còn lại", "đã bán", "hơn", "kém" → phải dùng phép TRỪ', 2),
  card(30, 'example', 'Ví dụ', 'Cửa hàng có 72 cái bánh, bán được 35 cái. Hỏi còn bao nhiêu cái? → 72-35=37 cái ✅', 3, '{"baitoan":"72-35=37"}'),
  card(30, 'tip', 'So sánh = trừ', 'Khi đề hỏi "hơn bao nhiêu" hay "kém bao nhiêu" → lấy số lớn TRỪ số bé 🔢', 4),

  // === BÀI 31: Đo độ dài: cm và m ===
  card(31, 'intro', 'Xăng-ti-mét và mét', 'cm dùng đo vật nhỏ, m dùng đo vật lớn. 1m = 100cm 📏', 1),
  card(31, 'explain', 'Cách đo', 'Đặt thước kẻ, mép vật trùng vạch 0. Đọc số ở đầu kia → đó là độ dài (cm)', 2),
  card(31, 'example', 'Ước lượng', 'Bút chì ≈ 17cm, bàn học ≈ 1m20cm = 120cm, phòng học ≈ 8m ✅', 3, '{"doixung":"1m=100cm"}'),
  card(31, 'tip', 'Nhớ quy đổi', '1m = 100cm. Khi cộng trừ phải cùng đơn vị! 💡', 4),

  // === BÀI 32: Đo khối lượng: kg ===
  card(32, 'intro', 'Ki-lô-gam', 'kg dùng để cân nặng nhẹ. Dùng cân để đo khối lượng ⚖️', 1),
  card(32, 'explain', 'Các vật quen thuộc', 'Quả trứng ≈ 50g, quả táo ≈ 200g, túi gạo = 5kg, bé lớp 2 ≈ 20-25kg', 2),
  card(32, 'example', 'Ví dụ tính', 'Túi gạo 5kg, túi đường 2kg. Tổng: 5+2=7 (kg) ✅', 3, '{"cantong":"5+2=7kg"}'),
  card(32, 'tip', 'So sánh nặng nhẹ', 'Nặng hơn → số kg lớn hơn. 5kg > 3kg → túi 5kg nặng hơn 🏋️', 4),

  // === BÀI 33: Đo dung tích: lít ===
  card(33, 'intro', 'Đơn vị lít', 'Lít (l) đo lượng nước, sữa, dầu... Chai nước 500ml = nửa lít 🥛', 1),
  card(33, 'explain', 'Ước lượng', 'Ly nước ≈ 200ml, chai nước khoáng = 500ml, bình nước lớn = 1.5 lít, xô = 10 lít', 2),
  card(33, 'example', 'Ví dụ', 'Can 5 lít nước, đổ ra 2 lít. Còn 5-2=3 (lít) ✅', 3, '{"tinhtoan":"5-2=3 lit"}'),
  card(33, 'tip', 'Cùng đơn vị', 'Chỉ cộng trừ khi cùng đơn vị lít. Không cộng lít với kg! ⚠️', 4),

  // === BÀI 34: Thực hành đo lường ===
  card(34, 'intro', 'Ôn tập đo lường', 'Sử dụng cm, m, kg, lít để giải bài toán thực tế 🎯', 1),
  card(34, 'explain', 'So sánh đơn vị đo', 'So sánh 2 số đo phải CÙNG đơn vị. 150cm = 1m50cm. 3kg > 2kg', 2),
  card(34, 'example', 'Bài toán thực tế', 'Sợi dây dài 50cm, cắt bớt 15cm. Còn 50-15=35 (cm) ✅', 3, '{"tinhtoan":"50-15=35cm"}'),
  card(34, 'tip', 'Ghi đơn vị', 'Luôn ghi đơn vị sau đáp số: cm, m, kg, lít. Thiếu đơn vị = sai! 📝', 4),

  // === BÀI 35: Bảng nhân 2 ===
  card(35, 'intro', 'Phép nhân là gì?', 'Nhân là cộng nhiều lần. 2×3 = 2+2+2 = 6. Viết gọn: 2 nhân 3 bằng 6 ✖️', 1),
  card(35, 'explain', 'Bảng nhân 2', '2×1=2, 2×2=4, 2×3=6, 2×4=8, 2×5=10, 2×6=12, 2×7=14, 2×8=16, 2×9=18, 2×10=20', 2),
  card(35, 'example', 'Ví dụ thực tế', 'Mỗi hộp có 2 cái bánh, có 4 hộp. Hỏi có bao nhiêu cái bánh? → 2×4=8 cái ✅', 3, '{"nhan":"2x4=8"}'),
  card(35, 'tip', 'Nhân 2 = cộng đôi', '2×7 = 7+7 = 14. Hoặc: mọi kết quả nhân 2 đều là số CHẴN! 💡', 4),

  // === BÀI 36: Bảng nhân 3 ===
  card(36, 'intro', 'Bảng nhân 3', 'Học bảng nhân 3 dựa trên bảng nhân 2 🎓', 1),
  card(36, 'explain', 'Cách nhớ', '3×1=3, 3×2=6, 3×3=9, 3×4=12, 3×5=15, 3×6=18, 3×7=21, 3×8=24, 3×9=27, 3×10=30', 2),
  card(36, 'example', 'Mẹo tính', '3×5 = 2×5 + 5 = 10+5 = 15. Hoặc 3×5 = 5+5+5 = 15 ✅', 3, '{"nhan":"3x5=15"}'),
  card(36, 'tip', 'Quy luật', 'Kết quả nhân 3 tăng thêm 3 mỗi lần: 3, 6, 9, 12, 15... 📊', 4),

  // === BÀI 37: Bảng nhân 4 và nhân 5 ===
  card(37, 'intro', 'Hai bảng nhân mới', 'Nhân 4 = nhân 2 hai lần. Nhân 5 kết quả luôn tận cùng 0 hoặc 5 🔢', 1),
  card(37, 'explain', 'Bảng nhân 4 và 5', 'Nhân 4: 4,8,12,16,20,24,28,32,36,40. Nhân 5: 5,10,15,20,25,30,35,40,45,50', 2),
  card(37, 'example', 'Ví dụ', '4×6 = 2×6 + 2×6 = 12+12 = 24. Hoặc 5×7 = 35 (tận cùng = 5) ✅', 3, '{"nhan":"4x6=24, 5x7=35"}'),
  card(37, 'tip', 'Mẹo nhân 5', 'Nhân 5 × số chẵn: kết quả tận cùng 0. Nhân 5 × số lẻ: tận cùng 5. Siêu dễ! ⭐', 4),

  // === BÀI 38: Chia cho 2 và chia cho 3 ===
  card(38, 'intro', 'Phép chia là gì?', 'Chia là chia đều. 6 kẹo chia đều cho 2 bạn → mỗi bạn 3 kẹo. 6÷2=3 🍬', 1),
  card(38, 'explain', 'Chia ngược nhân', 'Nếu 2×3=6 thì 6÷2=3 và 6÷3=2. Dùng bảng nhân để chia!', 2),
  card(38, 'example', 'Ví dụ', '12÷3 = ? → Tìm: 3×?=12 → 3×4=12 → 12÷3=4 ✅', 3, '{"chia":"12÷3=4"}'),
  card(38, 'tip', 'Học bảng nhân trước', 'Thuộc bảng nhân → chia nhanh. Chia 2: kết quả = một nửa 💡', 4),

  // === BÀI 39: Chia cho 4 và chia cho 5 ===
  card(39, 'intro', 'Mở rộng phép chia', 'Chia cho 4 và chia cho 5 dùng bảng nhân 4, 5 📚', 1),
  card(39, 'explain', 'Cách tìm', '20÷4 = ? → 4×?=20 → 4×5=20 → 20÷4=5. Tương tự: 35÷5=7 vì 5×7=35', 2),
  card(39, 'example', 'Bài toán', '20 cái kẹo chia đều 4 bạn, mỗi bạn mấy cái? → 20÷4=5 cái ✅', 3, '{"chia":"20÷4=5"}'),
  card(39, 'tip', 'Chia cho 5 dễ', 'Kết quả chia 5: lấy kết quả nhân 2 rồi chia 10. Ví dụ: 35÷5=7 🔢', 4),

  // === BÀI 40: Hình vuông, chữ nhật, tam giác ===
  card(40, 'intro', 'Ba hình cơ bản', 'Hình vuông (⬜), hình chữ nhật (▬), hình tam giác (△) — em biết phân biệt chưa? 🔷', 1),
  card(40, 'explain', 'Đặc điểm', 'Vuông: 4 cạnh bằng, 4 góc vuông. Chữ nhật: 2 dài=nhau, 2 ngắn=nhau, 4 góc vuông. Tam giác: 3 cạnh', 2),
  card(40, 'example', 'Tìm hình quanh em', 'Cửa sổ → hình chữ nhật. Viên gạch → hình vuông. Mái nhà → hình tam giác ✅', 3, '{"hinhanh":"cua_so=Hình chữ nhật, gach=Hình vuông, mai=thời gian"}'),
  card(40, 'tip', 'Đếm hình', 'Khi đếm hình, cẩn thận hình nhỏ nằm trong hình lớn! Đếm từ nhỏ đến lớn 🔍', 4),
];
