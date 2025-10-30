// Minimal Supabase types — baseline 2025-10-10T01:04:40.755580Z
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          dob: string | null
          show_dob_year: boolean | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          hide_birth_year: boolean | null
          fb_picture_url: string | null
          fb_id: string | null
          fb_last_sync: string | null
          permissions_granted: string[] | null
          interests: string[] | null
          preferred_shops: string[] | null
          banner_url: string | null
          preferred_currency: string | null
          notify_channel: string | null
          categories: string[] | null
          updated_at: string | null
          notify_mobile: boolean | null
          notify_email: boolean | null
          unsubscribe_all: boolean | null
          socials?: Json | null
        }
        Insert: {
          id: string
          full_name?: string | null
          dob?: string | null
          show_dob_year?: boolean | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          hide_birth_year?: boolean | null
          fb_picture_url?: string | null
          fb_id?: string | null
          fb_last_sync?: string | null
          permissions_granted?: string[] | null
          interests?: string[] | null
          preferred_shops?: string[] | null
          banner_url?: string | null
          preferred_currency?: string | null
          notify_channel?: string | null
          categories?: string[] | null
          updated_at?: string | null
          notify_mobile?: boolean | null
          notify_email?: boolean | null
          unsubscribe_all?: boolean | null
          socials?: Json | null
        }
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      events: {
        Row: {
          id: string
          title: string | null
          description: string | null
          event_date: string
          location: string | null
          is_shared: boolean | null
          owner_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title?: string | null
          description?: string | null
          event_date: string
          location?: string | null
          is_shared?: boolean | null
          owner_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['events']['Row']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      currency_code: 'GBP' | 'USD' | 'EUR' | string
      notify_channel: 'email' | 'sms' | 'push' | string
    }
  }
}
