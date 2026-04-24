# Dac ta kiem soat truy cap va phan goi - 2026-04-23

## 1. Muc tieu

Tai lieu nay chot 2 viec:

1. Xac dinh chinh xac man hinh nao duoc mo/khoa theo `Free`, `Standard`, `Premium`.
2. Dinh nghia ro 2 che do build:
   - `public`: bat buoc login Web Tong
   - `local test`: bo qua login de test noi bo

Phai dam bao 2 che do nay khong lan nhau.

## 2. Nguyen tac nghiep vu bat buoc

### 2.1 Ban public

- Khi chua login Web Tong: khong duoc vao app hoc tap day du.
- Khi chua login: chi hien man hinh chao/landing + nut dang nhap + nut xem bang gia.
- Khi da login nhung chua co key tra phi: chi duoc dung tinh nang `Free`.
- Khi da login va co key hop le:
  - `Standard`: mo cac tinh nang Standard.
  - `Premium`: mo Standard + cac phan Premium.
- Mua goi tra phi phai tro ve Web Tong.
- Sau khi thanh toan xong, tai khoan van o `Free` cho toi khi nhap key hop le.

### 2.2 Ban local test

- Khong bat buoc login.
- Duoc dung de test noi bo, sua du lieu, demo nhanh.
- Khong duoc dung de phat hanh cho user.
- Ten build, artifact, va brand phai khac ro rang voi ban public.

## 3. Hien trang code da co

### 3.1 Da co

- Dang nhap bridge Web Tong bang `email + password`.
- Tao don hang Web Tong tu app.
- Verify key that qua backend proxy.
- Logic `login xong van Free, key moi mo goi tra phi` da co trong trang gia.
- Da co co build noi bo: `VITE_INTERNAL_BUILD=true` qua script `build:noibo`.

### 3.2 Chua co

- Chua co global route guard bat login cho ban public.
- Chua co app shell rieng cho `guest/public`.
- Chua co gate dong bo tren tung route/tung man hinh.
- Chua enforce gioi han `so profile` theo goi.
- Chua phan tach day du `theme/badge/analytics/curriculum` giua Standard va Premium.

## 4. Ma tran man hinh theo goi

Quy uoc:

- `Guest`: chua login Web Tong
- `Free`: da login, chua co key tra phi
- `Standard`: da login, key Standard hop le
- `Premium`: da login, key Premium hop le
- `Internal`: chi danh cho noi bo/admin

