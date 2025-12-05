# Roles Management API Specification - MySQL Backend

## Overview

This document provides complete API specifications for the Roles & Permissions Management system using MySQL backend.

---

## Database Schema Summary

### Tables Structure

1. **`roles`** - Stores role information
2. **`page_resources`** - Stores available page resources/modules
3. **`permission_types`** - Stores available permission types
4. **`role_permissions`** - Stores actual permissions (many-to-many relationship)

---

## Table: `roles`

### Fields

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique role identifier |
| `name` | VARCHAR(100) | UNIQUE, NOT NULL | Role name (e.g., "Admin", "Teacher", "Student") |
| `description` | TEXT | NULL | Optional description of the role |
| `is_system_role` | BOOLEAN | DEFAULT FALSE | Whether this is a system role (cannot be deleted) |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

### Example Data

```sql
INSERT INTO roles (name, description, is_system_role) VALUES
('Admin', 'Administrator with full system access', TRUE),
('Teacher', 'Teacher with educational access', TRUE),
('Student', 'Student with limited access', TRUE);
```

---

## Table: `page_resources`

### Fields

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique resource identifier |
| `resource_id` | VARCHAR(50) | UNIQUE, NOT NULL | Unique resource identifier (e.g., "dashboard", "students") |
| `resource_name` | VARCHAR(100) | NOT NULL | Display name (e.g., "Dashboard", "Students") |
| `description` | TEXT | NULL | Optional description |
| `display_order` | INT | DEFAULT 0 | Order for display in UI |
| `is_active` | BOOLEAN | DEFAULT TRUE | Whether this resource is active |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

### Default Resources

| resource_id | resource_name | display_order |
|-------------|---------------|---------------|
| dashboard | Dashboard | 1 |
| students | Students | 2 |
| teachers | Teachers | 3 |
| enrollment | Enrollment | 4 |
| attendance | Attendance | 5 |
| fees | Fees | 6 |
| sports | Sports | 7 |
| results | Results | 8 |
| reports | Reports | 9 |
| settings | Settings | 10 |
| profile | Profile | 11 |
| roles | Roles & Permissions | 12 |
| user-management | User Management | 13 |

---

## Table: `permission_types`

### Fields

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique permission type identifier |
| `permission_id` | VARCHAR(50) | UNIQUE, NOT NULL | Unique permission identifier (e.g., "view", "create") |
| `permission_name` | VARCHAR(100) | NOT NULL | Display name (e.g., "View/List", "Add/Create") |
| `description` | TEXT | NULL | Optional description |
| `display_order` | INT | DEFAULT 0 | Order for display in UI |
| `is_active` | BOOLEAN | DEFAULT TRUE | Whether this permission type is active |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

### Default Permission Types

| permission_id | permission_name | display_order |
|---------------|-----------------|---------------|
| view | View/List | 1 |
| create | Add/Create | 2 |
| update | Edit/Update | 3 |
| delete | Delete/Remove | 4 |
| approve | Approve/Publish | 5 |

---

## Table: `role_permissions`

### Fields

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique permission record identifier |
| `role_id` | INT | FOREIGN KEY → roles(id), NOT NULL | Reference to roles table |
| `resource_id` | VARCHAR(50) | FOREIGN KEY → page_resources(resource_id), NOT NULL | Reference to page_resources table |
| `permission_id` | VARCHAR(50) | FOREIGN KEY → permission_types(permission_id), NOT NULL | Reference to permission_types table |
| `is_granted` | BOOLEAN | DEFAULT FALSE | Whether this permission is granted (true) or denied (false) |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

### Unique Constraint

- `UNIQUE (role_id, resource_id, permission_id)` - One permission per role-resource-permission combination

---

## API Endpoints

### 1. Get All Roles

