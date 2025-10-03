# Car Rental App - Deployment Guide

This guide covers deploying both the backend API and mobile applications to production environments.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile Apps   │    │   Backend API   │    │    Database     │
│                 │    │                 │    │                 │
│  iOS & Android  │◄──►│   .NET 6 API    │◄──►│    MongoDB      │
│                 │    │                 │    │                 │
│  React Native   │    │  Azure/AWS/Docker│    │ Atlas/Local     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Payment SDKs   │    │  Payment APIs   │    │   Monitoring    │
│                 │    │                 │    │                 │
│ Stripe & PayPal │    │ Stripe & PayPal │    │ Logs & Metrics  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Backend Deployment

### Option 1: Azure App Service

#### 1. Create Azure Resources
```bash
# Install Azure CLI
az login

# Create resource group
az group create --name car-rental-rg --location eastus

# Create App Service plan
az appservice plan create --name car-rental-plan --resource-group car-rental-rg --sku B1

# Create web app
az webapp create --name car-rental-api --resource-group car-rental-rg --plan car-rental-plan --runtime "DOTNET|6.0"
```

#### 2. Configure Environment Variables
```bash
# Set connection strings
az webapp config connection-string set --name car-rental-api --resource-group car-rental-rg --connection-string-type MongoDB --connection-string "mongodb://your-mongodb-connection"

# Set app settings
az webapp config appsettings set --name car-rental-api --resource-group car-rental-rg --settings \
  Stripe__SecretKey="sk_live_your_live_key" \
  Stripe__PublishableKey="pk_live_your_live_key" \
  PayPal__ClientId="your_live_paypal_client_id" \
  PayPal__ClientSecret="your_live_paypal_client_secret" \
  PayPal__Sandbox="false"
```

#### 3. Deploy Application
```bash
# Build and publish
dotnet publish -c Release -o ./publish

# Deploy to Azure
az webapp deployment source config-zip --name car-rental-api --resource-group car-rental-rg --src ./publish.zip
```

### Option 2: AWS Elastic Beanstalk

#### 1. Create Application
```bash
# Install EB CLI
pip install awsebcli

# Initialize EB application
eb init car-rental-api --platform "64bit Amazon Linux 2 v3.4.0 running .NET Core"

# Create environment
eb create car-rental-prod
```

#### 2. Configure Environment Variables
```bash
# Set environment variables
eb setenv Stripe__SecretKey="sk_live_your_live_key"
eb setenv Stripe__PublishableKey="pk_live_your_live_key"
eb setenv PayPal__ClientId="your_live_paypal_client_id"
eb setenv PayPal__ClientSecret="your_live_paypal_client_secret"
eb setenv PayPal__Sandbox="false"
```

#### 3. Deploy Application
```bash
# Deploy
eb deploy
```

### Option 3: Docker Deployment

#### 1. Create Dockerfile
```dockerfile
# backend/Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["CarRentalAPI.csproj", "."]
RUN dotnet restore "./CarRentalAPI.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "CarRentalAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CarRentalAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CarRentalAPI.dll"]
```

#### 2. Create Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: ./backend
    ports:
      - "5000:80"
    environment:
      - MongoDB__ConnectionString=mongodb://mongo:27017
      - Stripe__SecretKey=${STRIPE_SECRET_KEY}
      - Stripe__PublishableKey=${STRIPE_PUBLISHABLE_KEY}
      - PayPal__ClientId=${PAYPAL_CLIENT_ID}
      - PayPal__ClientSecret=${PAYPAL_CLIENT_SECRET}
      - PayPal__Sandbox=false
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

#### 3. Deploy with Docker
```bash
# Build and run
docker-compose up -d

# Or deploy to cloud provider
docker build -t car-rental-api .
docker tag car-rental-api your-registry/car-rental-api:latest
docker push your-registry/car-rental-api:latest
```

## 📱 Mobile App Deployment

### iOS App Store Deployment

#### 1. Prepare for Production
```bash
cd CarRentalMobile

# Update version in package.json
npm version patch

# Update iOS version in ios/CarRentalMobile/Info.plist
# CFBundleShortVersionString = "1.0.0"
# CFBundleVersion = "1"
```

#### 2. Configure Production Settings
```typescript
// src/constants/Config.ts
export const Config = {
  API_BASE_URL: 'https://your-production-api.com/api',
  STRIPE_PUBLISHABLE_KEY: 'pk_live_your_live_stripe_key',
  PAYPAL_CLIENT_ID: 'your_live_paypal_client_id',
  // ... other config
};
```

#### 3. Build and Archive
```bash
# Install dependencies
npm install

# Install iOS pods
cd ios && pod install && cd ..

# Build for release
npx react-native run-ios --configuration Release

# Or use Xcode
# 1. Open ios/CarRentalMobile.xcworkspace
# 2. Select "Any iOS Device (arm64)" as target
# 3. Product → Archive
# 4. Upload to App Store Connect
```

#### 4. App Store Connect
1. Create app in App Store Connect
2. Upload build via Xcode or Transporter
3. Fill out app metadata:
   - App name: "Car Rental App"
   - Description: Car rental booking app
   - Keywords: car, rental, booking, travel
   - Screenshots and app icons
4. Submit for review

### Android Google Play Deployment

#### 1. Generate Signed APK/AAB
```bash
# Generate keystore (first time only)
keytool -genkey -v -keystore car-rental-key.keystore -alias car-rental -keyalg RSA -keysize 2048 -validity 10000

# Configure gradle for signing
# Add to android/app/build.gradle:
android {
    signingConfigs {
        release {
            keyAlias 'car-rental'
            keyPassword 'your_key_password'
            storeFile file('../car-rental-key.keystore')
            storePassword 'your_store_password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}

# Build release APK
cd android
./gradlew assembleRelease

# Build release AAB (recommended)
./gradlew bundleRelease
```

