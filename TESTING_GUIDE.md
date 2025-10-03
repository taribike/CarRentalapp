# Car Rental App - Complete Testing Guide

This guide covers testing both the backend API and mobile applications to ensure everything works correctly.

## 🧪 Testing Checklist

### Backend API Testing

#### 1. Database Connection
```bash
# Start MongoDB (if running locally)
mongod

# Test connection
curl http://localhost:5000/api/cars
```

#### 2. API Endpoints Testing

**Cars API**
```bash
# Get all cars
curl -X GET http://localhost:5000/api/cars

# Get specific car
curl -X GET http://localhost:5000/api/cars/{carId}

# Search cars
curl -X POST http://localhost:5000/api/cars/search \
  -H "Content-Type: application/json" \
  -d '{"pickupDate":"2024-01-15","returnDate":"2024-01-20"}'
```

**Customers API**
```bash
# Create customer
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"John",
    "lastName":"Doe",
    "email":"john@example.com",
    "phone":"1234567890",
    "address":{
      "street":"123 Main St",
      "city":"New York",
      "state":"NY",
      "zipCode":"10001",
      "country":"USA"
    },
    "dateOfBirth":"1990-01-01",
    "driversLicense":"DL123456"
  }'

# Get customer by email
curl -X GET http://localhost:5000/api/customers/email/john@example.com
```

**Bookings API**
```bash
# Create booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customerId":"customer_id_here",
    "carId":"car_id_here",
    "pickupDate":"2024-01-15",
    "returnDate":"2024-01-20",
    "pickupLocation":"Airport",
    "returnLocation":"Downtown",
    "notes":"Business trip"
  }'

# Get bookings by customer
curl -X GET http://localhost:5000/api/bookings/customer/{customerId}
```

**Payments API**
```bash
# Create Stripe payment intent
curl -X POST http://localhost:5000/api/payments/stripe/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId":"booking_id_here",
    "customerId":"customer_id_here",
    "amount":150.00,
    "currency":"USD",
    "description":"Car rental booking"
  }'

# Create PayPal order
curl -X POST http://localhost:5000/api/payments/paypal/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId":"booking_id_here",
    "customerId":"customer_id_here",
    "amount":150.00,
    "currency":"USD",
    "description":"Car rental booking"
  }'
```

#### 3. Payment Integration Testing

**Stripe Testing**
1. Use test card numbers:
   - Success: `4242424242424242`
   - Decline: `4000000000000002`
   - Requires authentication: `4000002500003155`

2. Test payment flow:
   ```bash
   # Create payment intent
   curl -X POST http://localhost:5000/api/payments/stripe/create-intent \
     -H "Content-Type: application/json" \
     -d '{"bookingId":"test","customerId":"test","amount":10.00,"currency":"USD","description":"Test"}'
   ```

**PayPal Testing**
1. Use sandbox accounts from PayPal Developer Console
2. Test with different amounts and currencies

### Mobile App Testing

#### 1. Setup Testing Environment

**iOS Simulator**
```bash
cd CarRentalMobile
npm run ios
```

**Android Emulator**
```bash
cd CarRentalMobile
npm run android
```

#### 2. Manual Testing Scenarios

**Car Browsing Flow**
1. ✅ Launch app
2. ✅ Browse available cars
3. ✅ Use search and filter functionality
4. ✅ Tap on car to view details
5. ✅ Verify car information display

**Booking Flow**
1. ✅ Select a car
2. ✅ Fill in booking details:
   - Pickup date (future date)
   - Return date (after pickup)
   - Pickup location
   - Return location
3. ✅ Create booking
4. ✅ Verify booking creation

**Payment Flow**
1. ✅ Navigate to payment from booking
2. ✅ Test Stripe payment:
   - Enter test card details
   - Process payment
   - Verify success/failure handling
3. ✅ Test PayPal payment:
   - Select PayPal option
   - Simulate PayPal flow
   - Verify payment completion

**Profile Management**
1. ✅ View profile screen
2. ✅ Edit profile information
3. ✅ Save changes
4. ✅ View booking history

#### 3. Error Handling Testing