| Route | Man hinh | Guest | Free | Standard | Premium | Ghi chu |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | Trang chu | Landing-only | Mo | Mo | Mo | Ban public phai tach `guest home` va `app home` |
| `/subjects` | Mon hoc | Khoa | Mo gioi han 1 mon | Mo tat ca | Mo tat ca | Free chi duoc 1 mon |
| `/lessons` | Danh sach bai | Khoa | Mo gioi han 1 lop, 1 mon | Mo tat ca | Mo tat ca | Can loc data theo plan |
| `/lessons/:lessonId` | Chi tiet bai hoc | Khoa | Mo neu bai thuoc pham vi Free | Mo | Mo | Can chan truy cap bai ngoai goi |
| `/lessons/:lessonId/practice` | Luyen tap | Khoa | Mo neu bai thuoc Free | Mo | Mo | Can chan theo bai |
| `/lessons/:lessonId/result` | Ket qua | Khoa | Mo | Mo | Mo | Theo bai da hoc |
| `/quiz` | Trac nghiem | Khoa | Mo co ban | Mo | Mo | Free muc co ban |
| `/progress` | Tien do | Khoa | Mo co ban | Mo | Mo chi tiet hon neu co Premium |
| `/badges` | Huy hieu | Khoa | Mo co ban | Mo | Mo + badge doc quyen | Premium doc quyen chua co field enforce |
| `/leaderboard` | Bang xep hang | Khoa | Mo | Mo | Mo | |
| `/match-game` | Ghep cap | Khoa | Mo | Mo | Mo | Nam trong Free feature list |
| `/mini-games` | Kho mini-game | Khoa | Mo mot phan | Mo | Mo | Can xac dinh mini-game nao free |
| `/mini/word-scramble` | Xep chu | Khoa | Mo | Mo | Mo | De xuat Free |
| `/mini/speed-quiz` | Trac nhanh | Khoa | Mo | Mo | Mo | De xuat Free |
| `/mini/true-false` | Dung/Sai | Khoa | Mo | Mo | Mo | De xuat Free |
| `/mini/fill-blank` | Dien cho trong | Khoa | Mo | Mo | Mo | De xuat Free |
| `/mini/quick-math` | Toan nhanh | Khoa | Mo | Mo | Mo | De xuat Free |
| `/mini/pre-grade` | Game lop truoc | Khoa | Mo | Mo | Mo | De xuat Free |
| `/daily` | Thu thach hang ngay | Khoa | Khoa | Mo | Mo | Gan voi `dailyChallenges=true` |
| `/drawing` | Ve | Khoa | Mo | Mo | Mo | Chua co rang buoc goi |
| `/achievements` | Thanh tich | Khoa | Mo co ban | Mo | Mo | Premium co the them nhan doc quyen sau |
| `/tts-settings` | Giong doc | Khoa | Hien UI nhung khoa TTS premium | Mo | Mo | Gan voi `ttsVoice=true` |
| `/ai-settings` | Cai dat AI | Khoa | Mo co ban | Mo | Mo | Neu AI tra phi thi can tach them |
| `/memory` | Phong tri nho | Khoa | Khoa | Mo | Mo | Gan voi `memoryRoom=true` |
| `/avatar-shop` | Cua hang avatar | Khoa | Khoa | Mo | Mo | Gan voi `avatarShop=true` |
| `/competition` | Thi dau | Khoa | Khoa | Mo | Mo | Gan voi `competition=true` |
| `/pwa` | Ngoai tuyen | Khoa | Hien UI nhung khoa tai/offline premium | Mo | Mo | Gan voi `offlineMode=true` |
| `/smart-review` | On tap thong minh | Khoa | Khoa | Mo | Mo | Gan voi `smartReview=true` |
| `/curriculum` | Khung chuong trinh | Khoa | Mo xem | Mo | Mo + tuy chinh | Tuy chinh Premium chua co enforce |
| `/learning-assistant` | Tro ly hoc tap | Khoa | Mo co ban | Mo | Mo | Neu can co the tach nang cao sau |
| `/profiles` | Ho so hoc sinh | Khoa | Mo toi da 1 | Mo toi da 3 | Mo toi da 5 | Bat buoc enforce create/edit |
| `/pricing` | Goi dich vu | Mo | Mo | Mo | Mo | Trang cong khai |
| `/analytics` | Phan tich | Khoa | Mo co ban | Mo | Mo chi tiet | Premium chi tiet chua co field enforce |
| `/parent` | Bang phu huynh | Khoa | Khoa | Mo | Mo | Gan voi `parentDashboard=true` |
| `/data` | Du lieu | Khoa | Hien UI nhung khoa export | Mo | Mo | Gan voi `exportData=true` |
| `/themes` | Giao dien | Khoa | Mo 6 theme free | Mo them theme | Mo theme doc quyen | Can them metadata tier cho theme |
| `/admin` | Quan tri | Internal | Internal | Internal | Internal | Khong thuoc luong user |

## 5. Danh sach khoa ngay trong dot 1

Day la nhom phai khoa ngay vi da co mapping ro trong `PRICING_PLANS.limits`:

- `/daily`
- `/memory`
- `/avatar-shop`
- `/competition`
- `/smart-review`
- `/parent`
- `/profiles` theo gioi han so luong
- `/tts-settings` theo quyen TTS
- `/pwa` theo quyen offline
- `/data` theo quyen export

## 6. Khac biet Standard va Premium

### 6.1 Co the enforce ngay

- `profiles`
  - Free: 1
  - Standard: 3
  - Premium: 5
- `prioritySupport`
  - Chi Premium
  - Hien tai moi dung de hien thi UI/nhan, chua co luong ho tro thuc te

### 6.2 Chua the enforce vi code chua co metadata/flag

- Cap nhat noi dung som
- Badge doc quyen
- Theme doc quyen
- Bao cao tien bo chi tiet
- Tuy chinh giao trinh

Ket luan: Standard/Premium hien moi khac nhau chac chan o `so profile` va `prioritySupport`. Cac muc con lai phai bo sung metadata truoc khi khoa that.

## 7. Dac ta trien khai public bat login

### 7.1 Kien truc tong quan

Ban public phai co 3 trang thai ung dung:

1. `guest`
   - Chua co `bridgeToken`
   - Chi hien landing/login/pricing

2. `logged_in_free`
   - Co `bridgeToken`
   - Chua co paid activation hop le
   - Duoc dung nhom Free

3. `logged_in_paid`
   - Co `bridgeToken`
   - Co key active hop le
   - Duoc dung Standard hoac Premium tuy theo key

### 7.2 App shell de xuat

- `GuestLayout`
  - Chi co chao mung
  - Dang nhap Web Tong
  - Xem bang gia
  - Giai thich Free/Standard/Premium

- `AppLayout`
  - Chi render khi da login
  - Sidebar, GlobalGradeSelector, page content, mascot panel

### 7.3 Route guard bat buoc

Them 2 lop guard:

