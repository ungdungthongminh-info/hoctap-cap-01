/**
 * TỰ NHIÊN & XÃ HỘI LỚP 1 — 80 thẻ dạy (4 thẻ/bài × 20 bài)
 * ID bắt đầu từ 601 (tránh trùng Math 1-160, Vietnamese 501-580)
 */
import type { LessonCard } from './seedData';

let cid = 600;
const C = (lessonId: number, type: LessonCard['cardType'], title: string, content: string): LessonCard => ({
  id: ++cid,
  lessonId,
  cardType: type,
  title,
  content,
  exampleJson: null,
  sortOrder: cid - 600,
  isActive: 1,
});

export const natureCards1: LessonCard[] = [
  // === 201: Gia đình của em ===
  C(201, 'intro', 'Gia đình là gì?', 'Gia đình là những người thân yêu nhất sống cùng bé: bố, mẹ, ông, bà, anh, chị, em.'),
  C(201, 'explain', 'Thành viên gia đình', 'Ông bà: sinh ra bố mẹ, rất yêu cháu\nBố mẹ: chăm sóc, nuôi dạy bé\nAnh/chị/em: cùng học, cùng chơi\nMỗi người có vai trò riêng!'),
  C(201, 'example', 'Gia đình bé An', 'Gia đình An có 5 người:\n👴 Ông, 👵 Bà, 👨 Bố, 👩 Mẹ, 👦 An\nBố đi làm, mẹ nấu cơm, ông tưới cây, bà kể chuyện.'),
  C(201, 'tip', 'Yêu thương gia đình', 'Ngoan ngoãn, vâng lời bố mẹ.\nGiúp ông bà việc nhỏ.\nKhông cãi nhau với anh chị em.\nNói "Con yêu bố mẹ" mỗi ngày!'),

  // === 202: Cơ thể của em ===
  C(202, 'intro', 'Cơ thể kỳ diệu', 'Cơ thể bé có nhiều bộ phận, mỗi bộ phận có công việc riêng. Hãy cùng khám phá!'),
  C(202, 'explain', 'Các bộ phận chính', 'Đầu: có mắt (nhìn), tai (nghe), mũi (ngửi), miệng (ăn, nói)\nMình: có ngực (phổi), bụng (dạ dày)\nTay: cầm nắm, viết chữ\nChân: đi, chạy, nhảy'),
  C(202, 'example', 'Chỉ và nói', '👁️ Mắt — để nhìn\n👂 Tai — để nghe\n👃 Mũi — để ngửi\n👄 Miệng — để ăn và nói\n✋ Tay — để cầm\n🦶 Chân — để đi'),
  C(202, 'tip', 'Bảo vệ cơ thể', 'Ăn đủ chất: cơm, rau, thịt, cá.\nNgủ đủ giấc: 9-10 tiếng.\nTập thể dục mỗi ngày.\nKhông chạm vào vật nguy hiểm.'),

  // === 203: Giữ gìn vệ sinh cá nhân ===
  C(203, 'intro', 'Sạch sẽ = Khỏe mạnh', 'Giữ vệ sinh giúp bé không bị ốm, luôn khỏe mạnh và được mọi người yêu quý.'),
  C(203, 'explain', '6 bước rửa tay', '1. Làm ướt tay, lấy xà phòng\n2. Chà lòng bàn tay\n3. Chà mu bàn tay\n4. Chà kẽ ngón tay\n5. Chà đầu ngón tay\n6. Rửa sạch, lau khô'),
  C(203, 'example', 'Thói quen vệ sinh mỗi ngày', 'Sáng: đánh răng, rửa mặt\nTrước ăn: rửa tay\nSau ăn: súc miệng\nTối: tắm, đánh răng, thay quần áo sạch'),
  C(203, 'tip', 'Khi nào rửa tay?', 'Trước khi ăn 🍚\nSau khi đi vệ sinh 🚽\nSau khi chơi ngoài trời 🏃\nSau khi hắt hơi, ho 🤧'),

  // === 204: An toàn trong nhà ===
  C(204, 'intro', 'Nhà an toàn', 'Trong nhà có nhiều thứ nguy hiểm: ổ điện, bếp lửa, dao kéo. Bé cần biết để phòng tránh!'),
  C(204, 'explain', 'Nguy hiểm cần tránh', '⚡ Điện: Không chọc tay vào ổ điện\n🔥 Lửa: Không chơi gần bếp đang nấu\n🔪 Vật sắc: Không cầm dao kéo\n💊 Thuốc: Không tự ý uống thuốc\n🪜 Cao: Không leo trèo tủ, ban công'),
  C(204, 'example', 'Nếu gặp nguy hiểm...', 'Cháy: Chạy ra ngoài, gọi người lớn\nĐiện giật: Không chạm người bị giật, gọi 113\nBị thương: Báo bố mẹ ngay'),
  C(204, 'tip', 'Quy tắc vàng', 'Không biết → HỎI bố mẹ!\nNguy hiểm → TRÁNH xa!\nBị đau → NÓI ngay!'),

  // === 205: Trường học của em ===
  C(205, 'intro', 'Trường học vui vẻ', 'Trường học là nơi bé đến học chữ, học toán, chơi với bạn và gặp thầy cô yêu quý.'),
  C(205, 'explain', 'Các khu vực trong trường', 'Lớp học: nơi ngồi học bài\nSân trường: nơi chơi giờ ra chơi\nThư viện: nơi đọc sách\nNhà vệ sinh: giữ sạch sẽ\nCăn tin: nơi ăn trưa'),
  C(205, 'example', 'Một ngày ở trường', '7:00 — Vào lớp, chào cô\n7:30 — Học Toán\n8:30 — Giờ ra chơi\n9:00 — Học Tiếng Việt\n10:30 — Tan học, về nhà'),
  C(205, 'tip', 'Nội quy trường học', 'Đi học đúng giờ ⏰\nNghe lời thầy cô 👩‍🏫\nKhông chạy trong lớp 🚶\nGiữ gìn đồ dùng 📚'),

  // === 206: Thầy cô và bạn bè ===
  C(206, 'intro', 'Thầy cô yêu thương', 'Thầy cô là người dạy bé kiến thức. Bạn bè cùng học, cùng chơi. Hãy yêu quý mọi người!'),
  C(206, 'explain', 'Cách ứng xử đẹp', 'Với thầy cô: Chào hỏi lễ phép, vâng lời\nVới bạn bè: Chia sẻ, giúp đỡ, không trêu chọc\nKhi sai: Xin lỗi chân thành\nKhi được giúp: Nói cảm ơn'),
  C(206, 'example', 'Tình huống thực tế', 'Bạn bị ngã → Đỡ bạn dậy, hỏi thăm\nBạn quên bút → Cho bạn mượn\nGiờ ra chơi → Rủ bạn cùng chơi\nCô hỏi bài → Giơ tay xin phát biểu'),
  C(206, 'tip', 'Bạn tốt là...', 'Biết chia sẻ 🤝\nKhông nói xấu bạn 🙊\nCùng nhau học bài 📖\nGiúp bạn khi khó khăn 💪'),

  // === 207: Đồ dùng học tập ===
  C(207, 'intro', 'Đồ dùng quan trọng', 'Sách, vở, bút, thước là "người bạn" giúp bé học tốt. Hãy giữ gìn cẩn thận!'),
  C(207, 'explain', 'Đồ dùng cần có', '📚 Sách giáo khoa: để đọc bài\n📓 Vở: để viết bài\n✏️ Bút chì: để viết, vẽ\n📏 Thước kẻ: để kẻ thẳng\n🧹 Tẩy: để xóa sai\n🎒 Cặp sách: để đựng tất cả'),
  C(207, 'example', 'Sắp cặp đi học', 'Tối trước khi ngủ:\n1. Xem thời khóa biểu ngày mai\n2. Lấy sách + vở đúng môn\n3. Kiểm tra bút, tẩy, thước\n4. Xếp gọn vào cặp'),
  C(207, 'tip', 'Giữ gìn đồ dùng', 'Bọc bìa sách vở 📗\nKhông bẻ bút chì ✏️\nKhông vẽ bậy lên sách 🚫\nĐể đồ đúng chỗ sau khi dùng 📦'),

  // === 208: An toàn giao thông ===
  C(208, 'intro', 'Đi đường an toàn', 'Đường phố có xe ô tô, xe máy chạy nhanh. Bé cần biết quy tắc để đi an toàn!'),
  C(208, 'explain', 'Đèn tín hiệu', '🟢 Đèn xanh: ĐƯỢC đi\n🔴 Đèn đỏ: DỪNG lại\n🟡 Đèn vàng: CHẬM lại, chuẩn bị dừng\nLuôn nhìn đèn trước khi qua đường!'),
  C(208, 'example', 'Qua đường đúng cách', '1. Dừng lại ở vỉa hè\n2. Nhìn TRÁI → PHẢI → TRÁI\n3. Đợi xe dừng hết\n4. Đi thẳng, không chạy\n5. Nắm tay người lớn'),
  C(208, 'tip', 'Quy tắc nhớ', 'Đi bộ trên VỈA HÈ 🚶\nQua đường ở VẠCH KẺ 🦓\nĐội MŨ BẢO HIỂM khi đi xe 🪖\nKhông chơi ngoài đường 🚫'),

  // === 209: Bưu điện, bệnh viện, chợ ===
  C(209, 'intro', 'Nơi công cộng', 'Bưu điện, bệnh viện, chợ là những nơi mọi người đến để gửi thư, khám bệnh, mua đồ.'),
  C(209, 'explain', 'Công dụng mỗi nơi', '📮 Bưu điện: gửi thư, gửi bưu phẩm\n🏥 Bệnh viện: khám bệnh, chữa bệnh\n🏪 Chợ/siêu thị: mua thức ăn, đồ dùng\n📚 Thư viện: mượn sách đọc\n🎭 Rạp: xem phim, xem kịch'),
  C(209, 'example', 'Bé An đi chợ', 'Mẹ dắt An ra chợ.\nAn thấy: rau xanh, thịt cá, hoa quả.\nMẹ mua: gạo, rau, cá.\nAn giúp mẹ xách túi nhỏ.'),
  C(209, 'tip', 'Ở nơi công cộng', 'Đi cùng người lớn 👨‍👧\nKhông chạy lung tung 🚫\nNói nhỏ, lịch sự 🤫\nXếp hàng chờ đến lượt 🧍'),

  // === 210: Nghề nghiệp quanh em ===
  C(210, 'intro', 'Mỗi người một nghề', 'Mọi người ai cũng có một nghề. Mỗi nghề đều quan trọng và đáng quý!'),
  C(210, 'explain', 'Một số nghề phổ biến', '👩‍⚕️ Bác sĩ: khám chữa bệnh\n👩‍🏫 Giáo viên: dạy học\n👨‍🌾 Nông dân: trồng lúa, rau\n👷 Công nhân: xây nhà, làm đồ\n👮 Cảnh sát: giữ an ninh'),
  C(210, 'example', 'Nghề nghiệp xung quanh', 'Ở trường: thầy cô giáo, bác bảo vệ, cô cấp dưỡng\nỞ bệnh viện: bác sĩ, y tá\nTrên đường: cảnh sát giao thông\nỞ siêu thị: nhân viên bán hàng'),
  C(210, 'tip', 'Tôn trọng mọi nghề', 'Không nghề nào hơn nghề nào.\nMỗi nghề giúp cuộc sống tốt hơn.\nBé muốn làm nghề gì khi lớn lên? 🤔'),

  // === 211: Giữ gìn môi trường ===
  C(211, 'intro', 'Trái đất xanh', 'Môi trường là nhà chung của tất cả. Bảo vệ môi trường = bảo vệ chính mình!'),
  C(211, 'explain', 'Cách bảo vệ môi trường', '🗑️ Không vứt rác bừa bãi\n🌳 Trồng cây xanh\n💧 Tiết kiệm nước\n💡 Tắt đèn khi không dùng\n♻️ Tái sử dụng đồ cũ'),
  C(211, 'example', 'Phân loại rác', '🟢 Rác hữu cơ: vỏ trái cây, lá cây, cơm thừa → làm phân bón\n🔵 Rác tái chế: giấy, chai nhựa, lon → tái sử dụng\n🔴 Rác khác: túi nilon, pin → xử lý đặc biệt'),
  C(211, 'tip', 'Bé có thể làm gì?', 'Bỏ rác đúng chỗ mỗi ngày 🗑️\nTắt quạt khi ra khỏi phòng 💨\nDùng chai nước thay vì mua chai mới 🍶\nNhắc bạn bè giữ sạch lớp 🧹'),

  // === 212: Các mùa trong năm ===
  C(212, 'intro', '4 mùa đặc biệt', 'Một năm có 4 mùa, mỗi mùa có thời tiết và cảnh vật khác nhau. Cùng khám phá!'),
  C(212, 'explain', 'Đặc điểm mỗi mùa', '🌸 Xuân: ấm áp, hoa nở, Tết\n☀️ Hạ: nắng nóng, đi bơi, nghỉ hè\n🍂 Thu: mát mẻ, lá vàng rụng\n❄️ Đông: lạnh, mặc áo ấm'),
  C(212, 'example', 'Mùa nào làm gì?', 'Xuân: đi chơi Tết, ngắm hoa đào 🌸\nHạ: đi biển, ăn kem 🍦\nThu: khai giảng, đi picnic 🍂\nĐông: uống trà nóng, sưởi ấm ☕'),
  C(212, 'tip', 'Mặc đồ theo mùa', 'Hè: áo mỏng, mũ chống nắng ☀️\nĐông: áo khoác, khăn quàng ❄️\nMưa: áo mưa, ô ☔'),

  // === 213: Cây xanh quanh em ===
  C(213, 'intro', 'Cây xanh tuyệt vời', 'Cây xanh ở khắp nơi: vườn, công viên, ven đường. Cây cho con người nhiều lợi ích!'),
  C(213, 'explain', 'Bộ phận của cây', '🌱 Rễ: hút nước từ đất\n🪵 Thân: nâng đỡ cây\n🍃 Lá: hấp thụ ánh sáng, quang hợp\n🌸 Hoa: tạo ra quả\n🍎 Quả: chứa hạt để nhân giống'),
  C(213, 'example', 'Lợi ích của cây', 'Cho bóng mát: ngồi dưới gốc cây 🌳\nCho trái cây: cam, xoài, chuối 🍊\nCho gỗ: đóng bàn ghế 🪑\nCho không khí sạch: cây thở ra oxy 💨'),
  C(213, 'tip', 'Chăm sóc cây', 'Tưới nước đều đặn 💧\nKhông bẻ cành, ngắt lá 🚫\nTrồng thêm cây mới 🌱\nNhổ cỏ dại cho cây 🌿'),

  // === 214: Hoa và quả ===
  C(214, 'intro', 'Hoa và quả đẹp', 'Hoa cho hương thơm, màu sắc đẹp. Quả cho vitamin, giúp bé khỏe mạnh!'),
  C(214, 'explain', 'Các loại hoa', '🌹 Hoa hồng: nhiều màu, thơm\n🪷 Hoa sen: mọc dưới nước, quốc hoa Việt Nam\n🌻 Hoa hướng dương: luôn hướng về mặt trời\n🌼 Hoa cúc: nở vào mùa thu'),
  C(214, 'example', 'Các loại quả', '🍊 Cam: nhiều vitamin C\n🍌 Chuối: ngọt, dễ ăn\n🍉 Dưa hấu: mát, nhiều nước\n🥭 Xoài: thơm, ngọt\n🫐 Nho: nhỏ, ngọt'),
  C(214, 'tip', 'Ăn trái cây mỗi ngày', 'Trái cây giúp bé:\n🦷 Răng chắc khỏe\n👀 Mắt sáng\n💪 Cơ thể khỏe\nĂn ít nhất 2 loại quả mỗi ngày!'),

  // === 215: Con vật nuôi ===
  C(215, 'intro', 'Bạn thân bốn chân', 'Con vật nuôi sống cùng con người, được chăm sóc và mang lại nhiều lợi ích.'),
  C(215, 'explain', 'Vật nuôi phổ biến', '🐕 Chó: trung thành, giữ nhà\n🐈 Mèo: bắt chuột, dễ thương\n🐔 Gà: cho trứng, thịt\n🐄 Bò: cho sữa, kéo cày\n🐟 Cá: nuôi trong ao, hồ\n🐷 Lợn: nuôi lấy thịt'),
  C(215, 'example', 'Đặc điểm con vật nuôi', 'Chó: 4 chân, đuôi vẫy khi vui, sủa "gâu gâu"\nMèo: 4 chân, kêu "meo meo", thích ngủ\nGà: 2 chân, có mỏ, gáy "ò ó o" (gà trống)'),
  C(215, 'tip', 'Yêu thương động vật', 'Cho ăn đúng bữa 🍚\nChỗ ở sạch sẽ 🏠\nKhông đánh đập 🚫\nĐưa đi tiêm phòng 💉'),

  // === 216: Con vật hoang dã ===
  C(216, 'intro', 'Thế giới hoang dã', 'Con vật hoang dã sống trong rừng, biển, sa mạc. Chúng tự tìm thức ăn và tự bảo vệ.'),
  C(216, 'explain', 'Vật hoang dã nổi tiếng', '🐘 Voi: to nhất trên cạn, có vòi dài\n🐅 Hổ: "chúa sơn lâm", có vằn\n🐒 Khỉ: thông minh, leo cây giỏi\n🐍 Rắn: trườn, một số có nọc độc\n🦁 Sư tử: "vua của muông thú"'),
  C(216, 'example', 'Sống ở đâu?', 'Rừng: hổ, voi, khỉ, gấu 🌲\nBiển: cá voi, cá heo, rùa biển 🌊\nSa mạc: lạc đà, thằn lằn 🏜️\nBắc cực: gấu trắng, chim cánh cụt 🧊'),
  C(216, 'tip', 'Bảo vệ động vật', 'Không bắt thú rừng 🚫\nKhông mua bán động vật quý 💛\nBảo vệ rừng = bảo vệ nhà của chúng 🌳'),

  // === 217: Mặt trời và mặt trăng ===
  C(217, 'intro', 'Bầu trời kỳ diệu', 'Ban ngày có mặt trời sáng chói. Ban đêm có mặt trăng và sao lấp lánh. Cùng tìm hiểu!'),
  C(217, 'explain', 'Mặt trời & mặt trăng', '☀️ Mặt trời: nóng, cho ánh sáng, sưởi ấm Trái đất\n🌙 Mặt trăng: phản chiếu ánh sáng mặt trời, sáng ban đêm\nMặt trời mọc phía ĐÔNG, lặn phía TÂY'),
  C(217, 'example', 'Ngày và đêm', 'Ban ngày (mặt trời mọc): đi học, chơi, làm việc ☀️\nBan đêm (mặt trời lặn): ngủ, nghỉ ngơi 🌙\nBình minh: mặt trời mọc buổi sáng sớm 🌅\nHoàng hôn: mặt trời lặn buổi chiều 🌇'),
  C(217, 'tip', 'Quan sát bầu trời', 'Buổi sáng: mặt trời ở phía Đông\nBuổi chiều: mặt trời ở phía Tây\nBan đêm: tìm ngôi sao Bắc Đẩu ⭐'),

  // === 218: Nước quanh em ===
  C(218, 'intro', 'Nước là sự sống', 'Không có nước, con người và động vật không sống được. Nước ở khắp nơi: sông, suối, mưa.'),
  C(218, 'explain', 'Nước dùng để làm gì?', '🚿 Tắm rửa\n🥤 Uống\n🌱 Tưới cây\n🍳 Nấu ăn\n🧹 Lau nhà\nNước sạch rất quý! Phải tiết kiệm.'),
  C(218, 'example', 'Nước ở đâu?', 'Sông: nước chảy dài 🌊\nBiển: rất rộng, nước mặn 🏖️\nHồ: nước đọng, yên tĩnh 🏞️\nMưa: nước từ mây rơi xuống ☔\nVòi nước: trong nhà bé 🚰'),
  C(218, 'tip', 'Tiết kiệm nước', 'Khóa vòi khi đánh răng 🚰\nKhông chơi nước lãng phí 🚫\nTưới cây vào sáng sớm/chiều tối 🌱\nBáo bố mẹ khi vòi bị rò 🔧'),

  // === 219: Không khí quanh em ===
  C(219, 'intro', 'Không khí vô hình', 'Bé không nhìn thấy không khí nhưng nó ở khắp nơi. Con người cần không khí để thở!'),
  C(219, 'explain', 'Đặc điểm không khí', 'Không nhìn thấy, không mùi, không vị\nỞ khắp nơi: trong nhà, ngoài trời\nCon người hít vào, thở ra liên tục\nGió = không khí chuyển động 💨'),
  C(219, 'example', 'Biết có không khí', 'Thổi bong bóng: không khí làm bóng phồng 🎈\nQuạt gió: cảm nhận không khí 💨\nNến tắt khi bị úp: hết không khí 🕯️'),
  C(219, 'tip', 'Không khí sạch', 'Trồng nhiều cây xanh 🌳\nKhông đốt rác 🚫\nMở cửa sổ cho thoáng 🪟\nHít thở sâu khi ở ngoài trời 😤'),

  // === 220: Thời tiết hàng ngày ===
  C(220, 'intro', 'Thời tiết mỗi ngày', 'Mỗi ngày thời tiết khác nhau: nắng, mưa, gió, mây. Biết thời tiết để mặc đồ phù hợp!'),
  C(220, 'explain', 'Các loại thời tiết', '☀️ Nắng: trời sáng, nóng\n🌧️ Mưa: nước rơi từ mây\n💨 Gió: không khí chuyển động\n☁️ Mây: trắng (đẹp trời) hoặc xám (sắp mưa)\n⛈️ Bão: gió rất mạnh + mưa to'),
  C(220, 'example', 'Mặc đồ theo thời tiết', 'Nắng: áo mỏng, mũ, kính ☀️\nMưa: áo mưa, ô, ủng ☔\nLạnh: áo khoác, khăn quàng 🧥\nGió: cài cúc áo 🧣'),
  C(220, 'tip', 'Nhật ký thời tiết', 'Mỗi sáng, nhìn ra cửa sổ và ghi:\n☀️ hoặc 🌧️ hoặc ☁️ hoặc 💨\nSau 1 tuần, xem lại: mùa này thường nắng hay mưa?'),
];
