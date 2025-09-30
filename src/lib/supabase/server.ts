import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "./types";

// Server-side Supabase factory for RSC/route handlers
export const createServerSupabase = () =>
  createServerComponentClient<Database>({ cookies });
