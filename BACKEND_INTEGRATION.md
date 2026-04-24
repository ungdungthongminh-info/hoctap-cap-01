# Frontend Integration Guide

How to integrate the backend payment API with your React frontend.

## 1. Update PricingPage Component

Replace the current `openQRPayment()` function to call the backend API:

```typescript
// File: src/modules/student/pages/PricingPage.tsx

async function openQRPayment(plan: PricingPlan) {
  try {
    setLoading(true);
    setError(null);

    const billingCycle = selectedCycle; // 'monthly' | 'yearly' | 'lifetime'
    const userId = localStorage.getItem('userId') || 'user123'; // Get from auth

    // Call backend to create payment order
    const response = await fetch('http://localhost:5000/api/v1/payments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userId}`,
        'x-user-id': userId
      },
      body: JSON.stringify({
        planId: plan.id,
        billingCycle
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create payment order');
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Payment creation failed');
    }

    const { orderCode, qrUrl, amount, expiresAt } = data.data;

    // Show QR code modal
    setQRModal({
      visible: true,
      qrUrl,
      orderCode,
      amount,
      expiresAt,
      plan: plan.name
    });

    // Start polling for payment status
    pollPaymentStatus(orderCode);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Unknown error');
    console.error('Payment error:', err);
  } finally {
    setLoading(false);
  }
}

// Poll for payment status every 2 seconds
function pollPaymentStatus(orderCode: string) {
  const pollInterval = setInterval(async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/payments/${orderCode}/status`
      );
      const data = await response.json();

      if (data.data && data.data.status === 'paid') {
        clearInterval(pollInterval);
        setQRModal({ visible: false });
        
        // Show success message
        showNotification('✅ Thanh toán thành công!');
        
        // Refresh subscription
        await refreshUserSubscription();
        
        // Close modal after 2 seconds
        setTimeout(() => {
          // Navigate or update UI
        }, 2000);
      } else if (data.data && data.data.status === 'expired') {
        clearInterval(pollInterval);
        setError('Đơn hàng đã hết hạn. Hãy tạo đơn hàng mới.');
      }
    } catch (err) {
      console.error('Polling error:', err);
    }
  }, 2000); // Poll every 2 seconds

  // Auto-stop polling after 15 minutes
  setTimeout(() => clearInterval(pollInterval), 15 * 60 * 1000);
}

// Fetch current user subscription
async function refreshUserSubscription() {
  try {
    const userId = localStorage.getItem('userId') || 'user123';
    const response = await fetch('http://localhost:5000/api/v1/subscriptions/me', {
      headers: {
        'Authorization': `Bearer ${userId}`,
        'x-user-id': userId
      }
    });

    const data = await response.json();
    
    if (data.data) {
      // Update app state with new subscription
      localStorage.setItem('userSubscription', JSON.stringify(data.data));
      
      // Dispatch event or callback to update UI
      window.dispatchEvent(
        new CustomEvent('subscriptionUpdated', { detail: data.data })
      );
    }
  } catch (err) {
    console.error('Failed to refresh subscription:', err);
  }
}
```

## 2. Environment Variables

Update your frontend `.env`:

```
VITE_API_URL=http://localhost:5000
VITE_API_PREFIX=/api/v1
```

Then use in code:

```typescript
const API_URL = `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_PREFIX}`;
```

## 3. Update Authentication

In your app initialization, ensure user ID is stored:

```typescript
// After user logs in
const userId = getAuthenticatedUserId();
localStorage.setItem('userId', userId);

// Use in API calls
const headers = {
  'Authorization': `Bearer ${userId}`,
  'x-user-id': userId,
  'Content-Type': 'application/json'
};
```

## 4. Handle Subscription Status in UI

Create a hook to manage subscription state:

```typescript
// src/hooks/useSubscription.ts

import { useEffect, useState } from 'react';

interface Subscription {
  planId: string;
  billingCycle: string;
  status: string;
  expiresAt: string;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/subscriptions/me`,
          {
            headers: {
              'Authorization': `Bearer ${userId}`,
              'x-user-id': userId
            }
          }
        );

        const data = await response.json();
        setSubscription(data.data);
      } catch (err) {
        console.error('Failed to fetch subscription:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();

    // Listen for subscription updates
    const handleUpdate = (event: CustomEvent) => {
      setSubscription(event.detail);
    };

    window.addEventListener('subscriptionUpdated', handleUpdate as EventListener);

    return () => {
      window.removeEventListener('subscriptionUpdated', handleUpdate as EventListener);
    };
  }, []);

  return { subscription, loading };
}
```

Use in component:

```typescript
function App() {
  const { subscription } = useSubscription();

  return (
    <div>
      {subscription ? (
        <p>Gói hiện tại: {subscription.planId} (Hết hạn: {subscription.expiresAt})</p>
      ) : (
        <p>Chưa có gói nào</p>
      )}
    </div>
  );
}
```

## 5. Error Handling

Implement proper error handling:

```typescript
type PaymentError = 'NETWORK' | 'INVALID_PLAN' | 'AMOUNT_MISMATCH' | 'EXPIRED' | 'UNKNOWN';

function mapErrorToMessage(error: PaymentError): string {
  const messages = {
    NETWORK: 'Lỗi kết nối. Hãy kiểm tra internet và thử lại.',
    INVALID_PLAN: 'Gói học không hợp lệ.',
    AMOUNT_MISMATCH: 'Số tiền không khớp. Tạo đơn mới và thử lại.',
    EXPIRED: 'Đơn hàng hết hạn. Tạo đơn mới.',
    UNKNOWN: 'Có lỗi xảy ra. Vui lòng thử lại sau.'
  };
  return messages[error];
}
```

## 6. Testing

### Test with Backend Running Locally

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd ..
npm run dev
```

### Test Payment Flow

1. Open browser to `http://localhost:5173`
2. Navigate to Pricing page
3. Click "Thanh toán"
4. Inspect Network tab to verify API calls:
   - `POST /api/v1/payments/create` → should return QR code
   - `GET /api/v1/payments/:orderCode/status` → should show 'pending' then 'paid'

### Sample curl Commands

```bash
# Create payment order
curl -X POST http://localhost:5000/api/v1/payments/create \
  -H "Content-Type: application/json" \
  -H "x-user-id: user123" \
  -d '{"planId":"standard","billingCycle":"yearly"}'

# Check payment status
curl http://localhost:5000/api/v1/payments/ORD1681234567890/status

# Test webhook (manual)
curl -X POST http://localhost:5000/api/v1/webhooks/sepay \
  -H "Content-Type: application/json" \
  -H "x-sepay-signature: ..." \
  -d '{
    "orderCode":"ORD1681234567890",
    "transactionId":"TXN123",
    "amount":699000,
    "status":"success"
  }'
```

---

## Deployment Checklist

- [ ] Update `VITE_API_URL` to production backend URL
- [ ] Ensure CORS is configured for production domain
- [ ] Setup SSL/HTTPS for payment handling
- [ ] Use environment-specific API endpoints (dev/staging/prod)
- [ ] Implement proper authentication (JWT)
- [ ] Add error tracking (Sentry, etc.)
- [ ] Test webhook with production SePay credentials
- [ ] Setup database backups
- [ ] Configure email notifications
- [ ] Load testing for payment endpoints

---

**Last Updated:** April 19, 2026
