# AI-app da update theo thong bao IT - 2026-04-23

Tai lieu tham chieu IT gui: `f:\web_Sales_Total\WEB_TONG_UPDATE_DEV_20260423.md`

## 1. Da cap nhat theo endpoint moi

App da duoc sua de theo dung thong bao IT:

- Khong dung luong cu `/api/auth/customer/login` cua web de tao bridge session nua.
- Backend AI-app da chuyen sang goi endpoint moi:
  - `POST /api/ai-app/customer/auth`
- Header `x-ai-app-key` van duoc giu server-side, khong lo ra frontend.

## 2. Da xu ly case tai khoan Google chua co mat khau

Theo thong bao IT, khi upstream tra:

```json
{
  "ok": false,
  "needsPassword": true,
  "message": "Tai khoan nay dang nhap bang Google..."
}
```

AI-app hien da xu ly dung:

- Khong hien message kieu "sai mat khau"
- Hien thong bao huong dan dung noi dung tu upstream
- Hien nut mo Web Tong de user vao reset mat khau
- Sau khi dat mat khau tren web, user co the quay lai app login bang email + password

## 3. Thay doi ky thuat da ap dung

### Backend

- `backend/src/services/WebSalesTotalService.ts`
  - them method auth customer qua `/api/ai-app/customer/auth`
- `backend/src/services/WebTotalBridgeSessionService.ts`
  - doi bridge session tu cookie-web sang customer session cua AI-app
  - snapshot hien tra ve customer + licenses
- `backend/src/controllers/authBridgeController.ts`
  - pass through field `needsPassword: true` ve frontend

### Frontend

- `src/shared/services/webTotalBridge.ts`
  - them `BridgeLoginError`
  - parse `needsPassword`
- `src/modules/student/pages/PricingPage.tsx`
  - hien message huong dan reset password
  - them nut mo `https://www.ungdungthongminh.shop`

## 4. Xac thuc

- Backend build thanh cong
- Frontend build thanh cong

## 5. Phan chua xac thuc end-to-end

Do khong co tai khoan Google test/OTP trong workspace, AI-app chua the tu xac nhan thuc te 3 buoc sau:

1. Login gap `needsPassword: true`
2. Reset mat khau tren web
3. Login lai thanh cong

Code da san sang cho flow nay.
