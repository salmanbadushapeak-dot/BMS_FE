"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isSupabaseConfigured } from "@/lib/supabase"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/components/auth/auth-provider"

interface SetupCheckProps {
  children: React.ReactNode
}

export function SetupCheck({ children }: SetupCheckProps) {
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()

  useEffect(() => {
    const checkConfiguration = async () => {
      try {
        // Check if environment variables are present
        const configured = isSupabaseConfigured()
        console.log("Supabase configured:", configured)

        setIsConfigured(configured)

        // If not configured and not on setup page, redirect to setup
        if (!configured && pathname !== "/setup") {
          console.log("Redirecting to setup page")
          router.push("/setup")
        }
      } catch (error) {
        console.error("Error checking configuration:", error)
        setIsConfigured(false)
        if (pathname !== "/setup") {
          router.push("/setup")
        }
      } finally {
        setIsChecking(false)
      }
    }

    checkConfiguration()
  }, [router, pathname])

  // Show loading while checking configuration
  if (isChecking || isConfigured === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Checking system configuration...</p>
        </div>
      </div>
    )
  }

  // If not configured, show setup page content
  if (!isConfigured) {
    return <>{children}</>
  }

  // If user is not logged in, don't show sidebar (login form will be shown by ProtectedRoute)
  if (!user) {
    return <>{children}</>
  }

  // If configured and user is logged in, show app with sidebar
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-auto">{children}</SidebarInset>
    </SidebarProvider>
  )
}
