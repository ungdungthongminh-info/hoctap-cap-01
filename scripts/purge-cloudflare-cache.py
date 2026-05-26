#!/usr/bin/env python3
"""
Purge Cloudflare cache cho app.hochungkhoi.site/cap-01/*
Yêu cầu: Cloudflare API Token với quyền Zone:Cache Purge

Cách lấy API Token:
1. Vào https://dash.cloudflare.com/profile/api-tokens
2. Create Token -> Custom token
3. Permissions: Zone - Cache Purge - Purge
4. Zone Resources: Include - Specific zone - hochungkhoi.site
5. Copy token và thay vào CF_API_TOKEN bên dưới
"""

import requests
import sys

# Thay bằng token của bạn
CF_API_TOKEN = "YOUR_CLOUDFLARE_API_TOKEN_HERE"
ZONE_ID = "YOUR_ZONE_ID_HERE"  # Có thể lấy từ API hoặc dashboard
DOMAIN = "app.hochungkhoi.site"

def get_zone_id():
    """Lấy Zone ID từ domain"""
    url = "https://api.cloudflare.com/client/v4/zones"
    headers = {
        "Authorization": f"Bearer {CF_API_TOKEN}",
        "Content-Type": "application/json"
    }
    params = {"name": "hochungkhoi.site"}
    
    resp = requests.get(url, headers=headers, params=params)
    data = resp.json()
    
    if not data.get("success"):
        print(f"Error: {data.get('errors')}")
        return None
    
    zones = data.get("result", [])
    if zones:
        return zones[0]["id"]
    return None

def purge_cache(zone_id, files=None, purge_everything=False):
    """Purge cache"""
    url = f"https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache"
    headers = {
        "Authorization": f"Bearer {CF_API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    if purge_everything:
        data = {"purge_everything": True}
        print("Purging EVERYTHING...")
    else:
        data = {"files": files or []}
        print(f"Purging specific files: {files}")
    
    resp = requests.post(url, headers=headers, json=data)
    result = resp.json()
    
    if result.get("success"):
        print("✅ Purge thành công!")
        return True
    else:
        print(f"❌ Lỗi: {result.get('errors')}")
        return False

def main():
    if CF_API_TOKEN == "YOUR_CLOUDFLARE_API_TOKEN_HERE":
        print("⚠️  Vui lòng thay CF_API_TOKEN bằng token thực tế!")
        print("Hướng dẫn lấy token: https://developers.cloudflare.com/api/tokens/create/")
        sys.exit(1)
    
    print("=== Cloudflare Cache Purge ===\n")
    
    # Lấy Zone ID
    zone_id = ZONE_ID if ZONE_ID != "YOUR_ZONE_ID_HERE" else get_zone_id()
    if not zone_id:
        print("❌ Không tìm thấy Zone ID!")
        sys.exit(1)
    
    print(f"Zone ID: {zone_id}\n")
    
    # Purge specific paths
    files_to_purge = [
        f"https://{DOMAIN}/cap-01/*",
        f"http://{DOMAIN}/cap-01/*",
    ]
    
    purge_cache(zone_id, files=files_to_purge)
    
    # Hoặc purge everything nếu cần
    # purge_cache(zone_id, purge_everything=True)

if __name__ == "__main__":
    main()
