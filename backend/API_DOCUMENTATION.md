# Buzz-Off API Documentation

Production-ready REST API for agricultural beekeeping operations with offline-sync capabilities.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your Supabase credentials:
```bash
cp .env.example .env
```

### 3. Create Database Tables
Run the SQL in `src/db/schema.sql` in your Supabase SQL Editor.

### 4. Start Server
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 📡 API Endpoints

### Authentication

#### Request OTP
```http
POST /api/auth/request-otp
Content-Type: application/json

{
  "phone_number": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

#### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "phone_number": "+1234567890",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "phone_number": "+1234567890",
      "is_verified": true
    }
  }
}
```

---

### Hives (All require `Authorization: Bearer <token>`)

#### List Hives
```http
GET /api/hives
Authorization: Bearer <token>
```

#### Get Single Hive
```http
GET /api/hives/:id
Authorization: Bearer <token>
```

#### Create Hive
```http
POST /api/hives
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Hive Alpha",
  "farmer_name": "John Doe",
  "field_location": "North Field",
  "placement_date": "2024-01-15T00:00:00Z",
  "expected_harvest_date": "2024-06-15T00:00:00Z",
  "status": "ACTIVE",
  "notes": "Initial placement"
}
```

#### Update Hive
```http
PATCH /api/hives/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "HARVESTED",
  "notes": "Harvested successfully"
}
```

#### Delete Hive
```http
DELETE /api/hives/:id
Authorization: Bearer <token>
```

#### Bulk Sync Hives
```http
POST /api/hives/sync
Authorization: Bearer <token>
Content-Type: application/json

{
  "hives": [
    {
      "id": "existing-uuid",
      "title": "Updated Hive",
      "status": "ACTIVE",
      "updated_at": "2024-01-20T10:30:00Z"
    },
    {
      "title": "New Hive",
      "status": "ACTIVE",
      "updated_at": "2024-01-20T10:35:00Z"
    }
  ],
  "last_synced_at": "2024-01-19T00:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "synced": [...],
    "conflicts": [
      {
        "id": "uuid",
        "reason": "Server version is newer",
        "server_updated_at": "2024-01-20T11:00:00Z",
        "client_updated_at": "2024-01-20T10:30:00Z"
      }
    ]
  }
}
```

#### Upload Media to Hive
```http
POST /api/hives/:id/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary>
```

---

### Farmers (All require `Authorization: Bearer <token>`)

#### List Farmers
```http
GET /api/farmers
Authorization: Bearer <token>
```

#### Create Farmer
```http
POST /api/farmers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "location": "California",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "crops": ["almonds", "sunflowers"]
}
```

#### Update Farmer
```http
PATCH /api/farmers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "crops": ["almonds", "sunflowers", "lavender"]
}
```

#### Delete Farmer
```http
DELETE /api/farmers/:id
Authorization: Bearer <token>
```

---

## 🔄 Offline Sync Strategy

### Conflict Resolution
- **Strategy:** Last-write-wins
- **Comparison:** `updated_at` timestamps
- **Client Responsibility:** Track `last_synced_at`

### Sync Flow
1. Client sends array of changed hives with `updated_at`
2. Server compares with database `updated_at`
3. If `client.updated_at >= server.updated_at`: Accept update
4. If `client.updated_at < server.updated_at`: Return conflict
5. Client resolves conflicts and retries

---

## 📊 Database Schema

See `src/db/schema.sql` for complete schema with indexes and RLS policies.

### Key Tables
- `users` - Authentication and user data
- `hives` - Hive records with sync timestamps
- `farmers` - Farmer directory
- `feedback` - User feedback
- `traceability` - Event tracking

---

## 🔒 Security

- JWT tokens expire in 7 days (configurable)
- OTP expires in 10 minutes (configurable)
- Row Level Security (RLS) enabled on all tables
- Helmet.js for HTTP headers
- CORS enabled
- Input validation via Zod

---

## 📈 Performance

- Composite indexes on `(user_id, last_synced_at)` for fast sync queries
- GIN indexes on JSONB columns
- Compression middleware enabled
- Connection pooling via Supabase

---

## 🧪 Testing

```bash
# Health check
curl http://localhost:5000/health

# Request OTP
curl -X POST http://localhost:5000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phone_number":"+1234567890"}'
```

---

## 📝 Notes

- OTP is logged to console in development (integrate SMS service for production)
- File uploads stored in Supabase Storage bucket
- All timestamps in ISO 8601 format
- UUIDs generated server-side for new records
