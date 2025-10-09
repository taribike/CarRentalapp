import {Platform} from 'react-native';

// Get the appropriate local IP for your development environment
// For iOS Simulator: use your Mac's IP address (find it with: ipconfig getifaddr en0)
// For Android Emulator: use 10.0.2.2 (special alias to host machine)
// Replace this with your actual local IP if needed
const getDevApiUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  // For iOS, using your Mac's actual IP address
  return 'http://10.0.0.166:5000/api';
};

export const Config = {
  API_BASE_URL: __DEV__ ? getDevApiUrl() : 'https://your-production-api.com/api',
  STRIPE_PUBLISHABLE_KEY: 'pk_test_your_stripe_publishable_key_here',
  PAYPAL_CLIENT_ID: 'your_paypal_client_id_here',
  APP_NAME: 'Car Rental App',
  VERSION: '1.0.0',
};
