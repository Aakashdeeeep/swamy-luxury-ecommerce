"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import JewelryAntigravityScroll from "../components/JewelryAntigravityScroll";
import TextOverlays from "../components/TextOverlays";
import Preloader from "../components/Preloader";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ParticlesOverlay from "../components/ParticlesOverlay";
import HorizontalCollections from "../components/HorizontalCollections";
import AboutTimeline from "../components/AboutTimeline";
import ProductCard from "../components/ProductCard";
import TextReveal from "../components/TextReveal";
import CustomCursor from "../components/CustomCursor";
import LiveRatesCard from "../components/LiveRatesCard";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useProducts, getPrimaryImage } from "../lib/hooks";

gsap.registerPlugin(ScrollTrigger);

/* ─── Fallback signature products ───────────────────── */
const FALLBACK_SIGNATURE = [
    { title: "Kashi Temple Mangalsutra", category: "Gold 22K • Antique Finish", imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBB2hEfHaAS8i1kEzJtu-YVI-wZVb_b47afmVFx-jWsv11ZC-6ynIknyvhhrTFlijHulX4innZIxi89rVotc7ZriZCK8zmN8Q7e96CucpOuif6yAObtN0FWfIhW1BqGT974kqLBJq_gB1OSDbG9S1bkLaFe6gmCyRW7mquElxScFqNCD_FK2MlpN4gmoIe9MhsTpH9DA4ZJDMbOxoGh1X0cYIx-XaHZs-_jM_O6B6wTV_10mszyd0prHiI9KxTk9in_1cJ4szmZDhUm", badge: "Best Seller", slug: "kashi-temple-mangalsutra" },
    { title: "Coimbatore Heritage Necklace", category: "Traditional Kemp Stones", imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOGeYbZx_FxpvTFUwgfhmaSdDtGwKnkZ3x_AVaPoFmjgHk8IZLz9ldLGUR6J4J1bNFW63YUsQ_t0ebpM1k0kFNw2npDGJj_1apDqNfOSN5WNFUfYQBDE55P9-_mtDwSH19OcoqpK2nbhCegsRNZFdk1uMsn3RcPvH3ZAYdLXCkCWbYsUqNK_sjHK9bsQm-lw1h9oXti-qfLgBkIy-sEypHshe_uJMO_ST9gtvD-1qdXSFiduS3iiAeBMG9ZPJ_J78tioyIobxDY0RK", badge: "", slug: "coimbatore-heritage-necklace" },
    { title: "Vadavalli Bridal Set", category: "Diamond & Platinum", imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvE0P_ptXrgxuPMTvLy-qka3RmdMqOtsupmO9MWhCICTMnkA6LhEqPEy8JwEHrorEaimJaRmK4-h9_2MKYUUgdV1RFKlk84LWlm9NU9NkQ4LJwiM54mo54L2G9Ppyi2ElDFIViFIPCV3RjaHX2nUmTKjAkUQ7aBkC9_Di22yPGKT5bbgKzyZUeRjs6LLYeo8JKqqGvTuiZFbyGFqxfUQeW6ifzM-n8JhQrf-VUGo22OWtrRYrGyZMoMZnjx2k-OYaBstl0-gIKgFPq", badge: "New Arrival", slug: "vadavalli-bridal-set" },
];

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const signatureRef = useRef<HTMLElement>(null);
    const savingsRef = useRef<HTMLElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const holoRef = useRef<HTMLDivElement>(null);

    // Dynamic products from Supabase (take first 3 for signature section)
    const { products: dbProducts } = useProducts();
    const signatureProducts = useMemo(() => {
        if (dbProducts.length > 0) {
            return dbProducts.slice(0, 3).map((p, i) => ({
                title: p.title,
                category: p.material ?? (p.category?.name ?? ""),
                imageSrc: getPrimaryImage(p) ?? "",
                badge: p.badge ?? "",
                slug: p.slug,
            }));
        }
        return FALLBACK_SIGNATURE;
    }, [dbProducts]);

    useGSAP(() => {
        // --- Signature Collection Section ---
        if (signatureRef.current) {
            gsap.fromTo(
                ".sig-card",
                { clipPath: "inset(100% 0 0 0)", opacity: 0 },
                {
                    clipPath: "inset(0% 0 0 0)",
                    opacity: 1,
                    stagger: 0.15,
                    duration: 1.5,
                    ease: "power4.out",
                    scrollTrigger: { trigger: ".sig-card", start: "top 85%" },
                }
            );

            gsap.fromTo(
                ".sig-card-inner",
                { rotateX: -15, transformOrigin: "bottom center" },
                {
                    rotateX: 0,
                    stagger: 0.15,
                    duration: 1.5,
                    ease: "power4.out",
                    scrollTrigger: { trigger: ".sig-card", start: "top 85%" },
                }
            );
        }

        // --- Smart Savings Section ---
        if (savingsRef.current) {
            gsap.fromTo(
                ".savings-text > *",
                { y: 60, opacity: 0, clipPath: "inset(100% 0 0 0)" },
                {
                    y: 0,
                    opacity: 1,
                    clipPath: "inset(0% 0 0 0)",
                    stagger: 0.2,
                    duration: 1.5,
                    ease: "expo.out",
                    scrollTrigger: { trigger: savingsRef.current, start: "top 70%" },
                }
            );

            const card = cardRef.current;
            if (card) {
                gsap.fromTo(
                    card,
                    { opacity: 0, x: 120, rotateY: -20, scale: 0.9 },
                    {
                        opacity: 1,
                        x: 0,
                        rotateY: 0,
                        scale: 1,
                        duration: 2,
                        ease: "expo.out",
                        scrollTrigger: { trigger: card, start: "top 80%" },
                    }
                );

                const holo = holoRef.current;
                const handleMouseMove = (e: MouseEvent) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * -10;
                    const rotateY = ((x - centerX) / centerX) * 10;

                    gsap.to(card, {
                        rotateX,
                        rotateY,
                        duration: 0.5,
                        ease: "power2.out",
                        transformPerspective: 1000,
                    });

                    if (holo) {
                        const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
                        holo.style.background = `conic-gradient(
                            from ${angle}deg at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%,
                            rgba(212,175,53,0.12),
                            rgba(125,28,85,0.12),
                            rgba(212,175,53,0.08),
                            rgba(255,255,255,0.06),
                            rgba(212,175,53,0.12)
                        )`;
                    }
                };

                const handleMouseLeave = () => {
                    gsap.to(card, {
                        rotateX: 0,
                        rotateY: 0,
                        duration: 1.2,
                        ease: "elastic.out(1, 0.4)",
                    });
                    if (holo) {
                        holo.style.background = "transparent";
                    }
                };

                card.addEventListener("mousemove", handleMouseMove);
                card.addEventListener("mouseleave", handleMouseLeave);
            }

            gsap.to(".savings-shimmer", {
                x: "200%",
                duration: 3,
                repeat: -1,
                repeatDelay: 5,
                ease: "power2.inOut",
            });

            gsap.to(".savings-glow", {
                boxShadow: "0 0 80px rgba(212,175,53,0.1), 0 0 150px rgba(80,18,55,0.08)",
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        }
    });

    return (
        <main className="min-h-screen bg-[#050505] selection:bg-[#D4AF37] selection:text-[#050505]">
            <CustomCursor />

            {/* Film grain noise overlay */}
            <div className="noise-overlay" />

            <AnimatePresence>
                {isLoading && (
                    <Preloader onLoadingComplete={() => setIsLoading(false)} />
                )}
            </AnimatePresence>

            <Navbar />

            {/* Hero — Antigravity Core Experience */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 1.2, delay: 0.5 }}
                className="relative bg-[#050505] z-10"
            >
                <ParticlesOverlay />
                <JewelryAntigravityScroll frameCount={40} />
                <TextOverlays />
            </motion.section>

            {/* Main Content */}
            <div className="relative z-20">
                <HorizontalCollections />

                {/* Cinematic Interlude */}
                <section className="relative w-full h-[80vh] overflow-hidden">
                    {/* Video background */}
                    <div className="absolute inset-0">
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                        >
                            <source src="/videos/Antique_gold_necklace_with_gems_6680c49b37.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-black/60" />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,53,0.06)_0%,transparent_70%)]" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                        <span
                            className="text-xs text-[#C9B06B]/60 uppercase tracking-[0.5em] mb-6 block"
                            style={{ fontFamily: "var(--font-sans)" }}
                        >
                            Experience the Craft
                        </span>
                        <h2
                            className="text-3xl md:text-5xl lg:text-7xl text-white/90 max-w-3xl mb-8 leading-[1.1] font-light"
                            style={{ fontFamily: "var(--font-editorial)" }}
                        >
                            Where Tradition Meets{" "}
                            <span className="text-gold-gradient italic">Brilliance</span>
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#C9B06B]/25" />
                            <div className="w-1 h-1 rounded-full bg-[#D4AF37]/40" />
                            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#C9B06B]/25" />
                        </div>
                    </div>
                </section>

                {/* Gold divider */}
                <div className="gold-divider mx-auto max-w-7xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/40" />
                </div>

                {/* Signature Collection Section */}
                <section ref={signatureRef} className="section-ceremonial bg-surface-dark relative overflow-hidden">
                    <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(212,175,53,0.02)_0%,transparent_70%)] pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
                        <div className="text-center mb-24 overflow-hidden">
                            <TextReveal
                                as="span"
                                split="chars"
                                className="text-[#C9B06B]/50 text-[10px] uppercase tracking-[0.5em] mb-5 block"
                                stagger={0.05}
                                duration={1.2}
                                triggerStart="top 80%"
                            >
                                Masterpieces
                            </TextReveal>
                            <TextReveal
                                as="h2"
                                split="chars"
                                className="text-4xl md:text-6xl lg:text-7xl text-white mb-8 font-light"
                                stagger={0.03}
                                duration={1.8}
                                triggerStart="top 80%"
                                style={{ fontFamily: "var(--font-editorial)" }}
                            >
                                Signature Collection
                            </TextReveal>

                            {/* Gold separator */}
                            <div className="flex items-center justify-center gap-4 mb-8">
                                <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#C9B06B]/20" />
                                <div className="w-1 h-1 rounded-full bg-[#D4AF37]/35" />
                                <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#C9B06B]/20" />
                            </div>

                            <TextReveal
                                as="p"
                                split="words"
                                className="text-gray-400 font-light max-w-xl mx-auto text-base leading-relaxed"
                                stagger={0.06}
                                duration={1.5}
                                triggerStart="top 80%"
                            >
                                Handpicked exclusively for the connoisseurs of fine art in Vadavalli
                            </TextReveal>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: "1200px" }}>
                            {signatureProducts.map((p, i) => (
                                <div key={p.slug ?? i} className="sig-card">
                                    <div className="sig-card-inner" style={{ transformStyle: "preserve-3d" }}>
                                        <ProductCard
                                            isFirst={i % 2 === 0}
                                            title={p.title}
                                            category={p.category}
                                            imageSrc={p.imageSrc}
                                            badge={p.badge || undefined}
                                            slug={p.slug}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* View All editorial link */}
                        <div className="text-center mt-16">
                            <Link
                                href="/collections"
                                className="inline-flex items-center gap-4 text-[#C9B06B]/70 hover:text-[#C9B06B] text-sm uppercase tracking-[0.3em] transition-all duration-500 group"
                                data-cursor-hover
                                style={{ fontFamily: "var(--font-sans)" }}
                            >
                                <div className="w-10 h-px bg-[#C9B06B]/30 group-hover:w-16 transition-all duration-500" />
                                View All Collections
                                <div className="w-10 h-px bg-[#C9B06B]/30 group-hover:w-16 transition-all duration-500" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Gold divider */}
                <div className="gold-divider mx-auto max-w-7xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/40" />
                </div>

                <AboutTimeline />

                {/* Gold divider */}
                <div className="gold-divider mx-auto max-w-7xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/40" />
                </div>

                {/* Live Metal Rates Section */}
                <section className="py-28 bg-[#0A0A0A] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(212,175,53,0.02)_0%,transparent_70%)] pointer-events-none" />
                    <div className="max-w-4xl mx-auto px-4 lg:px-8">
                        <div className="text-center mb-16">
                            <TextReveal
                                as="span"
                                split="chars"
                                className="text-[#C9B06B]/50 text-[10px] uppercase tracking-[0.5em] mb-5 block"
                                stagger={0.05}
                                duration={1.2}
                                triggerStart="top 80%"
                            >
                                Today&apos;s Rates
                            </TextReveal>
                            <TextReveal
                                as="h2"
                                split="words"
                                className="text-3xl md:text-5xl text-white mb-5 font-light"
                                stagger={0.08}
                                duration={1.8}
                                triggerStart="top 80%"
                                style={{ fontFamily: "var(--font-editorial)" }}
                            >
                                Live Gold &amp; Silver Prices
                            </TextReveal>
                            <p className="text-gray-400 text-base font-light max-w-lg mx-auto" style={{ fontFamily: "var(--font-sans)" }}>
                                Real-time precious metal rates so you always know the true value of your investment.
                            </p>
                        </div>
                        <LiveRatesCard />
                    </div>
                </section>

                {/* Smart Savings Section */}
                <section ref={savingsRef} className="section-ceremonial bg-[#080808] relative overflow-hidden">
                    <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(45,15,32,0.15)_0%,transparent_70%)] pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <div className="savings-text space-y-8">
                                <TextReveal
                                    as="h2"
                                    split="words"
                                    className="text-3xl md:text-5xl lg:text-6xl text-white font-light"
                                    stagger={0.08}
                                    duration={1.8}
                                    triggerStart="top 75%"
                                    style={{ fontFamily: "var(--font-editorial)" }}
                                >
                                    Smart Savings Golden Future
                                </TextReveal>

                                <p
                                    className="text-gray-400 font-light text-base leading-relaxed"
                                    style={{ fontFamily: "var(--font-sans)" }}
                                >
                                    In the twelfth month, customers can utilize the total accumulated sum to
                                    buy jewellery based on the amount as applicable,{" "}
                                    <span className="text-[#C9B06B] font-medium">without incurring wastage</span>{" "}
                                    (up to 14%).
                                </p>

                                <div className="space-y-4">
                                    {[
                                        "Flexible payment duration extension available",
                                        "Pay difference if price exceeds accumulated amount",
                                    ].map((text, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-[#C9B06B] text-lg mt-0.5">
                                                shield
                                            </span>
                                            <p
                                                className="text-base text-gray-400 font-light"
                                                style={{ fontFamily: "var(--font-sans)" }}
                                            >
                                                {text}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href="/schemes"
                                    className="luxury-cta mt-4 group"
                                    data-cursor-hover
                                >
                                    View Detailed Scheme
                                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform duration-300">
                                        arrow_forward
                                    </span>
                                </Link>
                            </div>

                            <div
                                ref={cardRef}
                                className="relative group savings-glow"
                                style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                            >
                                {/* <div className="absolute inset-0 bg-[#2D0F20] rounded-2xl blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity duration-700" /> */}
                                <div className="relative w-full aspect-[1.58/1] rounded-2xl overflow-hidden bg-gradient-to-br from-[#1A0812] to-[#0D0709] border border-[#6B2345]/10 p-8 flex flex-col justify-between shadow-2xl">
                                    {/* Holographic overlay */}
                                    <div
                                        ref={holoRef}
                                        className="absolute inset-0 rounded-2xl pointer-events-none transition-[background] duration-300 z-[2]"
                                    />
                                    {/* Shimmer overlay */}
                                    <div className="savings-shimmer absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full pointer-events-none z-[3]" />

                                    <div className="flex justify-between items-start relative z-10">
                                        <div>
                                            <p
                                                className="text-[11px] uppercase tracking-[0.25em] text-[#C9B06B]/60 mb-3"
                                                style={{ fontFamily: "var(--font-sans)" }}
                                            >
                                                Exclusive Membership
                                            </p>
                                            <h3 className="text-4xl text-white font-light" style={{ fontFamily: "var(--font-editorial)" }}>
                                                Weekly
                                                <br />
                                                <span className="italic text-[#C9B06B]">Savings</span>
                                            </h3>
                                        </div>
                                        <div className="text-right">
                                            <p
                                                className="text-[11px] uppercase tracking-[0.15em] text-white/25 mb-2"
                                                style={{ fontFamily: "var(--font-sans)" }}
                                            >
                                                Swamy Jewellery
                                            </p>
                                            <div className="w-10 h-10 rounded-full border border-[#C9B06B]/20 flex items-center justify-center text-[#C9B06B]/60">
                                                <span className="material-symbols-outlined text-sm">diamond</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between z-10 relative">
                                        <div
                                            className="text-white/20 text-sm tracking-[0.3em] font-mono"
                                        >
                                            •••• •••• •••• 8842
                                        </div>
                                        <Link
                                            href="/schemes"
                                            className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#C9B06B] text-[#050505] font-semibold text-xs uppercase tracking-[0.2em] rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-shadow duration-500"
                                            data-cursor-hover
                                        >
                                            Apply for Membership
                                        </Link>
                                    </div>

                                    {/* Decorative circles */}
                                    <div className="absolute top-0 right-0 w-64 h-64 border border-white/[0.02] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                                    <div className="absolute top-0 right-0 w-80 h-80 border border-white/[0.02] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </main >
    );
}
