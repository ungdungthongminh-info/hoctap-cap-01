/**
 * Shared type definitions cho Backend API
 */

// ==================== PAYMENT ====================

export interface CreatePaymentOrderRequest {
  planId: string;
  billingCycle: 'monthly' | 'yearly' | 'lifetime';
  customerPhone?: string;
}

export interface RegisterAnonymousOrderRequest {
  orderCode: string;
  planId: string;
  billingCycle: 'monthly' | 'yearly' | 'lifetime';
  customerPhone: string;
}

export interface PaymentOrderResponse {
  orderCode: string;
  orderId: number | string;
  amount: number;
  qrUrl: string;
  expiresAt: string;
  checkoutUrl?: string;
}

export interface PaymentStatusResponse {
  status: 'pending' | 'paid' | 'expired' | 'failed';
  amount?: number;
  planId?: string;
  message?: string;
}

// ==================== WEBHOOK ====================

export interface WebhookPayload {
  orderCode: string;
  transactionId: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  message?: string;
  timestamp?: number;
}

export interface WebhookSuccessResponse {
  success: true;
  message: string;
  subscriptionId?: number;
  licenseKey?: string;
  notificationJobId?: string;
}

// ==================== SUBSCRIPTION ====================

export interface Subscription {
  id: number;
  userId: number;
  planId: string;
  billingCycle: 'monthly' | 'yearly';
  status: 'active' | 'expired' | 'cancelled';
  startsAt: string;
  expiresAt: string;
  createdAt: string;
}

export interface LicenseInfo {
  licenseKey: string;
  planId: string;
  billingCycle: 'monthly' | 'yearly';
  expiresAt: string;
}

// ==================== ADMIN ====================

export interface AdminSubscriptionsQuery {
  planId?: string;
  status?: string;
}

export interface PlanSummary {
  planId: string;
  planName: string;
  activeCount: number;
  totalRevenue: number;
}

export interface NotificationJob {
  jobId: string;
  userId: number;
  licenseKey: string;
  planId: string;
  status: 'pending' | 'sent' | 'failed';
  createdAt: string;
}

// ==================== API ERRORS ====================

export interface ApiError {
  error: string;
  code?: string;
}

export type ApiResponse<T> =
  | ({ success: true } & T)
  | ({ success: false } & ApiError);
