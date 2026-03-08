"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { LivePriceTicker } from "./LiveRatesCard";
import gsap from "gsap";

export default function Navbar() {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuLinksRef = useRef<HTMLDivElement>(null);
    const menuContactRef = useRef<HTMLDivElement>(null);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 300) {
            setHidden(true);
        } else {
            setHidden(false);
        }
        setHasScrolled(latest > 50);
    });

    // Staggered GSAP animation for menu links
    useEffect(() => {
        if (!menuLinksRef.current || !menuContactRef.current) return;

        const links = menuLinksRef.current.querySelectorAll(".menu-link");
        const contactItems = menuContactRef.current.querySelectorAll(".menu-contact-item");

        if (menuOpen) {
            gsap.fromTo(
                links,
                { y: 80, opacity: 0, rotateX: -15 },
                {
                    y: 0,
                    opacity: 1,
                    rotateX: 0,
                    stagger: 0.08,
                    duration: 1,
                    delay: 0.3,
                    ease: "expo.out",
                }
            );
            gsap.fromTo(
                contactItems,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.06,
                    duration: 0.8,
                    delay: 0.6,
                    ease: "expo.out",
                }
            );
        }
    }, [menuOpen]);

    const collectionLinks = [
        {
            name: "Gold",
            sub: "Royal Collections",
            href: "/collections/gold",
            accent: "#D4AF37",
            bg: "from-[#1a1208] via-[#0f0b04] to-[#050505]",
            icon: "workspace_premium",
        },
        {
            name: "Diamond",
            sub: "Celestial Series",
            href: "/collections/diamond",
            accent: "#b3d9ff",
            bg: "from-[#080e18] via-[#050b14] to-[#050505]",
            icon: "diamond",
        },
        {
            name: "Silver",
            sub: "Pure Archive",
            href: "/collections/silver",
            accent: "#C0C0C0",
            bg: "from-[#111111] via-[#0a0a0a] to-[#050505]",
            icon: "auto_awesome",
        },
    ];

    const navLinks = [
        { name: "Schemes", href: "/schemes" },
        { name: "Our Story", href: "/our-story" },
    ];

    return (
        <>
            <motion.header
                variants={{
                    visible: { y: 0 },
                    hidden: { y: "-100%" },
                }}
                animate={hidden ? "hidden" : "visible"}
                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${hasScrolled
                    ? "bg-[#050505]/90 backdrop-blur-xl shadow-[0_1px_0_rgba(212,175,53,0.1)]"
                    : "bg-gradient-to-b from-[#050505]/80 via-[#050505]/40 to-transparent"
                    }`}
            >
                {/* Gold accent line when scrolled */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hasScrolled ? 1 : 0 }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent origin-center"
                />

                <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 md:h-24 flex items-center justify-between">
                    {/* Left: Hamburger & Search */}
                    <div className="flex items-center gap-6 w-1/3">
                        <button
                            onClick={() => setMenuOpen(true)}
                            className="hidden md:flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-300 group"
                            data-cursor-hover
                        >
                            <Menu className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" strokeWidth={1.5} />
                            <span className="text-[10px] uppercase tracking-[0.2em] group-hover:tracking-[0.3em] transition-all duration-300">Menu</span>
                        </button>

                        <button
                            onClick={() => setMenuOpen(true)}
                            className="md:hidden text-white/80 hover:text-white"
                        >
                            <Menu className="w-5 h-5" strokeWidth={1.5} />
                        </button>

                        <button className="hidden md:block text-white/60 hover:text-white transition-colors duration-300" data-cursor-hover>
                            <Search className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Center: Brand Name & Home Link */}
                    <div className="flex justify-center w-1/3 relative group">
                        <Link
                            href="/"
                            className="text-gold-gradient text-xl md:text-2xl tracking-[0.35em] uppercase font-light hover:tracking-[0.45em] transition-all duration-500"
                            style={{ fontFamily: "var(--font-editorial)" }}
                            data-cursor-hover
                        >
                            Swamy
                        </Link>
                        {/* Tooltip to clarify it goes Home */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white/50 tracking-widest pointer-events-none">
                            BACK TO HOME
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center justify-end gap-4 w-1/3">
                        <div className="hidden lg:block">
                            <LivePriceTicker />
                        </div>
                        <Link
                            href="/our-story#appointment"
                            className="hidden md:block text-[10px] uppercase tracking-[0.2em] text-white/60 hover:text-[#D4AF37] transition-colors duration-300 animated-underline"
                            data-cursor-hover
                        >
                            Book Appointment
                        </Link>
                        <Link
                            href="/collections"
                            className="text-white/70 hover:text-white transition-colors duration-300 relative"
                            data-cursor-hover
                        >
                            <ShoppingBag className="w-5 h-4" strokeWidth={1.5} />
                        </Link>
                    </div>
                </div>
            </motion.header>

            {/* Fullscreen Mega Menu Overlay */}
            <motion.div
                initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
                animate={{
                    clipPath: menuOpen
                        ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                        : "polygon(0 0, 100% 0, 100% 0, 0 0)",
                }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="fixed inset-0 z-[60] bg-[#050505] flex flex-col"
                style={{ pointerEvents: menuOpen ? "auto" : "none" }}
            >
                {/* Menu Header */}
                <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 md:h-24 flex items-center justify-between w-full border-b border-white/5">
                    <div className="w-1/3" />
                    <div className="flex justify-center w-1/3">
                        <span
                            className="text-gold-gradient text-xl tracking-[0.35em] uppercase font-light"
                            style={{ fontFamily: "var(--font-editorial)" }}
                        >
                            Swamy
                        </span>
                    </div>
                    <div className="flex justify-end w-1/3">
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-300"
                            data-cursor-hover
                        >
                            <span className="text-[10px] uppercase tracking-[0.2em] hidden md:block">Close</span>
                            <X className="w-5 h-5" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>

                {/* Menu Content */}
                <div className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 py-10 md:py-16 flex flex-col md:flex-row gap-12 overflow-y-auto">
                    {/* Left: Collections + Other Links */}
                    <div ref={menuLinksRef} className="flex flex-col gap-8 md:w-2/3" style={{ perspective: "800px" }}>
                        {/* Collection Cards */}
                        <div>
                            <span className="text-[#C9B06B] text-[10px] uppercase tracking-[0.3em] mb-5 block">Collections</span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {collectionLinks.map((col) => (
                                    <Link
                                        key={col.name}
                                        href={col.href}
                                        onClick={() => setMenuOpen(false)}
                                        className={`menu-link relative group overflow-hidden rounded-xl border transition-all duration-500 p-5 flex flex-col gap-3 hover:-translate-y-1 card-3d-hover`}
                                        style={{
                                            background: `linear-gradient(135deg, ${col.bg.replace("from-", "").replace("via-", "").replace("to-", "").trim()})`,
                                            borderColor: `${col.accent}22`,
                                            boxShadow: `0 0 0 1px ${col.accent}11`,
                                        }}
                                        data-cursor-hover
                                    >
                                        {/* Gradient bg */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${col.bg} opacity-80`} />
                                        {/* Hover glow */}
                                        <div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            style={{ background: `radial-gradient(circle at 50% 100%, ${col.accent}15 0%, transparent 70%)` }}
                                        />
                                        {/* Border highlight on hover */}
                                        <div
                                            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            style={{ boxShadow: `inset 0 0 0 1px ${col.accent}40` }}
                                        />
                                        <div className="relative z-10 flex flex-col gap-2">
                                            <span
                                                className="material-symbols-outlined text-2xl transition-colors duration-300"
                                                style={{ color: col.accent, opacity: 0.7 }}
                                            >
                                                {col.icon}
                                            </span>
                                            <div>
                                                <p
                                                    className="text-white text-base font-light tracking-wider"
                                                    style={{ fontFamily: "var(--font-editorial)" }}
                                                >
                                                    {col.name}
                                                </p>
                                                <p
                                                    className="text-[10px] uppercase tracking-[0.15em] mt-0.5"
                                                    style={{ color: col.accent, opacity: 0.6, fontFamily: "var(--font-sans)" }}
                                                >
                                                    {col.sub}
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className="relative z-10 mt-auto flex items-center gap-1.5 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1"
                                            style={{ color: col.accent, fontFamily: "var(--font-sans)" }}
                                        >
                                            <span>Explore</span>
                                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Other links */}
                        <div className="flex flex-col gap-3">
                            <span className="text-[#D4AF37] text-[10px] uppercase tracking-[0.3em] mb-1">More</span>
                            {navLinks.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="menu-link text-2xl md:text-3xl text-white/60 hover:text-white transition-all duration-400 font-light group flex items-center gap-4 animated-underline"
                                    style={{ fontFamily: "var(--font-display)" }}
                                    data-cursor-hover
                                >
                                    <span className="group-hover:translate-x-2 transition-transform duration-400">{link.name}</span>
                                    <span className="h-px w-0 group-hover:w-8 bg-[#D4AF37]/50 transition-all duration-500 ease-out" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div
                        ref={menuContactRef}
                        className="flex flex-col gap-10 md:w-1/3 border-t md:border-t-0 md:border-l border-white/5 pt-10 md:pt-0 md:pl-12"
                    >
                        <div className="menu-contact-item flex flex-col gap-4">
                            <span className="text-[#D4AF37] text-[10px] uppercase tracking-[0.3em]">Contact</span>
                            <a href="mailto:contact@swamyjewellery.com" className="text-white/60 hover:text-white font-light transition-colors duration-300">
                                contact@swamyjewellery.com
                            </a>
                            <a href="tel:+919876543210" className="text-white/60 hover:text-white font-light transition-colors duration-300">
                                +91 98765 43210
                            </a>
                        </div>
                        <div className="menu-contact-item flex flex-col gap-4">
                            <span className="text-[#D4AF37] text-[10px] uppercase tracking-[0.3em]">Boutique</span>
                            <p className="text-white/60 font-light max-w-[220px] leading-relaxed">
                                16-C, Maruthamalai Main Road, Vadavalli, Coimbatore, Tamil Nadu, 641041
                            </p>
                        </div>
                        <div className="menu-contact-item flex flex-col gap-3">
                            <span className="text-[#D4AF37] text-[10px] uppercase tracking-[0.3em]">Follow</span>
                            <div className="flex gap-6">
                                {[
                                    { label: "Instagram", url: "https://instagram.com/swamyjewellery" },
                                    { label: "Facebook", url: "https://facebook.com/swamyjewellery" },
                                    { label: "Pinterest", url: "https://pinterest.com/swamyjewellery" },
                                ].map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-white/40 hover:text-white font-light transition-colors duration-300"
                                        data-cursor-hover
                                    >
                                        {s.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom decorative line */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
            </motion.div>
        </>
    );
}
