interface WebTotalCatalogProduct {
  id: string;
  appId?: string;
  name?: string;
  cycle?: string;
  price?: number;
  currency?: string;
  isActive?: boolean;
}

interface WebTotalCatalogResponse {
  apps?: Array<{ id: string; name?: string }>;
  products?: WebTotalCatalogProduct[];
}

interface WebTotalCreateOrderResponse {
  order?: {
    id?: string;
    orderCode?: string;
    amount?: number;
    createdAt?: string;
  };
  product?: WebTotalCatalogProduct;
  checkoutUrl?: string;
}

interface WebTotalOrderDetailsResponse {
  order?: {
    id?: string;
    orderCode?: string;
    amount?: number;
    status?: string;
    paymentStatus?: string;
    paidAt?: string | null;
    productId?: string;
  };
  product?: WebTotalCatalogProduct;
  customer?: { id?: string; email?: string; fullName?: string };
}

interface ProductResolution {
  productId: string;
  product?: WebTotalCatalogProduct;
}

const DEFAULT_APP_ID = 'app-study-12';
const PRODUCT_KEY_SEPARATOR = ':';

function normalizeBaseUrl(url?: string): string {
  return String(url || '').trim().replace(/\/+$/, '');
}

/** Key dùng trong env WEB_TOTAL_PRODUCT_MAP_JSON: "standard:lifetime" */
function buildProductKey(planId: string, billingCycle: string): string {
  return `${planId}${PRODUCT_KEY_SEPARATOR}${billingCycle}`;
}

/** Catalog của Web tổng dùng cycle "one_time" cho gói lifetime */
function catalogCyclesFor(billingCycle: string): string[] {
  return billingCycle === 'lifetime' ? ['one_time', 'lifetime'] : [billingCycle];
}

function getProductMap(): Record<string, string | null> {
  const raw = process.env.WEB_TOTAL_PRODUCT_MAP_JSON;
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  const data: any = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    const error = new Error(String(msg)) as Error & {
      statusCode?: number;
      errorCode?: string;
      details?: any;
    };
    error.statusCode = res.status;
    error.errorCode = data?.errorCode;
    error.details = data;
    throw error;
  }

  return data as T;
}

async function fetchJsonWithFallback<T>(urls: string[], init?: RequestInit): Promise<T> {
  const attempts: string[] = [];

  for (const url of urls) {
    try {
      return await fetchJson<T>(url, init);
    } catch (error: any) {
      const message = String(error?.message || 'Unknown error');
      attempts.push(`${url} -> ${message}`);

      // Retry next URL only for route-not-found style errors.
      const isNotFound = /\b404\b|\bNOT_FOUND\b|page could not be found/i.test(message);
      if (!isNotFound) {
        throw error;
      }
    }
  }

  throw new Error(`Verify endpoint not found on Web Tong. Attempts: ${attempts.join(' | ')}`);
}

export class WebSalesTotalService {
  static isEnabled(): boolean {
    return normalizeBaseUrl(process.env.WEB_TOTAL_BASE_URL).length > 0;
  }

  static getAppId(): string {
    return process.env.WEB_TOTAL_APP_ID || DEFAULT_APP_ID;
  }

  static getBaseUrl(): string {
    return normalizeBaseUrl(process.env.WEB_TOTAL_BASE_URL);
  }

