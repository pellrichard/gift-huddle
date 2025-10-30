'use client'
// Client-side Supabase instance using @supabase/ssr
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  // Keep defaults simple; SSR handles HttpOnly cookies on the server.
  { cookieEncoding: 'base64url' }
)
