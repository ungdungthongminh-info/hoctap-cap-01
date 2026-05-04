import { getR2Config } from './r2-common.mjs';

function maskPresence(value) {
  return String(value || '').trim() ? 'exists' : 'missing';
}

async function main() {
  const cfg = await getR2Config();
  const env = cfg.env;

  console.log(`accountId ${maskPresence(env.R2_ACCOUNT_ID)}`);
  console.log(`accessKeyId ${maskPresence(env.R2_ACCESS_KEY_ID)}`);
  console.log(`secretAccessKey ${maskPresence(env.R2_SECRET_ACCESS_KEY)}`);
  console.log(`bucket=${String(env.R2_BUCKET || '')}`);
  console.log(`publicBaseUrl=${String(env.R2_PUBLIC_BASE_URL || '')}`);
  console.log(`endpoint=${String(env.R2_ENDPOINT || '')}`);

  if (cfg.missingKeys.length > 0) {
    console.log(`missingKeys=${cfg.missingKeys.join(',')}`);
    process.exitCode = 1;
    return;
  }

  console.log('r2ConfigStatus=ok');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
