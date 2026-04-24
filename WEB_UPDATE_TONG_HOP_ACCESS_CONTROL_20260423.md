# Bao cao tong hop de Web cap nhat - Access control va login policy

Ngay cap nhat: 2026-04-23

## 1. Muc tieu da trien khai ben app

App da duoc cap nhat theo huong sau:

- Ban public khong cho user chua login vao toan bo he thong hoc tap.
- Guest chi con thay man hinh chao va trang goi dich vu.
- Sau khi login Web Tong, user vao goi Free mac dinh.
- Standard/Premium khong mo tu login, chi mo khi nhap dung key kich hoat.
- Local test build duoc tach rieng va bo qua login/gate bang `VITE_INTERNAL_BUILD=true`.

## 2. Nhung gi da thay doi ben app

### 2.1 Guest flow

- Route `/` hien la man hinh chao guest.
- Guest khong con vao duoc app chinh neu chua login Web Tong.
- Guest duoc phep vao `/pricing` de dang nhap, mua goi, nhap key.

### 2.2 Login gate

- Toan bo route hoc tap da duoc dat sau `LoginGuard`.
- Neu khong co bridge session hop le thi redirect ve `/`.

### 2.3 Feature gate cho goi Standard

Da khoa 6 route sau neu user moi o goi Free:

- `/daily`
- `/memory`
- `/avatar-shop`
- `/competition`
- `/smart-review`
- `/parent`

Khi bi khoa, app hien man hinh thong bao + nut:

- Mua key tren Web Tong
- Nhap key / quan ly goi

### 2.4 Gioi han ho so hoc sinh theo goi

Da enforce tren app:

- Free: toi da 1 ho so
- Standard: toi da 3 ho so
- Premium: toi da 5 ho so

Neu da dat gioi han, app khong cho tao them ho so va hien thong bao nang cap goi.

### 2.5 Internal/local test build

- Ban noi bo duoc danh dau ro tren UI.
- Ban noi bo bo qua login va gate de test local.
- Khong duoc dung cho phat hanh public.

## 3. File code chinh da cap nhat

- `src/routes/appRoutes.tsx`
- `src/shared/components/AccessGuard.tsx`
- `src/shared/services/accessControl.ts`
- `src/modules/student/pages/WelcomePage.tsx`
- `src/modules/student/pages/ProfileSwitcherPage.tsx`
- `src/shared/components/AppLayout.tsx`
- `src/shared/components/Sidebar.tsx`

## 4. Tac dong den phia Web Tong

Phia Web can nam ro cac quy tac moi sau:

### 4.1 Login khong con dong nghia voi mo goi tra phi

- Login Web Tong chi de xac dinh customer chung giua webapp va desktop.
- Login thanh cong => vao Free.
- Standard/Premium chi mo bang key hop le.

### 4.2 Mua goi tren Web Tong chua du

- Sau khi thanh toan thanh cong ben Web Tong, app khong auto-upgrade goi.
- User van la Free cho toi khi nhap dung key.

### 4.3 Man hinh bi khoa tren app se dan user ve Web Tong

Khi user bam vao tinh nang Standard/Premium trong app ma chua co key, app se dan user sang Web Tong qua trang goi dich vu de mua key/quan ly goi.

## 5. Nhung gi phia Web can dam bao

### Bat buoc

1. Luong dang nhap Web Tong phai on dinh de app lay duoc bridge session.
2. Luong mua goi phai tao ra key hop le cho dung customer.
3. Verify key phai tiep tuc tra dung:
   - `planCode`
   - `billingCycle`
   - `expiresAt`
   - `customerId`
   - `features`
4. Trang goi/don hang tren Web Tong phai ro rang rang:
   - login chi vao Free
   - muon mo Standard/Premium phai co key

### Can theo doi them

1. Case tai khoan dang nhap bang Google nhung khong co password van chua duoc giai quyet tren app bridge hien tai.
2. Neu Web Tong muon ho tro social login cho app, can them luong OAuth/callback hoac cho tai khoan social dat password rieng.

## 6. Ket qua xac thuc sau thay doi

- Frontend build thanh cong.
- Route public va app route da duoc tach.
- Standard route gate da duoc noi vao router.
- Gioi han profile da duoc enforce theo goi.

## 7. Ket luan gui Web

Phia app da chuyen sang mo hinh truy cap dung theo nghiep vu:

- Guest -> chi thay welcome/pricing
- Login -> vao Free
- Mua goi -> van Free cho den khi nhap key
- Nhap key hop le -> mo Standard/Premium

Web Tong can tiep tuc coi key la dieu kien duy nhat de mo goi tra phi, khong coi login la kich hoat goi.
