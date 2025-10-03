import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import PaymentService from '../services/PaymentService';
import {Config} from '../constants/Config';
import {PaymentResult} from '../services/PaymentService';
import {PaymentProvider} from '../models/Payment';

interface PaymentContextType {
  isStripeInitialized: boolean;
  initializePayments: () => Promise<void>;
  processPayment: (
    booking: any,
    provider: PaymentProvider,
    cardDetails?: any
  ) => Promise<PaymentResult>;
  validateCardDetails: (cardDetails: any) => {valid: boolean; errors: string[]};
  formatCardNumber: (cardNumber: string) => string;
  formatExpiryDate: (expiryDate: string) => string;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

interface PaymentContextProviderProps {
  children: ReactNode;
}

export const PaymentContextProvider: React.FC<PaymentContextProviderProps> = ({children}) => {
  const [isStripeInitialized, setIsStripeInitialized] = useState(false);

  const initializePayments = async () => {
    try {
      await PaymentService.initializeStripe(Config.STRIPE_PUBLISHABLE_KEY);
      setIsStripeInitialized(true);
    } catch (error) {
      console.error('Failed to initialize payments:', error);
      setIsStripeInitialized(false);
    }
  };

  const processPayment = async (
    booking: any,
    provider: PaymentProvider,
    cardDetails?: any
  ): Promise<PaymentResult> => {
    return PaymentService.processPayment(booking, provider, cardDetails);
  };

  const validateCardDetails = (cardDetails: any) => {
    return PaymentService.validateCardDetails(cardDetails);
  };

  const formatCardNumber = (cardNumber: string) => {
    return PaymentService.formatCardNumber(cardNumber);
  };

  const formatExpiryDate = (expiryDate: string) => {
    return PaymentService.formatExpiryDate(expiryDate);
  };

  useEffect(() => {
    initializePayments();
  }, []);

  const value: PaymentContextType = {
    isStripeInitialized,
    initializePayments,
    processPayment,
    validateCardDetails,
    formatCardNumber,
    formatExpiryDate,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentContextProvider');
  }
  return context;
};
