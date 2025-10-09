# Postman Customer Creation Guide

## Problem Solved
✅ Fixed "Customer with this email already exists" error in Postman

## Solutions

### Solution 1: Use "Create Customer" with Auto-Generated Unique Email (RECOMMENDED)

The **Create Customer** request now automatically generates a unique email address using a timestamp.

**How it works:**
- Each time you send the request, it creates an email like `customer1728409876543@example.com`
- No manual changes needed!
- The customer ID is automatically saved to environment variables

**Steps:**
1. Open Postman
2. Select **Customers → Create Customer**
3. Click **Send**
4. ✅ Done! A new customer is created with a unique email every time

---

### Solution 2: Use "Get or Create Customer" (For Repeated Testing)

The new **Get or Create Customer** endpoint is perfect when you want to reuse the same test customer.

**How it works:**
- If the email exists, it returns the existing customer (200 OK)
- If the email doesn't exist, it creates a new customer (201 Created)
- Either way, you get a valid customer ID!

**Steps:**
1. Open Postman
2. Select **Customers → Get or Create Customer**
3. Click **Send**
4. ✅ You'll get the customer (whether new or existing)

**Example Request:**
```json
POST http://localhost:5000/api/customers/get-or-create
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+1987654321",
  "address": {
    "street": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90210",
    "country": "USA"
  },
  "dateOfBirth": "1985-05-20T00:00:00Z",
  "driversLicense": "DL987654321"
}
```

---

### Solution 3: Manually Change the Email (Old Way)

If you want to manually specify the email:

1. Open the request body
2. Change the email field to something unique:
   ```json
   "email": "mynewemail123@example.com"
   ```
3. Click **Send**

---

## Understanding the Error

The error message now includes helpful information:

**Old Error Response:**
```
Customer with this email already exists
```

**New Error Response:**
```json
{
  "message": "Customer with this email already exists",
  "existingCustomerId": "68e6b2d07f1934fa11651945",
  "existingCustomerEmail": "john.doe@example.com"
}
```

Now you can see:
- The ID of the existing customer
- The email that's causing the conflict
- You can use that customer ID directly if needed!

---

## Testing Workflow

### Complete Test Flow (Recommended)

1. **Create a Customer:**
   ```
   POST /api/customers
   → Returns customer ID (auto-saved to environment)
   ```

2. **Get All Cars:**
   ```
   GET /api/cars
   → Copy a car ID
   ```

3. **Create a Booking:**
   ```
   POST /api/bookings
   {
     "customerId": "{{customer_id}}",  // Auto-populated!
     "carId": "68e4474c7f1934fa11651936",
     "pickupDate": "2025-12-15T10:00:00Z",
     "returnDate": "2025-12-20T10:00:00Z",
     ...
   }
   ```

---

## Environment Variables

The updated collection automatically sets these variables:

| Variable | Set By | Used By |
|----------|--------|---------|
| `customer_id` | Create Customer, Get or Create Customer | Bookings, Payments |
| `customer_email` | Create Customer, Get or Create Customer | Get Customer by Email |
| `car_id` | (Manual) | Bookings |
| `booking_id` | (Manual) | Payments |

---

## Quick Commands

### Check Existing Customers
```bash
curl http://localhost:5000/api/customers
```

### Get Customer by Email
```bash
curl http://localhost:5000/api/customers/email/jane.smith@example.com
```

### Delete a Customer
```bash
curl -X DELETE http://localhost:5000/api/customers/{customer_id}
```

---

## Tips

1. **Use Collection Variables:** The customer ID is automatically saved after creation
2. **Reuse Test Data:** Use "Get or Create Customer" for consistent test data
3. **Clean Up:** Delete test customers when done to avoid clutter
4. **Check Console:** Postman console shows the created customer details

---

## API Endpoints Summary

| Endpoint | Method | Description | Duplicate Email? |
|----------|--------|-------------|------------------|
| `/api/customers` | POST | Create new customer | ❌ Returns error |
| `/api/customers/get-or-create` | POST | Get or create customer | ✅ Returns existing |
| `/api/customers/email/{email}` | GET | Get customer by email | N/A |
| `/api/customers/{id}` | GET | Get customer by ID | N/A |
| `/api/customers/{id}` | PUT | Update customer | N/A |
| `/api/customers/{id}` | DELETE | Delete customer | N/A |

---

## Need Help?

If you still see errors:
1. ✅ Make sure the backend is running: `./backend/start-dev.sh`
2. ✅ Check the Postman console for detailed error messages
3. ✅ Verify your base_url variable is set to `http://localhost:5000`
4. ✅ Try the "Get or Create Customer" endpoint instead

