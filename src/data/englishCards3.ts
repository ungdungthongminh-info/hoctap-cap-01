/**
 * TIẾNG ANH LỚP 3 — 80 thẻ học (4 thẻ/bài × 20 bài)
 */
import type { LessonCard } from './seedData';

let cid = 800;
const C = (
  lessonId: number, type: LessonCard['cardType'], title: string, content: string, sort: number, example?: string,
): LessonCard => ({
  id: ++cid, lessonId, cardType: type, title, content,
  exampleJson: example || null, sortOrder: sort, isActive: 1,
});

export const englishCards3: LessonCard[] = [
  // Lesson 401: Hello! What's your name?
  C(401, 'intro', 'Let\'s say Hello! 👋', 'Khi gặp ai, chúng ta nói "Hello!" hoặc "Hi!" để chào. Sau đó giới thiệu tên: "My name is..."', 1),
  C(401, 'explain', 'Cách chào hỏi', '"Hello!" = Xin chào! "Hi!" = Chào! "My name is Minh" = Tên tôi là Minh. "What\'s your name?" = Bạn tên gì?', 2),
  C(401, 'example', 'Hội thoại mẫu', '— Hello! My name is Lan. What\'s your name?\n— Hi! My name is Minh. Nice to meet you!\n— Nice to meet you too!', 3),
  C(401, 'tip', 'Mẹo nhớ 💡', 'Tập nói "Hello, my name is..." trước gương mỗi ngày. Nhớ cười khi chào nhé! 😊', 4),

  // Lesson 402: How are you?
  C(402, 'intro', 'How are you? 😊', 'Sau khi chào, người ta hay hỏi "How are you?" (Bạn khỏe không?)', 1),
  C(402, 'explain', 'Cách trả lời', '"I\'m fine, thank you!" = Tôi khỏe, cảm ơn! "I\'m good!" = Tôi tốt! "I\'m great!" = Tôi rất tốt! "So-so" = Bình thường', 2),
  C(402, 'example', 'Hội thoại mẫu', '— Hi Lan! How are you?\n— I\'m fine, thank you! And you?\n— I\'m great!', 3),
  C(402, 'tip', 'Mẹo nhớ 💡', 'Hỏi bố mẹ mỗi sáng: "Good morning! How are you?" — họ sẽ rất vui!', 4),

  // Lesson 403: Good morning! Good night!
  C(403, 'intro', 'Chào theo giờ 🌅', 'Tiếng Anh có nhiều cách chào tùy thời gian trong ngày!', 1),
  C(403, 'explain', 'Các cách chào', 'Sáng: "Good morning!" ☀️\nTrưa/chiều: "Good afternoon!" 🌤️\nTối: "Good evening!" 🌆\nĐi ngủ: "Good night!" 🌙\nTạm biệt: "Goodbye!" / "Bye bye!" 👋', 2),
  C(403, 'example', 'Khi nào nói gì?', '7:00 AM → Good morning!\n2:00 PM → Good afternoon!\n7:00 PM → Good evening!\n9:00 PM → Good night!', 3),
  C(403, 'tip', 'Mẹo nhớ 💡', 'Morning = có MOR (sáng mờ sương). Night = có NIGHT (đêm tối). Afternoon = AFTER noon (sau 12 giờ trưa)', 4),

  // Lesson 404: Numbers 1-10
  C(404, 'intro', 'Counting! 🔢', 'Hãy đếm bằng tiếng Anh nào!', 1),
  C(404, 'explain', 'Các số 1-10', '1 = One 🖐️, 2 = Two ✌️, 3 = Three, 4 = Four, 5 = Five ✋\n6 = Six, 7 = Seven, 8 = Eight, 9 = Nine, 10 = Ten 🤟', 2),
  C(404, 'example', 'How many?', 'How many apples? 🍎🍎🍎 → Three apples!\nHow many cats? 🐱🐱 → Two cats!', 3),
  C(404, 'tip', 'Mẹo nhớ 💡', 'Đếm ngón tay mỗi ngày: One, two, three... ten! Đếm bậc cầu thang khi đi lên!', 4),

  // Lesson 405: My Family
  C(405, 'intro', 'Family! 👨‍👩‍👧‍👦', 'Hãy giới thiệu gia đình bằng tiếng Anh!', 1),
  C(405, 'explain', 'Thành viên gia đình', 'Father/Dad = Bố 👨\nMother/Mom = Mẹ 👩\nBrother = Anh/Em trai 👦\nSister = Chị/Em gái 👧\nGrandpa = Ông 👴\nGrandma = Bà 👵', 2),
  C(405, 'example', 'This is my...', 'This is my father. He is kind.\nThis is my mother. She is beautiful.\nThis is my brother. He is fun!', 3),
  C(405, 'tip', 'Mẹo nhớ 💡', 'Chỉ vào từng người trong ảnh gia đình và nói: "This is my..."', 4),

  // Lesson 406: He is / She is
  C(406, 'intro', 'He & She 👫', 'He = anh ấy/bạn ấy (nam). She = cô ấy/bạn ấy (nữ)', 1),
  C(406, 'explain', 'Cách dùng He/She', 'He is tall. = Anh ấy cao.\nShe is short. = Cô ấy thấp.\nHe is happy. = Anh ấy vui.\nShe is kind. = Cô ấy tốt bụng.', 2),
  C(406, 'example', 'Miêu tả bạn ❤️', 'My friend is Nam. He is funny.\nMy friend is Lan. She is smart.\nThey are my best friends!', 3),
  C(406, 'tip', 'Mẹo nhớ 💡', 'HE = nam (👦), SHE = nữ (👧). Nhớ: SHE có chữ S như Sister!', 4),

  // Lesson 407: How old are you?
  C(407, 'intro', 'How old? 🎂', 'Cách hỏi tuổi bằng tiếng Anh', 1),
  C(407, 'explain', 'Hỏi và trả lời tuổi', '"How old are you?" = Bạn bao nhiêu tuổi?\n"I\'m eight years old." = Mình 8 tuổi.\n"How old is she?" = Cô ấy bao nhiêu tuổi?\n"She is nine." = Cô ấy 9 tuổi.', 2),
  C(407, 'example', 'Hội thoại mẫu', '— How old are you, Minh?\n— I\'m eight years old!\n— How old is your sister?\n— She is five years old.', 3),
  C(407, 'tip', 'Mẹo nhớ 💡', 'OLD = già/tuổi. How OLD are you? Dùng số đã học ở Bài 4!', 4),

  // Lesson 408: My Best Friend
  C(408, 'intro', 'Best friend! 🤝', 'Miêu tả bạn thân bằng tiếng Anh', 1),
  C(408, 'explain', 'Các từ miêu tả', 'kind = tốt bụng, smart = thông minh, funny = vui tính\ntall = cao, short = thấp, friendly = thân thiện', 2),
  C(408, 'example', 'Bài viết mẫu', 'My best friend is Hoa. She is eight years old.\nShe is kind and smart. She likes cats.\nWe play together every day!', 3),
  C(408, 'tip', 'Mẹo nhớ 💡', 'Viết 3 câu về bạn thân: 1. Tên + tuổi, 2. Tính cách, 3. Sở thích', 4),

  // Lesson 409: Animals I Know
  C(409, 'intro', 'Animals! 🐾', 'Tên con vật bằng tiếng Anh', 1),
  C(409, 'explain', 'Các con vật', 'Cat 🐱 = Mèo, Dog 🐶 = Chó, Bird 🐦 = Chim, Fish 🐟 = Cá\nRabbit 🐰 = Thỏ, Elephant 🐘 = Voi, Lion 🦁 = Sư tử, Monkey 🐒 = Khỉ', 2),
  C(409, 'example', 'What is this?', 'What is this? It\'s a cat! 🐱\nWhat is that? It\'s an elephant! 🐘\nLook! A bird! 🐦', 3),
  C(409, 'tip', 'Mẹo nhớ 💡', 'Dùng emoji hoặc hình vẽ để nhớ: 🐱 Cat, 🐶 Dog. Vẽ con vật + viết tên!', 4),

  // Lesson 410: I like cats!
  C(410, 'intro', 'I like / I don\'t like ❤️', 'Nói về sở thích con vật', 1),
  C(410, 'explain', 'Cách nói thích/không thích', '"I like cats." = Tôi thích mèo.\n"I don\'t like snakes." = Tôi không thích rắn.\n"Do you like dogs?" = Bạn thích chó không?\n"Yes, I do!" / "No, I don\'t."', 2),
  C(410, 'example', 'Hỏi bạn bè', '— Do you like rabbits?\n— Yes, I do! I like rabbits. They\'re cute!\n— Do you like spiders?\n— No, I don\'t! 😱', 3),
  C(410, 'tip', 'Mẹo nhớ 💡', 'LIKE = thích ❤️, DON\'T LIKE = không thích ❌. Hỏi bạn: Do you like...?', 4),

  // Lesson 411: Colors everywhere
  C(411, 'intro', 'Colors! 🌈', 'Tên các màu sắc bằng tiếng Anh', 1),
  C(411, 'explain', 'Bảng màu', 'Red 🔴 = Đỏ, Blue 🔵 = Xanh dương, Green 🟢 = Xanh lá\nYellow 🟡 = Vàng, Orange 🟠 = Cam, Pink 🩷 = Hồng\nPurple 🟣 = Tím, Black ⚫ = Đen, White ⚪ = Trắng, Brown 🟤 = Nâu', 2),
  C(411, 'example', 'I see colors!', 'The apple is red. 🍎\nThe sky is blue. 🌤️\nThe grass is green. 🌿\nThe sun is yellow. ☀️', 3),
  C(411, 'tip', 'Mẹo nhớ 💡', 'Khi tô màu, đọc tên màu bằng tiếng Anh: "I use RED!"', 4),

  // Lesson 412: What color is it?
  C(412, 'intro', 'What color? 🎨', 'Hỏi về màu sắc', 1),
  C(412, 'explain', 'Cách hỏi màu', '"What color is it?" = Nó màu gì?\n"It\'s red." = Nó màu đỏ.\n"What color is the cat?" = Con mèo màu gì?\n"It\'s orange." = Nó màu cam.', 2),
  C(412, 'example', 'Color game!', '— What color is the banana? → It\'s yellow! 🍌\n— What color is the sky? → It\'s blue! 🌤️\n— What color is the frog? → It\'s green! 🐸', 3),
  C(412, 'tip', 'Mẹo nhớ 💡', 'Chơi trò: chỉ vào đồ vật xung quanh và hỏi "What color is this?"', 4),

  // Lesson 413: My Classroom
  C(413, 'intro', 'Classroom! 📚', 'Đồ vật trong lớp học bằng tiếng Anh', 1),
  C(413, 'explain', 'Đồ dùng học tập', 'Book 📕 = Sách, Pen 🖊️ = Bút, Pencil ✏️ = Bút chì\nRuler 📏 = Thước, Eraser = Gôm, Bag 🎒 = Cặp\nDesk = Bàn, Chair = Ghế, Board = Bảng', 2),
  C(413, 'example', 'In my bag...', 'In my bag, I have a book, two pencils, and an eraser.\nOn my desk, there is a ruler.\nThe board is white.', 3),
  C(413, 'tip', 'Mẹo nhớ 💡', 'Dán nhãn tiếng Anh lên đồ dùng: BOOK trên sách, PEN trên bút!', 4),

  // Lesson 414: This is a / That is a
  C(414, 'intro', 'This & That 👆', 'This = cái này (gần). That = cái kia (xa)', 1),
  C(414, 'explain', 'Cách dùng', '"This is a pen." = Đây là cây bút. (gần bạn)\n"That is a clock." = Kia là cái đồng hồ. (xa bạn)\nHỏi: "Is this a book?" → "Yes, it is." / "No, it isn\'t."', 2),
  C(414, 'example', 'Thực hành', '(Cầm bút) This is a pen. ✏️\n(Chỉ bảng xa) That is a board.\n— Is this an eraser? — Yes, it is!', 3),
  C(414, 'tip', 'Mẹo nhớ 💡', 'THIS = gần (tHIS tay). THAT = xa (THAT xa tít). Chỉ gần → This, chỉ xa → That', 4),

  // Lesson 415: I can sing!
  C(415, 'intro', 'I can! 💪', 'Nói về khả năng bằng tiếng Anh', 1),
  C(415, 'explain', 'Can / Can\'t', '"I can swim." = Tôi biết bơi. 🏊\n"I can\'t fly." = Tôi không biết bay. ✈️\n"Can you dance?" = Bạn biết nhảy không?\n"Yes, I can!" / "No, I can\'t."', 2),
  C(415, 'example', 'What can you do?', 'I can run! 🏃 I can sing! 🎤\nI can draw! 🎨 I can read! 📖\nI can\'t fly... but I can dream! ✨', 3),
  C(415, 'tip', 'Mẹo nhớ 💡', 'CAN = có thể. Liệt kê: I can run, swim, sing, dance, draw, read, write!', 4),

  // Lesson 416: Days of the week
  C(416, 'intro', 'Days! 📅', 'Các ngày trong tuần bằng tiếng Anh', 1),
  C(416, 'explain', '7 ngày trong tuần', 'Monday = Thứ Hai 📘\nTuesday = Thứ Ba\nWednesday = Thứ Tư\nThursday = Thứ Năm\nFriday = Thứ Sáu 🎉\nSaturday = Thứ Bảy\nSunday = Chủ Nhật ☀️', 2),
  C(416, 'example', 'What day is today?', '— What day is today?\n— Today is Monday!\n— What day is tomorrow?\n— Tomorrow is Tuesday!', 3),
  C(416, 'tip', 'Mẹo nhớ 💡', 'Hát: Monday Tuesday Wednesday Thursday Friday Saturday Sunday! Mỗi sáng nói: Today is...', 4),

  // Lesson 417: Let's eat! Food I like
  C(417, 'intro', 'Yummy food! 🍕', 'Tên đồ ăn và thức uống', 1),
  C(417, 'explain', 'Food & Drinks', 'Rice 🍚 = Cơm, Bread 🍞 = Bánh mì, Noodles 🍜 = Mì\nChicken 🍗 = Gà, Fish 🐟 = Cá, Egg 🥚 = Trứng\nMilk 🥛 = Sữa, Juice 🧃 = Nước ép, Water 💧 = Nước', 2),
  C(417, 'example', 'I like...', '— What do you like?\n— I like rice and chicken! 🍚🍗\n— Do you like milk?\n— Yes, I do! Milk is yummy! 🥛', 3),
  C(417, 'tip', 'Mẹo nhớ 💡', 'Khi ăn cơm, nói tên món bằng tiếng Anh: "Yummy chicken!"', 4),

  // Lesson 418: I'm happy! Feelings
  C(418, 'intro', 'Feelings! 😊😢', 'Tên cảm xúc bằng tiếng Anh', 1),
  C(418, 'explain', 'Các cảm xúc', 'Happy 😊 = Vui, Sad 😢 = Buồn, Angry 😠 = Giận\nTired 😴 = Mệt, Hungry 🤤 = Đói, Thirsty = Khát\nScared 😰 = Sợ, Excited 🤩 = Phấn khích', 2),
  C(418, 'example', 'How do you feel?', '— How do you feel?\n— I\'m happy! 😊\n— Why are you sad?\n— Because it\'s raining. ☔', 3),
  C(418, 'tip', 'Mẹo nhớ 💡', 'Mỗi ngày tự hỏi: "How do I feel today?" rồi trả lời bằng tiếng Anh!', 4),

  // Lesson 419: Alphabet Song A-Z
  C(419, 'intro', 'ABC Song! 🎵', 'Ôn 26 chữ cái tiếng Anh', 1),
  C(419, 'explain', '26 chữ cái', 'A B C D E F G\nH I J K L M N\nO P Q R S T U\nV W X Y Z\nNow I know my ABCs!', 2),
  C(419, 'example', 'Spell your name!', 'My name is MINH: M - I - N - H\nSpell CAT: C - A - T\nSpell DOG: D - O - G', 3),
  C(419, 'tip', 'Mẹo nhớ 💡', 'Hát ABC song mỗi ngày! Tập đánh vần tên mình bằng tiếng Anh', 4),

  // Lesson 420: Let's review! Big Quiz
  C(420, 'intro', 'Big Quiz Time! 🏆', 'Ôn tập tất cả đã học - sẵn sàng chưa?', 1),
  C(420, 'explain', 'Nội dung ôn tập', '✅ Chào hỏi: Hello, How are you?\n✅ Gia đình: Father, Mother...\n✅ Con vật & Màu sắc\n✅ Đồ dùng & Hoạt động\n✅ Số đếm & Ngày trong tuần', 2),
  C(420, 'example', 'Quick review!', 'Hello! → Xin chào!\nHow are you? → Bạn khỏe không?\nI like cats → Tôi thích mèo\nI can swim → Tôi biết bơi', 3),
  C(420, 'tip', 'Mẹo nhớ 💡', 'Đọc lại tất cả flashcard. Cố đạt 100% bài quiz! Bạn làm được! 💪', 4),
];
