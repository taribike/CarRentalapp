# Step-by-Step: Testing Create Booking in Postman

## Prerequisites (Already Running ✅)

1. ✅ Backend API running on `http://localhost:5000`
2. ✅ MongoDB running on `localhost:27017`
3. ✅ Test customer created: `68e6b2d07f1934fa11651945`

---

## STEP 1: Open Postman

1. Launch **Postman** application
2. Click **"New"** → **"HTTP Request"** (or press Cmd+N)

---

## STEP 2: Get an Available Car ID

**Before creating a booking, you need a valid car ID.**

### In Postman:

1. **Method:** Select `GET` from dropdown
2. **URL:** Enter `http://localhost:5000/api/cars`
3. Click **"Send"** button

### Expected Response:
You'll see a list of cars. Find one where `"isAvailable": true`

Example:
```json
[
  {
    "id": "68e6b1807f1934fa11651941",  ← COPY THIS ID
    "make": "Toyota",
    "model": "Camry",
    "isAvailable": true,  ← Must be true!
    "dailyRate": 75.00
    ...
  }
]
```

**📝 Copy one car ID where `isAvailable: true`**

Example IDs that should work:
- `68e6b1807f1934fa11651941`
- `68e4475e7f1934fa11651937`
- `68e447f67f1934fa11651939`

---

## STEP 3: Create a New Request for Booking

1. Click **"New"** → **"HTTP Request"** again (or use a new tab)
2. This is where you'll create the booking

---

## STEP 4: Configure the Request

### A. Set the Method
- Change dropdown from `GET` to **`POST`**

### B. Set the URL
```
http://localhost:5000/api/bookings
```

### C. Add Headers
1. Click on the **"Headers"** tab
2. Add a new header:
   - **Key:** `Content-Type`
   - **Value:** `application/json`

### D. Add the Request Body
1. Click on the **"Body"** tab
2. Select **"raw"** radio button
3. From the dropdown on the right, select **"JSON"**
4. Paste this EXACT JSON (copy-paste ready):

```json
{
  "customerId": "68e6b2d07f1934fa11651945",
  "carId": "68e6b1807f1934fa11651941",
  "pickupDate": "2025-10-15T10:00:00Z",
  "returnDate": "2025-10-18T10:00:00Z",
  "pickupLocation": "Airport Terminal 1",
  "returnLocation": "Airport Terminal 1",
  "notes": "Test booking from Postman"
}
```

**⚠️ IMPORTANT:** 
- Replace `carId` with an available car ID from STEP 2 if needed
- Make sure pickupDate is in the FUTURE (not today or past)
- Make sure returnDate is AFTER pickupDate

---

## STEP 5: Send the Request

1. Click the blue **"Send"** button
2. Wait for the response

---

## STEP 6: Check the Response

### ✅ SUCCESS (201 Created):
```json
{
  "id": "68e6b8257f1934fa1165194a",
  "customerId": "68e6b2d07f1934fa11651945",
  "carId": "68e6b1807f1934fa11651941",
  "pickupDate": "2025-10-15T10:00:00Z",
  "returnDate": "2025-10-18T10:00:00Z",
  "totalDays": 3,
  "dailyRate": 75.00,
  "totalAmount": 225.00,
  "status": 0,
  "pickupLocation": "Airport Terminal 1",
  "returnLocation": "Airport Terminal 1",
  "createdAt": "2025-10-08T19:14:45.043047Z",
  "updatedAt": "2025-10-08T19:14:45.043047Z",
  "notes": "Test booking from Postman"
}
```
**Status Code:** 201 in green ✅

### ❌ Common Errors:

**400 Bad Request - "Pickup date cannot be in the past"**
- Fix: Change `pickupDate` to tomorrow or later
- Use dates like: `2025-10-15T10:00:00Z`

**400 Bad Request - "Car not found"**
- Fix: Use a valid car ID from the GET /api/cars request

**400 Bad Request - "Car is not available for the requested dates"**
- Fix: Choose a different car or different dates

**400 Bad Request - "The JSON value could not be converted"**
- Fix: Remove the `status` field from your request body
- Don't include any auto-calculated fields

**500 Internal Server Error**
- Fix: Check backend logs
- Ensure MongoDB is running

---

## STEP 7: Verify the Booking Was Created

### Get all bookings for the test customer:

1. Create a new GET request
2. URL: `http://localhost:5000/api/bookings/customer/68e6b2d07f1934fa11651945`
3. Click "Send"

