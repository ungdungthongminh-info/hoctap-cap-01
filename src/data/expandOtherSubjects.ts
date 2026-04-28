/**
 * EXPANSION — 7 môn còn lại: Nature, Ethics, English, Science, HistGeo, Informatics, Art
 * Nature (Lớp 1-3): +15/lớp ×3 = 45 | Ethics (1-5): +75 | English (1-5): +75
 * Science (4-5): +30 | HistGeo (4-5): +30 | Informatics (3-5): +45 | Art (1-5): +75
 * TỔNG: 375 bài mới
 *
 * Lesson ID ranges: Nature 20201+, Ethics 20301+, English 20401+,
 *   Science 20501+, HistGeo 20601+, Informatics 20701+, Art 20801+
 * Card IDs: 52001+ (auto per lesson ×4)
 * Question IDs: 32001+
 */

// =============== HELPERS ===============
type SubCode = 'nature' | 'ethics' | 'english' | 'science' | 'history_geo' | 'informatics' | 'art';

const mkLesson = (idBase: number, sub: SubCode) => {
  let lid = idBase;
  return (grade: number, unit: string, code: string, title: string, obj: string, summary: string, tips: string, diff: 'easy'|'medium'|'hard', mins: number, sort: number) => ({
    id: ++lid, grade, subjectCode: sub,
    unitCode: unit, lessonCode: code,
    title, objective: obj, summarySimple: summary, tips,
    difficulty: diff, estimatedMinutes: mins,
    status: 'ready' as const, sortOrder: sort, isActive: 1,
  });
};

let _cid = 52000;
const mkCards = (lessons: ReturnType<ReturnType<typeof mkLesson>>[]) =>
  lessons.flatMap(l => [
    { id: ++_cid, lessonId: l.id, cardType: 'intro' as const, title: `Giới thiệu: ${l.title}`, content: l.summarySimple, exampleJson: null, sortOrder: 1, isActive: 1 },
    { id: ++_cid, lessonId: l.id, cardType: 'explain' as const, title: `Bài giảng: ${l.title}`, content: l.objective, exampleJson: null, sortOrder: 2, isActive: 1 },
    { id: ++_cid, lessonId: l.id, cardType: 'example' as const, title: `Ví dụ: ${l.title}`, content: l.tips, exampleJson: null, sortOrder: 3, isActive: 1 },
    { id: ++_cid, lessonId: l.id, cardType: 'tip' as const, title: `Mẹo nhớ: ${l.title}`, content: `💡 ${l.tips}`, exampleJson: null, sortOrder: 4, isActive: 1 },
  ]);

let _qid = 32000;
const mkQ = (grade: number, lessonId: number, sub: SubCode, type: 'single_choice'|'true_false'|'fill_number'|'ordering'|'matching'|'fill_text'|'multi_choice', text: string, opts: string, correct: string, explain: string, diff: 'easy'|'medium'|'hard', skill: string) => ({
  id: ++_qid, grade, subjectCode: sub, lessonId,
  questionType: type, questionText: text,
  optionsJson: opts, correctAnswer: correct,
  explanationSimple: explain, difficulty: diff,
  skillTag: skill, sourceType: 'generated' as const,
  isVerified: 1, isActive: 1,
});


// ============================================================
//  1. NATURE / TỰ NHIÊN XÃ HỘI (Lớp 1-3) — 45 bài
// ============================================================
const LN = mkLesson(20200, 'nature');
export const natureExpLessons = [
  // Lớp 1
  LN(1,'u1_con_nguoi','L21_giacs_quan','Năm giác quan','Biết 5 giác quan cơ bản','Mắt nhìn, tai nghe, mũi ngửi, lưỡi nếm, da sờ','Mỗi giác quan giúp ta cảm nhận thế giới','easy',10,21),
  LN(1,'u1_con_nguoi','L22_an_uong','Ăn uống lành mạnh','Biết thực phẩm tốt cho sức khỏe','Ăn rau, trái cây, uống nước','Ăn nhiều rau xanh nhé!','easy',10,22),
  LN(1,'u2_dong_vat','L23_dong_vat_nuoi','Vật nuôi trong nhà','Nhận biết vật nuôi','Chó, mèo, gà, vịt, cá...','Vật nuôi cần được chăm sóc!','easy',10,23),
  LN(1,'u2_dong_vat','L24_dong_vat_hoang','Động vật hoang dã','Nhận biết động vật hoang dã','Hổ, voi, khỉ, sư tử...','Không bắt động vật hoang dã!','easy',10,24),
  LN(1,'u3_thuc_vat','L25_cay_an_qua','Cây ăn quả','Nhận biết cây ăn quả','Cây cam, cây xoài, cây chuối...','Trồng cây để có quả ăn!','easy',10,25),
  LN(1,'u3_thuc_vat','L26_cay_rau','Rau xanh quanh ta','Nhận biết các loại rau','Rau cải, rau muống, cà rốt...','Ăn rau tốt cho sức khỏe!','easy',10,26),
  LN(1,'u4_gia_dinh','L27_nha_cua','Ngôi nhà của em','Mô tả ngôi nhà','Phòng khách, phòng ngủ, bếp, WC','Giữ nhà cửa sạch sẽ!','easy',8,27),
  LN(1,'u4_gia_dinh','L28_truong_hoc','Trường học của em','Mô tả trường học','Lớp học, sân trường, thư viện...','Trường học là ngôi nhà thứ 2!','easy',8,28),
  LN(1,'u5_thien_nhien','L29_mua_trong_nam','Bốn mùa trong năm','Biết 4 mùa: xuân hạ thu đông','Mùa xuân ấm, hạ nóng, thu mát, đông lạnh','Mỗi mùa có vẻ đẹp riêng!','easy',10,29),
  LN(1,'u5_thien_nhien','L30_nuoc','Nước trong cuộc sống','Vai trò của nước','Uống, tắm, tưới cây, nấu ăn...','Tiết kiệm nước nhé!','easy',10,30),
  LN(1,'u3_thuc_vat','L31_hoa','Bông hoa đẹp','Nhận biết các loài hoa','Hoa hồng, hoa cúc, hoa sen...','Hoa sen là quốc hoa Việt Nam!','easy',8,31),
  LN(1,'u4_gia_dinh','L32_an_toan','An toàn tại nhà','Biết cách giữ an toàn','Không chơi lửa, không leo cao','An toàn là trên hết!','easy',10,32),
  LN(1,'u5_thien_nhien','L33_mat_troi','Mặt trời và ánh sáng','Vai trò của mặt trời','Sáng → mặt trời mọc, tối → lặn','Mặt trời cho ta ánh sáng!','easy',8,33),
  LN(1,'u1_con_nguoi','L34_on_hk1','Ôn tập HK1 Tự nhiên và Xã hội lớp 1','Ôn bài nửa năm','Ôn lại con người, động thực vật','Ôn tập mỗi ngày!','easy',12,34),
  LN(1,'u5_thien_nhien','L35_on_cuoi','Ôn tập cuối năm Tự nhiên và Xã hội lớp 1','Ôn toàn bộ','Tổng ôn lớp 1','Sẵn sàng lên lớp 2!','easy',12,35),

  // Lớp 2
  LN(2,'u1_sk','L21_co_the_2','Các bộ phận cơ thể','Biết thêm về cơ thể người','Xương, cơ, da, nội tạng','Bảo vệ cơ thể mình!','easy',10,21),
  LN(2,'u1_sk','L22_benh_thuong_gap','Bệnh thường gặp','Biết phòng bệnh cơ bản','Cảm cúm, đau bụng, sốt','Rửa tay thường xuyên!','easy',10,22),
  LN(2,'u2_dv2','L23_chan_canh','Chân và cánh động vật','Phân biệt ĐV theo chân/cánh','2 chân, 4 chân, có cánh, không cánh','Chim bay bằng cánh!','easy',10,23),
  LN(2,'u2_dv2','L24_dv_duoi_nuoc','Sinh vật dưới nước','Nhận biết ĐV sống dưới nước','Cá, tôm, cua, ốc, sứa...','Biển có rất nhiều sinh vật!','easy',10,24),
  LN(2,'u3_tv2','L25_than_re_la','Thân, rễ, lá cây','Các phần của cây','Rễ hút nước, thân dẫn, lá quang hợp','Cây cũng cần ăn uống!','easy',10,25),
  LN(2,'u3_tv2','L26_hoa_qua_hat','Hoa, quả, hạt','Quá trình sinh sản cây','Hoa → quả → hạt → cây mới','Từ hạt nhỏ mọc thành cây!','easy',10,26),
  LN(2,'u4_mt','L27_rac_thai','Rác thải và môi trường','Phân loại rác cơ bản','Rác hữu cơ, rác tái chế, rác nguy hại','Phân loại rác giúp Trái Đất!','easy',10,27),
  LN(2,'u4_mt','L28_tiet_kiem_dien','Tiết kiệm điện','Biết cách tiết kiệm điện','Tắt đèn, quạt khi ra khỏi phòng','Tiết kiệm điện = bảo vệ môi trường!','easy',10,28),
  LN(2,'u5_dd','L29_xa_hoi','Cộng đồng quanh em','Biết về khu phố, làng xóm','Hàng xóm, bạn bè, trường, chợ...','Chào hỏi mọi người nhé!','easy',8,29),
  LN(2,'u5_dd','L30_giao_thong','An toàn giao thông','Biết luật giao thông cơ bản','Đèn đỏ dừng, xanh đi, vàng chờ','Đội mũ bảo hiểm khi đi xe!','easy',10,30),
  LN(2,'u3_tv2','L31_cay_bong_mat','Cây bóng mát','Lợi ích của cây xanh','Che nắng, cho oxy, đẹp','Trồng cây bảo vệ môi trường!','easy',8,31),
  LN(2,'u4_mt','L32_thoi_tiet','Thời tiết','Quan sát thời tiết','Nắng, mưa, gió, mây','Xem dự báo thời tiết!','easy',10,32),
  LN(2,'u5_dd','L33_nghe_nghiep','Nghề nghiệp quanh em','Biết các nghề phổ biến','Bác sĩ, giáo viên, nông dân...','Mỗi nghề đều quan trọng!','easy',8,33),
  LN(2,'u1_sk','L34_on_hk1_2','Ôn HK1 Tự nhiên và Xã hội lớp 2','Ôn bài giữa năm','Ôn sức khỏe, ĐV, TV','Ôn tập chăm chỉ!','easy',12,34),
  LN(2,'u5_dd','L35_on_cuoi_2','Ôn cuối năm Tự nhiên và Xã hội lớp 2','Ôn toàn bộ Tự nhiên và Xã hội','Tổng ôn lớp 2','Sẵn sàng lên lớp 3!','easy',12,35),

  // Lớp 3
  LN(3,'u1_sk3','L21_dinh_duong','Dinh dưỡng cân bằng','Biết nhóm dinh dưỡng','Tinh bột, đạm, chất béo, vitamin','Ăn đủ 4 nhóm mỗi ngày!','medium',12,21),
  LN(3,'u1_sk3','L22_van_dong','Vận động và sức khỏe','Lợi ích của tập thể dục','Chạy, nhảy, bơi giúp khỏe','Vận động 30 phút/ngày!','easy',10,22),
  LN(3,'u2_sv3','L23_chuoi_thuc_an','Chuỗi thức ăn','Hiểu chuỗi thức ăn đơn giản','Cỏ → Thỏ → Cáo','Sinh vật liên kết với nhau!','medium',12,23),
  LN(3,'u2_sv3','L24_bo_sat','Bò sát','Nhận biết bò sát','Rắn, thằn lằn, rùa, cá sấu','Bò sát máu lạnh!','easy',10,24),
  LN(3,'u3_tv3','L25_rung','Rừng và hệ sinh thái','Vai trò của rừng','Rừng cho gỗ, oxy, nước','Bảo vệ rừng!','medium',12,25),
  LN(3,'u3_tv3','L26_dat','Đất — nguồn sống','Vai trò của đất','Đất nuôi cây, chứa nước ngầm','Không xả rác xuống đất!','easy',10,26),
  LN(3,'u4_vl3','L27_nam_cham','Nam châm kì diệu','Tính chất nam châm','Hút sắt, thép; 2 cực N-S','Cùng cực đẩy, khác cực hút!','medium',12,27),
  LN(3,'u4_vl3','L28_am_thanh','Âm thanh','Hiểu về âm thanh','Rung động tạo âm thanh','Âm thanh cần môi trường truyền!','medium',12,28),
  LN(3,'u5_td3','L29_trai_dat','Trái Đất của em','Hình dạng Trái Đất','Trái Đất hình cầu','Trái Đất tròn!','easy',10,29),
  LN(3,'u5_td3','L30_ban_do','Bản đồ đơn giản','Đọc bản đồ cơ bản','Bắc trên, Nam dưới','Bản đồ giúp tìm đường!','easy',10,30),
  LN(3,'u2_sv3','L31_con_trung','Côn trùng','Nhận biết côn trùng','Ong, kiến, bướm, chuồn chuồn','Côn trùng có 6 chân!','easy',10,31),
  LN(3,'u4_vl3','L32_anh_sang','Ánh sáng và bóng tối','Hiểu về ánh sáng','Ánh sáng đi thẳng, tạo bóng','Bóng = khi vật chắn ánh sáng!','medium',12,32),
  LN(3,'u5_td3','L33_ozone','Bảo vệ tầng ôzôn','Biết về tầng ôzôn','Ôzôn chắn tia UV','Bảo vệ ôzôn = bảo vệ ta!','medium',10,33),
  LN(3,'u1_sk3','L34_on_hk1_3','Ôn HK1 Tự nhiên và Xã hội lớp 3','Ôn bài giữa năm','Ôn dinh dưỡng, sinh vật','Ôn tập thật kỹ!','easy',12,34),
  LN(3,'u5_td3','L35_on_cuoi_3','Ôn cuối năm Tự nhiên và Xã hội lớp 3','Ôn toàn bộ','Tổng ôn lớp 3','Hoàn thành Tự nhiên và Xã hội lớp 3!','easy',12,35),
];

