import 'react-native-gesture-handler/jestSetup';

// Mock react-native modules
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// Mock StyleSheet.flatten to prevent errors in tests
jest.mock('react-native/Libraries/StyleSheet/StyleSheet', () => {
  const actualStyleSheet = jest.requireActual('react-native/Libraries/StyleSheet/StyleSheet');
  return {
    ...actualStyleSheet,
    flatten: jest.fn((style) => style),
  };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// Mock react-native-device-info
jest.mock('react-native-device-info', () => ({
  getUniqueId: jest.fn(() => Promise.resolve('mock-device-id')),
  getVersion: jest.fn(() => Promise.resolve('1.0.0')),
}));

// Mock react-native-image-picker
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock Stripe
jest.mock('@stripe/stripe-react-native', () => ({
  StripeProvider: ({ children }) => children,
  useStripe: () => ({
    initPaymentSheet: jest.fn(),
    presentPaymentSheet: jest.fn(),
  }),
  CardField: 'CardField',
}));

// Mock react-native-date-picker
jest.mock('react-native-date-picker', () => 'DatePicker');

// Suppress console.error and console.warn during tests to reduce noise
global.console.error = jest.fn();
global.console.warn = jest.fn();

// Global test timeout
jest.setTimeout(10000);
