// Minimal Supabase types for Gift Huddle.
// Replace with generated types later: `supabase gen types typescript --project-id <ref>`.

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
          created_at: string | null;
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
          created_at?: string | null;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          dob?: string | null;
          dob_show_year?: boolean | null;
          categories?: string[] | null;
          preferred_shops?: string[] | null;
          socials?: Json | null;
          avatar_url?: string | null;
          banner_url?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          description: string | null;
          is_shared: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          description?: string | null;
          is_shared?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          owner_id?: string;
          title?: string;
          description?: string | null;
          is_shared?: boolean | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
