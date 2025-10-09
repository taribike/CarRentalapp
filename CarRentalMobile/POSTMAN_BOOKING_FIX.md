# Fix for Postman 400 Error - Create Booking

## The Problem
Getting 400 Bad Request when creating a booking because:
1. Using a car that has conflicting bookings
2. Pickup date is in the past
3. Invalid customer/car ID
4. Return date is before or equal to pickup date

## The Solution - Valid Request Format

### 1. Get Valid IDs First

**Get an available car:**
```bash
GET http://localhost:5000/api/cars
```
Find a car where `"isAvailable": true`

**Use the test customer ID:**
```
Customer ID: 68e6b2d07f1934fa11651945
```

### 2. Create Booking Request

**Endpoint:**  
`POST http://localhost:5000/api/bookings`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON) - CORRECT FORMAT:**
```json
{
  "customerId": "68e6b2d07f1934fa11651945",
  "carId": "68e6b1807f1934fa11651941",
  "pickupDate": "2025-10-10T10:00:00Z",
  "returnDate": "2025-10-13T10:00:00Z",
  "pickupLocation": "Airport Terminal 1",
  "returnLocation": "Airport Terminal 1",
  "notes": "Test booking from Postman"
}
```

**⚠️ DO NOT INCLUDE:**
- ❌ `status` field (automatically set to Pending by backend)
- ❌ `totalDays` field (calculated automatically)
- ❌ `dailyRate` field (comes from car)
- ❌ `totalAmount` field (calculated automatically)
- ❌ `createdAt` or `updatedAt` fields (set by backend)

### 3. Validation Rules to Follow

✅ **PickupDate** must be:
- In the future (not today or past)
- Before returnDate

✅ **ReturnDate** must be:
- After pickupDate
- At least 1 day difference

✅ **CarId** must be:
- A valid car ID from the database
- Car must have `isAvailable: true`
- No conflicting bookings for those dates

✅ **CustomerId** must be:
- A valid customer ID from the database
- Use: `68e6b2d07f1934fa11651945`

### 4. Successful Response Example

```json
{
  "id": "68e6b3fc7f1934fa11651948",
  "customerId": "68e6b2d07f1934fa11651945",
  "carId": "68e6b1807f1934fa11651941",
  "pickupDate": "2025-10-09T10:00:00Z",
  "returnDate": "2025-10-12T10:00:00Z",
  "totalDays": 3,
  "dailyRate": 75.00,
  "totalAmount": 225.00,
  "status": 0,
  "pickupLocation": "Airport Terminal 1",
  "returnLocation": "Airport Terminal 1",
  "createdAt": "2025-10-08T18:57:00.773813Z",
  "updatedAt": "2025-10-08T18:57:00.773813Z",
  "notes": "Test booking"
}
```

### 5. Common 400 Errors and Solutions

| Error Message | Solution |
|---------------|----------|
| "Pickup date must be before return date" | Ensure pickupDate < returnDate |
| "Pickup date cannot be in the past" | Use tomorrow's date or later |
| "Car not found" | Use a valid carId from GET /api/cars |
| "Car is not available" | Choose a car with `isAvailable: true` |
| "Car is not available for the requested dates" | Choose different dates or different car |

### 6. Quick Test Commands

**List all available cars:**
```bash
curl http://localhost:5000/api/cars | jq '.[] | select(.isAvailable == true) | {id, make, model}'
```

**Create a booking (copy-paste ready):**
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "68e6b2d07f1934fa11651945",
    "carId": "68e6b1807f1934fa11651941",
    "pickupDate": "2025-10-10T10:00:00Z",
    "returnDate": "2025-10-13T10:00:00Z",
    "pickupLocation": "Airport Terminal 1",
    "returnLocation": "Airport Terminal 1",
    "notes": "Test booking"
  }'
```

**Check bookings for customer:**
```bash
curl http://localhost:5000/api/bookings/customer/68e6b2d07f1934fa11651945
```

## Mobile App - Now Fixed!

The mobile app has been updated to use the real test customer ID (`68e6b2d07f1934fa11651945`) instead of `placeholder-customer-id`, so it should now work without 500 errors.

### Reload the App
Press `Cmd+R` in the iOS simulator to reload with the latest changes.

