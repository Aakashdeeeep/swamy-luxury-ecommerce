"use client";

/**
 * React hooks for fetching data from Supabase with realtime subscriptions.
 * Falls back to empty arrays gracefully if Supabase is not configured yet.
 */

import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import type { Product, Category, Collection, Scheme, ProductImage, ProductSpec } from "./types";

// ── Products with images + category ─────────────────────
export function useProducts(categorySlug?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from("products")
        .select("*, category:categories(*), images:product_images(*)")
        .eq("is_published", true)
        .order("sort_order");

      if (categorySlug && categorySlug !== "all") {
        const { data: cat } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", categorySlug)
          .single();
        if (cat) query = query.eq("category_id", cat.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProducts((data as Product[]) ?? []);
    } catch {
      // Supabase not configured — return empty
      setProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();

    // Realtime subscription
    const channel = supabase
      .channel("products-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        fetchProducts();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "product_images" }, () => {
        fetchProducts();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug]);

  return { products, loading, refetch: fetchProducts };
}

// ── Single product by slug ──────────────────────────────
export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*, category:categories(*), images:product_images(*), specs:product_specs(*)")
          .eq("slug", slug)
          .eq("is_published", true)
          .single();
        if (error) throw error;
        const prod = data as Product;
        setProduct(prod);

        // Fetch related products from same category
        if (prod.category_id) {
          const { data: related } = await supabase
            .from("products")
            .select("*, images:product_images(*)")
            .eq("category_id", prod.category_id)
            .eq("is_published", true)
            .neq("id", prod.id)
            .order("sort_order")
            .limit(4);
          setRelatedProducts((related as Product[]) ?? []);
        }
      } catch {
        setProduct(null);
        setRelatedProducts([]);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  return { product, relatedProducts, loading };
}

// ── Categories ──────────────────────────────────────────
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase.from("categories").select("*").order("sort_order");
        if (error) throw error;
        setCategories(data ?? []);
      } catch {
        setCategories([]);
      }
      setLoading(false);
    }
    load();

    const channel = supabase
      .channel("categories-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, () => { load(); })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { categories, loading };
}

// ── Collections ─────────────────────────────────────────
export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase.from("collections").select("*").eq("is_published", true).order("sort_order");
        if (error) throw error;
        setCollections(data ?? []);
      } catch {
        setCollections([]);
      }
      setLoading(false);
    }
    load();

    const channel = supabase
      .channel("collections-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "collections" }, () => { load(); })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { collections, loading };
}

// ── Schemes ─────────────────────────────────────────────
export function useSchemes() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase.from("schemes").select("*").eq("is_published", true).order("sort_order");
        if (error) throw error;
        setSchemes(data ?? []);
      } catch {
        setSchemes([]);
      }
      setLoading(false);
    }
    load();

    const channel = supabase
      .channel("schemes-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "schemes" }, () => { load(); })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { schemes, loading };
}

// ── Helper: get primary image URL ───────────────────────
export function getPrimaryImage(product: Product): string {
  if (!product.images || product.images.length === 0) return "";
  const primary = product.images.find((img) => img.is_primary);
  return primary ? primary.url : product.images[0].url;
}

// ── Products by material type (gold / silver / diamond) ─
export function useProductsByMaterialType(materialType: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(*), images:product_images(*), specs:product_specs(*)")
        .eq("is_published", true)
        .eq("material_type", materialType)
        .order("sort_order");
      if (error) throw error;
      setProducts((data as Product[]) ?? []);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();

    const channel = supabase
      .channel(`products-${materialType}-changes`)
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        fetchProducts();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "product_images" }, () => {
        fetchProducts();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materialType]);

  return { products, loading, refetch: fetchProducts };
}
