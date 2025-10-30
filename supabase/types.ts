export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options

  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)

  __InternalSupabase: {
    PostgrestVersion: '13.0.5'
  }

  public: {
    Tables: {
      event_invites: {
        Row: {
          created_at: string

          email: string

          event_id: string

          expires_at: string

          id: string

          token: string

          used_at: string | null
        }

        Insert: {
          created_at?: string

          email: string

          event_id: string

          expires_at: string

          id?: string

          token: string

          used_at?: string | null
        }

        Update: {
          created_at?: string

          email?: string

          event_id?: string

          expires_at?: string

          id?: string

          token?: string

          used_at?: string | null
        }

        Relationships: [
          {
            foreignKeyName: 'event_invites_event_id_fkey'

            columns: ['event_id']

            isOneToOne: false

            referencedRelation: 'events'

            referencedColumns: ['id']
          },
        ]
      }

      event_participants: {
        Row: {
          budget_override_usd_cents: number | null

          created_at: string

          display_name: string | null

          email: string | null

          event_id: string

          id: string

          status: string

          updated_at: string

          user_id: string | null
        }

        Insert: {
          budget_override_usd_cents?: number | null

          created_at?: string

          display_name?: string | null

          email?: string | null

          event_id: string

          id?: string

          status?: string

          updated_at?: string

          user_id?: string | null
        }

        Update: {
          budget_override_usd_cents?: number | null

          created_at?: string

          display_name?: string | null

          email?: string | null

          event_id?: string

          id?: string

          status?: string

          updated_at?: string

          user_id?: string | null
        }

        Relationships: [
          {
            foreignKeyName: 'event_participants_event_id_fkey'

            columns: ['event_id']

            isOneToOne: false

            referencedRelation: 'events'

            referencedColumns: ['id']
          },
        ]
      }

      events: {
        Row: {
          active_round: number

          budget_input_currency:
            | Database['public']['Enums']['currency_code']
            | null

          budget_usd_cents: number | null

          created_at: string | null

          draw_deadline: string | null

          event_date: string

          event_type: string | null

          id: string

          is_shared: boolean

          notes: string | null

          recurrence: string | null

          timezone: string | null

          title: string

          user_id: string
        }

        Insert: {
          active_round?: number

          budget_input_currency?:
            | Database['public']['Enums']['currency_code']
            | null

          budget_usd_cents?: number | null

          created_at?: string | null

          draw_deadline?: string | null

          event_date: string

          event_type?: string | null

          id?: string

          is_shared?: boolean

          notes?: string | null

          recurrence?: string | null

          timezone?: string | null

          title: string

          user_id: string
        }

        Update: {
          active_round?: number

          budget_input_currency?:
            | Database['public']['Enums']['currency_code']
            | null

          budget_usd_cents?: number | null

          created_at?: string | null

          draw_deadline?: string | null

          event_date?: string

          event_type?: string | null

          id?: string

          is_shared?: boolean

          notes?: string | null

          recurrence?: string | null

          timezone?: string | null

          title?: string

          user_id?: string
        }

        Relationships: []
      }

      fx_rates: {
        Row: {
          base: Database['public']['Enums']['currency_code']

          fetched_at: string

          id: string

          quote: Database['public']['Enums']['currency_code']

          rate: number
        }

        Insert: {
          base?: Database['public']['Enums']['currency_code']

          fetched_at?: string

          id?: string

          quote: Database['public']['Enums']['currency_code']

          rate: number
        }

        Update: {
          base?: Database['public']['Enums']['currency_code']

          fetched_at?: string

          id?: string

          quote?: Database['public']['Enums']['currency_code']

          rate?: number
        }

        Relationships: []
      }

      profiles: {
        Row: {
          avatar_url: string | null

          banner_url: string | null

          categories: string[] | null

          created_at: string | null

          dob: string | null

          email: string | null

          fb_id: string | null

          fb_last_sync: string | null

          fb_picture_url: string | null

          full_name: string | null

          hide_birth_year: boolean

          id: string

          interests: string[] | null

          notify_channel: Database['public']['Enums']['notify_channel']

          permissions_granted: string[]

          preferred_currency: Database['public']['Enums']['currency_code']

          preferred_shops: string[] | null

          show_dob_year: boolean | null

          updated_at: string | null
        }

        Insert: {
          avatar_url?: string | null

          banner_url?: string | null

          categories?: string[] | null

          created_at?: string | null

          dob?: string | null

          email?: string | null

          fb_id?: string | null

          fb_last_sync?: string | null

          fb_picture_url?: string | null

          full_name?: string | null

          hide_birth_year?: boolean

          id: string

          interests?: string[] | null

          notify_channel?: Database['public']['Enums']['notify_channel']

          permissions_granted?: string[]

          preferred_currency?: Database['public']['Enums']['currency_code']

          preferred_shops?: string[] | null

          show_dob_year?: boolean | null

          updated_at?: string | null
        }

        Update: {
          avatar_url?: string | null

          banner_url?: string | null

          categories?: string[] | null

          created_at?: string | null

          dob?: string | null

          email?: string | null

          fb_id?: string | null

          fb_last_sync?: string | null

          fb_picture_url?: string | null

          full_name?: string | null

          hide_birth_year?: boolean

          id?: string

          interests?: string[] | null

          notify_channel?: Database['public']['Enums']['notify_channel']

          permissions_granted?: string[]

          preferred_currency?: Database['public']['Enums']['currency_code']

          preferred_shops?: string[] | null

          show_dob_year?: boolean | null

          updated_at?: string | null
        }

        Relationships: []
      }

      secret_santa_assignments: {
        Row: {
          created_at: string

          event_id: string

          giver_email: string | null

          giver_user_id: string | null

          id: string

          receiver_email: string | null

          receiver_user_id: string | null

          round: number
        }

        Insert: {
          created_at?: string

          event_id: string

          giver_email?: string | null

          giver_user_id?: string | null

          id?: string

          receiver_email?: string | null

          receiver_user_id?: string | null

          round: number
        }

        Update: {
          created_at?: string

          event_id?: string

          giver_email?: string | null

          giver_user_id?: string | null

          id?: string

          receiver_email?: string | null

          receiver_user_id?: string | null

          round?: number
        }

        Relationships: [
          {
            foreignKeyName: 'secret_santa_assignments_event_id_fkey'

            columns: ['event_id']

            isOneToOne: false

            referencedRelation: 'events'

            referencedColumns: ['id']
          },
        ]
      }

      waitlist_signups: {
        Row: {
          created_at: string

          email: string

          id: string

          name: string | null

          source: string | null
        }

        Insert: {
          created_at?: string

          email: string

          id?: string

          name?: string | null

          source?: string | null
        }

        Update: {
          created_at?: string

          email?: string

          id?: string

          name?: string | null

          source?: string | null
        }

        Relationships: []
      }
    }

    Views: {
      profiles_public: {
        Row: {
          birthday_display: string | null

          email: string | null

          fb_picture_url: string | null

          full_name: string | null

          id: string | null

          interests: string[] | null

          preferred_shops: string[] | null
        }

        Insert: {
          birthday_display?: never

          email?: string | null

          fb_picture_url?: string | null

          full_name?: string | null

          id?: string | null

          interests?: string[] | null

          preferred_shops?: string[] | null
        }

        Update: {
          birthday_display?: never

          email?: string | null

          fb_picture_url?: string | null

          full_name?: string | null

          id?: string | null

          interests?: string[] | null

          preferred_shops?: string[] | null
        }

        Relationships: []
      }
    }

    Functions: {
      citext: {
        Args: { '': boolean } | { '': string } | { '': unknown }

        Returns: string
      }

      citext_hash: {
        Args: { '': string }

        Returns: number
      }

      citextin: {
        Args: { '': unknown }

        Returns: string
      }

      citextout: {
        Args: { '': string }

        Returns: unknown
      }

      citextrecv: {
        Args: { '': unknown }

        Returns: string
      }

      citextsend: {
        Args: { '': string }

        Returns: string
      }
    }

    Enums: {
      currency_code: 'USD' | 'GBP' | 'EUR'

      notify_channel: 'email' | 'app' | 'both'

      participant_status: 'invited' | 'accepted' | 'declined' | 'left'
    }

    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      currency_code: ['USD', 'GBP', 'EUR'],

      notify_channel: ['email', 'app', 'both'],

      participant_status: ['invited', 'accepted', 'declined', 'left'],
    },
  },
} as const
