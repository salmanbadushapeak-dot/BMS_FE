# Backend API Requirements for Login

## Summary

The login page sends a POST request with two fields:
- **email** (string, required)
- **password** (string, required)

## Quick Reference

### Request Format
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@school.com",
  "password": "admin123"
}
```

### Success Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@school.com",
      "role": "admin"
    },
    "profile": {
      "first_name": "Admin",
      "last_name": "User",
      "role": "admin",
      "avatar_url": null
    },
    "token": "jwt-token" // optional
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Invalid email or password",
    "code": "INVALID_CREDENTIALS"
  }
}
```

## Required Dependencies

### Node.js/Express
```bash
npm install express bcryptjs jsonwebtoken express-validator pg
```

### Python/Flask
```bash
pip install flask flask-bcrypt flask-jwt-extended psycopg2-binary python-dotenv
```

## Environment Variables Needed

```env
# Database
DB_HOST=localhost
DB_NAME=school_management
DB_USER=postgres
DB_PASSWORD=your_password
DB_PORT=5432

# JWT (if using)
JWT_SECRET=your-secret-key-here

# Server
PORT=5000
NODE_ENV=production
```

## Database Tables Required

1. **auth.users** - User authentication
2. **user_profiles** - User profile and role information

See `docs/API_LOGIN.md` for full schema details.

## Next Steps

1. Choose your backend framework (Node.js/Express or Python/Flask)
2. Set up database connection
3. Implement the login endpoint using the examples provided
4. Test with the provided credentials
5. Deploy and update your frontend API URL

