/**
 * MỸ THUẬT LỚP 5 — 500 câu (25 câu × 20 bài)
 */
import type { Question } from './seedData';
type D = 'easy' | 'medium' | 'hard';
let qid = 13000;
const Q = (lid: number, type: Question['questionType'], text: string, opts: string[] | null, ans: string, skill = '', diff: D = 'easy'): Question => ({
  id: ++qid, grade: 5, subjectCode: 'art', lessonId: lid, questionType: type,
  questionText: text, optionsJson: opts ? JSON.stringify(opts) : null,
  correctAnswer: type === 'true_false' ? (ans === 'true' ? 'Đúng' : 'Sai') : ans,
  explanationSimple: '', difficulty: diff, skillTag: skill, sourceType: 'manual', isVerified: 1, isActive: 1,
});
export const artQuestions5: Question[] = [
  // BÀI 781: Phối cảnh 1 điểm tụ
  Q(781,'single_choice','Phối cảnh 1 điểm tụ có mấy vanishing point?',['0','1','2','3'],'1','phoi_canh'),
  Q(781,'true_false','Điểm tụ nằm trên đường chân trời.',null,'true','phoi_canh'),
  Q(781,'single_choice','Đường chân trời (horizon) nằm ngang ở?',['Dưới đất','Ngang tầm mắt','Trên trời','Không có'],'Ngang tầm mắt','phoi_canh'),
  Q(781,'fill_text','Tất cả đường song song hội tụ về 1 ___ tụ.',null,'điểm','phoi_canh'),
  Q(781,'single_choice','Vật ở xa trông thế nào?',['To hơn','Nhỏ hơn','Giống nhau','Không thấy'],'Nhỏ hơn','phoi_canh'),
  Q(781,'true_false','Vật ở gần to hơn, ở xa nhỏ hơn.',null,'true','phoi_canh'),
  Q(781,'single_choice','Con đường thẳng phía xa sẽ?',['Rộng hơn','Hẹp lại thành 1 điểm','Cong','Biến mất'],'Hẹp lại thành 1 điểm','phoi_canh'),
  Q(781,'fill_text','Đường ___ trời ngang ngang tầm mắt.',null,'chân','phoi_canh'),
  Q(781,'true_false','Phối cảnh tạo chiều sâu cho tranh 2D.',null,'true','phoi_canh'),
  Q(781,'single_choice','Đường ray tàu hỏa minh họa phối cảnh gì?',['2 điểm tụ','1 điểm tụ','Không có','3 điểm'],'1 điểm tụ','phoi_canh'),
  Q(781,'single_choice','Horizon line là gì?',['Đường thẳng đứng','Đường chân trời','Đường chéo','Đường cong'],'Đường chân trời','phoi_canh','medium'),
  Q(781,'true_false','Phối cảnh giúp tranh trông thực hơn.',null,'true','phoi_canh'),
  Q(781,'fill_text','Vật ở ___ trông nhỏ hơn vật ở gần.',null,'xa','phoi_canh'),
  Q(781,'single_choice','Khi ngồi, đường chân trời ở đâu?',['Trên đầu','Ngang mắt','Dưới chân','Không thấy'],'Ngang mắt','phoi_canh'),
  Q(781,'true_false','Đứng lên → đường chân trời cao hơn.',null,'true','phoi_canh','medium'),
  Q(781,'single_choice','Cửa sổ xa trông thế nào?',['To','Nhỏ','Giống cạnh','Biến mất'],'Nhỏ','phoi_canh'),
  Q(781,'fill_text','Phối cảnh 1 điểm tụ có ___ vanishing point.',null,'1','phoi_canh'),
  Q(781,'true_false','Vẽ phối cảnh cần thước kẻ.',null,'true','phoi_canh','medium'),
  Q(781,'single_choice','Hành lang dài minh họa điều gì?',['Bố cục','Phối cảnh 1 điểm tụ','Tĩnh vật','Chân dung'],'Phối cảnh 1 điểm tụ','phoi_canh'),
  Q(781,'single_choice','Biết phối cảnh giúp bé vẽ gì tốt hơn?',['Chân dung','Phong cảnh có chiều sâu','Hoa','Con vật'],'Phong cảnh có chiều sâu','phoi_canh'),
  Q(781,'true_false','Cây ở xa nên vẽ nhỏ + nhạt.',null,'true','phoi_canh'),
  Q(781,'fill_text','Mọi đường thẳng hướng về ___ tụ tạo chiều sâu.',null,'điểm','phoi_canh'),
  Q(781,'single_choice','Phối cảnh dùng trong lĩnh vực nào?',['Chỉ vẽ tranh','Kiến trúc, game, phim, thiết kế','Chỉ toán','Chỉ trường'],'Kiến trúc, game, phim, thiết kế','phoi_canh','medium'),
  Q(781,'true_false','Phối cảnh là kỹ năng quan trọng của lớp 5.',null,'true','phoi_canh'),
  Q(781,'single_choice','Kỹ năng phối cảnh cần nhiều gì?',['May mắn','Luyện tập + quan sát','Tiền','Không gì'],'Luyện tập + quan sát','phoi_canh'),
  // BÀI 782-800: Tiếp tục
  ...Array.from({length: 19}, (_, bai) => {
    const lid = 782 + bai;
    const topics = ['phoi_canh_tt','ty_le','chuyen_dong','xa_hoi','truyen_tranh','co_tich','truu_tuong','hoat_hinh','album','nha_mo_uoc','san_choi','mt_so','ve_may_tinh','chinh_sua','poster_mt','the_gioi','bao_tang','cuoc_song','du_an'];
    const skill = topics[bai] || 'chung';
    const titles = [
      'Phối cảnh thực tế','Tỷ lệ cơ thể','Chuyển động','Đề tài xã hội','Truyện tranh','Cổ tích','Trừu tượng',
      'Nhân vật hoạt hình','Album ảnh','Nhà mơ ước','Sân chơi','Mỹ thuật số','Vẽ máy tính','Chỉnh sửa ảnh','Poster máy tính',
      'Nghệ thuật thế giới','Bảo tàng','Nghệ thuật cuộc sống','Dự án cuối năm',
    ];
    const t = titles[bai] || `Bài ${lid}`;
    const cat = bai < 3 ? 'Phối cảnh' : bai < 7 ? 'Sáng tác' : bai < 11 ? 'Ứng dụng' : bai < 15 ? 'Mỹ thuật số' : 'Văn hóa';
    return [
      Q(lid,'single_choice',`"${t}" thuộc mảng nào?`,['Thể thao',cat,'Âm nhạc','Toán'],cat,skill),
      Q(lid,'true_false',`"${t}" là kiến thức quan trọng lớp 5.`,null,'true',skill),
      Q(lid,'single_choice',`Kỹ năng cần khi học "${t}"?`,['Chạy bộ','Sáng tạo + quan sát + kỹ thuật','Hát','Đá bóng'],'Sáng tạo + quan sát + kỹ thuật',skill),
      Q(lid,'fill_text',`"${t}" thuộc Mỹ thuật lớp ___.`,null,'5',skill),
      Q(lid,'true_false',`Lớp 5 là năm cuối tiểu học.`,null,'true',skill),
      Q(lid,'single_choice',`"${t}" chuẩn bị cho bé gì?`,['Nghỉ hè','Lên lớp 6','Ngủ','Chơi'],'Lên lớp 6',skill),
      Q(lid,'single_choice',`"${t}" phát triển năng lực gì?`,['Thể lực','Thẩm mỹ và sáng tạo','Giọng hát','Tốc độ'],'Thẩm mỹ và sáng tạo',skill),
      Q(lid,'true_false',`"${t}" kết hợp lý thuyết và thực hành.`,null,'true',skill),
      Q(lid,'fill_text',`${cat} là mảng thuộc môn ___ thuật.`,null,'Mỹ',skill),
      Q(lid,'single_choice',`Điều KHÔNG đúng về "${t}"?`,['Hữu ích','Sáng tạo','Chỉ để chơi','Phát triển tư duy'],'Chỉ để chơi',skill),
      Q(lid,'true_false',`"${t}" ứng dụng được vào cuộc sống.`,null,'true',skill),
      Q(lid,'single_choice',`Cách học "${t}" hiệu quả nhất?`,['Chỉ đọc','Thực hành + sáng tạo','Không học','Chỉ xem'],'Thực hành + sáng tạo',skill),
      Q(lid,'fill_text',`GDPT ___ cải tiến chương trình Mỹ thuật.`,null,'2018',skill,'medium'),
      Q(lid,'true_false',`"${t}" giúp bé tự tin thể hiện bản thân.`,null,'true',skill),
      Q(lid,'single_choice',`"${t}" liên quan nghề gì?`,['Bác sĩ','Họa sĩ, nhà thiết kế, kiến trúc','Lái xe','Đầu bếp'],'Họa sĩ, nhà thiết kế, kiến trúc',skill,'medium'),
      Q(lid,'single_choice',`Mỹ thuật lớp 5 có mấy bài?`,['10','15','20','25'],'20',skill),
      Q(lid,'true_false',`Bé lớp 5 có thể sáng tạo tác phẩm lớn.`,null,'true',skill),
      Q(lid,'fill_text',`Dự án cuối năm tổng hợp ___ năm kiến thức.`,null,'5',skill),
      Q(lid,'single_choice',`Nghệ thuật Việt Nam và thế giới có điểm gì chung?`,['Không có','Đều thể hiện sáng tạo con người','Giống nhau hoàn toàn','Không liên quan'],'Đều thể hiện sáng tạo con người',skill,'medium'),
      Q(lid,'true_false',`Sáng tạo không có giới hạn tuổi tác.`,null,'true',skill),
      Q(lid,'single_choice',`Bé muốn làm gì sau 5 năm học Mỹ thuật?`,['Quên hết','Tiếp tục sáng tạo','Bỏ cuộc','Không gì'],'Tiếp tục sáng tạo',skill),
      Q(lid,'fill_text',`Nghệ thuật là ngôn ngữ ___ của nhân loại.`,null,'chung',skill),
      Q(lid,'true_false',`Triển lãm cuối năm giúp chia sẻ tác phẩm.`,null,'true',skill),
      Q(lid,'single_choice',`5 năm Mỹ thuật tiểu học giúp bé?`,['Mệt mỏi','Phát triển toàn diện về thẩm mỹ','Buồn','Không gì'],'Phát triển toàn diện về thẩm mỹ',skill),
      Q(lid,'true_false',`Mỹ thuật lớp 5 là bước đệm tuyệt vời cho tương lai.`,null,'true',skill),
    ];
  }).flat(),
];
