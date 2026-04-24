import { randomBytes } from 'crypto';
import WebSalesTotalService, { WebAiAppLicenseService } from './WebSalesTotalService';

interface BridgeCustomer {
  id?: string;
  email?: string;
  fullName?: string;
}

interface BridgeSession {
  token: string;
  customer?: BridgeCustomer;
  licenses?: Array<{
    licenseKey?: string;
    appId?: string;
    tier?: string;
    period?: string;
    status?: string;
    expiresAt?: string | null;
  }>;
  createdAt: number;
  lastUsedAt: number;
}

const sessionStore = new Map<string, BridgeSession>();
const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function getTtlMs(): number {
  const ttl = Number(process.env.WEB_TOTAL_BRIDGE_SESSION_TTL_MS || DEFAULT_TTL_MS);
  return Number.isFinite(ttl) && ttl > 0 ? ttl : DEFAULT_TTL_MS;
}

function now(): number {
  return Date.now();
}

function generateToken(): string {
  return `wtb_${randomBytes(18).toString('hex')}`;
}

function getBaseUrl(): string {
  const baseUrl = WebSalesTotalService.getBaseUrl();
  if (!baseUrl) {
    throw new Error('WEB_TOTAL_BASE_URL chưa được cấu hình.');
  }
  return baseUrl;
}

async function fetchBridgeJson<T>(path: string, init?: RequestInit): Promise<{ status: number; data: T; headers: Headers }> {
  const res = await fetch(`${getBaseUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  const data: any = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(String(data?.message || data?.error || `HTTP ${res.status}`));
  }

  return { status: res.status, data: data as T, headers: res.headers };
}

export class WebTotalBridgeSessionService {
  static isEnabled(): boolean {
    return WebSalesTotalService.isEnabled();
  }

  private static cleanupExpired() {
    const cutoff = now() - getTtlMs();
    for (const [token, session] of sessionStore.entries()) {
      if (session.lastUsedAt < cutoff) {
        sessionStore.delete(token);
      }
    }
  }

  static async login(email: string, password: string) {
    this.cleanupExpired();

    const data = await WebAiAppLicenseService.authenticateCustomer({
      email,
      password,
      appId: WebSalesTotalService.getAppId(),
    });

    if (!data?.ok || !data?.customer?.id) {
      throw new Error('Dang nhap AI-app that bai.');
    }

    const token = generateToken();
    sessionStore.set(token, {
      token,
      customer: data?.customer,
      licenses: Array.isArray(data?.licenses) ? data.licenses : [],
      createdAt: now(),
      lastUsedAt: now(),
    });

    return {
      bridgeToken: token,
      customer: data?.customer || null,
    };
  }

  static getSession(token: string): BridgeSession {
    this.cleanupExpired();
    const session = sessionStore.get(token);
    if (!session) {
      throw new Error('Bridge session không tồn tại hoặc đã hết hạn.');
    }
    session.lastUsedAt = now();
    return session;
  }

  static async getSnapshot(token: string) {
    const session = this.getSession(token);
    if (!session.customer?.id) {
      throw new Error('Khong lay duoc customerId tu bridge session.');
    }

    let licenses = session.licenses || [];
    try {
      const licensePayload = await WebAiAppLicenseService.getCustomerLicenses(session.customer.id, WebSalesTotalService.getAppId());
      licenses = (licensePayload.licenses || []).map((license) => ({
        licenseKey: license.licenseKey,
        appId: license.appId,
        tier: license.planCode || undefined,
        period: license.billingCycle || undefined,
        status: license.status,
        expiresAt: license.expiresAt || null,
      }));
      session.licenses = licenses;
    } catch {
      // fallback ve licenses tu session login neu upstream tam thoi loi
    }

    return {
      customer: session.customer,
      licenses,
    };
  }

  static async resolveCustomer(token: string): Promise<BridgeCustomer> {
    const session = this.getSession(token);
    if (session.customer?.id) {
      return session.customer;
    }

    const snapshot = await this.getSnapshot(token);
    const customer = (snapshot?.customer || snapshot) as BridgeCustomer | undefined;
    if (!customer?.id) {
      throw new Error('Không lấy được customerId từ phiên Web tổng.');
    }

    session.customer = customer;
    return customer;
  }

  static async logout(token: string) {
    this.getSession(token);
    sessionStore.delete(token);
    return { ok: true };
  }
}

export default WebTotalBridgeSessionService;