// ============================================================
//  2. ETHICS / ĐẠO ĐỨC (Lớp 1-5) — 75 bài
// ============================================================
const LE = mkLesson(20300, 'ethics');
export const ethicsExpLessons = [
  // Lớp 1
  LE(1,'DD1C1','L21_le_phep','Lễ phép với mọi người','Biết nói lễ phép','Chào hỏi, cảm ơn, xin lỗi','Lễ phép ai cũng yêu!','easy',8,21),
  LE(1,'DD1C1','L22_trung_thuc','Trung thực','Biết nói thật','Không nói dối, nhận lỗi','Trung thực = can đảm!','easy',8,22),
  LE(1,'DD1C2','L23_yeu_truong','Yêu trường lớp','Giữ gìn trường lớp sạch đẹp','Không vẽ lên tường, giữ sạch','Trường đẹp nhờ mình!','easy',8,23),
  LE(1,'DD1C2','L24_tiet_kiem','Tiết kiệm','Biết tiết kiệm đồ dùng','Không lãng phí giấy, nước','Tiết kiệm là có nhiều hơn!','easy',8,24),
  LE(1,'DD1C3','L25_giup_do_bn','Giúp đỡ bạn bè','Biết giúp đỡ bạn','Bạn ngã → đỡ dậy','Giúp bạn = vui cả hai!','easy',8,25),
  LE(1,'DD1C3','L26_chia_se','Chia sẻ','Biết chia sẻ với mọi người','Chia kẹo, đồ chơi cho bạn','Chia sẻ là yêu thương!','easy',8,26),
  LE(1,'DD1C4','L27_an_toan_dd','An toàn giao thông','Biết đi đường an toàn','Đi bộ trên vỉa hè, qua đường đúng chỗ','An toàn là trên hết!','easy',10,27),
  LE(1,'DD1C4','L28_bao_ve_mt1','Bảo vệ môi trường','Bỏ rác đúng nơi','Không xả rác, trồng cây','Bé nhỏ cũng bảo vệ được Trái Đất!','easy',8,28),
  LE(1,'DD1C5','L29_tu_phuc_vu','Tự phục vụ bản thân','Tự làm việc cá nhân','Tự đánh răng, mặc áo, ăn cơm','Mình làm được!','easy',8,29),
  LE(1,'DD1C5','L30_yeu_dong_vat','Yêu thương động vật','Không hành hạ động vật','Cho thú ăn, không đánh đập','Động vật cũng biết đau!','easy',8,30),
  LE(1,'DD1C3','L31_kiên_nhan','Kiên nhẫn','Biết kiên nhẫn chờ đợi','Xếp hàng, chờ đến lượt','Kiên nhẫn sẽ được thưởng!','easy',8,31),
  LE(1,'DD1C4','L32_gui_so','Giữ lời hứa','Biết giữ lời đã hứa','Hứa → phải làm','Giữ lời = đáng tin!','easy',8,32),
  LE(1,'DD1C5','L33_yeu_nuoc','Em yêu Tổ quốc','Biết yêu đất nước Việt Nam','Cờ đỏ sao vàng','Tự hào người Việt Nam!','easy',8,33),
  LE(1,'DD1C2','L34_on_hk1_dd1','Ôn HK1 Đạo đức lớp 1','Ôn bài giữa năm','Ôn lễ phép, trung thực','Ôn tập nhé!','easy',10,34),
  LE(1,'DD1C5','L35_on_cuoi_dd1','Ôn cuối năm ĐĐ lớp 1','Ôn toàn bộ','Tổng ôn ĐĐ lớp 1','Bé ngoan lắm!','easy',10,35),

  // Lớp 2
  LE(2,'DD2C1','L21_tu_tin','Tự tin','Biết thể hiện bản thân','Dám phát biểu, dám thử','Tin vào mình!','easy',8,21),
  LE(2,'DD2C1','L22_ton_trong','Tôn trọng người khác','Biết tôn trọng mọi người','Lắng nghe, không chế giễu','Tôn trọng = được tôn trọng!','easy',8,22),
  LE(2,'DD2C2','L23_sieu_nang','Siêng năng','Biết chăm chỉ học hành','Làm bài, dọn dẹp mỗi ngày','Siêng năng → thành công!','easy',8,23),
  LE(2,'DD2C2','L24_trach_nhiem','Trách nhiệm','Biết chịu trách nhiệm','Nhận lỗi, sửa sai','Trách nhiệm = lớn lắm nè!','easy',8,24),
  LE(2,'DD2C3','L25_doan_ket','Đoàn kết','Biết đoàn kết trong nhóm','Cùng nhau làm việc','Đoàn kết → sức mạnh!','easy',8,25),
  LE(2,'DD2C3','L26_cong_bang','Công bằng','Biết cư xử công bằng','Chia đều, không thiên vị','Công bằng ai cũng vui!','easy',8,26),
  LE(2,'DD2C4','L27_hieu_thao','Hiếu thảo','Biết hiếu thảo cha mẹ','Nghe lời, giúp đỡ bố mẹ','Hiếu thảo là bé ngoan!','easy',8,27),
  LE(2,'DD2C4','L28_ton_su','Tôn sư trọng đạo','Kính trọng thầy cô','Chào thầy cô, chăm học','Thầy cô vất vả vì em!','easy',8,28),
  LE(2,'DD2C5','L29_that_tha','Thật thà','Mở rộng bài trung thực','Trả đồ nhặt được','Thật thà = quý báu!','easy',8,29),
  LE(2,'DD2C5','L30_nhan_ai','Nhân ái','Biết đồng cảm, giúp đỡ','Giúp bạn khó khăn','Nhân ái làm thế giới đẹp!','easy',8,30),
  LE(2,'DD2C3','L31_lam_viec_nhom','Làm việc nhóm','Biết cách hợp tác','Phân công, lắng nghe nhau','Mỗi người một việc!','easy',10,31),
  LE(2,'DD2C4','L32_bao_ve_ban_than','Bảo vệ bản thân','Biết nói "không" khi nguy hiểm','Không đi với người lạ','Hỏi bố mẹ trước!','easy',10,32),
  LE(2,'DD2C5','L33_yeu_lao_dong','Yêu lao động','Quý trọng lao động','Mọi nghề đều đáng trọng','Lao động là vinh quang!','easy',8,33),
  LE(2,'DD2C2','L34_on_hk1_dd2','Ôn HK1 ĐĐ lớp 2','Ôn bài giữa năm','Ôn tập','Ôn tập mỗi ngày!','easy',10,34),
  LE(2,'DD2C5','L35_on_cuoi_dd2','Ôn cuối năm ĐĐ lớp 2','Ôn toàn bộ','Tổng ôn','Sẵn sàng lên lớp 3!','easy',10,35),

  // Lớp 3
  LE(3,'DD3C1','L21_tu_chu','Tự chủ','Biết kiểm soát cảm xúc','Bình tĩnh khi giận','Hít thở sâu khi bực!','medium',10,21),
  LE(3,'DD3C1','L22_cam_thong','Cảm thông','Biết đồng cảm sâu sắc','Hiểu cảm xúc người khác','Đặt mình vào vị trí bạn!','medium',10,22),
  LE(3,'DD3C2','L23_phap_luat','Tuân thủ pháp luật','Biết tôn trọng luật','Luật giao thông, luật trường','Luật giúp mọi người an toàn!','medium',10,23),
  LE(3,'DD3C2','L24_quyen_tre_em','Quyền trẻ em','Biết về quyền của mình','Quyền học, chơi, được bảo vệ','Trẻ em có quyền được yêu thương!','medium',10,24),
  LE(3,'DD3C3','L25_da_van_hoa','Tôn trọng sự khác biệt','Chấp nhận sự đa dạng','Người khác mình cũng tốt','Khác biệt = đặc biệt!','medium',10,25),
  LE(3,'DD3C3','L26_tiet_kiem_nang_luong','Tiết kiệm năng lượng','Biết tiết kiệm năng lượng','Tắt đèn, tiết kiệm điện nước','Tiết kiệm cho tương lai!','easy',10,26),
  LE(3,'DD3C4','L27_ong_ba','Kính yêu ông bà','Hiếu thảo với ông bà','Thăm hỏi, giúp đỡ ông bà','Ông bà rất yêu cháu!','easy',8,27),
  LE(3,'DD3C4','L28_hang_xom','Hàng xóm láng giềng','Biết sống hòa nhã với hàng xóm','Chào hỏi, giúp đỡ nhau','Láng giềng gần hơn anh em xa!','easy',8,28),
  LE(3,'DD3C5','L29_moi_truong_song','Bảo vệ môi trường sống','Hành động bảo vệ môi trường','Trồng cây, thu gom rác','Trái Đất là nhà chung!','medium',10,29),
  LE(3,'DD3C5','L30_truyen_thong','Giữ gìn truyền thống','Biết về truyền thống VN','Tết, áo dài, phở, lễ hội','Tự hào truyền thống Việt!','easy',10,30),
  LE(3,'DD3C3','L31_long_biet_on','Lòng biết ơn','Biết ơn người giúp mình','Cảm ơn chân thành','Biết ơn = hạnh phúc!','easy',8,31),
  LE(3,'DD3C4','L32_tinh_ban','Tình bạn đẹp','Xây dựng tình bạn tốt','Tin tưởng, chia sẻ, giúp đỡ','Bạn thật → bạn tốt!','easy',8,32),
  LE(3,'DD3C5','L33_lam_nguoi_tot','Làm người tốt','Tổng hợp đức tính tốt','Trung thực, nhân ái, trách nhiệm','Bé là người tốt!','easy',10,33),
  LE(3,'DD3C2','L34_on_hk1_dd3','Ôn HK1 ĐĐ lớp 3','Ôn bài giữa năm','Ôn tập','Ôn mỗi ngày!','easy',10,34),
  LE(3,'DD3C5','L35_on_cuoi_dd3','Ôn cuối năm ĐĐ lớp 3','Ôn toàn bộ','Tổng ôn','Sẵn sàng lớp 4!','easy',10,35),

  // Lớp 4
  LE(4,'DD4C1','L21_tu_hoc','Tự học','Biết cách tự học hiệu quả','Lập kế hoạch học tập','Tự học = tự do!','medium',10,21),
  LE(4,'DD4C1','L22_sang_tao','Sáng tạo','Phát huy sáng tạo','Nghĩ cách mới, thử điều mới','Sáng tạo không giới hạn!','medium',10,22),
  LE(4,'DD4C2','L23_chong_bat_nat','Chống bắt nạt','Biết cách ứng phó bắt nạt','Nói với người lớn, không im lặng','Bắt nạt là sai!','medium',12,23),
  LE(4,'DD4C2','L24_moi_truong_so','Môi trường số an toàn','An toàn trên Internet','Không chia sẻ thông tin cá nhân','Cẩn thận trên mạng!','medium',12,24),
  LE(4,'DD4C3','L25_quyen_va_bn','Quyền và bổn phận','Hiểu quyền đi kèm bổn phận','Có quyền học → bổn phận chăm chỉ','Quyền đi với trách nhiệm!','medium',10,25),
  LE(4,'DD4C3','L26_binh_dang_gioi','Bình đẳng giới','Nam nữ bình đẳng','Ai cũng làm được mọi việc','Bình đẳng = công bằng!','medium',10,26),
  LE(4,'DD4C4','L27_lich_su_vn','Tự hào lịch sử VN','Yêu lịch sử dân tộc','Hùng Vương, Hai Bà Trưng...','Lịch sử hào hùng!','medium',10,27),
  LE(4,'DD4C4','L28_di_san','Gìn giữ di sản','Bảo tồn di sản văn hóa','Di sản UNESCO Việt Nam','Di sản = báu vật!','medium',10,28),
  LE(4,'DD4C5','L29_cong_dan_tot','Công dân tốt','Trách nhiệm công dân nhỏ tuổi','Chấp hành luật, giúp cộng đồng','Bé cũng là công dân!','medium',10,29),
  LE(4,'DD4C5','L30_tinh_nguyen','Tình nguyện','Tinh thần tình nguyện','Giúp người khó khăn','Cho đi cũng là nhận!','easy',10,30),
  LE(4,'DD4C3','L31_nghia_vu','Nghĩa vụ học sinh','Biết nghĩa vụ Học sinh','Đi học đầy đủ, chăm ngoan','Bé đi học vì tương lai!','easy',8,31),
  LE(4,'DD4C4','L32_ung_xu','Ứng xử văn minh','Cư xử lịch sự nơi công cộng','Không ồn ào, xếp hàng','Văn minh = lịch sự!','easy',10,32),
  LE(4,'DD4C5','L33_muc_tieu','Đặt mục tiêu','Biết đặt mục tiêu cá nhân','Viết ra mục tiêu, thực hiện','Mục tiêu → Hành động → Thành công!','medium',10,33),
  LE(4,'DD4C2','L34_on_hk1_dd4','Ôn HK1 ĐĐ lớp 4','Ôn bài giữa năm','Ôn tập','Ôn chăm chỉ!','easy',10,34),
  LE(4,'DD4C5','L35_on_cuoi_dd4','Ôn cuối năm ĐĐ lớp 4','Ôn toàn bộ','Tổng ôn','Sẵn sàng lớp 5!','easy',10,35),

  // Lớp 5
  LE(5,'DD5C1','L21_liêm_chinh','Liêm chính','Biết sống liêm chính','Không gian lận, không tham lam','Liêm chính = cao quý!','medium',10,21),
  LE(5,'DD5C1','L22_tu_trong','Tự trọng','Biết giữ lòng tự trọng','Không quỵ lụy, giữ phẩm giá','Tự trọng = tôn trọng mình!','medium',10,22),
  LE(5,'DD5C2','L23_phap_luat_5','Pháp luật và em','Hiểu sâu hơn về pháp luật','Luật bảo vệ trẻ em','Pháp luật bảo vệ mọi người!','medium',12,23),
  LE(5,'DD5C2','L24_dân_chu','Dân chủ trong lớp','Biết bầu cử, biểu quyết','Bầu lớp trưởng, họp lớp','Mỗi phiếu đều có giá trị!','medium',10,24),
  LE(5,'DD5C3','L25_the_gioi_hoa_binh','Thế giới hòa bình','Yêu hòa bình, chống chiến tranh','Hòa bình = hạnh phúc','Hòa bình cho tất cả!','medium',10,25),
  LE(5,'DD5C3','L26_lien_hop_quoc','Liên Hợp Quốc và trẻ em','Biết về UNICEF','UNICEF bảo vệ trẻ em thế giới','Em là trẻ em thế giới!','medium',10,26),
  LE(5,'DD5C4','L27_tri_thuc','Giá trị tri thức','Biết quý trọng học vấn','Học → hiểu biết → tương lai','Tri thức là sức mạnh!','medium',10,27),
  LE(5,'DD5C4','L28_nghi_luc','Nghị lực sống','Học từ tấm gương vượt khó','Người khuyết tật vượt khó','Nghị lực chiến thắng tất cả!','medium',10,28),
  LE(5,'DD5C5','L29_cong_dan_tg','Công dân toàn cầu','Trách nhiệm với thế giới','Biến đổi khí hậu, ô nhiễm','Trái Đất cần bé!','medium',10,29),
  LE(5,'DD5C5','L30_tuong_lai','Ước mơ tương lai','Dám mơ ước và phấn đấu','Viết ước mơ, lập kế hoạch','Ước mơ lớn từ bước nhỏ!','easy',10,30),
  LE(5,'DD5C3','L31_lang_nghe','Lắng nghe tích cực','Kỹ năng lắng nghe','Nhìn người nói, không ngắt lời','Lắng nghe = tôn trọng!','easy',10,31),
  LE(5,'DD5C4','L32_quản_ly_thoi_gian','Quản lý thời gian','Biết sắp xếp thời gian','Lịch học, chơi, nghỉ hợp lý','Thời gian vàng bạc!','medium',10,32),
  LE(5,'DD5C5','L33_tam_guong','Tấm gương đạo đức','Học từ người tốt','Bác Hồ, các anh hùng','Noi gương người tốt!','easy',10,33),
  LE(5,'DD5C2','L34_on_hk1_dd5','Ôn HK1 ĐĐ lớp 5','Ôn bài giữa năm','Ôn tập','Ôn chăm chỉ!','easy',10,34),
  LE(5,'DD5C5','L35_on_cuoi_dd5','Tổng ôn ĐĐ cuối cấp Tiểu học','Ôn toàn bộ','Tổng ôn','Bé đã lớn!','medium',12,35),
];