  static toAbsoluteUrl(pathOrUrl?: string): string {
    if (!pathOrUrl) return '';
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
    return `${this.getBaseUrl()}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
  }

  static async getCatalog(): Promise<WebTotalCatalogResponse> {
    return fetchJson<WebTotalCatalogResponse>(`${this.getBaseUrl()}/api/catalog`);
  }

  static async resolveProduct(planId: string, billingCycle: string): Promise<ProductResolution> {
    const productMap = getProductMap();
    const key = buildProductKey(planId, billingCycle);
    if (Object.prototype.hasOwnProperty.call(productMap, key)) {
      const mapped = productMap[key];
      if (!mapped) {
        throw new Error(
          `Gói ${planId}/${billingCycle} chưa hỗ trợ thanh toán trực tuyến qua Web tổng.`
        );
      }
      return { productId: mapped };
    }

    // Fallback: tìm trong catalog (catalog dùng cycle "one_time" cho gói lifetime)
    const catalog = await this.getCatalog();
    const validCycles = catalogCyclesFor(billingCycle);
    const appId = this.getAppId();
    const normalizedPlan = planId.toLowerCase();

    const product = (catalog.products || []).find((item) => {
      const itemAppId = String(item.appId || '').toLowerCase();
      const itemCycle = String(item.cycle || '').toLowerCase();
      const haystack = `${item.id || ''} ${item.name || ''}`.toLowerCase();
      return itemAppId === appId.toLowerCase() && validCycles.includes(itemCycle) && haystack.includes(normalizedPlan);
    });

    if (!product?.id) {
      throw new Error(
        `Không tìm thấy product trên Web tổng cho ${planId}/${billingCycle}. Hãy cấu hình WEB_TOTAL_PRODUCT_MAP_JSON.`
      );
    }

    return { productId: product.id, product };
  }

  static async createOrder(customerId: string, planId: string, billingCycle: string): Promise<WebTotalCreateOrderResponse> {
    const resolved = await this.resolveProduct(planId, billingCycle);
    return fetchJson<WebTotalCreateOrderResponse>(`${this.getBaseUrl()}/api/orders`, {
      method: 'POST',
      body: JSON.stringify({
        customerId,
        appId: this.getAppId(),
        productId: resolved.productId,
      }),
    });
  }

  static async getOrder(orderId: string): Promise<WebTotalOrderDetailsResponse> {
    return fetchJson<WebTotalOrderDetailsResponse>(`${this.getBaseUrl()}/api/orders/${encodeURIComponent(orderId)}`);
  }
}

// ─── AI App License API (OpenAPI v1.2.0) ──────────────────────────────────────

export interface AiAppLicense {
  id: string;
  customerId: string;
  appId: string;
  productId: string;
  orderId?: string | null;
  planCode?: string | null;
  billingCycle?: string | null;
  licenseKey: string;
  status: 'inactive' | 'active' | 'suspended' | 'expired' | 'revoked';
  activatedAt?: string | null;
  expiresAt?: string | null;
  deviceId?: string | null;
  deviceName?: string | null;
  lastVerifiedAt?: string | null;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  features?: string[];
  grace?: {
    allowed: boolean;
    graceDays: number;
    offlineUntil?: string;
  };
}

export interface AiAppLicensesResponse {
  customerId: string;
  appId?: string | null;
  licenses: AiAppLicense[];
}

export interface AiAppVerifyResponse {
  ok: boolean;
  license: AiAppLicense;
  features: string[];
  grace: { allowed: boolean; graceDays: number; offlineUntil?: string };
}

export interface AiAppCustomerAuthResponse {
  ok: boolean;
  customer?: {
    id?: string;
    email?: string;
    fullName?: string;
  };
  licenses?: Array<{
    licenseKey?: string;
    appId?: string;
    tier?: string;
    period?: string;
    status?: string;
    expiresAt?: string | null;
  }>;
  needsPassword?: boolean;
  message?: string;
}

function getAiAppKey(): string {
  return String(process.env.WEB_TOTAL_AI_APP_KEY || '').trim();
}

function aiAppHeaders(): Record<string, string> {
  const key = getAiAppKey();
  return {
    'Content-Type': 'application/json',
    ...(key ? { 'x-ai-app-key': key } : {}),
  };
}

export class WebAiAppLicenseService {
  static isEnabled(): boolean {
    return WebSalesTotalService.isEnabled() && getAiAppKey().length > 0;
  }

  /** POST /api/ai-app/customer/auth */
  static async authenticateCustomer(params: {
    email: string;
    password: string;
    appId?: string;
  }): Promise<AiAppCustomerAuthResponse> {
    const baseUrl = WebSalesTotalService.getBaseUrl();
    const res = await fetch(`${baseUrl}/api/ai-app/customer/auth`, {
      method: 'POST',
      headers: aiAppHeaders(),
      body: JSON.stringify({
        email: params.email,
        password: params.password,
        appId: params.appId || WebSalesTotalService.getAppId(),
      }),
    });

    const data: any = await res.json().catch(() => ({}));
    if (!res.ok) {
      const error = new Error(String(data?.message || data?.error || `HTTP ${res.status}`)) as Error & {
        statusCode?: number;
        details?: any;
      };
      error.statusCode = res.status;
      error.details = data;
      throw error;
    }

    return data as AiAppCustomerAuthResponse;
  }

  /** GET /api/ai-app/customers/{customerId}/licenses?appId= */
  static async getCustomerLicenses(customerId: string, appId?: string): Promise<AiAppLicensesResponse> {
    const baseUrl = WebSalesTotalService.getBaseUrl();
    const aid = encodeURIComponent(appId || WebSalesTotalService.getAppId());
    const cid = encodeURIComponent(customerId);
    const url = `${baseUrl}/api/ai-app/customers/${cid}/licenses?appId=${aid}`;
    return fetchJson<AiAppLicensesResponse>(url, { headers: aiAppHeaders() });
  }

  /** POST /api/ai-app/licenses/verify */
  static async verifyLicense(params: {
    licenseKey: string;
    appId?: string;
    customerId?: string;
    deviceId?: string;
    deviceName?: string;
  }): Promise<AiAppVerifyResponse> {
    const baseUrl = WebSalesTotalService.getBaseUrl();
    const verifyPaths = ['/api/ai-app/licenses/verify'];
    const verifyUrls = verifyPaths.map((path) => `${baseUrl}${path}`);

    return fetchJsonWithFallback<AiAppVerifyResponse>(verifyUrls, {
      method: 'POST',
      headers: aiAppHeaders(),
      body: JSON.stringify({
        licenseKey: params.licenseKey,
        appId: params.appId || WebSalesTotalService.getAppId(),
        ...(params.customerId ? { customerId: params.customerId } : {}),
        ...(params.deviceId ? { deviceId: params.deviceId } : {}),
        ...(params.deviceName ? { deviceName: params.deviceName } : {}),
      }),
    });
  }
}

export default WebSalesTotalService;