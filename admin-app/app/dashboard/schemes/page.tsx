"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "../../../lib/supabase";
import { uploadImage, deleteImage } from "../../../lib/helpers";
import type { Scheme } from "../../../lib/types";
import toast from "react-hot-toast";

const emptyForm = { title: "", subtitle: "", description: "", image_url: "", benefits: [] as string[], is_published: true, sort_order: 0 };

export default function SchemesAdminPage() {
  const [items, setItems] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [newBenefit, setNewBenefit] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    const { data, error } = await supabase.from("schemes").select("*").order("sort_order");
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

  const handleAddBenefit = () => {
    if (!newBenefit.trim()) return;
    setForm({ ...form, benefits: [...form.benefits, newBenefit.trim()] });
    setNewBenefit("");
  };

  const handleRemoveBenefit = (index: number) => {
    setForm({ ...form, benefits: form.benefits.filter((_, i) => i !== index) });
  };

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    const payload = { ...form, updated_at: new Date().toISOString() };

    if (editingId) {
      const { error } = await supabase.from("schemes").update(payload).eq("id", editingId);
      if (error) return toast.error(error.message);
      toast.success("Scheme updated");
    } else {
      const { error } = await supabase.from("schemes").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Scheme created");
    }
    handleCancel();
    fetchItems();
  };

  const handleEdit = (item: Scheme) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      subtitle: item.subtitle ?? "",
      description: item.description ?? "",
      image_url: item.image_url ?? "",
      benefits: item.benefits ?? [],
      is_published: item.is_published,
      sort_order: item.sort_order,
    });
    setShowForm(true);
  };

  const handleDelete = async (item: Scheme) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    if (item.image_url) try { await deleteImage(item.image_url); } catch {}
    const { error } = await supabase.from("schemes").delete().eq("id", item.id);
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
          <h1 className="text-2xl font-semibold text-white">Schemes</h1>
          <p className="text-sm text-gray-500 mt-1">Manage savings schemes</p>
        </div>
        <button
          onClick={() => { handleCancel(); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#d4af37] text-black font-semibold text-sm rounded-xl hover:bg-[#e5c44a] transition-colors"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Scheme
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-[#111] border border-[#222] rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-medium text-white mb-5">{editingId ? "Edit Scheme" : "New Scheme"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50" placeholder="Weekly Savings Plan" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Subtitle</label>
              <input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50" placeholder="Premium Plan" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50 resize-none" placeholder="Scheme details..." />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Image</label>
              <div className="flex items-center gap-4">
                {form.image_url && <img src={form.image_url} alt="" className="w-16 h-16 rounded-lg object-cover border border-[#222]" />}
                <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="px-4 py-2 bg-white/5 text-sm text-gray-300 rounded-lg hover:bg-white/10 transition-colors">
                  {uploading ? "Uploading..." : "Choose Image"}
                </button>
                <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="hidden" />
              </div>
            </div>

            {/* Benefits */}
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Benefits</label>
              {form.benefits.length > 0 && (
                <div className="space-y-2 mb-3">
                  {form.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 bg-[#0a0a0a] rounded-lg px-4 py-2 border border-[#1a1a1a]">
                      <span className="text-sm text-white flex-1">{b}</span>
                      <button onClick={() => handleRemoveBenefit(i)} className="text-gray-500 hover:text-red-400">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input type="text" value={newBenefit} onChange={(e) => setNewBenefit(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddBenefit())}
                  className="flex-1 px-4 py-2 bg-[#0a0a0a] border border-[#222] rounded-lg text-white focus:outline-none focus:border-[#d4af37]/50 text-sm" placeholder="Add a benefit..." />
                <button onClick={handleAddBenefit} className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors">
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
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
        <div className="text-center py-16 text-gray-500">No schemes yet.</div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-[#111] border border-[#222] rounded-2xl p-6 flex items-start gap-6 hover:border-[#d4af37]/20 transition-all">
              {item.image_url && <img src={item.image_url} alt="" className="w-20 h-20 rounded-xl object-cover border border-[#222] shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-medium">{item.title}</h3>
                  {!item.is_published && <span className="text-[10px] text-red-400 uppercase tracking-wider bg-red-500/10 px-2 py-0.5 rounded">Draft</span>}
                </div>
                <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
                {item.benefits && item.benefits.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.benefits.map((b, i) => (
                      <span key={i} className="text-[10px] px-2 py-1 bg-[#d4af37]/10 text-[#d4af37] rounded border border-[#d4af37]/20">{b}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => handleEdit(item)} className="p-2 rounded-lg text-gray-400 hover:text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors">
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
                <button onClick={() => handleDelete(item)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