// ============================================================
//  3. ENGLISH / TIẾNG ANH (Lớp 1-5) — 75 bài
// ============================================================
const LEn = mkLesson(20400, 'english');
export const englishExpLessons = [
  // Lớp 1
  LEn(1,'EN1C1','L21_colors','Colors — Màu sắc','Learn basic colors','Red, blue, green, yellow','Point and say the color!','easy',10,21),
  LEn(1,'EN1C1','L22_shapes','Shapes — Hình dạng','Learn basic shapes','Circle, square, triangle','Find shapes around you!','easy',10,22),
  LEn(1,'EN1C2','L23_body','My Body','Learn body parts','Head, hands, legs, eyes','Touch and say!','easy',10,23),
  LEn(1,'EN1C2','L24_clothes','Clothes — Quần áo','Learn clothing words','Shirt, pants, dress, hat','What are you wearing?','easy',10,24),
  LEn(1,'EN1C3','L25_food_drink','Food and Drink','Learn food vocabulary','Rice, milk, water, bread','I like rice!','easy',10,25),
  LEn(1,'EN1C3','L26_classroom','My Classroom','Classroom objects','Desk, chair, board, pen','This is my desk!','easy',10,26),
  LEn(1,'EN1C4','L27_weather','Weather — Thời tiết','Learn weather words','Sunny, rainy, cloudy, windy','It is sunny today!','easy',10,27),
  LEn(1,'EN1C4','L28_feelings','Feelings — Cảm xúc','Express feelings','Happy, sad, angry, tired','I am happy!','easy',10,28),
  LEn(1,'EN1C5','L29_toys','Toys — Đồ chơi','Learn toy words','Car, doll, ball, kite','I have a ball!','easy',10,29),
  LEn(1,'EN1C5','L30_action','Actions — Hành động','Basic action verbs','Run, jump, sit, stand','Stand up, please!','easy',10,30),
  LEn(1,'EN1C3','L31_pets','Pets — Thú cưng','Pet vocabulary','Dog, cat, fish, bird','I have a cat!','easy',8,31),
  LEn(1,'EN1C4','L32_song','English Songs','Learn through songs','Twinkle Star, ABC','Sing along!','easy',8,32),
  LEn(1,'EN1C5','L33_story','Short Story','Read a simple story','The little cat','Read and enjoy!','easy',10,33),
  LEn(1,'EN1C2','L34_review_hk1','Review HK1 English 1','Review first half','Review ABC, numbers, family','Practice every day!','easy',12,34),
  LEn(1,'EN1C5','L35_review_end','Year-end Review Eng 1','Review all topics','Total review','Great job this year!','easy',12,35),

  // Lớp 2
  LEn(2,'EN2C1','L21_have_has','Have / Has','Use have and has','I have, she has','I → have, She → has!','easy',10,21),
  LEn(2,'EN2C1','L22_can','Can — I can swim!','Express ability','I can, I cannot','Can you jump?','easy',10,22),
  LEn(2,'EN2C2','L23_rooms','Rooms in a House','Learn room names','Living room, bedroom, kitchen','This is the kitchen!','easy',10,23),
  LEn(2,'EN2C2','L24_furniture','Furniture — Nội thất','Household items','Table, chair, bed, lamp','The lamp is on the table!','easy',10,24),
  LEn(2,'EN2C3','L25_time','What time is it?','Tell the time','It is 7 o\'clock','Look at the clock!','medium',12,25),
  LEn(2,'EN2C3','L26_daily','Daily Routine','Describe daily activities','Wake up, eat breakfast, go to school','I wake up at 6!','medium',12,26),
  LEn(2,'EN2C4','L27_places','Places — Địa điểm','Learn place names','School, park, hospital, market','Let us go to the park!','easy',10,27),
  LEn(2,'EN2C4','L28_directions','Left and Right','Give simple directions','Turn left, turn right, go straight','Go straight!','medium',10,28),
  LEn(2,'EN2C5','L29_hobbies','Hobbies — sở thích','Express hobbies','I like drawing, singing','What do you like?','easy',10,29),
  LEn(2,'EN2C5','L30_sports','Sports — Thể thao','Learn sports vocabulary','Football, swimming, running','I like football!','easy',10,30),
  LEn(2,'EN2C3','L31_months','Months of the Year','12 tháng','January to December','There are 12 months!','easy',10,31),
  LEn(2,'EN2C4','L32_seasons','Seasons — Mùa','Four seasons','Spring, summer, autumn, winter','I love summer!','easy',10,32),
  LEn(2,'EN2C5','L33_shopping','Simple Shopping','Buy and sell dialogue','How much is this?','Use please and thank you!','medium',10,33),
  LEn(2,'EN2C2','L34_review_hk1_2','Review HK1 English 2','Review first half','Review vocabulary, grammar','Keep it up!','easy',12,34),
  LEn(2,'EN2C5','L35_review_end_2','Year-end Review Eng 2','Review all','Total review','Well done!','easy',12,35),

  // Lớp 3
  LEn(3,'EN3C1','L21_pres_cont','Present Continuous','Learn -ing form','I am reading, she is eating','Be + V-ing!','medium',12,21),
  LEn(3,'EN3C1','L22_prepositions','Prepositions: in, on, under','Position words','The cat is on the table','In, on, under!','medium',12,22),
  LEn(3,'EN3C2','L23_jobs','Jobs and Occupations','Learn job names','Teacher, doctor, farmer, driver','What is your job?','easy',10,23),
  LEn(3,'EN3C2','L24_transport','Transport — Phương tiện','Transportation vocabulary','Bus, car, bike, train','I go by bus!','easy',10,24),
  LEn(3,'EN3C3','L25_comparison','Big, bigger, biggest','Simple comparisons','Tall → taller → tallest','Add -er, -est!','medium',12,25),
  LEn(3,'EN3C3','L26_plural','Plurals — Số nhiều','Regular plurals','Cat → cats, box → boxes','Add -s or -es!','medium',12,26),
  LEn(3,'EN3C4','L27_past_simple','Past Simple (intro)','Simple past tense','I played, I went','Yesterday = past!','medium',15,27),
  LEn(3,'EN3C4','L28_there_is','There is / There are','Describe existence','There is a cat, There are 3 dogs','Is = 1, Are = many!','medium',12,28),
  LEn(3,'EN3C5','L29_reading','Reading Comprehension','Read short passages','Read and answer','Read carefully!','medium',12,29),
  LEn(3,'EN3C5','L30_writing','Writing: Short Paragraph','Write 3-5 sentences','My family has 4 people','Topic sentence first!','medium',15,30),
  LEn(3,'EN3C3','L31_countries','Countries — Quốc gia','Country names','Vietnam, Japan, America','Where are you from?','easy',10,31),
  LEn(3,'EN3C4','L32_math_en','Math in English','Math vocabulary','Plus, minus, equals','2 plus 3 equals 5!','easy',10,32),
  LEn(3,'EN3C5','L33_story_3','Story Time','Read simple stories','The Fox and the Grapes','Moral of the story?','medium',12,33),
  LEn(3,'EN3C2','L34_review_hk1_3','Review HK1 English 3','Mid-year review','Grammar, vocabulary','Practice makes perfect!','easy',12,34),
  LEn(3,'EN3C5','L35_review_end_3','Year-end Review Eng 3','Full review','Total review','Excellent progress!','easy',12,35),

  // Lớp 4
  LEn(4,'EN4C1','L21_future','Future: will / going to','Express future plans','I will study, I am going to play','Will = plan, going to = intention!','medium',12,21),
  LEn(4,'EN4C1','L22_must_should','Must / Should','Express obligation','You must listen, you should try','Must = phải, Should = nên!','medium',12,22),
  LEn(4,'EN4C2','L23_adverbs','Adverbs — Trạng từ','Learn adverbs','Quickly, slowly, carefully','Adj + ly = adverb!','medium',12,23),
  LEn(4,'EN4C2','L24_conjunctions','And, But, Or, Because','Connecting words','I like tea but not coffee','And = và, But = nhưng!','medium',12,24),
  LEn(4,'EN4C3','L25_environment','The Environment','Green vocabulary','Recycle, reduce, reuse','3R: Reduce, Reuse, Recycle!','medium',12,25),
  LEn(4,'EN4C3','L26_festivals','Vietnamese Festivals','Cultural vocabulary','Tet, Mid-Autumn, Hung Kings','Tet is our biggest festival!','easy',10,26),
  LEn(4,'EN4C4','L27_email','Writing Email','Write simple emails','Dear, Hi, Best regards','Start with greeting!','medium',15,27),
  LEn(4,'EN4C4','L28_dialogue','Dialogue Practice','Conversational skills','Asking for help, ordering food','Excuse me, can you help?','medium',12,28),
  LEn(4,'EN4C5','L29_reading_4','Reading: Longer Texts','Comprehend longer passages','2-paragraph texts','Scan for keywords!','medium',15,29),
  LEn(4,'EN4C5','L30_project','Mini Project','Create poster in English','My Dream School poster','Be creative!','medium',15,30),
  LEn(4,'EN4C3','L31_irregular','Irregular Verbs','Common irregular verbs','Go→went, eat→ate, see→saw','Memorize them!','hard',12,31),
  LEn(4,'EN4C4','L32_wh_questions','Wh- Questions','Who, What, Where, When, Why, How','Where do you live?','Wh + aux + S + V?','medium',12,32),
  LEn(4,'EN4C5','L33_presentation','Presentation Skills','Give a short talk','About my hobby','Speak clearly!','medium',15,33),
  LEn(4,'EN4C2','L34_review_hk1_4','Review HK1 English 4','Mid-year review','Grammar + vocabulary','Keep practicing!','easy',12,34),
  LEn(4,'EN4C5','L35_review_end_4','Year-end Review Eng 4','Full year review','Total review','Great improvement!','easy',12,35),

  // Lớp 5
  LEn(5,'EN5C1','L21_passive','Passive Voice (intro)','Introduction to passive','The cake was made by Mom','Object becomes subject!','hard',15,21),
  LEn(5,'EN5C1','L22_reported','Reported Speech (intro)','He said that...','Direct → Indirect','She said she was happy!','hard',15,22),
  LEn(5,'EN5C2','L23_conditionals','If... (Conditionals 0,1)','Simple conditionals','If it rains, I stay home','If + present, will + V!','hard',15,23),
  LEn(5,'EN5C2','L24_relative','Who, Which, That (intro)','Relative pronouns','The girl who sings well','Who = người, which = vật!','hard',15,24),
  LEn(5,'EN5C3','L25_technology','Technology Vocabulary','Tech words','Computer, Internet, app','Technology helps us learn!','medium',12,25),
  LEn(5,'EN5C3','L26_letter','Letter Writing','Formal vs informal','Dear Sir/Madam vs Hi John','Formal = polite and proper!','medium',15,26),
  LEn(5,'EN5C4','L27_debate','Simple Debate','Express opinions','I think, I agree, I disagree','Respect different opinions!','medium',12,27),
  LEn(5,'EN5C4','L28_CLIL','Science in English','Cross-curricular','Water cycle, food chain','Learning subjects in English!','medium',15,28),
  LEn(5,'EN5C5','L29_exam_prep','Exam Preparation','Test strategies','Scan, skim, guess meaning','Read questions first!','medium',15,29),
  LEn(5,'EN5C5','L30_graduation','Graduation Speech','Give farewell speech','Thank you teachers and friends','Goodbye and good luck!','easy',12,30),
  LEn(5,'EN5C3','L31_idioms','Common Idioms','Learn English idioms','Break a leg, piece of cake','Idiom ≠ literal meaning!','medium',12,31),
  LEn(5,'EN5C4','L32_pronunciation','Pronunciation Tips','Vowel sounds','Short vs long vowels','Listen and repeat!','medium',12,32),
  LEn(5,'EN5C5','L33_song_en','English Through Songs','Learn with music','Let It Go, Happy','Sing and learn!','easy',10,33),
  LEn(5,'EN5C2','L34_review_hk1_5','Review HK1 English 5','Mid-year review','Grammar + reading','Almost there!','easy',12,34),
  LEn(5,'EN5C5','L35_review_end_5','Year-end Review Eng 5','Full year + primary review','Total English review','Ready for secondary school!','medium',15,35),
];

