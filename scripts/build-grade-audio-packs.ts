import { mkdir, readFile, rm, stat, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { seedLessonCards, seedLessons, seedQuestions } from '../src/data/seedData';

type UsageType =
  | 'lesson-read-all'
  | 'practice-on-demand'
  | 'pre-grade-auto'
  | 'feedback-short'
  | 'voice-audit';

interface CatalogEntry {
  key: string;
  kind: 'lesson-card' | 'question' | 'pregrade-prompt' | 'feedback' | 'audit';
  profileId: string;
  usage: UsageType;
  assetPath: string;
  available: boolean;
  contentVersion: string;
  textHash: string;
}

interface CatalogFile {
  meta: {
    contentVersion: string;
    generatedAt: string;
    defaultProfileId: string;
    audioBasePath: string;
  };
  entries: CatalogEntry[];
}

interface ManifestEntry {
  key: string;
  assetPath: string;
  lang: string;
  usage: UsageType;
  profileId: string;
  contentVersion: string;
  available: boolean;
  textHash: string;
}

interface ManifestFile {
  meta: {
    contentVersion: string;
    generatedAt: string;
    defaultProfileId: string;
    audioBasePath: string;
  };
  summary: {
    totalEntries: number;
    availableEntries: number;
    missingEntries: number;
    defaultProfileId: string;
    contentVersion: string;
    generatedAt: string;
    audioBasePath: string;
    voiceProfiles: Array<{
      id: string;
      label: string;
      lang: string;
      voiceId: string;
      notes: string;
      candidateRank: number;
      targetPersona: string;
      isDefault?: boolean;
    }>;
    auditSamples: Array<{
      key: string;
      label: string;
      profileId: string;
      sampleId: string;
      available: boolean;
    }>;
    byUsage: Array<{ usage: UsageType; total: number; available: number }>;
  };
  entries: Record<string, ManifestEntry>;
}

interface PackDefinition {
  id: string;
  label: string;
  grades: Set<number>;
  includePregrade: boolean;
  includeFeedback: boolean;
}

interface PackReport {
  id: string;
  label: string;
  grades: number[];
  totalEntries: number;
  byUsage: Array<{ usage: UsageType; total: number }>;
  totalBytes: number;
  totalSizeMB: number;
}

interface CliOptions {
  profileId: string;
  outDir: string;
  catalogPath: string;
  manifestPath: string;
  clean: boolean;
}

function parseArgValue(args: string[], name: string): string | null {
  const direct = args.find((item) => item.startsWith(`${name}=`));
  if (direct) {
    return direct.slice(name.length + 1).trim();
  }
  const idx = args.findIndex((item) => item === name);
  if (idx >= 0 && args[idx + 1]) {
    return String(args[idx + 1]).trim();
  }
  return null;
}

function parseCliOptions(): CliOptions {
  const args = process.argv.slice(2);
  return {
    profileId: parseArgValue(args, '--profile') || 'vi-v1',
    outDir: parseArgValue(args, '--out') || 'release/audio-packs',
    catalogPath: parseArgValue(args, '--catalog') || 'backend/data/tts/catalog.json',
    manifestPath: parseArgValue(args, '--manifest') || 'public/audio/tts/manifest.json',
    clean: !args.includes('--no-clean'),
  };
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  const raw = await readFile(filePath, 'utf8');
  return JSON.parse(raw) as T;
}

function buildPackDefinitions(): PackDefinition[] {
  return [
    {
      id: 'pre-k',
      label: 'Tien lop 1',
      grades: new Set([0]),
      includePregrade: true,
      includeFeedback: true,
    },
    {
      id: 'grade-1',
      label: 'Lop 1',
      grades: new Set([1]),
      includePregrade: false,
      includeFeedback: true,
    },
    {
      id: 'grade-2',
      label: 'Lop 2',
      grades: new Set([2]),
      includePregrade: false,
      includeFeedback: true,
    },
    {
      id: 'grade-3',
      label: 'Lop 3',
      grades: new Set([3]),
      includePregrade: false,
      includeFeedback: true,
    },
    {
      id: 'grade-4',
      label: 'Lop 4',
      grades: new Set([4]),
      includePregrade: false,
      includeFeedback: true,
    },
    {
      id: 'grade-5',
      label: 'Lop 5',
      grades: new Set([5]),
      includePregrade: false,
      includeFeedback: true,
    },
  ];
}

function getCardGradeMap(): Map<number, number> {
  const lessonsById = new Map(seedLessons.map((lesson) => [lesson.id, lesson.grade]));
  const map = new Map<number, number>();
  seedLessonCards.forEach((card) => {
    const grade = lessonsById.get(card.lessonId);
    if (typeof grade === 'number') {
      map.set(card.id, grade);
    }
  });
  return map;
}

function getQuestionGradeMap(): Map<number, number> {
  return new Map(seedQuestions.map((question) => [question.id, question.grade]));
}

function parseNumericSuffix(key: string): number {
  const split = String(key || '').split(':');
  return Number.parseInt(split[split.length - 1] || '', 10);
}

function belongsToPack(
  entry: CatalogEntry,
  pack: PackDefinition,
  cardGradeMap: Map<number, number>,
  questionGradeMap: Map<number, number>,
): boolean {
  if (entry.kind === 'lesson-card') {
    const cardId = parseNumericSuffix(entry.key);
    const grade = cardGradeMap.get(cardId);
    return typeof grade === 'number' && pack.grades.has(grade);
  }

  if (entry.kind === 'question') {
    const questionId = parseNumericSuffix(entry.key);
    const grade = questionGradeMap.get(questionId);
    return typeof grade === 'number' && pack.grades.has(grade);
  }

  if (entry.kind === 'pregrade-prompt') {
    return pack.includePregrade;
  }

  if (entry.kind === 'feedback') {
    return pack.includeFeedback;
  }

  return false;
}

function buildUsageSummary(entries: ManifestEntry[]): Array<{ usage: UsageType; total: number }> {
  const map = new Map<UsageType, number>();
  entries.forEach((entry) => {
    map.set(entry.usage, (map.get(entry.usage) || 0) + 1);
  });
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([usage, total]) => ({ usage, total }));
}

