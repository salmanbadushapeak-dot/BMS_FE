# Teachers Management - Backend Fields Specification

## Page: `/teachers`

### Table: `teachers`

| Field Name | Type | Constraints | Description | Required |
|------------|------|-------------|-------------|----------|
| `id` | INT/VARCHAR | PRIMARY KEY, AUTO_INCREMENT | Unique teacher identifier | Yes |
| `teacher_id` | VARCHAR(50) | UNIQUE | Teacher ID (e.g., TCH001) | Yes |
| `first_name` | VARCHAR(100) | NOT NULL | Teacher's first name | Yes |
| `last_name` | VARCHAR(100) | NOT NULL | Teacher's last name | Yes |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Teacher's email address | Yes |
| `phone` | VARCHAR(20) | NOT NULL | Contact phone number | Yes |
| `date_of_birth` | DATE | NOT NULL | Teacher's date of birth | Yes |
| `gender` | VARCHAR(20) | ENUM('Male', 'Female', 'Other') | Teacher's gender | Yes |
| `subject` | VARCHAR(100) | NOT NULL | Subject taught (e.g., "Mathematics") | Yes |
| `qualification` | TEXT | NOT NULL | Educational qualifications | Yes |
| `experience_years` | INT | NOT NULL, >= 0 | Years of teaching experience | Yes |
| `address` | TEXT | NOT NULL | Residential address | Yes |
| `emergency_contact` | VARCHAR(20) | NOT NULL | Emergency contact number | Yes |
| `joining_date` | DATE | NOT NULL | Date of joining | Yes |
| `salary` | DECIMAL(10,2) | NOT NULL, >= 0 | Monthly salary | Yes |
| `status` | VARCHAR(20) | ENUM('Active', 'Inactive') | Teacher status | Yes |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp | No |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp | No |

---

## API Endpoints

### 1. GET /api/teachers
**Get all teachers**

**Query Parameters:**
- `subject` (optional) - Filter by subject
- `status` (optional) - Filter by status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "teacher_id": "TCH001",
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
      "joining_date": "2012-06-01",
      "salary": 75000.00,
      "status": "Active"
    }
  ]
}
```

---

### 2. GET /api/teachers/stats
**Get teacher statistics**

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 8,
    "active": 8,
    "subjects": 7
  }
}
```

---

### 3. POST /api/teachers
**Create a new teacher**

**Request Body:**
```json
{
  "teacher_id": "TCH001",
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
  "joining_date": "2012-06-01",
  "salary": 75000.00,
  "status": "Active"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "teacher_id": "TCH001",
    ...
  }
}
```

---

### 4. PUT /api/teachers/:id
**Update a teacher**

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

### 5. DELETE /api/teachers/:id
**Delete a teacher**

**Response:**
```json
{
  "success": true,
  "message": "Teacher deleted successfully"
}
```

---

## Search/Filter Fields

- `searchTerm` - Search by first_name, last_name, teacher_id, email, or subject
- `selectedSubject` - Filter by subject (dropdown filter)

---

## Additional Notes

- `teacher_id` should be auto-generated (e.g., TCH001, TCH002)
- Email must be unique across all teachers
- Status defaults to "Active" for new teachers
- Joining date defaults to current date if not provided
- Salary is stored as DECIMAL to handle currency precision

