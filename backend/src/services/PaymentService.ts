import { v4 as uuidv4 } from 'uuid';
import { randomBytes } from 'crypto';
import { getOne, getAll, runQuery } from '../db/init';
import { getPlanPrice } from '../db/plans';

interface PaymentOrder {
  id: string;
  orderCode: string;
  userId: string;
  planId: string;
  billingCycle: string;
  amount: number;
  status: 'pending' | 'paid' | 'expired' | 'failed';
  providerTxnId?: string;
  paymentMethod?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentOrderRow {
  id: string;
  order_code: string;
  user_id: string;
  plan_id: string;
  billing_cycle: string;
  amount: number;
  status: 'pending' | 'paid' | 'expired' | 'failed';
  provider_txn_id?: string;
  payment_method?: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export class PaymentService {
  private generateLicenseKey(planId: string): string {
    const planCode = planId.toUpperCase();
    const randomCode = randomBytes(4).toString('hex').toUpperCase();
    return `HHK-${planCode}-${randomCode}`;
  }

  /**
   * Register an anonymous payment order (no user account needed).
   * Called from frontend before showing QR, so webhook can find the order later.
   */
  async registerAnonymousOrder(
    orderCode: string,
    planId: string,
    billingCycle: string,
    customerPhone: string
  ): Promise<void> {
    const amount = getPlanPrice(planId, billingCycle);
    if (!amount) {
      throw new Error(`Invalid plan or billing cycle: ${planId} / ${billingCycle}`);
    }

    const id = uuidv4();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const now = new Date().toISOString();

    // Use phone as userId placeholder for anonymous orders
    await runQuery(
      `INSERT OR IGNORE INTO payment_orders
         (id, order_code, user_id, plan_id, billing_cycle, amount, status, customer_phone, expires_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)`,
      [id, orderCode, customerPhone, planId, billingCycle, amount, customerPhone, expiresAt, now, now]
    );
  }

  /**
   * Create a new payment order
   */
  async createPaymentOrder(
    userId: string,
    planId: string,
    billingCycle: string
  ): Promise<PaymentOrder> {
    const id = uuidv4();
    const orderCode = `ORD${Date.now()}`;
    const amount = getPlanPrice(planId, billingCycle);

    if (!amount) {
      throw new Error(`Invalid plan or billing cycle: ${planId} / ${billingCycle}`);
    }

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes
    const now = new Date().toISOString();

    await runQuery(
      `INSERT INTO payment_orders (id, order_code, user_id, plan_id, billing_cycle, amount, status, expires_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, orderCode, userId, planId, billingCycle, amount, 'pending', expiresAt, now, now]
    );

    return {
      id,
      orderCode,
      userId,
      planId,
      billingCycle,
      amount,
      status: 'pending',
      expiresAt,
      createdAt: now,
      updatedAt: now
    };
  }

  /**
   * Get payment order by order code
   */
  async getPaymentOrder(orderCode: string): Promise<PaymentOrderRow | null> {
    return getOne(
      `SELECT * FROM payment_orders WHERE order_code = ?`,
      [orderCode]
    );
  }

  /**
   * Get payment order by ID
   */
  async getPaymentOrderById(id: string): Promise<PaymentOrderRow | null> {
    return getOne(
      `SELECT * FROM payment_orders WHERE id = ?`,
      [id]
    );
  }

  /**
   * Update payment order status (called from webhook)
   */
  async updatePaymentStatus(
    orderCode: string,
    status: 'paid' | 'expired' | 'failed',
    providerTxnId?: string
  ): Promise<void> {
    const now = new Date().toISOString();
    await runQuery(
      `UPDATE payment_orders 
       SET status = ?, provider_txn_id = ?, updated_at = ? 
       WHERE order_code = ?`,
      [status, providerTxnId || null, now, orderCode]
    );
  }

  /**
   * Create subscription after successful payment
   */
  async createSubscription(
    userId: string,
    planId: string,
    billingCycle: string,
    paymentOrderId: string
  ): Promise<any> {
    const id = uuidv4();
    const now = new Date().toISOString();

    // Calculate expiry date based on billing cycle
    const activatedAt = new Date();
    let expiresAt: Date;

    switch (billingCycle) {
      case 'monthly':
        expiresAt = new Date(activatedAt.getTime() + 30 * 24 * 60 * 60 * 1000);
        break;
      case 'yearly':
        expiresAt = new Date(activatedAt.getTime() + 365 * 24 * 60 * 60 * 1000);
        break;
      case 'lifetime':
        expiresAt = new Date(9999, 11, 31); // Very far in the future
        break;
      default:
        throw new Error(`Invalid billing cycle: ${billingCycle}`);
    }

    const refundDeadline = new Date(activatedAt.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days

    await runQuery(
      `INSERT INTO subscriptions (id, user_id, plan_id, billing_cycle, status, payment_order_id, activated_at, expires_at, refund_deadline, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userId,
        planId,
        billingCycle,
        'active',
        paymentOrderId,
        now,
        expiresAt.toISOString(),
        refundDeadline.toISOString(),
        now,
        now
      ]
    );

    return {
      id,
      userId,
      planId,
      billingCycle,
      status: 'active',
      paymentOrderId,
      activatedAt: now,
      expiresAt: expiresAt.toISOString(),
      refundDeadline: refundDeadline.toISOString()
    };
  }

  /**
   * Issue or get existing license key for a subscription
   */
  async issueLicenseForSubscription(
    userId: string,
    subscriptionId: string,
    paymentOrderId: string,
    planId: string,
    billingCycle: string
  ): Promise<{ id: string; licenseKey: string }> {
    const existing = await getOne(
      `SELECT id, license_key FROM license_keys WHERE subscription_id = ? LIMIT 1`,
      [subscriptionId]
    );

    if (existing) {
      return { id: existing.id, licenseKey: existing.license_key };
    }

    const id = uuidv4();
    const licenseKey = this.generateLicenseKey(planId);
    const now = new Date().toISOString();

    await runQuery(
      `INSERT INTO license_keys (id, user_id, subscription_id, payment_order_id, plan_id, billing_cycle, license_key, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'issued', ?, ?)`,
      [id, userId, subscriptionId, paymentOrderId, planId, billingCycle, licenseKey, now, now]
    );

    return { id, licenseKey };
  }

  /**
   * Add pending Zalo send job to queue
   */
  async queueZaloLicenseMessage(
    userId: string,
    licenseKey: string,
    planId: string,
    billingCycle: string
  ): Promise<{ jobId: string }> {
    const jobId = uuidv4();
    const now = new Date().toISOString();

    const payload = {
      template: 'license_activation',
      userId,
      licenseKey,
      planId,
      billingCycle,
      message: `Thanh toan thanh cong. Ma kich hoat cua ban: ${licenseKey}`
    };

    await runQuery(
      `INSERT INTO notification_jobs (id, user_id, channel, payload_json, status, created_at, updated_at)
       VALUES (?, ?, 'zalo', ?, 'pending', ?, ?)`,
      [jobId, userId, JSON.stringify(payload), now, now]
    );

    return { jobId };
  }

  /**
   * List subscriptions for customer management by plan/status
   */
  async getAdminSubscriptions(planId?: string, status?: string): Promise<any[]> {
    const filters: string[] = [];
    const params: any[] = [];
    const statusExpr = `CASE WHEN s.status IS NOT NULL THEN s.status ELSE p.status END`;

    if (planId) {
      filters.push('p.plan_id = ?');
      params.push(planId);
    }

    if (status) {
      filters.push(`${statusExpr} = ?`);
      params.push(status);
    }

    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    return getAll(
      `SELECT
          p.id as id,
          p.user_id as userId,
          p.plan_id as planId,
          p.billing_cycle as billingCycle,
          ${statusExpr} as status,
          p.amount as amount,
          p.customer_phone as customerPhone,
          p.created_at as createdAt,
          s.activated_at as activatedAt,
          s.expires_at as expiresAt,
          p.order_code as orderCode,
          p.provider_txn_id as providerTxnId,
          lk.license_key as licenseKey,
          lk.sent_via as sentVia,
          lk.sent_at as sentAt
       FROM payment_orders p
       LEFT JOIN subscriptions s ON s.payment_order_id = p.id
       LEFT JOIN license_keys lk ON lk.payment_order_id = p.id
       ${where}
       ORDER BY p.created_at DESC`,
      params
    );
  }

  /**
   * Summary by plan for dashboard
   */
  async getPlanSummary(): Promise<any[]> {
    return getAll(
      `SELECT
          p.plan_id,
          p.billing_cycle,
          COUNT(*) as count,
          SUM(CASE WHEN p.status = 'paid' THEN COALESCE(p.amount, 0) ELSE 0 END) as total_revenue
       FROM payment_orders p
       GROUP BY p.plan_id, p.billing_cycle
       ORDER BY total_revenue DESC`
    );
  }

  /**
   * Pending notification jobs (for Zalo sending worker/admin)
   */
  async getPendingNotificationJobs(limit = 50): Promise<any[]> {
    return getAll(
      `SELECT id, user_id, channel, payload_json, status, created_at
       FROM notification_jobs
       WHERE status = 'pending'
       ORDER BY created_at ASC
       LIMIT ?`,
      [limit]
    );
  }

  async markNotificationJobSent(jobId: string): Promise<void> {
    const now = new Date().toISOString();
    await runQuery(
      `UPDATE notification_jobs
       SET status = 'sent', last_attempt_at = ?, updated_at = ?
       WHERE id = ?`,
      [now, now, jobId]
    );
  }

  async markNotificationJobFailed(jobId: string, errorMessage: string): Promise<void> {
    const now = new Date().toISOString();
    await runQuery(
      `UPDATE notification_jobs
       SET status = 'failed', error_message = ?, last_attempt_at = ?, updated_at = ?
       WHERE id = ?`,
      [errorMessage, now, now, jobId]
    );
  }

  /**
   * Get active subscription for user
   */
  async getActiveSubscription(userId: string): Promise<any | null> {
    return getOne(
      `SELECT * FROM subscriptions 
       WHERE user_id = ? AND status = 'active' AND expires_at > datetime('now')
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    );
  }

  /**
   * Get all subscriptions for user
   */
  async getUserSubscriptions(userId: string): Promise<any[]> {
    return getAll(
      `SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
  }
}

export default new PaymentService();