You should see your newly created booking in the list!

---

## Quick Reference - Copy-Paste Templates

### Template 1: Basic Booking (3 days)
```json
{
  "customerId": "68e6b2d07f1934fa11651945",
  "carId": "68e6b1807f1934fa11651941",
  "pickupDate": "2025-10-20T10:00:00Z",
  "returnDate": "2025-10-23T10:00:00Z",
  "pickupLocation": "Airport Terminal 1",
  "returnLocation": "Airport Terminal 1",
  "notes": "Weekend trip"
}
```

### Template 2: Week-long Booking
```json
{
  "customerId": "68e6b2d07f1934fa11651945",
  "carId": "68e4475e7f1934fa11651937",
  "pickupDate": "2025-11-01T09:00:00Z",
  "returnDate": "2025-11-08T09:00:00Z",
  "pickupLocation": "Downtown Office",
  "returnLocation": "Downtown Office",
  "notes": "Business trip"
}
```

### Template 3: No Notes (Optional field)
```json
{
  "customerId": "68e6b2d07f1934fa11651945",
  "carId": "68e44a967f1934fa1165193b",
  "pickupDate": "2025-10-25T14:00:00Z",
  "returnDate": "2025-10-27T14:00:00Z",
  "pickupLocation": "Hotel Pickup",
  "returnLocation": "Airport Drop-off"
}
```

---

## Troubleshooting Checklist

Before testing, verify:

- [ ] Backend is running: Visit `http://localhost:5000/api/cars` in browser
- [ ] MongoDB is running: Run `lsof -ti:27017` in terminal
- [ ] Using POST method (not GET)
- [ ] URL is exactly: `http://localhost:5000/api/bookings`
- [ ] Header `Content-Type: application/json` is set
- [ ] Body type is set to "raw" and "JSON"
- [ ] Car ID exists and is available
- [ ] Customer ID is valid: `68e6b2d07f1934fa11651945`
- [ ] Pickup date is in the FUTURE
- [ ] Return date is AFTER pickup date
- [ ] NO `status` field in request body
- [ ] NO `totalDays`, `totalAmount`, `dailyRate` fields

---

## Visual Guide

```
Postman Interface:
┌────────────────────────────────────────────────┐
│ POST ▼ │ http://localhost:5000/api/bookings  │ Send │
├────────────────────────────────────────────────┤
│ Params │ Authorization │ Headers │ Body │ ...│
│                                                 │
│ Headers Tab:                                   │
│ ┌─────────────────┬──────────────────────┐   │
│ │ Content-Type    │ application/json     │   │
│ └─────────────────┴──────────────────────┘   │
│                                                 │
│ Body Tab: ◉ raw  ◯ form-data  ◯ ...           │
│ Dropdown: JSON ▼                               │
│ ┌────────────────────────────────────────┐   │
│ │ {                                       │   │
│ │   "customerId": "68e6b2d07f1934fa...", │   │
│ │   "carId": "68e6b1807f1934fa11651941", │   │
│ │   "pickupDate": "2025-10-15T10:00:00Z",│   │
│ │   "returnDate": "2025-10-18T10:00:00Z",│   │
│ │   "pickupLocation": "Airport",         │   │
│ │   "returnLocation": "Airport",         │   │
│ │   "notes": "Test"                      │   │
│ │ }                                       │   │
│ └────────────────────────────────────────┘   │
└────────────────────────────────────────────────┘
```

---

## Success! What You'll See

When it works:
- Status: **201 Created** (in green)
- Response body contains the booking with:
  - Generated `id`
  - `status: 0` (Pending - auto-set by backend)
  - Calculated `totalDays`, `dailyRate`, `totalAmount`
  - Timestamps: `createdAt`, `updatedAt`

---

## Still Getting 400? Check This:

1. **Look at the exact error message** in Postman response
2. **Common mistakes:**
   - Included `status` field (REMOVE IT!)
   - Used dates in wrong format (must be ISO 8601: `YYYY-MM-DDTHH:mm:ssZ`)
   - PickupDate is today or in past (use future dates)
   - Car is not available (check `isAvailable: true`)
   - Wrong customer ID

3. **Test with the exact working example:**
   - Copy the "CORRECT" request from above
   - Paste it exactly as-is
   - Only change the dates to be further in the future if needed

**That's it! The booking should now work in Postman.** 🎉

