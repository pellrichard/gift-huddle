// Minimal Supabase types for Gift Huddle.
// Includes `events` and `profiles` tables to satisfy TypeScript without `any`.
// Replace with full generated types later: `supabase gen types typescript --project-id <ref>`.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          event_date: string; // ISO date
          event_type: string;
          notes: string | null;
          created_at?: string | null;
        };
        Insert: {
          user_id: string;
          title: string;
          event_date: string; // ISO date
          event_type: string;
          notes?: string | null;
        };
        Update: Partial<{
          user_id: string;
          title: string;
          event_date: string;
          event_type: string;
          notes: string | null;
        }>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          dob: string | null;
          dob_show_year: boolean | null;
          categories: string[] | null;
          preferred_shops: string[] | null;
          socials: Json | null;
          avatar_url: string | null;
          banner_url: string | null;
          created_at?: string | null;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          dob?: string | null;
          dob_show_year?: boolean | null;
          categories?: string[] | null;
          preferred_shops?: string[] | null;
          socials?: Json | null;
          avatar_url?: string | null;
          banner_url?: string | null;
        };
        Update: Partial<{
          display_name: string | null;
          dob: string | null;
          dob_show_year: boolean | null;
          categories: string[] | null;
          preferred_shops: string[] | null;
          socials: Json | null;
          avatar_url: string | null;
          banner_url: string | null;
        }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
