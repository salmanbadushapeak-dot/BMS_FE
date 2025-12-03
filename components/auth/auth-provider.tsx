"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { authService, type AuthUser, type UserRole } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  hasPermission: (requiredRole: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [explicitLogout, setExplicitLogout] = useState(false)

  useEffect(() => {
    // Check current user on mount
    checkUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        const profile = await authService.getUserProfile(session.user.id)
        setUser({
          id: session.user.id,
          email: session.user.email!,
          role: profile?.role || "admin",
          profile: profile,
        })
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    // Don't auto-create demo user if user explicitly logged out
    if (explicitLogout) {
      setLoading(false)
      return
    }

    try {
      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        setUser({
          id: currentUser.user.id,
          email: currentUser.user.email!,
          role: currentUser.profile?.role || "admin",
          profile: currentUser.profile,
        })
      } else {
        // For demo purposes, create a demo user if no auth is set up
        const demoUser = await authService.createDemoSession()
        if (demoUser) {
          setUser({
            id: demoUser.user.id,
            email: demoUser.user.email,
            role: demoUser.profile.role,
            profile: demoUser.profile,
          })
        }
      }
    } catch (error) {
      console.error("Auth check error:", error)
      // Only create demo user if not explicitly logged out
      if (!explicitLogout) {
        setUser({
          id: "demo-user-id",
          email: "demo@school.com",
          role: "admin",
          profile: {
            first_name: "Demo",
            last_name: "Admin",
          },
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authService.signIn(email, password)
      setExplicitLogout(false) // Reset logout flag on successful login
      setUser({
        id: result.user.id,
        email: result.user.email!,
        role: result.profile?.role || "admin",
        profile: result.profile,
      })
    } catch (error) {
      // For demo purposes, allow any login
      console.log("Demo login for:", email)
      setExplicitLogout(false) // Reset logout flag on successful login
      setUser({
        id: "demo-user-id",
        email: email,
        role: email.includes("admin") ? "admin" : email.includes("teacher") ? "teacher" : "student",
        profile: {
          first_name: "Demo",
          last_name: email.includes("admin") ? "Admin" : email.includes("teacher") ? "Teacher" : "Student",
        },
      })
    }
  }

  const signOut = async () => {
    try {
      await authService.signOut()
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      // Mark as explicit logout to prevent auto-creating demo user
      setExplicitLogout(true)
      // Clear user state - ProtectedRoute will show login form
      setUser(null)
    }
  }

  const hasPermission = (requiredRole: UserRole) => {
    if (!user) return false
    return authService.hasPermission(user.role, requiredRole)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, hasPermission }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
