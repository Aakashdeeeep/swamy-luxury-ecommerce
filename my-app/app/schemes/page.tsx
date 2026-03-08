"use client";

import { useRef, useMemo, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CustomCursor from "../../components/CustomCursor";
import TextReveal from "../../components/TextReveal";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AmbientSound from "../../components/AmbientSound";
import { useSchemes } from "../../lib/hooks";

gsap.registerPlugin(ScrollTrigger);

/* ─── Fallback Scheme Data ───────────────────────────── */
const FALLBACK_SCHEMES = [
    {
        id: "gold-wallet",
        icon: "account_balance_wallet",
        title: "GOLD WALLET",
        description: "Digital gold wallet — buy, store and redeem gold at your convenience.",
        color: "gold",
        expanded: false,
        benefits: ["24/7 Access", "Real-time rates", "Secure vault"],
    },
    {
        id: "weekly-saving",
        icon: "calendar_today",
        title: "WEEKLY SAVING SCHEME",
        description: "Our flagship 12-month weekly saving scheme with zero wastage benefit up to 14%.",
        expanded: true,
        color: "gold",
        benefits: ["Zero wastage up to 14%", "Flexible terms", "Price protection"],
    },
    {
        id: "swamy-11-flexi",
        icon: "savings",
        title: "SWAMY 11 FLEXI",
        description: "Flexible 11-month plan with adjustable installments based on your budget.",
        color: "gold",
        expanded: false,
        benefits: ["Adjustable EMI", "No lock-in", "Bonus on completion"],
    },
    {
        id: "swamy-kuber-gold",
        icon: "monetization_on",
        title: "SWAMY KUBER GOLD",
        description: "Premium monthly gold accumulation with bonus benefits and priority access.",
        color: "gold",
        expanded: false,
        benefits: ["Priority access", "Exclusive designs", "VIP events"],
    },
    {
        id: "swamy-jewel-plus",
        icon: "diamond",
        title: "SWAMY JEWEL PLUS",
        description: "Enhanced savings with additional diamond and gemstone purchase benefits.",
        color: "gold",
        expanded: false,
        benefits: ["Diamond bonus", "Free cleaning", "Gemstone offers"],
    },
    {
        id: "silver-wallet",
        icon: "account_balance_wallet",
        title: "SILVER WALLET",
        description: "Silver savings wallet for pooja items, coins and sterling jewellery.",
        color: "silver",
        expanded: false,
        benefits: ["Low entry point", "Pooja items exchange", "Festival offers"],
    },
];

/* ─── Component ─────────────────────────────────────── */
export default function SchemesPage() {
    const pageRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const schemesRef = useRef<HTMLDivElement>(null);

    // State for interactive accordion
    const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>("weekly-saving");

    // Dynamic data from Supabase
    const { schemes: dbSchemes } = useSchemes();

    const schemes = useMemo(() => {
        if (dbSchemes.length > 0) {
            return dbSchemes.map((s, i) => ({
                id: s.id,
                icon: i === 0 ? "account_balance_wallet" : i === 1 ? "calendar_today" : i === 2 ? "savings" : i === 3 ? "monetization_on" : "diamond",
                title: s.title,
                description: s.description ?? "",
                color: s.title.toLowerCase().includes("silver") ? "silver" : "gold",
                benefits: s.benefits ?? [],
            }));
        }
        return FALLBACK_SCHEMES;
    }, [dbSchemes]);

    const toggleScheme = (id: string) => {
        setExpandedSchemeId(current => current === id ? null : id);
    };

    /* ─── Animations ─────────────────────────────────── */
    useGSAP(
        () => {
            if (!pageRef.current) return;

            // Hero
            if (heroRef.current) {
                const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
                tl.from(".scheme-hero-line", { scaleX: 0, duration: 0.6 }, 0.2);
                tl.from(".scheme-hero-pre", { opacity: 0, y: 20, duration: 0.8 }, 0.3);
                tl.from(".scheme-hero-title", { opacity: 0, y: 60, skewY: 2, duration: 1.2 }, 0.5);
                tl.from(".scheme-hero-desc", { opacity: 0, y: 30, duration: 0.8 }, 0.9);
                tl.from(".scheme-hero-divider", { scaleX: 0, duration: 0.8, ease: "power2.out" }, 1.2);
            }

            // Scheme cards stagger
            if (schemesRef.current) {
                gsap.from(schemesRef.current.querySelectorAll(".scheme-card"), {
                    opacity: 0,
                    y: 50,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: { trigger: schemesRef.current, start: "top 80%" },
                });
            }

            // Floating card animation
            gsap.to(".floating-card", {
                rotateY: 3,
                rotateX: -2,
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            // Coin glow pulse
            gsap.to(".coin-glow", {
                scale: 1.1,
                opacity: 0.3,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        },
        { scope: pageRef }
    );

    return (
        <div ref={pageRef} className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#D4AF37] selection:text-[#050505] relative overflow-x-hidden">
            <CustomCursor />
            <div className="noise-overlay" />
            <Navbar />

            {/* ═══ Ambient Background ═══ */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(183,110,121,0.08)_0%,transparent_60%)]" />
                <div className="absolute top-[-10%] left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#7D1C55]/10 rounded-full blur-[120px]" />
            </div>

            {/* ═══ Hero Section ═══ */}
            <section
                ref={heroRef}
                className="relative z-10 pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center"
            >
                {/* Lens flare glow */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)] rounded-full pointer-events-none opacity-40" />

                <h1 className="relative z-10" style={{ fontFamily: "var(--font-display)" }}>
                    <span className="scheme-hero-pre block text-[#F5F0E6] text-3xl md:text-5xl lg:text-6xl font-normal mb-3">
                        Invest in
                    </span>
                    <span
                        className="scheme-hero-title block text-gold-gradient uppercase tracking-widest text-4xl md:text-6xl lg:text-7xl font-bold"
                        style={{ textShadow: "0 0 20px rgba(212,175,55,0.3)" }}
                    >
                        Elegance
                    </span>
                </h1>
                <p
                    className="scheme-hero-desc text-[#AAA] max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-light relative z-10 mt-6"
                    style={{ fontFamily: "var(--font-sans)" }}
                >
                    Secure your future with Swamy Jewellery&apos;s exclusive savings plans. Build your wealth in gold with zero risk and maximum returns.
                </p>
                <div className="scheme-hero-divider mt-10 flex justify-center relative z-10">
                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60 origin-center" />
                </div>
            </section>

            {/* ═══ Schemes List ═══ */}
            <section ref={schemesRef} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-6">
                {schemes.map((scheme) => {
                    const isExpanded = expandedSchemeId === scheme.id;
                    const isSilver = scheme.color === "silver";
                    const accentColor = isSilver ? "#E5E7EB" : "#D4AF37";

                    return (
                        <div
                            key={scheme.id}
                            className={`scheme-card group relative overflow-hidden rounded-xl transition-all duration-500 cursor-pointer ${isExpanded ? "border border-[#D4AF37]/40 shadow-[0_0_40px_rgba(0,0,0,0.6)]" : "hover:bg-[#1A1A1A]/80 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"}`}
                            onClick={() => toggleScheme(scheme.id)}
                            style={{
                                background: "rgba(18,18,18,0.6)",
                                backdropFilter: "blur(12px)",
                                border: isExpanded ? undefined : `1px solid ${isSilver ? "rgba(255,255,255,0.1)" : "rgba(212,175,55,0.2)"}`,
                            }}
                        >
                            {/* Header */}
                            <div className={`flex items-center justify-between p-6 md:p-8 transition-colors duration-500 ${isExpanded ? "border-b border-[#D4AF37]/10 bg-[#D4AF37]/5" : ""}`}>
                                <div className="flex items-center gap-6">
                                    <div
                                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${isExpanded ? "bg-gradient-to-br from-[#D4AF37] to-[#8A6E24] text-black shadow-lg shadow-[#D4AF37]/20" : ""}`}
                                        style={!isExpanded ? {
                                            background: isSilver ? "rgba(255,255,255,0.05)" : "rgba(212,175,55,0.1)",
                                            border: `1px solid ${isSilver ? "rgba(255,255,255,0.1)" : "rgba(212,175,55,0.3)"}`,
                                            color: accentColor,
                                            boxShadow: isSilver ? "0 0 15px rgba(255,255,255,0.05)" : "0 0 15px rgba(212,175,55,0.1)",
                                        } : undefined}
                                    >
                                        <span className={`material-symbols-outlined text-2xl ${isExpanded ? "font-bold" : ""}`}>{scheme.icon}</span>
                                    </div>
                                    <div>
                                        <h3
                                            className={`transition-all duration-500 ${isExpanded ? "text-xl md:text-2xl font-bold tracking-widest text-gold-gradient" : "text-xl font-semibold tracking-widest text-[#F5F0E6] group-hover:text-[#D4AF37]"}`}
                                            style={{
                                                fontFamily: "var(--font-display)",
                                                color: (!isExpanded && isSilver) ? "#F5F0E6" : undefined,
                                            }}
                                        >
                                            {scheme.title}
                                        </h3>
                                        <p className={`text-xs text-gray-500 mt-1 hidden md:block transition-all duration-500 ${isExpanded ? "opacity-0 h-0 w-0 overflow-hidden m-0" : "opacity-100"}`} style={{ fontFamily: "var(--font-sans)" }}>
                                            {scheme.description}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={`material-symbols-outlined transition-transform duration-500 ${isExpanded ? "text-[#D4AF37] rotate-180" : "text-[#666] group-hover:rotate-90"}`}
                                >
                                    expand_more
                                </span>
                            </div>

                            {/* Expandable Body */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 md:p-10 grid md:grid-cols-2 gap-10 items-center bg-black/40">
                                            {/* Left: Info */}
                                            <div className="space-y-8">
                                                <div className="space-y-4">
                                                    <p className="text-[#E0E0E0] leading-relaxed text-sm md:text-base font-light" style={{ fontFamily: "var(--font-sans)" }}>
                                                        In the twelfth month, customers can utilize the total accumulated sum to buy jewellery based on the amount as applicable,{" "}
                                                        <span className="text-[#D4AF37] font-medium">without incurring wastage</span> (up to 14%).
                                                    </p>
                                                    <p className="text-[#E0E0E0] leading-relaxed text-sm md:text-base font-light" style={{ fontFamily: "var(--font-sans)" }}>
                                                        The gold rate on the day of purchase will be applicable when buying jewellery upon scheme completion.
                                                    </p>
                                                </div>
                                                <div className="space-y-4 pt-2">
                                                    {[
                                                        "Flexible payment duration extension available",
                                                        "Pay difference if price exceeds accumulated amount",
                                                    ].map((benefit) => (
                                                        <div key={benefit} className="flex items-center gap-4 group/item">
                                                            <span className="material-symbols-outlined text-[#D4AF37] text-xl group-hover/item:scale-110 transition-transform flex-shrink-0">verified</span>
                                                            <span className="text-sm text-[#E0E0E0] group-hover/item:text-white transition-colors" style={{ fontFamily: "var(--font-sans)" }}>
                                                                {benefit}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <a
                                                    href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi, I'm interested in the ${scheme.title} scheme. Could you share more details?`)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-full mt-6 bg-gradient-to-r from-[#5D1645] to-[#3a0d2a] hover:from-[#6B1D4C] hover:to-[#4a1136] text-white py-4 px-6 rounded-lg font-medium tracking-wide transition-all duration-300 shadow-lg shadow-[#5D1645]/30 border border-[#D4AF37]/20 flex items-center justify-center gap-3 group/btn uppercase text-sm"
                                                >
                                                    <span style={{ fontFamily: "var(--font-sans)" }}>Enquire About This Scheme</span>
                                                    <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                                                </a>
                                            </div>

                                            {/* Right: Premium Card Visual */}
                                            <div className="relative group/card perspective-[1000px]">
                                                <div className="absolute -inset-4 bg-[#D4AF37] opacity-10 blur-xl rounded-full group-hover/card:opacity-20 transition-opacity duration-500" />
                                                <div className="floating-card relative w-full aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl border border-[#D4AF37]/30" style={{ transformStyle: "preserve-3d" }}>
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[#4a0e35] via-[#2d0820] to-[#1a0512]" />
                                                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#D4AF37]/5 to-transparent opacity-50" />
                                                    <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full border border-[#D4AF37]/20 opacity-30" />
                                                    <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full border border-[#D4AF37]/10 opacity-30" />

                                                    <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <div className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] mb-2 border-b border-[#D4AF37]/30 pb-1 inline-block" style={{ fontFamily: "var(--font-sans)" }}>
                                                                    Premium Plan
                                                                </div>
                                                                <div style={{ fontFamily: "var(--font-display)" }} className="text-2xl md:text-3xl text-white font-medium leading-none mt-1 drop-shadow-md">
                                                                    Savings<br />
                                                                    <span className="font-light italic text-[#D4AF37]">Scheme</span>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-[10px] text-white/80 uppercase tracking-widest" style={{ fontFamily: "var(--font-display)" }}>
                                                                    Swamy Jewellery
                                                                </div>
                                                                <div className="w-8 h-8 rounded-full border border-[#D4AF37] flex items-center justify-center ml-auto mt-2 bg-black/30 backdrop-blur-sm">
                                                                    <span className="material-symbols-outlined text-[#D4AF37] text-sm">diamond</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between items-end">
                                                            <div className="text-white/30 font-mono text-xs tracking-[0.2em]">•••• •••• •••• 8842</div>
                                                            <a
                                                                href={`https://wa.me/919876543210?text=${encodeURIComponent("Hi, I'd like to join the Weekly Savings scheme at Swamy Jewellery.")}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="bg-gradient-to-r from-[#D4AF37] via-[#FBF5B7] to-[#B38728] text-[#2d0820] font-bold py-2 px-5 rounded-full text-xs shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 transition-transform border border-white/20 uppercase tracking-wider"
                                                            >
                                                                Join Now
                                                            </a>
                                                        </div>
                                                    </div>

                                                    {/* Shine sweep removed to prevent rectangular light effect */}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </section>

            {/* ═══ WhatsApp FAB ═══ */}
            <div className="fixed bottom-6 right-6 z-50">
                <a
                    href="https://wa.me/919876543210?text=Hi%2C%20I%27m%20interested%20in%20Swamy%20Jewellery%20savings%20schemes."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20b858] text-white rounded-full py-3 px-6 shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] hover:-translate-y-1 transition-all duration-300 border border-[#25D366]/50"
                >
                    <span className="bg-white text-[#25D366] rounded-full p-1.5 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                    </span>
                    <span className="font-medium tracking-wide text-sm" style={{ fontFamily: "var(--font-sans)" }}>Enquire on WhatsApp</span>
                </a>
            </div>

            <div className="gold-divider mx-auto max-w-7xl mt-12" />
            <Footer />
        </div>
    );
}
