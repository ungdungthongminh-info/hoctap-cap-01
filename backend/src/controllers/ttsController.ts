import crypto from 'crypto';
import { Readable } from 'node:stream';
import { Request, Response } from 'express';
import {
  deleteCache,
  getCacheStats,
  getMonthlyCharLimit,
  synthesizeSpeech,
  validateSynthesizeInput,
} from '../services/tts/TtsService';

interface RateLimitBucket {
  windowStartedAt: number;
  count: number;
  lastSeenAt: number;
  lastFingerprint: string;
}

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 45;
const RATE_LIMIT_REPEAT_COOLDOWN_MS = 1_200;
const buckets = new Map<string, RateLimitBucket>();

interface StaticPackSource {
  fileId: string;
  fileName: string;
}

const STATIC_PACK_BY_GRADE: Record<number, StaticPackSource> = {
  0: {
    fileId: '1tPIXTZ50LqgQxhutmvx8QE7IEc8uybTN',
    fileName: 'vi-v1-pre-k-2026-04-27-v1.zip',
  },
  1: {
    fileId: '1xhb4KGGklpH9U2Kl0tA1ER8CWSE3czmq',
    fileName: 'vi-v1-grade-1-2026-04-27-v1.zip',
  },
  2: {
    fileId: '1VY-VkQ9Wtunydd10rCCp_Xs9cTZRucyh',
    fileName: 'vi-v1-grade-2-2026-04-27-v1.zip',
  },
  3: {
    fileId: '1LKgjUtADcVkbDpvCkfzSNCdNoJG94YQv',
    fileName: 'vi-v1-grade-3-2026-04-27-v1.zip',
  },
  4: {
    fileId: '164Xxc7vlATmrBqSHd9EWSXnvk9Q37rFk',
    fileName: 'vi-v1-grade-4-2026-04-27-v1.zip',
  },
  5: {
    fileId: '1PinMxVGHSl-GkekhSvTYp5rLgmcUFOQV',
    fileName: 'vi-v1-grade-5-2026-04-27-v1.zip',
  },
  // Compatibility alias: some data flows treat this as pre-primary.
  6: {
    fileId: '1tPIXTZ50LqgQxhutmvx8QE7IEc8uybTN',
    fileName: 'vi-v1-pre-k-2026-04-27-v1.zip',
  },
};

function getRequestIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

function fingerprint(text: string, voiceId: string, speed: number): string {
  return crypto
    .createHash('sha1')
    .update(`${text}::${voiceId}::${speed}`)
    .digest('hex');
}

function ensureRateLimit(req: Request, text: string, voiceId: string, speed: number): string | null {
  const ip = getRequestIp(req);
  const now = Date.now();
  const textFingerprint = fingerprint(text, voiceId, speed);
  const bucket = buckets.get(ip);

  if (!bucket || now - bucket.windowStartedAt >= RATE_LIMIT_WINDOW_MS) {
    buckets.set(ip, {
      windowStartedAt: now,
      count: 1,
      lastSeenAt: now,
      lastFingerprint: textFingerprint,
    });
    return null;
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    return 'Too many TTS requests from this IP. Please slow down.';
  }

  if (bucket.lastFingerprint === textFingerprint && now - bucket.lastSeenAt < RATE_LIMIT_REPEAT_COOLDOWN_MS) {
    return 'Duplicate TTS request sent too quickly.';
  }

  bucket.count += 1;
  bucket.lastSeenAt = now;
  bucket.lastFingerprint = textFingerprint;
  return null;
}

function buildBaseUrl(req: Request): string {
  const proto = String(req.headers['x-forwarded-proto'] || req.protocol || 'http').trim();
  const host = String(req.headers['x-forwarded-host'] || req.get('host') || '').trim();
  return host ? `${proto}://${host}` : '';
}

