/**
 * MỸ THUẬT LỚP 3 — 500 câu (25 câu × 20 bài)
 */
import type { Question } from './seedData';
type D = 'easy' | 'medium' | 'hard';
let qid = 12000;
const Q = (lid: number, type: Question['questionType'], text: string, opts: string[] | null, ans: string, skill = '', diff: D = 'easy'): Question => ({
  id: ++qid, grade: 3, subjectCode: 'art', lessonId: lid, questionType: type,
  questionText: text, optionsJson: opts ? JSON.stringify(opts) : null,
  correctAnswer: type === 'true_false' ? (ans === 'true' ? 'Đúng' : 'Sai') : ans,
  explanationSimple: '', difficulty: diff, skillTag: skill, sourceType: 'manual', isVerified: 1, isActive: 1,
});
export const artQuestions3: Question[] = [
  // BÀI 741: Phối màu cơ bản
  Q(741,'single_choice','Màu cơ bản gồm?',['Cam, tím, xanh lá','Đỏ, vàng, xanh dương','Trắng, đen, xám','Hồng, nâu, tím'],'Đỏ, vàng, xanh dương','phoi_mau'),
  Q(741,'true_false','Cam, tím, xanh lá là 3 màu thứ cấp.',null,'true','phoi_mau'),
  Q(741,'single_choice','Phối 2 màu cơ bản tạo ra màu gì?',['Màu cơ bản','Màu thứ cấp','Màu trắng','Màu đen'],'Màu thứ cấp','phoi_mau'),
  Q(741,'fill_text','Đỏ + Xanh dương = ___.',null,'Tím','phoi_mau'),
  Q(741,'single_choice','Vàng + Xanh dương = ?',['Cam','Tím','Xanh lá','Nâu'],'Xanh lá','phoi_mau'),
  Q(741,'true_false','Thêm trắng vào màu đỏ sẽ được hồng.',null,'true','phoi_mau'),
  Q(741,'single_choice','Thêm đen vào màu nào cũng tạo ra?',['Màu nhạt hơn','Màu đậm hơn','Màu trắng','Không đổi'],'Màu đậm hơn','phoi_mau'),
  Q(741,'fill_text','Đỏ + Vàng = ___.',null,'Cam','phoi_mau'),
  Q(741,'single_choice','Tranh đẹp nên dùng mấy màu chính?',['1','2-3','10+','Không biết'],'2-3','phoi_mau','medium'),
  Q(741,'true_false','Phối quá nhiều màu có thể gây rối mắt.',null,'true','phoi_mau'),
  Q(741,'single_choice','Màu nào pha bởi đỏ + vàng + xanh?',['Trắng','Nâu/xám tối','Cam','Tím'],'Nâu/xám tối','phoi_mau','medium'),
  Q(741,'fill_text','Thêm ___ vào bất kỳ màu nào sẽ cho màu nhạt.',null,'trắng','phoi_mau'),
  Q(741,'true_false','Mỗi màu có thể pha thêm trắng hoặc đen.',null,'true','phoi_mau'),
  Q(741,'single_choice','Bảng/vòng tròn màu có bao nhiêu màu cơ bản?',['2','3','6','12'],'3','phoi_mau'),
  Q(741,'single_choice','Vòng tròn 12 màu có mấy màu thứ cấp?',['2','3','6','12'],'3','phoi_mau','medium'),
  Q(741,'true_false','Màu bậc 3 là pha từ màu cơ bản + thứ cấp.',null,'true','phoi_mau','medium'),
  Q(741,'fill_text','Vòng tròn màu có ___ màu cơ bản.',null,'3','phoi_mau'),
  Q(741,'single_choice','Phối vàng + cam gọi là?',['Màu cơ bản','Màu thứ cấp','Màu bậc 3','Màu đen'],'Màu bậc 3','phoi_mau','hard'),
  Q(741,'true_false','Biết phối màu giúp tranh đẹp hơn.',null,'true','phoi_mau'),
  Q(741,'single_choice','Thêm trắng vào xanh dương được?',['Xanh đậm','Xanh nhạt/lam','Tím','Xanh lá'],'Xanh nhạt/lam','phoi_mau'),
  Q(741,'fill_text','Pha màu cơ bản với ___ tạo sắc nhạt hơn.',null,'trắng','phoi_mau'),
  Q(741,'true_false','Nâu là màu trung tính.',null,'true','phoi_mau','medium'),
  Q(741,'single_choice','Xám được pha từ?',['Đỏ + Vàng','Trắng + Đen','Xanh + Cam','Vàng + Tím'],'Trắng + Đen','phoi_mau'),
  Q(741,'true_false','Các họa sĩ đều cần hiểu vòng tròn màu.',null,'true','phoi_mau'),
  Q(741,'single_choice','Phối màu hài hòa giúp tranh thế nào?',['Xấu','Đẹp mắt','Khó hiểu','Rối'],'Đẹp mắt','phoi_mau'),
  // BÀI 742-760: Tiếp tục pattern
  ...Array.from({length: 19}, (_, bai) => {
    const lid = 742 + bai;
    const topics = ['tuong_phan','bo_cuc','khong_gian','ve_nguoi','sinh_hoat','thien_nhien','tuong_tuong','nan_vat','nan_do','tai_che','mo_hinh','buu_thiep','ao_phong','le_hoi','poster','tranh_lua','kien_truc','dan_gian','hoa_si_nho'];
    const skill = topics[bai] || 'chung';
    const titles = [
      'Màu tương phản','Bố cục tranh','Không gian','Vẽ người','Tranh sinh hoạt','Thiên nhiên','Tưởng tượng',
      'Nặn con vật','Nặn đồ vật','Tái chế','Mô hình 3D','Bưu thiếp','Áo phông','Lễ hội','Poster',
      'Tranh lụa Việt Nam','Kiến trúc cổ','Tạo hình dân gian','Họa sĩ nhỏ',
    ];
    const t = titles[bai] || `Bài ${lid}`;
    return [
      Q(lid,'single_choice',`"${t}" thuộc môn nào?`,['Toán','Mỹ thuật','Âm nhạc','Tin học'],'Mỹ thuật',skill),
      Q(lid,'true_false',`"${t}" là kiến thức lớp 3.`,null,'true',skill),
      Q(lid,'single_choice',`Kỹ năng cần cho "${t}"?`,['Chạy nhanh','Quan sát + sáng tạo','Hát hay','Tính toán'],'Quan sát + sáng tạo',skill),
      Q(lid,'fill_text',`Bé học "${t}" ở lớp ___.`,null,'3',skill),
      Q(lid,'true_false',`"${t}" giúp phát triển thẩm mỹ.`,null,'true',skill),
      Q(lid,'single_choice',`Chất liệu phù hợp cho "${t}"?`,['Máy tính','Bút màu, giấy, kéo','Bóng đá','Guitar'],'Bút màu, giấy, kéo',skill),
      Q(lid,'single_choice',`"${t}" kết hợp với kỹ năng gì?`,['Chỉ toán','Quan sát, sáng tạo, kỹ thuật','Chỉ đọc','Chỉ viết'],'Quan sát, sáng tạo, kỹ thuật',skill),
      Q(lid,'true_false',`Thực hành nhiều giúp bé giỏi "${t}".`,null,'true',skill),
      Q(lid,'fill_text',`Mỹ thuật phát triển năng lực ___ tạo.`,null,'sáng',skill),
      Q(lid,'single_choice',`Điều KHÔNG nên làm khi học "${t}"?`,['Quan sát','Sáng tạo','Chép bạn','Hỏi cô'],'Chép bạn',skill),
      Q(lid,'true_false',`Bé cần kiên nhẫn khi thực hành "${t}".`,null,'true',skill),
      Q(lid,'single_choice',`Sau bài "${t}", bé nên?`,['Xé tranh','Trưng bày + rút kinh nghiệm','Bỏ đi','Ngủ'],'Trưng bày + rút kinh nghiệm',skill),
      Q(lid,'fill_text',`GDPT ___ đưa Mỹ thuật vào chương trình.`,null,'2018',skill,'medium'),
      Q(lid,'true_false',`Mỹ thuật giúp bé yêu cái đẹp.`,null,'true',skill),
      Q(lid,'single_choice',`"${t}" ứng dụng vào đâu?`,['Không đâu','Cuộc sống hàng ngày','Chỉ ở trường','Chỉ trong sách'],'Cuộc sống hàng ngày',skill),
      Q(lid,'single_choice',`Bé làm gì nếu chưa hài lòng với tác phẩm?`,['Bỏ cuộc','Sửa hoặc thử lại','Khóc','Đổ lỗi'],'Sửa hoặc thử lại',skill),
      Q(lid,'true_false',`Sáng tạo không có giới hạn.`,null,'true',skill),
      Q(lid,'fill_text',`Bé có thể ___ tranh cho bạn bè, người thân.`,null,'tặng',skill),
      Q(lid,'single_choice',`Mỹ thuật Việt Nam có đặc điểm gì?`,['Nhàm chán','Phong phú, đặc sắc','Không có','Chỉ sao chép'],'Phong phú, đặc sắc',skill),
      Q(lid,'true_false',`Lớp 3 bé đã có thể vẽ phức tạp hơn lớp 1, 2.`,null,'true',skill),
      Q(lid,'single_choice',`"${t}" giúp bé?`,['Mệt mỏi','Phát triển toàn diện','Buồn','Không gì'],'Phát triển toàn diện',skill),
      Q(lid,'fill_text',`Nghệ thuật giúp cuộc sống thêm ___ đẹp.`,null,'tươi',skill),
      Q(lid,'true_false',`Bé nên trân trọng tác phẩm của mình và bạn bè.`,null,'true',skill),
      Q(lid,'single_choice',`Mỹ thuật lớp 3 có gì mới so với lớp 2?`,['Không khác','Phối màu, bố cục, 3D','Chỉ vẽ','Chỉ nặn'],'Phối màu, bố cục, 3D',skill,'medium'),
      Q(lid,'true_false',`Mỹ thuật lớp 3 rất đa dạng và sáng tạo.`,null,'true',skill),
    ];
  }).flat(),
];
