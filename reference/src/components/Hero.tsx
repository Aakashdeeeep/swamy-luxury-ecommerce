"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GoldDustCanvas from "./GoldDustCanvas";
import TextReveal from "./TextReveal";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const imageWrapRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLButtonElement>(null);

    useGSAP(
        () => {
            if (!sectionRef.current) return;

            const tl = gsap.timeline({
                defaults: { ease: "expo.out" },
                delay: 4.2, // Wait for Preloader to finish
            });

            // 1. Canvas background fades in
            tl.fromTo(
                ".hero-canvas-wrap",
                { opacity: 0 },
                { opacity: 1, duration: 1.5 },
                0
            );

            // 2. Tagline line draws
            tl.fromTo(
                ".hero-tagline-line",
                { scaleX: 0, transformOrigin: "left" },
                { scaleX: 1, duration: 1.2 },
                0.3
            );

            // 3. Tagline text (TextReveal handles its own text — we animate the container)
            tl.fromTo(
                ".hero-tagline-text",
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 1 },
                0.6
            );

            // 4. Image — clip-path reveal from bottom (the cinematic moment)
            if (imageWrapRef.current) {
                tl.fromTo(
                    imageWrapRef.current,
                    { clipPath: "inset(100% 0 0 0)" },
                    {
                        clipPath: "inset(0% 0 0 0)",
                        duration: 2.2,
                        ease: "power4.inOut",
                    },
                    0.8
                );
                // Image itself scales down (Ken Burns reverse)
                tl.fromTo(
                    ".hero-image",
                    { scale: 1.3 },
                    { scale: 1, duration: 2.8, ease: "power3.out" },
                    0.8
                );
            }

            // 5. Subtitle info
            tl.fromTo(
                ".hero-subtitle",
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1.2 },
                1.8
            );

            // 6. CTA — delayed, subtle
            tl.fromTo(
                ctaRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
                2.2
            );

            // 7. CTA border draws itself
            tl.fromTo(
                ".hero-cta-border",
                { strokeDashoffset: 600 },
                { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" },
                2.5
            );

            // 8. Scroll indicator
            tl.fromTo(
                ".hero-scroll-indicator",
                { opacity: 0, y: -20 },
                { opacity: 0.6, y: 0, duration: 1 },
                3.0
            );

            // --- SCROLL-DRIVEN EFFECTS ---

            // Hero text dissolve on scroll-away
            gsap.to(".hero-text-content", {
                filter: "blur(12px)",
                letterSpacing: "0.15em",
                opacity: 0.15,
                scale: 0.96,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "60% top",
                    scrub: 1.5,
                },
            });

            // Image parallax
            gsap.to(".hero-image", {
                yPercent: 25,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.5,
                },
            });

            // Canvas parallax (moves slower)
            gsap.to(".hero-canvas-wrap", {
                yPercent: 10,
                opacity: 0.3,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 2,
                },
            });

            // Scroll indicator infinite bounce
            gsap.to(".hero-scroll-indicator", {
                y: 10,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        },
        { scope: sectionRef }
    );

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28"
        >
            {/* Background layers */}
            <div className="absolute inset-0 bg-background-dark z-0">
                <div className="absolute inset-0 bg-magenta-glow mix-blend-screen"></div>
            </div>

            {/* Gold Dust Canvas */}
            <div className="hero-canvas-wrap absolute inset-0 z-[1]" style={{ opacity: 0 }}>
                <GoldDustCanvas />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl w-full mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
                {/* Text Side */}
                <div className="hero-text-content text-center lg:text-left order-2 lg:order-1">
                    {/* Tagline */}
                    <div className="mb-6 flex justify-center lg:justify-start items-center gap-3 overflow-hidden">
                        <div className="hero-tagline-line h-[1px] w-12 bg-accent-magenta-light/70 shadow-[0_0_10px_rgba(125,28,85,0.5)]"></div>
                        <span className="hero-tagline-text text-xs uppercase tracking-[0.3em] text-accent-magenta-light font-bold">
                            Ultra Luxury Collection
                        </span>
                    </div>

                    {/* Heading — Uses TextReveal for cinematic char-split animation */}
                    <div className="mb-6">
                        <TextReveal
                            as="h1"
                            split="chars"
                            className="font-display text-5xl md:text-7xl lg:text-8xl font-medium text-text-cream drop-shadow-[0_0_25px_rgba(80,18,55,0.3)] mb-2"
                            stagger={0.04}
                            duration={2}
                            delay={4.7}
                            scrollTrigger={false}
                        >
                            Timeless
                        </TextReveal>
                        <TextReveal
                            as="h1"
                            split="chars"
                            className="font-display text-5xl md:text-7xl lg:text-8xl italic font-light text-gradient-magenta mb-2"
                            stagger={0.03}
                            duration={2}
                            delay={5.0}
                            scrollTrigger={false}
                        >
                            Craftsmanship
                        </TextReveal>
                        <TextReveal
                            as="h1"
                            split="chars"
                            className="font-display text-4xl md:text-6xl text-white/90"
                            stagger={0.03}
                            duration={1.8}
                            delay={5.3}
                            scrollTrigger={false}
                        >
                            Modern Elegance
                        </TextReveal>
                    </div>

                    {/* Subtitle */}
                    <div className="hero-subtitle space-y-2 mb-10 text-sm md:text-base text-gray-400 font-light tracking-wide" style={{ opacity: 0 }}>
                        <p>Since 1998 • Vadavalli, Coimbatore</p>
                        <div className="flex items-center justify-center lg:justify-start gap-4 text-xs uppercase tracking-wider text-primary/80">
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm text-primary">verified</span>
                                916 Hallmarked Gold
                            </span>
                            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm text-primary">diamond</span>
                                IGI Certified Diamonds
                            </span>
                        </div>
                    </div>

                    {/* CTA */}
                    <button
                        ref={ctaRef}
                        className="group relative px-10 py-4 border-0 bg-transparent text-text-cream font-display font-bold text-lg tracking-widest uppercase overflow-hidden"
                        style={{ opacity: 0 }}
                    >
                        <span className="relative z-10">Explore Collections</span>
                        {/* Animated border SVG */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                            <rect
                                className="hero-cta-border"
                                x="1"
                                y="1"
                                width="calc(100% - 2px)"
                                height="calc(100% - 2px)"
                                rx="2"
                                fill="none"
                                stroke="rgba(212,175,53,0.5)"
                                strokeWidth="1"
                                strokeDasharray="600"
                                strokeDashoffset="600"
                            />
                        </svg>
                        {/* Hover sweep */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-primary/10 to-transparent skew-x-12"></div>
                    </button>
                </div>

                {/* Image Side — Clip-path reveal */}
                <div className="relative order-1 lg:order-2 h-[500px] lg:h-[700px] flex items-center justify-center" data-cursor-explore>
                    <div className="absolute inset-0 bg-accent-magenta/10 rounded-full blur-[100px] animate-pulse-slow"></div>
                    <div
                        ref={imageWrapRef}
                        className="relative w-full h-full overflow-hidden"
                        style={{ clipPath: "inset(100% 0 0 0)" }}
                    >
                        <img
                            alt="22K Gold Diamond Necklace Close-up"
                            className="hero-image w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnYt1jx6ilxtKomRImfcbFxW6Uik689kaWzTmNmqQyuzMNxhM6FCUiTCzFTibFh9l6cp2eYJp58FydCB2A5F7GPP5Wp9Ii5DZBSDPzdl9rZ_GmsOWRa4XNNjSJ40Y3krPQTqlqKCLpQyQ100fms8oFIZg8yP6jRXpH8mGrBF_IhgFcIm5NKCm2ac0xhyN1P3hBRH1Ou852tQIaHbsDIbUvL8HOII1fGHcrgb6P_ljFJ3V2BFJ-ilQWf-XR5slaqtW3vFtUXLnpwTuT"
                            style={{ willChange: "transform", transform: "scale(1.3)" }}
                        />
                    </div>
                    <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-tr from-accent-magenta/30 to-transparent rounded-full blur-2xl opacity-60 mix-blend-screen"></div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="hero-scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ opacity: 0 }}>
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-accent-magenta-light to-transparent"></div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-accent-magenta-light">
                    Discover
                </span>
            </div>
        </section>
    );
}
