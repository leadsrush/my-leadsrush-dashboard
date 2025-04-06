
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          role: 'admin' | 'project_manager' | 'team_member' | 'client'
          avatar: string | null
          active: boolean
          created_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role: 'admin' | 'project_manager' | 'team_member' | 'client'
          avatar?: string | null
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'admin' | 'project_manager' | 'team_member' | 'client'
          avatar?: string | null
          active?: boolean
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string
          status: 'planning' | 'in_progress' | 'completed' | 'archived'
          progress: number
          clientId: string
          projectManagerId: string
          startDate: string
          endDate: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          status: 'planning' | 'in_progress' | 'completed' | 'archived'
          progress?: number
          clientId: string
          projectManagerId: string
          startDate: string
          endDate?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          status?: 'planning' | 'in_progress' | 'completed' | 'archived'
          progress?: number
          clientId?: string
          projectManagerId?: string
          startDate?: string
          endDate?: string | null
          created_at?: string
        }
      }
      project_team_members: {
        Row: {
          id: string
          projectId: string
          userId: string
        }
        Insert: {
          id?: string
          projectId: string
          userId: string
        }
        Update: {
          id?: string
          projectId?: string
          userId?: string
        }
      }
      project_services: {
        Row: {
          id: string
          projectId: string
          serviceId: string
        }
        Insert: {
          id?: string
          projectId: string
          serviceId: string
        }
        Update: {
          id?: string
          projectId?: string
          serviceId?: string
        }
      }
      tasks: {
        Row: {
          id: string
          projectId: string
          title: string
          description: string
          status: 'todo' | 'in_progress' | 'completed'
          assigneeId: string
          dueDate: string | null
          created_at: string
        }
        Insert: {
          id?: string
          projectId: string
          title: string
          description: string
          status: 'todo' | 'in_progress' | 'completed'
          assigneeId: string
          dueDate?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          projectId?: string
          title?: string
          description?: string
          status?: 'todo' | 'in_progress' | 'completed'
          assigneeId?: string
          dueDate?: string | null
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          icon: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          icon: string
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          icon?: string
          active?: boolean
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          senderId: string
          recipientId: string | null
          projectId: string | null
          content: string
          read: boolean
          timestamp: string
        }
        Insert: {
          id?: string
          senderId: string
          recipientId?: string | null
          projectId?: string | null
          content: string
          read?: boolean
          timestamp?: string
        }
        Update: {
          id?: string
          senderId?: string
          recipientId?: string | null
          projectId?: string | null
          content?: string
          read?: boolean
          timestamp?: string
        }
      }
      notifications: {
        Row: {
          id: string
          userId: string
          type: 'message' | 'project' | 'invoice' | 'system' | 'client'
          title: string
          content: string
          link: string | null
          read: boolean
          createdAt: string
        }
        Insert: {
          id?: string
          userId: string
          type: 'message' | 'project' | 'invoice' | 'system' | 'client'
          title: string
          content: string
          link?: string | null
          read?: boolean
          createdAt?: string
        }
        Update: {
          id?: string
          userId?: string
          type?: 'message' | 'project' | 'invoice' | 'system' | 'client'
          title?: string
          content?: string
          link?: string | null
          read?: boolean
          createdAt?: string
        }
      }
      invoices: {
        Row: {
          id: string
          clientId: string
          projectId: string | null
          amount: number
          status: 'draft' | 'sent' | 'paid' | 'overdue'
          dueDate: string
          issueDate: string
          created_at: string
        }
        Insert: {
          id?: string
          clientId: string
          projectId?: string | null
          amount: number
          status: 'draft' | 'sent' | 'paid' | 'overdue'
          dueDate: string
          issueDate: string
          created_at?: string
        }
        Update: {
          id?: string
          clientId?: string
          projectId?: string | null
          amount?: number
          status?: 'draft' | 'sent' | 'paid' | 'overdue'
          dueDate?: string
          issueDate?: string
          created_at?: string
        }
      }
      invoice_items: {
        Row: {
          id: string
          invoiceId: string
          description: string
          quantity: number
          unitPrice: number
          total: number
        }
        Insert: {
          id?: string
          invoiceId: string
          description: string
          quantity: number
          unitPrice: number
          total: number
        }
        Update: {
          id?: string
          invoiceId?: string
          description?: string
          quantity?: number
          unitPrice?: number
          total?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

