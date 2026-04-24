/**
 * MỸ THUẬT LỚP 1-5 — 100 bài (20 bài × 5 lớp)
 * Chương trình GDPT 2018
 */
import type { Lesson } from './seedData';
let sid = 0;
const L = (grade: number, title: string, chapter: string, order: number): Lesson => ({
  id: 700 + (++sid), grade, subjectCode: 'art',
  unitCode: chapter.replace(/\s+/g, '_').substring(0, 20), lessonCode: `Mỹ thuật${grade}-${String(order).padStart(2, '0')}`,
  title, objective: `Học về ${title.toLowerCase()}`,
  summarySimple: `Bé tìm hiểu và thực hành ${title.toLowerCase()}`,
  tips: 'Hãy sáng tạo và tự tin thể hiện!',
  difficulty: order <= 8 ? 'easy' : order <= 16 ? 'medium' : 'hard',
  estimatedMinutes: 15, status: 'ready', sortOrder: order, isActive: 1,
});

// ===== LỚP 1 (701-720) =====
export const artLessons1: Lesson[] = [
  L(1,'Màu sắc quanh em','Quan sát và nhận biết',1),
  L(1,'Hình dạng cơ bản','Quan sát và nhận biết',2),
  L(1,'Đường nét vui nhộn','Quan sát và nhận biết',3),
  L(1,'Nhận biết họa tiết','Quan sát và nhận biết',4),
  L(1,'Vẽ nét thẳng và cong','Vẽ cơ bản',5),
  L(1,'Tô màu đều và đẹp','Vẽ cơ bản',6),
  L(1,'Vẽ cây và hoa','Vẽ cơ bản',7),
  L(1,'Vẽ con vật yêu thích','Vẽ cơ bản',8),
  L(1,'Nặn hình đơn giản','Nặn và xé dán',9),
  L(1,'Xé dán giấy màu','Nặn và xé dán',10),
  L(1,'Xé dán con vật','Nặn và xé dán',11),
  L(1,'Tạo hình từ đất nặn','Nặn và xé dán',12),
  L(1,'Trang trí đường diềm','Trang trí đơn giản',13),
  L(1,'Trang trí khung ảnh','Trang trí đơn giản',14),
  L(1,'Trang trí thiệp chúc mừng','Trang trí đơn giản',15),
  L(1,'Trang trí góc học tập','Trang trí đơn giản',16),
  L(1,'Xem tranh đẹp','Thưởng thức mỹ thuật',17),
  L(1,'Tranh thiếu nhi','Thưởng thức mỹ thuật',18),
  L(1,'Sản phẩm mỹ thuật quanh em','Thưởng thức mỹ thuật',19),
  L(1,'Em yêu mỹ thuật','Thưởng thức mỹ thuật',20),
];

// ===== LỚP 2 (721-740) =====
export const artLessons2: Lesson[] = [
  L(2,'Hình khối cơ bản','Quan sát hình dạng',1),
  L(2,'Tỷ lệ đơn giản','Quan sát hình dạng',2),
  L(2,'Hoa văn tự nhiên','Quan sát hình dạng',3),
  L(2,'Màu nóng và màu lạnh','Quan sát hình dạng',4),
  L(2,'Vẽ theo mẫu vật','Vẽ tranh',5),
  L(2,'Vẽ tranh phong cảnh','Vẽ tranh',6),
  L(2,'Vẽ tranh gia đình','Vẽ tranh',7),
  L(2,'Vẽ tranh chủ đề tự do','Vẽ tranh',8),
  L(2,'Gấp giấy đơn giản','Thủ công mỹ thuật',9),
  L(2,'Cắt dán trang trí','Thủ công mỹ thuật',10),
  L(2,'Tạo mặt nạ','Thủ công mỹ thuật',11),
  L(2,'Đồ chơi từ giấy','Thủ công mỹ thuật',12),
  L(2,'Trang trí hình vuông','Trang trí nâng cao',13),
  L(2,'Trang trí hình tròn','Trang trí nâng cao',14),
  L(2,'Trang trí bìa sách','Trang trí nâng cao',15),
  L(2,'Trang trí phòng học','Trang trí nâng cao',16),
  L(2,'Tranh dân gian Việt Nam','Tìm hiểu mỹ thuật',17),
  L(2,'Tranh Đông Hồ','Tìm hiểu mỹ thuật',18),
  L(2,'Sản phẩm thủ công mỹ nghệ','Tìm hiểu mỹ thuật',19),
  L(2,'Sáng tạo nghệ thuật','Tìm hiểu mỹ thuật',20),
];

