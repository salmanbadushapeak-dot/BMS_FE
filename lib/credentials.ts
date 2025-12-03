/**
 * User Credentials for School Management System
 * 
 * These credentials can be used for both demo login and manual login
 */

export const USER_CREDENTIALS = {
  admin: {
    email: "admin@school.com",
    password: "admin123",
    role: "admin" as const,
    name: "Admin User",
    description: "Full access to all features",
  },
  teacher: {
    email: "teacher@school.com",
    password: "teacher123",
    role: "teacher" as const,
    name: "Teacher User",
    description: "Educational access - No financial/enrollment",
  },
  student: {
    email: "student@school.com",
    password: "student123",
    role: "student" as const,
    name: "Student User",
    description: "Limited access to own data",
  },
} as const

/**
 * Check if email matches any of the predefined credentials
 */
export function getRoleFromEmail(email: string): "admin" | "teacher" | "student" | null {
  const normalizedEmail = email.toLowerCase().trim()
  
  if (normalizedEmail === USER_CREDENTIALS.admin.email) {
    return "admin"
  }
  if (normalizedEmail === USER_CREDENTIALS.teacher.email) {
    return "teacher"
  }
  if (normalizedEmail === USER_CREDENTIALS.student.email) {
    return "student"
  }
  
  // Fallback: check if email contains role keywords
  if (normalizedEmail.includes("admin")) {
    return "admin"
  }
  if (normalizedEmail.includes("teacher")) {
    return "teacher"
  }
  if (normalizedEmail.includes("student")) {
    return "student"
  }
  
  return null
}

/**
 * Validate credentials
 */
export function validateCredentials(email: string, password: string): boolean {
  const normalizedEmail = email.toLowerCase().trim()
  
  if (normalizedEmail === USER_CREDENTIALS.admin.email && password === USER_CREDENTIALS.admin.password) {
    return true
  }
  if (normalizedEmail === USER_CREDENTIALS.teacher.email && password === USER_CREDENTIALS.teacher.password) {
    return true
  }
  if (normalizedEmail === USER_CREDENTIALS.student.email && password === USER_CREDENTIALS.student.password) {
    return true
  }
  
  return false
}


