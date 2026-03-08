"use client";

import { useRef, useMemo } from "react";
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
        title: "Lakshmi Coin Set",
        detail: "999 Fine Silver • 10g x 5",
        price: "₹ 4,850",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-fbbNVsP1AaRHnZm2zXYWEq8l0aoQFCQYnIFQCo9w-g6f7W1pPNW3spk7v_z2HSAfLXCnzpKyznTJ3SVr8ir099PWfnHyVnyTMGAFg2rhJzyEskcWWDAJ853Jrp1YQ7a6vEHRzysgKZOsM_3nJ9eZ7-0VcmGfVl-v-9qPDoHxhE4Bfx0WvNiiylqN7xxjPb36EHRxJiU-GP-LluNQbnP-3GEHjyvHE6BbdNtoYVAYleUDPCX1_J60pPlAl_QfH1mo4a837ern_Ydd",
        slug: "lakshmi-coin-set",
    },
    {
        id: "2",
        title: "Temple Diya Pair",
        detail: "Antique Finish • 85g",
        price: "₹ 7,200",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZ92Aef5f1bfPNKUBwi_S8GmdxAUTQ5izAqHdm4ORcqPaRb53PVktUXdWhdUnceU2-DCXW8PPVFow1iPFtTGxcgZRAVzKnDud5Gj4_xhGQQejfzJ940iY8sc-P74QpUZOJEO5SdGjI0rgM_NqYqYY98kIsTkbTzJEgW58y-ndOu0y53Vq9nvq_cMXOXxs3_pA0hkGb1_GuvYvoaU-sQmvB3z9b-C8-AiaVlXVz-ii2KUGOXvTS2lE2xgpMZAg0MYy0aO6isMStw24I",
        slug: "temple-diya-pair",
    },
    {
        id: "3",
        title: "Bridal Anklets",
        detail: "92.5 Sterling • Stones",
        price: "₹ 3,400",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKMq9ue4DRkB_dsoGhawlMvBs8lITdB2YW8UDCVWsneh_ZBojJA8kllI78rt-rqrVb4XapkxLyahch5KufY9iK-ouevhzdiQUXeuPJT044rgEMGiwA54U4wmjSZOFUvvqcfbpp93465kYdKxWOjUl0OFXfRYWo3ICvn3TdO1BsbvxmLRh3T2IOEyzl8bR1q1X8-E490QSVndJgAwbZ5DGk6qkCLTwQ1sFW73gRg01xOziKpV79rDw4iD5rezXJ2K8z2Zts_iL2xf6O",
        slug: "bridal-anklets",
    },
    {
        id: "4",
        title: "Royal Thali Set",
        detail: "99% Purity • 450g",
        price: "₹ 42,500",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYAheP_OHJBQYuIBQ-4KKG3qsc5MxirFQwWMtodLbuuvWlRBO7aHsYwgc1JD2eD4RjIwRjPifOnvm2l0mdAGSy6PiCdvGmWWKX5WLmKrDIa9RW0PCxCNkhgOYHMXibA5nhs9H7M-vBj8V9RLWL-cQfhKldcBZ-7Ap_dFPoavGzIkQY8yFH_2-OfyjM5Ios6rFB0p1LWA8dG6bq5IJh-ITKOojC__WEbqZp3ungCVFaP36VFf6Dftd7ziF88uQtY6OF0p-XDUB77b-v",
        slug: "royal-thali-set",
    },
    {
        id: "5",
        title: "Minimalist Cuff",
        detail: "92.5 Sterling • Matte",
        price: "₹ 2,800",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvog6ZZH-PHDY3R8jybSZOQkPJMnclPD8MGN7bmNxlmqdeq6gbxV7dMMqToRpEsvqZh74RxLxgQsP1gy299OF9xyWmSq27RQMEruxFFuYfYWL_Vld9vZwU0XDkauw4M_ysiYUb0j0UXsVU4Kui55_vXHr_hmBby3NbwW4_GmqlkstDddfBD0M_d3v9w9zWoLWsHncEfhQkfy00g-aJjAEcWQcN-kMnuVUOy6XjigKfbWDOfS3YJb8wcnE6JikXEMKnfenqaAu5Voud",
        slug: "minimalist-cuff",
    },
    {
        id: "6",
        title: "Ganesha Idol",
        detail: "Solid Silver • 120g",
        price: "₹ 10,500",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkC7JTemP6ITfoh7QaqyGEWh3su1zOM7RihpGm_djaRMj2EWLfwGvRgIgvHpfioIA2xdsl9772jEMN1MnpnyLs7OOVF-kJLg2B-ALxzGA6uZSMjO5Hyd8zzIsLb3VyZEL_r5s0JmExh0d8Xx7tkX2eeTzSUnu5KPIsXqMzsYJnSHpvK7uZ9iOpTyUquIzNoCR9FScshc3rLTd7ke1gRZ3W90v-_KBCPoksrkpHYE_UfBeXO5KpEb2xckYM0MY-riW4QkyflnSyWA4_",
        slug: "ganesha-idol",
    },
];


