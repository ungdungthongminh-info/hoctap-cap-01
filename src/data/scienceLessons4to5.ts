/**
 * KHOA HỌC LỚP 4–5 — 40 bài (20 bài × 2 lớp, GDPT 2018)
 * Lớp 4: Chất & Năng lượng, Thực vật, Động vật, Con người & Sức khỏe
 * Lớp 5: Biến đổi chất, Năng lượng NC, Sinh vật & Môi trường, Trái Đất, Bảo vệ Môi trường
 */
import type { Lesson } from './seedData';

let sid = 0;
const L = (
  grade: number, unit: string, code: string, title: string, obj: string,
  summary: string, tips: string, diff: 'easy' | 'medium' | 'hard', mins: number,
): Lesson => ({
  id: 500 + (++sid), grade, subjectCode: 'science', unitCode: unit, lessonCode: code,
  title, objective: obj, summarySimple: summary, tips,
  difficulty: diff, estimatedMinutes: mins, status: 'ready', sortOrder: sid, isActive: 1,
});

// ==================== LỚP 4 (20 bài) ====================
export const scienceLessons4: Lesson[] = [
  // C1: Chất và vật liệu
  L(4, 'C1', 'KH4-01', 'Các loại chất', 'Phân biệt chất rắn, lỏng, khí', 'Chất rắn giữ nguyên hình, chất lỏng chảy được, chất khí bay tự do', 'Cho bé quan sát nước đá tan → nước → hơi nước', 'easy', 10),
  L(4, 'C1', 'KH4-02', 'Tính chất của vật liệu', 'Nhận biết tính chất cứng, mềm, trong suốt, đàn hồi', 'Vật liệu có nhiều tính chất: cứng/mềm, nặng/nhẹ, trong suốt/đục', 'Sờ và so sánh các đồ vật: gỗ, nhựa, thủy tinh, cao su', 'easy', 10),
  L(4, 'C1', 'KH4-03', 'Hỗn hợp và dung dịch', 'Phân biệt hỗn hợp và dung dịch', 'Hỗn hợp có thể nhìn thấy từng thành phần, dung dịch thì không', 'Pha muối/đường vào nước để bé quan sát dung dịch', 'medium', 12),
  L(4, 'C1', 'KH4-04', 'Sự biến đổi chất', 'Nhận biết biến đổi lí học và hóa học', 'Biến đổi lí học: thay đổi hình dạng. Biến đổi hóa học: tạo chất mới', 'Đun nước sôi (lí học) vs nến cháy (hóa học)', 'medium', 12),
  // C2: Năng lượng
  L(4, 'C2', 'KH4-05', 'Ánh sáng', 'Tìm hiểu về nguồn sáng và sự truyền ánh sáng', 'Ánh sáng truyền theo đường thẳng, tạo bóng và phản xạ', 'Dùng đèn pin chiếu vào tường để thấy bóng', 'easy', 10),
  L(4, 'C2', 'KH4-06', 'Âm thanh', 'Tìm hiểu về sự phát sinh và truyền âm thanh', 'Âm thanh do vật rung tạo ra, truyền qua không khí, nước, rắn', 'Gảy dây đàn và sờ để cảm nhận rung động', 'easy', 10),
  L(4, 'C2', 'KH4-07', 'Nhiệt', 'Tìm hiểu về sự truyền nhiệt', 'Nhiệt truyền từ nơi nóng đến nơi lạnh. Chất dẫn nhiệt và cách nhiệt', 'Cho bé sờ thìa kim loại trong cốc nước nóng', 'medium', 12),
  L(4, 'C2', 'KH4-08', 'Điện trong đời sống', 'Nhận biết vai trò của điện', 'Điện giúp đèn sáng, quạt quay, tivi hoạt động', 'Kể tên các đồ dùng điện trong nhà cùng bé', 'easy', 10),
  // C3: Thực vật
  L(4, 'C3', 'KH4-09', 'Cấu tạo cây xanh', 'Nhận biết các bộ phận chính của cây', 'Cây có: rễ, thân, lá, hoa, quả, hạt', 'Quan sát cây ngoài vườn, chỉ ra từng bộ phận', 'easy', 10),
  L(4, 'C3', 'KH4-10', 'Quang hợp', 'Hiểu quá trình quang hợp đơn giản', 'Lá cây dùng ánh sáng + CO₂ + nước tạo ra thức ăn + O₂', 'Cây cần ánh sáng để sống — che lá cây vài ngày để quan sát', 'medium', 12),
  L(4, 'C3', 'KH4-11', 'Thân, rễ, lá và chức năng', 'Hiểu chức năng từng bộ phận', 'Rễ hút nước, thân vận chuyển, lá quang hợp, hoa sinh sản', 'Cắt ngang thân cây nhỏ để thấy ống dẫn nước', 'medium', 12),
  L(4, 'C3', 'KH4-12', 'Sự sinh sản của thực vật', 'Nhận biết các cách thực vật sinh sản', 'Cây sinh sản bằng hạt, giâm cành, chiết, ghép', 'Trồng hạt đậu trong bông ẩm cùng bé', 'medium', 12),
  // C4: Động vật
  L(4, 'C4', 'KH4-13', 'Phân loại động vật', 'Phân loại ĐV có xương sống và không xương sống', 'Có xương sống: cá, ếch, rắn, chim, thú. Không: côn trùng, giun', 'Xem tranh động vật và phân loại cùng bé', 'easy', 10),
  L(4, 'C4', 'KH4-14', 'Chuỗi thức ăn', 'Hiểu mối quan hệ thức ăn trong tự nhiên', 'Cỏ → Châu chấu → Ếch → Rắn → Đại bàng', 'Vẽ chuỗi thức ăn đơn giản cùng bé', 'medium', 12),
  L(4, 'C4', 'KH4-15', 'Sự thích nghi với môi trường', 'Nhận biết cách ĐV thích nghi', 'Cá có vây để bơi, chim có cánh để bay, gấu có lông dày chống lạnh', 'Hỏi bé: Tại sao cá sống dưới nước được?', 'medium', 12),
  L(4, 'C4', 'KH4-16', 'Bảo vệ động vật', 'Ý thức bảo vệ động vật', 'Không săn bắt, không phá rừng, bảo vệ ĐV quý hiếm', 'Xem phim tài liệu về động vật hoang dã cùng bé', 'easy', 10),
  // C5: Con người và Sức khỏe
  L(4, 'C5', 'KH4-17', 'Dinh dưỡng hợp lý', 'Hiểu về các nhóm chất dinh dưỡng', 'Cần ăn đủ: đạm, tinh bột, chất béo, vitamin, khoáng chất', 'Cùng bé xem tháp dinh dưỡng khi ăn cơm', 'easy', 10),
  L(4, 'C5', 'KH4-18', 'Hệ tiêu hóa', 'Tìm hiểu đường đi của thức ăn', 'Miệng → Thực quản → Dạ dày → Ruột non → Ruột già', 'Giải thích tại sao cần nhai kỹ khi ăn', 'medium', 12),
  L(4, 'C5', 'KH4-19', 'Hệ hô hấp', 'Tìm hiểu cách cơ thể hít thở', 'Không khí vào mũi → Khí quản → Phổi. Hít O₂, thở ra CO₂', 'Cùng bé tập hít thở sâu và đếm nhịp thở', 'medium', 12),
  L(4, 'C5', 'KH4-20', 'Phòng bệnh', 'Biết cách phòng một số bệnh thường gặp', 'Rửa tay, ăn chín uống sôi, tiêm phòng, tập thể dục', 'Nhắc bé rửa tay trước khi ăn', 'easy', 10),
];

