/**
 * ĐẠO ĐỨC LỚP 2-5 — 80 bài (20 bài × 4 khối, GDPT 2018)
 * IDs: G2 321-340, G3 341-360, G4 361-380, G5 381-400
 */
import type { Lesson } from './seedData';

/* ───── Lớp 2 (321-340) ───── */
let sid2 = 0;
const L2 = (
  uc: string, lc: string, t: string, obj: string, sum: string, tip: string,
  diff: Lesson['difficulty'], mins: number,
): Lesson => ({
  id: 321 + sid2, grade: 2, subjectCode: 'ethics',
  unitCode: uc, lessonCode: lc, title: t,
  objective: obj, summarySimple: sum, tips: tip,
  difficulty: diff, estimatedMinutes: mins,
  status: 'ready' as const, sortOrder: ++sid2, isActive: 1,
});
export const ethicsLessons2: Lesson[] = [
  L2('u1','e2-01','Yêu thương gia đình','Biết thể hiện tình yêu thương với gia đình','Gia đình là nơi yêu thương nhất. Hãy quan tâm, giúp đỡ mọi người trong nhà.','Khuyến khích con nói "con yêu" với gia đình','easy',20),
  L2('u1','e2-02','Biết ơn người thân','Biết ơn ông bà, cha mẹ đã chăm sóc','Biết ơn = nhớ ơn + đền ơn. Chúc Tết, lễ, giúp việc nhà.','Cùng con viết thiệp cảm ơn','easy',20),
  L2('u1','e2-03','Quan tâm bạn bè','Biết chia sẻ, giúp đỡ bạn bè','Bạn bè = cùng học, cùng chơi, cùng chia sẻ. Hỏi thăm bạn ốm.','Cho con mang quà cho bạn ốm','easy',20),
  L2('u2','e2-04','Trung thực trong học tập','Không gian lận, nói thật kết quả','Trung thực = nói đúng sự thật. Không chép bài, không nói dối điểm.','Khen con khi con tự nhận lỗi','easy',20),
  L2('u2','e2-05','Giữ lời hứa','Biết giữ lời đã hứa','Hứa rồi phải làm. Không hứa nếu không chắc.','Cha mẹ cũng giữ lời hứa với con','easy',20),
  L2('u3','e2-06','Tự giác học bài','Tự giác làm bài không cần nhắc nhở','Tự giác = tự biết việc mình phải làm mà không ai bắt.','Lập thời gian biểu cùng con','easy',20),
  L2('u3','e2-07','Chăm chỉ lao động','Yêu LĐ, hoàn thành việc được giao','Chăm chỉ = siêng năng, không lười biếng. LĐ giúp ta lớn lên.','Giao con việc nhà nhỏ phù hợp','easy',20),
  L2('u3','e2-08','Tiết kiệm thời gian','Biết sắp xếp thời gian hợp lý','Thời gian quý lắm! Học – chơi – nghỉ đúng lúc.','Dùng đồng hồ cát làm Trách nhiệm','easy',20),
  L2('u4','e2-09','Kỷ luật ở trường','Biết tuân thủ nội quy trường lớp','Nội quy = luật chung. Xếp hàng, giơ tay phát biểu, đúng giờ.','Cùng con đọc nội quy lớp','easy',20),
  L2('u4','e2-10','Đoàn kết với bạn','Biết hợp tác, đoàn kết trong nhóm','Đoàn kết = cùng nhau, mạnh hơn. Không bắt nạt, không chia bè.','Cho con chơi trò nhóm','easy',20),
  L2('u5','e2-11','Chia sẻ và giúp đỡ','Biết chia sẻ với người cần','Chia sẻ = cho đi vui hơn nhận lại. Giúp bạn khó khăn.','Cùng con quyên góp đồ cũ','easy',20),
  L2('u5','e2-12','Lễ phép với thầy cô','Biết kính trọng, lễ phép với Giáo viên','Thầy cô dạy ta kiến thức. Chào, cảm ơn, xin lỗi.','Nhắc con chào Giáo viên mỗi ngày','easy',20),
  L2('u6','e2-13','Bảo vệ của công','Biết giữ gìn tài sản chung','Bàn ghế, sách thư viện = của chung. Không phá, không vẽ bậy.','Hướng dẫn con sử dụng đồ nhẹ tay','easy',20),
  L2('u6','e2-14','An toàn giao thông','Biết luật Giao thông cơ bản','Đèn đỏ dừng, đèn xanh đi, đội MBH, đi bên phải.','Cho con thực hành khi qua đường','easy',20),
  L2('u7','e2-15','Bảo vệ Môi trường xung quanh','Biết giữ gìn Môi trường sống sạch đẹp','Không xả rác bừa, trồng cây, tiết kiệm nước-điện.','Cùng con nhặt rác quanh nhà','easy',20),
  L2('u7','e2-16','Giữ gìn vệ sinh','Biết VS cá nhân, VS nơi ở','Đánh răng, rửa tay, tắm rửa, quần áo sạch = khỏe mạnh.','Tạo checklist VS cùng con','easy',20),
  L2('u8','e2-17','Phòng tránh tai nạn','Nhận biết nguy hiểm, biết phòng tránh','Không nghịch điện, lửa, nước sâu. Tránh xa vật nguy hiểm.','Dạy Số điện thoại khẩn cấp: 113-114-115','easy',20),
  L2('u8','e2-18','Tôn trọng sự khác biệt','Tôn trọng bạn khác mình','Mỗi người khác nhau = hay! Không chê Sắc da, ngoại hình, hoàn cảnh.','Kể câu chuyện về sự đa dạng','easy',20),
  L2('u9','e2-19','Yêu quê hương','Biết tự hào về quê hương','Quê hương = nơi mình sinh ra. Tự hào, giữ gìn nét đẹp quê.','Cùng con tìm hiểu địa phương','easy',20),
  L2('u9','e2-20','Ôn tập: Đạo đức 2','Ôn toàn bộ ĐĐ lớp 2','Yêu thương-Trung thực-Chăm chỉ-Đoàn kết-Kỷ luật-Bảo vệ môi trường.','Trò chơi ôn tập tình huống','easy',20),
];

