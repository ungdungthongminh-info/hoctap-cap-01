/**
 * TỰ NHIÊN & XÃ HỘI LỚP 2-3 — 160 thẻ (4 thẻ × 40 bài)
 * G2 Cards: 1441-1520 | G3 Cards: 1521-1600
 */
import type { LessonCard } from './seedData';
let cid = 1440;
const C = (
  lessonId: number, type: LessonCard['cardType'], title: string,
  content: string, example: string | null, sort: number,
): LessonCard => ({
  id: ++cid, lessonId, cardType: type, title, content,
  exampleJson: example, sortOrder: sort, isActive: 1,
});
export const natureCards2to3: LessonCard[] = [
  // === G2 L221: Cơ quan vận động ===
  C(221,'intro','Cơ quan vận động là gì?','Xương, cơ, khớp giúp cơ thể cử động, di chuyển.',null,1),
  C(221,'explain','Xương và Cơ','Xương tạo khung, cơ bám vào xương co-duỗi → vận động.',null,2),
  C(221,'example','Vận động hàng ngày','Đi, chạy, nhảy, viết đều nhờ xương-cơ phối hợp.','["Co tay = cơ bắp tay co lại", "Duỗi tay = cơ bắp tay duỗi ra"]',3),
  C(221,'tip','Chăm tập thể dục','Tập thể dục giúp xương cứng cáp, cơ khỏe mạnh.',null,4),

  // === G2 L222: Cơ quan hô hấp ===
  C(222,'intro','Đường hô hấp','Mũi→Khí quản→Phổi: đường không khí vào cơ thể.',null,1),
  C(222,'explain','Phổi trao đổi khí','Phổi hít ô-xi vào, thải CO₂ ra. 2 lá phổi trong lồng ngực.',null,2),
  C(222,'example','Hít vào - Thở ra','Hít vào: ngực phồng. Thở ra: ngực xẹp.','["Hít sâu → đếm 4 → thở chậm = thở đúng cách"]',3),
  C(222,'tip','Giữ không khí sạch','Không hút thuốc, trồng cây xanh, đeo khẩu trang khi bụi.',null,4),

  // === G2 L223: Cơ quan tiêu hóa ===
  C(223,'intro','Đường tiêu hóa','Miệng→Thực quản→Dạ dày→Ruột non→Ruột già.',null,1),
  C(223,'explain','Tiêu hóa thức ăn','Miệng nhai, dạ dày nhào trộn, ruột non hấp thụ chất dinh dưỡng.',null,2),
  C(223,'example','Một miếng cơm đi đâu?','Cơm: nhai → nuốt → dạ dày nghiền → ruột hấp thụ.','["Tinh bột → đường đơn nhờ enzyme"]',3),
  C(223,'tip','Ăn chậm nhai kỹ','Nhai kỹ = tiêu hóa tốt, ít đau bụng.',null,4),

  // === G2 L224: Cơ quan tuần hoàn ===
  C(224,'intro','Tim và mạch máu','Tim bơm máu, mạch máu dẫn máu đi khắp cơ thể.',null,1),
  C(224,'explain','Vòng tuần hoàn','Tim→Động mạch→Mao mạch→Tĩnh mạch→Tim. Máu mang O₂ + chất DD.',null,2),
  C(224,'example','Tim đập','Tim đập ~80 lần/phút. Khi chạy: nhanh hơn → cần nhiều O₂.','["Đặt tay lên ngực trái → cảm nhận nhịp tim"]',3),
  C(224,'tip','Giữ tim khỏe','Tập thể dục, ăn rau quả, ngủ đủ giấc → tim khỏe.',null,4),

  // === G2 L225: Nước trong đời sống ===
  C(225,'intro','Nước ở đâu?','Nước: sông, hồ, biển, nước ngầm, nước mưa.',null,1),
  C(225,'explain','Nước cần cho sống','Con người, ĐV, Thực vật đều cần nước. Cơ thể 60-70% nước.',null,2),
  C(225,'example','Dùng nước hàng ngày','Uống, tắm rửa, nấu ăn, tưới cây, giặt quần áo.','["Uống 6-8 cốc nước / ngày"]',3),
  C(225,'tip','Tiết kiệm nước','Tắt vòi khi đánh răng, sửa vòi rỉ, dùng vừa đủ.',null,4),

  // === G2 L226: Không khí ===
  C(226,'intro','KK ở khắp nơi','Không khí bao quanh TĐ, không màu, không mùi.',null,1),
  C(226,'explain','Thành phần KK','~78% Ni-tơ, ~21% Ô-xi, ~1% khí khác + hơi nước.',null,2),
  C(226,'example','Chứng minh KK','Thổi bóng bay = KK vào bóng. Quạt = cảm nhận gió (KK).','["Úp cốc vào nước → bọt khí = KK"]',3),
  C(226,'tip','Giữ KK sạch','Trồng cây, không đốt rác, dùng xe buýt ít khói.',null,4),

  // === G2 L227: Thời tiết ===
  C(227,'intro','Thời tiết là gì?','Trạng thái KQ ở 1 nơi, 1 lúc: nắng/mưa/gió...',null,1),
  C(227,'explain','Các hiện tượng','Nắng, mưa, gió, sấm sét, mây, sương mù.',null,2),
  C(227,'example','Dự báo thời tiết','Xem Thực vật/điện thoại: hôm nay nắng 35°C, chiều mưa.','["Mây đen = sắp mưa", "Trout nắng = trời quang"]',3),
  C(227,'tip','Ăn mặc theo thời tiết','Nóng: mỏng. Lạnh: áo ấm. Mưa: mang ô.',null,4),

  // === G2 L228: Các mùa ===
  C(228,'intro','4 mùa Việt Nam','Xuân: ấm. Hạ: nóng. Thu: mát. Đông: lạnh.',null,1),
  C(228,'explain','Vì sao có mùa?','Trái Đất nghiêng trục + quay quanh Môi trường → mùa thay đổi.',null,2),
  C(228,'example','Đặc điểm từng mùa','Xuân: hoa nở. Hạ: ve kêu. Thu: lá vàng. Đông: rét.','["Miền Nam VN: 2 mùa mưa/khô"]',3),
  C(228,'tip','Yêu thiên nhiên','Mỗi mùa đều đẹp, hãy quan sát và trân trọng!',null,4),

  // === G2 L229: Thực vật quanh em ===
  C(229,'intro','Thực vật ở khắp nơi','Cây cối ở vườn, công viên, rừng, đồng ruộng.',null,1),
  C(229,'explain','Phân loại đơn giản','Cây gỗ (to, thân cứng), cây bụi (nhiều cành), cây cỏ (nhỏ mềm).',null,2),
  C(229,'example','Thực vật quen thuộc','Xoài, nhãn = cây ăn quả. Lúa, ngô = cây lương thực.','["Hoa hồng, hoa cúc = cây hoa"]',3),
  C(229,'tip','Chăm cây','Tưới nước, nhổ cỏ, không bẻ cành → chăm Thực vật.',null,4),

  // === G2 L230: Bộ phận cây ===
  C(230,'intro','5 bộ phận','Rễ, thân, lá, hoa, quả (hạt) = các phần cây.',null,1),
  C(230,'explain','Chức năng','Rễ: hút nước. Thân: vận chuyển. Lá: quang hợp. Hoa: sinh sản.',null,2),
  C(230,'example','Quan sát cây','Cây cam: rễ cọc, thân gỗ, lá xanh, hoa trắng, quả cam.','["Rễ chùm: lúa. Rễ cọc: cam"]',3),
  C(230,'tip','Thí nghiệm','Đặt cành hoa vào nước màu → nước dâng lên = thân VC.',null,4),

  // === G2 L231: Động vật quanh em ===
  C(231,'intro','ĐV đa dạng','Chó, mèo, gà, cá, bướm... đều là động vật.',null,1),
  C(231,'explain','ĐV nuôi vs hoang dã','Nuôi: chó, mèo, gà. Hoang dã: hổ, voi, cá heo.',null,2),
  C(231,'example','ĐV thân thuộc','Chó: trung thành, giữ nhà. Mèo: bắt chuột. Gà: cho trứng.','["ĐV có xương sống: chó, cá. Không xương sống: ốc, sâu"]',3),
  C(231,'tip','Yêu ĐV','Không trêu, không đánh ĐV. Cho ăn đúng cách.',null,4),

  // === G2 L232: Côn trùng ===
  C(232,'intro','Côn trùng là gì?','ĐV nhỏ, 6 chân, 3 phần: đầu-ngực-bụng.',null,1),
  C(232,'explain','Đặc điểm','6 chân, có thể có cánh. Nhiều loài: ong, kiến, bướm, muỗi.',null,2),
  C(232,'example','CT có ích vs có hại','Có ích: ong (mật), bướm (thụ phấn). Có hại: muỗi, sâu.','["Kiến: tuy nhỏ nhưng rất khỏe, làm việc nhóm"]',3),
  C(232,'tip','Bảo vệ CT có ích','Không giết ong, bướm, bọ rùa → giúp thụ phấn cây.',null,4),

  // === G2 L233: Gia đình em ===
  C(233,'intro','Gia đình','Ông bà, cha mẹ, anh chị em sống cùng nhau.',null,1),
  C(233,'explain','Vai trò gia đình','GĐ chăm sóc, dạy dỗ, yêu thương. Em giúp đỡ GĐ.',null,2),
  C(233,'example','Hoạt động GĐ','Ăn cơm cùng, dọn nhà, đi chơi, giúp bố mẹ.','["Nấu ăn, giặt đồ, tưới cây = việc nhà em làm được"]',3),
  C(233,'tip','Yêu gia đình','Nói "Con yêu mẹ/bố" mỗi ngày, giúp việc nhà.',null,4),

  // === G2 L234: Trường học ===
  C(234,'intro','Trường em','Lớp học, sân trường, thư viện, phòng y tế, nhà vệ sinh.',null,1),
  C(234,'explain','Hoạt động ở trường','Học, chơi, ăn trưa, sinh hoạt tập thể.',null,2),
  C(234,'example','Người ở trường','Thầy/cô giáo, bạn học, bảo vệ, nhân viên.','["Thư viện: mượn sách. Phòng y tế: khi ốm"]',3),
  C(234,'tip','Giữ trường sạch','Không xả rác, giữ bàn ghế sạch, chăm cây.',null,4),

  // === G2 L235: Cộng đồng ===
  C(235,'intro','Quanh em','Khu phố, chợ, bệnh viện, công viên, trạm xe.',null,1),
  C(235,'explain','Mọi người cùng sống','Hàng xóm giúp nhau, cùng giữ gìn nơi sống.',null,2),
  C(235,'example','Nơi công cộng','Đường phố, chợ, bưu điện, trạm y tế.','["Đi chợ: mua rau, thịt, cá"]',3),
  C(235,'tip','Lễ phép','Chào hàng xóm, giúp người già, không ồn ào.',null,4),

  // === G2 L236: ATGT ===
  C(236,'intro','Luật giao thông','Đèn đỏ dừng, đèn xanh đi, đèn vàng chậm.',null,1),
  C(236,'explain','An toàn đi đường','Đi bên phải, sang đường ở vạch, đội mũ BH.',null,2),
  C(236,'example','Biển báo','Biển cấm, biển nguy hiểm, biển chỉ dẫn.','["Biển tròn đỏ = cấm", "Biển tam giác = cảnh báo"]',3),
  C(236,'tip','Nhớ quy tắc','Đội mũ BH khi đi xe máy. Nhìn 2 bên khi qua đường.',null,4),

  // === G2 L237: An toàn ở nhà ===
  C(237,'intro','Nguy hiểm ở nhà','Điện giật, bỏng, đứt tay, ngã cầu thang.',null,1),
  C(237,'explain','Phòng tránh','Không chọc ổ điện, không chơi gần bếp, cẩn thận dao kéo.',null,2),
  C(237,'example','Xử lý sự cố','Bỏng: dội nước lạnh. Chảy máu: ấn gạc. Gọi 115.','["Nhớ SĐT: 113 CA, 114 PCCC, 115 cấp cứu"]',3),
  C(237,'tip','Nói với người lớn','Gặp nguy hiểm → gọi bố mẹ, thầy cô ngay.',null,4),

  // === G2 L238: Vệ sinh cơ thể ===
  C(238,'intro','Sạch sẽ = khỏe mạnh','Tắm, đánh răng, rửa tay, cắt móng tay.',null,1),
  C(238,'explain','6 bước rửa tay','Lòng-lưng-kẽ-móng-ngón cái-cổ tay. Xà phòng 20 giây.',null,2),
  C(238,'example','Thời điểm rửa tay','Trước ăn, sau đi VS, sau chơi, sau hắt hơi.','["Đánh răng: sáng + tối, mỗi lần 2 phút"]',3),
  C(238,'tip','Tự chăm sóc','Tự tắm rửa, tự thay đồ sạch = em lớn rồi!',null,4),

  // === G2 L239: Bảo vệ nguồn nước ===
  C(239,'intro','Nước sạch quý giá','Chỉ 1% nước TĐ dùng được. Cần giữ sạch!',null,1),
  C(239,'explain','Ô nhiễm nước','Xả rác, hóa chất, nước thải → nước bẩn → bệnh.',null,2),
  C(239,'example','Hành động BV nước','Không xả rác xuống sông. Tắt vòi. Dùng vừa đủ.','["1 giọt nước rỉ = 20 lít/ngày lãng phí!"]',3),
  C(239,'tip','Em làm được','Tắt vòi khi xoa xà phòng, nhắc bạn tiết kiệm.',null,4),

  // === G2 L240: Ôn tập ===
  C(240,'intro','Ôn cuối năm lớp 2','Tổng hợp: cơ thể, Tự nhiên, XH, an toàn.',null,1),
  C(240,'explain','Kiến thức trọng tâm','Cơ quan cơ thể, nước-KK, Thực vật-ĐV, cộng đồng.',null,2),
  C(240,'example','Bài tập ôn','Kể tên CQ cơ thể, phân loại Thực vật, biển ATGT.','["Sơ đồ tư duy: vẽ tóm tắt 1 trang"]',3),
  C(240,'tip','Học vui','Chơi đố vui, vẽ poster, làm mô hình Tự nhiên.',null,4),

  // === G3 L241: Các giác quan ===
  C(241,'intro','5 giác quan','Thị giác, thính giác, khứu giác, vị giác, xúc giác.',null,1),
  C(241,'explain','Cơ quan - giác quan','Mắt=nhìn, Tai=nghe, Mũi=ngửi, Lưỡi=nếm, Da=sờ.',null,2),
  C(241,'example','Thí nghiệm','Bịt mắt: đoán quả bằng sờ + ngửi + nếm.','["Mắt: nhận hình-màu. Tai: nhận âm thanh"]',3),
  C(241,'tip','Bảo vệ giác quan','Không nhìn gần, không nghe to, ăn vừa cay.',null,4),

  // === G3 L242: Dinh dưỡng ===
  C(242,'intro','4 nhóm chất','Tinh bột, Đạm, Chất béo, Vitamin+Khoáng chất.',null,1),
  C(242,'explain','Cân đối dinh dưỡng','Mỗi bữa cần đủ 4 nhóm. Tháp dinh dưỡng.',null,2),
  C(242,'example','Bữa ăn cân đối','Cơm(tinh bột)+Thịt(đạm)+Dầu(béo)+Rau(vitamin).','["Sữa: đạm+canxi. Trái cây: vitamin C"]',3),
  C(242,'tip','Ăn đa dạng','Không kén ăn, ăn nhiều rau quả, uống đủ nước.',null,4),

  // === G3 L243: Cơ quan bài tiết ===
  C(243,'intro','Bài tiết = thải chất thừa','Thận lọc máu → nước tiểu. Da → mồ hôi.',null,1),
  C(243,'explain','Thận và Da','Thận: 2 quả, lọc 180L máu/ngày. Da: tuyến mồ hôi.',null,2),
  C(243,'example','Khi nắng nóng','Nóng → mồ hôi nhiều → cần uống nước bù.','["Nước tiểu vàng đậm = thiếu nước!"]',3),
  C(243,'tip','Giữ thận khỏe','Uống đủ nước, ít muối, không nhịn tiểu.',null,4),

  // === G3 L244: Cơ quan thần kinh ===
  C(244,'intro','Não - trung tâm','Não điều khiển mọi hoạt động: suy nghĩ, cảm xúc, vận động.',null,1),
  C(244,'explain','Hệ thần kinh','Não→Tủy sống→Dây TK toàn thân. TK truyền tín hiệu.',null,2),
  C(244,'example','Phản xạ','Chạm nóng → tay rụt lại ngay = phản xạ (TK tự động).','["Não: ~100 tỉ tế bào thần kinh!"]',3),
  C(244,'tip','Bảo vệ não','Ngủ 9-10h, không thức khuya, đội mũ BH.',null,4),

  // === G3 L245: Chất rắn - lỏng - khí ===
  C(245,'intro','3 trạng thái','Rắn: hình dạng cố định. Lỏng: chảy theo bình. Khí: bay khắp.',null,1),
  C(245,'explain','Chuyển đổi','Đá(rắn) ▷ nước(lỏng) ▷ hơi(khí). Nhiệt → thay đổi TT.',null,2),
  C(245,'example','Nấu nước','Nước đá → tan → nước → sôi → hơi nước bay lên.','["Sôi: 100°C = nước lỏng → khí"]',3),
  C(245,'tip','Thí nghiệm','Cho đá vào cốc nước ấm → quan sát đá tan → hơi nước.',null,4),

  // === G3 L246: Nhiệt độ ===
  C(246,'intro','Nhiệt độ','Đo nóng/lạnh bằng °C. Nhiệt kế thủy ngân/điện tử.',null,1),
  C(246,'explain','Các mốc nhiệt','0°C: nước đóng đá. 37°C: thân nhiệt. 100°C: nước sôi.',null,2),
  C(246,'example','Đo nhiệt','Đo thân nhiệt: kẹp nách/trán. Đo nước: nhúng nhiệt kế.','["Sốt: >37.5°C → nghỉ ngơi, uống thuốc"]',3),
  C(246,'tip','An toàn','Không chạm nhiệt kế thủy ngân bể (thủy ngân độc!).',null,4),

  // === G3 L247: Ánh sáng ===
  C(247,'intro','Nguồn sáng','Tự nhiên: Mặt Trời, sao. Nhân tạo: đèn, nến.',null,1),
  C(247,'explain','Truyền thẳng','AS đi thẳng, bị chặn → bóng. Vật: trong suốt/mờ/đục.',null,2),
  C(247,'example','Bóng đổ','Đứng ngoài nắng → bóng em. Đèn pin → bóng tay.','["Kính trong suốt: AS qua. Gỗ đục: AS không qua"]',3),
  C(247,'tip','Bảo vệ mắt','Không nhìn thẳng Môi trường, đeo kính râm, đọc đủ sáng.',null,4),

  // === G3 L248: Âm thanh ===
  C(248,'intro','Âm thanh từ rung','Vật rung → KK rung → tai nghe = âm thanh.',null,1),
  C(248,'explain','Cao - trầm, to - nhỏ','Rung nhanh=cao, rung chậm=trầm. Gần=to, xa=nhỏ.',null,2),
  C(248,'example','Thí nghiệm','Gẩy dây thun căng → nghe âm. Thước rung → nghe.','["Trống: đánh → mặt trống rung → âm thanh"]',3),
  C(248,'tip','Bảo vệ tai','Không nghe nhạc quá to, tránh tiếng ồn lớn.',null,4),

  // === G3 L249: Đời sống thực vật ===
  C(249,'intro','Cây cần gì?','Nước, ánh sáng, đất (khoáng chất), không khí.',null,1),
  C(249,'explain','Quang hợp','Lá + AS + CO₂ + H₂O → tinh bột + O₂. Lá = "nhà bếp".',null,2),
  C(249,'example','Thí nghiệm','Che tối 1 cây, 1 cây có nắng → cây tối yếu đi.','["Quang hợp: ban ngày. Hô hấp: suốt ngày đêm"]',3),
  C(249,'tip','Trồng cây','Tưới nước, để nơi có nắng, bón phân nhẹ.',null,4),

  // === G3 L250: Sinh sản Thực vật ===
  C(250,'intro','Cây sinh sản','Bằng hạt (đậu, lúa) hoặc sinh dưỡng (khoai, rau muống).',null,1),
  C(250,'explain','Hạt nảy mầm','Hạt + nước + ấm → nảy mầm → rễ → thân → lá.',null,2),
  C(250,'example','Gieo hạt đậu','Ngâm hạt → đặt trên bông ẩm → 3 ngày: rễ → 7 ngày: lá.','["Khoai lang: cắt đoạn dây → trồng = sinh dưỡng"]',3),
  C(250,'tip','Theo dõi','Gieo hạt, ghi nhật ký: ngày 1, 3, 5, 7 → vẽ.',null,4),

  // === G3 L251: Đời sống ĐV ===
  C(251,'intro','ĐV ăn gì?','Ăn cỏ: bò, thỏ. Ăn thịt: hổ, cá mập. Ăn tạp: gấu, lợn.',null,1),
  C(251,'explain','Nơi sống','Cạn: chó, mèo. Nước: cá, tôm. Bay: chim, dơi.',null,2),
  C(251,'example','ĐV Việt Nam','Sao la (quý hiếm), trâu, voi, cá ngừ.','["Voọc mũi hếch: chỉ có ở VN!"]',3),
  C(251,'tip','Bảo vệ ĐV','Không săn bắt, không nuôi ĐV hoang dã.',null,4),

  // === G3 L252: Sinh sản ĐV ===
  C(252,'intro','Đẻ trứng vs đẻ con','Gà, cá = đẻ trứng. Chó, mèo = đẻ con.',null,1),
  C(252,'explain','Biến thái','Ếch: trứng→nòng nọc→ếch con. Bướm: trứng→sâu→nhộng→bướm.',null,2),
  C(252,'example','Vòng đời','Gà: trứng → ấp 21 ngày → gà con. Bướm: 4 giai đoạn.','["Ếch: sống dưới nước lúc nhỏ, lên bờ khi lớn"]',3),
  C(252,'tip','Quan sát','Nuôi tằm/nòng nọc → quan sát biến thái.',null,4),

  // === G3 L253: Chuỗi thức ăn ===
  C(253,'intro','Ai ăn ai?','Cỏ→Thỏ→Cáo = chuỗi thức ăn.',null,1),
  C(253,'explain','Sinh vật SX - TT','SX: cây. TT: ĐV ăn cỏ → ĐV ăn thịt → ĐV phân hủy.',null,2),
  C(253,'example','Chuỗi vườn nhà','Lá cây→Sâu→Chim→Diều hâu.','["Nếu mất 1 mắt xích: cả chuỗi bị ảnh hưởng!"]',3),
  C(253,'tip','Giữ cân bằng','Bảo vệ đa dạng sinh học = giữ chuỗi thức ăn.',null,4),

  // === G3 L254: Trái Đất ===
  C(254,'intro','TĐ hình cầu','Trái Đất tròn, 70% nước, 30% đất liền.',null,1),
  C(254,'explain','Quả địa cầu','Mô hình thu nhỏ TĐ: lục địa (xanh lá), đại dương (xanh dương).',null,2),
  C(254,'example','7 châu lục','Á, Âu, Phi, Bắc Mỹ, Nam Mỹ, Úc, Nam Cực.','["VN ở châu Á, Đông Nam Á"]',3),
  C(254,'tip','Khám phá','Xoay địa cầu → tìm VN, tìm châu lục.',null,4),

  // === G3 L255: Bề mặt TĐ ===
  C(255,'intro','Địa hình đa dạng','Núi cao, đồng bằng phẳng, sông, biển.',null,1),
  C(255,'explain','Các dạng địa hình','Núi: nhọn/tròn. ĐB: phẳng. Cao nguyên: bằng + cao. Thung lũng: trũng.',null,2),
  C(255,'example','VN có gì?','Hoàng Liên Sơn (núi), ĐB Sông Cửu Long, Biển Đông.','["Phan-xi-păng: 3143m = nóc nhà Đông Dương"]',3),
  C(255,'tip','Mô hình','Nhào đất nặn → tạo núi, sông, ĐB mini.',null,4),

  // === G3 L256: Mặt Trời ===
  C(256,'intro','Môi trường = ngôi sao','Môi trường rất nóng, tỏa sáng + nhiệt. Cách TĐ 150 triệu km.',null,1),
  C(256,'explain','Hệ Môi trường','8 hành tinh: Sao Thủy-Kim-TĐ-Hỏa-Mộc-Thổ-Thiên Vương-Hải Vương.',null,2),
  C(256,'example','TĐ quay quanh Môi trường','1 vòng = 365 ngày = 1 năm. Nghiêng trục → 4 mùa.','["Môi trường = 99.8% khối lượng hệ Môi trường"]',3),
  C(256,'tip','Nhớ thứ tự','Mẹ Vừa Trồng Đào Hỏi Thiên-Hải-Diêm.',null,4),

  // === G3 L257: Mặt Trăng ===
  C(257,'intro','MTr = vệ tinh TĐ','Mặt Trăng quay quanh TĐ, phản chiếu AS Mặt Trời.',null,1),
  C(257,'explain','Các pha MTr','Trăng non→Lưỡi liềm→Bán nguyệt→Trăng tròn→...','MTr lặp 1 vòng ≈ 29.5 ngày.',2),
  C(257,'example','Ngày và đêm','TĐ tự quay: mặt hướng Môi trường = ngày, mặt kia = đêm.','["1 ngày = TĐ quay 1 vòng = 24 giờ"]',3),
  C(257,'tip','Thí nghiệm','Đèn pin(Môi trường) + bóng(TĐ) → xoay → ngày/đêm.',null,4),

  // === G3 L258: Bảo vệ môi trường ===
  C(258,'intro','Vì sao BV Môi trường?','Ô nhiễm → bệnh tật, ĐV mất nhà, thiên tai.',null,1),
  C(258,'explain','Ô nhiễm','KK: khói xe. Nước: rác thải. Đất: hóa chất. Tiếng ồn.',null,2),
  C(258,'example','Hành động xanh','Phân loại rác, trồng cây, tiết kiệm điện, đi xe đạp.','["3R: Reduce-Reuse-Recycle = Giảm-Tái sử dụng-Tái chế"]',3),
  C(258,'tip','Em làm được','Nhặt rác, hạn chế túi nilon, tắt đèn khi ra khỏi phòng.',null,4),

  // === G3 L259: Thiên tai ===
  C(259,'intro','Thiên tai là gì?','Hiện tượng Tự nhiên gây hại: bão, lũ, động đất, hạn hán.',null,1),
  C(259,'explain','Phòng tránh','Bão: đóng cửa, tránh cây to. ĐĐ: nấp gầm bàn chắc. Lũ: lên cao.',null,2),
  C(259,'example','VN hay gặp','Bão (miền Trung), lũ (ĐB SCL), sạt lở (núi).','["Gọi 113/114/115 khi khẩn cấp"]',3),
  C(259,'tip','Diễn tập','Tập ở trường: nghe còi → nấp bàn → ra sân.',null,4),

  // === G3 L260: Ôn tập ===
  C(260,'intro','Ôn cuối năm lớp 3','Tổng hợp: giác quan, vật chất, sinh vật, TĐ, Môi trường.',null,1),
  C(260,'explain','Trọng tâm lớp 3','Giác quan, 3 TT vật chất, Thực vật-ĐV-chuỗi TĂ, hệ Môi trường, Bảo vệ môi trường.',null,2),
  C(260,'example','Bài ôn','Vẽ sơ đồ tư duy, làm poster, thuyết trình.','["Sơ đồ: giữa = Tự nhiên, nhánh = chủ đề"]',3),
  C(260,'tip','Tự tin','Ôn kỹ, ngủ sớm, thi vui vẻ!',null,4),
];
