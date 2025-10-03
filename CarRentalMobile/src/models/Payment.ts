export enum PaymentMethod {
  CreditCard = 'CreditCard',
  DebitCard = 'DebitCard',
  PayPal = 'PayPal',
  BankTransfer = 'BankTransfer'
}

export enum PaymentProvider {
  Stripe = 'Stripe',
  PayPal = 'PayPal'
}

export enum PaymentStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Succeeded = 'Succeeded',
  Failed = 'Failed',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded'
}

export interface Payment {
  id: string;
  bookingId: string;
  customerId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentProvider: PaymentProvider;
  transactionId: string;
  status: PaymentStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, string>;
}

export interface PaymentRequest {
  bookingId: string;
  customerId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentProvider: PaymentProvider;
  description: string;
}

export interface PaymentResponse {
  id: string;
  bookingId: string;
  customerId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentProvider: PaymentProvider;
  transactionId: string;
  status: PaymentStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
  clientSecret?: string; // For Stripe
  paymentUrl?: string; // For PayPal
}

export interface StripePaymentIntentRequest {
  bookingId: string;
  customerId: string;
  amount: number;
  currency: string;
  description: string;
}

export interface PayPalOrderRequest {
  bookingId: string;
  customerId: string;
  amount: number;
  currency: string;
  description: string;
}

export interface ConfirmPaymentRequest {
  paymentId: string;
  transactionId: string;
}

export interface PayPalCaptureRequest {
  paymentId: string;
  payerId: string;
}

export interface RefundRequest {
  amount?: number;
}

