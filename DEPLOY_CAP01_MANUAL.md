# Deploy Cấp 01 lên VPS - Hướng dẫn thủ công

## Tóm tắt trạng thái hiện tại

- **DNS:** `app.hochungkhoi.site` → Cloudflare proxy (104.21.59.100) → Origin VPS 140.245.202.65
- **Proxy:** 🟠 Cam (BẬT)
- **/lop-06/:** ✅ Hoạt động tốt
- **/cap-01/:** ❌ Chưa deploy (404)

---

## Bước 1: Xác nhận Cloudflare Dashboard

Vào https://dash.cloudflare.com → chọn domain `hochungkhoi.site`

### 1.1 DNS Records
- Tab **DNS** → **Records**
- Tìm record `app` (Type A)
- **IPv4 address:** Phải là `140.245.202.65`
- **Proxy status:** 🟠 Cam (Proxied)

### 1.2 SSL/TLS
- Tab **SSL/TLS** → **Overview**
- **Encryption mode:** Phải là **Full** hoặc **Full (strict)**
- ❌ Không chọn **Flexible**

### 1.3 Rules (quan trọng!)
- Tab **Rules** → **Redirect Rules**
- Tìm xem có rule nào cho `app.hochungkhoi.site` redirect sang Vercel không
- Nếu có → **XÓA** hoặc **TẮT**

- Tab **Rules** → **Page Rules** (cũ)
- Kiểm tra tương tự, xóa nếu có redirect sang Vercel

---

## Bước 2: Build Cấp 01

Trên máy local (Windows):

```powershell
cd F:\1_A_Disk_D\Tool\hoc-tap-cap-02\CAp_01
npm run build
```

Sau build, thư mục `dist/` chứa file Cấp 01.

---

## Bước 3: Copy file lên VPS

### Cách 1: SCP (nếu có SSH key)
```bash
# Trên máy local (Git Bash hoặc PowerShell with OpenSSH)
scp -r F:/1_A_Disk_D/Tool/hoc-tap-cap-02/CAp_01/dist/* root@140.245.202.65:/var/www/apps/cap-01/
```

### Cách 2: FileZilla/SFTP
1. Mở FileZilla
2. Host: `sftp://140.245.202.65`
3. User: `root` (hoặc user có quyền)
4. Password: [mật khẩu VPS]
5. Copy thư mục `dist/` → `/var/www/apps/cap-01/`

### Cách 3: Rsync
```bash
rsync -avz --delete F:/1_A_Disk_D/Tool/hoc-tap-cap-02/CAp_01/dist/ root@140.245.202.65:/var/www/apps/cap-01/
```

---

## Bước 4: SSH vào VPS và cấu hình

```bash
ssh root@140.245.202.65
```

### 4.1 Tạo thư mục và copy file
```bash
mkdir -p /var/www/apps/cap-01
# (File đã copy từ bước 3)
ls -la /var/www/apps/cap-01/
```

### 4.2 Sửa Nginx Config
```bash
nano /etc/nginx/sites-available/app.hochungkhoi.site
```

Thêm vào trong block `server { ... }`:

```nginx
    # Cấp 01 location
    location /cap-01/ {
        alias /var/www/apps/cap-01/;
        index index.html;
        try_files $uri $uri/ /cap-01/index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
```

**Lưu ý:** Phải thêm location này **không đè lên** location `/lop-06/`

### 4.3 Test và Reload Nginx
```bash
nginx -t
systemctl reload nginx
```

### 4.4 Kiểm tra local trên VPS
```bash
curl -I http://localhost/cap-01/
curl -I http://localhost/lop-06/
```

Cả 2 phải trả về `200 OK`

---

## Bước 5: Purge Cloudflare Cache

### Cách 1: Dashboard (dễ nhất)
1. Vào https://dash.cloudflare.com
2. Chọn domain → **Caching** → **Configuration**
3. **Purge Everything** (nếu muốn purge toàn bộ)
4. Hoặc **Custom Purge**:
   - Nhập URL: `app.hochungkhoi.site/cap-01/*`
   - Nhấn **Purge**

### Cách 2: API (nếu có token)
```bash
# Lấy Zone ID
export CF_TOKEN="your_api_token"
curl -X GET "https://api.cloudflare.com/client/v4/zones?name=hochungkhoi.site" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -H "Content-Type: application/json"

# Purge cache
export ZONE_ID="your_zone_id"
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://app.hochungkhoi.site/cap-01/*"]}'
```

---

## Bước 6: Kiểm tra sau deploy

### 6.1 Test public URLs
```bash
curl -I https://app.hochungkhoi.site/cap-01/
curl -I https://app.hochungkhoi.site/lop-06/
```

Kết quả mong đợi:
- `/cap-01/` → `200 OK`
- `/lop-06/` → `200 OK` (không bị ảnh hưởng)

### 6.2 Test trên browser
- Mở: `https://app.hochungkhoi.site/cap-01/`
- Kiểm tra DevTools → Network:
  - `cf-cache-status: HIT` hoặc `DYNAMIC` (OK)
  - Không có `x-vercel-*` headers

---

## Báo cáo Deploy

Copy template và điền kết quả:

```markdown
## Deploy Cấp 01 Report - [Ngày/Giờ]

### Cloudflare Dashboard Check
- [ ] DNS A record: app → 140.245.202.65
- [ ] Proxy: 🟠 Cam
- [ ] SSL/TLS: Full/Full strict
- [ ] Không có redirect rule sang Vercel

### VPS Deploy
- [ ] File copied to /var/www/apps/cap-01/
- [ ] Nginx location /cap-01/ added
- [ ] Nginx test passed (nginx -t)
- [ ] Nginx reloaded

### Cache Purge
- [ ] Purged app.hochungkhoi.site/cap-01/*

### Final Test
- [ ] https://app.hochungkhoi.site/cap-01/ → 200 OK
- [ ] https://app.hochungkhoi.site/lop-06/ → 200 OK
- [ ] Không có Vercel headers
```

---

## Troubleshooting

| Lỗi | Nguyên nhân | Cách fix |
|-----|-------------|----------|
| 502 Bad Gateway | Nginx không connect được backend | Kiểm tra Nginx error log: `tail -f /var/log/nginx/error.log` |
| 521/522/523 | Origin VPS unreachable | Kiểm tra VPS đang chạy, firewall cho phép port 80/443 |
| 404 Not Found | File chưa copy đúng chỗ | Kiểm tra `/var/www/apps/cap-01/` có `index.html` không |
| Vẫn thấy bản cũ | Cloudflare cache | Purge cache hoặc đợi TTL |
| HTTPS lỗi chứng chỉ | SSL mode = Flexible | Đổi sang Full hoặc Full strict |
