import { cookies } from "next/headers";
import { createServerComponentClient, createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "./types";

/**
 * Route Handler / API-friendly client.
 * Matches existing imports: `import { createClient } from "@/lib/supabase/server"`
 * Usage in route.ts: `const supabase = await createClient()`
 */
export async function createClient() {
  return createRouteHandlerClient<Database>({ cookies });
}

/**
 * Server Component-friendly client factory (RSC/page/layout).
 * Usage: `const supabase = createServerSupabase()`
 */
export const createServerSupabase = () =>
  createServerComponentClient<Database>({ cookies });
