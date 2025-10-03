# Car Rental Mobile App

A React Native mobile application for car rental services with payment integration.

## Features

- **Car Browsing**: Search and filter available cars
- **Booking Management**: Create, view, and manage car rentals
- **Payment Processing**: Secure payments with Stripe and PayPal
- **User Profile**: Customer information management
- **Real-time Updates**: Live availability and booking status

## Tech Stack

- **React Native 0.72.6** - Mobile app framework
- **TypeScript** - Type safety
- **React Navigation** - Navigation between screens
- **Stripe React Native** - Payment processing
- **PayPal SDK** - Alternative payment method
- **AsyncStorage** - Local data persistence

## Getting Started

### Prerequisites

- Node.js (>=16)
- React Native CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. For iOS, install CocoaPods:
```bash
cd ios && pod install && cd ..
```

3. Start the Metro bundler:
```bash
npm start
```

4. Run on iOS:
```bash
npm run ios
```

5. Run on Android:
```bash
npm run android
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # App screens
│   ├── cars/          # Car browsing and details
│   ├── bookings/      # Booking management
│   └── profile/       # User profile
├── services/          # API services
├── models/           # TypeScript interfaces
├── constants/        # App configuration
└── utils/           # Utility functions
```

## Configuration

Update the following in `src/constants/Config.ts`:

- `API_BASE_URL`: Your backend API URL
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `PAYPAL_CLIENT_ID`: Your PayPal client ID

## API Integration

The app integrates with the Car Rental backend API:

- **Cars API**: Browse and search cars
- **Bookings API**: Create and manage bookings
- **Payments API**: Process payments with Stripe/PayPal
- **Customers API**: User profile management

## Payment Integration

### Stripe
- Credit/Debit card payments
- Secure tokenization
- Real-time processing

### PayPal
- PayPal account payments
- Redirect-based flow
- Sandbox and production support

## Development

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting

### Testing
```bash
npm test
```

### Building for Production

#### iOS
```bash
npx react-native run-ios --configuration Release
```

#### Android
```bash
npx react-native run-android --variant=release
```

## Deployment

### iOS (App Store)
1. Build release version
2. Archive in Xcode
3. Upload to App Store Connect

### Android (Google Play)
1. Generate signed APK/AAB
2. Upload to Google Play Console

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npx react-native start --reset-cache`
2. **iOS build issues**: Clean and rebuild with `cd ios && xcodebuild clean`
3. **Android build issues**: Clean with `cd android && ./gradlew clean`

### Getting Help

- Check React Native documentation
- Review component-specific documentation
- Check backend API status

## Contributing

1. Follow TypeScript best practices
2. Write meaningful commit messages
3. Test on both iOS and Android
4. Update documentation as needed