// ============================================================
//  4. SCIENCE / KHOA HỌC (Lớp 4-5) — 30 bài
// ============================================================
const LS = mkLesson(20500, 'science');
export const scienceExpLessons = [
  // Lớp 4
  LS(4,'KH4C1','L21_nhiet_do','Nhiệt độ','Đo nhiệt độ bằng nhiệt kế','Nóng, lạnh, ấm → số đo','Nước sôi 100°C, nước đá 0°C!','medium',12,21),
  LS(4,'KH4C1','L22_the_ran_long','Thể rắn, lỏng, khí','3 thể của chất','Đá (rắn), nước (lỏng), hơi (khí)','Cùng 1 chất nhưng 3 dạng!','medium',12,22),
  LS(4,'KH4C2','L23_ho_hap','Hô hấp','Hệ hô hấp con người','Hít thở: phổi, khí quản','Thở = lấy oxy, thải CO₂!','medium',12,23),
  LS(4,'KH4C2','L24_tuan_hoan','Tuần hoàn máu','Hệ tuần hoàn cơ bản','Tim bơm máu đi khắp cơ thể','Tim đập suốt đời!','medium',12,24),
  LS(4,'KH4C3','L25_luc','Lực và chuyển động','Hiểu về lực đơn giản','Đẩy, kéo, ma sát','Lực làm vật chuyển động!','medium',12,25),
  LS(4,'KH4C3','L26_dien','Mạch điện đơn giản','Hiểu mạch điện cơ bản','Pin, dây, bóng đèn','Mạch kín → đèn sáng!','medium',15,26),
  LS(4,'KH4C4','L27_am_thanh_kh','Âm thanh và rung động','Âm thanh = rung động','Gõ trống → màng rung → âm thanh','Rung nhanh = cao, rung chậm = trầm!','medium',12,27),
  LS(4,'KH4C4','L28_anh_sang_kh','Ánh sáng — phản xạ','Ánh sáng phản xạ','Gương phản xạ ánh sáng','Ánh sáng đi thẳng!','medium',12,28),
  LS(4,'KH4C5','L29_he_sinh_thai','Hệ sinh thái','Hiểu các HST đơn giản','Rừng, biển, ao, đồng','Sinh vật phụ thuộc nhau!','medium',12,29),
  LS(4,'KH4C5','L30_thuc_pham','An toàn thực phẩm','Thực phẩm sạch và an toàn','Rửa sạch, nấu chín, bảo quản','Ăn sạch để khỏe mạnh!','easy',10,30),
  LS(4,'KH4C3','L31_nang_luong','Năng lượng quanh ta','Hiểu về năng lượng','Điện, nhiệt, ánh sáng = năng lượng','Mọi thứ cần năng lượng!','medium',12,31),
  LS(4,'KH4C4','L32_thoi_tiet_kh','Dự báo thời tiết','Hiểu dự báo thời tiết','Mây, gió, áp suất → dự báo','Xem dự báo trước khi đi!','easy',10,32),
  LS(4,'KH4C5','L33_bien_doi_kh','Biến đổi khí hậu','Hiểu biến đổi khí hậu đơn giản','Trái Đất nóng lên','Trồng cây, tiết kiệm điện!','medium',12,33),
  LS(4,'KH4C2','L34_on_hk1_kh4','Ôn HK1 KH lớp 4','Ôn bài giữa năm','Ôn chất, cơ thể, lực','Ôn tập nhé!','easy',12,34),
  LS(4,'KH4C5','L35_on_cuoi_kh4','Ôn cuối năm KH lớp 4','Ôn toàn bộ','Tổng ôn KH 4','Sẵn sàng lớp 5!','easy',12,35),

  // Lớp 5
  LS(5,'KH5C1','L21_te_bao','Tế bào — đơn vị sống','Giới thiệu tế bào','Mọi sinh vật gồm tế bào','Tế bào = viên gạch xây nhà!','hard',15,21),
  LS(5,'KH5C1','L22_sinh_san','Sinh sản ở sinh vật','Cách SV sinh sản','Hạt, trứng, con','Sinh sản = duy trì nòi giống!','medium',12,22),
  LS(5,'KH5C2','L23_vat_lieu','Vật liệu và tính chất','Phân biệt vật liệu','Kim loại, gỗ, nhựa, thủy tinh','Mỗi vật liệu có tính chất riêng!','medium',12,23),
  LS(5,'KH5C2','L24_hon_hop','Hỗn hợp và dung dịch','Phân biệt hỗn hợp/dung dịch','Nước muối = dung dịch','Hòa tan = dung dịch!','medium',12,24),
  LS(5,'KH5C3','L25_nam_cham_kh','Nam châm và ứng dụng','Ứng dụng nam châm','La bàn, loa, motor','Nam châm ở khắp nơi!','medium',12,25),
  LS(5,'KH5C3','L26_nanh_luong_tai_tao','Năng lượng tái tạo','Năng lượng sạch','Gió, mặt trời, nước','Năng lượng xanh cho tương lai!','medium',12,26),
  LS(5,'KH5C4','L27_vu_tru','Hệ Mặt Trời','Biết về hệ Mặt Trời','8 hành tinh, Trái Đất thứ 3','Trái Đất quay quanh Mặt Trời!','medium',12,27),
  LS(5,'KH5C4','L28_mat_trang','Mặt Trăng và thủy triều','Hiểu về Mặt Trăng','Mặt Trăng quay quanh Trái Đất','Trăng tròn, trăng khuyết!','medium',12,28),
  LS(5,'KH5C5','L29_cong_nghe_kh','Công nghệ và khoa học','Vai trò công nghệ','Robot, AI, máy tính','Công nghệ giúp cuộc sống!','easy',12,29),
  LS(5,'KH5C5','L30_suc_khoe_t','Sức khỏe tuổi dậy thì','Hiểu thay đổi cơ thể','Cơ thể thay đổi = bình thường','Hỏi bố mẹ khi thắc mắc!','medium',12,30),
  LS(5,'KH5C3','L31_dien_nang','Điện năng','Sản xuất và sử dụng điện','Nhà máy điện, pin mặt trời','Điện quý giá lắm!','medium',12,31),
  LS(5,'KH5C4','L32_khi_quyen','Khí quyển Trái Đất','Tầng khí quyển','Ozone, khí O₂, CO₂','Khí quyển bảo vệ ta!','medium',12,32),
  LS(5,'KH5C5','L33_thi_nghiem','Mình làm thí nghiệm','Phương pháp Tự nhiên cơ bản','Quan sát → Giả thuyết → Tự nhiên → Kết luận','Nhà khoa học nhí!','medium',15,33),
  LS(5,'KH5C2','L34_on_hk1_kh5','Ôn HK1 KH lớp 5','Ôn bài giữa năm','Ôn tập KH 5','Ôn kỹ nhé!','easy',12,34),
  LS(5,'KH5C5','L35_on_cuoi_kh5','Tổng ôn KH cuối cấp','Ôn toàn bộ KH','Tổng ôn','Nhà khoa học tương lai!','medium',15,35),
];

