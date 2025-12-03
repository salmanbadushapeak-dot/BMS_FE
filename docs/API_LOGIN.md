# Login API Documentation

## Endpoint: POST `/api/auth/login`

### Request

**URL:** `/api/auth/login`  
**Method:** `POST`  
**Content-Type:** `application/json`

#### Request Body

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

#### Input Fields

| Field Name | Type | Required | Description | Validation |
|------------|------|----------|-------------|------------|
| `email` | string | Yes | User's email address | Must be valid email format |
| `password` | string | Yes | User's password | Minimum 6 characters |

#### Example Request

```json
{
  "email": "admin@school.com",
  "password": "admin123"
}
```

---

### Response

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-string",
      "email": "admin@school.com",
      "role": "admin"
    },
    "profile": {
      "first_name": "Admin",
      "last_name": "User",
      "role": "admin",
      "avatar_url": "https://example.com/avatar.jpg" // optional
    },
    "token": "jwt-token-string" // optional, if using JWT
  }
}
```

#### Error Response (400 Bad Request)

```json
{
  "success": false,
  "error": {
    "message": "Invalid email or password",
    "code": "INVALID_CREDENTIALS"
  }
}
```

#### Error Response (401 Unauthorized)

```json
{
  "success": false,
  "error": {
    "message": "Invalid email or password",
    "code": "UNAUTHORIZED"
  }
}
```

#### Error Response (422 Validation Error)

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "errors": {
      "email": "Email is required",
      "password": "Password must be at least 6 characters"
    }
  }
}
```

---

## Database Schema

### Users Table (auth.users - Supabase)

```sql
CREATE TABLE auth.users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  encrypted_password VARCHAR(255) NOT NULL,
  email_confirmed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### User Profiles Table

```sql
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Validation Rules

1. **Email:**
   - Required
   - Must be valid email format (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
   - Case-insensitive (convert to lowercase)

2. **Password:**
   - Required
   - Minimum 6 characters
   - Should be hashed using bcrypt or similar before storing

---

## Security Considerations

1. **Password Hashing:**
   - Never store plain text passwords
   - Use bcrypt with salt rounds (recommended: 10-12 rounds)

2. **Rate Limiting:**
   - Implement rate limiting (e.g., 5 attempts per 15 minutes per IP)
   - Prevent brute force attacks

3. **JWT Tokens:**
   - If using JWT, set appropriate expiration (e.g., 24 hours)
   - Include user ID and role in token payload
   - Use secure, httpOnly cookies for token storage

4. **CORS:**
   - Configure CORS to allow requests from your frontend domain only

---

## User Roles

The system supports three roles:

- **admin**: Full access to all features
- **teacher**: Educational access, no financial/enrollment management
- **student**: Limited access to own data only

---

## Example Credentials (For Testing)

```json
{
  "admin": {
    "email": "admin@school.com",
    "password": "admin123"
  },
  "teacher": {
    "email": "teacher@school.com",
    "password": "teacher123"
  },
  "student": {
    "email": "student@school.com",
    "password": "student123"
  }
}
```

