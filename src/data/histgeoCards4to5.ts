/**
 * THẺ HỌC — LỊCH SỬ & ĐỊA LÝ LỚP 4–5
 * 160 thẻ (4 thẻ / bài × 40 bài), IDs 2401–2560
 */
import type { LessonCard } from './seedData';

let cid = 2400;
const typeByOrder: Record<number, LessonCard['cardType']> = { 1: 'intro', 2: 'explain', 3: 'example', 4: 'tip' };
const C = (lessonId: number, order: number, title: string, content: string): LessonCard => ({
  id: ++cid,
  lessonId,
  cardType: typeByOrder[order] ?? 'explain',
  title,
  content,
  exampleJson: null,
  sortOrder: order,
  isActive: 1,
});

export const histgeoCards4to5: LessonCard[] = [
  /* ===== LỚP 4 ===== */

  // 541 — Bản đồ và cách đọc bản đồ
  C(541, 1, 'Bản đồ là gì?', 'Bản đồ là hình vẽ thu nhỏ bề mặt Trái Đất trên mặt phẳng 🗺️'),
  C(541, 2, 'Kí hiệu bản đồ', 'Mỗi kí hiệu đại diện cho núi ⛰️, sông 🌊, đường 🛤️, thành phố 🏙️'),
  C(541, 3, 'Tỉ lệ bản đồ', 'Tỉ lệ 1:100.000 nghĩa là 1 cm trên bản đồ = 1 km ngoài thực tế!'),
  C(541, 4, 'Mẹo nhớ', 'Hãy nhớ: "Kí — Tỉ — Hướng" — 3 yếu tố cần đọc trước khi xem bản đồ 🧭'),

  // 542 — Địa hình Việt Nam
  C(542, 1, 'Ba phần tư là đồi núi', '¾ diện tích Việt Nam là đồi núi, chỉ ¼ là đồng bằng ⛰️'),
  C(542, 2, 'Dãy Hoàng Liên Sơn', 'Dãy núi cao nhất Việt Nam — đỉnh Fansipan 3.143 m 🏔️'),
  C(542, 3, 'Hai đồng bằng lớn', 'ĐB Sông Hồng (Bắc) và ĐB Sông Cửu Long (Nam) 🌾'),
  C(542, 4, 'Mẹo nhớ', '"Bắc Hồng — Nam Cửu" = 2 đồng bằng phù sa màu mỡ nhất 🌱'),

  // 543 — Sông ngòi và biển Việt Nam
  C(543, 1, 'Hai con sông lớn', 'Sông Hồng (Bắc) và sông Mê Kông (Nam) — nguồn sống hàng triệu người 🌊'),
  C(543, 2, 'Biển Đông', 'Việt Nam có bờ biển dài 3.260 km, từ Quảng Ninh đến Kiên Giang 🏖️'),
  C(543, 3, 'Vai trò sông biển', 'Cung cấp nước, giao thông, đánh cá, du lịch 🚢🐟'),
  C(543, 4, 'Mẹo nhớ', 'Hồng — Mê — Đông: Ba "người bạn nước" vĩ đại của Việt Nam! 💧'),

  // 544 — Đồng bằng Việt Nam
  C(544, 1, 'ĐB Sông Hồng', 'Hình tam giác, phù sa màu mỡ, dân cư đông đúc 🌾'),
  C(544, 2, 'ĐB Sông Cửu Long', '9 nhánh sông đổ ra biển — vựa lúa lớn nhất Việt Nam 🍚'),
  C(544, 3, 'So sánh hai ĐB', 'ĐB Sông Hồng nhỏ hơn nhưng đông dân hơn ĐB Sông Cửu Long 📊'),
  C(544, 4, 'Mẹo nhớ', 'Cửu = 9 → Sông Cửu Long có 9 cửa sông ra biển 9️⃣'),

  // 545 — Đồng bằng Bắc Bộ
  C(545, 1, 'Vị trí & đặc điểm', 'Bao quanh bởi sông Hồng, sông Thái Bình — đất phù sa 🏞️'),
  C(545, 2, 'Khí hậu', 'Có 4 mùa rõ rệt: Xuân, Hạ, Thu, Đông 🌤️❄️'),
  C(545, 3, 'Nghề nghiệp', 'Trồng lúa, làm gốm Bát Tràng, dệt lụa Vạn Phúc 🏺'),
  C(545, 4, 'Mẹo nhớ', '"Bắc Bộ 4 mùa, Nam Bộ 2 mùa" — cách nhớ khí hậu Việt Nam 🌦️'),

  // 546 — Duyên hải miền Trung
  C(546, 1, 'Dải đất hẹp', 'Miền Trung nằm giữa dãy Trường Sơn và Biển Đông 🏖️'),
  C(546, 2, 'Thiên tai', 'Hay bị bão, lũ lụt, hạn hán — con người kiên cường 🌪️'),
  C(546, 3, 'Di sản', 'Huế, Hội An, Mỹ Sơn — 3 di sản UNESCO 🏛️'),
  C(546, 4, 'Mẹo nhớ', '"Huế — Hội — Mỹ" = 3 bạn UNESCO ở miền Trung! ⭐'),

  // 547 — Tây Nguyên
  C(547, 1, 'Cao nguyên xếp tầng', '5 cao nguyên: Kon Tum, Pleiku, Đắk Lắk, Lâm Viên, Di Linh 🌄'),
  C(547, 2, 'Đất đỏ bazan', 'Đất màu mỡ, trồng cà phê, cao su, hồ tiêu ☕'),
  C(547, 3, 'Lễ hội cồng chiêng', 'Di sản phi vật thể UNESCO — âm thanh đại ngàn 🎵'),
  C(547, 4, 'Mẹo nhớ', 'Tây Nguyên nhớ: "Đỏ — Cà phê — Cồng chiêng" 🥁☕'),

  // 548 — Đồng bằng Nam Bộ
  C(548, 1, 'Vựa lúa cả nước', 'Sản lượng lúa lớn nhất Việt Nam, xuất khẩu gạo hàng đầu 🍚'),
  C(548, 2, 'Chợ nổi', 'Chợ nổi Cái Răng, Phong Điền — mua bán trên sông 🛶'),
  C(548, 3, 'Trái cây phong phú', 'Xoài, sầu riêng, chôm chôm, mít… vườn cây trĩu quả 🥭🍈'),
  C(548, 4, 'Mẹo nhớ', '"Nam Bộ = Lúa + Cá + Trái cây" — 3 chữ vàng! 🌟'),

  // 549 — Dân tộc Việt Nam
  C(549, 1, '54 dân tộc', 'Kinh chiếm đông nhất, 53 dân tộc thiểu số anh em 🤝'),
  C(549, 2, 'Phân bố', 'Kinh chủ yếu ở đồng bằng, các dân tộc ít người ở miền núi 🏔️'),
  C(549, 3, 'Văn hóa đa dạng', 'Mỗi dân tộc có trang phục, lễ hội, tiếng nói riêng 🎭'),
  C(549, 4, 'Mẹo nhớ', '54 dân tộc — 1 Tổ quốc = Đoàn kết! 🇻🇳'),

  // 550 — Nông nghiệp Việt Nam
  C(550, 1, 'Cây lúa nước', 'Việt Nam là nước xuất khẩu gạo hàng đầu thế giới 🌾'),
  C(550, 2, 'Cây công nghiệp', 'Cà phê, cao su, hồ tiêu, chè — xuất khẩu nhiều ☕🌿'),
  C(550, 3, 'Chăn nuôi', 'Lợn, gà, trâu, bò — phát triển ở mọi vùng miền 🐂🐔'),
  C(550, 4, 'Mẹo nhớ', '"Lúa — Cà phê — Thủy sản" = Tam giác vàng nông nghiệp Việt Nam 🔺'),

  // 551 — Công nghiệp và thương mại
  C(551, 1, 'Các ngành CN', 'Dệt may, chế biến thực phẩm, điện tử, cơ khí 🏭'),
  C(551, 2, 'Khu CN lớn', 'TP HCM, Bình Dương, Đồng Nai — trung tâm CN phía Nam 🔧'),
  C(551, 3, 'Xuất nhập khẩu', 'Việt Nam xuất khẩu điện thoại, giày dép, thủy sản, gạo 📱👟'),
  C(551, 4, 'Mẹo nhớ', '"CN phía Nam, NN phía Bắc & Nam" — nhớ phân bố! 🗺️'),

  // 552 — Giao thông vận tải
  C(552, 1, '4 loại đường', 'Đường bộ, đường sắt, đường thủy, đường hàng không ✈️'),
  C(552, 2, 'Quốc lộ 1A', 'Con đường huyết mạch Bắc — Nam, dài hơn 2.300 km 🛣️'),
  C(552, 3, 'Đường sắt Thống Nhất', 'Hà Nội → TP HCM, dài 1.726 km 🚂'),
  C(552, 4, 'Mẹo nhớ', '"Bộ — Sắt — Thủy — Không" = 4 cách di chuyển ở Việt Nam 🚗🚂🚢✈️'),

  // 553 — Thời nguyên thủy
  C(553, 1, 'Con người đầu tiên', 'Dấu tích người tiền sử ở hang Thẩm Khuyên, Thẩm Hai 🪨'),
  C(553, 2, 'Công cụ đá', 'Từ đá thô đến đá mài — tiến bộ dần theo thời gian ⛏️'),
  C(553, 3, 'Nghề nông ra đời', 'Từ hái lượm → trồng trọt, con người bắt đầu định cư 🌾'),
  C(553, 4, 'Mẹo nhớ', '"Hang — Đá — Lửa — Lúa" = 4 bước phát triển nguyên thủy 🔥'),

  // 554 — Văn Lang — Âu Lạc
  C(554, 1, 'Nước Văn Lang', 'Do Vua Hùng lập ra — nhà nước đầu tiên của Việt Nam 👑'),
  C(554, 2, 'Nước Âu Lạc', 'An Dương Vương hợp nhất Âu Việt và Lạc Việt 🏰'),
  C(554, 3, 'Thành Cổ Loa', 'Thành xoáy ốc 9 vòng — kỳ tích quân sự 🐚'),
  C(554, 4, 'Mẹo nhớ', '"Hùng — An — Cổ Loa" = Ba từ khóa thời dựng nước 🔑'),

  // 555 — 1000 năm Bắc thuộc
  C(555, 1, 'Thời kỳ đô hộ', 'Từ 179 TCN đến 938 — hơn 1000 năm dưới ách phương Bắc ⚔️'),
  C(555, 2, 'Chính sách đồng hóa', 'Giặc bắt dân ta bỏ phong tục, học chữ Hán 📜'),
  C(555, 3, 'Tinh thần bất khuất', 'Dân ta liên tục khởi nghĩa: Hai Bà Trưng, Lý Bí, Mai Thúc Loan 🗡️'),
  C(555, 4, 'Mẹo nhớ', '"Trưng — Bí — Loan" = Những anh hùng thời Bắc thuộc 🦸'),

  // 556 — Khởi nghĩa tiêu biểu
  C(556, 1, 'Hai Bà Trưng (40)', 'Khởi nghĩa đầu tiên — phụ nữ Việt Nam anh hùng 👩‍🦰⚔️'),
  C(556, 2, 'Lý Bí — Nước Vạn Xuân (544)', 'Lập nước Vạn Xuân, xưng Lý Nam Đế 👑'),
  C(556, 3, 'Ngô Quyền — Bạch Đằng (938)', 'Chiến thắng Bạch Đằng, chấm dứt Bắc thuộc 🚩'),
  C(556, 4, 'Mẹo nhớ', '40 → 544 → 938: Ba năm vàng chống giặc! 🏆'),

  // 557 — Nhà Lý
  C(557, 1, 'Lý Thái Tổ dời đô', 'Năm 1010 — dời từ Hoa Lư ra Thăng Long (Hà Nội) 🏯'),
  C(557, 2, 'Xây dựng đất nước', 'Mở trường học, xây chùa Một Cột, đắp đê 🏫'),
  C(557, 3, 'Lý Thường Kiệt', 'Đánh Tống — bài thơ "Nam quốc sơn hà" 📜'),
  C(557, 4, 'Mẹo nhớ', '"1010 — Lý — Thăng Long" = Mốc mở đầu Hà Nội! 🎯'),

  // 558 — Nhà Trần
  C(558, 1, 'Hào khí Đông A', 'Tinh thần quyết chiến của quân dân nhà Trần 🔥'),
  C(558, 2, 'Ba lần thắng Mông', '1258, 1285, 1288 — ba lần đánh bại quân Mông — Nguyên 🐎'),
  C(558, 3, 'Trần Hưng Đạo', 'Quốc Công Tiết Chế — anh hùng chống Mông đại tài ⚔️'),
  C(558, 4, 'Mẹo nhớ', '"58 — 85 — 88" = Ba lần chiến thắng Mông cổ (12xx) 🏅'),

  // 559 — Nhà Lê
  C(559, 1, 'Khởi nghĩa Lam Sơn', 'Lê Lợi 10 năm kháng chiến chống quân Minh (1418-1428) 🌄'),
  C(559, 2, 'Nguyễn Trãi', 'Quân sư tài ba — Bình Ngô đại cáo 📜'),
  C(559, 3, 'Lê Thánh Tông', 'Soạn Quốc triều hình luật — thời thịnh trị nhất nhà Lê 📖'),
  C(559, 4, 'Mẹo nhớ', '"Lợi — Trãi — Tông" = 3 nhân vật nhà Lê quan trọng nhất 🌟'),

  // 560 — Chống giặc ngoại xâm
  C(560, 1, 'Truyền thống đánh giặc', 'Từ Văn Lang đến Lê — dân tộc ta chưa bao giờ khuất phục ⚔️'),
  C(560, 2, 'Bài học lịch sử', '"Dĩ đoản binh, chế trường trận" — lấy ít thắng nhiều 🧠'),
  C(560, 3, 'Tinh thần đoàn kết', 'Vua tôi, quân dân đồng lòng — sức mạnh vô song 🤝'),
  C(560, 4, 'Mẹo nhớ', '"Đoàn kết — Mưu trí — Dũng cảm" = 3 bí quyết thắng giặc! 💪'),

  /* ===== LỚP 5 ===== */

  // 561 — Châu Á — Vị trí và thiên nhiên
  C(561, 1, 'Châu lục lớn nhất', 'Châu Á rộng 44,6 triệu km² — chiếm 30% đất liền 🌏'),
  C(561, 2, 'Địa hình đa dạng', 'Có đỉnh Everest cao nhất thế giới (8.849 m) và Biển Chết thấp nhất 🏔️'),
  C(561, 3, 'Khí hậu', 'Từ xích đạo nóng ẩm đến cận cực lạnh giá — rất đa dạng 🌡️'),
  C(561, 4, 'Mẹo nhớ', '"Á = Lớn nhất, đông nhất, cao nhất!" 🥇'),

  // 562 — Dân cư châu Á
  C(562, 1, 'Đông dân nhất', 'Hơn 4,7 tỉ người — chiếm 60% dân số thế giới 🧑‍🤝‍🧑'),
  C(562, 2, 'Chủng tộc đa dạng', 'Mongoloid, Caucasoid, Negroid — đa sắc tộc 🌈'),
  C(562, 3, 'Tôn giáo', 'Phật giáo, Hindu, Hồi giáo — nơi sinh nhiều tôn giáo lớn 🙏'),
  C(562, 4, 'Mẹo nhớ', '"Á đông — Á đa" = Đông dân, đa dạng 🌍'),

  // 563 — Một số nước châu Á
  C(563, 1, 'Trung Quốc', 'Nước đông dân nhất thế giới — nền văn minh 5.000 năm 🇨🇳'),
  C(563, 2, 'Nhật Bản', '"Xứ sở mặt trời mọc" — cường quốc kinh tế châu Á 🇯🇵'),
  C(563, 3, 'Ấn Độ', 'Dân số thứ 2 thời gian — quê hương của Phật giáo 🇮🇳'),
  C(563, 4, 'Mẹo nhớ', '"Trung — Nhật — Ấn" = 3 nước chủ chốt châu Á 🔑'),

  // 564 — Đông Nam Á & ASEAN
  C(564, 1, 'Khu vực ĐNA', '11 quốc gia — nằm giữa Ấn Độ Dương và Thái Bình Dương 🌊'),
  C(564, 2, 'ASEAN', 'Hiệp hội các quốc gia ĐNA — thành lập 1967 🤝'),
  C(564, 3, 'Việt Nam gia nhập ASEAN', '28/7/1995 — thành viên thứ 7 của ASEAN 🇻🇳'),
  C(564, 4, 'Mẹo nhớ', '"A-S-E-A-N = Anh-em-SĐ(ĐNA)-An-Ninh" 🛡️'),

  // 565 — Châu Âu
  C(565, 1, 'Lục địa xanh', 'Châu Âu phần lớn có khí hậu ôn đới, xanh mát 🌿'),
  C(565, 2, 'EU', 'Liên minh châu Âu — 27 nước thành viên, dùng đồng Euro 💶'),
  C(565, 3, 'Các nước nổi tiếng', 'Pháp, Đức, Anh, Ý — nền văn minh phương Tây 🏰'),
  C(565, 4, 'Mẹo nhớ', '"Châu Âu = Cổ kính + Phát triển + Euro" 🏛️'),

  // 566 — Châu Phi
  C(566, 1, 'Lục địa nóng', 'Có khí hậu nóng nhất — sa mạc Sahara lớn nhất thế giới 🏜️'),
  C(566, 2, 'Sông Nin', 'Sông dài nhất thế giới (6.650 km) — nuôi sống Ai Cập 🐊'),
  C(566, 3, 'Động vật hoang dã', 'Sư tử, voi, hươu cao cổ — safari nổi tiếng 🦁🦒'),
  C(566, 4, 'Mẹo nhớ', '"Phi nóng — Nin dài — Sahara rộng" 🔥'),

  // 567 — Châu Đại Dương
  C(567, 1, 'Châu lục nhỏ nhất', 'Úc chiếm phần lớn + hàng ngàn đảo Thái Bình Dương 🏝️'),
  C(567, 2, 'Úc', 'Kangaroo, gấu koala — thiên nhiên độc đáo 🦘🐨'),
  C(567, 3, 'New Zealand', 'Đảo quốc xanh — đất nước của kiwi 🥝'),
  C(567, 4, 'Mẹo nhớ', '"Đại Dương = Úc + Ngàn đảo" 🌊'),

  // 568 — Châu Nam Cực
  C(568, 1, 'Lạnh nhất thế giới', 'Nhiệt độ tới -89°C — không có dân cư thường trú ❄️'),
  C(568, 2, 'Băng phủ', '98% bề mặt bị băng che phủ — chứa 70% nước ngọt thời gian 🧊'),
  C(568, 3, 'Chim cánh cụt', 'Loài vật biểu tượng — sống ở bờ biển Nam Cực 🐧'),
  C(568, 4, 'Mẹo nhớ', '"Nam Cực = Băng + Cụt + Lạnh nhất" 🥶🐧'),

  // 569 — Châu Mỹ — Vị trí và thiên nhiên
  C(569, 1, 'Vùng đất mới', 'Christopher Columbus phát hiện 1492 — "Tân thế giới" 🌎'),
  C(569, 2, 'Địa hình', 'Dãy Rocky (Bắc Mỹ), Andes (Nam Mỹ), Amazon (rừng nhiệt đới) 🏔️🌳'),
  C(569, 3, 'Sông Amazon', 'Sông có lưu vực lớn nhất thế giới — "lá phổi xanh" 🌿'),
  C(569, 4, 'Mẹo nhớ', '"Mỹ = Rocky + Andes + Amazon" = 3 kỳ quan tự nhiên 🗻'),

  // 570 — Hoa Kỳ
  C(570, 1, 'Siêu cường', 'Nền kinh tế lớn nhất thế giới, 50 bang 🇺🇸'),
  C(570, 2, 'Khoa học công nghệ', 'NASA, Silicon Valley — đi đầu công nghệ thời gian 🚀💻'),
  C(570, 3, 'Nông nghiệp hiện đại', 'Xuất khẩu lúa mì, ngô, đậu tương hàng đầu 🌽'),
  C(570, 4, 'Mẹo nhớ', '"Hoa Kỳ = 50 sao + Siêu cường" ⭐'),

  // 571 — Bra-xin
  C(571, 1, 'Lớn nhất Nam Mỹ', 'Diện tích thứ 5 thời gian — nói tiếng Bồ Đào Nha 🇧🇷'),
  C(571, 2, 'Rừng Amazon', 'Rừng nhiệt đới lớn nhất thế giới — "lá phổi xanh" 🌳'),
  C(571, 3, 'Bóng đá & Carnival', '5 lần vô địch WC — lễ hội Carnival rực rỡ ⚽🎭'),
  C(571, 4, 'Mẹo nhớ', '"Bra-xin = Amazon + Bóng đá + Carnival" 🎉'),

  // 572 — Các nước châu Mỹ khác
  C(572, 1, 'Canada', 'Nước có diện tích lớn thứ 2 thời gian — lá phong đỏ 🇨🇦🍁'),
  C(572, 2, 'Mexico', 'Văn minh Maya, Aztec — ẩm thực taco nổi tiếng 🌮'),
  C(572, 3, 'Argentina', 'Pampas thảo nguyên — tango & bò thịt 🥩💃'),
  C(572, 4, 'Mẹo nhớ', '"Ca(nada) — Me(xico) — Ar(gentina)" = 3 nước lớn! 🌍'),

  // 573 — Pháp xâm lược Việt Nam
  C(573, 1, 'Pháp nổ súng 1858', 'Tàu chiến Pháp tấn công Đà Nẵng — bắt đầu xâm lược Việt Nam 💣'),
  C(573, 2, 'Triều đình nhà Nguyễn', 'Ký nhiều hiệp ước bất bình đẳng — mất dần chủ quyền 📜'),
  C(573, 3, 'Đời sống nhân dân', 'Thuế nặng, lao dịch, khai thác thuộc địa 😢'),
  C(573, 4, 'Mẹo nhớ', '1858 = năm bắt đầu đau thương — nhớ 18-58! ⚡'),

  // 574 — Phong trào yêu nước
  C(574, 1, 'Phan Bội Châu', 'Phong trào Đông Du — đưa thanh niên sang Nhật học 🎓'),
  C(574, 2, 'Phan Châu Trinh', 'Duy Tân — đổi mới văn hóa, giáo dục trong nước 📚'),
  C(574, 3, 'Nguyễn Ái Quốc', 'Ra đi tìm đường cứu nước 1911 — sau là Hồ Chí Minh 🚢'),
  C(574, 4, 'Mẹo nhớ', '"Bội(Châu) đi — Châu(Trinh) ở — Quốc(Nguyễn) đi" 🗺️'),

  // 575 — Cách mạng Tháng Tám
  C(575, 1, 'Thời cơ', 'Nhật đầu hàng Đồng Minh — thời cơ "ngàn năm có một" ⏰'),
  C(575, 2, 'Tổng khởi nghĩa', '19/8/1945 — CM Tháng Tám thành công trên cả nước 🎌'),
  C(575, 3, 'Tuyên ngôn Độc lập', '2/9/1945 — Bác Hồ đọc Tuyên ngôn tại Ba Đình 🇻🇳'),
  C(575, 4, 'Mẹo nhớ', '"19/8 khởi — 2/9 Tuyên" = 2 ngày vàng 1945 📅'),

  // 576 — Kháng chiến chống Pháp
  C(576, 1, '9 năm kháng chiến', '19/12/1946 — Toàn quốc kháng chiến bắt đầu 🔥'),
  C(576, 2, 'Chiến thắng Việt Bắc', 'Thu Đông 1947 — phá tan âm mưu tấn công ATK 🌲'),
  C(576, 3, 'Chiến thắng Biên giới', 'Thu Đông 1950 — mở đường liên lạc quốc tế 🛤️'),
  C(576, 4, 'Mẹo nhớ', '"46 bắt đầu — 47 Việt Bắc — 50 Biên giới" 🗓️'),

  // 577 — Chiến dịch Điện Biên Phủ
  C(577, 1, 'Tập đoàn cứ điểm', 'Pháp xây "pháo đài bất khả xâm phạm" ở ĐBP 🏰'),
  C(577, 2, '56 ngày đêm', 'Từ 13/3 → 7/5/1954 — quân ta vây đánh 56 ngày 🎖️'),
  C(577, 3, 'Chiến thắng 7/5', 'Tướng De Castries bị bắt — Pháp thất bại hoàn toàn 🏳️'),
  C(577, 4, 'Mẹo nhớ', '"13/3 bắt đầu — 7/5 chiến thắng — 56 ngày đêm" 🏔️'),

  // 578 — Đất nước chia cắt
  C(578, 1, 'Hiệp định Genève', '21/7/1954 — chia Việt Nam tại vĩ tuyến 17 📄'),
  C(578, 2, 'Miền Bắc xây dựng CNXH', 'Cải cách ruộng đất, phát triển kinh tế 🏗️'),
  C(578, 3, 'Miền Nam đấu tranh', 'Phong trào Đồng Khởi 1960 — nhân dân miền Nam kiên cường ✊'),
  C(578, 4, 'Mẹo nhớ', '"17 chia — Bắc xây — Nam đấu" = 3 từ khóa 🔑'),

  // 579 — Thống nhất đất nước
  C(579, 1, 'Chiến dịch HCM', 'Chiến dịch cuối cùng — giải phóng Sài Gòn 🚩'),
  C(579, 2, '30/4/1975', 'Xe tăng húc đổ cổng Dinh Độc Lập — đất nước thống nhất 🏛️'),
  C(579, 3, 'Ý nghĩa lịch sử', 'Kết thúc 30 năm chiến tranh, non sông liền một dải 🇻🇳'),
  C(579, 4, 'Mẹo nhớ', '"30/4 = Ngày thống nhất, 2/9 = Ngày Quốc khánh" 🎆'),

  // 580 — Đổi Mới và phát triển
  C(580, 1, 'Đổi Mới 1986', 'Chuyển từ bao cấp sang kinh tế thị trường 🔄'),
  C(580, 2, 'Thành tựu kinh tế', 'GDP tăng trưởng, xóa đói giảm nghèo, hội nhập quốc tế 📈'),
  C(580, 3, 'Việt Nam ngày nay', 'Thành viên ASEAN, WTO, ký kết nhiều FTA 🌐'),
  C(580, 4, 'Mẹo nhớ', '"1986 = Năm Đổi Mới" — mốc son quan trọng nhất thời hiện đại 🚀'),
];