**Endpoint:** `GET /api/roles`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Admin",
      "description": "Administrator with full system access",
      "is_system_role": true,
      "user_count": 2,
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-20T14:30:00Z"
    },
    {
      "id": 2,
      "name": "Teacher",
      "description": "Teacher with educational access",
      "is_system_role": true,
      "user_count": 15,
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-20T14:30:00Z"
    }
  ]
}
```

**SQL Query:**
```sql
SELECT * FROM role_summary ORDER BY name;
```

---

### 2. Get Role Permissions

**Endpoint:** `GET /api/roles/:roleId/permissions`

**Response:**
```json
{
  "success": true,
  "data": {
    "dashboard": {
      "view": true,
      "create": false,
      "update": false,
      "delete": false,
      "approve": false
    },
    "students": {
      "view": true,
      "create": true,
      "update": true,
      "delete": true,
      "approve": false
    },
    "teachers": {
      "view": true,
      "create": false,
      "update": false,
      "delete": false,
      "approve": false
    }
  }
}
```

**SQL Query:**
```sql
CALL get_role_permissions(?);
-- Or use the view:
SELECT 
    resource_id,
    JSON_OBJECT(
        'view', MAX(CASE WHEN permission_id = 'view' THEN is_granted ELSE FALSE END),
        'create', MAX(CASE WHEN permission_id = 'create' THEN is_granted ELSE FALSE END),
        'update', MAX(CASE WHEN permission_id = 'update' THEN is_granted ELSE FALSE END),
        'delete', MAX(CASE WHEN permission_id = 'delete' THEN is_granted ELSE FALSE END),
        'approve', MAX(CASE WHEN permission_id = 'approve' THEN is_granted ELSE FALSE END)
    ) AS permissions
