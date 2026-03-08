"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextReveal from "./TextReveal";

gsap.registerPlugin(ScrollTrigger);

export default function AboutTimeline() {
    const containerRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            if (!containerRef.current) return;

            // Image clip-path reveal
            const img = containerRef.current.querySelector<HTMLElement>(".timeline-image");
            if (img) {
                gsap.fromTo(
                    img,
                    { clipPath: "inset(50% 50% 50% 50%)", scale: 1.2 },
                    {
                        clipPath: "inset(0% 0% 0% 0%)",
                        scale: 1,
                        duration: 2.5,
                        ease: "expo.out",
                        scrollTrigger: { trigger: img, start: "top 80%" },
                    }
                );

                // Grayscale→color
                gsap.fromTo(
                    img,
                    { filter: "grayscale(1)" },
                    {
                        filter: "grayscale(0)",
                        ease: "none",
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: "top bottom",
                            end: "center center",
                            scrub: 2,
                        },
                    }
                );

                // Parallax
                gsap.to(img, {
                    yPercent: 15,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 2,
                    },
                });
            }

            // Gold timeline line draw
            const timelineLine = containerRef.current.querySelector(".timeline-line");
            if (timelineLine) {
                gsap.fromTo(
                    timelineLine,
                    { scaleY: 0, transformOrigin: "top" },
                    {
                        scaleY: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: timelineLine,
                            start: "top 70%",
                            end: "bottom 50%",
                            scrub: 1,
                        },
                    }
                );
            }

            // Timeline items — curtain reveal
            const items = gsap.utils.toArray<HTMLElement>(".timeline-item");
            items.forEach((item) => {
                gsap.fromTo(
                    item,
                    { clipPath: "inset(0 100% 0 0)", opacity: 0 },
                    {
                        clipPath: "inset(0 0% 0 0)",
                        opacity: 1,
                        duration: 1.5,
                        ease: "expo.out",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 80%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            });

            // Timeline dots — elastic with gold pulse
            const dots = gsap.utils.toArray<HTMLElement>(".timeline-dot");
            dots.forEach((dot) => {
                gsap.fromTo(
                    dot,
                    { scale: 0, opacity: 0 },
                    {
                        scale: 1,
                        opacity: 1,
                        duration: 1.5,
                        ease: "elastic.out(1, 0.3)",
                        scrollTrigger: { trigger: dot, start: "top 75%" },
                    }
                );
            });

            // CTA reveal
            gsap.fromTo(
                ".timeline-cta",
                { opacity: 0, y: 30, clipPath: "inset(100% 0 0 0)" },
                {
                    opacity: 1,
                    y: 0,
                    clipPath: "inset(0% 0 0 0)",
                    duration: 1.5,
                    ease: "expo.out",
                    scrollTrigger: { trigger: ".timeline-cta", start: "top 90%" },
                }
            );

            // Year scale-in
            gsap.fromTo(
                ".timeline-year",
                { scale: 0.5, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 2,
                    ease: "expo.out",
                    scrollTrigger: { trigger: ".timeline-year", start: "top 85%" },
                }
            );
        },
        { scope: containerRef }
    );

    return (
        <section ref={containerRef} className="section-ceremonial bg-background-dark relative overflow-hidden">
            {/* Subtle texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/[0.03] rounded-full blur-[200px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-20 items-center">
                    {/* Image */}
                    <div className="lg:w-1/2 relative" data-cursor-explore>
                        <div className="absolute -top-10 -left-10 w-24 h-24 border-t border-l border-[#D4AF37]/20" />
                        <div className="absolute -bottom-10 -right-10 w-24 h-24 border-b border-r border-[#D4AF37]/20" />
                        <div className="relative overflow-hidden aspect-[3/4] rounded-sm">
                            <img
                                alt="Artisan at work"
                                className="timeline-image w-full h-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpuIdqIVAN_VP5QCtN7U6JHFSH78WHgs0DNWmci-KGOydD7ffjF3tKPOvScXj1TrtLGbbaZa_dTdCqLp1ThAuu9j0-7bGlnc1jNZ4emU1Vx73u-dO0VC6q0DcENp20-BYrLWhJTJdkJ_g6S5yyg4DKBedIJJzmeV12kCTbrKzmus1RV3bbQXgcQ1Y-bxf3ojHmtAPJAMJwjsXdNXrjxwLx-fZ2lXYUmBImIrI_JwzufIVjjcP6WAzmnTjdXRCWzokKMSIN8l9DlKwv"
                                style={{ willChange: "transform, filter" }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent" />
                            <h2
                                className="timeline-year absolute bottom-10 left-10 text-6xl text-gold-gradient drop-shadow-xl"
                                style={{ fontFamily: "var(--font-display)" }}
                            >
                                1998
                            </h2>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:w-1/2 space-y-12">
                        <div>
                            <TextReveal
                                as="h2"
                                split="chars"
                                className="text-4xl md:text-5xl text-white mb-8 font-light"
                                stagger={0.04}
                                duration={1.8}
                                triggerStart="top 80%"
                                style={{ fontFamily: "var(--font-editorial)" }}
                            >
                                A Legacy of Trust
                            </TextReveal>
                            <p
                                className="timeline-item text-gray-400 leading-relaxed font-light text-lg"
                                style={{ fontFamily: "var(--font-sans)" }}
                            >
                                What began as a humble atelier in Vadavalli has blossomed into Coimbatore&apos;s most trusted destination for pure gold and certified diamonds. For over two decades, Swamy Jewellery has not just sold ornaments, but has been a part of your family&apos;s most cherished moments.
                            </p>
                        </div>

                        <div className="relative pl-10 space-y-10">
                            {/* Gold timeline line */}
                            <div className="timeline-line absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#D4AF37]/30 via-[#D4AF37]/15 to-transparent" />

                            <div className="relative timeline-item">
                                <span className="timeline-dot absolute -left-[45px] top-1 w-3 h-3 bg-[#D4AF37] ring-4 ring-background-dark shadow-[0_0_15px_rgba(212,175,53,0.5)] rotate-45" />
                                <h3
                                    className="text-xl text-white mb-2 font-light"
                                    style={{ fontFamily: "var(--font-editorial)" }}
                                >
                                    The Beginning
                                </h3>
                                <p className="text-sm text-gray-500 font-light" style={{ fontFamily: "var(--font-sans)" }}>
                                    Founded in 1998 with a vision to bring 100% Hallmarked Gold to Vadavalli.
                                </p>
                            </div>
                            <div className="relative timeline-item">
                                <span className="timeline-dot absolute -left-[45px] top-1 w-3 h-3 bg-[#D4AF37]/60 ring-4 ring-background-dark shadow-[0_0_10px_rgba(212,175,53,0.3)] rotate-45" />
                                <h3
                                    className="text-xl text-white mb-2 font-light"
                                    style={{ fontFamily: "var(--font-editorial)" }}
                                >
                                    IGI Certification
                                </h3>
                                <p className="text-sm text-gray-500 font-light" style={{ fontFamily: "var(--font-sans)" }}>
                                    Set the standard by introducing IGI Certified Diamonds, ensuring transparency and quality.
                                </p>
                            </div>
                            <div className="relative timeline-item">
                                <span className="timeline-dot absolute -left-[45px] top-1 w-3 h-3 bg-[#D4AF37]/40 ring-4 ring-background-dark shadow-[0_0_10px_rgba(212,175,53,0.2)] rotate-45" />
                                <h3
                                    className="text-xl text-white mb-2 font-light"
                                    style={{ fontFamily: "var(--font-editorial)" }}
                                >
                                    2026 Vision
                                </h3>
                                <p className="text-sm text-gray-500 font-light" style={{ fontFamily: "var(--font-sans)" }}>
                                    Expanding our legacy with ultra-premium bespoke collections and a cinematic retail experience.
                                </p>
                            </div>
                        </div>

                        <a
                            className="timeline-cta inline-flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors duration-500 text-sm uppercase tracking-widest border-b border-[#D4AF37]/30 pb-1 group"
                            href="/our-story"
                            data-cursor-hover
                            style={{ fontFamily: "var(--font-sans)" }}
                        >
                            Read Our Full Story
                            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform duration-300">
                                arrow_forward
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
