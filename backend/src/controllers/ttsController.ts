import crypto from 'crypto';
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
    const status = /Unsupported usage|Text exceeds|Text is required|voiceId/i.test(message) ? 400 : 500;
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
