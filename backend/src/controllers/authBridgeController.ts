import { Request, Response } from 'express';
import WebTotalBridgeSessionService from '../services/WebTotalBridgeSessionService';

function readBridgeToken(req: Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  const headerToken = req.headers['x-bridge-session'];
  if (typeof headerToken === 'string' && headerToken.trim()) {
    return headerToken.trim();
  }

  throw new Error('Thiếu bridge token.');
}

export async function bridgeCustomerLogin(req: Request, res: Response) {
  try {
    if (!WebTotalBridgeSessionService.isEnabled()) {
      return res.status(400).json({ error: 'WEB_TOTAL_BASE_URL chưa được cấu hình.' });
    }

    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const result = await WebTotalBridgeSessionService.login(String(email), String(password));
    res.json({ success: true, data: result });
  } catch (error: any) {
    const statusCode = Number(error?.statusCode) || 401;
    res.status(statusCode).json({
      error: error?.message || 'Đăng nhập bridge thất bại.',
      ...(error?.details?.needsPassword ? { needsPassword: true } : {}),
      ...(error?.details?.ok === false ? { ok: false } : {}),
    });
  }
}

export async function bridgeAuthMe(req: Request, res: Response) {
  try {
    const token = readBridgeToken(req);
    const snapshot = await WebTotalBridgeSessionService.getSnapshot(token);
    res.json({ success: true, data: snapshot });
  } catch (error: any) {
    res.status(401).json({ error: error?.message || 'Không lấy được auth/me từ Web tổng.' });
  }
}

export async function bridgeCustomerSnapshot(req: Request, res: Response) {
  return bridgeAuthMe(req, res);
}

export async function bridgeCustomerLogout(req: Request, res: Response) {
  try {
    const token = readBridgeToken(req);
    const result = await WebTotalBridgeSessionService.logout(token);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(401).json({ error: error?.message || 'Đăng xuất bridge thất bại.' });
  }
}