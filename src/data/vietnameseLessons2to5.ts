/**
 * TIẾNG VIỆT LỚP 2-5 — 80 bài (20 bài/lớp, GDPT 2018)
 * G2: Đọc hiểu, Viết câu, Chính tả, Luyện từ, Kể chuyện
 * G3: Đọc-hiểu văn bản, Viết đoạn-bài, Luyện từ-câu, Tập làm văn, Kể chuyện
 * G4: Đọc hiểu nâng cao, Viết bài, Ngữ pháp, Tập làm văn, Văn hóa đọc
 * G5: Đọc hiểu phân tích, Viết bài dài, Ngữ pháp, Tập làm văn, Ôn tập
 */
import { Lesson } from './seedData';

/* ---------- GRADE 2 (L121-140) ---------- */
let sid = 120;
const L2 = (
  unit: string, code: string, title: string, obj: string, summary: string,
  tips: string, diff: 'easy' | 'medium' | 'hard', mins: number,
): Lesson => ({
  id: ++sid, grade: 2, subjectCode: 'vietnamese', unitCode: unit,
  lessonCode: code, title, objective: obj, summarySimple: summary, tips,
  difficulty: diff, estimatedMinutes: mins, status: 'ready', sortOrder: sid - 120, isActive: 1,
});

export const vietnameseLessons2: Lesson[] = [
  // C1: Đọc hiểu (4 bài)
  L2('C1','TV2-01','Đọc bài văn ngắn','Đọc trôi chảy bài văn ngắn 50-80 từ','Tập đọc bài văn ngắn, hiểu nội dung chính','Đọc chậm rõ ràng, chỉ tay theo dòng','easy',8),
  L2('C1','TV2-02','Trả lời câu hỏi','Trả lời câu hỏi về nội dung bài đọc','Đọc bài, trả lời ai-cái gì-ở đâu-khi nào','Hướng dẫn bé đọc câu hỏi trước khi đọc bài','easy',8),
  L2('C1','TV2-03','Tìm ý chính','Tìm ý chính của đoạn văn đơn giản','Nhận ra ý chính, phân biệt ý phụ','Hỏi bé "Bài này nói về cái gì?"','medium',10),
  L2('C1','TV2-04','Đọc diễn cảm','Đọc diễn cảm phù hợp nội dung','Đọc to-nhỏ, nhanh-chậm theo cảm xúc nhân vật','Cho bé đóng vai nhân vật khi đọc','medium',10),
  // C2: Viết câu (4 bài)
  L2('C2','TV2-05','Viết câu đơn','Viết câu đơn hoàn chỉnh: Ai - Làm gì','Câu đơn có đủ chủ ngữ và vị ngữ','Dùng tranh để bé tập đặt câu','easy',8),
  L2('C2','TV2-06','Câu kể, hỏi, cảm','Phân biệt câu kể, câu hỏi, câu cảm thán','Dấu chấm (.), chấm hỏi (?), chấm than (!)','Cho bé nhận diện dấu câu trong bài đọc','medium',10),
  L2('C2','TV2-07','Dấu chấm và phẩy','Sử dụng đúng dấu chấm, dấu phẩy','Dấu chấm kết thúc câu, dấu phẩy ngăn cách','Khi đọc to, dấu chấm nghỉ dài, phẩy nghỉ ngắn','easy',8),
  L2('C2','TV2-08','Viết đoạn văn ngắn','Viết đoạn văn 3-5 câu về chủ đề cho sẵn','Viết đoạn văn có mở-thân-kết đơn giản','Cho bé vẽ trước, rồi viết miêu tả bức tranh','medium',12),
  // C3: Chính tả (4 bài)
  L2('C3','TV2-09','Phân biệt l/n','Viết đúng chính tả l/n','l: lá, lúa, lớn | n: nắng, nhà, năm','Cho bé đọc to nhiều lần để phân biệt','medium',8),
  L2('C3','TV2-10','Phân biệt s/x','Viết đúng chính tả s/x','s: sao, sông, sách | x: xanh, xe, xinh','Nhắc bé ghi nhớ từ hay sai','medium',8),
  L2('C3','TV2-11','Phân biệt ch/tr','Viết đúng chính tả ch/tr','ch: cha, chơi, chăm | tr: trăng, trường, trái','Luyện qua bài tập điền ch/tr','medium',10),
  L2('C3','TV2-12','Nghe viết','Nghe và viết đúng đoạn văn 30-40 từ','Nghe đọc từng câu, viết lại chính xác','Đọc chậm, rõ ràng, nhắc lại 2 lần','easy',10),
  // C4: Luyện từ (4 bài)
  L2('C4','TV2-13','Từ chỉ sự vật','Nhận biết từ chỉ sự vật (danh từ)','Từ chỉ người, con vật, đồ vật, cây cối','Cho bé chỉ đồ vật quanh nhà và đặt tên','easy',8),
  L2('C4','TV2-14','Từ chỉ hoạt động','Nhận biết từ chỉ hoạt động (động từ)','Từ chỉ hành động: chạy, nhảy, ăn, ngủ','Cho bé diễn tả hành động bằng cử chỉ','easy',8),
  L2('C4','TV2-15','Từ trái nghĩa','Hiểu và tìm từ trái nghĩa','Nóng-lạnh, to-nhỏ, dài-ngắn, nhanh-chậm','Chơi trò "nói ngược" với bé','medium',8),
  L2('C4','TV2-16','Mở rộng vốn từ','Mở rộng vốn từ theo chủ đề','Nhóm từ: gia đình, trường học, thiên nhiên','Đọc sách ngoại khóa để tăng vốn từ','medium',10),
  // C5: Kể chuyện (4 bài)
  L2('C5','TV2-17','Kể theo tranh','Kể chuyện dựa vào tranh minh họa','Quan sát tranh, sắp xếp tranh, kể lại','Hỏi bé: tranh 1 có gì? Rồi chuyện gì xảy ra?','easy',10),
  L2('C5','TV2-18','Kể theo gợi ý','Kể chuyện theo câu hỏi gợi ý','Ai? Ở đâu? Làm gì? Kết quả?','Cho bé trả lời từng câu hỏi, ghép thành chuyện','medium',10),
  L2('C5','TV2-19','Kể sáng tạo','Thêm chi tiết sáng tạo khi kể','Giữ cốt truyện, thêm lời thoại, cảm xúc','Khuyến khích bé: "Nếu là con, con sẽ làm gì?"','medium',12),
  L2('C5','TV2-20','Kể chuyện tập thể','Kể chuyện nối tiếp cùng bạn','Mỗi bạn kể 1 đoạn, nối thành chuyện','Đây là bài luyện kỹ năng giao tiếp xã hội','medium',12),
];

