# Payment Testing Guide - Postman

## ✅ Problem Solved
Fixed "Invalid API Key provided: sk_test_***********************here" error

## 🎯 Solution: Test Mode Enabled

The API now works in **TEST MODE** by default - no real Stripe or PayPal keys needed!

---

## How It Works

### Test Mode Configuration

The backend is configured for test mode in `appsettings.Development.json`:

```json
"Payment": {
  "TestMode": true,
  "AllowMockPayments": true
}
```

**What this means:**
- ✅ Stripe endpoints work without real API keys
- ✅ PayPal endpoints work without real credentials
- ✅ All payments return mock/simulated responses
- ✅ Perfect for testing and development!

---

## Testing Payments in Postman

### 1. Create a Stripe Payment Intent

**Endpoint:** `POST /api/payments/stripe/create-intent`

**Request:**
```json
{
  "bookingId": "68e44c4e7f1934fa1165193e",
  "customerId": "68e6b2d07f1934fa11651945",
  "amount": 100.00,
  "currency": "USD",
  "description": "Test payment for car rental"
}
```

**Response (Test Mode):**
```json
{
  "id": "68e6c1ab1510e9f3079e500a",
  "bookingId": "68e44c4e7f1934fa1165193e",
  "customerId": "68e6b2d07f1934fa11651945",
  "amount": 100.0,
  "currency": "USD",
  "paymentMethod": 0,
  "paymentProvider": 0,
  "status": 0,
  "description": "Test payment for car rental",
  "clientSecret": "pi_mock_c3c1af1169564a9eb5ab4213_secret_0071a4a359b24f7bad627537",
  "createdAt": "2025-10-08T19:55:23.924444Z",
  "updatedAt": "2025-10-08T19:55:23.924444Z"
}
```

Note the **`clientSecret`** starts with `pi_mock_` - this indicates test mode!

---

### 2. Create a PayPal Order

**Endpoint:** `POST /api/payments/paypal/create-order`

**Request:**
```json
{
  "bookingId": "68e44c4e7f1934fa1165193e",
  "customerId": "68e6b2d07f1934fa11651945",
  "amount": 200.00,
  "currency": "USD",
  "description": "PayPal payment for car rental"
}
```

**Response (Test Mode):**
```json
{
  "id": "...",
  "paymentUrl": "https://www.sandbox.paypal.com/checkoutnow?token=MOCK_PAYMENT_TOKEN_...",
  ...
}
```

The **`paymentUrl`** starts with `MOCK_PAYMENT_TOKEN_` in test mode!

---

### 3. Confirm a Payment

**Endpoint:** `POST /api/payments/stripe/confirm`

**Request:**
```json
{
  "paymentId": "68e6c1ab1510e9f3079e500a",
  "transactionId": "pi_mock_c3c1af1169564a9eb5ab4213"
}
```

**Response:**
```json
{
  "id": "68e6c1ab1510e9f3079e500a",
  "status": 1,  // Succeeded
  "transactionId": "pi_mock_c3c1af1169564a9eb5ab4213",
  ...
}
```

---

## Complete Payment Workflow

### Step-by-Step Test Flow

1. **Create a Customer**
   ```
   POST /api/customers/get-or-create
   → Save customer_id
   ```

2. **Get a Car**
   ```
   GET /api/cars
   → Copy a car_id
   ```

3. **Create a Booking**
   ```
   POST /api/bookings
   {
     "customerId": "{{customer_id}}",
     "carId": "{{car_id}}",
     "pickupDate": "2025-12-15T10:00:00Z",
     "returnDate": "2025-12-20T10:00:00Z",
     "pickupLocation": "Airport Terminal 1",
     "returnLocation": "Airport Terminal 1"
   }
   → Save booking_id
   ```

