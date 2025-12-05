# Attendance Management - Backend Fields Specification

## Page: `/attendance`

### Table: `attendance`

| Field Name | Type | Constraints | Description | Required |
|------------|------|-------------|-------------|----------|
| `id` | INT/VARCHAR | PRIMARY KEY, AUTO_INCREMENT | Unique attendance record identifier | Yes |
| `student_id` | INT/VARCHAR | FOREIGN KEY → students(id), NOT NULL | Reference to student | Yes |
| `date` | DATE | NOT NULL | Attendance date | Yes |
| `status` | VARCHAR(20) | ENUM('Present', 'Absent', 'Late') | Attendance status | Yes |
| `time_in` | TIME | NULLABLE | Arrival time (for Present/Late) | No |
| `time_out` | TIME | NULLABLE | Departure time | No |
| `remarks` | TEXT | NULLABLE | Additional notes | No |
| `marked_by` | INT/VARCHAR | FOREIGN KEY → users(id) | Teacher/admin who marked attendance | No |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp | No |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp | No |

**Unique Constraint:** `UNIQUE (student_id, date)` - One attendance record per student per day

---

## Related Table: `students` (for attendance view)

| Field Name | Type | Description |
|------------|------|-------------|
| `student_id` | VARCHAR(50) | Student ID |
| `first_name` | VARCHAR(100) | First name |
| `last_name` | VARCHAR(100) | Last name |
| `grade` | VARCHAR(50) | Grade |
| `section` | VARCHAR(10) | Section (e.g., "A", "B") |
| `roll_no` | VARCHAR(20) | Roll number |

---

## API Endpoints

### 1. GET /api/attendance
**Get attendance by date**

**Query Parameters:**
- `date` (required) - Date in YYYY-MM-DD format
- `grade` (optional) - Filter by grade
- `section` (optional) - Filter by section

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ATT001",
      "student_id": "STU001",
      "date": "2024-01-15",
      "status": "Present",
      "time_in": "08:30:00",
      "time_out": "15:30:00",
      "students": {
        "student_id": "STU001",
        "first_name": "John",
        "last_name": "Doe",
        "grade": "10th",
        "section": "A",
        "roll_no": "101"
      }
    }
  ]
}
```

---

### 2. GET /api/attendance/stats
**Get attendance statistics**

**Query Parameters:**
- `date` (required) - Date in YYYY-MM-DD format

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 6,
    "present": 1,
    "absent": 3,
    "late": 2
  }
}
```

---

### 3. POST /api/attendance
**Mark attendance for a student**

**Request Body:**
```json
{
  "student_id": "STU001",
  "date": "2024-01-15",
  "status": "Present",
  "time_in": "08:30:00",
  "time_out": "15:30:00",
  "remarks": "On time"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ATT001",
    "student_id": "STU001",
    "date": "2024-01-15",
    "status": "Present",
    "time_in": "08:30:00",
    "time_out": "15:30:00"
  }
}
```

---

### 4. PUT /api/attendance/:id
**Update attendance record**

**Request Body:**
```json
{
  "status": "Late",
  "time_in": "09:15:00",
  "remarks": "Traffic delay"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ATT001",
    ...
  }
}
```

---

### 5. POST /api/attendance/bulk
**Mark attendance for multiple students**

**Request Body:**
```json
{
  "date": "2024-01-15",
  "attendance": [
    {
      "student_id": "STU001",
      "status": "Present",
      "time_in": "08:30:00"
    },
    {
      "student_id": "STU002",
      "status": "Absent"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Attendance marked for 2 students",
  "data": {
    "marked": 2,
    "updated": 0
  }
}
```

---

## Search/Filter Fields

- `selectedDate` - Filter by date (required)
- `selectedGrade` - Filter by grade (e.g., "10th", "All Grades")
- `selectedSection` - Filter by section (e.g., "A", "All Sections")
- `searchTerm` - Search by student name or roll number

---

## Additional Notes

- One attendance record per student per day (unique constraint)
- Status values: "Present", "Absent", "Late"
- `time_in` is typically set for "Present" and "Late" statuses
- `time_out` is optional and can be updated later
- Bulk operations allow marking multiple students at once
- Statistics are calculated in real-time based on filtered data

