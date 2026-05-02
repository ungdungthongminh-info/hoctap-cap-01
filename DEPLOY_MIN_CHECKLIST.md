# Deploy Checklist Toi Thieu

Checklist nay dung de len ban frontend + backend cung mot dot, tranh lech cache va lech luong tai app/audio.

## 1. Chot version va release

- Tang `version` trong `package.json`.
- Cap nhat `public/app-update.json`:
  - `latestVersion` phai trung version release desktop.
  - `publishedAt` phai la thoi diem phat hanh moi.
  - `notes` phai mo ta dung noi dung ban nay.
- Neu co desktop release moi, tao GitHub Release tag theo format `vX.Y.Z` truoc hoac cung luc deploy web.

## 2. Kiem tra truoc deploy

- Frontend: chay `npm run build` tai thu muc goc.
- Backend: chay `npm --prefix backend run build`.
- Xac nhan frontend dang tro dung backend production qua cac bien moi truong/Vercel settings dang dung.
- Xac nhan backend production CORS da cho phep domain web production.

## 3. Thu tu deploy toi thieu

- Deploy backend truoc.
- Sau khi backend song, smoke test nhanh endpoint can cho web:
  - `GET /api/v1/health` neu co.
  - `GET /api/v1/tts/static-pack/by-grade/1`
  - `GET /api/v1/tts/static-pack/by-grade/4`
  - `GET /api/v1/tts/static-pack/by-grade/5`
- Deploy frontend ngay sau do, khong de treo mot ben cu mot ben moi qua lau.

## 4. Chong lech cache frontend

- Khong deploy frontend khi chua build lai ban moi.
- Sau deploy, mo site production bang tab an danh hoac hard refresh.
- Trong DevTools Application:
  - Kiem tra Service Worker da la ban moi.
  - Neu van giu ban cu, bam `Update` roi `Unregister`, sau do tai lai trang.
- Kiem tra `https://hoctap-cap-01.vercel.app/app-update.json` da ra noi dung moi, dac biet la `latestVersion` va `publishedAt`.

## 5. Smoke test production bat buoc

- Nhan nut `Tai app Windows` o trang chu hoac sidebar:
  - Ket qua mong doi: di toi GitHub Releases (`/releases/latest` hoac `/releases/tag/v...`), khong di qua URL anh/metadata cu.
- Vao man `Ngoai tuyen & cap nhat`:
  - Neu bao co ban moi, nut cap nhat phai mo GitHub Release dung.
- Thu dong bo `Tai goi tieng doc day du (moi lop)` tren web.
- Mo bai hoc lop 1, 4, 5 va nghe thu de xac nhan audio khong con loi theo lop.

## 6. Neu production van hien ban cu

- Kiem tra Vercel deployment moi nhat da dung commit chua.
- Kiem tra CDN/browser cache bang tab an danh va hard refresh.
- Kiem tra service worker co dang phuc vu asset cu khong.
- Kiem tra backend production co dung ban da mo CORS/domain va route proxy audio moi khong.