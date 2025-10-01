// lib/supabase/server.ts
// Shim that re-exports the unified SSR helpers from src/lib/supabase/server.ts
export {
  createServerSupabase,
  createRouteHandlerSupabase,
  createClient,
} from "@/lib/supabase/server";
