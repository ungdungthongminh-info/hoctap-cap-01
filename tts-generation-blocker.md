# TTS Generation Blocker

## Lenh da chay

```powershell
Set-Location 'f:\1_A_Disk_D\Tool\Hoc_Tap\CAp_01'
npm run tts:generate:static -- --limit=1
```

Script thuc te duoc goi:

```powershell
npm --prefix backend run tts:generate-static -- --limit=1
```

## Loi Google tra ve

```text
Error: 7 PERMISSION_DENIED: Project project-b306319a-ed99-49db-8db has been deleted.
reason: USER_PROJECT_DENIED
service: texttospeech.googleapis.com
consumer: projects/project-b306319a-ed99-49db-8db
```

## Credential / env dang duoc su dung

### Trong code backend
- Provider: `google-cloud`
- Adapter: `backend/src/services/tts/GoogleTtsAdapter.ts`
- Neu co `GOOGLE_TTS_API_KEY` thi goi REST API.
- Neu khong co `GOOGLE_TTS_API_KEY` thi dung `TextToSpeechClient()` va roi vao Application Default Credentials (ADC).

### Trang thai env hien tai
- `backend/.env` hien KHONG khai bao `GOOGLE_TTS_API_KEY`
- `backend/.env` hien KHONG khai bao `GOOGLE_APPLICATION_CREDENTIALS`
- `backend/.env.example` co mau:
  - `TTS_PROVIDER=google-cloud`
  - `APP_CONTENT_VERSION=2026-04-27-v1`
  - `GOOGLE_APPLICATION_CREDENTIALS=./secrets/google-tts-service-account.json`
  - `GOOGLE_TTS_DEFAULT_LANGUAGE=vi-VN`
  - `GOOGLE_TTS_DEFAULT_VOICE=vi-VN-Chirp3-HD-Despina`

### Ambient credential dang bi bat vao runtime
- ADC path: `C:\Users\PC\AppData\Roaming\gcloud\application_default_credentials.json`
- ADC type: `authorized_user`
- `quota_project_id`: `project-b306319a-ed99-49db-8db`
- Client email / private token: `[REDACTED]`

## Anh huong hien tai
- `content-audio-audit-report.json` da pass=true.
- `tts-catalog-integrity-report.json` van fail vi con thieu `19,743` audio assets.
- Da sync duoc mot phan mp3 tu desktop audio pack sang `public/audio/tts/assets/vi-v1`, nhung chi du cho mot phan catalog.
- Phan audio con thieu khong the generate tiep khi Google TTS dang tra ve `USER_PROJECT_DENIED`.

## Ket luan
Khong the generate du `19,743` audio con thieu cho den khi co Google project / credentials hop le cho `texttospeech.googleapis.com`.

## De xuat fix ha tang
1. Tao lai Google Cloud project hop le cho Text-to-Speech.
2. Hoac cap nhat service account / ADC co quyen goi `texttospeech.googleapis.com`.
3. Neu su dung service account file:
   - cap lai `GOOGLE_APPLICATION_CREDENTIALS` tro den file hop le
   - dam bao service account co quyen su dung Text-to-Speech
4. Neu su dung ADC:
   - dang nhap lai `gcloud auth application-default login`
   - cau hinh `quota_project_id` tro den project con ton tai va da bat Text-to-Speech API
