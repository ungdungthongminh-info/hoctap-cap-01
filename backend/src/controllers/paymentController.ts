import { Request, Response } from 'express';
import PaymentService from '../services/PaymentService';
import SePayService from '../services/SePayService';
import { PRICING_PLANS, getPlan, getPlanPrice } from '../db/plans';
import WebSalesTotalService from '../services/WebSalesTotalService';
import WebTotalBridgeSessionService from '../services/WebTotalBridgeSessionService';

function readBridgeToken(req: Request): string {
  const headerToken = req.headers['x-bridge-session'];
  if (typeof headerToken === 'string' && headerToken.trim()) {
    return headerToken.trim();
  }

  throw new Error('Thiếu bridge token Web tổng.');
}

function readProductMap(): Record<string, string | null> {
  const raw = process.env.WEB_TOTAL_PRODUCT_MAP_JSON;
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function getCatalogPriceMap(products: Array<any>, appId: string): Record<string, { price: number; currency: string; productId: string }> {
  const productById = new Map(
    (products || [])
      .filter((item) => String(item?.appId || '').toLowerCase() === appId.toLowerCase())
      .map((item) => [String(item.id), item])
  );

  const result: Record<string, { price: number; currency: string; productId: string }> = {};
  for (const [key, productId] of Object.entries(readProductMap())) {
    if (!productId) continue;
    const product = productById.get(String(productId));
    if (!product) continue;
    result[key] = {
      price: Number(product.price || 0),
      currency: String(product.currency || 'VND'),
      productId: String(product.id),
    };
  }

  return result;
}

export async function registerAnonymousOrder(req: Request, res: Response) {
  try {
    const { orderCode, planId, billingCycle, customerPhone } = req.body;
    if (!orderCode || !planId || !billingCycle || !customerPhone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Basic phone validation
    const phone = String(customerPhone).replace(/\D/g, '');
    if (phone.length < 9 || phone.length > 12) {
      return res.status(400).json({ error: 'Số điện thoại không hợp lệ' });
    }
    await PaymentService.registerAnonymousOrder(orderCode, planId, billingCycle, phone);
    res.json({ success: true });
  } catch (error) {
    console.error('Register anonymous order error:', error);
    res.status(500).json({ error: 'Failed to register order' });
  }
}

export async function createPaymentOrder(req: Request, res: Response) {
  try {
    const { planId, billingCycle, customerPhone } = req.body;
    const userId = (req as any).userId; // From auth middleware

    // Validate inputs
    if (!planId || !billingCycle) {
      return res.status(400).json({ error: 'Missing planId or billingCycle' });
    }

    if (WebSalesTotalService.isEnabled()) {
      const bridgeToken = readBridgeToken(req);
      const customer = await WebTotalBridgeSessionService.resolveCustomer(bridgeToken);
      if (!customer?.id) {
        return res.status(401).json({ error: 'Không xác định được tài khoản Web tổng.' });
      }

      if (customerPhone) {
        try {
          const phone = String(customerPhone).replace(/\D/g, '');
          if (phone.length >= 9 && phone.length <= 12) {
            await PaymentService.registerAnonymousOrder(`SYNC-${Date.now()}`, planId, billingCycle, phone);
          }
        } catch {
          // Non-blocking metadata save for local admin tracing only.
        }
      }

      const orderResp = await WebSalesTotalService.createOrder(String(customer.id), planId, billingCycle);
      const order = orderResp.order;
      const checkoutUrl = WebSalesTotalService.toAbsoluteUrl(orderResp.checkoutUrl);

      return res.json({
        success: true,
        data: {
          orderCode: order?.orderCode || '',
          orderId: order?.id || '',
          amount: Number(order?.amount || orderResp.product?.price || 0),
          qrUrl: checkoutUrl,
          checkoutUrl,
          expiresAt: order?.createdAt || new Date().toISOString(),
          source: 'web-total',
          customerId: String(customer.id),
        }
      });
    }

    const plan = getPlan(planId);
    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const amount = getPlanPrice(planId, billingCycle);
    if (!amount) {
      return res.status(400).json({ error: 'Invalid billing cycle for plan' });
    }

    // Create payment order
    const order = await PaymentService.createPaymentOrder(userId, planId, billingCycle);

    // Generate QR code URL
    const qrUrl = SePayService.generateQRUrl(
      order.orderCode,
      order.amount,
      `Thanh toán gói ${plan.name}`
    );

    res.json({
      success: true,
      data: {
        orderCode: order.orderCode,
        orderId: order.id,
        amount: order.amount,
        qrUrl,
        expiresAt: order.expiresAt
      }
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
}

export async function getPaymentStatus(req: Request, res: Response) {
  try {
    const { orderCode } = req.params;

    const order = await PaymentService.getPaymentOrder(orderCode);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if order expired
    if (order.status === 'pending' && new Date(order.expires_at) < new Date()) {
      await PaymentService.updatePaymentStatus(orderCode, 'expired');
      return res.json({
        success: true,
        data: {
          status: 'expired',
          message: 'Payment order has expired'
        }
      });
    }

    res.json({
      success: true,
      data: {
        status: order.status,
        amount: order.amount,
        planId: order.plan_id
      }
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ error: 'Failed to get payment status' });
  }
}

export async function getWebTotalOrderStatus(req: Request, res: Response) {
  try {
    if (!WebSalesTotalService.isEnabled()) {
      return res.status(400).json({ error: 'WEB_TOTAL_BASE_URL chưa được cấu hình.' });
    }

    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({ error: 'Missing orderId' });
    }

    const payload = await WebSalesTotalService.getOrder(orderId);
    res.json({
      success: true,
      data: {
        orderId: payload.order?.id || orderId,
        orderCode: payload.order?.orderCode || '',
        status: payload.order?.status || 'unknown',
        paymentStatus: payload.order?.paymentStatus || 'unknown',
        amount: payload.order?.amount || payload.product?.price || 0,
        paidAt: payload.order?.paidAt || null,
        productId: payload.order?.productId || payload.product?.id || '',
      }
    });
  } catch (error: any) {
    console.error('Get Web total order status error:', error);
    res.status(500).json({ error: error?.message || 'Failed to get Web total order status' });
  }
}

export async function getUserSubscription(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;

    const subscription = await PaymentService.getActiveSubscription(userId);

    if (!subscription) {
      return res.json({
        success: true,
        data: null
      });
    }

    res.json({
      success: true,
      data: {
        planId: subscription.plan_id,
        billingCycle: subscription.billing_cycle,
        status: subscription.status,
        expiresAt: subscription.expires_at,
        activatedAt: subscription.activated_at
      }
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to get subscription' });
  }
}

export async function getPricingPlans(req: Request, res: Response) {
  try {
    if (WebSalesTotalService.isEnabled()) {
      try {
        const catalog = await WebSalesTotalService.getCatalog();
        const appId = WebSalesTotalService.getAppId();
        const catalogPrices = getCatalogPriceMap(catalog.products || [], appId);
        const plans = {
          free: {
            id: 'free',
            name: PRICING_PLANS.free.name,
            prices: { monthly: 0, yearly: 0, lifetime: 0 },
            source: 'local',
            features: PRICING_PLANS.free.features,
          },
          standard: {
            id: 'standard',
            name: PRICING_PLANS.standard.name,
            prices: {
              monthly: catalogPrices['standard:monthly']?.price ?? PRICING_PLANS.standard.billingCycles.monthly,
              yearly: catalogPrices['standard:yearly']?.price ?? PRICING_PLANS.standard.billingCycles.yearly,
              lifetime: catalogPrices['standard:lifetime']?.price ?? PRICING_PLANS.standard.billingCycles.lifetime,
            },
            source: catalogPrices['standard:monthly'] || catalogPrices['standard:yearly'] || catalogPrices['standard:lifetime'] ? 'web-total' : 'local-fallback',
            features: PRICING_PLANS.standard.features,
          },
          premium: {
            id: 'premium',
            name: PRICING_PLANS.premium.name,
            prices: {
              monthly: catalogPrices['premium:monthly']?.price ?? PRICING_PLANS.premium.billingCycles.monthly,
              yearly: catalogPrices['premium:yearly']?.price ?? PRICING_PLANS.premium.billingCycles.yearly,
              lifetime: catalogPrices['premium:lifetime']?.price ?? PRICING_PLANS.premium.billingCycles.lifetime,
            },
            source: catalogPrices['premium:monthly'] || catalogPrices['premium:yearly'] || catalogPrices['premium:lifetime'] ? 'web-total' : 'local-fallback',
            features: PRICING_PLANS.premium.features,
          }
        };

        return res.json({ success: true, data: plans, source: 'web-total' });
      } catch (error) {
        console.warn('Web total catalog fallback to local plans:', error);
      }
    }

    // Return pricing plans (similar to frontend)
    const plans = {
      free: {
        id: 'free',
        name: 'Miễn phí',
        features: { subjects: 1, grades: 1, profiles: 1 }
      },
      standard: {
        id: 'standard',
        name: 'Standard (Phổ biến)',
        prices: {
          monthly: getPlanPrice('standard', 'monthly'),
          yearly: getPlanPrice('standard', 'yearly'),
          lifetime: getPlanPrice('standard', 'lifetime')
        },
        features: { subjects: null, grades: null, profiles: 3 }
      },
      premium: {
        id: 'premium',
        name: 'Premium',
        prices: {
          monthly: getPlanPrice('premium', 'monthly'),
          yearly: getPlanPrice('premium', 'yearly'),
          lifetime: getPlanPrice('premium', 'lifetime')
        },
        features: { subjects: null, grades: null, profiles: 5 }
      }
    };

    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pricing plans' });
  }
}
