/**
 * TỰ NHIÊN & XÃ HỘI LỚP 2-3 — 40 bài học (20 bài × 2 lớp)
 * G2: ID 221-240 | G3: ID 241-260
 */
import type { Lesson } from './seedData';
let sid = 220;
const L2 = (
  unit: string, code: string, title: string, obj: string, summary: string,
  tips: string, diff: 'easy' | 'medium' | 'hard', mins: number, sort: number,
): Lesson => ({
  id: ++sid, grade: 2, subjectCode: 'nature', unitCode: unit, lessonCode: code,
  title, objective: obj, summarySimple: summary, tips, difficulty: diff,
  estimatedMinutes: mins, status: 'ready' as const, sortOrder: sort, isActive: 1,
});
export const natureLessons2: Lesson[] = [
  L2('co-the','cqvd','Cơ quan vận động','Nhận biết các cơ quan vận động: xương, cơ, khớp','Xương+cơ giúp vận động, giữ dáng cơ thể','Hãy sờ xương tay, co duỗi cánh tay để cảm nhận','easy',12,1),
  L2('co-the','cqhh','Cơ quan hô hấp','Biết đường đi của không khí khi thở','Mũi→Khí quản→Phổi. Phổi giúp trao đổi khí','Hít sâu, đặt tay lên ngực cảm nhận phổi phồng','easy',12,2),
  L2('co-the','cqth','Cơ quan tiêu hóa','Nhận biết đường đi thức ăn','Miệng→Dạ dày→Ruột. Thức ăn biến thành chất dinh dưỡng','Nhai kỹ để dạ dày bớt vất vả nhé!','easy',12,3),
  L2('co-the','cqtu','Cơ quan tuần hoàn','Biết vai trò tim, mạch máu','Tim bơm máu, mạch máu dẫn máu đi khắp cơ thể','Đặt tay lên ngực trái, cảm nhận tim đập','easy',12,4),
  L2('nuoc-kk','nuoc','Nước trong đời sống','Biết nước cần thiết cho sự sống','Nước uống, nước tưới cây, nước rửa tay','Uống đủ nước mỗi ngày, tiết kiệm nước nhé!','easy',10,5),
  L2('nuoc-kk','kk','Không khí quanh ta','Biết không khí ở khắp nơi, cần cho sự sống','KK không màu không mùi, có ô-xi để thở','Thổi phồng bóng bay = KK vào bóng','easy',10,6),
  L2('thoi-tiet','tt','Thời tiết','Nhận biết các hiện tượng thời tiết','Nắng, mưa, gió, nóng, lạnh, mây','Xem dự báo thời tiết mỗi sáng','easy',10,7),
  L2('thoi-tiet','mua','Các mùa trong năm','Biết đặc điểm 4 mùa (hoặc 2 mùa)','Xuân ấm, Hạ nóng, Thu mát, Đông lạnh','Vẽ cây qua 4 mùa: nụ→lá→vàng→trụi','easy',10,8),
  L2('thuc-vat','tvqe','Thực vật quanh em','Nhận biết thực vật, phân loại đơn giản','Cây to, cây nhỏ, cây hoa, cây lương thực','Quan sát vườn trường, đếm loại cây','easy',12,9),
  L2('thuc-vat','bpcay','Các bộ phận cây','Nhận biết rễ, thân, lá, hoa, quả','Rễ hút nước, thân vận chuyển, lá quang hợp','Nhổ cỏ nhẹ → thấy rễ. Bẻ cành → thấy thân','easy',12,10),
  L2('dong-vat','dvqe','Động vật quanh em','Nhận biết động vật quen thuộc','Chó, mèo, gà, cá... chia nhóm: nuôi/hoang dã','Kể tên ĐV em gặp hôm nay','easy',12,11),
  L2('dong-vat','contr','Côn trùng','Biết đặc điểm côn trùng: 6 chân, cánh, râu','Bướm, ong, kiến, chuồn chuồn = côn trùng','Quan sát kiến tha mồi → đếm chân','easy',10,12),
  L2('xa-hoi','gd','Gia đình em','Biết các thành viên, vai trò, yêu thương','Ông bà, cha mẹ, anh chị em = gia đình','Vẽ cây gia đình của em','easy',10,13),
  L2('xa-hoi','th','Trường học của em','Biết các khu vực, hoạt động ở trường','Lớp học, sân trường, thư viện, phòng y tế','Vẽ sơ đồ trường em, đánh dấu phòng yêu thích','easy',10,14),
  L2('xa-hoi','cdpd','Cộng đồng địa phương','Biết nơi sống: phường/xã, chợ, bệnh viện','Khu phố, xóm làng có nhiều nơi công cộng','Kể cho bạn về khu phố em sống','easy',10,15),
  L2('an-toan','atgt','An toàn giao thông','Biết luật GT cơ bản, đèn tín hiệu','Đèn đỏ dừng, đèn xanh đi, đi bên phải','Nhắc nhau: đội mũ bảo hiểm, đi đúng phần đường','easy',12,16),
  L2('an-toan','atnha','An toàn khi ở nhà','Biết cách tránh tai nạn: điện, lửa, vật sắc','Không chơi lửa, cắm điện, ổ cắm nguy hiểm','Nếu có sự cố: gọi 113, 114, 115','easy',12,17),
  L2('an-toan','vsct','Giữ vệ sinh cơ thể','Biết cách giữ sạch: rửa tay, tắm, đánh răng','Rửa tay 6 bước, đánh răng 2 lần/ngày, tắm hàng ngày','Hát bài rửa tay 20 giây','easy',10,18),
  L2('an-toan','bvnn','Bảo vệ nguồn nước','Biết cách giữ nước sạch, tiết kiệm nước','Không xả rác xuống sông, tiết kiệm nước','Tắt vòi khi đánh răng = tiết kiệm nước','easy',10,19),
  L2('on-tap','otl2','Ôn tập: Tự nhiên quanh em','Ôn tổng hợp kiến thức lớp 2','Cơ thể, nước, KK, thời tiết, Thực vật, ĐV, an toàn','Chơi trò "Đố vui" với các bạn về Tự nhiên','easy',15,20),
];

