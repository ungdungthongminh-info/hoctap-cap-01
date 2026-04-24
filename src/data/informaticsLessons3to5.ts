/**
 * TIN HỌC LỚP 3-4-5 — 60 bài (20 bài/lớp, GDPT 2018)
 * Lớp 3: Làm quen máy tính, phần mềm đơn giản, tư duy logic, an toàn số
 * Lớp 4: Xử lý văn bản, trình chiếu, Internet, Scratch cơ bản
 * Lớp 5: Bảng tính, đa phương tiện, Scratch nâng cao, dự án CNTT
 */
import type { Lesson } from './seedData';

let sid = 0;
const L = (
  grade: number, unit: string, code: string, title: string, obj: string,
  summary: string, tips: string, diff: 'easy' | 'medium' | 'hard', mins: number,
): Lesson => ({
  id: 600 + (++sid), grade, subjectCode: 'informatics', unitCode: unit, lessonCode: code,
  title, objective: obj, summarySimple: summary, tips,
  difficulty: diff, estimatedMinutes: mins, status: 'ready', sortOrder: sid, isActive: 1,
});

// ==================== LỚP 3 (20 bài) ====================
export const informaticsLessons3: Lesson[] = [
  // C1: Máy tính và thiết bị
  L(3,'C1','TH3-01','Làm quen với máy tính','Nhận biết các bộ phận chính của máy tính','Máy tính gồm: màn hình, thân máy, bàn phím, chuột','Cho bé chỉ vào từng bộ phận và gọi tên','easy',10),
  L(3,'C1','TH3-02','Bàn phím và chuột','Biết cách sử dụng bàn phím và chuột cơ bản','Bàn phím để gõ chữ, chuột để di chuyển và nhấp','Tập nhấp chuột trái, phải và kéo thả','easy',10),
  L(3,'C1','TH3-03','Màn hình và biểu tượng','Nhận biết các biểu tượng trên màn hình desktop','Mỗi biểu tượng là một chương trình. Nhấp đúp để mở','Cho bé tìm biểu tượng quen thuộc trên desktop','easy',10),
  L(3,'C1','TH3-04','Bật và tắt máy tính','Biết cách bật và tắt máy tính an toàn','Bật: nhấn nút nguồn. Tắt: Start → Shut Down','Luôn tắt máy đúng cách, không rút điện đột ngột','easy',8),
  // C2: Phần mềm vẽ & soạn thảo
  L(3,'C2','TH3-05','Phần mềm vẽ Paint','Mở Paint và vẽ hình đơn giản','Paint giúp bé vẽ tranh bằng máy tính. Có bút, cọ, tẩy','Chọn màu yêu thích rồi vẽ tự do','easy',12),
  L(3,'C2','TH3-06','Vẽ hình và tô màu','Sử dụng các công cụ hình học trong Paint','Vẽ hình tròn, vuông, tam giác bằng công cụ Shapes','Giữ Shift để vẽ hình vuông hoặc tròn đều','medium',12),
  L(3,'C2','TH3-07','Soạn thảo văn bản','Mở trình soạn thảo và gõ văn bản đơn giản','Bé tập gõ tên mình, tên trường, câu đơn giản','Dùng phần mềm Notepad hoặc Word để tập gõ','easy',12),
  L(3,'C2','TH3-08','Gõ bàn phím tiếng Việt','Gõ tiếng Việt có dấu bằng bộ gõ','Telex: aa=â, ee=ê, ow=ơ, dd=đ. VNI: số sau chữ','Tập gõ tên ba mẹ, địa chỉ nhà bằng tiếng Việt','medium',15),
  // C3: Tư duy logic / thuật toán
  L(3,'C3','TH3-09','Thuật toán là gì?','Hiểu khái niệm thuật toán đơn giản','Thuật toán = các bước rõ ràng để giải quyết một việc','Ví dụ: thuật toán pha sữa = đổ sữa → thêm nước → khuấy','easy',10),
  L(3,'C3','TH3-10','Sơ đồ khối đơn giản','Đọc sơ đồ khối có bước tuần tự','Sơ đồ khối dùng hình để minh họa các bước','Vẽ sơ đồ khối cho việc đánh răng buổi sáng','medium',12),
  L(3,'C3','TH3-11','Lệnh tuần tự','Hiểu lệnh được thực hiện theo thứ tự','Máy tính làm từng bước một: bước 1 → bước 2 → bước 3','Cho bé sắp xếp các bước nấu mì gói theo đúng thứ tự','easy',10),
  L(3,'C3','TH3-12','Giải quyết vấn đề','Áp dụng tư duy thuật toán vào bài toán đơn giản','Xác định vấn đề → Chia nhỏ → Giải từng phần → Kết hợp','Cho bé giải bài toán: tìm đường ngắn nhất trên bản đồ','medium',15),
  // C4: Thông tin và dữ liệu
  L(3,'C4','TH3-13','Thông tin quanh ta','Nhận biết thông tin ở nhiều dạng','Thông tin có thể là: chữ, số, hình ảnh, âm thanh, video','Cho bé kể 5 loại thông tin gặp hàng ngày','easy',10),
  L(3,'C4','TH3-14','Dữ liệu số và dữ liệu chữ','Phân biệt dữ liệu số và dữ liệu chữ','Số: 1, 2, 100. Chữ: tên, địa chỉ. Hình: ảnh chụp','Cho bé phân loại thông tin trong bảng điểm','easy',10),
  L(3,'C4','TH3-15','Tổ chức thư mục','Tạo và đặt tên thư mục','Thư mục giống ngăn tủ — mỗi ngăn chứa 1 loại tệp','Tạo thư mục "Bài tập" trên Desktop cùng bé','medium',12),
  L(3,'C4','TH3-16','Lưu và mở tệp','Biết cách lưu tệp và mở lại','Save (Ctrl+S) để lưu. Open để mở tệp đã lưu','Luôn đặt tên tệp rõ ràng: "bai_tap_toan_bai1"','easy',10),
  // C5: An toàn và đạo đức số
  L(3,'C5','TH3-17','Internet là gì?','Hiểu khái niệm Internet cơ bản','Internet = mạng kết nối máy tính trên toàn thế giới','Hỏi bé: "Con dùng Internet để làm gì?"','easy',10),
  L(3,'C5','TH3-18','An toàn trên mạng','Biết các nguy hiểm cơ bản trên Internet','Không chia sẻ thông tin cá nhân, không nhấp link lạ','Dạy bé: nếu thấy gì lạ → nói ba mẹ ngay','easy',10),
  L(3,'C5','TH3-19','Bảo vệ thông tin cá nhân','Hiểu tầm quan trọng của thông tin cá nhân','Tên, địa chỉ, số điện thoại, ảnh là thông tin riêng tư','Không ai được hỏi mật khẩu — kể cả bạn bè','medium',10),
  L(3,'C5','TH3-20','Ứng xử văn minh trên mạng','Biết cách ứng xử tốt trên Internet','Lịch sự, không nói xấu, không chia sẻ ảnh người khác','Online cũng cần lịch sự như ngoài đời thật','easy',10),
];

