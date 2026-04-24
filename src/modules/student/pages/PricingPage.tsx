/**
 * PricingPage — Hệ thống gói dịch vụ + Kích hoạt bằng key
 * - Hiển thị gói, so sánh tính năng
 * - Mở đúng trang sản phẩm trên Web Tổng
 * - Nhập mã kích hoạt license
 * - Quản lý gia hạn, hết hạn, hoàn tiền 3 ngày
 * - Lưu subscription vào SQLite
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Unlock, Gift, Shield, Copy, CheckCircle, RefreshCw, Clock, AlertTriangle, CreditCard, ExternalLink } from 'lucide-react';
import { useAppData } from '../../../shared/providers/AppDataProvider';
import { getGradeLabel, getSubjectsForGrade } from '../../../data/subjects';
import {
  fetchPricingPlans,
  getBridgeCustomer,
  verifyLicenseKey,
  type PricingPlanCatalogEntry,
} from '../../../shared/services/webTotalBridge';
import { getAccessPlan, getUnlockedGrades, persistUnlockedGrades } from '../../../shared/services/accessControl';
import { getDeviceId } from '../../../shared/utils/deviceFingerprint';
import '../styles/premiumButtons.css';

// ==================== TYPES ====================
export interface PricingPlan {
  id: string;
  name: string;
  emoji: string;
  monthlyPrice: number;
  yearlyPrice: number;
  lifetimePrice: number;
  pricingSource?: string;
  color: string;
  bgColor: string;
  popular?: boolean;
  features: string[];
  limits: PlanLimits;
}

export interface PlanLimits {
  subjects: number | 'all';
  grades: number | 'all';
  profiles: number;
  dailyChallenges: boolean;
  competition: boolean;
  avatarShop: boolean;
  smartReview: boolean;
  memoryRoom: boolean;
  parentDashboard: boolean;
  offlineMode: boolean;
  ttsVoice: boolean;
  exportData: boolean;
  noAds: boolean;
  prioritySupport: boolean;
}

interface Subscription {
  id: number;
  planId: string;
  billingCycle: string;
  licenseKey: string;
  amount: number;
  status: string;
  activatedAt: string | null;
  expiresAt: string | null;
  autoRenew: number;
  paymentMethod: string;
  paymentRef: string | null;
  refundDeadline: string | null;
  createdAt: string;
}

const WEB_TOTAL_SITE_URL = 'https://www.ungdungthongminh.shop';
const WEB_TOTAL_PRODUCT_URLS = {
  standard: {
    monthly: `${WEB_TOTAL_SITE_URL}/product/prod-study-month`,
    yearly: `${WEB_TOTAL_SITE_URL}/product/prod-study-year`,
    lifetime: `${WEB_TOTAL_SITE_URL}/product/prod-study-standard-lifetime`,
  },
  standard_1year_1grade: {
    monthly: '',
    yearly: `${WEB_TOTAL_SITE_URL}/product/standard_1year_1grade`,
    lifetime: '',
  },
  premium: {
    monthly: `${WEB_TOTAL_SITE_URL}/product/prod-study-premium-month`,
    yearly: `${WEB_TOTAL_SITE_URL}/product/prod-study-premium-year`,
    lifetime: `${WEB_TOTAL_SITE_URL}/product/prod-study-premium-lifetime`,
  },
} as const;

// ==================== GÓI SẢN PHẨM ====================
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Miễn phí',
    emoji: '🌱',
    monthlyPrice: 0,
    yearlyPrice: 0,
    lifetimePrice: 0,
    color: '#6B7280',
    bgColor: '#F3F4F6',
    features: [
      '1 môn học (Toán)',
      '1 lớp',
      '1 hồ sơ học sinh',
      'Bài học + Luyện tập cơ bản',
      'Mini-Game ghép cặp',
      '6 giao diện miễn phí',
    ],
    limits: {
      subjects: 1, grades: 1, profiles: 1,
      dailyChallenges: false, competition: false, avatarShop: false,
      smartReview: false, memoryRoom: false, parentDashboard: false,
      offlineMode: false, ttsVoice: false, exportData: false,
      noAds: false, prioritySupport: false,
    },
  },
  {
    id: 'standard',
    name: 'Tiêu chuẩn',
    emoji: '⭐',
    monthlyPrice: 89000,
    yearlyPrice: 599000,
    lifetimePrice: 1299000,
    color: '#D97706',
    bgColor: '#FEF3C7',
    popular: true,
    features: [
      'Tất cả 5 môn học',
      'Mở 3 lớp tùy chọn khi kích hoạt key',
      '3 hồ sơ học sinh',
      'Ôn tập thông minh AI',
      'Thi đấu Bot & PvP',
      'Cửa hàng Avatar',
      'Bảng điều khiển phụ huynh',
      'Chế độ ngoại tuyến',
      'Xuất dữ liệu backup',
      'Không quảng cáo',
    ],
    limits: {
      subjects: 'all', grades: 3, profiles: 3,
      dailyChallenges: true, competition: true, avatarShop: true,
      smartReview: true, memoryRoom: true, parentDashboard: true,
      offlineMode: true, ttsVoice: true, exportData: true,
      noAds: true, prioritySupport: false,
    },
  },
  {
    id: 'standard_1year_1grade',
    name: 'Gói 1 khóa (01 năm - 01 lớp)',
    emoji: '📘',
    monthlyPrice: 0,
    yearlyPrice: 299000,
    lifetimePrice: 0,
    color: '#2F6CB2',
    bgColor: '#E9F2FF',
    features: [
      'Tất cả 5 môn học',
      'Mở 01 lớp khi kích hoạt key',
      '2 hồ sơ học sinh',
      'Ôn tập thông minh AI',
      'Thi đấu Bot & PvP',
      'Cửa hàng Avatar',
      'Bảng điều khiển phụ huynh',
      'Chế độ ngoại tuyến',
      'Xuất dữ liệu backup',
      'Không quảng cáo',
    ],
    limits: {
      subjects: 'all', grades: 1, profiles: 2,
      dailyChallenges: true, competition: true, avatarShop: true,
      smartReview: true, memoryRoom: true, parentDashboard: true,
      offlineMode: true, ttsVoice: true, exportData: true,
      noAds: true, prioritySupport: false,
    },
  },
  {
    id: 'premium',
    name: 'Cao cấp',
    emoji: '👑',
    monthlyPrice: 149000,
    yearlyPrice: 1190000,
    lifetimePrice: 1990000,
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    features: [
      'Mọi tính năng Tiêu chuẩn',
      '5 hồ sơ học sinh',
      'Hỗ trợ ưu tiên 24/7',
      'Cập nhật nội dung sớm',
      'Badge & Theme độc quyền',
      'Báo cáo tiến bộ chi tiết',
      'Tùy chỉnh giáo trình',
    ],
    limits: {
      subjects: 'all', grades: 'all', profiles: 5,
      dailyChallenges: true, competition: true, avatarShop: true,
      smartReview: true, memoryRoom: true, parentDashboard: true,
      offlineMode: true, ttsVoice: true, exportData: true,
      noAds: true, prioritySupport: true,
    },
  },
];

const FEATURE_ROWS: Array<{ label: string; key: keyof PlanLimits; emoji: string }> = [
  { label: 'Số môn học', key: 'subjects', emoji: '📚' },
  { label: 'Số lớp', key: 'grades', emoji: '🎓' },
  { label: 'Hồ sơ học sinh', key: 'profiles', emoji: '👤' },
  { label: 'Thử thách hàng ngày', key: 'dailyChallenges', emoji: '📅' },
  { label: 'Thi đấu', key: 'competition', emoji: '⚔️' },
  { label: 'Cửa hàng Avatar', key: 'avatarShop', emoji: '🛍️' },
  { label: 'Ôn tập thông minh', key: 'smartReview', emoji: '🧠' },
  { label: 'Phòng trí nhớ', key: 'memoryRoom', emoji: '💡' },
  { label: 'Bảng phụ huynh', key: 'parentDashboard', emoji: '👨‍👩‍👧' },
  { label: 'Ngoại tuyến', key: 'offlineMode', emoji: '📡' },
  { label: 'Giọng đọc TTS', key: 'ttsVoice', emoji: '🔊' },
  { label: 'Xuất dữ liệu', key: 'exportData', emoji: '💾' },
  { label: 'Không quảng cáo', key: 'noAds', emoji: '🚫' },
  { label: 'Hỗ trợ ưu tiên', key: 'prioritySupport', emoji: '🛡️' },
];

// ==================== CONSTANTS ====================
const LICENSE_KEY = 'hhk_license';
const PLAN_KEY = 'hhk_plan';
const SUB_EXPIRY_KEY = 'hhk_sub_expiry';
const SUB_STATUS_KEY = 'hhk_sub_status';
const SUB_BILLING_KEY = 'hhk_sub_billing_cycle';
const ACTIVATION_SOURCE_KEY = 'hhk_activation_source';
const STANDARD_GRADE_LOCKS_KEY = 'hhk_standard_grade_locks_v1';
const REFUND_DAYS = 3;
const PAID_LICENSE_PATTERN = /^HHK-[A-Z0-9_]+-[A-Z0-9]{8}$/;
const ALL_GRADE_OPTIONS = [0, 1, 2, 3, 4, 5] as const;
const WEB_TOTAL_APP_ID = String(import.meta.env.VITE_WEBTOTAL_APP_ID || 'app-study-12').trim() || 'app-study-12';

interface StandardGradeLock {
  key: string;
  deviceId: string;
  grades: number[];
  lockedAt: string;
}

interface PendingStandardActivation {
  key: string;
  cycle: 'monthly' | 'yearly' | 'lifetime';
  expiresAt: string | null;
  storagePlanId: 'standard' | 'standard_1year_1grade' | 'standard_1year_3grade';
  requiredGradeCount: number;
}

function readStandardGradeLocks(): StandardGradeLock[] {
  try {
    const raw = localStorage.getItem(STANDARD_GRADE_LOCKS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item === 'object') as StandardGradeLock[];
  } catch {
    return [];
  }
}

function writeStandardGradeLocks(items: StandardGradeLock[]): void {
  localStorage.setItem(STANDARD_GRADE_LOCKS_KEY, JSON.stringify(items));
}

function getStandardGradeLock(licenseKey: string, deviceId: string, expectedCount = 3): StandardGradeLock | null {
  const key = licenseKey.trim().toUpperCase();
  if (!key) return null;
  const lock = readStandardGradeLocks().find((item) => item.key === key && item.deviceId === deviceId);
  if (!lock) return null;
  const grades = Array.from(new Set((lock.grades || []).map((g) => Number(g)).filter((g) => ALL_GRADE_OPTIONS.includes(g as any))));
  if (grades.length !== expectedCount) return null;
  return { ...lock, grades };
}

function saveStandardGradeLock(licenseKey: string, deviceId: string, grades: number[], maxCount = 3): StandardGradeLock {
  const key = licenseKey.trim().toUpperCase();
  const normalizedGrades = Array.from(new Set(grades.map((g) => Number(g)).filter((g) => ALL_GRADE_OPTIONS.includes(g as any)))).slice(0, maxCount);
  const next: StandardGradeLock = {
    key,
    deviceId,
    grades: normalizedGrades,
    lockedAt: new Date().toISOString(),
  };

  const existing = readStandardGradeLocks().filter((item) => !(item.key === key && item.deviceId === deviceId));
  existing.push(next);
  writeStandardGradeLocks(existing);
  return next;
}

// ==================== HELPERS ====================
function formatVND(amount: number): string {
  if (amount === 0) return 'Miễn phí';
  return amount.toLocaleString('vi-VN') + 'đ';
}

function formatDate(isoStr: string | null): string {
  if (!isoStr) return '—';
  return new Date(isoStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function daysLeft(expiresAt: string | null): number {
  if (!expiresAt) return Infinity;
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function addDays(date: Date, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function hasKeyActivatedPaidPlan(planId: string, status: string | null, licenseKey: string | null, activationSource: string | null): boolean {
  if (planId === 'free') return true;
  if (status !== 'active') return false;
  if (activationSource === 'license_key') return true;
  return PAID_LICENSE_PATTERN.test((licenseKey || '').toUpperCase());
}

function isStandardYearOneGradePlanId(planId: string | null | undefined): boolean {
  const normalized = String(planId || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  if (!normalized) return false;
  const isStandardLike = normalized.includes('standard') || normalized.includes('basic');
  const hasOneGradeSignal = normalized.includes('1grade') || normalized.includes('single_grade') || normalized.includes('1lop') || normalized.includes('one_class');
  const hasYearSignal = normalized.includes('year') || normalized.includes('yearly') || normalized.includes('1y') || normalized.includes('12m') || normalized.includes('1nam');
  return isStandardLike && hasOneGradeSignal && hasYearSignal;
}

function isStandardYearThreeGradePlanId(planId: string | null | undefined): boolean {
  const normalized = String(planId || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  if (!normalized) return false;
  const isStandardLike = normalized.includes('standard') || normalized.includes('basic');
  const hasThreeGradeSignal = normalized.includes('3grade') || normalized.includes('three_grade') || normalized.includes('3lop') || normalized.includes('three_class');
  const hasYearSignal = normalized.includes('year') || normalized.includes('yearly') || normalized.includes('1y') || normalized.includes('12m') || normalized.includes('1nam');
  return isStandardLike && hasThreeGradeSignal && hasYearSignal;
}

function isStandardLikePlanId(planId: string | null | undefined): boolean {
  const normalized = String(planId || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  if (!normalized) return false;
  return normalized.includes('standard') || normalized.includes('basic') || normalized.includes('std');
}

function detectPlanFlowFromKey(inputKey: string): 'standard' | 'standard_1year_1grade' | 'standard_1year_3grade' | 'premium' | null {
  const normalized = String(inputKey || '')
    .trim()
    .toUpperCase();
  if (!normalized) return null;

  if (normalized.includes('-PREMIUM-') || normalized.includes('-VIP-')) return 'premium';

  const hasStandardSignal = normalized.includes('-STANDARD-') || normalized.includes('-BASIC-') || normalized.includes('-STD-');
  const hasOneGradeSignal = /1GRADE|SINGLEGRADE|1LOP|ONECLASS|ONE_GRADE|1_GRADE/.test(normalized);
  const hasYearSignal = /1YEAR|YEARLY|1Y|12M|1NAM/.test(normalized);

  // WSTL key chỉ là định dạng key Web Tổng, không chứa thông tin gói.
  // Không được suy đoán 299/599 từ prefix này vì sẽ làm lệch toàn bộ key thực tế.
  if (normalized.startsWith('WSTL-')) {
    return null;
  }

  if ((hasStandardSignal && hasOneGradeSignal && hasYearSignal) || normalized.includes('1Y1G')) {
    return 'standard_1year_1grade';
  }
  if (hasStandardSignal && hasYearSignal && /3GRADE|THREEGRADE|3LOP|THREECLASS|3_GRADE/.test(normalized)) {
    return 'standard_1year_3grade';
  }
  if (hasStandardSignal) return 'standard';
  return null;
}

function hasRecognizableLicensePrefix(inputKey: string): boolean {
  const normalized = String(inputKey || '').trim().toUpperCase();
  if (!normalized) return false;
  return normalized.startsWith('WSTL-') || normalized.startsWith('HHK-');
}

function playActivationTone(type: 'success' | 'error'): void {
  try {
    const AudioContextRef = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextRef) return;

    const context = new AudioContextRef();
    const master = context.createGain();
    master.gain.value = 0.06;
    master.connect(context.destination);

    const createBeep = (frequency: number, start: number, duration: number) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.03);
    };

    const now = context.currentTime + 0.01;
    if (type === 'success') {
      createBeep(700, now, 0.12);
      createBeep(980, now + 0.13, 0.16);
    } else {
      createBeep(320, now, 0.18);
      createBeep(220, now + 0.16, 0.2);
    }

    window.setTimeout(() => {
      void context.close().catch(() => undefined);
    }, 1200);
  } catch {
    // Ignore audio errors to avoid blocking activation flow.
  }
}

function getPlanHintFromLicensePayload(license: Record<string, unknown> | undefined): string {
  const metadata = (license?.metadata && typeof license.metadata === 'object') ? (license.metadata as Record<string, unknown>) : undefined;
  const candidates = [
    metadata?.planId,
    metadata?.productId,
    metadata?.productCode,
    metadata?.planCode,
    license?.planId,
    license?.planCode,
    license?.plan,
    license?.productCode,
    license?.productId,
    license?.tier,
    license?.licenseKey,
  ];

  for (const value of candidates) {
    const text = String(value || '').trim();
    if (text) return text;
  }

  return '';
}

function normalizePlanId(planId: string | null | undefined): 'free' | 'standard' | 'premium' {
  if (planId === 'premium') return 'premium';
  if (isStandardLikePlanId(planId)) return 'standard';
  return 'free';
}

function resolvePlanFromLicensePayload(
  license: Record<string, unknown> | undefined,
  featureList: string[] = [],
): 'standard' | 'standard_1year_1grade' | 'standard_1year_3grade' | 'premium' | null {
  const metadata = (license?.metadata && typeof license.metadata === 'object')
    ? (license.metadata as Record<string, unknown>)
    : undefined;

  const strongVariantCandidates = [
    metadata?.planId,
    license?.planId,
    license?.planCode,
    metadata?.productId,
    license?.productId,
    metadata?.productCode,
    license?.productCode,
  ];

  const normalizeTokens = (value: unknown): string => String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

  for (const value of strongVariantCandidates) {
    const text = normalizeTokens(value);
    if (!text) continue;

    if (/\b(standard\s*1\s*year\s*1\s*grade|standard\s*1y\s*1g|1grade|single\s?grade|1lop|one\s?class|standard_1year_1grade)\b/.test(text)) {
      return 'standard_1year_1grade';
    }

    if (/\b(standard\s*1\s*year\s*3\s*grade|standard\s*1y\s*3g|3grade|three\s?grade|3lop|three\s?class|standard_1year_3grade)\b/.test(text)) {
      return 'standard_1year_3grade';
    }

    // Legacy Web Tong SKU for standard yearly 3-grade.
    if (/\bprod\s*study\s*year\b/.test(text)) {
      return 'standard_1year_3grade';
    }

    if (/\b(premium|vip|advanced)\b/.test(text)) {
      return 'premium';
    }

    if (/\b(standard|basic|starter|std)\b/.test(text)) {
      return 'standard';
    }
  }

  const explicitPlanCandidates = [
    license?.planCode,
    license?.plan,
    license?.tier,
    license?.planId,
    license?.licenseKey,
  ];

  const weakPlanCandidates = [
    license?.productCode,
    license?.productId,
  ];

  const detectPlanFromText = (text: string): 'standard' | 'premium' | null => {
    if (!text) return null;
    if (/\b(premium|vip|advanced)\b/.test(text)) return 'premium';
    if (/\b(standard|basic|starter|std)\b/.test(text)) return 'standard';
    return null;
  };

  // Ưu tiên tuyệt đối các field mô tả plan/tier hoặc chính license key.
  for (const value of explicitPlanCandidates) {
    const detected = detectPlanFromText(normalizeTokens(value));
    if (detected) return detected;
  }

  // Field productId/productCode thường chứa chuỗi "prod", không dùng keyword "pro" để tránh false-positive premium.
  for (const value of weakPlanCandidates) {
    const detected = detectPlanFromText(normalizeTokens(value));
    if (detected) return detected;
  }

  // Không nâng quyền chỉ dựa vào features.
  // Silent launch yêu cầu payload phải cung cấp planCode/planId rõ ràng.

  // Legacy fallback giữ tương thích cho payload cũ.
  const candidates = [
    license?.planCode,
    license?.plan,
    license?.tier,
    license?.planId,
    license?.productCode,
    license?.productId,
  ];

  for (const value of candidates) {
    const text = String(value || '').toLowerCase();
    if (!text) continue;
    if (/(premium|vip|advanced)/.test(text)) return 'premium';
    if (/(standard|basic|std|starter)/.test(text)) return 'standard';
  }

  const normalizedFeatures = featureList.map((feature) => String(feature || '').toLowerCase());
  const featureText = normalizedFeatures.join('|');
  if (/(priority_support|premium)/.test(featureText) && explicitPlanCandidates.some((value) => String(value || '').trim())) {
    return 'premium';
  }

  return null;
}

function persistFreePlan(): void {
  localStorage.setItem(PLAN_KEY, 'free');
  localStorage.removeItem(SUB_EXPIRY_KEY);
  localStorage.removeItem(SUB_BILLING_KEY);
  localStorage.removeItem(ACTIVATION_SOURCE_KEY);
}

function persistPaidPlan(planId: string, licenseKey: string, expiresAt: string | null, billingCycle?: string): void {
  localStorage.setItem(LICENSE_KEY, licenseKey);
  localStorage.setItem(PLAN_KEY, planId);
  localStorage.setItem(SUB_STATUS_KEY, 'active');
  localStorage.setItem(ACTIVATION_SOURCE_KEY, 'license_key');
  if (billingCycle) localStorage.setItem(SUB_BILLING_KEY, billingCycle);
  else localStorage.removeItem(SUB_BILLING_KEY);
  if (expiresAt) localStorage.setItem(SUB_EXPIRY_KEY, expiresAt);
  else localStorage.removeItem(SUB_EXPIRY_KEY);
}

function mergePricingPlans(basePlans: PricingPlan[], catalog: Record<string, PricingPlanCatalogEntry>): PricingPlan[] {
  return basePlans.map((plan) => {
    const remote = catalog[plan.id];
    if (!remote?.prices) return plan;
    return {
      ...plan,
      name: remote.name || plan.name,
      monthlyPrice: Number(remote.prices.monthly ?? plan.monthlyPrice),
      yearlyPrice: Number(remote.prices.yearly ?? plan.yearlyPrice),
      lifetimePrice: Number(remote.prices.lifetime ?? plan.lifetimePrice),
      pricingSource: remote.source || plan.pricingSource,
    };
  });
}

function normalizeBillingCycle(raw?: string | null): 'monthly' | 'yearly' | 'lifetime' {
  const value = String(raw || '').toLowerCase();
  if (value === 'monthly' || value === 'month') return 'monthly';
  if (value === 'yearly' || value === 'year') return 'yearly';
  if (value === 'one_time' || value === 'lifetime') return 'lifetime';
  return 'yearly';
}

function getPriceForCycle(plan: PricingPlan | undefined, cycle: 'monthly' | 'yearly' | 'lifetime'): number {
  if (!plan) return 0;
  if (cycle === 'monthly') return plan.monthlyPrice;
  if (cycle === 'yearly') return plan.yearlyPrice;
  return plan.lifetimePrice;
}

// ==================== PUBLIC API ====================
export function getCurrentPlan(): string {
  const status = localStorage.getItem(SUB_STATUS_KEY);
  const expiry = localStorage.getItem(SUB_EXPIRY_KEY);
  const planId = normalizePlanId(localStorage.getItem(PLAN_KEY) || 'free');
  const licenseKey = localStorage.getItem(LICENSE_KEY);
  const activationSource = localStorage.getItem(ACTIVATION_SOURCE_KEY);

  if (!hasKeyActivatedPaidPlan(planId, status, licenseKey, activationSource)) {
    persistFreePlan();
    return 'free';
  }

  // Check expiry
  if (planId !== 'free' && status === 'active' && expiry) {
    if (new Date(expiry).getTime() < Date.now()) {
      localStorage.setItem(SUB_STATUS_KEY, 'expired');
      localStorage.removeItem(ACTIVATION_SOURCE_KEY);
      return 'free'; // Hết hạn, fallback về free
    }
  }
  if (status !== 'active' && planId !== 'free') return 'free';
  return planId;
}

export function getPlanLimits(): PlanLimits {
  const planId = getCurrentPlan();
  const plan = PRICING_PLANS.find(p => p.id === planId);
  return plan?.limits || PRICING_PLANS[0].limits;
}

export function getSubscriptionExpiry(): string | null {
  return localStorage.getItem(SUB_EXPIRY_KEY);
}

// DB helpers (work in both Electron & browser)
const dbAvailable = () => !!(window as any).electronAPI?.db;

async function dbRun(sql: string, params: any[] = []) {
  if (dbAvailable()) return (window as any).electronAPI.db.run(sql, params);
}

async function dbGet(sql: string, params: any[] = []): Promise<any> {
  if (dbAvailable()) return (window as any).electronAPI.db.get(sql, params);
  return null;
}

// ==================== COMPONENT ====================
export function PricingPage() {
  const navigate = useNavigate();
  const { state, updateStudent } = useAppData();
  const [billing, setBilling] = useState<'monthly' | 'yearly' | 'lifetime'>('yearly');
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>(PRICING_PLANS);
  const [pricingSynced, setPricingSynced] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(getCurrentPlan());
  const [licenseKey, setLicenseKey] = useState('');
  const [activationGrades, setActivationGrades] = useState<number[]>(() => getUnlockedGrades(state.student.grade, getAccessPlan()));
  const [activateMsg, setActivateMsg] = useState<{ type: 'success' | 'error'; text: string; actionLabel?: string; actionUrl?: string } | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedDeviceId, setCopiedDeviceId] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [gradeConfirmationChecked, setGradeConfirmationChecked] = useState(false);
  const [isGradeSelectionConfirmed, setIsGradeSelectionConfirmed] = useState(false);
  const [showGradeConfirmModal, setShowGradeConfirmModal] = useState(false);
  const [gradeConfirmDone, setGradeConfirmDone] = useState(false);
  const [pendingStandardActivation, setPendingStandardActivation] = useState<PendingStandardActivation | null>(null);
  // Subscription state
  const [activeSub, setActiveSub] = useState<Subscription | null>(null);
  const [subExpiry, setSubExpiry] = useState(localStorage.getItem(SUB_EXPIRY_KEY));
  const gradePickerRef = useRef<HTMLDivElement | null>(null);
  const previousDetectedPlanRef = useRef<'standard' | 'standard_1year_1grade' | 'standard_1year_3grade' | 'premium' | null>(null);
  const currentDeviceId = getDeviceId();
  const normalizedInputKey = licenseKey.trim().toUpperCase();
  const detectedPlanFromInput = detectPlanFlowFromKey(normalizedInputKey);
  const hasRecognizedKeyPrefix = hasRecognizableLicensePrefix(normalizedInputKey);
  const shouldShowRecognizedKeyHint = normalizedInputKey.length > 0 || Boolean(detectedPlanFromInput || hasRecognizedKeyPrefix);
  const isStandardYearOneGradeKeyFlow = detectedPlanFromInput === 'standard_1year_1grade';
  const isStandardYearThreeGradeKeyFlow = detectedPlanFromInput === 'standard_1year_3grade';
  const isStandardKeyFlow = detectedPlanFromInput === 'standard' || isStandardYearOneGradeKeyFlow || isStandardYearThreeGradeKeyFlow;
  const isPremiumKeyFlow = detectedPlanFromInput === 'premium';
  const hasTypedLicenseKey = normalizedInputKey.length > 0;
  const requiredGradeCountFromInput = isStandardYearOneGradeKeyFlow ? 1 : 3;
  const pendingRequiredGradeCount = pendingStandardActivation?.requiredGradeCount || null;
  const requiredGradeCountForInput = pendingRequiredGradeCount || requiredGradeCountFromInput;
  const shouldEvaluateStandardLock = hasTypedLicenseKey && !isPremiumKeyFlow;
  const lockedStandardGradeSelection = shouldEvaluateStandardLock
    ? getStandardGradeLock(normalizedInputKey, currentDeviceId, requiredGradeCountForInput)
    : null;
  const isStandardSelectionLocked = Boolean(lockedStandardGradeSelection);
  const hasSelectedEnoughGrades = activationGrades.length === requiredGradeCountForInput;
  const hasPendingStandardActivation = Boolean(pendingStandardActivation && pendingStandardActivation.key === normalizedInputKey);
  const isPendingOneGrade = pendingStandardActivation?.storagePlanId === 'standard_1year_1grade';
  const isPendingThreeGrade = pendingStandardActivation?.storagePlanId === 'standard_1year_3grade';
  const canSelectGradesNow = !isPremiumKeyFlow && !isStandardSelectionLocked && hasPendingStandardActivation;
  const visiblePlans = pricingPlans.filter((plan) => plan.id !== 'basic');
  const visibleComparisonPlans = PRICING_PLANS.filter((plan) => plan.id !== 'basic');
  const currentPlanStorageId = String(activeSub?.planId || localStorage.getItem(PLAN_KEY) || '').trim().toLowerCase();
  const currentPlanMeta = visiblePlans.find((plan) => plan.id === currentPlanStorageId) || visiblePlans.find((plan) => plan.id === normalizePlanId(currentPlan)) || visiblePlans[0];
  const activeSubPlanMeta = activeSub ? (visiblePlans.find((plan) => plan.id === String(activeSub.planId || '').trim().toLowerCase()) || visiblePlans.find((plan) => plan.id === normalizePlanId(activeSub.planId))) : null;
  const detectedKeyBadgeStyle = detectedPlanFromInput === 'premium'
    ? { background: '#EDE9FE', color: '#6D28D9' }
    : detectedPlanFromInput === 'standard_1year_1grade'
      ? { background: '#DBEAFE', color: '#1D4ED8' }
      : { background: '#DCFCE7', color: '#15803D' };
  const detectedKeyBadgeText = detectedPlanFromInput === 'premium'
    ? '👑 Phát hiện key Premium'
    : detectedPlanFromInput === 'standard_1year_3grade'
      ? '📗 Phát hiện key Standard 01 năm - 03 lớp'
      : detectedPlanFromInput === 'standard_1year_1grade'
        ? '📘 Phát hiện key gói 1 khóa (01 năm - 01 lớp)'
        : detectedPlanFromInput === 'standard'
          ? '⭐ Phát hiện key Standard'
          : normalizedInputKey.startsWith('WSTL-')
            ? '🟢 Phát hiện key bản quyền Web Tổng'
            : '🟢 Phát hiện key bản quyền HHK';
  const detectedKeyDetailText = isStandardKeyFlow
    ? (isStandardYearOneGradeKeyFlow
        ? '✅ Key thuộc gói 1 khóa (01 năm - 01 lớp).'
        : isStandardYearThreeGradeKeyFlow
          ? '✅ Key thuộc gói Standard 01 năm - 03 lớp.'
          : '✅ Key thuộc gói Standard.')
    : isPremiumKeyFlow
      ? '✅ Key thuộc gói Premium.'
      : hasPendingStandardActivation
        ? (isPendingOneGrade
            ? '✅ Key đã xác thực là gói 1 khóa (01 năm - 01 lớp). Vui lòng chọn đúng 1 lớp.'
            : isPendingThreeGrade
              ? '✅ Key đã xác thực là gói Standard 01 năm - 03 lớp. Vui lòng chọn đúng 3 lớp.'
              : '✅ Key đã xác thực là gói Standard. Vui lòng chọn lớp theo gói.')
      : normalizedInputKey.startsWith('WSTL-')
        ? '✅ Đã nhận diện key bản quyền Web Tổng. Gói chính xác sẽ được xác định khi verify với backend.'
        : normalizedInputKey.startsWith('HHK-')
          ? '✅ Đã nhận diện key bản quyền HHK. Gói chính xác sẽ được xác định khi verify với backend.'
          : 'Đang nhận diện loại key. Vui lòng bấm Kích hoạt để xác thực chính xác với backend.';

  const toggleActivationGrade = (grade: number) => {
    if (isPremiumKeyFlow) return;
    if (!canSelectGradesNow) {
      setActivateMsg({ type: 'error', text: '❌ Vui lòng bấm Kích hoạt thành công trước, sau đó mới chọn lớp.' });
      setTimeout(() => setActivateMsg(null), 3500);
      return;
    }
    if (isStandardSelectionLocked) {
      setActivateMsg({ type: 'error', text: '🔒 Key Standard này đã chốt lớp ở lần đầu trên ID máy này. Không thể đổi lại.' });
      setTimeout(() => setActivateMsg(null), 3500);
      return;
    }

    setActivationGrades((prev) => {
      if (prev.includes(grade)) {
        setGradeConfirmationChecked(false);
        setIsGradeSelectionConfirmed(false);
        setGradeConfirmDone(false);
        return prev.filter((item) => item !== grade);
      }

      if (prev.length >= requiredGradeCountForInput) {
        const next = [...prev];
        next[next.length - 1] = grade;
        setGradeConfirmationChecked(false);
        setIsGradeSelectionConfirmed(false);
        setGradeConfirmDone(false);
        setActivateMsg({ type: 'success', text: `Đã đổi 1 lớp mở khóa trong danh sách Standard (tối đa ${requiredGradeCountForInput} lớp).` });
        setTimeout(() => setActivateMsg(null), 2500);
        return next;
      }

      setGradeConfirmationChecked(false);
      setIsGradeSelectionConfirmed(false);
      setGradeConfirmDone(false);
      return [...prev, grade];
    });
  };

  const confirmSelectedGrades = () => {
    if (isPremiumKeyFlow || isStandardSelectionLocked) return;
    if (!hasPendingStandardActivation) {
      setActivateMsg({ type: 'error', text: '❌ Hãy bấm Kích hoạt thành công trước khi xác nhận lựa chọn lớp.' });
      setTimeout(() => setActivateMsg(null), 3500);
      return;
    }
    if (!hasSelectedEnoughGrades) {
      setActivateMsg({
        type: 'error',
        text: requiredGradeCountForInput === 1
          ? '❌ Bạn cần chọn đủ 1 lớp trước khi xác nhận.'
          : '❌ Bạn cần chọn đủ số lớp trước khi xác nhận.',
      });
      setTimeout(() => setActivateMsg(null), 3500);
      return;
    }

    if (!gradeConfirmationChecked) {
      setActivateMsg({ type: 'error', text: '❌ Vui lòng tick ô xác nhận trước khi chốt lựa chọn lớp.' });
      setTimeout(() => setActivateMsg(null), 3500);
      return;
    }

    setShowGradeConfirmModal(true);
    setGradeConfirmDone(false);
  };

  const acceptGradeConfirmation = async () => {
    setIsGradeSelectionConfirmed(true);
    setGradeConfirmDone(true);
    if (!pendingStandardActivation) {
      setActivateMsg({ type: 'error', text: '❌ Không tìm thấy thông tin key đã xác thực. Vui lòng bấm Kích hoạt lại.' });
      setTimeout(() => setActivateMsg(null), 4000);
      return;
    }

    const saved = saveStandardGradeLock(
      pendingStandardActivation.key,
      currentDeviceId,
      activationGrades,
      pendingStandardActivation.requiredGradeCount,
    );

    await completeActivation({
      key: pendingStandardActivation.key,
      planId: 'standard',
      storagePlanId: pendingStandardActivation.storagePlanId,
      cycle: pendingStandardActivation.cycle,
      expiresAt: pendingStandardActivation.expiresAt,
      standardGrades: saved.grades,
    });
    setPendingStandardActivation(null);
    setActivateMsg({ type: 'success', text: `✅ Đã xác nhận và kích hoạt thành công với các lớp: ${saved.grades.map((grade) => getGradeLabel(grade)).join(', ')}.` });
    setTimeout(() => setActivateMsg(null), 4000);
  };

  useEffect(() => {
    if (previousDetectedPlanRef.current !== detectedPlanFromInput && isStandardKeyFlow) {
      gradePickerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setActivateMsg({
        type: 'success',
        text: isStandardYearOneGradeKeyFlow
          ? 'Đã nhận diện key gói 1 khóa (01 năm - 01 lớp). Vui lòng chọn đúng 1 lớp trước khi bấm kích hoạt.'
          : isStandardYearThreeGradeKeyFlow
            ? 'Đã nhận diện key Standard 01 năm - 03 lớp. Vui lòng chọn đúng 3 lớp trước khi bấm kích hoạt.'
            : 'Đã nhận diện key Standard. Vui lòng chọn đúng 3 lớp trước khi bấm kích hoạt.',
      });
      setTimeout(() => setActivateMsg(null), 3500);
    }

    previousDetectedPlanRef.current = detectedPlanFromInput;
  }, [detectedPlanFromInput, isStandardKeyFlow, isStandardYearOneGradeKeyFlow, isStandardYearThreeGradeKeyFlow]);

  useEffect(() => {
    if (!shouldEvaluateStandardLock) return;

    const requiredGradeCount = requiredGradeCountForInput;
    const existingLock = getStandardGradeLock(normalizedInputKey, currentDeviceId, requiredGradeCount);
    if (existingLock) {
      setActivationGrades(existingLock.grades);
      return;
    }

    // Key Standard mới trên ID máy này phải bắt đầu ở trạng thái trống để phụ huynh chọn lớp chủ động.
    setActivationGrades([]);
  }, [shouldEvaluateStandardLock, normalizedInputKey, currentDeviceId, requiredGradeCountForInput]);

  useEffect(() => {
    setPendingStandardActivation(null);
    setGradeConfirmationChecked(false);
    setIsGradeSelectionConfirmed(false);
    setGradeConfirmDone(false);
  }, [normalizedInputKey]);

  useEffect(() => {
    if (isStandardSelectionLocked) {
      setGradeConfirmationChecked(true);
      setIsGradeSelectionConfirmed(true);
      setGradeConfirmDone(true);
      return;
    }

    setGradeConfirmationChecked(false);
    setIsGradeSelectionConfirmed(false);
    setGradeConfirmDone(false);
  }, [normalizedInputKey, isStandardSelectionLocked]);

  // Load active subscription from DB on mount
  useEffect(() => {
    loadActiveSub();
  }, []);

  useEffect(() => {
    void loadCatalogPricing();
  }, []);

  const loadCatalogPricing = useCallback(async () => {
    try {
      const catalog = await fetchPricingPlans();
      setPricingPlans(mergePricingPlans(PRICING_PLANS, catalog));
      setPricingSynced(true);
    } catch {
      setPricingPlans(PRICING_PLANS);
      setPricingSynced(false);
    }
  }, []);

  const loadActiveSub = useCallback(async () => {
    if (!dbAvailable()) {
      const localPlan = normalizePlanId(localStorage.getItem(PLAN_KEY) || getCurrentPlan());
      const localStatus = localStorage.getItem(SUB_STATUS_KEY);
      const localLicense = localStorage.getItem(LICENSE_KEY) || '';
      const localActivationSource = localStorage.getItem(ACTIVATION_SOURCE_KEY);
      const localExpiry = localStorage.getItem(SUB_EXPIRY_KEY);
      const localBilling = normalizeBillingCycle(localStorage.getItem(SUB_BILLING_KEY));

      const isPaidActive = hasKeyActivatedPaidPlan(localPlan, localStatus, localLicense, localActivationSource);
      if (!isPaidActive || localPlan === 'free') {
        persistFreePlan();
        setCurrentPlan('free');
        setActiveSub(null);
        setSubExpiry(null);
        return;
      }

      if (localExpiry && new Date(localExpiry).getTime() < Date.now()) {
        localStorage.setItem(SUB_STATUS_KEY, 'expired');
        localStorage.removeItem(ACTIVATION_SOURCE_KEY);
        persistFreePlan();
        setCurrentPlan('free');
        setActiveSub(null);
        setSubExpiry(null);
        return;
      }

      setCurrentPlan(localPlan);
      setSubExpiry(localExpiry);
      setActivationGrades(getUnlockedGrades(state.student.grade, localPlan));
      setActiveSub({
        id: 0,
        planId: localPlan,
        billingCycle: localBilling,
        licenseKey: localLicense,
        amount: getPriceForCycle(pricingPlans.find((p) => p.id === localPlan), localBilling),
        status: 'active',
        activatedAt: null,
        expiresAt: localExpiry,
        autoRenew: 0,
        paymentMethod: 'license_key',
        paymentRef: null,
        refundDeadline: null,
        createdAt: new Date().toISOString(),
      });
      return;
    }

    const sub: Subscription | null = await dbGet(
      `SELECT * FROM subscriptions WHERE status = 'active' AND paymentMethod = 'license_key' ORDER BY activatedAt DESC LIMIT 1`
    );
    if (sub) {
      const normalizedPlanId = normalizePlanId(sub.planId);
      setActiveSub(sub);
      setSubExpiry(sub.expiresAt);
      persistPaidPlan(sub.planId || normalizedPlanId, sub.licenseKey, sub.expiresAt, normalizeBillingCycle(sub.billingCycle));
      setCurrentPlan(normalizedPlanId);
      setActivationGrades(getUnlockedGrades(state.student.grade, normalizedPlanId));

      // Check if expired
      if (sub.expiresAt && new Date(sub.expiresAt).getTime() < Date.now()) {
        await dbRun(`UPDATE subscriptions SET status = 'expired', updatedAt = datetime('now') WHERE id = ?`, [sub.id]);
        localStorage.setItem(SUB_STATUS_KEY, 'expired');
        localStorage.removeItem(ACTIVATION_SOURCE_KEY);
        setCurrentPlan('free');
        setActiveSub(null);
      }
      return;
    }

    persistFreePlan();
    setCurrentPlan('free');
    setActiveSub(null);
    setSubExpiry(null);
  }, [pricingPlans, state.student.grade]);

  const getPrice = (plan: PricingPlan) => {
    return getPriceForCycle(plan, billing);
  };

  const completeActivation = useCallback(async (payload: {
    key: string;
    planId: 'standard' | 'premium';
    storagePlanId: 'standard' | 'standard_1year_1grade' | 'standard_1year_3grade' | 'premium';
    cycle: 'monthly' | 'yearly' | 'lifetime';
    expiresAt: string | null;
    standardGrades: number[];
  }) => {
    const { key, planId, storagePlanId, cycle, expiresAt, standardGrades } = payload;
    const refundDeadline = addDays(new Date(), REFUND_DAYS);
    const amount = getPriceForCycle(pricingPlans.find((p) => p.id === storagePlanId || p.id === planId), cycle);
    const unlockedGrades = planId === 'premium'
      ? persistUnlockedGrades([...ALL_GRADE_OPTIONS], 'premium', state.student.grade)
      : persistUnlockedGrades(standardGrades, 'standard', state.student.grade);

    await dbRun(`UPDATE subscriptions SET status = 'expired', updatedAt = datetime('now') WHERE status = 'active'`);

    await dbRun(
      `INSERT INTO subscriptions (planId, billingCycle, licenseKey, amount, status, activatedAt, expiresAt, paymentMethod, refundDeadline)
       VALUES (?, ?, ?, ?, 'active', datetime('now'), ?, 'license_key', ?)`,
      [storagePlanId, cycle, key, amount, expiresAt, refundDeadline],
    );

    persistPaidPlan(storagePlanId, key, expiresAt, cycle);
    setActivationGrades(unlockedGrades);

    const nextGrade = unlockedGrades[0] ?? state.student.grade;
    const subjectsOfGrade = getSubjectsForGrade(nextGrade);
    const firstReadySubject = subjectsOfGrade.find((subject) =>
      state.lessons.some((lesson) => lesson.grade === nextGrade && lesson.subjectCode === subject.code),
    );

    updateStudent({
      grade: nextGrade,
      subjectCode: firstReadySubject?.code || subjectsOfGrade[0]?.code || 'math',
    });

    setCurrentPlan(planId);
    setLicenseKey('');
    await loadActiveSub();
  }, [loadActiveSub, pricingPlans, state.lessons, state.student.grade, updateStudent]);

  const getSavings = (plan: PricingPlan) => {
    if (billing === 'yearly' && plan.monthlyPrice > 0) {
      const fullYear = plan.monthlyPrice * 12;
      return Math.round(((fullYear - plan.yearlyPrice) / fullYear) * 100);
    }
    return 0;
  };

  const openQRPayment = (plan: PricingPlan) => {
    if (plan.id === 'free') {
      setActivateMsg({ type: 'success', text: 'Gói Free đã sẵn sàng. Bạn có thể vào app ngay mà không cần mua thêm.' });
      setTimeout(() => setActivateMsg(null), 5000);
      return;
    }

    const planUrls = WEB_TOTAL_PRODUCT_URLS[plan.id as keyof typeof WEB_TOTAL_PRODUCT_URLS];
    const productUrl = planUrls?.[billing];
    if (!productUrl) {
      setActivateMsg({ type: 'error', text: 'Không tìm thấy trang sản phẩm tương ứng trên Web Tổng.' });
      setTimeout(() => setActivateMsg(null), 5000);
      return;
    }

    window.open(productUrl, '_blank', 'noopener,noreferrer');
    setActivateMsg({ type: 'success', text: 'Đã mở đúng trang sản phẩm trên Web Tổng. Sau khi mua xong, quay lại app để nhập key kích hoạt.' });
    setTimeout(() => setActivateMsg(null), 6000);
  };

  // ========== LICENSE ACTIVATION ==========
  const activateLicense = async () => {
    const key = licenseKey.trim().toUpperCase();
    if (!key) return;
    setIsActivating(true);
    setActivateMsg({ type: 'success', text: '⏳ Đang xác minh key, vui lòng chờ...' });

    try {
      const verifyResult = await verifyLicenseKey({
        licenseKey: key,
        ...(WEB_TOTAL_APP_ID ? { appId: WEB_TOTAL_APP_ID } : {}),
        ...(getBridgeCustomer()?.id ? { customerId: getBridgeCustomer()!.id } : {}),
        deviceId: getDeviceId(),
        deviceName: `${navigator.platform} / ${navigator.userAgent.slice(0, 80)}`,
      });

      const licensePayload = verifyResult.license as unknown as Record<string, unknown>;
      const resolvedPlan = resolvePlanFromLicensePayload(licensePayload, verifyResult.features || []);
      const planHint = getPlanHintFromLicensePayload(licensePayload);
      const detectedPlanByKey = detectPlanFlowFromKey(key);
      const isStandardYearOneGrade = detectedPlanByKey === 'standard_1year_1grade'
        || resolvedPlan === 'standard_1year_1grade'
        || String(verifyResult.license?.planId || '').trim().toLowerCase() === 'standard_1year_1grade'
        || isStandardYearOneGradePlanId(planHint)
        || String(verifyResult.license?.productId || '').trim().toLowerCase() === 'standard_1year_1grade';
      const isStandardYearThreeGrade = !isStandardYearOneGrade && (
        detectedPlanByKey === 'standard_1year_3grade'
        || resolvedPlan === 'standard_1year_3grade'
        || String(verifyResult.license?.planId || '').trim().toLowerCase() === 'standard_1year_3grade'
        || isStandardYearThreeGradePlanId(planHint)
        || String(verifyResult.license?.productId || '').trim().toLowerCase() === 'prod-study-year'
      );
      const detectedBasePlan = detectedPlanByKey === 'premium' ? 'premium' : detectedPlanByKey ? 'standard' : null;
      const resolvedBasePlan = resolvedPlan ? normalizePlanId(resolvedPlan) : null;
      const planId = resolvedBasePlan || detectedBasePlan || normalizePlanId(String(verifyResult.license?.planCode || '').toLowerCase());
      if (!planId || !['standard', 'premium'].includes(planId)) {
        const debugPlanCode = String(
          (verifyResult.license as any)?.metadata?.planId
          || (verifyResult.license as any)?.planId
          || (verifyResult.license as any)?.planCode
          || (verifyResult.license as any)?.plan
          || (verifyResult.license as any)?.tier
          || 'n/a',
        );
        setActivateMsg({ type: 'error', text: `❌ Key hợp lệ nhưng app chưa map được gói trả về (plan=${debugPlanCode}). Vui lòng gửi ảnh lỗi này để cập nhật mapping.` });
        playActivationTone('error');
        setTimeout(() => setActivateMsg(null), 6000);
        return;
      }

      let standardGradesToUse = activationGrades;
      if (planId === 'standard') {
        const requiredGradeCount = isStandardYearOneGrade ? 1 : 3;
        const existingLock = getStandardGradeLock(key, currentDeviceId, requiredGradeCount);
        if (existingLock) {
          standardGradesToUse = existingLock.grades;
        } else {
          const cycle = normalizeBillingCycle(verifyResult.license?.billingCycle);
          const expiresAt = verifyResult.license?.expiresAt || null;
          const storagePlanId: 'standard_1year_1grade' | 'standard_1year_3grade' | 'standard' =
            isStandardYearOneGrade ? 'standard_1year_1grade' : (isStandardYearThreeGrade ? 'standard_1year_3grade' : 'standard');

          setPendingStandardActivation({
            key,
            cycle,
            expiresAt,
            storagePlanId,
            requiredGradeCount,
          });
          setActivationGrades([]);
          setGradeConfirmationChecked(false);
          setIsGradeSelectionConfirmed(false);
          setGradeConfirmDone(false);
          setActivateMsg({
            type: 'success',
            text: isStandardYearOneGrade
              ? '✅ Kích hoạt key thành công. Vui lòng chọn 1 lớp, tick xác nhận và bấm "Xác nhận lựa chọn lớp".'
              : '✅ Kích hoạt key thành công. Vui lòng chọn lớp theo gói, tick xác nhận và bấm "Xác nhận lựa chọn lớp".',
          });
          playActivationTone('success');
          setTimeout(() => setActivateMsg(null), 7000);
          return;
        }
      }

      const cycle = normalizeBillingCycle(verifyResult.license?.billingCycle);
      const expiresAt = verifyResult.license?.expiresAt || null;
      const storagePlanId = planId === 'standard'
        ? (isStandardYearOneGrade ? 'standard_1year_1grade' : (isStandardYearThreeGrade ? 'standard_1year_3grade' : 'standard'))
        : planId;

      const finalPlanId: 'standard' | 'premium' = planId === 'premium' ? 'premium' : 'standard';
      const finalStoragePlanId: 'standard' | 'standard_1year_1grade' | 'standard_1year_3grade' | 'premium' =
        finalPlanId === 'premium'
          ? 'premium'
          : (isStandardYearOneGrade ? 'standard_1year_1grade' : (isStandardYearThreeGrade ? 'standard_1year_3grade' : 'standard'));

      await completeActivation({
        key,
        planId: finalPlanId,
        storagePlanId: finalStoragePlanId,
        cycle,
        expiresAt,
        standardGrades: standardGradesToUse,
      });

      setActivateMsg({
        type: 'success',
        text: `✅ Kích hoạt thành công gói ${pricingPlans.find((p) => p.id === storagePlanId)?.name || pricingPlans.find((p) => p.id === planId)?.name || planId}! ${planId === 'standard' ? `Đã mở khóa ${standardGradesToUse.map((grade) => getGradeLabel(grade)).join(', ')}.` : 'Đã mở toàn bộ lớp. Mời vào học ngay.'} ${expiresAt ? `Hết hạn: ${formatDate(expiresAt)}` : '(Trọn đời)'}`,
      });
      playActivationTone('success');
      setTimeout(() => setActivateMsg(null), 6000);
    } catch (error) {
      const message = (error as any)?.message ? String((error as any).message) : 'Không thể xác minh key. Vui lòng kiểm tra mạng hoặc thử lại sau.';
      setActivateMsg({ type: 'error', text: `❌ Kích hoạt thất bại: ${message}` });
      playActivationTone('error');
      setTimeout(() => setActivateMsg(null), 7000);
    } finally {
      setIsActivating(false);
    }
  };

  // ========== REFUND ==========
  const requestRefund = async () => {
    if (!activeSub) return;
    const refundOk = activeSub.refundDeadline && new Date(activeSub.refundDeadline).getTime() > Date.now();
    if (!refundOk) {
      setActivateMsg({ type: 'error', text: `❌ Đã quá thời hạn hoàn tiền ${REFUND_DAYS} ngày.` });
      setTimeout(() => setActivateMsg(null), 5000);
      return;
    }
    await dbRun(`UPDATE subscriptions SET status = 'refunded', updatedAt = datetime('now') WHERE id = ?`, [activeSub.id]);
    localStorage.setItem(SUB_STATUS_KEY, 'refunded');
    persistFreePlan();
    setCurrentPlan('free');
    setActiveSub(null);
    setSubExpiry(null);
    setActivateMsg({ type: 'success', text: '✅ Yêu cầu hoàn tiền đã được ghi nhận. Vui lòng liên hệ Zalo để nhận hoàn tiền.' });
    setTimeout(() => setActivateMsg(null), 6000);
  };

  const copyContact = () => {
    navigator.clipboard.writeText('hotro@hochungkhoi.vn').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const copyDeviceId = () => {
    navigator.clipboard.writeText(currentDeviceId).then(() => {
      setCopiedDeviceId(true);
      setTimeout(() => setCopiedDeviceId(false), 2000);
    }).catch(() => {});
  };

  const remaining = subExpiry ? daysLeft(subExpiry) : null;
  const canRefund = activeSub?.refundDeadline ? new Date(activeSub.refundDeadline).getTime() > Date.now() : false;
  const premiumButtonBaseClass = 'premium-btn-base inline-flex items-center justify-center gap-2 rounded-[14px] font-bold';
  const premiumButtonPrimaryClass = `${premiumButtonBaseClass} premium-btn-sheen px-5 py-3 text-sm`;
  const premiumButtonSecondaryClass = `${premiumButtonBaseClass} px-5 py-3 text-sm`;
  const premiumButtonCompactClass = `${premiumButtonBaseClass} px-4 py-2.5 text-sm`;
  const topPrimaryButtonStyle = {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.08) 38%, rgba(0,0,0,0.12) 100%), linear-gradient(135deg, #F3DFB1 0%, #D3A85C 54%, #C49240 100%)',
    color: '#1D2A4D',
    border: '1px solid rgba(255,255,255,0.45)',
    boxShadow: '0 14px 24px rgba(10,24,53,0.24), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -2px 0 rgba(103,65,19,0.28)',
  };
  const topSecondaryButtonStyle = {
    background: 'linear-gradient(180deg, #FFFFFF 0%, #EEF4FF 100%)',
    color: '#1D4ED8',
    border: '1px solid #BFD7FF',
    boxShadow: '0 10px 18px rgba(29,78,216,0.12), inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -2px 0 rgba(151,180,230,0.18)',
  };
  const darkPrimaryButtonStyle = {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.04) 42%, rgba(0,0,0,0.18) 100%), linear-gradient(135deg, #1D4A8A 0%, #123463 62%, #102B54 100%)',
    color: '#E6F0FF',
    border: '1px solid rgba(150,184,238,0.58)',
    boxShadow: '0 12px 22px rgba(8,21,49,0.22), inset 0 1px 0 rgba(255,255,255,0.32), inset 0 -2px 0 rgba(8,27,56,0.42)',
  };
  const neutralGhostButtonStyle = {
    background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%)',
    color: '#475569',
    border: '1px solid #D4E3FA',
    boxShadow: '0 8px 14px rgba(24,56,108,0.09), inset 0 1px 0 rgba(255,255,255,0.8)',
  };
  const getPlanPrimaryButtonStyle = (plan: PricingPlan) => {
    if (plan.id === 'premium') {
      return {
        background: 'linear-gradient(180deg, rgba(255,255,255,0.33) 0%, rgba(255,255,255,0.08) 42%, rgba(0,0,0,0.16) 100%), linear-gradient(135deg, #8C63F2 0%, #6E49CC 100%)',
        color: '#FFFFFF',
        border: '1px solid rgba(211,193,255,0.5)',
        boxShadow: '0 12px 20px rgba(38,20,87,0.22), inset 0 1px 0 rgba(255,255,255,0.38), inset 0 -2px 0 rgba(50,26,107,0.42)',
      };
    }
    if (plan.id === 'standard_1year_1grade') {
      return {
        background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.08) 42%, rgba(0,0,0,0.16) 100%), linear-gradient(135deg, #3E7ECB 0%, #285E9F 100%)',
        color: '#FFFFFF',
        border: '1px solid rgba(186,217,255,0.58)',
        boxShadow: '0 12px 20px rgba(17,53,95,0.2), inset 0 1px 0 rgba(255,255,255,0.38), inset 0 -2px 0 rgba(16,48,87,0.34)',
      };
    }
    if (plan.id === 'standard') {
      return {
        background: 'linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.08) 42%, rgba(0,0,0,0.15) 100%), linear-gradient(135deg, #F0AB17 0%, #D58A06 100%)',
        color: '#FFFFFF',
        border: '1px solid rgba(255,230,173,0.56)',
        boxShadow: '0 12px 20px rgba(94,53,7,0.2), inset 0 1px 0 rgba(255,255,255,0.38), inset 0 -2px 0 rgba(118,66,7,0.34)',
      };
    }
    return {
      background: 'linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.08) 40%, rgba(0,0,0,0.16) 100%), linear-gradient(135deg, #24559A 0%, #1A3F74 100%)',
      color: '#FFFFFF',
      border: '1px solid rgba(168,198,244,0.55)',
      boxShadow: '0 12px 20px rgba(10,31,67,0.22), inset 0 1px 0 rgba(255,255,255,0.34), inset 0 -2px 0 rgba(11,35,72,0.4)',
    };
  };
  const getPlanSecondaryButtonStyle = (plan: PricingPlan) => ({
    background: 'linear-gradient(180deg, #FFFFFF 0%, #EEF4FF 100%)',
    color: plan.color,
    border: `1px solid ${plan.color}55`,
    boxShadow: '0 9px 16px rgba(16,41,84,0.12), inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -2px 0 rgba(131,153,196,0.16)',
  });
  const gradeButtonStyle = (selected: boolean) => selected
    ? {
        background: '#FFFFFF',
        color: '#1D4ED8',
        border: '2px solid #60A5FA',
        boxShadow: '0 8px 16px rgba(37,99,235,0.16)',
      }
    : {
        background: '#FFFFFF',
        color: '#475569',
        border: '1px solid #CBD5E1',
        boxShadow: '0 4px 10px rgba(15,23,42,0.08)',
      };

  return (
    <div className="pricing-page-shell h-screen overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
      <div className="pricing-page-container fade-in flex flex-col items-center gap-6 p-4 md:p-5 pb-10 w-full">
      <section className="pricing-pro-hero w-full">
        <div className="pricing-pro-title-card">
          <div className="pricing-pro-mark">
            <span>🎓</span>
          </div>
          <div>
            <h1>Nâng tầm Học Tập Của Bạn</h1>
            <p>Khám phá các gói đăng ký linh hoạt cho học sinh.</p>
          </div>
        </div>

        <div className="pricing-key-status">
          <div className="pricing-key-label">
            <span className="status-dot" />
            Tình trạng key
          </div>
          <div className="pricing-key-main">
            {currentPlan === 'free' ? 'Đang dùng gói Free' : 'Key đang hoạt động'}
          </div>
          <div className="pricing-key-sub">
            {remaining !== null && remaining <= 7 && remaining > 0 && <AlertTriangle size={14} />}
            {remaining !== null && remaining !== Infinity
              ? `Còn ${remaining} ngày${subExpiry ? ` (đến ${formatDate(subExpiry)})` : ''}`
              : activeSub?.billingCycle === 'lifetime'
                ? 'Trọn đời'
                : 'Có thể học tiếp bình thường'}
          </div>
          <div className={`pricing-sync-note ${pricingSynced ? 'is-synced' : ''}`}>
            {pricingSynced ? 'Giá đang đồng bộ từ Web Tổng' : 'Đang dùng giá cục bộ dự phòng'}
          </div>
          <p>Trạng thái ổn định. Có thể học tiếp bình thường.</p>
          <div className="pricing-key-actions">
            <button className={premiumButtonPrimaryClass} style={topPrimaryButtonStyle} onClick={() => navigate('/home')}>
              Vào học ngay →
            </button>
            <button className={premiumButtonSecondaryClass} style={darkPrimaryButtonStyle} onClick={() => document.getElementById('activate-section')?.scrollIntoView({ behavior: 'smooth' })}>
              <Unlock size={14} /> Kích hoạt key
            </button>
            <button className={premiumButtonSecondaryClass} style={neutralGhostButtonStyle} onClick={() => setShowComparison(true)}>
              Xem bảng gói
            </button>
          </div>
        </div>
      </section>

      <section className="pricing-pro-heading w-full">
        <div>
          <div className="pricing-section-kicker">Gói sử dụng</div>
          <h2>Free mặc định. <span>Paid</span> mở bằng key.</h2>
        </div>

        <div className="pricing-pro-toggle">
          {(['monthly', 'yearly', 'lifetime'] as const).map(b => (
            <button
              key={b}
              className={billing === b ? 'active' : ''}
              onClick={() => setBilling(b)}
            >
              {b === 'monthly' ? 'Tháng' : b === 'yearly' ? 'Năm' : 'Trọn đời'}
            </button>
          ))}
        </div>
      </section>

      <section className="pricing-grid-modern pricing-pro-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full items-stretch">
        {visiblePlans.map(plan => {
          const isActive = plan.id === currentPlan || (plan.id === 'standard_1year_1grade' && currentPlanStorageId === 'standard_1year_1grade');
          const price = getPrice(plan);
          const savings = getSavings(plan);
          const productUrl = WEB_TOTAL_PRODUCT_URLS[plan.id as keyof typeof WEB_TOTAL_PRODUCT_URLS]?.[billing];
          const canCheckout = plan.id !== 'free' && plan.pricingSource !== 'local-fallback' && Boolean(productUrl);

          return (
            <div
              key={plan.id}
              className={`pricing-pro-card pricing-pro-card-${plan.id} flex flex-col relative overflow-hidden ${isActive ? 'is-active' : ''}`}
              style={{
                borderColor: isActive ? plan.color : plan.popular ? plan.color : undefined,
              }}
            >
              {plan.popular && (
                <div className="pricing-popular-badge">
                  Phổ biến nhất
                </div>
              )}
              {isActive && (
                <div className="pricing-active-badge">
                  Đang dùng
                </div>
              )}

              <div className="pricing-pro-card-head">
                <div className="pricing-plan-icon">{plan.emoji}</div>
                <div className="pricing-plan-name" style={{ color: plan.color }}>{plan.name}</div>
                <div className="pricing-plan-price" style={{ color: plan.id === 'premium' ? '#8b5cf6' : plan.id === 'standard' ? '#f3c05b' : '#ffffff' }}>
                  {formatVND(price)}
                </div>
                <div className="pricing-plan-cycle">
                  {price === 0 ? 'dùng ngay' : billing === 'monthly' ? '/ tháng' : billing === 'yearly' ? '/ năm' : '/ trọn đời'}
                </div>
                {savings > 0 && <div className="pricing-savings">Tiết kiệm {savings}%</div>}
              </div>

              <ul className="pricing-feature-list flex-1">
                {plan.features.map((f, i) => (
                  <li key={i}>
                    <span className="feature-check" style={{ background: plan.color }}>
                      <Check size={12} />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {!isActive && plan.id !== 'free' ? (
                <div className="pricing-card-actions">
                  {canCheckout ? (
                    <button
                      className={`${premiumButtonPrimaryClass} w-full pricing-card-main-btn`}
                      style={getPlanPrimaryButtonStyle(plan)}
                      onClick={() => openQRPayment(plan)}
                    >
                      <ExternalLink size={14} /> Xem gói trên Web Tổng
                    </button>
                  ) : (
                    <div
                      className="w-full py-2.5 rounded-xl font-bold text-xs text-center"
                      style={{ background: '#FEF3C7', color: '#92400E' }}
                    >
                      {plan.id === 'standard_1year_1grade'
                        ? 'Gói này chỉ bán theo năm trên Web Tổng'
                        : 'Chưa mở bán trực tuyến trên Web tổng'}
                    </div>
                  )}
                  <button
                    className={`${premiumButtonBaseClass} w-full px-4 py-2.5 text-xs pricing-card-sub-btn`}
                    style={getPlanSecondaryButtonStyle(plan)}
                    onClick={() => {
                      const section = document.getElementById('activate-section');
                      section?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <Unlock size={12} className="inline mr-1" /> Tôi đã có key
                  </button>
                </div>
              ) : plan.id === 'free' ? (
                <button
                  className={`${premiumButtonPrimaryClass} w-full pricing-card-main-btn`}
                  style={darkPrimaryButtonStyle}
                  onClick={() => navigate('/home')}
                >
                  Vào app với Free
                </button>
              ) : (
                <button className={`${premiumButtonPrimaryClass} w-full pricing-card-main-btn`} style={topPrimaryButtonStyle} onClick={() => navigate('/home')}>
                  Vào học ngay
                </button>
              )}
            </div>
          );
        })}
      </section>

      <section className="pricing-proof-row w-full">
        <div className="proof-item">
          <div className="proof-icon">⇩</div>
          <div>
            <strong>Tải về là dùng được ngay</strong>
            <p>Không cần tạo tài khoản. Mở app lên là vào được gói Free để trải nghiệm tức thì.</p>
          </div>
        </div>
        <div className="proof-item">
          <div className="proof-icon proof-icon-gold">⌘</div>
          <div>
            <strong>Chọn gói theo đúng nhu cầu</strong>
            <p>Free cho khởi đầu nhanh. Khi cần thêm tính năng, chỉ việc mua key và kích hoạt.</p>
          </div>
        </div>
        <div className="proof-item">
          <div className="proof-icon proof-icon-green">◇</div>
          <div>
            <strong>Mua trên web, mở bằng key</strong>
            <p>Web Tổng dùng để xem gói, mua key và tra cứu đơn hàng. App tập trung vào việc học.</p>
          </div>
        </div>
      </section>

      <section className="pricing-bottom-status w-full">
        <div>● Trạng thái hiện tại: <strong>{currentPlanMeta?.name}</strong></div>
        <div><Clock size={14} /> {remaining !== null && remaining !== Infinity ? `Còn ${remaining} ngày${subExpiry ? ` (đến ${formatDate(subExpiry)})` : ''}` : 'Không giới hạn'}</div>
        <button onClick={() => setShowComparison(true)}>Xem bảng gói chi tiết</button>
      </section>

      {/* Feature comparison toggle */}
      <button
        className={premiumButtonSecondaryClass}
        style={neutralGhostButtonStyle}
        onClick={() => setShowComparison(!showComparison)}
      >
        {showComparison ? 'Ẩn' : 'Xem'} bảng so sánh chi tiết
      </button>

      {/* Feature comparison table */}
      {showComparison && (
        <div className="pricing-comparison-card w-full overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 font-bold" style={{ color: 'var(--color-text-light)' }}>Tính năng</th>
                {visibleComparisonPlans.map(p => (
                  <th key={p.id} className="text-center p-3 font-bold" style={{ color: p.color }}>
                    {p.emoji} {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURE_ROWS.map((row, i) => (
                <tr key={row.key} style={{ background: i % 2 === 0 ? 'var(--color-surface)' : 'transparent' }}>
                  <td className="p-3 text-xs font-medium" style={{ color: 'var(--color-text)' }}>
                    {row.emoji} {row.label}
                  </td>
                  {visibleComparisonPlans.map(plan => {
                    const val = plan.limits[row.key];
                    return (
                      <td key={plan.id} className="text-center p-3">
                        {typeof val === 'boolean' ? (
                          val ? <Check size={16} className="mx-auto" style={{ color: '#059669' }} />
                               : <X size={16} className="mx-auto" style={{ color: '#D1D5DB' }} />
                        ) : (
                          <span className="text-xs font-bold" style={{ color: plan.color }}>
                            {val === 'all' ? '✅ Tất cả' : val}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Active subscription management */}
      {activeSub && currentPlan !== 'free' && (
        <div className="pricing-section-card card w-full p-6">
          <h3 className="text-base font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-primary-dark)' }}>
            <CreditCard size={18} /> Quản lý gói đăng ký
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4">
            <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface)' }}>
              <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Gói</div>
              <div className="font-bold" style={{ color: 'var(--color-primary)' }}>
                {activeSubPlanMeta?.emoji} {activeSubPlanMeta?.name}
              </div>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface)' }}>
              <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Chu kỳ</div>
              <div className="font-bold">
                {activeSub.billingCycle === 'monthly' ? '📅 Tháng' : activeSub.billingCycle === 'yearly' ? '📆 Năm' : '♾️ Trọn đời'}
              </div>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface)' }}>
              <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Kích hoạt</div>
              <div className="font-bold">{formatDate(activeSub.activatedAt)}</div>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface)' }}>
              <div className="text-xs" style={{ color: 'var(--color-text-light)' }}>Hết hạn</div>
              <div className="font-bold" style={{ color: remaining !== null && remaining <= 7 ? '#DC2626' : undefined }}>
                {activeSub.billingCycle === 'lifetime' ? '♾️ Vĩnh viễn' : formatDate(activeSub.expiresAt)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {activeSub.billingCycle !== 'lifetime' && (
              <button
                className={premiumButtonPrimaryClass}
                style={darkPrimaryButtonStyle}
                onClick={() => {
                  const plan = visiblePlans.find(p => p.id === normalizePlanId(activeSub.planId));
                  if (plan) openQRPayment(plan);
                }}
              >
                <RefreshCw size={14} /> Mở trang gia hạn trên web
              </button>
            )}
            {canRefund && (
              <button
                className={premiumButtonCompactClass}
                style={{
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F5 100%)',
                  border: '1px solid #FCA5A5',
                  color: '#DC2626',
                  boxShadow: '0 8px 14px rgba(220,38,38,0.09), inset 0 1px 0 rgba(255,255,255,0.85)',
                }}
                onClick={requestRefund}
              >
                Yêu cầu hoàn tiền ({REFUND_DAYS} ngày)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Activate license */}
      <div id="activate-section" className="pricing-activation-card card w-full p-6">
        <h3 className="text-base font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-primary-dark)' }}>
          <Unlock size={18} /> Kích hoạt hoặc mở sản phẩm trên web
        </h3>
        <p className="text-xs mb-3" style={{ color: 'var(--color-text-light)' }}>
          Nếu chưa có key, hãy mở đúng sản phẩm trên Web Tổng theo gói cần mua. Nếu đã có key, nhập trực tiếp bên dưới để kích hoạt.
        </p>
        <div className="mb-3 rounded-2xl p-3" style={{ background: '#F1F5F9', border: '1px solid #CBD5E1' }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="text-xs font-bold" style={{ color: '#0F172A' }}>ID máy hiện tại (dùng để khóa 1 key / 1 máy)</div>
              <div className="text-[11px] mt-1 break-all" style={{ color: '#334155', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                {currentDeviceId}
              </div>
            </div>
            <button
              className={`${premiumButtonBaseClass} px-3 py-2 text-xs whitespace-nowrap`}
              style={neutralGhostButtonStyle}
              onClick={copyDeviceId}
              title="Copy ID máy"
            >
              {copiedDeviceId ? <CheckCircle size={14} /> : <Copy size={14} />}
              {copiedDeviceId ? 'Đã copy' : 'Copy ID máy'}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <button
            className={`${premiumButtonPrimaryClass} w-full`}
            style={getPlanPrimaryButtonStyle(PRICING_PLANS[1])}
            onClick={() => window.open(WEB_TOTAL_PRODUCT_URLS.standard[billing], '_blank', 'noopener,noreferrer')}
          >
            <ExternalLink size={15} /> Mở gói Standard trên Web Tổng
          </button>
          <button
            className={`${premiumButtonPrimaryClass} w-full`}
            style={getPlanPrimaryButtonStyle(PRICING_PLANS[3])}
            onClick={() => window.open(WEB_TOTAL_PRODUCT_URLS.premium[billing], '_blank', 'noopener,noreferrer')}
          >
            <ExternalLink size={15} /> Mở gói Premium trên Web Tổng
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 mb-4">
          <button
            className={`${premiumButtonPrimaryClass} w-full`}
            style={getPlanPrimaryButtonStyle(PRICING_PLANS[2])}
            onClick={() => window.open(WEB_TOTAL_PRODUCT_URLS.standard_1year_1grade.yearly, '_blank', 'noopener,noreferrer')}
          >
            <ExternalLink size={15} /> Mở gói 1 khóa (01 năm - 01 lớp) Full môn (299k)
          </button>
        </div>
        <div className="mb-3 rounded-2xl p-3" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <div className="text-xs font-bold" style={{ color: '#0F172A' }}>Định dạng key</div>
          <div className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>
            Standard: HHK-STANDARD-XXXXXXXX • Gói 1 khóa (01 năm - 01 lớp): HHK-STANDARD-1Y1G-XXXXXXXX • Standard 01 năm - 03 lớp: WSTL-XXXXXXXX-XXXXXX • Premium: HHK-PREMIUM-XXXXXXXX
          </div>
          {shouldShowRecognizedKeyHint && (
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold"
              style={detectedKeyBadgeStyle}>
              {detectedKeyBadgeText}
            </div>
          )}
        </div>
        <div className="mb-4 rounded-2xl p-4 activation-key-spotlight" style={{ background: 'linear-gradient(135deg, #FFF7E6 0%, #FFFFFF 60%, #EFF6FF 100%)', border: '2px solid #FDBA74', boxShadow: '0 14px 30px rgba(217,119,6,0.16)' }}>
          <div className="text-[13px] font-extrabold tracking-[0.02em]" style={{ color: '#9A3412' }}>NHẬP KEY KÍCH HOẠT NGAY</div>
          <div className="text-xs mt-1 mb-3" style={{ color: '#7C2D12' }}>
            Sau khi nhập key, hệ thống tự nhận diện gói và hướng dẫn bước tiếp theo.
          </div>
          <div className={`flex gap-2 items-stretch rounded-2xl p-2 activation-key-input-shell ${activateMsg?.type === 'error' ? 'is-error' : activateMsg?.type === 'success' ? 'is-success' : ''}`} style={{
            background: '#FFFFFF',
            border: activateMsg?.type === 'error' ? '1px solid #FCA5A5' : activateMsg?.type === 'success' ? '1px solid #86EFAC' : '1px solid #FED7AA',
            boxShadow: activateMsg?.type === 'error'
              ? '0 10px 24px rgba(239,68,68,0.14)'
              : activateMsg?.type === 'success'
                ? '0 10px 24px rgba(16,185,129,0.15)'
                : '0 10px 24px rgba(251,146,60,0.14)',
          }}>
          <input
            type="text"
            className={`premium-input flex-1 px-4 py-3 rounded-xl text-sm uppercase ${activateMsg?.type === 'error' ? 'activation-key-input-error' : activateMsg?.type === 'success' ? 'activation-key-input-success' : ''}`}
            placeholder="Ví dụ: HHK-STANDARD-AB12CD34"
            value={licenseKey}
            onChange={e => setLicenseKey(e.target.value.toUpperCase())}
            maxLength={25}
            disabled={isActivating}
          />
            <button className={premiumButtonPrimaryClass} onClick={activateLicense} disabled={!licenseKey.trim() || isActivating} style={{ ...darkPrimaryButtonStyle, minWidth: 170 }}>
              {isActivating ? <RefreshCw size={16} className="animate-spin" /> : <Unlock size={16} />}
              {isActivating ? 'Đang xác minh...' : 'Kích hoạt ngay'}
            </button>
          </div>
          {isActivating && (
            <div className="mt-2 text-xs font-bold" style={{ color: '#1D4ED8' }}>
              Đang kiểm tra key với hệ thống, vui lòng không tắt ứng dụng...
            </div>
          )}
          <div
            className="text-xs mt-2 rounded-xl px-3 py-2 font-bold"
            style={
              shouldShowRecognizedKeyHint
                ? {
                    color: '#065F46',
                    background: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                  }
                : {
                    color: '#9A3412',
                    background: '#FFF7ED',
                    border: '1px solid #FDBA74',
                  }
            }
          >
            {detectedKeyDetailText}
          </div>
        </div>
        <div ref={gradePickerRef} className="mb-4 rounded-2xl p-4 activation-grade-card" style={{ background: '#F8FBFF', border: '2px solid #93C5FD', opacity: isPremiumKeyFlow ? 0.72 : 1 }}>
          <div className="text-base font-extrabold" style={{ color: '#0F172A' }}>Bước 2: Chọn lớp muốn mở</div>
          <div className="text-sm mt-1" style={{ color: '#334155' }}>
            {requiredGradeCountForInput === 1
              ? 'Key gói 1 khóa (01 năm - 01 lớp): chọn đúng 1 lớp. Key Premium: tự mở tất cả lớp.'
              : (isPendingThreeGrade || isStandardYearThreeGradeKeyFlow)
                ? 'Key Standard 01 năm - 03 lớp: chọn đúng 3 lớp. Key Premium: tự mở tất cả lớp.'
              : 'Key Standard: chọn đúng 3 lớp. Key Premium: tự mở tất cả lớp.'}
          </div>
          <div className="mt-2 rounded-xl px-3 py-2 text-sm font-bold" style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D' }}>
            ⚠️ Lưu ý quan trọng: Với key Standard, lựa chọn {requiredGradeCountForInput} lớp chỉ áp dụng 1 lần đầu theo ID máy này và không thể thay đổi.
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {ALL_GRADE_OPTIONS.map((grade) => {
              const selected = activationGrades.includes(grade);
              return (
                <button
                  key={grade}
                  className={`${premiumButtonBaseClass} px-4 py-3 text-sm md:text-base min-w-[96px]`}
                  style={{
                    ...gradeButtonStyle(selected),
                    opacity: isPremiumKeyFlow ? 0.45 : 1,
                    cursor: isPremiumKeyFlow || isStandardSelectionLocked ? 'not-allowed' : 'pointer',
                  }}
                  onClick={() => toggleActivationGrade(grade)}
                  disabled={isPremiumKeyFlow || isStandardSelectionLocked}
                >
                  {getGradeLabel(grade)}
                </button>
              );
            })}
          </div>
          <div className="text-sm mt-2 font-extrabold" style={{ color: activationGrades.length === requiredGradeCountForInput ? '#059669' : '#1D4ED8' }}>
            {isPremiumKeyFlow
              ? 'Premium: tự mở toàn bộ lớp, không cần chọn thủ công.'
              : isStandardSelectionLocked
                ? `Đã khóa lựa chọn cho key này: ${activationGrades.map((grade) => getGradeLabel(grade)).join(', ')}.`
                : !hasPendingStandardActivation
                  ? 'Bấm Kích hoạt thành công trước, sau đó mới chọn lớp.'
                : `Đã chọn: ${activationGrades.length}/${requiredGradeCountForInput} lớp cho key Standard`}
          </div>
          {hasTypedLicenseKey && !isPremiumKeyFlow && !isStandardSelectionLocked && (
            <div className="mt-3 rounded-xl px-3 py-3" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
              <label className="flex items-start gap-2 text-sm font-semibold" style={{ color: '#1E3A8A' }}>
                <input
                  type="checkbox"
                  checked={gradeConfirmationChecked}
                  onChange={(event) => {
                    setGradeConfirmationChecked(event.target.checked);
                    if (!event.target.checked) {
                      setIsGradeSelectionConfirmed(false);
                      setGradeConfirmDone(false);
                    }
                  }}
                  disabled={!hasSelectedEnoughGrades || !hasPendingStandardActivation}
                  style={{ marginTop: 3 }}
                />
                <span>Tôi xác nhận đây là các lớp muốn khóa cho key này trên thiết bị hiện tại.</span>
              </label>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <button
                  className={`${premiumButtonBaseClass} px-4 py-2.5 text-sm`}
                  style={hasSelectedEnoughGrades && hasPendingStandardActivation ? darkPrimaryButtonStyle : neutralGhostButtonStyle}
                  onClick={confirmSelectedGrades}
                  disabled={!hasSelectedEnoughGrades || !hasPendingStandardActivation}
                >
                  <Check size={16} />
                  Xác nhận lựa chọn lớp
                </button>
                <div className="text-sm font-semibold" style={{ color: isGradeSelectionConfirmed ? '#047857' : '#475569' }}>
                  {isGradeSelectionConfirmed
                    ? `Đã xác nhận: ${activationGrades.map((grade) => getGradeLabel(grade)).join(', ')}`
                    : 'Chưa xác nhận lựa chọn lớp.'}
                </div>
              </div>
            </div>
          )}
          <div className="text-sm mt-1" style={{ color: '#475569' }}>
            {isPremiumKeyFlow
              ? 'Bạn có thể bấm Kích hoạt ngay.'
              : isStandardSelectionLocked
                ? `Hệ thống sẽ dùng đúng ${requiredGradeCountForInput} lớp đã khóa khi kích hoạt.`
                : isGradeSelectionConfirmed
                  ? 'Lựa chọn lớp đã được xác nhận. Bạn có thể kích hoạt key.'
                : 'Lớp đứng đầu danh sách sẽ là lớp hiện tại sau khi kích hoạt.'}
          </div>
        </div>
        {activateMsg && (
          <div className="mt-3 flex flex-col gap-2">
            <div className="rounded-xl px-3 py-2 text-sm font-bold" style={{
              color: activateMsg.type === 'success' ? '#065F46' : '#991B1B',
              background: activateMsg.type === 'success' ? '#ECFDF5' : '#FEF2F2',
              border: activateMsg.type === 'success' ? '1px solid #A7F3D0' : '1px solid #FCA5A5',
            }}>
              {activateMsg.type === 'success' ? '✅ ' : '❌ '}{activateMsg.text}
            </div>
            {activateMsg.actionUrl && activateMsg.actionLabel && (
              <div>
                <button
                  className={`${premiumButtonBaseClass} px-3 py-2 text-xs`}
                  style={topSecondaryButtonStyle}
                  onClick={() => window.open(activateMsg.actionUrl, '_blank', 'noopener,noreferrer')}
                >
                  {activateMsg.actionLabel}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showGradeConfirmModal && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center px-4"
          style={{ background: 'rgba(2, 6, 23, 0.55)', backdropFilter: 'blur(2px)' }}
        >
          <div
            className="w-full max-w-md rounded-2xl p-5"
            style={{
              background: '#FFFFFF',
              border: '1px solid #BFDBFE',
              boxShadow: '0 24px 48px rgba(15, 23, 42, 0.32)',
              animation: 'fadeIn 0.18s ease-out',
            }}
          >
            {!gradeConfirmDone ? (
              <>
                <div className="text-base font-extrabold" style={{ color: '#0F172A' }}>Xác nhận lựa chọn lớp</div>
                <div className="text-sm mt-2" style={{ color: '#334155' }}>
                  Bạn chắc chắn đồng ý khóa các lớp: <strong>{activationGrades.map((grade) => getGradeLabel(grade)).join(', ')}</strong> cho key này?
                </div>
                <div className="text-xs mt-2" style={{ color: '#B45309' }}>
                  Sau khi kích hoạt lần đầu theo ID máy này, danh sách lớp sẽ không thể thay đổi.
                </div>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    className={`${premiumButtonBaseClass} px-4 py-2 text-sm`}
                    style={neutralGhostButtonStyle}
                    onClick={() => {
                      setShowGradeConfirmModal(false);
                      setIsGradeSelectionConfirmed(false);
                    }}
                  >
                    Chưa đồng ý
                  </button>
                  <button
                    className={`${premiumButtonBaseClass} px-4 py-2 text-sm`}
                    style={darkPrimaryButtonStyle}
                    onClick={() => { void acceptGradeConfirmation(); }}
                  >
                    Đồng ý xác nhận
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-base font-extrabold" style={{ color: '#047857' }}>✅ Đã xác nhận thành công</div>
                <div className="text-sm mt-2" style={{ color: '#334155' }}>
                  Lựa chọn lớp đã được chốt. Bạn có thể kích hoạt key ngay hoặc vào học.
                </div>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    className={`${premiumButtonBaseClass} px-4 py-2 text-sm`}
                    style={neutralGhostButtonStyle}
                    onClick={() => setShowGradeConfirmModal(false)}
                  >
                    Ở lại kích hoạt key
                  </button>
                  <button
                    className={`${premiumButtonBaseClass} px-4 py-2 text-sm`}
                    style={topPrimaryButtonStyle}
                    onClick={() => {
                      setShowGradeConfirmModal(false);
                      navigate('/home');
                    }}
                  >
                    Vào học ngay
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Purchase info */}
      <div className="pricing-section-card card w-full p-6">
        <h3 className="text-base font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-primary-dark)' }}>
          <Gift size={18} /> Hướng dẫn mua hàng
        </h3>
        <div className="flex flex-col gap-3 text-sm" style={{ color: 'var(--color-text)' }}>
          <div className="flex items-start gap-2">
            <span className="text-lg">1️⃣</span>
            <div>
              <strong>Chọn gói</strong> phù hợp ở trên → Bấm <strong>"Xem gói trên Web Tổng"</strong>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-lg">2️⃣</span>
            <div>
              <strong>Mua đúng gói</strong> trên Web Tổng và hoàn tất thanh toán tại đó.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-lg">3️⃣</span>
            <div>
              <strong>Nhận key kích hoạt</strong> từ trang đơn hàng hoặc cổng khách hàng của Web Tổng.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-lg">4️⃣</span>
            <div>
              <strong>Nhập key</strong> vào ô <em>"Nhập mã kích hoạt"</em> trong app để mở đúng gói đã mua.
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-4 p-3 rounded-lg flex items-center gap-3" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
          <span className="text-2xl">📞</span>
          <div className="flex-1 text-xs">
            <strong>Liên hệ mua hàng & hỗ trợ:</strong><br />
            Zalo: 0901234567 · Email: hotro@hochungkhoi.vn
          </div>
          <button className={`${premiumButtonBaseClass} p-2 text-xs`} style={neutralGhostButtonStyle} onClick={copyContact} title="Copy email">
            {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* Refund policy */}
      <div className="pricing-policy-card card w-full p-5" style={{ background: '#FFF7ED', border: '1px solid #FDBA74' }}>
        <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: '#9A3412' }}>
          <Shield size={16} /> Chính sách hoàn tiền
        </h3>
        <p className="text-xs mt-2" style={{ color: '#78350F' }}>
          Hoàn tiền <strong>100%</strong> trong vòng <strong>{REFUND_DAYS} ngày</strong> kể từ ngày kích hoạt nếu không hài lòng.
          Liên hệ qua Zalo hoặc bấm nút "Yêu cầu hoàn tiền" trong mục Quản lý gói đăng ký.
        </p>
      </div>

      {/* Promotions */}
      <div className="pricing-promo-card card w-full p-5 text-center" style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', border: '2px solid #F59E0B' }}>
        <span className="text-3xl">🎁</span>
        <h3 className="text-base font-bold mt-2" style={{ color: '#92400E' }}>Ưu đãi đặc biệt!</h3>
        <div className="flex flex-col gap-1 mt-2 text-sm" style={{ color: '#78350F' }}>
          <p>🔥 <strong>Giảm 20%</strong> khi mua gói Năm (đã áp dụng trong giá)</p>
          <p>🎉 <strong>Tặng 1 tháng</strong> khi giới thiệu bạn bè mua gói</p>
          <p>👨‍👩‍👧‍👦 <strong>Giảm 30%</strong> cho anh/chị/em ruột (gói gia đình)</p>
          <p>🏫 <strong>Giảm 50%</strong> cho trường học mua từ 20 gói</p>
        </div>
      </div>

      {/* FAQ */}
      <div className="pricing-section-card card w-full p-6">
        <h3 className="text-base font-bold mb-3" style={{ color: 'var(--color-primary-dark)' }}>❓ Câu hỏi thường gặp</h3>
        <div className="flex flex-col gap-3 text-sm">
          <div>
            <strong style={{ color: 'var(--color-text)' }}>Có thể dùng thử trước khi mua không?</strong>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>
              Có! Gói Miễn phí có đầy đủ nội dung 1 môn Toán. Bạn có thể dùng thử thoải mái trước khi nâng cấp.
            </p>
          </div>
          <div>
            <strong style={{ color: 'var(--color-text)' }}>Mua trên Web Tổng hoạt động thế nào?</strong>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>
              Bấm "Xem gói trên Web Tổng" → Mở đúng trang sản phẩm → Thanh toán trên Web Tổng → Nhận key và quay lại app để kích hoạt.
            </p>
          </div>
          <div>
            <strong style={{ color: 'var(--color-text)' }}>Mã kích hoạt dùng được bao lâu?</strong>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>
              Gói Tháng: 30 ngày. Gói Năm: 365 ngày. Gói Trọn đời: vĩnh viễn, kể cả khi cài lại.
            </p>
          </div>
          <div>
            <strong style={{ color: 'var(--color-text)' }}>Có hoàn tiền không?</strong>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>
              Hoàn tiền 100% trong {REFUND_DAYS} ngày đầu nếu không hài lòng. Liên hệ Zalo hoặc bấm nút hoàn tiền.
            </p>
          </div>
          <div>
            <strong style={{ color: 'var(--color-text)' }}>Khi hết hạn sẽ ra sao?</strong>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>
              Ứng dụng sẽ thông báo trước 7 ngày. Khi hết hạn, bạn vẫn giữ dữ liệu nhưng chuyển về gói Miễn phí.
              Gia hạn bất cứ lúc nào để khôi phục quyền lợi.
            </p>
          </div>
          <div>
            <strong style={{ color: 'var(--color-text)' }}>Dùng được trên bao nhiêu thiết bị?</strong>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-light)' }}>
              Mỗi mã kích hoạt dùng trên 1 thiết bị. Liên hệ hỗ trợ nếu cần chuyển thiết bị.
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

