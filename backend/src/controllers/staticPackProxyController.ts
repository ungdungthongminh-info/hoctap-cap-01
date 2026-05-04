import { Request, Response as ExpressResponse } from 'express';
import fs from 'fs';
import path from 'path';

interface GradePackConfig {
  grade: number;
  fileId: string;
  fileName: string;
}

interface DrivePackEntry {
  grade: number;
  voice?: string;
  scope?: string;
  fileName: string;
  driveFileId?: string;
}

interface DrivePacksFile {
  packs?: DrivePackEntry[];
}

const DRIVE_PACKS_JSON_PATH = path.resolve(__dirname, '../../../public/audio/tts/drive-packs.json');

function normalizeGrade(value: string): number | null {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return null;

  if (raw === 'pre-k' || raw === 'prek' || raw === 'pre_k' || raw === '0') {
    return 0;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function findPackByGrade(gradeRaw: string): GradePackConfig | null {
  const grade = normalizeGrade(gradeRaw);
  if (grade === null) return null;

  let content: string;
  try {
    content = fs.readFileSync(DRIVE_PACKS_JSON_PATH, 'utf8');
  } catch {
    return null;
  }

  let parsed: DrivePacksFile;
  try {
    parsed = JSON.parse(content) as DrivePacksFile;
  } catch {
    return null;
  }

  const entries = Array.isArray(parsed.packs) ? parsed.packs : [];
  const matched = entries.find((item) => item.grade === grade && (item.voice || 'vi-v1') === 'vi-v1' && (item.scope || 'lesson-card') === 'lesson-card');
  if (!matched || !matched.fileName || !matched.driveFileId) return null;

  return {
    grade,
    fileName: matched.fileName,
    fileId: matched.driveFileId,
  };
}

interface DrivePackPayload {
  buffer: Buffer;
  contentType: string;
}

class DrivePackFetchError extends Error {
  reason: string;

  constructor(reason: string, message: string) {
    super(message);
    this.reason = reason;
  }
}

function isZipBuffer(buffer: Buffer): boolean {
  return buffer.length >= 4
    && buffer[0] === 0x50
    && buffer[1] === 0x4b
    && (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07)
    && (buffer[3] === 0x04 || buffer[3] === 0x06 || buffer[3] === 0x08);
}

function isZipContentType(contentType: string): boolean {
  const normalized = String(contentType || '').toLowerCase();
  return normalized.startsWith('application/zip') || normalized.startsWith('application/octet-stream');
}

function isHtmlResponse(contentType: string, buffer: Buffer): boolean {
  const normalized = String(contentType || '').toLowerCase();
  if (normalized.startsWith('text/html')) return true;
  const header = buffer.subarray(0, Math.min(buffer.length, 256)).toString('utf8').toLowerCase();
  return header.includes('<!doctype html') || header.includes('<html');
}

function decodeHtmlHref(value: string): string {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&#x3d;/gi, '=')
    .replace(/&#61;/g, '=');
}

function extractDriveConfirmUrl(html: string, baseUrl: string): string | null {
  const hrefMatches = html.match(/(?:href|action)="([^"]+)"/gi) || [];
  for (const token of hrefMatches) {
    const match = token.match(/(?:href|action)="([^"]+)"/i);
    if (!match) continue;
    const decoded = decodeHtmlHref(match[1]);
    if (!decoded) continue;
    const hasDriveDownloadPath = decoded.includes('/uc?') || decoded.includes('/download?') || decoded.includes('drive.usercontent.google.com/download');
    const hasConfirmSignal = decoded.includes('confirm=') || decoded.includes('uuid=');
    if (!hasDriveDownloadPath || !hasConfirmSignal) continue;
    try {
      return new URL(decoded, baseUrl).toString();
    } catch {
      continue;
    }
  }

  const inlineMatch = html.match(/(https?:\/\/drive\.usercontent\.google\.com\/download[^"'\s<]+)/i)
    || html.match(/(https?:\/\/drive\.google\.com\/uc\?[^"'\s<]+)/i)
    || html.match(/(\/uc\?[^"'\s<]*confirm=[^"'\s<]+)/i)
    || html.match(/(\/download\?[^"'\s<]*confirm=[^"'\s<]+)/i);
  if (!inlineMatch) return null;

  const decoded = decodeHtmlHref(inlineMatch[1]);
  try {
    return new URL(decoded, baseUrl).toString();
  } catch {
    return null;
  }
}

function getSetCookieHeaders(response: Response): string[] {
  const headers = response.headers as Headers & { getSetCookie?: () => string[] };
  if (typeof headers.getSetCookie === 'function') {
    return headers.getSetCookie();
  }
  const single = response.headers.get('set-cookie');
  return single ? [single] : [];
}

function mergeCookies(current: string, setCookieHeaders: string[]): string {
  const jar = new Map<string, string>();

  const appendCookie = (cookieLine: string) => {
    const pair = String(cookieLine || '').split(';')[0]?.trim();
    if (!pair || !pair.includes('=')) return;
    const idx = pair.indexOf('=');
    const key = pair.slice(0, idx).trim();
    const value = pair.slice(idx + 1).trim();
    if (!key) return;
    jar.set(key, value);
  };

  if (current) {
    current.split(';').forEach((part) => appendCookie(part.trim()));
  }
  setCookieHeaders.forEach((header) => appendCookie(header));

  return Array.from(jar.entries()).map(([key, value]) => `${key}=${value}`).join('; ');
}

async function fetchDrivePack(fileId: string): Promise<DrivePackPayload> {
  let requestUrl = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`;
  let cookieHeader = '';

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch(requestUrl, {
      redirect: 'follow',
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    });
    cookieHeader = mergeCookies(cookieHeader, getSetCookieHeaders(response));

    const status = response.status;
    const contentType = response.headers.get('content-type') || '';
    const contentLengthRaw = response.headers.get('content-length');
    const contentLength = Number(contentLengthRaw || 0);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!response.ok) {
      throw new DrivePackFetchError('google-drive-http-error', `Drive HTTP ${status}`);
    }

    if (isZipBuffer(buffer)) {
      if (!isZipContentType(contentType)) {
        throw new DrivePackFetchError('google-drive-non-zip-content-type', `Drive content-type is not zip/octet-stream: ${contentType || 'unknown'}`);
      }
      if (!contentLength || contentLength !== buffer.byteLength) {
        throw new DrivePackFetchError('google-drive-content-length-mismatch', `Drive content-length mismatch. header=${contentLengthRaw || 'missing'} actual=${buffer.byteLength}`);
      }

      return {
        buffer,
        contentType,
      };
    }

    if (isHtmlResponse(contentType, buffer)) {
      const html = buffer.toString('utf8');
      const confirmUrl = extractDriveConfirmUrl(html, response.url || requestUrl);
      if (!confirmUrl) {
        throw new DrivePackFetchError('google-drive-html-confirm-page', 'Google Drive returned HTML confirm/interstitial page without downloadable confirm URL.');
      }
      requestUrl = confirmUrl;
      continue;
    }

    throw new DrivePackFetchError('google-drive-invalid-zip', `Drive did not return a valid ZIP payload (${contentType || 'unknown content-type'}).`);
  }

  throw new DrivePackFetchError('google-drive-html-confirm-page', 'Google Drive remained on HTML confirm/interstitial page after confirm retries.');
}

export async function getStaticPackByGradeHandler(req: Request, res: ExpressResponse) {
  const pack = findPackByGrade(String(req.params.grade || ''));
  if (!pack) {
    return res.status(400).json({
      success: false,
      error: 'Pack not configured for this grade. Update public/audio/tts/drive-packs.json with driveFileId.',
    });
  }

  try {
    const drivePayload = await fetchDrivePack(pack.fileId);
    if (!drivePayload.buffer.byteLength) {
      return res.status(502).json({
        success: false,
        error: 'Drive returned empty file.',
      });
    }

    res.setHeader('Content-Type', drivePayload.contentType || 'application/zip');
    res.setHeader('Content-Length', String(drivePayload.buffer.byteLength));
    res.setHeader('Content-Disposition', `attachment; filename="${pack.fileName}"`);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(drivePayload.buffer);
  } catch (error: any) {
    const reason = error instanceof DrivePackFetchError
      ? error.reason
      : 'drive-fetch-failed';
    return res.status(502).json({
      success: false,
      error: `Cannot fetch static pack from Drive for grade ${pack.grade}.`,
      reason,
      details: String(error?.message || 'Unknown error'),
    });
  }
}
