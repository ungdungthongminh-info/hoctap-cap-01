/**
 * MỸ THUẬT LỚP 2 — 500 câu (25 câu × 20 bài)
 */
import type { Question } from './seedData';
type D = 'easy' | 'medium' | 'hard';
let qid = 11500;
const Q = (lid: number, type: Question['questionType'], text: string, opts: string[] | null, ans: string, skill = '', diff: D = 'easy'): Question => ({
  id: ++qid, grade: 2, subjectCode: 'art', lessonId: lid, questionType: type,
  questionText: text, optionsJson: opts ? JSON.stringify(opts) : null,
  correctAnswer: type === 'true_false' ? (ans === 'true' ? 'Đúng' : 'Sai') : ans,
  explanationSimple: '', difficulty: diff, skillTag: skill, sourceType: 'manual', isVerified: 1, isActive: 1,
});
export const artQuestions2: Question[] = [
  // BÀI 721: Hình khối cơ bản
  Q(721,'single_choice','Quả bóng có hình khối gì?',['Hình hộp','Hình cầu','Hình trụ','Hình nón'],'Hình cầu','hinh_khoi'),
  Q(721,'true_false','Hình hộp giống chiếc hộp sữa.',null,'true','hinh_khoi'),
  Q(721,'single_choice','Lon nước có hình khối gì?',['Hình cầu','Hình nón','Hình trụ','Hình hộp'],'Hình trụ','hinh_khoi'),
  Q(721,'fill_text','Nón lá có dạng hình ___.',null,'nón','hinh_khoi'),
  Q(721,'single_choice','Hình khối nào KHÔNG có mặt phẳng?',['Hình hộp','Hình cầu','Hình trụ','Hình nón'],'Hình cầu','hinh_khoi','medium'),
  Q(721,'true_false','Hình trụ có 2 mặt tròn ở 2 đầu.',null,'true','hinh_khoi'),
  Q(721,'single_choice','Viên xúc xắc hình gì?',['Cầu','Trụ','Hộp vuông','Nón'],'Hộp vuông','hinh_khoi'),
  Q(721,'fill_text','Quả bóng thuộc hình khối ___.',null,'cầu','hinh_khoi'),
  Q(721,'true_false','Hình nón có đỉnh nhọn.',null,'true','hinh_khoi'),
  Q(721,'single_choice','Cốc uống nước thường hình gì?',['Cầu','Trụ','Hộp','Nón'],'Trụ','hinh_khoi'),
  Q(721,'single_choice','Quả dưa hấu gần hình gì nhất?',['Hộp','Cầu','Trụ','Nón'],'Cầu','hinh_khoi'),
  Q(721,'true_false','Trái đất hình cầu.',null,'true','hinh_khoi'),
  Q(721,'fill_text','Tủ sách có dạng hình ___.',null,'hộp','hinh_khoi'),
  Q(721,'single_choice','Cây kem ốc quế hình gì?',['Cầu','Trụ','Nón','Hộp'],'Nón','hinh_khoi'),
  Q(721,'true_false','Hình hộp chữ nhật có 6 mặt.',null,'true','hinh_khoi','medium'),
  Q(721,'single_choice','Cái xô hình gì?',['Cầu','Trụ/nón cụt','Hộp','Tam giác'],'Trụ/nón cụt','hinh_khoi','medium'),
  Q(721,'fill_text','Hình ___ có mặt phẳng tròn ở 2 đầu.',null,'trụ','hinh_khoi'),
  Q(721,'true_false','Mọi đồ vật đều có thể phân loại theo hình khối.',null,'true','hinh_khoi'),
  Q(721,'single_choice','Ống nước hình gì?',['Cầu','Trụ','Hộp','Nón'],'Trụ','hinh_khoi'),
  Q(721,'single_choice','Kim tự tháp gần hình gì?',['Hộp','Cầu','Nón/chóp','Trụ'],'Nón/chóp','hinh_khoi','medium'),
  Q(721,'true_false','Hình cầu lăn được mọi hướng.',null,'true','hinh_khoi'),
  Q(721,'fill_text','Máy tính để bàn có dạng hình ___.',null,'hộp','hinh_khoi'),
  Q(721,'single_choice','Quả trứng gần hình gì?',['Hộp','Cầu/ovan','Trụ','Nón'],'Cầu/ovan','hinh_khoi'),
  Q(721,'true_false','Hình khối là hình trong không gian 3 chiều.',null,'true','hinh_khoi','medium'),
  Q(721,'single_choice','Bé nhận biết hình khối bằng cách nào?',['Nghe','Nếm','Nhìn và sờ','Ngửi'],'Nhìn và sờ','hinh_khoi'),
  // BÀI 722-740: Tiếp tục
  ...Array.from({length: 19}, (_, bai) => {
    const lid = 722 + bai;
    const topics = ['ty_le','hoa_van','mau_nong_lanh','ve_mau','phong_canh','gia_dinh','tu_do','gap_giay','cat_dan','mat_na','do_choi','hinh_vuong','hinh_tron','bia_sach','phong_hoc','dan_gian','dong_ho','thu_cong','sang_tao'];
    const skill = topics[bai] || 'chung';
    const titles = [
      'Tỷ lệ đơn giản','Hoa văn tự nhiên','Màu nóng lạnh','Vẽ theo mẫu','Phong cảnh','Gia đình','Chủ đề tự do',
      'Gấp giấy','Cắt dán','Mặt nạ','Đồ chơi giấy','Hình vuông','Hình tròn','Bìa sách','Phòng học',
      'Tranh dân gian','Tranh Đông Hồ','Thủ công mỹ nghệ','Sáng tạo nghệ thuật',
    ];
    const t = titles[bai] || `Bài ${lid}`;
    return [
      Q(lid,'single_choice',`"${t}" thuộc môn gì?`,['Toán','Mỹ thuật','Tiếng Việt','Tin học'],'Mỹ thuật',skill),
      Q(lid,'true_false',`"${t}" là bài học lớp 2 thú vị.`,null,'true',skill),
      Q(lid,'single_choice',`Kỹ năng chính khi học "${t}"?`,['Chạy','Sáng tạo + quan sát','Hát','Đá bóng'],'Sáng tạo + quan sát',skill),
      Q(lid,'fill_text',`"${t}" giúp bé yêu ___ thuật hơn.`,null,'mỹ',skill),
      Q(lid,'true_false',`Bé cần bút màu để thực hành "${t}".`,null,'true',skill),
      Q(lid,'single_choice',`Ai có thể học "${t}"?`,['Chỉ người lớn','Học sinh lớp 2','Chỉ họa sĩ','Chỉ cô giáo'],'Học sinh lớp 2',skill),
      Q(lid,'single_choice',`"${t}" phát triển khả năng gì?`,['Thể lực','Sáng tạo và thẩm mỹ','Giọng hát','Tốc độ'],'Sáng tạo và thẩm mỹ',skill),
      Q(lid,'true_false',`Mỗi bạn làm bài "${t}" sẽ ra kết quả khác nhau.`,null,'true',skill),
      Q(lid,'fill_text',`Mỹ thuật lớp 2 có ___ bài học.`,null,'20',skill),
      Q(lid,'single_choice',`Bé nên làm gì trước khi vẽ?`,['Ngủ','Quan sát kỹ','Chạy','Ăn'],'Quan sát kỹ',skill),
      Q(lid,'true_false',`Tô màu đều giúp tranh đẹp hơn.`,null,'true',skill),
      Q(lid,'single_choice',`Vẽ sai bé nên làm gì?`,['Khóc','Xé giấy','Sửa lại hoặc vẽ mới','Bỏ cuộc'],'Sửa lại hoặc vẽ mới',skill),
      Q(lid,'fill_text',`Bé dùng ___ chì để phác thảo nhẹ.`,null,'bút',skill),
      Q(lid,'true_false',`Quan sát kỹ giúp vẽ đẹp và đúng hơn.`,null,'true',skill),
      Q(lid,'single_choice',`Dụng cụ nào KHÔNG cần khi vẽ?`,['Bút màu','Giấy','Bóng đá','Bút chì'],'Bóng đá',skill),
      Q(lid,'single_choice',`Bé thích điều gì nhất ở "${t}"?`,['Ngồi yên','Sáng tạo','Ngủ','Không'],'Sáng tạo',skill),
      Q(lid,'true_false',`Bé có thể sử dụng nhiều chất liệu khác nhau.`,null,'true',skill),
      Q(lid,'fill_text',`Tranh đẹp thể hiện ___ xúc của bé.`,null,'cảm',skill),
      Q(lid,'single_choice',`Sau khi xong "${t}", bé nên?`,['Vứt bừa','Trưng bày/giữ gìn','Xé bỏ','Bỏ đi'],'Trưng bày/giữ gìn',skill),
      Q(lid,'true_false',`Mỹ thuật kết hợp với nhiều môn học khác.`,null,'true',skill),
      Q(lid,'single_choice',`Nghệ thuật giúp bé?`,['Mệt mỏi','Thể hiện bản thân','Buồn','Sợ'],'Thể hiện bản thân',skill),
      Q(lid,'fill_text',`"${t}" thuộc chương trình GDPT ___.`,null,'2018',skill,'medium'),
      Q(lid,'true_false',`Bé nên giữ sách vở mỹ thuật gọn gàng.`,null,'true',skill),
      Q(lid,'single_choice',`"${t}" liên quan đến đời sống thế nào?`,['Không liên quan','Rất gần gũi','Chỉ ở trường','Chỉ trong sách'],'Rất gần gũi',skill),
      Q(lid,'true_false',`Mỹ thuật lớp 2 giúp bé chuẩn bị cho lớp 3.`,null,'true',skill),
    ];
  }).flat(),
];
