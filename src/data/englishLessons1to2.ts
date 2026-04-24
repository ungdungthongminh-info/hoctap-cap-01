/**
 * TIẾNG ANH LỚP 1–2 — 40 bài (20 bài × 2 lớp, GDPT 2018)
 * Lớp 1: Bảng chữ cái, chào hỏi, số đếm, màu sắc, gia đình
 * Lớp 2: Trường học, cơ thể, đồ ăn, thời tiết, sinh hoạt hàng ngày
 */
import type { Lesson } from './seedData';

let sid = 0;
const L = (
  grade: number, unit: string, code: string, title: string, obj: string,
  summary: string, tips: string, diff: 'easy' | 'medium' | 'hard', mins: number,
): Lesson => ({
  id: 460 + (++sid), grade, subjectCode: 'english', unitCode: unit, lessonCode: code,
  title, objective: obj, summarySimple: summary, tips,
  difficulty: diff, estimatedMinutes: mins, status: 'ready', sortOrder: sid, isActive: 1,
});

// ==================== LỚP 1 (20 bài) ====================
export const englishLessons1: Lesson[] = [
  // C1: Chào hỏi & Bảng chữ cái
  L(1, 'C1', 'EN1-01', 'Hello! Hi!', 'Chào hỏi đơn giản bằng tiếng Anh', 'Học nói Hello, Hi, Bye bye', 'Cùng bé vẫy tay và nói Hello mỗi sáng!', 'easy', 8),
  L(1, 'C1', 'EN1-02', 'Letters A-F', 'Nhận biết chữ cái A đến F', 'Học 6 chữ cái đầu tiên: A B C D E F', 'Hát bài ABC song cùng bé mỗi ngày', 'easy', 8),
  L(1, 'C1', 'EN1-03', 'Letters G-L', 'Nhận biết chữ cái G đến L', 'Học tiếp 6 chữ: G H I J K L', 'Viết chữ lên bảng hoặc giấy cùng bé', 'easy', 8),
  L(1, 'C1', 'EN1-04', 'Letters M-R', 'Nhận biết chữ cái M đến R', 'Học tiếp 6 chữ: M N O P Q R', 'Cho bé tìm chữ cái trong sách/báo', 'easy', 8),
  // C2: Số đếm & Màu sắc
  L(1, 'C2', 'EN1-05', 'Letters S-Z', 'Nhận biết chữ cái S đến Z', 'Hoàn thành bảng chữ cái: S T U V W X Y Z', 'Đọc to bảng chữ cái mỗi ngày!', 'easy', 8),
  L(1, 'C2', 'EN1-06', 'Numbers 1-5', 'Đếm từ 1 đến 5 bằng tiếng Anh', 'One, Two, Three, Four, Five', 'Đếm ngón tay: one, two, three...', 'easy', 8),
  L(1, 'C2', 'EN1-07', 'Numbers 6-10', 'Đếm từ 6 đến 10 bằng tiếng Anh', 'Six, Seven, Eight, Nine, Ten', 'Đếm đồ chơi bằng tiếng Anh', 'easy', 8),
  L(1, 'C2', 'EN1-08', 'Colors: Red Blue Yellow', 'Học tên 3 màu cơ bản', 'Red = đỏ, Blue = xanh dương, Yellow = vàng', 'Chỉ vào đồ vật và hỏi "What color?"', 'easy', 8),
  // C3: Gia đình
  L(1, 'C3', 'EN1-09', 'Colors: Green Orange Pink', 'Học thêm 3 màu sắc', 'Green = xanh lá, Orange = cam, Pink = hồng', 'Tô màu tranh và nói tên màu bằng tiếng Anh', 'easy', 8),
  L(1, 'C3', 'EN1-10', 'My Family: Dad & Mom', 'Gọi bố mẹ bằng tiếng Anh', 'Dad/Father = Bố, Mom/Mother = Mẹ', 'Gọi bố mẹ bằng tiếng Anh mỗi ngày', 'easy', 8),
  L(1, 'C3', 'EN1-11', 'My Family: Brother & Sister', 'Gọi anh chị em bằng tiếng Anh', 'Brother = Anh/Em trai, Sister = Chị/Em gái', 'Giới thiệu gia đình: This is my...', 'easy', 8),
  L(1, 'C3', 'EN1-12', 'I Love My Family ❤️', 'Nói về tình cảm gia đình', 'I love my dad. I love my mom.', 'Vẽ tranh gia đình và viết "I love..."', 'easy', 8),
  // C4: Động vật
  L(1, 'C4', 'EN1-13', 'Pets: Dog & Cat', 'Học tên thú cưng', 'Dog = con chó, Cat = con mèo, Fish = con cá', 'Cho bé xem tranh động vật và gọi tên', 'easy', 8),
  L(1, 'C4', 'EN1-14', 'Farm Animals', 'Học tên động vật ở nông trại', 'Cow = bò, Pig = lợn, Duck = vịt, Chicken = gà', 'Cùng bé bắt chước tiếng kêu động vật', 'easy', 8),
  L(1, 'C4', 'EN1-15', 'Fruits: Apple & Banana', 'Học tên trái cây', 'Apple = táo, Banana = chuối, Orange = cam', 'Khi ăn trái cây, nói tên bằng tiếng Anh', 'easy', 8),
  L(1, 'C4', 'EN1-16', 'Fruits & Vegetables', 'Học thêm tên rau quả', 'Mango = xoài, Grape = nho, Carrot = cà rốt', 'Đi chợ cùng mẹ và học tên rau quả', 'easy', 10),
  // C5: Hành động cơ bản
  L(1, 'C5', 'EN1-17', 'Stand Up! Sit Down!', 'Hiểu lệnh đơn giản trong lớp', 'Stand up = Đứng lên, Sit down = Ngồi xuống', 'Chơi trò Simon Says cùng bé', 'easy', 8),
  L(1, 'C5', 'EN1-18', 'Open & Close', 'Hiểu lệnh mở/đóng', 'Open your book = Mở sách, Close = Đóng lại', 'Thực hành: Open the door, Close the window', 'easy', 8),
  L(1, 'C5', 'EN1-19', 'Listen & Speak', 'Hiểu lệnh nghe/nói', 'Listen = Lắng nghe, Speak = Nói, Read = Đọc', 'Khen bé khi bé "Listen carefully!"', 'easy', 8),
  L(1, 'C5', 'EN1-20', 'Review: My First English!', 'Ôn tập toàn bộ Lớp 1', 'Ôn lại chữ cái, số đếm, màu sắc, gia đình, động vật', 'Cùng bé hát bài ABC và đếm 1-10!', 'easy', 10),
];

