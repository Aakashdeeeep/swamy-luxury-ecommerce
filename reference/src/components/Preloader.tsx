"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

export default function Preloader() {
    const preloaderRef = useRef<HTMLDivElement>(null);
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (!preloaderRef.current) return;
        // Lock scroll during preloader
        document.body.style.overflow = "hidden";

        const tl = gsap.timeline({
            onComplete: () => {
                document.body.style.overflow = "";
                setDone(true);
            },
        });

        // Phase 1: Letter-by-letter brand reveal
        tl.fromTo(
            ".preloader-char",
            { y: 80, opacity: 0, rotateX: -90 },
            {
                y: 0,
                opacity: 1,
                rotateX: 0,
                stagger: 0.08,
                duration: 0.9,
                ease: "expo.out",
            },
            0.3
        );

        // Phase 2: Subtitle fades in
        tl.fromTo(
            ".preloader-sub",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            1.0
        );

        // Phase 3: Gold ring draws itself (SVG)
        tl.fromTo(
            ".preloader-ring",
            { strokeDashoffset: 580 },
            { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" },
            1.2
        );

        // Phase 4: Ring scales up massively + everything fades
        tl.to(
            ".preloader-ring-container",
            { scale: 50, opacity: 0, duration: 1.2, ease: "expo.in" },
            3.0
        );

        tl.to(
            ".preloader-text-group",
            { opacity: 0, y: -40, duration: 0.6, ease: "power3.in" },
            3.0
        );

        // Phase 5: Preloader curtain slides up
        tl.to(
            preloaderRef.current,
            {
                yPercent: -100,
                duration: 1.0,
                ease: "expo.inOut",
            },
            3.6
        );

        return () => {
            tl.kill();
            document.body.style.overflow = "";
        };
    }, []);

    if (done) return null;

    const brand = "SWAMY";
    return (
        <div
            ref={preloaderRef}
            className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex flex-col items-center justify-center"
            style={{ perspective: "600px" }}
        >
            <div className="preloader-text-group flex flex-col items-center gap-6">
                {/* Brand Letters */}
                <div className="flex items-center gap-1" style={{ perspective: "400px" }}>
                    {brand.split("").map((ch, i) => (
                        <span
                            key={i}
                            className="preloader-char inline-block text-5xl md:text-7xl lg:text-8xl font-display tracking-[0.2em]"
                            style={{
                                color: "transparent",
                                WebkitTextStroke: "1px rgba(212,175,53,0.7)",
                                transformStyle: "preserve-3d",
                                willChange: "transform, opacity",
                            }}
                        >
                            {ch}
                        </span>
                    ))}
                </div>

                {/* Subtitle */}
                <span className="preloader-sub text-xs tracking-[0.5em] text-primary/50 uppercase font-light">
                    Jewellery
                </span>
            </div>

            {/* Gold Ring SVG */}
            <div className="preloader-ring-container absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
                    <circle
                        className="preloader-ring"
                        cx="90"
                        cy="90"
                        r="88"
                        stroke="rgba(212,175,53,0.4)"
                        strokeWidth="1"
                        strokeDasharray="580"
                        strokeDashoffset="580"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
        </div>
    );
}
