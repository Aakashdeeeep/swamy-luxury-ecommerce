"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextReveal from "./TextReveal";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        if (!footerRef.current) return;

        // Curtain reveal on each column — clip-path from bottom
        gsap.fromTo(
            ".footer-col",
            { clipPath: "inset(100% 0 0 0)", opacity: 0 },
            {
                clipPath: "inset(0% 0 0 0)",
                opacity: 1,
                stagger: 0.2,
                duration: 1.5,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 80%",
                },
            }
        );

        // Social icons — float in with rotation
        gsap.fromTo(
            ".footer-social",
            { y: 40, rotateZ: 15, scale: 0, opacity: 0 },
            {
                y: 0,
                rotateZ: 0,
                scale: 1,
                opacity: 1,
                stagger: 0.12,
                duration: 1.5,
                ease: "elastic.out(1, 0.4)",
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 75%",
                },
            }
        );

        // Bottom divider line draws itself
        gsap.fromTo(
            ".footer-divider",
            { scaleX: 0, transformOrigin: "left" },
            {
                scaleX: 1,
                duration: 2,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: ".footer-bottom",
                    start: "top 90%",
                },
            }
        );

        // Bottom bar text fades in
        gsap.fromTo(
            ".footer-bottom-content",
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 1.2,
                delay: 0.5,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".footer-bottom",
                    start: "top 90%",
                },
            }
        );

        // Top gradient line glow pulse
        gsap.fromTo(
            ".footer-topline",
            { scaleX: 0 },
            {
                scaleX: 1,
                duration: 2.5,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 85%",
                },
            }
        );
    }, { scope: footerRef });

    return (
        <footer ref={footerRef} className="bg-[#050505] pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
            <div className="footer-topline absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-accent-magenta/50 to-transparent origin-center"></div>

            <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

                    <div className="footer-col space-y-6">
                        <a className="flex flex-col items-start" href="/">
                            <TextReveal
                                as="h2"
                                split="chars"
                                className="font-display font-bold text-2xl tracking-widest text-white uppercase"
                                stagger={0.05}
                                duration={1.5}
                                triggerStart="top 85%"
                            >
                                Swamy
                            </TextReveal>
                            <span className="text-[9px] tracking-[0.4em] text-accent-magenta-light uppercase ml-0.5">Jewellery</span>
                        </a>
                        <p className="text-gray-500 text-sm font-light leading-relaxed">
                            Crafting eternal memories in gold and diamond. The finest jewellery destination in Coimbatore.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <a className="footer-social w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-accent-magenta hover:text-white hover:border-accent-magenta transition-all duration-300 group shadow-[0_0_0_rgba(80,18,55,0)] hover:shadow-[0_0_15px_rgba(80,18,55,0.4)]" href="https://instagram.com/swamyjewellery_cbe">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.072 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                            </a>
                            <a className="footer-social w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-accent-magenta hover:text-white hover:border-accent-magenta transition-all duration-300 shadow-[0_0_0_rgba(80,18,55,0)] hover:shadow-[0_0_15px_rgba(80,18,55,0.4)]" href="#">
                                <span className="material-symbols-outlined text-sm">mail</span>
                            </a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h3 className="font-display text-lg text-white mb-6">Visit Our Store</h3>
                        <div className="space-y-4 text-sm text-gray-400 font-light">
                            <p className="flex gap-3">
                                <span className="material-symbols-outlined text-accent-magenta-light text-base shrink-0">location_on</span>
                                <span>12/4, Marudhamalai Rd,<br />Vadavalli, Coimbatore,<br />Tamil Nadu 641041</span>
                            </p>
                            <p className="flex gap-3 items-center">
                                <span className="material-symbols-outlined text-accent-magenta-light text-base shrink-0">call</span>
                                <a className="hover:text-accent-magenta-light transition-colors" href="tel:+919876543210">+91 98765 43210</a>
                            </p>
                            <p className="flex gap-3 items-center">
                                <span className="material-symbols-outlined text-accent-magenta-light text-base shrink-0">schedule</span>
                                <span>Mon - Sat: 10:00 AM - 9:00 PM</span>
                            </p>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h3 className="font-display text-lg text-white mb-6">Collections</h3>
                        <ul className="space-y-3 text-sm text-gray-400 font-light">
                            <li><a className="hover:text-accent-magenta-light transition-colors" href="#">Gold Jewellery</a></li>
                            <li><a className="hover:text-accent-magenta-light transition-colors" href="#">Diamond Necklaces</a></li>
                            <li><a className="hover:text-accent-magenta-light transition-colors" href="#">Wedding Bridal Sets</a></li>
                            <li><a className="hover:text-accent-magenta-light transition-colors" href="#">Antique Temple Jewellery</a></li>
                            <li><a className="hover:text-accent-magenta-light transition-colors" href="#">Pure Silver Articles</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h3 className="font-display text-lg text-white mb-6">Exclusive Updates</h3>
                        <p className="text-xs text-gray-500 mb-4">Be the first to know about new arrivals and gold rate alerts.</p>
                        <div className="flex flex-col gap-2">
                            <input className="bg-surface-dark border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-accent-magenta/50 transition-colors w-full placeholder:text-gray-600" placeholder="Your Email Address" type="email" />
                            <button className="bg-white text-black uppercase text-xs font-bold tracking-widest py-3 hover:bg-accent-magenta hover:text-white transition-colors">Subscribe</button>
                        </div>
                    </div>

                </div>

                <div className="footer-bottom">
                    <div className="footer-divider h-[1px] bg-white/10 mb-8"></div>
                    <div className="footer-bottom-content flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-600 uppercase tracking-wider">
                        <p>© 2026 Swamy Jewellery. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a className="hover:text-gray-400 transition-colors" href="#">Privacy Policy</a>
                            <a className="hover:text-gray-400 transition-colors" href="#">Terms of Use</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