// ============================================================
//  5. HISTORY & GEO / LỊCH SỬ ĐỊA LÝ (Lớp 4-5) — 30 bài
// ============================================================
const LH = mkLesson(20600, 'history_geo');
export const histgeoExpLessons = [
  // Lớp 4
  LH(4,'LS4C1','L21_hung_vuong','Thời Hùng Vương','Nước Văn Lang - Âu Lạc','Con Rồng Cháu Tiên','Nguồn gốc dân tộc Việt!','medium',12,21),
  LH(4,'LS4C1','L22_bac_thuoc','Thời Bắc thuộc','1000 năm Bắc thuộc','Hai Bà Trưng, Lý Bí khởi nghĩa','Không bao giờ khuất phục!','medium',12,22),
  LH(4,'LS4C2','L23_nha_ly','Nhà Lý — dời đô','Lý Công Uẩn dời đô','Từ Hoa Lư về Thăng Long','Thăng Long = Hà Nội!','medium',12,23),
  LH(4,'LS4C2','L24_nha_tran','Nhà Trần — 3 lần thắng Nguyên Mông','Chống Nguyên Mông','Trần Hưng Đạo, Bạch Đằng','Hào khí Đông A!','medium',12,24),
  LH(4,'LS4C3','L25_dia_hinh_vn','Địa hình Việt Nam','Núi, đồng bằng, biển','3/4 đồi núi, ĐB sông Hồng, Cửu Long','VN dài hình chữ S!','medium',12,25),
  LH(4,'LS4C3','L26_song_ngoi','Sông ngòi Việt Nam','Các con sông lớn','Sông Hồng, sông Mê Kông','Sông cho nước, phù sa!','easy',10,26),
  LH(4,'LS4C4','L27_khi_hau','Khí hậu Việt Nam','Nhiệt đới gió mùa','Nóng ẩm, mưa nhiều','Bắc 4 mùa, Nam 2 mùa!','medium',12,27),
  LH(4,'LS4C4','L28_dan_toc','54 dân tộc Việt Nam','Đa dạng dân tộc','Kinh, Tày, Thái, Mường...','54 dân tộc anh em!','easy',10,28),
  LH(4,'LS4C5','L29_thanh_pho','Các thành phố lớn','Biết TP lớn VN','HN, TP.HCM, Đà Nẵng, Huế','Mỗi TP có nét riêng!','easy',10,29),
  LH(4,'LS4C5','L30_kinh_te_vn','Kinh tế Việt Nam đơn giản','Nông nghiệp, CN, DV','Lúa gạo, hải sản, may mặc','VN xuất khẩu gạo top thế giới!','medium',12,30),
  LH(4,'LS4C3','L31_bien_dao','Biển đảo Việt Nam','Biển Đông, quần đảo','Hoàng Sa, Trường Sa','Biển đảo thiêng liêng!','medium',12,31),
  LH(4,'LS4C4','L32_di_san_vn','Di sản thế giới tại VN','UNESCO công nhận','Vịnh Hạ Long, Hội An, Phong Nha','Di sản = tự hào!','easy',10,32),
  LH(4,'LS4C5','L33_ban_do_vn','Đọc bản đồ Việt Nam','Kỹ năng bản đồ','Tỉnh, TP, vùng miền','Xem bản đồ tìm quê mình!','easy',12,33),
  LH(4,'LS4C2','L34_on_hk1_ls4','Ôn HK1 LS-ĐL lớp 4','Ôn bài giữa năm','Ôn lịch sử + địa lý','Ôn tập chăm chỉ!','easy',12,34),
  LH(4,'LS4C5','L35_on_cuoi_ls4','Ôn cuối năm LS-ĐL lớp 4','Ôn toàn bộ','Tổng ôn lớp 4','Sẵn sàng lớp 5!','easy',12,35),

  // Lớp 5
  LH(5,'LS5C1','L21_le_loi','Lê Lợi — khởi nghĩa Lam Sơn','Chống quân Minh','Lê Lợi, Nguyễn Trãi','Bình Ngô Đại Cáo!','medium',12,21),
  LH(5,'LS5C1','L22_quang_trung','Quang Trung — đại phá quân Thanh','Chiến thắng Ngọc Hồi','Tết Kỷ Dậu 1789','Vua áo vải!','medium',12,22),
  LH(5,'LS5C2','L23_bac_ho','Bác Hồ','Cuộc đời Chủ tịch HCM','Tìm đường cứu nước','Bác Hồ vĩ đại!','medium',12,23),
  LH(5,'LS5C2','L24_dien_bien_phu','Điện Biên Phủ','Chiến thắng lịch sử','7/5/1954 — chiến thắng','Chấn động địa cầu!','medium',12,24),
  LH(5,'LS5C3','L25_chau_a','Châu Á — châu lục lớn nhất','Biết về châu Á','Trung Quốc, Nhật, Ấn Độ...','VN ở Đông Nam Á!','medium',12,25),
  LH(5,'LS5C3','L26_cac_chau','Các châu lục','6 châu lục','Á, Âu, Phi, Mỹ, Đại Dương, Nam Cực','Thế giới rộng lớn!','easy',10,26),
  LH(5,'LS5C4','L27_dai_duong','Các đại dương','4 đại dương','Thái Bình Dương, Đại Tây Dương...','TBD lớn nhất!','easy',10,27),
  LH(5,'LS5C4','L28_dan_so','Dân số thế giới','8 tỷ người','Dân số tăng nhanh','Nhiều người = cần bảo vệ TĐ!','medium',12,28),
  LH(5,'LS5C5','L29_asean','ASEAN','Hiệp hội ĐNA','10 nước thành viên','VN là thành viên ASEAN!','medium',10,29),
  LH(5,'LS5C5','L30_vn_the_gioi','Việt Nam và thế giới','VN trong cộng đồng QT','Hợp tác quốc tế','VN mở cửa và hội nhập!','medium',10,30),
  LH(5,'LS5C3','L31_moi_truong_tg','Môi trường toàn cầu','Vấn đề Môi trường thế giới','Ô nhiễm, rừng Amazon','Bảo vệ hành tinh xanh!','medium',12,31),
  LH(5,'LS5C4','L32_ky_quan','Kỳ quan thế giới','7 kỳ quan mới','Vạn Lý Trường Thành, Machu Picchu','Thế giới tuyệt vời!','easy',10,32),
  LH(5,'LS5C5','L33_tuong_lai_vn','Tương lai Việt Nam','Phát triển bền vững','Công nghệ, giáo dục, Môi trường','Tương lai do bé quyết định!','easy',10,33),
  LH(5,'LS5C2','L34_on_hk1_ls5','Ôn HK1 LS-ĐL lớp 5','Ôn bài giữa năm','Ôn lịch sử + địa lý','Ôn tập chăm chỉ!','easy',12,34),
  LH(5,'LS5C5','L35_on_cuoi_ls5','Tổng ôn LS-ĐL cuối cấp','Ôn toàn bộ','Tổng ôn','Sẵn sàng lên THCS!','medium',15,35),
];

