import { Router } from 'express';
import {
  registerAnonymousOrder,
  createPaymentOrder,
  getPaymentStatus,
  getWebTotalOrderStatus,
  getUserSubscription,
  getPricingPlans
} from '../controllers/paymentController';
import {
  getCustomerSubscriptions,
  getPlanSummary,
  getPendingZaloJobs,
  markZaloJobSent,
  markZaloJobFailed
} from '../controllers/adminController';
import { handleSePayWebhook, webhookHealth } from '../controllers/webhookController';
import {
  bridgeAuthMe,
  bridgeCustomerLogin,
  bridgeCustomerLogout,
  bridgeCustomerSnapshot,
} from '../controllers/authBridgeController';
import {
  proxyGetCustomerLicenses,
  proxyVerifyLicense,
} from '../controllers/aiAppLicenseController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// ===== PAYMENT ENDPOINTS =====

/**
 * POST /api/v1/payments/register
 * Register an anonymous order with customer phone (no auth needed)
 * Body: { orderCode, planId, billingCycle, customerPhone }
 */
router.post('/payments/register', registerAnonymousOrder);

/**
 * POST /api/v1/payments/create
 * Create a new payment order
 * Body: { planId, billingCycle, userId }
 */
router.post('/payments/create', authMiddleware, createPaymentOrder);

/**
 * GET /api/v1/payments/:orderCode/status
 * Check payment order status
 */
router.get('/payments/:orderCode/status', getPaymentStatus);
router.get('/payments/web-total/orders/:orderId/status', getWebTotalOrderStatus);

/**
 * GET /api/v1/subscriptions/me
 * Get current user's active subscription
 */
router.get('/subscriptions/me', authMiddleware, getUserSubscription);

/**
 * GET /api/v1/plans
 * Get all pricing plans
 */
router.get('/plans', getPricingPlans);

// ===== WEB TOTAL SESSION BRIDGE =====
router.post('/auth/customer/login', bridgeCustomerLogin);
router.get('/auth/me', bridgeAuthMe);
router.post('/auth/customer/logout', bridgeCustomerLogout);
router.get('/customer/snapshot', bridgeCustomerSnapshot);

// ===== AI APP LICENSE (proxy — x-ai-app-key giữ server-side) =====
router.get('/ai-app/customers/:customerId/licenses', proxyGetCustomerLicenses);
router.post('/ai-app/licenses/verify', proxyVerifyLicense);

// ===== ADMIN ENDPOINTS (no auth – internal tool) =====
router.get('/admin/subscriptions', getCustomerSubscriptions);
router.get('/admin/summary', getPlanSummary);
router.get('/admin/notifications/pending', getPendingZaloJobs);
router.post('/admin/notifications/:jobId/sent', markZaloJobSent);
router.post('/admin/notifications/:jobId/failed', markZaloJobFailed);

// ===== WEBHOOK ENDPOINTS (no auth required) =====

/**
 * POST /api/v1/webhooks/sepay
 * SePay webhook callback for payment notifications
 * Headers: x-sepay-signature (HMAC-SHA256 signature)
 * Body: { orderCode, transactionId, amount, status }
 */
router.post('/webhooks/sepay', handleSePayWebhook);

/**
 * GET /api/v1/webhooks/sepay/health
 * Health check for webhook endpoint
 */
router.get('/webhooks/sepay/health', webhookHealth);

export default router;
