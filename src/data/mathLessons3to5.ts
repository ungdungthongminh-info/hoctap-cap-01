/**
 * TOÁN LỚP 3-4-5 — 60 bài (GDPT 2018)
 * G3: 41-60 | G4: 61-80 | G5: 81-100
 */
import type { Lesson } from './seedData';

const L = (
  id: number, grade: number, unit: string, code: string, title: string,
  obj: string, summary: string, tips: string,
  diff: 'easy' | 'medium' | 'hard', mins: number, sort: number,
): Lesson => ({
  id, grade, subjectCode: 'math', unitCode: unit, lessonCode: code,
  title, objective: obj, summarySimple: summary, tips,
  difficulty: diff, estimatedMinutes: mins, status: 'ready', sortOrder: sort, isActive: 1,
});

// ===================== LỚP 3 (ID 41-60) =====================
const mathG3: Lesson[] = [
  // C1: Ôn nhân chia
  L(41, 3, 'M3C1', 'M3-01', 'Ôn bảng cửu chương', 'Ôn lại bảng nhân 2-5', 'Bé nhớ lại bảng cửu chương đã học', 'Đọc to bảng nhân mỗi ngày', 'easy', 10, 1),
  L(42, 3, 'M3C1', 'M3-02', 'Nhân trong phạm vi 100', 'Nhân số có 2 chữ số với số có 1 chữ số', 'Bé tập nhân số lớn hơn', 'Tách thành hàng chục và hàng đơn vị', 'medium', 12, 2),
  L(43, 3, 'M3C1', 'M3-03', 'Chia trong phạm vi 100', 'Chia số có 2 chữ số cho số có 1 chữ số', 'Bé tập chia cơ bản', 'Chia liên quan đến nhân: a ÷ b = c ↔ b × c = a', 'medium', 12, 3),
  L(44, 3, 'M3C1', 'M3-04', 'Bài tập nhân chia tổng hợp', 'Kết hợp nhân và chia trong bài toán', 'Bé luyện tập nhân chia', 'Đọc kỹ đề, xác định phép tính trước', 'medium', 15, 4),
  // C2: Nhân trong PV1000
  L(45, 3, 'M3C2', 'M3-05', 'Nhân số có 3 chữ số', 'Nhân số có 3 chữ số với số có 1 chữ số', 'Bé nhân số lớn', 'Đặt tính rồi tính từ phải sang trái', 'medium', 15, 5),
  L(46, 3, 'M3C2', 'M3-06', 'Nhân số tròn chục, tròn trăm', 'Nhân các số tròn (10, 100, 20, 200...)', 'Bé nhận biết quy luật nhân tròn', 'Thêm số 0 vào cuối kết quả', 'easy', 10, 6),
  L(47, 3, 'M3C2', 'M3-07', 'Ước lượng kết quả nhân', 'Ước lượng tích gần đúng', 'Bé biết kiểm tra nhanh kết quả', 'Làm tròn rồi nhân để kiểm tra', 'medium', 12, 7),
  L(48, 3, 'M3C2', 'M3-08', 'Gấp một số lên nhiều lần', 'Hiểu ý nghĩa phép gấp lên', 'Bé giải bài toán gấp lên', 'Gấp n lần = nhân với n', 'medium', 12, 8),
  // C3: Phép chia nâng cao
  L(49, 3, 'M3C3', 'M3-09', 'Chia hết và chia có dư', 'Phân biệt chia hết và chia có dư', 'Bé biết số dư', 'Số dư luôn nhỏ hơn số chia', 'medium', 12, 9),
  L(50, 3, 'M3C3', 'M3-10', 'Chia số có 3 chữ số', 'Chia số có 3 chữ số cho số có 1 chữ số', 'Bé chia số lớn', 'Chia từng hàng từ trái sang phải', 'hard', 15, 10),
  L(51, 3, 'M3C3', 'M3-11', 'Giảm một số đi nhiều lần', 'Hiểu ý nghĩa giảm đi n lần', 'Bé giải bài toán giảm đi', 'Giảm n lần = chia cho n', 'medium', 12, 11),
  L(52, 3, 'M3C3', 'M3-12', 'Bài toán chia thực tế', 'Giải bài toán thực tế dùng phép chia', 'Bé áp dụng chia vào đời sống', 'Vẽ sơ đồ tóm tắt bài toán', 'hard', 15, 12),
  // C4: Đo lường
  L(53, 3, 'M3C4', 'M3-13', 'Đơn vị đo dài: m, dm, cm', 'Nhận biết và đổi đơn vị đo độ dài', 'Bé biết đo chiều dài', '1m = 10dm = 100cm', 'easy', 10, 13),
  L(54, 3, 'M3C4', 'M3-14', 'Đo khối lượng: kg, g', 'Nhận biết kg và g, thực hành cân', 'Bé biết đơn vị cân nặng', '1kg = 1000g', 'easy', 10, 14),
  L(55, 3, 'M3C4', 'M3-15', 'Đo thời gian: giờ, phút', 'Đọc đồng hồ, tính khoảng thời gian', 'Bé biết xem giờ', '1 giờ = 60 phút', 'medium', 12, 15),
  L(56, 3, 'M3C4', 'M3-16', 'So sánh đo lường', 'So sánh các đại lượng cùng đơn vị', 'Bé so sánh đại lượng', 'Đổi về cùng đơn vị trước khi so sánh', 'medium', 12, 16),
  // C5: Hình học phẳng
  L(57, 3, 'M3C5', 'M3-17', 'Hình chữ nhật', 'Nhận biết đặc điểm hình chữ nhật', 'Bé biết hình chữ nhật', '2 cạnh dài bằng nhau, 2 cạnh ngắn bằng nhau', 'easy', 10, 17),
  L(58, 3, 'M3C5', 'M3-18', 'Hình vuông', 'Nhận biết đặc điểm hình vuông', 'Bé biết hình vuông', '4 cạnh bằng nhau, 4 góc vuông', 'easy', 10, 18),
  L(59, 3, 'M3C5', 'M3-19', 'Chu vi hình chữ nhật, hình vuông', 'Tính chu vi Hình chữ nhật và Hình vuông', 'Bé tính chu vi', 'Chu vi = tổng các cạnh', 'medium', 12, 19),
  L(60, 3, 'M3C5', 'M3-20', 'Diện tích đơn giản', 'Khái niệm diện tích, cm²', 'Bé bước đầu hiểu diện tích', 'Diện tích = số ô vuông bao phủ', 'hard', 15, 20),
];

