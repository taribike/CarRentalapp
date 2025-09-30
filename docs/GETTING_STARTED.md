# Getting Started Guide

## Car Rental Booking Application

This guide will help you set up and run the Car Rental Booking Application locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **.NET 6.0 SDK** or later
- **Java 11** or later
- **MongoDB** 4.4 or later
- **Maven** 3.6 or later
- **Docker** (optional, for containerized deployment)

## Quick Start

### 1. Database Setup

1. **Install MongoDB**:
   - Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Start MongoDB service

2. **Load Sample Data**:
   ```bash
   # Connect to MongoDB
   mongosh
   
   # Load sample data
   load("database/sample-cars.js")
   load("database/sample-customers.js")
   ```

### 2. Backend Setup (.NET Web API)

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Restore dependencies**:
   ```bash
   dotnet restore
   ```

3. **Update connection string** in `appsettings.json`:
   ```json
   {
     "MongoDB": {
       "ConnectionString": "mongodb://localhost:27017",
       "DatabaseName": "CarRentalDB"
     }
   }
   ```

4. **Run the application**:
   ```bash
   dotnet run
   ```

   The API will be available at `http://localhost:5000`

### 3. Frontend Setup (Java Swing)

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Build the application**:
   ```bash
   mvn clean compile
   ```

3. **Run the application**:
   ```bash
   mvn exec:java -Dexec.mainClass="com.carrental.frontend.CarRentalApp"
   ```

## Using Docker (Alternative)

If you prefer to use Docker:

1. **Navigate to aws/docker directory**:
   ```bash
   cd aws/docker
   ```

2. **Start all services**:
   ```bash
   docker-compose up -d
   ```

   This will start:
   - MongoDB on port 27017
   - Backend API on port 5000
   - Frontend on port 8080

## Application Features

### Car Management
- View all available cars
- Add new cars to inventory
- Update car information
- Delete cars
- Search and filter cars

### Customer Management
- View all customers
- Add new customers
- Update customer information
- Delete customers
- Search customers by email

### Booking Management
- Create new bookings
- View all bookings
- Cancel bookings
- Track booking status
- Calculate rental costs

## API Endpoints

### Cars
- `GET /api/cars` - Get all cars
- `GET /api/cars/{id}` - Get car by ID
- `POST /api/cars/search` - Search cars
- `POST /api/cars` - Create new car
- `PUT /api/cars/{id}` - Update car
- `DELETE /api/cars/{id}` - Delete car

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `GET /api/customers/email/{email}` - Get customer by email
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/{id}` - Get booking by ID
- `GET /api/bookings/customer/{customerId}` - Get bookings by customer
- `GET /api/bookings/car/{carId}` - Get bookings by car
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/{id}` - Update booking
- `PUT /api/bookings/{id}/cancel` - Cancel booking
- `DELETE /api/bookings/{id}` - Delete booking

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check connection string in appsettings.json
   - Verify database name is correct

2. **API Not Responding**:
   - Check if backend is running on port 5000
   - Verify CORS settings
   - Check firewall settings

3. **Frontend Not Loading**:
   - Ensure Java 11+ is installed
   - Check Maven dependencies
   - Verify API base URL in frontend

### Logs

- **Backend logs**: Check console output when running `dotnet run`
- **Frontend logs**: Check console output when running the Java application
- **Database logs**: Check MongoDB logs

## Next Steps

1. **Production Deployment**: Follow the AWS deployment guide in `aws/README.md`
2. **Customization**: Modify the UI, add new features, or integrate with payment systems
3. **Testing**: Add unit tests and integration tests
4. **Monitoring**: Set up logging and monitoring for production use

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the API documentation
3. Check the logs for error messages
4. Ensure all prerequisites are installed correctly
