# Architecture Overview

## Car Rental Booking Application

This document provides a comprehensive overview of the Car Rental Booking Application architecture.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Java Frontend │    │  .NET Web API   │    │    MongoDB      │
│   (Swing UI)    │◄──►│    Backend      │◄──►│    Database     │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AWS S3        │    │   AWS EC2        │    │ MongoDB Atlas   │
│  (Static Files) │    │  (API Hosting)   │    │ (Production DB) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Technology Stack

### Frontend
- **Language**: Java 11+
- **UI Framework**: Java Swing
- **Build Tool**: Maven
- **HTTP Client**: OkHttp3
- **JSON Processing**: Gson
- **Date Handling**: LGoodDatePicker

### Backend
- **Language**: C# (.NET 6.0)
- **Framework**: ASP.NET Core Web API
- **Database Driver**: MongoDB.Driver
- **Documentation**: Swagger/OpenAPI
- **CORS**: Microsoft.AspNetCore.Cors

### Database
- **Primary Database**: MongoDB 4.4+
- **Cloud Option**: MongoDB Atlas
- **AWS Alternative**: AWS DocumentDB

### Cloud Infrastructure (AWS)
- **Compute**: EC2, ECS, Lambda
- **Storage**: S3, EBS
- **Database**: DocumentDB, RDS
- **Networking**: VPC, ALB, CloudFront
- **Monitoring**: CloudWatch, CloudTrail
- **Security**: IAM, Security Groups

## Application Components

### 1. Frontend Application (`frontend/`)

**Main Classes**:
- `CarRentalApp.java` - Main application window and UI controller
- `models/` - Data models (Car, Customer, Booking, Address)
- `services/CarRentalService.java` - API communication service
- `utils/ApiClient.java` - HTTP client wrapper

**Features**:
- Tabbed interface for Cars, Customers, and Bookings
- CRUD operations for all entities
- Real-time data synchronization with backend
- Form validation and error handling
- Responsive UI with proper layout management

### 2. Backend API (`backend/`)

**Main Components**:
- `Program.cs` - Application entry point and configuration
- `Controllers/` - API endpoints (CarsController, CustomersController, BookingsController)
- `Services/` - Business logic (CarService, CustomerService, BookingService)
- `Models/` - Data models and DTOs

**API Endpoints**:
```
/api/cars          - Car management
/api/customers     - Customer management  
/api/bookings      - Booking management
```

**Features**:
- RESTful API design
- MongoDB integration
- CORS support for frontend
- Swagger documentation
- Error handling and validation
- Async/await patterns

### 3. Database Layer (`database/`)

**Collections**:
- `cars` - Car inventory
- `customers` - Customer information
- `bookings` - Rental bookings

**Features**:
- Document-based storage
- Flexible schema
- Indexing for performance
- Sample data scripts
- Migration support

### 4. AWS Infrastructure (`aws/`)

**Components**:
- `terraform/` - Infrastructure as Code
- `docker/` - Containerization
- `scripts/` - Deployment automation
- `monitoring/` - CloudWatch configurations

**Services Used**:
- EC2 for compute instances
- S3 for static file storage
- CloudFront for CDN
- Application Load Balancer
- VPC for network isolation
- IAM for security

## Data Flow

### 1. User Interaction Flow
```
User → Java Frontend → HTTP Request → .NET API → MongoDB
User ← Java Frontend ← HTTP Response ← .NET API ← MongoDB
```

### 2. Booking Process Flow
```
1. User selects car and dates
2. Frontend validates input
3. API checks car availability
4. API calculates total cost
5. API creates booking record
6. API updates car availability
7. Frontend displays confirmation
```

### 3. Data Synchronization
```
Frontend loads data on startup
User makes changes
Frontend sends API request
Backend processes and stores
Backend returns updated data
Frontend refreshes display
```

## Security Considerations

### Authentication & Authorization
- API key authentication (future enhancement)
- Role-based access control
- Input validation and sanitization
- SQL injection prevention (NoSQL injection)

### Network Security
- HTTPS for all communications
- CORS configuration
- VPC network isolation
- Security groups and NACLs
- WAF for web application protection

### Data Security
- Encryption at rest (MongoDB)
- Encryption in transit (TLS/SSL)
- Secure credential storage
- Regular security updates

## Scalability & Performance

### Horizontal Scaling
- Load balancer distribution
- Multiple API instances
- Database sharding
- CDN for static content

### Vertical Scaling
- Larger EC2 instances
- More memory and CPU
- Optimized database queries
- Caching strategies

### Performance Optimization
- Database indexing
- Connection pooling
- Async operations
- Response compression
- Static file caching

## Monitoring & Logging

### Application Monitoring
- CloudWatch metrics
- Custom application metrics
- Error tracking and alerting
- Performance monitoring

### Infrastructure Monitoring
- EC2 instance monitoring
- Database performance metrics
- Network traffic analysis
- Cost monitoring

### Logging Strategy
- Structured logging
- Centralized log collection
- Log rotation and retention
- Security event logging

## Deployment Strategy

### Development Environment
- Local MongoDB instance
- Local API development
- Local frontend testing
- Docker Compose for integration

### Staging Environment
- AWS staging infrastructure
- MongoDB Atlas staging cluster
- Automated testing
- Performance testing

### Production Environment
- AWS production infrastructure
- MongoDB Atlas production cluster
- Blue-green deployment
- Automated rollback capability

## Future Enhancements

### Planned Features
- User authentication and authorization
- Payment processing integration
- Mobile application (React Native)
- Advanced reporting and analytics
- Real-time notifications
- Multi-language support

### Technical Improvements
- Microservices architecture
- Event-driven architecture
- Advanced caching (Redis)
- Message queuing (SQS/SNS)
- Container orchestration (EKS)
- CI/CD pipeline automation

## Maintenance & Support

### Regular Maintenance
- Security updates
- Dependency updates
- Performance optimization
- Database maintenance
- Backup verification

### Monitoring & Alerting
- 24/7 system monitoring
- Automated alerting
- Incident response procedures
- Performance baselines
- Capacity planning
