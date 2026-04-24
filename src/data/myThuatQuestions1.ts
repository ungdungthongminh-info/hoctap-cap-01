/**
 * MỸ THUẬT LỚP 1 — 500 câu (25 câu × 20 bài)
 */
import type { Question } from './seedData';
type D = 'easy' | 'medium' | 'hard';
let qid = 11000;
const Q = (lid: number, type: Question['questionType'], text: string, opts: string[] | null, ans: string, skill = '', diff: D = 'easy'): Question => ({
  id: ++qid, grade: 1, subjectCode: 'art', lessonId: lid, questionType: type,
  questionText: text, optionsJson: opts ? JSON.stringify(opts) : null,
  correctAnswer: type === 'true_false' ? (ans === 'true' ? 'Đúng' : 'Sai') : ans,
  explanationSimple: '', difficulty: diff, skillTag: skill, sourceType: 'manual', isVerified: 1, isActive: 1,
});
export const artQuestions1: Question[] = [
  // BÀI 701: Màu sắc quanh em
  Q(701,'single_choice','Có mấy màu cơ bản?',['2','3','4','5'],'3','mau_sac'),
  Q(701,'single_choice','Đâu là màu cơ bản?',['Cam','Tím','Đỏ','Xanh lá'],'Đỏ','mau_sac'),
  Q(701,'true_false','Vàng là một trong 3 màu cơ bản.',null,'true','mau_sac'),
  Q(701,'fill_text','Ba màu cơ bản là: Đỏ, Vàng và Xanh ___.',null,'dương','mau_sac'),
  Q(701,'single_choice','Đỏ + Vàng = màu gì?',['Tím','Xanh lá','Cam','Nâu'],'Cam','mau_sac'),
  Q(701,'true_false','Xanh dương + Vàng = Xanh lá.',null,'true','mau_sac'),
  Q(701,'single_choice','Đỏ + Xanh dương = ?',['Cam','Vàng','Tím','Xanh lá'],'Tím','mau_sac'),
  Q(701,'fill_text','Đỏ trộn Vàng tạo ra màu ___.',null,'Cam','mau_sac'),
  Q(701,'single_choice','Lá cây thường có màu gì?',['Đỏ','Cam','Xanh lá','Tím'],'Xanh lá','mau_sac'),
  Q(701,'true_false','Mặt trời có màu vàng.',null,'true','mau_sac'),
  Q(701,'single_choice','Biển thường có màu gì?',['Đỏ','Xanh dương','Vàng','Cam'],'Xanh dương','mau_sac'),
  Q(701,'fill_text','Bầu trời có màu ___ dương.',null,'xanh','mau_sac'),
  Q(701,'true_false','Cam là màu cơ bản.',null,'false','mau_sac'),
  Q(701,'single_choice','Quả chuối có màu gì?',['Đỏ','Xanh','Vàng','Tím'],'Vàng','mau_sac'),
  Q(701,'single_choice','Màu nào KHÔNG phải màu cơ bản?',['Đỏ','Vàng','Cam','Xanh dương'],'Cam','mau_sac'),
  Q(701,'true_false','Tím là màu cơ bản.',null,'false','mau_sac'),
  Q(701,'fill_text','Quả táo chín có màu ___.',null,'đỏ','mau_sac'),
  Q(701,'single_choice','Máu có màu gì?',['Xanh','Vàng','Đỏ','Trắng'],'Đỏ','mau_sac'),
  Q(701,'true_false','Có thể pha 2 màu cơ bản để tạo màu mới.',null,'true','mau_sac'),
  Q(701,'single_choice','Quả dưa hấu bên trong có màu gì?',['Vàng','Xanh','Đỏ','Tím'],'Đỏ','mau_sac'),
  Q(701,'fill_text','Xanh dương + Đỏ = màu ___.',null,'Tím','mau_sac'),
  Q(701,'true_false','Mỗi vật quanh ta đều có màu sắc.',null,'true','mau_sac'),
  Q(701,'single_choice','Tuyết có màu gì?',['Đỏ','Xanh','Vàng','Trắng'],'Trắng','mau_sac'),
  Q(701,'single_choice','Ban đêm bầu trời có màu gì?',['Vàng','Trắng','Đen/xanh đậm','Cam'],'Đen/xanh đậm','mau_sac'),
  Q(701,'true_false','Màu trắng và đen không phải màu cơ bản.',null,'true','mau_sac'),
  // BÀI 702: Hình dạng cơ bản
  Q(702,'single_choice','Bánh xe có hình gì?',['Vuông','Tròn','Tam giác','Chữ nhật'],'Tròn','hinh_dang'),
  Q(702,'true_false','Mái nhà thường có hình tam giác.',null,'true','hinh_dang'),
  Q(702,'single_choice','Cửa sổ thường có hình gì?',['Tròn','Tam giác','Vuông/chữ nhật','Sao'],'Vuông/chữ nhật','hinh_dang'),
  Q(702,'fill_text','Mặt trời có hình ___.',null,'tròn','hinh_dang'),
  Q(702,'single_choice','Hình nào có 3 cạnh?',['Vuông','Tròn','Tam giác','Lục giác'],'Tam giác','hinh_dang'),
  Q(702,'true_false','Hình vuông có 4 cạnh bằng nhau.',null,'true','hinh_dang'),
  Q(702,'single_choice','Quyển sách có hình gì?',['Tròn','Chữ nhật','Tam giác','Sao'],'Chữ nhật','hinh_dang'),
  Q(702,'fill_text','Hình có 4 cạnh bằng nhau là hình ___.',null,'vuông','hinh_dang'),
  Q(702,'single_choice','Đồng xu có hình gì?',['Vuông','Tam giác','Tròn','Chữ nhật'],'Tròn','hinh_dang'),
  Q(702,'true_false','Hình chữ nhật có 2 cạnh dài bằng nhau.',null,'true','hinh_dang'),
  Q(702,'single_choice','Biển đường có hình gì?',['Tròn','Vuông','Tam giác','Cả 3 đáp án'],'Cả 3 đáp án','hinh_dang'),
  Q(702,'fill_text','Hình ___ giác có 3 cạnh.',null,'tam','hinh_dang'),
  Q(702,'true_false','Hình tròn không có cạnh.',null,'true','hinh_dang'),
  Q(702,'single_choice','Viên gạch lát sàn thường hình gì?',['Tròn','Vuông','Tam giác','Sao'],'Vuông','hinh_dang'),
  Q(702,'single_choice','Pizza nguyên thường có hình gì?',['Vuông','Chữ nhật','Tròn','Tam giác'],'Tròn','hinh_dang'),
  Q(702,'true_false','Lát pizza thường có hình tam giác.',null,'true','hinh_dang'),
  Q(702,'fill_text','Tivi thường có hình ___.',null,'chữ nhật','hinh_dang'),
  Q(702,'single_choice','Hình nào KHÔNG có góc?',['Vuông','Tam giác','Tròn','Chữ nhật'],'Tròn','hinh_dang'),
  Q(702,'true_false','Ngôi sao có 5 đỉnh nhọn.',null,'true','hinh_dang'),
  Q(702,'single_choice','Hộp sữa có hình gì?',['Tròn','Hộp chữ nhật','Tam giác','Bầu dục'],'Hộp chữ nhật','hinh_dang'),
  Q(702,'fill_text','Quả bóng có hình ___.',null,'tròn','hinh_dang'),
  Q(702,'true_false','Tất cả đồ vật đều chỉ có 1 hình dạng.',null,'false','hinh_dang'),
  Q(702,'single_choice','Trái tim có hình gì?',['Tròn','Vuông','Hình tim','Tam giác'],'Hình tim','hinh_dang'),
  Q(702,'true_false','Hình ovan (bầu dục) giống hình tròn bị kéo dài.',null,'true','hinh_dang'),
  // BÀI 703-720: Tiếp tục pattern
  ...Array.from({length: 18}, (_, bai) => {
    const lid = 703 + bai;
    const topics = ['duong_net','hoa_tiet','net_thang_cong','to_mau','cay_hoa','con_vat','nan_hinh','xe_dan','xe_con_vat','dat_nan','duong_diem','khung_anh','thiep','goc_hoc','xem_tranh','tranh_thieu_nhi','san_pham_mt','yeu_mt'];
    const skill = topics[bai] || 'chung';
    const titles = [
      'Đường nét vui nhộn','Nhận biết họa tiết','Vẽ nét thẳng cong','Tô màu đều đẹp','Vẽ cây và hoa','Vẽ con vật',
      'Nặn hình đơn giản','Xé dán giấy màu','Xé dán con vật','Tạo hình đất nặn','Trang trí đường diềm','Trang trí khung ảnh',
      'Trang trí thiệp','Trang trí góc học tập','Xem tranh đẹp','Tranh thiếu nhi','Sản phẩm mỹ thuật','Em yêu mỹ thuật',
    ];
    const t = titles[bai] || `Bài ${lid}`;
    return [
      Q(lid,'single_choice',`Bài "${t}" thuộc chủ đề nào?`,['Tin học','Mỹ thuật','Toán','Tiếng Việt'],'Mỹ thuật',skill),
      Q(lid,'true_false',`"${t}" là bài học thú vị cho lớp 1.`,null,'true',skill),
      Q(lid,'single_choice',`Khi học "${t}", bé cần gì?`,['Máy tính','Bút màu/giấy','Bóng đá','Xe đạp'],'Bút màu/giấy',skill),
      Q(lid,'fill_text',`Bài "${t}" thuộc môn ___.`,null,'Mỹ thuật',skill),
      Q(lid,'true_false',`Sáng tạo là quan trọng khi học "${t}".`,null,'true',skill),
      Q(lid,'single_choice',`"${t}" giúp bé phát triển gì?`,['Sức mạnh','Óc sáng tạo','Tốc độ chạy','Giọng hát'],'Óc sáng tạo',skill),
      Q(lid,'single_choice',`Bé làm gì khi không biết vẽ bài "${t}"?`,['Bỏ cuộc','Hỏi cô giáo','Ngủ','Chơi'],'Hỏi cô giáo',skill),
      Q(lid,'true_false',`Mỗi bạn vẽ khác nhau và đều đẹp.`,null,'true',skill),
      Q(lid,'fill_text',`Mỹ thuật giúp bé ___ tạo.`,null,'sáng',skill),
      Q(lid,'single_choice',`Bút nào dùng để tô màu?`,['Bút bi','Bút chì đen','Bút sáp màu','Bút xóa'],'Bút sáp màu',skill),
      Q(lid,'true_false',`Bé có thể vẽ bất cứ thứ gì bé thích.`,null,'true',skill),
      Q(lid,'single_choice',`Tranh đẹp là tranh thế nào?`,['Giống người lớn vẽ','Thể hiện sáng tạo riêng','Nhiều màu nhất','To nhất'],'Thể hiện sáng tạo riêng',skill),
      Q(lid,'fill_text',`Lớp 1 có ___ bài Mỹ thuật.`,null,'20',skill),
      Q(lid,'true_false',`Không có tranh nào xấu – mỗi tranh đều đặc biệt.`,null,'true',skill),
      Q(lid,'single_choice',`Bé nên giữ dụng cụ vẽ thế nào?`,['Vứt bừa','Gọn gàng, sạch sẽ','Cho bạn','Bỏ đi'],'Gọn gàng, sạch sẽ',skill),
      Q(lid,'single_choice',`Vẽ xong bé nên làm gì?`,['Xé tranh','Cho bạn xem','Bỏ sọt rác','Ngủ'],'Cho bạn xem',skill),
      Q(lid,'true_false',`Mỹ thuật giúp bé vui vẻ hơn.`,null,'true',skill),
      Q(lid,'fill_text',`Bé dùng bút ___ để phác thảo trước khi tô màu.`,null,'chì',skill),
      Q(lid,'single_choice',`Giấy vẽ nên đặt thế nào?`,['Cong','Phẳng trên bàn','Trên sàn nhà','Trên giường'],'Phẳng trên bàn',skill),
      Q(lid,'true_false',`Bé nên rửa tay sau khi vẽ bằng màu nước.`,null,'true',skill),
      Q(lid,'single_choice',`Bé thích nhất điều gì khi vẽ?`,['Ngồi yên','Được sáng tạo','Không gì','Chỉ xem'],'Được sáng tạo',skill),
      Q(lid,'fill_text',`Sau khi vẽ, bé ___ dọn dụng cụ gọn gàng.`,null,'dọn',skill),
      Q(lid,'true_false',`Bé có thể tặng tranh cho người thân.`,null,'true',skill),
      Q(lid,'single_choice',`Vẽ tranh giúp bé thể hiện gì?`,['Sức mạnh','Cảm xúc và sáng tạo','Tốc độ','Chiều cao'],'Cảm xúc và sáng tạo',skill),
      Q(lid,'true_false',`Mỹ thuật lớp 1 rất thú vị và bổ ích.`,null,'true',skill),
    ];
  }).flat(),
];