export async function postSynthesize(req: Request, res: Response) {
  try {
    const normalized = validateSynthesizeInput(req.body || {});
    const rateLimitError = ensureRateLimit(req, normalized.text, normalized.voiceId, normalized.speed);
    if (rateLimitError) {
      return res.status(429).json({
        success: false,
        error: rateLimitError,
      });
    }

    const result = await synthesizeSpeech(normalized);
    const baseUrl = buildBaseUrl(req);
    const audioUrl = result.audioPath && baseUrl
      ? `${baseUrl}/tts-audio/${result.audioPath}`
      : undefined;

    return res.json({
      success: true,
      data: {
        audioUrl,
        cacheStatus: result.cacheStatus,
        provider: result.provider,
        voiceId: result.voiceId,
        fallbackNative: result.fallbackNative,
        warning: result.warning,
        lang: result.lang,
        speed: result.speed,
      },
    });
  } catch (error: any) {
    const message = String(error?.message || 'Failed to synthesize speech.');
    const status = /Unsupported usage|Text exceeds|Text is required|Text or ssml is required|voiceId/i.test(message) ? 400 : 500;
    return res.status(status).json({
      success: false,
      error: message,
      fallbackNative: true,
    });
  }
}

export async function getCacheStatsHandler(_req: Request, res: Response) {
  try {
    const stats = await getCacheStats();
    return res.json({
      success: true,
      data: {
        ...stats,
        monthlyCharLimit: getMonthlyCharLimit(),
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: String(error?.message || 'Failed to load TTS cache stats.'),
    });
  }
}

export async function deleteCacheHandler(req: Request, res: Response) {
  try {
    const provider = String(req.query.provider || req.body?.provider || '').trim() || undefined;
    const contentVersion = String(req.query.contentVersion || req.body?.contentVersion || '').trim() || undefined;
    const usage = String(req.query.usage || req.body?.usage || '').trim() || undefined;

    const result = await deleteCache({ provider, contentVersion, usage });
    return res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: String(error?.message || 'Failed to delete TTS cache.'),
    });
  }
}

function resolveStaticPackByGrade(rawGrade: string): { grade: number; source: StaticPackSource } | null {
  const grade = Number.parseInt(String(rawGrade || '').trim(), 10);
  if (!Number.isFinite(grade)) {
    return null;
  }
  const source = STATIC_PACK_BY_GRADE[grade];
  if (!source) {
    return null;
  }
  return { grade, source };
}

function buildDriveDownloadUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`;
}

export async function getStaticPackByGradeHandler(req: Request, res: Response) {
  const resolved = resolveStaticPackByGrade(String(req.params.grade || ''));
  if (!resolved) {
    return res.status(400).json({
      success: false,
      error: 'Unsupported grade for static audio pack.',
    });
  }

  const { grade, source } = resolved;
  const upstreamUrl = buildDriveDownloadUrl(source.fileId);

  try {
    const upstream = await fetch(upstreamUrl, {
      method: 'GET',
      redirect: 'follow',
    });

    if (!upstream.ok || !upstream.body) {
      return res.status(502).json({
        success: false,
        error: `Static pack upstream failed (HTTP ${upstream.status}).`,
      });
    }

    const contentType = String(upstream.headers.get('content-type') || '').toLowerCase();
    if (!contentType.includes('zip') && contentType.includes('text/html')) {
      return res.status(502).json({
        success: false,
        error: 'Static pack upstream returned HTML instead of ZIP.',
      });
    }

    res.status(200);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${source.fileName}"`);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Static-Pack-Grade', String(grade));
    res.setHeader('X-Static-Pack-Source', 'google-drive-proxy');
    const upstreamLength = upstream.headers.get('content-length');
    if (upstreamLength) {
      res.setHeader('Content-Length', upstreamLength);
    }

    Readable.fromWeb(upstream.body as any)
      .on('error', () => {
        if (!res.headersSent) {
          res.status(502).end();
        } else {
          res.end();
        }
      })
      .pipe(res);
  } catch (error: any) {
    return res.status(502).json({
      success: false,
      error: String(error?.message || 'Failed to proxy static pack from upstream.'),
    });
  }
}
