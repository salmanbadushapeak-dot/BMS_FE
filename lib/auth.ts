import { createSupabaseBrowserClient } from "./supabase/client"

// Get the supabase client
const getSupabase = () => {
  const client = createSupabaseBrowserClient()
  // Check if Supabase is properly configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase is not configured. Please set up your environment variables in .env.local")
  }
  
  return client
}

export type UserRole = "admin" | "teacher" | "student"

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  profile?: {
    first_name: string
    last_name: string
    avatar_url?: string
  }
}

// Auth service
export const authService = {
  // Sign in
  async signIn(email: string, password: string) {
    try {
      const supabase = getSupabase()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Get user profile with role
      const profile = await this.getUserProfile(data.user.id)

      return {
        user: data.user,
        profile,
      }
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    }
  },

  // Sign up
  async signUp(email: string, password: string, role: UserRole, profileData: any) {
    try {
      const supabase = getSupabase()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Create user profile
        await this.createUserProfile(data.user.id, role, profileData)
      }

      return data
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    }
  },

  // Sign out
  async signOut() {
    try {
      const supabase = getSupabase()
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const supabase = getSupabase()
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error("Session error:", sessionError)
        return null
      }

      if (!session || !session.user) {
        return null
      }

      const user = session.user

      // Try to get profile, but don't fail if it doesn't exist
      const profile = await this.getUserProfile(user.id)

      return {
        user,
        profile,
      }
    } catch (error) {
      console.error("Get current user error:", error)
      return null
    }
  },

  // Create user profile
  async createUserProfile(userId: string, role: UserRole, profileData: any) {
    try {
      const supabase = getSupabase()
      const { error } = await supabase.from("user_profiles").insert([
        {
          id: userId,
          role,
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          phone: profileData.phone,
          created_at: new Date().toISOString(),
        },
      ])

      if (error) throw error
    } catch (error) {
      console.error("Create profile error:", error)
      throw error
    }
  },

  // Get user profile
  async getUserProfile(userId: string) {
    try {
      const supabase = getSupabase()
      const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

      if (error) {
        // If profile doesn't exist, return a default profile
        if (error.code === "PGRST116") {
          return {
            role: "admin" as UserRole,
            first_name: "Demo",
            last_name: "User",
          }
        }
        throw error
      }
      return data
    } catch (error) {
      console.error("Get profile error:", error)
      // Return default profile if there's an error
      return {
        role: "admin" as UserRole,
        first_name: "Demo",
        last_name: "User",
      }
    }
  },

  // Check if user has permission
  hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy = {
      admin: 3,
      teacher: 2,
      student: 1,
    }

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
  },

  // Create demo session for development
  async createDemoSession() {
    try {
      // For demo purposes, create a mock user session
      return {
        user: {
          id: "demo-user-id",
          email: "demo@school.com",
        },
        profile: {
          role: "admin" as UserRole,
          first_name: "Demo",
          last_name: "Admin",
        },
      }
    } catch (error) {
      console.error("Demo session error:", error)
      return null
    }
  },
}
