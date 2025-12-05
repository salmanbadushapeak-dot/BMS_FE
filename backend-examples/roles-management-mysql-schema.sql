-- MySQL Database Schema for Roles & Permissions Management
-- This schema supports the Roles Management page functionality

-- ============================================
-- ROLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL COMMENT 'Role name (e.g., Admin, Teacher, Student)',
  description TEXT NULL COMMENT 'Optional description of the role',
  is_system_role BOOLEAN DEFAULT FALSE COMMENT 'System roles cannot be deleted (e.g., admin)',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_is_system_role (is_system_role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PAGE RESOURCES TABLE
-- ============================================
-- This table stores all available page resources/modules in the system
CREATE TABLE IF NOT EXISTS page_resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resource_id VARCHAR(50) UNIQUE NOT NULL COMMENT 'Unique identifier (e.g., dashboard, students, teachers)',
  resource_name VARCHAR(100) NOT NULL COMMENT 'Display name (e.g., Dashboard, Students, Teachers)',
  description TEXT NULL COMMENT 'Optional description of the resource',
  display_order INT DEFAULT 0 COMMENT 'Order for display in UI',
  is_active BOOLEAN DEFAULT TRUE COMMENT 'Whether this resource is active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_resource_id (resource_id),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PERMISSION TYPES TABLE
-- ============================================
-- This table stores all available permission types
CREATE TABLE IF NOT EXISTS permission_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  permission_id VARCHAR(50) UNIQUE NOT NULL COMMENT 'Unique identifier (e.g., view, create, update, delete, approve)',
  permission_name VARCHAR(100) NOT NULL COMMENT 'Display name (e.g., View/List, Add/Create, Edit/Update)',
  description TEXT NULL COMMENT 'Optional description of the permission',
  display_order INT DEFAULT 0 COMMENT 'Order for display in UI',
  is_active BOOLEAN DEFAULT TRUE COMMENT 'Whether this permission type is active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_permission_id (permission_id),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ROLE PERMISSIONS TABLE
-- ============================================
-- This table stores the actual permissions for each role
-- Each row represents one permission (role + resource + permission_type combination)
CREATE TABLE IF NOT EXISTS role_permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_id INT NOT NULL COMMENT 'Foreign key to roles table',
  resource_id VARCHAR(50) NOT NULL COMMENT 'Foreign key to page_resources.resource_id',
  permission_id VARCHAR(50) NOT NULL COMMENT 'Foreign key to permission_types.permission_id',
  is_granted BOOLEAN DEFAULT FALSE COMMENT 'Whether this permission is granted (true) or denied (false)',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (resource_id) REFERENCES page_resources(resource_id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permission_types(permission_id) ON DELETE CASCADE,
  UNIQUE KEY unique_role_resource_permission (role_id, resource_id, permission_id),
  INDEX idx_role_id (role_id),
  INDEX idx_resource_id (resource_id),
  INDEX idx_permission_id (permission_id),
  INDEX idx_is_granted (is_granted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT DEFAULT PAGE RESOURCES
-- ============================================
INSERT INTO page_resources (resource_id, resource_name, description, display_order) VALUES
('dashboard', 'Dashboard', 'Main dashboard page', 1),
('students', 'Students', 'Student management page', 2),
('teachers', 'Teachers', 'Teacher management page', 3),
('enrollment', 'Enrollment', 'Student enrollment page', 4),
('attendance', 'Attendance', 'Attendance management page', 5),
('fees', 'Fees', 'Fee management page', 6),
('sports', 'Sports', 'Sports management page', 7),
('results', 'Results', 'Results management page', 8),
('reports', 'Reports', 'Reports page', 9),
('settings', 'Settings', 'System settings page', 10),
('profile', 'Profile', 'User profile page', 11),
('roles', 'Roles & Permissions', 'Roles and permissions management page', 12),
('user-management', 'User Management', 'User management page', 13)
ON DUPLICATE KEY UPDATE resource_name = VALUES(resource_name);

-- ============================================
-- INSERT DEFAULT PERMISSION TYPES
-- ============================================
INSERT INTO permission_types (permission_id, permission_name, description, display_order) VALUES
('view', 'View/List', 'Permission to view/list items', 1),
('create', 'Add/Create', 'Permission to add/create new items', 2),
('update', 'Edit/Update', 'Permission to edit/update existing items', 3),
('delete', 'Delete/Remove', 'Permission to delete/remove items', 4),
('approve', 'Approve/Publish', 'Permission to approve or publish items', 5)
ON DUPLICATE KEY UPDATE permission_name = VALUES(permission_name);

-- ============================================
-- INSERT DEFAULT ROLES
-- ============================================
INSERT INTO roles (name, description, is_system_role) VALUES
('Admin', 'Administrator with full system access', TRUE),
('Teacher', 'Teacher with educational access', TRUE),
('Student', 'Student with limited access', TRUE)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ============================================
-- HELPER VIEW: Role Permissions Matrix
-- ============================================
-- This view provides an easy way to query role permissions
CREATE OR REPLACE VIEW role_permissions_matrix AS
SELECT 
    r.id AS role_id,
    r.name AS role_name,
    pr.resource_id,
    pr.resource_name,
    pt.permission_id,
    pt.permission_name,
    COALESCE(rp.is_granted, FALSE) AS is_granted
FROM roles r
CROSS JOIN page_resources pr
CROSS JOIN permission_types pt
LEFT JOIN role_permissions rp ON rp.role_id = r.id 
    AND rp.resource_id = pr.resource_id 
    AND rp.permission_id = pt.permission_id
WHERE pr.is_active = TRUE AND pt.is_active = TRUE
ORDER BY r.name, pr.display_order, pt.display_order;

-- ============================================
-- HELPER VIEW: Role Summary
-- ============================================
-- This view provides role summary with user count
CREATE OR REPLACE VIEW role_summary AS
SELECT 
    r.id,
    r.name,
    r.description,
    r.is_system_role,
    COUNT(DISTINCT up.user_id) AS user_count,
    r.created_at,
    r.updated_at
FROM roles r
LEFT JOIN user_profiles up ON up.role = LOWER(r.name)
GROUP BY r.id, r.name, r.description, r.is_system_role, r.created_at, r.updated_at;

-- ============================================
-- STORED PROCEDURE: Get Role Permissions
-- ============================================
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS get_role_permissions(IN p_role_id INT)
BEGIN
    SELECT 
        pr.resource_id,
        pr.resource_name,
        pt.permission_id,
        pt.permission_name,
        COALESCE(rp.is_granted, FALSE) AS is_granted
    FROM page_resources pr
    CROSS JOIN permission_types pt
    LEFT JOIN role_permissions rp ON rp.role_id = p_role_id 
        AND rp.resource_id = pr.resource_id 
        AND rp.permission_id = pt.permission_id
    WHERE pr.is_active = TRUE AND pt.is_active = TRUE
    ORDER BY pr.display_order, pt.display_order;
END //
DELIMITER ;

-- ============================================
-- STORED PROCEDURE: Set Role Permissions
-- ============================================
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS set_role_permissions(
    IN p_role_id INT,
    IN p_resource_id VARCHAR(50),
    IN p_permission_id VARCHAR(50),
    IN p_is_granted BOOLEAN
)
BEGIN
    INSERT INTO role_permissions (role_id, resource_id, permission_id, is_granted)
    VALUES (p_role_id, p_resource_id, p_permission_id, p_is_granted)
    ON DUPLICATE KEY UPDATE 
        is_granted = p_is_granted,
        updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- ============================================
-- STORED PROCEDURE: Copy Role Permissions (Template)
-- ============================================
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS copy_role_permissions(
    IN p_source_role_id INT,
    IN p_target_role_id INT
)
BEGIN
    INSERT INTO role_permissions (role_id, resource_id, permission_id, is_granted)
    SELECT 
        p_target_role_id,
        resource_id,
        permission_id,
        is_granted
    FROM role_permissions
    WHERE role_id = p_source_role_id
    ON DUPLICATE KEY UPDATE 
        is_granted = VALUES(is_granted),
        updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- ============================================
-- USEFUL QUERIES
-- ============================================

-- Get all roles with user count
-- SELECT * FROM role_summary;

-- Get permissions for a specific role
-- CALL get_role_permissions(1);

-- Get permissions in JSON format for a role (for API response)
-- SELECT 
--     resource_id,
--     JSON_OBJECT(
--         'view', MAX(CASE WHEN permission_id = 'view' THEN is_granted ELSE FALSE END),
--         'create', MAX(CASE WHEN permission_id = 'create' THEN is_granted ELSE FALSE END),
--         'update', MAX(CASE WHEN permission_id = 'update' THEN is_granted ELSE FALSE END),
--         'delete', MAX(CASE WHEN permission_id = 'delete' THEN is_granted ELSE FALSE END),
--         'approve', MAX(CASE WHEN permission_id = 'approve' THEN is_granted ELSE FALSE END)
--     ) AS permissions
-- FROM role_permissions_matrix
-- WHERE role_id = 1
-- GROUP BY resource_id;

-- Check if a role has a specific permission
-- SELECT is_granted 
-- FROM role_permissions 
-- WHERE role_id = 1 
--   AND resource_id = 'students' 
--   AND permission_id = 'create';


