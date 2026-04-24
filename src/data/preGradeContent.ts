import type { Lesson, LessonCard, Question } from './seedData';

let lessonId = 9000;
const makeLesson = (
  subjectCode: Lesson['subjectCode'],
  unitCode: string,
  lessonCode: string,
  title: string,
  objective: string,
  sortOrder: number,
): Lesson => ({
  id: ++lessonId,
  grade: 0,
  subjectCode,
  unitCode,
  lessonCode,
  title,
  objective,
  summarySimple: title,
  tips: 'Mỗi buổi học 5-10 phút, ưu tiên động viên thay vì áp lực điểm số.',
  difficulty: 'easy',
  estimatedMinutes: 8,
  status: 'ready',
  sortOrder,
  isActive: 1,
});

export const preGradeLessons: Lesson[] = [
  // Toán tiền lớp 1
  makeLesson('math', 'PRE-MATH', 'PM01', 'So sánh nhiều - ít', 'Nhận biết nhiều hơn, ít hơn qua hình ảnh.', 1),
  makeLesson('math', 'PRE-MATH', 'PM02', 'Đếm trong phạm vi 5', 'Đếm và nói đúng số từ 1 đến 5.', 2),
  makeLesson('math', 'PRE-MATH', 'PM03', 'Tách - gộp trong phạm vi 5', 'Biết tách một nhóm đồ vật thành 2 nhóm nhỏ.', 3),
  makeLesson('math', 'PRE-MATH', 'PM04', 'Nhận diện hình tròn - vuông', 'Phân biệt hình tròn và hình vuông qua đồ vật quen thuộc.', 4),
  makeLesson('math', 'PRE-MATH', 'PM05', 'Đếm trong phạm vi 10', 'Đếm và nhận diện các số từ 1 đến 10.', 5),
  makeLesson('math', 'PRE-MATH', 'PM06', 'Số thứ tự đơn giản', 'Hiểu vị trí thứ nhất, thứ hai, thứ ba trong hàng.', 6),

  // Tiếng Việt tiền lớp 1
  makeLesson('vietnamese', 'PRE-VIET', 'PV01', 'Làm quen chữ cái a, o, e', 'Nghe và nhận diện chữ cái a, o, e.', 1),
  makeLesson('vietnamese', 'PRE-VIET', 'PV02', 'Âm đầu dễ thương', 'Phân biệt âm đầu b, m, n qua từ đơn giản.', 2),
  makeLesson('vietnamese', 'PRE-VIET', 'PV03', 'Nghe hiểu câu ngắn', 'Nghe và làm theo hướng dẫn 2 bước ngắn.', 3),
  makeLesson('vietnamese', 'PRE-VIET', 'PV04', 'Vần dễ đọc a-o-e', 'Ghép âm đơn giản với vần mở có a, o, e.', 4),
  makeLesson('vietnamese', 'PRE-VIET', 'PV05', 'Kể chuyện 3 tranh', 'Sắp xếp 3 tranh theo đúng thứ tự và kể câu ngắn.', 5),
  makeLesson('vietnamese', 'PRE-VIET', 'PV06', 'Từ mới quanh em', 'Nhận diện từ đơn giản về gia đình và đồ vật.', 6),

  // Đạo đức tiền lớp 1
  makeLesson('ethics', 'PRE-ETH', 'PE01', 'Kỹ năng chào hỏi', 'Biết chào hỏi lễ phép với người lớn và bạn bè.', 1),
  makeLesson('ethics', 'PRE-ETH', 'PE02', 'Chờ đến lượt', 'Tập chờ đến lượt khi chơi và học cùng bạn.', 2),
  makeLesson('ethics', 'PRE-ETH', 'PE03', 'Tự phục vụ nhỏ', 'Tự cất dép, xếp ghế, bỏ rác đúng nơi quy định.', 3),
  makeLesson('ethics', 'PRE-ETH', 'PE04', 'Xin lỗi và cảm ơn', 'Biết nói xin lỗi, cảm ơn đúng lúc.', 4),
  makeLesson('ethics', 'PRE-ETH', 'PE05', 'An toàn khi đến trường', 'Nhận biết hành vi an toàn trên đường và trong lớp.', 5),

  // Mỹ thuật tiền lớp 1
  makeLesson('art', 'PRE-ART', 'PA01', 'Tô nét cơ bản', 'Tô theo đường chấm các nét thẳng, cong, tròn.', 1),
  makeLesson('art', 'PRE-ART', 'PA02', 'Màu sắc quen thuộc', 'Nhận diện màu đỏ, vàng, xanh qua tranh vật.', 2),
  makeLesson('art', 'PRE-ART', 'PA03', 'Vẽ hình đơn giản', 'Vẽ mặt cười, bông hoa, mặt trời bằng hình cơ bản.', 3),
  makeLesson('art', 'PRE-ART', 'PA04', 'Cắt - dán hình cơ bản', 'Dùng hình tròn, vuông để tạo bức tranh nhỏ.', 4),
  makeLesson('art', 'PRE-ART', 'PA05', 'Nhịp điệu màu sắc', 'Tô màu theo mẫu, giữ vị trí gọn gàng.', 5),
];

