"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    useGSAP(
        () => {
            if (!footerRef.current) return;

            // Staggered reveal
            const items = footerRef.current.querySelectorAll(".footer-reveal");
            gsap.fromTo(
                items,
                { y: 40, opacity: 0, clipPath: "inset(100% 0 0 0)" },
                {
                    y: 0,
                    opacity: 1,
                    clipPath: "inset(0% 0 0 0)",
                    stagger: 0.12,
                    duration: 1.5,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 85%",
                    },
                }
            );

            // Brand name glow
            gsap.to(".footer-brand", {
                textShadow: "0 0 40px rgba(212,175,53,0.2)",
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        },
        { scope: footerRef }
    );

    return (
        <footer
            ref={footerRef}
            className="relative bg-[#050505] text-white/60 pt-32 pb-16 px-6 md:px-12 border-t border-white/[0.03] overflow-hidden z-20"
        >
            {/* Ornamental gold divider at top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-4 -translate-y-px">
                <div className="w-24 h-px bg-gradient-to-r from-transparent to-[#C9B06B]/20" />
                <div className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]/30" />
                <div className="w-24 h-px bg-gradient-to-l from-transparent to-[#C9B06B]/20" />
            </div>
            {/* Subtle noise texture */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

            {/* Ambient glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#D4AF37]/[0.02] rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16 relative z-10">
                {/* Brand & Newsletter */}
                <div className="flex flex-col gap-8 md:w-1/2">
                    <div className="footer-reveal">
                        <h2
                            className="footer-brand text-gold-gradient text-3xl md:text-5xl uppercase tracking-[0.35em] font-light mb-4"
                            style={{ fontFamily: "var(--font-editorial)" }}
                        >
                            Swamy
                        </h2>
                        <p className="text-[9px] text-[#C9B06B]/40 uppercase tracking-[0.35em] mb-5" style={{ fontFamily: "var(--font-sans)" }}>
                            Haute Joaillerie · Since 1998
                        </p>
                        <p
                            className="font-light text-sm md:text-base max-w-sm leading-relaxed text-white/40"
                            style={{ fontFamily: "var(--font-sans)" }}
                        >
                            Crafting timeless gold and antique jewelry since 1998. Experience uncompromising quality from Vadavalli, Coimbatore.
                        </p>
                    </div>

                    <div className="footer-reveal flex flex-col gap-4 mt-4">
                        <span
                            className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/60"
                            style={{ fontFamily: "var(--font-sans)" }}
                        >
                            Join our newsletter
                        </span>
                        <div className="flex border-b border-white/10 pb-2 w-full max-w-sm group focus-within:border-[#C9B06B]/30 transition-colors duration-500">
                            {subscribed ? (
                                <span className="text-sm text-[#D4AF37] font-light py-1" style={{ fontFamily: "var(--font-sans)" }}>
                                    Thank you for subscribing!
                                </span>
                            ) : (
                                <>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-transparent border-none outline-none flex-1 text-sm font-light text-white placeholder-white/30"
                                        style={{ fontFamily: "var(--font-sans)" }}
                                    />
                                    <button
                                        onClick={() => {
                                            if (email.includes("@")) {
                                                setSubscribed(true);
                                                setEmail("");
                                            }
                                        }}
                                        className="text-white/40 group-focus-within:text-[#C9B06B] hover:text-[#C9B06B] transition-colors duration-300 flex items-center gap-1.5 uppercase text-[10px] tracking-widest"
                                        data-cursor-hover
                                        style={{ fontFamily: "var(--font-sans)" }}
                                    >
                                        Subscribe
                                        <span className="text-sm">→</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Gold vertical divider */}
                <div className="hidden md:block w-px h-48 bg-gradient-to-b from-transparent via-[#D4AF37]/15 to-transparent self-center" />

                {/* Links */}
                <div className="flex gap-16 md:w-1/2 md:justify-end">
                    <div className="footer-reveal flex flex-col gap-4">
                        <span
                            className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/60 mb-2"
                            style={{ fontFamily: "var(--font-sans)" }}
                        >
                            Explore
                        </span>
                        {[
                            { label: "Gold", href: "/collections/gold" },
                            { label: "Diamond", href: "/collections/diamond" },
                            { label: "Silver", href: "/collections/silver" },
                            { label: "Schemes", href: "/schemes" },
                            { label: "Our Story", href: "/our-story" },
                        ].map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-sm font-light hover:text-white hover:translate-x-1 transition-all duration-300 animated-underline"
                                data-cursor-hover
                                style={{ fontFamily: "var(--font-sans)" }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Gold divider between columns */}
                    <div className="w-px h-32 bg-gradient-to-b from-transparent via-[#D4AF37]/10 to-transparent self-center" />

                    <div className="footer-reveal flex flex-col gap-4">
                        <span
                            className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/60 mb-2"
                            style={{ fontFamily: "var(--font-sans)" }}
                        >
                            Contact
                        </span>
                        <Link
                            href="/our-story#appointment"
                            className="text-sm font-light hover:text-white hover:translate-x-1 transition-all duration-300 animated-underline"
                            data-cursor-hover
                            style={{ fontFamily: "var(--font-sans)" }}
                        >
                            Appointments
                        </Link>
                        <a
                            href="https://maps.google.com/?q=Vadavalli+Coimbatore+Swamy+Jewellery"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-light hover:text-white hover:translate-x-1 transition-all duration-300 animated-underline"
                            data-cursor-hover
                            style={{ fontFamily: "var(--font-sans)" }}
                        >
                            Boutique Locations
                        </a>
                        <a
                            href="https://wa.me/919876543210?text=Hi%2C%20I%20need%20help%20with%20my%20order."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-light hover:text-white hover:translate-x-1 transition-all duration-300 animated-underline"
                            data-cursor-hover
                            style={{ fontFamily: "var(--font-sans)" }}
                        >
                            Customer Care
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-white/30 uppercase tracking-widest">
                <p className="footer-reveal" style={{ fontFamily: "var(--font-sans)" }}>
                    &copy; {new Date().getFullYear()} Swamy Jewellery. All rights reserved.
                </p>
                <div className="footer-reveal flex gap-8">
                    <span className="hover:text-white/60 transition-colors duration-300 cursor-default">
                        Privacy Policy
                    </span>
                    <span className="hover:text-white/60 transition-colors duration-300 cursor-default">
                        Terms of Service
                    </span>
                </div>
            </div>
        </footer>
    );
}