/* ───── Lớp 3 (341-360) ───── */
let sid3 = 0;
const L3 = (
  uc: string, lc: string, t: string, obj: string, sum: string, tip: string,
  diff: Lesson['difficulty'], mins: number,
): Lesson => ({
  id: 341 + sid3, grade: 3, subjectCode: 'ethics',
  unitCode: uc, lessonCode: lc, title: t,
  objective: obj, summarySimple: sum, tips: tip,
  difficulty: diff, estimatedMinutes: mins,
  status: 'ready' as const, sortOrder: ++sid3, isActive: 1,
});
export const ethicsLessons3: Lesson[] = [
  L3('u1','e3-01','Tôn trọng sự thật','Dám nói sự thật, nhận lỗi','Sự thật = đúng những gì xảy ra. Dũng cảm nhận lỗi = được khen.','Khuyến khích con thành thật, không La khi con nhận lỗi','easy',25),
  L3('u1','e3-02','Tự chăm sóc bản thân','Biết tự lo vệ sinh, ăn uống, học tập','Tự chăm sóc = tự đánh răng, chuẩn bị cặp sách. Không ỷ lại.','Cho con tự gấp quần áo','easy',25),
  L3('u1','e3-03','Biết ơn thầy cô','Kính trọng, biết ơn thầy cô','Thầy cô tận tâm dạy ta. Ngày 20/11 = tri ân thầy cô.','Cùng con làm quà 20/11','easy',25),
  L3('u2','e3-04','Chia sẻ với cộng đồng','Biết giúp đỡ người xung quanh','Cộng đồng = xóm, phường. Quyên góp, tình nguyện, giúp bạn nghèo.','Tham gia hoạt động từ thiện cùng con','easy',25),
  L3('u2','e3-05','Trách nhiệm','Chịu trách nhiệm với việc mình làm','Trách nhiệm = làm rồi phải chịu hậu quả nếu sai. Hứa rồi phải làm.','Giao con trực nhật, giữ cam kết','easy',25),
  L3('u3','e3-06','Kiên trì vượt khó','Không bỏ cuộc khi gặp khó khăn','Kiên trì = cố gắng mãi. Edison thử 10.000 lần mới thành công!','Kể chuyện người thành công nhờ kiên trì','easy',25),
  L3('u3','e3-07','Tiết kiệm','Biết tiết kiệm tiền bạc, đồ dùng','Tiết kiệm = dùng vừa đủ, không lãng phí. Heo đất = bạn tốt.','Cho con heo đất và dạy quản lý tiền','easy',25),
  L3('u4','e3-08','Tôn trọng bạn bè','Tôn trọng ý kiến, cảm xúc của bạn','Tôn trọng = lắng nghe, không chê bai, không bắt nạt.','Dạy con cách phản hồi tích cực','easy',25),
  L3('u4','e3-09','Lòng nhân ái','Biết thương yêu, đồng cảm','Nhân ái = đặt mình vào vị trí người khác. Giúp người yếu.','Cùng con đi thăm viện dưỡng lão','easy',25),
  L3('u4','e3-10','Đoàn kết nhóm','Biết hợp tác, làm việc nhóm','Đoàn kết = mỗi người 1 việc, cùng hoàn thành. Không tranh cãi.','Cho con chơi trò team-building','easy',25),
  L3('u5','e3-11','Bảo vệ ĐV-TV','Yêu thương, bảo vệ SV','Không hại ĐV, không bẻ cây. ĐV-TV = bạn của ta.','Cùng con trồng cây, nuôi cá','easy',25),
  L3('u5','e3-12','Trật tự nơi Công cộng','Giữ trật tự ở nơi công cộng','Xếp hàng, không nói to, không xả rác ở nơi đông người.','Nhắc con khi đi siêu thị, rạp phim','easy',25),
  L3('u6','e3-13','Phòng chống BLHĐ','Nhận biết và tránh BLHĐ','BLHĐ = đánh, chửi, cô lập bạn. Nói với Giáo viên/cha mẹ nếu bị bắt nạt.','Dạy con biết dũng cảm nói KHÔNG','medium',25),
  L3('u6','e3-14','Kỹ năng từ chối','Biết nói KHÔNG với điều xấu','Từ chối = dũng cảm. Không theo bạn xấu, không nhận quà lạ.','Đóng vai tình huống','medium',25),
  L3('u7','e3-15','An toàn trên mạng','Nhận biết nguy hiểm trên Internet','Không chia sẻ thông tin cá nhân, không nói chuyện người lạ online.','Cài đặt kiểm soát gia đình trên TB','medium',25),
  L3('u7','e3-16','Chăm sóc sức khỏe','Biết giữ gìn Sức khỏe thể chất-tinh thần','Ăn đủ, ngủ đủ, tập Thể dục, vui vẻ = khỏe mạnh.','Tập Thể dục cùng con mỗi sáng','easy',25),
  L3('u8','e3-17','Siêng năng','Chăm chỉ trong mọi việc','Siêng năng = làm đều đặn, không chán nản. Giọt nước đều thủng đá.','Tạo thói quen tốt hằng ngày','easy',25),
  L3('u8','e3-18','Tôn trọng người LĐ','Biết quý trọng mọi nghề nghiệp','Mọi nghề đều đáng quý: bác sĩ, nông dân, lao công...','Cùng con cảm ơn cô lao công','easy',25),
  L3('u9','e3-19','Yêu Tổ quốc','Tự hào là người Việt Nam','Tổ quốc Việt Nam: cờ đỏ sao vàng, quê hương tươi đẹp. Hát Quốc ca.','Kể cho con nghe về lịch sử Việt Nam','easy',25),
  L3('u9','e3-20','Ôn tập: Đạo đức 3','Ôn toàn bộ ĐĐ lớp 3','Sự thật-Trách nhiệm-Kiên trì-Nhân ái-Bảo vệ môi trường-An toàn.','Trò chơi đố vui ĐĐ','easy',25),
];

