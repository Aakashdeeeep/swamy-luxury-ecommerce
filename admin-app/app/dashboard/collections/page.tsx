"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "../../../lib/supabase";
import { uploadImage, deleteImage } from "../../../lib/helpers";
import type { Collection } from "../../../lib/types";
import toast from "react-hot-toast";

const emptyForm = { title: "", subtitle: "", description: "", image_url: "", link: "/collections", sort_order: 0, is_published: true };

export default function CollectionsAdminPage() {
  const [items, setItems] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    const { data, error } = await supabase.from("collections").select("*").order("sort_order");
    if (error) toast.error(error.message);
    else setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm({ ...form, image_url: url });
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err.message);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    const payload = { ...form, updated_at: new Date().toISOString() };

    if (editingId) {
      const { error } = await supabase.from("collections").update(payload).eq("id", editingId);
      if (error) return toast.error(error.message);
      toast.success("Collection updated");
    } else {
      const { error } = await supabase.from("collections").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Collection created");
    }
    handleCancel();
    fetchItems();
  };

  const handleEdit = (item: Collection) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      subtitle: item.subtitle ?? "",
      description: item.description ?? "",
      image_url: item.image_url ?? "",
      link: item.link,
      sort_order: item.sort_order,
      is_published: item.is_published,
    });
    setShowForm(true);
  };

  const handleDelete = async (item: Collection) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    if (item.image_url) try { await deleteImage(item.image_url); } catch {}
    const { error } = await supabase.from("collections").delete().eq("id", item.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    fetchItems();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Collections</h1>
          <p className="text-sm text-gray-500 mt-1">Featured collections on the home page carousel</p>
        </div>
        <button
          onClick={() => { handleCancel(); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#d4af37] text-black font-semibold text-sm rounded-xl hover:bg-[#e5c44a] transition-colors"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Collection
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-[#111] border border-[#222] rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-medium text-white mb-5">{editingId ? "Edit Collection" : "New Collection"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50" placeholder="Bridal Collection" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Subtitle</label>
              <input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50" placeholder="The Royal Vow" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Description</label>
              <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50" placeholder="A celebration of eternal love" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Link</label>
              <input type="text" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50" placeholder="/collections" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Image</label>
              <div className="flex items-center gap-4">
                {form.image_url && (
                  <img src={form.image_url} alt="" className="w-20 h-20 rounded-lg object-cover border border-[#222]" />
                )}
                <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="px-4 py-2 bg-white/5 text-sm text-gray-300 rounded-lg hover:bg-white/10 transition-colors">
                  {uploading ? "Uploading..." : "Choose Image"}
                </button>
                <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="hidden" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="sr-only" />
                <div className={`w-10 h-6 rounded-full transition-colors ${form.is_published ? "bg-green-500" : "bg-gray-700"} relative`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.is_published ? "left-5" : "left-1"}`} />
                </div>
                <span className="text-sm text-gray-400">{form.is_published ? "Published" : "Draft"}</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} className="px-6 py-2.5 bg-[#d4af37] text-black font-semibold text-sm rounded-lg hover:bg-[#e5c44a] transition-colors">
              {editingId ? "Update" : "Create"}
            </button>
            <button onClick={handleCancel} className="px-6 py-2.5 bg-white/5 text-gray-400 text-sm rounded-lg hover:bg-white/10 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No collections yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden group hover:border-[#d4af37]/20 transition-all">
              <div className="aspect-[16/9] bg-[#0a0a0a] relative overflow-hidden">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-gray-700">collections</span>
                  </div>
                )}
                {!item.is_published && (
                  <div className="absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/20">Draft</div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-white font-medium">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{item.subtitle} — {item.description}</p>
                <div className="flex items-center gap-2 mt-4">
                  <button onClick={() => handleEdit(item)} className="flex-1 flex items-center justify-center gap-1 py-2 text-xs text-gray-400 hover:text-[#d4af37] hover:bg-[#d4af37]/10 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-sm">edit</span> Edit
                  </button>
                  <button onClick={() => handleDelete(item)} className="flex-1 flex items-center justify-center gap-1 py-2 text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-sm">delete</span> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
