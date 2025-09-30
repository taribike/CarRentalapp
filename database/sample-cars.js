// Sample Cars Data for Car Rental Database
// Run this script in MongoDB to populate the cars collection

db = db.getSiblingDB('CarRentalDB');

db.cars.insertMany([
  {
    "make": "Toyota",
    "model": "Camry",
    "year": 2022,
    "color": "Silver",
    "licensePlate": "ABC123",
    "dailyRate": 45.00,
    "isAvailable": true,
    "fuelType": "Gasoline",
    "transmission": "Automatic",
    "seats": 5,
    "imageUrl": "https://example.com/images/toyota-camry.jpg",
    "description": "Reliable mid-size sedan perfect for city driving"
  },
  {
    "make": "Honda",
    "model": "Civic",
    "year": 2023,
    "color": "Blue",
    "licensePlate": "DEF456",
    "dailyRate": 40.00,
    "isAvailable": true,
    "fuelType": "Gasoline",
    "transmission": "Automatic",
    "seats": 5,
    "imageUrl": "https://example.com/images/honda-civic.jpg",
    "description": "Compact car with excellent fuel efficiency"
  },
  {
    "make": "Ford",
    "model": "Explorer",
    "year": 2022,
    "color": "Black",
    "licensePlate": "GHI789",
    "dailyRate": 75.00,
    "isAvailable": true,
    "fuelType": "Gasoline",
    "transmission": "Automatic",
    "seats": 7,
    "imageUrl": "https://example.com/images/ford-explorer.jpg",
    "description": "Spacious SUV ideal for family trips"
  },
  {
    "make": "BMW",
    "model": "3 Series",
    "year": 2023,
    "color": "White",
    "licensePlate": "JKL012",
    "dailyRate": 85.00,
    "isAvailable": true,
    "fuelType": "Gasoline",
    "transmission": "Automatic",
    "seats": 5,
    "imageUrl": "https://example.com/images/bmw-3series.jpg",
    "description": "Luxury sedan with premium features"
  },
  {
    "make": "Tesla",
    "model": "Model 3",
    "year": 2023,
    "color": "Red",
    "licensePlate": "MNO345",
    "dailyRate": 95.00,
    "isAvailable": true,
    "fuelType": "Electric",
    "transmission": "Automatic",
    "seats": 5,
    "imageUrl": "https://example.com/images/tesla-model3.jpg",
    "description": "Electric vehicle with autopilot features"
  },
  {
    "make": "Chevrolet",
    "model": "Malibu",
    "year": 2022,
    "color": "Gray",
    "licensePlate": "PQR678",
    "dailyRate": 42.00,
    "isAvailable": true,
    "fuelType": "Gasoline",
    "transmission": "Automatic",
    "seats": 5,
    "imageUrl": "https://example.com/images/chevrolet-malibu.jpg",
    "description": "Comfortable mid-size sedan"
  },
  {
    "make": "Nissan",
    "model": "Altima",
    "year": 2023,
    "color": "Green",
    "licensePlate": "STU901",
    "dailyRate": 38.00,
    "isAvailable": true,
    "fuelType": "Gasoline",
    "transmission": "Automatic",
    "seats": 5,
    "imageUrl": "https://example.com/images/nissan-altima.jpg",
    "description": "Efficient sedan with modern technology"
  },
  {
    "make": "Audi",
    "model": "A4",
    "year": 2022,
    "color": "Black",
    "licensePlate": "VWX234",
    "dailyRate": 90.00,
    "isAvailable": true,
    "fuelType": "Gasoline",
    "transmission": "Automatic",
    "seats": 5,
    "imageUrl": "https://example.com/images/audi-a4.jpg",
    "description": "Premium sedan with quattro all-wheel drive"
  },
  {
    "make": "Hyundai",
    "model": "Elantra",
    "year": 2023,
    "color": "Silver",
    "licensePlate": "YZA567",
    "dailyRate": 35.00,
    "isAvailable": true,
    "fuelType": "Gasoline",
    "transmission": "Automatic",
    "seats": 5,
    "imageUrl": "https://example.com/images/hyundai-elantra.jpg",
    "description": "Affordable compact car with great warranty"
  },
  {
    "make": "Mercedes-Benz",
    "model": "C-Class",
    "year": 2023,
    "color": "White",
    "licensePlate": "BCD890",
    "dailyRate": 100.00,
    "isAvailable": true,
    "fuelType": "Gasoline",
    "transmission": "Automatic",
    "seats": 5,
    "imageUrl": "https://example.com/images/mercedes-cclass.jpg",
    "description": "Luxury sedan with advanced safety features"
  }
]);

print("Sample cars data inserted successfully!");
