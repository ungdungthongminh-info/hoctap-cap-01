// ---------------------------------------------------------------------------
// histgeoLessons4to5.ts  –  Lịch sử & Địa lý lớp 4-5
// 40 bài (20 bài/lớp, 5 chương × 4 bài)
// Đúng chuẩn Lesson từ seedData.ts
// ---------------------------------------------------------------------------
import type { Lesson } from './seedData';

let sid = 0;
const L = (
  grade: number, unit: string, code: string, title: string, obj: string,
  summary: string, tips: string, diff: 'easy' | 'medium' | 'hard', mins: number,
): Lesson => ({
  id: 540 + (++sid), grade, subjectCode: 'history_geo', unitCode: unit, lessonCode: code,
  title, objective: obj, summarySimple: summary, tips,
  difficulty: diff, estimatedMinutes: mins, status: 'ready', sortOrder: sid, isActive: 1,
});

// ===== LỚP 4 =====

// --- Chương 1: Bản đồ & Địa hình Việt Nam ---
const g4c1: Lesson[] = [
  L(4, 'C1', 'LS4-01', 'Bản đồ và cách đọc bản đồ',
    'Biết cách đọc bản đồ, nhận biết các ký hiệu và tỉ lệ bản đồ.',
    '🗺️ Bản đồ giống như bức tranh thu nhỏ của Trái Đất. Mỗi ký hiệu trên bản đồ kể cho mình một câu chuyện!',
    'Hãy cho bé xem bản đồ thật và cùng tìm vị trí nhà mình, trường học trên đó.',
    'easy', 10),
  L(4, 'C1', 'LS4-02', 'Địa hình Việt Nam',
    'Nắm được các dạng địa hình chính của Việt Nam: đồi núi, cao nguyên, đồng bằng, ven biển.',
    '⛰️ Việt Nam có núi cao, đồng bằng rộng và bờ biển dài. Địa hình đa dạng như một bức tranh thiên nhiên tuyệt đẹp!',
    'Dùng bản đồ địa hình hoặc mô hình nổi để bé hình dung sự khác nhau giữa núi, đồi và đồng bằng.',
    'easy', 10),
  L(4, 'C1', 'LS4-03', 'Sông ngòi và biển Việt Nam',
    'Biết các hệ thống sông lớn và vùng biển Việt Nam, vai trò của chúng với đời sống.',
    '🌊 Sông Hồng, sông Cửu Long chảy qua bao vùng đất. Biển Đông bao bọc đất nước, mang lại nhiều hải sản ngon!',
    'Kể cho bé về dòng sông gần nhà hoặc chuyến đi biển gần đây để liên hệ thực tế.',
    'medium', 12),
  L(4, 'C1', 'LS4-04', 'Đồng bằng Việt Nam',
    'Phân biệt được đồng bằng Bắc Bộ và đồng bằng Nam Bộ về vị trí, đặc điểm.',
    '🌾 Đồng bằng là nơi đất phẳng, phì nhiêu, trồng được nhiều lúa gạo. Hai đồng bằng lớn nhất nước ta nuôi sống cả đất nước!',
    'Cho bé xem hình ảnh cánh đồng lúa và so sánh với nơi mình đang sống.',
    'easy', 10),
];

