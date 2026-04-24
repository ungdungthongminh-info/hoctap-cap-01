/**
 * TIẾNG VIỆT LỚP 1 — 80 thẻ dạy (4 thẻ/bài × 20 bài)
 * ID bắt đầu từ 501 (tránh trùng Math cards 1-160)
 */
import { LessonCard } from './seedData';

let cid = 500;
const C = (lessonId: number, type: LessonCard['cardType'], title: string, content: string): LessonCard => ({
  id: ++cid,
  lessonId,
  cardType: type,
  title,
  content,
  exampleJson: null,
  sortOrder: cid - 500,
  isActive: 1,
});

export const vietnameseCards1: LessonCard[] = [
  // === Bài 101: Nguyên âm a, o, ô, ơ ===
  C(101, 'intro', 'Nguyên âm là gì?', 'Nguyên âm là những âm khi phát ra, hơi từ phổi đi ra không bị cản. Tiếng Việt có 12 nguyên âm. Hôm nay học 4 âm đầu tiên!'),
  C(101, 'explain', 'Cách phát âm', 'a — mở miệng rộng (á, ả, ã, à, ạ)\no — miệng tròn nhỏ\nô — miệng tròn nhô ra\nơ — miệng hơi mở, không tròn'),
  C(101, 'example', 'Ví dụ từ có nguyên âm', 'a: ba, cá, nhà, mẹ à\no: bò, co, lo, to\nô: bố, cô, hồ, gỗ\nơ: bơ, cờ, mơ, thơ'),
  C(101, 'tip', 'Mẹo nhớ', 'a — Á à! Mở miệng to nhất\no — Ô tô! Miệng tròn\nô — Cô giáo! Nhô ra\nơ — Mơ mộng! Thư giãn'),

  // === Bài 102: Nguyên âm e, ê, i, u, ư ===
  C(102, 'intro', '5 nguyên âm tiếp theo', 'Tiếp tục hành trình khám phá nguyên âm! e, ê, i, u, ư là 5 người bạn mới.'),
  C(102, 'explain', 'Phân biệt e/ê và u/ư', 'e — miệng mở ngang rộng: ve, me, xe\nê — miệng mở ngang hẹp hơn: bê, tê, kê\nu — môi tròn thu nhỏ: bu, cu, thu\nư — môi không tròn, hơi nhếch: bư, cư, tư\ni — miệng mở hẹp nhất: bi, chi, li'),
  C(102, 'example', 'Từ có các nguyên âm', 'e: me, ve sầu, xe đạp\nê: bê, lê, hè\ni: bi, chi, li ti\nu: bu, thu, mù\nư: tư, cư, sư'),
  C(102, 'tip', 'Mẹo so sánh', 'e rộng — ê hẹp (nhớ: ê có mũ nên "co lại")\nu tròn — ư không tròn (nhớ: ư có sừng nên "nhếch miệng")'),

  // === Bài 103: Phụ âm b, c, d, đ ===
  C(103, 'intro', 'Phụ âm là gì?', 'Phụ âm là âm khi phát ra, hơi bị cản bởi lưỡi, môi hoặc răng. Ghép phụ âm + nguyên âm = tiếng!'),
  C(103, 'explain', 'Cách phát âm b, c, d, đ', 'b — hai môi chạm nhau: ba, bé, bí, bò\nc — lưỡi cong lên: ca, cá, cô, cười\nd — lưỡi chạm răng nhẹ: da, dê, dù\nđ — lưỡi chạm răng mạnh: đi, đá, đỏ, đèn'),
  C(103, 'example', 'Ghép thành tiếng', 'b + a = ba → ba mẹ\nc + á = cá → con cá\nd + ê = dê → con dê\nđ + è + n = đèn → cái đèn'),
  C(103, 'tip', 'Phân biệt d và đ', 'Nhiều bé hay nhầm d và đ!\nd — nét thẳng lên BÊN PHẢI\nđ — có GẠCH NGANG ở giữa\nNhớ: đ = d + dấu gạch'),

  // === Bài 104: Phụ âm g, h, k, l, m, n ===
  C(104, 'intro', '6 phụ âm mới', 'g, h, k, l, m, n — thêm 6 người bạn phụ âm nữa! Giờ bé có thể ghép rất nhiều tiếng rồi.'),
  C(104, 'explain', 'Phát âm 6 phụ âm', 'g — họng: gà, gỗ, gió\nh — hơi thở: hoa, hè, hai\nk — giống c, đứng trước e/ê/i: kẻ, kê, kí\nl — lưỡi cong: la, lá, lê\nm — hai môi khép: mẹ, mưa, mèo\nn — lưỡi chạm vòm: na, nó, nấm'),
  C(104, 'example', 'Từ quen thuộc', 'gà — con gà gáy\nhoa — bông hoa đẹp\nkẻ — kẻ vạch\nlá — lá cây xanh\nmẹ — mẹ yêu\nnấm — cây nấm'),
  C(104, 'tip', 'Khi nào viết c, khi nào viết k?', 'Viết K trước: e, ê, i\nViết C trước: a, o, ô, ơ, u, ư\nVí dụ: kẻ (k+e) nhưng cá (c+a)'),

  // === Bài 105: Vần -an, -am, -ang ===
  C(105, 'intro', 'Vần là gì?', 'Vần = nguyên âm + âm cuối. Ví dụ: a + n = vần "an". Tiếng = phụ âm đầu + vần: b + an = ban.'),
  C(105, 'explain', 'Ba vần hôm nay', 'an: ban, bàn, bạn, can, đan, man\nam: cam, đám, hàm, lam, nam, tám\nang: bang, bàng, hàng, làng, mang, nàng'),
  C(105, 'example', 'Đọc tiếng có vần', 'Cái bàn — vần an\nQuả cam — vần am\nCái bảng — vần ang\nNhận ra: an kết thúc bằng n, am bằng m, ang bằng ng'),
  C(105, 'tip', 'Cách đánh vần', 'Bước 1: Đọc phụ âm đầu: b\nBước 2: Đọc vần: an\nBước 3: Ghép: b-an = ban\nBước 4: Thêm dấu thanh: bàn, bán, bản, bạn'),

  // === Bài 106: Vần -at, -ac, -ach, -anh ===
  C(106, 'intro', 'Vần có âm cuối khó hơn', 'Hôm nay học vần kết thúc bằng t, c, ch, nh. Những vần này phát âm "tắt" — dừng đột ngột.'),
  C(106, 'explain', 'Bốn vần mới', 'at: bát, cát, hát, mát, tát\nac: các, bác, hạc, mạc, tác\nach: cách, sách, mách, đạch\nanh: xanh, lanh, chanh, hanh, tranh'),
  C(106, 'example', 'Từ quen thuộc', 'cái bát — vần at\nbác sĩ — vần ac\nquyển sách — vần ach\nmàu xanh — vần anh'),
  C(106, 'tip', 'Phân biệt -ac và -ach', 'ac: phát âm ngắn gọn, miệng há — bác, các\nach: phát âm dài hơn, lưỡi chạm vòm — sách, cách\nThử so sánh: "bác" (ngắn) vs "bách" (dài hơn)'),

  // === Bài 107: Đọc câu ngắn ===
  C(107, 'intro', 'Từ tiếng lẻ đến câu', 'Bé đã biết đọc tiếng, giờ ghép tiếng thành câu ngắn 3-5 từ nhé!'),
  C(107, 'explain', 'Cấu trúc câu đơn giản', 'Câu = Ai + Làm gì\n"Bé đi học." — Bé (ai) + đi học (làm gì)\n"Mẹ nấu cơm." — Mẹ (ai) + nấu cơm (làm gì)\nCuối câu có dấu chấm (.)'),
  C(107, 'example', 'Đọc thử 5 câu', '1. Bé đi học.\n2. Mẹ nấu cơm.\n3. Bố đọc báo.\n4. Chó chạy nhanh.\n5. Hoa nở đẹp.'),
  C(107, 'tip', 'Cách đọc câu', 'Bước 1: Đọc từng từ riêng\nBước 2: Ghép 2 từ liền nhau\nBước 3: Đọc cả câu liền mạch\nKhông đọc quá nhanh!'),

  // === Bài 108: Đọc hiểu đoạn văn ===
  C(108, 'intro', 'Đọc và hiểu', 'Không chỉ đọc đúng mà còn phải hiểu nội dung. Hãy đọc chậm, suy nghĩ rồi trả lời câu hỏi.'),
  C(108, 'explain', 'Cách đọc hiểu', 'Bước 1: Đọc hết đoạn văn\nBước 2: Hỏi "Đoạn này nói về ai?"\nBước 3: Hỏi "Người đó làm gì?"\nBước 4: Trả lời câu hỏi'),
  C(108, 'example', 'Đoạn văn mẫu', '"Bé Mai đi học. Bé gặp bạn Hoa. Hai bạn cùng vào lớp."\n\nHỏi: Bé Mai gặp ai? → Bạn Hoa\nHỏi: Hai bạn làm gì? → Cùng vào lớp'),
  C(108, 'tip', 'Mẹo đọc hiểu', 'Đọc 2 lần: lần 1 hiểu chung, lần 2 tìm chi tiết.\nGạch chân từ quan trọng trong câu hỏi.'),

  // === Bài 109: Đọc thơ ===
  C(109, 'intro', 'Thơ có nhịp điệu', 'Thơ khác văn xuôi: có vần, có nhịp, nghe hay và dễ nhớ!'),
  C(109, 'explain', 'Vần trong thơ', 'Hai câu thơ gần nhau thường có từ cuối vần với nhau:\n"Nhà em có con mèo (èo)\nĐuôi dài, mắt sáng, hay trèo (èo) lên cây"\nmèo — trèo: vần "èo"'),
  C(109, 'example', 'Bài thơ mẫu', '"Ông mặt trời nhô lên (ên)\nSáng bừng cả sân (ân) vườn (ươn)\nCon chim hót líu lo (o)\nBé vui cười toe toét (oét)"'),
  C(109, 'tip', 'Đọc thơ diễn cảm', 'Đọc chậm rãi, ngắt nhịp đúng chỗ.\nNhấn mạnh từ cuối câu (từ mang vần).\nĐọc vui vẻ, không đều đều!'),

  // === Bài 110: Đọc truyện tranh ===
  C(110, 'intro', 'Truyện tranh = tranh + chữ', 'Truyện tranh kể câu chuyện bằng hình ảnh kèm lời thoại. Xem tranh giúp bé hiểu nội dung dễ hơn.'),
  C(110, 'explain', 'Cách đọc truyện tranh', 'Bước 1: Xem hết các tranh từ trái sang phải\nBước 2: Đọc lời thoại trong "bong bóng"\nBước 3: Ghép tranh + lời = hiểu câu chuyện'),
  C(110, 'example', 'Truyện mẫu', 'Tranh 1: Thỏ con đi ra vườn. "Hôm nay đẹp quá!"\nTranh 2: Thỏ gặp Sóc. "Chào bạn! Đi hái nấm nhé?"\nTranh 3: Hai bạn hái được nhiều nấm. "Vui quá!"'),
  C(110, 'tip', 'Hiểu truyện sâu hơn', 'Sau khi đọc, hỏi bé:\n- Ai là nhân vật chính?\n- Chuyện gì xảy ra?\n- Kết quả như thế nào?'),

  // === Bài 111: Sắp xếp câu ===
  C(111, 'intro', 'Trình tự là gì?', 'Câu chuyện xảy ra theo thứ tự: đầu tiên → tiếp theo → cuối cùng. Sắp xếp đúng thứ tự = hiểu câu chuyện!'),
  C(111, 'explain', 'Từ gợi ý trình tự', 'Đầu tiên, trước hết → câu mở đầu\nSau đó, tiếp theo → câu giữa\nCuối cùng, kết thúc → câu cuối\nNhận ra đúng từ gợi ý = sắp xếp dễ'),
  C(111, 'example', 'Thực hành sắp xếp', 'Lộn xộn:\n(B) Bé rửa tay sạch.\n(C) Bé ăn cơm ngon.\n(A) Bé đi học về.\n\nĐúng: A → B → C (về → rửa tay → ăn cơm)'),
  C(111, 'tip', 'Mẹo sắp xếp', 'Tìm câu "bắt đầu" (không cần gì xảy ra trước).\nTìm câu "kết thúc" (không có gì xảy ra sau).\nCâu còn lại ở giữa!'),

  // === Bài 112: Viết chữ hoa A-H ===
  C(112, 'intro', 'Chữ hoa là gì?', 'Chữ hoa (chữ in hoa) là chữ cái viết lớn, dùng ở đầu câu và tên riêng: An, Hà Nội, Việt Nam.'),
  C(112, 'explain', 'Quy tắc viết chữ hoa', 'A: 2 nét xiên + 1 nét ngang giữa\nB: 1 nét đứng + 2 nét cong bên phải\nC: 1 nét cong lớn mở phải\nD: 1 nét đứng + 1 nét cong lớn\nĐ: Giống D + gạch ngang\nE: 1 nét đứng + 3 nét ngang\nG: Giống C + nét ngang trong\nH: 2 nét đứng + 1 nét ngang giữa'),
  C(112, 'example', 'Ví dụ dùng chữ hoa', 'An đi học. (Tên người)\nHà Nội đẹp. (Tên thành phố)\nBé ăn cơm. (Đầu câu)'),
  C(112, 'tip', 'Mẹo viết đẹp', 'Viết trên giấy ô ly.\nĐi từ trên xuống dưới.\nChữ hoa cao 2.5 ô.\nLuyện mỗi chữ 1 dòng.'),

  // === Bài 113: Viết câu ngắn ===
  C(113, 'intro', 'Từ đọc đến viết', 'Bé đã đọc được câu, giờ tập VIẾT câu! Viết = suy nghĩ → chọn từ → đặt đúng thứ tự → viết ra.'),
  C(113, 'explain', 'Quy tắc viết câu', '1. Viết HOA chữ cái đầu câu\n2. Có chủ ngữ (Ai?) + vị ngữ (Làm gì?)\n3. Kết thúc bằng dấu chấm (.)\n4. Các từ cách nhau'),
  C(113, 'example', 'Câu mẫu', '✅ Đúng: "Bé đi học."\n❌ Sai: "bé đi học" (thiếu hoa, thiếu dấu chấm)\n❌ Sai: "Béđihọc." (không cách từ)'),
  C(113, 'tip', 'Mẹo viết câu', 'Đọc to câu trước khi viết.\nKiểm tra: Hoa đầu câu? Dấu chấm cuối? Cách từ?\nViết xong đọc lại 1 lần.'),

  // === Bài 114: Chính tả nghe viết ===
  C(114, 'intro', 'Nghe viết là gì?', 'Nghe viết = nghe người đọc → viết lại đúng chính tả. Cần chú ý lắng nghe kỹ từng từ.'),
  C(114, 'explain', 'Những lỗi hay gặp', 'd/gi: da/gia — "da dẻ" khác "gia đình"\ns/x: sa/xa — "sa đà" khác "xa xôi"\nch/tr: che/tre — "che mắt" khác "tre xanh"\nl/n: la/na — "la hét" khác "na ná"'),
  C(114, 'example', 'Thực hành', 'Nghe: "Con chim hót trên cành cây."\nViết đúng: Con chim hót trên cành cây.\nKiểm tra: chim (ch), trên (tr), cành (anh), cây (ây)'),
  C(114, 'tip', 'Mẹo chính tả', 'Nghe hết câu rồi mới viết.\nTừ nào không chắc, đánh vần trong đầu.\nSau khi viết, đọc lại để sửa.'),

  // === Bài 115: Danh từ đơn giản ===
  C(115, 'intro', 'Từ chỉ sự vật', 'Xung quanh bé có rất nhiều sự vật: người, con vật, đồ vật, cây cối. Từ gọi tên chúng gọi là từ chỉ sự vật.'),
  C(115, 'explain', '3 nhóm từ chỉ sự vật', 'Chỉ người: bố, mẹ, ông, bà, anh, chị, thầy, cô\nChỉ con vật: chó, mèo, gà, vịt, cá, chim\nChỉ đồ vật: bàn, ghế, sách, vở, bút, cặp'),
  C(115, 'example', 'Tìm từ chỉ sự vật', '"Mẹ cho bé ăn cơm."\nTừ chỉ sự vật: Mẹ (người), bé (người), cơm (đồ ăn)'),
  C(115, 'tip', 'Mẹo phân biệt', 'Hỏi "Đó là cái gì?" hoặc "Đó là ai?" → nếu trả lời được = từ chỉ sự vật.'),

  // === Bài 116: Động từ đơn giản ===
  C(116, 'intro', 'Từ chỉ hoạt động', 'Mọi người và mọi vật đều làm điều gì đó: chạy, nhảy, ăn, ngủ, hát... Đó là từ chỉ hoạt động!'),
  C(116, 'explain', 'Nhận biết từ chỉ hoạt động', 'Hỏi "Ai làm gì?" — câu trả lời là từ chỉ hoạt động.\n"Bé chạy." → chạy\n"Chim hót." → hót\n"Mẹ nấu cơm." → nấu'),
  C(116, 'example', 'Ví dụ', 'ăn, uống, ngủ, chạy, nhảy, đi, đứng, ngồi, hát, đọc, viết, vẽ, nấu, rửa, giặt'),
  C(116, 'tip', 'Mẹo nhớ', 'Bé có thể LÀM theo từ đó được không?\nChạy → bé chạy được ✅ = hoạt động\nBàn → bé "bàn" không được ❌ = sự vật'),

  // === Bài 117: Đặt câu với từ cho sẵn ===
  C(117, 'intro', 'Đặt câu = sáng tạo', 'Cho 1 từ, bé nghĩ ra 1 câu có từ đó. Đây là bước đầu để bé TỰ VIẾT!'),
  C(117, 'explain', 'Công thức đặt câu', 'Từ cho trước: "mèo"\nBước 1: Nghĩ ai/cái gì: con mèo\nBước 2: Nghĩ làm gì: đang ngủ\nBước 3: Ghép: "Con mèo đang ngủ."'),
  C(117, 'example', 'Thử đặt câu', 'Từ: hoa → "Bông hoa rất đẹp."\nTừ: chạy → "Bé chạy nhanh."\nTừ: sách → "Bé đọc sách."\nTừ: mưa → "Trời đang mưa."'),
  C(117, 'tip', 'Mẹo đặt câu hay', 'Dùng công thức: Ai/Cái gì + Làm gì/Thế nào\nThêm từ bổ sung để câu hay hơn:\n"Bé ăn." → "Bé ăn cơm ngon."'),

  // === Bài 118: Kể lại câu chuyện ===
  C(118, 'intro', 'Kể chuyện là gì?', 'Sau khi nghe hoặc đọc 1 câu chuyện, bé kể lại bằng lời của mình. Kể đúng trình tự: đầu → giữa → cuối.'),
  C(118, 'explain', 'Cách kể chuyện', 'Bước 1: Nhớ nhân vật chính (Ai?)\nBước 2: Nhớ sự việc chính (Chuyện gì?)\nBước 3: Nhớ kết quả (Thế nào?)'),
  C(118, 'example', 'Kể chuyện "Rùa và Thỏ"', 'Nhân vật: Rùa và Thỏ\nĐầu: Thỏ thách Rùa chạy thi.\nGiữa: Thỏ chạy nhanh rồi ngủ. Rùa chạy chậm nhưng không nghỉ.\nCuối: Rùa đến trước, Rùa thắng!'),
  C(118, 'tip', 'Mẹo kể hay', 'Dùng 3 từ: "Đầu tiên... Sau đó... Cuối cùng...".\nKể bằng giọng vui vẻ.\nNhìn vào tranh nếu có.'),

  // === Bài 119: Chào hỏi lịch sự ===
  C(119, 'intro', 'Lời nói lịch sự', 'Biết chào hỏi lịch sự là biết cách ứng xử đẹp. Ai cũng yêu quý người lịch sự!'),
  C(119, 'explain', 'Chào đúng theo đối tượng', 'Với thầy cô: "Em chào thầy/cô ạ!"\nVới ông bà: "Cháu chào ông/bà ạ!"\nVới bạn bè: "Chào bạn!" "Xin chào!"\nCảm ơn: "Con cảm ơn ạ!"\nXin lỗi: "Con xin lỗi ạ!"'),
  C(119, 'example', 'Tình huống thực tế', 'Đến lớp: "Em chào cô ạ!"\nKhi được cho quà: "Con cảm ơn ạ!"\nKhi va phải bạn: "Mình xin lỗi bạn nhé!"'),
  C(119, 'tip', 'Mẹo nhớ', 'Gặp ai → Chào trước\nĐược giúp → Cảm ơn\nLàm sai → Xin lỗi\nThêm "ạ" khi nói với người lớn'),

  // === Bài 120: Kể về bản thân ===
  C(120, 'intro', 'Giới thiệu bản thân', 'Bé tập nói về mình: tên, tuổi, lớp, sở thích. Đây là kỹ năng quan trọng để giao tiếp!'),
  C(120, 'explain', 'Nói gì về mình?', '1. Tên: "Em tên là..."\n2. Tuổi/Lớp: "Em ... tuổi, học lớp 1."\n3. Gia đình: "Gia đình em có ... người."\n4. Sở thích: "Em thích ..."\n5. Mong muốn: "Em muốn ..."'),
  C(120, 'example', 'Bài giới thiệu mẫu', '"Em chào cả lớp! Em tên là Minh. Em 6 tuổi, học lớp 1A. Gia đình em có 4 người: bố, mẹ, em và chị. Em thích vẽ và đá bóng."'),
  C(120, 'tip', 'Mẹo tự tin', 'Nhìn vào bạn bè khi nói.\nNói to, rõ ràng.\nMỉm cười thân thiện.\nKhông cần nói dài, nói đúng là được!'),
];
