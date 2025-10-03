import { Booking, BookingStatus } from '../../src/models/Booking';

describe('Booking Model', () => {
  const mockBooking: Booking = {
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
  };

  it('should create a valid booking object', () => {
    expect(mockBooking.id).toBe('booking-1');
    expect(mockBooking.customerId).toBe('customer-1');
    expect(mockBooking.carId).toBe('car-1');
    expect(mockBooking.status).toBe(BookingStatus.Pending);
  });

  it('should calculate total amount correctly', () => {
    expect(mockBooking.totalAmount).toBe(mockBooking.dailyRate * mockBooking.totalDays);
  });

  it('should have valid dates', () => {
    const pickupDate = new Date(mockBooking.pickupDate);
    const returnDate = new Date(mockBooking.returnDate);
    
    expect(pickupDate).toBeInstanceOf(Date);
    expect(returnDate).toBeInstanceOf(Date);
    expect(returnDate.getTime()).toBeGreaterThan(pickupDate.getTime());
  });

  it('should have required fields', () => {
    const requiredFields = [
      'id', 'customerId', 'carId', 'carInfo',
      'pickupDate', 'returnDate', 'pickupLocation',
      'returnLocation', 'totalDays', 'dailyRate',
      'totalAmount', 'status', 'createdAt', 'updatedAt'
    ];

    requiredFields.forEach(field => {
      expect(mockBooking).toHaveProperty(field);
      expect(mockBooking[field as keyof Booking]).toBeDefined();
    });
  });
});
