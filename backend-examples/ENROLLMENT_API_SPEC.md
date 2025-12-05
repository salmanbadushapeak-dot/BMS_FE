# Enrollment API Specification - MySQL Backend

## Overview

This document provides complete API specifications for Student and Teacher Enrollment with automatic credential generation and email notification.

---

## Features

1. **Student Enrollment** - Enroll new students with automatic account creation
2. **Teacher Enrollment** - Enroll new teachers with automatic account creation
3. **Auto-Generated Credentials** - Username and password automatically generated
4. **Email Notification** - Login credentials sent via email
5. **User Account Creation** - Automatic user account linked to student/teacher profile

---

## API Endpoints

### 1. Enroll Student

**Endpoint:** `POST /api/enrollment/student`

**Request Body:**
```json
{
  "first_name": "Raj",
  "last_name": "Kumar",
  "email": "raj.kumar@example.com",
  "date_of_birth": "2010-05-15",
  "gender": "Male",
  "grade": "10th",
  "contact_number": "9876543210",
  "address": "123 Main Street, Mumbai",
  "enrollment_date": "2024-01-15"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student enrolled successfully. Login credentials have been sent to their email.",
  "data": {
    "student": {
      "id": 1,
      "student_id": "STU000001",
      "first_name": "Raj",
      "last_name": "Kumar",
      "email": "raj.kumar@example.com",
      "date_of_birth": "2010-05-15",
      "gender": "Male",
      "grade": "10th",
      "contact_number": "9876543210",
      "address": "123 Main Street, Mumbai",
      "enrollment_date": "2024-01-15",
      "status": "Active"
    }
  }
}
```

**Email Sent:**
- Subject: "Welcome to School Management System - Your Student Account Credentials"
- Contains: Username (email) and auto-generated password
- Includes login link

---

### 2. Enroll Teacher

**Endpoint:** `POST /api/enrollment/teacher`

**Request Body:**
```json
{
  "first_name": "Dr. Sunita",
  "last_name": "Verma",
  "email": "sunita.verma@school.com",
  "phone": "9876543210",
  "date_of_birth": "1985-03-15",
  "gender": "Female",
  "subject": "Mathematics",
  "qualification": "Ph.D. in Mathematics",
  "experience_years": 12,
  "address": "123 Teacher's Colony, Mumbai",
  "emergency_contact": "9876543299",
  "joining_date": "2024-01-15",
  "salary": 75000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Teacher enrolled successfully. Login credentials have been sent to their email.",
  "data": {
    "teacher": {
      "id": 1,
      "teacher_id": "TCH000001",
      "first_name": "Dr. Sunita",
      "last_name": "Verma",
      "email": "sunita.verma@school.com",
      "phone": "9876543210",
      "date_of_birth": "1985-03-15",
      "gender": "Female",
      "subject": "Mathematics",
      "qualification": "Ph.D. in Mathematics",
      "experience_years": 12,
      "address": "123 Teacher's Colony, Mumbai",
      "emergency_contact": "9876543299",
      "joining_date": "2024-01-15",
      "salary": 75000,
      "status": "Active"
    }
  }
}
```

**Email Sent:**
- Subject: "Welcome to School Management System - Your Teacher Account Credentials"
- Contains: Username (email) and auto-generated password
- Includes login link

---

## Credential Generation

### Username Generation

- **Method**: Uses email prefix (part before @)
- **Fallback**: If email prefix is too long, uses `firstname.lastname` format
- **Example**: 
  - Email: `raj.kumar@example.com` → Username: `raj.kumar`
  - Email: `verylongemailaddress@example.com` → Username: `raj.kumar` (from name)

### Password Generation

- **Length**: 12 characters (default, configurable)
- **Character Set**:
  - Uppercase letters (A-Z)
  - Lowercase letters (a-z)
  - Numbers (0-9)
  - Special characters (!@#$%^&*)
- **Security**: Ensures at least one character from each type
- **Example**: `Kp9#mX2$vLq8`

---

## Database Operations

### Student Enrollment Process

1. **Check Email Uniqueness**
   - Verify email doesn't exist in `students` table
   - Verify email doesn't exist in `users` table

2. **Generate Credentials**
   - Generate username from email/name
   - Generate secure random password
   - Hash password using bcrypt

3. **Create Records**
   - Insert into `students` table
   - Insert into `users` table (with hashed password, role='student')
   - Update `user_profiles` to link user to student

4. **Send Email**
   - Send enrollment email with credentials
   - Email failure doesn't fail the enrollment

### Teacher Enrollment Process

1. **Check Email Uniqueness**
   - Verify email doesn't exist in `teachers` table
   - Verify email doesn't exist in `users` table

2. **Generate Credentials**
   - Generate username from email/name
   - Generate secure random password
   - Hash password using bcrypt

3. **Create Records**
   - Insert into `teachers` table
   - Insert into `users` table (with hashed password, role='teacher')
   - Update `user_profiles` to link user to teacher

4. **Send Email**
   - Send enrollment email with credentials
   - Email failure doesn't fail the enrollment

---

## Email Template

### HTML Email Structure

```html
<div>
  <header>Welcome to School Management System</header>
  <body>
    <p>Hello [Name],</p>
    <p>Your [Role] account has been successfully created.</p>
    <div>
      <p><strong>Username/Email:</strong> [username]</p>
      <p><strong>Password:</strong> [password]</p>
    </div>
    <p><strong>Important:</strong> Please change your password after first login.</p>
    <a href="[Login URL]">Login to Your Account</a>
  </body>
  <footer>Automated email - Do not reply</footer>
</div>
```

---

## Error Responses

### Validation Error (422)

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "errors": [
      {
        "field": "email",
        "message": "Valid email is required"
      }
    ]
  }
}
```

### Email Already Exists (409)

```json
{
  "success": false,
  "error": {
    "message": "Student with this email already exists",
    "code": "EMAIL_EXISTS"
  }
}
```

### User Account Exists (409)

```json
{
  "success": false,
  "error": {
    "message": "User account with this email already exists",
    "code": "USER_EXISTS"
  }
}
```

### Internal Server Error (500)

```json
{
  "success": false,
  "error": {
    "message": "Internal server error",
    "code": "INTERNAL_ERROR"
  }
}
```

---

## Environment Variables

### Database Configuration

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
DB_PORT=3306
```