let cardId = 99000;
const makeCard = (
  lessonIdRef: number,
  cardType: LessonCard['cardType'],
  title: string,
  content: string,
  sortOrder: number,
): LessonCard => ({
  id: ++cardId,
  lessonId: lessonIdRef,
  cardType,
  title,
  content,
  exampleJson: null,
  sortOrder,
  isActive: 1,
});

export const preGradeCards: LessonCard[] = preGradeLessons.flatMap((l) => [
  makeCard(l.id, 'intro', `Bắt đầu: ${l.title}`, l.objective, 1),
  makeCard(l.id, 'explain', 'Hướng dẫn cho phụ huynh', 'Đọc chậm, nói rõ, khuyến khích bé trả lời bằng lời nói và hành động.', 2),
  makeCard(l.id, 'example', 'Ví dụ nhanh', `Hỏi bé 2-3 câu ngắn liên quan đến bài "${l.title}".`, 3),
  makeCard(l.id, 'mini_check', 'Kiểm tra nhẹ', 'Nếu bé làm đúng 2/3 nhiệm vụ nhỏ thì chuyển bài tiếp theo.', 4),
]);

let qid = 199000;
const makeQuestion = (
  lessonIdRef: number,
  subjectCode: Question['subjectCode'],
  questionType: Question['questionType'],
  questionText: string,
  options: string[] | null,
  correctAnswer: string,
  skillTag: string,
  difficulty: Question['difficulty'] = 'easy',
): Question => ({
  id: ++qid,
  grade: 0,
  subjectCode,
  lessonId: lessonIdRef,
  questionType,
  questionText,
  optionsJson: options ? JSON.stringify(options) : null,
  correctAnswer,
  explanationSimple: 'Khuyến khích bé thử lại nếu chưa đúng.',
  difficulty,
  skillTag,
  sourceType: 'manual',
  isVerified: 1,
  isActive: 1,
});