// --- Chương 2: Các vùng miền ---
const g4c2: Lesson[] = [
  L(4, 'C2', 'LS4-05', 'Đồng bằng Bắc Bộ',
    'Tìm hiểu vị trí, thiên nhiên, con người và hoạt động sản xuất ở đồng bằng Bắc Bộ.',
    '🏡 Đồng bằng Bắc Bộ có sông Hồng chảy qua, người dân cần cù trồng lúa và làm nghề thủ công truyền thống.',
    'Cùng bé tìm hiểu một làng nghề nổi tiếng ở Bắc Bộ như gốm Bát Tràng hay lụa Vạn Phúc.',
    'easy', 10),
  L(4, 'C2', 'LS4-06', 'Duyên hải miền Trung',
    'Biết đặc điểm thiên nhiên khắc nghiệt và nghị lực của con người miền Trung.',
    '🏖️ Miền Trung có bờ biển dài, nhiều bão lũ nhưng con người rất kiên cường. Nơi đây có nhiều di sản văn hóa tuyệt đẹp!',
    'Kể cho bé về đặc sản miền Trung hoặc xem ảnh phố cổ Hội An, cố đô Huế.',
    'medium', 12),
  L(4, 'C2', 'LS4-07', 'Tây Nguyên',
    'Tìm hiểu về cao nguyên, khí hậu, dân tộc và cây công nghiệp ở Tây Nguyên.',
    '🌿 Tây Nguyên là vùng đất đỏ ba-dan rộng lớn, nơi có cà phê, cao su và những lễ hội cồng chiêng đặc sắc!',
    'Cho bé nghe nhạc cồng chiêng Tây Nguyên và thử nếm cà phê sữa (phiên bản nhẹ) để cảm nhận.',
    'medium', 12),
  L(4, 'C2', 'LS4-08', 'Đồng bằng Nam Bộ',
    'Nắm được đặc điểm sông nước, cây trái và đời sống ở đồng bằng Nam Bộ.',
    '🍉 Đồng bằng Nam Bộ là vựa lúa, vựa trái cây của cả nước. Chợ nổi trên sông rất vui và nhộn nhịp!',
    'Xem video chợ nổi Cái Răng cùng bé, hỏi bé thích loại trái cây miền Tây nào nhất.',
    'easy', 10),
];

// --- Chương 3: Dân cư và kinh tế ---
const g4c3: Lesson[] = [
  L(4, 'C3', 'LS4-09', 'Dân tộc Việt Nam',
    'Biết Việt Nam có 54 dân tộc anh em cùng chung sống, mỗi dân tộc có bản sắc riêng.',
    '👨‍👩‍👧‍👦 Việt Nam có 54 dân tộc anh em. Mỗi dân tộc có trang phục, phong tục và lễ hội riêng thật đẹp!',
    'Cùng bé xem ảnh trang phục các dân tộc và đoán tên dân tộc nào, rất thú vị!',
    'easy', 10),
  L(4, 'C3', 'LS4-10', 'Nông nghiệp Việt Nam',
    'Tìm hiểu các loại cây trồng, vật nuôi chính và vai trò của nông nghiệp.',
    '🌾 Nông nghiệp nuôi sống đất nước. Từ hạt gạo, con cá đến trái cây, tất cả đều do bàn tay người nông dân chăm chỉ làm ra!',
    'Nếu được, cho bé tham quan một vườn rau hoặc trang trại gần nhà để trải nghiệm thực tế.',
    'medium', 12),
  L(4, 'C3', 'LS4-11', 'Công nghiệp và thương mại',
    'Biết các ngành công nghiệp chính và hoạt động thương mại của Việt Nam.',
    '🏭 Từ nhà máy dệt may đến khu công nghệ cao, Việt Nam sản xuất nhiều sản phẩm xuất khẩu ra thế giới!',
    'Hỏi bé đồ dùng trong nhà được sản xuất ở đâu, giúp bé hiểu chuỗi sản xuất đơn giản.',
    'medium', 12),
  L(4, 'C3', 'LS4-12', 'Giao thông vận tải',
    'Nắm được các loại hình giao thông: đường bộ, đường sắt, đường thủy, đường hàng không.',
    '🚂 Từ xe máy, xe lửa đến máy bay — giao thông giúp mọi người đi lại và hàng hóa đến mọi nơi!',
    'Cùng bé phân loại phương tiện giao thông theo đường bộ, thủy, hàng không khi ra đường.',
    'easy', 10),
];

