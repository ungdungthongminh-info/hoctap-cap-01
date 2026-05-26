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

### 2.1. Build va CORS
- Frontend: chay `npm run build` tai thu muc goc.
- Backend: chay `npm --prefix backend run build`.
- Xac nhan frontend dang tro dung backend production qua cac bien moi truong/Vercel settings dang dung.
- Xac nhan backend production CORS da cho phep domain web production.

### 2.2. Kiem tra Cloudflare (bat buoc truoc deploy)
Chay workflow `/cloudflare-verify` hoac thu cong:

```bash
# 1. Kiem tra DNS public
nslookup app.hochungkhoi.site 1.1.1.1
nslookup app.hochungkhoi.site 8.8.8.8
# Ket qua: phai thay 140.245.202.65 (hoac IP Cloudflare proxy -> origin la 140.245.202.65)

# 2. Kiem tra khong con Vercel
curl -I https://app.hochungkhoi.site/
curl -I https://app.hochungkhoi.site/lop-06/
# Ket qua: KHONG duoc co header 'server: Vercel' hoac 'x-vercel-*'

# 3. Kiem tra direct VPS
curl -I --resolve app.hochungkhoi.site:80:140.245.202.65 http://app.hochungkhoi.site/lop-06/
curl -I --resolve app.hochungkhoi.site:80:140.245.202.65 http://app.hochungkhoi.site/cap-01/
# Ket qua: phai tra 200 hoac redirect dung
```

**Kiem tra Cloudflare Dashboard:**
- [ ] DNS record `app.hochungkhoi.site` -> A record `140.245.202.65`
- [ ] Proxy: biet ro dang 🟠 Cam (proxy on) hay ⚪ Xam (proxy off)
- [ ] SSL/TLS mode: Full hoac Full strict (khong dung Flexible)
- [ ] Khong co Redirect/Page Rule nao ep sang Vercel

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

### 5.1. Kiem tra Cloudflare sau deploy

```bash
# 1. Kiem tra public (sau deploy)
curl -I https://app.hochungkhoi.site/cap-01/
curl -I https://app.hochungkhoi.site/cap-01/assets/
curl -I https://app.hochungkhoi.site/lop-06/
# Ket qua: /cap-01/ va /lop-06/ phai tra 200
```

**Neu Cloudflare proxy dang bat (🟠 Cam):**
- [ ] Vao Cloudflare Dashboard → Caching → Purge Everything
- [ ] Hoac Custom Purge: `app.hochungkhoi.site/cap-01/*`
- [ ] Kiem tra lai sau 30 giay: `curl -I https://app.hochungkhoi.site/cap-01/`

### 5.2. Kiem tra chuc nang ung dung

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

---

## Phu luc: Bao cao Cloudflare Verify

Copy template nay vao issue/comment khi can bao cao:

```markdown
### Cloudflare Verify Report - [Ngay gio]

**DNS:**
- nslookup 1.1.1.1: [Ket qua]
- nslookup 8.8.8.8: [Ket qua]
- Origin IP dung (140.245.202.65): [Co/Khong]

**Cloudflare Proxy:**
- Status: [🟠 Cam / ⚪ Xam]
- SSL Mode: [Flexible/Full/Full strict]

**Redirect/Page Rules:**
- Co rule nao cho app.hochungkhoi.site: [Co/Khong - mo ta neu co]

**Kiem tra public:**
- /lop-06/: [200/Error]
- /cap-01/: [200/Error]
- /cap-01/assets/: [200/Error]

**Kiem tra direct VPS (bypass Cloudflare):**
- Direct IP /lop-06/: [200/Error]
- Direct IP /cap-01/: [200/Error]

**Cache:**
- Da purge: [Co/Khong]

**Ket luan deploy:**
- [ ] DNS da dung
- [ ] Khong con Vercel headers
- [ ] /cap-01/ public tra 200
- [ ] /lop-06/ khong bi anh huong
- [ ] Da purge cache (neu proxy bat)
```