function lessonQuestions(l: Lesson): Question[] {
  switch (l.lessonCode) {
    case 'PM01':
      return [
        makeQuestion(l.id, 'math', 'single_choice', 'Nhóm nào nhiều hơn?', ['3 quả táo', '1 quả táo'], '3 quả táo', 'compare_more_less'),
        makeQuestion(l.id, 'math', 'true_false', '1 quả táo ít hơn 3 quả táo.', null, 'Đúng', 'compare_more_less'),
        makeQuestion(l.id, 'math', 'single_choice', 'Chọn nhóm ÍT hơn', ['5 sao', '2 sao'], '2 sao', 'compare_more_less'),
        makeQuestion(l.id, 'math', 'true_false', '4 bóng ít hơn 2 bóng.', null, 'Sai', 'compare_more_less'),
        makeQuestion(l.id, 'math', 'single_choice', 'Nhóm nào bằng nhau?', ['2 con cá và 2 con cá', '2 con cá và 3 con cá'], '2 con cá và 2 con cá', 'compare_equal'),
        makeQuestion(l.id, 'math', 'single_choice', 'Chọn câu đúng', ['5 nhiều hơn 1', '1 nhiều hơn 5'], '5 nhiều hơn 1', 'compare_more_less'),
      ];
    case 'PM02':
      return [
        makeQuestion(l.id, 'math', 'fill_number', 'Đếm số ngôi sao: ★★★ = ?', null, '3', 'count_to_5'),
        makeQuestion(l.id, 'math', 'single_choice', 'Số nào đứng sau số 2?', ['1', '3', '5'], '3', 'number_sequence'),
        makeQuestion(l.id, 'math', 'single_choice', 'Chọn số lớn nhất', ['2', '5', '4'], '5', 'count_to_5'),
        makeQuestion(l.id, 'math', 'true_false', 'Số 4 đứng trước số 5.', null, 'Đúng', 'number_sequence'),
        makeQuestion(l.id, 'math', 'fill_number', 'Đếm số quả bóng: 🎈🎈🎈🎈 = ?', null, '4', 'count_to_5'),
        makeQuestion(l.id, 'math', 'single_choice', 'Dãy số đúng là', ['1,2,3,4,5', '1,3,2,5,4'], '1,2,3,4,5', 'number_sequence'),
      ];
    case 'PM03':
      return [
        makeQuestion(l.id, 'math', 'single_choice', 'Có 5 viên bi, tách 2 viên và ? viên.', ['1', '2', '3'], '3', 'part_whole_5'),
        makeQuestion(l.id, 'math', 'true_false', '5 = 4 + 1', null, 'Đúng', 'part_whole_5'),
        makeQuestion(l.id, 'math', 'single_choice', 'Số nào còn thiếu: 5 = 2 + ?', ['2', '3', '4'], '3', 'part_whole_5'),
        makeQuestion(l.id, 'math', 'true_false', '5 = 1 + 1', null, 'Sai', 'part_whole_5'),
        makeQuestion(l.id, 'math', 'single_choice', 'Tách 5 thành 3 và ...', ['1', '2', '4'], '2', 'part_whole_5'),
        makeQuestion(l.id, 'math', 'single_choice', 'Câu nào đúng?', ['5 = 0 + 5', '5 = 0 + 4'], '5 = 0 + 5', 'part_whole_5'),
      ];
    case 'PV01':
      return [
        makeQuestion(l.id, 'vietnamese', 'single_choice', 'Chữ cái nào là "a"?', ['a', 'o', 'e'], 'a', 'letter_aoe'),
        makeQuestion(l.id, 'vietnamese', 'single_choice', 'Chọn chữ "o"', ['a', 'o', 'e'], 'o', 'letter_aoe'),
        makeQuestion(l.id, 'vietnamese', 'single_choice', 'Chọn chữ "e"', ['a', 'o', 'e'], 'e', 'letter_aoe'),
        makeQuestion(l.id, 'vietnamese', 'true_false', 'Chữ "a" khác chữ "o".', null, 'Đúng', 'letter_aoe'),
        makeQuestion(l.id, 'vietnamese', 'single_choice', 'Từ nào có âm a?', ['ba', 'be', 'bo'], 'ba', 'letter_sound'),
        makeQuestion(l.id, 'vietnamese', 'single_choice', 'Từ nào có âm e?', ['be', 'bo', 'ba'], 'be', 'letter_sound'),
      ];
    case 'PV02':
      return [
        makeQuestion(l.id, 'vietnamese', 'single_choice', 'Âm đầu của "mẹ" là', ['m', 'b', 'n'], 'm', 'initial_bmn'),
        makeQuestion(l.id, 'vietnamese', 'single_choice', 'Âm đầu của "bé" là', ['m', 'b', 'n'], 'b', 'initial_bmn'),
        makeQuestion(l.id, 'vietnamese', 'single_choice', 'Âm đầu của "na" là', ['n', 'm', 'b'], 'n', 'initial_bmn'),
        makeQuestion(l.id, 'vietnamese', 'true_false', 'Từ "bò" có âm đầu là b.', null, 'Đúng', 'initial_bmn'),
        makeQuestion(l.id, 'vietnamese', 'true_false', 'Từ "mẹ" có âm đầu là n.', null, 'Sai', 'initial_bmn'),
        makeQuestion(l.id, 'vietnamese', 'single_choice', 'Chọn nhóm âm đầu đã học', ['b,m,n', 'x,s,r', 'ch,nh,th'], 'b,m,n', 'initial_bmn'),
      ];
    case 'PV03':
      return [
        makeQuestion(l.id, 'vietnamese', 'single_choice', 'Câu nào là hướng dẫn 2 bước?', ['Lấy bút, mở vở', 'Ngủ đi', 'Ăn cơm'], 'Lấy bút, mở vở', 'listen_two_steps'),
        makeQuestion(l.id, 'vietnamese', 'true_false', 'Nghe xong cần làm đúng thứ tự.', null, 'Đúng', 'listen_two_steps'),
        makeQuestion(l.id, 'vietnamese', 'single_choice', 'Nếu nghe: "Đứng lên, vỗ tay" thì làm gì trước?', ['Vỗ tay', 'Đứng lên', 'Ngồi xuống'], 'Đứng lên', 'listen_two_steps'),
        makeQuestion(l.id, 'vietnamese', 'single_choice', 'Chọn câu lệnh đúng', ['Nhảy 3 lần rồi ngồi xuống', 'Mua đồ cho mẹ', 'Đọc truyện'], 'Nhảy 3 lần rồi ngồi xuống', 'listen_two_steps'),
        makeQuestion(l.id, 'vietnamese', 'true_false', 'Làm sai thứ tự vẫn được tính đúng.', null, 'Sai', 'listen_two_steps'),
        makeQuestion(l.id, 'vietnamese', 'single_choice', 'Kỹ năng này giúp bé', ['Nghe hiểu hướng dẫn', 'Vẽ đẹp hơn', 'Chạy nhanh hơn'], 'Nghe hiểu hướng dẫn', 'listen_two_steps'),
      ];
    case 'PE01':
      return [
        makeQuestion(l.id, 'ethics', 'single_choice', 'Gặp cô giáo, bé nói', ['Con chào cô ạ', 'Im lặng', 'Quay đi'], 'Con chào cô ạ', 'greeting_polite'),
        makeQuestion(l.id, 'ethics', 'true_false', 'Chào hỏi là phép lịch sự.', null, 'Đúng', 'greeting_polite'),
        makeQuestion(l.id, 'ethics', 'single_choice', 'Gặp ông bà thì', ['Con chào ông bà ạ', 'Không cần chào', 'Chạy qua'], 'Con chào ông bà ạ', 'greeting_polite'),
        makeQuestion(l.id, 'ethics', 'true_false', 'Nói cảm ơn khi được giúp đỡ là đúng.', null, 'Đúng', 'polite_words'),
        makeQuestion(l.id, 'ethics', 'single_choice', 'Bộ 3 từ lịch sự là', ['Xin chào, cảm ơn, xin lỗi', 'Ăn, ngủ, chơi', 'Nhanh, mạnh, giỏi'], 'Xin chào, cảm ơn, xin lỗi', 'polite_words'),
        makeQuestion(l.id, 'ethics', 'single_choice', 'Khi làm phiền bạn, bé nên', ['Xin lỗi', 'Bỏ đi', 'Cãi nhau'], 'Xin lỗi', 'polite_words'),
      ];
    case 'PE02':
      return [
        makeQuestion(l.id, 'ethics', 'single_choice', 'Khi chơi cầu trượt, bé cần', ['Chèn lên trước', 'Chờ đến lượt', 'Đẩy bạn'], 'Chờ đến lượt', 'wait_turn'),
        makeQuestion(l.id, 'ethics', 'true_false', 'Chờ đến lượt giúp trò chơi công bằng.', null, 'Đúng', 'wait_turn'),
        makeQuestion(l.id, 'ethics', 'single_choice', 'Bạn đang nói, bé nên', ['Cắt lời', 'Lắng nghe', 'Bỏ đi'], 'Lắng nghe', 'listen_friend'),
        makeQuestion(l.id, 'ethics', 'true_false', 'Chèn ngang là hành vi đẹp.', null, 'Sai', 'wait_turn'),
        makeQuestion(l.id, 'ethics', 'single_choice', 'Nếu đến sau, bé', ['Xếp hàng cuối', 'Lên đầu hàng', 'Khóc'], 'Xếp hàng cuối', 'queue_skill'),
        makeQuestion(l.id, 'ethics', 'single_choice', 'Kỹ năng chờ đến lượt giúp bé', ['Tôn trọng bạn', 'Nhanh hơn mọi lúc', 'Được quà'], 'Tôn trọng bạn', 'wait_turn'),
      ];
    case 'PE03':
      return [
        makeQuestion(l.id, 'ethics', 'single_choice', 'Ăn xong bé bỏ rác vào', ['Thùng rác', 'Sân nhà', 'Bàn học'], 'Thùng rác', 'self_service'),
        makeQuestion(l.id, 'ethics', 'true_false', 'Tự xếp ghế là việc bé có thể làm.', null, 'Đúng', 'self_service'),
        makeQuestion(l.id, 'ethics', 'single_choice', 'Sau khi học, bé nên', ['Cất bút vở gọn gàng', 'Để lung tung', 'Chờ bạn cất hộ'], 'Cất bút vở gọn gàng', 'self_service'),
        makeQuestion(l.id, 'ethics', 'true_false', 'Tự phục vụ giúp bé tự lập hơn.', null, 'Đúng', 'self_service'),
        makeQuestion(l.id, 'ethics', 'single_choice', 'Việc nào KHÔNG tự phục vụ?', ['Tự đeo dép', 'Tự rửa tay', 'Bắt người khác làm hết'], 'Bắt người khác làm hết', 'self_service'),
        makeQuestion(l.id, 'ethics', 'single_choice', 'Thói quen tốt mỗi ngày là', ['Tự dẹp góc học tập', 'Bỏ mặc đồ đạc', 'Chờ đến khi bị nhắc'], 'Tự dẹp góc học tập', 'self_service'),
      ];
    case 'PA01':
      return [
        makeQuestion(l.id, 'art', 'single_choice', 'Nét nào là nét thẳng?', ['|', 'O', 'S'], '|', 'line_basic'),
        makeQuestion(l.id, 'art', 'single_choice', 'Nét tròn giống hình nào?', ['O', '/', '-'], 'O', 'line_basic'),
        makeQuestion(l.id, 'art', 'true_false', 'Tô nét chấm giúp tay bé chắc hơn.', null, 'Đúng', 'fine_motor'),
        makeQuestion(l.id, 'art', 'single_choice', 'Khi tô nét, bé nên', ['Đi chậm theo đường', 'Tô nhanh vượt ra ngoài', 'Bỏ qua'], 'Đi chậm theo đường', 'fine_motor'),
        makeQuestion(l.id, 'art', 'true_false', 'Cầm bút đúng tư thế giúp tay đỡ mỏi.', null, 'Đúng', 'fine_motor'),
        makeQuestion(l.id, 'art', 'single_choice', 'Bài tô nét phù hợp thời gian', ['5-10 phút', '40 phút', '60 phút'], '5-10 phút', 'line_basic'),
      ];
    case 'PA02':
      return [
        makeQuestion(l.id, 'art', 'single_choice', 'Màu của lá cây thường là', ['Xanh', 'Đỏ', 'Đen'], 'Xanh', 'color_basic'),
        makeQuestion(l.id, 'art', 'single_choice', 'Màu của mặt trời trong tranh em bé hay tô là', ['Vàng', 'Tím', 'Nâu'], 'Vàng', 'color_basic'),
        makeQuestion(l.id, 'art', 'single_choice', 'Màu quả táo thường gặp', ['Đỏ', 'Xám', 'Đen'], 'Đỏ', 'color_basic'),
        makeQuestion(l.id, 'art', 'true_false', 'Màu sắc giúp tranh đẹp hơn.', null, 'Đúng', 'color_basic'),
        makeQuestion(l.id, 'art', 'single_choice', 'Cặp màu nào đã học?', ['Đỏ-vàng-xanh', 'Đen-trắng-xám', 'Nâu-đen-tím'], 'Đỏ-vàng-xanh', 'color_basic'),
        makeQuestion(l.id, 'art', 'true_false', 'Bé có thể chọn màu theo ý thích khi vẽ.', null, 'Đúng', 'creative_confidence'),
      ];
    case 'PA03':
      return [
        makeQuestion(l.id, 'art', 'single_choice', 'Vẽ mặt cười cần hình gì cho mắt?', ['2 hình tròn', '2 hình vuông', '2 hình tam giác'], '2 hình tròn', 'shape_drawing'),
        makeQuestion(l.id, 'art', 'single_choice', 'Bông hoa đơn giản có thể gồm', ['Hình tròn và cánh', 'Chỉ một nét thẳng', 'Chỉ một chấm'], 'Hình tròn và cánh', 'shape_drawing'),
        makeQuestion(l.id, 'art', 'true_false', 'Mặt trời có thể vẽ bằng hình tròn và tia nắng.', null, 'Đúng', 'shape_drawing'),
        makeQuestion(l.id, 'art', 'single_choice', 'Khi vẽ, bé nên', ['Vẽ từ hình lớn đến hình nhỏ', 'Tô màu trước khi có hình', 'Vạch loạn'], 'Vẽ từ hình lớn đến hình nhỏ', 'drawing_order'),
        makeQuestion(l.id, 'art', 'true_false', 'Không cần giống y hệt mẫu, bé có thể sáng tạo.', null, 'Đúng', 'creative_confidence'),
        makeQuestion(l.id, 'art', 'single_choice', 'Mục tiêu bài vẽ đơn giản là', ['Tự tin cầm bút và biểu đạt ý tưởng', 'Vẽ thật giống ảnh', 'Thi điểm cao'], 'Tự tin cầm bút và biểu đạt ý tưởng', 'creative_confidence'),
      ];
    default:
      return [
        makeQuestion(l.id, l.subjectCode, 'single_choice', `Mục tiêu bài "${l.title}" là gì?`, ['Làm quen kỹ năng mới', 'Bỏ qua bài học', 'Học thật nhanh'], 'Làm quen kỹ năng mới', 'pre_grade_core'),
        makeQuestion(l.id, l.subjectCode, 'true_false', 'Mỗi buổi học ngắn 5-10 phút là phù hợp với bé.', null, 'Đúng', 'pre_grade_habit'),
        makeQuestion(l.id, l.subjectCode, 'single_choice', 'Bé nên học như thế nào?', ['Vui vẻ và có động viên', 'Bị ép buộc liên tục', 'Học khi rất mệt'], 'Vui vẻ và có động viên', 'pre_grade_mindset'),
        makeQuestion(l.id, l.subjectCode, 'single_choice', 'Sau mỗi bài, bé cần làm gì?', ['Ôn lại 1-2 phút', 'Không cần nhớ lại', 'Bỏ qua'], 'Ôn lại 1-2 phút', 'pre_grade_review'),
        makeQuestion(l.id, l.subjectCode, 'true_false', 'Phụ huynh nên khen nỗ lực của bé.', null, 'Đúng', 'pre_grade_support'),
        makeQuestion(l.id, l.subjectCode, 'single_choice', `Bài "${l.title}" phù hợp nhất với cách học nào?`, ['Học qua trò chơi và hình ảnh', 'Chỉ học lý thuyết dài', 'Chỉ đọc không thực hành'], 'Học qua trò chơi và hình ảnh', 'pre_grade_active'),
      ];
  }
}

export const preGradeQuestions: Question[] = preGradeLessons.flatMap((l) => lessonQuestions(l));
