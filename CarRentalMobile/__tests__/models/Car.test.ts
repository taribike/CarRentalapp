import { Car } from '../../src/models/Car';

describe('Car Model', () => {
  const mockCar: Car = {
    id: 'car-1',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    color: 'Silver',
    licensePlate: 'ABC123',
    dailyRate: 80,
    isAvailable: true,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    seats: 5,
    imageUrl: 'https://example.com/car.jpg',
    description: 'Comfortable sedan perfect for city driving',
  };

  it('should create a valid car object', () => {
    expect(mockCar.id).toBe('car-1');
    expect(mockCar.make).toBe('Toyota');
    expect(mockCar.model).toBe('Camry');
    expect(mockCar.year).toBe(2023);
  });

  it('should have correct string values', () => {
    expect(mockCar.fuelType).toBe('Gasoline');
    expect(mockCar.transmission).toBe('Automatic');
    expect(mockCar.color).toBe('Silver');
  });

  it('should have valid numeric properties', () => {
    expect(mockCar.seats).toBeGreaterThan(0);
    expect(mockCar.dailyRate).toBeGreaterThan(0);
    expect(mockCar.year).toBeGreaterThan(2000);
  });

  it('should have required fields', () => {
    const requiredFields = [
      'id', 'make', 'model', 'year', 'color',
      'licensePlate', 'fuelType', 'transmission', 
      'seats', 'dailyRate', 'isAvailable'
    ];

    requiredFields.forEach(field => {
      expect(mockCar).toHaveProperty(field);
      expect(mockCar[field as keyof Car]).toBeDefined();
    });
  });

  it('should have boolean availability', () => {
    expect(typeof mockCar.isAvailable).toBe('boolean');
  });
});
