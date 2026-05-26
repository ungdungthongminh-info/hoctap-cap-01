---
description: Kiểm tra Cloudflare trước và sau deploy Cấp 01
---

# Cloudflare Verification Workflow

Workflow này kiểm tra DNS, proxy, SSL và cache Cloudflare để đảm bảo deploy Cấp 01 không bị lỗi do cấu hình Cloudflare.

## 1. Kiểm tra DNS public (trước deploy)

```bash
nslookup app.hochungkhoi.site 1.1.1.1
nslookup app.hochungkhoi.site 8.8.8.8
```

**Kết quả cần thấy:**
- `app.hochungkhoi.site` trỏ về `140.245.202.65`
- Nếu qua Cloudflare proxy (IP khác), phải xác nhận trong Cloudflare DNS record là origin IP = `140.245.202.65`

## 2. Kiểm tra app domain đang về VPS hay Vercel (trước deploy)

```bash
curl -I https://app.hochungkhoi.site/
curl -I https://app.hochungkhoi.site/lop-06/
```

**Kết quả cần thấy:**
- Không có header/server liên quan Vercel (ví dụ: `server: Vercel`, `x-vercel-*`)
- Nếu thấy Vercel headers → DNS Cloudflare vẫn sai, chưa trỏ về VPS

## 3. Kiểm tra trực tiếp origin VPS (bỏ qua Cloudflare)

```bash
curl -I --resolve app.hochungkhoi.site:80:140.245.202.65 http://app.hochungkhoi.site/lop-06/
curl -I --resolve app.hochungkhoi.site:80:140.245.202.65 http://app.hochungkhoi.site/cap-01/
```

**Kết quả mong đợi:**
- Cả 2 cần trả `200 OK` hoặc redirect đúng (301/302)
- Nếu lỗi 4xx/5xx → VPS chưa cấu hình đúng, fix trước khi deploy

## 4. Sau khi deploy Cấp 01 - Kiểm tra public

```bash
curl -I https://app.hochungkhoi.site/cap-01/
curl -I https://app.hochungkhoi.site/cap-01/assets/
curl -I https://app.hochungkhoi.site/lop-06/
```

**Kết quả mong đợi:**
- `/cap-01/` → 200 OK (hoặc 304)
- `/cap-01/assets/` → 200 hoặc redirect đúng
- `/lop-06/` → 200 OK (không bị ảnh hưởng bởi deploy)

## 5. Kiểm tra Cloudflare Dashboard (nếu proxy đang bật - màu cam)

Vào [Cloudflare Dashboard](https://dash.cloudflare.com) → Domain → DNS:

| Kiểm tra | Yêu cầu |
|----------|---------|
| DNS record `app.hochungkhoi.site` | A record trỏ về `140.245.202.65` |
| Proxy status | 🟠 Cam (proxy bật) hoặc ⚪ Xám (proxy tắt) đều được, nhưng phải biết đang dùng cái nào |
| SSL/TLS mode | **Full** hoặc **Full (strict)** - không dùng Flexible |
| Redirect/Page Rules | Không có rule nào ép `app.hochungkhoi.site` redirect sang Vercel |

## 6. Purge cache sau deploy (bắt buộc nếu proxy bật)

Nếu Cloudflare proxy đang bật (màu cam):

**Cách 1 - Purge Everything:**
- Cloudflare Dashboard → Caching → Configuration → Purge Everything

**Cách 2 - Purge riêng path:**
- Cloudflare Dashboard → Caching → Configuration → Custom Purge
- Nhập URL: `app.hochungkhoi.site/cap-01/*`
- Nhấn Purge

## Báo cáo kết quả

Copy template sau và điền kết quả:

```markdown
### Cloudflare Verify Report - [Ngày giờ]

**DNS:**
- nslookup 1.1.1.1: [Kết quả]
- nslookup 8.8.8.8: [Kết quả]
- Origin IP đúng: [Có/Không]

**Cloudflare Proxy:**
- Status: [🟠 Cam / ⚪ Xám]
- SSL Mode: [Flexible/Full/Full strict]

**Redirect/Page Rules:**
- Có rule nào cho app.hochungkhoi.site: [Có/Không - mô tả nếu có]

**Kiểm tra public:**
- /lop-06/: [200/Error]
- /cap-01/: [200/Error]
- /cap-01/assets/: [200/Error]

**Kiểm tra direct VPS:**
- Direct IP /lop-06/: [200/Error]
- Direct IP /cap-01/: [200/Error]

**Cache:**
- Đã purge: [Có/Không]
```

## Troubleshooting

| Vấn đề | Nguyên nhân | Cách fix |
|--------|-------------|----------|
| curl vẫn thấy Vercel headers | DNS chưa trỏ về VPS | Kiểm tra lại DNS record trong Cloudflare |
| HTTPS bị lỗi chứng chỉ | SSL mode = Flexible | Đổi sang Full hoặc Full strict |
| 521/522/523 error | Origin VPS không reachable | Kiểm tra VPS/Nginx đang chạy, firewall |
| Deploy xong vẫn thấy bản cũ | Cloudflare cache | Purge cache hoặc đợi TTL hết |
| /cap-01/ 404 nhưng direct VPS OK | Path không tồn tại hoặc chưa sync | Kiểm tra file đã upload lên VPS chưa |
