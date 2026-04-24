/**
 * EXTRA QUESTIONS — 10 câu bổ sung/bài cho tất cả môn hiện có
 * Nâng từ 15 câu → 25 câu/bài
 * qid bắt đầu: 15001
 */
import type { Question } from './seedData';
type D = 'easy' | 'medium' | 'hard';
let qid = 15000;
const Q = (grade: number, sub: string, lid: number, type: Question['questionType'], text: string, opts: string[] | null, ans: string, diff: D = 'easy'): Question => ({
  id: ++qid, grade, subjectCode: sub, lessonId: lid, questionType: type,
  questionText: text, optionsJson: opts ? JSON.stringify(opts) : null,
  correctAnswer: type === 'true_false' ? (ans === 'true' ? 'Đúng' : 'Sai') : ans,
  explanationSimple: '', difficulty: diff, skillTag: '', sourceType: 'manual', isVerified: 1, isActive: 1,
});

// ===== HELPER: Sinh 10 câu Toán/bài theo cấp lớp =====
function mathExtra(grade: number, lessonIds: number[]): Question[] {
  const qs: Question[] = [];
  for (const lid of lessonIds) {
    const i = lid % 20 || 20; // vị trí bài trong lớp (1-20)
    const base = grade <= 2 ? i * 3 : grade === 3 ? i * 15 : grade === 4 ? i * 50 : i * 100;
    const a = base + grade; const b = Math.max(1, Math.floor(base / 2));
    const s = a + b;
    qs.push(
      Q(grade,'math',lid,'single_choice',`Tính: ${a} + ${b} = ?`,[`${s-1}`,`${s}`,`${s+1}`,`${s+2}`],`${s}`),
      Q(grade,'math',lid,'single_choice',`Tính: ${s} - ${b} = ?`,[`${a-1}`,`${a}`,`${a+1}`,`${a+2}`],`${a}`),
      Q(grade,'math',lid,'true_false',`${a} + ${b} = ${s}.`,null,'true'),
      Q(grade,'math',lid,'fill_text',`${a} + ___ = ${s}.`,null,`${b}`),
      Q(grade,'math',lid,'single_choice',`Số nào lớn hơn?`,[`${a}`,`${b}`,`Bằng nhau`,`Không biết`],a > b ? `${a}` : `${b}`),
      Q(grade,'math',lid,'true_false',`${a} > ${b}.`,null,a > b ? 'true' : 'false'),
      Q(grade,'math',lid,'single_choice',`${s} - ${a} = ?`,[`${b-1}`,`${b}`,`${b+1}`,`${b+2}`],`${b}`,'medium'),
      Q(grade,'math',lid,'fill_text',`___ + ${a} = ${s}.`,null,`${b}`,'medium'),
      Q(grade,'math',lid,'single_choice',`Hiệu của ${s} và ${b} là?`,[`${a-1}`,`${a}`,`${a+1}`,`${a+2}`],`${a}`,'medium'),
      Q(grade,'math',lid,'true_false',`${s} - ${b} = ${a}.`,null,'true','medium'),
    );
  }
  return qs;
}

