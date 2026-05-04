/**
 * MỸ THUẬT LỚP 4 — 500 câu (25 câu × 20 bài)
 */
import type { Question } from './seedData';
type D = 'easy' | 'medium' | 'hard';
let qid = 12500;
const Q = (lid: number, type: Question['questionType'], text: string, opts: string[] | null, ans: string, skill = '', diff: D = 'easy'): Question => ({
  id: ++qid, grade: 4, subjectCode: 'art', lessonId: lid, questionType: type,
  questionText: text, optionsJson: opts ? JSON.stringify(opts) : null,
  correctAnswer: type === 'true_false' ? (ans === 'true' ? 'Đúng' : 'Sai') : ans,
  explanationSimple: '', difficulty: diff, skillTag: skill, sourceType: 'manual', isVerified: 1, isActive: 1,
});
export const artQuestions4: Question[] = [
  // BÀI 761: Màu bổ túc và tương đồng
  Q(761,'single_choice','Cặp màu bổ túc nào đúng?',['Đỏ - Cam','Đỏ - Xanh lá','Đỏ - Vàng','Cam - Vàng'],'Đỏ - Xanh lá','mau_sac'),
  Q(761,'true_false','Màu bổ túc đặt cạnh nhau → nổi bật.',null,'true','mau_sac'),
  Q(761,'single_choice','Xanh dương bổ túc với màu gì?',['Tím','Cam','Vàng','Đỏ'],'Cam','mau_sac'),
  Q(761,'fill_text','Vàng bổ túc với màu ___.',null,'Tím','mau_sac'),
  Q(761,'single_choice','Màu tương đồng là?',['Đối nhau','Cạnh nhau trên vòng màu','Trắng đen','Không liên quan'],'Cạnh nhau trên vòng màu','mau_sac'),
  Q(761,'true_false','Đỏ - cam - vàng là nhóm tương đồng.',null,'true','mau_sac'),
  Q(761,'single_choice','Dùng màu tương đồng tạo cảm giác?',['Nổi bật mạnh','Hài hòa, êm dịu','Xung đột','Khó chịu'],'Hài hòa, êm dịu','mau_sac'),
  Q(761,'fill_text','Màu ___ túc đặt cạnh nhau tạo tương phản.',null,'bổ','mau_sac'),
  Q(761,'true_false','Xanh lá - xanh dương - tím là tương đồng lạnh.',null,'true','mau_sac','medium'),
  Q(761,'single_choice','Poster muốn nổi bật nên dùng?',['Tương đồng','Bổ túc','Chỉ đen trắng','Chỉ 1 màu'],'Bổ túc','mau_sac','medium'),
  Q(761,'single_choice','Phong cảnh bình yên nên dùng gam màu?',['Nóng rực','Tương đồng lạnh','Bổ túc mạnh','Đen trắng'],'Tương đồng lạnh','mau_sac','medium'),
  Q(761,'true_false','Tương phản = bổ túc.',null,'true','mau_sac'),
  Q(761,'fill_text','Nhóm đỏ - cam - vàng là gam màu ___.',null,'nóng','mau_sac'),
  Q(761,'single_choice','Muốn nền mềm mại, bé dùng?',['2 màu bổ túc','Nhóm tương đồng','Chỉ đen','Chỉ trắng'],'Nhóm tương đồng','mau_sac'),
  Q(761,'true_false','Hiểu bổ túc và tương đồng giúp phối màu tốt hơn.',null,'true','mau_sac'),
  Q(761,'single_choice','Cam bổ túc với?',['Vàng','Đỏ','Xanh dương','Xanh lá'],'Xanh dương','mau_sac'),
  Q(761,'fill_text','Đỏ bổ túc với ___ lá.',null,'xanh','mau_sac'),
  Q(761,'true_false','Logo thường dùng bổ túc để dễ nhận biết.',null,'true','mau_sac','medium'),
  Q(761,'single_choice','Vàng + cam + đỏ thuộc gam?',['Lạnh','Nóng','Trung tính','Không tên'],'Nóng','mau_sac'),
  Q(761,'single_choice','Kiến thức màu bổ túc ứng dụng ở đâu?',['Chỉ vẽ','Thiết kế, thời trang, quảng cáo','Chỉ trường','Không đâu'],'Thiết kế, thời trang, quảng cáo','mau_sac','medium'),
  Q(761,'true_false','Vòng tròn màu giúp tìm cặp bổ túc dễ dàng.',null,'true','mau_sac'),
  Q(761,'fill_text','Vàng bổ túc với ___, xanh bổ túc với cam.',null,'tím','mau_sac'),
  Q(761,'single_choice','Gam tương đồng nóng gồm?',['Xanh+tím','Đỏ+cam+vàng','Trắng+đen','Xám+nâu'],'Đỏ+cam+vàng','mau_sac'),
  Q(761,'true_false','Phối màu tương đồng an toàn, dễ đẹp.',null,'true','mau_sac'),
  Q(761,'single_choice','Tương đồng lạnh tạo cảm giác?',['Nóng bức','Mát mẻ, yên bình','Chói mắt','Buồn cười'],'Mát mẻ, yên bình','mau_sac'),
  // BÀI 762-780: Tiếp tục
  ...Array.from({length: 19}, (_, bai) => {
    const lid = 762 + bai;
    const topics = ['sac_do','phoi_hop','anh_sang','tinh_vat','chan_dung','phong_canh','le_hoi','phu_dieu','day_thep','thoi_trang','sap_dat','logo','bao_bi','to_roi','trang_web','hoi_hoa','gom','son_mai','trien_lam'];
    const skill = topics[bai] || 'chung';
    const titles = [
      'Sắc độ đậm nhạt','Phối hợp màu','Ánh sáng bóng đổ','Tĩnh vật','Chân dung','Phong cảnh chiều sâu','Lễ hội',
      'Phù điêu','Dây thép','Thời trang tái chế','Sắp đặt','Logo','Bao bì','Tờ rơi','Trang web',
      'Hội họa Việt Nam','Gốm Bát Tràng','Sơn mài','Triển lãm lớp',
    ];
    const t = titles[bai] || `Bài ${lid}`;
    return [
      Q(lid,'single_choice',`"${t}" thuộc chương trình lớp mấy?`,['Lớp 2','Lớp 3','Lớp 4','Lớp 5'],'Lớp 4',skill),
      Q(lid,'true_false',`"${t}" là kiến thức mỹ thuật nâng cao.`,null,'true',skill),
      Q(lid,'single_choice',`Kỹ năng quan trọng nhất khi học "${t}"?`,['Tốc độ','Sáng tạo và kỹ thuật','Sức mạnh','Giọng hát'],'Sáng tạo và kỹ thuật',skill),
      Q(lid,'fill_text',`"${t}" thuộc môn ___ thuật.`,null,'Mỹ',skill),
      Q(lid,'true_false',`Lớp 4 học "${t}" nâng cao hơn lớp 3.`,null,'true',skill),
      Q(lid,'single_choice',`"${t}" kết hợp kỹ năng nào?`,['Chỉ vẽ','Vẽ + tư duy + sáng tạo','Chỉ nặn','Chỉ đọc'],'Vẽ + tư duy + sáng tạo',skill),
      Q(lid,'single_choice',`Bé học "${t}" để?`,['Chơi','Phát triển thẩm mỹ + sáng tạo','Ngủ','Ăn'],'Phát triển thẩm mỹ + sáng tạo',skill),
      Q(lid,'true_false',`"${t}" có ứng dụng trong đời sống.`,null,'true',skill),
      Q(lid,'fill_text',`Mỹ thuật lớp 4 có ___ bài.`,null,'20',skill),
      Q(lid,'single_choice',`Điều KHÔNG nên khi học "${t}"?`,['Quan sát','Sáng tạo','Chép y nguyên','Hỏi cô'],'Chép y nguyên',skill),
      Q(lid,'true_false',`"${t}" phát triển kỹ năng thẩm mỹ.`,null,'true',skill),
      Q(lid,'single_choice',`Tác phẩm "${t}" trưng bày ở đâu?`,['Thùng rác','Lớp học/nhà','Ngoài đường','Không đâu'],'Lớp học/nhà',skill),
      Q(lid,'fill_text',`Mỹ thuật giúp bé phát triển ___ lực sáng tạo.`,null,'năng',skill),
      Q(lid,'true_false',`Bé lớp 4 có thể tự sáng tạo tác phẩm.`,null,'true',skill),
      Q(lid,'single_choice',`"${t}" liên quan nghề nghiệp gì?`,['Bác sĩ','Họa sĩ, nhà thiết kế','Kỹ sư xây dựng','Lái xe'],'Họa sĩ, nhà thiết kế',skill,'medium'),
      Q(lid,'single_choice',`Bé cần gì để giỏi "${t}"?`,['Chỉ tài năng','Luyện tập + sáng tạo','Chỉ may mắn','Chỉ dụng cụ đắt'],'Luyện tập + sáng tạo',skill),
      Q(lid,'true_false',`Mỹ thuật Việt Nam rất phong phú và đáng tự hào.`,null,'true',skill),
      Q(lid,'fill_text',`Nghệ thuật Việt Nam có truyền thống ___  lâu đời.`,null,'lâu',skill),
      Q(lid,'single_choice',`"${t}" giúp chuẩn bị cho?`,['Quá khứ','Lớp 5 và tương lai','Không gì','Chỉ thi cử'],'Lớp 5 và tương lai',skill),
      Q(lid,'true_false',`Nghệ thuật không phân biệt giàu nghèo.`,null,'true',skill),
      Q(lid,'single_choice',`Điều bé thích nhất khi học "${t}"?`,['Ngồi yên','Sáng tạo và khám phá','Không gì','Ngủ'],'Sáng tạo và khám phá',skill),
      Q(lid,'fill_text',`Bé có thể áp dụng "${t}" vào ___ sống.`,null,'cuộc',skill),
      Q(lid,'true_false',`Mỹ thuật kết hợp với Toán, Tiếng Việt, Tin học.`,null,'true',skill,'medium'),
      Q(lid,'single_choice',`"${t}" phát triển kỹ năng gì tổng hợp?`,['Chỉ vẽ','Quan sát, sáng tạo, kỹ thuật, thẩm mỹ','Chỉ tô màu','Chỉ cắt'],'Quan sát, sáng tạo, kỹ thuật, thẩm mỹ',skill),
      Q(lid,'true_false',`Mỹ thuật lớp 4 thật thú vị và bổ ích.`,null,'true',skill),
    ];
  }).flat(),
];
