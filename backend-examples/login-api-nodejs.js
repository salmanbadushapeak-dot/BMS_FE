/**
 * Login API Example - Node.js/Express
 * 
 * This is an example backend API implementation for the login endpoint
 * You can adapt this to your preferred backend framework (Express, Fastify, etc.)
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Database connection (example using PostgreSQL with pg library)
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
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
    const userQuery = `
      SELECT 
        u.id,
        u.email,
        u.encrypted_password,
        up.role,
        up.first_name,
        up.last_name,
        up.avatar_url
      FROM auth.users u
      LEFT JOIN user_profiles up ON u.id = up.id
      WHERE LOWER(u.email) = LOWER($1)
    `;
    
    const userResult = await pool.query(userQuery, [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        }
      });
    }

    const user = userResult.rows[0];

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
    // await pool.query('UPDATE auth.users SET last_login = NOW() WHERE id = $1', [user.id]);

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

module.exports = router;

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
  try {
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
    const existingUser = await pool.query(
      'SELECT id FROM auth.users WHERE LOWER(email) = LOWER($1)',
      [email]
    );

    if (existingUser.rows.length > 0) {
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

    // Create user in database
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert into auth.users
      const userResult = await client.query(
        `INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, created_at)
         VALUES ($1, $2, NOW(), NOW())
         RETURNING id, email`,
        [email, hashedPassword]
      );

      const userId = userResult.rows[0].id;

      // Insert into user_profiles
      await client.query(
        `INSERT INTO user_profiles (id, role, first_name, last_name, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [userId, role, first_name, last_name]
      );

      await client.query('COMMIT');

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
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

module.exports = router;

