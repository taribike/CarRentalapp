#!/bin/bash

# Start the backend server in development mode
# This script ensures the server listens on all network interfaces
# so it's accessible from iOS/Android simulators

cd "$(dirname "$0")"

echo "Starting Car Rental API in development mode..."
echo "Server will be accessible at:"
echo "  - http://localhost:5000 (local)"
echo "  - http://0.0.0.0:5000 (all interfaces)"
echo ""

ASPNETCORE_URLS="http://0.0.0.0:5000" dotnet run

