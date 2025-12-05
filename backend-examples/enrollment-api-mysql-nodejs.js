/**
 * Enrollment API Example - Node.js/Express with MySQL
 * 
 * Complete implementation for Student and Teacher Enrollment with Email Credentials
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
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

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Generate a secure random password
 */
function generatePassword(length = 12) {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + special;
  
  let password = '';
  // Ensure at least one character from each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Generate username from email or name
 */
function generateUsername(email, firstName, lastName) {
  const emailPrefix = email.split('@')[0];
  const nameBased = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`.replace(/[^a-z0-9.]/g, '');
  return emailPrefix.length <= 20 ? emailPrefix : nameBased.substring(0, 20);
}

/**
 * Generate unique student ID
 */
async function generateStudentId() {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as count FROM students'
  );
  const count = rows[0].count;
  return `STU${String(count + 1).padStart(6, '0')}`;
}

/**
 * Generate unique teacher ID
 */
async function generateTeacherId() {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as count FROM teachers'
  );
  const count = rows[0].count;
  return `TCH${String(count + 1).padStart(6, '0')}`;
}

/**
 * Send enrollment email with credentials
 */
async function sendEnrollmentEmail(email, name, username, password, role) {
  const roleName = role === 'student' ? 'Student' : 'Teacher';
  const loginUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@school.com',
    to: email,
    subject: `Welcome to School Management System - Your ${roleName} Account Credentials`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #4F46E5; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Welcome to School Management System</h1>
        </div>
        <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
          <p style="font-size: 16px; color: #374151;">Hello ${name},</p>
          <p style="font-size: 16px; color: #374151;">
            Your ${roleName} account has been successfully created. Below are your login credentials:
          </p>
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #e5e7eb;">
            <p style="margin: 10px 0;"><strong style="color: #374151;">Username/Email:</strong> <span style="color: #4F46E5;">${username}</span></p>
            <p style="margin: 10px 0;"><strong style="color: #374151;">Password:</strong> <span style="color: #4F46E5; font-family: monospace;">${password}</span></p>
          </div>
          <p style="font-size: 14px; color: #6b7280;">
            <strong>Important:</strong> Please change your password after your first login for security purposes.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Login to Your Account
            </a>
          </div>
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
            If you have any questions or need assistance, please contact the administration.
          </p>
        </div>
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none;">
          <p style="margin: 0; font-size: 12px; color: #6b7280;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      </div>
    `,
    text: `
Welcome to School Management System

Hello ${name},

Your ${roleName} account has been successfully created. Below are your login credentials:

Username/Email: ${username}
Password: ${password}

Important: Please change your password after your first login for security purposes.

Login URL: ${loginUrl}

If you have any questions or need assistance, please contact the administration.

Best regards,
School Management System Team
    `,
  };
  
  await transporter.sendMail(mailOptions);
}

/**
 * POST /api/enrollment/student
 * Enroll a new student
 */
router.post('/student', [
  body('first_name')
    .notEmpty()
    .withMessage('First name is required')
    .trim(),
  body('last_name')
    .notEmpty()
    .withMessage('Last name is required')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('date_of_birth')
    .isISO8601()
    .withMessage('Valid date of birth is required'),
  body('gender')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  body('grade')
    .notEmpty()
    .withMessage('Grade is required'),
  body('contact_number')
    .notEmpty()
    .withMessage('Contact number is required'),
  body('address')
    .notEmpty()
    .withMessage('Address is required'),
  body('enrollment_date')
    .isISO8601()
    .withMessage('Valid enrollment date is required'),
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
          errors: errors.array(),
        },
      });
    }

    const {
      first_name,
      last_name,
      email,
      date_of_birth,
      gender,
      grade,
      contact_number,
      address,
      enrollment_date,
    } = req.body;

    // Check if email already exists
    const [existingStudent] = await connection.execute(
      'SELECT id FROM students WHERE email = ?',
      [email]
    );

    if (existingStudent.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        error: {
          message: 'Student with this email already exists',
          code: 'EMAIL_EXISTS',
        },
      });
    }

    // Check if user account already exists
    const [existingUser] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        error: {
          message: 'User account with this email already exists',
          code: 'USER_EXISTS',
        },
      });
    }

    // Generate credentials
    const username = generateUsername(email, first_name, last_name);
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate student ID
    const student_id = await generateStudentId();

    // Insert student record
    const [studentResult] = await connection.execute(
      `INSERT INTO students (
        student_id, first_name, last_name, email, date_of_birth, gender,
        grade, contact_number, address, enrollment_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')`,
      [
        student_id,
        first_name,
        last_name,
        email,
        date_of_birth,
        gender,
        grade,
        contact_number,
        address,
        enrollment_date,
      ]
    );

    const studentId = studentResult.insertId;

    // Create user account
    const [userResult] = await connection.execute(
      `INSERT INTO users (email, password_hash, role, status)
       VALUES (?, ?, 'student', 'active')`,
      [email, hashedPassword]
    );

    const userId = userResult.insertId;

    // Link user to student profile
    await connection.execute(
      'UPDATE user_profiles SET student_id = ? WHERE user_id = ?',
      [studentId, userId]
    );

    await connection.commit();

    // Send enrollment email
    try {
      await sendEnrollmentEmail(
        email,
        `${first_name} ${last_name}`,
        username,
        password,
        'student'
      );
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the request if email fails, but log it
    }

    // Get created student
    const [newStudent] = await connection.execute(
      'SELECT * FROM students WHERE id = ?',
      [studentId]
    );

    res.status(201).json({
      success: true,
      message: 'Student enrolled successfully. Login credentials have been sent to their email.',
      data: {
        student: newStudent[0],
        // Don't send password in response - it's only in email
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error enrolling student:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
    });
  } finally {
    connection.release();
  }
});

