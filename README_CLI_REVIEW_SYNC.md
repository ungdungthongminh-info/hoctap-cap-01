# CLI review sync app <-> web

Muc dich: review app truoc khi lien dong bo app len web, kiem tra do lech catalog va endpoint AI app.

## File da them
- review-app-sync-cli.mjs
- run-review-app-sync.cmd

## Cach chay nhanh (Windows)
Mo CMD hoac PowerShell:

```
cd /d F:\1_A_Disk_D\Tool\Hoc_Tap\CAp_01
run-review-app-sync.cmd
```

## Tuy chon
```
run-review-app-sync.cmd --appId app-study-12 --customerId cus-demo --local http://localhost:3900 --live https://websalestotal.vercel.app
```

Tat kiem tra live:
```
run-review-app-sync.cmd --no-live
```

## AI app key
Neu muon review cac endpoint AI app, can co bien moi truong:

PowerShell:
```
$env:AI_APP_SHARED_KEY="your_shared_key"
# hoac
$env:WEB_TOTAL_AI_APP_KEY="your_shared_key"
run-review-app-sync.cmd
```

Neu khong co key, script van chay nhung se bo qua phan aiReview.

## Ket qua
CLI in ra JSON report gom:
- local: health + catalog
- live: health + catalog (neu bat)
- drift.onlyLocal: product co local nhung chua len web
- drift.onlyLive: product co web nhung local khong co
- aiReview: verify/list license endpoint
