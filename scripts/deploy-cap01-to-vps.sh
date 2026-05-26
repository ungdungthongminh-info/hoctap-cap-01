#!/bin/bash
# Script deploy Cấp 01 lên VPS
# Chạy trên VPS với quyền sudo

set -e

VPS_IP="140.245.202.65"
DOMAIN="app.hochungkhoi.site"
DEPLOY_DIR="/var/www/apps/cap-01"
NGINX_CONF="/etc/nginx/sites-available/app.hochungkhoi.site"

echo "=== Deploy Cấp 01 to VPS ==="
echo "Date: $(date)"
echo ""

# 1. Tạo thư mục deploy
echo "[1/6] Tạo thư mục $DEPLOY_DIR..."
sudo mkdir -p $DEPLOY_DIR
sudo chown -R $USER:$USER $DEPLOY_DIR

# 2. Giải nén/Coppy file build (giả sử file đã upload lên /tmp)
echo "[2/6] Copy files vào $DEPLOY_DIR..."
# TODO: Thay bằng lệnh copy thực tế từ nơi upload file
# Ví dụ: sudo cp -r /tmp/cap-01-build/* $DEPLOY_DIR/
# Hoặc: tar -xzf /tmp/cap-01-build.tar.gz -C $DEPLOY_DIR/
echo "    -> Cần copy file build vào $DEPLOY_DIR trước khi chạy script"

# 3. Thêm Nginx location
echo "[3/6] Thêm Nginx location /cap-01/..."
sudo tee -a $NGINX_CONF > /dev/null <<'EOF'

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
EOF

echo "    -> Đã thêm location /cap-01/ vào Nginx config"

# 4. Test Nginx config
echo "[4/6] Test Nginx configuration..."
sudo nginx -t

# 5. Reload Nginx
echo "[5/6] Reload Nginx..."
sudo systemctl reload nginx

# 6. Kiểm tra local
echo "[6/6] Kiểm tra local..."
echo "    -> Test http://localhost/cap-01/"
curl -I http://localhost/cap-01/ 2>/dev/null | head -1
curl -I http://localhost/lop-06/ 2>/dev/null | head -1

echo ""
echo "=== Deploy hoàn tất ==="
echo "Nhớ purge Cloudflare cache sau!"
echo ""
