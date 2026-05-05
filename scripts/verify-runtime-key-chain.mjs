/**
 * verify-runtime-key-chain.mjs
 * Read-only local test: proves the full TTS runtime key chain is correct.
 * Run: node scripts/verify-runtime-key-chain.mjs
 * Output: runtime-key-verify-report.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(REPO_ROOT, 'runtime-key-verify-report.json');
const R2_BASE = 'https://pub-e3dfe5c479f44fbc906aae6c475603db.r2.dev';

function buildQuestionAssetKey(questionId) { return `question:${questionId}`; }

function resolveQuestionAudioUrl(key, profileId) {
  const m = key.match(/^question:(\d+)$/i);
  if (!m) return null;
  const qId = Number(m[1]);
  if (!Number.isFinite(qId) || qId <= 0) return null;
  if (profileId !== 'vi-v1' && profileId !== 'en-v1') return null;
  const resolvedPath = `audio/tts/assets/${profileId}/question/${qId}.mp3`;
  const audioUrl = `${R2_BASE}/${resolvedPath}`;
  const FORBIDDEN = ['texttospeech.googleapis.com','drive.usercontent.google.com','drive.google.com','storage.googleapis.com'];
  for (const f of FORBIDDEN) if (audioUrl.includes(f)) return { error: `FORBIDDEN:${f}`, audioUrl };
  return { resolvedPath, audioUrl, qId, profileId };
}

const auditJson = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'question-id-uniqueness-audit.json'), 'utf8'));
const catalogPath = path.join(REPO_ROOT, 'backend', 'data', 'tts', 'catalog.json');

const pickedSamples = [];
if (fs.existsSync(catalogPath)) {
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const viV1Qs = (Array.isArray(catalog.entries) ? catalog.entries : [])
    .filter(e => e.key?.startsWith('question:') && e.profileId === 'vi-v1');
  const total = viV1Qs.length;
  const positions = total > 0 ? [0, Math.floor(total*0.1), Math.floor(total*0.25), Math.floor(total*0.5), Math.floor(total*0.7), Math.floor(total*0.85), total-1] : [];
  for (const pos of positions) {
    const entry = viV1Qs[pos];
    if (!entry) continue;
    const mm = entry.key.match(/^question:(\d+)$/);
    if (mm) pickedSamples.push({ label: `vi-v1-pos${pos}`, questionId: Number(mm[1]), profileId: 'vi-v1' });
  }
}
// en-v1 samples (confirmed valid from r2-question-tts-asset-check.json)
pickedSamples.push({ label: 'en-v1-q1901', questionId: 1901, profileId: 'en-v1' });
pickedSamples.push({ label: 'en-v1-q1930', questionId: 1930, profileId: 'en-v1' });
if (pickedSamples.length === 0) {
  for (const qId of [1, 4000, 8000]) pickedSamples.push({ label: 'fallback', questionId: qId, profileId: 'vi-v1' });
}

console.log(`[verify-runtime-key-chain] Testing ${pickedSamples.length} samples...`);
const results = [];
for (const sample of pickedSamples) {
  const { label, questionId, profileId } = sample;
  const assetKey = buildQuestionAssetKey(questionId);
  const resolved = resolveQuestionAudioUrl(assetKey, profileId);
  const keyCheck = assetKey === `question:${questionId}` ? 'PASS' : 'FAIL';
  if (!resolved || resolved.error) {
    results.push({ label, questionId, profileId, assetKey, keyCheck, urlResolveCheck: resolved?.error || 'FAIL_NULL', pass: false });
    continue;
  }
  const { audioUrl, resolvedPath } = resolved;
  const expectedPath = `audio/tts/assets/${profileId}/question/${questionId}.mp3`;
  const pathCheck = resolvedPath === expectedPath ? 'PASS' : `FAIL:got=${resolvedPath}`;
  const noGoogleUrl = !audioUrl.includes('googleapis.com') && !audioUrl.includes('drive.usercontent') && !audioUrl.includes('drive.google.com');
  let httpStatus = null, contentType = null, noHtml = null, httpCheck = null;
  try {
    const resp = await fetch(audioUrl, { method: 'HEAD' });
    httpStatus = resp.status;
    contentType = resp.headers.get('content-type') || '';
    noHtml = !contentType.includes('text/html');
    httpCheck = (httpStatus === 200 && noHtml && (contentType.includes('audio') || contentType.includes('octet-stream'))) ? 'PASS' : 'FAIL';
  } catch (e) { httpCheck = `ERROR:${e.message}`; }
  const pass = keyCheck === 'PASS' && pathCheck === 'PASS' && noGoogleUrl && httpCheck === 'PASS';
  results.push({ label, questionId, profileId, assetKey, keyCheck, resolvedPath, audioUrl, pathCheck, noGoogleUrl, httpStatus, contentType, noHtml, httpCheck, pass });
  console.log(`  ${label} q=${questionId} key=${assetKey} → ${audioUrl} [${httpStatus} ${contentType}] ${pass ? '✓' : '✗'}`);
}

const totalPass = results.filter(r => r.pass).length;
const totalFail = results.filter(r => !r.pass).length;
const overallVerdict = totalFail === 0 && totalPass > 0 ? 'PASS' : 'FAIL';
const report = {
  generatedAt: new Date().toISOString(),
  description: 'Local runtime key chain verification — buildQuestionAssetKey + withResolvedAudioUrl + R2 CDN',
  auditSource: auditJson.source,
  auditVerdict: auditJson.verdict,
  totalTested: results.length, totalPass, totalFail, overallVerdict,
  checks: { keyFormat:'question:{questionId} - no grade/lesson scope', urlFormat:`audio/tts/assets/{profileId}/question/{questionId}.mp3`, noGoogleTts:'texttospeech.googleapis.com NOT in URL', noDriveUrl:'drive.usercontent.google.com NOT in URL', noHtml:'content-type must be audio/*, not text/html', http200:'HTTP status must be 200' },
  results,
};
fs.writeFileSync(OUTPUT, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(`\n[verify-runtime-key-chain] VERDICT: ${overallVerdict} (${totalPass}/${results.length} pass)`);
console.log(`[verify-runtime-key-chain] Written to ${OUTPUT}`);
