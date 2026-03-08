"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ParticlesOverlay() {
    const [particles, setParticles] = useState<
        {
            id: number;
            top: string;
            left: string;
            size: number;
            delay: number;
            duration: number;
            drift: number;
            glow: number;
        }[]
    >([]);

    useEffect(() => {
        const p = Array.from({ length: 10 }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 1 + 0.5, // 0.5px to 1.5px
            delay: Math.random() * 12,
            duration: Math.random() * 20 + 18, // 18s to 38s — very slow
            drift: (Math.random() - 0.5) * 30, // reduced drift
            glow: Math.random() * 3 + 1, // minimal glow 1-4px
        }));
        setParticles(p);
    }, []);

    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden h-full">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                        top: p.top,
                        left: p.left,
                        width: p.size,
                        height: p.size,
                        background: `radial-gradient(circle, #D4AF37 0%, rgba(201,176,107,0.5) 50%, transparent 80%)`,
                        boxShadow: `0 0 ${p.glow}px rgba(212, 175, 55, 0.15)`,
                        opacity: 0,
                    }}
                    animate={{
                        y: ["0%", "-80%"],
                        x: [0, p.drift, -p.drift / 2],
                        opacity: [0, 0.15, 0.25, 0.1, 0],
                        scale: [0.5, 0.8, 1, 0.6],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}