// --- Chương 4: Lịch sử Việt Nam cổ đại ---
const g4c4: Lesson[] = [
  L(4, 'C4', 'LS4-13', 'Thời nguyên thủy',
    'Biết về cuộc sống của người Việt cổ thời nguyên thủy trên đất nước ta.',
    '🏔️ Ngày xưa, tổ tiên ta sống trong hang đá, biết dùng đá làm công cụ và săn bắt thú rừng. Thật dũng cảm!',
    'Kể chuyện người xưa như kể truyện cổ tích, bé sẽ rất hào hứng lắng nghe.',
    'easy', 10),
  L(4, 'C4', 'LS4-14', 'Văn Lang — Âu Lạc',
    'Tìm hiểu nhà nước Văn Lang của vua Hùng và Âu Lạc của An Dương Vương.',
    '👑 Vua Hùng dựng nước Văn Lang — nhà nước đầu tiên của nước ta. Truyền thuyết Lạc Long Quân và Âu Cơ kể về nguồn gốc dân tộc!',
    'Kể cho bé truyền thuyết Con Rồng Cháu Tiên và giỗ Tổ Hùng Vương mùng 10 tháng 3.',
    'medium', 12),
  L(4, 'C4', 'LS4-15', '1000 năm Bắc thuộc',
    'Hiểu khái quát thời kỳ hơn 1000 năm đô hộ của phong kiến phương Bắc.',
    '⚔️ Suốt hơn 1000 năm bị đô hộ, nhân dân ta không ngừng đấu tranh giành độc lập. Tinh thần bất khuất thật đáng tự hào!',
    'Nhấn mạnh tinh thần yêu nước, giúp bé hiểu vì sao ông cha phải chiến đấu.',
    'medium', 12),
  L(4, 'C4', 'LS4-16', 'Khởi nghĩa tiêu biểu',
    'Biết các cuộc khởi nghĩa tiêu biểu: Hai Bà Trưng, Bà Triệu, Lý Bí, Ngô Quyền.',
    '🔥 Hai Bà Trưng cưỡi voi đánh giặc, Bà Triệu "muốn cưỡi gió đạp sóng", Ngô Quyền đại phá quân Nam Hán trên sông Bạch Đằng!',
    'Cùng bé đóng vai các nhân vật lịch sử, kể lại câu chuyện theo cách vui nhộn.',
    'hard', 15),
];

// --- Chương 5: Lịch sử Việt Nam trung đại ---
const g4c5: Lesson[] = [
  L(4, 'C5', 'LS4-17', 'Nhà Lý',
    'Tìm hiểu triều đại nhà Lý: dời đô Thăng Long, phát triển văn hóa giáo dục.',
    '🏯 Vua Lý Thái Tổ dời đô về Thăng Long. Nhà Lý mở Văn Miếu — trường đại học đầu tiên của nước ta!',
    'Nếu ở Hà Nội, cho bé tham quan Văn Miếu Quốc Tử Giám để cảm nhận lịch sử.',
    'medium', 12),
  L(4, 'C5', 'LS4-18', 'Nhà Trần',
    'Biết về triều Trần: ba lần đánh thắng quân Mông-Nguyên, Hội nghị Diên Hồng.',
    '🛡️ Nhà Trần ba lần đánh bại quân Mông-Nguyên hùng mạnh. Hào khí "Sát Thát" và Hội nghị Diên Hồng mãi vang vọng!',
    'Kể cho bé chuyện Trần Quốc Toản bóp nát quả cam vì uất ức không được dự họp.',
    'medium', 12),
  L(4, 'C5', 'LS4-19', 'Nhà Lê',
    'Tìm hiểu cuộc khởi nghĩa Lam Sơn và triều đại nhà Lê sơ hưng thịnh.',
    '📜 Lê Lợi mười năm kháng chiến, giành lại độc lập. Nguyễn Trãi viết Bình Ngô đại cáo — áng văn bất hủ!',
    'Đọc cho bé nghe vài câu Bình Ngô đại cáo bằng giọng hào hùng.',
    'medium', 12),
  L(4, 'C5', 'LS4-20', 'Chống giặc ngoại xâm',
    'Tổng hợp tinh thần chống giặc ngoại xâm xuyên suốt lịch sử dân tộc.',
    '🇻🇳 Qua hàng nghìn năm lịch sử, dân tộc Việt Nam luôn kiên cường chống giặc ngoại xâm để bảo vệ Tổ quốc!',
    'Cùng bé lập dòng thời gian các cuộc kháng chiến, vẽ ra giấy cho dễ nhớ.',
    'hard', 15),
];

