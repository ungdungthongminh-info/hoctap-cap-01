import { Request, Response } from 'express';
import { WebAiAppLicenseService } from '../services/WebSalesTotalService';

function mapError(err: any): { status: number; errorCode: string; message: string } {
  const status = Number(err?.statusCode || 500);
  const details = err?.details || {};
  const message = String(details?.message || details?.error || err?.message || 'Internal error');

  if (status === 400) {
    return { status, errorCode: 'INVALID_REQUEST', message };
  }
  if (status === 401 || status === 403) {
    return { status: 401, errorCode: 'UNAUTHORIZED_APP_KEY', message };
  }
  if (status === 404) {
    return { status, errorCode: 'LICENSE_NOT_FOUND_OR_INVALID', message };
  }
  if (status === 409) {
    return { status, errorCode: 'DEVICE_MISMATCH', message };
  }

  return { status: status >= 500 ? status : 500, errorCode: 'INTERNAL_ERROR', message };
}

/**
 * GET /api/v1/ai-app/customers/:customerId/licenses?appId=
 * Proxy → Web tổng /api/ai-app/customers/:customerId/licenses
 * Auth: Bearer bridge token (validated by authMiddleware upstream)
 * Giữ x-ai-app-key server-side — không bao giờ expose ra frontend.
 */
export async function proxyGetCustomerLicenses(req: Request, res: Response): Promise<void> {
  const { customerId } = req.params;
  const appId = req.query.appId as string | undefined;

  if (!customerId) {
    res.status(400).json({ ok: false, success: false, errorCode: 'INVALID_REQUEST', message: 'customerId is required' });
    return;
  }

  if (!WebAiAppLicenseService.isEnabled()) {
    // Fallback khi chưa có AI app key → trả empty (app sẽ dùng local feature map)
    res.json({ ok: true, success: true, data: { customerId, appId: appId ?? null, licenses: [] } });
    return;
  }

  try {
    const result = await WebAiAppLicenseService.getCustomerLicenses(customerId, appId);
    res.json({ ok: true, success: true, data: result });
  } catch (err: any) {
    const mapped = mapError(err);
    res.status(mapped.status).json({ ok: false, success: false, errorCode: mapped.errorCode, message: mapped.message });
  }
}

/**
 * POST /api/v1/ai-app/licenses/verify
 * Proxy → Web tổng /api/ai-app/licenses/verify
 * Body: { licenseKey, appId?, customerId?, deviceId?, deviceName? }
 */
export async function proxyVerifyLicense(req: Request, res: Response): Promise<void> {
  const { licenseKey, appId, customerId, deviceId, deviceName, clientProfile } = req.body || {};
  const resolvedAppId = String(appId || process.env.WEB_TOTAL_APP_ID || 'app-study-12').trim();
  const resolvedClientProfile = String(clientProfile || '').trim().toLowerCase();
  const finalClientProfile: 'web' | 'desktop' | 'shared' =
    resolvedClientProfile === 'web' || resolvedClientProfile === 'desktop' || resolvedClientProfile === 'shared'
      ? resolvedClientProfile
      : 'desktop';

  if (!licenseKey) {
    res.status(400).json({ ok: false, success: false, errorCode: 'INVALID_REQUEST', message: 'licenseKey is required' });
    return;
  }

  if (!WebAiAppLicenseService.isEnabled()) {
    res.status(503).json({ ok: false, success: false, errorCode: 'INTERNAL_ERROR', message: 'License service not configured' });
    return;
  }

  try {
    const result = await WebAiAppLicenseService.verifyLicense({
      licenseKey,
      appId: resolvedAppId,
      customerId,
      deviceId,
      deviceName,
      clientProfile: finalClientProfile,
    });
    res.json({ ok: true, success: true, data: result });
  } catch (err: any) {
    const mapped = mapError(err);
    res.status(mapped.status).json({ ok: false, success: false, errorCode: mapped.errorCode, message: mapped.message });
  }
}

/**
 * POST /api/v1/ai-app/licenses/lock-standard-grades
 * Proxy → Web tổng /api/ai-app/licenses/lock-standard-grades
 * Body: { licenseKey, appId?, customerId?, selectedGrades, requiredGradeCount, clientProfile? }
 */
export async function proxyLockStandardGrades(req: Request, res: Response): Promise<void> {
  const { licenseKey, appId, customerId, selectedGrades, requiredGradeCount, clientProfile } = req.body || {};
  const resolvedAppId = String(appId || process.env.WEB_TOTAL_APP_ID || 'app-study-12').trim();
  const resolvedClientProfile = String(clientProfile || '').trim().toLowerCase();
  const finalClientProfile: 'web' | 'desktop' | 'shared' =
    resolvedClientProfile === 'web' || resolvedClientProfile === 'desktop' || resolvedClientProfile === 'shared'
      ? resolvedClientProfile
      : 'desktop';

  if (!licenseKey) {
    res.status(400).json({ ok: false, success: false, errorCode: 'INVALID_REQUEST', message: 'licenseKey is required' });
    return;
  }
  if (!Array.isArray(selectedGrades) || !Number.isInteger(Number(requiredGradeCount)) || Number(requiredGradeCount) <= 0) {
    res.status(400).json({
      ok: false,
      success: false,
      errorCode: 'INVALID_REQUEST',
      message: 'selectedGrades and requiredGradeCount are required'
    });
    return;
  }

  if (!WebAiAppLicenseService.isEnabled()) {
    res.status(503).json({ ok: false, success: false, errorCode: 'INTERNAL_ERROR', message: 'License service not configured' });
    return;
  }

  try {
    const result = await WebAiAppLicenseService.lockStandardGrades({
      licenseKey,
      appId: resolvedAppId,
      customerId,
      selectedGrades,
      requiredGradeCount: Number(requiredGradeCount),
      clientProfile: finalClientProfile,
    });
    res.json({ ok: true, success: true, data: result });
  } catch (err: any) {
    const mapped = mapError(err);
    res.status(mapped.status).json({ ok: false, success: false, errorCode: mapped.errorCode, message: mapped.message });
  }
}
