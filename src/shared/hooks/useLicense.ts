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
  isCacheWithinGrace,
  hasFeature as checkFeature,
  hasActiveLicense as checkActiveLicense,
  LicenseCache,
} from '../services/webTotalBridge';

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
      const cache = await fetchAndCacheLicenses(customerId);
      setLicenseCache(cache);
    } catch (err: any) {
      setError(err?.message || 'Không thể refresh license.');
      // Không xóa cache cũ — vẫn dùng offline grace
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh khi cache cũ đã đủ lâu và còn customerId để đồng bộ lại.
  useEffect(() => {
    const cache = readLicenseCache();
    setLicenseCache(cache);

    if (!cache?.customerId) return;

    const cacheAge = cache ? Date.now() - new Date(cache.cachedAt).getTime() : Infinity;
    const ONE_HOUR = 60 * 60 * 1000;
    if (cacheAge > ONE_HOUR) {
      void refreshLicenses();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const hasFeature = useCallback((featureKey: string) => checkFeature(featureKey), [licenseCache]); // eslint-disable-line react-hooks/exhaustive-deps
  const isActive = checkActiveLicense();
  const isWithinGrace = isCacheWithinGrace();

  return { licenseCache, loading, error, isActive, isWithinGrace, hasFeature, refreshLicenses };
}
