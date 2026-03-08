"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useCallback, useMemo } from "react";

interface PreloaderProps {
    onLoadingComplete: () => void;
}

export default function Preloader({ onLoadingComplete }: PreloaderProps) {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);

    const onComplete = useCallback(onLoadingComplete, [onLoadingComplete]);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        // Phase 1: Counter 0→100 (0–2s)
        const start = Date.now();
        const duration = 2000;
        const tick = () => {
            const elapsed = Date.now() - start;
            const p = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setProgress(Math.round(eased * 100));
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);

        const t1 = setTimeout(() => setPhase(2), 2000);
        const t2 = setTimeout(() => setPhase(3), 3500);
        const t3 = setTimeout(() => setPhase(4), 4500);
        const t4 = setTimeout(() => {
            document.body.style.overflow = "unset";
            onComplete();
        }, 5500);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
            document.body.style.overflow = "unset";
        };
    }, [onComplete]);

    const title = "SWAMY".split("");
    const cubicEase = [0.76, 0, 0.24, 1] as [number, number, number, number];

    // Generate floating particles positions deterministically
    const particles = useMemo(
        () =>
            Array.from({ length: 20 }, (_, i) => ({
                id: i,
                left: `${5 + Math.floor((i * 37 + 13) % 90)}%`,
                delay: ((i * 0.7 + 0.2) % 4).toFixed(1),
                duration: (3 + (i % 4)).toString(),
                size: 1 + (i % 3),
            })),
        []
    );

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{
                opacity: phase === 4 ? 0 : 1,
            }}
            transition={{ duration: 1, ease: cubicEase }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] overflow-hidden"
        >
            {/* Floating gold dust particles */}
            <div className="absolute inset-0 overflow-hidden">
                {particles.map((p) => (
                    <div
                        key={p.id}
                        className="absolute rounded-full bg-[#D4AF37]"
                        style={{
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            left: p.left,
                            bottom: "-5%",
                            opacity: phase >= 2 ? 0.6 : 0,
                            animation: phase >= 2
                                ? `gold-dust ${p.duration}s ease-out ${p.delay}s infinite`
                                : "none",
                            transition: "opacity 0.5s ease",
                        }}
                    />
                ))}
            </div>

            {/* Multi-layered ambient glow */}
            <div className="absolute inset-0">
                <motion.div
                    animate={{
                        opacity: phase >= 2 ? 0.2 : 0,
                        scale: phase >= 3 ? 2.5 : 1,
                    }}
                    transition={{ duration: 2.5, ease: cubicEase }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#D4AF37] blur-[160px]"
                />
                <motion.div
                    animate={{
                        opacity: phase >= 2 ? 0.08 : 0,
                        scale: phase >= 3 ? 2 : 0.8,
                    }}
                    transition={{ duration: 3, ease: cubicEase, delay: 0.3 }}
                    className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-[#7D1C55] blur-[120px]"
                />
                <motion.div
                    animate={{
                        opacity: phase >= 3 ? 0.1 : 0,
                        scale: phase >= 3 ? 1.5 : 0.5,
                    }}
                    transition={{ duration: 2, ease: cubicEase }}
                    className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] rounded-full bg-[#D4AF37] blur-[100px]"
                />
            </div>

            {/* Animated concentric rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                        opacity: phase >= 1 ? 0.6 : 0,
                        scale: phase >= 3 ? 1.5 : 1,
                    }}
                    transition={{ duration: 1.5, ease: cubicEase }}
                    className="preloader-ring-outer"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                        opacity: phase >= 1 ? 0.4 : 0,
                        scale: phase >= 3 ? 1.5 : 1,
                    }}
                    transition={{ duration: 1.5, ease: cubicEase, delay: 0.2 }}
                    className="preloader-ring-inner"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                        opacity: phase >= 2 ? 0.3 : 0,
                        scale: phase >= 3 ? 1.5 : 1,
                    }}
                    transition={{ duration: 1.5, ease: cubicEase, delay: 0.4 }}
                    className="preloader-ring-dot"
                />
            </div>

            {/* Gold line sweep */}
            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: phase >= 2 ? 1 : progress / 100 }}
                transition={{ duration: 1.5, ease: cubicEase }}
                className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent origin-left"
            />
            {/* Secondary sweep line */}
            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: phase >= 2 ? 1 : progress / 200 }}
                transition={{ duration: 2, ease: cubicEase, delay: 0.3 }}
                className="absolute top-[calc(50%+8px)] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#7D1C55]/30 to-transparent origin-right"
            />

            {/* Progress counter with bar */}
            <motion.div
                initial={{ opacity: 1 }}
                animate={{
                    opacity: phase >= 2 ? 0 : 1,
                    y: phase >= 2 ? -30 : 0,
                }}
                transition={{ duration: 0.6, ease: cubicEase }}
                className="absolute bottom-16 right-16 flex flex-col items-end gap-2"
            >
                <span
                    className="text-[#D4AF37]/60 text-3xl tracking-[0.3em] tabular-nums font-light"
                    style={{ fontFamily: "var(--font-display)" }}
                >
                    {String(progress).padStart(3, "0")}
                </span>
                <div className="w-32 h-[2px] bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[#8A6E24] via-[#FBF5B7] to-[#D4AF37] rounded-full loader-bar-glow transition-all duration-100"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </motion.div>

            {/* Central Typography Container */}
            <motion.div
                animate={{
                    scale: phase === 3 ? 1.1 : phase === 4 ? 1.4 : 1,
                    filter: phase === 4 ? "blur(16px)" : "blur(0px)",
                    opacity: phase === 4 ? 0 : 1,
                }}
                transition={{ duration: 1.2, ease: cubicEase }}
                className="relative z-10 flex flex-col items-center justify-center"
            >
                {/* Staggered Letter Reveal */}
                <div className="overflow-hidden flex items-baseline">
                    <motion.div
                        initial="hidden"
                        animate={phase >= 2 ? "show" : "hidden"}
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1, delayChildren: 0.1 },
                            },
                        }}
                        className="flex space-x-[3px] md:space-x-3"
                    >
                        {title.map((letter, index) => (
                            <span key={index} className="overflow-hidden inline-block" style={{ perspective: "800px" }}>
                                <motion.span
                                    variants={{
                                        hidden: {
                                            y: "130%",
                                            rotateX: -90,
                                            opacity: 0,
                                        },
                                        show: {
                                            y: "0%",
                                            rotateX: 0,
                                            opacity: 1,
                                            transition: {
                                                duration: 1.4,
                                                ease: cubicEase,
                                            },
                                        },
                                    }}
                                    className="inline-block text-[4rem] md:text-[7rem] tracking-[0.15em] uppercase font-light"
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        transformStyle: "preserve-3d",
                                        background: "linear-gradient(135deg, #D4AF37 0%, #F9E58C 40%, #D4AF37 60%, #8A6E24 100%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        backgroundClip: "text",
                                        filter: "drop-shadow(0 0 40px rgba(212,175,53,0.4))",
                                    }}
                                >
                                    {letter}
                                </motion.span>
                            </span>
                        ))}
                    </motion.div>
                </div>

                {/* Subtitle Reveal */}
                <div className="overflow-hidden mt-4">
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{
                            y: phase >= 2 ? "0%" : "100%",
                            opacity: phase >= 2 ? 1 : 0,
                        }}
                        transition={{ duration: 1, delay: 0.6, ease: cubicEase }}
                        className="flex items-center gap-4"
                    >
                        <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/40" />
                        <span
                            className="text-[10px] md:text-[12px] uppercase tracking-[0.6em] text-[#D4AF37]/50"
                            style={{ fontFamily: "var(--font-sans)" }}
                        >
                            Jewellery
                        </span>
                        <span className="text-[#D4AF37]/20 text-xs">&#9670;</span>
                        <span
                            className="text-[10px] md:text-[12px] uppercase tracking-[0.6em] text-[#D4AF37]/50"
                            style={{ fontFamily: "var(--font-sans)" }}
                        >
                            Since 1998
                        </span>
                        <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/40" />
                    </motion.div>
                </div>

                {/* Decorative gold ornament */}
                <motion.div
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{
                        opacity: phase >= 3 ? 1 : 0,
                        scale: phase >= 3 ? 1 : 0,
                        rotate: phase >= 3 ? 0 : -180,
                    }}
                    transition={{ duration: 1, ease: cubicEase }}
                    className="mt-6 flex items-center gap-3"
                >
                    <div className="w-6 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
                    <span className="text-[#D4AF37]/40 text-lg">&#10022;</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/40" />
                    <span className="text-[#D4AF37]/40 text-lg">&#10022;</span>
                    <div className="w-6 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
                </motion.div>
            </motion.div>

            {/* Corner accents — double lines */}
            <div className="absolute top-8 left-8">
                <div className="w-16 h-16 border-t border-l border-[#D4AF37]/15" />
                <div className="absolute top-2 left-2 w-10 h-10 border-t border-l border-[#D4AF37]/8" />
            </div>
            <div className="absolute top-8 right-8">
                <div className="w-16 h-16 border-t border-r border-[#D4AF37]/15" />
                <div className="absolute top-2 right-2 w-10 h-10 border-t border-r border-[#D4AF37]/8" />
            </div>
            <div className="absolute bottom-8 left-8">
                <div className="w-16 h-16 border-b border-l border-[#D4AF37]/15" />
                <div className="absolute bottom-2 left-2 w-10 h-10 border-b border-l border-[#D4AF37]/8" />
            </div>
            <div className="absolute bottom-8 right-8">
                <div className="w-16 h-16 border-b border-r border-[#D4AF37]/15" />
                <div className="absolute bottom-2 right-2 w-10 h-10 border-b border-r border-[#D4AF37]/8" />
            </div>
        </motion.div>
    );
}
