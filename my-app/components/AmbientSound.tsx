"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AmbientSound() {
    const [playing, setPlaying] = useState(false);
    const [visible, setVisible] = useState(true);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const nodesRef = useRef<AudioNode[]>([]);

    // Create ambient tone using Web Audio API (no external file needed)
    const startAmbient = () => {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioCtxRef.current = ctx;

        const nodes: AudioNode[] = [];

        // Layered harmonic tones for luxury ambience
        const freqs = [55, 110, 220, 330, 440];
        freqs.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            filter.type = "lowpass";
            filter.frequency.setValueAtTime(600, ctx.currentTime);

            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.015 / (i + 1), ctx.currentTime + 2);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            nodes.push(osc, gain);
        });

        // Subtle shimmer (high-freq sweep)
        const shimmerOsc = ctx.createOscillator();
        const shimmerGain = ctx.createGain();
        shimmerOsc.type = "sine";
        shimmerOsc.frequency.setValueAtTime(800, ctx.currentTime);
        shimmerGain.gain.setValueAtTime(0.003, ctx.currentTime);
        shimmerOsc.connect(shimmerGain);
        shimmerGain.connect(ctx.destination);
        shimmerOsc.start();
        nodes.push(shimmerOsc, shimmerGain);

        nodesRef.current = nodes;
    };

    const stopAmbient = () => {
        if (audioCtxRef.current) {
            audioCtxRef.current.close();
            audioCtxRef.current = null;
            nodesRef.current = [];
        }
    };

    const toggle = () => {
        if (playing) {
            stopAmbient();
            setPlaying(false);
        } else {
            startAmbient();
            setPlaying(true);
        }
    };

    useEffect(() => {
        return () => stopAmbient();
    }, []);

    // Auto-hide after 8s if not interacted
    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 8000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                    onMouseEnter={() => setVisible(true)}
                    onClick={toggle}
                    className="fixed bottom-28 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-[#D4AF37]/30 bg-[#050505]/80 backdrop-blur-md text-[#C9B06B] hover:border-[#D4AF37]/60 hover:text-[#D4AF37] transition-all duration-400 shadow-[0_0_20px_rgba(212,175,53,0.1)] group"
                    data-cursor-hover
                    aria-label={playing ? "Mute ambient sound" : "Play ambient sound"}
                >
                    {/* Animated bars */}
                    <div className="flex items-end gap-[3px] h-4">
                        {[1, 2, 3].map((i) => (
                            <motion.span
                                key={i}
                                className="w-[3px] rounded-full bg-current"
                                animate={
                                    playing
                                        ? {
                                            height: ["8px", "16px", "6px", "14px", "8px"],
                                            transition: {
                                                duration: 1.2,
                                                repeat: Infinity,
                                                delay: i * 0.2,
                                                ease: "easeInOut",
                                            },
                                        }
                                        : { height: "8px" }
                                }
                            />
                        ))}
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-sans)" }}>
                        {playing ? "Sound On" : "Sound"}
                    </span>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
