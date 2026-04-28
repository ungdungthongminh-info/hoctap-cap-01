# Kế hoạch triển khai audio tĩnh (2 giọng đã duyệt)

## Mục tiêu
- Dùng mô hình `pre-generated static audio + manifest`.
- Giữ app chạy mặc định giọng `vi-VN-Chirp3-HD-Despina`.
- Có thêm giọng `vi-VN-Chirp3-HD-Algenib` để dự phòng/đối chiếu.
- Toàn bộ text tiếng Việt phải sạch dấu trước khi tạo audio.

## Trạng thái hiện tại
- Đã chuẩn hóa pipeline text/SSML tiếng Việt.
- Đã chuyển profile giọng:
  - `vi-v1` -> `vi-VN-Chirp3-HD-Despina` (default)
  - `vi-v2` -> `vi-VN-Chirp3-HD-Algenib`
- Manifest đang ở trạng thái sạch (chưa đánh dấu asset có sẵn).

## Nguyên tắc chạy generate
1. Chạy theo lô nhỏ để nghe thử trước, tránh tốn API nếu text/nhịp chưa chuẩn.
2. Mỗi lô phải qua QA nghe thực tế rồi mới chạy lô kế tiếp.
3. Chỉ generate full cho giọng default trước (`vi-v1`).
4. Giọng `vi-v2` generate theo phạm vi cần dùng (audit + nhóm bài ưu tiên), trừ khi cần full bộ.

## Quy trình thực thi
1. Đồng bộ catalog mới
   - `npm run tts:catalog -- --default-profile=vi-v1`
2. Pilot QA (nhỏ)
   - Generate nhóm `pregrade-prompt,feedback,audit` cho `vi-v1`.
   - Nghe kiểm tra nhịp: dấu phẩy, câu hỏi, số, phép tính.
3. Generate production cho giọng mặc định `vi-v1`
   - Theo từng usage: `lesson-card` -> `question` -> `pregrade-prompt` -> `feedback`.
   - Sau mỗi nhóm, cập nhật manifest và test phát trực tiếp trong app.
4. Generate giọng phụ `vi-v2` (Algenib)
   - Mặc định: `audit + pregrade-prompt + feedback`.
   - Mở rộng `lesson-card/question` nếu cần cho phép đổi giọng toàn bộ.
5. Khóa vận hành
   - Sau khi đủ file tĩnh: app ưu tiên phát từ manifest.
   - API mode giữ ở advanced/generator only, không dùng runtime mặc định.

## Checklist QA nghe
- Đọc đúng dấu tiếng Việt (đặc biệt từ có dấu nặng/hỏi/ngã).
- Câu hỏi đúng nhịp: ngắt ở `, . ?`.
- Phép tính đọc tự nhiên: `+ - x × / =`.
- Không còn hiện tượng đọc “bang” sai ngữ cảnh.
- Các câu feedback ngắn rõ ràng, không nuốt chữ.

## Rủi ro và kiểm soát
- Key API sai định dạng -> validate trước khi chạy lô lớn.
- Dịch vụ Google tạm lỗi `UNAVAILABLE` -> retry theo lô nhỏ, không chạy all-in-one.
- Text dữ liệu mới thêm có thể lỗi mã -> luôn regenerate catalog trước generate audio.

## Chốt đề xuất
- Khuyến nghị triển khai:
  - `vi-v1` full bộ.
  - `vi-v2` theo phạm vi ưu tiên trước (để tiết kiệm chi phí + dung lượng).
