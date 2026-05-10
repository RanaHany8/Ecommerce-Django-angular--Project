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
  description: string;
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
  /** Average 1–5 from reviews; null if none */
  average_rating?: number | null;
  review_count?: number;
}

/** Row from /api/user/reviews/ */
export interface ProductReview {
  id: number;
  username: string;
  product: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ApiListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/** Wishlist row from GET /api/user/wishlist/ */
export interface WishlistItem {
  id: number;
  product: Product;
}
