import { createHash } from 'node:crypto';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { zipSync } from 'fflate';
import { seedLessonCards, seedLessons } from '../src/data/seedData';

type ManifestEntry = {
  key: string;
  assetPath: string;
  profileId: string;
  available: boolean;
};

type ManifestFile = {
  entries: Record<string, ManifestEntry>;
};

type PackConfig = {
  grade: number;
  fileName: string;
  driveFileId: string;
  driveDownloadUrl: string;
  sizeBytes: number;
  sha256: string;
  assetCount: number;
};

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, 'public', 'audio', 'tts', 'manifest.json');
const PACKS_DIR = path.join(ROOT, 'public', 'audio', 'tts', 'packs');
const DRIVE_PACKS_CONFIG = path.join(ROOT, 'public', 'audio', 'tts', 'drive-packs.json');
const GRADES = [0, 1, 2, 3, 4, 5] as const;

function buildCardGradeMap(): Map<number, number> {
  const lessonGradeById = new Map(seedLessons.map((lesson) => [Number(lesson.id), Number(lesson.grade)]));
  const map = new Map<number, number>();
  for (const card of seedLessonCards) {
    const cardId = Number(card.id);
    const grade = lessonGradeById.get(Number(card.lessonId));
    if (Number.isFinite(cardId) && Number.isFinite(grade)) {
      map.set(cardId, Number(grade));
    }
  }
  return map;
}

function toUint8Array(buffer: Buffer): Uint8Array {
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
}

async function main(): Promise<void> {
  const manifestRaw = await readFile(MANIFEST_PATH, 'utf8');
  const manifest = JSON.parse(manifestRaw) as ManifestFile;
  const gradeByCardId = buildCardGradeMap();

  await mkdir(PACKS_DIR, { recursive: true });

  const grouped = new Map<number, Array<{ assetKey: string; absPath: string; fileName: string }>>();
  for (const grade of GRADES) {
    grouped.set(grade, []);
  }

  for (const [assetKey, entry] of Object.entries(manifest.entries || {})) {
    if (!assetKey.startsWith('lesson-card:')) continue;
    if (entry.profileId !== 'vi-v1') continue;
    if (!entry.available) continue;

    const cardId = Number(assetKey.split(':')[1]);
    const grade = gradeByCardId.get(cardId);
    if (grade === undefined || !grouped.has(grade)) continue;

    const normalizedAssetPath = String(entry.assetPath || '').replace(/\\/g, '/').replace(/^\/+/, '');
    const absPath = path.join(ROOT, 'public', normalizedAssetPath);
    const fileName = path.basename(normalizedAssetPath);
    grouped.get(grade)!.push({ assetKey, absPath, fileName });
  }

  const packs: PackConfig[] = [];

  for (const grade of GRADES) {
    const items = (grouped.get(grade) || []).sort((a, b) => {
      const aid = Number(a.assetKey.split(':')[1]);
      const bid = Number(b.assetKey.split(':')[1]);
      return aid - bid;
    });

    const files: Record<string, Uint8Array> = {};
    for (const item of items) {
      const raw = await readFile(item.absPath);
      files[item.fileName] = toUint8Array(raw);
    }

    const zipBytes = zipSync(files, { level: 6 });
    const zipBuffer = Buffer.from(zipBytes);
    const fileName = `tts-vi-v1-grade-${grade}-lesson-card.zip`;
    const zipPath = path.join(PACKS_DIR, fileName);
    await writeFile(zipPath, zipBuffer);
    const zipStat = await stat(zipPath);

    const sha256 = createHash('sha256').update(zipBuffer).digest('hex');

    packs.push({
      grade,
      fileName,
      driveFileId: '',
      driveDownloadUrl: '',
      sizeBytes: Number(zipStat.size || 0),
      sha256,
      assetCount: items.length,
    });

    console.log(`grade=${grade}; assetCount=${items.length}; zipMB=${(Number(zipStat.size || 0) / 1024 / 1024).toFixed(2)}`);
  }

  const config = {
    profile: 'vi-v1',
    contentType: 'lesson-card',
    packs,
  };

  await writeFile(DRIVE_PACKS_CONFIG, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
  console.log(`wrote ${DRIVE_PACKS_CONFIG}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
