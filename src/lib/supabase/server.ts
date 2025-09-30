import { cookies } from "next/headers";
import { createServerComponentClient, createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "./types";

/** Route Handler / API-friendly client (explicit schema generic). */
export async function createClient() {
  return createRouteHandlerClient<Database, "public">({ cookies });
}

/** Server Component-friendly client factory (explicit schema generic). */
export const createServerSupabase = () =>
  createServerComponentClient<Database, "public">({ cookies });
