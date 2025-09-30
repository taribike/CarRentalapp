# MongoDB Database Setup

This directory contains MongoDB setup scripts and sample data for the Car Rental application.

## Database Structure

The application uses the following collections:

### Cars Collection
- **Purpose**: Stores car inventory information
- **Fields**: make, model, year, color, licensePlate, dailyRate, isAvailable, fuelType, transmission, seats, imageUrl, description

### Customers Collection  
- **Purpose**: Stores customer information
- **Fields**: firstName, lastName, email, phone, address, dateOfBirth, driversLicense, createdAt

### Bookings Collection
- **Purpose**: Stores rental bookings
- **Fields**: customerId, carId, pickupDate, returnDate, totalDays, dailyRate, totalAmount, status, pickupLocation, returnLocation, notes, createdAt, updatedAt

## Setup Instructions

1. **Install MongoDB**: Make sure MongoDB is installed and running on your system
2. **Create Database**: The application will automatically create the `CarRentalDB` database
3. **Load Sample Data**: Run the sample data scripts to populate the database with test data

## Sample Data Scripts

- `sample-cars.js` - Sample car data
- `sample-customers.js` - Sample customer data  
- `sample-bookings.js` - Sample booking data

## Connection Configuration

Update the connection string in your application configuration:
- **Local Development**: `mongodb://localhost:27017`
- **Production**: Update with your MongoDB Atlas or AWS DocumentDB connection string
