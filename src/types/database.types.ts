export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          membership_type: 'basic' | 'premium' | 'corporate';
          join_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['members']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['members']['Insert']>;
      };
      seats: {
        Row: {
          id: string;
          number: string;
          status: 'available' | 'occupied' | 'maintenance';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['seats']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['seats']['Insert']>;
      };
      bookings: {
        Row: {
          id: string;
          member_id: string;
          seat_id: string;
          date: string;
          start_time: string;
          end_time: string;
          notes: string | null;
          status: 'confirmed' | 'cancelled' | 'completed';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
      };
    };
  };
}
