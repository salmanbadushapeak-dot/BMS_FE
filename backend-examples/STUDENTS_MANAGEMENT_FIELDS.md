# Students Management - Backend Fields Specification

## Page: `/students`

### Table: `students`

| Field Name | Type | Constraints | Description | Required |
|------------|------|-------------|-------------|----------|
| `id` | INT/VARCHAR | PRIMARY KEY, AUTO_INCREMENT | Unique student identifier | Yes |
| `student_id` | VARCHAR(50) | UNIQUE | Student ID (e.g., STU001) | Yes |
| `first_name` | VARCHAR(100) | NOT NULL | Student's first name | Yes |
| `last_name` | VARCHAR(100) | NOT NULL | Student's last name | Yes |
| `date_of_birth` | DATE | NOT NULL | Student's date of birth | Yes |
| `gender` | VARCHAR(20) | ENUM('Male', 'Female', 'Other') | Student's gender | Yes |
| `grade` | VARCHAR(50) | NOT NULL | Current grade (e.g., "10th", "11th") | Yes |
| `contact_number` | VARCHAR(20) | NOT NULL | Contact phone number | Yes |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Student's email address | Yes |
| `address` | TEXT | NOT NULL | Student's residential address | Yes |
| `enrollment_date` | DATE | NOT NULL | Date of enrollment | Yes |
| `status` | VARCHAR(20) | ENUM('Active', 'Inactive', 'Graduated') | Student status | Yes |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp | No |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp | No |

---

## API Endpoints

### 1. GET /api/students
**Get all students**

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "student_id": "STU001",
      "first_name": "Raj",
      "last_name": "Kumar",
      "date_of_birth": "2010-05-15",
      "gender": "Male",
      "grade": "10th",
      "contact_number": "9876543210",
      "email": "raj.kumar@example.com",
      "address": "123 Main Street, Mumbai",
      "enrollment_date": "2023-04-01",
      "status": "Active"
    }
  ]
}
```

---

### 2. POST /api/students
**Create a new student**

**Request Body:**
```json
{
  "first_name": "Raj",
  "last_name": "Kumar",
  "date_of_birth": "2010-05-15",
  "gender": "Male",
  "grade": "10th",
  "contact_number": "9876543210",
  "email": "raj.kumar@example.com",
  "address": "123 Main Street, Mumbai",
  "enrollment_date": "2023-04-01",
  "status": "Active"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "student_id": "STU001",
    "first_name": "Raj",
    "last_name": "Kumar",
    ...
  }
}
```

---

### 3. PUT /api/students/:id
**Update a student**

**Request Body:** (Same as POST, all fields optional except id)

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

### 4. DELETE /api/students/:id
**Delete a student**

**Response:**
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

---

## Search/Filter Fields

- `searchTerm` - Search by first_name, last_name, or grade
- No additional filters in current implementation

---

## Additional Notes

- `student_id` should be auto-generated (e.g., STU001, STU002)
- Email must be unique across all students
- Status defaults to "Active" for new enrollments
- Enrollment date defaults to current date if not provided