// ==================== LỚP 4 (20 bài) ====================
export const informaticsLessons4: Lesson[] = [
  // C1: Xử lý văn bản
  L(4,'C1','TH4-01','Giao diện Word','Nhận biết các thành phần giao diện Word','Thanh tiêu đề, Ribbon, vùng soạn thảo, thanh trạng thái','Cho bé khám phá từng tab trên Ribbon','easy',10),
  L(4,'C1','TH4-02','Định dạng văn bản','Thay đổi phông, cỡ chữ, màu, đậm/nghiêng','Bold (B), Italic (I), Underline (U), Font size, Font color','Phím tắt: Ctrl+B=đậm, Ctrl+I=nghiêng','medium',12),
  L(4,'C1','TH4-03','Chèn hình ảnh','Chèn ảnh vào văn bản','Insert → Pictures → chọn ảnh → điều chỉnh kích thước','Kéo góc ảnh để thay đổi kích thước giữ tỉ lệ','medium',12),
  L(4,'C1','TH4-04','Tạo bảng đơn giản','Tạo và chỉnh sửa bảng trong Word','Insert → Table → chọn số hàng × cột','Dùng bảng để trình bày: thời khóa biểu, danh sách','medium',15),
  // C2: Trình chiếu
  L(4,'C2','TH4-05','PowerPoint cơ bản','Tạo bài trình chiếu đơn giản','Mỗi slide = 1 trang. Thêm tiêu đề, nội dung, hình ảnh','Mỗi slide chỉ nên có 3-5 ý ngắn','easy',12),
  L(4,'C2','TH4-06','Thêm hình và màu','Trang trí slide bằng hình ảnh và màu nền','Design → chọn mẫu. Insert → hình ảnh, clip art','Chọn màu nền tối → chữ sáng, hoặc ngược lại','medium',12),
  L(4,'C2','TH4-07','Hiệu ứng chuyển slide','Thêm hiệu ứng hoạt hình cho slide','Transitions → chọn kiểu chuyển. Animations → hiệu ứng','Không dùng quá nhiều hiệu ứng — chọn 1-2 kiểu thống nhất','medium',12),
  L(4,'C2','TH4-08','Trình bày bài thuyết trình','Thực hành trình bày bài thuyết trình','F5 để chạy trình chiếu. Nói to rõ ràng, nhìn khán giả','Tập trước gương hoặc quay video để tự đánh giá','medium',15),
  // C3: Internet & Tìm kiếm
  L(4,'C3','TH4-09','Trình duyệt web','Biết dùng trình duyệt để truy cập trang web','Gõ địa chỉ vào thanh URL. Bookmarks để lưu trang hay','Chrome, Firefox, Edge là các trình duyệt phổ biến','easy',10),
  L(4,'C3','TH4-10','Tìm kiếm thông tin','Tìm kiếm hiệu quả trên Google','Gõ từ khóa ngắn gọn, chọn kết quả phù hợp','Thêm "cho trẻ em" sau từ khóa để tìm nội dung phù hợp','easy',12),
  L(4,'C3','TH4-11','Email cơ bản','Hiểu email và cách gửi email đơn giản','Email = thư điện tử. Cần: địa chỉ người nhận, tiêu đề, nội dung','Luôn kiểm tra tên người nhận trước khi gửi','medium',12),
  L(4,'C3','TH4-12','An toàn Internet nâng cao','Nhận biết lừa đảo, virus trên mạng','Không tải file lạ, không tin quảng cáo "trúng thưởng"','Nếu nhận email lạ → hỏi ba mẹ, không mở link','medium',12),
  // C4: Lập trình Scratch cơ bản
  L(4,'C4','TH4-13','Giới thiệu Scratch','Khám phá giao diện Scratch','Scratch có: sân khấu (stage), nhân vật (sprite), khối lệnh (blocks)','Kéo thả khối lệnh = viết chương trình','easy',12),
  L(4,'C4','TH4-14','Di chuyển nhân vật','Lập trình cho nhân vật di chuyển','Dùng khối: move, turn, go to. Mũi tên để điều khiển','Click cờ xanh để chạy chương trình','easy',12),
  L(4,'C4','TH4-15','Vòng lặp trong Scratch','Dùng lệnh lặp để nhân vật lặp hành động','repeat 10 = làm 10 lần. forever = làm mãi mãi','Vòng lặp giúp viết ít lệnh hơn mà làm nhiều hơn','medium',15),
  L(4,'C4','TH4-16','Tạo trò chơi đơn giản','Lập trình game bắt bóng trong Scratch','Nhân vật di chuyển theo chuột, bóng rơi từ trên xuống','Thêm biến "điểm" để đếm số bóng bắt được','hard',15),
  // C5: Đạo đức số
  L(4,'C5','TH4-17','Bản quyền phần mềm','Hiểu về bản quyền và phần mềm hợp pháp','Phần mềm do người khác tạo ra, có bản quyền','Dùng phần mềm miễn phí hoặc mua bản quyền','easy',10),
  L(4,'C5','TH4-18','Thời gian sử dụng máy tính','Quản lý thời gian dùng máy tính hợp lý','Nghỉ mắt 20 phút/lần. Tối đa 1-2 giờ/ngày cho trẻ em','Quy tắc 20-20-20: cứ 20 phút nhìn xa 20 feet trong 20 giây','easy',10),
  L(4,'C5','TH4-19','Tôn trọng trên mạng','Ứng xử tôn trọng với mọi người trên Internet','Không bắt nạt trên mạng (cyberbullying). Báo người lớn nếu bị bắt nạt','Nhớ: đằng sau mỗi tài khoản là một con người thật','medium',10),
  L(4,'C5','TH4-20','Tổng kết Tin học 4','Ôn tập kiến thức tin học lớp 4','Word, PowerPoint, Internet, Scratch — 4 kỹ năng quan trọng','Thực hành là cách tốt nhất để nhớ lâu','easy',12),
];