/* ─── Component ─────────────────────────────────────── */
export default function SilverCollectionPage() {
    const pageRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    // ─── Dynamic data from Supabase ───
    const { products: dbProducts, loading } = useProductsByMaterialType("silver");

    // Map DB products to display shape
    const displayProducts = useMemo(() => {
        if (dbProducts.length === 0) return FALLBACK_PRODUCTS;
        return dbProducts.map((p: Product) => ({
            id: p.id,
            title: p.title,
            detail: [p.material, p.weight].filter(Boolean).join(" • "),
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
                tl.from(".hero-badge-s", { scale: 0, opacity: 0, duration: 0.6, ease: "back.out(2)" }, 0.3);
                tl.from(".hero-title-s", { opacity: 0, y: 80, skewY: 2, duration: 1.2 }, 0.5);
                tl.from(".hero-line-s", { scaleX: 0, duration: 0.8, ease: "power2.out" }, 1.0);
                tl.from(".hero-desc-s", { opacity: 0, y: 30, duration: 0.8 }, 1.2);
            }
            // Cards stagger
            if (gridRef.current) {
                gsap.from(gridRef.current.querySelectorAll(".silver-card"), {
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
        <div ref={pageRef} className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#C0C0C0] selection:text-black">
            <CustomCursor />
            <div className="noise-overlay" />
            <Navbar />

            {/* ═══ Hero Section ═══ */}
            <section
                ref={heroRef}
                className="relative w-full h-[50vh] md:h-[65vh] flex items-center justify-center overflow-hidden"
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
                        <source src="/videos/A_gentle_very_slow_camera_pushin_towards_the_cente_b226a13a4e.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/55" />
                </div>
                {/* Animated silver glow orbs */}
                <div className="hero-animated-bg hero-animated-bg-silver">
                    <div className="glow-orb glow-orb-1" />
                    <div className="glow-orb glow-orb-2" />
                    <div className="glow-orb glow-orb-3" />
                </div>
                {/* Ambient glow */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#C0C0C0]/5 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#C0C0C0]/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
                    <span
                        className="hero-badge-s text-[#E5E5E5]/80 text-xs md:text-sm tracking-[0.4em] uppercase mb-6 block font-medium"
                        style={{ fontFamily: "var(--font-sans)" }}
                    >
                        Timeless Elegance
                    </span>
                    <h1
                        className="hero-title-s text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 mb-6 tracking-tight"
                        style={{
                            fontFamily: "var(--font-display)",
                            filter: "drop-shadow(0 0 15px rgba(255,255,255,0.1))",
                        }}
                    >
                        The Pure Silver Archive
                    </h1>
                    <div className="hero-line-s w-24 h-px bg-gradient-to-r from-transparent via-[#C0C0C0] to-transparent mx-auto mb-6 origin-center" />
                    <p
                        className="hero-desc-s text-gray-400 max-w-xl mx-auto font-light text-sm md:text-base tracking-wide"
                        style={{ fontFamily: "var(--font-sans)" }}
                    >
                        92.5 Sterling &amp; Pure Pooja Silver. Handcrafted for divinity and grace.
                    </p>
                </div>
            </section>

            {/* ═══ Main Content ═══ */}
            <main className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 pb-28 pt-12">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[11px] text-gray-500 uppercase tracking-widest py-8 border-b border-white/5 mb-10" style={{ fontFamily: "var(--font-sans)" }}>
                    <Link href="/" className="hover:text-[#C0C0C0] transition-colors" data-cursor-hover>Home</Link>
                    <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                    <Link href="/collections" className="hover:text-[#C0C0C0] transition-colors" data-cursor-hover>Collections</Link>
                    <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                    <span className="text-[#E5E5E5]">Pure Silver</span>
                </div>

                <div className="flex flex-col gap-12">
                    {/* ─── Products ─── */}
                    <div className="w-full">
                        <div className="flex items-center justify-between mb-10">
                            <span className="text-gray-500 text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-sans)" }}>
                                {displayProducts.length} Exquisite Items
                            </span>

                        </div>

                        {/* Product Grid */}
                        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/product/${product.slug}`}
                                    className="silver-card group relative flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)]"
                                    data-cursor-hover
                                >
                                    <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#151515] mb-5 border border-white/5">
                                        <img
                                            alt={product.title}
                                            src={product.image}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1s] ease-in-out opacity-90 group-hover:opacity-100 filter grayscale-[20%] group-hover:grayscale-0"
                                            loading="lazy"
                                        />
                                        <div className="absolute top-4 left-4 bg-gradient-to-r from-gray-200 to-white text-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                            Pure Silver
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                        {/* CTA */}
                                        <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/5 backdrop-blur-md border-t border-white/10">
                                            <span className="w-full text-white text-xs uppercase tracking-widest font-bold py-2 hover:text-[#C0C0C0] transition-colors flex items-center justify-center gap-2">
                                                <span className="material-symbols-outlined text-[16px]">visibility</span>
                                                View Details
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-center group-hover:text-[#E5E5E5] transition-colors">
                                        <h3 className="text-xl text-white tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
                                            {product.title}
                                        </h3>
                                        <div className="text-xs text-gray-400 font-light uppercase tracking-widest" style={{ fontFamily: "var(--font-sans)" }}>
                                            {product.detail}
                                        </div>
                                        <div className="text-lg font-medium text-white mt-1">{product.price}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>


                    </div>
                </div>
            </main>

            {/* WhatsApp FAB */}
            <div className="fixed bottom-8 right-8 z-50">
                <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all hover:scale-110 flex items-center justify-center"
                >
                    <span className="material-symbols-outlined text-3xl">chat</span>
                </a>
            </div>

            <div className="gold-divider mx-auto max-w-7xl" />
            <Footer />
        </div>
    );
}
