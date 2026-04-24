# Báo Cáo Và Yêu Cầu Web Tổng Thực Hiện

Ngày: 2026-04-23
Phía gửi: AI-app Cap 01
Phía nhận: Web Tổng

## 1. Mục tiêu chung

Hai phía cần thống nhất một luồng tích hợp duy nhất để:

- webapp và desktop app cùng dùng chung 1 tài khoản Web Tổng
- giá gói lấy Web Tổng làm nguồn gốc
- key xác định gói bằng verify thật từ Web Tổng
- login chỉ giữ gói Free
- chỉ key hợp lệ mới mở quyền trả phí

## 2. Trạng thái AI-app đã hoàn thành

Phía AI-app đã hoàn tất các phần sau:

1. Webapp và desktop app dùng chung bridge session của Web Tổng.
2. Checkout tạo đơn theo customerId của Web Tổng, không còn dùng local student id.
3. Pricing frontend đọc dữ liệu từ API chuẩn hóa `/api/v1/plans` của backend AI-app.
4. Backend AI-app ưu tiên đồng bộ giá từ catalog Web Tổng.
5. Key không còn suy luận từ regex local để xác định gói nữa; app gọi verify thật qua proxy backend.
6. Login không tự mở gói trả phí; sau login chỉ còn Free.
7. Chỉ khi verify key thành công mới kích hoạt gói trả phí.
8. Scope pricing/activation integration hiện chỉ còn 3 mức:
   - free
   - standard
   - premium
9. Gói Basic đã bị loại khỏi scope tích hợp.

## 3. Web Tổng bắt buộc phải bám theo

### 3.1. Scope gói

Web Tổng cần coi `app-study-12` chỉ còn các gói sau trong luồng tích hợp:

- free
- standard
- premium

Không tiếp tục trả hoặc xử lý `basic` trong pricing/activation integration cho `app-study-12`.

### 3.2. Product map chuẩn

Web Tổng cần giữ đúng các product đang dùng:

- `standard:monthly` -> `prod-study-month`
- `standard:yearly` -> `prod-study-year`
- `standard:lifetime` -> `prod-study-standard-lifetime`
- `premium:monthly` -> `prod-study-premium-month`
- `premium:yearly` -> `prod-study-premium-year`
- `premium:lifetime` -> `prod-study-premium-lifetime`

Không cần map `basic:*` nữa trong phạm vi tích hợp hiện tại.

### 3.3. Giá gốc cần giữ ổn định

AI-app đang bám theo giá Web Tổng như sau:

- Standard:
  - tháng: 89.000
  - năm: 599.000
  - trọn đời: 999.000
- Premium:
  - tháng: 119.000
  - năm: 899.000
  - trọn đời: 1.599.000

Nếu Web Tổng đổi giá, cần cập nhật chính catalog làm nguồn gốc chuẩn.

### 3.4. Contract verify license phải giữ ổn định

Web Tổng cần tiếp tục trả ổn định các field sau trong luồng verify:

- `license.planCode`
- `license.billingCycle`
- `license.expiresAt`
- `license.customerId`
- `features`
- `grace`

AI-app đang dùng trực tiếp các field này để:

- xác định đúng gói Standard/Premium
- xác định chu kỳ tháng/năm/trọn đời
- xác định ngày hết hạn
- đồng bộ feature gating

### 3.5. Quy tắc login và key

Web Tổng cần bám theo quy tắc nghiệp vụ sau:

1. Login chỉ để xác định customer dùng chung giữa webapp và desktop app.
2. Login không có nghĩa là tự mở gói trả phí.
3. Sau thanh toán thành công, tài khoản vẫn ở Free cho đến khi user nhập đúng key hợp lệ.
4. Chỉ key verify thành công mới mở Standard hoặc Premium.

### 3.6. Luồng issue key

Web Tổng cần bảo đảm luồng issue key và verify key chỉ cần hỗ trợ:

- `HHK-STANDARD-...`
- `HHK-PREMIUM-...`

Không cần tiếp tục hỗ trợ `HHK-BASIC-...` trong phạm vi tích hợp mới.

## 4. Endpoint Web Tổng mà AI-app đang bám theo

Web Tổng cần giữ ổn định các endpoint này:

- `POST /api/auth/customer/login`
- `GET /api/auth/me`
- `GET /api/catalog`
- `POST /api/orders`
- `GET /api/orders/:orderId`
- `GET /api/ai-app/customers/:customerId/licenses`
- `POST /api/ai-app/licenses/verify`

Nếu thay đổi response shape hoặc rule auth, cần báo lại để AI-app chỉnh tương ứng.

## 5. Checklist Web Tổng cần thực hiện

### Mức bắt buộc

1. Loại `basic` khỏi scope tích hợp `app-study-12`.
2. Giữ catalog chỉ phản ánh Standard và Premium cho luồng trả phí tích hợp.
3. Giữ contract verify license như hiện tại.
4. Giữ customer login dùng chung được cho webapp và desktop app.
5. Giữ checkout tạo đơn theo đúng customerId của Web Tổng.

### Mức xác nhận lại với AI-app

1. Xác nhận Web Tổng không còn xử lý `basic` cho nhánh tích hợp này.
2. Xác nhận 6 product Standard/Premium ở trên là source of truth hiện hành.
3. Xác nhận giá hiện hành đúng như mục 3.3.
4. Xác nhận verify trả đúng `planCode`, `billingCycle`, `expiresAt`, `customerId`, `features`, `grace`.

## 6. Tiêu chí nghiệm thu giữa hai bên

Được xem là khớp hoàn toàn khi:

1. User login cùng 1 tài khoản Web Tổng trên webapp và desktop app.
2. User tạo đơn Standard/Premium từ AI-app và Web Tổng nhận đúng customerId.
3. Sau thanh toán, app chưa mở trả phí ngay.
4. User nhập key hợp lệ, AI-app verify thành công và mở đúng gói.
5. Giá hiển thị trên AI-app trùng catalog Web Tổng.
6. Không còn bất kỳ nhánh tích hợp nào phụ thuộc vào Basic.

## 7. Kết luận gửi Web Tổng

Phía AI-app đã chốt kiến trúc tích hợp mới và đã triển khai xong ở phía mình.

Đề nghị Web Tổng bám theo đúng các mục trong báo cáo này để hai bên đồng bộ một nguồn sự thật duy nhất cho:

- tài khoản dùng chung
- giá gói
- checkout
- key activation
- feature gating

Nếu Web Tổng xác nhận đầy đủ các mục trên, AI-app có thể chuyển sang test end-to-end chính thức ngay.