// ===================== LỚP 4 (ID 61-80) =====================
const mathG4: Lesson[] = [
  // C1: Số lớn
  L(61, 4, 'M4C1', 'M4-01', 'Số đến 100.000', 'Đọc, viết, so sánh số đến 100.000', 'Bé làm quen số lớn', 'Chia từng hàng: chục nghìn, nghìn, trăm, chục, đơn vị', 'easy', 10, 1),
  L(62, 4, 'M4C1', 'M4-02', 'Hàng và lớp', 'Hiểu hàng đơn vị, hàng nghìn, hàng triệu', 'Bé biết cấu trúc số', 'Mỗi lớp gồm 3 hàng liên tiếp', 'medium', 12, 2),
  L(63, 4, 'M4C1', 'M4-03', 'Dãy số tự nhiên', 'Viết dãy số theo quy luật', 'Bé tìm quy luật dãy số', 'Số sau = số trước + bước nhảy', 'medium', 12, 3),
  L(64, 4, 'M4C1', 'M4-04', 'So sánh và sắp xếp số lớn', 'So sánh, sắp xếp tăng/giảm dần', 'Bé sắp xếp số', 'So sánh từ hàng cao nhất', 'medium', 12, 4),
  // C2: Phân số
  L(65, 4, 'M4C2', 'M4-05', 'Khái niệm phân số', 'Hiểu ý nghĩa phân số: tử số, mẫu số', 'Bé biết phân số', 'Phân số = phần đã lấy / tổng phần chia', 'easy', 10, 5),
  L(66, 4, 'M4C2', 'M4-06', 'Phân số bằng nhau', 'Nhận biết hai phân số bằng nhau', 'Bé so sánh phân số', 'Nhân/chia cả tử và mẫu cho cùng 1 số', 'medium', 12, 6),
  L(67, 4, 'M4C2', 'M4-07', 'Rút gọn phân số', 'Rút gọn phân số về dạng tối giản', 'Bé đơn giản hóa phân số', 'Chia cả tử và mẫu cho ƯCLN', 'medium', 15, 7),
  L(68, 4, 'M4C2', 'M4-08', 'So sánh phân số', 'So sánh hai phân số cùng/khác mẫu', 'Bé sắp xếp phân số', 'Quy đồng mẫu rồi so sánh tử', 'hard', 15, 8),
  // C3: Phép tính phân số
  L(69, 4, 'M4C3', 'M4-09', 'Cộng trừ phân số cùng mẫu', 'Cộng trừ phân số có cùng mẫu số', 'Bé cộng trừ phân số', 'Giữ mẫu, cộng/trừ tử', 'easy', 10, 9),
  L(70, 4, 'M4C3', 'M4-10', 'Cộng trừ phân số khác mẫu', 'Quy đồng mẫu rồi cộng trừ', 'Bé quy đồng mẫu số', 'Tìm mẫu số chung (BCNN)', 'hard', 15, 10),
  L(71, 4, 'M4C3', 'M4-11', 'Nhân chia phân số', 'Nhân tử×tử, mẫu×mẫu; chia = nhân nghịch đảo', 'Bé nhân chia phân số', 'Chia phân số = nhân với phân số đảo ngược', 'hard', 15, 11),
  L(72, 4, 'M4C3', 'M4-12', 'Bài toán phân số', 'Giải bài toán thực tế với phân số', 'Bé áp dụng phân số', 'Đọc kỹ đề, vẽ sơ đồ đoạn thẳng', 'hard', 15, 12),
  // C4: Hình học
  L(73, 4, 'M4C4', 'M4-13', 'Góc vuông, nhọn, tù', 'Nhận biết và phân loại góc', 'Bé biết ba loại góc', 'Góc vuông = 90°, nhọn < 90°, tù > 90°', 'easy', 10, 13),
  L(74, 4, 'M4C4', 'M4-14', 'Đường thẳng song song & vuông góc', 'Nhận biết hai đường thẳng song song, vuông góc', 'Bé biết song song và vuông góc', 'Song song: không cắt nhau; vuông góc: tạo góc 90°', 'medium', 12, 14),
  L(75, 4, 'M4C4', 'M4-15', 'Hình bình hành', 'Nhận biết hình bình hành, tính chu vi', 'Bé biết hình bình hành', 'Các cạnh đối song song và bằng nhau', 'medium', 12, 15),
  L(76, 4, 'M4C4', 'M4-16', 'Hình thoi', 'Nhận biết hình thoi, tính chu vi', 'Bé biết hình thoi', '4 cạnh bằng nhau, hai đường chéo vuông góc', 'medium', 12, 16),
  // C5: Diện tích
  L(77, 4, 'M4C5', 'M4-17', 'Diện tích hình chữ nhật', 'Diện tích = chiều dài × chiều rộng', 'Bé tính Diện tích hình chữ nhật', 'Diện tích Hình chữ nhật = dài × rộng', 'easy', 10, 17),
  L(78, 4, 'M4C5', 'M4-18', 'Diện tích hình vuông', 'Diện tích = cạnh × cạnh', 'Bé tính Diện tích hình vuông', 'Diện tích Hình vuông = a × a', 'easy', 10, 18),
  L(79, 4, 'M4C5', 'M4-19', 'Diện tích hình bình hành', 'Diện tích = đáy × chiều cao', 'Bé tính Diện tích hình bình hành', 'Chiều cao vuông góc với đáy', 'medium', 12, 19),
  L(80, 4, 'M4C5', 'M4-20', 'Bài toán diện tích', 'Giải bài toán thực tế về diện tích', 'Bé áp dụng diện tích', 'Xác định hình dạng trước, áp dụng công thức', 'hard', 15, 20),
];

