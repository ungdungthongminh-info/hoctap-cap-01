const fs = require('fs/promises');
const path = require('path');

const releaseDir = path.join(__dirname, '..', 'release');
const removablePatterns = [
  /^HocHungKhoi_Desktopapp-Win(?:-[\d.]+)?\.exe$/,
  /^HocHungKhoi_Desktopapp-Win(?:-[\d.]+)?\.exe\.blockmap$/,
  /^HocHungKhoi_Desktopapp-Macbook(?:-[\d.]+)?\./,
  /^latest\.yml$/,
];

async function main() {
  let entries = [];
  try {
    entries = await fs.readdir(releaseDir, { withFileTypes: true });
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return;
    }
    throw error;
  }

  const removableFiles = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => removablePatterns.some((pattern) => pattern.test(name)));

  await Promise.all(
    removableFiles.map((name) => fs.unlink(path.join(releaseDir, name))),
  );

  if (removableFiles.length > 0) {
    console.log(`Removed old desktop artifacts: ${removableFiles.join(', ')}`);
  }
}

main().catch((error) => {
  console.error('Failed to clean desktop artifacts.', error);
  process.exitCode = 1;
});