**Network Errors**
1. ✅ Disconnect internet and test API calls
2. ✅ Verify error messages are shown
3. ✅ Test retry functionality

**Validation Errors**
1. ✅ Test invalid card numbers
2. ✅ Test expired dates
3. ✅ Test invalid email formats
4. ✅ Test empty required fields

**Payment Errors**
1. ✅ Test declined cards
2. ✅ Test insufficient funds
3. ✅ Test network timeouts

#### 4. UI/UX Testing

**Navigation**
1. ✅ Test tab navigation
2. ✅ Test back button functionality
3. ✅ Test deep linking

**Responsiveness**
1. ✅ Test on different screen sizes
2. ✅ Test orientation changes
3. ✅ Test keyboard handling

**Performance**
1. ✅ Test app startup time
2. ✅ Test screen transition smoothness
3. ✅ Test memory usage

## 🔧 Test Data Setup

### Sample Cars
```javascript
// Use database/sample-cars.js to populate test data
const sampleCars = [
  {
    make: "Toyota",
    model: "Camry",
    year: 2023,
    color: "Silver",
    licensePlate: "ABC123",
    dailyRate: 45.00,
    fuelType: "Gasoline",
    transmission: "Automatic",
    seats: 5,
    isAvailable: true
  },
  // ... more cars
];
```

### Sample Customers
```javascript
// Use database/sample-customers.js
const sampleCustomers = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "1234567890",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    dateOfBirth: "1990-01-01",
    driversLicense: "DL123456"
  }
];
```

## 🐛 Common Issues & Solutions

### Backend Issues

**MongoDB Connection**
- Check if MongoDB is running
- Verify connection string in appsettings.json
- Check network connectivity

**Payment Integration**
- Verify API keys are correct
- Check webhook endpoints
- Test in sandbox mode first

**CORS Issues**
- Ensure CORS policy allows mobile app origin
- Check if backend is accessible from mobile device

### Mobile Issues

**Build Errors**
```bash
# Clear caches
npx react-native start --reset-cache
cd ios && xcodebuild clean
cd android && ./gradlew clean
```

**Network Issues**
- Check if backend URL is correct
- Verify network security configuration
- Test with device on same network

**Payment SDK Issues**
- Ensure Stripe/PayPal SDKs are properly installed
- Check configuration keys
- Verify bundle ID/package name

## 📊 Performance Testing

### Backend Performance
```bash
# Test API response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000/api/cars

# Load testing with Apache Bench
ab -n 100 -c 10 http://localhost:5000/api/cars
```

### Mobile Performance
- Use React Native Performance Monitor
- Check memory usage in Xcode/Android Studio
- Test on low-end devices

## 🚀 Production Readiness Checklist

### Backend
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Database backups configured
- [ ] Monitoring/logging setup
- [ ] Payment webhooks configured
- [ ] CORS properly configured

### Mobile
- [ ] App icons and splash screens
- [ ] Production API endpoints
- [ ] Error reporting configured
- [ ] Analytics integrated
- [ ] App store metadata ready
- [ ] Testing completed on real devices

## 📝 Test Results Template

### Backend API Tests
| Endpoint | Method | Status | Response Time | Notes |
|----------|--------|--------|---------------|-------|
| /api/cars | GET | ✅ | 150ms | |
| /api/customers | POST | ✅ | 200ms | |
| /api/bookings | POST | ✅ | 300ms | |
| /api/payments/stripe | POST | ✅ | 500ms | |

### Mobile App Tests
| Feature | iOS | Android | Notes |
|---------|-----|---------|-------|
| Car Browsing | ✅ | ✅ | |
| Booking Creation | ✅ | ✅ | |
| Stripe Payment | ✅ | ✅ | |
| PayPal Payment | ✅ | ✅ | |
| Profile Management | ✅ | ✅ | |

## 🎯 Next Steps After Testing

1. **Fix any identified issues**
2. **Performance optimization**
3. **Security audit**
4. **User acceptance testing**
5. **Production deployment**
6. **App store submission**

## 📞 Support

If you encounter issues during testing:
1. Check the logs (backend and mobile)
2. Verify configuration settings
3. Test with sample data
4. Check network connectivity
5. Review error messages carefully
