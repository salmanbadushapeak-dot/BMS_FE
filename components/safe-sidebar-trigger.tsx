"use client"

import React from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { SidebarTrigger } from "@/components/ui/sidebar"

/**
 * Safe wrapper for SidebarTrigger that only renders when user is logged in.
 * This prevents errors when SidebarProvider is not available (e.g., after logout).
 * 
 * Note: SidebarProvider is only rendered when user is logged in (see setup-check.tsx),
 * so if user exists, the context should be available.
 */
export function SafeSidebarTrigger(props: React.ComponentProps<typeof SidebarTrigger>) {
  const { user } = useAuth()

  // Only render SidebarTrigger when user is logged in
  // SidebarProvider is only rendered when user is logged in (in setup-check.tsx)
  // This prevents the "useSidebar must be used within a SidebarProvider" error
  if (!user) {
    return null
  }

  return <SidebarTrigger {...props} />
}

