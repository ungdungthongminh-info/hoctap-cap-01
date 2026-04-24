# Học Chung Khối - Backend API

Node.js + Express + TypeScript backend server for HHK educational platform with SePay payment integration.

## 📋 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- SePay account (sandbox or production)

### Installation

```bash
cd backend
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and fill in your SePay credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
SEPAY_CLIENT_ID=SP_TEST_XXXXXXXXX
SEPAY_API_KEY=spsk_test_xxxxxxxxxxxxx
SEPAY_WEBHOOK_SECRET=ws_test_xxxxxxxxxxxxx
SEPAY_ENVIRONMENT=sandbox
```

### Development

```bash
npm run dev
```

Server will start at `http://localhost:5000`

### Production Build

```bash
npm run build
npm start
```

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### Payment API

#### 1. Create Payment Order
```http
POST /api/v1/payments/create
Authorization: Bearer {userId}
Content-Type: application/json

{
  "planId": "standard",
  "billingCycle": "yearly"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderCode": "ORD1681234567890",
    "orderId": "uuid...",
    "amount": 699000,
    "qrUrl": "https://qr.sepay.vn/...",
    "expiresAt": "2024-04-19T10:45:00Z"
  }
}
```

#### 2. Check Payment Status
```http
GET /api/v1/payments/{orderCode}/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "pending|paid|expired|failed",
    "amount": 699000,
    "planId": "standard"
  }
}
```

#### 3. Get User Subscription
```http
GET /api/v1/subscriptions/me
Authorization: Bearer {userId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "planId": "standard",
    "billingCycle": "yearly",
    "status": "active",
    "expiresAt": "2025-04-19T10:00:00Z",
    "activatedAt": "2024-04-19T10:00:00Z"
  }
}
```

#### 4. Get Pricing Plans
```http
GET /api/v1/plans
```

**Response:**
```json
{
  "success": true,
  "data": {
    "free": { "id": "free", "name": "Miễn phí", ... },
    "standard": { "id": "standard", "prices": { "monthly": 89000, ... }, ... },
    ...
  }
}
```

### Webhook API

#### SePay Webhook Callback
```http
POST /api/v1/webhooks/sepay
Content-Type: application/json
x-sepay-signature: {HMAC-SHA256}

{
  "orderCode": "ORD1681234567890",
  "transactionId": "TXN123456",
  "amount": 699000,
  "status": "success"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "subscriptionId": "uuid..."
}
```

---

## 🔐 Security

### Webhook Signature Verification

SePay sends a `x-sepay-signature` header with HMAC-SHA256 signature:

```
signature = HMAC-SHA256(request_body, webhook_secret)
```

The backend verifies this signature before processing any webhook.

### Amount Validation

- Server always validates payment amount against the stored order
- Prevents tampering attempts
- Rejects if amounts don't match

### Idempotency

- Webhook handler checks if order already processed
- Prevents duplicate subscriptions from multiple webhook calls
- Always returns success (200 OK) to webhook sender

---

## 📦 Database Schema

### users
```sql
id (PRIMARY KEY)
email (UNIQUE)
password_hash
full_name
created_at
updated_at
```

### payment_orders
```sql
id (PRIMARY KEY)
order_code (UNIQUE)
user_id (FOREIGN KEY)
plan_id
billing_cycle
amount
status (pending|paid|expired|failed)
provider_txn_id
payment_method
created_at
updated_at
expires_at (15 minutes from creation)
```

### subscriptions
```sql
id (PRIMARY KEY)
user_id (FOREIGN KEY)
plan_id
billing_cycle
status (active|cancelled|expired)
payment_order_id (FOREIGN KEY)
activated_at
expires_at
refund_deadline (3 days from activation)
created_at
updated_at
```

---

## 💰 Pricing Plans

| Plan | Monthly | Yearly | Lifetime | Subjects | Grades | Profiles |
|------|---------|--------|----------|----------|--------|----------|
| Free | - | - | - | 1 | 1 | 1 |
| Standard | 89K | 599K | 999K | ∞ | ∞ | 3 |
| Premium | 119K | 899K | 1.599M | ∞ | ∞ | 5 |

Lưu ý: luồng tích hợp Web Tổng hiện chỉ còn `free`, `standard`, `premium`. Gói `basic` đã được loại khỏi pricing/activation integration.

---

## 🧪 Testing with ngrok

To test webhooks locally:

```bash
# In separate terminal
ngrok http 5000

# Copy the URL, e.g., https://abc123.ngrok.io
# Set in SePay dashboard:
# Webhook URL: https://abc123.ngrok.io/api/v1/webhooks/sepay
```

---

## 📝 TODO

- [ ] User authentication (JWT)
- [ ] User registration/login endpoints
- [ ] Email notifications for payments
- [ ] Refund handling
- [ ] Payment retry logic
- [ ] Admin dashboard API
- [ ] Logging & monitoring
- [ ] Unit tests
- [ ] Docker configuration
- [ ] Database migrations

---

## 🔗 Frontend Integration

See `../src/modules/student/pages/PricingPage.tsx` for frontend payment flow.

**Frontend → Backend Flow:**
1. User clicks "Thanh toán" → calls `POST /api/v1/payments/create`
2. Frontend shows QR code from `qrUrl`
3. User scans QR and pays
4. Frontend polls `GET /api/v1/payments/:orderCode/status` every 2-3 seconds
5. SePay calls webhook → payment confirmed
6. Frontend gets success response → shows confirmation & updates UI

---

## 📞 Support

For SePay integration issues, refer to:
- [SePay Docs](https://sep.vy.vn/docs)
- [SePay Sandbox](https://sandbox.sepay.vn)

---

**Last Updated:** April 19, 2026
