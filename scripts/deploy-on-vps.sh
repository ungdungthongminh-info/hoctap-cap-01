#!/bin/bash
# Script chạy trên VPS để deploy Cấp 01
# Upload file này lên /tmp/ rồi chạy: bash /tmp/deploy-on-vps.sh

set -e

REMOTE_PATH="/var/www/apps/cap-01"
NGINX_CONF="/etc/nginx/sites-available/app.hochungkhoi.site"
ZIP_PATH="/tmp/cap-01-deploy.zip"

echo "=== Deploy Cấp 01 on VPS ==="
echo "Date: $(date)"
echo ""

# 1. Giải nén file
echo "[1/5] Extracting files..."
if [ ! -f "$ZIP_PATH" ]; then
    echo "ERROR: $ZIP_PATH not found!"
    exit 1
fi

sudo mkdir -p "$REMOTE_PATH"
sudo unzip -o "$ZIP_PATH" -d "$REMOTE_PATH/"
rm "$ZIP_PATH"

# 2. Kiểm tra file
echo "[2/5] Verifying files..."
ls -la "$REMOTE_PATH/"
echo ""

# 3. Cấu hình Nginx
echo "[3/5] Configuring Nginx..."
if ! grep -q "location /cap-01/" "$NGINX_CONF"; then
    echo "Adding Nginx location for /cap-01/..."
    
    # Backup
    TIMESTAMP=$(date +%Y%m%d%H%M%S)
    sudo cp "$NGINX_CONF" "$NGINX_CONF.backup.$TIMESTAMP"
    
    # Thêm location block
    sudo tee -a "$NGINX_CONF" > /dev/null << 'EOF'

    # Cấp 01 location - Auto-added by deploy script
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
    echo "Nginx config updated"
else
    echo "Nginx location /cap-01/ already exists"
fi

# 4. Test và reload Nginx
echo "[4/5] Testing Nginx config..."
sudo nginx -t

echo "[5/5] Reloading Nginx..."
sudo systemctl reload nginx

# Test local
echo ""
echo "Testing local endpoints..."
echo -n "/cap-01/: "
curl -s -o /dev/null -w "%{http_code}" http://localhost/cap-01/ || echo "FAIL"
echo ""
echo -n "/lop-06/: "
curl -s -o /dev/null -w "%{http_code}" http://localhost/lop-06/ || echo "FAIL"
echo ""

echo "=== Deploy complete! ==="
echo "Next: Purge Cloudflare cache"
