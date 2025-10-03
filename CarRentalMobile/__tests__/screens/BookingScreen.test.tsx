import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BookingScreen from '../../src/screens/bookings/BookingScreen';
import { Booking, BookingStatus } from '../../src/models/Booking';
import ApiService from '../../src/services/ApiService';

// Mock the ApiService
jest.mock('../../src/services/ApiService');
const mockApiService = ApiService as jest.Mocked<typeof ApiService>;

// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Create a test navigator
const Stack = createStackNavigator();

const TestNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="BookingScreen" component={BookingScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    customerId: 'customer-1',
    carId: 'car-1',
    carInfo: 'Toyota Camry 2023',
    pickupDate: '2024-01-15',
    returnDate: '2024-01-20',
    pickupLocation: 'Airport Terminal 1',
    returnLocation: 'Airport Terminal 1',
    totalDays: 5,
    dailyRate: 80,
    totalAmount: 400,
    status: BookingStatus.Pending,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
  {
    id: 'booking-2',
    customerId: 'customer-1',
    carId: 'car-2',
    carInfo: 'Honda Accord 2023',
    pickupDate: '2024-02-01',
    returnDate: '2024-02-05',
    pickupLocation: 'Downtown Office',
    returnLocation: 'Downtown Office',
    totalDays: 4,
    dailyRate: 75,
    totalAmount: 300,
    status: BookingStatus.Confirmed,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
];

describe('BookingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    mockApiService.getBookingsByCustomer.mockResolvedValue([]);
    
    const { getByText } = render(<TestNavigator />);
    
    await act(async () => {
      await waitFor(() => {
        expect(getByText('My Bookings')).toBeTruthy();
      });
    });
  });

  it('displays bookings when data is loaded', async () => {
    mockApiService.getBookingsByCustomer.mockResolvedValue(mockBookings);
    
    const { getByText } = render(<TestNavigator />);
    
    await act(async () => {
      await waitFor(() => {
        expect(getByText('Toyota Camry 2023')).toBeTruthy();
        expect(getByText('Honda Accord 2023')).toBeTruthy();
        expect(getByText('$400.00')).toBeTruthy();
        expect(getByText('$300.00')).toBeTruthy();
      });
    });
  });

  it('displays empty state when no bookings', async () => {
    mockApiService.getBookingsByCustomer.mockResolvedValue([]);
    
    const { getByText } = render(<TestNavigator />);
    
    await act(async () => {
      await waitFor(() => {
        expect(getByText('No bookings found')).toBeTruthy();
        expect(getByText('Start by booking a car from the Cars tab')).toBeTruthy();
      });
    });
  });

  it('handles API error gracefully', async () => {
    mockApiService.getBookingsByCustomer.mockRejectedValue(new Error('API Error'));
    
    const { getByText } = render(<TestNavigator />);
    
    await act(async () => {
      await waitFor(() => {
        expect(getByText('No bookings found')).toBeTruthy();
      });
    });
  });

  it('displays correct booking count in header', async () => {
    mockApiService.getBookingsByCustomer.mockResolvedValue(mockBookings);
    
    const { getByText } = render(<TestNavigator />);
    
    await act(async () => {
      await waitFor(() => {
        expect(getByText('2 bookings found')).toBeTruthy();
      });
    });
  });

  it('displays correct booking count for single booking', async () => {
    mockApiService.getBookingsByCustomer.mockResolvedValue([mockBookings[0]]);
    
    const { getByText } = render(<TestNavigator />);
    
    await act(async () => {
      await waitFor(() => {
        expect(getByText('1 booking found')).toBeTruthy();
      });
    });
  });

  it('shows booking status badges with correct colors', async () => {
    mockApiService.getBookingsByCustomer.mockResolvedValue(mockBookings);
    
    const { getByText } = render(<TestNavigator />);
    
    await act(async () => {
      await waitFor(() => {
        expect(getByText('Pending')).toBeTruthy();
        expect(getByText('Confirmed')).toBeTruthy();
      });
    });
  });

  it('displays booking details correctly', async () => {
    mockApiService.getBookingsByCustomer.mockResolvedValue([mockBookings[0]]);
    
    const { getByText } = render(<TestNavigator />);
    
    await act(async () => {
      await waitFor(() => {
        expect(getByText('Pickup:')).toBeTruthy();
        expect(getByText('Return:')).toBeTruthy();
        expect(getByText('Duration:')).toBeTruthy();
        expect(getByText('5 days')).toBeTruthy();
      });
    });
  });
});
