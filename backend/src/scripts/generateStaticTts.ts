import fs from 'node:fs/promises';
import path from 'node:path';
import GoogleTtsAdapter from '../services/tts/GoogleTtsAdapter';

interface CatalogEntry {
  key: string;
  kind: 'lesson-card' | 'question' | 'pregrade-prompt' | 'feedback' | 'audit';
  profileId: string;
  voiceId: string;
  lang: 'vi-VN' | 'en-US';
  usage: string;
  styleId: string;
  text: string;
  ssml: string;
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
  entries: CatalogEntry[];
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
    voiceProfiles: Array<unknown>;
    auditSamples: Array<{ key: string; available: boolean }>;
    byUsage: Array<{ usage: string; total: number; available: number }>;
  };
  entries: Record<string, {
    key: string;
    assetPath: string;
    lang: string;
    usage: string;
    profileId: string;
    contentVersion: string;
    available: boolean;
    textHash: string;
  }>;
}

interface CliOptions {
  onlyKinds: Set<CatalogEntry['kind']> | null;
  limit: number | null;
  missingOnly: boolean;
  profileId: string | null;
  dryRun: boolean;
}

function parseCliOptions(): CliOptions {
  const args = process.argv.slice(2);
  const readValue = (prefix: string): string | null => {
    const direct = args.find((arg) => arg.startsWith(`${prefix}=`));
    if (direct) return direct.slice(prefix.length + 1).trim();
    const index = args.findIndex((arg) => arg === prefix);
    if (index >= 0 && args[index + 1]) return String(args[index + 1]).trim();
    return null;
  };

  const onlyKindsRaw = readValue('--only');
  const onlyKinds = onlyKindsRaw
    ? new Set(onlyKindsRaw.split(',').map((item) => item.trim()).filter(Boolean) as CatalogEntry['kind'][])
    : null;

  const limitRaw = readValue('--limit');
  const limit = limitRaw ? Number.parseInt(limitRaw, 10) : null;

  return {
    onlyKinds,
    limit: Number.isFinite(limit) && Number(limit) > 0 ? Number(limit) : null,
    missingOnly: !args.includes('--all'),
    profileId: readValue('--profile'),
    dryRun: args.includes('--dry-run'),
  };
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw) as T;
}

async function ensureDir(filePath: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function filterEntries(entries: CatalogEntry[], options: CliOptions): CatalogEntry[] {
  return entries.filter((entry) => {
    if (options.onlyKinds && !options.onlyKinds.has(entry.kind)) {
      return false;
    }
    if (options.profileId && entry.profileId !== options.profileId) {
      return false;
    }
    return true;
  }).slice(0, options.limit ?? Number.MAX_SAFE_INTEGER);
}

function recomputeManifestSummary(manifest: ManifestFile): void {
  const entries = Object.values(manifest.entries);
  manifest.summary.totalEntries = entries.length;
  manifest.summary.availableEntries = entries.filter((entry) => entry.available).length;
  manifest.summary.missingEntries = entries.filter((entry) => !entry.available).length;
  manifest.summary.byUsage = Array.from(
    entries.reduce((map, entry) => {
      const current = map.get(entry.usage) || { usage: entry.usage, total: 0, available: 0 };
      current.total += 1;
      if (entry.available) {
        current.available += 1;
      }
      map.set(entry.usage, current);
      return map;
    }, new Map<string, { usage: string; total: number; available: number }>()),
  ).map(([, value]) => value);
  manifest.summary.auditSamples = manifest.summary.auditSamples.map((sample) => ({
    ...sample,
    available: Boolean(manifest.entries[sample.key]?.available),
  }));
}

async function main() {
  const options = parseCliOptions();
  const repoRoot = path.resolve(__dirname, '..', '..', '..');
  const publicTtsDir = path.join(repoRoot, 'public', 'audio', 'tts');
  const catalogPath = path.join(repoRoot, 'backend', 'data', 'tts', 'catalog.json');
  const manifestPath = path.join(publicTtsDir, 'manifest.json');

  const catalog = await readJsonFile<CatalogFile>(catalogPath);
  const manifest = await readJsonFile<ManifestFile>(manifestPath);
  const entries = filterEntries(catalog.entries, options);

  if (entries.length === 0) {
    console.log('No static TTS entries matched the requested filters.');
    return;
  }

  console.log(`Preparing ${entries.length} static TTS entries...`);

  let generated = 0;
  let skipped = 0;

  for (const entry of entries) {
    const absoluteAssetPath = path.join(repoRoot, 'public', entry.assetPath);
    const alreadyExists = await fileExists(absoluteAssetPath);

    if (alreadyExists && options.missingOnly) {
      skipped += 1;
      manifest.entries[entry.key] = {
        key: entry.key,
        assetPath: entry.assetPath,
        lang: entry.lang,
        usage: entry.usage,
        profileId: entry.profileId,
        contentVersion: entry.contentVersion,
        available: true,
        textHash: entry.textHash,
      };
      continue;
    }

    if (options.dryRun) {
      console.log(`[dry-run] ${entry.key} -> ${entry.assetPath}`);
      continue;
    }

    await ensureDir(absoluteAssetPath);
    const audioBuffer = await GoogleTtsAdapter.synthesize({
      ssml: entry.ssml,
      lang: entry.lang,
      voiceId: entry.voiceId,
      speed: 1,
    });
    await fs.writeFile(absoluteAssetPath, audioBuffer);
    generated += 1;

    manifest.entries[entry.key] = {
      key: entry.key,
      assetPath: entry.assetPath,
      lang: entry.lang,
      usage: entry.usage,
      profileId: entry.profileId,
      contentVersion: entry.contentVersion,
      available: true,
      textHash: entry.textHash,
    };
    console.log(`Generated ${entry.key} -> ${entry.assetPath}`);
  }

  recomputeManifestSummary(manifest);
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`Static TTS generation complete. Generated: ${generated}, skipped: ${skipped}.`);
  console.log(`Available assets: ${manifest.summary.availableEntries}/${manifest.summary.totalEntries}`);
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
