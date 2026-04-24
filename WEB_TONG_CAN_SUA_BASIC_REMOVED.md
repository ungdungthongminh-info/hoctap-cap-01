AI-app update for Web Tong

Trang thai moi
- Goi Basic da bo khoi pham vi pricing va activation integration.
- Hien tai AI-app chi con 3 muc trong luong tich hop:
  - free
  - standard
  - premium

Nhung gi AI-app da chinh
- Bo Basic khoi giao dien goi dich vu va bang gia tich hop.
- Bo Basic khoi regex key activation.
- Bo Basic khoi danh sach plan hop le khi verify key that.
- API pricing normalized `/api/v1/plans` khong con tra Basic nua.
- Xoa Basic khoi `WEB_TOTAL_PRODUCT_MAP_JSON` trong cau hinh AI-app backend.

Nhung gi Web Tong can sua
1. Khong tra / khong dung Basic trong luong tich hop app-study-12 nua.
2. Catalog va logic ban hang cho app-study-12 chi giu:
   - standard:monthly -> prod-study-month
   - standard:yearly -> prod-study-year
   - standard:lifetime -> prod-study-standard-lifetime
   - premium:monthly -> prod-study-premium-month
   - premium:yearly -> prod-study-premium-year
   - premium:lifetime -> prod-study-premium-lifetime
3. Luong issue key / verify key chi can ho tro:
   - HHK-STANDARD-...
   - HHK-PREMIUM-...
4. Contract verify license can tiep tuc tra on dinh cac field:
   - license.planCode
   - license.billingCycle
   - license.expiresAt
   - license.customerId
   - features
   - grace
5. Gia goc de AI-app dong bo hien tai can lay tu Web Tong cho:
   - Standard: 89.000 / 599.000 / 999.000
   - Premium: 119.000 / 899.000 / 1.599.000

Ghi chu nghiep vu
- Webapp va desktop app deu dang dung chung 1 tai khoan Web Tong.
- Checkout phai tao theo customerId cua Web Tong, khong theo local student id.
- Login chi giu free; key verify thanh cong moi mo Standard/Premium.