// src/lib/supabase/index.ts
// Barrel that is safe for client imports. Do NOT re-export server-rsc here.
export { createClient } from "./server";
export type { Database } from "@/lib/database.types";