// ============================================================
//  6. INFORMATICS / TIN HỌC (Lớp 3-5) — 45 bài
// ============================================================
const LI = mkLesson(20700, 'informatics');
export const infoExpLessons = [
  // Lớp 3
  LI(3,'TH3C1','L21_ban_phim','Gõ bàn phím cơ bản','Học cách gõ 10 ngón','Đặt tay đúng hàng phím','F và J có gờ nổi!','easy',12,21),
  LI(3,'TH3C1','L22_chuot','Sử dụng chuột','Click, double-click, kéo thả','Click trái, phải, kéo thả','Nhẹ tay khi click!','easy',10,22),
  LI(3,'TH3C2','L23_word_1','Soạn thảo văn bản 1','Mở Word, gõ chữ, lưu file','Tạo tài liệu đầu tiên','Ctrl+S để lưu!','easy',12,23),
  LI(3,'TH3C2','L24_word_2','Định dạng văn bản','In đậm, nghiêng, cỡ chữ','B = đậm, I = nghiêng','Ctrl+B = in đậm!','medium',12,24),
  LI(3,'TH3C3','L25_paint','Vẽ với Paint','Dùng Paint vẽ tranh','Cọ vẽ, tô màu, hình khối','Chọn cọ rồi vẽ!','easy',12,25),
  LI(3,'TH3C3','L26_folder','Thư mục và file','Tạo folder, đặt tên file','Bé sắp xếp file gọn gàng','Folder = tủ, File = giấy tờ!','easy',10,26),
  LI(3,'TH3C4','L27_internet_1','Internet là gì?','Hiểu Internet cơ bản','Mạng kết nối máy tính','Internet = mạng toàn cầu!','easy',10,27),
  LI(3,'TH3C4','L28_trinh_duyet','Trình duyệt web','Dùng trình duyệt','Gõ địa chỉ, tìm kiếm','Google giúp tìm mọi thứ!','easy',10,28),
  LI(3,'TH3C5','L29_an_toan_mang','An toàn trên mạng','Biết nguy hiểm trên mạng','Không chia sẻ thông tin cá nhân','Hỏi bố mẹ trước khi dùng!','medium',12,29),
  LI(3,'TH3C5','L30_scratch_1','Scratch: Bước đầu','Làm quen Scratch','Kéo block, chạy chương trình','Lắp block như lego!','medium',15,30),
  LI(3,'TH3C3','L31_hinh_anh','Chèn hình ảnh','Chèn hình vào Word','Insert → Pictures','Hình giúp văn bản đẹp hơn!','easy',10,31),
  LI(3,'TH3C4','L32_email_1','Email là gì?','Hiểu về email','Gửi thư điện tử','Email = thư qua mạng!','easy',10,32),
  LI(3,'TH3C5','L33_game_hoc','Game học tập','Dùng game để học','Game toán, tiếng Anh online','Học mà chơi, chơi mà học!','easy',10,33),
  LI(3,'TH3C2','L34_on_hk1_th3','Ôn HK1 Tin học lớp 3','Ôn bài giữa năm','Ôn Word, chuột, bàn phím','Ôn tập nhé!','easy',12,34),
  LI(3,'TH3C5','L35_on_cuoi_th3','Ôn cuối năm TH lớp 3','Ôn toàn bộ','Tổng ôn Tin 3','Sẵn sàng lớp 4!','easy',12,35),

  // Lớp 4
  LI(4,'TH4C1','L21_powerpoint','PowerPoint cơ bản','Tạo slide trình chiếu','Thêm slide, gõ chữ, thêm hình','Slide đẹp = ít chữ!','medium',15,21),
  LI(4,'TH4C1','L22_ppt_thiet_ke','Thiết kế slide đẹp','Chọn theme, font, màu','Hài hòa màu sắc','Tối đa 6 dòng/slide!','medium',12,22),
  LI(4,'TH4C2','L23_excel_1','Excel: Bảng tính','Nhập dữ liệu vào ô','Hàng, cột, ô, sheet','Ô = giao hàng và cột!','medium',12,23),
  LI(4,'TH4C2','L24_excel_2','Excel: Công thức','SUM, AVERAGE cơ bản','=SUM(A1:A5)','Bắt đầu bằng dấu =','medium',15,24),
  LI(4,'TH4C3','L25_scratch_2','Scratch: Lặp và điều kiện','Vòng lặp, câu điều kiện','Repeat, if-then','Lặp = làm nhiều lần!','medium',15,25),
  LI(4,'TH4C3','L26_thuat_toan','Thuật toán trong đời sống','Hiểu thuật toán đơn giản','Nấu mì = thuật toán!','Bước 1 → Bước 2 → Bước 3!','medium',12,26),
  LI(4,'TH4C4','L27_mang_xh','Mạng xã hội và em','An toàn trên MXH','Không chia sẻ vị trí, ảnh cá nhân','Hỏi bố mẹ trước khi đăng!','medium',12,27),
  LI(4,'TH4C4','L28_ban_quyen','Bản quyền số','Hiểu về bản quyền','Không sao chép, ghi nguồn','Tôn trọng tác giả!','medium',10,28),
  LI(4,'TH4C5','L29_robot','Robot và AI','Giới thiệu robot, AI','Robot làm việc thay người','AI = trí tuệ nhân tạo!','easy',10,29),
  LI(4,'TH4C5','L30_du_an','Dự án nhỏ: Poster số','Tạo poster bằng máy tính','Dùng Word/PPT + hình','Sáng tạo thôi!','medium',15,30),
  LI(4,'TH4C3','L31_debug','Tìm lỗi (debug)','Tìm và sửa lỗi trong Scratch','Chạy thử → tìm lỗi → sửa','Bug = lỗi, Debug = sửa lỗi!','medium',12,31),
  LI(4,'TH4C4','L32_google_search','Tìm kiếm thông minh','Kỹ năng tìm Google','Từ khóa chính xác, bộ lọc','Từ khóa đúng = kết quả tốt!','easy',10,32),
  LI(4,'TH4C5','L33_coding_game','Coding qua game','Học lập trình qua game','Code.org, Scratch','Chơi game = học code!','easy',12,33),
  LI(4,'TH4C2','L34_on_hk1_th4','Ôn HK1 Tin lớp 4','Ôn bài giữa năm','Ôn PPT, Excel, Scratch','Ôn tập chăm chỉ!','easy',12,34),
  LI(4,'TH4C5','L35_on_cuoi_th4','Ôn cuối năm TH lớp 4','Ôn toàn bộ','Tổng ôn Tin 4','Sẵn sàng lớp 5!','easy',12,35),

  // Lớp 5
  LI(5,'TH5C1','L21_scratch_3','Scratch: Biến và danh sách','Biến lưu giá trị','score = 0, score += 1','Biến = hộp đựng số!','hard',15,21),
  LI(5,'TH5C1','L22_scratch_game','Scratch: Tạo game','Lập trình game đơn giản','Game bắt táo, game đuổi','Bé tự làm game!','hard',20,22),
  LI(5,'TH5C2','L23_web_1','Trang web HTML cơ bản','Hiểu cấu trúc trang web','Tag, attribute, content','HTML = khung, CSS = trang trí!','hard',15,23),
  LI(5,'TH5C2','L24_du_lieu','Dữ liệu và thông tin','Phân biệt dữ liệu vs thông tin','Số liệu → xử lý → thông tin','Dữ liệu = nguyên liệu!','medium',12,24),
  LI(5,'TH5C3','L25_logic','Tư duy logic','Rèn tư duy logic qua bài toán','Nếu A thì B, logic AND/OR','Logic = suy nghĩ có hệ thống!','medium',15,25),
  LI(5,'TH5C3','L26_flowchart','Lưu đồ thuật toán','Vẽ flowchart','Bắt đầu → Xử lý → Quyết định → Kết thúc','Lưu đồ = bản vẽ thuật toán!','medium',15,26),
  LI(5,'TH5C4','L27_an_ninh_mang','An ninh mạng','Bảo mật cơ bản','Mật khẩu mạnh, 2FA','Mật khẩu = khóa nhà!','medium',12,27),
  LI(5,'TH5C4','L28_iot','IoT — Vạn vật kết nối','Giới thiệu IoT','Đồng hồ thông minh, nhà thông minh','Mọi thứ kết nối Internet!','easy',10,28),
  LI(5,'TH5C5','L29_du_an_web','Dự án: Trang web cá nhân','Tạo trang web đơn giản','HTML + CSS','Trang web đầu tiên!','hard',20,29),
  LI(5,'TH5C5','L30_tuong_lai_cntt','Tương lai công nghệ','AI, robot, VR/AR','Công nghệ phát triển nhanh','Bé = nhà CN tương lai!','easy',10,30),
  LI(5,'TH5C3','L31_python_intro','Python: Giới thiệu','Ngôn ngữ lập trình Python','print("Hello")','Python dễ học!','hard',15,31),
  LI(5,'TH5C4','L32_bieu_do_excel','Biểu đồ trong Excel','Tạo biểu đồ từ dữ liệu','Cột, đường, tròn','Biểu đồ = dữ liệu trực quan!','medium',12,32),
  LI(5,'TH5C5','L33_trinh_chieu','Thuyết trình với PPT','Trình bày slide trước lớp','Nói rõ, slide đẹp','Nhìn người nghe, nói to!','easy',12,33),
  LI(5,'TH5C2','L34_on_hk1_th5','Ôn HK1 Tin lớp 5','Ôn bài giữa năm','Ôn Scratch, HTML, logic','Ôn tập kỹ!','easy',12,34),
  LI(5,'TH5C5','L35_on_cuoi_th5','Tổng ôn Tin cuối cấp','Ôn toàn bộ Tin học','Tổng ôn','Nhà lập trình tương lai!','medium',15,35),
];

