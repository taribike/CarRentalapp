import {initStripe, presentPaymentSheet, createPaymentMethod} from '@stripe/stripe-react-native';
import ApiService from './ApiService';
import {PaymentProvider, PaymentMethod as PaymentMethodType} from '../models/Payment';
import {Booking} from '../models/Booking';

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

class PaymentService {
  private stripeInitialized = false;

  async initializeStripe(publishableKey: string): Promise<void> {
    try {
      await initStripe({
        publishableKey,
        merchantIdentifier: 'merchant.com.carrental.mobile',
        urlScheme: 'carrental',
      });
      this.stripeInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
      throw error;
    }
  }

  async processStripePayment(
    booking: Booking,
    cardDetails: {
      cardNumber: string;
      expiryDate: string;
      cvv: string;
      cardholderName: string;
    }
  ): Promise<PaymentResult> {
    try {
      if (!this.stripeInitialized) {
        throw new Error('Stripe not initialized');
      }

      // Create payment intent on backend
      const paymentIntent = await ApiService.createStripePaymentIntent({
        bookingId: booking.id,
        customerId: booking.customerId,
        amount: booking.totalAmount,
        currency: 'USD',
        description: `Payment for booking ${booking.id}`,
      });

      // Create payment method from card details
      const {error: pmError, paymentMethod} = await createPaymentMethod({
        paymentMethodType: 'Card',
        card: {
          number: cardDetails.cardNumber.replace(/\s/g, ''),
          expiryMonth: parseInt(cardDetails.expiryDate.split('/')[0]),
          expiryYear: parseInt('20' + cardDetails.expiryDate.split('/')[1]),
          cvc: cardDetails.cvv,
        },
        billingDetails: {
          name: cardDetails.cardholderName,
        },
      });

      if (pmError) {
        return {
          success: false,
          error: pmError.message,
        };
      }

      if (!paymentMethod) {
        return {
          success: false,
          error: 'Failed to create payment method',
        };
      }

      // Present payment sheet
      const {error: paymentError} = await presentPaymentSheet({
        paymentIntentClientSecret: paymentIntent.clientSecret!,
        customerId: paymentIntent.customerId,
        customerEphemeralKeySecret: paymentIntent.customerEphemeralKeySecret,
        merchantDisplayName: 'Car Rental App',
        merchantCountryCode: 'US',
      });

      if (paymentError) {
        return {
          success: false,
          error: paymentError.message,
        };
      }

      // Confirm payment on backend
      await ApiService.confirmStripePayment({
        paymentId: paymentIntent.id,
        transactionId: paymentMethod.id,
      });

      return {
        success: true,
        transactionId: paymentMethod.id,
      };
    } catch (error) {
      console.error('Stripe payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
      };
    }
  }

  async processPayPalPayment(booking: Booking): Promise<PaymentResult> {
    try {
      // Create PayPal order on backend
      const paypalOrder = await ApiService.createPayPalOrder({
        bookingId: booking.id,
        customerId: booking.customerId,
        amount: booking.totalAmount,
        currency: 'USD',
        description: `Payment for booking ${booking.id}`,
      });

      // In a real implementation, you would use the PayPal SDK here
      // For now, we'll simulate the payment process
      
      // Simulate PayPal payment approval
      const simulatedPayerId = `PAYER_${Date.now()}`;
      
      // Capture the payment
      const captureResult = await ApiService.capturePayPalPayment({
        paymentId: paypalOrder.id,
        payerId: simulatedPayerId,
      });

      if (captureResult) {
        return {
          success: true,
          transactionId: simulatedPayerId,
        };
      } else {
        return {
          success: false,
          error: 'PayPal payment capture failed',
        };
      }
    } catch (error) {
      console.error('PayPal payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'PayPal payment failed',
      };
    }
  }

  async processPayment(
    booking: Booking,
    provider: PaymentProvider,
    cardDetails?: {
      cardNumber: string;
      expiryDate: string;
      cvv: string;
      cardholderName: string;
    }
  ): Promise<PaymentResult> {
    switch (provider) {
      case PaymentProvider.Stripe:
        if (!cardDetails) {
          return {
            success: false,
            error: 'Card details required for Stripe payments',
          };
        }
        return this.processStripePayment(booking, cardDetails);

      case PaymentProvider.PayPal:
        return this.processPayPalPayment(booking);

      default:
        return {
          success: false,
          error: 'Unsupported payment provider',
        };
    }
  }

  validateCardDetails(cardDetails: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  }): {valid: boolean; errors: string[]} {
    const errors: string[] = [];

    // Validate card number (basic Luhn algorithm check)
    const cardNumber = cardDetails.cardNumber.replace(/\s/g, '');
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
      errors.push('Invalid card number');
    } else if (!this.isValidCardNumber(cardNumber)) {
      errors.push('Invalid card number format');
    }

    // Validate expiry date
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(cardDetails.expiryDate)) {
      errors.push('Invalid expiry date format (MM/YY)');
    } else {
      const [month, year] = cardDetails.expiryDate.split('/');
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      if (expiryDate < new Date()) {
        errors.push('Card has expired');
      }
    }

    // Validate CVV
    const cvvRegex = /^\d{3,4}$/;
    if (!cvvRegex.test(cardDetails.cvv)) {
      errors.push('Invalid CVV');
    }

    // Validate cardholder name
    if (!cardDetails.cardholderName || cardDetails.cardholderName.trim().length < 2) {
      errors.push('Invalid cardholder name');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private isValidCardNumber(cardNumber: string): boolean {
    // Basic Luhn algorithm implementation
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  formatCardNumber(cardNumber: string): string {
    // Remove all non-digits
    const cleaned = cardNumber.replace(/\D/g, '');
    
    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    return formatted;
  }

  formatExpiryDate(expiryDate: string): string {
    // Remove all non-digits
    const cleaned = expiryDate.replace(/\D/g, '');
    
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    
    return cleaned;
  }
}

export default new PaymentService();