/* ---------- GRADE 3 (L141-160) ---------- */
sid = 140;
const L3 = (
  unit: string, code: string, title: string, obj: string, summary: string,
  tips: string, diff: 'easy' | 'medium' | 'hard', mins: number,
): Lesson => ({
  id: ++sid, grade: 3, subjectCode: 'vietnamese', unitCode: unit,
  lessonCode: code, title, objective: obj, summarySimple: summary, tips,
  difficulty: diff, estimatedMinutes: mins, status: 'ready', sortOrder: sid - 140, isActive: 1,
});

export const vietnameseLessons3: Lesson[] = [
  // C1: Đọc-hiểu văn bản (4 bài)
  L3('C1','TV3-01','Văn bản tự sự','Đọc hiểu văn bản kể chuyện','Nhận biết nhân vật, sự kiện, diễn biến câu chuyện','Hỏi bé: Ai? Làm gì? Tại sao? Kết quả?','easy',10),
  L3('C1','TV3-02','Văn bản miêu tả','Đọc hiểu văn bản miêu tả','Nhận ra đối tượng miêu tả, đặc điểm nổi bật','Cho bé gạch chân từ miêu tả','medium',10),
  L3('C1','TV3-03','Văn bản thông tin','Đọc hiểu văn bản thông tin đơn giản','Tìm thông tin chính: ai, cái gì, khi nào, ở đâu','Dùng sơ đồ tóm tắt thông tin','medium',12),
  L3('C1','TV3-04','Đọc phân tích','Phân tích nội dung, ý nghĩa bài đọc','Nêu bài học rút ra từ câu chuyện','Thảo luận: Bé thích điều gì nhất trong bài?','hard',12),
  // C2: Viết (4 bài)
  L3('C2','TV3-05','Viết đoạn văn kể','Viết đoạn văn kể chuyện 5-7 câu','Mở bài-thân bài-kết bài, kể theo trình tự','Dùng từ nối: đầu tiên, sau đó, cuối cùng','easy',12),
  L3('C2','TV3-06','Viết đoạn văn tả','Viết đoạn văn miêu tả 5-7 câu','Tả hình dáng, màu sắc, hoạt động','Quan sát kỹ trước khi viết','medium',12),
  L3('C2','TV3-07','Viết thư ngắn','Viết thư ngắn gửi người thân, bạn bè','Phần đầu thư, nội dung, phần kết','Mẫu thư: Bạn thân mến, ... Chúc bạn khỏe','medium',12),
  L3('C2','TV3-08','Chữa lỗi viết','Nhận biết và sửa lỗi chính tả, ngữ pháp','Tìm lỗi sai về dấu câu, chính tả, câu thiếu','Đọc lại bài viết 2 lần trước khi nộp','medium',10),
  // C3: Luyện từ-câu (4 bài)
  L3('C3','TV3-09','Danh từ, Động từ, Tính từ','Phân loại danh từ, động từ, tính từ','Danh từ: người/vật | ĐT: hành động | Tính từ: tính chất','Dùng bảng phân loại từ cho bé tập','easy',10),
  L3('C3','TV3-10','So sánh','Sử dụng biện pháp so sánh','So sánh: như, tựa như, giống như','VD: Mắt em đen như hạt nhãn','medium',10),
  L3('C3','TV3-11','Nhân hóa','Sử dụng biện pháp nhân hóa','Gán hành động/tính cách người cho vật','VD: Ông mặt trời tỏa nắng ấm','medium',10),
  L3('C3','TV3-12','Câu đơn mở rộng','Mở rộng câu đơn bằng trạng ngữ','Thêm thời gian, địa điểm, nguyên nhân vào câu','VD: Sáng nay, em đi học rất sớm.','medium',12),
  // C4: Tập làm văn (4 bài)
  L3('C4','TV3-13','Kể về gia đình','Viết bài văn kể về gia đình','Giới thiệu thành viên, nét đặc biệt, tình cảm','Cho bé kể miệng trước, viết sau','easy',15),
  L3('C4','TV3-14','Tả con vật','Viết bài văn tả con vật yêu thích','Tả hình dáng, màu lông, hoạt động, tính cách','Quan sát con vật thật hoặc qua video','medium',15),
  L3('C4','TV3-15','Viết nhật ký','Viết 1 trang nhật ký về 1 ngày đặc biệt','Ngày tháng, sự kiện, cảm xúc','Khuyến khích bé viết nhật ký mỗi tối','medium',12),
  L3('C4','TV3-16','Viết tự giới thiệu','Viết đoạn giới thiệu bản thân','Tên, tuổi, sở thích, ước mơ','Cho bé đứng trước gương tập giới thiệu','easy',10),
  // C5: Kể chuyện (4 bài)
  L3('C5','TV3-17','Kể chuyện đã đọc','Kể lại câu chuyện đã nghe/đọc','Nhớ cốt truyện, nhân vật, kết thúc','Đọc truyện ít nhất 2 lần trước khi kể','easy',10),
  L3('C5','TV3-18','Kể chuyện trải nghiệm','Kể về trải nghiệm thực tế của bản thân','Chọn sự kiện đáng nhớ, kể theo trình tự','Hỏi: Chuyện gì xảy ra? Con cảm thấy sao?','medium',12),
  L3('C5','TV3-19','Kể chuyện sáng tạo','Sáng tạo câu chuyện dựa trên gợi ý','Đặt nhân vật vào tình huống mới','Cho bé chọn 3 từ ngẫu nhiên → sáng tác','hard',12),
  L3('C5','TV3-20','Thi kể chuyện','Kể chuyện trước nhóm, giọng diễn cảm','Kể to, rõ, diễn cảm, có cử chỉ','Quay video bé kể để bé tự đánh giá','medium',12),
];

