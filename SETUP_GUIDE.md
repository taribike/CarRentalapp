# Car Rental App - Complete Setup Guide

This guide will help you set up and run both the backend API and mobile applications.

## 🏗️ Architecture Overview

- **Backend**: .NET 6 Web API with MongoDB
- **Mobile**: React Native (iOS & Android)
- **Payments**: Stripe & PayPal integration
- **Database**: MongoDB

## 📋 Prerequisites

### Backend Requirements
- .NET 6 SDK
- MongoDB (local or cloud)
- Stripe account
- PayPal developer account

### Mobile Requirements
- Node.js (>=16)
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)

## 🚀 Backend Setup

### 1. Configure Database
```bash
# Install MongoDB locally or use MongoDB Atlas
# Update connection string in appsettings.json
```

### 2. Configure Payment Providers

#### Stripe Setup
1. Create account at https://stripe.com
2. Get API keys from dashboard
3. Update `appsettings.json`:
```json
{
  "Stripe": {
    "SecretKey": "sk_test_your_actual_stripe_secret_key",
    "PublishableKey": "pk_test_your_actual_stripe_publishable_key"
  }
}
```

#### PayPal Setup
1. Create account at https://developer.paypal.com
2. Create new app for credentials
3. Update `appsettings.json`:
```json
{
  "PayPal": {
    "ClientId": "your_actual_paypal_client_id",
    "ClientSecret": "your_actual_paypal_client_secret",
    "Sandbox": true
  }
}
```

### 3. Run Backend
```bash
cd backend
dotnet restore
dotnet build
dotnet run
```

The API will be available at `http://localhost:5000`

### 4. Test API
Visit `http://localhost:5000/swagger` to test the API endpoints.

## 📱 Mobile App Setup

### 1. Install Dependencies
```bash
cd CarRentalMobile
npm install
```

### 2. Configure API Endpoint
Update `src/constants/Config.ts`:
```typescript
export const Config = {
  API_BASE_URL: 'http://localhost:5000/api', // Your backend URL
  STRIPE_PUBLISHABLE_KEY: 'pk_test_your_stripe_key',
  PAYPAL_CLIENT_ID: 'your_paypal_client_id',
  // ... other config
};
```

### 3. iOS Setup
```bash
cd ios
pod install
cd ..
npm run ios
```

### 4. Android Setup
```bash
# Start Android emulator or connect device
npm run android
```

## 🔧 Configuration

### Backend Configuration

#### Environment Variables (Production)
```bash
# MongoDB
MongoDB__ConnectionString=mongodb://your-mongodb-url
MongoDB__DatabaseName=CarRentalDB

# Stripe
Stripe__SecretKey=sk_live_your_live_key
Stripe__PublishableKey=pk_live_your_live_key

# PayPal
PayPal__ClientId=your_live_paypal_client_id
PayPal__ClientSecret=your_live_paypal_client_secret
PayPal__Sandbox=false
```

### Mobile Configuration

#### iOS Info.plist
Add network security exceptions for local development:
```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
</dict>
```

#### Android Network Security
Add to `android/app/src/main/res/xml/network_security_config.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
    </domain-config>
</network-security-config>
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
dotnet test
```

### API Testing with Postman
Import the Swagger JSON from `http://localhost:5000/swagger/v1/swagger.json`

### Mobile Testing
```bash
cd CarRentalMobile
npm test
```

## 📊 Sample Data

### Add Sample Cars
Use the scripts in `database/sample-cars.js` to populate your MongoDB with test data.

### Add Sample Customers
Use the scripts in `database/sample-customers.js` for test customers.

## 🚀 Deployment

### Backend Deployment
1. **Azure**: Use Azure App Service
2. **AWS**: Use AWS Elastic Beanstalk or ECS
3. **Docker**: Use the provided Dockerfile

### Mobile Deployment

#### iOS (App Store)
1. Update version in `ios/CarRentalMobile/Info.plist`
2. Archive in Xcode
3. Upload to App Store Connect

#### Android (Google Play)
1. Generate signed APK/AAB
2. Upload to Google Play Console

## 🔐 Security Considerations

### Backend
- Use environment variables for secrets
- Enable HTTPS in production
- Implement proper CORS policies
- Add authentication/authorization

### Mobile
- Use secure storage for sensitive data
- Implement certificate pinning
- Validate all user inputs
- Use proper error handling

## 🐛 Troubleshooting

### Backend Issues
- **MongoDB Connection**: Check connection string and network access
- **Payment Integration**: Verify API keys and webhook endpoints
- **CORS Issues**: Update CORS policy in Program.cs

### Mobile Issues
- **Metro Bundler**: Clear cache with `npx react-native start --reset-cache`
- **iOS Build**: Clean and rebuild with `cd ios && xcodebuild clean`
- **Android Build**: Clean with `cd android && ./gradlew clean`
- **Network Issues**: Check API URL and network security config

### Common Solutions
1. **Port Conflicts**: Change ports in configuration
2. **Dependency Issues**: Delete node_modules and reinstall
3. **Cache Issues**: Clear all caches and rebuild

## 📚 API Documentation

### Available Endpoints

#### Cars
- `GET /api/cars` - Get all cars
- `GET /api/cars/{id}` - Get car by ID
- `POST /api/cars/search` - Search cars

#### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/{id}` - Update booking
- `POST /api/bookings/{id}/cancel` - Cancel booking

#### Payments
- `POST /api/payments` - Create payment
- `POST /api/payments/stripe/create-intent` - Create Stripe payment
- `POST /api/payments/paypal/create-order` - Create PayPal order
- `POST /api/payments/{id}/refund` - Refund payment

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check backend and mobile logs
4. Verify configuration settings

## 🎯 Next Steps

1. **Authentication**: Add user login/signup
2. **Push Notifications**: Implement booking notifications
3. **Offline Support**: Add offline capabilities
4. **Analytics**: Integrate usage analytics
5. **Testing**: Add comprehensive test coverage
