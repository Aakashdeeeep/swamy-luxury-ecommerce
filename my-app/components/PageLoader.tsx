"use client";

import { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";

interface PageLoaderProps {
    label?: string;
}

export default function PageLoader({ label = "Loading" }: PageLoaderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    // Deterministic floating particles
    const particles = useMemo(
        () =>
            Array.from({ length: 12 }, (_, i) => ({
                id: i,
                left: `${8 + Math.floor((i * 31 + 7) % 84)}%`,
                delay: ((i * 0.5 + 0.1) % 3).toFixed(1),
                duration: (2.5 + (i % 3)).toString(),
                size: 1 + (i % 2),
            })),
        []
    );

    useEffect(() => {
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            // Fade in container
            tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });

            // Rings scale in
            if (ringRef.current) {
                tl.fromTo(
                    ringRef.current.querySelectorAll(".page-ring"),
                    { scale: 0, opacity: 0 },
                    { scale: 1, opacity: 1, stagger: 0.15, duration: 0.8, ease: "back.out(1.7)" },
                    0.2
                );
            }

            // Progress bar fill
            tl.fromTo(
                barRef.current,
                { scaleX: 0, transformOrigin: "left center" },
                { scaleX: 0.85, duration: 3, ease: "power1.inOut", repeat: -1, yoyo: true },
                0.3
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[200] bg-[#050505] flex flex-col items-center justify-center gap-10 opacity-0"
        >
            {/* Floating gold particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((p) => (
                    <div
                        key={p.id}
                        className="absolute rounded-full bg-[#D4AF37]"
                        style={{
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            left: p.left,
                            bottom: "-5%",
                            animation: `gold-dust ${p.duration}s ease-out ${p.delay}s infinite`,
                        }}
                    />
                ))}
            </div>

            {/* Multi-layer ambient glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/[0.06] rounded-full blur-[160px] animate-[breathe_6s_ease-in-out_infinite]" />
                <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-[#7D1C55]/[0.04] rounded-full blur-[120px] animate-[breathe_8s_ease-in-out_infinite_1s]" />
                <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-[#D4AF37]/[0.04] rounded-full blur-[100px] animate-[breathe_5s_ease-in-out_infinite_2s]" />
            </div>

            {/* Spinning concentric rings */}
            <div ref={ringRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="page-ring preloader-ring-outer" style={{ width: 120, height: 120, opacity: 0.4 }} />
                <div className="page-ring preloader-ring-inner" style={{ width: 90, height: 90, opacity: 0.3 }} />
                <div className="page-ring preloader-ring-dot" style={{ width: 60, height: 60, opacity: 0.2 }} />
            </div>

            {/* Brand + loader */}
            <div className="relative z-10 flex flex-col items-center gap-5">
                <span
                    className="text-2xl md:text-4xl uppercase tracking-[0.5em] font-light"
                    style={{
                        fontFamily: "var(--font-display)",
                        background: "linear-gradient(135deg, #D4AF37 0%, #F9E58C 40%, #D4AF37 60%, #8A6E24 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        filter: "drop-shadow(0 0 20px rgba(212,175,53,0.3))",
                    }}
                >
                    Swamy
                </span>

                {/* Subtitle */}
                <div className="flex items-center gap-3">
                    <span className="w-6 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
                    <span
                        className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]/40"
                        style={{ fontFamily: "var(--font-sans)" }}
                    >
                        {label}
                    </span>
                    <span className="w-6 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
                </div>

                {/* Gold progress bar */}
                <div className="w-36 md:w-48 h-[2px] bg-white/[0.03] overflow-hidden relative rounded-full mt-2">
                    <div
                        ref={barRef}
                        className="absolute inset-0 bg-gradient-to-r from-[#8A6E24] via-[#FBF5B7] to-[#D4AF37] rounded-full loader-bar-glow"
                        style={{ transformOrigin: "left center" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-[shimmer_1.5s_ease-in-out_infinite]" />
                </div>
            </div>

            {/* Horizontal sweep lines */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent animate-[hero-line-expand_3s_ease-in-out_infinite]" />
            <div className="absolute top-[calc(50%+6px)] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#7D1C55]/8 to-transparent animate-[hero-line-expand_4s_ease-in-out_infinite_0.5s]" />

            {/* Corner accents — double lines */}
            <div className="absolute top-6 left-6">
                <div className="w-12 h-12 border-t border-l border-[#D4AF37]/15" />
                <div className="absolute top-1.5 left-1.5 w-7 h-7 border-t border-l border-[#D4AF37]/8" />
            </div>
            <div className="absolute top-6 right-6">
                <div className="w-12 h-12 border-t border-r border-[#D4AF37]/15" />
                <div className="absolute top-1.5 right-1.5 w-7 h-7 border-t border-r border-[#D4AF37]/8" />
            </div>
            <div className="absolute bottom-6 left-6">
                <div className="w-12 h-12 border-b border-l border-[#D4AF37]/15" />
                <div className="absolute bottom-1.5 left-1.5 w-7 h-7 border-b border-l border-[#D4AF37]/8" />
            </div>
            <div className="absolute bottom-6 right-6">
                <div className="w-12 h-12 border-b border-r border-[#D4AF37]/15" />
                <div className="absolute bottom-1.5 right-1.5 w-7 h-7 border-b border-r border-[#D4AF37]/8" />
            </div>
        </div>
    );
}
