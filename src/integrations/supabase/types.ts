export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string
          date: string
          description: string
          id: string
          image_url: string | null
          published: boolean
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category: string
          content: string
          created_at?: string
          date?: string
          description: string
          id?: string
          image_url?: string | null
          published?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          image_url?: string | null
          published?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_history: {
        Row: {
          assistant_response: string
          created_at: string
          id: string
          metadata: Json | null
          prompt_id: string | null
          user_input: string
        }
        Insert: {
          assistant_response: string
          created_at?: string
          id?: string
          metadata?: Json | null
          prompt_id?: string | null
          user_input: string
        }
        Update: {
          assistant_response?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          prompt_id?: string | null
          user_input?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_history_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "chat_prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_prompts: {
        Row: {
          active: boolean
          category: string | null
          created_at: string
          description: string | null
          id: string
          integration_id: string | null
          prompt_text: string
          title: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          active?: boolean
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          integration_id?: string | null
          prompt_text: string
          title: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          active?: boolean
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          integration_id?: string | null
          prompt_text?: string
          title?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_prompts_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      community_events: {
        Row: {
          created_at: string
          current_participants: number | null
          description: string | null
          end_date: string | null
          event_date: string
          id: string
          is_active: boolean | null
          is_online: boolean | null
          location: string | null
          max_participants: number | null
          organizer_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_participants?: number | null
          description?: string | null
          end_date?: string | null
          event_date: string
          id?: string
          is_active?: boolean | null
          is_online?: boolean | null
          location?: string | null
          max_participants?: number | null
          organizer_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_participants?: number | null
          description?: string | null
          end_date?: string | null
          event_date?: string
          id?: string
          is_active?: boolean | null
          is_online?: boolean | null
          location?: string | null
          max_participants?: number | null
          organizer_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "community_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_groups: {
        Row: {
          created_at: string | null
          created_by: string | null
          current_members: number | null
          description: string | null
          id: string
          is_private: boolean | null
          max_members: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          current_members?: number | null
          description?: string | null
          id?: string
          is_private?: boolean | null
          max_members?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          current_members?: number | null
          description?: string | null
          id?: string
          is_private?: boolean | null
          max_members?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "community_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          display_name: string
          grief_type: string | null
          id: string
          is_anonymous: boolean | null
          joined_at: string | null
          last_active: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          display_name: string
          grief_type?: string | null
          id?: string
          is_anonymous?: boolean | null
          joined_at?: string | null
          last_active?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          display_name?: string
          grief_type?: string | null
          id?: string
          is_anonymous?: boolean | null
          joined_at?: string | null
          last_active?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      community_user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          profile_id: string | null
          role: Database["public"]["Enums"]["community_role"]
          verified: boolean | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          profile_id?: string | null
          role?: Database["public"]["Enums"]["community_role"]
          verified?: boolean | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          profile_id?: string | null
          role?: Database["public"]["Enums"]["community_role"]
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "community_user_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "community_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_user_roles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "community_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string
          processed: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone: string
          processed?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string
          processed?: boolean
        }
        Relationships: []
      }
      event_participants: {
        Row: {
          event_id: string
          id: string
          joined_at: string
          participant_id: string
        }
        Insert: {
          event_id: string
          id?: string
          joined_at?: string
          participant_id: string
        }
        Update: {
          event_id?: string
          id?: string
          joined_at?: string
          participant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "community_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "community_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          moderator_only: boolean | null
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          moderator_only?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          moderator_only?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      forum_comment_likes: {
        Row: {
          comment_id: string | null
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "forum_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_comments: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          is_published: boolean | null
          parent_comment_id: string | null
          post_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          parent_comment_id?: string | null
          post_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          parent_comment_id?: string | null
          post_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "community_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "forum_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts_with_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts_with_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          author_id: string | null
          category_id: string | null
          content: string
          created_at: string | null
          id: string
          is_pinned: boolean | null
          is_published: boolean | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          is_published?: boolean | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          is_published?: boolean | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "community_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string | null
          id: string
          joined_at: string | null
          profile_id: string | null
          role: string | null
        }
        Insert: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          profile_id?: string | null
          role?: string | null
        }
        Update: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          profile_id?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "community_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          active: boolean
          config: Json
          created_at: string
          id: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          config: Json
          created_at?: string
          id?: string
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          config?: Json
          created_at?: string
          id?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketing_config: {
        Row: {
          config: Json
          created_at: string
          id: string
          type: string
          updated_at: string
        }
        Insert: {
          config: Json
          created_at?: string
          id?: string
          type: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          active: boolean
          created_at: string
          email: string
          id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          related_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          related_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "community_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      private_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          recipient_id: string
          sender_id: string
          subject: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          recipient_id: string
          sender_id: string
          subject: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          recipient_id?: string
          sender_id?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "private_messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "community_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "private_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "community_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_posts: {
        Row: {
          id: string
          post_id: string
          saved_at: string
          user_id: string
        }
        Insert: {
          id?: string
          post_id: string
          saved_at?: string
          user_id: string
        }
        Update: {
          id?: string
          post_id?: string
          saved_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "community_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      forum_posts_with_stats: {
        Row: {
          author_display_name: string | null
          author_id: string | null
          author_is_anonymous: boolean | null
          category_color: string | null
          category_id: string | null
          category_name: string | null
          category_slug: string | null
          comments_count: number | null
          content: string | null
          created_at: string | null
          id: string | null
          is_pinned: boolean | null
          is_published: boolean | null
          likes_count: number | null
          title: string | null
          updated_at: string | null
          view_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "community_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_role: {
        Args: {
          user_uuid: string
          role_name: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      user_has_liked_post: {
        Args: { user_uuid: string; post_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      community_role: "member" | "moderator" | "professional" | "admin"
      user_role: "community_member" | "admin" | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      community_role: ["member", "moderator", "professional", "admin"],
      user_role: ["community_member", "admin", "super_admin"],
    },
  },
} as const