FROM role_permissions_matrix
WHERE role_id = ?
GROUP BY resource_id;
```

---

### 3. Create Role

**Endpoint:** `POST /api/roles`

**Request Body:**
```json
{
  "name": "Custom Role",
  "description": "Custom role description",
  "permissions": {
    "dashboard": {
      "view": true,
      "create": false,
      "update": false,
      "delete": false,
      "approve": false
    },
    "students": {
      "view": true,
      "create": true,
      "update": true,
      "delete": false,
      "approve": false
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 4,
    "name": "Custom Role",
    "description": "Custom role description",
    "is_system_role": false,
    "user_count": 0,
    "created_at": "2024-01-20T15:00:00Z",
    "updated_at": "2024-01-20T15:00:00Z"
  }
}
```

**SQL Queries:**
```sql
-- 1. Insert role
INSERT INTO roles (name, description, is_system_role) 
VALUES (?, ?, FALSE);

-- 2. Insert permissions (loop through permissions object)
INSERT INTO role_permissions (role_id, resource_id, permission_id, is_granted)
VALUES (?, ?, ?, ?)
ON DUPLICATE KEY UPDATE is_granted = VALUES(is_granted);
```

---

### 4. Update Role

**Endpoint:** `PUT /api/roles/:roleId`

**Request Body:**
```json
{
  "name": "Updated Role Name",
  "description": "Updated description",
  "permissions": {
    "dashboard": {
      "view": true,
      "create": true,
      "update": true,
      "delete": false,
      "approve": false
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 4,
    "name": "Updated Role Name",
    "description": "Updated description",
    "is_system_role": false,
    "user_count": 0,
    "updated_at": "2024-01-20T16:00:00Z"
  }
}
```

**SQL Queries:**
```sql
-- 1. Update role
UPDATE roles 
SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ?;

-- 2. Delete existing permissions
DELETE FROM role_permissions WHERE role_id = ?;

-- 3. Insert new permissions (loop through permissions object)
INSERT INTO role_permissions (role_id, resource_id, permission_id, is_granted)
VALUES (?, ?, ?, ?);
```

---

### 5. Delete Role

**Endpoint:** `DELETE /api/roles/:roleId`

**Response:**
```json
{
  "success": true,
  "message": "Role deleted successfully"
}
```

**SQL Query:**
```sql
-- Check if system role
SELECT is_system_role FROM roles WHERE id = ?;

-- If not system role, delete (cascade will delete permissions)
DELETE FROM roles WHERE id = ? AND is_system_role = FALSE;
```

**Error Response (if system role):**
```json
{
  "success": false,
  "error": {
    "message": "Cannot delete system role",
    "code": "SYSTEM_ROLE_PROTECTED"
  }
}
```

---

### 6. Copy Role Permissions (Template)

**Endpoint:** `POST /api/roles/:targetRoleId/copy-permissions`

**Request Body:**
```json
{
  "source_role_id": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Permissions copied successfully"
}
```

**SQL Query:**
```sql
CALL copy_role_permissions(?, ?);
```

---

## Data Structure for Frontend

### Permissions Object Structure

The permissions are stored as a nested object:

```typescript
{
  [resource_id: string]: {
    [permission_id: string]: boolean
  }
}
```

**Example:**
```json
{
  "dashboard": {
    "view": true,
    "create": false,
    "update": false,
    "delete": false,
    "approve": false
  },
  "students": {
    "view": true,
    "create": true,
    "update": true,
    "delete": true,
    "approve": false
  }
}
```

---

## Field Mapping Reference

### Frontend → Backend Mapping

| Frontend Field | Backend Table | Backend Field | Notes |
|----------------|--------------|---------------|-------|
| `role.id` | `roles` | `id` | Primary key |
| `role.name` | `roles` | `name` | Unique role name |
| `role.userCount` | Calculated | `COUNT(user_profiles.user_id)` | From user_profiles table |
| `permissions[resource][permission]` | `role_permissions` | `is_granted` | Boolean value |
| `resource.id` | `page_resources` | `resource_id` | Unique identifier |
| `resource.name` | `page_resources` | `resource_name` | Display name |
| `permission.id` | `permission_types` | `permission_id` | Unique identifier |
| `permission.name` | `permission_types` | `permission_name` | Display name |

---

## Important Notes

1. **System Roles**: Roles with `is_system_role = TRUE` cannot be deleted (e.g., Admin, Teacher, Student)

2. **Cascade Deletes**: When a role is deleted, all associated permissions in `role_permissions` are automatically deleted (CASCADE)

3. **Unique Constraints**: 
   - Role name must be unique
   - Each role-resource-permission combination can only exist once

4. **Default Data**: The schema includes default data for:
   - 3 default roles (Admin, Teacher, Student)
   - 13 page resources
   - 5 permission types

5. **Views**: Two helper views are provided:
   - `role_permissions_matrix`: Easy querying of all role permissions
   - `role_summary`: Role list with user counts

6. **Stored Procedures**: Three stored procedures are provided:
   - `get_role_permissions(role_id)`: Get all permissions for a role
   - `set_role_permissions(role_id, resource_id, permission_id, is_granted)`: Set a single permission
   - `copy_role_permissions(source_role_id, target_role_id)`: Copy permissions from one role to another

---

## Example MySQL Queries

### Get all roles with user count
```sql
SELECT * FROM role_summary ORDER BY name;
```

### Get permissions for role ID 1
```sql
CALL get_role_permissions(1);
```

### Check if Admin role can create students
```sql
SELECT is_granted 
FROM role_permissions 
WHERE role_id = (SELECT id FROM roles WHERE name = 'Admin')
  AND resource_id = 'students' 
  AND permission_id = 'create';
```

### Get permissions in JSON format for API
```sql
SELECT 
    r.id AS role_id,
    r.name AS role_name,
    JSON_OBJECTAGG(
        pr.resource_id,
        JSON_OBJECT(
            'view', MAX(CASE WHEN pt.permission_id = 'view' THEN rp.is_granted ELSE FALSE END),
            'create', MAX(CASE WHEN pt.permission_id = 'create' THEN rp.is_granted ELSE FALSE END),
            'update', MAX(CASE WHEN pt.permission_id = 'update' THEN rp.is_granted ELSE FALSE END),
            'delete', MAX(CASE WHEN pt.permission_id = 'delete' THEN rp.is_granted ELSE FALSE END),
            'approve', MAX(CASE WHEN pt.permission_id = 'approve' THEN rp.is_granted ELSE FALSE END)
        )
    ) AS permissions
FROM roles r
CROSS JOIN page_resources pr
CROSS JOIN permission_types pt
LEFT JOIN role_permissions rp ON rp.role_id = r.id 
    AND rp.resource_id = pr.resource_id 
    AND rp.permission_id = pt.permission_id
WHERE r.id = 1
  AND pr.is_active = TRUE 
  AND pt.is_active = TRUE
GROUP BY r.id, r.name;
```


