export interface SellerProduct {
  id?: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  image?: string;
  is_active: boolean;
  featured: boolean;
}