/**
 * KHOA HỌC LỚP 4–5 — 160 thẻ học (4 thẻ/bài × 40 bài)
 */
import type { LessonCard } from './seedData';

let cid = 2240;
const C = (
  lessonId: number, type: LessonCard['cardType'], title: string, content: string, sort: number,
): LessonCard => ({
  id: ++cid, lessonId, cardType: type, title, content,
  exampleJson: null, sortOrder: sort, isActive: 1,
});

export const scienceCards4to5: LessonCard[] = [
  // ===== LỚP 4 =====
  // 501: Các loại chất
  C(501, 'intro', 'Ba thể của chất 🧊💧💨', 'Mọi thứ xung quanh ta đều là chất, gồm 3 thể: rắn, lỏng, khí!', 1),
  C(501, 'explain', 'Thể rắn, lỏng, khí', 'Rắn: giữ nguyên hình dạng (đá, gỗ)\nLỏng: chảy theo hình bình chứa (nước, sữa)\nKhí: bay tự do, không nhìn thấy (không khí, hơi nước)', 2),
  C(501, 'example', 'Nước biến đổi 3 thể', 'Nước đá (rắn) 🧊 → Nước (lỏng) 💧 → Hơi nước (khí) 💨\nĐun nóng: rắn → lỏng → khí\nLàm lạnh: khí → lỏng → rắn', 3),
  C(501, 'tip', 'Mẹo nhớ 💡', 'Rắn = cứng giữ hình. Lỏng = chảy được. Khí = bay tự do. Nhớ: Đá → Nước → Hơi!', 4),

  // 502: Tính chất vật liệu
  C(502, 'intro', 'Vật liệu quanh ta 🔨', 'Đồ vật được làm từ nhiều vật liệu khác nhau!', 1),
  C(502, 'explain', 'Các tính chất', 'Cứng/Mềm: Sắt cứng, cao su mềm\nNặng/Nhẹ: Đá nặng, bông nhẹ\nTrong suốt/Đục: Thủy tinh trong suốt, gỗ đục\nDẫn điện/Cách điện: Kim loại dẫn điện, nhựa cách điện', 2),
  C(502, 'example', 'So sánh vật liệu', 'Gỗ: cứng, nhẹ, đục, cách điện\nThủy tinh: cứng, nặng, trong suốt\nCao su: mềm, đàn hồi, cách điện\nKim loại: cứng, nặng, dẫn điện', 3),
  C(502, 'tip', 'Mẹo nhớ 💡', 'Sờ → cứng/mềm. Nhấc → nặng/nhẹ. Nhìn qua → trong suốt/đục!', 4),

  // 503: Hỗn hợp và dung dịch
  C(503, 'intro', 'Pha trộn chất 🧪', 'Khi trộn các chất lại, ta được hỗn hợp hoặc dung dịch!', 1),
  C(503, 'explain', 'Hỗn hợp vs Dung dịch', 'Hỗn hợp: thấy được từng thành phần (cát + sỏi, gạo + đậu)\nDung dịch: chất tan hoàn toàn, đồng nhất (nước muối, nước đường)\nDung môi: chất hòa tan. Chất tan: chất bị hòa tan', 2),
  C(503, 'example', 'Pha nước muối', 'Nước (dung môi) + Muối (chất tan) = Nước muối (dung dịch)\nMuối tan hết → nhìn không thấy muối nữa\nNhưng nếm → vẫn mặn!', 3),
  C(503, 'tip', 'Mẹo nhớ 💡', 'Hỗn hợp = nhìn THẤY từng thứ. Dung dịch = TAN HẾT không thấy!', 4),

  // 504: Sự biến đổi chất
  C(504, 'intro', 'Chất thay đổi! 🔥', 'Chất có thể biến đổi theo 2 cách!', 1),
  C(504, 'explain', 'Lí học vs Hóa học', 'Biến đổi LÍ HỌC: thay đổi hình dạng, trạng thái (xé giấy, đun nước)\nBiến đổi HÓA HỌC: tạo ra chất MỚI (nến cháy → CO₂ + nước; sắt gỉ)', 2),
  C(504, 'example', 'Ví dụ so sánh', 'Lí học: Nước đá tan → nước (vẫn là H₂O)\nHóa học: Gỗ cháy → tro + khói (chất mới)\nLí học: Xé giấy → mảnh giấy (vẫn là giấy)', 3),
  C(504, 'tip', 'Mẹo nhớ 💡', 'Lí học = thay HÌNH. Hóa học = thay CHẤT MỚI. Nếu có chất mới → hóa học!', 4),

  // 505: Ánh sáng
  C(505, 'intro', 'Ánh sáng kỳ diệu! ☀️', 'Ánh sáng giúp ta nhìn thấy mọi thứ!', 1),
  C(505, 'explain', 'Tính chất ánh sáng', 'Truyền thẳng: đèn pin chiếu thành đường thẳng\nPhản xạ: gương phản chiếu ánh sáng\nTạo bóng: vật cản → bóng tối phía sau', 2),
  C(505, 'example', 'Thí nghiệm bóng', 'Đèn pin → chiếu vào tay → bóng hình tay trên tường\nTại sao có bóng? Vì tay CẢN ánh sáng!\nVật trong suốt → bóng mờ/không có bóng', 3),
  C(505, 'tip', 'Mẹo nhớ 💡', 'Ánh sáng đi THẲNG, gặp vật CẢN tạo BÓNG, gặp GƯƠNG thì DỘI LẠI!', 4),

  // 506: Âm thanh
  C(506, 'intro', 'Thế giới âm thanh! 🔊', 'Âm thanh do rung động tạo ra!', 1),
  C(506, 'explain', 'Nguồn gốc âm thanh', 'Vật rung → tạo sóng âm → truyền qua không khí → tai nghe\nTruyền qua: không khí, nước, chất rắn\nKhông truyền qua: chân không (ngoài vũ trụ)', 2),
  C(506, 'example', 'Thí nghiệm', 'Gảy dây đàn → dây rung → có tiếng\nÁp tai lên bàn, gõ bàn → nghe rõ hơn (âm truyền qua rắn tốt hơn)\nÁp tay lên cổ họng khi nói → thấy rung', 3),
  C(506, 'tip', 'Mẹo nhớ 💡', 'RUNG → ÂM THANH → TRUYỀN → TAI. Không rung = không có tiếng!', 4),

  // 507: Nhiệt
  C(507, 'intro', 'Nóng và lạnh! 🌡️', 'Nhiệt truyền từ nơi nóng → nơi lạnh!', 1),
  C(507, 'explain', 'Dẫn nhiệt & Cách nhiệt', 'Dẫn nhiệt TỐT: kim loại (thìa sắt nóng nhanh)\nCách nhiệt TỐT: gỗ, nhựa, len (tay cầm nồi bằng gỗ)\nNhiệt luôn truyền: nóng → lạnh, cho đến khi bằng nhau', 2),
  C(507, 'example', 'Thí nghiệm thìa', 'Cho thìa sắt vào nước nóng → 1 phút → cán thìa nóng!\nThìa nhựa → cán vẫn mát → nhựa cách nhiệt\nVì sao áo len giữ ấm? Len cách nhiệt, giữ nhiệt cơ thể!', 3),
  C(507, 'tip', 'Mẹo nhớ 💡', 'Kim loại = DẪN NHIỆT giỏi. Gỗ/Nhựa = CÁCH NHIỆT giỏi!', 4),

  // 508: Điện trong đời sống
  C(508, 'intro', 'Điện quanh ta! ⚡', 'Điện giúp cuộc sống tiện lợi hơn!', 1),
  C(508, 'explain', 'Nguồn điện & Đồ dùng', 'Nguồn điện: pin, ổ cắm, máy phát\nĐồ dùng điện: đèn, quạt, tivi, tủ lạnh, máy giặt\n⚠️ Điện nguy hiểm! Không chạm ổ cắm bằng tay ướt!', 2),
  C(508, 'example', 'Đồ dùng điện trong nhà', '🔌 Đèn → sáng\n🔌 Quạt → mát\n🔌 Tủ lạnh → lạnh\n🔌 Bếp điện → nóng\nTất cả đều cần ĐIỆN để hoạt động!', 3),
  C(508, 'tip', 'An toàn điện ⚠️', 'Không sờ ổ cắm! Không cắm quá nhiều đồ 1 ổ! Tay ướt không chạm thiết bị điện!', 4),

  // 509: Cấu tạo cây xanh
  C(509, 'intro', 'Cây xanh! 🌳', 'Cây xanh có nhiều bộ phận!', 1),
  C(509, 'explain', 'Các bộ phận cây', 'Rễ 🌱: hút nước + chất khoáng\nThân 🪵: vận chuyển nước + chất dinh dưỡng\nLá 🍃: quang hợp, tạo thức ăn\nHoa 🌸: sinh sản\nQuả 🍎: chứa hạt', 2),
  C(509, 'example', 'Cây cam', 'Rễ cây cam hút nước trong đất\nThân cây dẫn nước lên lá\nLá quang hợp tạo đường\nHoa cam nở → thụ phấn → quả cam\nQuả cam chứa hạt → gieo hạt → cây mới!', 3),
  C(509, 'tip', 'Mẹo nhớ 💡', 'Từ dưới lên: RỄ → THÂm nhạc → LÁ → HOA → QUẢ → HẠT 🌱→🪵→🍃→🌸→🍎→🌰', 4),

  // 510: Quang hợp
  C(510, 'intro', 'Lá cây làm gì? 🍃', 'Lá cây là "bếp ăn" của cây!', 1),
  C(510, 'explain', 'Quang hợp', 'Lá cây hấp thụ: ÁNH SÁNG + CO₂ + NƯỚC\nTạo ra: ĐƯỜNG (thức ăn) + O₂ (khí oxy)\nDiệp lục (chất xanh) giúp quang hợp\nVì vậy đa số lá cây có màu xanh!', 2),
  C(510, 'example', 'Cây cần ánh sáng', 'Cây đặt ngoài nắng → xanh tốt ✅\nCây đặt trong tối → vàng úa ❌\nVì cây CẦN ánh sáng để quang hợp!', 3),
  C(510, 'tip', 'Mẹo nhớ 💡', 'QUANG HỢP = Ánh sáng + CO₂ + Nước → Đường + O₂. Cây = NHÀ MÁY OXY! 🏭', 4),

  // 511: Thân, rễ, lá
  C(511, 'intro', 'Bộ phận & Chức năng 🌿', 'Mỗi bộ phận cây có nhiệm vụ riêng!', 1),
  C(511, 'explain', 'Chức năng chi tiết', 'Rễ: hút nước + chất khoáng từ ĐẤT, giữ cây đứng vững\nThân: dẫn nước và chất dinh dưỡng đi khắp cây, nâng đỡ\nLá: thoát hơi nước, quang hợp, trao đổi khí', 2),
  C(511, 'example', 'Thí nghiệm hoa đổi màu', 'Cắm bông hoa trắng vào nước pha mực đỏ\nSau vài giờ → cánh hoa đỏ!\nVì thân DẪN nước mực lên lá và hoa!', 3),
  C(511, 'tip', 'Mẹo nhớ 💡', 'Rễ = HÚT. Thân = DẪN. Lá = QUANG HỢP. Mỗi phần đều quan trọng!', 4),

  // 512: Sinh sản thực vật
  C(512, 'intro', 'Cây sinh sản! 🌱', 'Cây có nhiều cách để tạo cây mới!', 1),
  C(512, 'explain', 'Các cách sinh sản', 'Bằng hạt: Hoa → Thụ phấn → Quả → Hạt → Cây mới\nGiâm cành: cắt cành → cắm đất → mọc rễ mới\nChiết cành: bóc vỏ → bọc đất → ra rễ → cắt trồng\nGhép: gắn cành cây này vào gốc cây khác', 2),
  C(512, 'example', 'Trồng đậu', 'Lấy hạt đậu → đặt trên bông ẩm → tưới nước → 3 ngày: nảy mầm!\nHạt → Mầm → Cây con → Cây lớn → Ra hoa → Quả → Hạt mới', 3),
  C(512, 'tip', 'Mẹo nhớ 💡', 'Hạt = cách tự nhiên nhất. Giâm/Chiết/Ghép = con người hỗ trợ! 🌱', 4),

  // 513: Phân loại động vật
  C(513, 'intro', 'Thế giới động vật! 🐾', 'Động vật chia thành nhiều nhóm!', 1),
  C(513, 'explain', 'Có xương sống & Không xương sống', 'CÓ XƯƠNG SỐNG:\n🐟 Cá, 🐸 Lưỡng cư, 🐍 Bò sát, 🐦 Chim, 🐘 Thú\nKHÔNG XƯƠNG SỐNG:\n🦋 Côn trùng, 🐛 Giun, 🐙 Thân mềm, 🦐 Giáp xác', 2),
  C(513, 'example', 'Phân loại', 'Chó 🐶 → Thú (có xương sống, nuôi con bằng sữa)\nCá vàng 🐟 → Cá (sống dưới nước, thở bằng mang)\nBướm 🦋 → Côn trùng (không xương sống, 6 chân)', 3),
  C(513, 'tip', 'Mẹo nhớ 💡', 'CÓ XƯƠNG: Cá-Ếch-Rắn-Chim-Thú (5 nhóm). Khoa họcÔNG XƯƠNG: bé hơn, nhiều hơn!', 4),

  // 514: Chuỗi thức ăn
  C(514, 'intro', 'Ai ăn gì? 🔗', 'Trong tự nhiên, sinh vật ăn lẫn nhau!', 1),
  C(514, 'explain', 'Chuỗi thức ăn', 'SẢN XUẤT: cây cỏ (tạo thức ăn từ ánh sáng)\nTIÊU THỤ BẬC 1: ĐV ăn cỏ (thỏ, châu chấu)\nTIÊU THỤ BẬC 2: ĐV ăn thịt (ếch, chim)\nĐỈNH: ĐV ăn thịt lớn (rắn, đại bàng)', 2),
  C(514, 'example', 'Một chuỗi thức ăn', 'Cỏ 🌿 → Châu chấu 🦗 → Ếch 🐸 → Rắn 🐍 → Đại bàng 🦅\nMũi tên = "bị ăn bởi"', 3),
  C(514, 'tip', 'Mẹo nhớ 💡', 'Cỏ → Sâu → Chim → Rắn → Đại bàng. Luôn bắt đầu từ CÂY!', 4),

  // 515: Thích nghi
  C(515, 'intro', 'Động vật thích nghi! 🦎', 'Mỗi ĐV có cách sống phù hợp với nơi ở!', 1),
  C(515, 'explain', 'Cách thích nghi', 'Cá 🐟: vây để bơi, mang để thở dưới nước\nChim 🐦: cánh để bay, lông vũ nhẹ\nLạc đà 🐪: bướu dự trữ mỡ, chịu nóng sa mạc\nGấu Bắc Cực 🐻‍❄️: lông trắng dày, chịu lạnh', 2),
  C(515, 'example', 'Tại sao?', 'Cá không sống trên cạn → không có phổi\nChim bay được → xương rỗng, nhẹ\nTắc kè đổi màu → ngụy trang tránh kẻ thù', 3),
  C(515, 'tip', 'Mẹo nhớ 💡', 'Mỗi ĐV có "siêu năng lực" riêng để SỐNG SÓT! 💪', 4),

  // 516: Bảo vệ động vật
  C(516, 'intro', 'Bảo vệ ĐV! 🛡️', 'Nhiều loài ĐV đang bị đe dọa!', 1),
  C(516, 'explain', 'Tại sao & Cách bảo vệ', 'Nguyên nhân: Săn bắt, phá rừng, ô nhiễm\nĐộng vật quý hiếm Việt Nam: Sao la, Voi, Voọc mũi hếch, Rùa Hoàn Kiếm\nCách bảo vệ: Không săn bắt, không mua bán ĐV hoang dã, trồng rừng', 2),
  C(516, 'example', 'Sách Đỏ', 'Sách Đỏ ghi tên các loài sắp tuyệt chủng\nVoọc mũi hếch 🐒: chỉ còn ~200 con ở Việt Nam\nRùa Hoàn Kiếm 🐢: cực kỳ nguy cấp', 3),
  C(516, 'tip', 'Hành động nhỏ 💚', 'Không mua ĐV hoang dã! Trồng cây! Bảo vệ môi trường sống của ĐV!', 4),

  // 517: Dinh dưỡng
  C(517, 'intro', 'Ăn gì cho khỏe? 🥗', 'Cần ăn đủ các nhóm chất dinh dưỡng!', 1),
  C(517, 'explain', '5 nhóm chất', 'Đạm (protein): thịt, cá, trứng, đậu → xây dựng cơ thể\nTinh bột: cơm, bánh mì → năng lượng\nChất béo: dầu, mỡ → dự trữ năng lượng\nVitamin: rau, trái cây → chống bệnh\nKhoáng chất: canxi (sữa), sắt (rau xanh)', 2),
  C(517, 'example', 'Bữa ăn cân bằng', '🍚 Cơm (tinh bột)\n🍗 Thịt gà (đạm)\n🥗 Rau xanh (vitamin, khoáng)\n🍊 Cam (vitamin C)\n🥛 Sữa (canxi)', 3),
  C(517, 'tip', 'Mẹo nhớ 💡', 'Tháp dinh dưỡng: Tinh bột (nhiều) → Rau quả → Đạm → Chất béo (ít)', 4),

  // 518: Hệ tiêu hóa
  C(518, 'intro', 'Đường đi thức ăn! 🍽️', 'Thức ăn đi qua nhiều cơ quan!', 1),
  C(518, 'explain', 'Quá trình tiêu hóa', 'Miệng 👄: nhai + nước bọt → nhỏ + mềm\nThực quản: ống dẫn xuống dạ dày\nDạ dày: nghiền + axit tiêu hóa\nRuột non: hấp thụ chất dinh dưỡng\nRuột già: hấp thụ nước + thải bỏ', 2),
  C(518, 'example', 'Thí nghiệm bánh mì', 'Nhai bánh mì lâu → thấy ngọt!\nVì nước bọt biến tinh bột → đường\nĐó là bước đầu tiên của tiêu hóa!', 3),
  C(518, 'tip', 'Mẹo nhớ 💡', 'Miệng→Thực quản→Dạ dày→Ruột non→Ruột già. Nhai kỹ giúp tiêu hóa dễ!', 4),

  // 519: Hệ hô hấp
  C(519, 'intro', 'Hít thở! 🫁', 'Cơ thể cần oxy để sống!', 1),
  C(519, 'explain', 'Quá trình hô hấp', 'Hít vào: Không khí (O₂) → Mũi → Khí quản → Phổi\nTrao đổi: Phổi lấy O₂ → máu. Máu thải CO₂ → phổi\nThở ra: CO₂ ra ngoài\nHít: O₂ vào. Thở: CO₂ ra', 2),
  C(519, 'example', 'Đếm nhịp thở', 'Bình thường: 16-20 nhịp thở/phút\nSau chạy: thở nhanh hơn (cần nhiều O₂)\nVì sao? Cơ bắp hoạt động → cần nhiều oxy!', 3),
  C(519, 'tip', 'Mẹo nhớ 💡', 'HÍT = O₂ VÀO. THỞ = CO₂ RA. Phổi = nơi trao đổi khí!', 4),

  // 520: Phòng bệnh
  C(520, 'intro', 'Phòng bệnh! 🛡️', 'Phòng bệnh hơn chữa bệnh!', 1),
  C(520, 'explain', 'Cách phòng bệnh', 'Rửa tay: trước ăn, sau WC → diệt vi khuẩn\nĂn chín uống sôi → tránh ngộ độc\nTiêm phòng → tạo miễn dịch\nTập thể dục → cơ thể khỏe\nNgủ đủ giấc → phục hồi sức khỏe', 2),
  C(520, 'example', 'Rửa tay đúng cách', '6 bước rửa tay: Ướt tay → Xà phòng → Chà lòng bàn tay → Chà mu bàn tay → Chà kẽ ngón → Xả sạch → Lau khô', 3),
  C(520, 'tip', 'Mẹo nhớ 💡', 'Rửa tay + Ăn sạch + Tiêm phòng + Thể dục + Ngủ đủ = Khoa họcỎE MẠNH! 💪', 4),

  // ===== LỚP 5 =====
  // 521: Biến đổi hóa học
  C(521, 'intro', 'Hóa học quanh ta! 🧪', 'Nhiều biến đổi hóa học xảy ra hàng ngày!', 1),
  C(521, 'explain', 'Biến đổi hóa học', 'Dấu hiệu biến đổi hóa học:\n- Tạo chất MỚI (màu, mùi, vị khác)\n- Tỏa nhiệt hoặc thu nhiệt\n- Phát sáng\nVí dụ: nến cháy, sắt gỉ, thức ăn lên men', 2),
  C(521, 'example', 'So sánh', 'Nến CHÁY: sáp → CO₂ + H₂O + ánh sáng (hóa học)\nNến TAN chảy: sáp rắn → sáp lỏng (lí học)\nGiấm + baking soda → sủi bọt CO₂ (hóa học)', 3),
  C(521, 'tip', 'Mẹo nhớ 💡', 'Có CHẤT MỚI = hóa học. Chỉ thay HÌNH DẠNG = lí học!', 4),

  // 522: Nung nóng và làm lạnh
  C(522, 'intro', 'Nóng & Lạnh! 🔥❄️', 'Nhiệt độ thay đổi trạng thái chất!', 1),
  C(522, 'explain', 'Chuyển thể', 'Nung nóng: Rắn → Lỏng (nóng chảy) → Khí (bay hơi)\nLàm lạnh: Khí → Lỏng (ngưng tụ) → Rắn (đông đặc)\nMỗi chất có nhiệt độ nóng chảy/sôi khác nhau', 2),
  C(522, 'example', 'Nước', 'Nước đá 0°C → Nước 0°C (nóng chảy)\nNước → Hơi nước 100°C (sôi/bay hơi)\nHơi nước gặp lạnh → Giọt nước (ngưng tụ)', 3),
  C(522, 'tip', 'Mẹo nhớ 💡', 'Nóng chảy 🫠 → Bay hơi 💨. Ngưng tụ 💧 → Đông đặc 🧊', 4),

  // 523: Tách chất
  C(523, 'intro', 'Tách chất! 🔬', 'Cách tách các chất ra khỏi hỗn hợp!', 1),
  C(523, 'explain', 'Phương pháp tách', 'Lọc: giấy lọc giữ chất rắn (lọc nước bẩn)\nBay hơi: đun nước muối → nước bay hơi → còn muối\nĐể lắng: hỗn hợp nước + cát → cát lắng xuống\nNam châm: tách sắt ra khỏi hỗn hợp', 2),
  C(523, 'example', 'Làm muối', 'Nước biển (nước + muối) → Phơi nắng (bay hơi nước) → Muối trắng!\nĐây là cách làm muối từ xưa đến nay!', 3),
  C(523, 'tip', 'Mẹo nhớ 💡', 'LỌC = giữ rắn. BAY HƠI = giữ tan. LẮNG = nặng xuống. NAM CHÂM = hút sắt!', 4),

  // 524: Sự oxi hóa
  C(524, 'intro', 'Oxi hóa! 🍎', 'Tại sao táo cắt bị nâu?', 1),
  C(524, 'explain', 'Oxi hóa là gì?', 'Oxi hóa = chất phản ứng với O₂ trong không khí\nSắt gỉ: Fe + O₂ → gỉ sắt (nâu đỏ)\nTáo nâu: chất trong táo + O₂ → nâu\nThực phẩm ôi: vi khuẩn + O₂ → phân hủy', 2),
  C(524, 'example', 'Thí nghiệm', 'Cắt 2 miếng táo:\n🍎 Miếng 1: để ngoài → 30 phút → NÂU\n🍎 Miếng 2: bọc nilon → 30 phút → vẫn TRẮNG\nVì nilon ngăn O₂ tiếp xúc!', 3),
  C(524, 'tip', 'Mẹo nhớ 💡', 'Ngăn OXI = Ngăn oxi hóa! Bọc kín, để tủ lạnh = giữ tươi!', 4),

  // 525: Mạch điện
  C(525, 'intro', 'Mạch điện! 💡', 'Làm sao đèn sáng?', 1),
  C(525, 'explain', 'Mạch điện đơn giản', 'Pin 🔋 → Dây dẫn → Bóng đèn 💡 → Dây dẫn → Pin\nMạch kín → đèn sáng ✅\nMạch hở (đứt dây) → đèn tắt ❌\nCông tắc = đóng/mở mạch', 2),
  C(525, 'example', 'Lắp mạch điện', 'Pin 1.5V + dây đồng + bóng đèn nhỏ\nNối dây 2 đầu pin → đèn SÁNG!\nTháo 1 dây → đèn TẮT (mạch hở)', 3),
  C(525, 'tip', 'Mẹo nhớ 💡', 'Mạch KÍN = sáng. Mạch HỞ = tắt. Luôn cần PIN + DÂY + ĐÈN!', 4),

  // 526: Nam châm
  C(526, 'intro', 'Nam châm! 🧲', 'Nam châm có sức hút bí ẩn!', 1),
  C(526, 'explain', 'Tính chất nam châm', 'Hút sắt, thép, niken, coban\nCó 2 cực: Bắc (N) và Nam (S)\nCùng cực → ĐẨY. Khác cực → HÚT\nLa bàn dùng nam châm: kim luôn chỉ Bắc-Nam', 2),
  C(526, 'example', 'Thí nghiệm', 'Đưa nam châm lại gần:\n📎 Kẹp sắt → HÚT ✅\n🪙 Xu đồng → Khoa họcÔNG hút ❌\n🗝️ Chìa khóa sắt → HÚT ✅', 3),
  C(526, 'tip', 'Mẹo nhớ 💡', 'Cùng cực ĐẨY 🚫, Khác cực HÚT ❤️. N=North (Bắc), S=South (Nam)!', 4),

  // 527: Năng lượng mặt trời
  C(527, 'intro', 'Mặt Trời! ☀️', 'Mặt Trời cho ta năng lượng!', 1),
  C(527, 'explain', 'Năng lượng Mặt Trời', 'Mặt Trời cung cấp: ÁNH SÁNG + NHIỆT cho Trái Đất\nCây dùng ánh sáng → quang hợp\nCon người dùng: pin mặt trời, sưởi ấm, phơi đồ\nĐây là NĂNG LƯỢNG SẠCH — không ô nhiễm!', 2),
  C(527, 'example', 'Ứng dụng', '☀️ Pin mặt trời trên mái nhà → điện\n☀️ Bình nước nóng năng lượng mặt trời\n☀️ Phơi quần áo = dùng NLMT miễn phí!', 3),
  C(527, 'tip', 'Mẹo nhớ 💡', 'Mặt Trời = NHÀ MÁY NĂNG LƯỢNG MIỄN PHÍ! Sạch + Vô tận! ☀️', 4),

  // 528: Tiết kiệm Năng lượng
  C(528, 'intro', 'Tiết kiệm! 💚', 'Năng lượng quý, hãy tiết kiệm!', 1),
  C(528, 'explain', 'Cách tiết kiệm', 'Tắt đèn khi ra khỏi phòng 💡\nTắt quạt/điều hòa khi không cần 🌀\nĐi bộ/xe đạp thay vì xe máy 🚲\nDùng năng lượng mặt trời ☀️\nChọn thiết bị tiết kiệm điện ⭐', 2),
  C(528, 'example', 'Bảng so sánh', 'Đèn LED 💡: ít điện, sáng lâu\nĐèn sợi đốt: tốn điện, nóng, nhanh hỏng\nĐi xe đạp 🚲: 0 xăng, khỏe người\nĐi xe máy 🏍️: tốn xăng, khói bụi', 3),
  C(528, 'tip', 'Hành động nhỏ 💚', 'Tắt—Tắt—Tắt! Tắt đèn, tắt quạt, tắt Thực vật khi không dùng!', 4),

  // 529: Chuỗi thức ăn NC
  C(529, 'intro', 'Lưới thức ăn! 🕸️', 'Trong tự nhiên, chuỗi thức ăn phức tạp hơn!', 1),
  C(529, 'explain', 'Từ chuỗi → lưới', 'Chuỗi: Cỏ → Thỏ → Cáo\nLưới: Cỏ → Thỏ + Châu chấu\n       Thỏ → Cáo + Đại bàng\n       Châu chấu → Ếch → Rắn\nNhiều chuỗi đan xen = LƯỚI thức ăn', 2),
  C(529, 'example', 'Lưới thức ăn đồng cỏ', 'Cỏ 🌿 → Châu chấu 🦗 → Ếch 🐸 → Rắn 🐍\nCỏ 🌿 → Thỏ 🐰 → Cáo 🦊\nCỏ 🌿 → Chuột 🐭 → Rắn 🐍 → Đại bàng 🦅', 3),
  C(529, 'tip', 'Mẹo nhớ 💡', 'CHUỖI = 1 đường. LƯỚI = nhiều đường đan xen. Như mạng nhện! 🕸️', 4),

  // 530: Hệ sinh thái
  C(530, 'intro', 'Hệ sinh thái! 🌍', 'Sinh vật + Môi trường = Hệ sinh thái!', 1),
  C(530, 'explain', 'Các hệ sinh thái', 'HST Rừng 🌲: nhiều cây, chim, thú, côn trùng\nHST Ao hồ 🐸: cá, ếch, rong, tảo\nHST Biển 🐳: cá, san hô, tôm cua, rong biển\nHST Đồng ruộng 🌾: lúa, cua, ếch, chuồn chuồn', 2),
  C(530, 'example', 'HST Ao', 'Nước + ánh sáng + bùn đất\nRong + tảo → Cá → Chim → Phân → Bùn\nTất cả liên kết với nhau!', 3),
  C(530, 'tip', 'Mẹo nhớ 💡', 'HST = SINH VẬT + MÔI TRƯỜNG SỐNG. Mỗi nơi = 1 HST riêng!', 4),

  // 531: Cân bằng ST
  C(531, 'intro', 'Cân bằng! ⚖️', 'Tự nhiên có sự cân bằng!', 1),
  C(531, 'explain', 'Cân bằng sinh thái', 'Mỗi loài đều CẦN THIẾT:\nCỏ → thức ăn cho thỏ\nThỏ → thức ăn cho cáo\nMất cỏ → thỏ chết → cáo chết!\nMất cáo → thỏ quá nhiều → hết cỏ!', 2),
  C(531, 'example', 'Ví dụ thực tế', 'Săn hết rắn → chuột TĂNG → phá lúa!\nPhá rừng → mất cây → lũ lụt + ĐV mất nhà\nThả cá vào ao → muỗi GIẢM (cá ăn bọ gậy)', 3),
  C(531, 'tip', 'Mẹo nhớ 💡', 'MỖI SINH VẬT ĐỀU QUAN TRỌNG! Bỏ 1 mắt xích → hỏng cả chuỗi!', 4),

  // 532: Đa dạng SH
  C(532, 'intro', 'Đa dạng! 🦜🌺🐟', 'Trái Đất có hàng triệu loài sinh vật!', 1),
  C(532, 'explain', 'Đa dạng sinh học', 'Trái Đất: ~8 triệu loài sinh vật!\nĐa dạng = nhiều loài khác nhau\nViệt Nam: top 16 nước đa dạng SH nhất!\nĐộng vật đặc hữu Việt Nam: Sao la, Voọc mũi hếch', 2),
  C(532, 'example', 'Việt Nam đa dạng!', '🌿 12.000+ loài thực vật\n🐾 310+ loài thú\n🐦 840+ loài chim\n🐸 162+ loài lưỡng cư\n🐍 296+ loài bò sát', 3),
  C(532, 'tip', 'Mẹo nhớ 💡', 'Bảo vệ đa dạng SH = bảo vệ TƯƠNG LAI! Mỗi loài đều quý!', 4),

  // 533: Hệ Mặt Trời
  C(533, 'intro', 'Hệ Mặt Trời! 🪐', 'Trái Đất nằm trong Hệ Mặt Trời!', 1),
  C(533, 'explain', '8 hành tinh', 'Thứ tự từ Mặt Trời ra:\n1. Thủy tinh ☿ 2. Kim tinh ♀ 3. TRÁI ĐẤT 🌍\n4. Hỏa tinh ♂ 5. Mộc tinh ♃ 6. Thổ tinh 🪐\n7. Thiên Vương tinh ♅ 8. Hải Vương tinh ♆', 2),
  C(533, 'example', 'Trái Đất đặc biệt', 'Vị trí thứ 3 → không quá nóng, không quá lạnh\nCó nước lỏng → có sự sống!\nBầu khí quyển → bảo vệ khỏi tia UV', 3),
  C(533, 'tip', 'Mẹo nhớ 💡', 'Thủy-Kim-Đất-Hỏa-Mộc-Thổ-Thiên-Hải. Nhớ: "Từ Kim Đến Học Mỗi Thứ Tư Hai"', 4),

  // 534: TĐ quay
  C(534, 'intro', 'Trái Đất quay! 🌍', 'Trái Đất không đứng yên!', 1),
  C(534, 'explain', '2 chuyển động', 'TỰ QUAY quanh trục: 24 giờ/vòng → Ngày & Đêm\nQUAY quanh Mặt Trời: 365 ngày/vòng → 4 Mùa\nTrục nghiêng 23.5° → ánh sáng không đều → mùa', 2),
  C(534, 'example', 'Ngày & Đêm', 'Mặt hướng Mặt Trời → NGÀY (sáng) ☀️\nMặt quay lưng Mặt Trời → ĐÊM (tối) 🌙\n12 giờ ngày + 12 giờ đêm ≈ 24 giờ', 3),
  C(534, 'tip', 'Mẹo nhớ 💡', 'Tự quay = NGÀY ĐÊM (24h). Quay quanh Mặt Trời = 4 MÙA (365 ngày)!', 4),

  // 535: Mùa & Khí hậu
  C(535, 'intro', '4 Mùa! 🌸☀️🍂❄️', 'Tại sao có 4 mùa?', 1),
  C(535, 'explain', 'Nguyên nhân', 'Trục TĐ nghiêng → khi quay quanh Mặt Trời:\nBán cầu Bắc hướng Mặt Trời → Hè (nóng)\nBán cầu Bắc xa Mặt Trời → Đông (lạnh)\nViệt Nam: 2 mùa chính: MƯA và Khoa họcÔ', 2),
  C(535, 'example', '4 mùa', '🌸 Xuân: ấm áp, hoa nở\n☀️ Hè: nóng, nghỉ hè\n🍂 Thu: mát, lá vàng\n❄️ Đông: lạnh, ngắn ngày', 3),
  C(535, 'tip', 'Mẹo nhớ 💡', 'Việt Nam = nước nhiệt đới: NÓNG quanh năm, MƯA nhiều. Xuân-Hạ-Thu-Đông!', 4),

  // 536: Địa hình Việt Nam
  C(536, 'intro', 'Địa hình Việt Nam! 🗺️', 'Việt Nam có nhiều dạng địa hình!', 1),
  C(536, 'explain', 'Các dạng địa hình', 'Đồng bằng: bằng phẳng (ĐB Sông Hồng, ĐB Sông Cửu Long)\nNúi: Hoàng Liên Sơn (Fansipan 3143m)\nCao nguyên: Tây Nguyên (Đắk Lắk, Lâm Đồng)\nVen biển: 3260 km bờ biển', 2),
  C(536, 'example', '3 miền Việt Nam', 'Miền Bắc: ĐB Sông Hồng, núi phía Bắc\nMiền Trung: dãy Trường Sơn, dải ven biển hẹp\nMiền Nam: ĐB Sông Cửu Long rộng lớn', 3),
  C(536, 'tip', 'Mẹo nhớ 💡', 'Việt Nam hình chữ S: Bắc có NÚI, Trung dài HẸP, Nam ĐỒNG BẰNG rộng!', 4),

  // 537: Ô nhiễm
  C(537, 'intro', 'Ô nhiễm! 😷', 'Môi trường đang bị ô nhiễm!', 1),
  C(537, 'explain', '3 loại ô nhiễm', 'Ô nhiễm Khoa họcÔNG Khoa họcÍ: khói xe, nhà máy → ho, bệnh phổi\nÔ nhiễm NƯỚC: rác thải, hóa chất → cá chết, bệnh\nÔ nhiễm ĐẤT: rác nhựa, thuốc trừ sâu → đất hỏng', 2),
  C(537, 'example', 'Ở Việt Nam', 'Hà Nội: ô nhiễm không khí (bụi mịn PM2.5)\nSông Tô Lịch: ô nhiễm nước nặng\nRác nhựa: Việt Nam xả 1.8 triệu tấn/năm ra biển', 3),
  C(537, 'tip', 'Hành động! 💚', 'Không xả rác! Phân loại rác! Dùng túi vải thay túi nilon!', 4),

  // 538: BĐKhoa học
  C(538, 'intro', 'Biến đổi khí hậu! 🌡️', 'Trái Đất đang nóng lên!', 1),
  C(538, 'explain', 'Hiệu ứng nhà kính', 'Khí nhà kính (CO₂, CH₄) → giữ nhiệt → TĐ nóng lên\nNguyên nhân: đốt nhiên liệu, phá rừng, chăn nuôi\nHậu quả: nước biển dâng, bão lũ, hạn hán', 2),
  C(538, 'example', 'Việt Nam bị ảnh hưởng', 'Việt Nam: 1 trong 5 nước bị ảnh hưởng BĐKhoa học nhất!\nĐBSCL: nguy cơ ngập do nước biển dâng\nBão: ngày càng mạnh và nhiều hơn', 3),
  C(538, 'tip', 'Hành động! 🌿', 'Trồng cây = hấp thụ CO₂! Tiết kiệm điện! Đi xe đạp!', 4),

  // 539: Tài nguyên thiên nhiên
  C(539, 'intro', 'Tài nguyên! ⛏️', 'Tài nguyên thiên nhiên quý giá!', 1),
  C(539, 'explain', 'Các loại tài nguyên', 'Tái tạo: nước, rừng, không khí (có thể phục hồi)\nKhông tái tạo: dầu mỏ, than đá, khoáng sản (dùng hết = hết)\nPhải SỬ DỤNG TIẾT KIỆM + BẢO VỆ!', 2),
  C(539, 'example', 'Tài nguyên Việt Nam', '🌲 Rừng: 42% diện tích Việt Nam\n💧 Nước: sông Hồng, sông Mê Kông\n⛏️ Khoáng sản: than, dầu khí, đá vôi\n🌊 Biển: hải sản, du lịch', 3),
  C(539, 'tip', 'Mẹo nhớ 💡', 'Tái tạo = dùng SẼ CÓ LẠI. Không tái tạo = hết LÀ HẾT! Tiết kiệm!', 4),

  // 540: Bảo vệ Môi trường
  C(540, 'intro', 'Bảo vệ Trái Đất! 🌍', 'Mỗi hành động nhỏ đều quan trọng!', 1),
  C(540, 'explain', '5 hành động', '♻️ Phân loại rác: hữu cơ, tái chế, nguy hại\n🌳 Trồng cây xanh\n💡 Tiết kiệm điện, nước\n🚲 Đi bộ/xe đạp\n🚫 Nói Khoa họcÔNG với nhựa dùng 1 lần', 2),
  C(540, 'example', 'Em làm được!', '✅ Mang bình nước thay chai nhựa\n✅ Phân loại rác ở nhà\n✅ Tắt đèn khi ra khỏi phòng\n✅ Trồng 1 cây xanh\n✅ Kể bạn bè cùng bảo vệ Môi trường!', 3),
  C(540, 'tip', 'Khẩu hiệu! 💚', 'GIẢM — TÁI SỬ DỤNG — TÁI CHẾ (Reduce — Reuse — Recycle)!', 4),
];