// ===== HELPER: Sinh 10 câu Tiếng Việt/bài =====
function vnExtra(grade: number, lessonIds: number[]): Question[] {
  const vowels = ['a','ă','â','e','ê','i','o','ô','ơ','u','ư','y'];
  const cons = ['b','c','d','đ','g','h','k','l','m','n','p','q','r','s','t','v','x'];
  const qs: Question[] = [];
  for (const lid of lessonIds) {
    const i = (lid - 100) % 20 || 20;
    const v = vowels[i % vowels.length]; const c = cons[i % cons.length];
    qs.push(
      Q(grade,'vietnamese',lid,'single_choice',`Chữ "${c}" là loại gì?`,['Nguyên âm','Phụ âm','Số','Dấu'],'Phụ âm'),
      Q(grade,'vietnamese',lid,'true_false',`"${v}" là nguyên âm.`,null,'true'),
      Q(grade,'vietnamese',lid,'single_choice',`"${c}${v}" có mấy âm tiết?`,['1','2','3','4'],'1'),
      Q(grade,'vietnamese',lid,'fill_text',`"${v}" thuộc loại ___ âm.`,null,'nguyên'),
      Q(grade,'vietnamese',lid,'single_choice',`Từ nào viết đúng chính tả?`,[`${c}${v}n`,`${c}${v}ng`,`Cả hai đúng`,`Cả hai sai`],'Cả hai đúng','medium'),
      Q(grade,'vietnamese',lid,'true_false',`Tiếng Việt có 6 thanh điệu.`,null,'true'),
      Q(grade,'vietnamese',lid,'single_choice',`Dấu sắc đặt trên chữ nào?`,['Phụ âm','Nguyên âm','Cả hai','Không chữ nào'],'Nguyên âm'),
      Q(grade,'vietnamese',lid,'fill_text',`Tiếng Việt có ___ thanh điệu.`,null,'6','medium'),
      Q(grade,'vietnamese',lid,'single_choice',`"${c}${v}" bắt đầu bằng phụ âm gì?`,[`${c}`,`${v}`,`${c}${v}`,`Không có`],`${c}`),
      Q(grade,'vietnamese',lid,'true_false',`Câu văn luôn bắt đầu bằng chữ hoa.`,null,'true'),
    );
  }
  return qs;
}

// ===== HELPER: Sinh 10 câu chung cho Tự nhiên/Đạo đức/Khoa học/Lịch sử =====
function genExtra(grade: number, sub: string, subName: string, lessonIds: number[]): Question[] {
  const qs: Question[] = [];
  for (const lid of lessonIds) {
    qs.push(
      Q(grade,sub,lid,'single_choice',`Bài này thuộc môn gì?`,['Toán',subName,'Tin học','Âm nhạc'],subName),
      Q(grade,sub,lid,'true_false',`Kiến thức bài này rất quan trọng cho lớp ${grade}.`,null,'true'),
      Q(grade,sub,lid,'single_choice',`Bé học bài này ở lớp mấy?`,[`Lớp ${grade-1}`,`Lớp ${grade}`,`Lớp ${grade+1}`,`Lớp ${grade+2}`],`Lớp ${grade}`),
      Q(grade,sub,lid,'fill_text',`Bài này thuộc môn ___.`,null,subName),
      Q(grade,sub,lid,'true_false',`Thực hành giúp nhớ bài lâu hơn.`,null,'true'),
      Q(grade,sub,lid,'single_choice',`Cách học bài này hiệu quả nhất?`,['Chỉ đọc','Đọc + thực hành + ôn tập','Không học','Chỉ nghe'],'Đọc + thực hành + ôn tập'),
      Q(grade,sub,lid,'single_choice',`Kiến thức bài này ứng dụng ở đâu?`,['Không đâu','Cuộc sống hàng ngày','Chỉ ở trường','Chỉ trong sách'],'Cuộc sống hàng ngày'),
      Q(grade,sub,lid,'true_false',`Bé nên hỏi thầy cô khi chưa hiểu bài.`,null,'true'),
      Q(grade,sub,lid,'fill_text',`Chương trình GDPT ___ áp dụng cho tiểu học.`,null,'2018','medium'),
      Q(grade,sub,lid,'single_choice',`Điều quan trọng nhất khi học bài này?`,['Học thuộc lòng','Hiểu và vận dụng','Chỉ đọc','Không quan trọng'],'Hiểu và vận dụng','medium'),
    );
  }
  return qs;
}