/* ───── Lớp 4 (361-380) ───── */
let sid4 = 0;
const L4 = (
  uc: string, lc: string, t: string, obj: string, sum: string, tip: string,
  diff: Lesson['difficulty'], mins: number,
): Lesson => ({
  id: 361 + sid4, grade: 4, subjectCode: 'ethics',
  unitCode: uc, lessonCode: lc, title: t,
  objective: obj, summarySimple: sum, tips: tip,
  difficulty: diff, estimatedMinutes: mins,
  status: 'ready' as const, sortOrder: ++sid4, isActive: 1,
});
export const ethicsLessons4: Lesson[] = [
  L4('u1','e4-01','Trung thực và dũng cảm','Biết trung thực, dám đứng lên','Trung thực + dũng cảm = nói thật + bảo vệ lẽ phải. Không im khi thấy sai.','Khen con khi con bảo vệ bạn','easy',25),
  L4('u1','e4-02','Tự lập','Biết tự lập trong sinh hoạt, học tập','Tự lập = tự lo bản thân, không phụ thuộc. Tự nấu ăn đơn giản.','Cho con tự chuẩn bị bữa sáng','easy',25),
  L4('u2','e4-03','Tiết kiệm tài nguyên','Biết tiết kiệm nước, điện, giấy','Tài nguyên có hạn. Tắt đèn, tắt vòi, dùng giấy 2 mặt.','Theo dõi hóa đơn điện nước cùng con','easy',25),
  L4('u2','e4-04','Công bằng','Biết đối xử công bằng, không thiên vị','Công bằng = ai cũng được đối xử như nhau. Chia đều.','Hỏi con: "Con nghĩ thế nào là công bằng?"','easy',25),
  L4('u2','e4-05','Khoan dung','Biết tha thứ, bao dung','Khoan dung = tha thứ lỗi nhỏ, cho bạn cơ hội sửa. Giận thì đếm đến 10.','Dạy con cách quản lý cảm xúc','easy',25),
  L4('u3','e4-06','Tôn trọng pháp luật','Biết tuân thủ luật, nội quy','Pháp luật = luật chung cho tất cả. Ai cũng phải tuân thủ, kể cả người lớn.','Giải thích Pháp luật đơn giản cho con','medium',25),
  L4('u3','e4-07','Yêu hòa bình','Giải quyết mâu thuẫn bằng đối thoại','Hòa bình = không đánh nhau, nói chuyện giải quyết. thời gian cần hòa bình.','Kể chuyện hòa bình','easy',25),
  L4('u4','e4-08','Bảo vệ di sản VH','Trân trọng di sản văn hóa dân tộc','Di sản: Hạ Long, phố cổ Hội An, nhã nhạc Huế... = tự hào Việt Nam.','Đưa con tham quan di sản','easy',25),
  L4('u4','e4-09','Phòng chống bạo lực','Nhận biết, phòng tránh bạo lực','Bạo lực = sai. Nói cho người lớn biết, gọi 111 (bảo vệ TE).','Dạy con Số điện thoại 111','medium',25),
  L4('u5','e4-10','An toàn Internet','Bảo vệ bản thân trên mạng xã hội','Không gửi ảnh riêng tư, không gặp người lạ online, mật khẩu mạnh.','Kiểm tra hoạt động online con','medium',25),
  L4('u5','e4-11','Bảo vệ thiên nhiên','Yêu thiên nhiên, sống xanh','BV rừng, biển, ĐV. 1 hành động nhỏ = 1 bước lớn cho TĐ.','Trồng cây cùng con','easy',25),
  L4('u6','e4-12','Ứng xử văn minh','Cư xử đúng mực nơi công cộng','Nói "cảm ơn", xếp hàng, nhường ghế, không Kỹ năng to.','Làm gương cho con ở nơi công cộng','easy',25),
  L4('u6','e4-13','Quyền trẻ em','Biết quyền và bổn phận của TE','Quyền: học, chơi, được BV, có ý kiến. Bổn phận: ngoan, học, giúp đỡ.','Đọc Công ước Quyền TE cùng con','medium',25),
  L4('u7','e4-14','Bình đẳng giới','Tôn trọng bình đẳng nam-nữ','Nam-nữ bình đẳng: cùng quyền, cùng cơ hội. Việc nhà ai cũng làm.','Chia đều việc nhà không phân biệt giới','medium',25),
  L4('u7','e4-15','Liêm chính','Không tham lam, nhận bất chính','Liêm chính = sạch sẽ, không gian lận, nhặt được trả lại.','Khen con khi trả đồ nhặt được','easy',25),
  L4('u8','e4-16','Tự trọng','Biết giữ nhân phẩm, tự trọng','Tự trọng = không làm điều xấu hổ, giữ danh dự bản thân.','Hỏi con: "Điều gì khiến con tự hào?"','easy',25),
  L4('u8','e4-17','Yêu lao động','Trân trọng thành quả LĐ','LĐ = vinh quang. Trân trọng cơm ăn, áo mặc nhờ LĐ.','Cho con tham gia ngày LĐ','easy',25),
  L4('u8','e4-18','Tình bạn đẹp','Xây dựng tình bạn lành mạnh','Bạn tốt = động viên, giúp đỡ, nói thật. Không rủ bạn làm sai.','Hỏi con về bạn bè ở lớp','easy',25),
  L4('u9','e4-19','Yêu nước','Làm việc tốt cho đất nước','Yêu nước = học giỏi, lao động tốt, bảo vệ quê hương.','Kể về anh hùng nhỏ tuổi Việt Nam','easy',25),
  L4('u9','e4-20','Ôn tập: Đạo đức 4','Ôn toàn bộ ĐĐ lớp 4','Trung thực-Công bằng-Pháp luật-Hòa bình-BV Trách nhiệm-Quyền TE.','Đố vui tình huống ĐĐ','easy',25),
];