### Email Configuration (SMTP)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@school.com
```

### Application Configuration

```env
FRONTEND_URL=http://localhost:3000
```

---

## Required Database Tables

### `students` Table

- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `student_id` (VARCHAR, UNIQUE)
- `first_name` (VARCHAR)
- `last_name` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `date_of_birth` (DATE)
- `gender` (VARCHAR)
- `grade` (VARCHAR)
- `contact_number` (VARCHAR)
- `address` (TEXT)
- `enrollment_date` (DATE)
- `status` (VARCHAR)

### `teachers` Table

- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `teacher_id` (VARCHAR, UNIQUE)
- `first_name` (VARCHAR)
- `last_name` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `phone` (VARCHAR)
- `date_of_birth` (DATE)
- `gender` (VARCHAR)
- `subject` (VARCHAR)
- `qualification` (TEXT)
- `experience_years` (INT)
- `address` (TEXT)
- `emergency_contact` (VARCHAR)
- `joining_date` (DATE)
- `salary` (DECIMAL)
- `status` (VARCHAR)

### `users` Table

- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `email` (VARCHAR, UNIQUE)
- `password_hash` (VARCHAR)
- `role` (VARCHAR) - 'student' or 'teacher'
- `status` (VARCHAR) - 'active' or 'inactive'

### `user_profiles` Table

- `user_id` (INT, FOREIGN KEY → users.id)
- `student_id` (INT, FOREIGN KEY → students.id, NULLABLE)
- `teacher_id` (INT, FOREIGN KEY → teachers.id, NULLABLE)

---

## Security Considerations

1. **Password Hashing**: All passwords are hashed using bcrypt before storage
2. **Password in Response**: Passwords are NEVER returned in API responses - only sent via email
3. **Email Validation**: Email addresses are validated and normalized
4. **Transaction Safety**: All database operations use transactions for data consistency
5. **Email Failure Handling**: Email sending failures don't fail the enrollment (logged for monitoring)

---

## Testing

### Test Student Enrollment

```bash
curl -X POST http://localhost:3000/api/enrollment/student \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Raj",
    "last_name": "Kumar",
    "email": "raj.kumar@example.com",
    "date_of_birth": "2010-05-15",
    "gender": "Male",
    "grade": "10th",
    "contact_number": "9876543210",
    "address": "123 Main Street, Mumbai",
    "enrollment_date": "2024-01-15"
  }'
```

### Test Teacher Enrollment

```bash
curl -X POST http://localhost:3000/api/enrollment/teacher \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Dr. Sunita",
    "last_name": "Verma",
    "email": "sunita.verma@school.com",
    "phone": "9876543210",
    "date_of_birth": "1985-03-15",
    "gender": "Female",
    "subject": "Mathematics",
    "qualification": "Ph.D. in Mathematics",
    "experience_years": 12,
    "address": "123 Teacher'\''s Colony, Mumbai",
    "emergency_contact": "9876543299",
    "joining_date": "2024-01-15",
    "salary": 75000
  }'
```

---

## Frontend Integration

The frontend enrollment page (`app/enrollment/page.tsx`) includes:

1. **Tabs Interface**: Separate tabs for Student and Teacher enrollment
2. **Form Validation**: Client-side validation before submission
3. **Loading States**: Visual feedback during enrollment process
4. **Success/Error Handling**: Toast notifications for user feedback
5. **Auto-Generated Credentials**: Credentials are generated server-side and sent via email

---

## Notes

- Email sending is asynchronous and doesn't block the enrollment process
- If email fails, enrollment still succeeds (credentials can be retrieved by admin)
- Password must be changed on first login (implement password change flow)
- Consider implementing email retry mechanism for production
- Monitor email delivery rates and failures