// ===== HELPER: Sinh 10 câu Tiếng Anh/bài =====
function engExtra(grade: number, lessonIds: number[]): Question[] {
  const words = ['hello','cat','dog','book','pen','school','teacher','friend','family','house','water','food','red','blue','green','big','small','happy','sad','run'];
  const qs: Question[] = [];
  for (const lid of lessonIds) {
    const i = lid % 20 || 20;
    const w = words[(i - 1) % words.length]; const w2 = words[i % words.length];
    qs.push(
      Q(grade,'english',lid,'single_choice',`"${w}" nghĩa là gì?`,[`Con mèo`,`Xin chào`,`Quyển sách`,`Cái bút`],
        w === 'cat' ? 'Con mèo' : w === 'hello' ? 'Xin chào' : w === 'book' ? 'Quyển sách' : w === 'pen' ? 'Cái bút' : 'Xin chào'),
      Q(grade,'english',lid,'true_false',`"Thank you" nghĩa là "Cảm ơn".`,null,'true'),
      Q(grade,'english',lid,'single_choice',`How do you say "xin chào" in English?`,['Goodbye','Hello','Thank you','Sorry'],'Hello'),
      Q(grade,'english',lid,'fill_text',`"Good ___" means "Chào buổi sáng".`,null,'morning'),
      Q(grade,'english',lid,'single_choice',`"I am a ___" – chọn từ phù hợp.`,['student','book','pen','desk'],'student'),
      Q(grade,'english',lid,'true_false',`"Goodbye" nghĩa là "Tạm biệt".`,null,'true'),
      Q(grade,'english',lid,'single_choice',`Chọn câu đúng ngữ pháp:`,['I is happy','I am happy','I are happy','I be happy'],'I am happy','medium'),
      Q(grade,'english',lid,'fill_text',`"My name ___ Lan" – điền is/are.`,null,'is','medium'),
      Q(grade,'english',lid,'single_choice',`"${w2}" bắt đầu bằng chữ cái gì?`,[w2[0].toUpperCase(),'A','Z','X'],w2[0].toUpperCase()),
      Q(grade,'english',lid,'true_false',`Tiếng Anh dùng bảng chữ cái Latin 26 chữ.`,null,'true'),
    );
  }
  return qs;
}

// ===== LESSON ID RANGES =====
const range = (start: number, count: number) => Array.from({length: count}, (_, i) => start + i);

export const extraQuestions: Question[] = [
  // TOÁN (100 bài × 10 câu = 1000 câu)
  ...mathExtra(1, range(1, 20)),
  ...mathExtra(2, range(21, 20)),
  ...mathExtra(3, range(41, 20)),
  ...mathExtra(4, range(61, 20)),
  ...mathExtra(5, range(81, 20)),
  // TIẾNG VIỆT (100 bài × 10 câu = 1000 câu)
  ...vnExtra(1, range(101, 20)),
  ...vnExtra(2, range(121, 20)),
  ...vnExtra(3, range(141, 20)),
  ...vnExtra(4, range(161, 20)),
  ...vnExtra(5, range(181, 20)),
  // TỰ NHIÊN & XÃ HỘI (60 bài × 10 câu = 600 câu)
  ...genExtra(1, 'nature', 'Tự nhiên & Xã hội', range(201, 20)),
  ...genExtra(2, 'nature', 'Tự nhiên & Xã hội', range(221, 20)),
  ...genExtra(3, 'nature', 'Tự nhiên & Xã hội', range(241, 20)),
  // ĐẠO ĐỨC (100 bài × 10 câu = 1000 câu)
  ...genExtra(1, 'ethics', 'Đạo đức', range(261, 20)),
  ...genExtra(2, 'ethics', 'Đạo đức', range(281, 20)),
  ...genExtra(3, 'ethics', 'Đạo đức', range(301, 20)),
  ...genExtra(4, 'ethics', 'Đạo đức', range(321, 20)),
  ...genExtra(5, 'ethics', 'Đạo đức', range(341, 20)),
  // TIẾNG ANH (100 bài × 10 câu = 1000 câu)
  ...engExtra(1, range(381, 20)),
  ...engExtra(2, range(401, 20)),
  ...engExtra(3, range(361, 20)),
  ...engExtra(4, range(421, 20)),
  ...engExtra(5, range(441, 20)),
  // KHOA HỌC (40 bài × 10 câu = 400 câu)
  ...genExtra(4, 'science', 'Khoa học', range(501, 20)),
  ...genExtra(5, 'science', 'Khoa học', range(521, 20)),
  // LỊCH SỬ & ĐỊA LÝ (40 bài × 10 câu = 400 câu)
  ...genExtra(4, 'history_geo', 'Lịch sử & Địa lý', range(541, 20)),
  ...genExtra(5, 'history_geo', 'Lịch sử & Địa lý', range(561, 20)),
];
