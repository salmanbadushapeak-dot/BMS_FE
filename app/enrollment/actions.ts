"use server";

/**
 * Generate a random password
 */
function generatePassword(length: number = 12): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*";
  const allChars = uppercase + lowercase + numbers + special;
  
  let password = "";
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
  return password.split("").sort(() => Math.random() - 0.5).join("");
}

/**
 * Generate username from email or name
 */
function generateUsername(email: string, firstName: string, lastName: string): string {
  // Use email prefix or create from name
  const emailPrefix = email.split("@")[0];
  const nameBased = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`.replace(/[^a-z0-9.]/g, "");
  
  // Use shorter option, prefer email prefix
  return emailPrefix.length <= 20 ? emailPrefix : nameBased.substring(0, 20);
}

/**
 * Send enrollment email with credentials
 * This is a placeholder - in production, connect to your email service (Nodemailer, SendGrid, etc.)
 */
async function sendEnrollmentEmail(
  email: string,
  name: string,
  username: string,
  password: string,
  role: "student" | "teacher"
): Promise<void> {
  // TODO: Replace with actual email service integration
  // Example: Using Nodemailer, SendGrid, AWS SES, etc.
  
  const roleName = role === "student" ? "Student" : "Teacher";
  const loginUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  const emailContent = {
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
  
  // Log email details (in production, remove this and use actual email service)
  console.log("=".repeat(60));
  console.log("ENROLLMENT EMAIL (Would be sent in production)");
  console.log("=".repeat(60));
  console.log("To:", emailContent.to);
  console.log("Subject:", emailContent.subject);
  console.log("Username:", username);
  console.log("Password:", password);
  console.log("=".repeat(60));
  
  // In production, uncomment and configure your email service:
  /*
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@school.com',
    ...emailContent,
  });
  */
  
  // Simulate email delay
  await new Promise((resolve) => setTimeout(resolve, 500));
}

export async function createStudent(data: any) {
  try {
    // Generate credentials
    const username = generateUsername(data.email, data.first_name, data.last_name);
    const password = generatePassword();
    
    // Create student record (static mode - will be replaced with database call)
    const studentId = `STU${Date.now().toString().slice(-6)}`;
    const newStudent = {
      id: Date.now().toString(),
      student_id: studentId,
      ...data,
    };
    
    // Send enrollment email with credentials
    await sendEnrollmentEmail(
      data.email,
      `${data.first_name} ${data.last_name}`,
      username,
      password,
      "student"
    );
    
    // In production, save to database:
    // - Save student record
    // - Create user account with username and hashed password
    // - Link user account to student record
    
    return {
      success: true,
      student: newStudent,
      credentials: {
        username,
        password, // In production, don't return password - it's only in email
      },
    };
  } catch (error: any) {
    console.error("Error creating student:", error);
    throw new Error(error.message || "Failed to enroll student");
  }
}

export async function createTeacher(data: any) {
  try {
    // Generate credentials
    const username = generateUsername(data.email, data.first_name, data.last_name);
    const password = generatePassword();
    
    // Create teacher record (static mode - will be replaced with database call)
    const teacherId = `TCH${Date.now().toString().slice(-6)}`;
    const newTeacher = {
      id: Date.now().toString(),
      teacher_id: teacherId,
      ...data,
    };
    
    // Send enrollment email with credentials
    await sendEnrollmentEmail(
      data.email,
      `${data.first_name} ${data.last_name}`,
      username,
      password,
      "teacher"
    );
    
    // In production, save to database:
    // - Save teacher record
    // - Create user account with username and hashed password
    // - Link user account to teacher record
    
    return {
      success: true,
      teacher: newTeacher,
      credentials: {
        username,
        password, // In production, don't return password - it's only in email
      },
    };
  } catch (error: any) {
    console.error("Error creating teacher:", error);
    throw new Error(error.message || "Failed to enroll teacher");
  }
}

