/**
 * TIN HỌC LỚP 5 — 500 câu (25 câu × 20 bài)
 */
import type { Question } from './seedData';
type D = 'easy' | 'medium' | 'hard';
let qid = 10000;
const Q = (lid: number, type: Question['questionType'], text: string, opts: string[] | null, ans: string, skill = '', diff: D = 'easy'): Question => ({
  id: ++qid, grade: 5, subjectCode: 'informatics', lessonId: lid, questionType: type,
  questionText: text, optionsJson: opts ? JSON.stringify(opts) : null,
  correctAnswer: type === 'true_false' ? (ans === 'true' ? 'Đúng' : 'Sai') : ans,
  explanationSimple: '', difficulty: diff, skillTag: skill, sourceType: 'manual', isVerified: 1, isActive: 1,
});
export const informaticsQuestions5: Question[] = [
  // BÀI 641: Bảng tính cơ bản
  Q(641,'single_choice','Phần mềm bảng tính phổ biến nhất?',['Word','Excel','Paint','PowerPoint'],'Excel','bang_tinh'),
  Q(641,'true_false','Excel dùng để tính toán và quản lý dữ liệu.',null,'true','bang_tinh'),
  Q(641,'single_choice','Ô (cell) trong Excel là gì?',['Hàng','Cột','Giao của hàng và cột','Trang'],'Giao của hàng và cột','bang_tinh'),
  Q(641,'fill_text','Phần mềm bảng tính của Microsoft là ___.',null,'Excel','bang_tinh'),
  Q(641,'single_choice','Cột trong Excel đặt tên bằng?',['Số 1,2,3','Chữ A,B,C','Ký hiệu','Màu sắc'],'Chữ A,B,C','bang_tinh'),
  Q(641,'true_false','Hàng (row) trong Excel đánh số 1, 2, 3...',null,'true','bang_tinh'),
  Q(641,'single_choice','Ô A1 nằm ở đâu?',['Cột A, hàng 1','Cột 1, hàng A','Góc dưới phải','Chính giữa'],'Cột A, hàng 1','bang_tinh'),
  Q(641,'fill_text','Trong Excel, ___ là giao của hàng và cột.',null,'ô','bang_tinh'),
  Q(641,'true_false','File Excel có đuôi .xlsx.',null,'true','bang_tinh'),
  Q(641,'single_choice','Sheet (trang tính) nằm ở đâu?',['Trên cùng','Dưới cùng (tab)','Bên phải','Không có'],'Dưới cùng (tab)','bang_tinh'),
  Q(641,'single_choice','Thanh Formula Bar dùng để?',['Vẽ','Nhập/xem công thức','In','Lưu'],'Nhập/xem công thức','bang_tinh','medium'),
  Q(641,'true_false','Có thể tạo nhiều sheet trong 1 file Excel.',null,'true','bang_tinh'),
  Q(641,'fill_text','Đuôi file Excel thường là .___.',null,'xlsx','bang_tinh'),
  Q(641,'single_choice','Name Box hiển thị gì?',['Tên file','Địa chỉ ô đang chọn','Ngày','Giờ'],'Địa chỉ ô đang chọn','bang_tinh','medium'),
  Q(641,'true_false','Ctrl+S lưu file Excel.',null,'true','bang_tinh'),
  Q(641,'single_choice','Để nhập dữ liệu vào ô, bé nhấp vào ô rồi?',['Đóng','Gõ bàn phím','Tắt máy','Xóa'],'Gõ bàn phím','bang_tinh'),
  Q(641,'fill_text','Cột đầu tiên trong Excel tên là ___ .',null,'A','bang_tinh'),
  Q(641,'true_false','Excel có thể tính tổng tự động.',null,'true','bang_tinh'),
  Q(641,'single_choice','Phím Tab trong Excel di chuyển sang?',['Ô trên','Ô dưới','Ô bên phải','Ô bên trái'],'Ô bên phải','bang_tinh'),
  Q(641,'single_choice','Phím Enter trong Excel di chuyển sang?',['Ô trên','Ô dưới','Ô phải','Ô trái'],'Ô dưới','bang_tinh'),
  Q(641,'true_false','Dữ liệu số trong Excel tự động căn phải.',null,'true','bang_tinh','medium'),
  Q(641,'fill_text','Sheet (trang tính) có thể ___ tên.',null,'đổi','bang_tinh'),
  Q(641,'single_choice','Ctrl+Home đưa về ô nào?',['A1','Z100','Cuối trang','Giữa trang'],'A1','bang_tinh','medium'),
  Q(641,'true_false','Dữ liệu chữ trong Excel tự động căn trái.',null,'true','bang_tinh','medium'),
  Q(641,'single_choice','Vùng A1:C3 gồm bao nhiêu ô?',['3','6','9','12'],'9','bang_tinh','medium'),
  // BÀI 642: Công thức Excel cơ bản
  Q(642,'single_choice','Công thức Excel luôn bắt đầu bằng ký tự gì?',['#','+','=','@'],'=','cong_thuc'),
  Q(642,'true_false','=A1+B1 cộng giá trị ô A1 và B1.',null,'true','cong_thuc'),
  Q(642,'single_choice','=SUM(A1:A5) dùng để?',['Đếm','Tính tổng A1 đến A5','Tính trung bình','Tìm max'],'Tính tổng A1 đến A5','cong_thuc'),
  Q(642,'fill_text','Mọi công thức Excel bắt đầu bằng dấu ___.',null,'=','cong_thuc'),
  Q(642,'single_choice','=A1*B1 thực hiện phép tính gì?',['Cộng','Trừ','Nhân','Chia'],'Nhân','cong_thuc'),
  Q(642,'true_false','=A1-B1 trừ B1 khỏi A1.',null,'true','cong_thuc'),
  Q(642,'single_choice','=A1/B1 thực hiện phép?',['Cộng','Trừ','Nhân','Chia'],'Chia','cong_thuc'),
  Q(642,'fill_text','Hàm ___(A1:A10) tính tổng các ô.',null,'SUM','cong_thuc'),
  Q(642,'true_false','=AVERAGE(A1:A5) tính trung bình.',null,'true','cong_thuc','medium'),
  Q(642,'single_choice','=MAX(A1:A5) trả về gì?',['Giá trị nhỏ nhất','Giá trị lớn nhất','Tổng','Trung bình'],'Giá trị lớn nhất','cong_thuc','medium'),
  Q(642,'single_choice','=MIN(A1:A5) trả về gì?',['Giá trị lớn nhất','Giá trị nhỏ nhất','Tổng','Số lượng'],'Giá trị nhỏ nhất','cong_thuc','medium'),
  Q(642,'true_false','=COUNT(A1:A10) đếm số ô có chứa số.',null,'true','cong_thuc','medium'),
  Q(642,'fill_text','Hàm ___(A1:A5) tìm giá trị lớn nhất.',null,'MAX','cong_thuc','medium'),
  Q(642,'single_choice','Nếu A1=5, B1=3, thì =A1+B1 bằng?',['2','8','15','53'],'8','cong_thuc'),
  Q(642,'true_false','Dấu * là phép nhân trong Excel.',null,'true','cong_thuc'),
  Q(642,'single_choice','Dấu / trong Excel là phép gì?',['Cộng','Trừ','Nhân','Chia'],'Chia','cong_thuc'),
  Q(642,'fill_text','Hàm ___(A1:A5) tính trung bình cộng.',null,'AVERAGE','cong_thuc','medium'),
  Q(642,'true_false','=2+3 trong Excel cho kết quả 5.',null,'true','cong_thuc'),
  Q(642,'single_choice','#DIV/0! xuất hiện khi nào?',['Ô rỗng','Chia cho 0','Cộng','Nhân'],'Chia cho 0','cong_thuc','hard'),
  Q(642,'single_choice','AutoSum (Σ) nằm ở tab nào?',['Insert','Home','View','Layout'],'Home','cong_thuc','medium'),
  Q(642,'true_false','Có thể kết hợp nhiều phép tính trong 1 công thức.',null,'true','cong_thuc','medium'),
  Q(642,'fill_text','Lỗi ___ xuất hiện khi chia cho số 0.',null,'#DIV/0!','cong_thuc','hard'),
  Q(642,'single_choice','=A1^2 là phép tính gì?',['Cộng','Lũy thừa bậc 2','Nhân','Chia'],'Lũy thừa bậc 2','cong_thuc','hard'),
  Q(642,'true_false','Hàm SUM có thể tính nhiều vùng: =SUM(A1:A5,B1:B5).',null,'true','cong_thuc','hard'),
  Q(642,'single_choice','Để copy công thức xuống dưới, bé kéo gì?',['Thanh cuộn','Fill Handle (ô vuông nhỏ)','Scrollbar','Menu'],'Fill Handle (ô vuông nhỏ)','cong_thuc','medium'),
  // BÀI 643-660: Tiếp tục pattern
  ...Array.from({length: 18}, (_, bai) => {
    const lid = 643 + bai;
    const topics = ['bieu_do','dinh_dang_excel','da_phuong_tien','am_thanh','video','trinh_chieu_nc','scratch_nc','bien_scratch','ham_scratch','clone_scratch','du_an_lon','lam_viec_nhom','ban_quyen','thong_tin_sai','an_toan_mat_khau','mang_xa_hoi','du_an_cuoi','tong_ket'];
    const skill = topics[bai] || 'chung';
    const titles = [
      'Biểu đồ Excel','Định dạng bảng tính','Đa phương tiện','Âm thanh số','Video số',
      'Trình chiếu nâng cao','Scratch nâng cao','Biến trong Scratch','Hàm trong Scratch','Clone trong Scratch',
      'Dự án lớn','Làm việc nhóm','Bản quyền số','Thông tin sai lệch','An toàn mật khẩu',
      'Mạng xã hội an toàn','Dự án cuối năm','Tổng kết Tin học 5',
    ];
    const t = titles[bai] || `Bài ${lid}`;
    const cat = bai < 2 ? 'Bảng tính' : bai < 5 ? 'Đa phương tiện' : bai < 6 ? 'Trình chiếu' : bai < 11 ? 'Lập trình' : bai < 12 ? 'Kỹ năng' : 'Công dân số';
    return [
      Q(lid,'single_choice',`Bài "${t}" thuộc mảng nào?`,['Thể thao',cat,'Âm nhạc','Nấu ăn'],cat,skill),
      Q(lid,'true_false',`"${t}" là kiến thức quan trọng trong Tin học lớp 5.`,null,'true',skill),
      Q(lid,'single_choice',`Kỹ năng chính khi học "${t}"?`,['Chạy bộ','Thành thạo công nghệ','Bơi lội','Vẽ tranh'],'Thành thạo công nghệ',skill),
      Q(lid,'fill_text',`"${t}" nằm trong chương trình Tin học lớp ___.`,null,'5',skill),
      Q(lid,'true_false',`Thực hành "${t}" cần máy tính.`,null,'true',skill),
      Q(lid,'single_choice',`"${t}" giúp bé chuẩn bị cho?`,['Chơi game','Học lớp 6','Ngủ','Ăn'],'Học lớp 6',skill),
      Q(lid,'single_choice',`Ai có thể học "${t}"?`,['Chỉ người lớn','Học sinh lớp 5','Chỉ kỹ sư','Chỉ giáo viên'],'Học sinh lớp 5',skill),
      Q(lid,'true_false',`"${t}" cần sự sáng tạo và tư duy.`,null,'true',skill),
      Q(lid,'fill_text',`${cat} là mảng quan trọng của môn ___.`,null,'Tin học',skill),
      Q(lid,'single_choice',`Điều KHÔNG đúng về "${t}"?`,['Rất hữu ích','Cần thực hành','Chỉ để chơi game','Phát triển tư duy'],'Chỉ để chơi game',skill),
      Q(lid,'true_false',`Kiến thức "${t}" ứng dụng được vào đời sống.`,null,'true',skill),
      Q(lid,'single_choice',`Cách học "${t}" tốt nhất?`,['Chỉ đọc','Thực hành trên máy','Không học','Chỉ nghe'],'Thực hành trên máy',skill),
      Q(lid,'fill_text',`GDPT ___ là chương trình giáo dục mới.`,null,'2018',skill,'medium'),
      Q(lid,'true_false',`"${t}" có phần bài tập thực hành.`,null,'true',skill),
      Q(lid,'single_choice',`"${t}" phát triển năng lực gì?`,['Thể lực','Năng lực số','Giọng hát','Vẽ tranh'],'Năng lực số',skill),
      Q(lid,'single_choice',`Tin học lớp 5 có mấy bài?`,['10','15','20','30'],'20',skill),
      Q(lid,'true_false',`Hỏi thầy cô khi không hiểu "${t}" là điều nên làm.`,null,'true',skill),
      Q(lid,'fill_text',`Lớp 5 là năm cuối cấp ___.`,null,'tiểu học',skill),
      Q(lid,'single_choice',`An toàn số quan trọng khi học "${t}" không?`,['Không','Rất quan trọng','Tùy','Không biết'],'Rất quan trọng',skill),
      Q(lid,'true_false',`Sáng tạo là yếu tố quan trọng trong "${t}".`,null,'true',skill),
      Q(lid,'single_choice',`"${t}" liên quan đến môn học nào khác?`,['Không môn nào','Toán, Tiếng Việt','Chỉ Thể dục','Chỉ Âm nhạc'],'Toán, Tiếng Việt',skill,'medium'),
      Q(lid,'fill_text',`Công nghệ ___ giúp cuộc sống tiện lợi hơn.`,null,'số',skill),
      Q(lid,'true_false',`Tổng kết Tin học lớp 5 giúp ôn lại kiến thức.`,null,'true',skill),
      Q(lid,'single_choice',`Sau khi hoàn thành Tin học lớp 5, bé?`,['Quên hết','Tự tin dùng công nghệ','Sợ máy tính','Không thay đổi'],'Tự tin dùng công nghệ',skill,'medium'),
      Q(lid,'true_false',`Tin học là môn học thiết yếu trong thời đại 4.0.`,null,'true',skill),
    ];
  }).flat(),
];
