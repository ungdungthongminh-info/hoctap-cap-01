# De xuat gui Web tong: mo hinh key/app-license cho he sinh thai nhieu app

## Boi canh
He sinh thai hien tai khong chi co 1 app ma se co nhieu app desktop/webapp/admin khac nhau. Neu tat ca quyen su dung chi duoc bieu dien bang account + entitlement chung, thi ve van hanh se gap mot so van de khi so luong app tang len.

Muc tieu cua de xuat nay khong phai quay lai mo hinh "key thu cong, tach roi auth/payment" nhu cu, ma la bo sung mot lop `app-license/key` duoc Web tong quan ly tap trung, de cac app co mot don vi kich hoat ro rang hon.

## Van de neu khong chia theo key
### 1. Kho quan ly khi 1 customer mua nhieu app
Mot customer co the mua:
- app ôn tập khối cấp 01 và Tiền Tiểu học
- app ôn tập khối cấp 02
- app AI writing
- goi top-up hoac add-on rieng

Neu chi dua vao account + entitlement tong, app desktop se kho biet:
- quyen nao thuoc app nao
- goi nao dang duoc kich hoat tren may nao
- nguoi dung dang dung "quyen mua" hay "quyen da kich hoat"

### 2. Desktop can mot don vi kich hoat ro rang
Voi desktop, tinh huong thuc te la:
- nguoi dung doi may
- nguoi dung mat mang
- can support thu hoi/kich hoat lai
- can co offline grace mode

Chi dung account/session la chua du. Desktop can 1 don vi de dai dien cho license da kich hoat tren thiet bi, va key/app-license la don vi hop ly nhat.

### 3. Kho support va doi soat
Khi CSKH can xu ly, ho thuong can tra loi nhanh:
- don hang nao da phat hanh quyen gi
- key/licnese nao da duoc cap
- key nao dang active
- key nao dang bind o may nao
- key nao bi khoa, hoan tien, het han

Neu khong co lop key/license tach bach, viec tra cuu se rat kho khi nhieu app cung dung chung mot account.

### 4. Kho mo rong cho reseller, gift, bundle
Sau nay co the co nhu cau:
- tang key khuyen mai
- reseller ban lai
- bundle 1 don -> nhieu app-license
- corporate cap nhieu seat

Mo hinh chi co entitlement se kho bieu dien cac nghiep vu nay mot cach ro rang.

## De xuat mo hinh dung
Khong bo mo hinh account + entitlement. Thay vao do, de xuat mo hinh 3 lop:

1. `Account`
- danh tinh customer trung tam
- login, profile, lich su mua hang

2. `Entitlement`
- quyen thuong mai cap cao
- customer da mua app nao, goi nao, thoi han nao
- day van la nguon su that business

3. `App License / Key`
- don vi kich hoat de app desktop/webapp su dung
- duoc phat hanh tu order/entitlement
- co trang thai: inactive, active, suspended, expired, revoked
- co the gan voi deviceId, activatedAt, expiresAt, lastSeenAt

Noi ngan gon:
- `Entitlement` tra loi: khach co quyen gi
- `Key/App-license` tra loi: quyen do da duoc cap va dang duoc dung ra sao

## Quan diem de xuat
De xuat cua phia app la:
- khong nen bo key hoan toan
- cung khong nen de tung app tu sinh key rieng ngoai he thong
- nen de Web tong phat hanh va quan ly `app-license/key` tap trung theo tung app

Nghia la key van thuoc Web tong, khong thuoc rieng tung app.

## Mo hinh van hanh de xuat
### A. Sau thanh toan
1. Customer thanh toan order tren Web tong.
2. Web tong tao entitlement cho app/product tuong ung.
3. Web tong dong thoi phat hanh 1 hoac nhieu `app-license/key` cho order do.
4. App desktop co the doc danh sach license/key cua customer qua API.

### B. Khi dang nhap app
1. App dang nhap bang account trung tam.
2. App goi `auth/me` + `customer snapshot`.
3. App lay danh sach license/key cua rieng app do.
4. App kich hoat/bind key voi device neu can.
5. App mo tinh nang dua tren `entitlement + license state`.

### C. Khi offline
- App cho phep dung trong thoi gian grace ngan dua tren license da verify gan nhat.
- Khi online lai, app re-verify voi Web tong.

## Loi ich cua mo hinh nay
### Doi voi Web tong
- van giu duoc single source of truth
- de tra cuu support
- de mo rong bundle/reseller/gift seat
- de thong ke theo app, theo key, theo device

### Doi voi app
- de lam desktop activation
- de lam device binding
- de lam offline grace mode
- de gioi han tinh nang theo goi mot cach ro rang hon

### Doi voi nguoi dung
- de hieu hon: mua gi, duoc cap gi, dang dung tren may nao
- de thao tac cap lai khi doi may

## De xuat ky thuat toi thieu cho Web tong
Neu Web tong dong y huong nay, de xuat bo sung 1 nhom API/du lieu toi thieu:

### 1. License model
Moi license/key nen co cac truong:
- id
- key
- appId
- productId
- planId
- billingCycle
- customerId
- orderId
- status
- activatedAt
- expiresAt
- deviceId
- deviceName
- lastVerifiedAt
- metadata

### 2. API toi thieu
- `GET /api/customer/licenses?appId=...`
- `POST /api/licenses/:licenseId/activate`
- `POST /api/licenses/:licenseId/verify`
- `POST /api/licenses/:licenseId/deactivate`
- `GET /api/licenses/:licenseId`

Neu chua muon mo public API day du, co the cho desktop app di qua backend bridge truoc.

## De xuat compromise
Neu phia Web tong lo ngai mo hinh key lam he thong phuc tap hon, co the di theo lo trinh 2 buoc:

### Phase 1
- giu auth + order + entitlement nhu hien tai
- bo sung `app-license record` noi bo tren Web tong
- chua can mo full API cho tat ca app

### Phase 2
- mo API tra license/key theo app
- ho tro device binding va verify
- app desktop chuyen sang dung entitlement + license state day du

## Ket luan
Voi he sinh thai nhieu app, quan diem cua phia app la:
- chi dung account + entitlement la chua du cho desktop va van hanh quy mo lon
- khong nen de tung app tu quan ly key rieng
- nen de Web tong quan ly tap trung them lop `app-license/key` theo tung app

De xuat nay giu nguyen huong centralization cua Web tong, nhung bo sung them don vi van hanh can thiet de:
- support nhieu app
- support desktop activation
- support device binding
- support offline grace mode
- support CSKH/doi soat sau nay

## Thong diep ngan gon co the gui kem
"Ben app dong y lay Web tong lam nguon su that cho auth, payment va entitlement. Tuy nhien, voi he sinh thai nhieu app, ben em de xuat Web tong van nen quan ly tap trung them lop app-license/key theo tung app. Nhu vay van giu duoc centralization, nhung se de hon cho desktop activation, device binding, offline grace mode, support tra cuu va mo rong sau nay. Ben em khong de xuat moi app tu quan ly key rieng, ma de xuat Web tong phat hanh va quan ly key/license tap trung."