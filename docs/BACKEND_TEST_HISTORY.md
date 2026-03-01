# Buzz-Off API Endpoint Tests

## Test Results

### 1. Health Check
**Endpoint:** GET http://localhost:5000/health
**Status:** Testing...

### 2. Request OTP
**Endpoint:** POST http://localhost:5000/api/auth/request-otp
**Payload:**
```json
{
  "phone_number": "+1234567890"
}
```
**Status:** Testing...

### 3. Verify OTP
**Endpoint:** POST http://localhost:5000/api/auth/verify-otp
**Payload:**
```json
{
  "phone_number": "+1234567890",
  "otp": "123456"
}
```
**Status:** Testing...

### 4. Create Hive (Protected)
**Endpoint:** POST http://localhost:5000/api/hives
**Headers:** Authorization: Bearer <token>
**Payload:**
```json
{
  "title": "Test Hive Alpha",
  "farmer_name": "John Doe",
  "field_location": "North Field",
  "status": "ACTIVE",
  "notes": "Test hive for API verification"
}
```
**Status:** Testing...

### 5. List Hives (Protected)
**Endpoint:** GET http://localhost:5000/api/hives
**Headers:** Authorization: Bearer <token>
**Status:** Testing...

### 6. Create Farmer (Protected)
**Endpoint:** POST http://localhost:5000/api/farmers
**Headers:** Authorization: Bearer <token>
**Payload:**
```json
{
  "name": "Jane Smith",
  "location": "California",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "crops": ["almonds", "sunflowers"]
}
```
**Status:** Testing...

### 7. List Farmers (Protected)
**Endpoint:** GET http://localhost:5000/api/farmers
**Headers:** Authorization: Bearer <token>
**Status:** Testing...