// ===== LỚP 3 (741-760) =====
export const artLessons3: Lesson[] = [
  L(3,'Phối màu cơ bản','Màu sắc và bố cục',1),
  L(3,'Màu tương phản','Màu sắc và bố cục',2),
  L(3,'Bố cục tranh đơn giản','Màu sắc và bố cục',3),
  L(3,'Không gian trong tranh','Màu sắc và bố cục',4),
  L(3,'Vẽ người đơn giản','Vẽ sáng tạo',5),
  L(3,'Vẽ tranh sinh hoạt','Vẽ sáng tạo',6),
  L(3,'Vẽ tranh thiên nhiên','Vẽ sáng tạo',7),
  L(3,'Vẽ tranh tưởng tượng','Vẽ sáng tạo',8),
  L(3,'Nặn con vật','Tạo hình 3D',9),
  L(3,'Nặn đồ vật','Tạo hình 3D',10),
  L(3,'Tạo hình từ vật liệu tái chế','Tạo hình 3D',11),
  L(3,'Mô hình 3D đơn giản','Tạo hình 3D',12),
  L(3,'Thiết kế bưu thiếp','Thiết kế ứng dụng',13),
  L(3,'Thiết kế áo phông','Thiết kế ứng dụng',14),
  L(3,'Trang trí lễ hội','Thiết kế ứng dụng',15),
  L(3,'Thiết kế poster đơn giản','Thiết kế ứng dụng',16),
  L(3,'Tranh lụa Việt Nam','Di sản mỹ thuật',17),
  L(3,'Kiến trúc cổ Việt Nam','Di sản mỹ thuật',18),
  L(3,'Nghệ thuật tạo hình dân gian','Di sản mỹ thuật',19),
  L(3,'Em là họa sĩ nhỏ','Di sản mỹ thuật',20),
];

// ===== LỚP 4 (761-780) =====
export const artLessons4: Lesson[] = [
  L(4,'Màu bổ túc và tương đồng','Lý thuyết màu',1),
  L(4,'Sắc độ đậm nhạt','Lý thuyết màu',2),
  L(4,'Phối hợp màu trong tranh','Lý thuyết màu',3),
  L(4,'Ánh sáng và bóng đổ','Lý thuyết màu',4),
  L(4,'Vẽ tĩnh vật','Kỹ thuật vẽ',5),
  L(4,'Vẽ chân dung','Kỹ thuật vẽ',6),
  L(4,'Vẽ phong cảnh có chiều sâu','Kỹ thuật vẽ',7),
  L(4,'Vẽ tranh đề tài lễ hội','Kỹ thuật vẽ',8),
  L(4,'Điêu khắc phù điêu','Tạo hình nghệ thuật',9),
  L(4,'Tạo hình từ dây thép','Tạo hình nghệ thuật',10),
  L(4,'Thời trang tái chế','Tạo hình nghệ thuật',11),
  L(4,'Sắp đặt nghệ thuật','Tạo hình nghệ thuật',12),
  L(4,'Thiết kế logo đơn giản','Thiết kế đồ họa',13),
  L(4,'Thiết kế bao bì','Thiết kế đồ họa',14),
  L(4,'Thiết kế tờ rơi','Thiết kế đồ họa',15),
  L(4,'Thiết kế trang web giả','Thiết kế đồ họa',16),
  L(4,'Hội họa Việt Nam hiện đại','Nghệ thuật Việt Nam',17),
  L(4,'Gốm Bát Tràng','Nghệ thuật Việt Nam',18),
  L(4,'Nghệ thuật sơn mài','Nghệ thuật Việt Nam',19),
  L(4,'Triển lãm mỹ thuật lớp','Nghệ thuật Việt Nam',20),
];

// ===== LỚP 5 (781-800) =====
export const artLessons5: Lesson[] = [
  L(5,'Phối cảnh 1 điểm tụ','Phối cảnh và tỷ lệ',1),
  L(5,'Phối cảnh trong đời thực','Phối cảnh và tỷ lệ',2),
  L(5,'Tỷ lệ cơ thể người','Phối cảnh và tỷ lệ',3),
  L(5,'Chuyển động trong tranh','Phối cảnh và tỷ lệ',4),
  L(5,'Vẽ sáng tạo chủ đề xã hội','Sáng tác mỹ thuật',5),
  L(5,'Vẽ truyện tranh ngắn','Sáng tác mỹ thuật',6),
  L(5,'Minh họa truyện cổ tích','Sáng tác mỹ thuật',7),
  L(5,'Vẽ tranh trừu tượng','Sáng tác mỹ thuật',8),
  L(5,'Tạo hình nhân vật hoạt hình','Nghệ thuật ứng dụng',9),
  L(5,'Thiết kế bìa album','Nghệ thuật ứng dụng',10),
  L(5,'Thiết kế nhà ở mơ ước','Nghệ thuật ứng dụng',11),
  L(5,'Sân chơi sáng tạo','Nghệ thuật ứng dụng',12),
  L(5,'Mỹ thuật số cơ bản','Mỹ thuật và công nghệ',13),
  L(5,'Vẽ trên máy tính','Mỹ thuật và công nghệ',14),
  L(5,'Chỉnh sửa ảnh đơn giản','Mỹ thuật và công nghệ',15),
  L(5,'Trình bày poster bằng máy tính','Mỹ thuật và công nghệ',16),
  L(5,'Nghệ thuật thế giới','Văn hóa mỹ thuật',17),
  L(5,'Bảo tàng mỹ thuật','Văn hóa mỹ thuật',18),
  L(5,'Nghệ thuật và cuộc sống','Văn hóa mỹ thuật',19),
  L(5,'Dự án mỹ thuật cuối năm','Văn hóa mỹ thuật',20),
];
