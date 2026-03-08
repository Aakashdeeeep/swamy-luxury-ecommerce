"use client";

import { useRef, useState, useCallback, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import CustomCursor from "../../../components/CustomCursor";
import TextReveal from "../../../components/TextReveal";
import Link from "next/link";
import { useProductsByMaterialType, useCategories, getPrimaryImage } from "../../../lib/hooks";
import type { Product } from "../../../lib/types";

gsap.registerPlugin(ScrollTrigger);

/* ─── Fallback Data ─────────────────────────────────── */
const FALLBACK_CATEGORIES = ["All", "Necklaces", "Bangles", "Earrings", "Bridal Sets", "Rings"];

const FALLBACK_PRODUCTS = [
    {
        id: "1",
        title: "Lakshmi Temple Necklace",
        category: "Necklaces",
        material: "22K Gold",
        gross: "48.5g",
        net: "45.2g",
        price: "₹ 3,45,000",
        badge: "New Arrival",
        badgeStyle: "bg-black/40 backdrop-blur-sm border border-white/10 text-white",
        cert: "916",
        certIcon: "verified",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-fbbNVsP1AaRHnZm2zXYWEq8l0aoQFCQYnIFQCo9w-g6f7W1pPNW3spk7v_z2HSAfLXCnzpKyznTJ3SVr8ir099PWfnHyVnyTMGAFg2rhJzyEskcWWDAJ853Jrp1YQ7a6vEHRzysgKZOsM_3nJ9eZ7-0VcmGfVl-v-9qPDoHxhE4Bfx0WvNiiylqN7xxjPb36EHRxJiU-GP-LluNQbnP-3GEHjyvHE6BbdNtoYVAYleUDPCX1_J60pPlAl_QfH1mo4a837ern_Ydd",
        slug: "lakshmi-temple-necklace",
    },
    {
        id: "2",
        title: "Heritage Kada Bangle",
        category: "Bangles",
        material: "22K Pure",
        gross: "62g",
        net: "60g",
        price: "₹ 4,15,000",
        badge: "Best Seller",
        badgeStyle: "bg-[#D4AF37] text-[#050505] font-bold",
        cert: "916",
        certIcon: "verified",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKMq9ue4DRkB_dsoGhawlMvBs8lITdB2YW8UDCVWsneh_ZBojJA8kllI78rt-rqrVb4XapkxLyahch5KufY9iK-ouevhzdiQUXeuPJT044rgEMGiwA54U4wmjSZOFUvvqcfbpp93465kYdKxWOjUl0OFXfRYWo3ICvn3TdO1BsbvxmLRh3T2IOEyzl8bR1q1X8-E490QSVndJgAwbZ5DGk6qkCLTwQ1sFW73gRg01xOziKpV79rDw4iD5rezXJ2K8z2Zts_iL2xf6O",
        slug: "heritage-kada-bangle",
    },
    {
        id: "3",
        title: "Coimbatore Heritage Necklace",
        category: "Necklaces",
        material: "Traditional Kemp",
        gross: "55g",
        net: "52g",
        price: "₹ 4,50,000",
        badge: "New Arrival",
        badgeStyle: "bg-black/40 backdrop-blur-sm border border-white/10 text-white",
        cert: "916",
        certIcon: "verified",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOGeYbZx_FxpvTFUwgfhmaSdDtGwKnkZ3x_AVaPoFmjgHk8IZLz9ldLGUR6J4J1bNFW63YUsQ_t0ebpM1k0kFNw2npDGJj_1apDqNfOSN5WNFUfYQBDE55P9-_mtDwSH19OcoqpK2nbhCegsRNZFdk1uMsn3RcPvH3ZAYdLXCkCWbYsUqNK_sjHK9bsQm-lw1h9oXti-qfLgBkIy-sEypHshe_uJMO_ST9gtvD-1qdXSFiduS3iiAeBMG9ZPJ_J78tioyIobxDY0RK",
        slug: "coimbatore-heritage-necklace",
    },
];

function getBadgeStyle(badge: string): string {
    if (badge === "Best Seller") return "bg-[#D4AF37] text-[#050505] font-bold";
    if (badge === "New Arrival") return "bg-black/40 backdrop-blur-sm border border-white/10 text-white";
    if (badge === "Limited Edition") return "bg-purple-500/20 border border-purple-400/30 text-purple-200";
    if (badge === "Sale") return "bg-red-500/20 border border-red-400/30 text-red-200";
    return "bg-black/40 backdrop-blur-sm border border-white/10 text-white";
}

/* ─── Filters sidebar data ──────────────────────────── */
const materials = [
    { label: "22K Gold", count: 45 },
    { label: "18K Rose Gold", count: 21 },
    { label: "Antique Finish", count: 18 },
];

const collections = [
    { label: "Temple Jewellery", checked: false },
    { label: "Bridal Sets", checked: true },
    { label: "Minimalist", checked: false },
    { label: "Men's Collection", checked: false },
];

/* ─── Component ─────────────────────────────────────── */
export default function GoldCollectionPage() {
    const pageRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const [activeFilter, setActiveFilter] = useState("All");

    // ─── Dynamic data from Supabase ───
    const { products: dbProducts, loading } = useProductsByMaterialType("gold");
    const { categories: dbCategories } = useCategories();

    // Map DB products to display shape
    const displayProducts = useMemo(() => {
        if (dbProducts.length === 0) return FALLBACK_PRODUCTS;
        return dbProducts.map((p: Product) => ({
            id: p.id,
            title: p.title,
            category: p.category?.name ?? "",
            material: p.material ?? "22K Gold",
            gross: p.weight ?? "",
            net: p.net_weight ?? "",
            price: p.price ?? "",
            badge: p.badge ?? "",
            badgeStyle: getBadgeStyle(p.badge ?? ""),
            cert: p.certification ?? "916",
            certIcon: p.cert_icon ?? "verified",
            image: getPrimaryImage(p),
            slug: p.slug,
        }));
    }, [dbProducts]);

    const categoryNames = useMemo(() => {
        if (dbCategories.length === 0) return FALLBACK_CATEGORIES;
        return ["All", ...dbCategories.map((c) => c.name)];
    }, [dbCategories]);

    const filteredProducts =
        activeFilter === "All" ? displayProducts : displayProducts.filter((p) => p.category === activeFilter);

    const handleFilter = useCallback(
        (cat: string) => {
            if (cat === activeFilter) return;
            const cards = gridRef.current?.querySelectorAll(".product-card");
            if (cards) {
                gsap.to(cards, {
                    opacity: 0,
                    y: 30,
                    scale: 0.95,
                    stagger: 0.03,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => setActiveFilter(cat),
                });
            } else {
                setActiveFilter(cat);
            }
        },
        [activeFilter]
    );

    /* ─── Animations ─────────────────────────────────── */
    useGSAP(
        () => {
            if (!pageRef.current) return;
            if (heroRef.current) {
                const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
                tl.from(".hero-badge", { scale: 0, opacity: 0, duration: 0.6, ease: "back.out(2)" }, 0.3);
                tl.from(".hero-title", { opacity: 0, y: 80, skewY: 3, duration: 1.2 }, 0.5);
                tl.from(".hero-desc", { opacity: 0, y: 30, duration: 0.8 }, 0.9);
            }
            gsap.from(".filter-pill", {
                opacity: 0,
                y: 20,
                stagger: 0.06,
                duration: 0.6,
                ease: "power3.out",
                scrollTrigger: { trigger: ".filter-bar", start: "top 85%" },
            });
            // Sidebar filters
            gsap.from(".sidebar-filter", {
                opacity: 0,
                x: -20,
                stagger: 0.05,
                duration: 0.6,
                ease: "power3.out",
                scrollTrigger: { trigger: ".sidebar-panel", start: "top 85%" },
            });
        },
        { scope: pageRef }
    );

    useGSAP(
        () => {
            if (!gridRef.current) return;
            const cards = gridRef.current.querySelectorAll(".product-card");
            gsap.fromTo(
                cards,
                { opacity: 0, y: 40, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.7, ease: "power3.out" }
            );
        },
        { dependencies: [activeFilter], scope: gridRef }
    );

    return (
        <div ref={pageRef} className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-[#050505]">
            <CustomCursor />
            <div className="noise-overlay" />
            <Navbar />

            {/* ═══ Hero Section ═══ */}
            <section
                ref={heroRef}
                className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden"
            >
                {/* Video background */}
                <div className="absolute inset-0">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                        poster=""
                    >
                        <source src="/videos/Gold_jewelry_necklace_on_black_049893fe1f.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="hero-animated-bg">
                        <div className="glow-orb glow-orb-1" />
                        <div className="glow-orb glow-orb-2" />
                        <div className="glow-orb glow-orb-3" />
                    </div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,53,0.1)_0%,transparent_50%)]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
                    <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.3em] mb-6 shadow-[0_0_20px_rgba(212,175,53,0.15)] backdrop-blur-sm">
                        <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
                        Exclusive 2026
                    </div>
                    <h1
                        className="hero-title text-4xl md:text-6xl lg:text-7xl text-white mb-5 tracking-wide"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        Pure Gold{" "}
                        <span className="text-gold-gradient italic">Heritage</span>
                    </h1>
                    <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent mx-auto mb-5" />
                    <p
                        className="hero-desc text-gray-400 max-w-xl mx-auto font-light text-sm md:text-base"
                        style={{ fontFamily: "var(--font-sans)" }}
                    >
                        916 Hallmark Gold &bull; Handcrafted temple jewellery &bull; Timeless bridal masterpieces
                    </p>
                </div>
            </section>

            {/* ═══ Gold Savings Calculator ═══ */}
            <section className="relative w-full bg-[#050505] overflow-hidden py-16 md:py-24 border-b border-white/[0.04]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-[radial-gradient(ellipse_at_top,rgba(212,175,53,0.05)_0%,transparent_70%)] pointer-events-none" />
                <div className="relative max-w-[1200px] mx-auto px-4 md:px-8">
                    <div className="text-center mb-12">
                        <p
                            className="calc-label text-[#D4AF37] text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3 font-medium"
                            style={{ fontFamily: "var(--font-sans)" }}
                        >
                            Invest in Elegance
                        </p>
                        <h2
                            className="calc-title text-3xl md:text-4xl text-white tracking-tight"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            Gold Savings Calculator
                        </h2>
                        <p className="text-gray-500 mt-4 max-w-2xl mx-auto font-light text-sm" style={{ fontFamily: "var(--font-sans)" }}>
                            Plan your future heirlooms with our premium savings scheme. Calculate your potential returns with zero wastage benefits.
                        </p>
                    </div>

                    <div className="w-full bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 lg:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group/calc">
                        <div className="absolute inset-0 rounded-3xl border border-[#D4AF37]/20 opacity-0 group-hover/calc:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                            {/* Left: Controls */}
                            <div className="w-full lg:w-1/2 space-y-10">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <label className="text-gray-300 text-sm font-medium uppercase tracking-wider" style={{ fontFamily: "var(--font-sans)" }}>
                                            Monthly Savings Amount
                                        </label>
                                        <div className="text-2xl text-[#D4AF37]" style={{ fontFamily: "var(--font-display)" }}>
                                            ₹ 10,000
                                        </div>
                                    </div>
                                    <input
                                        type="range"
                                        min="1000"
                                        max="100000"
                                        step="1000"
                                        defaultValue="10000"
                                        className="w-full accent-[#D4AF37] cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-gray-600 font-mono">
                                        <span>₹1,000</span>
                                        <span>₹1,00,000</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-gray-300 text-sm font-medium uppercase tracking-wider block" style={{ fontFamily: "var(--font-sans)" }}>
                                        Select Tenure
                                    </label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[11, 18, 24].map((m, i) => (
                                            <button
                                                key={m}
                                                className={`relative overflow-hidden rounded-xl border py-3 px-4 text-center transition-all active:scale-95 ${i === 0
                                                    ? "border-[#D4AF37]/30 bg-[#D4AF37]/10"
                                                    : "border-white/10 bg-white/[0.02] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50"
                                                    }`}
                                            >
                                                <span className={`font-bold block text-lg ${i === 0 ? "text-[#D4AF37]" : "text-gray-300"}`} style={{ fontFamily: "var(--font-display)" }}>
                                                    {m}
                                                </span>
                                                <span className="text-xs text-gray-500 uppercase tracking-wide">Months</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Link
                                    href="/schemes"
                                    className="w-full block text-center relative overflow-hidden bg-gradient-to-r from-[#bfa143] to-[#e6c86e] text-[#1a1810] font-bold py-4 rounded-xl shadow-[0_0_25px_rgba(212,175,53,0.2)] hover:shadow-[0_0_35px_rgba(212,175,53,0.4)] transition-all transform hover:-translate-y-0.5"
                                    style={{ fontFamily: "var(--font-display)" }}
                                >
                                    <span className="flex items-center justify-center gap-2 tracking-wide text-lg">
                                        Start Your Savings Journey
                                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                    </span>
                                </Link>
                            </div>

                            {/* Right: Coin Visual */}
                            <div className="w-full lg:w-1/2 relative">
                                <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 space-y-8">
                                    <div className="relative w-40 h-40 md:w-56 md:h-56 mx-auto flex items-center justify-center">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(212,175,53,0.25)_0%,transparent_70%)] rounded-full animate-pulse" />
                                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-[#ffd700] via-[#f4c430] to-[#b8860b] shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_5px_15px_rgba(255,255,255,0.5)] flex items-center justify-center relative border-4 border-[#e5c15d]">
                                            <div className="w-[85%] h-[85%] rounded-full border border-[#b8860b]/30 flex items-center justify-center bg-gradient-to-br from-[#f4c430] to-[#ffd700]">
                                                <span className="material-symbols-outlined text-6xl text-[#8a6507] drop-shadow-sm">savings</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6 w-full">
                                        <div className="bg-black/20 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
                                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Estimated Gold Accumulated</p>
                                            <div className="text-4xl md:text-5xl text-[#D4AF37] drop-shadow-[0_2px_10px_rgba(212,175,53,0.3)]" style={{ fontFamily: "var(--font-display)" }}>
                                                18.5 <span className="text-2xl text-[#D4AF37]/70">grams</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center px-4 py-2 border-t border-white/10 pt-6">
                                            <div className="text-left">
                                                <p className="text-gray-600 text-xs mb-1">Total Amount Paid</p>
                                                <p className="text-white font-medium">₹ 1,10,000</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-gray-600 text-xs mb-1">Bonus Benefit</p>
                                                <p className="text-green-400 font-medium">+ ₹ 12,500</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-600 italic text-center">*Values are approximate based on current gold rate. Zero wastage applied.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Main Content ═══ */}
            <main className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 pb-28 pt-12">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[11px] text-gray-500 uppercase tracking-widest py-8 border-b border-white/5 mb-10" style={{ fontFamily: "var(--font-sans)" }}>
                    <Link href="/" className="hover:text-[#D4AF37] transition-colors" data-cursor-hover>Home</Link>
                    <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                    <Link href="/collections" className="hover:text-[#D4AF37] transition-colors" data-cursor-hover>Collections</Link>
                    <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                    <span className="text-[#D4AF37]">Gold Collection</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* ─── Sidebar Filters ─── */}
                    <aside className="w-full lg:w-72 flex-shrink-0">
                        <div className="sidebar-panel hidden lg:block bg-white/[0.02] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6 space-y-8 sticky top-28">
                            <div className="sidebar-filter flex items-center justify-between pb-4 border-b border-white/[0.06]">
                                <h3 className="text-lg text-white font-medium" style={{ fontFamily: "var(--font-display)" }}>Refine Selection</h3>
                                <button className="text-xs text-[#D4AF37] hover:underline" style={{ fontFamily: "var(--font-sans)" }}>Clear All</button>
                            </div>

                            {/* Material */}
                            <div className="sidebar-filter space-y-3">
                                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-[0.15em]" style={{ fontFamily: "var(--font-sans)" }}>Material</h4>
                                <div className="space-y-2">
                                    {materials.map((m) => (
                                        <label key={m.label} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 accent-[#D4AF37] rounded border-gray-600 bg-transparent" />
                                            <span className="text-sm text-gray-400 group-hover:text-[#D4AF37] transition-colors">{m.label}</span>
                                            <span className="ml-auto text-xs text-gray-700">({m.count})</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Collection */}
                            <div className="sidebar-filter space-y-3 pt-4 border-t border-white/[0.06]">
                                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-[0.15em]" style={{ fontFamily: "var(--font-sans)" }}>Collection</h4>
                                <div className="space-y-2">
                                    {collections.map((c) => (
                                        <label key={c.label} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" defaultChecked={c.checked} className="w-4 h-4 accent-[#D4AF37] rounded border-gray-600 bg-transparent" />
                                            <span className="text-sm text-gray-400 group-hover:text-[#D4AF37] transition-colors">{c.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="sidebar-filter space-y-4 pt-4 border-t border-white/[0.06]">
                                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-[0.15em]" style={{ fontFamily: "var(--font-sans)" }}>Price Range</h4>
                                <input type="range" min="50000" max="1000000" defaultValue="500000" className="w-full accent-[#D4AF37] cursor-pointer" />
                                <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                                    <span>₹50k</span>
                                    <span>₹10L</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ─── Products ─── */}
                    <div className="flex-1">
                        {/* Filter Bar */}
                        <div className="filter-bar flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                            <div className="flex flex-wrap gap-2">
                                {categoryNames.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => handleFilter(cat)}
                                        className={`filter-pill text-[11px] uppercase tracking-[0.15em] px-5 py-2.5 rounded-full border transition-all duration-500 ${activeFilter === cat
                                            ? "bg-[#D4AF37] border-[#D4AF37] text-[#050505] font-bold shadow-[0_0_20px_rgba(212,175,53,0.3)]"
                                            : "border-white/10 text-gray-400 hover:border-[#D4AF37]/40 hover:text-white bg-white/[0.02]"
                                            }`}
                                        data-cursor-hover
                                        style={{ fontFamily: "var(--font-sans)" }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            <span className="text-gray-500 text-xs hidden md:block" style={{ fontFamily: "var(--font-sans)" }}>
                                Showing {filteredProducts.length} of {displayProducts.length} products
                            </span>
                        </div>

                        {/* Product Grid */}
                        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                            {filteredProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/product/${product.slug}`}
                                    className="product-card group relative flex flex-col cursor-pointer"
                                    data-cursor-hover
                                >
                                    <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg bg-[#0A0A0A] mb-5 border border-white/[0.04] group-hover:border-[#D4AF37]/15 transition-all duration-700">
                                        <img
                                            alt={product.title}
                                            src={product.image}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.2s] ease-out opacity-85 group-hover:opacity-100"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        {product.badge && (
                                            <div className={`absolute top-4 left-4 ${product.badgeStyle} px-3 py-1 rounded text-[9px] uppercase tracking-[0.15em]`}>
                                                {product.badge}
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button className="bg-white/10 backdrop-blur-md hover:bg-[#D4AF37] text-white p-2 rounded-full transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">favorite</span>
                                            </button>
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                            <span className="w-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white py-3 rounded-full text-xs font-medium tracking-wide flex items-center justify-center gap-2 shadow-lg transition-colors duration-300">
                                                <span className="material-symbols-outlined text-[16px]">visibility</span>
                                                Quick View
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-base text-white group-hover:text-[#D4AF37] transition-colors duration-300" style={{ fontFamily: "var(--font-display)" }}>
                                                {product.title}
                                            </h3>
                                            <div className="flex items-center gap-1 text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20 shrink-0">
                                                <span className="material-symbols-outlined text-[12px]">{product.certIcon}</span>
                                                <span className="text-[9px] font-bold">{product.cert}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-[11px] text-gray-500" style={{ fontFamily: "var(--font-sans)" }}>
                                            <span>Gross: {product.gross}</span>
                                            <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                            <span>Net: {product.net}</span>
                                        </div>
                                        <div className="pt-2 flex items-center justify-between">
                                            <span className="text-[#D4AF37] text-lg font-medium" style={{ fontFamily: "var(--font-display)" }}>
                                                {product.price}
                                            </span>
                                            <span className="text-white/40 group-hover:text-[#D4AF37] transition-colors duration-300">
                                                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>


                    </div>
                </div>
            </main>

            <div className="gold-divider mx-auto max-w-7xl" />
            <Footer />
        </div>
    );
}
