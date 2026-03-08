"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";

interface ProductCardProps {
    title: string;
    category: string;
    imageSrc: string;
    badge?: string;
    isFirst?: boolean;
    slug?: string;
}

/* Map e-commerce badges to editorial language */
function editorialLabel(badge?: string): string | undefined {
    if (!badge) return undefined;
    const map: Record<string, string> = {
        "Best Seller": "Maison Signature",
        "New Arrival": "Nouveau",
        "Featured": "Editor's Pick",
    };
    return map[badge] ?? badge;
}

export default function ProductCard({ title, category, imageSrc, badge, isFirst, slug }: ProductCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        const content = contentRef.current;
        const glow = glowRef.current;
        if (!card || !content) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            gsap.to(content, {
                rotateX,
                rotateY,
                duration: 0.5,
                ease: "power2.out",
                transformPerspective: 1000,
            });

            // Gold glow follows cursor
            if (glow) {
                gsap.to(glow, {
                    x: x - rect.width / 2,
                    y: y - rect.height / 2,
                    opacity: 0.5,
                    duration: 0.3,
                    ease: "power2.out",
                });
            }
        };

        const handleMouseLeave = () => {
            gsap.to(content, {
                rotateX: 0,
                rotateY: 0,
                duration: 1.4,
                ease: "elastic.out(1, 0.3)",
            });
            if (glow) {
                gsap.to(glow, { opacity: 0, duration: 0.5 });
            }
        };

        card.addEventListener("mousemove", handleMouseMove);
        card.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            card.removeEventListener("mousemove", handleMouseMove);
            card.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    const label = editorialLabel(badge);

    const cardContent = (
        <div ref={cardRef} className={`group ${isFirst ? "" : "lg:mt-16"} cursor-pointer`} data-cursor-explore>
            <div
                ref={contentRef}
                className="glass-magenta rounded-sm border border-white/[0.05] overflow-hidden relative shadow-[0_20px_60px_rgba(0,0,0,0.8)] transition-shadow duration-700 group-hover:shadow-[0_40px_100px_rgba(212,175,53,0.08)] border-glow-pulse"
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Cursor-following glow */}
                <div
                    ref={glowRef}
                    className="absolute w-48 h-48 rounded-full pointer-events-none z-30 opacity-0"
                    style={{
                        background: "radial-gradient(circle, rgba(212,175,53,0.12) 0%, transparent 70%)",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                />

                {label && (
                    <div
                        className="editorial-badge absolute top-6 left-6 z-20 shadow-lg"
                        style={{ transform: "translateZ(30px)" }}
                    >
                        {label}
                    </div>
                )}

                <div className="aspect-[3/4] overflow-hidden relative bg-black/40">
                    <img
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-110 opacity-70 group-hover:opacity-100"
                        src={imageSrc}
                    />
                    {/* Cinematic vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/10 opacity-60 group-hover:opacity-80 transition-opacity duration-700" />

                    {/* Gold border glow on hover */}
                    <div className="absolute inset-0 border border-[#D4AF37]/0 group-hover:border-[#D4AF37]/10 transition-all duration-700 rounded-sm pointer-events-none" />
                </div>

                {/* 3D floating content */}
                <div
                    className="absolute inset-x-0 bottom-0 p-10 flex flex-col items-center text-center pointer-events-none"
                    style={{ transform: "translateZ(60px)" }}
                >
                    <h3
                        className="text-2xl text-white mb-3 drop-shadow-2xl scale-95 group-hover:scale-100 transition-transform duration-700 font-light"
                        style={{ fontFamily: "var(--font-editorial)" }}
                    >
                        {title}
                    </h3>
                    <div className="h-px w-0 bg-gradient-to-r from-transparent via-[#C9B06B] to-transparent group-hover:w-20 transition-all duration-700 ease-out mb-3" />
                    <p
                        className="text-[#C9B06B]/80 text-[8px] uppercase tracking-[0.35em] font-medium opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700"
                        style={{ fontFamily: "var(--font-sans)" }}
                    >
                        {category}
                    </p>

                    {/* Discover micro-text */}
                    <span
                        className="mt-5 text-[7px] uppercase tracking-[0.4em] text-white/0 group-hover:text-white/30 transition-all duration-700 delay-200"
                        style={{ fontFamily: "var(--font-sans)" }}
                    >
                        Discover →
                    </span>
                </div>
            </div>
        </div>
    );

    if (slug) {
        return <Link href={`/product/${slug}`}>{cardContent}</Link>;
    }
    return cardContent;
}
