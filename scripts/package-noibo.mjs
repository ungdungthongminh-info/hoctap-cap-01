import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const releaseDir = path.join(rootDir, 'release-noibo');

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    ...options,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function ensureReleaseDir() {
  mkdirSync(releaseDir, { recursive: true });
}

function buildInternalWeb() {
  run('npm', ['run', 'build:noibo']);
}

function zipWebBuild() {
  const webZipPath = path.join(releaseDir, 'HocHungKhoi_Webapp_NoiBo.zip');
  run('powershell', [
    '-NoProfile',
    '-Command',
    `Compress-Archive -Path 'dist\\*' -DestinationPath '${webZipPath.replace(/\\/g, '\\\\')}' -Force`,
  ]);
}

function buildWindowsDesktop() {
  run('npx', ['electron-builder', '--win', 'portable']);
}

function buildMacDesktopOrWriteNote() {
  if (process.platform === 'darwin') {
    run('npx', ['electron-builder', '--mac', 'zip']);
    return;
  }

  const notePath = path.join(releaseDir, 'HocHungKhoi_Desktopapp-Macbook_NoiBo_BUILD_ON_MAC.txt');
  writeFileSync(
    notePath,
    [
      'Macbook build requires macOS.',
      'Run this on a Mac from the project root:',
      'npm run build:noibo',
      'npx electron-builder --mac zip',
      'Expected artifact name: HocHungKhoi_Desktopapp-Macbook_NoiBo.zip',
    ].join('\n'),
    'utf8'
  );
}

ensureReleaseDir();

const target = process.argv[2] || 'all';
const wantsWeb = target === 'all' || target === 'web';
const wantsWin = target === 'all' || target === 'win';
const wantsMac = target === 'all' || target === 'mac';

if (wantsWeb || wantsWin || wantsMac) {
  buildInternalWeb();
}

if (wantsWeb) {
  zipWebBuild();
}

if (wantsWin) {
  buildWindowsDesktop();
}

if (wantsMac) {
  buildMacDesktopOrWriteNote();
}