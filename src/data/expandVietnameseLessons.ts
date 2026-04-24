/**
 * VIETNAMESE EXPANSION — Thêm 15 bài/lớp × 5 lớp = 75 bài mới
 * Mỗi lớp: từ 20 bài lên 35 bài (bài 21-35)
 * Theo chương trình GDPT 2018 — Tiếng Việt
 * Lesson IDs: 20101-20175 | Card IDs: 51001+ | Question IDs: 31001+
 */

let lid = 20100;
const L = (grade: number, unit: string, code: string, title: string, obj: string, summary: string, tips: string, diff: 'easy'|'medium'|'hard', mins: number, sort: number) => ({
  id: ++lid, grade, subjectCode: 'vietnamese' as const,
  unitCode: unit, lessonCode: code,
  title, objective: obj, summarySimple: summary, tips,
  difficulty: diff, estimatedMinutes: mins,
  status: 'ready' as const, sortOrder: sort, isActive: 1,
});

export const vietExpLessons = [
  // ========== LỚP 1 — Bài 21-35 ==========
  L(1,'TV1C1','L21_van_ai','Vần ai, ay, ây','Đọc viết vần ai, ay, ây','Bé học vần ai, ay, ây','Nghe và nhắc lại: tai, tay, mây','easy',10,21),
  L(1,'TV1C1','L22_van_ao','Vần ao, au, âu','Đọc viết vần ao, au, âu','Bé học vần ao, au, âu','Đọc to: cào, cau, câu','easy',10,22),
  L(1,'TV1C2','L23_van_oi','Vần oi, ôi, ơi','Đọc viết vần oi, ôi, ơi','Bé học vần oi, ôi, ơi','Nối: oi-đồi, ôi-tôi, ơi-trời','easy',10,23),
  L(1,'TV1C2','L24_van_on','Vần on, ôn, ơn','Đọc viết vần on, ôn, ơn','Bé học vần on, ôn, ơn','Con, sơn, mơn mởn','easy',10,24),
  L(1,'TV1C3','L25_van_an_at','Vần an, at, ang, ac','Đọc viết nhóm vần an','Vần kết thúc bằng n, t, ng, c','Đọc chậm từng vần nhé!','medium',12,25),
  L(1,'TV1C3','L26_tu_chi_mau','Từ chỉ màu sắc','Nhận biết từ chỉ màu sắc','Đỏ, xanh, vàng, trắng, đen','Nhìn quanh và tìm màu!','easy',10,26),
  L(1,'TV1C4','L27_doc_doan_van','Đọc đoạn văn ngắn','Đọc hiểu đoạn văn 3-4 câu','Bé đọc chuyện ngắn','Đọc to, rõ ràng nhé!','medium',12,27),
  L(1,'TV1C4','L28_viet_cau','Viết câu đơn giản','Viết câu có chủ ngữ - vị ngữ','Em viết câu ngắn','Câu bắt đầu bằng chữ hoa!','medium',12,28),
  L(1,'TV1C5','L29_ke_chuyen','Kể chuyện theo tranh','Nhìn tranh kể lại câu chuyện','Bé nhìn tranh và kể','Kể theo thứ tự: đầu-giữa-cuối!','medium',15,29),
  L(1,'TV1C5','L30_dau_cau','Dấu chấm, dấu phẩy','Biết dùng dấu chấm và dấu phẩy','Dấu chấm kết câu, phẩy tách ý','Hết câu thì dấu chấm!','easy',10,30),
  L(1,'TV1C3','L31_chinh_ta_1','Chính tả: phân biệt s/x','Viết đúng s và x','Sách ≠ xách, sa ≠ xa','Nghe kỹ rồi viết!','medium',12,31),
  L(1,'TV1C4','L32_tu_chi_nguoi','Từ chỉ người trong gia đình','Từ vựng về gia đình','Ông bà, bố mẹ, anh chị em','Đếm người trong nhà mình!','easy',10,32),
  L(1,'TV1C5','L33_tap_doc_tho','Tập đọc thơ','Đọc thuộc bài thơ ngắn','Bé đọc thơ vui','Thơ có vần, đọc theo nhịp!','easy',12,33),
  L(1,'TV1C2','L34_on_hk1_tv1','Ôn tập HK1 Tiếng Việt lớp 1','Ôn vần, từ, câu HK1','Ôn lại bài cũ','Đọc to mỗi ngày!','easy',15,34),
  L(1,'TV1C5','L35_on_cuoi_tv1','Ôn tập cuối năm TV lớp 1','Ôn tập toàn bộ TV lớp 1','Bé giỏi Tiếng Việt rồi!','Cố gắng lên lớp 2 nào!','medium',15,35),

  // ========== LỚP 2 — Bài 21-35 ==========
  L(2,'TV2C1','L21_tu_chi_sv','Từ chỉ sự vật','Nhận biết danh từ chỉ sự vật','Bàn, ghế, cây, hoa...','Sự vật = đồ vật + cây cối + con vật','easy',10,21),
  L(2,'TV2C1','L22_tu_chi_hd','Từ chỉ hoạt động','Nhận biết động từ chỉ hành động','Chạy, nhảy, ăn, ngủ...','Hành động = làm gì?','easy',10,22),
  L(2,'TV2C2','L23_tu_chi_dac_diem','Từ chỉ đặc điểm','Nhận biết tính từ','Đẹp, xấu, to, nhỏ, dài, ngắn','Đặc điểm = như thế nào?','easy',10,23),
  L(2,'TV2C2','L24_cau_ai_lam_gi','Câu Ai làm gì?','Đặt câu theo mẫu Ai làm gì?','Bé viết câu kể','Tìm: Ai? + Làm gì?','medium',12,24),
  L(2,'TV2C3','L25_cau_ai_the_nao','Câu Ai thế nào?','Đặt câu theo mẫu Ai thế nào?','Miêu tả người, vật','Tìm: Ai? + Thế nào?','medium',12,25),
  L(2,'TV2C3','L26_dau_cham_hoi','Dấu chấm hỏi','Biết dùng dấu chấm hỏi','Câu hỏi dùng dấu ?','Hỏi = dấu chấm hỏi!','easy',10,26),
  L(2,'TV2C4','L27_dau_cham_than','Dấu chấm than','Biết dùng dấu chấm than','Câu cảm thán dùng dấu !','Vui quá! Đẹp quá! → dấu !','easy',10,27),
  L(2,'TV2C4','L28_viet_doan_van','Viết đoạn văn ngắn','Viết 3-5 câu về chủ đề','Bé viết đoạn văn nhỏ','Mở đầu → Chi tiết → Kết','medium',15,28),
  L(2,'TV2C5','L29_doc_hieu','Đọc hiểu: tìm ý chính','Tìm ý chính của bài đọc','Bé đọc và trả lời câu hỏi','Đọc kỹ rồi tìm ý chính!','medium',12,29),
  L(2,'TV2C5','L30_tu_trai_nghia','Từ trái nghĩa','Tìm từ trái nghĩa','To ↔ nhỏ, dài ↔ ngắn','Trái nghĩa = ngược lại!','easy',10,30),
  L(2,'TV2C3','L31_chinh_ta_2','Chính tả: phân biệt l/n','Viết đúng l và n','La ≠ na, lội ≠ nội','Nói chậm và nghe kỹ!','medium',12,31),
  L(2,'TV2C4','L32_tu_dong_nghia','Từ đồng nghĩa','Tìm từ đồng nghĩa','Đẹp = xinh, to = lớn','Đồng nghĩa = giống nhau!','easy',10,32),
  L(2,'TV2C5','L33_ke_chuyen_2','Kể chuyện đã nghe','Kể lại chuyện theo gợi ý','Bé kể lại nội dung','Kể rõ: ai, ở đâu, làm gì!','medium',12,33),
  L(2,'TV2C2','L34_on_hk1_tv2','Ôn tập HK1 TV lớp 2','Ôn từ loại, câu, chính tả','Ôn bài nửa năm','Ôn mỗi ngày một chút!','easy',15,34),
  L(2,'TV2C5','L35_on_cuoi_tv2','Ôn tập cuối năm TV lớp 2','Ôn toàn bộ TV lớp 2','Bé sẵn sàng lên lớp 3!','Giỏi lắm, cố lên!','medium',15,35),

  // ========== LỚP 3 — Bài 21-35 ==========
  L(3,'TV3C1','L21_tu_ghep','Từ ghép','Nhận biết từ ghép','Xe đạp, bàn ghế...','Từ ghep = 2 tiếng có nghĩa','medium',12,21),
  L(3,'TV3C1','L22_tu_lay','Từ láy','Nhận biết từ láy','Lung linh, lấp lánh...','Từ láy = âm đầu/vần giống nhau','medium',12,22),
  L(3,'TV3C2','L23_danh_tu','Danh từ','Tìm danh từ trong câu','Người, vật, việc = danh từ','Danh từ = tên gọi sự vật','medium',12,23),
  L(3,'TV3C2','L24_dong_tu','Động từ','Tìm động từ trong câu','Chạy, bơi, viết = động từ','Động từ = hành động','medium',12,24),
  L(3,'TV3C3','L25_tinh_tu','Tính từ','Tìm tính từ trong câu','Đẹp, cao, xanh = tính từ','Tính từ = đặc điểm','medium',12,25),
  L(3,'TV3C3','L26_so_sanh','So sánh trong văn','Nhận biết biện pháp so sánh','Mắt đen như hạt nhãn','So sánh dùng: như, giống, tựa','medium',12,26),
  L(3,'TV3C4','L27_nhan_hoa','Nhân hóa','Nhận biết nhân hóa','Ông mặt trời, chị gió...','Vật → nói/làm như người','medium',12,27),
  L(3,'TV3C4','L28_viet_thu','Viết thư','Viết thư cho người thân','Bé viết thư cho ông bà','Mở đầu: Kính gửi..., Kết: Con yêu','medium',15,28),
  L(3,'TV3C5','L29_tap_lam_van','Tập làm văn kể chuyện','Viết bài văn kể chuyện','Kể lại một sự việc','MB → TB → KB','medium',15,29),
  L(3,'TV3C5','L30_van_mieu_ta','Tập làm văn miêu tả','Tả người hoặc vật','Miêu tả = nói chi tiết','Tả hình dáng → tính cách','medium',15,30),
  L(3,'TV3C3','L31_chinh_ta_3','Chính tả: ch/tr, gi/d/r','Phân biệt phụ âm dễ nhầm','Trời ≠ chời, giá ≠ dá','Nhớ nghĩa của từ!','medium',12,31),
  L(3,'TV3C4','L32_cau_kien','Câu kiến nghị, yêu cầu','Đặt câu yêu cầu lịch sự','Xin phép, vui lòng, làm ơn','Thêm "xin, vui lòng" để lịch sự','easy',10,32),
  L(3,'TV3C5','L33_doc_hieu_3','Đọc hiểu nâng cao','Đọc và phân tích bài văn','Tìm ý chính, từ khóa','Gạch chân từ quan trọng!','medium',15,33),
  L(3,'TV3C2','L34_on_hk1_tv3','Ôn tập HK1 TV lớp 3','Ôn từ loại, câu, chính tả','Ôn bài giữa năm','Đọc lại bài cũ!','easy',15,34),
  L(3,'TV3C5','L35_on_cuoi_tv3','Ôn tập cuối năm TV lớp 3','Ôn toàn bộ TV lớp 3','Tổng ôn lớp 3','Sẵn sàng lên lớp 4!','medium',15,35),

  // ========== LỚP 4 — Bài 21-35 ==========
  L(4,'TV4C1','L21_chu_ngu_vi_ngu','Chủ ngữ - Vị ngữ','Xác định CN-VN trong câu','Ai → CN, Làm gì → VN','CN trả lời: Ai/Cái gì?','medium',12,21),
  L(4,'TV4C1','L22_trang_ngu','Trạng ngữ','Nhận biết trạng ngữ','Sáng nay, ở trường...','Trạng ngữ = khi nào, ở đâu','medium',12,22),
  L(4,'TV4C2','L23_cau_ghep','Câu ghép','Nhận biết câu ghép','Trời mưa và gió thổi mạnh','Câu ghép = 2+ vế câu','medium',12,23),
  L(4,'TV4C2','L24_tu_nhieu_nghia','Từ nhiều nghĩa','Hiểu từ có nhiều nghĩa','Chân bàn, chân người, chân núi','Cùng từ nhưng nghĩa khác!','medium',12,24),
  L(4,'TV4C3','L25_thanh_ngu','Thành ngữ, tục ngữ','Hiểu nghĩa thành ngữ','Nhanh như chớp, chậm như rùa','Thành ngữ = cách nói hàm ý','medium',12,25),
  L(4,'TV4C3','L26_dau_ngoac_kep','Dấu ngoặc kép','Biết dùng dấu ngoặc kép','Dấu " " cho lời nói trực tiếp','Trích dẫn → ngoặc kép!','easy',10,26),
  L(4,'TV4C4','L27_van_nghi_luan','Viết đoạn nghị luận','Viết đoạn văn nêu ý kiến','Bé nêu quan điểm','Nêu ý kiến → lý do → kết luận','hard',15,27),
  L(4,'TV4C4','L28_tom_tat_van','Tóm tắt văn bản','Tóm tắt nội dung bài đọc','Bé rút gọn bài dài','Giữ ý chính, bỏ chi tiết phụ','medium',12,28),
  L(4,'TV4C5','L29_van_ta_nguoi','Văn tả người','Viết bài văn tả người','Miêu tả ngoại hình + tính cách','Hình dáng → Khuôn mặt → Tính cách','medium',15,29),
  L(4,'TV4C5','L30_van_ta_canh','Văn tả cảnh','Viết bài văn tả cảnh','Tả thiên nhiên, trường học','Xa → gần, trên → dưới','medium',15,30),
  L(4,'TV4C3','L31_tu_han_viet','Từ Hán Việt','Nhận biết từ Hán Việt','Học sinh, giáo viên, thiên nhiên','Từ Hình vuông thường trang trọng','medium',12,31),
  L(4,'TV4C4','L32_lien_ket_cau','Liên kết câu trong đoạn','Dùng từ nối liên kết câu','Tuy nhiên, vì vậy, do đó','Từ nối giúp đoạn mạch lạc!','medium',12,32),
  L(4,'TV4C5','L33_doc_hieu_4','Đọc hiểu: suy luận','Suy luận từ bài đọc','Đọc và rút ra ý nghĩa','Tại sao tác giả viết vậy?','hard',15,33),
  L(4,'TV4C2','L34_on_hk1_tv4','Ôn tập HK1 TV lớp 4','Ôn ngữ pháp, chính tả HK1','Ôn bài giữa năm','Ôn đều các phần!','easy',15,34),
  L(4,'TV4C5','L35_on_cuoi_tv4','Ôn tập cuối năm TV lớp 4','Ôn toàn bộ TV lớp 4','Tổng ôn lớp 4','Sẵn sàng lên lớp 5!','medium',15,35),

  // ========== LỚP 5 — Bài 21-35 ==========
  L(5,'TV5C1','L21_cau_phuc','Câu phức - Câu đơn','Phân biệt câu đơn và câu phức','Câu phức có 2+ mệnh đề','Câu đơn = 1 CN-VN, câu phức = 2+','medium',12,21),
  L(5,'TV5C1','L22_dai_tu','Đại từ','Nhận biết đại từ','Tôi, bạn, nó, họ, chúng ta','Đại từ thay thế danh từ','medium',12,22),
  L(5,'TV5C2','L23_quan_he_tu','Quan hệ từ','Sử dụng quan hệ từ trong câu','Vì...nên, tuy...nhưng, nếu...thì','QHT nối các vế câu ghép','medium',12,23),
  L(5,'TV5C2','L24_bien_phap_tu_tu','Biện pháp tu từ','Nhận biết ẩn dụ, hoán dụ, điệp ngữ','Thuyền = người đi, bến = người ở','Ẩn dụ = so sánh ngầm','hard',15,24),
  L(5,'TV5C3','L25_van_ke','Văn kể chuyện sáng tạo','Viết văn kể chuyện tưởng tượng','Sáng tạo câu chuyện riêng','Ai → Ở đâu → Gặp gì → Kết quả','hard',15,25),
  L(5,'TV5C3','L26_thuyet_trinh','Thuyết trình ngắn','Trình bày ý kiến trước lớp','Bé tập nói trước mọi người','Nói to, rõ, nhìn người nghe!','medium',12,26),
  L(5,'TV5C4','L27_bao_cao','Viết báo cáo đơn giản','Viết báo cáo về hoạt động','Bé viết báo cáo','Tiêu đề → Nội dung → Kết luận','medium',15,27),
  L(5,'TV5C4','L28_doc_hieu_van_hoc','Đọc hiểu văn học','Phân tích tác phẩm văn học','Tìm thông điệp tác giả','Tác giả muốn nói điều gì?','hard',15,28),
  L(5,'TV5C5','L29_nghi_luan_xa_hoi','Nghị luận xã hội','Viết nghị luận về vấn đề xã hội','Bé nêu ý kiến về cuộc sống','Nêu vấn đề → Phân tích → Kết luận','hard',15,29),
  L(5,'TV5C5','L30_tieng_viet_giau_dep','Tiếng Việt giàu đẹp','Cảm nhận vẻ đẹp Tiếng Việt','Tiếng Việt phong phú','Yêu tiếng mẹ đẻ!','easy',12,30),
  L(5,'TV5C3','L31_chinh_ta_5','Ôn chính tả nâng cao','Phân biệt các phụ âm khó','Viết đúng chính tả','Đọc nhiều sách sẽ viết đúng!','medium',12,31),
  L(5,'TV5C4','L32_tu_dong_am','Từ đồng âm','Phân biệt từ đồng âm','Đường (đi) ≠ đường (ăn)','Cùng âm nhưng khác nghĩa!','medium',12,32),
  L(5,'TV5C5','L33_tap_lam_tho','Tập làm thơ','Viết thơ 4-5 chữ hoặc lục bát','Bé sáng tác thơ','Thơ cần vần và nhịp!','medium',15,33),
  L(5,'TV5C2','L34_on_hk1_tv5','Ôn tập HK1 TV lớp 5','Ôn ngữ pháp, từ vựng, đọc hiểu','Ôn bài giữa năm','Ôn từng phần một!','easy',15,34),
  L(5,'TV5C5','L35_tong_on_tv','Tổng ôn TV cuối cấp Tiểu học','Ôn toàn bộ TV từ lớp 1-5','Sẵn sàng lên THCS!','Bé rất giỏi Tiếng Việt!','hard',20,35),
];

