"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextReveal from "./TextReveal";

gsap.registerPlugin(ScrollTrigger);

const collections = [
    {
        title: "Bridal Collection",
        subtitle: "The Royal Vow",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhyuL7ZGl73F5G3exhfB2eoWFQYn9QZJCD2Wh9EYPr3HA155EhKD9J2q3e72oExdlVE4g2eIl6g1N0fpQfu4jfFkP_qz4SpIxIv3cb3HUHjdqZONa_ALi8YFlV5UV2zdNTp3c0V5Ox3N6uCvzPs5g7O4afkYy4gGozbWb5jqunq6OPJyDtnZLQ2by1_kY5bJ6_csvG-Nc31UuIkQ1BV4Qu68IBGV8xCmoVIgDXVeF28u7uI6QHicWGhCOjAA-sFvhSCSfTGpdn4fFE",
        hasPattern: true,
    },
    {
        title: "Gold Jewellery",
        subtitle: "Traditional 22K",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBh4bk0drqq8isBLlkKGh8uz4I7saGFelABygjwom-qSPNGiqySDajDTTfdij2EfzqeZJIj-E54D7vW_Ym7e0iYYebKNfseULhb7ymGASn0R9vrFP1L1f-62mOPXNAmE9ROnDrhjKt2NNToBYKdkxckuwrhAfH01zJGeSkKCNeyUMDNJQx3cxl21OUxclWz68c7qplBHO2iysz3Z5odG0BM7MSKWWquQ8G5OfV2BEo0nysx2HdGBdD9x1GugsuPFSgqBcoXWI7gmVs",
    },
    {
        title: "Diamond Jewellery",
        subtitle: "IGI Certified",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMsZsbbfrcrdS9rJ_AcZ1LGzmdpKcEl0OCAFSivxPkOolpZIoixtFMpYaQJCsc41DcTmLaRQNFYD44WTeT0X-gb_8yQuREwRcj1y4tIHmWdtT1Xjg3v0jb35zKv5vWDICNzF78H4zxO6qYV7A8q94Oe2tXTwKwXOgLoAK2KB1Jx7k7N3-usGpi2ZJGLEKD5rX3bqUHsEdawL_0AGMEw-q_EDWncfBmhpOm5KuRuoF8q17azSx8NV8I64xN152i16xVAnchTQZVE33W",
    },
    {
        title: "Pure Silver",
        subtitle: "Divine Articles",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuABlK03xJZabUm8hHXTU7-MI0xi9n4t8j2B2RU7ynAmgc9WMg1zfq3RmLWpq4VvO9wqIC8E0wLf-DAL-Ax-pzkviEn57dCxe3k4pNetucbfq95QPZybA2A5mT19EEMGrST8dU5whTk1OR-cJz-3IJsk_IOBlGSn7XZ5WbsetEWGDCeBUBoho4R44FrMgpB6bWHvDLzjxhXUTwk9gP8Uiu4OBf_CqUmaKu5rzQV7YGNmaNKXJ8OnPRIBRKICzjmVYFI4NLJaaiis8En6",
        isSilver: true,
    }
];

// Background color stops for scroll-driven transition
const bgColors = ["#0F0F0F", "#0D1117", "#110A18", "#0F0F0F"];