// ============================================================
//  7. ART / MỸ THUẬT (Lớp 1-5) — 75 bài
// ============================================================
const LA = mkLesson(20800, 'art');
export const artExpLessons = [
  // Lớp 1
  LA(1,'MT1C1','L21_to_mau','Tô màu tranh','Tô màu không ra ngoài','Tô đều, đẹp','Tô nhẹ tay, đều màu!','easy',10,21),
  LA(1,'MT1C1','L22_ve_mat','Vẽ khuôn mặt','Vẽ mặt người đơn giản','Tròn + mắt + mũi + miệng','Mặt = hình tròn!','easy',10,22),
  LA(1,'MT1C2','L23_ve_hoa','Vẽ bông hoa','Vẽ hoa đơn giản','Cánh hoa, lá, thân','Hoa = tròn nhỏ + cánh xung quanh!','easy',10,23),
  LA(1,'MT1C2','L24_ve_con_vat','Vẽ con vật','Vẽ ĐV từ hình cơ bản','Tròn + oval = con mèo','Ghép hình tròn, oval!','easy',10,24),
  LA(1,'MT1C3','L25_cat_dan','Cắt dán giấy','Cắt và dán tạo hình','Cắt hình tròn, vuông, dán tranh','Cẩn thận với kéo!','easy',12,25),
  LA(1,'MT1C3','L26_nan','Nặn đất sét','Nặn hình từ đất sét/đất nặn','Nặn quả, con vật','Nhào kỹ đất rồi nặn!','easy',12,26),
  LA(1,'MT1C4','L27_tranh_phong_canh','Vẽ phong cảnh','Vẽ cảnh thiên nhiên đơn giản','Mặt trời, núi, cây, nhà','Vẽ xa trước, gần sau!','easy',12,27),
  LA(1,'MT1C4','L28_mau_am_lanh','Màu nóng và lạnh','Phân biệt màu nóng/lạnh','Đỏ, cam = nóng; xanh = lạnh','Nóng = lửa, lạnh = nước!','easy',10,28),
  LA(1,'MT1C5','L29_trang_tri','Trang trí đơn giản','Trang trí đường diềm','Lặp lại hoa văn','Lặp lại mẫu = đường diềm!','easy',10,29),
  LA(1,'MT1C5','L30_ve_gia_dinh','Vẽ gia đình em','Vẽ tranh gia đình','Bố, mẹ, bé, nhà','Vẽ người thân yêu!','easy',12,30),
  LA(1,'MT1C3','L31_in_hinh','In hình bằng lá cây','Tạo hình từ lá cây','Nhúng sơn + in lên giấy','Chọn lá đẹp rồi in!','easy',10,31),
  LA(1,'MT1C4','L32_xem_tranh','Xem tranh và cảm nhận','Biết nhận xét tranh','Tranh có gì? Màu gì? Đẹp không?','Mỗi người thấy khác nhau!','easy',8,32),
  LA(1,'MT1C5','L33_ve_truong','Vẽ trường em','Vẽ tranh trường học','Cổng trường, sân, lớp học','Vẽ nơi mình yêu thích!','easy',12,33),
  LA(1,'MT1C2','L34_on_hk1_mt1','Ôn HK1 Mĩ thuật lớp 1','Ôn bài giữa năm','Ôn vẽ, tô, cắt dán','Vẽ mỗi ngày!','easy',10,34),
  LA(1,'MT1C5','L35_on_cuoi_mt1','Ôn cuối năm Mĩ thuật lớp 1','Ôn toàn bộ','Tổng ôn Mĩ thuật 1','Bé họa sĩ giỏi!','easy',10,35),

  // Lớp 2
  LA(2,'MT2C1','L21_ve_nguoi','Vẽ người đang hoạt động','Vẽ người chạy, nhảy','Cơ thể = que + tròn','Chú ý tay chân đang động!','easy',10,21),
  LA(2,'MT2C1','L22_pha_mau','Pha màu cơ bản','Pha 2 màu tạo màu mới','Đỏ + Vàng = Cam','3 màu gốc: Đỏ, Vàng, Xanh!','easy',12,22),
  LA(2,'MT2C2','L23_ve_qu_vat','Vẽ quả và vật','Vẽ tĩnh vật đơn giản','Quả táo, bình hoa, ly nước','Nhìn kỹ rồi vẽ!','easy',12,23),
  LA(2,'MT2C2','L24_hoa_tiet','Họa tiết trang trí','Tạo họa tiết lặp lại','Hoa, sao, hình tròn lặp','Đều và đẹp!','easy',10,24),
  LA(2,'MT2C3','L25_collage','Xé dán tranh','Xé giấy dán tạo hình','Xé giấy màu dán tranh','Xé nhẹ, dán phẳng!','easy',12,25),
  LA(2,'MT2C3','L26_mau_bot','Vẽ bằng màu bột','Sử dụng màu bột/loại','Pha nước + bột = sơn','Pha loãng vừa đủ!','medium',12,26),
  LA(2,'MT2C4','L27_ve_de_tai','Vẽ theo đề tài','Vẽ tranh đề tài tự do','Em vui chơi, ngày Tết','Chọn đề tài mình thích!','easy',12,27),
  LA(2,'MT2C4','L28_xem_tuong','Xem tượng','Nhận xét tác phẩm điêu khắc','Tượng Phật, tượng anh hùng','Tượng = nghệ thuật 3D!','easy',10,28),
  LA(2,'MT2C5','L29_thiet_ke','Thiết kế thiệp','Làm thiệp tặng','Thiệp sinh nhật, thiệp Tết','Thiệp tay = tình cảm!','easy',12,29),
  LA(2,'MT2C5','L30_nghe_thuat_dan_gian','Nghệ thuật dân gian','Biết tranh Đông Hồ','Tranh Đông Hồ, tranh Hàng Trống','Nghệ thuật Việt Nam tuyệt vời!','easy',10,30),
  LA(2,'MT2C3','L31_ve_dong_vat_2','Vẽ con vật yêu thích','Vẽ ĐV chi tiết hơn','Vẽ lông, mắt, tai','Quan sát kỹ rồi vẽ!','easy',12,31),
  LA(2,'MT2C4','L32_tranh_nhom','Vẽ tranh nhóm','Hợp tác vẽ tranh tường','Cùng bạn vẽ 1 tranh lớn','Chia phần, rồi ghép!','easy',12,32),
  LA(2,'MT2C5','L33_sang_tao_vat_lieu','Sáng tạo từ vật liệu','Tái chế thành nghệ thuật','Chai nhựa → lọ hoa','Tái chế = sáng tạo!','easy',12,33),
  LA(2,'MT2C2','L34_on_hk1_mt2','Ôn HK1 Mĩ thuật lớp 2','Ôn bài giữa năm','Ôn vẽ, pha màu, cắt dán','Luyện tập!','easy',10,34),
  LA(2,'MT2C5','L35_on_cuoi_mt2','Ôn cuối năm Mĩ thuật lớp 2','Ôn toàn bộ','Tổng ôn Mĩ thuật 2','Họa sĩ nhí giỏi!','easy',10,35),

  // Lớp 3
  LA(3,'MT3C1','L21_phoi_canh','Phối cảnh đơn giản','Xa nhỏ, gần to','Vẽ cảnh có xa gần','Gần = to, Xa = nhỏ!','medium',12,21),
  LA(3,'MT3C1','L22_sang_toi','Sáng tối trong vẽ','Tạo khối bằng sáng tối','Tô đậm nhạt = 3D','Ánh sáng = sáng, bóng = tối!','medium',12,22),
  LA(3,'MT3C2','L23_net_ve','Nét vẽ biểu cảm','Sử dụng nét thể hiện cảm xúc','Nét mạnh = mạnh mẽ, nét mềm = nhẹ nhàng','Nét vẽ = tính cách!','medium',12,23),
  LA(3,'MT3C2','L24_boc_hinh','Bố cục tranh','Sắp xếp hình trong tranh','Trọng tâm, cân đối','Nhân vật chính ở giữa!','medium',12,24),
  LA(3,'MT3C3','L25_lam_mo_hinh','Làm mô hình','Tạo mô hình từ vật liệu','Giấy bìa, keo, kéo → ngôi nhà','Cắt kỹ, dán chắc!','medium',15,25),
  LA(3,'MT3C3','L26_mat_na','Làm mặt nạ','Tạo mặt nạ trang trí','Giấy bìa + sơn + dây','Mặt nạ lễ hội vui!','easy',12,26),
  LA(3,'MT3C4','L27_tranh_truyen','Vẽ tranh truyện','Kể chuyện bằng hình','4 khung tranh kể chuyện','Mỗi khung = 1 cảnh!','medium',15,27),
  LA(3,'MT3C4','L28_logo','Thiết kế logo','Tạo logo đơn giản','Hình + chữ = logo','Logo = biểu tượng!','medium',12,28),
  LA(3,'MT3C5','L29_kien_truc','Kiến trúc Việt Nam','Biết kiến trúc truyền thống','Đình, chùa, nhà rông','Kiến trúc VN rất đẹp!','easy',10,29),
  LA(3,'MT3C5','L30_thoi_trang','Thiết kế thời trang','Vẽ trang phục','Áo dài, váy, áo sơ mi','Thời trang = nghệ thuật!','easy',12,30),
  LA(3,'MT3C3','L31_origami','Gấp giấy Origami','Gấp hình từ giấy','Gấp hạc, thuyền, hoa','Gấp chính xác, nhẹ tay!','easy',12,31),
  LA(3,'MT3C4','L32_nhac_va_hinh','Âm nhạc và hình ảnh','Vẽ theo nhạc','Nghe nhạc vui → vẽ tươi sáng','Để nhạc gợi cảm hứng!','easy',12,32),
  LA(3,'MT3C5','L33_trien_lam','Triển lãm nhỏ','Trưng bày tác phẩm','Bé bày tranh cho bạn xem','Tự hào tác phẩm mình!','easy',10,33),
  LA(3,'MT3C2','L34_on_hk1_mt3','Ôn HK1 Mĩ thuật lớp 3','Ôn bài giữa năm','Ôn vẽ, nặn, cắt dán','Luyện tập!','easy',10,34),
  LA(3,'MT3C5','L35_on_cuoi_mt3','Ôn cuối năm Mĩ thuật lớp 3','Ôn toàn bộ','Tổng ôn Mĩ thuật 3','Họa sĩ nhí tài ba!','easy',10,35),

  // Lớp 4
  LA(4,'MT4C1','L21_mau_tuong_phan','Màu tương phản','Sử dụng màu đối lập','Đỏ-Xanh lá, Vàng-Tím','Tương phản = nổi bật!','medium',12,21),
  LA(4,'MT4C1','L22_mau_hoa_hop','Màu hòa hợp','Phối màu cùng tông','Xanh dương + xanh lá = hài hòa','Gần nhau trên bánh xe màu!','medium',12,22),
  LA(4,'MT4C2','L23_chan_dung','Vẽ chân dung','Vẽ chân dung người','Tỷ lệ khuôn mặt','Mắt ở 1/2 mặt!','medium',15,23),
  LA(4,'MT4C2','L24_tinh_vat','Vẽ tĩnh vật','Vẽ bài tĩnh vật có sáng tối','Quả, bình, ly → sáng tối','Quan sát nguồn sáng!','medium',15,24),
  LA(4,'MT4C3','L25_thiet_ke_ao','Thiết kế áo','Trang trí áo thun','Vẽ hoa văn lên áo','Áo thun = khung vẽ!','easy',12,25),
  LA(4,'MT4C3','L26_poster','Thiết kế poster','Tạo poster sự kiện','Chữ to + hình nổi bật','Poster phải bắt mắt!','medium',12,26),
  LA(4,'MT4C4','L27_nhieu_chat_lieu','Tranh đa chất liệu','Kết hợp nhiều chất liệu','Giấy + vải + sơn + lá','Mix = sáng tạo!','medium',12,27),
  LA(4,'MT4C4','L28_ve_theo_phong_cach','Vẽ theo phong cách','Thử phong cách họa sĩ','Ấn tượng, trừu tượng','Mỗi họa sĩ có phong cách riêng!','medium',12,28),
  LA(4,'MT4C5','L29_my_thuat_ung_dung','Mỹ thuật ứng dụng','Nghệ thuật trong đời sống','Bao bì, nội thất, thời trang','Mỹ thuật ở khắp nơi!','easy',10,29),
  LA(4,'MT4C5','L30_ve_bang_may','Vẽ bằng máy tính','Dùng phần mềm vẽ','Paint, Canva, Drawing app','Máy tính cũng vẽ được!','medium',12,30),
  LA(4,'MT4C3','L31_dieu_khac','Điêu khắc nổi','Nặn phù điêu','Đất sét + công cụ → phù điêu','Phù điêu = tranh nổi!','medium',12,31),
  LA(4,'MT4C4','L32_animation','Hoạt hình cơ bản','Tạo hoạt hình đơn giản','Vẽ nhiều frame → chuyển động','Nhiều hình liền = chuyển động!','medium',15,32),
  LA(4,'MT4C5','L33_nghe_thuat_tg','Nghệ thuật thế giới','Biết Van Gogh, Picasso','Đêm đầy sao, Guernica','Họa sĩ nổi tiếng thế giới!','easy',10,33),
  LA(4,'MT4C2','L34_on_hk1_mt4','Ôn HK1 Mĩ thuật lớp 4','Ôn bài giữa năm','Ôn vẽ, thiết kế','Luyện tập!','easy',10,34),
  LA(4,'MT4C5','L35_on_cuoi_mt4','Ôn cuối năm Mĩ thuật lớp 4','Ôn toàn bộ','Tổng ôn Mĩ thuật 4','Tài năng Mĩ thuật lớn!','easy',10,35),

  // Lớp 5
  LA(5,'MT5C1','L21_phoi_canh_nc','Phối cảnh nâng cao','Remote gần xa, 2 điểm mất','Vẽ đường phố có phối cảnh','2 điểm tụ = thực tế!','hard',15,21),
  LA(5,'MT5C1','L22_hinh_khoi','Hình khối và ánh sáng','Vẽ khối có sáng tối','Hình cầu, hộp, trụ → shadow','Ánh sáng tạo chiều sâu!','hard',15,22),
  LA(5,'MT5C2','L23_tranh_co_dong','Tranh cổ động','Vẽ tranh cổ động','Thông điệp + hình + chữ','Tranh cổ động = truyền thông!','medium',12,23),
  LA(5,'MT5C2','L24_thiet_ke_san_pham','Thiết kế sản phẩm','Thiết kế đồ dùng','Mug, túi, hộp bút','Thiết kế = chức năng + đẹp!','medium',15,24),
  LA(5,'MT5C3','L25_photography','Nhiếp ảnh cơ bản','Chụp ảnh composition','Quy tắc 1/3, ánh sáng','Mắt nhìn = cảm xúc!','medium',12,25),
  LA(5,'MT5C3','L26_video','Quay video đơn giản','Dùng điện thoại quay video','Giữ vững, ánh sáng đủ','Ngang máy khi quay!','medium',12,26),
  LA(5,'MT5C4','L27_digital_art','Nghệ thuật số','Vẽ trên tablet/máy tính','Photoshop, Procreate, GIMP','Bút cảm ứng = cọ số!','medium',15,27),
  LA(5,'MT5C4','L28_bieu_dien','Nghệ thuật biểu diễn','Kết hợp Mĩ thuật + sân khấu','Trang trí sân khấu, hóa trang','Nghệ thuật = tổng hợp!','easy',12,28),
  LA(5,'MT5C5','L29_thuong_hieu','Thiết kế thương hiệu','Logo + màu + font','Tạo brand cho nhóm','Thương hiệu = nhận diện!','medium',15,29),
  LA(5,'MT5C5','L30_portfolio','Làm portfolio','Tập hợp tác phẩm cá nhân','Album các bài vẽ đẹp nhất','Portfolio = hồ sơ nghệ thuật!','easy',12,30),
  LA(5,'MT5C3','L31_installation','Nghệ thuật sắp đặt','Sắp đặt vật thể thành TP','Dùng vật tái chế sắp đặt','Vật bình thường → nghệ thuật!','medium',12,31),
  LA(5,'MT5C4','L32_lich_su_mt','Lịch sử mỹ thuật VN','Tranh sơn mài, lụa','Sơn mài VN nổi tiếng TG','Nghệ thuật VN tuyệt vời!','easy',10,32),
  LA(5,'MT5C5','L33_trien_lam_cuoi','Triển lãm cuối cấp','Trưng bày tổng kết','Chọn tác phẩm đẹp nhất','Bé là họa sĩ thực thụ!','easy',12,33),
  LA(5,'MT5C2','L34_on_hk1_mt5','Ôn HK1 Mĩ thuật lớp 5','Ôn bài giữa năm','Ôn vẽ, thiết kế, ảnh','Luyện tập!','easy',10,34),
  LA(5,'MT5C5','L35_on_cuoi_mt5','Tổng ôn Mĩ thuật cuối cấp','Ôn toàn bộ Mĩ thuật từ lớp 1-5','Tổng ôn','Họa sĩ tài năng!','medium',12,35),
];

