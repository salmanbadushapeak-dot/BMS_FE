import { createBrowserClient } from "@supabase/ssr"

export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if environment variables are available
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase environment variables are not configured. Some features may not work.")
    // Return a mock client that will fail gracefully
    return createBrowserClient(
      "https://placeholder.supabase.co",
      "placeholder-key"
    )
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}

export const supabase = createSupabaseBrowserClient()
