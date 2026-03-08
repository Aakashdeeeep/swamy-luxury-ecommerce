"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../lib/auth-context";

const navItems = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { label: "Products", icon: "inventory_2", href: "/dashboard/products" },
  { label: "Categories", icon: "category", href: "/dashboard/categories" },
  { label: "Collections", icon: "collections", href: "/dashboard/collections" },
  { label: "Schemes", icon: "savings", href: "/dashboard/schemes" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut, user } = useAuth();

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-[#111] border-r border-[#222] flex flex-col z-50">
      {/* Brand */}
      <div className="p-6 border-b border-[#222]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#d4af37] text-xl">diamond</span>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Swamy Admin</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                isActive
                  ? "bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User / Sign Out */}
      <div className="p-4 border-t border-[#222]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#d4af37] text-lg">person</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white truncate">{user?.email}</p>
            <p className="text-[10px] text-gray-500">Admin</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