export const histgeoLessons4: Lesson[] = [
  ...g4c1, ...g4c2, ...g4c3, ...g4c4, ...g4c5,
];

// ===== LỚP 5 =====
sid = 20; // reset để ID tiếp tục từ 540 + 21 = 561

// --- Chương 1: Châu Á ---
const g5c1: Lesson[] = [
  L(5, 'C1', 'LS5-01', 'Châu Á — Vị trí và thiên nhiên',
    'Biết vị trí địa lý, đặc điểm thiên nhiên đa dạng của châu Á.',
    '🌏 Châu Á là châu lục lớn nhất thế giới, có sa mạc nóng, rừng nhiệt đới và đỉnh Everest cao nhất thế giới!',
    'Dùng quả địa cầu hoặc bản đồ World để bé tìm châu Á và chỉ vị trí Việt Nam.',
    'easy', 10),
  L(5, 'C1', 'LS5-02', 'Dân cư châu Á',
    'Tìm hiểu về dân số đông đúc, đa dạng văn hóa và tôn giáo ở châu Á.',
    '👨‍👩‍👧‍👦 Châu Á có hơn 4 tỉ người — đông nhất thế giới! Nhiều nền văn hóa rực rỡ cùng tồn tại bên nhau.',
    'Cùng bé tìm hiểu một phong tục thú vị của nước châu Á nào đó, ví dụ lễ hội Nhật Bản.',
    'easy', 10),
  L(5, 'C1', 'LS5-03', 'Một số nước châu Á',
    'Biết đặc điểm nổi bật của Trung Quốc, Nhật Bản, Ấn Độ và một số nước khác.',
    '🏯 Trung Quốc có Vạn Lý Trường Thành, Nhật Bản có núi Phú Sĩ, Ấn Độ có đền Taj Mahal — mỗi nước một nét đẹp riêng!',
    'Cho bé xem ảnh các kỳ quan của từng nước và đoán đó là nước nào.',
    'medium', 12),
  L(5, 'C1', 'LS5-04', 'Đông Nam Á & ASEAN',
    'Tìm hiểu khu vực Đông Nam Á và tổ chức ASEAN mà Việt Nam là thành viên.',
    '🤝 ASEAN là ngôi nhà chung của 10 nước Đông Nam Á. Các nước cùng hợp tác để phát triển và giữ gìn hòa bình!',
    'Cùng bé đếm 10 nước ASEAN và tìm cờ của từng nước trên mạng.',
    'medium', 12),
];

// --- Chương 2: Châu Âu, Phi, ĐD, Nam Cực ---
const g5c2: Lesson[] = [
  L(5, 'C2', 'LS5-05', 'Châu Âu',
    'Biết vị trí, thiên nhiên và một số nước tiêu biểu ở châu Âu.',
    '🏰 Châu Âu có nhiều lâu đài cổ kính, tháp Eiffel ở Pháp và đấu trường La Mã ở Ý. Thiên nhiên bốn mùa rõ rệt!',
    'Nếu bé thích hoạt hình châu Âu, hãy liên hệ bối cảnh phim với địa lý thực tế.',
    'easy', 10),
  L(5, 'C2', 'LS5-06', 'Châu Phi',
    'Tìm hiểu về thiên nhiên hoang dã, sa mạc Sahara và cuộc sống ở châu Phi.',
    '🦁 Châu Phi có sa mạc Sahara nóng bỏng, thảo nguyên với sư tử, voi, hươu cao cổ và kim tự tháp huyền bí!',
    'Xem phim tài liệu thiên nhiên châu Phi cùng bé, hỏi bé thích con vật nào nhất.',
    'medium', 12),
  L(5, 'C2', 'LS5-07', 'Châu Đại Dương',
    'Biết về nước Úc, New Zealand và các đảo quốc ở Thái Bình Dương.',
    '🦘 Châu Đại Dương có nước Úc rộng lớn với chuột túi kangaroo, rạn san hô Great Barrier Reef tuyệt đẹp!',
    'Cho bé xem ảnh kangaroo, gấu koala và hỏi vì sao chúng chỉ sống ở Úc.',
    'easy', 10),
  L(5, 'C2', 'LS5-08', 'Châu Nam Cực',
    'Tìm hiểu về vùng đất băng giá Nam Cực và vai trò khoa học của nó.',
    '🐧 Châu Nam Cực lạnh nhất thế giới, phủ đầy băng tuyết. Chỉ có chim cánh cụt và các nhà khoa học sống ở đây!',
    'Làm thí nghiệm nhỏ: bỏ đá vào chậu nước và giải thích hiện tượng băng tan cho bé.',
    'easy', 10),
];

