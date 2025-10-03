import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

import {Booking} from '../../models/Booking';
import {PaymentProvider, PaymentMethod} from '../../models/Payment';
import {RootStackParamList} from '../../../App';
import {usePayment} from '../../contexts/PaymentContext';

type PaymentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Payment'>;
type PaymentScreenRouteProp = RouteProp<RootStackParamList, 'Payment'>;

interface Props {
  navigation: PaymentScreenNavigationProp;
  route: PaymentScreenRouteProp;
}

const PaymentScreen: React.FC<Props> = ({navigation, route}) => {
  const {booking} = route.params;
  const {processPayment, validateCardDetails, formatCardNumber, formatExpiryDate, isStripeInitialized} = usePayment();
  
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>(PaymentProvider.Stripe);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.CreditCard);
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handlePayment = async () => {
    // Validate card details if using Stripe
    if (selectedProvider === PaymentProvider.Stripe) {
      const validation = validateCardDetails(cardDetails);
      if (!validation.valid) {
        setValidationErrors(validation.errors);
        Alert.alert('Validation Error', validation.errors.join('\n'));
        return;
      }
      setValidationErrors([]);
    }

    // Check if Stripe is initialized for Stripe payments
    if (selectedProvider === PaymentProvider.Stripe && !isStripeInitialized) {
      Alert.alert('Payment Error', 'Payment system is not ready. Please try again.');
      return;
    }

    setLoading(true);
    try {
      const result = await processPayment(
        booking,
        selectedProvider,
        selectedProvider === PaymentProvider.Stripe ? cardDetails : undefined
      );

      if (result.success) {
        Alert.alert(
          'Payment Successful!',
          `Your payment has been processed successfully. Transaction ID: ${result.transactionId}`,
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('MainTabs'),
            },
          ],
        );
      } else {
        Alert.alert('Payment Failed', result.error || 'Payment could not be processed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Payment Error', 'An unexpected error occurred. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentProviderOption = (provider: PaymentProvider, title: string, description: string) => (
    <TouchableOpacity
      style={[
        styles.providerOption,
        selectedProvider === provider && styles.providerOptionSelected,
      ]}
      onPress={() => setSelectedProvider(provider)}>
      <View style={styles.providerContent}>
        <Text style={[
          styles.providerTitle,
          selectedProvider === provider && styles.providerTitleSelected,
        ]}>
          {title}
        </Text>
        <Text style={styles.providerDescription}>{description}</Text>
      </View>
      <View style={[
        styles.radioButton,
        selectedProvider === provider && styles.radioButtonSelected,
      ]} />
    </TouchableOpacity>
  );

  const renderPaymentMethodOption = (method: PaymentMethod, title: string) => (
    <TouchableOpacity
      style={[
        styles.methodOption,
        selectedMethod === method && styles.methodOptionSelected,
      ]}
      onPress={() => setSelectedMethod(method)}>
      <Text style={[
        styles.methodText,
        selectedMethod === method && styles.methodTextSelected,
      ]}>
        {title}
      </Text>
      <View style={[
        styles.radioButton,
        selectedMethod === method && styles.radioButtonSelected,
      ]} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Booking Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Car:</Text>
            <Text style={styles.summaryValue}>{booking.carInfo}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Dates:</Text>
            <Text style={styles.summaryValue}>
              {formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration:</Text>
            <Text style={styles.summaryValue}>{booking.totalDays} days</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>${booking.totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment Provider Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Payment Provider</Text>
          {renderPaymentProviderOption(
            PaymentProvider.Stripe,
            'Stripe',
            'Secure payment with credit/debit cards'
          )}
          {renderPaymentProviderOption(
            PaymentProvider.PayPal,
            'PayPal',
            'Pay with your PayPal account'
          )}
        </View>

        {/* Payment Method Selection */}
        {selectedProvider === PaymentProvider.Stripe && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            {renderPaymentMethodOption(PaymentMethod.CreditCard, 'Credit Card')}
            {renderPaymentMethodOption(PaymentMethod.DebitCard, 'Debit Card')}
          </View>
        )}

        {/* Card Details Form */}
        {selectedProvider === PaymentProvider.Stripe && selectedMethod !== PaymentMethod.PayPal && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Details</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={[
                  styles.textInput,
                  validationErrors.some(error => error.includes('card number')) && styles.inputError
                ]}
                placeholder="1234 5678 9012 3456"
                value={cardDetails.cardNumber}
                onChangeText={(text) => {
                  const formatted = formatCardNumber(text);
                  setCardDetails({...cardDetails, cardNumber: formatted});
                }}
                keyboardType="numeric"
                maxLength={23}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    validationErrors.some(error => error.includes('expiry')) && styles.inputError
                  ]}
                  placeholder="MM/YY"
                  value={cardDetails.expiryDate}
                  onChangeText={(text) => {
                    const formatted = formatExpiryDate(text);
                    setCardDetails({...cardDetails, expiryDate: formatted});
                  }}
                  maxLength={5}
                  placeholderTextColor="#999"
                />
              </View>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    validationErrors.some(error => error.includes('CVV')) && styles.inputError
                  ]}
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChangeText={(text) => setCardDetails({...cardDetails, cvv: text})}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Cardholder Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="John Doe"
                value={cardDetails.cardholderName}
                onChangeText={(text) => setCardDetails({...cardDetails, cardholderName: text})}
                placeholderTextColor="#999"
              />
            </View>
          </View>
        )}

        {/* PayPal Info */}
        {selectedProvider === PaymentProvider.PayPal && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PayPal Payment</Text>
            <Text style={styles.paypalInfo}>
              You will be redirected to PayPal to complete your payment securely.
            </Text>
          </View>
        )}

        {/* Payment Button */}
        <TouchableOpacity
          style={[styles.payButton, loading && styles.disabledButton]}
          onPress={handlePayment}
          disabled={loading}>
          <Text style={styles.payButtonText}>
            {loading ? 'Processing Payment...' : `Pay $${booking.totalAmount.toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  totalRow: {
    borderBottomWidth: 0,
    borderTopWidth: 2,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  providerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 10,
  },
  providerOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  providerContent: {
    flex: 1,
  },
  providerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  providerTitleSelected: {
    color: '#007AFF',
  },
  providerDescription: {
    fontSize: 14,
    color: '#666',
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
  },
  methodOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  methodText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  methodTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginLeft: 10,
  },
  radioButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#F44336',
    backgroundColor: '#ffebee',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  paypalInfo: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  payButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
