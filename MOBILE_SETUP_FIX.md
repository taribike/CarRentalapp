# Mobile App Network Fix

## Problem
The mobile app was unable to connect to the backend API because:
1. The backend was only listening on `localhost`, which is not accessible from iOS/Android simulators
2. The mobile app was configured to use `localhost` which doesn't work in simulator environments

## Solution

### Backend Changes
1. **Updated `appsettings.Development.json`**: Added `"Urls": "http://0.0.0.0:5000"` to listen on all network interfaces
2. **Updated `Program.cs`**: 
   - Added explicit URL configuration for development: `builder.WebHost.UseUrls("http://0.0.0.0:5000")`
   - Disabled HTTPS redirection in development mode
3. **Created `start-dev.sh`**: Helper script to start the backend with the correct configuration

### Mobile App Changes
1. **Updated `Config.ts`**: 
   - Added platform-specific API URL detection
   - For Android emulator: uses `http://10.0.2.2:5000/api` (special alias for host machine)
   - For iOS simulator: uses `http://10.0.0.166:5000/api` (your Mac's IP address)

## How to Use

### Starting the Backend
```bash
# Option 1: Use the helper script (recommended)
cd backend
./start-dev.sh

# Option 2: Use dotnet directly
cd backend
ASPNETCORE_URLS="http://0.0.0.0:5000" dotnet run
```

### Running the Mobile App
```bash
# For iOS
cd CarRentalMobile
npm run ios

# For Android
cd CarRentalMobile
npm run android
```

## Network Details
- **Your Mac's IP**: `10.0.0.166`
- **Backend URL**: `http://0.0.0.0:5000` (listens on all interfaces)
- **iOS Simulator URL**: `http://10.0.0.166:5000/api`
- **Android Emulator URL**: `http://10.0.2.2:5000/api`

## Verifying It Works
Test the API from command line:
```bash
curl http://10.0.0.166:5000/api/cars
```

If your IP address changes (e.g., when you connect to a different Wi-Fi network), update it in:
- `CarRentalMobile/src/constants/Config.ts` (line 12)

To find your current IP:
```bash
ipconfig getifaddr en0
```

## Important Notes
- The backend must be running BEFORE starting the mobile app
- Make sure MongoDB is also running (required by the backend)
- If you see "Network request failed", check that:
  1. The backend is running
  2. Your IP address hasn't changed
  3. You're using the correct URL for your platform (iOS vs Android)

