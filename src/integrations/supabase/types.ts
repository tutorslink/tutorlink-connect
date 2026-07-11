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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      academic_levels: {
        Row: {
          created_at: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      advertisements: {
        Row: {
          created_at: string
          currency: string | null
          description: string | null
          id: string
          is_active: boolean
          price: number | null
          title: string
          tutor_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          price?: number | null
          title: string
          tutor_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          price?: number | null
          title?: string
          tutor_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "advertisements_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          notes: string | null
          starts_at: string
          status: Database["public"]["Enums"]["lesson_status"]
          student_id: string
          tutor_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          notes?: string | null
          starts_at: string
          status?: Database["public"]["Enums"]["lesson_status"]
          student_id: string
          tutor_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          notes?: string | null
          starts_at?: string
          status?: Database["public"]["Enums"]["lesson_status"]
          student_id?: string
          tutor_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          discord_id: string | null
          display_name: string | null
          email: string | null
          id: string
          language: string | null
          phone: string | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          discord_id?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          language?: string | null
          phone?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          discord_id?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          language?: string | null
          phone?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      recruitment_applications: {
        Row: {
          applicant_user_id: string | null
          cover_letter: string | null
          created_at: string
          document_ids: string[] | null
          email: string
          full_name: string
          id: string
          internal_notes: string | null
          phone: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          role_applied_for: string | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          applicant_user_id?: string | null
          cover_letter?: string | null
          created_at?: string
          document_ids?: string[] | null
          email: string
          full_name: string
          id?: string
          internal_notes?: string | null
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          role_applied_for?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          applicant_user_id?: string | null
          cover_letter?: string | null
          created_at?: string
          document_ids?: string[] | null
          email?: string
          full_name?: string
          id?: string
          internal_notes?: string | null
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          role_applied_for?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          status: Database["public"]["Enums"]["review_status"]
          student_id: string
          tutor_id: string
          tutor_response: string | null
          updated_at: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          status?: Database["public"]["Enums"]["review_status"]
          student_id: string
          tutor_id: string
          tutor_response?: string | null
          updated_at?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          status?: Database["public"]["Enums"]["review_status"]
          student_id?: string
          tutor_id?: string
          tutor_response?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      schedules: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean
          start_time: string
          timezone: string
          tutor_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean
          start_time: string
          timezone: string
          tutor_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean
          start_time?: string
          timezone?: string
          tutor_id?: string
        }
        Relationships: []
      }
      student_tutor_assignments: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          remaining_classes: number | null
          student_id: string
          tutor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          remaining_classes?: number | null
          student_id: string
          tutor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          remaining_classes?: number | null
          student_id?: string
          tutor_id?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      tutor_applications: {
        Row: {
          applicant_user_id: string | null
          cover_letter: string | null
          created_at: string
          document_ids: string[] | null
          email: string
          full_name: string
          id: string
          internal_notes: string | null
          languages: string[] | null
          levels: string[] | null
          phone: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["application_status"]
          subjects: string[] | null
          timezone: string | null
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          applicant_user_id?: string | null
          cover_letter?: string | null
          created_at?: string
          document_ids?: string[] | null
          email: string
          full_name: string
          id?: string
          internal_notes?: string | null
          languages?: string[] | null
          levels?: string[] | null
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          subjects?: string[] | null
          timezone?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          applicant_user_id?: string | null
          cover_letter?: string | null
          created_at?: string
          document_ids?: string[] | null
          email?: string
          full_name?: string
          id?: string
          internal_notes?: string | null
          languages?: string[] | null
          levels?: string[] | null
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          subjects?: string[] | null
          timezone?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      tutor_levels: {
        Row: {
          level_id: string
          tutor_id: string
        }
        Insert: {
          level_id: string
          tutor_id: string
        }
        Update: {
          level_id?: string
          tutor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutor_levels_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "academic_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tutor_levels_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tutor_profiles: {
        Row: {
          about: string | null
          created_at: string
          currency: string | null
          headline: string | null
          hourly_rate: number | null
          id: string
          is_active: boolean
          is_featured: boolean
          is_verified: boolean
          languages: string[] | null
          rating_avg: number | null
          rating_count: number | null
          timezone: string | null
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          about?: string | null
          created_at?: string
          currency?: string | null
          headline?: string | null
          hourly_rate?: number | null
          id: string
          is_active?: boolean
          is_featured?: boolean
          is_verified?: boolean
          languages?: string[] | null
          rating_avg?: number | null
          rating_count?: number | null
          timezone?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          about?: string | null
          created_at?: string
          currency?: string | null
          headline?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          is_verified?: boolean
          languages?: string[] | null
          rating_avg?: number | null
          rating_count?: number | null
          timezone?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      tutor_subjects: {
        Row: {
          subject_id: string
          tutor_id: string
        }
        Insert: {
          subject_id: string
          tutor_id: string
        }
        Update: {
          subject_id?: string
          tutor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutor_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tutor_subjects_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          granted_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_manager: { Args: { _user_id: string }; Returns: boolean }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "student"
        | "tutor"
        | "recruitment"
        | "website_manager"
        | "owner"
      application_status:
        | "pending"
        | "under_review"
        | "approved"
        | "rejected"
        | "withdrawn"
      lesson_status: "scheduled" | "completed" | "cancelled" | "no_show"
      notification_type: "info" | "success" | "warning" | "error"
      review_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "tutor", "recruitment", "website_manager", "owner"],
      application_status: [
        "pending",
        "under_review",
        "approved",
        "rejected",
        "withdrawn",
      ],
      lesson_status: ["scheduled", "completed", "cancelled", "no_show"],
      notification_type: ["info", "success", "warning", "error"],
      review_status: ["pending", "approved", "rejected"],
    },
  },
} as const
