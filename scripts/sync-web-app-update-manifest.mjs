import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const packageJsonPath = path.join(ROOT, 'package.json');
const manifestPath = path.join(ROOT, 'public', 'app-update.json');

const PUBLIC_BASE = 'https://pub-90b335e287f24c92bbd5856cb9f116d9.r2.dev';
const R2_PREFIX = 'app-updates/app-study-12';
const VERSIONED_EXE_PREFIX = 'HocHungKhoi_Desktopapp-Win';

if (!fs.existsSync(packageJsonPath) || !fs.existsSync(manifestPath)) {
  process.exit(0);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = String(packageJson.version || '').trim();
if (!version) {
  console.error('ERROR: Cannot determine version from package.json');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
manifest.latestVersion = version;
manifest.publishedAt = new Date().toISOString();
manifest.title = `Ban cap nhat on dinh ${version}`;
manifest.downloadUrl = `${PUBLIC_BASE}/${R2_PREFIX}/${VERSIONED_EXE_PREFIX}-${version}.exe`;

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Synced public/app-update.json -> ${version}`);