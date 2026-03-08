"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";

export default function Navbar() {
    const headerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!headerRef.current) return;

        // Premium entry — delayed to sync with preloader
        const tl = gsap.timeline({
            defaults: { ease: "expo.out" },
            delay: 4.0,
        });

        // Header slides down from clip mask
        tl.fromTo(
            headerRef.current,
            { yPercent: -100, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 1.5 },
            0
        );

        // Nav links: each slides up through overflow:hidden mask
        tl.fromTo(
            ".nav-link",
            { y: "100%", opacity: 0 },
            { y: "0%", opacity: 1, stagger: 0.1, duration: 1.2, ease: "power4.out" },
            0.6
        );

        // Icons: scale with elastic settle
        tl.fromTo(
            ".nav-icon",
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, stagger: 0.12, duration: 1.8, ease: "elastic.out(1, 0.5)" },
            1.0
        );

        // Rate badges: scale from nothing with elastic
        tl.fromTo(
            ".nav-rate-badge",
            { scale: 0, opacity: 0, transformOrigin: "center" },
            { scale: 1, opacity: 1, stagger: 0.15, duration: 2, ease: "elastic.out(1, 0.4)" },
            0.5
        );

        // Magnetic hover on nav links
        const links = document.querySelectorAll<HTMLElement>(".nav-link");
        links.forEach((link) => {
            link.addEventListener("mousemove", (e) => {
                const rect = link.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(link, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: "power2.out" });
            });
            link.addEventListener("mouseleave", () => {
                gsap.to(link, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
            });
        });

        // Scroll-driven: backdrop blur increases, background solidifies
        let scrollHandler: number;
        const handleScroll = () => {
            cancelAnimationFrame(scrollHandler);
            scrollHandler = requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const progress = Math.min(scrollY / 200, 1);

                if (headerRef.current) {
                    headerRef.current.style.backdropFilter = `blur(${8 + progress * 12}px)`;
                    headerRef.current.style.backgroundColor = `rgba(10, 10, 10, ${0.5 + progress * 0.4})`;
                    headerRef.current.style.borderBottomColor = `rgba(255, 255, 255, ${0.03 + progress * 0.07})`;
                }
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header ref={headerRef} className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-background-dark/50 border-b border-white/5 shadow-2xl" style={{ opacity: 0 }}>
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2 flex justify-center md:justify-end gap-4 text-xs font-bold tracking-widest">
                <div className="nav-rate-badge px-4 py-1 rounded-full bg-gradient-to-r from-primary-dark/40 to-primary/20 border border-primary/30 text-primary-light flex items-center gap-2 overflow-hidden relative shine-effect">
                    <span className="material-symbols-outlined text-sm">currency_rupee</span>
                    GOLD 22K ₹14,600 <span className="text-green-400">↑</span>
                </div>
                <div className="nav-rate-badge px-4 py-1 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-white/20 text-gray-300 flex items-center gap-2 shine-effect">
                    <span className="material-symbols-outlined text-sm">water_drop</span>
                    SILVER ₹290
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
                <Link className="flex flex-col items-center md:items-start group" href="/">
                    <h1 className="font-display font-bold text-2xl md:text-3xl tracking-widest text-gradient-gold uppercase group-hover:opacity-80 transition-opacity">Swamy</h1>
                    <span className="text-[9px] tracking-[0.4em] text-white/60 uppercase ml-1">Jewellery</span>
                </Link>
                <nav className="hidden lg:flex items-center gap-10">
                    {[
                        { label: "Collections", href: "/collections" },
                        { label: "Bridal", href: "/collections" },
                        { label: "Gifts", href: "/collections" },
                        { label: "Our Story", href: "/our-story" },
                    ].map((item) => (
                        <span key={item.label} className="overflow-hidden inline-block">
                            <Link className="nav-link block text-sm uppercase tracking-[0.15em] hover:text-accent-magenta-light transition-all duration-300" href={item.href}>
                                {item.label}
                            </Link>
                        </span>
                    ))}
                </nav>
                <div className="flex items-center gap-6">
                    <button className="nav-icon text-white hover:text-accent-magenta-light transition-colors">
                        <span className="material-symbols-outlined font-light">search</span>
                    </button>
                    <button className="nav-icon text-white hover:text-accent-magenta-light transition-colors relative">
                        <span className="material-symbols-outlined font-light">shopping_bag</span>
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent-magenta-light rounded-full animate-pulse shadow-[0_0_10px_rgba(125,28,85,0.8)]"></span>
                    </button>
                    <a className="nav-icon hidden md:flex items-center gap-2 bg-green-900/40 border border-green-500/30 px-4 py-2 rounded-full hover:bg-green-900/60 transition-all group" href="https://wa.me/919876543210">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-xs uppercase tracking-widest text-green-100 group-hover:text-white">WhatsApp</span>
                    </a>
                </div>
            </div>
        </header>
    );
}
