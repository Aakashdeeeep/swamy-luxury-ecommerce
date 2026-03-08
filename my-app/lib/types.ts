/* ─── Shared TypeScript types matching Supabase schema ─── */

export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  material: string | null;
  material_type: string;
  weight: string | null;
  net_weight: string | null;
  price: string | null;
  badge: string;
  certification: string;
  cert_icon: string;
  description: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Joined
  category?: Category;
  images?: ProductImage[];
  specs?: ProductSpec[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ProductSpec {
  id: string;
  product_id: string;
  label: string;
  value: string;
  sort_order: number;
}

export interface Collection {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  link: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Scheme {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  benefits: string[];
  image_url: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
