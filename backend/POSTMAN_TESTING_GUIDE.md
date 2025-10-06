# Car Rental API - Postman Testing Guide

This guide will help you test all the Car Rental API endpoints using Postman.

## Prerequisites

1. **Start the API Server**
   ```bash
   cd /Users/toluwanimiaribike/CarRentalApp/backend
   dotnet run
   ```
   The API will be available at `https://localhost:7000` (HTTPS) or `http://localhost:5000` (HTTP)

2. **MongoDB Setup**
   - Ensure MongoDB is running on `localhost:27017`
   - The database `CarRentalDB` will be created automatically

3. **Postman Setup**
   - Install Postman if you haven't already
   - Import the collection and environment files

## Importing the Collection and Environment

1. **Import Collection**
   - Open Postman
   - Click "Import" button
   - Select `CarRentalAPI.postman_collection.json`
   - The collection will be imported with all endpoints

2. **Import Environment**
   - Click "Import" button again
   - Select `CarRentalAPI.postman_environment.json`
   - Select the "Car Rental API Environment" from the environment dropdown

## Testing Workflow

### Step 1: Test Customer APIs

1. **Create a Customer**
   - Use the "Create Customer" request
   - The response will contain the customer ID
   - Copy the `id` from the response and update the `customer_id` environment variable

2. **Get All Customers**
   - Verify the customer was created

3. **Get Customer by ID**
   - Test with the created customer ID

4. **Get Customer by Email**
   - Test with the email used in creation

5. **Update Customer**
   - Modify customer information

### Step 2: Test Car APIs

1. **Create a Car**
   - Use the "Create Car" request
   - Copy the `id` from the response and update the `car_id` environment variable

2. **Get All Cars**
   - Verify the car was created

3. **Search Cars**
   - Test the search functionality with various filters

4. **Check Car Availability**
   - Test availability checking for specific dates

5. **Update Car**
   - Modify car information

### Step 3: Test Booking APIs

1. **Create a Booking**
   - Use the customer and car IDs from previous steps
   - Copy the `id` from the response and update the `booking_id` environment variable

2. **Get All Bookings**
   - Verify the booking was created

3. **Get Booking by ID**
   - Test with the created booking ID

4. **Get Bookings by Customer**
   - Test with the customer ID

5. **Get Bookings by Car**
   - Test with the car ID

6. **Update Booking**
   - Modify booking information

7. **Cancel Booking**
   - Test booking cancellation

### Step 4: Test Payment APIs

1. **Create a Payment**
   - Use the booking and customer IDs from previous steps
   - Copy the `id` from the response and update the `payment_id` environment variable

2. **Get All Payments**
   - Verify the payment was created

3. **Get Payment by ID**
   - Test with the created payment ID

4. **Get Payments by Booking**
   - Test with the booking ID

5. **Get Payments by Customer**
   - Test with the customer ID

6. **Stripe Payment Flow**
   - Create Stripe Payment Intent
   - Confirm Stripe Payment

7. **PayPal Payment Flow**
   - Create PayPal Order
   - Capture PayPal Payment

8. **Update Payment Status**
   - Test status updates

9. **Refund Payment**
   - Test payment refunds

## Sample Data for Testing

### Customer Data
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "dateOfBirth": "1990-01-15T00:00:00Z",
  "driversLicense": "DL123456789"
}
```

### Car Data
```json
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2023,
  "color": "Silver",
  "licensePlate": "ABC123",
  "dailyRate": 75.00,
  "fuelType": "Gasoline",
  "transmission": "Automatic",
  "seats": 5,
  "imageUrl": "https://example.com/toyota-camry.jpg",
  "description": "Reliable and fuel-efficient sedan"
}
```

### Booking Data
```json
{
  "customerId": "{{customer_id}}",
  "carId": "{{car_id}}",
  "pickupDate": "2024-01-15T10:00:00Z",
  "returnDate": "2024-01-20T10:00:00Z",
  "pickupLocation": "Airport Terminal 1",
  "returnLocation": "Airport Terminal 1",
  "notes": "Customer prefers automatic transmission"
}
```

### Payment Data
```json
{
  "bookingId": "{{booking_id}}",
  "customerId": "{{customer_id}}",
  "amount": 375.00,
  "currency": "USD",
  "paymentMethod": "CreditCard",
  "paymentProvider": "Stripe",
  "description": "Payment for car rental booking"
}
```

## Environment Variables

The following variables are available in the environment:

- `base_url`: API base URL (default: https://localhost:7000)
- `customer_id`: Customer ID (populated after creating a customer)
- `customer_email`: Customer email for testing
- `car_id`: Car ID (populated after creating a car)
- `booking_id`: Booking ID (populated after creating a booking)
- `payment_id`: Payment ID (populated after creating a payment)

## Troubleshooting

### Common Issues

1. **SSL Certificate Error**
   - If you get SSL certificate errors, try using HTTP instead: `http://localhost:5000`
   - Update the `base_url` environment variable

2. **Connection Refused**
   - Ensure the API server is running
   - Check if MongoDB is running on port 27017

3. **404 Not Found**
   - Verify the API server is running on the correct port
   - Check the `base_url` environment variable

4. **500 Internal Server Error**
   - Check the API server logs
   - Ensure MongoDB is accessible

### Payment Testing Notes

1. **Stripe Testing**
   - The API uses test keys by default
   - Use Stripe test card numbers for testing
   - Test card: 4242 4242 4242 4242

2. **PayPal Testing**
   - The API uses PayPal sandbox by default
   - Use PayPal sandbox accounts for testing

## API Endpoints Summary

### Customers (`/api/customers`)
- GET `/` - Get all customers
- GET `/{id}` - Get customer by ID
- GET `/email/{email}` - Get customer by email
- POST `/` - Create customer
- PUT `/{id}` - Update customer
- DELETE `/{id}` - Delete customer

### Cars (`/api/cars`)
- GET `/` - Get all cars
- GET `/{id}` - Get car by ID
- POST `/search` - Search cars
- POST `/` - Create car
- PUT `/{id}` - Update car
- GET `/{id}/availability` - Check car availability
- DELETE `/{id}` - Delete car

### Bookings (`/api/bookings`)
- GET `/` - Get all bookings
- GET `/{id}` - Get booking by ID
- GET `/customer/{customerId}` - Get bookings by customer
- GET `/car/{carId}` - Get bookings by car
- POST `/` - Create booking
- PUT `/{id}` - Update booking
- PUT `/{id}/cancel` - Cancel booking
- DELETE `/{id}` - Delete booking

### Payments (`/api/payments`)
- GET `/` - Get all payments
- GET `/{id}` - Get payment by ID
- GET `/booking/{bookingId}` - Get payments by booking
- GET `/customer/{customerId}` - Get payments by customer
- POST `/` - Create payment
- POST `/stripe/create-intent` - Create Stripe payment intent
- POST `/stripe/confirm` - Confirm Stripe payment
- POST `/paypal/create-order` - Create PayPal order
- POST `/paypal/capture` - Capture PayPal payment
- PUT `/{id}/status` - Update payment status
- POST `/{id}/refund` - Refund payment

## Success Criteria

After completing all tests, you should be able to:

1. ✅ Create, read, update, and delete customers
2. ✅ Create, read, update, and delete cars
3. ✅ Search cars with various filters
4. ✅ Check car availability
5. ✅ Create, read, update, and cancel bookings
6. ✅ Create and manage payments
7. ✅ Process payments through Stripe
8. ✅ Process payments through PayPal
9. ✅ Update payment statuses
10. ✅ Process payment refunds

Happy testing! 🚗

