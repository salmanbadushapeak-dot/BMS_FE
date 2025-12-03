# Forgot Password API Requirements

## Summary

The forgot password functionality requires two API endpoints:

1. **Forgot Password** - Request password reset
2. **Reset Password** - Set new password using token

## Quick Reference

### 1. Forgot Password Request

```json
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "admin@school.com"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "If an account with that email exists, a password reset link has been sent.",
  "data": {
    "expires_in": 3600
  }
}
```

### 2. Reset Password Request

```json
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "password": "newpassword123",
  "confirm_password": "newpassword123"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

## Required Dependencies

### Node.js/Express
```bash
npm install express bcryptjs crypto nodemailer express-validator pg
```

### Python/Flask
```bash
pip install flask flask-bcrypt psycopg2-binary python-dotenv
```

## Environment Variables Needed

```env
# Database
DB_HOST=localhost
DB_NAME=school_management
DB_USER=postgres
DB_PASSWORD=your_password
DB_PORT=5432

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@school.com

# Frontend URL (for reset links)
FRONTEND_URL=http://localhost:3000
```

## Database Table Required

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

CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);
```

## Security Features

1. **Rate Limiting:** Max 3 requests per hour per email
2. **Token Expiration:** 1 hour validity
3. **One-time Use:** Tokens are marked as used after reset
4. **Email Enumeration Prevention:** Always return success (don't reveal if email exists)
5. **Secure Token Generation:** Cryptographically secure random tokens

## Email Configuration

### Gmail Setup
1. Enable 2-factor authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use App Password in `SMTP_PASSWORD`

### Other SMTP Providers
- **SendGrid:** Use their SMTP settings
- **Mailgun:** Use their SMTP settings
- **AWS SES:** Use their SMTP settings

## Frontend Integration

The frontend forgot password dialog sends:
- `email` field to `/api/auth/forgot-password`

The frontend reset password form (on `/reset-password` page) should:
1. Extract `token` from URL query parameter
2. Send `token`, `password`, `confirm_password` to `/api/auth/reset-password`

## Testing

### Test Forgot Password
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@school.com"}'
```

### Test Reset Password
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "token-from-email",
    "password": "newpassword123",
    "confirm_password": "newpassword123"
  }'
```

## Next Steps

1. Set up email service (Gmail, SendGrid, etc.)
2. Create database table for reset tokens
3. Implement the API endpoints using the examples
4. Configure environment variables
5. Test the flow end-to-end
6. Update frontend to handle reset password page

