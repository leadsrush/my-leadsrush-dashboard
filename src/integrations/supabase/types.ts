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
      invoice_items: {
        Row: {
          description: string
          id: string
          invoiceid: string
          quantity: number
          total: number
          unitprice: number
        }
        Insert: {
          description: string
          id?: string
          invoiceid: string
          quantity: number
          total: number
          unitprice: number
        }
        Update: {
          description?: string
          id?: string
          invoiceid?: string
          quantity?: number
          total?: number
          unitprice?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoiceid_fkey"
            columns: ["invoiceid"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          clientid: string
          created_at: string | null
          duedate: string
          id: string
          issuedate: string
          projectid: string | null
          status: string
        }
        Insert: {
          amount: number
          clientid: string
          created_at?: string | null
          duedate: string
          id?: string
          issuedate: string
          projectid?: string | null
          status: string
        }
        Update: {
          amount?: number
          clientid?: string
          created_at?: string | null
          duedate?: string
          id?: string
          issuedate?: string
          projectid?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_clientid_fkey"
            columns: ["clientid"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_projectid_fkey"
            columns: ["projectid"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          id: string
          projectid: string | null
          read: boolean | null
          recipientid: string | null
          senderid: string
          timestamp: string | null
        }
        Insert: {
          content: string
          id?: string
          projectid?: string | null
          read?: boolean | null
          recipientid?: string | null
          senderid: string
          timestamp?: string | null
        }
        Update: {
          content?: string
          id?: string
          projectid?: string | null
          read?: boolean | null
          recipientid?: string | null
          senderid?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_projectid_fkey"
            columns: ["projectid"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipientid_fkey"
            columns: ["recipientid"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_senderid_fkey"
            columns: ["senderid"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          createdat: string | null
          id: string
          link: string | null
          read: boolean | null
          title: string
          type: string
          userid: string
        }
        Insert: {
          content: string
          createdat?: string | null
          id?: string
          link?: string | null
          read?: boolean | null
          title: string
          type: string
          userid: string
        }
        Update: {
          content?: string
          createdat?: string | null
          id?: string
          link?: string | null
          read?: boolean | null
          title?: string
          type?: string
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active: boolean | null
          avatar: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          role: string
        }
        Insert: {
          active?: boolean | null
          avatar?: string | null
          created_at?: string | null
          email: string
          id: string
          name: string
          role: string
        }
        Update: {
          active?: boolean | null
          avatar?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
        }
        Relationships: []
      }
      project_services: {
        Row: {
          id: string
          projectid: string
          serviceid: string
        }
        Insert: {
          id?: string
          projectid: string
          serviceid: string
        }
        Update: {
          id?: string
          projectid?: string
          serviceid?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_services_projectid_fkey"
            columns: ["projectid"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_services_serviceid_fkey"
            columns: ["serviceid"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      project_team_members: {
        Row: {
          id: string
          projectid: string
          userid: string
        }
        Insert: {
          id?: string
          projectid: string
          userid: string
        }
        Update: {
          id?: string
          projectid?: string
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_team_members_projectid_fkey"
            columns: ["projectid"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_team_members_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          clientid: string
          created_at: string | null
          description: string
          enddate: string | null
          id: string
          name: string
          progress: number | null
          projectmanagerid: string
          startdate: string
          status: string
        }
        Insert: {
          clientid: string
          created_at?: string | null
          description: string
          enddate?: string | null
          id?: string
          name: string
          progress?: number | null
          projectmanagerid: string
          startdate: string
          status: string
        }
        Update: {
          clientid?: string
          created_at?: string | null
          description?: string
          enddate?: string | null
          id?: string
          name?: string
          progress?: number | null
          projectmanagerid?: string
          startdate?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_clientid_fkey"
            columns: ["clientid"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_projectmanagerid_fkey"
            columns: ["projectmanagerid"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string
          icon: string
          id: string
          name: string
          price: number
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description: string
          icon: string
          id?: string
          name: string
          price: number
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigneeid: string
          created_at: string | null
          description: string
          duedate: string | null
          id: string
          projectid: string
          status: string
          title: string
        }
        Insert: {
          assigneeid: string
          created_at?: string | null
          description: string
          duedate?: string | null
          id?: string
          projectid: string
          status: string
          title: string
        }
        Update: {
          assigneeid?: string
          created_at?: string | null
          description?: string
          duedate?: string | null
          id?: string
          projectid?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigneeid_fkey"
            columns: ["assigneeid"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_projectid_fkey"
            columns: ["projectid"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
