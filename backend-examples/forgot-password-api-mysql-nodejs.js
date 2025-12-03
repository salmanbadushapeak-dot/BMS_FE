/**
 * Forgot Password & Reset Password API Example - Node.js/Express with MySQL
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
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

// Email service (example using nodemailer)
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Generate secure random token
 */
function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Send password reset email
 */
async function sendResetEmail(email, token) {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@school.com',
    to: email,
    subject: 'Reset Your Password - School Management System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>You requested to reset your password for your School Management System account.</p>
        <p>Click the link below to reset your password:</p>
        <p>
          <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetLink}</p>
        <p><strong>This link will expire in 1 hour.</strong></p>
        <p>If you didn't request this, please ignore this email or contact support.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Best regards,<br>School Management System Team</p>
      </div>
    `,
    text: `
      Password Reset Request
      
      You requested to reset your password for your School Management System account.
      
      Click this link to reset your password:
      ${resetLink}
      
      This link will expire in 1 hour.
      
      If you didn't request this, please ignore this email or contact support.
    `,
  };

  await transporter.sendMail(mailOptions);
}

/**
 * POST /api/auth/forgot-password
 * 
 * Request Body:
 * {
 *   "email": "admin@school.com"
 * }
 */
router.post('/forgot-password', [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .toLowerCase(),
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

    const { email } = req.body;

    // Rate limiting check - Check if email has exceeded reset requests (3 per hour)
    const [rateLimitCheck] = await pool.execute(
      `SELECT COUNT(*) as count 
       FROM password_reset_tokens 
       WHERE user_id = (SELECT id FROM users WHERE LOWER(email) = LOWER(?))
       AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)`,
      [email]
    );

    if (rateLimitCheck[0].count >= 3) {
      return res.status(429).json({
        success: false,
        error: {
          message: 'Too many reset requests. Please try again later',
          code: 'RATE_LIMIT_EXCEEDED',
          retry_after: 3600 // 1 hour in seconds
        }
      });
    }

    // Check if user exists (but don't reveal if they don't for security)
    const [users] = await pool.execute(
      'SELECT id, email FROM users WHERE LOWER(email) = LOWER(?)',
      [email]
    );

    // Always return success to prevent email enumeration attacks
    // Only proceed if user exists
    if (users.length > 0) {
      const user = users[0];
      
      // Generate reset token
      const token = generateResetToken();
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

      // Store token in database
      await pool.execute(
        `INSERT INTO password_reset_tokens (user_id, token, expires_at, created_at)
         VALUES (?, ?, ?, NOW())`,
        [user.id, token, expiresAt]
      );

      // Send reset email
      try {
        await sendResetEmail(user.email, token);
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Still return success to user, but log the error
      }
    }

    // Always return success (security: don't reveal if email exists)
    res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
      data: {
        expires_in: 3600 // 1 hour in seconds
      }
    });

  } catch (error) {
    console.error('Forgot password error:', error);
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
 * POST /api/auth/reset-password
 * 
 * Request Body:
 * {
 *   "token": "reset-token-from-email",
 *   "password": "newpassword123",
 *   "confirm_password": "newpassword123"
 * }
 */
router.post('/reset-password', [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('confirm_password')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
], async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await connection.rollback();
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

    const { token, password, confirm_password } = req.body;

    // Verify passwords match
    if (password !== confirm_password) {
      await connection.rollback();
      return res.status(422).json({
        success: false,
        error: {
          message: 'Passwords do not match',
          code: 'VALIDATION_ERROR',
          errors: {
            confirm_password: 'Passwords do not match'
          }
        }
      });
    }

    // Find token in database
    const [tokens] = await connection.execute(
      `SELECT prt.*, u.email
       FROM password_reset_tokens prt
       JOIN users u ON prt.user_id = u.id
       WHERE prt.token = ?`,
      [token]
    );

    if (tokens.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid or expired reset token',
          code: 'INVALID_TOKEN'
        }
      });
    }

    const resetToken = tokens[0];

    // Check if token is expired
    if (new Date(resetToken.expires_at) < new Date()) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid or expired reset token',
          code: 'INVALID_TOKEN'
        }
      });
    }

    // Check if token has already been used
    if (resetToken.used) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        error: {
          message: 'This reset token has already been used',
          code: 'TOKEN_ALREADY_USED'
        }
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
    await connection.execute(
      'UPDATE users SET encrypted_password = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, resetToken.user_id]
    );

    // Mark token as used
    await connection.execute(
      'UPDATE password_reset_tokens SET used = TRUE, updated_at = NOW() WHERE id = ?',
      [resetToken.id]
    );

    await connection.commit();

    // Send confirmation email
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@school.com',
        to: resetToken.email,
        subject: 'Password Reset Successful',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset Successful</h2>
            <p>Hello,</p>
            <p>Your password has been successfully reset.</p>
            <p>If you didn't make this change, please contact support immediately.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">Best regards,<br>School Management System Team</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Confirmation email error:', emailError);
      // Don't fail the request if email fails
    }

    // Return success
    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Reset password error:', error);
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

