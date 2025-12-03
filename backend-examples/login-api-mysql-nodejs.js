/**
 * Login API Example - Node.js/Express with MySQL
 * 
 * This is a MySQL-specific backend API implementation for the login endpoint
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const mysql = require('mysql2/promise');
const router = express.Router();

// MySQL Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'school_management',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * POST /api/auth/login
 * 
 * Request Body:
 * {
 *   "email": "admin@school.com",
 *   "password": "admin123"
 * }
 */
router.post('/login', [
  // Validation middleware
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          errors: errors.array().reduce((acc, err) => {
            acc[err.param] = err.msg;
            return acc;
          }, {})
        }
      });
    }

    const { email, password } = req.body;

    // Rate limiting check (implement your rate limiting logic here)
    // Example: Check if IP has exceeded login attempts

    // Find user by email
    const [users] = await pool.execute(
      `SELECT 
        u.id,
        u.email,
        u.encrypted_password,
        u.email_confirmed_at,
        up.role,
        up.first_name,
        up.last_name,
        up.avatar_url
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE LOWER(u.email) = LOWER(?)`,
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        }
      });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.encrypted_password);
    
    if (!isPasswordValid) {
      // Log failed login attempt for security
      // await logFailedLoginAttempt(req.ip, email);
      
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        }
      });
    }

    // Check if email is confirmed (if required)
    // if (!user.email_confirmed_at) {
    //   return res.status(403).json({
    //     success: false,
    //     error: {
    //       message: 'Please verify your email address',
    //       code: 'EMAIL_NOT_VERIFIED'
    //     }
    //   });
    // }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role || 'student'
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h' // Token expires in 24 hours
      }
    );

    // Update last login timestamp (optional)
    await pool.execute(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    // Return success response
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role || 'student'
        },
        profile: {
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          role: user.role || 'student',
          avatar_url: user.avatar_url || null
        },
        token: token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

/**
 * Helper function to hash password (for user registration)
 */
async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Example: User Registration Endpoint
 */
router.post('/register', [
  body('email').isEmail().normalizeEmail().toLowerCase(),
  body('password').isLength({ min: 6 }),
  body('first_name').notEmpty(),
  body('last_name').notEmpty(),
  body('role').isIn(['admin', 'teacher', 'student']),
], async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          errors: errors.array()
        }
      });
    }

    const { email, password, first_name, last_name, role } = req.body;

    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE LOWER(email) = LOWER(?)',
      [email]
    );

    if (existingUsers.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        error: {
          message: 'User with this email already exists',
          code: 'USER_EXISTS'
        }
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert into users table
    const [userResult] = await connection.execute(
      `INSERT INTO users (email, encrypted_password, email_confirmed_at, created_at)
       VALUES (?, ?, NOW(), NOW())`,
      [email, hashedPassword]
    );

    const userId = userResult.insertId;

    // Insert into user_profiles
    await connection.execute(
      `INSERT INTO user_profiles (user_id, role, first_name, last_name, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [userId, role, first_name, last_name]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      data: {
        message: 'User registered successfully',
        user: {
          id: userId,
          email: email
        }
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR'
      }
    });
  } finally {
    connection.release();
  }
});

module.exports = router;

