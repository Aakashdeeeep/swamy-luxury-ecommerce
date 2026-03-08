"use client";

import { useRef, useState, useCallback, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CustomCursor from "../../components/CustomCursor";
import TextReveal from "../../components/TextReveal";
import Link from "next/link";
import { useProducts, useCategories, getPrimaryImage } from "../../lib/hooks";

gsap.registerPlugin(ScrollTrigger);

/* ─── Fallback data ─────────────────────────────────── */
const FALLBACK_CATEGORIES = ["All", "Necklaces", "Bangles", "Earrings", "Bridal Sets", "Rings"];

const FALLBACK_PRODUCTS = [
    {
        id: 1,
        title: "Lakshmi Temple Necklace",
        category: "Necklaces",
        material: "22K Gold",
        weight: "48.5g",
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
        id: 2,
        title: "Royal Diamond Choker",
        category: "Necklaces",
        material: "18K Rose Gold",
        weight: "dia: 2.4ct",
        net: "",
        price: "₹ 5,12,000",
        badge: "",
        badgeStyle: "",
        cert: "IGI",
        certIcon: "diamond",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYAheP_OHJBQYuIBQ-4KKG3qsc5MxirFQwWMtodLbuuvWlRBO7aHsYwgc1JD2eD4RjIwRjPifOnvm2l0mdAGSy6PiCdvGmWWKX5WLmKrDIa9RW0PCxCNkhgOYHMXibA5nhs9H7M-vBj8V9RLWL-cQfhKldcBZ-7Ap_dFPoavGzIkQY8yFH_2-OfyjM5Ios6rFB0p1LWA8dG6bq5IJh-ITKOojC__WEbqZp3ungCVFaP36VFf6Dftd7ziF88uQtY6OF0p-XDUB77b-v",
        slug: "royal-diamond-choker",
    },
    {
        id: 3,
        title: "Heritage Kada Bangle",
        category: "Bangles",
        material: "22K Pure",
        weight: "62g",
        net: "",
        price: "₹ 4,15,000",
        badge: "Best Seller",
        badgeStyle: "bg-[#D4AF37] text-[#050505] font-bold",
        cert: "916",
        certIcon: "verified",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKMq9ue4DRkB_dsoGhawlMvBs8lITdB2YW8UDCVWsneh_ZBojJA8kllI78rt-rqrVb4XapkxLyahch5KufY9iK-ouevhzdiQUXeuPJT044rgEMGiwA54U4wmjSZOFUvvqcfbpp93465kYdKxWOjUl0OFXfRYWo3ICvn3TdO1BsbvxmLRh3T2IOEyzl8bR1q1X8-E490QSVndJgAwbZ5DGk6qkCLTwQ1sFW73gRg01xOziKpV79rDw4iD5rezXJ2K8z2Zts_iL2xf6O",
        slug: "heritage-kada-bangle",
    },
    {
        id: 4,
        title: "Vadavalli Bridal Set",
        category: "Bridal Sets",
        material: "22K Gold",
        weight: "120g",
        net: "112g",
        price: "₹ 8,45,000",
        badge: "Exclusive",
        badgeStyle: "bg-black/40 backdrop-blur-sm border border-white/10 text-white",
        cert: "916",
        certIcon: "verified",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvE0P_ptXrgxuPMTvLy-qka3RmdMqOtsupmO9MWhCICTMnkA6LhEqPEy8JwEHrorEaimJaRmK4-h9_2MKYUUgdV1RFKlk84LWlm9NU9NkQ4LJwiM54mo54L2G9Ppyi2ElDFIViFIPCV3RjaHX2nUmTKjAkUQ7aBkC9_Di22yPGKT5bbgKzyZUeRjs6LLYeo8JKqqGvTuiZFbyGFqxfUQeW6ifzM-n8JhQrf-VUGo22OWtrRYrGyZMoMZnjx2k-OYaBstl0-gIKgFPq",
        slug: "vadavalli-bridal-set",
    },
    {
        id: 5,
        title: "Kemp Temple Earrings",
        category: "Earrings",
        material: "22K Antique",
        weight: "18.5g",
        net: "16.2g",
        price: "₹ 1,32,000",
        badge: "",
        badgeStyle: "",
        cert: "916",
        certIcon: "verified",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYIDSQiGPOgJ4Gju1L-t-LNdI3lZRZNBCoJkDRHPXxFwy-VhHOigy-hcY-FPQdleh2vI7uez3EvGt8fa3wzGpayMx6BmAFAMe3y37U0DE2dRDLV_I5qVlo6bDSwhfCgTV103e-Xlc-mwjudM854wGbslkMpjrBnRCG_4smT2VANGaUtwiE1VGzJjIbX-8mndloH-jegF2A_hOcPvXouHPcXq3jaBzWYEraJbR1ftYDPde0Y7ni-RQCRZePKUPilhSn_zT-O2oG90V5",
        slug: "kemp-temple-earrings",
    },
    {
        id: 6,
        title: "Maharani Cocktail Ring",
        category: "Rings",
        material: "18K Gold + Diamond",
        weight: "dia: 1.8ct",
        net: "",
        price: "₹ 2,85,000",
        badge: "New Arrival",
        badgeStyle: "bg-black/40 backdrop-blur-sm border border-white/10 text-white",
        cert: "IGI",
        certIcon: "diamond",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkKWwo6Q5tQVOz8861JRJzdxsvYwEnmffrcEMwuFSUoeRdvJTGL35yHYyzsqyRY9c1aIQ-7H2LRJtIaeFu8JuG5M5c1V55DDAnMgn_4NTWbM4GNNyVf0cQaffa17wMNJfytPgvmga5xQ84xCfDmnTQHu4FeYO23y4w0dtqApixDFkkqAZRKh5cSe1I_tWOwcnN4vRwumn00kKrVduujqmbxD_hydzb3foGPIzi8mWwjYdwLTZmU8uJAXy0Jn3LwaVcM9tmc8ucSeu9",
        slug: "maharani-cocktail-ring",
    },
];

/* ─── Badge style helper ────────────────────────────── */
function getBadgeStyle(badge: string | null | undefined): string {
    if (!badge) return "";
    const lower = badge.toLowerCase();
    if (lower === "best seller") return "bg-[#D4AF37] text-[#050505] font-bold";
    return "bg-black/40 backdrop-blur-sm border border-white/10 text-white";
}

/* ─── Component ─────────────────────────────────────── */
export default function CollectionsPage() {
    const pageRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const [activeFilter, setActiveFilter] = useState("All");

    // Dynamic data from Supabase
    const { products: dbProducts } = useProducts();
    const { categories: dbCategories } = useCategories();

    // Map DB data to template format, fallback to hardcoded
    const categories = useMemo(() => {
        if (dbCategories.length > 0) return ["All", ...dbCategories.map((c) => c.name)];
        return FALLBACK_CATEGORIES;
    }, [dbCategories]);

    const products = useMemo(() => {
        if (dbProducts.length > 0) {
            return dbProducts.map((p) => ({
                id: p.id,
                title: p.title,
                category: p.category?.name ?? "",
                material: p.material ?? "",
                weight: p.weight ?? "",
                net: p.net_weight ?? "",
                price: p.price ?? "",
                badge: p.badge ?? "",
                badgeStyle: getBadgeStyle(p.badge),
                cert: p.certification ?? "916",
                certIcon: p.cert_icon ?? "verified",
                image: getPrimaryImage(p) ?? "",
                slug: p.slug,
            }));
        }
        return FALLBACK_PRODUCTS;
    }, [dbProducts]);

    const filteredProducts =
        activeFilter === "All" ? products : products.filter((p) => p.category === activeFilter);

    const handleFilter = useCallback(
        (cat: string) => {
            if (cat === activeFilter) return;

            // Animate grid items out
            const cards = gridRef.current?.querySelectorAll(".product-card");
            if (cards) {
                gsap.to(cards, {
                    opacity: 0,
                    y: 30,
                    scale: 0.95,
                    stagger: 0.03,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => {
                        setActiveFilter(cat);
                        // After state update, animate in (handled by useGSAP below)
                    },
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

            // Hero text entrance
            if (heroRef.current) {
                // Hero text
                const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
                tl.from(".hero-badge", { scale: 0, opacity: 0, duration: 0.6, ease: "back.out(2)" }, 0.3);
                tl.from(".hero-title", { opacity: 0, y: 80, skewY: 3, duration: 1.2 }, 0.5);
                tl.from(".hero-desc", { opacity: 0, y: 30, duration: 0.8 }, 0.9);
            }

            // Filter pills stagger
            gsap.from(".filter-pill", {
                opacity: 0,
                y: 20,
                stagger: 0.06,
                duration: 0.6,
                ease: "power3.out",
                scrollTrigger: { trigger: ".filter-bar", start: "top 85%" },
            });
        },
        { scope: pageRef }
    );

    // Animate grid items in when filter changes
    useGSAP(
        () => {
            if (!gridRef.current) return;
            const cards = gridRef.current.querySelectorAll(".product-card");
            gsap.fromTo(
                cards,
                { opacity: 0, y: 40, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    stagger: 0.08,
                    duration: 0.7,
                    ease: "power3.out",
                }
            );
        },
        { dependencies: [activeFilter], scope: gridRef }
    );

    return (
        <div ref={pageRef} className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-[#050505]">
            <CustomCursor />
            <div className="noise-overlay" />
            <Navbar />

            {/* Hero Section */}
            <section
                ref={heroRef}
                className="relative w-full h-[55vh] md:h-[65vh] flex items-center justify-center overflow-hidden"
            >
                {/* Animated hero background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a0e08] via-[#0a0506] to-[#050505]">
                    <div className="hero-animated-bg">
                        <div className="glow-orb glow-orb-1" />
                        <div className="glow-orb glow-orb-2" />
                        <div className="glow-orb glow-orb-3" />
                    </div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,53,0.08)_0%,transparent_50%)]" />
                    {/* Decorative grid lines */}
                    <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(212,175,53,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,53,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
                    <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.3em] mb-6 shadow-[0_0_20px_rgba(212,175,53,0.15)]">
                        <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
                        Exclusive 2026
                    </div>
                    <h1
                        className="hero-title text-4xl md:text-6xl lg:text-7xl text-white mb-5 tracking-wide"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        The Royal Bridal{" "}
                        <span className="text-gold-gradient italic">Collection</span>
                    </h1>
                    <p className="hero-desc text-gray-400 max-w-xl mx-auto font-light text-sm md:text-base" style={{ fontFamily: "var(--font-sans)" }}>
                        Handcrafted masterpieces designed for the modern queen. Experience the purity of 916 Hallmark Gold.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <main className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 pb-28">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[11px] text-gray-500 uppercase tracking-widest py-8 border-b border-white/5 mb-10" style={{ fontFamily: "var(--font-sans)" }}>
                    <Link href="/" className="hover:text-[#D4AF37] transition-colors" data-cursor-hover>Home</Link>
                    <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                    <Link href="/collections" className="hover:text-[#D4AF37] transition-colors" data-cursor-hover>Shop</Link>
                    <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                    <span className="text-[#D4AF37]">Bridal Collection</span>
                </div>

                {/* Filter Bar + Sort */}
                <div className="filter-bar flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
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

                    <div className="flex items-center gap-4">
                        <span className="text-gray-500 text-xs hidden md:block" style={{ fontFamily: "var(--font-sans)" }}>
                            Showing {filteredProducts.length} of {products.length} products
                        </span>
                        <div className="relative group">
                            <button
                                className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-full px-5 py-2.5 text-xs text-white hover:border-[#D4AF37]/40 transition-colors"
                                data-cursor-hover
                                style={{ fontFamily: "var(--font-sans)" }}
                            >
                                Sort: Recommended
                                <span className="material-symbols-outlined text-[16px]">expand_more</span>
                            </button>
                        </div>
                    </div>
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
                            {/* Image */}
                            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg bg-[#0A0A0A] mb-5 border border-white/[0.04] group-hover:border-[#D4AF37]/15 transition-all duration-700">
                                <img
                                    alt={product.title}
                                    src={product.image}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.2s] ease-out opacity-85 group-hover:opacity-100"
                                    loading="lazy"
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Badge */}
                                {product.badge && (
                                    <div className={`absolute top-4 left-4 ${product.badgeStyle} px-3 py-1 rounded text-[9px] uppercase tracking-[0.15em]`}>
                                        {product.badge}
                                    </div>
                                )}

                                {/* Quick View — slides up on hover */}
                                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                    <span className="w-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white py-3 rounded-full text-xs font-medium tracking-wide flex items-center justify-center gap-2 shadow-lg transition-colors duration-300">
                                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                                        Quick View
                                    </span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <h3
                                        className="text-base text-white group-hover:text-[#D4AF37] transition-colors duration-300"
                                        style={{ fontFamily: "var(--font-display)" }}
                                    >
                                        {product.title}
                                    </h3>
                                    <div className="flex items-center gap-1 text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20 shrink-0">
                                        <span className="material-symbols-outlined text-[12px]">{product.certIcon}</span>
                                        <span className="text-[9px] font-bold">{product.cert}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-[11px] text-gray-500" style={{ fontFamily: "var(--font-sans)" }}>
                                    <span>{product.material}</span>
                                    <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                    <span>{product.weight}</span>
                                </div>
                                <div className="pt-2 flex items-center justify-between">
                                    <span
                                        className="text-[#D4AF37] text-lg font-medium"
                                        style={{ fontFamily: "var(--font-display)" }}
                                    >
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


            </main>

            {/* Gold divider */}
            <div className="gold-divider mx-auto max-w-7xl" />

            <Footer />
        </div>
    );
}
