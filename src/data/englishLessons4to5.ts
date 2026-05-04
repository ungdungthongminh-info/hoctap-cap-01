/**
 * TIẾNG ANH LỚP 4 & 5 — 40 bài học (20 bài × 2 lớp)
 * G4: ID 421-440 | G5: ID 441-460
 */
import type { Lesson } from './seedData';
const L = (
  id: number, grade: number, unit: string, code: string,
  title: string, obj: string, summary: string, tips: string,
  diff: 'easy' | 'medium' | 'hard', mins: number, sort: number,
): Lesson => ({
  id, grade, subjectCode: 'english', unitCode: unit, lessonCode: code,
  title, objective: obj, summarySimple: summary, tips,
  difficulty: diff, estimatedMinutes: mins, status: 'ready', sortOrder: sort, isActive: 1,
});

export const englishLessons4: Lesson[] = [
  // Grade 4 — Chương 1: Daily Life
  L(421,4,'EN4C1','EN4-01','My Daily Routine','Mô tả hoạt động hàng ngày bằng tiếng Anh','Bé học nói về thói quen mỗi ngày','Dùng every day / every morning',  'easy',12,1),
  L(422,4,'EN4C1','EN4-02','What Time Is It?','Hỏi và trả lời về giờ giấc','Bé học đọc giờ bằng tiếng Anh','half past = rưỡi, quarter = 15 phút','medium',12,2),
  L(423,4,'EN4C1','EN4-03','My Hobbies','Nói về sở thích cá nhân','Bé kể sở thích bằng tiếng Anh','Like/enjoy/love + V-ing','medium',12,3),
  L(424,4,'EN4C1','EN4-04','Sports and Games','Từ vựng thể thao và trò chơi','Bé học các môn thể thao','play + ball games, go + V-ing','easy',12,4),
  // Chương 2: Food & Drink
  L(425,4,'EN4C2','EN4-05','At the Restaurant','Gọi món ăn bằng tiếng Anh','Bé học gọi món lịch sự','Can I have... / I\'d like...','medium',15,5),
  L(426,4,'EN4C2','EN4-06','Healthy Food','Phân biệt thực phẩm lành mạnh','Bé biết thực phẩm tốt cho sức khoẻ','should / shouldn\'t + V','easy',12,6),
  L(427,4,'EN4C2','EN4-07','Cooking Verbs','Các động từ nấu ăn: cook, fry, boil,...','Bé học từ vựng nấu ăn','First, Then, Next, Finally','medium',12,7),
  L(428,4,'EN4C2','EN4-08','My Favorite Dish','Viết đoạn văn về món ăn yêu thích','Bé tập viết về đồ ăn','Dùng tính từ: delicious, yummy, sweet','medium',15,8),
  // Chương 3: Places & Transport
  L(429,4,'EN4C3','EN4-09','Places in Town','Từ vựng địa điểm: school, hospital, park,...','Bé học các địa điểm trong thị trấn','next to, opposite, between','easy',12,9),
  L(430,4,'EN4C3','EN4-10','Asking for Directions','Hỏi và chỉ đường','Bé biết hỏi đường bằng tiếng Anh','Bắt đầu bằng Excuse me','medium',12,10),
  L(431,4,'EN4C3','EN4-11','Means of Transport','Các phương tiện giao thông','Bé học phương tiện đi lại','by + transport, on foot','easy',12,11),
  L(432,4,'EN4C3','EN4-12','Traveling','Nói về chuyến đi du lịch','Bé kể chuyến đi bằng Past Simple','went, saw, ate, had, visited','medium',15,12),
  // Chương 4: Nature & Weather
  L(433,4,'EN4C4','EN4-13','Weather Forecast','Từ vựng thời tiết: sunny, rainy, cloudy,...','Bé học nói về thời tiết','Thêm -y: rain→rainy, sun→sunny','easy',12,13),
  L(434,4,'EN4C4','EN4-14','Seasons in Vietnam','4 mùa: Spring, Summer, Autumn, Winter','Bé mô tả 4 mùa','Dùng in + mùa: in spring','easy',12,14),
  L(435,4,'EN4C4','EN4-15','Wild Animals','Động vật hoang dã và môi trường sống','Bé học về động vật hoang dã','It lives in + nơi sống','medium',12,15),
  L(436,4,'EN4C4','EN4-16','Protect the Earth','Bảo vệ môi trường bằng tiếng Anh','Bé học cách bảo vệ Trái Đất','We should / We can + V','easy',12,16),
  // Chương 5: Review & Culture
  L(437,4,'EN4C5','EN4-17','Vietnamese Festivals','Lễ hội Việt Nam bằng tiếng Anh','Bé kể về lễ hội Việt Nam','We celebrate + festival','easy',12,17),
  L(438,4,'EN4C5','EN4-18','Countries & Nationalities','Các quốc gia và quốc tịch','Bé học tên nước và quốc tịch','Country → Nationality','easy',12,18),
  L(439,4,'EN4C5','EN4-19','Grammar Review 4','Ôn ngữ pháp: Present Simple, Can, There is/are','Bé ôn tập ngữ pháp lớp 4','Ôn tất cả cấu trúc đã học','medium',15,19),
  L(440,4,'EN4C5','EN4-20','Final Review Grade 4','Ôn tập tổng hợp lớp 4','Bé ôn tập toàn bộ lớp 4','Mỗi ngày nói 1 câu tiếng Anh!','medium',15,20),
];