sid = 240;
const L3 = (
  unit: string, code: string, title: string, obj: string, summary: string,
  tips: string, diff: 'easy' | 'medium' | 'hard', mins: number, sort: number,
): Lesson => ({
  id: ++sid, grade: 3, subjectCode: 'nature', unitCode: unit, lessonCode: code,
  title, objective: obj, summarySimple: summary, tips, difficulty: diff,
  estimatedMinutes: mins, status: 'ready' as const, sortOrder: sort, isActive: 1,
});
export const natureLessons3: Lesson[] = [
  L3('con-nguoi','gquan','Các giác quan','Biết 5 giác quan và vai trò','Mắt nhìn, tai nghe, mũi ngửi, lưỡi nếm, da sờ','Bịt mắt đoán đồ vật bằng xúc giác','easy',12,1),
  L3('con-nguoi','ddsk','Dinh dưỡng & sức khỏe','Biết chất dinh dưỡng, ăn cân đối','4 nhóm: tinh bột, đạm, béo, vitamin-khoáng','Bữa ăn đủ 4 nhóm = bữa ăn cân đối','easy',12,2),
  L3('con-nguoi','cqbt','Cơ quan bài tiết','Biết thận lọc máu, da tiết mồ hôi','Thận→Nước tiểu, Da→Mồ hôi = thải chất dư','Uống đủ nước để thận hoạt động tốt','easy',12,3),
  L3('con-nguoi','cqtk','Cơ quan thần kinh','Biết não, tủy sống, dây TK','Não điều khiển, tủy sống dẫn truyền','Ngủ đủ giấc để não nghỉ ngơi','medium',12,4),
  L3('vat-chat','crlk','Chất rắn - lỏng - khí','Phân biệt 3 trạng thái','Rắn: hình dạng cố định. Lỏng: chảy. Khí: bay','Đá rắn → tan thành nước lỏng → bốc hơi = khí','easy',12,5),
  L3('vat-chat','nknh','Nhiệt độ & nhiệt kế','Biết đo nhiệt độ, nóng-lạnh','Nhiệt kế đo °C. Nước sôi 100°C, đá tan 0°C','Đo nhiệt hôm nay: bao nhiêu °C?','medium',12,6),
  L3('vat-chat','asang','Ánh sáng','Biết nguồn sáng, vật cho AS truyền qua','Mặt Trời = nguồn sáng Tự nhiên. Đèn = nhân tạo','Chiếu đèn pin qua giấy/nhựa/gỗ → so sánh','easy',12,7),
  L3('vat-chat','athanh','Âm thanh','Biết nguồn âm, tai nghe âm thanh','Rung = tạo âm. Tai nghe → não nhận biết','Gẩy dây thun → thấy rung → nghe âm','easy',12,8),
  L3('thuc-vat','dstv','Đời sống thực vật','Biết cây cần: nước, AS, đất, KK','Cây quang hợp: hấp thụ CO₂, thải O₂','Trồng cây: che tối 1 cây, so sánh với cây có nắng','easy',12,9),
  L3('thuc-vat','sttv','Sự sinh sản thực vật','Biết cây SS bằng hạt, rễ, thân','Hạt nảy mầm → cây mới. Khoai lang tách rễ','Gieo hạt đậu → theo dõi 7 ngày','medium',12,10),
  L3('dong-vat','dsdv','Đời sống động vật','Biết ĐV ăn gì, sống ở đâu','ĐV ăn cỏ, ăn thịt, ăn tạp. Sống: cạn/nước/bay','Phân loại ĐV em biết theo thức ăn','easy',12,11),
  L3('dong-vat','stdv','Sự sinh sản động vật','Biết ĐV đẻ trứng vs đẻ con','Gà đẻ trứng, chó đẻ con, ếch: trứng→nòng nọc→ếch','Nòng nọc → ếch = biến thái','medium',12,12),
  L3('sinh-thai','cthan','Chuỗi thức ăn','Biết mối quan hệ ăn → bị ăn','Cỏ→Thỏ→Cáo = chuỗi thức ăn','Vẽ chuỗi thức ăn trong vườn nhà','medium',14,13),
  L3('trai-dat','tdqdc','Trái Đất & Quả địa cầu','Biết hình dạng TĐ, lục địa, đại dương','TĐ hình cầu, 70% nước, 30% đất liền','Xoay quả địa cầu, tìm Việt Nam','easy',12,14),
  L3('trai-dat','bmat','Bề mặt Trái Đất','Biết núi, đồng bằng, sông, biển','Núi cao, ĐB phẳng, sông chảy, biển mênh mông','Mô hình: nhào đất nặn → núi, ĐB, sông','easy',12,15),
  L3('trai-dat','matt','Mặt Trời & Hệ Mặt Trời','Biết Mặt Trời là ngôi sao, 8 hành tinh','Mặt Trời nóng, TĐ quay quanh Mặt Trời → ngày/đêm, 4 mùa','Nhớ: Mẹ Vừa Trồng Đào Hỏi Thiên-Hải-Diêm','medium',14,16),
  L3('trai-dat','mtrg','Mặt Trăng & Ngày đêm','Biết MTr quay quanh TĐ, ngày/đêm','TĐ tự quay → ngày (mặt hướng Mặt Trời) / đêm','Dùng đèn pin + quả bóng → thí nghiệm ngày đêm','medium',14,17),
  L3('moi-truong','bvmt','Bảo vệ môi trường','Biết cách bảo vệ Môi trường sống','Phân loại rác, trồng cây, tiết kiệm điện nước','Nhặt rác sân trường = hành động nhỏ, ý nghĩa lớn','easy',12,18),
  L3('moi-truong','pctt','Phòng chống thiên tai','Biết bão, lũ, động đất, cách phòng','Bão: đóng cửa, tránh xa cây to. ĐĐ: chui gầm bàn','Tập diễn tập: nghe còi → nấp gầm bàn','medium',12,19),
  L3('on-tap','otl3','Ôn tập: Thế giới Tự nhiên','Ôn tổng hợp Kiểm tra lớp 3','Giác quan, vật chất, Thực vật, ĐV, TĐ, Mặt Trời, Bảo vệ môi trường','Chơi "Ai thông minh hơn" ôn Kiểm tra Tự nhiên','easy',15,20),
];
