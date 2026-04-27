import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { getAll, getDatabase, getOne } from '../../db/init';

export interface TtsCacheLookupKey {
  provider: string;
  voice: string;
  speed: number;
  lang: string;
  usage: string;
  contentVersion: string;
  textHash: string;
}

export interface TtsCacheRecord extends TtsCacheLookupKey {
  id: number;
  audioPath: string;
  charCount: number;
  hitCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TtsCacheDeleteFilters {
  provider?: string;
  contentVersion?: string;
  usage?: string;
}

const CACHE_ROOT = path.resolve(process.cwd(), 'data', 'tts-cache');

function ensureDir(targetDir: string): void {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
}

function sanitizeSegment(value: string): string {
  return String(value || '')
    .trim()
    .replace(/[^A-Za-z0-9._-]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'default';
}

function formatSpeedSegment(speed: number): string {
  const normalized = Number.isFinite(speed) ? speed : 1;
  return `speed-${normalized.toFixed(2).replace('.', '_')}`;
}

function fileExists(relativeAudioPath: string): boolean {
  return fs.existsSync(path.join(CACHE_ROOT, relativeAudioPath));
}

function runStatement(sql: string, params: Array<string | number> = []): Promise<{ lastID: number; changes: number }> {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        lastID: this.lastID ?? 0,
        changes: this.changes ?? 0,
      });
    });
  });
}

function removeEmptyParents(startDir: string): void {
  let currentDir = startDir;

  while (currentDir.startsWith(CACHE_ROOT) && currentDir !== CACHE_ROOT) {
    if (!fs.existsSync(currentDir)) {
      currentDir = path.dirname(currentDir);
      continue;
    }

    const entries = fs.readdirSync(currentDir);
    if (entries.length > 0) {
      break;
    }

    fs.rmdirSync(currentDir);
    currentDir = path.dirname(currentDir);
  }
}

export function hashText(text: string): string {
  return crypto.createHash('sha256').update(String(text || '').trim()).digest('hex');
}

export function getCacheRoot(): string {
  ensureDir(CACHE_ROOT);
  return CACHE_ROOT;
}

export function buildRelativeAudioPath(key: TtsCacheLookupKey): string {
  return [
    sanitizeSegment(key.provider),
    sanitizeSegment(key.contentVersion),
    sanitizeSegment(key.lang),
    sanitizeSegment(key.voice),
    formatSpeedSegment(key.speed),
    `${sanitizeSegment(key.textHash)}.mp3`,
  ].join('/');
}

export async function findByCacheKey(key: TtsCacheLookupKey): Promise<TtsCacheRecord | null> {
  const row = await getOne(
    `
      SELECT
        id,
        provider,
        voice,
        speed,
        lang,
        usage,
        content_version AS contentVersion,
        text_hash AS textHash,
        audio_path AS audioPath,
        char_count AS charCount,
        hit_count AS hitCount,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM tts_cache
      WHERE provider = ?
        AND voice = ?
        AND speed = ?
        AND lang = ?
        AND usage = ?
        AND content_version = ?
        AND text_hash = ?
      LIMIT 1
    `,
    [key.provider, key.voice, key.speed, key.lang, key.usage, key.contentVersion, key.textHash],
  );

  if (!row) {
    return null;
  }

  if (!fileExists(String(row.audioPath))) {
    await runStatement('DELETE FROM tts_cache WHERE id = ?', [Number(row.id)]);
    return null;
  }

  return row as TtsCacheRecord;
}

export async function incrementHitCount(id: number): Promise<void> {
  await runStatement(
    `
      UPDATE tts_cache
      SET hit_count = hit_count + 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [id],
  );
}

export async function saveCacheEntry(params: {
  key: TtsCacheLookupKey;
  audioBuffer: Buffer;
  charCount: number;
}): Promise<TtsCacheRecord> {
  const relativeAudioPath = buildRelativeAudioPath(params.key);
  const absoluteAudioPath = path.join(getCacheRoot(), relativeAudioPath);

  ensureDir(path.dirname(absoluteAudioPath));
  fs.writeFileSync(absoluteAudioPath, params.audioBuffer);

  const existing = await findByCacheKey(params.key);
  if (existing) {
    await runStatement(
      `
        UPDATE tts_cache
        SET audio_path = ?,
            char_count = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [relativeAudioPath, params.charCount, existing.id],
    );

    const refreshed = await findByCacheKey(params.key);
    if (!refreshed) {
      throw new Error('Failed to refresh TTS cache entry.');
    }
    return refreshed;
  }

  let result: { lastID: number; changes: number };
  try {
    result = await runStatement(
      `
        INSERT INTO tts_cache (
          provider,
          voice,
          speed,
          lang,
          usage,
          content_version,
          text_hash,
          audio_path,
          char_count,
          hit_count
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
      `,
      [
        params.key.provider,
        params.key.voice,
        params.key.speed,
        params.key.lang,
        params.key.usage,
        params.key.contentVersion,
        params.key.textHash,
        relativeAudioPath,
        params.charCount,
      ],
    );
  } catch (error: any) {
    if (String(error?.message || '').toLowerCase().includes('unique')) {
      const racedRow = await findByCacheKey(params.key);
      if (racedRow) {
        return racedRow;
      }
    }
    throw error;
  }

  const row = await getOne(
    `
      SELECT
        id,
        provider,
        voice,
        speed,
        lang,
        usage,
        content_version AS contentVersion,
        text_hash AS textHash,
        audio_path AS audioPath,
        char_count AS charCount,
        hit_count AS hitCount,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM tts_cache
      WHERE id = ?
      LIMIT 1
    `,
    [result.lastID],
  );

  if (!row) {
    throw new Error('Failed to load newly inserted TTS cache entry.');
  }

  return row as TtsCacheRecord;
}