// ===================== LỚP 5 (ID 81-100) =====================
const mathG5: Lesson[] = [
  // C1: Số thập phân
  L(81, 5, 'M5C1', 'M5-01', 'Khái niệm số thập phân', 'Hiểu phần nguyên và phần thập phân', 'Bé biết số thập phân', 'Dấu phẩy ngăn phần nguyên và phần thập phân', 'easy', 10, 1),
  L(82, 5, 'M5C1', 'M5-02', 'Đọc, viết số thập phân', 'Đọc, viết, so sánh Số thập phân', 'Bé đọc viết Số thập phân', 'So sánh từ phần nguyên trước', 'easy', 10, 2),
  L(83, 5, 'M5C1', 'M5-03', 'Cộng trừ số thập phân', 'Thực hiện cộng trừ Số thập phân', 'Bé cộng trừ Số thập phân', 'Đặt thẳng dấu phẩy rồi tính', 'medium', 12, 3),
  L(84, 5, 'M5C1', 'M5-04', 'Nhân chia số thập phân', 'Nhân chia Số thập phân với số tự nhiên và Số thập phân', 'Bé nhân chia Số thập phân', 'Nhân bình thường, đếm chữ số thập phân để đặt phẩy', 'hard', 15, 4),
  // C2: Tỉ lệ & Phần trăm
  L(85, 5, 'M5C2', 'M5-05', 'Tỉ số', 'Hiểu tỉ số giữa hai đại lượng', 'Bé biết tỉ số', 'Tỉ số = a : b (b ≠ 0)', 'medium', 12, 5),
  L(86, 5, 'M5C2', 'M5-06', 'Tỉ lệ bản đồ', 'Hiểu tỉ lệ bản đồ và áp dụng', 'Bé đọc bản đồ', 'Tỉ lệ 1:100.000 nghĩa là 1cm = 1km', 'medium', 12, 6),
  L(87, 5, 'M5C2', 'M5-07', 'Phần trăm', 'Khái niệm phần trăm (%), chuyển đổi', 'Bé hiểu phần trăm', '% = phần trăm = 1/100', 'medium', 12, 7),
  L(88, 5, 'M5C2', 'M5-08', 'Bài toán phần trăm', 'Tìm % của một số, tìm số khi biết %', 'Bé giải bài toán %', 'Tìm a% của b = b × a ÷ 100', 'hard', 15, 8),
  // C3: Thể tích
  L(89, 5, 'M5C3', 'M5-09', 'Hình hộp chữ nhật', 'Nhận biết hình hộp CN, tính Diện tích xung quanh', 'Bé biết hình hộp CN', 'Có 6 mặt, 12 cạnh, 8 đỉnh', 'medium', 12, 9),
  L(90, 5, 'M5C3', 'M5-10', 'Hình lập phương', 'Nhận biết hình lập phương, tính Diện tích', 'Bé biết hình lập phương', '6 mặt vuông bằng nhau', 'medium', 12, 10),
  L(91, 5, 'M5C3', 'M5-11', 'Thể tích hình hộp CN và lập phương', 'V = dài × rộng × cao; V = a × a × a', 'Bé tính thể tích', 'Thể tích = số đơn vị lập phương', 'hard', 15, 11),
  L(92, 5, 'M5C3', 'M5-12', 'Đơn vị thể tích: cm³, dm³, m³', 'Chuyển đổi giữa các đơn vị thể tích', 'Bé đổi đơn vị thể tích', '1dm³ = 1000cm³, 1m³ = 1000dm³', 'hard', 15, 12),
  // C4: Thống kê
  L(93, 5, 'M5C4', 'M5-13', 'Biểu đồ cột', 'Đọc và vẽ biểu đồ cột đơn giản', 'Bé đọc biểu đồ cột', 'Trục đứng = giá trị, trục ngang = danh mục', 'easy', 10, 13),
  L(94, 5, 'M5C4', 'M5-14', 'Biểu đồ hình quạt', 'Đọc biểu đồ hình quạt (tròn)', 'Bé đọc biểu đồ tròn', 'Mỗi phần = tỉ lệ phần trăm', 'medium', 12, 14),
  L(95, 5, 'M5C4', 'M5-15', 'Số trung bình cộng', 'Tính trung bình cộng của nhiều số', 'Bé tính trung bình', 'TBC = tổng ÷ số lượng', 'medium', 12, 15),
  L(96, 5, 'M5C4', 'M5-16', 'Bảng số liệu', 'Đọc, phân tích bảng số liệu', 'Bé đọc bảng số liệu', 'Nhìn hàng + cột để tìm thông tin', 'medium', 12, 16),
  // C5: Ôn tập cuối cấp
  L(97, 5, 'M5C5', 'M5-17', 'Ôn số và phép tính', 'Ôn tập số tự nhiên, Số thập phân, phân số', 'Bé ôn tập phần số', 'Ôn lại cách tính cộng trừ nhân chia', 'medium', 15, 17),
  L(98, 5, 'M5C5', 'M5-18', 'Ôn phân số & số thập phân', 'Ôn phép tính với Phân số và Số thập phân', 'Bé ôn Phân số và Số thập phân', 'Phân số ↔ Số thập phân: 1/4 = 0,25', 'medium', 15, 18),
  L(99, 5, 'M5C5', 'M5-19', 'Ôn hình học', 'Ôn chu vi, Diện tích, thể tích các hình', 'Bé ôn hình học', 'Ghi nhớ công thức: C, S, V', 'medium', 15, 19),
  L(100, 5, 'M5C5', 'M5-20', 'Ôn đo lường & thống kê', 'Ôn đổi đơn vị, đọc biểu đồ', 'Bé ôn đo lường', 'Nắm bảng đổi đơn vị', 'medium', 15, 20),
];

export const mathLessons3to5: Lesson[] = [...mathG3, ...mathG4, ...mathG5];
