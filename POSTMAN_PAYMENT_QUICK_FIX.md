# Quick Fix: "Invalid API Key provided"

## 🎯 Problem Solved
✅ Fixed "Invalid API Key provided: sk_test_***********************here" error

## ✨ Solution: Test Mode is Now Enabled!

**No Stripe or PayPal API keys needed for testing!**

---

## What Was Fixed

### Backend Now Has Test Mode

```json
"Payment": {
  "TestMode": true,
  "AllowMockPayments": true
}
```

**This means:**
- ✅ All payment endpoints work WITHOUT real API keys
- ✅ Returns mock/simulated payment data
- ✅ Perfect for development and testing
- ✅ No setup required - just works!

---

## Quick Test in Postman

### 1. Create Stripe Payment Intent

**Request:**
```
POST /api/payments/stripe/create-intent
```

**Body:**
```json
{
  "bookingId": "68e44c4e7f1934fa1165193e",
  "customerId": "68e6b2d07f1934fa11651945",
  "amount": 100.00,
  "currency": "USD",
  "description": "Test payment"
}
```

**Result:** ✅ Works! Returns mock payment intent

---

### 2. Create PayPal Order

**Request:**
```
POST /api/payments/paypal/create-order
```

**Body:**
```json
{
  "bookingId": "68e44c4e7f1934fa1165193e",
  "customerId": "68e6b2d07f1934fa11651945",
  "amount": 200.00,
  "currency": "USD",
  "description": "PayPal test payment"
}
```

**Result:** ✅ Works! Returns mock PayPal URL

---

## How to Identify Test Mode

### Mock Response Indicators

**Stripe (Test Mode):**
```json
{
  "clientSecret": "pi_mock_c3c1af1169564a9eb5ab4213_secret_..."
}
```
👆 Starts with `pi_mock_`

**PayPal (Test Mode):**
```json
{
  "paymentUrl": "https://...?token=MOCK_PAYMENT_TOKEN_..."
}
```
👆 Contains `MOCK_PAYMENT_TOKEN_`

---

## Complete Payment Flow (Works Now!)

1. **Create a Booking** → Get `booking_id`
2. **Create Payment Intent** → Get `payment_id` and `clientSecret`
3. **Confirm Payment** → Payment status = "Succeeded"
4. **Verify** → Check payment details

All steps work in test mode! 🎉

---

## Get IDs You Need

### Get a Booking ID
```bash
curl http://localhost:5000/api/bookings | python3 -c "import sys, json; data = json.load(sys.stdin); print(data[0]['id'] if data else 'No bookings')"
```

### Get a Customer ID
```bash
curl http://localhost:5000/api/customers | python3 -c "import sys, json; data = json.load(sys.stdin); print(data[0]['id'] if data else 'No customers')"
```

---

## Want to Use Real Stripe Keys? (Optional)

### Step 1: Get Test Keys
1. Sign up at https://stripe.com
2. Go to **Developers → API keys**
3. Copy test keys (pk_test_... and sk_test_...)

### Step 2: Update Config
Edit `backend/appsettings.Development.json`:

```json
{
  "Payment": {
    "TestMode": false,
    "AllowMockPayments": false
  },
  "Stripe": {
    "SecretKey": "sk_test_YOUR_REAL_KEY",
    "PublishableKey": "pk_test_YOUR_REAL_KEY"
  }
}
```

### Step 3: Restart
```bash
./backend/start-dev.sh
```

---

## Troubleshooting

### Still Getting Error?

1. ✅ **Verify test mode is enabled**
   ```bash
   grep -A 3 "Payment" backend/appsettings.Development.json
   ```
   Should show: `"TestMode": true`

2. ✅ **Restart backend**
   ```bash
   pkill -f "dotnet.*run"
   ./backend/start-dev.sh
   ```

3. ✅ **Test with curl**
   ```bash
   curl -X POST http://localhost:5000/api/payments/stripe/create-intent \
     -H "Content-Type: application/json" \
     -d '{"bookingId":"68e44c4e7f1934fa1165193e","customerId":"68e6b2d07f1934fa11651945","amount":100,"currency":"USD","description":"Test"}'
   ```

---

## Summary

| Before | After |
|--------|-------|
| ❌ Invalid API Key error | ✅ Works in test mode |
| ❌ Need Stripe account | ✅ No account needed |
| ❌ Can't test payments | ✅ All endpoints work |
| ❌ Complex setup | ✅ Zero setup |

**All payment endpoints now work out of the box!** 🚀

---

## Need More Details?

See **POSTMAN_PAYMENT_GUIDE.md** for:
- Complete payment workflow
- All available endpoints
- Status code references
- Advanced testing scenarios