export async function getMonthlyUsage(): Promise<number> {
  const row = await getOne(
    `
      SELECT COALESCE(SUM(char_count), 0) AS totalChars
      FROM tts_cache
      WHERE strftime('%Y-%m', created_at, 'localtime') = strftime('%Y-%m', 'now', 'localtime')
    `,
  );

  return Number(row?.totalChars || 0);
}

export async function getCacheStats() {
  const summary = await getOne(
    `
      SELECT
        COUNT(*) AS totalFiles,
        COALESCE(SUM(char_count), 0) AS totalChars,
        COALESCE(SUM(hit_count), 0) AS totalHits
      FROM tts_cache
    `,
  );

  const today = await getOne(
    `
      SELECT
        COUNT(*) AS files,
        COALESCE(SUM(char_count), 0) AS chars
      FROM tts_cache
      WHERE date(created_at, 'localtime') = date('now', 'localtime')
    `,
  );

  const month = await getOne(
    `
      SELECT
        COUNT(*) AS files,
        COALESCE(SUM(char_count), 0) AS chars
      FROM tts_cache
      WHERE strftime('%Y-%m', created_at, 'localtime') = strftime('%Y-%m', 'now', 'localtime')
    `,
  );

  const byUsage = await getAll(
    `
      SELECT
        usage,
        COUNT(*) AS files,
        COALESCE(SUM(char_count), 0) AS chars,
        COALESCE(SUM(hit_count), 0) AS hits
      FROM tts_cache
      GROUP BY usage
      ORDER BY usage ASC
    `,
  );

  const byDay = await getAll(
    `
      SELECT
        strftime('%Y-%m-%d', created_at, 'localtime') AS day,
        COUNT(*) AS files,
        COALESCE(SUM(char_count), 0) AS chars
      FROM tts_cache
      WHERE strftime('%Y-%m', created_at, 'localtime') = strftime('%Y-%m', 'now', 'localtime')
      GROUP BY strftime('%Y-%m-%d', created_at, 'localtime')
      ORDER BY day DESC
      LIMIT 31
    `,
  );

  return {
    totalFiles: Number(summary?.totalFiles || 0),
    totalChars: Number(summary?.totalChars || 0),
    totalHits: Number(summary?.totalHits || 0),
    today: {
      files: Number(today?.files || 0),
      chars: Number(today?.chars || 0),
    },
    month: {
      files: Number(month?.files || 0),
      chars: Number(month?.chars || 0),
    },
    byUsage,
    byDay,
  };
}

export async function deleteCache(filters: TtsCacheDeleteFilters = {}): Promise<{ deletedRows: number; deletedFiles: number }> {
  const clauses: string[] = [];
  const params: Array<string | number> = [];

  if (filters.provider) {
    clauses.push('provider = ?');
    params.push(filters.provider);
  }

  if (filters.contentVersion) {
    clauses.push('content_version = ?');
    params.push(filters.contentVersion);
  }

  if (filters.usage) {
    clauses.push('usage = ?');
    params.push(filters.usage);
  }

  const whereSql = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
  const rows = await getAll(
    `
      SELECT id, audio_path AS audioPath
      FROM tts_cache
      ${whereSql}
    `,
    params,
  );

  for (const row of rows) {
    const absoluteAudioPath = path.join(getCacheRoot(), String(row.audioPath));
    if (fs.existsSync(absoluteAudioPath)) {
      fs.unlinkSync(absoluteAudioPath);
      removeEmptyParents(path.dirname(absoluteAudioPath));
    }
  }

  const result = await runStatement(`DELETE FROM tts_cache ${whereSql}`, params);
  return {
    deletedRows: result.changes,
    deletedFiles: rows.length,
  };
}