export const englishLessons5: Lesson[] = [
  // Grade 5 — Chương 1: About Me & Others
  L(441,5,'EN5C1','EN5-01','Describing People','Mô tả ngoại hình và tính cách','Bé học mô tả người','have/has cho đặc điểm','easy',12,1),
  L(442,5,'EN5C1','EN5-02','Jobs & Occupations','Nghề nghiệp bằng tiếng Anh','Bé học các nghề nghiệp','a/an + job','easy',12,2),
  L(443,5,'EN5C1','EN5-03','My Future Plans','Nói về dự định tương lai: want to be','Bé nói ước mơ tương lai','going to / will + V','medium',12,3),
  L(444,5,'EN5C1','EN5-04','Feelings & Emotions','Từ vựng cảm xúc: happy, sad, excited,...','Bé diễn tả cảm xúc bằng tiếng Anh','feel + adj, because + lý do','easy',12,4),
  // Chương 2: Health & Body
  L(445,5,'EN5C2','EN5-05','Parts of the Body','Các bộ phận cơ thể','Bé học tên bộ phận cơ thể','foot→feet, tooth→teeth','easy',12,5),
  L(446,5,'EN5C2','EN5-06','At the Doctor','Hội thoại khám bệnh','Bé biết nói triệu chứng','have a + bệnh','medium',12,6),
  L(447,5,'EN5C2','EN5-07','Healthy Habits','Thói quen lành mạnh','Bé tập thói quen tốt','should / shouldn\'t + V','easy',12,7),
  L(448,5,'EN5C2','EN5-08','Exercise & Fitness','Tập thể dục và thể lực','Bé học từ vựng thể dục','How often + frequency adverbs','medium',12,8),
  // Chương 3: Media & Technology
  L(449,5,'EN5C3','EN5-09','Using the Computer','Từ vựng về máy tính và Internet','Bé học dùng máy tính bằng tiếng Anh','turn on/off, click, type','medium',12,9),
  L(450,5,'EN5C3','EN5-10','My Favorite Movie','Nói về phim yêu thích','Bé kể phim yêu thích','It is about... The main character is...','easy',12,10),
  L(451,5,'EN5C3','EN5-11','Reading Books','Đọc sách và chia sẻ','Bé học về sách và đọc sách','fairy tale, comic, poem','easy',12,11),
  L(452,5,'EN5C3','EN5-12','Online Safety','An toàn trên mạng','Bé biết giữ an toàn online','Don\'t share personal info','medium',12,12),
  // Chương 4: Environment & World
  L(453,5,'EN5C4','EN5-13','Save Water','Tiết kiệm nước','Bé học tiết kiệm nước','Turn off the tap, fix broken taps','easy',12,13),
  L(454,5,'EN5C4','EN5-14','Reduce, Reuse, Recycle','3R bảo vệ môi trường','Bé hiểu 3R','Reduce, Reuse, Recycle','medium',12,14),
  L(455,5,'EN5C4','EN5-15','Global Issues','Các vấn đề toàn cầu đơn giản','Bé học vấn đề toàn cầu','pollution, global warming','hard',15,15),
  L(456,5,'EN5C4','EN5-16','International Day','Các ngày lễ quốc tế','Bé học ngày lễ quốc tế','on + ngày, in + tháng','easy',12,16),
  // Chương 5: Review & Graduation
  L(457,5,'EN5C5','EN5-17','Past Tense Basics','Thì quá khứ đơn giản','Bé học thì quá khứ đơn','V-ed / irregular verbs','medium',15,17),
  L(458,5,'EN5C5','EN5-18','Comparisons','So sánh hơn / nhất','Bé học so sánh tính từ','adj-er/est, more/most','medium',15,18),
  L(459,5,'EN5C5','EN5-19','Writing a Paragraph','Viết đoạn văn ngắn','Bé tập viết đoạn văn','Topic → Supporting → Concluding','medium',15,19),
  L(460,5,'EN5C5','EN5-20','Final Review Grade 5','Ôn tập tổng hợp lớp 5','Bé ôn tập toàn bộ lớp 5','Tự tin lên lớp 6!','medium',15,20),
];
