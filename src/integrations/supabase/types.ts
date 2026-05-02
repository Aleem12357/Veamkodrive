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
      car_parts: {
        Row: {
          brand: string | null
          category: string
          compatible_cars: string[] | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          stock: number
          updated_at: string
        }
        Insert: {
          brand?: string | null
          category: string
          compatible_cars?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          stock?: number
          updated_at?: string
        }
        Update: {
          brand?: string | null
          category?: string
          compatible_cars?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          stock?: number
          updated_at?: string
        }
        Relationships: []
      }
      cars: {
        Row: {
          body_type: string | null
          color: string | null
          created_at: string
          description: string | null
          featured: boolean
          fuel: string | null
          id: string
          image_url: string | null
          make: string
          mileage: number | null
          model: string
          price: number
          status: Database["public"]["Enums"]["car_status"]
          transmission: string | null
          updated_at: string
          year: number
        }
        Insert: {
          body_type?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          fuel?: string | null
          id?: string
          image_url?: string | null
          make: string
          mileage?: number | null
          model: string
          price: number
          status?: Database["public"]["Enums"]["car_status"]
          transmission?: string | null
          updated_at?: string
          year: number
        }
        Update: {
          body_type?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          fuel?: string | null
          id?: string
          image_url?: string | null
          make?: string
          mileage?: number | null
          model?: string
          price?: number
          status?: Database["public"]["Enums"]["car_status"]
          transmission?: string | null
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          item_id: string
          item_type: Database["public"]["Enums"]["cart_item_type"]
          name: string
          quantity: number
          unit_price: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          item_id: string
          item_type: Database["public"]["Enums"]["cart_item_type"]
          name: string
          quantity?: number
          unit_price: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          item_id?: string
          item_type?: Database["public"]["Enums"]["cart_item_type"]
          name?: string
          quantity?: number
          unit_price?: number
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_type: Database["public"]["Enums"]["cart_item_type"]
          name: string
          order_id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_type: Database["public"]["Enums"]["cart_item_type"]
          name: string
          order_id: string
          quantity: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_type?: Database["public"]["Enums"]["cart_item_type"]
          name?: string
          order_id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          card_last4: string | null
          created_at: string
          id: string
          notes: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          phone: string | null
          shipping_address: string | null
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          user_id: string
        }
        Insert: {
          card_last4?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone?: string | null
          shipping_address?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount: number
          user_id: string
        }
        Update: {
          card_last4?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone?: string | null
          shipping_address?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rental_bookings: {
        Row: {
          card_last4: string | null
          created_at: string
          end_date: string
          id: string
          notes: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          pickup_time: string | null
          rental_car_id: string
          start_date: string
          status: Database["public"]["Enums"]["booking_status"]
          total_amount: number
          user_id: string
        }
        Insert: {
          card_last4?: string | null
          created_at?: string
          end_date: string
          id?: string
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          pickup_time?: string | null
          rental_car_id: string
          start_date: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_amount: number
          user_id: string
        }
        Update: {
          card_last4?: string | null
          created_at?: string
          end_date?: string
          id?: string
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          pickup_time?: string | null
          rental_car_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rental_bookings_rental_car_id_fkey"
            columns: ["rental_car_id"]
            isOneToOne: false
            referencedRelation: "rental_cars"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_cars: {
        Row: {
          available: boolean
          created_at: string
          daily_rate: number
          deposit: number
          description: string | null
          fuel: string | null
          id: string
          image_url: string | null
          make: string
          model: string
          seats: number | null
          transmission: string | null
          updated_at: string
          year: number
        }
        Insert: {
          available?: boolean
          created_at?: string
          daily_rate: number
          deposit?: number
          description?: string | null
          fuel?: string | null
          id?: string
          image_url?: string | null
          make: string
          model: string
          seats?: number | null
          transmission?: string | null
          updated_at?: string
          year: number
        }
        Update: {
          available?: boolean
          created_at?: string
          daily_rate?: number
          deposit?: number
          description?: string | null
          fuel?: string | null
          id?: string
          image_url?: string | null
          make?: string
          model?: string
          seats?: number | null
          transmission?: string | null
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      repair_requests: {
        Row: {
          car_make: string
          car_model: string
          car_year: number | null
          card_last4: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          issue_description: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          phone: string
          preferred_date: string | null
          preferred_time: string | null
          status: Database["public"]["Enums"]["repair_status"]
          user_id: string | null
        }
        Insert: {
          car_make: string
          car_model: string
          car_year?: number | null
          card_last4?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          issue_description: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone: string
          preferred_date?: string | null
          preferred_time?: string | null
          status?: Database["public"]["Enums"]["repair_status"]
          user_id?: string | null
        }
        Update: {
          car_make?: string
          car_model?: string
          car_year?: number | null
          card_last4?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          issue_description?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone?: string
          preferred_date?: string | null
          preferred_time?: string | null
          status?: Database["public"]["Enums"]["repair_status"]
          user_id?: string | null
        }
        Relationships: []
      }
      repair_services: {
        Row: {
          base_price: number
          car_make: string
          car_model: string
          category: string
          created_at: string
          description: string | null
          duration_hours: number | null
          id: string
          service_name: string
        }
        Insert: {
          base_price: number
          car_make: string
          car_model: string
          category: string
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          service_name: string
        }
        Update: {
          base_price?: number
          car_make?: string
          car_model?: string
          category?: string
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          service_name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      promote_to_admin: { Args: { _email: string }; Returns: string }
    }
    Enums: {
      app_role: "admin" | "customer"
      booking_status:
        | "pending"
        | "confirmed"
        | "active"
        | "completed"
        | "cancelled"
      car_status: "available" | "sold" | "reserved"
      cart_item_type: "part" | "car"
      order_status: "pending" | "paid" | "shipped" | "completed" | "cancelled"
      payment_method: "cash" | "card"
      payment_status: "unpaid" | "paid" | "refunded"
      repair_status:
        | "pending"
        | "reviewing"
        | "quoted"
        | "accepted"
        | "completed"
        | "cancelled"
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
      app_role: ["admin", "customer"],
      booking_status: [
        "pending",
        "confirmed",
        "active",
        "completed",
        "cancelled",
      ],
      car_status: ["available", "sold", "reserved"],
      cart_item_type: ["part", "car"],
      order_status: ["pending", "paid", "shipped", "completed", "cancelled"],
      payment_method: ["cash", "card"],
      payment_status: ["unpaid", "paid", "refunded"],
      repair_status: [
        "pending",
        "reviewing",
        "quoted",
        "accepted",
        "completed",
        "cancelled",
      ],
    },
  },
} as const
