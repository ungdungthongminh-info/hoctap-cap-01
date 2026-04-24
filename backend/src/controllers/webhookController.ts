import { Request, Response } from 'express';
import PaymentService from '../services/PaymentService';
import SePayService from '../services/SePayService';

interface WebhookPayload {
  orderCode: string;
  transactionId: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  message?: string;
  timestamp?: number;
}

/**
 * SePay Webhook Handler
 * This endpoint is called by SePay when payment status changes
 * 
 * Security: 
 * - Verify HMAC signature
 * - Validate amount
 * - Use idempotency key to prevent duplicate processing
 */
export async function handleSePayWebhook(req: Request, res: Response) {
  try {
    // Get signature from headers
    const signature = req.headers['x-sepay-signature'] as string;
    const payload = JSON.stringify(req.body);

    // Verify signature
    if (!signature || !SePayService.verifyWebhookSignature(payload, signature)) {
      console.error('❌ Webhook signature verification failed');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const data: WebhookPayload = req.body;

    console.log(`📬 Webhook received for order: ${data.orderCode}`);

    // Validate payload
    if (!data.orderCode || !data.transactionId) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // Get payment order
    const order = await PaymentService.getPaymentOrder(data.orderCode);
    if (!order) {
      console.error(`Order not found: ${data.orderCode}`);
      return res.status(404).json({ error: 'Order not found' });
    }

    // Validate amount (prevent tampering)
    if (order.amount !== data.amount) {
      console.error(`Amount mismatch for order ${data.orderCode}: expected ${order.amount}, got ${data.amount}`);
      return res.status(400).json({ error: 'Amount mismatch' });
    }

    // Check if already processed (idempotency)
    if (order.status === 'paid') {
      console.log(`Order ${data.orderCode} already processed, returning success`);
      return res.json({ success: true, message: 'Already processed' });
    }

    // Handle payment success
    if (data.status === 'success') {
      // Update payment order
      await PaymentService.updatePaymentStatus(data.orderCode, 'paid', data.transactionId);

      // Create subscription
      const subscription = await PaymentService.createSubscription(
        order.user_id,
        order.plan_id,
        order.billing_cycle,
        order.id
      );

      const license = await PaymentService.issueLicenseForSubscription(
        order.user_id,
        subscription.id,
        order.id,
        order.plan_id,
        order.billing_cycle
      );

      const zaloJob = await PaymentService.queueZaloLicenseMessage(
        order.user_id,
        license.licenseKey,
        order.plan_id,
        order.billing_cycle
      );

      console.log(`✅ Payment successful for order ${data.orderCode}, subscription created, license issued ${license.licenseKey}, zalo job ${zaloJob.jobId}`);

      // TODO: Send confirmation email to user

      return res.json({
        success: true,
        message: 'Payment processed successfully',
        subscriptionId: subscription.id,
        licenseKey: license.licenseKey,
        notificationJobId: zaloJob.jobId
      });
    } else {
      // Payment failed
      await PaymentService.updatePaymentStatus(data.orderCode, 'failed', data.transactionId);
      console.log(`❌ Payment failed for order ${data.orderCode}`);

      return res.json({
        success: true,
        message: 'Payment failed'
      });
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    // Return 200 OK anyway to acknowledge receipt (SePay will retry if we return error)
    res.status(200).json({ success: true, message: 'Webhook received' });
  }
}

/**
 * Health check for webhook endpoint
 */
export function webhookHealth(req: Request, res: Response) {
  res.json({
    success: true,
    message: 'Webhook endpoint is operational',
    timestamp: new Date().toISOString()
  });
}
