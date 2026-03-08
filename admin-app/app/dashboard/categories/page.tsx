"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { slugify } from "../../../lib/helpers";
import type { Category } from "../../../lib/types";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", sort_order: 0 });

  // Fetch categories
  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*").order("sort_order");
    if (error) toast.error(error.message);
    else setCategories(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setForm({ ...form, name, slug: editingId ? form.slug : slugify(name) });
  };

  // Save (create or update)
  const handleSave = async () => {
    if (!form.name.trim()) return toast.error("Name is required");

    if (editingId) {
      const { error } = await supabase
        .from("categories")
        .update({ name: form.name, slug: form.slug, sort_order: form.sort_order, updated_at: new Date().toISOString() })
        .eq("id", editingId);
      if (error) return toast.error(error.message);
      toast.success("Category updated");
    } else {
      const { error } = await supabase
        .from("categories")
        .insert({ name: form.name, slug: form.slug || slugify(form.name), sort_order: form.sort_order });
      if (error) return toast.error(error.message);
      toast.success("Category created");
    }

    setShowForm(false);
    setEditingId(null);
    setForm({ name: "", slug: "", sort_order: 0 });
    fetchCategories();
  };

  // Edit
  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, sort_order: cat.sort_order });
    setShowForm(true);
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Products in it will be uncategorized.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Category deleted");
    fetchCategories();
  };

  // Cancel
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ name: "", slug: "", sort_order: 0 });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage product categories</p>
        </div>
        <button
          onClick={() => { handleCancel(); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#d4af37] text-black font-semibold text-sm rounded-xl hover:bg-[#e5c44a] transition-colors"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Category
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-[#111] border border-[#222] rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-medium text-white mb-4">
            {editingId ? "Edit Category" : "New Category"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50"
                placeholder="e.g. Necklaces"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50"
                placeholder="auto-generated"
              />
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
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} className="px-6 py-2.5 bg-[#d4af37] text-black font-semibold text-sm rounded-lg hover:bg-[#e5c44a] transition-colors">
              {editingId ? "Update" : "Create"}
            </button>
            <button onClick={handleCancel} className="px-6 py-2.5 bg-white/5 text-gray-400 text-sm rounded-lg hover:bg-white/10 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#222]">
              <th className="text-left px-6 py-4 text-xs text-gray-500 uppercase tracking-wider">Name</th>
              <th className="text-left px-6 py-4 text-xs text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="text-left px-6 py-4 text-xs text-gray-500 uppercase tracking-wider">Order</th>
              <th className="text-right px-6 py-4 text-xs text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-12 text-gray-500">Loading...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-12 text-gray-500">No categories yet. Click &quot;Add Category&quot; to start.</td></tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="border-b border-[#222] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{cat.name}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm font-mono">{cat.slug}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{cat.sort_order}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="p-2 rounded-lg text-gray-400 hover:text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
