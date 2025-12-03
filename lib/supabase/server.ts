// This file can only be imported in Server Components or Server Actions
// DO NOT import this in Client Components (files with "use client")
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if environment variables are available
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are not configured. Please check your .env.local file.")
  }

  try {
    const cookieStore = await cookies()

    return createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // The `cookies()` API can only be used in a Server Context.
              // We're ignoring this error on the client since we'll only use it in Server Components.
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: "", ...options })
            } catch (error) {
              // The `cookies()` API can only be used in a Server Context.
              // We're ignoring this error on the client since we'll only use it in Server Components.
            }
          },
        },
      },
    )
  } catch (error: any) {
    // If cookies() fails, it might be called in wrong context
    throw new Error(`Failed to create Supabase server client: ${error.message}`)
  }
}
