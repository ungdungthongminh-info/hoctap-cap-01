/**
 * TIẾNG ANH LỚP 4 & 5 — 160 thẻ học (80 thẻ × 2 lớp)
 * G4: ID 1921-2000 | G5: ID 2001-2080
 */
import type { LessonCard } from './seedData';
let cid = 1920;
const C = (lesson: number, type: LessonCard['cardType'], t: string, cont: string, sort: number): LessonCard => ({
  id: ++cid, lessonId: lesson, cardType: type, title: t, content: cont,
  exampleJson: null, sortOrder: sort, isActive: 1,
});

export const englishCards4: LessonCard[] = [
  // 421 My Daily Routine
  C(421,'intro','Daily Routine','Hàng ngày em thức dậy, đi học, ăn trưa và chơi thể thao. Hãy học cách nói các hoạt động này bằng tiếng Anh!',1),
  C(421,'explain','Key Phrases','I wake up at 6 o\'clock. I go to school at 7. I have lunch at 12. I do homework at 5.',2),
  C(421,'example','Example','What do you do every morning? — I brush my teeth, have breakfast and go to school.',3),
  C(421,'tip','Tip','Dùng "every day / every morning / every night" để nói về thói quen.',4),
  // 422 What Time Is It?
  C(422,'intro','Telling Time','Học cách đọc giờ: o\'clock, half past, quarter to, quarter past.',1),
  C(422,'explain','Structure','What time is it? — It\'s + giờ. "It\'s seven o\'clock." "It\'s half past three."',2),
  C(422,'example','Example','What time do you get up? — I get up at six thirty.',3),
  C(422,'tip','Tip','Nhớ: "half past" = rưỡi, "quarter past" = 15 phút, "quarter to" = kém 15.',4),
  // 423 My Hobbies
  C(423,'intro','Hobbies','Sở thích là những việc em thích làm lúc rảnh: reading, drawing, singing, playing football,...',1),
  C(423,'explain','Structure','What\'s your hobby? — My hobby is + V-ing. / I like + V-ing.',2),
  C(423,'example','Example','What\'s your hobby? — My hobby is drawing. I draw every evening.',3),
  C(423,'tip','Tip','Luôn dùng V-ing sau "like", "enjoy", "love" khi nói về sở thích.',4),
  // 424 Sports and Games
  C(424,'intro','Sports Vocabulary','football, badminton, swimming, skipping rope, chess, cycling,...',1),
  C(424,'explain','Can / Can\'t','I can swim. I can\'t play chess. Can you ride a bike? — Yes, I can.',2),
  C(424,'example','Example','What sport do you play? — I play badminton. I can play it well.',3),
  C(424,'tip','Tip','"Play" đi với ball games / board games. "Go" đi với: swimming, cycling, running.',4),
  // 425 At the Restaurant
  C(425,'intro','Ordering Food','Khi vào nhà hàng, em cần biết cách gọi món bằng tiếng Anh.',1),
  C(425,'explain','Phrases','Can I have...? / I\'d like... / How much is it? / The bill, please.',2),
  C(425,'example','Example','Can I have a pizza and orange juice, please? — Sure. That\'s 50,000 dong.',3),
  C(425,'tip','Tip','Dùng "please" và "thank you" khi gọi món — lịch sự rất quan trọng!',4),
  // 426 Healthy Food
  C(426,'intro','Healthy vs Unhealthy','Fruits, vegetables, milk = healthy. Candy, chips, soda = unhealthy.',1),
  C(426,'explain','Should / Shouldn\'t','You should eat more vegetables. You shouldn\'t eat too much candy.',2),
  C(426,'example','Example','Is pizza healthy? — It can be if it has vegetables on top!',3),
  C(426,'tip','Tip','Remember: "An apple a day keeps the doctor away!"',4),
  // 427 Cooking Verbs
  C(427,'intro','In the Kitchen','Học các động từ nấu ăn: cook, fry, boil, bake, mix, cut, peel.',1),
  C(427,'explain','Instructions','First, peel the potatoes. Then, cut them. Next, boil them in water.',2),
  C(427,'example','Example','How do you make an omelette? — First, crack the eggs. Then, fry them.',3),
  C(427,'tip','Tip','Dùng "First, Then, Next, Finally" khi mô tả các bước nấu ăn.',4),
  // 428 My Favorite Dish
  C(428,'intro','Writing About Food','Em hãy viết về món ăn yêu thích bằng tiếng Anh.',1),
  C(428,'explain','Structure','My favorite food is... I like it because... My mom / dad cooks it every...',2),
  C(428,'example','Example','My favorite food is pho. I like it because it is delicious and warm. I eat it every morning.',3),
  C(428,'tip','Tip','Dùng tính từ mô tả: delicious, yummy, sweet, salty, sour, spicy.',4),
  // 429 Places in Town
  C(429,'intro','Town Places','school, hospital, post office, bookshop, supermarket, park, cinema, bank.',1),
  C(429,'explain','Where + is','Where is the hospital? — It\'s on Le Loi Street. It\'s next to the park.',2),
  C(429,'example','Example','Where is the bookshop? — Go straight. Turn left. It\'s on your right.',3),
  C(429,'tip','Tip','Nhớ: next to (bên cạnh), opposite (đối diện), between (ở giữa).',4),
  // 430 Asking for Directions
  C(430,'intro','Directions','Hỏi đường: Excuse me, how can I get to...? / Where is...?',1),
  C(430,'explain','Giving Directions','Go straight. Turn left / right. It\'s on your left / right. Cross the street.',2),
  C(430,'example','Example','Excuse me, how can I get to the post office? — Go straight, then turn right.',3),
  C(430,'tip','Tip','Luôn bắt đầu bằng "Excuse me" khi hỏi đường — rất lịch sự!',4),
  // 431 Means of Transport
  C(431,'intro','Transport','bus, taxi, bicycle, motorbike, car, train, plane, boat.',1),
  C(431,'explain','How do you go?','How do you go to school? — I go to school by bike / on foot.',2),
  C(431,'example','Example','How does your father go to work? — He goes to work by motorbike.',3),
  C(431,'tip','Tip','"By" + phương tiện (by bus), "on foot" = đi bộ. Không nói "by foot".',4),
  // 432 Traveling
  C(432,'intro','Travel Talk','holiday, trip, visit, sightseeing, hotel, beach, mountain.',1),
  C(432,'explain','Past Simple','I went to Da Nang last summer. We visited Hoi An. It was amazing!',2),
  C(432,'example','Example','Where did you go on holiday? — I went to Nha Trang. I swam in the sea.',3),
  C(432,'tip','Tip','Dùng thì quá khứ đơn để kể chuyến đi: went, saw, ate, had, visited.',4),
  // 433 Weather Forecast
  C(433,'intro','Weather Words','sunny, rainy, cloudy, windy, stormy, foggy, snowy, hot, cold.',1),
  C(433,'explain','What\'s the weather like?','What\'s the weather like today? — It\'s sunny and hot.',2),
  C(433,'example','Example','What\'s the weather like in Ha Noi in winter? — It\'s cold and foggy.',3),
  C(433,'tip','Tip','Thêm "-y" để tạo tính từ thời tiết: rain→rainy, cloud→cloudy, sun→sunny.',4),
  // 434 Seasons in Vietnam
  C(434,'intro','Four Seasons','Spring (xuân), Summer (hạ), Autumn (thu), Winter (đông).',1),
  C(434,'explain','Description','In spring, it\'s warm. In summer, it\'s hot. In autumn, it\'s cool. In winter, it\'s cold.',2),
  C(434,'example','Example','What\'s your favorite season? — I like autumn because it\'s cool and beautiful.',3),
  C(434,'tip','Tip','Dùng "in" trước mùa: in spring, in summer. KHÔNG dùng "on" hay "at".',4),
  // 435 Wild Animals
  C(435,'intro','Wild Animals','lion, tiger, elephant, monkey, bear, crocodile, eagle, dolphin.',1),
  C(435,'explain','Describing Animals','The elephant is big and grey. It lives in the forest. It eats grass.',2),
  C(435,'example','Example','What animal do you like? — I like dolphins because they are smart and friendly.',3),
  C(435,'tip','Tip','Dùng "It lives in..." để nói về nơi sống: forest, ocean, jungle, river.',4),
  // 436 Protect the Earth
  C(436,'intro','Environment','Trái Đất cần được bảo vệ. Học cách nói về bảo vệ môi trường bằng tiếng Anh.',1),
  C(436,'explain','Actions','plant trees, save water, reduce waste, recycle, turn off lights.',2),
  C(436,'example','Example','What can we do to protect the Earth? — We can plant trees and save water.',3),
  C(436,'tip','Tip','Dùng "We should..." và "We can..." để đề xuất hành động bảo vệ môi trường.',4),
  // 437 Vietnamese Festivals
  C(437,'intro','Festivals','Tet, Mid-Autumn Festival, Hung Kings\' Day, Teachers\' Day.',1),
  C(437,'explain','Describing Festivals','Tet is the biggest festival in Vietnam. We eat banh chung and visit relatives.',2),
  C(437,'example','Example','What do you do at Tet? — I get lucky money, eat banh chung and visit my grandparents.',3),
  C(437,'tip','Tip','Dùng "We celebrate..." để nói về lễ hội: We celebrate Tet in January or February.',4),
  // 438 Countries & Nationalities
  C(438,'intro','Countries','Vietnam, Japan, England, America, Australia, China, France, Korea.',1),
  C(438,'explain','Nationality','I\'m Vietnamese. She\'s Japanese. He\'s American. They\'re French.',2),
  C(438,'example','Example','Where are you from? — I\'m from Vietnam. I\'m Vietnamese.',3),
  C(438,'tip','Tip','Country → Nationality: Japan→Japanese, France→French, America→American.',4),
  // 439 Grammar Review 4
  C(439,'intro','Review: Tenses','Present Simple: I go to school. Present Continuous: I am reading now.',1),
  C(439,'explain','Review: Can / Should','Can: ability. Should: advice. Can you swim? You should study hard.',2),
  C(439,'example','Review: Questions','What / Where / When / How / Why + trợ động từ + S + V?',3),
  C(439,'tip','Tip','Ôn lại tất cả ngữ pháp lớp 4 — luyện tập nhiều sẽ nhớ lâu!',4),
  // 440 Final Review Grade 4
  C(440,'intro','Tổng kết lớp 4','Em đã học rất nhiều: daily life, food, places, weather, culture!',1),
  C(440,'explain','Key Skills','Listening, speaking, reading, writing — 4 kỹ năng quan trọng.',2),
  C(440,'example','Practice','Try to speak English every day, even just one sentence!',3),
  C(440,'tip','Tip','Hãy tự tin nói tiếng Anh — mỗi ngày một chút, em sẽ giỏi lên!',4),
];