#### A. LoginGuard

- Neu `VITE_INTERNAL_BUILD !== true` va khong co `bridgeToken`:
  - chan toan bo routes hoc tap
  - redirect ve `/welcome` hoac `/pricing`

#### B. FeatureGuard

- Sau khi da login, moi route goi premium phai check theo plan/feature.
- Neu khong du quyen:
  - khong render page chinh
  - hien `LockedFeaturePage`
  - co nut `Mua key tren Web Tong`
  - co nut `Nhap key`

### 7.4 Nguon su that ve quyen

Trong ban public, thu tu uu tien:

1. `bridgeToken` xac dinh da login hay chua
2. `verifyLicenseKey()` + `fetchAndCacheLicenses()` xac dinh quyen paid
3. `getCurrentPlan()` chi la local mirror de UI render nhanh, khong duoc coi la nguon su that duy nhat

### 7.5 Rule bat buoc cho user flow

- Guest bam vao route bi khoa => redirect landing/login
- User login xong => vao `Free`
- User bam tinh nang Standard/Premium => hien khoa + dan sang Web Tong mua key
- User thanh toan xong => van `Free`
- User nhap key hop le => mo goi dung theo key

## 8. Dac ta trien khai local test bo qua login

### 8.1 Dinh danh build

Ban local test phai giu cac dac diem sau:

- Bat buoc build voi `VITE_INTERNAL_BUILD=true`
- App title phai co hau to `_NoiBo`
- Artifact ten khac ban public
- Icon/branding neu co nen khac mau hoac co nhan `Noi bo`

Hien tai script da co:

- `npm run build:noibo`
- `npm run package:noibo`

### 8.2 Rule runtime

Neu `VITE_INTERNAL_BUILD=true`:

- bo qua `LoginGuard`
- bo qua `FeatureGuard`
- cho phep vao app day du
- co nhan canh bao ro rang tren UI: `Ban noi bo - bo qua login va phan quyen`

### 8.3 Rule release

- Tuyet doi khong deploy ban `NoiBo` len domain public
- Pipeline public phai fail neu phat hien `VITE_INTERNAL_BUILD=true`
- Pipeline public phai fail neu `productName` hoac artifact con chu `NoiBo`

## 9. Cach de 2 ban khong lan nhau

Bat buoc dung dong thoi 5 lop tach biet:

1. Khac bien moi truong
   - public: `VITE_INTERNAL_BUILD=false`
   - local test: `VITE_INTERNAL_BUILD=true`

2. Khac ten app
   - public: ten binh thuong
   - local test: co nhan `NoiBo`

3. Khac artifact/package name
   - local test khong trung ten file public

4. Khac banner runtime
   - local test hien nhan canh bao ro rang trong UI

5. Khac pipeline release
   - build public khong cho phep dung script noi bo

## 10. Thu tu trien khai de xuat

### Dot 1 - khoa dung nghiep vu

1. Tao `GuestLayout`
2. Them `LoginGuard`
3. Chan toan bo route hoc tap khi chua login
4. Giu `/pricing` la cong khai
5. Tao `LockedFeaturePage`
6. Gate 6 route Standard ro nhat:
   - `/daily`
   - `/memory`
   - `/avatar-shop`
   - `/competition`
   - `/smart-review`
   - `/parent`
7. Enforce gioi han profile theo goi

### Dot 2 - khoa theo kha nang Standard

1. Khoa export trong `/data`
2. Khoa offline trong `/pwa`
3. Khoa TTS trong `/tts-settings`
4. Loc mon/lop/bai hoc theo `Free`

### Dot 3 - tach Standard/Premium ro hon

1. Them metadata tier cho theme
2. Them metadata tier cho badge
3. Tach analytics co ban/chi tiet
4. Them capability cho curriculum customization

## 11. Dinh nghia done

Chi duoc coi la xong khi dap ung du 8 dieu kien:

1. Guest vao app khong the dung tinh nang hoc tap
2. Guest chi thay landing/login/pricing
3. Login xong mac dinh vao Free
4. Standard/Premium khong mo neu chua co key
5. Mua xong nhung chua nhap key van la Free
6. Local test bo qua login va gate, nhung co nhan noi bo ro rang
7. Public build khong the vo tinh dung `VITE_INTERNAL_BUILD=true`
8. Co test thu cong xac nhan 4 truong hop: guest, free, standard, premium

## 12. File nguon tham chieu

- Route definitions: `src/routes/appRoutes.tsx`
- Pricing plans va limits: `src/modules/student/pages/PricingPage.tsx`
- Bridge/license service: `src/shared/services/webTotalBridge.ts`
- License hook: `src/shared/hooks/useLicense.ts`
- Internal build script: `package.json`
