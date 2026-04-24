import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

interface SePayChecksum {
  signature: string;
  timestamp: number;
}

export class SePayService {
  private clientId: string;
  private apiKey: string;
  private webhookSecret: string;
  private environment: 'sandbox' | 'production';

  constructor() {
    this.clientId = process.env.SEPAY_CLIENT_ID || '';
    this.apiKey = process.env.SEPAY_API_KEY || '';
    this.webhookSecret = process.env.SEPAY_WEBHOOK_SECRET || '';
    this.environment = (process.env.SEPAY_ENVIRONMENT as any) || 'sandbox';

    if (!this.clientId || !this.apiKey || !this.webhookSecret) {
      console.warn('⚠️  SePay credentials not fully configured');
    }
  }

  /**
   * Generate QR code URL for payment
   * Docs: https://sep.vy.vn/api/qrcode
   */
  generateQRUrl(orderCode: string, amount: number, description: string): string {
    const baseUrl = 'https://qr.sepay.vn/img';
    const params = new URLSearchParams({
      acc: process.env.SEPAY_ACCOUNT || '49312517', // Seller account number
      bank: process.env.SEPAY_BANK_CODE || '970416', // ACB
      amount: amount.toString(),
      des: description,
      reference: orderCode
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Verify webhook signature from SePay
   * SePay sends: x-sepay-signature header with HMAC-SHA256(payload, apiKey)
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(payload)
      .digest('hex');

    // Use constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Create a new payment order (mock - real implementation would call SePay API)
   */
  createPaymentOrder(userId: string, orderCode: string, amount: number): any {
    return {
      orderCode,
      amount,
      description: `HHK Subscription - Order ${orderCode}`,
      timestamp: Date.now(),
      expiresAt: Date.now() + 15 * 60 * 1000, // Expires in 15 minutes
      // In production, you'd call SePay API to create the order
      // const response = await fetch('https://api.sepay.vn/payments', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${this.apiKey}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ ... })
      // });
    };
  }

  /**
   * Check payment status (mock - real implementation would call SePay API)
   */
  async checkPaymentStatus(transactionId: string): Promise<any> {
    // In production, call SePay API
    // const response = await fetch(`https://api.sepay.vn/transactions/${transactionId}`, {
    //   headers: {
    //     'Authorization': `Bearer ${this.apiKey}`
    //   }
    // });
    return null;
  }

  /**
   * Generate order code (unique for each payment)
   */
  generateOrderCode(): string {
    return `ORD${Date.now()}`;
  }
}

export default new SePayService();
