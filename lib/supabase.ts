import { createClient } from "@supabase/supabase-js"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log("Environment check:", {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : "Not found",
})

// Create Supabase client only if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Database types
export interface Student {
  id: string
  student_id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  date_of_birth: string
  gender: string
  grade: string
  section: string
  roll_no: string
  address: string
  guardian_name: string
  guardian_phone: string
  guardian_email?: string
  previous_school?: string
  medical_conditions?: string
  admission_date: string
  status: "Active" | "Inactive" | "Graduated"
  created_at: string
  updated_at?: string
}

export interface Teacher {
  id: string
  teacher_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: string
  gender: string
  subject: string
  qualification: string
  experience_years: number
  address: string
  emergency_contact: string
  joining_date: string
  salary: number
  status: "Active" | "Inactive"
  created_at: string
  updated_at?: string
}

export interface Exam {
  id: string
  name: string
  date: string
  grade: string
  total_marks: number
  status: "Scheduled" | "Completed" | "Cancelled"
  created_at: string
}

export interface ExamResult {
  id: string
  exam_id: string
  student_id: string
  subject: string
  marks_obtained: number
  total_marks: number
  grade: string
  created_at: string
}

export interface Fee {
  id: string
  student_id: string
  academic_year: string
  total_amount: number
  paid_amount: number
  pending_amount: number
  status: "Paid" | "Partial" | "Pending"
  payment_method?: string
  last_payment_date?: string
  created_at: string
  updated_at?: string
}

export interface SportsTeam {
  id: string
  name: string
  sport: string
  coach: string
  captain_id?: string
  description?: string
  status: "Active" | "Inactive"
  created_at: string
}

export interface SportsEvent {
  id: string
  name: string
  date: string
  venue: string
  sport: string
  status: "Upcoming" | "Completed" | "Cancelled"
  priority: "High" | "Medium" | "Low"
  created_at: string
}

export interface SportsParticipation {
  id: string
  student_id: string
  team_id: string
  position: string
  achievements?: string[]
  created_at: string
}

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  const hasConfig = !!(supabaseUrl && supabaseAnonKey && supabase)
  console.log("Supabase configuration check:", hasConfig)
  return hasConfig
}

// Test database connection
export const testDatabaseConnection = async () => {
  if (!supabase) {
    throw new Error("Supabase client not initialized")
  }

  try {
    const { data, error } = await supabase.from("students").select("count").limit(1)
    if (error) throw error
    return true
  } catch (error) {
    console.error("Database connection test failed:", error)
    return false
  }
}
