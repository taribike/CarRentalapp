# Payment Integration Setup

## Overview
The backend now includes payment processing capabilities with both Stripe and PayPal integration.

## Configuration

### Stripe Setup
1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe dashboard
3. Update `appsettings.json` and `appsettings.Development.json`:
```json
{
  "Stripe": {
    "SecretKey": "sk_test_your_actual_stripe_secret_key",
    "PublishableKey": "pk_test_your_actual_stripe_publishable_key"
  }
}
```

### PayPal Setup
1. Create a PayPal Developer account at https://developer.paypal.com
2. Create a new app to get your credentials
3. Update `appsettings.json` and `appsettings.Development.json`:
```json
{
  "PayPal": {
    "ClientId": "your_actual_paypal_client_id",
    "ClientSecret": "your_actual_paypal_client_secret",
    "Sandbox": true
  }
}
```

## API Endpoints

### Payment Management
- `POST /api/payments` - Create a new payment
- `GET /api/payments/{id}` - Get payment by ID
- `GET /api/payments/booking/{bookingId}` - Get payments for a booking
- `GET /api/payments/customer/{customerId}` - Get payments for a customer

### Stripe Integration
- `POST /api/payments/stripe/create-intent` - Create Stripe payment intent
- `POST /api/payments/stripe/confirm` - Confirm Stripe payment

### PayPal Integration
- `POST /api/payments/paypal/create-order` - Create PayPal order
- `POST /api/payments/paypal/capture` - Capture PayPal payment

### Refunds
- `POST /api/payments/{id}/refund` - Refund a payment

### Status Updates
- `PUT /api/payments/{id}/status` - Update payment status

## Usage Example

### Create a Stripe Payment
```json
POST /api/payments/stripe/create-intent
{
  "bookingId": "booking123",
  "customerId": "customer456",
  "amount": 150.00,
  "currency": "USD",
  "description": "Car rental booking"
}
```

### Create a PayPal Payment
```json
POST /api/payments/paypal/create-order
{
  "bookingId": "booking123",
  "customerId": "customer456",
  "amount": 150.00,
  "currency": "USD",
  "description": "Car rental booking"
}
```

## Security Notes
- Never commit real API keys to version control
- Use environment variables or Azure Key Vault for production
- Always validate payment amounts on the backend
- Implement proper error handling and logging