// ==================== LỚP 5 (20 bài) ====================
export const scienceLessons5: Lesson[] = [
  // C1: Biến đổi chất
  L(5, 'C1', 'KH5-01', 'Sự biến đổi hóa học', 'Nhận biết các biến đổi hóa học thường gặp', 'Nến cháy, sắt gỉ, nấu ăn là biến đổi hóa học — tạo chất mới', 'Quan sát đinh sắt bị gỉ ngoài trời', 'medium', 12),
  L(5, 'C1', 'KH5-02', 'Sự nung nóng và làm lạnh', 'Tìm hiểu tác động nhiệt đến chất', 'Nung nóng: chất rắn → lỏng → khí. Làm lạnh: ngược lại', 'Đun nước sôi và đặt đĩa lạnh phía trên để thấy ngưng tụ', 'medium', 12),
  L(5, 'C1', 'KH5-03', 'Hỗn hợp và dung dịch nâng cao', 'Cách tách chất ra khỏi hỗn hợp', 'Lọc, bay hơi, để lắng là cách tách chất', 'Lọc nước bẩn bằng giấy lọc/bông gòn cùng bé', 'medium', 12),
  L(5, 'C1', 'KH5-04', 'Sự oxi hóa', 'Hiểu sự oxi hóa đơn giản', 'Sắt gỉ, thực phẩm ôi thiu là do oxi hóa', 'So sánh táo cắt để ngoài vs táo bọc nilon', 'hard', 15),
  // C2: Năng lượng nâng cao
  L(5, 'C2', 'KH5-05', 'Mạch điện đơn giản', 'Hiểu mạch điện cơ bản', 'Pin + dây dẫn + bóng đèn = mạch điện đơn giản', 'Mua bộ kit mạch điện cho bé lắp ráp', 'medium', 12),
  L(5, 'C2', 'KH5-06', 'Nam châm và từ trường', 'Tìm hiểu về tính chất nam châm', 'Nam châm hút sắt, có 2 cực N-S, cùng cực đẩy, khác cực hút', 'Cho bé chơi nam châm hút vật trong nhà', 'medium', 12),
  L(5, 'C2', 'KH5-07', 'Năng lượng mặt trời', 'Nhận biết vai trò năng lượng mặt trời', 'Mặt Trời cung cấp ánh sáng, nhiệt cho Trái Đất', 'Phơi quần áo = dùng năng lượng mặt trời', 'easy', 10),
  L(5, 'C2', 'KH5-08', 'Tiết kiệm năng lượng', 'Biết cách tiết kiệm năng lượng', 'Tắt đèn khi không dùng, đi xe đạp, dùng NLMT', 'Nhắc bé tắt đèn/quạt khi ra khỏi phòng', 'easy', 10),
  // C3: Sinh vật và Môi trường
  L(5, 'C3', 'KH5-09', 'Chuỗi thức ăn nâng cao', 'Hiểu lưới thức ăn trong hệ sinh thái', 'Lưới thức ăn gồm nhiều chuỗi đan xen nhau', 'Vẽ lưới thức ăn gồm 5-6 sinh vật', 'medium', 12),
  L(5, 'C3', 'KH5-10', 'Hệ sinh thái', 'Nhận biết các hệ sinh thái', 'HST rừng, HST ao hồ, HST biển — mỗi nơi có sinh vật riêng', 'Đi công viên và quan sát HST nhỏ', 'medium', 12),
  L(5, 'C3', 'KH5-11', 'Sự cân bằng sinh thái', 'Hiểu sự cân bằng trong tự nhiên', 'Mỗi sinh vật có vai trò, mất 1 mắt xích ảnh hưởng cả hệ thống', 'Nếu hết ếch → côn trùng tăng → hại cây trồng', 'hard', 15),
  L(5, 'C3', 'KH5-12', 'Đa dạng sinh học', 'Nhận biết sự đa dạng sinh học', 'Trái Đất có hàng triệu loài SV khác nhau, cần bảo vệ sự đa dạng', 'Đếm các loài cây/con vật bé biết', 'easy', 10),
  // C4: Trái Đất và Bầu trời
  L(5, 'C4', 'KH5-13', 'Hệ Mặt Trời', 'Tìm hiểu về Hệ Mặt Trời', '8 hành tinh: Thủy, Kim, Trái Đất, Hỏa, Mộc, Thổ, Thiên Vương, Hải Vương', 'Làm mô hình Hệ Mặt Trời bằng bóng xốp', 'medium', 12),
  L(5, 'C4', 'KH5-14', 'Trái Đất quay', 'Hiểu sự tự quay và quay quanh Mặt Trời', 'Tự quay → ngày đêm. Quay quanh Mặt Trời → 4 mùa', 'Dùng đèn pin + quả bóng minh họa ngày/đêm', 'medium', 12),
  L(5, 'C4', 'KH5-15', 'Mùa và Khí hậu', 'Hiểu nguyên nhân 4 mùa', 'Trục Trái Đất nghiêng → các vùng nhận ánh sáng khác nhau', 'VN có 2 mùa chính: mùa mưa và mùa khô', 'medium', 12),
  L(5, 'C4', 'KH5-16', 'Địa hình Việt Nam', 'Nhận biết các dạng địa hình cơ bản', 'Đồng bằng, Cao nguyên, Núi, Ven biển', 'Xem bản đồ địa hình VN cùng bé', 'easy', 10),
  // C5: Con người và Môi trường
  L(5, 'C5', 'KH5-17', 'Ô nhiễm môi trường', 'Nhận biết các dạng ô nhiễm', 'Ô nhiễm không khí, nước, đất. Nguyên nhân: rác, khói xe, nhà máy', 'Thu gom rác thải nhựa cùng bé', 'easy', 10),
  L(5, 'C5', 'KH5-18', 'Biến đổi khí hậu', 'Hiểu biến đổi khí hậu cơ bản', 'Trái Đất nóng lên do khí nhà kính, gây lũ lụt, hạn hán', 'Giải thích tại sao cần trồng cây', 'medium', 12),
  L(5, 'C5', 'KH5-19', 'Tài nguyên thiên nhiên', 'Nhận biết tài nguyên thiên nhiên', 'Nước, rừng, khoáng sản, đất — có hạn, cần sử dụng tiết kiệm', 'Hỏi bé: Tại sao phải tiết kiệm nước?', 'medium', 12),
  L(5, 'C5', 'KH5-20', 'Bảo vệ môi trường', 'Hành động bảo vệ môi trường', 'Phân loại rác, trồng cây, tiết kiệm điện nước, dùng lại đồ', 'Cùng bé phân loại rác ở nhà: hữu cơ, tái chế, nguy hại', 'easy', 10),
];
