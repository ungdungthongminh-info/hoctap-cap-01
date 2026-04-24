import { Request, Response } from 'express';
import { WebAiAppLicenseService } from '../services/WebSalesTotalService';

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
    res.status(400).json({ success: false, error: 'customerId is required' });
    return;
  }

  if (!WebAiAppLicenseService.isEnabled()) {
    // Fallback khi chưa có AI app key → trả empty (app sẽ dùng local feature map)
    res.json({ success: true, data: { customerId, appId: appId ?? null, licenses: [] } });
    return;
  }

  try {
    const result = await WebAiAppLicenseService.getCustomerLicenses(customerId, appId);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(502).json({ success: false, error: err?.message || 'Upstream license error' });
  }
}

/**
 * POST /api/v1/ai-app/licenses/verify
 * Proxy → Web tổng /api/ai-app/licenses/verify
 * Body: { licenseKey, appId?, customerId?, deviceId?, deviceName? }
 */
export async function proxyVerifyLicense(req: Request, res: Response): Promise<void> {
  const { licenseKey, appId, customerId, deviceId, deviceName } = req.body || {};

  if (!licenseKey) {
    res.status(400).json({ success: false, error: 'licenseKey is required' });
    return;
  }

  if (!WebAiAppLicenseService.isEnabled()) {
    res.status(503).json({ success: false, error: 'License service not configured' });
    return;
  }

  try {
    const result = await WebAiAppLicenseService.verifyLicense({
      licenseKey,
      appId,
      customerId,
      deviceId,
      deviceName,
    });
    res.json({ success: true, data: result });
  } catch (err: any) {
    const status = err?.message?.includes('404') || err?.message?.includes('invalid') ? 404 : 502;
    res.status(status).json({ success: false, error: err?.message || 'License verify error' });
  }
}
