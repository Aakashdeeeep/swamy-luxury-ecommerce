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
import { useProductsByMaterialType, getPrimaryImage } from "../../../lib/hooks";
import type { Product } from "../../../lib/types";

gsap.registerPlugin(ScrollTrigger);

/* ─── Fallback Data ─────────────────────────────────── */
const FALLBACK_PRODUCTS = [
    {
        id: "1",
        title: "Royal Celestial Choker",
        metal: "18K White Gold",
        clarity: "VVS1 Clarity",
        price: "₹ 12,45,000",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYAheP_OHJBQYuIBQ-4KKG3qsc5MxirFQwWMtodLbuuvWlRBO7aHsYwgc1JD2eD4RjIwRjPifOnvm2l0mdAGSy6PiCdvGmWWKX5WLmKrDIa9RW0PCxCNkhgOYHMXibA5nhs9H7M-vBj8V9RLWL-cQfhKldcBZ-7Ap_dFPoavGzIkQY8yFH_2-OfyjM5Ios6rFB0p1LWA8dG6bq5IJh-ITKOojC__WEbqZp3ungCVFaP36VFf6Dftd7ziF88uQtY6OF0p-XDUB77b-v",
        slug: "royal-celestial-choker",
    },
    {
        id: "2",
        title: "Ethereal Solitaire Pendant",
        metal: "0.75 ct Round",
        clarity: "IF Clarity",
        price: "₹ 1,85,000",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZ92Aef5f1bfPNKUBwi_S8GmdxAUTQ5izAqHdm4ORcqPaRb53PVktUXdWhdUnceU2-DCXW8PPVFow1iPFtTGxcgZRAVzKnDud5Gj4_xhGQQejfzJ940iY8sc-P74QpUZOJEO5SdGjI0rgM_NqYqYY98kIsTkbTzJEgW58y-ndOu0y53Vq9nvq_cMXOXxs3_pA0hkGb1_GuvYvoaU-sQmvB3z9b-C8-AiaVlXVz-ii2KUGOXvTS2lE2xgpMZAg0MYy0aO6isMStw24I",
        slug: "ethereal-solitaire-pendant",
    },
    {
        id: "3",
        title: "Starfire Diamond Earrings",
        metal: "1.2 ct Total",
        clarity: "VS1 Clarity",
        price: "₹ 3,58,000",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkC7JTemP6ITfoh7QaqyGEWh3su1zOM7RihpGm_djaRMj2EWLfwGvRgIgvHpfioIA2xdsl9772jEMN1MnpnyLs7OOVF-kJLg2B-ALxzGA6uZSMjO5Hyd8zzIsLb3VyZEL_r5s0JmExh0d8Xx7tkX2eeTzSUnu5KPIsXqMzsYJnSHpvK7uZ9iOpTyUquIzNoCR9FScshc3rLTd7ke1gRZ3W90v-_KBCPoksrkpHYE_UfBeXO5KpEb2xckYM0MY-riW4QkyflnSyWA4_",
        slug: "starfire-diamond-earrings",
    },
    {
        id: "4",
        title: "Heritage Polki Necklace",
        metal: "Uncut Diamonds",
        clarity: "Antique Gold",
        price: "₹ 8,95,000",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-fbbNVsP1AaRHnZm2zXYWEq8l0aoQFCQYnIFQCo9w-g6f7W1pPNW3spk7v_z2HSAfLXCnzpKyznTJ3SVr8ir099PWfnHyVnyTMGAFg2rhJzyEskcWWDAJ853Jrp1YQ7a6vEHRzysgKZOsM_3nJ9eZ7-0VcmGfVl-v-9qPDoHxhE4Bfx0WvNiiylqN7xxjPb36EHRxJiU-GP-LluNQbnP-3GEHjyvHE6BbdNtoYVAYleUDPCX1_J60pPlAl_QfH1mo4a837ern_Ydd",
        slug: "heritage-polki-necklace",
    },
    {
        id: "5",
        title: "Diamond Encrusted Kada",
        metal: "2.5 ct Pave",
        clarity: "Platinum",
        price: "₹ 4,75,000",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvog6ZZH-PHDY3R8jybSZOQkPJMnclPD8MGN7bmNxlmqdeq6gbxV7dMMqToRpEsvqZh74RxLxgQsP1gy299OF9xyWmSq27RQMEruxFFuYfYWL_Vld9vZwU0XDkauw4M_ysiYUb0j0UXsVU4Kui55_vXHr_hmBby3NbwW4_GmqlkstDddfBD0M_d3v9w9zWoLWsHncEfhQkfy00g-aJjAEcWQcN-kMnuVUOy6XjigKfbWDOfS3YJb8wcnE6JikXEMKnfenqaAu5Voud",
        slug: "diamond-encrusted-kada",
    },
    {
        id: "6",
        title: "Rose Gold Diamond Bangle",
        metal: "Solitaire Accents",
        clarity: "Rose Gold",
        price: "₹ 6,15,000",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKMq9ue4DRkB_dsoGhawlMvBs8lITdB2YW8UDCVWsneh_ZBojJA8kllI78rt-rqrVb4XapkxLyahch5KufY9iK-ouevhzdiQUXeuPJT044rgEMGiwA54U4wmjSZOFUvvqcfbpp93465kYdKxWOjUl0OFXfRYWo3ICvn3TdO1BsbvxmLRh3T2IOEyzl8bR1q1X8-E490QSVndJgAwbZ5DGk6qkCLTwQ1sFW73gRg01xOziKpV79rDw4iD5rezXJ2K8z2Zts_iL2xf6O",
        slug: "rose-gold-diamond-bangle",
    },
];


