/**
 * useLicense — hook truy vấn license + feature gating
 *
 * Luồng hiện tại:
 *   1. App khởi động → đọc cache localStorage
 *   2. Nếu cache đã có customerId thì có thể refresh lại danh sách license khi cần
 *   3. Mọi component dùng hasFeature() / activeLicense để gate UI
 *   4. Nếu mất mạng → dùng cache trong offline grace period (mặc định 7 ngày)
 */
import { useState, useEffect, useCallback } from 'react';
import {
  fetchAndCacheLicenses,
  readLicenseCache,
  clearLicenseCache,
  isCacheWithinGrace,
  hasFeature as checkFeature,
  hasActiveLicense as checkActiveLicense,
  LicenseCache,
} from '../services/webTotalBridge';
import { verifyCap01License } from '../services/cap01License';

export interface UseLicenseReturn {
  /** Cache hiện tại (null = chưa có dữ liệu license đã lưu) */
  licenseCache: LicenseCache | null;
  /** true nếu đang fetch từ server */
  loading: boolean;
  /** Lỗi fetch gần nhất (không block offline grace) */
  error: string | null;
  /** Có ít nhất 1 license active không */
  isActive: boolean;
  /** Cache còn trong offline grace không */
  isWithinGrace: boolean;
  /** Kiểm tra 1 feature key cụ thể */
  hasFeature: (featureKey: string) => boolean;
  /** Refresh license từ server nếu cache cũ đã biết customerId */
  refreshLicenses: () => Promise<void>;
}

export function useLicense(): UseLicenseReturn {
  const [licenseCache, setLicenseCache] = useState<LicenseCache | null>(() => readLicenseCache());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshLicenses = useCallback(async () => {
    const currentCache = readLicenseCache();
    const customerId = currentCache?.customerId;

    if (!customerId) {
      setLicenseCache(currentCache);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // For cap01: verify via cap01License service (includes offline grace support)
      // For others: call old verify service
      await verifyCap01License({ force: false }).catch(() => null);
      const cache = await fetchAndCacheLicenses(customerId);
      setLicenseCache(cache);
    } catch (err: any) {
      const message = err?.message || 'Không thể refresh license.';
      if (/đang được sử dụng trên một thiết bị khác/i.test(message)) {
        clearLicenseCache();
        setLicenseCache(null);
      }
      setError(message);
      // Không xóa cache cũ — vẫn dùng offline grace
    } finally {
      setLoading(false);
    }
  }, []);

  // Luôn refresh khi app mở để bắt revoke/expire sớm, tránh giữ quyền local quá lâu.
  useEffect(() => {
    const cache = readLicenseCache();
    setLicenseCache(cache);

    if (!cache?.customerId) return;

    void refreshLicenses();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const cache = readLicenseCache();
    if (!cache?.customerId) return;

    const timer = window.setInterval(() => {
      void refreshLicenses();
    }, 60_000);

    return () => window.clearInterval(timer);
  }, [refreshLicenses]);

  const hasFeature = useCallback((featureKey: string) => checkFeature(featureKey), [licenseCache]); // eslint-disable-line react-hooks/exhaustive-deps
  const isActive = checkActiveLicense();
  const isWithinGrace = isCacheWithinGrace();

  return { licenseCache, loading, error, isActive, isWithinGrace, hasFeature, refreshLicenses };
}
