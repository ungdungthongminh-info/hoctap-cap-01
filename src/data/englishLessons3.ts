/**
 * TIẾNG ANH LỚP 3 — 20 bài (GDPT 2018)
 * 5 chương: Greetings, Family & Friends, Animals & Nature, School & Activities, Review & Fun
 */
import type { Lesson } from './seedData';

let sid = 0;
const L = (
  unit: string, code: string, title: string, obj: string, summary: string,
  tips: string, diff: 'easy' | 'medium' | 'hard', mins: number,
): Lesson => ({
  id: 400 + (++sid),
  grade: 3,
  subjectCode: 'english',
  unitCode: unit,
  lessonCode: code,
  title,
  objective: obj,
  summarySimple: summary,
  tips,
  difficulty: diff,
  estimatedMinutes: mins,
  status: 'ready',
  sortOrder: sid,
  isActive: 1,
});

export const englishLessons3: Lesson[] = [
  // ===== CHƯƠNG 1: Greetings & Introduction (4 bài) =====
  L('C1', 'EN3-01', 'Hello! What\'s your name?',
    'Chào hỏi và tự giới thiệu tên bằng tiếng Anh',
    'Học cách chào hỏi: Hello, Hi, My name is..., What\'s your name?',
    'Tập nói trước gương: Hello! My name is...', 'easy', 8),

  L('C1', 'EN3-02', 'How are you?',
    'Hỏi thăm sức khỏe: How are you? I\'m fine, thank you',
    'Học hỏi và trả lời về sức khỏe: fine, good, great, so-so',
    'Hỏi bạn mỗi ngày: How are you today?', 'easy', 8),

  L('C1', 'EN3-03', 'Good morning! Good night!',
    'Chào theo thời gian trong ngày',
    'Good morning, Good afternoon, Good evening, Good night, Goodbye',
    'Chào bố mẹ bằng tiếng Anh mỗi sáng!', 'easy', 8),

  L('C1', 'EN3-04', 'Numbers 1-10',
    'Đếm số từ 1 đến 10 bằng tiếng Anh',
    'One, two, three... ten. How many? Đếm đồ vật xung quanh',
    'Đếm ngón tay bằng tiếng Anh!', 'easy', 10),

  // ===== CHƯƠNG 2: Family & Friends (4 bài) =====
  L('C2', 'EN3-05', 'My Family',
    'Giới thiệu các thành viên gia đình',
    'Father, mother, brother, sister, grandpa, grandma. This is my...',
    'Chỉ vào ảnh gia đình và nói: This is my mother', 'easy', 10),

  L('C2', 'EN3-06', 'He is / She is',
    'Dùng He is và She is để miêu tả người',
    'He is my father. She is my mother. He/She is tall, short, happy',
    'Miêu tả bạn bè: He is funny! She is kind!', 'easy', 10),

  L('C2', 'EN3-07', 'How old are you?',
    'Hỏi và trả lời tuổi',
    'How old are you? I\'m eight years old. How old is he/she?',
    'Hỏi tuổi các bạn trong lớp!', 'easy', 8),

  L('C2', 'EN3-08', 'My Best Friend',
    'Miêu tả bạn thân',
    'My friend is... He/She likes... We play together.',
    'Viết 3 câu về bạn thân bằng tiếng Anh', 'medium', 10),

  // ===== CHƯƠNG 3: Animals & Nature (4 bài) =====
  L('C3', 'EN3-09', 'Animals I Know',
    'Tên các con vật quen thuộc',
    'Cat, dog, bird, fish, rabbit, elephant, lion, monkey',
    'Chỉ vào con vật và nói tiếng Anh!', 'easy', 10),

  L('C3', 'EN3-10', 'I like cats!',
    'Nói về sở thích con vật: I like / I don\'t like',
    'I like dogs. I don\'t like snakes. Do you like cats? Yes/No',
    'Hỏi bạn: Do you like...?', 'easy', 10),

  L('C3', 'EN3-11', 'Colors everywhere',
    'Tên các màu sắc bằng tiếng Anh',
    'Red, blue, green, yellow, orange, pink, purple, black, white, brown',
    'Chỉ vào đồ vật: This is red! That is blue!', 'easy', 8),

  L('C3', 'EN3-12', 'What color is it?',
    'Hỏi và trả lời về màu sắc',
    'What color is the cat? It\'s orange. The sky is blue.',
    'Tô màu tranh và nói tên màu bằng tiếng Anh', 'easy', 10),

  // ===== CHƯƠNG 4: School & Activities (4 bài) =====
  L('C4', 'EN3-13', 'My Classroom',
    'Đồ vật trong lớp học',
    'Book, pen, pencil, ruler, eraser, bag, desk, chair, board',
    'Dán nhãn tiếng Anh lên đồ dùng học tập!', 'easy', 10),

  L('C4', 'EN3-14', 'This is a / That is a',
    'Dùng This is / That is để chỉ đồ vật',
    'This is a pen. That is a book. Is this a ruler? Yes/No',
    'Chỉ đồ vật gần-xa và nói This/That', 'medium', 10),

  L('C4', 'EN3-15', 'I can sing!',
    'Nói về khả năng: I can / I can\'t',
    'I can run, swim, sing, dance, draw. I can\'t fly. Can you...?',
    'Liệt kê 5 thứ con làm được bằng tiếng Anh!', 'medium', 10),

  L('C4', 'EN3-16', 'Days of the week',
    'Các ngày trong tuần bằng tiếng Anh',
    'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday',
    'Mỗi sáng nói: Today is...!', 'medium', 10),

  // ===== CHƯƠNG 5: Review & Fun (4 bài) =====
  L('C5', 'EN3-17', 'Let\'s eat! Food I like',
    'Tên các món ăn và thức uống',
    'Rice, bread, milk, juice, apple, banana, chicken, noodles',
    'Nói tên món ăn bằng tiếng Anh khi ăn cơm!', 'medium', 10),

  L('C5', 'EN3-18', 'I\'m happy! Feelings',
    'Tên các cảm xúc bằng tiếng Anh',
    'Happy, sad, angry, tired, hungry, thirsty, scared, excited',
    'Mỗi ngày nói: I\'m happy / I\'m tired', 'medium', 8),

  L('C5', 'EN3-19', 'Alphabet Song A-Z',
    'Ôn bảng chữ cái tiếng Anh',
    'A B C D E F G... 26 chữ cái. Phát âm đúng từng chữ',
    'Hát bài ABC song mỗi ngày!', 'easy', 10),

  L('C5', 'EN3-20', 'Let\'s review! Big Quiz',
    'Ôn tập tổng hợp tất cả bài đã học',
    'Quiz tổng hợp: Greetings, Family, Animals, Colors, School, Food',
    'Thử đạt 100% bài ôn tập này nhé!', 'hard', 15),
];