export const englishCards5: LessonCard[] = [
  // 441 Describing People
  C(441,'intro','Describing People','Mô tả người: tall, short, thin, fat, beautiful, handsome, kind, clever.',1),
  C(441,'explain','Structure','She is tall and thin. She has long black hair. She is very kind.',2),
  C(441,'example','Example','Describe your best friend. — My best friend is Nam. He is tall and funny.',3),
  C(441,'tip','Tip','Dùng "have/has" cho đặc điểm: has long hair, has blue eyes.',4),
  // 442 Jobs & Occupations
  C(442,'intro','Jobs','doctor, teacher, farmer, engineer, pilot, chef, firefighter, police officer.',1),
  C(442,'explain','What do you do?','What does your mother do? — She is a doctor. She works at a hospital.',2),
  C(442,'example','Example','What do you want to be? — I want to be a pilot because I like planes.',3),
  C(442,'tip','Tip','Dùng "a/an" trước nghề: a teacher, an engineer. "An" trước nguyên âm.',4),
  // 443 My Future Plans
  C(443,'intro','Future Plans','Nói về dự định: I want to be..., I\'m going to..., I will...',1),
  C(443,'explain','Structure','What are you going to do this summer? — I\'m going to visit Da Lat.',2),
  C(443,'example','Example','What do you want to be in the future? — I want to be a scientist.',3),
  C(443,'tip','Tip','"Going to" = kế hoạch đã có. "Will" = quyết định ngay lúc nói.',4),
  // 444 Feelings & Emotions
  C(444,'intro','Feelings','happy, sad, angry, scared, excited, tired, bored, surprised, nervous.',1),
  C(444,'explain','How do you feel?','How do you feel? — I feel happy / I am excited. How does she feel? — She feels tired.',2),
  C(444,'example','Example','Why are you sad? — Because I lost my pen. / I feel nervous before the exam.',3),
  C(444,'tip','Tip','Dùng "because" để giải thích lý do: I\'m happy because I got 10 marks.',4),
  // 445 Parts of the Body
  C(445,'intro','Body Parts','head, eyes, ears, nose, mouth, arms, hands, legs, feet, fingers, toes.',1),
  C(445,'explain','My body','I have two eyes, one nose and one mouth. I use my hands to write.',2),
  C(445,'example','Example','Touch your head! Clap your hands! Stamp your feet! — Body actions game.',3),
  C(445,'tip','Tip','Số nhiều: foot→feet, tooth→teeth, child→children — irregular nouns!',4),
  // 446 At the Doctor
  C(446,'intro','At the Doctor','Khi bị ốm, em cần nói triệu chứng bằng tiếng Anh.',1),
  C(446,'explain','Symptoms','I have a headache / stomachache / toothache / fever / cold / cough.',2),
  C(446,'example','Example','What\'s the matter? — I have a stomachache. — You should take some medicine.',3),
  C(446,'tip','Tip','Dùng "have a + bệnh": have a cold, have a fever. "Should" để cho lời khuyên.',4),
  // 447 Healthy Habits
  C(447,'intro','Healthy Habits','Thói quen tốt: wash hands, brush teeth, eat vegetables, sleep early, exercise.',1),
  C(447,'explain','Advice','You should wash your hands before eating. You shouldn\'t stay up late.',2),
  C(447,'example','Example','How do you stay healthy? — I eat fruits, exercise every day and sleep at 9 PM.',3),
  C(447,'tip','Tip','should = nên, shouldn\'t = không nên. Áp dụng khi cho lời khuyên sức khoẻ.',4),
  // 448 Exercise & Fitness
  C(448,'intro','Exercise','running, jogging, yoga, jumping jacks, push-ups, stretching.',1),
  C(448,'explain','How often?','How often do you exercise? — I exercise three times a week.',2),
  C(448,'example','Example','What exercise do you do? — I go jogging every morning in the park.',3),
  C(448,'tip','Tip','Frequency: always > usually > often > sometimes > rarely > never.',4),
  // 449 Using the Computer
  C(449,'intro','Computer Parts','screen, keyboard, mouse, speaker, printer, USB, camera.',1),
  C(449,'explain','Actions','click, type, search, download, save, open, close, turn on/off.',2),
  C(449,'example','Example','How do you use Google? — I open the browser, type my question and click search.',3),
  C(449,'tip','Tip','Nói "turn on" (bật) và "turn off" (tắt) — KHÔNG nói "open the computer".',4),
  // 450 My Favorite Movie
  C(450,'intro','Movies','cartoon, action, comedy, animated movie, scary movie, adventure.',1),
  C(450,'explain','Describing Movies','It is about... The main character is... It is funny / exciting / scary.',2),
  C(450,'example','Example','My favorite movie is Doraemon. It is about a robot cat from the future.',3),
  C(450,'tip','Tip','Dùng "It is about..." để tóm tắt nội dung phim.',4),
  // 451 Reading Books
  C(451,'intro','Books','storybook, comic, textbook, fairy tale, picture book, poem.',1),
  C(451,'explain','Do you like reading?','What book are you reading? — I\'m reading "The Little Prince". It\'s interesting.',2),
  C(451,'example','Example','My favorite book is "Doraemon" comics. I read one chapter every night.',3),
  C(451,'tip','Tip','Reading helps you learn new words! Try reading English stories every day.',4),
  // 452 Online Safety
  C(452,'intro','Online Safety','Khi dùng Internet, em cần biết cách giữ an toàn.',1),
  C(452,'explain','Rules','Don\'t share your password. Don\'t talk to strangers online. Tell your parents.',2),
  C(452,'example','Example','Is it safe to share your address online? — No! Never share personal information.',3),
  C(452,'tip','Tip','Remember: "Think before you click!" — always ask a parent if you\'re not sure.',4),
  // 453 Save Water
  C(453,'intro','Save Water','Nước rất quý. Học cách nói về tiết kiệm nước bằng tiếng Anh.',1),
  C(453,'explain','Actions','Turn off the tap. Take shorter showers. Don\'t waste water.',2),
  C(453,'example','Example','How can we save water? — We can turn off the tap when brushing teeth.',3),
  C(453,'tip','Tip','Dùng "We can..." và "We should..." để đề xuất hành động tiết kiệm.',4),
  // 454 Reduce, Reuse, Recycle
  C(454,'intro','3R','Reduce (giảm), Reuse (tái sử dụng), Recycle (tái chế) — 3 cách bảo vệ môi trường.',1),
  C(454,'explain','Examples','Reduce: use less plastic. Reuse: use bags again. Recycle: put cans in the recycle bin.',2),
  C(454,'example','Practice','What can you reduce? — I can reduce paper by writing on both sides.',3),
  C(454,'tip','Tip','Start small: bring a reusable water bottle to school every day!',4),
  // 455 Global Issues
  C(455,'intro','World Problems','pollution, global warming, deforestation, endangered animals.',1),
  C(455,'explain','Simple Sentences','Pollution is bad for our health. We should plant more trees.',2),
  C(455,'example','Example','What is a big problem in the world? — Pollution. Many rivers are dirty.',3),
  C(455,'tip','Tip','Dùng từ đơn giản khi nói về vấn đề lớn — em không cần từ quá khó!',4),
  // 456 International Day
  C(456,'intro','Special Days','Children\'s Day, Women\'s Day, Earth Day, World Health Day, Teachers\' Day.',1),
  C(456,'explain','When is...?','When is Earth Day? — It\'s on April 22nd. We plant trees and clean parks.',2),
  C(456,'example','Example','What do you do on Children\'s Day? — I go to the park and play with friends.',3),
  C(456,'tip','Tip','Dùng "on" trước ngày: on June 1st, on April 22nd. Dùng "in" trước tháng.',4),
  // 457 Past Tense Basics
  C(457,'intro','Past Tense','Thì quá khứ đơn: dùng khi nói về việc đã xảy ra.',1),
  C(457,'explain','Rules','V thêm -ed: played, watched; Bất quy tắc: go→went, eat→ate, have→had.',2),
  C(457,'example','Example','What did you do yesterday? — I went to the zoo and saw many animals.',3),
  C(457,'tip','Tip','Dấu hiệu: yesterday, last week, last year, ago. "Did" dùng cho câu hỏi.',4),
  // 458 Comparisons
  C(458,'intro','Comparing Things','So sánh hơn: taller, bigger, more beautiful. So sánh nhất: the tallest, the biggest.',1),
  C(458,'explain','Rules','Short adj + "-er/est": tall→taller→tallest. Long adj: "more/most" + adj.',2),
  C(458,'example','Example','Who is taller, Nam or Minh? — Nam is taller than Minh.',3),
  C(458,'tip','Tip','Irregular: good→better→best, bad→worse→worst.',4),
  // 459 Writing a Paragraph
  C(459,'intro','Writing Skills','Viết đoạn văn: Topic sentence → Supporting sentences → Concluding sentence.',1),
  C(459,'explain','Structure','Start with "I like..." or "My favorite...". Give 2-3 reasons. End with a summary.',2),
  C(459,'example','Example','My school: My school is Nguyen Du Primary School. It is big and beautiful. I love my school.',3),
  C(459,'tip','Tip','Viết đơn giản, đúng ngữ pháp. 5-7 câu là đủ cho một đoạn văn hay!',4),
  // 460 Final Review Grade 5
  C(460,'intro','Tổng kết lớp 5','Chúc mừng em đã hoàn thành chương trình tiếng Anh tiểu học!',1),
  C(460,'explain','What You Learned','People, health, technology, environment, grammar — a lot of great topics!',2),
  C(460,'example','Keep Going!','Keep reading, listening, speaking and writing English every day.',3),
  C(460,'tip','Tip','Em đã sẵn sàng lên lớp 6! Hãy tự tin — English is fun!',4),
];