/* ───── Lớp 5 (381-400) ───── */
let sid5 = 0;
const L5 = (
  uc: string, lc: string, t: string, obj: string, sum: string, tip: string,
  diff: Lesson['difficulty'], mins: number,
): Lesson => ({
  id: 381 + sid5, grade: 5, subjectCode: 'ethics',
  unitCode: uc, lessonCode: lc, title: t,
  objective: obj, summarySimple: sum, tips: tip,
  difficulty: diff, estimatedMinutes: mins,
  status: 'ready' as const, sortOrder: ++sid5, isActive: 1,
});
export const ethicsLessons5: Lesson[] = [
  L5('u1','e5-01','Em là công dân nhỏ','Hiểu quyền & Trách nhiệm công dân','Công dân = người thuộc 1 quốc gia. Em có quyền + trách nhiệm.','Giải thích CMND/CCCD','medium',30),
  L5('u1','e5-02','Tôn trọng pháp luật','Hiểu Pháp luật bảo vệ mọi người','Pháp luật = quy tắc chung, ai vi phạm đều bị xử lý. Pháp luật BV ta.','Đọc tin pháp luật thiếu nhi cùng con','medium',30),
  L5('u1','e5-03','Dân chủ','Biết quyền dân chủ, tự do ý kiến','Dân chủ = mọi người có quyền nêu ý kiến, bầu cử, quyết định.','Cho con bầu cử lớp trưởng','medium',30),
  L5('u2','e5-04','Trách nhiệm Xã hội','Ý thức trách nhiệm với cộng đồng','Trách nhiệm Xã hội = mỗi hành động ảnh hưởng đến xã hội. Hành động tốt!','Tham gia hoạt động tình nguyện','medium',30),
  L5('u2','e5-05','Tôn trọng ĐDVH','Tôn trọng văn hóa các dân tộc','54 dân tộc Việt Nam: mỗi dân tộc có trang phục, lễ hội, ngôn ngữ riêng.','Tham quan bảo tàng dân tộc học','easy',30),
  L5('u2','e5-06','Hòa bình và hữu nghị','Yêu chuộng Hòa bình thế giới','Hòa bình = không chiến tranh. Hữu nghị = bạn bè quốc tế.','Kể về Liên Hợp Quốc','medium',30),
  L5('u3','e5-07','Em biết bảo vệ mình','Kỹ năng BV bản thân','BV mình: nói KHÔNG, tránh xa, kể cho người lớn biết.','Đóng vai tình huống nguy hiểm','medium',30),
  L5('u3','e5-08','Quản lý cảm xúc','Nhận biết, điều chỉnh cảm xúc','Vui-Buồn-Giận-Sợ = bình thường. Điều chỉnh = hít thở, đếm 10.','Dạy con kỹ thuật hít thở 4-7-8','medium',30),
  L5('u3','e5-09','Tự chủ','Biết làm chủ bản thân','Tự chủ = kiểm soát hành vi, không để cảm xúc chi phối.','Bàn luận tình huống thực tế','medium',30),
  L5('u4','e5-10','Tư duy phản biện','Biết đặt câu hỏi, suy nghĩ logic','Phản biện = không tin ngay, kiểm tra thông tin trước khi tin.','Cùng con phân tích tin fake','hard',30),
  L5('u4','e5-11','Tiết kiệm năng lượng','Sử dụng Người lạ hợp lý','Người lạ hóa thạch có hạn. Tắt đèn, đi bộ, dùng Người lạ sạch.','So sánh hóa đơn điện tháng','medium',30),
  L5('u4','e5-12','Sống xanh','Lối sống thân thiện với Môi trường','Sống xanh = giảm rác, tái chế, dùng sản phẩm Trách nhiệm. Zero waste.','Thử 1 tuần không dùng túi nilon','medium',30),
  L5('u5','e5-13','Chia sẻ yêu thương','Lan tỏa yêu thương trong Xã hội','Yêu thương = chăm sóc, giúp đỡ không tính toán. Cho = nhận.','Tham gia phong trào thiện nguyện','easy',30),
  L5('u5','e5-14','Giữ gìn danh dự','Bảo vệ danh dự bản thân, gia đình','Danh dự = uy tín, tiếng tốt. Không làm mất thể diện mình + gia đình.','Bàn về hậu quả hành vi xấu','medium',30),
  L5('u6','e5-15','Giải quyết xung đột','Kỹ năng giải quyết mâu thuẫn','XĐ = 2 bên không đồng ý. GQ: lắng nghe, thỏa thuận, không bạo lực.','Đóng vai: hòa giải mâu thuẫn','medium',30),
  L5('u6','e5-16','Hợp tác','Biết hợp tác để đạt mục tiêu','Hợp tác = cùng làm, cùng chia, cùng thắng. Win-win.','Cho con làm dự án nhóm','easy',30),
  L5('u7','e5-17','Khiêm tốn','Biết khiêm tốn, không kiêu ngạo','Khiêm tốn = giỏi nhưng không khoe. Học mãi không bao giờ đủ.','Kể chuyện Bác Hồ khiêm tốn','easy',30),
  L5('u7','e5-18','Nhân văn','Sống nhân văn, yêu con người','Nhân văn = đặt con người lên trước, yêu thương mọi lúc.','Cùng con đọc sách về nhân văn','easy',30),
  L5('u8','e5-19','Tự hào dân tộc','Tự hào về truyền thống dân tộc Việt Nam','Việt Nam: 4000 năm lịch sử, Bách Việt, chiến thắng ngoại xâm, văn hóa đa dạng.','Kể chuyện Hai Bà Trưng, Quang Trung','easy',30),
  L5('u8','e5-20','Ôn tổng kết: Đạo đức 5','Ôn tập + tổng kết cấp I','Công dân-Pháp luật-Dân chủ-Nhân ái-Hòa bình-BV Trách nhiệm-Tự hào Việt Nam. Sẵn sàng lên lớp 6!','Khuyến khích con chia sẻ','easy',30),
];
