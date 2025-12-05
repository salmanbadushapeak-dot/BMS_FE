# Fees Management - Backend Fields Specification

## Page: `/fees`

### Table: `fees`

| Field Name | Type | Constraints | Description | Required |
|------------|------|-------------|-------------|----------|
| `id` | INT/VARCHAR | PRIMARY KEY, AUTO_INCREMENT | Unique fee record identifier | Yes |
| `student_id` | INT/VARCHAR | FOREIGN KEY → students(id), NOT NULL | Reference to student | Yes |
| `amount_due` | DECIMAL(10,2) | NOT NULL, >= 0 | Total amount due | Yes |
| `amount_paid` | DECIMAL(10,2) | NOT NULL, >= 0 | Amount paid so far | Yes |
| `due_date` | DATE | NOT NULL | Payment due date | Yes |
| `status` | VARCHAR(20) | ENUM('Pending', 'Partial', 'Paid', 'Overdue') | Payment status | Yes |
| `payment_date` | DATE | NULLABLE | Date of payment (if paid) | No |
| `payment_method` | VARCHAR(50) | NULLABLE | Payment method (Cash, Card, Online, etc.) | No |
| `transaction_id` | VARCHAR(100) | NULLABLE | Payment transaction ID | No |
| `remarks` | TEXT | NULLABLE | Additional notes | No |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp | No |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp | No |

---

## Related Table: `students` (for fees view)

| Field Name | Type | Description |
|------------|------|-------------|
| `id` | INT/VARCHAR | Student ID |
| `first_name` | VARCHAR(100) | First name |
| `last_name` | VARCHAR(100) | Last name |

---

## API Endpoints

### 1. GET /api/fees
**Get all fee records**

**Query Parameters:**
- `student_id` (optional) - Filter by student
- `status` (optional) - Filter by status
- `due_date_from` (optional) - Filter by due date range (start)
- `due_date_to` (optional) - Filter by due date range (end)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "student_id": "STU001",
      "amount_due": 50000.00,
      "amount_paid": 50000.00,
      "due_date": "2024-01-31",
      "status": "Paid",
      "payment_date": "2024-01-15",
      "payment_method": "Online",
      "transaction_id": "TXN123456",
      "student_name": "Raj Kumar"
    }
  ]
}
```

---

### 2. GET /api/fees/stats
**Get fee statistics**

**Response:**
```json
{
  "success": true,
  "data": {
    "total_amount_due": 500000.00,
    "total_amount_paid": 450000.00,
    "total_pending": 50000.00,
    "paid_students": 8,
    "pending_students": 2
  }
}
```

---

### 3. POST /api/fees
**Create a new fee record**

**Request Body:**
```json
{
  "student_id": "STU001",
  "amount_due": 50000.00,
  "amount_paid": 0.00,
  "due_date": "2024-01-31",
  "status": "Pending",
  "payment_date": null,
  "payment_method": null,
  "transaction_id": null,
  "remarks": "Tuition fee for January 2024"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "student_id": "STU001",
    "amount_due": 50000.00,
    "amount_paid": 0.00,
    "due_date": "2024-01-31",
    "status": "Pending"
  }
}
```

---

### 4. PUT /api/fees/:id
**Update a fee record**

**Request Body:**
```json
{
  "amount_paid": 25000.00,
  "status": "Partial",
  "payment_date": "2024-01-20",
  "payment_method": "Cash",
  "remarks": "Partial payment received"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "amount_due": 50000.00,
    "amount_paid": 25000.00,
    "status": "Partial",
    ...
  }
}
```

---

### 5. DELETE /api/fees/:id
**Delete a fee record**

**Response:**
```json
{
  "success": true,
  "message": "Fee record deleted successfully"
}
```

---

## Status Calculation Logic

- **Pending**: `amount_paid = 0` and `due_date >= today`
- **Partial**: `0 < amount_paid < amount_due`
- **Paid**: `amount_paid >= amount_due`
- **Overdue**: `amount_paid < amount_due` and `due_date < today`

---

## Search/Filter Fields

- `searchTerm` - Search by student name or status
- No additional filters in current implementation

---

## Additional Notes

- `amount_due` and `amount_paid` are stored as DECIMAL for currency precision
- Status can be auto-calculated based on amounts and due date
- Multiple fee records can exist per student (e.g., monthly fees)
- Payment date is set when payment is received
- Transaction ID is useful for online payments

