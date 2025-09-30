import { cookies } from "next/headers";
import { createServerComponentClient, createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "./types";

/** Route Handler / API-friendly client (typed) */
export function createClient() {
  return createRouteHandlerClient<Database, "public">({ cookies });
}

/** Server Component-friendly client (typed) */
export const createServerSupabase = () =>
  createServerComponentClient<Database, "public">({ cookies });
