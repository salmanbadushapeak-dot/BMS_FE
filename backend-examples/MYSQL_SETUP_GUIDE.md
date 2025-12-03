# MySQL Backend Setup Guide

## Overview

This guide provides complete setup instructions for implementing the Login and Forgot Password APIs using MySQL as your database.

## Prerequisites

- MySQL Server (5.7 or higher, or MySQL 8.0+)
- Node.js (v14+) or Python (3.8+)
- npm or pip package manager

---

## Step 1: Database Setup

### 1.1 Create Database

```sql
CREATE DATABASE school_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE school_management;
```

### 1.2 Run Schema Script

Execute the `mysql-database-schema.sql` file to create all necessary tables:

```bash
mysql -u root -p school_management < mysql-database-schema.sql
```

Or run it directly in MySQL:

```sql
SOURCE mysql-database-schema.sql;
```

### 1.3 Verify Tables

```sql
SHOW TABLES;
-- Should show: users, user_profiles, password_reset_tokens
```

---

## Step 2: Install Dependencies

### Node.js/Express Setup

```bash
npm init -y
npm install express bcryptjs jsonwebtoken express-validator mysql2 nodemailer dotenv
npm install --save-dev nodemon  # Optional: for auto-reload
```

### Python/Flask Setup

```bash
pip install flask flask-bcrypt flask-jwt-extended mysql-connector-python python-dotenv
```

---

## Step 3: Environment Variables

Create a `.env` file in your backend project root:

```env
# Database Configuration
DB_HOST=localhost
DB_NAME=school_management
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_PORT=3306

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@school.com

# Frontend URL (for reset password links)
FRONTEND_URL=http://localhost:3000

# Server Port
PORT=5000
NODE_ENV=development
```

---

## Step 4: Create Sample User

### Using Node.js Script

Create `create-admin-user.js`:

```javascript
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdminUser() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const email = 'admin@school.com';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    // Insert user
    const [result] = await connection.execute(
      'INSERT INTO users (email, encrypted_password, email_confirmed_at) VALUES (?, ?, NOW())',
      [email, hashedPassword]
    );

    const userId = result.insertId;

    // Insert profile
    await connection.execute(
      'INSERT INTO user_profiles (user_id, role, first_name, last_name) VALUES (?, ?, ?, ?)',
      [userId, 'admin', 'Admin', 'User']
    );

    console.log('Admin user created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await connection.end();
  }
}

createAdminUser();
```

Run it:
```bash
node create-admin-user.js
```

### Using Python Script

Create `create_admin_user.py`:

```python
import mysql.connector
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os

load_dotenv()

bcrypt = Bcrypt()

connection = mysql.connector.connect(
    host=os.getenv('DB_HOST'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    database=os.getenv('DB_NAME')
)

cursor = connection.cursor()

email = 'admin@school.com'
password = 'admin123'
hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

try:
    cursor.execute(
        'INSERT INTO users (email, encrypted_password, email_confirmed_at) VALUES (%s, %s, NOW())',
        (email, hashed_password)
    )
    user_id = cursor.lastrowid
    
    cursor.execute(
        'INSERT INTO user_profiles (user_id, role, first_name, last_name) VALUES (%s, %s, %s, %s)',
        (user_id, 'admin', 'Admin', 'User')
    )
    
    connection.commit()
    print('Admin user created successfully!')
    print(f'Email: {email}')
    print(f'Password: {password}')
except Exception as e:
    print(f'Error: {e}')
finally:
    cursor.close()
    connection.close()
```

Run it:
```bash
python create_admin_user.py
```

---

## Step 5: Start Your Backend Server

### Node.js/Express

Create `server.js`:

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Run:
```bash
node server.js
# or with nodemon:
nodemon server.js
```

### Python/Flask

Create `app.py`:

```python
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# Import routes
from routes.auth import auth_bp
app.register_blueprint(auth_bp, url_prefix='/api/auth')

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(debug=True, port=port)
```

Run:
```bash
python app.py
```

---

## Step 6: Test Your APIs

### Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "admin123"
  }'
```

### Test Forgot Password

```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com"
  }'
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

---

## MySQL-Specific Notes

### Differences from PostgreSQL

1. **Auto Increment IDs**: MySQL uses `AUTO_INCREMENT` instead of `SERIAL`
2. **Boolean Type**: MySQL uses `BOOLEAN` or `TINYINT(1)` instead of `BOOLEAN`
3. **Date Functions**: 
   - `NOW()` instead of `NOW()`
   - `DATE_SUB(NOW(), INTERVAL 1 HOUR)` instead of `NOW() - INTERVAL '1 hour'`
4. **Connection**: Use `mysql2` (Node.js) or `mysql-connector-python` (Python)
5. **Query Syntax**: Use `?` placeholders (Node.js) or `%s` (Python) instead of `$1`, `$2`

### Connection Pooling

MySQL connection pooling is important for production:

```javascript
// Node.js
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

---

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check MySQL is running: `sudo service mysql status`
   - Verify credentials in `.env`

2. **Authentication Error**
   - Check user permissions: `GRANT ALL ON school_management.* TO 'your_user'@'localhost';`

3. **Table Not Found**
   - Run the schema script again
   - Check database name matches

4. **Email Not Sending**
   - Verify SMTP credentials
   - Check firewall/port 587
   - For Gmail: Enable "Less secure app access" or use App Password

---

## Production Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use environment-specific database credentials
- [ ] Enable SSL/TLS for MySQL connections
- [ ] Set up proper error logging
- [ ] Implement rate limiting middleware
- [ ] Use connection pooling
- [ ] Set up database backups
- [ ] Configure CORS properly
- [ ] Use HTTPS for API endpoints
- [ ] Set up monitoring and alerts

---

## Support

For issues or questions:
1. Check MySQL error logs
2. Verify all environment variables are set
3. Test database connection separately
4. Review API request/response logs

