import path from 'node:path';
import { REPO_ROOT, loadR2Env, nowIso, readJson, probePublicUrl, writeJson } from './r2-common.mjs';

const CATALOG = path.join(REPO_ROOT, 'question-tts-catalog-report.json');
const OUTPUT = path.join(REPO_ROOT, 'r2-question-tts-asset-check.json');

function getArg(name, fallback = '') {
  const raw = process.argv.find((x) => x.startsWith(`--${name}=`));
  return raw ? raw.slice(name.length + 3) : fallback;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

async function main() {
  const language = getArg('language', '').trim();
  const sample = hasFlag('sample');
  const sampleSize = Number(getArg('sample-size', sample ? '25' : '40')) || (sample ? 25 : 40);

  const { env, missing } = await loadR2Env();
  if (missing.length) throw new Error(`Missing R2 env keys: ${missing.join(', ')}`);

  const base = String(env.R2_PUBLIC_BASE_URL).replace(/\/+$/, '');
  const catalog = await readJson(CATALOG);
  let items = catalog.items || [];
  if (language) {
    items = items.filter((x) => String(x.language || x.profileId) === language);
  }
  const samples = (() => {
    if (!sample || language) {
      return items.slice(0, sampleSize);
    }
    const viTarget = Math.min(20, sampleSize);
    const enTarget = Math.min(5, Math.max(sampleSize - viTarget, 0));
    const viItems = items.filter((x) => String(x.language || x.profileId) === 'vi-v1').slice(0, viTarget);
    const enItems = items.filter((x) => String(x.language || x.profileId) === 'en-v1').slice(0, enTarget);
    return [...viItems, ...enItems];
  })();
  const checks = [];

  for (const item of samples) {
    const url = `${base}/${String(item.r2Key).replace(/^\/+/, '')}`;
    const probe = await probePublicUrl(url);
    checks.push({
      key: item.key,
      profileId: item.profileId,
      publicUrl: url,
      objectKey: item.r2Key,
      httpStatus: probe.status,
      contentType: probe.contentType,
      isHtml: probe.isHtml,
      magic: probe.magic,
      pass: probe.status === 200 && probe.contentType.toLowerCase().startsWith('audio/') && !probe.isHtml,
    });
  }

  const out = {
    generatedAt: nowIso(),
    language: language || 'all',
    sample,
    sampled: checks.length,
    pass: checks.every((x) => x.pass),
    checks,
  };

  await writeJson(OUTPUT, out);
  console.log(JSON.stringify(out, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