/* ---------- GRADE 4 (L161-180) ---------- */
sid = 160;
const L4 = (
  unit: string, code: string, title: string, obj: string, summary: string,
  tips: string, diff: 'easy' | 'medium' | 'hard', mins: number,
): Lesson => ({
  id: ++sid, grade: 4, subjectCode: 'vietnamese', unitCode: unit,
  lessonCode: code, title, objective: obj, summarySimple: summary, tips,
  difficulty: diff, estimatedMinutes: mins, status: 'ready', sortOrder: sid - 160, isActive: 1,
});

export const vietnameseLessons4: Lesson[] = [
  // C1: Đọc hiểu nâng cao (4 bài)
  L4('C1','TV4-01','Phân tích nhân vật','Phân tích tính cách nhân vật qua hành động, lời nói','Nhân vật nghĩ gì, làm gì, tại sao?','So sánh hành động nhân vật với thực tế','medium',12),
  L4('C1','TV4-02','Ý nghĩa câu chuyện','Tìm ý nghĩa, bài học từ câu chuyện','Thông điệp tác giả muốn gửi gắm','Hỏi: Tại sao tác giả viết bài này?','medium',12),
  L4('C1','TV4-03','Đọc thơ','Đọc hiểu bài thơ, cảm nhận vần điệu','Vần, nhịp, hình ảnh thơ, cảm xúc','Đọc thơ theo nhịp, chú ý vần','medium',12),
  L4('C1','TV4-04','Văn bản khoa học','Đọc hiểu văn bản khoa học thường thức','Thông tin chính, số liệu, kết luận','Gạch chân từ khóa, số liệu quan trọng','hard',15),
  // C2: Viết bài (4 bài)
  L4('C2','TV4-05','Bài văn kể chuyện','Viết bài văn kể chuyện 10-15 câu','Mở bài-thân bài-kết bài hoàn chỉnh','Lập dàn ý trước: ai, ở đâu, chuyện gì','medium',15),
  L4('C2','TV4-06','Bài văn miêu tả','Viết bài miêu tả chi tiết đồ vật/cảnh','Tả từ xa→gần hoặc từ bao quát→chi tiết','Dùng giác quan: nhìn, nghe, sờ, ngửi','medium',15),
  L4('C2','TV4-07','Viết thư','Viết thư gửi bạn bè, thầy cô','Mẫu thư chính thức: xưng hô, nội dung, lời chào','Cho bé viết thư thật gửi cho ai đó','medium',12),
  L4('C2','TV4-08','Viết báo cáo','Viết báo cáo ngắn về hoạt động','Tên hoạt động, thời gian, kết quả, nhận xét','Mẫu báo cáo: Mục đích, Nội dung, Kết quả','hard',15),
  // C3: Ngữ pháp (4 bài)
  L4('C3','TV4-09','Chủ ngữ - Vị ngữ','Xác định chủ ngữ, vị ngữ trong câu','CN trả lời Ai/Cái gì, VN trả lời Làm gì/Thế nào','Gạch 1 gạch dưới CN, 2 gạch dưới VN','easy',10),
  L4('C3','TV4-10','Câu ghép','Nhận biết và tạo câu ghép','Nối 2 vế câu bằng: và, nhưng, vì, nên','VD: Trời mưa nên em mang ô.','medium',12),
  L4('C3','TV4-11','Trạng ngữ','Thêm trạng ngữ chỉ thời gian, nơi chốn','TN đứng đầu câu, ngăn cách bằng dấu phẩy','VD: Sáng nay, em đến trường sớm.','medium',12),
  L4('C3','TV4-12','Dấu câu nâng cao','Sử dụng dấu hai chấm, dấu ngoặc kép','Dấu : trước lời nói. Dấu "" đánh dấu lời nói','VD: Mẹ nói: "Con giỏi lắm!"','medium',10),
  // C4: Tập làm văn (4 bài)
  L4('C4','TV4-13','Miêu tả cây cối','Viết bài tả cây cối quen thuộc','Tả thân, lá, hoa, quả, ích lợi','Quan sát cây thật, vẽ trước khi viết','medium',15),
  L4('C4','TV4-14','Miêu tả con vật','Viết bài tả con vật chi tiết','Hình dáng, bộ lông, thói quen, tình cảm','Cho bé quan sát con vật qua video/thực tế','medium',15),
  L4('C4','TV4-15','Miêu tả cảnh đẹp','Viết bài tả cảnh đẹp quê hương','Trình tự: xa→gần, trên→dưới, trái→phải','Dùng tranh ảnh để gợi ý','hard',15),
  L4('C4','TV4-16','Miêu tả người','Viết bài tả người thân hoặc bạn bè','Ngoại hình, tính cách, hành động đặc trưng','Bắt đầu bằng người bé yêu quý nhất','medium',15),
  // C5: Văn hóa đọc (4 bài)
  L4('C5','TV4-17','Đọc sách ngoại khóa','Đọc và nhận xét 1 cuốn sách','Tên sách, tác giả, nội dung chính, cảm nhận','Cho bé chọn sách mình thích','easy',15),
  L4('C5','TV4-18','Tóm tắt văn bản','Tóm tắt nội dung văn bản 3-5 câu','Giữ ý chính, bỏ chi tiết phụ','Hỏi: Nếu kể cho bạn, con nói gì?','medium',12),
  L4('C5','TV4-19','Nhận xét nhân vật','Nêu ý kiến về nhân vật trong truyện','Nhân vật tốt/xấu? Tại sao? Con có đồng ý?','Tôn trọng ý kiến riêng của bé','medium',12),
  L4('C5','TV4-20','Trình bày ý kiến','Trình bày ý kiến cá nhân về vấn đề đơn giản','Nêu ý kiến, lý do, ví dụ minh họa','Luyện: "Em nghĩ... vì..."','hard',15),
];

