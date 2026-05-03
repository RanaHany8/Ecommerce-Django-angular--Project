// تأكدي إن أول سطر في الملف ده هو تعريف الـ interface وليس import
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface ProductImage {
  id: number;
  image_url: string;
  is_primary: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  stock: number;
  featured: boolean;
  category: Category;
  primary_image: string;
}

export interface ProductDetails {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  featured: boolean;
  image: string;
  category: Category;
  images: ProductImage[];
  created_at: string;
}

export interface ApiListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}