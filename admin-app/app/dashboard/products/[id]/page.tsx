"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "../../../../lib/supabase";
import { slugify, uploadImage, deleteImage } from "../../../../lib/helpers";
import type { Category, ProductImage, ProductSpec } from "../../../../lib/types";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

interface FormData {
  title: string;
  slug: string;
  category_id: string;
  material: string;
  material_type: string;
  weight: string;
  net_weight: string;
  price: string;
  badge: string;
  certification: string;
  cert_icon: string;
  description: string;
  is_published: boolean;
  sort_order: number;
}

const emptyForm: FormData = {
  title: "",
  slug: "",
  category_id: "",
  material: "",
  material_type: "gold",
  weight: "",
  net_weight: "",
  price: "",
  badge: "",
  certification: "916",
  cert_icon: "verified",
  description: "",
  is_published: true,
  sort_order: 0,
};

export default function ProductFormPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  const productId = isNew ? null : (params.id as string);

  const [form, setForm] = useState<FormData>(emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [specs, setSpecs] = useState<ProductSpec[]>([]);
  const [newSpec, setNewSpec] = useState({ label: "", value: "" });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories
  useEffect(() => {
    supabase.from("categories").select("*").order("sort_order").then(({ data }) => {
      setCategories(data ?? []);
    });
  }, []);

  // Fetch product data if editing
  useEffect(() => {
    if (!productId) return;
    async function load() {
      const { data, error } = await supabase
        .from("products")
        .select("*, images:product_images(*), specs:product_specs(*)")
        .eq("id", productId)
        .single();
      if (error || !data) {
        toast.error("Product not found");
        router.push("/dashboard/products");
        return;
      }
      setForm({
        title: data.title,
        slug: data.slug,
        category_id: data.category_id ?? "",
        material: data.material ?? "",
        material_type: data.material_type ?? "gold",
        weight: data.weight ?? "",
        net_weight: data.net_weight ?? "",
        price: data.price ?? "",
        badge: data.badge ?? "",
        certification: data.certification ?? "916",
        cert_icon: data.cert_icon ?? "verified",
        description: data.description ?? "",
        is_published: data.is_published,
        sort_order: data.sort_order,
      });
      setImages(data.images?.sort((a: ProductImage, b: ProductImage) => a.sort_order - b.sort_order) ?? []);
      setSpecs(data.specs?.sort((a: ProductSpec, b: ProductSpec) => a.sort_order - b.sort_order) ?? []);
      setLoading(false);
    }
    load();
  }, [productId, router]);

  // Auto-slug
  const handleTitleChange = (title: string) => {
    setForm({ ...form, title, slug: isNew ? slugify(title) : form.slug });
  };

  // Save product
  const handleSave = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    setSaving(true);

    try {
      const payload = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        category_id: form.category_id || null,
        material: form.material || null,
        material_type: form.material_type,
        weight: form.weight || null,
        net_weight: form.net_weight || null,
        price: form.price || null,
        badge: form.badge,
        certification: form.certification,
        cert_icon: form.cert_icon,
        description: form.description,
        is_published: form.is_published,
        sort_order: form.sort_order,
        updated_at: new Date().toISOString(),
      };

      if (isNew) {
        const { data, error } = await supabase.from("products").insert(payload).select("id").single();
        if (error) throw error;
        toast.success("Product created!");
        router.push(`/dashboard/products/${data.id}`);
      } else {
        const { error } = await supabase.from("products").update(payload).eq("id", productId);
        if (error) throw error;
        toast.success("Product updated!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    }
    setSaving(false);
  };

  // Image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !productId) {
      if (isNew) toast.error("Save the product first before uploading images");
      return;
    }

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      try {
        const url = await uploadImage(files[i]);
        const { error } = await supabase.from("product_images").insert({
          product_id: productId,
          url,
          sort_order: images.length + i,
          is_primary: images.length === 0 && i === 0,
        });
        if (error) throw error;
      } catch (err: any) {
        toast.error(`Failed to upload ${files[i].name}: ${err.message}`);
      }
    }
    // Refresh images
    const { data } = await supabase.from("product_images").select("*").eq("product_id", productId).order("sort_order");
    setImages(data ?? []);
    setUploading(false);
    toast.success("Images uploaded!");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Delete image
  const handleDeleteImage = async (img: ProductImage) => {
    try {
      await deleteImage(img.url);
      await supabase.from("product_images").delete().eq("id", img.id);
      setImages(images.filter((i) => i.id !== img.id));
      toast.success("Image deleted");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Set primary image
  const handleSetPrimary = async (imgId: string) => {
    if (!productId) return;
    // Unset all, then set one
    await supabase.from("product_images").update({ is_primary: false }).eq("product_id", productId);
    await supabase.from("product_images").update({ is_primary: true }).eq("id", imgId);
    setImages(images.map((img) => ({ ...img, is_primary: img.id === imgId })));
    toast.success("Primary image set");
  };

  // Add spec
  const handleAddSpec = async () => {
    if (!newSpec.label.trim() || !newSpec.value.trim()) return toast.error("Both label and value required");
    if (!productId) return toast.error("Save the product first");

    const { data, error } = await supabase
      .from("product_specs")
      .insert({ product_id: productId, label: newSpec.label, value: newSpec.value, sort_order: specs.length })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setSpecs([...specs, data as ProductSpec]);
    setNewSpec({ label: "", value: "" });
    toast.success("Spec added");
  };

  // Delete spec
  const handleDeleteSpec = async (specId: string) => {
    await supabase.from("product_specs").delete().eq("id", specId);
    setSpecs(specs.filter((s) => s.id !== specId));
    toast.success("Spec removed");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/dashboard/products")} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-gray-400">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-white">{isNew ? "New Product" : "Edit Product"}</h1>
            <p className="text-sm text-gray-500 mt-1">{isNew ? "Add a new product to your store" : form.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              className="sr-only"
            />
            <div className={`w-10 h-6 rounded-full transition-colors ${form.is_published ? "bg-green-500" : "bg-gray-700"} relative`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.is_published ? "left-5" : "left-1"}`} />
            </div>
            <span className="text-sm text-gray-400">{form.is_published ? "Published" : "Draft"}</span>
          </label>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-[#d4af37] text-black font-semibold text-sm rounded-xl hover:bg-[#e5c44a] transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <section className="bg-[#111] border border-[#222] rounded-2xl p-6">
          <h2 className="text-lg font-medium text-white mb-5">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50"
                placeholder="e.g. Lakshmi Temple Necklace"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Category</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50"
              >
                <option value="">— Select Category —</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Material</label>
              <input
                type="text"
                value={form.material}
                onChange={(e) => setForm({ ...form, material: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50"
                placeholder="22K Gold"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Collection Type</label>
              <select
                value={form.material_type}
                onChange={(e) => setForm({ ...form, material_type: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50"
              >
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="diamond">Diamond</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Price</label>
              <input
                type="text"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50"
                placeholder="₹ 3,45,000"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Gross Weight</label>
              <input
                type="text"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50"
                placeholder="48.5g"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Net Weight</label>
              <input
                type="text"
                value={form.net_weight}
                onChange={(e) => setForm({ ...form, net_weight: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50"
                placeholder="45.2g"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Badge</label>
              <select
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50"
              >
                <option value="">None</option>
                <option value="New Arrival">New Arrival</option>
                <option value="Best Seller">Best Seller</option>
                <option value="Limited Edition">Limited Edition</option>
                <option value="Sale">Sale</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Certification</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.certification}
                  onChange={(e) => setForm({ ...form, certification: e.target.value })}
                  className="flex-1 px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50"
                  placeholder="916"
                />
                <select
                  value={form.cert_icon}
                  onChange={(e) => setForm({ ...form, cert_icon: e.target.value })}
                  className="px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50"
                >
                  <option value="verified">✓ Verified</option>
                  <option value="diamond">◆ Diamond</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Sort Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50 resize-none"
                placeholder="Product description..."
              />
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="bg-[#111] border border-[#222] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-medium text-white">Images</h2>
            {!isNew && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 text-sm text-gray-300 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">{uploading ? "hourglass_empty" : "add_photo_alternate"}</span>
                {uploading ? "Uploading..." : "Upload Images"}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {isNew ? (
            <p className="text-sm text-gray-500 text-center py-8">Save the product first, then upload images.</p>
          ) : images.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#222] rounded-xl p-12 text-center cursor-pointer hover:border-[#d4af37]/30 transition-colors"
            >
              <span className="material-symbols-outlined text-4xl text-gray-600 mb-3 block">cloud_upload</span>
              <p className="text-sm text-gray-500">Click or tap to upload images</p>
              <p className="text-xs text-gray-600 mt-1">Supports JPG, PNG, WebP. You can also take a photo from your phone camera.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.id} className={`relative group rounded-xl overflow-hidden border-2 ${img.is_primary ? "border-[#d4af37]" : "border-[#222]"}`}>
                  <img src={img.url} alt="" className="w-full aspect-square object-cover" />
                  {img.is_primary && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#d4af37] text-black text-[9px] font-bold uppercase rounded">Primary</div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!img.is_primary && (
                      <button onClick={() => handleSetPrimary(img.id)} className="p-2 bg-[#d4af37]/20 rounded-lg text-[#d4af37] hover:bg-[#d4af37]/30" title="Set as primary">
                        <span className="material-symbols-outlined text-lg">star</span>
                      </button>
                    )}
                    <button onClick={() => handleDeleteImage(img)} className="p-2 bg-red-500/20 rounded-lg text-red-400 hover:bg-red-500/30" title="Delete">
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Specs */}
        <section className="bg-[#111] border border-[#222] rounded-2xl p-6">
          <h2 className="text-lg font-medium text-white mb-5">Specifications</h2>

          {specs.length > 0 && (
            <div className="space-y-2 mb-5">
              {specs.map((spec) => (
                <div key={spec.id} className="flex items-center justify-between bg-[#0a0a0a] rounded-lg px-4 py-3 border border-[#1a1a1a]">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{spec.label}</span>
                    <p className="text-sm text-white">{spec.value}</p>
                  </div>
                  <button onClick={() => handleDeleteSpec(spec.id)} className="p-1 text-gray-500 hover:text-red-400 transition-colors">
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {!isNew && (
            <div className="flex gap-3">
              <input
                type="text"
                value={newSpec.label}
                onChange={(e) => setNewSpec({ ...newSpec, label: e.target.value })}
                className="flex-1 px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50 text-sm"
                placeholder="Label (e.g. Metal)"
              />
              <input
                type="text"
                value={newSpec.value}
                onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
                className="flex-1 px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50 text-sm"
                placeholder="Value (e.g. 22K Gold)"
              />
              <button
                onClick={handleAddSpec}
                className="px-4 py-3 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            </div>
          )}

          {isNew && <p className="text-sm text-gray-500 text-center py-4">Save the product first, then add specifications.</p>}
        </section>
      </div>
    </div>
  );
}