// ==================== LỚP 2 (20 bài) ====================
export const englishLessons2: Lesson[] = [
  // C1: Trường học
  L(2, 'C1', 'EN2-01', 'My Classroom', 'Học tên đồ vật trong lớp', 'Book = sách, Pen = bút, Desk = bàn, Chair = ghế', 'Hỏi bé: "What is this?" chỉ vào đồ vật', 'easy', 8),
  L(2, 'C1', 'EN2-02', 'School Things', 'Học thêm đồ dùng học tập', 'Ruler = thước, Eraser = cục tẩy, Bag = cặp sách', 'Chuẩn bị cặp sách cùng bé, gọi tên từng đồ', 'easy', 8),
  L(2, 'C1', 'EN2-03', 'My Teacher', 'Giới thiệu thầy cô', 'Teacher = thầy/cô giáo. This is my teacher.', 'Hỏi bé: "Who is your teacher?"', 'easy', 8),
  L(2, 'C1', 'EN2-04', 'In My School', 'Mô tả trường học', 'Classroom = lớp học, Library = thư viện, Playground = sân chơi', 'Cùng bé vẽ bản đồ trường và viết tên tiếng Anh', 'easy', 10),
  // C2: Cơ thể
  L(2, 'C2', 'EN2-05', 'My Face', 'Học tên bộ phận trên mặt', 'Eyes = mắt, Nose = mũi, Mouth = miệng, Ears = tai', 'Chơi trò: Touch your nose! Touch your eyes!', 'easy', 8),
  L(2, 'C2', 'EN2-06', 'My Body', 'Học tên bộ phận cơ thể', 'Head = đầu, Hand = tay, Leg = chân, Arm = cánh tay', 'Hát "Head Shoulders Knees and Toes"', 'easy', 8),
  L(2, 'C2', 'EN2-07', 'I Can Jump!', 'Nói về khả năng của mình', 'I can run. I can jump. I can swim.', 'Hỏi bé: "Can you jump?" → "Yes, I can!"', 'easy', 8),
  L(2, 'C2', 'EN2-08', 'How Do You Feel?', 'Diễn tả cảm xúc', 'Happy = vui, Sad = buồn, Hungry = đói, Tired = mệt', 'Hỏi bé mỗi tối: "How do you feel?"', 'easy', 10),
  // C3: Đồ ăn & Thức uống
  L(2, 'C3', 'EN2-09', 'Breakfast Time!', 'Học đồ ăn sáng', 'Bread = bánh mì, Egg = trứng, Milk = sữa', 'Khi ăn sáng, nói tên đồ ăn bằng tiếng Anh', 'easy', 8),
  L(2, 'C3', 'EN2-10', 'Yummy Lunch!', 'Học đồ ăn trưa', 'Rice = cơm, Chicken = thịt gà, Soup = canh', 'Cùng bé nấu ăn và gọi tên nguyên liệu', 'easy', 8),
  L(2, 'C3', 'EN2-11', 'Drinks & Snacks', 'Học đồ uống và bữa phụ', 'Water = nước, Juice = nước ép, Cake = bánh', 'Hỏi: "Do you want water or juice?"', 'easy', 8),
  L(2, 'C3', 'EN2-12', 'I Like / I Don\'t Like', 'Nói về sở thích ăn uống', 'I like rice. I don\'t like fish.', 'Cùng bé liệt kê: I like... I don\'t like...', 'easy', 10),
  // C4: Thời tiết & Quần áo
  L(2, 'C4', 'EN2-13', 'What\'s the Weather?', 'Học từ vựng thời tiết', 'Sunny = nắng, Rainy = mưa, Cloudy = nhiều mây', 'Mỗi sáng hỏi: "What\'s the weather today?"', 'easy', 8),
  L(2, 'C4', 'EN2-14', 'Hot & Cold', 'Mô tả nóng/lạnh', 'Hot = nóng, Cold = lạnh, Warm = ấm, Cool = mát', 'Ra ngoài và cảm nhận: "It\'s hot/cold today!"', 'easy', 8),
  L(2, 'C4', 'EN2-15', 'My Clothes', 'Học tên quần áo', 'Shirt = áo, Pants = quần, Shoes = giày, Hat = mũ', 'Khi thay đồ nói: "I wear my shirt"', 'easy', 8),
  L(2, 'C4', 'EN2-16', 'Getting Dressed', 'Mặc đồ phù hợp thời tiết', 'It\'s cold → I wear a jacket. It\'s sunny → I wear a hat.', 'Cùng bé chọn đồ mỗi sáng bằng tiếng Anh', 'easy', 10),
  // C5: Sinh hoạt hàng ngày
  L(2, 'C5', 'EN2-17', 'Good Morning Routine', 'Thói quen buổi sáng', 'Wake up, Brush teeth, Wash face, Eat breakfast', 'Cùng bé nói từng bước buổi sáng bằng tiếng Anh', 'easy', 8),
  L(2, 'C5', 'EN2-18', 'At School', 'Hoạt động ở trường', 'Study, Read, Write, Play with friends', 'Hỏi bé: "What did you do at school?"', 'easy', 8),
  L(2, 'C5', 'EN2-19', 'Evening Fun', 'Hoạt động buổi tối', 'Watch TV, Play games, Read a book, Go to sleep', 'Cùng bé đọc sách tiếng Anh trước khi ngủ', 'easy', 8),
  L(2, 'C5', 'EN2-20', 'Review: My English World!', 'Ôn tập toàn bộ Lớp 2', 'Ôn lại trường học, cơ thể, đồ ăn, thời tiết, sinh hoạt', 'Cùng bé tạo sổ tay từ vựng tiếng Anh!', 'easy', 10),
];
