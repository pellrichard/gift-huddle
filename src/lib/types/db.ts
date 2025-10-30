// src/lib/types/db.ts — convenient aliases (optional)
import type { Database } from '@/supabase/types'

export type ProfilesRow = Database['public']['Tables']['profiles']['Row']
export type ProfilesUpdate = Database['public']['Tables']['profiles']['Update']
export type ProfilesInsert = Database['public']['Tables']['profiles']['Insert']