async function ensureParent(filePath: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
}

async function main() {
  const options = parseCliOptions();
  const rootDir = process.cwd();
  const outRoot = path.resolve(rootDir, options.outDir, options.profileId);
  const catalogPath = path.resolve(rootDir, options.catalogPath);
  const manifestPath = path.resolve(rootDir, options.manifestPath);

  const catalog = await readJsonFile<CatalogFile>(catalogPath);
  const manifest = await readJsonFile<ManifestFile>(manifestPath);
  const cardGradeMap = getCardGradeMap();
  const questionGradeMap = getQuestionGradeMap();
  const packs = buildPackDefinitions();

  if (options.clean) {
    await rm(outRoot, { recursive: true, force: true });
  }
  await mkdir(outRoot, { recursive: true });

  const reports: PackReport[] = [];

  for (const pack of packs) {
    const packEntries = catalog.entries
      .filter((entry) => entry.profileId === options.profileId)
      .filter((entry) => entry.available)
      .filter((entry) => belongsToPack(entry, pack, cardGradeMap, questionGradeMap));

    const packManifestEntries: Record<string, ManifestEntry> = {};
    let totalBytes = 0;

    const packDir = path.join(outRoot, pack.id);
    await mkdir(packDir, { recursive: true });

    for (const item of packEntries) {
      const sourceEntry = manifest.entries[item.key];
      if (!sourceEntry) {
        continue;
      }

      const srcFile = path.resolve(rootDir, 'public', sourceEntry.assetPath);
      const dstFile = path.join(packDir, sourceEntry.assetPath);
      await ensureParent(dstFile);
      await copyFile(srcFile, dstFile);
      const fileStat = await stat(srcFile);
      totalBytes += Number(fileStat.size || 0);

      packManifestEntries[sourceEntry.key] = {
        ...sourceEntry,
        profileId: options.profileId,
      };
    }

    const manifestEntriesList = Object.values(packManifestEntries);
    const usageSummary = buildUsageSummary(manifestEntriesList);
    const generatedAt = new Date().toISOString();

    const packManifest = {
      meta: {
        contentVersion: manifest.meta.contentVersion,
        generatedAt,
        defaultProfileId: options.profileId,
        audioBasePath: manifest.meta.audioBasePath,
        packId: pack.id,
        packLabel: pack.label,
        grades: Array.from(pack.grades).sort((a, b) => a - b),
      },
      summary: {
        totalEntries: manifestEntriesList.length,
        availableEntries: manifestEntriesList.length,
        missingEntries: 0,
        defaultProfileId: options.profileId,
        contentVersion: manifest.meta.contentVersion,
        generatedAt,
        audioBasePath: manifest.meta.audioBasePath,
        totalBytes,
        totalSizeMB: Number((totalBytes / 1024 / 1024).toFixed(2)),
        byUsage: usageSummary,
      },
      entries: packManifestEntries,
    };

    await writeFile(path.join(packDir, 'manifest.json'), JSON.stringify(packManifest, null, 2), 'utf8');

    reports.push({
      id: pack.id,
      label: pack.label,
      grades: Array.from(pack.grades).sort((a, b) => a - b),
      totalEntries: manifestEntriesList.length,
      byUsage: usageSummary,
      totalBytes,
      totalSizeMB: Number((totalBytes / 1024 / 1024).toFixed(2)),
    });
  }

  const reportPath = path.join(outRoot, 'pack-index.json');
  await writeFile(reportPath, JSON.stringify({
    profileId: options.profileId,
    generatedAt: new Date().toISOString(),
    source: {
      catalogPath: path.relative(rootDir, catalogPath),
      manifestPath: path.relative(rootDir, manifestPath),
    },
    packs: reports,
  }, null, 2), 'utf8');

  console.log(`Built grade packs for profile ${options.profileId}.`);
  reports.forEach((item) => {
    console.log(`- ${item.id}: ${item.totalEntries} entries, ${item.totalSizeMB} MB`);
  });
  console.log(`Index: ${path.relative(rootDir, reportPath)}`);
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

