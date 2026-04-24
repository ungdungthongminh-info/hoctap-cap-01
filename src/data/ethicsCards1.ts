/**
 * ĐẠO ĐỨC LỚP 1 — 80 thẻ dạy (4 thẻ/bài × 20 bài)
 * ID bắt đầu từ 701 (Math 1-160, Vietnamese 501-580, Nature 601-680)
 */
import type { LessonCard } from './seedData';

let cid = 700;
const C = (lessonId: number, type: LessonCard['cardType'], title: string, content: string): LessonCard => ({
  id: ++cid,
  lessonId,
  cardType: type,
  title,
  content,
  exampleJson: null,
  sortOrder: cid - 700,
  isActive: 1,
});

export const ethicsCards1: LessonCard[] = [
  // === 301: Em là ai? ===
  C(301, 'intro', 'Bé đặc biệt!', 'Mỗi bé là một người đặc biệt! Bé có tên riêng, có sở thích, có gia đình yêu thương.'),
  C(301, 'explain', 'Giới thiệu bản thân', 'Khi gặp người mới, bé nói:\n"Em tên là... Em ___ tuổi.\nEm thích... Em học lớp..."'),
  C(301, 'example', 'An giới thiệu mình', '"Xin chào! Em tên là An.\nEm 6 tuổi, học lớp 1A.\nEm thích vẽ tranh và chơi bóng!"'),
  C(301, 'tip', 'Tự tin vào bản thân', 'Mỗi bé đều giỏi một điều gì đó.\nHãy tự hào về bản thân mình!\nKhông cần giống ai cả — bé là duy nhất 🌟'),

  // === 302: Yêu thương gia đình ===
  C(302, 'intro', 'Gia đình yêu thương', 'Gia đình là nơi bé được yêu thương nhất. Hãy thể hiện tình yêu với mọi người!'),
  C(302, 'explain', 'Cách thể hiện yêu thương', 'Nói "Con yêu bố mẹ" 💕\nÔm ông bà mỗi ngày 🤗\nGiúp anh chị em 🤝\nVẽ tranh tặng gia đình 🎨'),
  C(302, 'example', 'Bé Lan yêu gia đình', 'Sáng: Lan chào bố mẹ đi làm\nTrưa: Lan giúp mẹ dọn bàn ăn\nTối: Lan kể chuyện ở trường cho cả nhà'),
  C(302, 'tip', 'Yêu thương bằng hành động', 'Ngoan ngoãn là yêu thương 💛\nGiúp việc nhỏ là yêu thương 🏠\nNói lời dịu dàng là yêu thương 🗣️'),

  // === 303: Vâng lời ông bà, cha mẹ ===
  C(303, 'intro', 'Vâng lời là ngoan', 'Ông bà, cha mẹ dạy bé điều hay lẽ phải. Vâng lời sẽ giúp bé trưởng thành!'),
  C(303, 'explain', 'Tại sao phải vâng lời?', 'Người lớn có kinh nghiệm sống 🧠\nHọ muốn bé được an toàn 🛡️\nHọ muốn bé trở nên giỏi giang 📚\nVâng lời giúp bé tốt hơn mỗi ngày!'),
  C(303, 'example', 'Vâng lời đúng cách', 'Mẹ bảo: "Dọn phòng đi con"\n✅ "Dạ, con dọn ngay ạ"\n❌ "Con không muốn"\n\nBố bảo: "Đi ngủ đi con"\n✅ "Dạ, con đi ngủ ạ"'),
  C(303, 'tip', 'Khi không đồng ý...', 'Nếu không muốn, hãy NÓI nhẹ nhàng:\n"Con muốn chơi thêm 5 phút được không ạ?"\nKhông la hét, không cãi lại 🙏'),

  // === 304: Gọn gàng, ngăn nắp ===
  C(304, 'intro', 'Gọn gàng = Giỏi giang', 'Bé giữ đồ đạc gọn gàng sẽ dễ tìm đồ, tiết kiệm thời gian, và được khen!'),
  C(304, 'explain', 'Thói quen gọn gàng', '🎒 Sắp cặp sách mỗi tối\n🧸 Cất đồ chơi sau khi chơi\n👕 Gấp quần áo gọn\n📚 Xếp sách vở ngay ngắn'),
  C(304, 'example', 'Phòng của bé Minh', 'TRƯỚC: Đồ chơi vứt khắp phòng 😵\nSAU: Xe ô tô trong hộp, sách trên kệ, quần áo trong tủ 😊\nMẹ khen: "Minh giỏi quá!"'),
  C(304, 'tip', 'Mẹo nhỏ giúp gọn', 'Quy tắc: Dùng xong → Cất lại 📦\nMỗi đồ có "nhà" riêng 🏠\nDọn phòng 5 phút mỗi tối ⏰'),

  // === 305: Lễ phép với thầy cô ===
  C(305, 'intro', 'Kính yêu thầy cô', 'Thầy cô dạy bé biết chữ, biết toán, biết làm người. Hãy lễ phép và kính trọng!'),
  C(305, 'explain', 'Cách cư xử lễ phép', 'Gặp thầy cô → Chào "Em chào cô/thầy ạ!" 🙋\nKhi được gọi → "Dạ thưa cô/thầy" 🗣️\nNhận đồ → "Em cảm ơn cô/thầy ạ" 🙏\nSai lỗi → "Em xin lỗi cô/thầy ạ" 😔'),
  C(305, 'example', 'Tình huống ở lớp', 'Cô hỏi: "Ai biết câu trả lời?"\n✅ Giơ tay: "Thưa cô, em biết ạ"\n❌ Hét to: "Em biết! Em biết!"'),
  C(305, 'tip', 'Thầy cô vui khi...', 'Bé chăm chỉ học bài 📖\nBé lễ phép, ngoan ngoãn 🌸\nBé giúp đỡ bạn bè 🤝\nBé tiến bộ mỗi ngày ⬆️'),

  // === 306: Thân thiện với bạn bè ===
  C(306, 'intro', 'Bạn bè thân thiết', 'Bạn bè là người cùng học, cùng chơi, cùng lớn lên. Hãy thân thiện để có nhiều bạn tốt!'),
  C(306, 'explain', 'Cách kết bạn', '"Chào bạn! Mình tên là... Bạn tên gì?"\n"Bạn có muốn chơi cùng mình không?"\n"Mình cho bạn mượn nhé!"\nMỉm cười, nói nhẹ nhàng 😊'),
  C(306, 'example', 'Ngày đầu tiên đi học', 'Hùng lớp 1, chưa quen ai.\nHùng mỉm cười, hỏi bạn bên cạnh:\n"Chào bạn! Mình là Hùng. Bạn thích vẽ không?"\nThế là hai bạn thân nhau 🤗'),
  C(306, 'tip', 'Bạn tốt là người...', 'Chia sẻ đồ chơi, đồ ăn 🍪\nKhông trêu chọc, không bắt nạt 🚫\nGiúp bạn khi khó khăn 💪\nVui khi bạn giỏi, không ganh tị 🎉'),

  // === 307: Thật thà, không nói dối ===
  C(307, 'intro', 'Thật thà đáng quý', 'Người thật thà được mọi người tin tưởng và yêu quý. Nói dối sẽ mất lòng tin!'),
  C(307, 'explain', 'Tại sao phải thật thà?', 'Nói thật → Được tin tưởng 🤝\nNói dối → Mất lòng tin 💔\nNói dối 1 lần → Phải dối thêm nhiều lần\nThật thà = Dũng cảm! 💪'),
  C(307, 'example', 'Câu chuyện cái bình hoa', 'Bé Tuấn lỡ làm vỡ bình hoa.\n❌ Nói dối: "Con không làm vỡ đâu"\n✅ Thật thà: "Con xin lỗi mẹ, con lỡ làm vỡ ạ"\nMẹ khen Tuấn dũng cảm, thật thà 💛'),
  C(307, 'tip', 'Nhận lỗi = Dũng cảm', 'Khi sai, hãy nói: "Em xin lỗi"\nMọi người sẽ tha thứ nếu bé thật thà\nNhớ: Sai có thể sửa, nhưng nói dối mất tin 🔑'),

  // === 308: Tự tin phát biểu ===
  C(308, 'intro', 'Tự tin là sức mạnh', 'Bé tự tin sẽ dám giơ tay, dám nói, dám thử. Tự tin giúp bé giỏi hơn mỗi ngày!'),
  C(308, 'explain', 'Cách rèn tự tin', '1. Hít thở sâu trước khi nói 😤\n2. Nhìn vào mắt cô giáo/bạn bè 👀\n3. Nói to, rõ ràng 🗣️\n4. Không sợ sai — sai cũng được học! 📚'),
  C(308, 'example', 'Bé Hoa tự tin', 'Cô hỏi: "Ai đọc bài?"\nHoa hít thở sâu, giơ tay.\nHoa đọc to, rõ ràng. Cả lớp vỗ tay 👏\nHoa vui vì đã dám thử!'),
  C(308, 'tip', 'Nếu sợ thì sao?', 'Ai cũng từng sợ — đó là bình thường! 😊\nThử 1 lần → Lần sau dễ hơn\nSai không sao — quan trọng là dám thử! 🌟'),

  // === 309: Lễ phép với người lớn ===
  C(309, 'intro', 'Kính trọng người lớn', 'Gặp người lớn, bé chào hỏi lễ phép sẽ được yêu quý và khen ngợi.'),
  C(309, 'explain', 'Cách chào hỏi', 'Gặp ông bà: "Con chào ông/bà ạ" 🙋\nGặp cô chú: "Con chào cô/chú ạ" 🙋\nĐược cho quà: "Con cảm ơn ạ" 🎁\nĐược giúp: "Con cảm ơn ạ"'),
  C(309, 'example', 'Đi thang máy', 'Bé gặp bác hàng xóm trong thang máy.\n✅ "Con chào bác ạ!"\nBác cười, xoa đầu bé: "Bé ngoan quá!"'),
  C(309, 'tip', '3 câu thần kỳ', '"Xin chào" — khi gặp ai 👋\n"Cảm ơn" — khi được giúp 🙏\n"Xin lỗi" — khi làm phiền 😊\nNhớ 3 câu này, ai cũng yêu!'),

  // === 310: Yêu quê hương đất nước ===
  C(310, 'intro', 'Việt Nam yêu dấu', 'Bé là công dân nhỏ của Việt Nam. Hãy tự hào về đất nước mình!'),
  C(310, 'explain', 'Biểu tượng Việt Nam', '🇻🇳 Quốc kỳ: Cờ đỏ sao vàng\n🎵 Quốc ca: "Tiến quân ca"\n🌸 Quốc hoa: Hoa sen\n🏛️ Thủ đô: Hà Nội'),
  C(310, 'example', 'Yêu quê hương bằng cách...', 'Hát Quốc ca trang nghiêm 🎵\nGiữ gìn cảnh đẹp quê hương 🏞️\nHọc giỏi để xây dựng đất nước 📚\nTôn trọng phong tục tập quán 🎎'),
  C(310, 'tip', 'Quê hương trong tim', 'Dù ở đâu, quê hương luôn trong tim.\nBé có thể tự hào giới thiệu:\n"Em là người Việt Nam!" 🇻🇳'),

  // === 311: Giúp đỡ mọi người ===
  C(311, 'intro', 'Giúp đỡ = Vui vẻ', 'Khi giúp người khác, bé sẽ thấy vui và được mọi người yêu quý!'),
  C(311, 'explain', 'Bé có thể giúp gì?', 'Giúp bà qua đường 👵\nNhặt đồ rơi cho bạn 📕\nGiúp mẹ xách túi 🛍️\nChia sẻ đồ ăn với bạn 🍪\nAn ủi bạn khi buồn 💛'),
  C(311, 'example', 'Bé Huy tốt bụng', 'Trên đường đi học, Huy thấy bà cụ xách nặng.\nHuy chạy đến: "Bà ơi, con xách giúp bà nhé!"\nBà cười: "Cảm ơn cháu, cháu ngoan lắm!" 💕'),
  C(311, 'tip', 'Giúp đỡ nhỏ thôi cũng vui', 'Không cần việc lớn đâu!\nMỉm cười = Giúp ai vui 😊\nNhường chỗ ngồi = Giúp ai thoải mái 💺\nNói "Bạn cố lên" = Giúp ai mạnh mẽ 💪'),

  // === 312: Bảo vệ của công ===
  C(312, 'intro', 'Của công = Của mọi người', 'Bàn ghế ở trường, cây xanh ở công viên, ghế ở sân bay... đều là của chung!'),
  C(312, 'explain', 'Tại sao phải giữ gìn?', 'Của công dùng cho TẤT CẢ mọi người 👥\nNếu bé phá → Người khác không dùng được 😢\nGiữ gìn = Tôn trọng mọi người ❤️'),
  C(312, 'example', 'Ở công viên', '✅ Ngồi ghế nhẹ nhàng\n✅ Không vẽ bậy lên tường\n✅ Bỏ rác vào thùng\n❌ Bẻ cây, ngắt hoa\n❌ Vẽ bậy lên ghế'),
  C(312, 'tip', 'Quy tắc giữ của công', 'Dùng nhẹ nhàng 🤲\nGiữ sạch sẽ 🧹\nKhông phá hỏng 🚫\nBáo người lớn khi thấy hỏng 🔧'),

  // === 313: Yêu thiên nhiên ===
  C(313, 'intro', 'Thiên nhiên tuyệt vời', 'Cây xanh, hoa lá, con vật... tạo nên thế giới tươi đẹp. Hãy yêu quý thiên nhiên!'),
  C(313, 'explain', 'Thiên nhiên cho ta gì?', '🌳 Cây: không khí sạch, bóng mát\n🌸 Hoa: vẻ đẹp, hương thơm\n🐦 Chim: tiếng hót vui tai\n🦋 Bướm: tô điểm vườn hoa'),
  C(313, 'example', 'Buổi dã ngoại', 'Lớp An đi dã ngoại.\nAn ngắm hoa, nghe chim hót, hít thở không khí trong lành.\n"Thiên nhiên đẹp quá!" — An nói 🌿'),
  C(313, 'tip', 'Yêu thiên nhiên = Bảo vệ nó', 'Không hái hoa lung tung 🌸\nKhông xả rác bừa bãi 🚫\nTrồng cây khi có thể 🌱\nNgắm nhìn và trân trọng 👀'),

  // === 314: Bảo vệ cây xanh ===
  C(314, 'intro', 'Cây xanh = Bạn thân', 'Cây xanh cho bóng mát, không khí sạch, quả ngon. Hãy chăm sóc cây!'),
  C(314, 'explain', 'Cách bảo vệ cây', '💧 Tưới nước cho cây\n🚫 Không bẻ cành, ngắt lá\n🌱 Trồng thêm cây mới\n🌳 Nhổ cỏ dại cho cây\n🛡️ Bảo vệ cây khỏi bị chặt'),
  C(314, 'example', 'Ngày trồng cây', 'Lớp An cùng trồng cây ở sân trường.\nMỗi bạn trồng 1 cây.\nAn tưới nước mỗi ngày.\n1 tháng sau, cây xanh tốt 🌳'),
  C(314, 'tip', 'Cây cũng có "cảm xúc"', 'Khi được chăm sóc → Cây xanh tốt, ra hoa 🌸\nKhi bị bỏ rơi → Cây héo, yếu 😢\nHãy đối xử tốt với cây nhé! 💚'),

  // === 315: Yêu thương động vật ===
  C(315, 'intro', 'Bạn nhỏ dễ thương', 'Chó, mèo, chim, cá... đều biết vui buồn như bé. Hãy yêu thương chúng!'),
  C(315, 'explain', 'Đối xử tốt với động vật', '🍚 Cho ăn đúng bữa\n🏠 Cho chỗ ở sạch\n🚫 Không đánh, đá\n💉 Đưa đi khám khi ốm\n🤗 Vuốt ve nhẹ nhàng'),
  C(315, 'example', 'Bé Mai và con mèo', 'Mai thấy mèo con bị lạc, run rẩy.\nMai ôm mèo vào, cho uống sữa.\nMẹ giúp Mai tìm chủ mèo.\nMèo vẫy đuôi cảm ơn 🐱'),
  C(315, 'tip', 'Khi gặp động vật', 'Tiến lại nhẹ nhàng 🐾\nKhông la hét, chạy đột ngột 🤫\nĐể chúng đánh hơi tay bé trước ✋\nNếu con vật hung dữ → Tránh xa! ⚠️'),

  // === 316: Giữ vệ sinh môi trường ===
  C(316, 'intro', 'Sạch sẽ = Khỏe mạnh', 'Giữ môi trường sạch giúp mọi người khỏe mạnh và vui vẻ hơn!'),
  C(316, 'explain', 'Bé có thể làm gì?', '🗑️ Bỏ rác vào thùng\n🧹 Quét nhà, dọn lớp\n♻️ Phân loại rác\n🚫 Không xả rác bừa bãi\n💧 Tiết kiệm nước'),
  C(316, 'example', 'Bé làm "chiến sĩ xanh"', 'Lớp An tổ chức "Ngày xanh".\nMỗi bạn nhặt 10 miếng rác ở sân trường.\nSân sạch bóng, ai cũng vui! ✨'),
  C(316, 'tip', 'Quy tắc 3R', 'Reduce: Dùng ít hơn (bớt túi nilon) 📉\nReuse: Dùng lại (chai nước) 🔄\nRecycle: Tái chế (giấy, nhựa) ♻️'),

  // === 317: Sinh hoạt đúng giờ ===
  C(317, 'intro', 'Đúng giờ = Giỏi giang', 'Ăn đúng giờ, ngủ đúng giờ, học đúng giờ giúp bé khỏe và học tốt!'),
  C(317, 'explain', 'Lịch sinh hoạt mẫu', '6:30 — Thức dậy, đánh răng 🌅\n7:00 — Ăn sáng, đi học 🍞\n11:30 — Ăn trưa, nghỉ 🍚\n14:00 — Học bài chiều 📚\n20:00 — Tắm, đọc sách 📖\n21:00 — Đi ngủ 🌙'),
  C(317, 'example', 'Bé Tú trễ nải', 'Tú thức khuya xem phim → Sáng dậy muộn → Đến trường trễ → Cô nhắc nhở.\nTối hôm sau, Tú ngủ đúng giờ → Sáng dậy sớm → Đi học đúng giờ 🎉'),
  C(317, 'tip', 'Mẹo giữ đúng giờ', 'Đặt đồng hồ báo thức ⏰\nChuẩn bị đồ từ tối hôm trước 🎒\nĐi ngủ lúc 21h 🌙\nLàm việc theo thứ tự ✅'),

  // === 318: An toàn khi vui chơi ===
  C(318, 'intro', 'Chơi vui, chơi an toàn', 'Vui chơi rất thú vị nhưng bé cần biết chơi an toàn để không bị đau!'),
  C(318, 'explain', 'Trò chơi an toàn', '✅ Nhảy dây, đá cầu, ô ăn quan\n✅ Vẽ tranh, nặn đất\n✅ Đọc truyện, xếp hình\n❌ Trèo cao, đu dây\n❌ Ném đá, chọi nhau\n❌ Chạy gần đường xe'),
  C(318, 'example', 'Giờ ra chơi', 'Nam muốn trèo lên tường rào.\nBạn Hoa nói: "Nguy hiểm lắm! Chơi đá cầu đi!"\nNam nghe bạn → Chơi đá cầu vui hơn, an toàn hơn ⚽'),
  C(318, 'tip', 'Khi bị đau khi chơi', 'Dừng chơi ngay 🛑\nBáo thầy cô hoặc bố mẹ 📢\nNếu chảy máu → Ấn nhẹ vải sạch 🩹\nKhông cố chịu đau một mình'),

  // === 319: Tiết kiệm, không lãng phí ===
  C(319, 'intro', 'Tiết kiệm thông minh', 'Nước, điện, đồ ăn đều quý. Tiết kiệm giúp gia đình và môi trường!'),
  C(319, 'explain', 'Tiết kiệm cái gì?', '💧 Nước: Khóa vòi, tắm nhanh\n💡 Điện: Tắt đèn, quạt khi ra ngoài\n🍚 Đồ ăn: Lấy vừa đủ, không bỏ thừa\n📄 Giấy: Viết hết 2 mặt\n🎒 Đồ dùng: Giữ gìn, không phá'),
  C(319, 'example', 'Bé Nga tiết kiệm', 'Nga tắt đèn khi ra khỏi phòng.\nNga ăn hết cơm, không bỏ thừa.\nNga dùng giấy viết 2 mặt.\nMẹ khen: "Nga biết tiết kiệm, giỏi quá!" 🌟'),
  C(319, 'tip', 'Tiết kiệm = Yêu thương', 'Tiết kiệm nước = Yêu môi trường 🌍\nTiết kiệm điện = Bớt chi phí gia đình 💰\nTiết kiệm đồ ăn = Biết ơn người nông dân 🧑‍🌾'),

  // === 320: Kiên trì, không bỏ cuộc ===
  C(320, 'intro', 'Kiên trì = Thành công', 'Có những việc khó nhưng nếu bé không bỏ cuộc, bé sẽ làm được!'),
  C(320, 'explain', 'Kiên trì là gì?', 'Khó → Thử lại lần nữa 🔁\nSai → Sửa và làm tiếp ✏️\nMệt → Nghỉ rồi tiếp tục 😤\nChưa giỏi → Luyện tập mỗi ngày 📈'),
  C(320, 'example', 'Bé Linh tập viết', 'Chữ "a" của Linh xấu quá 😢\nLinh viết lại... 5 lần... 10 lần...\nLần thứ 20, chữ "a" đẹp rồi! 🎉\nCô khen: "Linh kiên trì quá!" ⭐'),
  C(320, 'tip', 'Khi muốn bỏ cuộc', 'Nhớ: Ai giỏi cũng từng kém! 💡\nNói: "Mình chưa được, nhưng mình SẼ được!"\nNghỉ ngơi rồi thử lại 😊\nXin giúp nếu cần — không sao cả 🤝'),
];