/**
 * POST /api/enrollment/teacher
 * Enroll a new teacher
 */
router.post('/teacher', [
  body('first_name')
    .notEmpty()
    .withMessage('First name is required')
    .trim(),
  body('last_name')
    .notEmpty()
    .withMessage('Last name is required')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required'),
  body('date_of_birth')
    .isISO8601()
    .withMessage('Valid date of birth is required'),
  body('gender')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  body('subject')
    .notEmpty()
    .withMessage('Subject is required'),
  body('qualification')
    .notEmpty()
    .withMessage('Qualification is required'),
  body('experience_years')
    .isInt({ min: 0 })
    .withMessage('Experience years must be a non-negative integer'),
  body('address')
    .notEmpty()
    .withMessage('Address is required'),
  body('emergency_contact')
    .notEmpty()
    .withMessage('Emergency contact is required'),
  body('joining_date')
    .isISO8601()
    .withMessage('Valid joining date is required'),
  body('salary')
    .isFloat({ min: 0 })
    .withMessage('Salary must be a non-negative number'),
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
          errors: errors.array(),
        },
      });
    }

    const {
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      gender,
      subject,
      qualification,
      experience_years,
      address,
      emergency_contact,
      joining_date,
      salary,
    } = req.body;

    // Check if email already exists
    const [existingTeacher] = await connection.execute(
      'SELECT id FROM teachers WHERE email = ?',
      [email]
    );

    if (existingTeacher.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        error: {
          message: 'Teacher with this email already exists',
          code: 'EMAIL_EXISTS',
        },
      });
    }

    // Check if user account already exists
    const [existingUser] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        error: {
          message: 'User account with this email already exists',
          code: 'USER_EXISTS',
        },
      });
    }

    // Generate credentials
    const username = generateUsername(email, first_name, last_name);
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate teacher ID
    const teacher_id = await generateTeacherId();

    // Insert teacher record
    const [teacherResult] = await connection.execute(
      `INSERT INTO teachers (
        teacher_id, first_name, last_name, email, phone, date_of_birth, gender,
        subject, qualification, experience_years, address, emergency_contact,
        joining_date, salary, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')`,
      [
        teacher_id,
        first_name,
        last_name,
        email,
        phone,
        date_of_birth,
        gender,
        subject,
        qualification,
        experience_years,
        address,
        emergency_contact,
        joining_date,
        salary,
      ]
    );

    const teacherId = teacherResult.insertId;

    // Create user account
    const [userResult] = await connection.execute(
      `INSERT INTO users (email, password_hash, role, status)
       VALUES (?, ?, 'teacher', 'active')`,
      [email, hashedPassword]
    );

    const userId = userResult.insertId;

    // Link user to teacher profile
    await connection.execute(
      'UPDATE user_profiles SET teacher_id = ? WHERE user_id = ?',
      [teacherId, userId]
    );

    await connection.commit();

    // Send enrollment email
    try {
      await sendEnrollmentEmail(
        email,
        `${first_name} ${last_name}`,
        username,
        password,
        'teacher'
      );
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the request if email fails, but log it
    }

    // Get created teacher
    const [newTeacher] = await connection.execute(
      'SELECT * FROM teachers WHERE id = ?',
      [teacherId]
    );

    res.status(201).json({
      success: true,
      message: 'Teacher enrolled successfully. Login credentials have been sent to their email.',
      data: {
        teacher: newTeacher[0],
        // Don't send password in response - it's only in email
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error enrolling teacher:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
    });
  } finally {
    connection.release();
  }
});

module.exports = router;

