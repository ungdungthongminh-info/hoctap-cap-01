// Payment Plans Configuration
export const PRICING_PLANS = {
  free: {
    id: 'free',
    name: 'Miễn phí',
    price: 0,
    currency: 'VND',
    billingCycles: [] as string[],
    features: {
      subjects: 1,
      grades: 1,
      profiles: 1,
      ai_chat: true,
      weak_priority: false,
      priority_support: false
    }
  },
  standard: {
    id: 'standard',
    name: 'Standard (Phổ biến)',
    currency: 'VND',
    billingCycles: {
      monthly: 89000,
      yearly: 699000,
      lifetime: 1299000
    },
    features: {
      subjects: null, // unlimited
      grades: 3,
      profiles: 3,
      ai_chat: true,
      weak_priority: true,
      priority_support: false
    }
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    currency: 'VND',
    billingCycles: {
      monthly: 149000,
      yearly: 1190000,
      lifetime: 1990000
    },
    features: {
      subjects: null, // unlimited
      grades: null, // unlimited
      profiles: 5,
      ai_chat: true,
      weak_priority: true,
      priority_support: true
    }
  }
};

function getSandboxTestPrice(planId: string, billingCycle: string): number | null {
  const env = (process.env.SEPAY_ENVIRONMENT || '').toLowerCase();
  if (env !== 'sandbox') {
    return null;
  }

  const testPlanId = process.env.SANDBOX_TEST_PLAN_ID || 'standard';
  const testBillingCycle = process.env.SANDBOX_TEST_BILLING_CYCLE || 'monthly';
  const testAmount = Number(process.env.SANDBOX_TEST_AMOUNT || 2000);

  if (planId === testPlanId && billingCycle === testBillingCycle && Number.isFinite(testAmount) && testAmount > 0) {
    return Math.round(testAmount);
  }

  return null;
}

export function getPlan(planId: string) {
  return (PRICING_PLANS as any)[planId] || null;
}

export function getPlanPrice(planId: string, billingCycle: string): number {
  const sandboxPrice = getSandboxTestPrice(planId, billingCycle);
  if (sandboxPrice !== null) {
    return sandboxPrice;
  }

  const plan = getPlan(planId);
  if (!plan || !plan.billingCycles) return 0;
  return plan.billingCycles[billingCycle] || 0;
}