#### 2. Google Play Console
1. Create app in Google Play Console
2. Upload AAB file
3. Fill out store listing:
   - App name: "Car Rental App"
   - Short description: "Book cars easily"
   - Full description: Detailed app description
   - Screenshots and app icons
4. Set up pricing and distribution
5. Submit for review

## 🔧 Production Configuration

### Backend Configuration

#### Environment Variables
```bash
# Production settings
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=https://+:443;http://+:80

# Database
MongoDB__ConnectionString=mongodb://your-production-mongodb
MongoDB__DatabaseName=CarRentalDB

# Payments
Stripe__SecretKey=sk_live_your_live_stripe_secret_key
Stripe__PublishableKey=pk_live_your_live_stripe_publishable_key
PayPal__ClientId=your_live_paypal_client_id
PayPal__ClientSecret=your_live_paypal_client_secret
PayPal__Sandbox=false

# Security
JWT__SecretKey=your_jwt_secret_key
JWT__Issuer=CarRentalAPI
JWT__Audience=CarRentalMobile
```

#### Security Configuration
```csharp
// Program.cs - Production security
if (app.Environment.IsProduction())
{
    app.UseHsts();
    app.UseHttpsRedirection();
    
    // Configure CORS for production domains only
    app.UseCors("ProductionPolicy");
}
```

### Mobile App Configuration

#### iOS Configuration
```xml
<!-- ios/CarRentalMobile/Info.plist -->
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <false/>
    <key>NSExceptionDomains</key>
    <dict>
        <key>your-api-domain.com</key>
        <dict>
            <key>NSExceptionAllowsInsecureHTTPLoads</key>
            <true/>
        </dict>
    </dict>
</dict>
```

#### Android Configuration
```xml
<!-- android/app/src/main/res/xml/network_security_config.xml -->
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="false">
        <domain includeSubdomains="true">your-api-domain.com</domain>
        <trust-anchors>
            <certificates src="system"/>
        </trust-anchors>
    </domain-config>
</network-security-config>
```

## 🔍 Monitoring & Logging

### Backend Monitoring
```csharp
// Add to Program.cs
builder.Services.AddApplicationInsightsTelemetry();

// Custom logging
builder.Services.AddLogging(builder =>
{
    builder.AddConsole();
    builder.AddApplicationInsights();
});
```

### Mobile Monitoring
```typescript
// Install crash reporting
npm install @react-native-firebase/crashlytics

// Configure in App.tsx
import crashlytics from '@react-native-firebase/crashlytics';
```

## 🚨 Security Checklist

### Backend Security
- [ ] HTTPS enabled
- [ ] API keys stored securely
- [ ] CORS configured properly
- [ ] Input validation implemented
- [ ] Rate limiting configured
- [ ] Authentication/authorization implemented
- [ ] SQL injection prevention
- [ ] XSS protection enabled

### Mobile Security
- [ ] Certificate pinning implemented
- [ ] Sensitive data encrypted
- [ ] API keys secured
- [ ] Root/jailbreak detection
- [ ] Code obfuscation enabled
- [ ] Secure storage used
- [ ] Network security configured

## 📊 Performance Optimization

### Backend Optimization
- [ ] Database indexing optimized
- [ ] Caching implemented (Redis)
- [ ] CDN configured for static files
- [ ] Database connection pooling
- [ ] Response compression enabled
- [ ] Memory usage optimized

### Mobile Optimization
- [ ] Image optimization
- [ ] Bundle size optimized
- [ ] Lazy loading implemented
- [ ] Memory leaks fixed
- [ ] Network requests optimized
- [ ] Offline capabilities added

## 🧪 Pre-Deployment Testing

### Backend Testing
```bash
# Run all tests
dotnet test

# Load testing
ab -n 1000 -c 10 https://your-api.com/api/cars

# Security testing
dotnet list package --vulnerable
```

### Mobile Testing
```bash
# Run tests
npm test

# E2E testing
npm run test:e2e

# Performance testing
# Use React Native Performance Monitor
```

## 🚀 Deployment Steps

### 1. Pre-Deployment
1. ✅ All tests passing
2. ✅ Security review completed
3. ✅ Performance testing done
4. ✅ Configuration reviewed
5. ✅ Backup strategy in place

### 2. Backend Deployment
1. ✅ Build and test locally
2. ✅ Deploy to staging environment
3. ✅ Run integration tests
4. ✅ Deploy to production
5. ✅ Monitor health checks

### 3. Mobile Deployment
1. ✅ Build release versions
2. ✅ Test on real devices
3. ✅ Upload to app stores
4. ✅ Submit for review
5. ✅ Monitor crash reports

### 4. Post-Deployment
1. ✅ Monitor application health
2. ✅ Check payment processing
3. ✅ Verify user flows
4. ✅ Monitor performance metrics
5. ✅ Set up alerts and notifications

## 📞 Support & Maintenance

### Monitoring Tools
- **Backend**: Application Insights, New Relic, DataDog
- **Mobile**: Firebase Crashlytics, Bugsnag
- **Database**: MongoDB Atlas monitoring
- **Payments**: Stripe Dashboard, PayPal Developer Console

### Maintenance Tasks
- [ ] Regular security updates
- [ ] Database backups
- [ ] Performance monitoring
- [ ] Error log review
- [ ] User feedback analysis
- [ ] Feature usage analytics

## 🎯 Post-Launch Checklist

- [ ] Analytics tracking working
- [ ] Crash reporting configured
- [ ] Payment processing verified
- [ ] User onboarding flow tested
- [ ] Support channels established
- [ ] Documentation updated
- [ ] Team training completed
- [ ] Backup and recovery tested
