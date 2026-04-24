/**
 * ĐẠO ĐỨC LỚP 1 — 20 bài (GDPT 2018)
 * ID bắt đầu từ 301 (Math G1: 1-20, G2: 21-40, Vietnamese: 101-120, Nature: 201-220)
 */
import type { Lesson } from './seedData';

let lid = 300;
const L = (
  unitCode: string,
  lessonCode: string,
  title: string,
  objective: string,
  difficulty: Lesson['difficulty'] = 'easy',
  minutes = 10,
): Lesson => ({
  id: ++lid,
  grade: 1,
  subjectCode: 'ethics',
  unitCode,
  lessonCode,
  title,
  objective,
  summarySimple: title,
  tips: '',
  difficulty,
  estimatedMinutes: minutes,
  status: 'ready',
  sortOrder: lid - 300,
  isActive: 1,
});

export const ethicsLessons1: Lesson[] = [
  // Chủ đề 1: Em và gia đình (4 bài)
  L('GD', 'GD01', 'Em là ai?', 'Biết giới thiệu bản thân: tên, tuổi, sở thích.'),
  L('GD', 'GD02', 'Yêu thương gia đình', 'Biết biểu hiện yêu thương gia đình qua lời nói, hành động.'),
  L('GD', 'GD03', 'Vâng lời ông bà, cha mẹ', 'Biết vâng lời, giúp đỡ ông bà, cha mẹ trong cuộc sống.'),
  L('GD', 'GD04', 'Gọn gàng, ngăn nắp', 'Biết giữ gìn đồ dùng cá nhân gọn gàng, ngăn nắp.'),

  // Chủ đề 2: Em và trường lớp (4 bài)
  L('TL', 'TL01', 'Lễ phép với thầy cô', 'Biết chào hỏi, xưng hô lễ phép với thầy cô giáo.'),
  L('TL', 'TL02', 'Thân thiện với bạn bè', 'Biết cách kết bạn, chơi cùng bạn, chia sẻ với bạn.'),
  L('TL', 'TL03', 'Thật thà, không nói dối', 'Hiểu giá trị của sự thật thà, biết nhận lỗi khi sai.'),
  L('TL', 'TL04', 'Tự tin phát biểu', 'Biết mạnh dạn giơ tay phát biểu, tự tin trước lớp.', 'medium'),

  // Chủ đề 3: Em và cộng đồng (4 bài)
  L('CD', 'CD01', 'Lễ phép với người lớn', 'Biết chào hỏi, cảm ơn, xin lỗi với người lớn.'),
  L('CD', 'CD02', 'Yêu quê hương đất nước', 'Biết yêu quê hương mình, tự hào là người Việt Nam.'),
  L('CD', 'CD03', 'Giúp đỡ mọi người', 'Biết giúp đỡ người già, em nhỏ, người gặp khó khăn.'),
  L('CD', 'CD04', 'Bảo vệ của công', 'Biết giữ gìn, bảo vệ tài sản công cộng.'),

  // Chủ đề 4: Em với tự nhiên (4 bài)
  L('Trách nhiệm', 'TN01', 'Yêu thiên nhiên', 'Biết yêu quý cây cối, hoa lá, con vật.'),
  L('Trách nhiệm', 'TN02', 'Bảo vệ cây xanh', 'Biết chăm sóc cây xanh, không bẻ cành ngắt lá.'),
  L('Trách nhiệm', 'TN03', 'Yêu thương động vật', 'Biết chăm sóc, không đánh đập động vật.'),
  L('Trách nhiệm', 'TN04', 'Giữ vệ sinh môi trường', 'Biết bỏ rác đúng chỗ, giữ môi trường sạch.', 'medium'),

  // Chủ đề 5: Em tự chăm sóc bản thân (4 bài)
  L('Bài tập', 'BT01', 'Sinh hoạt đúng giờ', 'Biết ăn, ngủ, học đúng giờ giấc.'),
  L('Bài tập', 'BT02', 'An toàn khi vui chơi', 'Biết chơi an toàn, tránh trò chơi nguy hiểm.'),
  L('Bài tập', 'BT03', 'Tiết kiệm, không lãng phí', 'Biết tiết kiệm nước, điện, đồ ăn.'),
  L('Bài tập', 'BT04', 'Kiên trì, không bỏ cuộc', 'Biết kiên trì học tập, không bỏ cuộc khi gặp khó.', 'medium'),
];