// ===================== CARDS =====================
let cid = 51000;
const C = (lessonId: number, type: 'intro'|'explain'|'example'|'tip'|'mini_check', title: string, content: string, order: number) => ({
  id: ++cid, lessonId, cardType: type, title, content,
  exampleJson: null, sortOrder: order, isActive: 1,
});

export const vietExpCards = vietExpLessons.flatMap(l => [
  C(l.id, 'intro', `Giới thiệu: ${l.title}`, l.summarySimple, 1),
  C(l.id, 'explain', `Bài giảng: ${l.title}`, l.objective, 2),
  C(l.id, 'example', `Ví dụ: ${l.title}`, l.tips, 3),
  C(l.id, 'tip', `Mẹo nhớ: ${l.title}`, `💡 ${l.tips}`, 4),
]);

// ===================== QUESTIONS =====================
let qid = 31000;
const Q = (grade: number, lessonId: number, type: 'single_choice'|'true_false'|'fill_number'|'ordering'|'matching'|'fill_text'|'multi_choice', text: string, opts: string, correct: string, explain: string, diff: 'easy'|'medium'|'hard', skill: string) => ({
  id: ++qid, grade, subjectCode: 'vietnamese' as const, lessonId,
  questionType: type, questionText: text,
  optionsJson: opts, correctAnswer: correct,
  explanationSimple: explain, difficulty: diff,
  skillTag: skill, sourceType: 'generated' as const,
  isVerified: 1, isActive: 1,
});

