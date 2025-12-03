-- MySQL Database Schema for School Management System
-- Run this script to create all necessary tables

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  encrypted_password VARCHAR(255) NOT NULL,
  email_confirmed_at DATETIME NULL,
  last_login DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_email_confirmed (email_confirmed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- USER PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  role ENUM('admin', 'teacher', 'student') NOT NULL DEFAULT 'student',
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NULL,
  avatar_url TEXT NULL,
  student_id INT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_role (role),
  INDEX idx_student_id (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PASSWORD RESET TOKENS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at),
  INDEX idx_used (used)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CLEANUP EXPIRED TOKENS (Stored Procedure)
-- ============================================
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS cleanup_expired_tokens()
BEGIN
  DELETE FROM password_reset_tokens
  WHERE expires_at < NOW() OR used = TRUE;
END //
DELIMITER ;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
-- Note: Passwords should be hashed using bcrypt before inserting
-- Example password "admin123" hashed: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqBWVHxkd0

-- Insert sample admin user (password: admin123)
-- You need to hash the password first using bcrypt
-- INSERT INTO users (email, encrypted_password, email_confirmed_at) VALUES
-- ('admin@school.com', '$2a$12$HASHED_PASSWORD_HERE', NOW());

-- INSERT INTO user_profiles (user_id, role, first_name, last_name) VALUES
-- (LAST_INSERT_ID(), 'admin', 'Admin', 'User');

-- ============================================
-- USEFUL QUERIES
-- ============================================

-- Find user by email
-- SELECT u.*, up.* FROM users u
-- LEFT JOIN user_profiles up ON u.id = up.user_id
-- WHERE LOWER(u.email) = LOWER('admin@school.com');

-- Check reset token validity
-- SELECT * FROM password_reset_tokens
-- WHERE token = 'your-token-here'
-- AND expires_at > NOW()
-- AND used = FALSE;

-- Clean up expired tokens manually
-- CALL cleanup_expired_tokens();