// --- Chương 3: Châu Mỹ ---
const g5c3: Lesson[] = [
  L(5, 'C3', 'LS5-09', 'Châu Mỹ — Vị trí và thiên nhiên',
    'Biết vị trí châu Mỹ, phân biệt Bắc Mỹ và Nam Mỹ, thiên nhiên đa dạng.',
    '🌎 Châu Mỹ trải dài từ Bắc Cực đến gần Nam Cực. Có rừng Amazon rộng nhất và sông Amazon dài nhất thế giới!',
    'Cùng bé tìm rừng Amazon trên bản đồ và kể về sự đa dạng sinh học ở đây.',
    'easy', 10),
  L(5, 'C3', 'LS5-10', 'Hoa Kỳ',
    'Tìm hiểu về đất nước Hoa Kỳ: vị trí, kinh tế phát triển và văn hóa đa dạng.',
    '🗽 Hoa Kỳ có tượng Nữ thần Tự do, Hollywood, NASA và là nền kinh tế lớn nhất thế giới!',
    'Hỏi bé biết gì về Hoa Kỳ qua phim ảnh, từ đó giới thiệu thêm kiến thức địa lý.',
    'medium', 12),
  L(5, 'C3', 'LS5-11', 'Bra-xin',
    'Biết về Bra-xin: đất nước lớn nhất Nam Mỹ, nổi tiếng bóng đá và carnival.',
    '⚽ Bra-xin là quê hương của bóng đá, lễ hội carnival sôi động và rừng Amazon xanh bát ngát!',
    'Nếu bé thích bóng đá, kể về các cầu thủ nổi tiếng của Bra-xin để tạo hứng thú.',
    'medium', 12),
  L(5, 'C3', 'LS5-12', 'Các nước châu Mỹ khác',
    'Tìm hiểu khái quát về Canada, Mexico, Argentina và một số nước khác.',
    '🍁 Canada có lá phong đỏ và tuyết trắng, Mexico có kim tự tháp Maya, Argentina có điệu tango nồng nàn!',
    'Cùng bé làm sổ tay nhỏ, dán cờ và ghi đặc điểm nổi bật của từng nước.',
    'easy', 10),
];