/* ─── Component ─────────────────────────────────────── */
export default function DiamondCollectionPage() {
    const pageRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    // ─── Dynamic data from Supabase ───
    const { products: dbProducts, loading } = useProductsByMaterialType("diamond");

    // Map DB products to display shape
    const displayProducts = useMemo(() => {
        if (dbProducts.length === 0) return FALLBACK_PRODUCTS;
        return dbProducts.map((p: Product) => ({
            id: p.id,
            title: p.title,
            metal: p.material ?? "",
            clarity: p.certification ?? "",
            price: p.price ?? "",
            image: getPrimaryImage(p),
            slug: p.slug,
        }));
    }, [dbProducts]);

    /* ─── Animations ─────────────────────────────────── */
    useGSAP(
        () => {
            if (!pageRef.current) return;
            if (heroRef.current) {
                const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
                tl.from(".hero-badge-d", { scale: 0, opacity: 0, duration: 0.6, ease: "back.out(2)" }, 0.3);
                tl.from(".hero-title-d", { opacity: 0, y: 80, skewY: 2, duration: 1.2 }, 0.5);
                tl.from(".hero-desc-d", { opacity: 0, y: 30, duration: 0.8 }, 0.9);
            }
            // Product cards stagger
            if (gridRef.current) {
                gsap.from(gridRef.current.querySelectorAll(".diamond-card"), {
                    opacity: 0,
                    y: 60,
                    stagger: 0.1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: { trigger: gridRef.current, start: "top 80%" },
                });
            }
        },
        { scope: pageRef }
    );

    return (
        <div ref={pageRef} className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#b3d9ff] selection:text-black">
            <CustomCursor />
            <div className="noise-overlay" />
            <Navbar />

            {/* ═══ Lens Flare BG ═══ */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(circle,rgba(179,217,255,0.08)_0%,transparent_60%)]" />
            </div>

            {/* ═══ Hero Section ═══ */}
            <section
                ref={heroRef}
                className="relative w-full h-[55vh] md:h-[65vh] flex items-center justify-center overflow-hidden"
            >
                {/* Video background */}
                <div className="absolute inset-0">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src="/videos/Gold_necklace_and_earring_set_3a8d946591.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                {/* Animated diamond glow orbs */}
                <div className="hero-animated-bg hero-animated-bg-diamond">
                    <div className="glow-orb glow-orb-1" />
                    <div className="glow-orb glow-orb-2" />
                    <div className="glow-orb glow-orb-3" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-[#0A0A0A] opacity-80" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#b3d9ff]/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
                    <div className="hero-badge-d mb-6 flex justify-center">
                        <span className="px-4 py-1 border border-[#b3d9ff]/30 rounded-full text-[10px] tracking-[0.3em] uppercase text-[#b3d9ff] bg-[#b3d9ff]/5 backdrop-blur-md">
                            Exquisite Rarity
                        </span>
                    </div>
                    <h1
                        className="hero-title-d text-4xl md:text-6xl lg:text-7xl text-white mb-6 tracking-tight"
                        style={{
                            fontFamily: "var(--font-display)",
                            textShadow: "0 0 20px rgba(240,248,255,0.5), 0 0 40px rgba(179,217,255,0.3)",
                        }}
                    >
                        The Celestial Diamond Suite
                    </h1>
                    <p
                        className="hero-desc-d text-gray-300 max-w-xl mx-auto font-light text-sm md:text-lg tracking-wide border-t border-b border-white/10 py-4"
                        style={{ fontFamily: "var(--font-sans)" }}
                    >
                        IGI Certified Brilliance &bull; Ethical &amp; Timeless
                    </p>
                </div>
            </section>

            {/* ═══ Main Content ═══ */}
            <main className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 pb-28 pt-12">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[11px] text-gray-500 uppercase tracking-widest py-8 border-b border-white/5 mb-10" style={{ fontFamily: "var(--font-sans)" }}>
                    <Link href="/" className="hover:text-[#b3d9ff] transition-colors" data-cursor-hover>Home</Link>
                    <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                    <Link href="/collections" className="hover:text-[#b3d9ff] transition-colors" data-cursor-hover>Collections</Link>
                    <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                    <span className="text-[#b3d9ff]">Celestial Diamonds</span>
                </div>

                <div className="flex flex-col gap-12">
                    {/* ─── Products ─── */}
                    <div className="w-full">
                        <div className="flex items-center justify-between mb-10">
                            <span className="text-gray-500 text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-sans)" }}>
                                {displayProducts.length} Masterpieces
                            </span>

                        </div>

                        {/* Product Grid */}
                        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/product/${product.slug}`}
                                    className="diamond-card group relative bg-[#0f0f0f] border border-white/5 p-4 flex flex-col hover:border-[#b3d9ff]/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(179,217,255,0.1)]"
                                    data-cursor-hover
                                >
                                    <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#141414] mb-5">
                                        <img
                                            alt={product.title}
                                            src={product.image}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1s] ease-out opacity-90 group-hover:opacity-100 contrast-125 brightness-90 group-hover:brightness-100"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-t from-black/60 to-transparent" />

                                        {/* IGI Badge */}
                                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#b3d9ff]/20 backdrop-blur-md border border-[#b3d9ff]/30 px-2 py-1 text-[10px] text-[#b3d9ff] uppercase tracking-wider font-bold shadow-[0_0_10px_rgba(179,217,255,0.3)]">
                                            <span className="material-symbols-outlined text-[12px]">diamond</span>
                                            IGI Certified
                                        </div>

                                        {/* Favorite */}
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button className="bg-black/40 backdrop-blur-md border border-white/10 hover:border-[#b3d9ff] hover:text-[#b3d9ff] text-white p-2.5 transition-all">
                                                <span className="material-symbols-outlined text-[18px]">favorite</span>
                                            </button>
                                        </div>

                                        {/* CTA */}
                                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                                            <span className="w-full bg-white text-black py-3 uppercase text-xs font-bold tracking-widest hover:bg-[#b3d9ff] transition-colors shadow-lg flex items-center justify-center">
                                                View Details
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-center">
                                        <h3 className="text-lg text-white group-hover:text-[#b3d9ff] transition-colors cursor-pointer tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
                                            {product.title}
                                        </h3>
                                        <div className="flex items-center justify-center gap-3 text-xs text-gray-400 uppercase tracking-wider" style={{ fontFamily: "var(--font-sans)" }}>
                                            <span>{product.metal}</span>
                                            <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                            <span>{product.clarity}</span>
                                        </div>
                                        <div className="pt-3 pb-1">
                                            <span className="text-white text-xl font-medium tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                                                {product.price}
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
