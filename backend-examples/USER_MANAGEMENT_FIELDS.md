# User Management - Backend Fields Specification

## Page: `/user-management`

### Table: `users`

| Field Name | Type | Constraints | Description | Required |
|------------|------|-------------|-------------|----------|
| `id` | INT/VARCHAR | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier | Yes |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User's email address | Yes |
| `password_hash` | VARCHAR(255) | NOT NULL | Hashed password (bcrypt) | Yes |
| `role` | VARCHAR(20) | ENUM('admin', 'teacher', 'student') | User role | Yes |
| `status` | VARCHAR(20) | ENUM('Active', 'Inactive') | User account status | Yes |
| `email_confirmed` | BOOLEAN | DEFAULT FALSE | Email verification status | No |
| `last_login` | DATETIME | NULLABLE | Last login timestamp | No |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp | No |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp | No |

---

### Table: `user_profiles`

| Field Name | Type | Constraints | Description | Required |
|------------|------|-------------|-------------|----------|
| `user_id` | INT/VARCHAR | FOREIGN KEY → users(id), PRIMARY KEY | Reference to user | Yes |
| `first_name` | VARCHAR(100) | NOT NULL | User's first name | Yes |
| `last_name` | VARCHAR(100) | NOT NULL | User's last name | Yes |
| `phone` | VARCHAR(20) | NULLABLE | Contact phone number | No |
| `student_id` | INT/VARCHAR | FOREIGN KEY → students(id), NULLABLE | Link to student profile | No |
| `teacher_id` | INT/VARCHAR | FOREIGN KEY → teachers(id), NULLABLE | Link to teacher profile | No |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp | No |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp | No |

---

## API Endpoints

### 1. GET /api/users
**Get all users**

**Query Parameters:**
- `role` (optional) - Filter by role (admin, teacher, student)
- `status` (optional) - Filter by status (Active, Inactive)
- `search` (optional) - Search by name, email, or phone

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "email": "admin@school.com",
      "role": "admin",
      "status": "Active",
      "email_confirmed": true,
      "last_login": "2024-01-20T10:30:00Z",
      "first_name": "Admin",
      "last_name": "User",
      "phone": "9876543210"
    }
  ]
}
```

---

### 2. GET /api/users/stats
**Get user statistics**

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "active": 45,
    "inactive": 5,
    "admins": 2,
    "teachers": 15,
    "students": 33,
    "email_confirmed": 48
  }
}
```

---

### 3. POST /api/users
**Create a new user**

**Request Body:**
```json
{
  "email": "newuser@school.com",
  "password": "SecurePassword123!",
  "role": "student",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "51",
    "email": "newuser@school.com",
    "role": "student",
    "status": "Active",
    "email_confirmed": false,
    "first_name": "John",
    "last_name": "Doe",
    "phone": "9876543210"
  }
}
```

---

### 4. PUT /api/users/:id
**Update a user**

**Request Body:**
```json
{
  "email": "updated@school.com",
  "role": "teacher",
  "first_name": "Jane",
  "last_name": "Smith",
  "phone": "9876543211",
  "status": "Active"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    ...
  }
}
```

---

### 5. DELETE /api/users/:id
**Delete a user**

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### 6. PUT /api/users/:id/role
**Change user role**

**Request Body:**
```json
{
  "role": "teacher"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "role": "teacher",
    ...
  }
}
```

---

### 7. PUT /api/users/:id/status
**Toggle user status**

**Request Body:**
```json
{
  "status": "Inactive"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "status": "Inactive",
    ...
  }
}
```

---

## Search/Filter Fields

- `searchTerm` - Search by email, first_name, last_name, or phone
- `roleFilter` - Filter by role (all, admin, teacher, student)
- `statusFilter` - Filter by status (all, Active, Inactive)

---

## Additional Notes

- Password is hashed using bcrypt before storage
- Email must be unique across all users
- Role determines access permissions
- Status "Inactive" prevents login
- `email_confirmed` tracks email verification
- `last_login` is updated on successful login
- User profile links to student/teacher records if applicable
- Password is not returned in GET responses (security)

