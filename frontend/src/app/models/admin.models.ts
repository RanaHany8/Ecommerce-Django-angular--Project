export interface AdminStats {
  overview: {
    products_count: number;
    users_count: number;
    total_revenue: number;
    total_orders: number;
  };
  orders_status: {
    pending: number;
    completed: number;
  };
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  date_joined: string;
}