// =============== GENERATE CARDS ===============
export const natureExpCards = mkCards(natureExpLessons as any);
export const ethicsExpCards = mkCards(ethicsExpLessons as any);
export const englishExpCards = mkCards(englishExpLessons as any);
export const scienceExpCards = mkCards(scienceExpLessons as any);
export const histgeoExpCards = mkCards(histgeoExpLessons as any);
export const infoExpCards = mkCards(infoExpLessons as any);
export const artExpCards = mkCards(artExpLessons as any);

// =============== QUESTIONS (representative per lesson) ===============
// Each lesson gets 3-4 compact questions

function genQs(lessons: any[], sub: SubCode): ReturnType<typeof mkQ>[] {
  const qs: ReturnType<typeof mkQ>[] = [];
  for (const l of lessons) {
    qs.push(mkQ(l.grade, l.id, sub, 'single_choice',
      `${l.title} — chọn câu đúng:`,
      `["${l.summarySimple}","Không liên quan","Sai hoàn toàn"]`,
      l.summarySimple,
      l.objective,
      l.difficulty, 'kien_thuc'));
    qs.push(mkQ(l.grade, l.id, sub, 'true_false',
      `"${l.tips}" — Đúng hay sai?`,
      '["Đúng","Sai"]', 'Đúng',
      `Đúng! ${l.tips}`,
      l.difficulty, 'kien_thuc'));
    qs.push(mkQ(l.grade, l.id, sub, 'single_choice',
      `Bài "${l.title}" thuộc môn gì?`,
      `["${sub === 'nature' ? 'Tự nhiên xã hội' : sub === 'ethics' ? 'Đạo đức' : sub === 'english' ? 'Tiếng Anh' : sub === 'science' ? 'Khoa học' : sub === 'history_geo' ? 'Lịch sử - Địa lý' : sub === 'informatics' ? 'Tin học' : 'Mỹ thuật'}","Toán","Tiếng Việt"]`,
      sub === 'nature' ? 'Tự nhiên xã hội' : sub === 'ethics' ? 'Đạo đức' : sub === 'english' ? 'Tiếng Anh' : sub === 'science' ? 'Khoa học' : sub === 'history_geo' ? 'Lịch sử - Địa lý' : sub === 'informatics' ? 'Tin học' : 'Mỹ thuật',
      `Bài này thuộc chương trình ${sub}`,
      'easy', 'phan_mon'));
  }
  return qs;
}

export const natureExpQuestions = genQs(natureExpLessons, 'nature');
export const ethicsExpQuestions = genQs(ethicsExpLessons, 'ethics');
export const englishExpQuestions = genQs(englishExpLessons, 'english');
export const scienceExpQuestions = genQs(scienceExpLessons, 'science');
export const histgeoExpQuestions = genQs(histgeoExpLessons, 'history_geo');
export const infoExpQuestions = genQs(infoExpLessons, 'informatics');
export const artExpQuestions = genQs(artExpLessons, 'art');
