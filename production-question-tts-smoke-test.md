# Production Question TTS Smoke Test

- Date: 2026-05-05
- URL: https://hoctap-cap-01.vercel.app
- Runtime account context: da mo du grade 0-5 trong session nay

## Overall Verdict

- Status: FAIL (strict criteria)
- Da vao duoc practice cho grade 0-5 va click nut nghe thanh cong.
- Tuy nhien trong automation session nay khong thu duoc bang chung audio runtime hop le (khong co request mp3/zip, khong co event HTMLMediaElement.play, khong co signal speechSynthesis), nen chua du dieu kien PASS.
- Human audible check chua the ket luan bang automation-only.

## Required Smoke Table

| language | grade | lesson/question screen | questionId | expected key | actual network URL | status | content-type | audible |
|---|---:|---|---:|---|---|---:|---|---|
| vi-v1 | 0 | #/lessons/9001/practice (question text: "4 bong it hon 2 bong.") | - | question:{id} | none observed after click | - | - | not proven |
| vi-v1 | 1 | #/lessons/1/practice (question text: "Dem: 1, 2, ?, 4. So o dau ? la:") | - | question:{id} | none observed after click | - | - | not proven |
| vi-v1 | 2 | #/lessons/21/practice (question text: "7 + 8 = ?") | - | question:{id} | none observed after click | - | - | not proven |
| vi-v1 | 3 | #/lessons/41/practice (question text: "25 - 7 = 18.") | - | question:{id} | none observed after click | - | - | not proven |
| vi-v1 | 4 | #/lessons/61/practice (question text: "Tong 40.000 + 5.000 + 300 + 20 + 1 = ?") | - | question:{id} | none observed after click | - | - | not proven |
| vi-v1 | 5 | #/lessons/81/practice (question text: "105 + ___ = 155.") | - | question:{id} | none observed after click | - | - | not proven |

## Runtime Probe Detail (Strict)

- Probe used in browser session:
  - fetch/XHR interception
  - performance resource entries delta after click
  - HTMLMediaElement.play interception
  - speechSynthesis.speak interception
- Result: all probes returned no audio activity after click for grades 0-5 in this automation environment.

## CORS Root Cause (Production Config Evidence)

- `GET /app-update.json` returns `tts.manifestUrl` = `https://drive.usercontent.google.com/download?id=1xhb4KGGklpH9U2Kl0tA1ER8CWSE3czmq&export=download&confirm=t`
- `GET /audio/tts/drive-packs.json` shows `sourceProvider: cloudflare-r2` but all packs have `r2PublicUrl: ""`.
- Đây van la production state hien tai (chua doi).

## Local Repo Fix Prepared (Pending Deploy)

- public/app-update.json:
  - `tts.manifestUrl` da doi sang R2 pack URL grade 1.
- public/audio/tts/drive-packs.json:
  - da bo sung `r2PublicUrl` day du cho packs grade 0-5.
- Luu y: chua deploy nen production URL van tra config cu.

## Delta Conclusion

1. Access route production trong session nay: PASS (vao duoc practice grade 0-5).
2. Strict audible proof production: FAIL (chua co bang chung network/runtime/human audible).
3. Config drift production: van tro Drive + r2PublicUrl rong.
4. Local fix da san sang, can deploy roi retest strict de co the chot PASS.