export default function HorizontalCollections() {
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current || !trackRef.current) return;

        const track = trackRef.current;
        const cards = gsap.utils.toArray<HTMLElement>(".hc-card");

        // Calculate total scroll width
        const totalWidth = track.scrollWidth - window.innerWidth;

        // Horizontal scroll driven by vertical scroll
        const scrollTween = gsap.to(track, {
            x: -totalWidth,
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: () => "+=" + totalWidth * 1.5,
                scrub: 1.5,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            },
        });

        // Cards: clip-path diamond reveal as they enter viewport
        cards.forEach((card) => {
            // Image Ken Burns slow zoom synced to scroll
            const img = card.querySelector("img");
            if (img) {
                gsap.fromTo(
                    img,
                    { scale: 1.2 },
                    {
                        scale: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: card,
                            containerAnimation: scrollTween,
                            start: "left right",
                            end: "right left",
                            scrub: 1,
                        },
                    }
                );
            }

            // Card reveal with clip-path
            gsap.fromTo(
                card,
                {
                    clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
                    opacity: 0.3,
                },
                {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    opacity: 1,
                    duration: 1.5,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        containerAnimation: scrollTween,
                        start: "left 85%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        });

        // Background color morphing as scroll progresses
        bgColors.forEach((color, i) => {
            if (i === 0) return;
            const progress = i / (bgColors.length - 1);
            gsap.to(sectionRef.current, {
                backgroundColor: color,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: `${(progress - 0.25) * 100}% top`,
                    end: `${progress * 100}% top`,
                    scrub: 1,
                },
            });
        });

        // Progress bar
        gsap.to(".hc-progress-fill", {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: () => "+=" + totalWidth * 1.5,
                scrub: 1,
            },
        });

        // Glowing dot on progress bar
        gsap.to(".hc-progress-dot", {
            left: "100%",
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: () => "+=" + totalWidth * 1.5,
                scrub: 1,
            },
        });

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative bg-[#0F0F0F] overflow-hidden min-h-screen">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-magenta/20 to-transparent"></div>

            <div className="pt-24 pb-12 px-4 lg:px-8 max-w-7xl mx-auto flex items-end justify-between">
                <div>
                    <TextReveal
                        as="span"
                        split="chars"
                        className="text-accent-magenta-light text-[10px] uppercase tracking-[0.4em] mb-3 block"
                        stagger={0.04}
                        duration={1.2}
                        triggerStart="top 85%"
                    >
                        Explore
                    </TextReveal>
                    <TextReveal
                        as="h2"
                        split="chars"
                        className="font-display text-3xl md:text-5xl text-white mb-2"
                        stagger={0.03}
                        duration={1.8}
                        ease="expo.out"
                        triggerStart="top 85%"
                    >
                        Curated Categories
                    </TextReveal>
                    <div className="hc-heading-line h-0.5 w-24 bg-accent-magenta mt-4 shadow-[0_0_10px_rgba(125,28,85,0.5)]"></div>
                </div>
                <div className="hidden md:flex items-center gap-4">
                    <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll to explore</span>
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-primary text-sm animate-pulse">arrow_forward</span>
                    </div>
                </div>
            </div>

            {/* The horizontal track */}
            <div ref={trackRef} className="flex gap-8 px-4 lg:px-8 pb-8 will-change-transform" style={{ width: "fit-content" }}>
                {collections.map((item, idx) => (
                    <div key={idx} className="hc-card shrink-0 w-[350px] md:w-[420px] group cursor-pointer relative" data-cursor-explore>
                        {item.isSilver ? (
                            <div className="absolute -inset-0.5 bg-gradient-to-b from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 rounded-xl blur"></div>
                        ) : (
                            <div className="absolute -inset-0.5 bg-gradient-to-b from-accent-magenta/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 rounded-xl blur"></div>
                        )}
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-surface-dark border border-white/5">
                            <img
                                alt={item.title}
                                className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100 ${item.isSilver ? "grayscale hover:grayscale-0" : ""}`}
                                src={item.image}
                                style={{ willChange: "transform" }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-accent-magenta-dark/90 via-black/20 to-transparent"></div>
                            {item.hasPattern && (
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjRkZGIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')]"></div>
                            )}
                            <div className="absolute bottom-8 left-8 z-20">
                                <h3 className="font-display text-3xl text-text-cream mb-2 group-hover:text-accent-magenta-light transition-colors">{item.title}</h3>
                                <p className={`text-sm uppercase tracking-widest font-light ${item.isSilver ? "text-gray-300" : "text-primary-light"}`}>{item.subtitle}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Progress Bar with glowing dot */}
            <div className="px-4 lg:px-8 pb-12 max-w-7xl mx-auto">
                <div className="relative h-[2px] bg-white/10 rounded-full overflow-visible">
                    <div className="hc-progress-fill h-full bg-gradient-to-r from-accent-magenta to-primary origin-left" style={{ transform: "scaleX(0)" }}></div>
                    <div className="hc-progress-dot absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-[0_0_12px_rgba(212,175,53,0.8)] left-0" style={{ transition: "left 0s" }}></div>
                </div>
            </div>
        </section>
    );
}
