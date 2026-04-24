/**
 * TIẾNG ANH LỚP 1–2 — 160 thẻ học (4 thẻ/bài × 40 bài)
 */
import type { LessonCard } from './seedData';

let cid = 2080;
const C = (
  lessonId: number, type: LessonCard['cardType'], title: string, content: string, sort: number,
): LessonCard => ({
  id: ++cid, lessonId, cardType: type, title, content,
  exampleJson: null, sortOrder: sort, isActive: 1,
});

export const englishCards1to2: LessonCard[] = [
  // ===== LỚP 1 =====
  // Lesson 461: Hello! Hi!
  C(461, 'intro', 'Say Hello! 👋', 'Khi gặp ai, em nói "Hello!" hoặc "Hi!" để chào nhé!', 1),
  C(461, 'explain', 'Cách chào', 'Hello! = Xin chào!\nHi! = Chào!\nBye bye! = Tạm biệt!\nGoodbye! = Tạm biệt!', 2),
  C(461, 'example', 'Hội thoại mẫu', '— Hello! 👋\n— Hi! 😊\n— Bye bye!\n— Goodbye!', 3),
  C(461, 'tip', 'Mẹo nhớ 💡', 'Mỗi sáng thức dậy, nói "Hello!" với bố mẹ nhé! 😊', 4),

  // Lesson 462: Letters A-F
  C(462, 'intro', 'ABC Song 🎵', 'Bảng chữ cái tiếng Anh có 26 chữ. Hôm nay học 6 chữ đầu!', 1),
  C(462, 'explain', '6 chữ cái đầu', 'A = a (ây)\nB = b (bi)\nC = c (xi)\nD = d (đi)\nE = e (i)\nF = f (ép-phờ)', 2),
  C(462, 'example', 'Từ bắt đầu bằng...', 'A → Apple 🍎\nB → Ball ⚽\nC → Cat 🐱\nD → Dog 🐶\nE → Egg 🥚\nF → Fish 🐟', 3),
  C(462, 'tip', 'Mẹo nhớ 💡', 'Hát: "A B C D E F... 🎶" mỗi ngày!', 4),

  // Lesson 463: Letters G-L
  C(463, 'intro', 'Tiếp tục ABC! ✨', 'Học thêm 6 chữ cái tiếp theo nhé!', 1),
  C(463, 'explain', 'Chữ G đến L', 'G = g (ji)\nH = h (ết-chờ)\nI = i (ai)\nJ = j (jây)\nK = k (kây)\nL = l (eo)', 2),
  C(463, 'example', 'Từ bắt đầu bằng...', 'G → Girl 👧\nH → House 🏠\nI → Ice cream 🍦\nJ → Juice 🧃\nK → Kite 🪁\nL → Lion 🦁', 3),
  C(463, 'tip', 'Mẹo nhớ 💡', 'Tìm đồ vật quanh nhà bắt đầu bằng G, H, I, J, K, L!', 4),

  // Lesson 464: Letters M-R
  C(464, 'intro', 'Gần xong bảng chữ cái! 📝', 'Chỉ còn 14 chữ nữa thôi. Học 6 chữ hôm nay!', 1),
  C(464, 'explain', 'Chữ M đến R', 'M = m (em)\nN = n (en)\nO = o (âu)\nP = p (pi)\nQ = q (kiu)\nR = r (a-rờ)', 2),
  C(464, 'example', 'Từ bắt đầu bằng...', 'M → Mom 👩\nN → Nose 👃\nO → Orange 🍊\nP → Pen ✏️\nQ → Queen 👑\nR → Rabbit 🐰', 3),
  C(464, 'tip', 'Mẹo nhớ 💡', 'Viết chữ M-R lên giấy, mỗi chữ vẽ 1 hình minh họa!', 4),

  // Lesson 465: Letters S-Z
  C(465, 'intro', 'Hoàn thành ABC! 🎉', '8 chữ cuối cùng — hoàn thành bảng chữ cái!', 1),
  C(465, 'explain', 'Chữ S đến Z', 'S = s (ét-xờ)\nT = t (ti)\nU = u (iu)\nV = v (vi)\nW = w (đớp-bơ-liu)\nX = x (ét-xờ)\nY = y (oai)\nZ = z (zét)', 2),
  C(465, 'example', 'Từ bắt đầu bằng...', 'S → Sun ☀️\nT → Tree 🌳\nU → Umbrella ☂️\nV → Van 🚐\nW → Water 💧\nX → Xylophone 🎵\nY → Yellow 💛\nZ → Zoo 🦓', 3),
  C(465, 'tip', 'Mẹo nhớ 💡', 'Hát bài ABC trọn vẹn: A B C D E F G... Z! 🎶', 4),

  // Lesson 466: Numbers 1-5
  C(466, 'intro', 'Counting 1-5! 🖐️', 'Đếm bằng tiếng Anh nào!', 1),
  C(466, 'explain', 'Số 1 đến 5', '1 = One ☝️\n2 = Two ✌️\n3 = Three\n4 = Four\n5 = Five 🖐️', 2),
  C(466, 'example', 'Đếm đồ vật', '🍎 → One apple\n🍎🍎 → Two apples\n🍎🍎🍎 → Three apples', 3),
  C(466, 'tip', 'Mẹo nhớ 💡', 'Đếm ngón tay: One, two, three, four, five! 🖐️', 4),

  // Lesson 467: Numbers 6-10
  C(467, 'intro', 'Counting 6-10! 🔢', 'Học tiếp 5 số còn lại!', 1),
  C(467, 'explain', 'Số 6 đến 10', '6 = Six\n7 = Seven\n8 = Eight\n9 = Nine\n10 = Ten 🤟', 2),
  C(467, 'example', 'How many?', 'How many cats? 🐱🐱🐱🐱🐱🐱 → Six cats!\nHow many stars? ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ → Ten stars!', 3),
  C(467, 'tip', 'Mẹo nhớ 💡', 'Đếm bậc cầu thang: six, seven, eight, nine, ten!', 4),

  // Lesson 468: Colors: Red Blue Yellow
  C(468, 'intro', 'Rainbow Colors! 🌈', '3 màu cơ bản đầu tiên!', 1),
  C(468, 'explain', '3 màu cơ bản', 'Red = đỏ 🔴\nBlue = xanh dương 🔵\nYellow = vàng 🟡', 2),
  C(468, 'example', 'What color is it?', 'The apple is red. 🍎\nThe sky is blue. 🌤️\nThe banana is yellow. 🍌', 3),
  C(468, 'tip', 'Mẹo nhớ 💡', 'Chỉ vào đồ vật quanh nhà: "It is red/blue/yellow!"', 4),

  // Lesson 469: Colors: Green Orange Pink
  C(469, 'intro', 'More Colors! 🎨', '3 màu sắc tiếp theo!', 1),
  C(469, 'explain', '3 màu nữa', 'Green = xanh lá 🟢\nOrange = cam 🟠\nPink = hồng 🩷', 2),
  C(469, 'example', 'Màu sắc quanh ta', 'The tree is green. 🌳\nThe orange is orange. 🍊\nThe flower is pink. 🌸', 3),
  C(469, 'tip', 'Mẹo nhớ 💡', 'Tô màu bức tranh và nói tên từng màu bằng tiếng Anh!', 4),

  // Lesson 470: My Family: Dad & Mom
  C(470, 'intro', 'My Family! 👨‍👩‍👧', 'Học cách gọi bố mẹ bằng tiếng Anh!', 1),
  C(470, 'explain', 'Bố và Mẹ', 'Dad / Father = Bố 👨\nMom / Mother = Mẹ 👩\nI love my dad. ❤️\nI love my mom. ❤️', 2),
  C(470, 'example', 'Giới thiệu', 'This is my dad. He is kind.\nThis is my mom. She is beautiful.', 3),
  C(470, 'tip', 'Mẹo nhớ 💡', 'Nói "I love you, Dad! I love you, Mom!" mỗi ngày! ❤️', 4),

  // Lesson 471: My Family: Brother & Sister
  C(471, 'intro', 'Brother & Sister! 👦👧', 'Anh chị em bằng tiếng Anh!', 1),
  C(471, 'explain', 'Anh chị em', 'Brother = Anh trai / Em trai 👦\nSister = Chị gái / Em gái 👧\nBaby = Em bé 👶', 2),
  C(471, 'example', 'This is my...', 'This is my brother. He is funny.\nThis is my sister. She is smart.', 3),
  C(471, 'tip', 'Mẹo nhớ 💡', 'Chỉ vào ảnh gia đình và nói: "This is my brother/sister!"', 4),

  // Lesson 472: I Love My Family
  C(472, 'intro', 'Family Love! ❤️', 'Nói về tình cảm gia đình!', 1),
  C(472, 'explain', 'Câu yêu thương', 'I love my family.\nMy family is happy.\nWe play together.', 2),
  C(472, 'example', 'Bài viết ngắn', 'My family is small. I have a dad, a mom, and a sister.\nI love my family. We are happy! 😊', 3),
  C(472, 'tip', 'Mẹo nhớ 💡', 'Vẽ tranh gia đình và viết "I love my family!" bên dưới!', 4),

  // Lesson 473: Pets: Dog & Cat
  C(473, 'intro', 'Cute Pets! 🐶🐱', 'Học tên thú cưng bằng tiếng Anh!', 1),
  C(473, 'explain', 'Thú cưng', 'Dog = con chó 🐶\nCat = con mèo 🐱\nFish = con cá 🐟\nBird = con chim 🐦', 2),
  C(473, 'example', 'I have a...', 'I have a dog. It is big.\nI have a cat. It is small.\nI have a fish. It is pretty.', 3),
  C(473, 'tip', 'Mẹo nhớ 💡', 'Nếu nhà có thú cưng, gọi tên nó bằng tiếng Anh!', 4),

  // Lesson 474: Farm Animals
  C(474, 'intro', 'On The Farm! 🐄', 'Động vật ở nông trại!', 1),
  C(474, 'explain', 'Động vật nông trại', 'Cow = bò 🐄 (Moo!)\nPig = lợn 🐷 (Oink!)\nDuck = vịt 🦆 (Quack!)\nChicken = gà 🐔 (Cluck!)', 2),
  C(474, 'example', 'Tiếng kêu', 'The cow says "Moo!"\nThe pig says "Oink!"\nThe duck says "Quack!"', 3),
  C(474, 'tip', 'Mẹo nhớ 💡', 'Bắt chước tiếng kêu động vật: Moo! Oink! Quack! 🎶', 4),

  // Lesson 475: Fruits: Apple & Banana
  C(475, 'intro', 'Yummy Fruits! 🍎', 'Học tên trái cây!', 1),
  C(475, 'explain', 'Trái cây', 'Apple = táo 🍎\nBanana = chuối 🍌\nOrange = cam 🍊', 2),
  C(475, 'example', 'I like...', 'I like apples. 🍎\nI like bananas. 🍌\nDo you like oranges? 🍊', 3),
  C(475, 'tip', 'Mẹo nhớ 💡', 'Khi ăn trái cây, nói tên bằng tiếng Anh!', 4),

  // Lesson 476: Fruits & Vegetables
  C(476, 'intro', 'More Food! 🥕', 'Thêm trái cây và rau!', 1),
  C(476, 'explain', 'Trái cây & rau', 'Mango = xoài 🥭\nGrape = nho 🍇\nCarrot = cà rốt 🥕\nTomato = cà chua 🍅', 2),
  C(476, 'example', 'At the market', 'I see mangoes. 🥭\nI see grapes. 🍇\nI see carrots. 🥕', 3),
  C(476, 'tip', 'Mẹo nhớ 💡', 'Đi chợ với mẹ, chỉ rau quả và gọi tên tiếng Anh!', 4),

  // Lesson 477: Stand Up! Sit Down!
  C(477, 'intro', 'Action Time! 🏃', 'Các lệnh đơn giản trong lớp!', 1),
  C(477, 'explain', 'Classroom commands', 'Stand up = Đứng lên 🧍\nSit down = Ngồi xuống 🪑\nRaise your hand = Giơ tay ✋', 2),
  C(477, 'example', 'Simon Says', 'Simon says "Stand up!" → Đứng lên!\nSimon says "Sit down!" → Ngồi xuống!', 3),
  C(477, 'tip', 'Mẹo nhớ 💡', 'Chơi trò Simon Says cùng bố mẹ bằng tiếng Anh!', 4),

  // Lesson 478: Open & Close
  C(478, 'intro', 'Open & Close! 📖', 'Mở và đóng đồ vật!', 1),
  C(478, 'explain', 'Lệnh mở/đóng', 'Open = Mở 📖\nClose = Đóng 📕\nOpen your book. Mở sách ra.\nClose your book. Đóng sách lại.', 2),
  C(478, 'example', 'Thực hành', 'Open the door! 🚪\nClose the window! 🪟\nOpen your bag! 🎒', 3),
  C(478, 'tip', 'Mẹo nhớ 💡', 'OPEN = mở (chữ O tròn như mở miệng), CLOSE = đóng (chữ C cong như đóng lại)', 4),

  // Lesson 479: Listen & Speak
  C(479, 'intro', 'Listen & Speak! 👂🗣️', 'Lắng nghe và nói!', 1),
  C(479, 'explain', 'Hành động trong lớp', 'Listen = Lắng nghe 👂\nSpeak = Nói 🗣️\nRead = Đọc 📖\nWrite = Viết ✍️', 2),
  C(479, 'example', 'Teacher says...', 'Listen to me! 👂\nSpeak English! 🗣️\nRead the book! 📖\nWrite your name! ✍️', 3),
  C(479, 'tip', 'Mẹo nhớ 💡', 'Listen = tai (👂), Speak = miệng (🗣️), Read = mắt (👀), Write = tay (✍️)', 4),

  // Lesson 480: Review
  C(480, 'intro', 'Review Time! 🎉', 'Ôn lại tất cả những gì đã học!', 1),
  C(480, 'explain', 'Tổng kết Lớp 1', 'Bảng chữ cái A-Z ✅\nSố 1-10 ✅\n6 màu sắc ✅\nGia đình ✅\nĐộng vật & Trái cây ✅\nLệnh trong lớp ✅', 2),
  C(480, 'example', 'Quick Quiz', 'How many letters? → 26\nWhat color is a banana? → Yellow\nSay "Hello" in English → Hello!', 3),
  C(480, 'tip', 'Mẹo nhớ 💡', 'Em giỏi lắm! Hát bài ABC và đếm 1-10 mỗi ngày nhé! 🌟', 4),

  // ===== LỚP 2 =====
  // Lesson 481: My Classroom
  C(481, 'intro', 'My Classroom! 🏫', 'Có gì trong lớp học? Học tên các đồ vật nào!', 1),
  C(481, 'explain', 'Đồ vật trong lớp', 'Book = sách 📖\nPen = bút bi 🖊️\nPencil = bút chì ✏️\nDesk = bàn học\nChair = ghế ngồi 🪑', 2),
  C(481, 'example', 'What is this?', 'What is this? → This is a book. 📖\nWhat is this? → This is a pen. 🖊️\nWhat is this? → This is a desk.', 3),
  C(481, 'tip', 'Mẹo nhớ 💡', 'Dán nhãn tiếng Anh lên đồ vật trong phòng học!', 4),

  // Lesson 482: School Things
  C(482, 'intro', 'School Supplies! 🎒', 'Đồ dùng học tập của em!', 1),
  C(482, 'explain', 'Đồ dùng học tập', 'Ruler = thước kẻ 📏\nEraser = cục tẩy\nBag = cặp sách 🎒\nNotebook = vở\nScissors = kéo ✂️', 2),
  C(482, 'example', 'This is my...', 'This is my bag. It is blue.\nThis is my ruler. It is long.\nThis is my eraser. It is small.', 3),
  C(482, 'tip', 'Mẹo nhớ 💡', 'Mỗi tối chuẩn bị cặp, gọi tên từng đồ bằng tiếng Anh!', 4),

  // Lesson 483: My Teacher
  C(483, 'intro', 'My Teacher! 👩‍🏫', 'Giới thiệu thầy cô giáo!', 1),
  C(483, 'explain', 'Thầy cô giáo', 'Teacher = thầy/cô giáo 👩‍🏫\nGood morning, teacher!\nThank you, teacher!', 2),
  C(483, 'example', 'Nói về thầy cô', 'This is my teacher. She is kind.\nMy teacher is nice. I like my teacher.\nGood morning, teacher!', 3),
  C(483, 'tip', 'Mẹo nhớ 💡', 'Chào cô giáo mỗi sáng: "Good morning, teacher!" 😊', 4),

  // Lesson 484: In My School
  C(484, 'intro', 'My School! 🏫', 'Khám phá trường học bằng tiếng Anh!', 1),
  C(484, 'explain', 'Nơi trong trường', 'Classroom = lớp học\nLibrary = thư viện 📚\nPlayground = sân chơi ⛹️\nCanteen = nhà ăn 🍽️', 2),
  C(484, 'example', 'Where is it?', 'I study in the classroom.\nI read books in the library.\nI play in the playground.', 3),
  C(484, 'tip', 'Mẹo nhớ 💡', 'Vẽ bản đồ trường và ghi tên các phòng bằng tiếng Anh!', 4),

  // Lesson 485: My Face
  C(485, 'intro', 'My Face! 😊', 'Học tên các bộ phận trên khuôn mặt!', 1),
  C(485, 'explain', 'Bộ phận khuôn mặt', 'Eyes = mắt 👀\nNose = mũi 👃\nMouth = miệng 👄\nEars = tai 👂\nHair = tóc', 2),
  C(485, 'example', 'Touch your...!', 'Touch your eyes! 👀\nTouch your nose! 👃\nTouch your mouth! 👄\nTouch your ears! 👂', 3),
  C(485, 'tip', 'Mẹo nhớ 💡', 'Chơi "Touch your nose/eyes/mouth" với bạn!', 4),

  // Lesson 486: My Body
  C(486, 'intro', 'My Body! 🧍', 'Học tên các bộ phận cơ thể!', 1),
  C(486, 'explain', 'Bộ phận cơ thể', 'Head = đầu\nHand = bàn tay ✋\nArm = cánh tay 💪\nLeg = chân 🦵\nFoot = bàn chân 🦶', 2),
  C(486, 'example', 'Bài hát', '🎶 Head, shoulders, knees and toes,\nknees and toes!\nEyes and ears and mouth and nose! 🎶', 3),
  C(486, 'tip', 'Mẹo nhớ 💡', 'Hát "Head Shoulders Knees and Toes" mỗi ngày!', 4),

  // Lesson 487: I Can Jump!
  C(487, 'intro', 'I Can...! 🏃', 'Nói về những gì em làm được!', 1),
  C(487, 'explain', 'I can + hành động', 'I can run. = Em biết chạy. 🏃\nI can jump. = Em biết nhảy. 🤸\nI can swim. = Em biết bơi. 🏊\nI can sing. = Em biết hát. 🎤', 2),
  C(487, 'example', 'Hỏi & đáp', 'Can you jump? → Yes, I can! 🤸\nCan you fly? → No, I can\'t! ❌\nCan you swim? → Yes, I can! 🏊', 3),
  C(487, 'tip', 'Mẹo nhớ 💡', 'CAN = có thể. Hỏi bạn: "Can you jump?" → nhảy lên! 🤸', 4),

  // Lesson 488: How Do You Feel?
  C(488, 'intro', 'Feelings! 😊😢', 'Diễn tả cảm xúc bằng tiếng Anh!', 1),
  C(488, 'explain', 'Các cảm xúc', 'Happy = vui 😊\nSad = buồn 😢\nHungry = đói 🍕\nTired = mệt 😴\nAngry = giận 😠', 2),
  C(488, 'example', 'How do you feel?', 'I\'m happy! 😊\nI\'m sad. 😢\nI\'m hungry! 🍕\nI\'m tired. 😴', 3),
  C(488, 'tip', 'Mẹo nhớ 💡', 'Mỗi tối hỏi bé: "How do you feel?" Bé trả lời bằng tiếng Anh!', 4),

  // Lesson 489: Breakfast Time!
  C(489, 'intro', 'Breakfast! 🍳', 'Đồ ăn sáng bằng tiếng Anh!', 1),
  C(489, 'explain', 'Đồ ăn sáng', 'Bread = bánh mì 🍞\nEgg = trứng 🥚\nMilk = sữa 🥛\nCereal = ngũ cốc 🥣', 2),
  C(489, 'example', 'Bữa sáng của em', 'I eat bread and eggs for breakfast.\nI drink milk.\nYummy! 😋', 3),
  C(489, 'tip', 'Mẹo nhớ 💡', 'Khi ăn sáng, nói: "I eat bread. I drink milk." 🥛', 4),

  // Lesson 490: Yummy Lunch!
  C(490, 'intro', 'Lunch Time! 🍚', 'Đồ ăn trưa bằng tiếng Anh!', 1),
  C(490, 'explain', 'Đồ ăn trưa', 'Rice = cơm 🍚\nChicken = thịt gà 🍗\nSoup = canh 🍲\nFish = cá 🐟', 2),
  C(490, 'example', 'Bữa trưa', 'I eat rice and chicken for lunch.\nI like soup. It is hot! 🍲', 3),
  C(490, 'tip', 'Mẹo nhớ 💡', 'Khi ăn trưa: "I eat rice. I eat chicken." 🍗', 4),

  // Lesson 491: Drinks & Snacks
  C(491, 'intro', 'Drinks & Snacks! 🧃', 'Đồ uống và bữa phụ!', 1),
  C(491, 'explain', 'Đồ uống & bánh', 'Water = nước 💧\nJuice = nước ép 🧃\nCake = bánh 🎂\nCandy = kẹo 🍬\nCookie = bánh quy 🍪', 2),
  C(491, 'example', 'Do you want...?', 'Do you want water or juice?\nI want juice, please! 🧃\nCan I have a cookie? 🍪', 3),
  C(491, 'tip', 'Mẹo nhớ 💡', 'Nói "Water, please!" khi muốn uống nước!', 4),

  // Lesson 492: I Like / I Don't Like
  C(492, 'intro', 'I Like...! ❤️', 'Nói về sở thích ăn uống!', 1),
  C(492, 'explain', 'Like & Don\'t like', 'I like rice. = Em thích cơm. ✅\nI don\'t like fish. = Em không thích cá. ❌\nDo you like milk? = Bạn thích sữa không?', 2),
  C(492, 'example', 'Nói về mình', 'I like chicken. 🍗 ❤️\nI like juice. 🧃 ❤️\nI don\'t like soup. 🍲 ❌', 3),
  C(492, 'tip', 'Mẹo nhớ 💡', 'LIKE = thích. DON\'T LIKE = không thích. Hỏi bạn: "Do you like...?"', 4),

  // Lesson 493: What's the Weather?
  C(493, 'intro', 'Weather! ☀️🌧️', 'Thời tiết hôm nay thế nào?', 1),
  C(493, 'explain', 'Từ vựng thời tiết', 'Sunny = nắng ☀️\nRainy = mưa 🌧️\nCloudy = nhiều mây ☁️\nWindy = có gió 💨', 2),
  C(493, 'example', 'Today\'s weather', 'What\'s the weather today?\nIt\'s sunny! ☀️\nIt\'s rainy. I need an umbrella! ☂️', 3),
  C(493, 'tip', 'Mẹo nhớ 💡', 'Mỗi sáng nhìn ra cửa sổ: "It\'s sunny/rainy/cloudy today!"', 4),

  // Lesson 494: Hot & Cold
  C(494, 'intro', 'Hot & Cold! 🌡️', 'Nóng và lạnh!', 1),
  C(494, 'explain', 'Nhiệt độ', 'Hot = nóng 🔥\nCold = lạnh ❄️\nWarm = ấm\nCool = mát', 2),
  C(494, 'example', 'Cảm nhận', 'It\'s hot today! 🔥\nIt\'s cold! I need a jacket! 🧥\nThe water is warm.', 3),
  C(494, 'tip', 'Mẹo nhớ 💡', 'Sờ nước: "It\'s hot!" hoặc "It\'s cold!" 🌡️', 4),

  // Lesson 495: My Clothes
  C(495, 'intro', 'My Clothes! 👕', 'Tên quần áo bằng tiếng Anh!', 1),
  C(495, 'explain', 'Quần áo', 'Shirt = áo 👕\nPants = quần 👖\nShoes = giày 👟\nHat = mũ 🧢\nDress = váy 👗\nJacket = áo khoác 🧥', 2),
  C(495, 'example', 'I wear...', 'I wear a blue shirt. 👕\nI wear black pants. 👖\nI wear white shoes. 👟', 3),
  C(495, 'tip', 'Mẹo nhớ 💡', 'Khi thay đồ: "I wear my shirt, pants, and shoes!"', 4),

  // Lesson 496: Getting Dressed
  C(496, 'intro', 'Getting Dressed! 👔', 'Mặc đồ phù hợp thời tiết!', 1),
  C(496, 'explain', 'Thời tiết → Quần áo', 'Sunny → T-shirt, hat ☀️🧢\nRainy → Jacket, boots 🌧️🥾\nCold → Sweater, scarf ❄️🧣', 2),
  C(496, 'example', 'What should I wear?', 'It\'s cold! → Wear a jacket! 🧥\nIt\'s sunny! → Wear a hat! 🧢\nIt\'s rainy! → Wear boots! 🥾', 3),
  C(496, 'tip', 'Mẹo nhớ 💡', 'Mỗi sáng hỏi: "What\'s the weather?" rồi chọn đồ!', 4),

  // Lesson 497: Good Morning Routine
  C(497, 'intro', 'Morning! ☀️', 'Buổi sáng của em!', 1),
  C(497, 'explain', 'Thói quen sáng', 'Wake up = Thức dậy ⏰\nBrush teeth = Đánh răng 🪥\nWash face = Rửa mặt 🧼\nEat breakfast = Ăn sáng 🍳', 2),
  C(497, 'example', 'My morning', 'I wake up at 6:30. ⏰\nI brush my teeth. 🪥\nI wash my face. 🧼\nI eat breakfast. 🍳', 3),
  C(497, 'tip', 'Mẹo nhớ 💡', 'Mỗi sáng nói: "I wake up! I brush my teeth!" 🪥', 4),

  // Lesson 498: At School
  C(498, 'intro', 'At School! 🏫', 'Hoạt động ở trường!', 1),
  C(498, 'explain', 'Ở trường em...', 'Study = Học bài 📚\nRead = Đọc sách 📖\nWrite = Viết bài ✍️\nPlay = Chơi ⛹️', 2),
  C(498, 'example', 'My school day', 'I study math. 📐\nI read a book. 📖\nI play with friends. ⛹️', 3),
  C(498, 'tip', 'Mẹo nhớ 💡', 'Kể cho bố mẹ: "I study, read, and play at school!"', 4),

  // Lesson 499: Evening Fun
  C(499, 'intro', 'Evening Time! 🌙', 'Buổi tối vui!', 1),
  C(499, 'explain', 'Hoạt động tối', 'Watch TV = Xem TV 📺\nPlay games = Chơi game 🎮\nRead a book = Đọc sách 📖\nGo to sleep = Đi ngủ 😴', 2),
  C(499, 'example', 'My evening', 'I watch TV. 📺\nI play with my toys. 🧸\nI read a book. 📖\nGood night! 🌙', 3),
  C(499, 'tip', 'Mẹo nhớ 💡', 'Trước khi ngủ: "Good night, Mom! Good night, Dad!" 🌙', 4),

  // Lesson 500: Review
  C(500, 'intro', 'Review Lớp 2! 🎉', 'Ôn tập tất cả kiến thức Lớp 2!', 1),
  C(500, 'explain', 'Em đã học', 'Trường học & Đồ dùng ✅\nCơ thể & Cảm xúc ✅\nĐồ ăn & Thức uống ✅\nThời tiết & Quần áo ✅\nSinh hoạt hàng ngày ✅', 2),
  C(500, 'example', 'Quick Review', 'What is this? → It\'s a pen.\nHow do you feel? → I\'m happy!\nWhat\'s the weather? → It\'s sunny!', 3),
  C(500, 'tip', 'Mẹo nhớ 💡', 'Em giỏi lắm! Tiếp tục nói tiếng Anh mỗi ngày! 🌟', 4),
];
