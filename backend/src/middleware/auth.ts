import { Request, Response, NextFunction } from 'express';

/**
 * For now, simple token-based auth (JWT would be better for production)
 * This middleware extracts userId from request headers or body
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Try to get userId from:
    // 1. Authorization header (Bearer token)
    // 2. x-user-id header
    // 3. Body (for testing)

    let userId: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // In production, verify JWT here
      userId = authHeader.substring(7);
    }

    if (!userId) {
      userId = req.headers['x-user-id'] as string;
    }

    if (!userId && req.body && req.body.userId) {
      userId = req.body.userId;
    }

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized - No user ID provided' });
    }

    // Attach userId to request
    (req as any).userId = userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

/**
 * Optional CORS middleware (can also use cors package)
 */
export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'https://hoctap-cap-01.vercel.app',
    'https://www.ungdungthongminh.shop'
  ];
  const envOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
  const allowedOrigins = envOrigins.length > 0 ? envOrigins : defaultOrigins;
  const origin = req.headers.origin as string | undefined;

  const isPrivateNetworkOrigin = (value: string): boolean => {
    try {
      const parsed = new URL(value);
      const host = parsed.hostname;
      return host === 'localhost'
        || host === '127.0.0.1'
        || host === '::1'
        || /^10\./.test(host)
        || /^192\.168\./.test(host)
        || /^172\.(1[6-9]|2\d|3[0-1])\./.test(host);
    } catch {
      return false;
    }
  };

  if (origin && (allowedOrigins.includes(origin) || isPrivateNetworkOrigin(origin))) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
  }

  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-user-id,x-bridge-session');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
}

/**
 * Error handler middleware
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
}
