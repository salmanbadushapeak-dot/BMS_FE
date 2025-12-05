# Results Management - Backend Fields Specification

## Page: `/results`

### Table: `exams`

| Field Name | Type | Constraints | Description | Required |
|------------|------|-------------|-------------|----------|
| `id` | INT/VARCHAR | PRIMARY KEY, AUTO_INCREMENT | Unique exam identifier | Yes |
| `exam_id` | VARCHAR(50) | UNIQUE | Exam ID (e.g., EXAM001) | Yes |
| `exam_name` | VARCHAR(200) | NOT NULL | Exam name (e.g., "Mid-Term 2024") | Yes |
| `exam_date` | DATE | NOT NULL | Exam date | Yes |
| `status` | VARCHAR(20) | ENUM('Upcoming', 'Ongoing', 'Completed') | Exam status | Yes |
| `description` | TEXT | NULLABLE | Exam description | No |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp | No |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp | No |

---

### Table: `exam_results`

| Field Name | Type | Constraints | Description | Required |
|------------|------|-------------|-------------|----------|
| `id` | INT/VARCHAR | PRIMARY KEY, AUTO_INCREMENT | Unique result identifier | Yes |
| `student_id` | INT/VARCHAR | FOREIGN KEY → students(id), NOT NULL | Reference to student | Yes |
| `exam_id` | INT/VARCHAR | FOREIGN KEY → exams(id), NOT NULL | Reference to exam | Yes |
| `total_marks` | DECIMAL(10,2) | NOT NULL, >= 0 | Total marks obtained | Yes |
| `total_possible` | DECIMAL(10,2) | NOT NULL, > 0 | Maximum possible marks | Yes |
| `percentage` | DECIMAL(5,2) | NOT NULL, 0-100 | Percentage score | Yes |
| `grade` | VARCHAR(10) | NOT NULL | Grade (A+, A, B+, B, C, etc.) | Yes |
| `rank` | INT | NULLABLE | Class rank | No |
| `remarks` | TEXT | NULLABLE | Teacher remarks | No |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp | No |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp | No |

**Unique Constraint:** `UNIQUE (student_id, exam_id)` - One result per student per exam

---

### Table: `exam_subject_marks`

| Field Name | Type | Constraints | Description | Required |
|------------|------|-------------|-------------|----------|
| `id` | INT/VARCHAR | PRIMARY KEY, AUTO_INCREMENT | Unique subject mark identifier | Yes |
| `result_id` | INT/VARCHAR | FOREIGN KEY → exam_results(id), NOT NULL | Reference to exam result | Yes |
| `subject` | VARCHAR(100) | NOT NULL | Subject name | Yes |
| `marks` | DECIMAL(5,2) | NOT NULL, >= 0 | Marks obtained | Yes |
| `total_marks` | DECIMAL(5,2) | NOT NULL, > 0 | Maximum marks for subject | Yes |
| `grade` | VARCHAR(10) | NOT NULL | Subject grade | Yes |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp | No |

**Unique Constraint:** `UNIQUE (result_id, subject)` - One mark per subject per result

---

## API Endpoints

### 1. GET /api/results
**Get exam results**

**Query Parameters:**
- `exam_id` (optional) - Filter by exam
- `student_id` (optional) - Filter by student
- `grade` (optional) - Filter by grade

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "student_id": "STU001",
      "exam_id": "EXAM001",
      "total_marks": 413.00,
      "total_possible": 500.00,
      "percentage": 82.60,
      "grade": "A",
      "rank": 3,
      "student": {
        "id": "STU001",
        "name": "John Doe",
        "grade": "10th",
        "section": "A",
        "roll_no": "101"
      },
      "exam": {
        "id": "EXAM001",
        "exam_name": "Mid-Term 2024",
        "exam_date": "2024-01-15"
      },
      "subjects": [
        {
          "subject": "Mathematics",
          "marks": 85.00,
          "total_marks": 100.00,
          "grade": "A"
        },
        {
          "subject": "Science",
          "marks": 78.00,
          "total_marks": 100.00,
          "grade": "B+"
        }
      ]
    }
  ]
}
```

---

### 2. GET /api/results/stats
**Get result statistics**

**Query Parameters:**
- `exam_id` (required) - Exam ID

**Response:**
```json
{
  "success": true,
  "data": {
    "total_students": 3,
    "avg_percentage": 81.20,
    "pass_rate": 100.00,
    "top_performer": {
      "student_id": "STU002",
      "name": "Sarah Wilson",
      "percentage": 90.00
    }
  }
}
```

---

### 3. POST /api/results
**Add exam result**

**Request Body:**
```json
{
  "student_id": "STU001",
  "exam_id": "EXAM001",
  "subjects": [
    {
      "subject": "Mathematics",
      "marks": 85,
      "total_marks": 100
    },
    {
      "subject": "Science",
      "marks": 78,
      "total_marks": 100
    },
    {
      "subject": "English",
      "marks": 92,
      "total_marks": 100
    }
  ],
  "remarks": "Good performance"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "student_id": "STU001",
    "exam_id": "EXAM001",
    "total_marks": 255.00,
    "total_possible": 300.00,
    "percentage": 85.00,
    "grade": "A"
  }
}
```

---

### 4. PUT /api/results/:id
**Update exam result**

**Request Body:**
```json
{
  "subjects": [
    {
      "subject": "Mathematics",
      "marks": 90,
      "total_marks": 100
    }
  ],
  "remarks": "Updated marks"
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

### 5. GET /api/exams
**Get all exams**

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "EXAM001",
      "exam_name": "Mid-Term 2024",
      "exam_date": "2024-01-15",
      "status": "Completed"
    }
  ]
}
```

---

### 6. POST /api/exams
**Create a new exam**

**Request Body:**
```json
{
  "exam_name": "Final Exam 2024",
  "exam_date": "2024-03-15",
  "status": "Upcoming",
  "description": "End of year final examination"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "EXAM002",
    "exam_name": "Final Exam 2024",
    "exam_date": "2024-03-15",
    "status": "Upcoming"
  }
}
```

---

### 7. GET /api/results/subject-analysis
**Get subject-wise analysis**

**Query Parameters:**
- `exam_id` (required) - Exam ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "subject": "Mathematics",
      "avg_marks": 84.00,
      "highest_marks": 95.00,
      "lowest_marks": 72.00,
      "pass_rate": 100.00
    }
  ]
}
```

---

## Grade Calculation Logic

Typical grade mapping:
- **A+**: 90-100%
- **A**: 80-89%
- **B+**: 70-79%
- **B**: 60-69%
- **C**: 50-59%
- **F**: Below 50%

---

## Search/Filter Fields

- `searchTerm` - Search by student name or roll number
- `selectedGrade` - Filter by grade (e.g., "10", "11", "12")
- `selectedExam` - Filter by exam

---

## Additional Notes

- Percentage is calculated as: `(total_marks / total_possible) * 100`
- Grade is calculated based on percentage
- Rank is calculated by sorting students by percentage (descending)
- Subject marks are stored separately for detailed analysis
- One result per student per exam (unique constraint)

