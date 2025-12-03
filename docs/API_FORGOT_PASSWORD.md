# Forgot Password API Documentation

## Endpoint: POST `/api/auth/forgot-password`

### Request

**URL:** `/api/auth/forgot-password`  
**Method:** `POST`  
**Content-Type:** `application/json`

#### Request Body

```json
{
  "email": "string (required)"
}
```

#### Input Fields

| Field Name | Type | Required | Description | Validation |
|------------|------|----------|-------------|------------|
| `email` | string | Yes | User's email address | Must be valid email format and exist in database |

#### Example Request

```json
{
  "email": "admin@school.com"
}
```

---

### Response

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Password reset link has been sent to your email address",
  "data": {
    "reset_token": "token-string", // Optional: if you want to return token for testing
    "expires_in": 3600 // Token expiration in seconds (1 hour)
  }
}
```

**Note:** Even if the email doesn't exist, return success to prevent email enumeration attacks.

#### Error Response (422 Validation Error)

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "errors": {
      "email": "Please provide a valid email address"
    }
  }
}
```

#### Error Response (429 Too Many Requests)

```json
{
  "success": false,
  "error": {
    "message": "Too many reset requests. Please try again later",
    "code": "RATE_LIMIT_EXCEEDED",
    "retry_after": 900 // seconds
  }
}
```

---

## Endpoint: POST `/api/auth/reset-password`

### Request

**URL:** `/api/auth/reset-password`  
**Method:** `POST`  
**Content-Type:** `application/json`

#### Request Body

```json
{
  "token": "string (required)",
  "password": "string (required)",
  "confirm_password": "string (required)"
}
```

#### Input Fields

| Field Name | Type | Required | Description | Validation |
|------------|------|----------|-------------|------------|
| `token` | string | Yes | Password reset token from email link | Must be valid and not expired |
| `password` | string | Yes | New password | Minimum 6 characters |
| `confirm_password` | string | Yes | Confirm new password | Must match password |

#### Example Request

```json
{
  "token": "reset-token-from-email",
  "password": "newpassword123",
  "confirm_password": "newpassword123"
}
```

---

### Response

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

#### Error Response (400 Bad Request)

```json
{
  "success": false,
  "error": {
    "message": "Invalid or expired reset token",
    "code": "INVALID_TOKEN"
  }
}
```

#### Error Response (422 Validation Error)

```json
{
  "success": false,
  "error": "Passwords do not match",
    "code": "VALIDATION_ERROR",
    "errors": {
      "password": "Password must be at least 6 characters",
      "confirm_password": "Passwords do not match"
    }
  }
}
```

---

## Database Schema

### Password Reset Tokens Table

```sql
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Clean up expired tokens (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM password_reset_tokens
  WHERE expires_at < NOW() OR used = TRUE;
END;
$$ LANGUAGE plpgsql;
```

---

## Validation Rules

### Forgot Password Request

1. **Email:**
   - Required
   - Must be valid email format (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
   - Case-insensitive (convert to lowercase)
   - **Security:** Always return success even if email doesn't exist (prevents email enumeration)

### Reset Password Request

1. **Token:**
   - Required
   - Must exist in database
   - Must not be expired
   - Must not be already used

2. **Password:**
   - Required
   - Minimum 6 characters
   - Should contain at least one letter and one number (recommended)

3. **Confirm Password:**
   - Required
   - Must match password exactly

---

## Security Considerations

1. **Rate Limiting:**
   - Limit forgot password requests to 3 per hour per email
   - Limit reset attempts to 5 per hour per IP
   - Prevent brute force attacks

2. **Token Security:**
   - Generate cryptographically secure random tokens (32+ characters)
   - Set token expiration (recommended: 1 hour)
   - Mark tokens as used after successful reset
   - One-time use only

3. **Email Security:**
   - Never reveal if an email exists in the system
   - Always return success message for forgot password requests
   - Include expiration time in email
   - Use HTTPS links only

4. **Password Requirements:**
   - Enforce minimum length (6+ characters)
   - Consider requiring uppercase, lowercase, numbers (optional)
   - Hash new password before storing

---

## Email Template Example

### Forgot Password Email

```
Subject: Reset Your Password - School Management System

Hello,

You requested to reset your password for your School Management System account.

Click the link below to reset your password:
https://yourschool.com/reset-password?token=RESET_TOKEN_HERE

This link will expire in 1 hour.

If you didn't request this, please ignore this email or contact support.

Best regards,
School Management System Team
```

### Reset Password Success Email

```
Subject: Password Reset Successful

Hello,

Your password has been successfully reset.

If you didn't make this change, please contact support immediately.

Best regards,
School Management System Team
```

---

## Implementation Flow

1. **User requests password reset:**
   - User enters email in forgot password form
   - Backend validates email
   - Backend checks if user exists (but doesn't reveal result)
   - Backend generates secure token
   - Backend stores token in database with expiration
   - Backend sends email with reset link
   - Backend returns success message

2. **User clicks reset link:**
   - Frontend extracts token from URL
   - Frontend shows reset password form

3. **User submits new password:**
   - Frontend sends token + new password to backend
   - Backend validates token (exists, not expired, not used)
   - Backend validates password requirements
   - Backend hashes new password
   - Backend updates user password
   - Backend marks token as used
   - Backend sends confirmation email
   - Backend returns success message

---

## Testing

### Test Cases

1. **Valid Email:**
   - Request: `POST /api/auth/forgot-password` with valid email
   - Expected: Success response, email sent

2. **Invalid Email Format:**
   - Request: `POST /api/auth/forgot-password` with invalid email
   - Expected: Validation error

3. **Non-existent Email:**
   - Request: `POST /api/auth/forgot-password` with non-existent email
   - Expected: Success response (security: don't reveal email doesn't exist)

4. **Valid Reset Token:**
   - Request: `POST /api/auth/reset-password` with valid token
   - Expected: Password reset successfully

5. **Expired Token:**
   - Request: `POST /api/auth/reset-password` with expired token
   - Expected: Invalid token error

6. **Used Token:**
   - Request: `POST /api/auth/reset-password` with already used token
   - Expected: Invalid token error

7. **Password Mismatch:**
   - Request: `POST /api/auth/reset-password` with mismatched passwords
   - Expected: Validation error

