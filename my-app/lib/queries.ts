/* ─── Data-fetching helpers for the Customer website ─── */

import { supabase } from "./supabase";
import type { Product, Category, Collection, Scheme, ProductImage, ProductSpec } from "./types";

// ── Categories ──────────────────────────────────────────
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

// ── Products (with primary image + category name) ───────
export async function getProducts(categorySlug?: string): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      images:product_images(*)
    `)
    .eq("is_published", true)
    .order("sort_order");

  if (categorySlug && categorySlug !== "all") {
    // Filter by category slug via a sub-query join
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();
    if (cat) {
      query = query.eq("category_id", cat.id);
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as Product[]) ?? [];
}

// ── Single product by slug ──────────────────────────────
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      specs:product_specs(*)
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  if (error) return null;
  return data as Product;
}

// ── Related products (same category, excluding current) ─
export async function getRelatedProducts(productId: string, categoryId: string | null, limit = 3): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select(`*, images:product_images(*)`)
    .eq("is_published", true)
    .neq("id", productId)
    .limit(limit);

  if (categoryId) query = query.eq("category_id", categoryId);

  const { data, error } = await query;
  if (error) throw error;
  return (data as Product[]) ?? [];
}

// ── Collections ─────────────────────────────────────────
export async function getCollections(): Promise<Collection[]> {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

// ── Schemes ─────────────────────────────────────────────
export async function getSchemes(): Promise<Scheme[]> {
  const { data, error } = await supabase
    .from("schemes")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

// ── Helper: get primary image URL from product ──────────
export function getPrimaryImage(product: Product): string {
  if (!product.images || product.images.length === 0) return "";
  const primary = product.images.find((img) => img.is_primary);
  return primary ? primary.url : product.images[0].url;
}

// ── Helper: get all image URLs sorted ───────────────────
export function getSortedImages(product: Product): string[] {
  if (!product.images) return [];
  return product.images
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => img.url);
}
