# API Testing Scripts

This directory contains scripts to test the Car Rental API endpoints.

## Prerequisites

- Backend API running on `http://localhost:5000`
- MongoDB running with sample data loaded
- curl or similar HTTP client

## Test Scripts

### 1. Test Cars Endpoints

```bash
# Get all cars
curl -X GET http://localhost:5000/api/cars

# Get car by ID (replace with actual ID)
curl -X GET http://localhost:5000/api/cars/{carId}

# Search cars
curl -X POST http://localhost:5000/api/cars/search \
  -H "Content-Type: application/json" \
  -d '{"make": "Toyota", "maxDailyRate": 50}'

# Create new car
curl -X POST http://localhost:5000/api/cars \
  -H "Content-Type: application/json" \
  -d '{
    "make": "Honda",
    "model": "Accord",
    "year": 2023,
    "color": "Blue",
    "licensePlate": "XYZ789",
    "dailyRate": 55.00,
    "fuelType": "Gasoline",
    "transmission": "Automatic",
    "seats": 5,
    "description": "Comfortable mid-size sedan"
  }'
```

### 2. Test Customers Endpoints

```bash
# Get all customers
curl -X GET http://localhost:5000/api/customers

# Get customer by ID
curl -X GET http://localhost:5000/api/customers/{customerId}

# Get customer by email
curl -X GET http://localhost:5000/api/customers/email/john.smith@email.com

# Create new customer
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@email.com",
    "phone": "555-0199",
    "address": {
      "street": "123 Test St",
      "city": "Test City",
      "state": "TS",
      "zipCode": "12345",
      "country": "USA"
    },
    "dateOfBirth": "1990-01-01",
    "driversLicense": "DL999888777"
  }'
```

### 3. Test Bookings Endpoints

```bash
# Get all bookings
curl -X GET http://localhost:5000/api/bookings

# Get booking by ID
curl -X GET http://localhost:5000/api/bookings/{bookingId}

# Get bookings by customer
curl -X GET http://localhost:5000/api/bookings/customer/{customerId}

# Create new booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "{customerId}",
    "carId": "{carId}",
    "pickupDate": "2024-02-01",
    "returnDate": "2024-02-05",
    "pickupLocation": "Main Office",
    "returnLocation": "Main Office",
    "notes": "Test booking"
  }'

# Cancel booking
curl -X PUT http://localhost:5000/api/bookings/{bookingId}/cancel
```

## Integration Test Script

Create a comprehensive test script that tests the full workflow:

```bash
#!/bin/bash

echo "Starting Car Rental API Integration Tests..."

BASE_URL="http://localhost:5000"

# Test 1: Get all cars
echo "Test 1: Getting all cars..."
curl -s -X GET $BASE_URL/api/cars | jq '.[0]' || echo "Failed to get cars"

# Test 2: Get all customers
echo "Test 2: Getting all customers..."
curl -s -X GET $BASE_URL/api/customers | jq '.[0]' || echo "Failed to get customers"

# Test 3: Create a booking
echo "Test 3: Creating a booking..."
BOOKING_RESPONSE=$(curl -s -X POST $BASE_URL/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "REPLACE_WITH_ACTUAL_CUSTOMER_ID",
    "carId": "REPLACE_WITH_ACTUAL_CAR_ID",
    "pickupDate": "2024-02-01",
    "returnDate": "2024-02-03",
    "pickupLocation": "Test Location",
    "returnLocation": "Test Location"
  }')

echo "Booking created: $BOOKING_RESPONSE"

# Test 4: Get all bookings
echo "Test 4: Getting all bookings..."
curl -s -X GET $BASE_URL/api/bookings | jq '.[0]' || echo "Failed to get bookings"

echo "Integration tests completed!"
```

## Expected Responses

### Successful Car Response
```json
{
  "id": "507f1f77bcf86cd799439011",
  "make": "Toyota",
  "model": "Camry",
  "year": 2022,
  "color": "Silver",
  "licensePlate": "ABC123",
  "dailyRate": 45.00,
  "isAvailable": true,
  "fuelType": "Gasoline",
  "transmission": "Automatic",
  "seats": 5
}
```

### Successful Booking Response
```json
{
  "id": "507f1f77bcf86cd799439012",
  "customerId": "507f1f77bcf86cd799439013",
  "carId": "507f1f77bcf86cd799439011",
  "pickupDate": "2024-02-01T00:00:00Z",
  "returnDate": "2024-02-03T00:00:00Z",
  "totalDays": 2,
  "dailyRate": 45.00,
  "totalAmount": 90.00,
  "status": "Pending",
  "pickupLocation": "Main Office",
  "returnLocation": "Main Office"
}
```

## Error Handling Tests

Test error scenarios:

```bash
# Test invalid car ID
curl -X GET http://localhost:5000/api/cars/invalid-id

# Test booking with invalid dates
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "valid-id",
    "carId": "valid-id",
    "pickupDate": "2024-02-05",
    "returnDate": "2024-02-01",
    "pickupLocation": "Test",
    "returnLocation": "Test"
  }'

# Test duplicate customer email
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "john.smith@email.com",
    "phone": "555-0000",
    "address": {
      "street": "123 St",
      "city": "City",
      "state": "ST",
      "zipCode": "12345",
      "country": "USA"
    },
    "dateOfBirth": "1990-01-01",
    "driversLicense": "DL123456"
  }'
```

## Performance Testing

For load testing, you can use tools like Apache Bench or wrk:

```bash
# Test API performance
ab -n 1000 -c 10 http://localhost:5000/api/cars

# Test with wrk
wrk -t12 -c400 -d30s http://localhost:5000/api/cars
```