4. **Create Payment Intent (Stripe)**
   ```
   POST /api/payments/stripe/create-intent
   {
     "bookingId": "{{booking_id}}",
     "customerId": "{{customer_id}}",
     "amount": 375.00,
     "currency": "USD",
     "description": "Payment for booking"
   }
   → Returns clientSecret (starts with pi_mock_ in test mode)
   → Save payment_id
   ```

5. **Confirm Payment**
   ```
   POST /api/payments/stripe/confirm
   {
     "paymentId": "{{payment_id}}",
     "transactionId": "<clientSecret from step 4>"
   }
   → Payment status changes to "Succeeded"
   ```

6. **Verify Payment**
   ```
   GET /api/payments/{{payment_id}}
   → Check status is "Succeeded"
   ```

---

## Using Real Stripe/PayPal Keys (Optional)

If you want to use real payment processing:

### 1. Get Stripe Test Keys

1. Sign up at https://stripe.com
2. Go to **Developers → API keys**
3. Copy your test keys:
   - Publishable key: `pk_test_...`
   - Secret key: `sk_test_...`

### 2. Update Configuration

Edit `backend/appsettings.Development.json`:

```json
{
  "Payment": {
    "TestMode": false,  // Disable test mode
    "AllowMockPayments": false
  },
  "Stripe": {
    "SecretKey": "sk_test_YOUR_REAL_KEY_HERE",
    "PublishableKey": "pk_test_YOUR_REAL_KEY_HERE"
  }
}
```

### 3. Restart Backend

```bash
./backend/start-dev.sh
```

---

## Payment Status Reference

| Value | Status | Description |
|-------|---------|-------------|
| 0 | Pending | Payment initiated but not completed |
| 1 | Succeeded | Payment completed successfully |
| 2 | Failed | Payment failed |
| 3 | Refunded | Payment was refunded |
| 4 | Cancelled | Payment was cancelled |

---

## Payment Provider Reference

| Value | Provider | Description |
|-------|----------|-------------|
| 0 | Stripe | Stripe payment processor |
| 1 | PayPal | PayPal payment processor |

---

## Payment Method Reference

| Value | Method | Description |
|-------|--------|-------------|
| 0 | CreditCard | Credit/Debit card |
| 1 | PayPal | PayPal account |
| 2 | BankTransfer | Direct bank transfer |
| 3 | Cash | Cash payment |

---

## Troubleshooting

### "Invalid API Key" Error (Should not happen now!)

If you still see this error:

1. ✅ **Check Test Mode is Enabled**
   ```bash
   grep -A 3 "Payment" backend/appsettings.Development.json
   ```
   Should show: `"TestMode": true`

2. ✅ **Restart Backend**
   ```bash
   pkill -f "dotnet.*run"
   ./backend/start-dev.sh
   ```

3. ✅ **Verify Server is Running**
   ```bash
   curl http://localhost:5000/api/customers
   ```

### "Invalid booking ID" Error

Make sure you're using a valid 24-character hex string for booking ID:
```bash
# Get a valid booking ID
curl http://localhost:5000/api/bookings | python3 -c "import sys, json; data = json.load(sys.stdin); print(data[0]['id'] if data else 'Create a booking first')"
```

---

## Quick Test Commands

### Create Test Payment (Stripe)
```bash
curl -X POST http://localhost:5000/api/payments/stripe/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "68e44c4e7f1934fa1165193e",
    "customerId": "68e6b2d07f1934fa11651945",
    "amount": 100.00,
    "currency": "USD",
    "description": "Test payment"
  }'
```

### Get All Payments
```bash
curl http://localhost:5000/api/payments
```

### Get Payments by Customer
```bash
curl http://localhost:5000/api/payments/customer/68e6b2d07f1934fa11651945
```

---

## Summary

✅ **Test Mode Enabled** - No real API keys needed!  
✅ **Mock Payments Work** - Perfect for development  
✅ **Easy to Switch** - Change config when ready for production  
✅ **No More Errors** - Placeholder keys are handled gracefully  

**You can now test all payment endpoints in Postman without any API key errors!** 🎉