// ==================== LỚP 5 (20 bài) ====================
export const informaticsLessons5: Lesson[] = [
  // C1: Bảng tính
  L(5,'C1','TH5-01','Giới thiệu bảng tính','Nhận biết giao diện bảng tính Excel/Calc','Bảng tính gồm: ô (cell), hàng (row), cột (column)','Ô A1 = cột A, hàng 1. Click vào ô để nhập dữ liệu','easy',10),
  L(5,'C1','TH5-02','Nhập dữ liệu vào ô','Nhập số, chữ vào bảng tính','Nhấp vào ô → gõ dữ liệu → Enter. Tab để sang ô kế','Số căn phải, chữ căn trái — đó là mặc định','easy',12),
  L(5,'C1','TH5-03','Công thức tính toán','Viết công thức đơn giản: cộng, trừ, nhân, chia','=A1+B1 (cộng), =A1*B1 (nhân), =SUM(A1:A5) (tổng)','Công thức luôn bắt đầu bằng dấu =','medium',15),
  L(5,'C1','TH5-04','Biểu đồ từ dữ liệu','Tạo biểu đồ cột, tròn từ dữ liệu','Chọn dữ liệu → Insert → Chart → chọn kiểu biểu đồ','Biểu đồ cột so sánh, biểu đồ tròn thể hiện tỉ lệ','medium',15),
  // C2: Đa phương tiện
  L(5,'C2','TH5-05','Xử lý ảnh cơ bản','Cắt, xoay, điều chỉnh ảnh đơn giản','Crop (cắt), Rotate (xoay), Resize (thay đổi kích thước)','Dùng Paint hoặc Photos để chỉnh ảnh','easy',12),
  L(5,'C2','TH5-06','Tạo poster','Thiết kế poster đơn giản bằng phần mềm','Kết hợp: hình ảnh + chữ lớn + màu sắc hài hòa','Chọn 2-3 màu chính, chữ to dễ đọc','medium',15),
  L(5,'C2','TH5-07','Quay và biên tập video','Quay video ngắn và chỉnh sửa đơn giản','Quay video → cắt bỏ phần thừa → thêm tiêu đề','Giữ máy ổn định, ánh sáng đủ, âm thanh rõ','medium',15),
  L(5,'C2','TH5-08','Bài thuyết trình đa phương tiện','Kết hợp văn bản, hình, video trong trình chiếu','Slide đẹp = ít chữ + nhiều hình + video minh họa','Mỗi slide tối đa 3 ý chính','medium',15),
  // C3: Lập trình Scratch nâng cao
  L(5,'C3','TH5-09','Biến trong Scratch','Hiểu và sử dụng biến để lưu dữ liệu','Biến = hộp chứa giá trị. VD: điểm, mạng, tốc độ','Đặt tên biến rõ ràng: "diem", "mang", "toc_do"','medium',15),
  L(5,'C3','TH5-10','Điều kiện if-else','Lập trình rẽ nhánh: nếu...thì...nếu không','if touching edge → bounce. if score > 10 → next level','Rẽ nhánh giúp chương trình "quyết định" theo tình huống','medium',15),
  L(5,'C3','TH5-11','Tạo game nhiều cấp độ','Lập trình trò chơi với nhiều level','Level 1 chậm → Level 2 nhanh hơn → Level 3 nhiều vật cản','Dùng biến "level" và tăng độ khó theo level','hard',18),
  L(5,'C3','TH5-12','Kể chuyện bằng Scratch','Tạo câu chuyện hoạt hình với nhiều nhân vật','Mỗi nhân vật có thoại riêng, di chuyển, đổi trang phục','Dùng "broadcast" để đồng bộ các nhân vật','hard',18),
  // C4: Dự án CNTT
  L(5,'C4','TH5-13','Lập kế hoạch dự án','Biết cách lập kế hoạch cho dự án CNTT','Bước 1: Chọn đề tài → 2: Tìm tài liệu → 3: Thiết kế → 4: Thực hiện','Làm bảng kế hoạch: việc cần làm + thời gian + người phụ trách','easy',12),
  L(5,'C4','TH5-14','Thu thập thông tin','Tìm kiếm và chọn lọc thông tin cho dự án','Tìm trên Internet, sách, phỏng vấn. Ghi chú nguồn tham khảo','Luôn kiểm tra thông tin từ 2-3 nguồn khác nhau','medium',12),
  L(5,'C4','TH5-15','Thiết kế sản phẩm số','Tạo sản phẩm: poster/trình chiếu/video cho dự án','Kết hợp Word + PowerPoint + hình ảnh + video','Chia nhóm, mỗi bạn phụ trách 1 phần','medium',15),
  L(5,'C4','TH5-16','Trình bày dự án','Thuyết trình và bảo vệ sản phẩm CNTT','Giới thiệu → Nội dung → Kết luận. Trả lời câu hỏi','Nói chậm, rõ ràng, nhìn vào khán giả','medium',15),
  // C5: Công dân số
  L(5,'C5','TH5-17','Dấu chân số','Hiểu dấu chân số (digital footprint)','Mọi hoạt động online đều để lại dấu vết — mãi mãi','Nghĩ kỹ trước khi đăng: "10 năm sau mình có muốn thấy lại không?"','easy',10),
  L(5,'C5','TH5-18','Bảo mật mật khẩu','Tạo mật khẩu mạnh và bảo vệ tài khoản','Mật khẩu tốt: dài ≥ 8 ký tự, có chữ HOA, thường, số, ký tự đặc biệt','Không dùng tên, ngày sinh. Mỗi tài khoản 1 mật khẩu riêng','medium',10),
  L(5,'C5','TH5-19','Sử dụng CNTT có trách nhiệm','Hiểu trách nhiệm khi sử dụng công nghệ','Không sao chép bài, tôn trọng bản quyền, kiểm chứng thông tin','Trích dẫn nguồn khi dùng thông tin của người khác','medium',10),
  L(5,'C5','TH5-20','Tổng kết Tin học 5','Ôn tập toàn bộ kiến thức tin học lớp 5','Bảng tính, đa phương tiện, Scratch nâng cao, dự án, công dân số','Tin học giúp bé học tập và sáng tạo hiệu quả hơn','easy',12),
];