// --- Chương 4: Lịch sử Việt Nam cận đại ---
const g5c4: Lesson[] = [
  L(5, 'C4', 'LS5-13', 'Pháp xâm lược Việt Nam',
    'Hiểu bối cảnh thực dân Pháp xâm lược và đô hộ Việt Nam.',
    '⚔️ Năm 1858, thực dân Pháp nổ súng xâm lược nước ta. Nhân dân Việt Nam anh dũng đứng lên chống lại!',
    'Giải thích đơn giản cho bé vì sao nước ta bị xâm lược và người dân đã phản ứng ra sao.',
    'medium', 12),
  L(5, 'C4', 'LS5-14', 'Phong trào yêu nước',
    'Biết các phong trào yêu nước đầu thế kỷ 20: Phan Bội Châu, Phan Châu Trinh.',
    '🔥 Nhiều nhà yêu nước đã tìm đường cứu nước. Phan Bội Châu sang Nhật, Phan Châu Trinh đổi mới trong nước!',
    'Kể cho bé nghe câu chuyện của Phan Bội Châu và hỏi bé nếu là nhà yêu nước sẽ làm gì.',
    'medium', 12),
  L(5, 'C4', 'LS5-15', 'Cách mạng Tháng Tám',
    'Hiểu ý nghĩa lịch sử của Cách mạng Tháng Tám 1945 và Quốc khánh 2/9.',
    '🎆 Ngày 2/9/1945, Bác Hồ đọc Tuyên ngôn Độc lập, khai sinh nước Việt Nam Dân chủ Cộng hòa. Ngày lịch sử trọng đại!',
    'Cho bé nghe đoạn ghi âm bản Tuyên ngôn Độc lập và giải thích ý nghĩa ngày Quốc khánh.',
    'hard', 15),
  L(5, 'C4', 'LS5-16', 'Kháng chiến chống Pháp',
    'Nắm được diễn biến chính của cuộc kháng chiến chống thực dân Pháp (1946-1954).',
    '🛡️ Chín năm trường kỳ kháng chiến chống Pháp, quân dân ta chịu nhiều gian khổ nhưng không lùi bước!',
    'Dùng dòng thời gian đơn giản giúp bé nắm các mốc sự kiện quan trọng.',
    'hard', 15),
];

// --- Chương 5: Việt Nam hiện đại ---
const g5c5: Lesson[] = [
  L(5, 'C5', 'LS5-17', 'Chiến dịch Điện Biên Phủ',
    'Hiểu ý nghĩa chiến thắng Điện Biên Phủ — "lừng lẫy năm châu, chấn động địa cầu".',
    '⭐ Chiến thắng Điện Biên Phủ năm 1954 là đỉnh cao chói lọi, chấm dứt ách đô hộ của thực dân Pháp!',
    'Cho bé xem hình ảnh lá cờ chiến thắng trên nóc hầm De Castries và kể câu chuyện anh hùng.',
    'hard', 15),
  L(5, 'C5', 'LS5-18', 'Đất nước chia cắt',
    'Biết hoàn cảnh đất nước chia cắt hai miền Nam-Bắc sau năm 1954.',
    '💔 Sau Hiệp định Genève, đất nước tạm chia đôi ở vĩ tuyến 17. Bao gia đình chia cắt, mong ngày đoàn tụ!',
    'Giải thích nhẹ nhàng cho bé về sự chia cắt và tình yêu thương gia đình trong hoàn cảnh khó khăn.',
    'medium', 12),
  L(5, 'C5', 'LS5-19', 'Thống nhất đất nước',
    'Hiểu ý nghĩa sự kiện 30/4/1975 — ngày giải phóng miền Nam, thống nhất đất nước.',
    '🇻🇳 Ngày 30/4/1975, đất nước hoàn toàn thống nhất. Bắc-Nam sum họp một nhà, niềm vui vỡ òa!',
    'Hỏi ông bà kể lại ngày thống nhất, giúp bé kết nối lịch sử với gia đình mình.',
    'hard', 15),
  L(5, 'C5', 'LS5-20', 'Đổi Mới và phát triển',
    'Biết về công cuộc Đổi Mới từ 1986 và sự phát triển của Việt Nam hiện đại.',
    '🚀 Từ năm 1986, Việt Nam Đổi Mới, phát triển kinh tế, hội nhập thế giới. Đất nước ngày càng giàu đẹp hơn!',
    'So sánh cuộc sống ngày xưa và bây giờ cho bé thấy đất nước đã thay đổi ra sao.',
    'medium', 12),
];

export const histgeoLessons5: Lesson[] = [
  ...g5c1, ...g5c2, ...g5c3, ...g5c4, ...g5c5,
];
