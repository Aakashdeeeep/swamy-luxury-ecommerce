"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextReveal from "./TextReveal";

gsap.registerPlugin(ScrollTrigger);

export default function AboutTimeline() {
    const containerRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        // Image — clip-path reveal from center + grayscale→color on scroll
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
                    scrollTrigger: {
                        trigger: img,
                        start: "top 80%",
                    },
                }
            );

            // Grayscale→color on scroll
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

            // Parallax depth
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

        // Animated line draw
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

        // Timeline items — curtain reveal from left side
        const items = gsap.utils.toArray<HTMLElement>(".timeline-item");
        items.forEach((item) => {
            gsap.fromTo(
                item,
                {
                    clipPath: "inset(0 100% 0 0)",
                    opacity: 0,
                },
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

        // Timeline dots — elastic scale-in with golden ring pulse
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
                    scrollTrigger: {
                        trigger: dot,
                        start: "top 75%",
                    },
                }
            );
        });

        // "Read Our Full Story" link reveal
        gsap.fromTo(
            ".timeline-cta",
            { opacity: 0, y: 30, clipPath: "inset(100% 0 0 0)" },
            {
                opacity: 1,
                y: 0,
                clipPath: "inset(0% 0 0 0)",
                duration: 1.5,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: ".timeline-cta",
                    start: "top 90%",
                },
            }
        );

        // Year number scale-in
        gsap.fromTo(
            ".timeline-year",
            { scale: 0.5, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 2,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: ".timeline-year",
                    start: "top 85%",
                },
            }
        );

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-24 bg-background-dark relative overflow-hidden">
            <div className="absolute left-0 top-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="max-w-6xl mx-auto px-4 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    <div className="lg:w-1/2 relative" data-cursor-explore>
                        <div className="absolute -top-10 -left-10 w-24 h-24 border-t border-l border-accent-magenta/60 shadow-[inset_10px_10px_20px_rgba(80,18,55,0.2)]"></div>
                        <div className="absolute -bottom-10 -right-10 w-24 h-24 border-b border-r border-accent-magenta/60 shadow-[inset_-10px_-10px_20px_rgba(80,18,55,0.2)]"></div>
                        <div className="relative overflow-hidden aspect-[3/4]">
                            <img
                                alt="Artisan at work"
                                className="timeline-image w-full h-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpuIdqIVAN_VP5QCtN7U6JHFSH78WHgs0DNWmci-KGOydD7ffjF3tKPOvScXj1TrtLGbbaZa_dTdCqLp1ThAuu9j0-7bGlnc1jNZ4emU1Vx73u-dO0VC6q0DcENp20-BYrLWhJTJdkJ_g6S5yyg4DKBedIJJzmeV12kCTbrKzmus1RV3bbQXgcQ1Y-bxf3ojHmtAPJAMJwjsXdNXrjxwLx-fZ2lXYUmBImIrI_JwzufIVjjcP6WAzmnTjdXRCWzokKMSIN8l9DlKwv"
                                style={{ willChange: "transform, filter" }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
                            <h2 className="timeline-year absolute bottom-10 left-10 font-display text-6xl text-white drop-shadow-xl">1998</h2>
                        </div>
                    </div>

                    <div className="lg:w-1/2 space-y-12">
                        <div>
                            <TextReveal
                                as="h2"
                                split="chars"
                                className="font-display text-4xl text-white mb-6"
                                stagger={0.04}
                                duration={1.8}
                                triggerStart="top 80%"
                            >
                                A Legacy of Trust
                            </TextReveal>
                            <p className="timeline-item text-gray-400 leading-relaxed font-light text-lg">
                                What began as a humble atelier in Vadavalli has blossomed into Coimbatore&apos;s most trusted destination for pure gold and certified diamonds. For over two decades, Swamy Jewellery has not just sold ornaments, but has been a part of your family&apos;s most cherished moments.
                            </p>
                        </div>

                        <div className="relative pl-10 space-y-10">
                            {/* Animated line */}
                            <div className="timeline-line absolute left-0 top-0 bottom-0 w-px bg-white/10"></div>

                            <div className="relative timeline-item">
                                <span className="timeline-dot absolute -left-[45px] top-1 w-3 h-3 rounded-full bg-accent-magenta ring-4 ring-background-dark shadow-[0_0_10px_rgba(80,18,55,0.8)]"></span>
                                <h3 className="text-xl font-display text-white mb-2">The Beginning</h3>
                                <p className="text-sm text-gray-500">Founded in 1998 with a vision to bring 100% Hallmarked Gold to Vadavalli.</p>
                            </div>
                            <div className="relative timeline-item">
                                <span className="timeline-dot absolute -left-[45px] top-1 w-3 h-3 rounded-full bg-surface-dark border border-white/30 ring-4 ring-background-dark"></span>
                                <h3 className="text-xl font-display text-white mb-2">IGI Certification</h3>
                                <p className="text-sm text-gray-500">Set the standard by introducing IGI Certified Diamonds, ensuring transparency and quality.</p>
                            </div>
                            <div className="relative timeline-item">
                                <span className="timeline-dot absolute -left-[45px] top-1 w-3 h-3 rounded-full bg-surface-dark border border-white/30 ring-4 ring-background-dark"></span>
                                <h3 className="text-xl font-display text-white mb-2">2026 Vision</h3>
                                <p className="text-sm text-gray-500">Expanding our legacy with ultra-premium bespoke collections and a cinematic retail experience.</p>
                            </div>
                        </div>

                        <a className="timeline-cta inline-flex items-center gap-2 text-accent-magenta-light hover:text-white transition-colors text-sm uppercase tracking-widest border-b border-accent-magenta-light/50 pb-1" href="/our-story">
                            Read Our Full Story <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </a>
                    </div>

                </div>
            </div>
        </section>
    );
}
