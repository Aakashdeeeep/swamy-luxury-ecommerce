"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface Stats {
  products: number;
  categories: number;
  collections: number;
  schemes: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ products: 0, categories: 0, collections: 0, schemes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [p, c, col, s] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("collections").select("id", { count: "exact", head: true }),
        supabase.from("schemes").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        products: p.count ?? 0,
        categories: c.count ?? 0,
        collections: col.count ?? 0,
        schemes: s.count ?? 0,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  const cards = [
    { label: "Products", value: stats.products, icon: "inventory_2", color: "from-[#d4af37]/20 to-[#d4af37]/5", border: "border-[#d4af37]/20" },
    { label: "Categories", value: stats.categories, icon: "category", color: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/20" },
    { label: "Collections", value: stats.collections, icon: "collections", color: "from-purple-500/20 to-purple-500/5", border: "border-purple-500/20" },
    { label: "Schemes", value: stats.schemes, icon: "savings", color: "from-green-500/20 to-green-500/5", border: "border-green-500/20" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your store content</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`bg-gradient-to-br ${card.color} border ${card.border} rounded-2xl p-6 transition-transform hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="material-symbols-outlined text-2xl text-gray-400">{card.icon}</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {loading ? "—" : card.value}
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="mt-12 bg-[#111] border border-[#222] rounded-2xl p-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Start Guide</h2>
        <div className="space-y-3 text-sm text-gray-400">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#d4af37] text-lg mt-0.5">looks_one</span>
            <p><span className="text-white font-medium">Categories first</span> — Create categories like Necklaces, Bangles, Earrings before adding products.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#d4af37] text-lg mt-0.5">looks_two</span>
            <p><span className="text-white font-medium">Add products</span> — Create products, assign categories, upload images, add specs.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#d4af37] text-lg mt-0.5">looks_3</span>
            <p><span className="text-white font-medium">Collections</span> — Featured collections shown on the home page carousel.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#d4af37] text-lg mt-0.5">looks_4</span>
            <p><span className="text-white font-medium">Instant updates</span> — Changes are live on the customer website immediately.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
