# Testing Guide for Car Rental Mobile App

This guide provides comprehensive information about testing your React Native car rental application.

## 🧪 Testing Setup

Your app is configured with the following testing tools:

- **Jest** - JavaScript testing framework
- **React Test Renderer** - For component snapshot testing
- **@testing-library/react-native** - For component interaction testing

## 📋 Available Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run only UI/screen tests
npm run test:ui
```

## 🏗️ Test Structure

```
__tests__/
├── App.test.tsx                 # Main app component test
├── models/
│   ├── Booking.test.ts         # Booking model tests
│   └── Car.test.ts            # Car model tests
└── screens/
    └── BookingScreen.test.tsx  # Booking screen component tests
```

## 🔧 Test Types

### 1. Unit Tests
Test individual functions, classes, or modules in isolation.

**Example: Model Tests**
```typescript
// __tests__/models/Booking.test.ts
import { Booking, BookingStatus } from '../../src/models/Booking';

describe('Booking Model', () => {
  const mockBooking: Booking = {
    id: 'booking-1',
    customerId: 'customer-1',
    // ... other properties
  };

  it('should create a valid booking object', () => {
    expect(mockBooking.id).toBe('booking-1');
    expect(mockBooking.status).toBe(BookingStatus.Pending);
  });
});
```

### 2. Component Tests
Test React components with user interactions and rendering.

**Example: Screen Component Tests**
```typescript
// __tests__/screens/BookingScreen.test.tsx
import { render, waitFor, act } from '@testing-library/react-native';
import BookingScreen from '../../src/screens/bookings/BookingScreen';

describe('BookingScreen', () => {
  it('displays bookings when data is loaded', async () => {
    mockApiService.getBookingsByCustomer.mockResolvedValue(mockBookings);
    
    const { getByText } = render(<TestNavigator />);
    
    await act(async () => {
      await waitFor(() => {
        expect(getByText('Toyota Camry 2023')).toBeTruthy();
      });
    });
  });
});
```

## 🎯 Testing UI Components

### Using @testing-library/react-native

The app uses React Native Testing Library for component testing. Here are common patterns:

#### Rendering Components
```typescript
import { render } from '@testing-library/react-native';

const { getByText, getByTestId } = render(<MyComponent />);
```

#### Finding Elements
```typescript
// By text
const element = getByText('Submit');

// By test ID
const button = getByTestId('submit-button');

// By accessibility label
const input = getByA11yLabel('Email input');
```

#### User Interactions
```typescript
import { fireEvent } from '@testing-library/react-native';

// Press a button
fireEvent.press(getByText('Submit'));

// Change text input
fireEvent.changeText(getByTestId('email-input'), 'user@example.com');
```

#### Async Operations
```typescript
import { waitFor } from '@testing-library/react-native';

await waitFor(() => {
  expect(getByText('Loading complete')).toBeTruthy();
});
```

## 🚀 Running Your App for UI Testing

### Development Mode

1. **Start Metro Bundler**
   ```bash
   npm start
   ```

2. **Run on iOS Simulator**
   ```bash
   npm run ios
   ```

3. **Run on Android Emulator**
   ```bash
   npm run android
   ```

### Testing on Physical Devices

1. **iOS Device**
   - Connect iPhone via USB
   - Open Xcode
   - Select your device and run

2. **Android Device**
   - Enable Developer Options and USB Debugging
   - Connect via USB
   - Run `npm run android`

## 📱 UI Testing Tools

### 1. React Native Debugger
- Install from: https://github.com/jhen0409/react-native-debugger
- Provides Redux DevTools, Network Inspector, and more

### 2. Flipper
- Facebook's mobile development platform
- Already configured in your app
- Provides network inspection, layout debugging, etc.

### 3. Chrome DevTools
- Enable remote debugging in your app
- Access via `chrome://inspect` when app is running

## 🧪 Manual Testing Checklist

### Core Features
- [ ] Browse available cars
- [ ] View car details
- [ ] Create booking
- [ ] View booking history
- [ ] Make payment
- [ ] Update profile

### Navigation
- [ ] Bottom tab navigation works
- [ ] Stack navigation works
- [ ] Back button functionality
- [ ] Deep linking (if implemented)

### Data Flow
- [ ] API calls work correctly
- [ ] Loading states display
- [ ] Error handling works
- [ ] Data persistence (AsyncStorage)

### UI/UX
- [ ] Responsive design on different screen sizes
- [ ] Dark mode compatibility
- [ ] Accessibility features
- [ ] Performance (smooth scrolling, fast loading)

## 🔍 Debugging Tips

### Console Logging
```typescript
// Add to your components
console.log('Component rendered with props:', props);
console.log('API response:', response);
```

### React Native Debugger
```typescript
// Add breakpoints in your code
debugger; // This will pause execution in debugger
```

### Network Debugging
```typescript
// Log API requests
console.log('Making API request to:', url);
console.log('Request payload:', data);
```

## 📊 Test Coverage

Generate coverage reports:
```bash
npm run test:coverage
```

View coverage in browser:
```bash
open coverage/lcov-report/index.html
```

## 🐛 Common Testing Issues

### 1. Async Operations
Always wrap async operations in `act()`:
```typescript
await act(async () => {
  await waitFor(() => {
    expect(getByText('Data loaded')).toBeTruthy();
  });
});
```

### 2. Mocking External Dependencies
```typescript
// Mock API service
jest.mock('../../src/services/ApiService');
const mockApiService = ApiService as jest.Mocked<typeof ApiService>;
```

### 3. Navigation Testing
```typescript
// Create test navigator
const TestNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="TestScreen" component={MyScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
```

## 🎨 UI Testing Best Practices

1. **Test User Behavior, Not Implementation**
   - Test what users see and do
   - Avoid testing internal state

2. **Use Semantic Queries**
   - Prefer `getByRole`, `getByLabelText`
   - Add `testID` for complex elements

3. **Test Error States**
   - Network failures
   - Invalid inputs
   - Empty states

4. **Test Accessibility**
   - Screen reader compatibility
   - Keyboard navigation
   - Color contrast

## 📝 Writing New Tests

### 1. Create Test File
```bash
# For a new screen
touch __tests__/screens/NewScreen.test.tsx

# For a new service
touch __tests__/services/NewService.test.ts
```

### 2. Basic Test Structure
```typescript
import React from 'react';
import { render } from '@testing-library/react-native';
import NewComponent from '../../src/components/NewComponent';

describe('NewComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<NewComponent />);
    expect(getByText('Expected Text')).toBeTruthy();
  });
});
```

## 🔄 Continuous Integration

For CI/CD, add to your workflow:
```yaml
- name: Run Tests
  run: npm test -- --coverage --watchAll=false
```

## 📚 Additional Resources

- [React Native Testing Library Docs](https://callstack.github.io/react-native-testing-library/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Best Practices](https://reactnative.dev/docs/testing-overview)

---

## 🚀 Quick Start Testing

1. **Run existing tests:**
   ```bash
   npm test
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Run on device/simulator:**
   ```bash
   npm run ios    # or npm run android
   ```

4. **Write your first test:**
   - Copy an existing test file
   - Modify for your component
   - Run with `npm test`

Happy testing! 🎉
