"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { slugify, uploadImage, deleteImage } from "../../../lib/helpers";
import type { Product, Category, ProductImage, ProductSpec } from "../../../lib/types";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), images:product_images(*)")
      .order("sort_order");
    if (error) toast.error(error.message);
    else setProducts((data as Product[]) ?? []);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    setCategories(data ?? []);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.title}"? This cannot be undone.`)) return;

    // Delete images from storage
    if (product.images) {
      for (const img of product.images) {
        try { await deleteImage(img.url); } catch {}
      }
    }

    const { error } = await supabase.from("products").delete().eq("id", product.id);
    if (error) return toast.error(error.message);
    toast.success("Product deleted");
    fetchProducts();
  };

  const togglePublish = async (product: Product) => {
    const { error } = await supabase
      .from("products")
      .update({ is_published: !product.is_published })
      .eq("id", product.id);
    if (error) return toast.error(error.message);
    toast.success(product.is_published ? "Unpublished" : "Published");
    fetchProducts();
  };

  const getPrimaryImage = (product: Product) => {
    if (!product.images || product.images.length === 0) return null;
    const primary = product.images.find((img) => img.is_primary);
    return primary?.url ?? product.images[0]?.url ?? null;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} products total</p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#d4af37] text-black font-semibold text-sm rounded-xl hover:bg-[#e5c44a] transition-colors"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Product
        </Link>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-gray-700 mb-4 block">inventory_2</span>
          <p className="text-gray-500">No products yet.</p>
          <p className="text-sm text-gray-600 mt-1">Create categories first, then add products.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const imgUrl = getPrimaryImage(product);
            return (
              <div key={product.id} className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden group hover:border-[#d4af37]/20 transition-all">
                {/* Image */}
                <div className="aspect-square bg-[#0a0a0a] relative overflow-hidden">
                  {imgUrl ? (
                    <img src={imgUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-gray-700">image</span>
                    </div>
                  )}
                  {/* Status badge */}
                  <div className={`absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    product.is_published ? "bg-green-500/20 text-green-400 border border-green-500/20" : "bg-red-500/20 text-red-400 border border-red-500/20"
                  }`}>
                    {product.is_published ? "Published" : "Draft"}
                  </div>
                  {product.badge && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-bold uppercase bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/20">
                      {product.badge}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-medium text-white truncate">{product.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{product.category?.name ?? "No category"}</span>
                    <span className="text-gray-700">•</span>
                    <span className="text-xs text-[#d4af37]">{product.price || "No price"}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#222]">
                    <Link
                      href={`/dashboard/products/${product.id}`}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-xs text-gray-400 hover:text-[#d4af37] hover:bg-[#d4af37]/10 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      Edit
                    </Link>
                    <button
                      onClick={() => togglePublish(product)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-xs text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {product.is_published ? "visibility_off" : "visibility"}
                      </span>
                      {product.is_published ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