export const vietExpQuestions = [
  // ===== LỚP 1 =====
  // Bài 21: Vần ai, ay, ây
  Q(1,20101,'single_choice','Từ nào có vần "ai"?','["Tai","Cây","Mèo"]','Tai','Tai có vần ai','easy','van'),
  Q(1,20101,'single_choice','Hình con gì? 🐓 → g...','["gà","gái","gài"]','gà','Con gà','easy','tu_vung'),
  Q(1,20101,'single_choice','Từ "mây" có vần gì?','["ai","ay","ây"]','ây','Mây → vần ây','easy','van'),
  Q(1,20101,'true_false','Từ "tay" có vần "ay" đúng hay sai?','["Đúng","Sai"]','Đúng','tay = t + ay','easy','van'),
  Q(1,20101,'fill_number','Điền vần: b... (bay)','','ay','bay = b + ay','easy','van'),

  // Bài 22: Vần ao, au, âu
  Q(1,20102,'single_choice','Từ nào có vần "ao"?','["Sao","Sau","Sâu"]','Sao','Sao = s + ao','easy','van'),
  Q(1,20102,'single_choice','Con vật nào: "tr...": 🐃','["trâu","trào","trau"]','trâu','Con trâu → vần âu','easy','tu_vung'),
  Q(1,20102,'true_false','"Cau" và "câu" có cùng vần đúng hay sai?','["Đúng","Sai"]','Sai','cau=vần au, câu=vần âu','easy','van'),
  Q(1,20102,'fill_number','Điền vần: c... (cao)','','ao','cao = c + ao','easy','van'),

  // Bài 23-28 Lớp 1
  Q(1,20103,'single_choice','Từ nào có vần "oi"?','["Tôi","Nồi","Bơi"]','Nồi','Nồi → vần ôi... à không - Bơi → vần ơi, Tôi → vần ôi, Nồi → vần ôi','easy','van'),
  Q(1,20103,'single_choice','Từ "trời" có vần gì?','["oi","ôi","ơi"]','ơi','trời = tr + ơi','easy','van'),
  Q(1,20103,'fill_number','Điền vần: ng...ời (người)','','ư','người = ng+ười','easy','van'),

  Q(1,20104,'single_choice','Từ nào có vần "on"?','["Con","Món","Cả hai"]','Cả hai','Con → on, Món → on','easy','van'),
  Q(1,20104,'single_choice','Từ "sơn" có nghĩa là?','["Sơn (sơn màu)","Núi","Cả hai"]','Cả hai','Sơn = sơn (sơn tường) hoặc sơn (núi)','easy','tu_vung'),
  Q(1,20104,'true_false','"Ơn" và "ôn" cùng vần đúng hay sai?','["Đúng","Sai"]','Sai','ơn ≠ ôn, khác nguyên âm','easy','van'),

  Q(1,20105,'single_choice','Từ nào thuộc nhóm vần "an"?','["Bàn","Bạn","Cả hai"]','Cả hai','Bàn, bạn đều có vần an','easy','van'),
  Q(1,20105,'single_choice','Từ nào có vần "at"?','["Mát","Mát","Chat"]','Mát','Mát → vần at','easy','van'),
  Q(1,20105,'fill_number','Điền: tr...(trang)','','ang','trang = tr + ang','easy','van'),

  Q(1,20106,'single_choice','Màu nào?🍎','["Đỏ","Xanh","Vàng"]','Đỏ','Táo màu đỏ','easy','tu_vung'),
  Q(1,20106,'single_choice','Trời có màu gì? ☀️🌤️','["Xanh","Đỏ","Đen"]','Xanh','Trời xanh','easy','tu_vung'),
  Q(1,20106,'true_false','Chuối chín có màu vàng đúng hay sai?','["Đúng","Sai"]','Đúng','Chuối chín = vàng','easy','tu_vung'),

  Q(1,20107,'single_choice','Đọc câu nào đúng?','["Con mèo ngủ trên ghế.","con mèo ngủ trên ghế","Con mèo ngủ trên ghế"]','Con mèo ngủ trên ghế.','Câu viết hoa đầu, dấu chấm cuối','easy','doc_hieu'),
  Q(1,20107,'true_false','Đoạn văn thường có nhiều câu đúng hay sai?','["Đúng","Sai"]','Đúng','Đoạn văn = nhiều câu về 1 ý','easy','doc_hieu'),

  Q(1,20108,'single_choice','Câu nào đúng cấu trúc?','["Mèo ngủ.","Ngủ mèo.","Mèo."]','Mèo ngủ.','CN + VN: Mèo (ai) + ngủ (làm gì)','easy','ngu_phap'),
  Q(1,20108,'true_false','Câu phải có chữ cái đầu viết hoa đúng hay sai?','["Đúng","Sai"]','Đúng','Chữ đầu câu luôn viết hoa','easy','ngu_phap'),

  Q(1,20109,'single_choice','Tranh 1: em bé cười. Tranh 2: em bé chơi. Tranh 3: em bé ngủ. Đúng thứ tự?','["1→2→3","3→1→2","2→3→1"]','1→2→3','Theo thứ tự sáng → chiều → tối','easy','ke_chuyen'),

  Q(1,20110,'single_choice','Dấu nào kết thúc câu kể?','["Dấu chấm (.)","Dấu phẩy (,)","Dấu hỏi (?)"]','Dấu chấm (.)','Câu kể kết thúc bằng dấu chấm','easy','ngu_phap'),
  Q(1,20110,'single_choice','Dấu phẩy dùng để?','["Tách các ý trong câu","Kết thúc câu","Hỏi"]','Tách các ý trong câu','Phẩy = ngăn cách','easy','ngu_phap'),

  Q(1,20111,'single_choice','Viết đúng: ...ách hay ...ách?','["sách","xách","Cả hai đúng"]','Cả hai đúng','sách = quyển sách, xách = xách tay','medium','chinh_ta'),
  Q(1,20111,'single_choice','Chọn từ đúng: Con ... (sóc hay xóc)?','["sóc","xóc"]','sóc','Con sóc, chứ không phải xóc','medium','chinh_ta'),

  Q(1,20112,'single_choice','Ai là người sinh ra bố?','["Ông","Bố","Anh"]','Ông','Ông = bố của bố','easy','tu_vung'),
  Q(1,20112,'true_false','Anh/chị là người lớn tuổi hơn em đúng hay sai?','["Đúng","Sai"]','Đúng','Anh chị lớn hơn em','easy','tu_vung'),

  Q(1,20113,'single_choice','Thơ có đặc điểm gì?','["Có vần","Rất dài","Không có nhịp"]','Có vần','Thơ = có vần và nhịp','easy','van_hoc'),
  Q(1,20114,'single_choice','Điền: Tôi ... bé Lan. (yêu/yếu)','["yêu","yếu"]','yêu','yêu = thương, yếu = không khỏe','easy','chinh_ta'),
  Q(1,20115,'single_choice','Câu nào đúng chính tả?','["Em đi học.","em đi Học.","Em Đi học"]','Em đi học.','Viết hoa đầu câu + dấu chấm cuối','easy','chinh_ta'),

  // ===== LỚP 2 =====
  Q(2,20116,'single_choice','Từ nào chỉ sự vật?','["Cây","Chạy","Đẹp"]','Cây','Cây = danh từ chỉ sự vật','easy','tu_loai'),
  Q(2,20116,'single_choice','Nhóm từ nào đều chỉ sự vật?','["Bàn, ghế, sách","Bàn, chạy, đỏ"]','Bàn, ghế, sách','Cả 3 đều là danh từ','easy','tu_loai'),
  Q(2,20116,'true_false','"Con mèo" là từ chỉ sự vật đúng hay sai?','["Đúng","Sai"]','Đúng','Mèo = con vật = sự vật','easy','tu_loai'),
  Q(2,20116,'fill_number','Đếm từ chỉ sự vật: bàn, chạy, ghế, đẹp, hoa','','3','Bàn, ghế, hoa = 3 từ','easy','tu_loai'),

  Q(2,20117,'single_choice','Từ nào chỉ hoạt động?','["Nhảy","Bàn","Xanh"]','Nhảy','Nhảy = động từ','easy','tu_loai'),
  Q(2,20117,'single_choice','Em bé đang ... (chạy/đỏ)','["chạy","đỏ"]','chạy','Chạy = hành động','easy','tu_loai'),
  Q(2,20117,'true_false','Từ "ăn" chỉ hoạt động đúng hay sai?','["Đúng","Sai"]','Đúng','Ăn = hoạt động','easy','tu_loai'),

  Q(2,20118,'single_choice','Từ nào chỉ đặc điểm?','["Cao","Đi","Cây"]','Cao','Cao = tính từ đặc điểm','easy','tu_loai'),
  Q(2,20118,'single_choice','Bông hoa rất ... (đẹp/đi)','["đẹp","đi"]','đẹp','Đẹp = đặc điểm','easy','tu_loai'),

  Q(2,20119,'single_choice','Câu "Ai làm gì?" — Chọn câu đúng mẫu:','["Bé đang học bài","Hoa rất đẹp","Trời xanh"]','Bé đang học bài','Bé (ai) + đang học bài (làm gì)','medium','mau_cau'),
  Q(2,20119,'single_choice','Tìm CN trong "Mẹ nấu cơm"?','["Mẹ","nấu","cơm"]','Mẹ','Mẹ = ai?','easy','mau_cau'),

  Q(2,20120,'single_choice','Câu "Ai thế nào?" — Chọn đúng:','["Hoa rất đẹp","Bé đang chạy","Mẹ nấu cơm"]','Hoa rất đẹp','Hoa (ai) + rất đẹp (thế nào)','medium','mau_cau'),
  Q(2,20120,'true_false','"Con mèo rất đáng yêu" là câu "Ai thế nào?" đúng hay sai?','["Đúng","Sai"]','Đúng','Mèo → thế nào → đáng yêu','easy','mau_cau'),

  Q(2,20121,'single_choice','Câu hỏi dùng dấu gì ở cuối?','["Dấu chấm (.)","Dấu chấm hỏi (?)","Dấu chấm than (!)"]','Dấu chấm hỏi (?)','Câu hỏi → dấu ?','easy','dau_cau'),
  Q(2,20121,'single_choice','Câu nào là câu hỏi?','["Bạn tên gì?","Bạn rất vui!","Bạn đang học."]','Bạn tên gì?','Có từ hỏi + dấu ?','easy','dau_cau'),

  Q(2,20122,'single_choice','Câu cảm thán dùng dấu gì?','["Dấu chấm than (!)","Dấu chấm (.)","Dấu phẩy (,)"]','Dấu chấm than (!)','Cảm thán → dấu !','easy','dau_cau'),
  Q(2,20122,'true_false','"Ôi, đẹp quá!" là câu cảm thán đúng hay sai?','["Đúng","Sai"]','Đúng','Có dấu ! = cảm thán','easy','dau_cau'),

  Q(2,20123,'single_choice','Đoạn văn cần có gì?','["Nhiều câu cùng 1 chủ đề","1 câu","Chỉ số"]','Nhiều câu cùng 1 chủ đề','Đoạn văn = nhiều câu cùng ý','medium','tap_lam_van'),
  Q(2,20124,'single_choice','Ý chính của bài là gì?','["Nội dung quan trọng nhất","Chi tiết nhỏ","Câu cuối"]','Nội dung quan trọng nhất','Ý chính = ý quan trọng nhất','medium','doc_hieu'),
  Q(2,20125,'single_choice','Từ trái nghĩa của "to"?','["Nhỏ","Lớn","Cao"]','Nhỏ','To ↔ nhỏ','easy','tu_vung'),
  Q(2,20125,'single_choice','Từ trái nghĩa "dài"?','["Ngắn","Rộng","Cao"]','Ngắn','Dài ↔ ngắn','easy','tu_vung'),

  Q(2,20126,'single_choice','Chọn từ đúng: Con ... (lợn/nợn)?','["lợn","nợn"]','lợn','Con lợn, viết đúng l','medium','chinh_ta'),
  Q(2,20127,'single_choice','Từ đồng nghĩa "đẹp"?','["Xinh","Xấu","Lớn"]','Xinh','Đẹp = xinh','easy','tu_vung'),
  Q(2,20128,'single_choice','Kể chuyện cần có gì?','["Nhân vật + sự việc","Chỉ số liệu","Không cần gì"]','Nhân vật + sự việc','Chuyện = ai + xảy ra gì','easy','ke_chuyen'),
  Q(2,20129,'single_choice','5 + 3 thuộc môn gì?','["Toán","Tiếng Việt","Khoa học"]','Toán','Phép cộng = Toán','easy','tu_vung'),
  Q(2,20130,'single_choice','Từ "cao" và "thấp" là cặp từ gì?','["Trái nghĩa","Đồng nghĩa","Đồng âm"]','Trái nghĩa','Cao ↔ thấp = trái nghĩa','easy','tu_vung'),

  // ===== LỚP 3 =====
  Q(3,20131,'single_choice','Từ ghép là từ có?','["2+ tiếng có nghĩa","1 tiếng","Vần giống nhau"]','2+ tiếng có nghĩa','Từ ghép = ghép tiếng có nghĩa','medium','tu_loai'),
  Q(3,20131,'single_choice','Từ nào là từ ghép?','["Xe đạp","Lung linh","Đẹp"]','Xe đạp','Xe + đạp = 2 tiếng có nghĩa','medium','tu_loai'),
  Q(3,20132,'single_choice','Từ láy là từ có?','["Âm đầu/vần lặp lại","Nghĩa rõ ràng","1 tiếng"]','Âm đầu/vần lặp lại','Từ láy: lung linh, lấp lánh','medium','tu_loai'),
  Q(3,20132,'single_choice','Từ nào là từ láy?','["Lấp lánh","Xe đạp","Bàn ghế"]','Lấp lánh','Láy âm đầu: l-l','medium','tu_loai'),
  Q(3,20133,'single_choice','Danh từ là từ chỉ?','["Người, vật, việc","Hành động","Đặc điểm"]','Người, vật, việc','Diện tích = tên gọi sự vật','medium','tu_loai'),
  Q(3,20134,'single_choice','Động từ là từ chỉ?','["Hành động","Sự vật","Đặc điểm"]','Hành động','ĐT = hành động, trạng thái','medium','tu_loai'),
  Q(3,20135,'single_choice','Tính từ là từ chỉ?','["Đặc điểm, tính chất","Hành động","Sự vật"]','Đặc điểm, tính chất','Tính từ miêu tả đặc điểm','medium','tu_loai'),
  Q(3,20136,'single_choice','"Mắt đen như hạt nhãn" dùng biện pháp gì?','["So sánh","Nhân hóa","Điệp ngữ"]','So sánh','Có từ "như" → so sánh','medium','bien_phap'),
  Q(3,20136,'single_choice','Từ nào dùng để so sánh?','["Như","Và","Nhưng"]','Như','Từ SS: như, giống, tựa','easy','bien_phap'),
  Q(3,20137,'single_choice','"Ông mặt trời" dùng biện pháp gì?','["Nhân hóa","So sánh","Liệt kê"]','Nhân hóa','Gọi mặt trời là "ông" = nhân hóa','medium','bien_phap'),
  Q(3,20138,'single_choice','Thư bắt đầu bằng gì?','["Lời chào","Nội dung chính","Chữ ký"]','Lời chào','VD: Kính gửi ông/bà...','easy','tap_lam_van'),
  Q(3,20139,'single_choice','Bài văn kể chuyện có mấy phần?','["3 (MB-TB-KB)","2","4"]','3 (MB-TB-KB)','Mở bài - Thân bài - Kết bài','medium','tap_lam_van'),
  Q(3,20140,'single_choice','Văn miêu tả cần?','["Quan sát kỹ","Chỉ kể","Tính toán"]','Quan sát kỹ','Tả = nhìn kỹ và viết lại','medium','tap_lam_van'),
  Q(3,20141,'single_choice','Chọn đúng: ... ời (trời/chời)?','["trời","chời"]','trời','Trời = bầu trời','medium','chinh_ta'),
  Q(3,20142,'single_choice','Câu yêu cầu lịch sự dùng từ gì?','["Xin, vui lòng","Phải, ngay"]','Xin, vui lòng','Lịch sự = dùng xin, làm ơn','easy','ngu_phap'),
  Q(3,20143,'single_choice','Cách tìm ý chính?','["Đọc kỹ + tìm câu tóm tắt","Đọc nhanh","Bỏ qua"]','Đọc kỹ + tìm câu tóm tắt','Đọc kỹ rồi chọn ý quan trọng','medium','doc_hieu'),
  Q(3,20144,'single_choice','Ôn: "xinh đẹp" là từ gì?','["Từ ghép","Từ láy","Từ đơn"]','Từ ghép','Xinh + đẹp = 2 tiếng có nghĩa','easy','tu_loai'),
  Q(3,20145,'single_choice','Ôn: Dấu chấm dùng ở đâu?','["Cuối câu kể","Cuối câu hỏi","Giữa câu"]','Cuối câu kể','Câu kể → dấu chấm','easy','dau_cau'),

  // ===== LỚP 4 =====
  Q(4,20146,'single_choice','CN trong câu "Bé Lan hát rất hay"?','["Bé Lan","hát","rất hay"]','Bé Lan','Ai hát? → Bé Lan = CN','medium','ngu_phap'),
  Q(4,20146,'single_choice','VN trong câu "Mẹ nấu cơm"?','["Mẹ","nấu cơm","cơm"]','nấu cơm','Mẹ làm gì? → nấu cơm = VN','medium','ngu_phap'),
  Q(4,20147,'single_choice','Trạng ngữ trả lời câu hỏi?','["Khi nào? Ở đâu?","Ai?","Làm gì?"]','Khi nào? Ở đâu?','Tự nhiên = thời gian, địa điểm','medium','ngu_phap'),
  Q(4,20147,'single_choice','"Sáng nay" trong câu "Sáng nay, bé đi học" là?','["Trạng ngữ","Chủ ngữ","Vị ngữ"]','Trạng ngữ','Khi nào? → Sáng nay = Tự nhiên','medium','ngu_phap'),
  Q(4,20148,'single_choice','Câu ghép có bao nhiêu vế câu?','["Từ 2 vế trở lên","1 vế","0"]','Từ 2 vế trở lên','Câu ghép = 2+ vế câu','medium','ngu_phap'),
  Q(4,20149,'single_choice','Từ "chân" trong "chân bàn" và "chân người" là?','["Từ nhiều nghĩa","Từ đồng âm","Từ đồng nghĩa"]','Từ nhiều nghĩa','Cùng gốc nghĩa = từ nhiều nghĩa','medium','tu_vung'),
  Q(4,20150,'single_choice','"Nhanh như chớp" là gì?','["Thành ngữ","Từ ghép","Câu hỏi"]','Thành ngữ','Cụm từ cố định = thành ngữ','medium','tu_vung'),
  Q(4,20151,'single_choice','Dấu ngoặc kép dùng khi?','["Trích lời nói trực tiếp","Kết câu","Liệt kê"]','Trích lời nói trực tiếp','\"...\" = lời nói trực tiếp','easy','dau_cau'),
  Q(4,20152,'single_choice','Đoạn nghị luận cần có?','["Ý kiến + lý do","Chỉ kể chuyện","Chỉ tả"]','Ý kiến + lý do','NL = nêu ý kiến + chứng minh','hard','tap_lam_van'),
  Q(4,20153,'single_choice','Tóm tắt văn bản là?','["Rút gọn ý chính","Chép lại toàn bộ","Viết thêm"]','Rút gọn ý chính','Tóm tắt = giữ ý chính','medium','doc_hieu'),
  Q(4,20154,'single_choice','Tả người cần tả những gì?','["Ngoại hình + tính cách","Chỉ tên","Chỉ tuổi"]','Ngoại hình + tính cách','Hình dáng → khuôn mặt → tính cách','medium','tap_lam_van'),
  Q(4,20155,'single_choice','Tả cảnh theo thứ tự nào?','["Xa→gần hoặc trên→dưới","Ngẫu nhiên","Không cần"]','Xa→gần hoặc trên→dưới','Tả cảnh = theo trình tự','medium','tap_lam_van'),
  Q(4,20156,'single_choice','"Học sinh" là từ gì?','["Hán Việt","Thuần Việt","Từ láy"]','Hán Việt','Học + sinh = gốc Hán','medium','tu_vung'),
  Q(4,20157,'single_choice','Từ "tuy nhiên" dùng để?','["Nối 2 câu đối lập","Liệt kê","Kết thúc"]','Nối 2 câu đối lập','Tuy nhiên = contrast','medium','ngu_phap'),
  Q(4,20158,'single_choice','Suy luận từ bài đọc nghĩa là?','["Tìm ý ẩn sau lời văn","Chỉ đọc to","Ghi chép"]','Tìm ý ẩn sau lời văn','Suy luận = hiểu ý ngầm','hard','doc_hieu'),
  Q(4,20159,'single_choice','Ôn: "Lung linh" là từ gì?','["Từ láy","Từ ghép","Từ đơn"]','Từ láy','Láy vần: l-l','easy','tu_loai'),
  Q(4,20160,'single_choice','Ôn: VN trong "Trời rất đẹp"?','["rất đẹp","Trời","đẹp"]','rất đẹp','Trời thế nào? → rất đẹp','easy','ngu_phap'),

  // ===== LỚP 5 =====
  Q(5,20161,'single_choice','Câu đơn có mấy cụm CN-VN?','["1","2","3"]','1','Câu đơn = 1 CN + 1 VN','medium','ngu_phap'),
  Q(5,20161,'single_choice','Câu nào là câu phức?','["Trời mưa nên em ở nhà","Em đi học","Hoa rất đẹp"]','Trời mưa nên em ở nhà','Có 2 vế: trời mưa + em ở nhà','medium','ngu_phap'),
  Q(5,20162,'single_choice','Đại từ là từ?','["Thay thế danh từ","Chỉ hành động","Chỉ đặc điểm"]','Thay thế danh từ','Tôi, bạn, nó = đại từ','medium','tu_loai'),
  Q(5,20162,'single_choice','Từ nào là đại từ?','["Họ","Bàn","Đẹp"]','Họ','Họ = đại từ nhân xưng','easy','tu_loai'),
  Q(5,20163,'single_choice','Quan hệ từ "vì...nên" nối vế câu?','["Nguyên nhân-kết quả","Đối lập","Giả thiết"]','Nguyên nhân-kết quả','Vì A nên B = A gây ra B','medium','ngu_phap'),
  Q(5,20163,'single_choice','"Nếu...thì" thể hiện quan hệ gì?','["Giả thiết-kết quả","Nguyên nhân","Tương phản"]','Giả thiết-kết quả','Nếu A thì B = giả thiết','medium','ngu_phap'),
  Q(5,20164,'single_choice','Ẩn dụ là?','["So sánh ngầm","Nhân hóa","Liệt kê"]','So sánh ngầm','Ẩn dụ = SS không dùng từ "như"','hard','bien_phap'),
  Q(5,20164,'single_choice','"Thuyền về nước lại" — "thuyền" ẩn dụ cho?','["Người đi","Tàu thuyền","Nước"]','Người đi','Thuyền = người ra đi','hard','bien_phap'),
  Q(5,20165,'single_choice','Văn kể chuyện sáng tạo cần?','["Tưởng tượng + cốt truyện","Chép lại","Chỉ tả"]','Tưởng tượng + cốt truyện','Sáng tạo = nghĩ ra câu chuyện','hard','tap_lam_van'),
  Q(5,20166,'single_choice','Thuyết trình cần gì?','["Nói to, rõ ràng","Nói nhỏ","Đọc sách"]','Nói to, rõ ràng','Thuyết trình = trình bày rõ','easy','ky_nang'),
  Q(5,20167,'single_choice','Báo cáo cần có?','["Tiêu đề + nội dung + kết luận","Chỉ tên","Chỉ số"]','Tiêu đề + nội dung + kết luận','Cấu trúc báo cáo đầy đủ','medium','tap_lam_van'),
  Q(5,20168,'single_choice','Phân tích tác phẩm = ?','["Tìm thông điệp + biện pháp","Chỉ đọc","Chỉ kể"]','Tìm thông điệp + biện pháp','Phân tích = hiểu sâu','hard','doc_hieu'),
  Q(5,20169,'single_choice','Nghị luận xã hội bàn về?','["Vấn đề cuộc sống","Công thức toán","Thí nghiệm"]','Vấn đề cuộc sống','NLXH = vấn đề xã hội','hard','tap_lam_van'),
  Q(5,20170,'true_false','Tiếng Việt có 6 thanh điệu đúng hay sai?','["Đúng","Sai"]','Đúng','Ngang, huyền, sắc, hỏi, ngã, nặng','easy','kien_thuc'),
  Q(5,20171,'single_choice','Chọn từ đúng: s hay x? ...inh đẹp','["xinh","sinh"]','xinh','Xinh đẹp, không phải sinh đẹp','medium','chinh_ta'),
  Q(5,20172,'single_choice','Từ đồng âm: "đường" trong "đường đi" và "đường ăn"?','["Đồng âm","Nhiều nghĩa","Đồng nghĩa"]','Đồng âm','2 nghĩa khác gốc = đồng âm','medium','tu_vung'),
  Q(5,20173,'single_choice','Thơ lục bát mỗi cặp có?','["Câu 6 + câu 8","Câu 7 + câu 7","Câu 5 + câu 5"]','Câu 6 + câu 8','Lục bát = 6 chữ + 8 chữ','medium','van_hoc'),
  Q(5,20174,'single_choice','Ôn: Từ "tuy...nhưng" thể hiện QH?','["Tương phản","Nguyên nhân","Giả thiết"]','Tương phản','Tuy A nhưng B = đối lập','easy','ngu_phap'),
  Q(5,20175,'single_choice','Ôn cuối cấp: Câu "Ai là gì?" dùng để?','["Giới thiệu","Kể","Tả"]','Giới thiệu','Ai là gì = nêu định nghĩa','easy','ngu_phap'),
];
