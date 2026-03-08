"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function TextOverlays() {
    const containerRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [hasInteracted, setHasInteracted] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Section 0: Hero Intro
    const opacity0 = useTransform(scrollYProgress, [0, 0.05, 0.15], [1, 1, 0]);
    const y0 = useTransform(scrollYProgress, [0, 0.15], [0, -80]);
    const scale0 = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

    // Section 1: Legacy
    const opacity1 = useTransform(scrollYProgress, [0.12, 0.25, 0.35, 0.45], [0, 1, 1, 0]);
    const y1 = useTransform(scrollYProgress, [0.12, 0.45], [40, -40]);

    // Section 2: Craftsmanship
    const opacity2 = useTransform(scrollYProgress, [0.4, 0.55, 0.65, 0.75], [0, 1, 1, 0]);
    const y2 = useTransform(scrollYProgress, [0.4, 0.75], [40, -40]);

    // Section 3: Explore
    const opacity3 = useTransform(scrollYProgress, [0.72, 0.85, 0.95, 1], [0, 1, 1, 0]);
    const y3 = useTransform(scrollYProgress, [0.72, 1], [40, -40]);
    const scale3 = useTransform(scrollYProgress, [0.72, 0.85], [0.9, 1]);

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (isMuted) {
            audioRef.current.play();
            audioRef.current.muted = false;
        } else {
            audioRef.current.muted = true;
        }
        setIsMuted(!isMuted);
        if (!hasInteracted) setHasInteracted(true);
    };

    useEffect(() => {
        const handleFirstInteraction = () => {
            if (!hasInteracted && audioRef.current) {
                audioRef.current.play().catch(() => { });
                setHasInteracted(true);
                window.removeEventListener("scroll", handleFirstInteraction);
                window.removeEventListener("click", handleFirstInteraction);
            }
        };
        window.addEventListener("scroll", handleFirstInteraction, { once: true });
        window.addEventListener("click", handleFirstInteraction, { once: true });
        return () => {
            window.removeEventListener("scroll", handleFirstInteraction);
            window.removeEventListener("click", handleFirstInteraction);
        };
    }, [hasInteracted]);

    return (
        <div
            ref={containerRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
        >
            {/* Audio */}
            <audio
                ref={audioRef}
                src="https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-amp-strings-10711.mp3"
                loop
                muted={isMuted}
                className="hidden"
            />

            {/* Audio Toggle */}
            <div className="fixed bottom-8 right-8 z-50 pointer-events-auto">
                <button
                    onClick={toggleAudio}
                    className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/10 bg-[#050505]/60 backdrop-blur-xl text-white/60 hover:text-white hover:border-[#D4AF37]/30 transition-all duration-500 group"
                    data-cursor-hover
                >
                    <span className="text-[11px] uppercase tracking-[0.2em] font-medium">
                        {isMuted ? "Sound Off" : "Sound On"}
                    </span>
                    {/* Animated equalizer bars */}
                    <div className="flex items-end gap-[2px] h-3">
                        {[1, 2, 3].map((bar) => (
                            <motion.div
                                key={bar}
                                className="w-[2px] bg-[#D4AF37] rounded-full"
                                animate={{
                                    height: isMuted ? 3 : [3, 8, 5, 10, 3],
                                }}
                                transition={{
                                    duration: 0.8,
                                    repeat: isMuted ? 0 : Infinity,
                                    delay: bar * 0.15,
                                    ease: "easeInOut",
                                }}
                            />
                        ))}
                    </div>
                </button>
            </div>

            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center">
                {/* Hero Section */}
                <motion.div
                    style={{ opacity: opacity0, y: y0, scale: scale0 }}
                    className="absolute inset-x-0 flex flex-col items-center justify-center px-4 text-center mt-[-8vh]"
                >
                    {/* Decorative top line */}
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 1.5, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
                        className="w-px h-16 bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-[#D4AF37] mb-8 origin-top"
                    />

                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.8, ease: [0.76, 0, 0.24, 1] }}
                        className="mb-6 block text-xs tracking-[0.5em] uppercase text-[#D4AF37] font-medium"
                        style={{ fontFamily: "var(--font-sans)" }}
                    >
                        Since 1998
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 1, ease: [0.76, 0, 0.24, 1] }}
                        className="text-5xl md:text-7xl lg:text-[7rem] font-light text-white tracking-tight leading-[0.9] mb-8"
                        style={{ fontFamily: "var(--font-display)", textShadow: "0 2px 40px rgba(0,0,0,0.5), 0 4px 80px rgba(0,0,0,0.3)" }}
                    >
                        Swamy <br /> Jewellery
                    </motion.h1>

                    {/* Gold decorative element */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 1.3, ease: [0.76, 0, 0.24, 1] }}
                        className="flex items-center gap-4 mb-8"
                    >
                        <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60" />
                        <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1.5, ease: [0.76, 0, 0.24, 1] }}
                        className="max-w-lg mx-auto text-white/60 font-light text-base md:text-lg leading-relaxed"
                        style={{ fontFamily: "var(--font-sans)", textShadow: "0 1px 20px rgba(0,0,0,0.4)" }}
                    >
                        An exclusive jewelry experience. Unwavering commitment to quality and timely delivery from Vadavalli, Coimbatore.
                    </motion.p>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.5, duration: 1 }}
                        className="mt-20 flex flex-col items-center"
                    >
                        <span
                            className="text-[11px] uppercase tracking-[0.3em] text-white/40 mb-4"
                            style={{ fontFamily: "var(--font-sans)" }}
                        >
                            Scroll to Discover
                        </span>
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                            className="w-px h-8 bg-gradient-to-b from-[#D4AF37] to-transparent"
                        />
                    </motion.div>
                </motion.div>

                {/* Section 1 */}
                <motion.div
                    style={{ opacity: opacity1, y: y1 }}
                    className="absolute inset-x-0 flex flex-col items-start justify-center px-4 md:px-16 h-full pointer-events-auto"
                >
                    <div className="max-w-xl bg-gradient-to-r from-[#050505]/95 via-[#050505]/70 to-transparent p-10 md:p-14 rounded-r-2xl border-l-2 border-[#D4AF37]/30">
                        <span
                            className="mb-4 text-xs tracking-[0.4em] uppercase text-[#D4AF37] font-medium drop-shadow-md block"
                            style={{ fontFamily: "var(--font-sans)" }}
                        >
                            Our Origins
                        </span>
                        <h2
                            className="text-4xl md:text-5xl lg:text-7xl font-light text-white leading-[0.95] mt-3 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            A Legacy <br /> in Gold
                        </h2>
                        <div className="flex items-center gap-3 mt-6 mb-6">
                            <div className="w-8 h-px bg-[#D4AF37]/40" />
                            <div className="w-1 h-1 rounded-full bg-[#D4AF37]/40" />
                        </div>
                        <p
                            className="text-white/60 font-light text-sm md:text-base leading-relaxed max-w-md"
                            style={{ fontFamily: "var(--font-sans)" }}
                        >
                            Swamy Jewellery began its journey as a gold and silver retail showroom in 1998. We have spent decades building trust through masterful craftsmanship and an unwavering commitment to purity.
                        </p>
                    </div>
                </motion.div>

                {/* Section 2 */}
                <motion.div
                    style={{ opacity: opacity2, y: y2 }}
                    className="absolute inset-x-0 flex flex-col items-end justify-center px-4 md:px-16 h-full text-right pointer-events-auto"
                >
                    <div className="max-w-xl bg-gradient-to-l from-[#050505]/95 via-[#050505]/70 to-transparent p-10 md:p-14 rounded-l-2xl border-r-2 border-[#D4AF37]/30">
                        <span
                            className="mb-4 text-[10px] tracking-[0.4em] uppercase text-[#D4AF37] font-medium drop-shadow-md block"
                            style={{ fontFamily: "var(--font-sans)" }}
                        >
                            The Craft
                        </span>
                        <h2
                            className="text-4xl md:text-5xl lg:text-7xl font-light text-white leading-[0.95] mt-3 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            Unwavering <br /> Quality
                        </h2>
                        <div className="flex items-center gap-3 mt-6 mb-6 justify-end">
                            <div className="w-1 h-1 rounded-full bg-[#D4AF37]/40" />
                            <div className="w-8 h-px bg-[#D4AF37]/40" />
                        </div>
                        <p
                            className="text-white/60 font-light text-sm md:text-base leading-relaxed max-w-md ml-auto"
                            style={{ fontFamily: "var(--font-sans)" }}
                        >
                            Our vision is driven by our valued customers. Every piece is a testament to purity and a reflection of your finest moments. Experience luxury that transcends generations.
                        </p>
                    </div>
                </motion.div>

                {/* Section 3 */}
                <motion.div
                    style={{ opacity: opacity3, y: y3, scale: scale3 }}
                    className="absolute inset-x-0 flex flex-col items-center justify-center px-4 text-center h-full pointer-events-auto"
                >
                    <div className="flex flex-col items-center">
                        <h2
                            className="text-4xl md:text-6xl lg:text-8xl font-light text-white leading-[0.95] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            Explore <br /> The Collections
                        </h2>
                        <div className="mt-10 flex items-center gap-3">
                            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
                            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60 shadow-[0_0_8px_rgba(212,175,53,0.4)]" />
                            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
                        </div>
                        <div className="mt-8 w-px h-20 bg-gradient-to-b from-[#D4AF37]/40 to-transparent" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
