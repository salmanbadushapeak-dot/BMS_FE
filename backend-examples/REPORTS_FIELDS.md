# Reports & Analytics - Backend Fields Specification

## Page: `/reports`

**Note:** Reports page is primarily read-only and displays aggregated data from other tables. No direct CRUD operations on reports.

---

## Report Types

### 1. Attendance Reports

**Data Source:** `attendance` table

**Fields Used:**
- `date` - Attendance date
- `status` - Present/Absent/Late
- `student_id` - For student grouping

**Aggregations:**
- Monthly attendance percentage
- Total present/absent/late counts
- Attendance trends over time

---

### 2. Academic Reports

**Data Source:** `exam_results` and `exam_subject_marks` tables

**Fields Used:**
- `percentage` - Student percentage
- `grade` - Student grade
- `subject` - Subject name
- `marks` - Subject marks

**Aggregations:**
- Grade distribution (A+, A, B+, B, C)
- Subject-wise average marks
- Overall academic performance percentage
- Pass rate

---

### 3. Financial Reports

**Data Source:** `fees` table

**Fields Used:**
- `amount_due` - Total amount due
- `amount_paid` - Amount paid
- `due_date` - Payment due date
- `status` - Payment status
- `payment_date` - Payment date

**Aggregations:**
- Monthly fees collection
- Total collected vs pending
- Collection rate percentage
- Outstanding fees

---

### 4. Sports Reports

**Data Source:** `sports` or `sports_participation` table (if exists)

**Fields Used:**
- `sport` - Sport name
- `participants` - Number of participants
- `achievements` - Sports achievements

**Aggregations:**
- Sports participation count
- Participation percentage
- Achievement records

---

## API Endpoints

### 1. GET /api/reports/overview
**Get overall statistics**

**Response:**
```json
{
  "success": true,
  "data": {
    "total_students": 1247,
    "average_attendance": 93.2,
    "fees_collection_rate": 89.5,
    "sports_participation": 67.8,
    "academic_performance": 85.4
  }
}
```

---

### 2. GET /api/reports/attendance
**Get attendance report**

**Query Parameters:**
- `start_date` (optional) - Start date for report
- `end_date` (optional) - End date for report
- `month` (optional) - Specific month (YYYY-MM)

**Response:**
```json
{
  "success": true,
  "data": {
    "monthly_trend": [
      {
        "month": "Jan",
        "attendance": 94.0
      },
      {
        "month": "Feb",
        "attendance": 92.0
      }
    ],
    "current_month": {
      "present": 1156,
      "absent": 67,
      "late": 24,
      "total": 1247,
      "percentage": 92.7
    }
  }
}
```

---

### 3. GET /api/reports/academic
**Get academic performance report**

**Query Parameters:**
- `exam_id` (optional) - Filter by exam
- `grade` (optional) - Filter by grade

**Response:**
```json
{
  "success": true,
  "data": {
    "grade_distribution": [
      {
        "grade": "A+",
        "count": 45
      },
      {
        "grade": "A",
        "count": 78
      }
    ],
    "subject_performance": [
      {
        "subject": "Mathematics",
        "average": 87.5
      },
      {
        "subject": "Science",
        "average": 84.2
      }
    ]
  }
}
```

---

### 4. GET /api/reports/financial
**Get financial report**

**Query Parameters:**
- `start_date` (optional) - Start date for report
- `end_date` (optional) - End date for report
- `month` (optional) - Specific month (YYYY-MM)

**Response:**
```json
{
  "success": true,
  "data": {
    "monthly_collection": [
      {
        "month": "Jan",
        "collected": 450000.00,
        "pending": 50000.00
      }
    ],
    "summary": {
      "total_collection": 2990000.00,
      "pending_amount": 205000.00,
      "collection_rate": 93.6
    }
  }
}
```

---

### 5. GET /api/reports/sports
**Get sports participation report**

**Response:**
```json
{
  "success": true,
  "data": {
    "participation": [
      {
        "sport": "Basketball",
        "participants": 45
      },
      {
        "sport": "Football",
        "participants": 52
      }
    ],
    "achievements": [
      {
        "title": "Inter-school Basketball Championship",
        "position": "1st Place",
        "date": "2024-01-15"
      }
    ],
    "participation_rate": 67.8
  }
}
```

---

### 6. GET /api/reports/export
**Export report as file**

**Query Parameters:**
- `type` (required) - Report type (attendance, academic, financial, sports, all)
- `format` (optional) - File format (pdf, excel, csv) - default: pdf
- `start_date` (optional) - Start date
- `end_date` (optional) - End date

**Response:**
- File download (PDF, Excel, or CSV)

---

## Filter Fields

- Date range filters (start_date, end_date)
- Grade filter
- Exam filter
- Status filters (for attendance, fees)

---

## Additional Notes

- Reports are generated dynamically from existing data
- No separate reports table - all data is aggregated from source tables
- Export functionality generates files on-demand
- Statistics are calculated in real-time
- Reports can be filtered by various criteria