/* ---------- GRADE 5 (L181-200) ---------- */
sid = 180;
const L5 = (
  unit: string, code: string, title: string, obj: string, summary: string,
  tips: string, diff: 'easy' | 'medium' | 'hard', mins: number,
): Lesson => ({
  id: ++sid, grade: 5, subjectCode: 'vietnamese', unitCode: unit,
  lessonCode: code, title, objective: obj, summarySimple: summary, tips,
  difficulty: diff, estimatedMinutes: mins, status: 'ready', sortOrder: sid - 180, isActive: 1,
});

export const vietnameseLessons5: Lesson[] = [
  // C1: Đọc hiểu phân tích (4 bài)
  L5('C1','TV5-01','Phân tích ý nghĩa','Phân tích ý nghĩa sâu sắc của văn bản','Thông điệp ẩn giấu, bài học nhân văn','Đọc nhiều lần, mỗi lần tìm 1 lớp nghĩa','medium',15),
  L5('C1','TV5-02','Phong cách ngôn ngữ','Nhận biết phong cách ngôn ngữ văn bản','Ngôn ngữ kể, tả, biểu cảm, thông tin','So sánh 2 đoạn văn khác phong cách','hard',15),
  L5('C1','TV5-03','So sánh văn bản','So sánh 2 văn bản cùng chủ đề','Điểm giống-khác về nội dung, cách viết','Dùng bảng Venn để so sánh','hard',15),
  L5('C1','TV5-04','Đánh giá văn bản','Đánh giá và nêu quan điểm cá nhân','Đồng ý/không đồng ý, giải thích lý do','Tôn trọng mọi quan điểm, lý luận logic','hard',15),
  // C2: Viết bài dài (4 bài)
  L5('C2','TV5-05','Văn tự sự','Viết bài văn tự sự 15-20 câu','Kể sự việc theo trình tự, có cảm xúc','Lập dàn ý trước: mở-thân-kết','medium',18),
  L5('C2','TV5-06','Nghị luận đơn giản','Viết đoạn nghị luận 8-10 câu','Nêu ý kiến, đưa lý lẽ và dẫn chứng','Mẫu: Ý kiến → Lý do 1 → Lý do 2 → Kết luận','hard',18),
  L5('C2','TV5-07','Văn thuyết minh','Viết bài thuyết minh về sự vật/hiện tượng','Giới thiệu, đặc điểm, ích lợi','Tra cứu thông tin trước khi viết','hard',18),
  L5('C2','TV5-08','Văn biểu cảm','Viết bài văn biểu cảm về người/vật','Thể hiện tình cảm, cảm xúc chân thực','Viết từ trái tim, dùng hình ảnh so sánh','hard',15),
  // C3: Ngữ pháp (4 bài)
  L5('C3','TV5-09','Câu phức','Nhận biết, tạo câu phức có nhiều vế','Câu có từ liên kết: khi, nếu, tuy, mặc dù','VD: Mặc dù trời mưa nhưng em vẫn đi học','medium',12),
  L5('C3','TV5-10','Liên kết câu và đoạn','Sử dụng phép liên kết trong đoạn văn','Lặp từ, thay thế, nối, liên tưởng','Đọc lại đoạn, kiểm tra sự liên kết','medium',12),
  L5('C3','TV5-11','Đại từ và Quan hệ từ','Sử dụng đại từ, quan hệ từ đúng','Đại từ: tôi, nó | QHT: và, nhưng, vì, nên','Thay thế danh từ bằng đại từ để tránh lặp','medium',12),
  L5('C3','TV5-12','Ôn tập ngữ pháp','Ôn tập toàn bộ kiến thức ngữ pháp','Danh từ, ĐT, Tính từ, CN-VN, TN, câu ghép, câu phức','Làm bài tập tổng hợp phân loại câu','medium',15),
  // C4: Tập làm văn (4 bài)
  L5('C4','TV5-13','Tả cảnh','Viết bài văn tả cảnh thiên nhiên','Tả theo trình tự thời gian hoặc không gian','Dùng 5 giác quan, ví von sinh động','medium',18),
  L5('C4','TV5-14','Tả người','Viết bài văn tả người thật chi tiết','Ngoại hình, tính cách, lời nói, hành động','Chọn nét đặc trưng nhất của người tả','medium',18),
  L5('C4','TV5-15','Viết thuyết trình','Chuẩn bị và trình bày thuyết trình ngắn','Chủ đề, dàn ý, phần trình bày 3-5 phút','Luyện nói trước gương, hẹn giờ','hard',18),
  L5('C4','TV5-16','Viết sáng tạo','Sáng tác truyện ngắn hoặc bài thơ','Tự do sáng tạo nhân vật, cốt truyện','Không giới hạn trí tưởng tượng','hard',15),
  // C5: Ôn tập cuối cấp (4 bài)
  L5('C5','TV5-17','Ôn đọc hiểu','Ôn tập kỹ năng đọc hiểu','Đọc, phân tích, so sánh, đánh giá','Đọc nhiều thể loại: truyện, thơ, thông tin','easy',15),
  L5('C5','TV5-18','Ôn viết','Ôn tập kỹ năng viết bài','Kể, tả, nghị luận, thuyết minh, biểu cảm','Viết theo dàn ý, tự sửa bài','medium',15),
  L5('C5','TV5-19','Ôn ngữ pháp','Ôn tập toàn bộ ngữ pháp cấp 1','Từ loại, câu, dấu câu, biện pháp tu từ','Làm đề thi mẫu','medium',15),
  L5('C5','TV5-20','Tổng ôn cuối cấp','Tổng ôn kiến thức Tiếng Việt cấp 1','Tổng hợp đọc hiểu, viết, ngữ pháp','Luyện đề thi cuối cấp','medium',18),
];
