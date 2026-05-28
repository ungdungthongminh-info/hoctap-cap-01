/**
 * Auth Bridge Service - Kết nối login/license với Web chủ
 * Sử dụng Clerk JWT token để xác thực với web chủ API
 */
import { useAuth } from '@clerk/clerk-react';

const WEB_TOTAL_API = 'https://hochungkhoi.site/api';

export interface Entitlement {
  appId: string;
  productId: string;
  plan: string;
  status: string;
  expiresAt: string | null;
  features: string[];
}

export interface ActiveProduct {
  productId: string;
  productName: string;
  plan: string;
  expiresAt: string | null;
  activatedGrades: number[];
}

export interface CheckEntitlementsResult {
  ok: boolean;
  loggedIn: boolean;
  userId?: string;
  email?: string;
  entitlements: Entitlement[];
  activeProducts: ActiveProduct[];
  allowedGrades: number[];
  hasPendingOrder: boolean;
  hasPaidOrder: boolean;
  message?: string;
  error?: string;
}

export interface AuthStatus {
  status: 'loading' | 'not_logged_in' | 'no_license' | 'has_license' | 'error';
  email?: string;
  entitlements?: Entitlement[];
  allowedGrades?: number[];
  message?: string;
}

/**
 * Hook để check entitlements từ web chủ
 * Dùng trong App Cấp 01 để kiểm tra login/license
 */
export function useWebTotalAuth() {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const checkEntitlements = async (): Promise<AuthStatus> => {
    if (!isLoaded) {
      return { status: 'loading' };
    }

    if (!isSignedIn) {
      return { status: 'not_logged_in' };
    }

    try {
      const token = await getToken();

      const response = await fetch(`${WEB_TOTAL_API}/auth/check-entitlements`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data: CheckEntitlementsResult = await response.json();

      if (!data.ok || !data.loggedIn) {
        return {
          status: 'not_logged_in',
          message: data.error || 'Không xác thực được người dùng',
        };
      }

      if (data.entitlements.length === 0 && !data.hasPaidOrder) {
        return {
          status: 'no_license',
          email: data.email,
          entitlements: [],
          allowedGrades: [],
          message: 'Tài khoản chưa có gói học',
        };
      }

      return {
        status: 'has_license',
        email: data.email,
        entitlements: data.entitlements,
        allowedGrades: data.allowedGrades,
        message: data.message,
      };

    } catch (err) {
      console.error('[AuthBridge] Error checking entitlements:', err);
      return {
        status: 'error',
        message: 'Không kiểm tra được quyền học, vui lòng thử lại',
      };
    }
  };

  return {
    isLoaded,
    isSignedIn,
    checkEntitlements,
  };
}

/**
 * Lấy Clerk token cho API calls
 */
export async function getClerkToken(getToken: () => Promise<string | null>): Promise<string | null> {
  try {
    return await getToken();
  } catch {
    return null;
  }
}