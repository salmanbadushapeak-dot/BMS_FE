import { createSupabaseServerClient } from "./supabase/server"

// Generic service for database operations
const createService = (tableName: string) => {
  const getSupabase = async () => {
    try {
      return await createSupabaseServerClient()
    } catch (error: any) {
      console.error("Error creating Supabase server client:", error.message)
      // Throw a more user-friendly error
      if (error.message.includes("environment variables")) {
        throw new Error("Supabase is not configured. Please set up your environment variables in .env.local")
      }
      throw new Error(`Supabase connection failed: ${error.message}`)
    }
  }

  return {
    async create(data: any) {
      const supabase = await getSupabase()
      const { data: result, error } = await supabase.from(tableName).insert(data).select()
      if (error) throw error
      return result
    },
    async getAll() {
      const supabase = await getSupabase()
      const { data, count, error } = await supabase.from(tableName).select("*", { count: "exact" })
      if (error) throw error
      return { data, count }
    },
    async getById(id: string) {
      const supabase = await getSupabase()
      const { data, error } = await supabase.from(tableName).select("*").eq("id", id).single()
      if (error) throw error
      return data
    },
    async update(id: string, data: any) {
      const supabase = await getSupabase()
      const { data: result, error } = await supabase.from(tableName).update(data).eq("id", id).select()
      if (error) throw error
      return result
    },
    async delete(id: string) {
      const supabase = await getSupabase()
      const { error } = await supabase.from(tableName).delete().eq("id", id)
      if (error) throw error
      return true
    },
  }
}

export const studentService = createService("students")
export const teacherService = createService("teachers")
export const attendanceService = createService("attendance")
export const feeService = createService("fees")
export const sportsService = createService("sports_teams")
export const examService = createService("exams")
export const reportService = createService("reports")

export async function getDashboardStats() {
  const supabase = await createSupabaseServerClient()

  // Fetch total students
  const { count: totalStudentsCount, error: studentsError } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
  if (studentsError) throw studentsError

  const { count: activeStudentsCount, error: activeStudentsError } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("status", "Active")
  if (activeStudentsError) throw activeStudentsError

  // Fetch total teachers
  const { count: totalTeachersCount, error: teachersError } = await supabase
    .from("teachers")
    .select("*", { count: "exact", head: true })
  if (teachersError) throw teachersError

  const { count: activeTeachersCount, error: activeTeachersError } = await supabase
    .from("teachers")
    .select("*", { count: "exact", head: true })
    .eq("status", "Active")
  if (activeTeachersError) throw activeTeachersError

  // Fetch pending fees (sum of amounts for 'Pending' or 'Partial' status)
  const { data: feesData, error: feesError } = await supabase
    .from("fees")
    .select("amount_due")
    .in("status", ["Pending", "Partial"])
  if (feesError) throw feesError

  const pendingFees = feesData ? feesData.reduce((sum, fee) => sum + (fee.amount_due || 0), 0) : 0

  return {
    totalStudents: totalStudentsCount || 0,
    activeStudents: activeStudentsCount || 0,
    totalTeachers: totalTeachersCount || 0,
    activeTeachers: activeTeachersCount || 0,
    pendingFees: pendingFees || 0,
  }
}
