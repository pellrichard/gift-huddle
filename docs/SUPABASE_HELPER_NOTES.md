# Supabase helper refactor notes
- Import server helpers from `@/lib/supabase/server-rsc` in **app/** server components and route handlers:
  - `createServerSupabase`, `createRouteHandlerSupabase`, or `supabaseServer`.
- Import browser helper from `@/lib/supabase/server` where you previously imported `createClient`.
