"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import TextReveal from "./TextReveal";
import { useCollections } from "../lib/hooks";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ─── Fallback static data (used when Supabase is not configured) ─── */
const FALLBACK_COLLECTIONS = [
    {
        title: "Bridal Collection",
        subtitle: "The Royal Vow",
        description: "A celebration of eternal love",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhyuL7ZGl73F5G3exhfB2eoWFQYn9QZJCD2Wh9EYPr3HA155EhKD9J2q3e72oExdlVE4g2eIl6g1N0fpQfu4jfFkP_qz4SpIxIv3cb3HUHjdqZONa_ALi8YFlV5UV2zdNTp3c0V5Ox3N6uCvzPs5g7O4afkYy4gGozbWb5jqunq6OPJyDtnZLQ2by1_kY5bJ6_csvG-Nc31UuIkQ1BV4Qu68IBGV8xCmoVIgDXVeF28u7uI6QHicWGhCOjAA-sFvhSCSfTGpdn4fFE",
    },
    {
        title: "Gold Jewellery",
        subtitle: "Traditional 22K",
        description: "Heritage craftsmanship in pure gold",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBh4bk0drqq8isBLlkKGh8uz4I7saGFelABygjwom-qSPNGiqySDajDTTfdij2EfzqeZJIj-E54D7vW_Ym7e0iYYebKNfseULhb7ymGASn0R9vrFP1L1f-62mOPXNAmE9ROnDrhjKt2NNToBYKdkxckuwrhAfH01zJGeSkKCNeyUMDNJQx3cxl21OUxclWz68c7qplBHO2iysz3Z5odG0BM7MSKWWquQ8G5OfV2BEo0nysx2HdGBdD9x1GugsuPFSgqBcoXWI7gmVs",
    },
    {
        title: "Diamond Jewellery",
        subtitle: "IGI Certified",
        description: "Brilliance beyond measure",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMsZsbbfrcrdS9rJ_AcZ1LGzmdpKcEl0OCAFSivxPkOolpZIoixtFMpYaQJCsc41DcTmLaRQNFYD44WTeT0X-gb_8yQuREwRcj1y4tIHmWdtT1Xjg3v0jb35zKv5vWDICNzF78H4zxO6qYV7A8q94Oe2tXTwKwXOgLoAK2KB1Jx7k7N3-usGpi2ZJGLEKD5rX3bqUHsEdawL_0AGMEw-q_EDWncfBmhpOm5KuRuoF8q17azSx8NV8I64xN152i16xVAnchTQZVE33W",
    },
    {
        title: "Pure Silver",
        subtitle: "Divine Articles",
        description: "Sacred artistry in silver",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuABlK03xJZabUm8hHXTU7-MI0xi9n4t8j2B2RU7ynAmgc9WMg1zfq3RmLWpq4VvO9wqIC8E0wLf-DAL-Ax-pzkviEn57dCxe3k4pNetucbfq95QPZybA2A5mT19EEMGrST8dU5whTk1OR-cJz-3IJsk_IOBlGSn7XZ5WbsetEWGDCeBUBoho4R44FrMgpB6bWHvDLzjxhXUTwk9gP8Uiu4OBf_CqUmaKu5rzQV7YGNmaNKXJ8OnPRIBRKICzjmVYFI4NLJaaiis8En6",
    },
];

export default function HorizontalCollections() {
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const isAnimating = useRef(false);

    // Dynamic data from Supabase with fallback
    const { collections: dbCollections, loading: dbLoading } = useCollections();
    const collections = dbCollections.length > 0
        ? dbCollections.map((c) => ({ title: c.title, subtitle: c.subtitle ?? "", description: c.description ?? "", image: c.image_url ?? "" }))
        : FALLBACK_COLLECTIONS;

    const handleJumpToSlide = (index: number) => {
        if (isAnimating.current || index === currentIndex) return;
        setCurrentIndex(index);
    };

    const handlePrev = () => {
        if (currentIndex > 0) handleJumpToSlide(currentIndex - 1);
    };

    const handleNext = () => {
        if (currentIndex < collections.length - 1) handleJumpToSlide(currentIndex + 1);
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (isAnimating.current) return;
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        if (delta > 30) handleNext();
        else if (delta < -30) handlePrev();
    };

    useGSAP(
        () => {
            if (!trackRef.current) return;

            const track = trackRef.current;
            const bgs = gsap.utils.toArray<HTMLElement>(".saisei-bg");
            const fgs = gsap.utils.toArray<HTMLElement>(".saisei-fg");
            const texts = gsap.utils.toArray<HTMLElement>(".saisei-text-wrap");

            isAnimating.current = true;

            gsap.to(track, {
                x: -currentIndex * window.innerWidth,
                duration: 1.6,
                ease: "power4.inOut",
                onComplete: () => {
                    isAnimating.current = false;
                },
            });

            bgs.forEach((bg, i) => {
                const bgOffset = (i - currentIndex) * 15;
                gsap.to(bg, {
                    xPercent: bgOffset,
                    duration: 1.6,
                    ease: "power4.inOut",
                });
            });

            fgs.forEach((fg, i) => {
                const isActive = i === currentIndex;
                gsap.to(fg, {
                    scale: isActive ? 1 : 0.65,
                    filter: isActive ? "brightness(1) blur(0px)" : "brightness(0.15) blur(8px)",
                    opacity: isActive ? 1 : 0.3,
                    duration: 1.6,
                    ease: "power4.inOut",
                });
            });

            texts.forEach((text, i) => {
                const isActive = i === currentIndex;
                gsap.to(text, {
                    y: isActive ? 0 : 80,
                    opacity: isActive ? 1 : 0,
                    duration: isActive ? 1.2 : 0.5,
                    delay: isActive ? 0.6 : 0,
                    ease: "power3.out",
                });
            });
        },
        { dependencies: [currentIndex], scope: sectionRef }
    );

    return (
        <section
            ref={sectionRef}
            className="relative h-screen w-full overflow-hidden bg-black"
            onWheel={handleWheel}
        >
            {/* Title overlay */}
            <div className="absolute top-10 left-12 z-50 pointer-events-none mix-blend-difference hidden md:block">
                <TextReveal
                    as="h2"
                    split="chars"
                    className="text-4xl md:text-5xl text-white tracking-[0.25em] uppercase font-light"
                    stagger={0.04}
                    duration={1.5}
                    style={{ fontFamily: "var(--font-editorial)" }}
                >
                    Curated Masterpieces
                </TextReveal>
                <div className="mt-3 flex items-center gap-3">
                    <div className="w-12 h-px bg-[#C9B06B]/30" />
                    <span className="text-[#C9B06B]/50 text-[11px] uppercase tracking-[0.3em] font-light" style={{ fontFamily: "var(--font-sans)" }}>Explore the Collection</span>
                </div>
            </div>

            {/* Navigation */}
            <div className="absolute bottom-12 left-12 z-50 flex items-center gap-8 text-sm tracking-[0.15em] font-medium text-white/40">
                <button
                    onClick={handlePrev}
                    className={`hover:text-white transition-colors duration-300 py-4 outline-none uppercase flex items-center gap-2 group ${currentIndex === 0 ? "opacity-20 cursor-not-allowed" : ""
                        }`}
                    data-cursor-hover
                    disabled={currentIndex === 0}
                    style={{ fontFamily: "var(--font-editorial)" }}
                >
                    <span className="w-6 h-px bg-white/30 group-hover:w-10 group-hover:bg-[#C9B06B] transition-all duration-500" />
                    Prev
                </button>
                <button
                    onClick={handleNext}
                    className={`hover:text-white transition-colors duration-300 py-4 outline-none uppercase flex items-center gap-2 group ${currentIndex === collections.length - 1 ? "opacity-20 cursor-not-allowed" : ""
                        }`}
                    data-cursor-hover
                    disabled={currentIndex === collections.length - 1}
                    style={{ fontFamily: "var(--font-editorial)" }}
                >
                    Next
                    <span className="w-6 h-px bg-white/30 group-hover:w-10 group-hover:bg-[#C9B06B] transition-all duration-500" />
                </button>
            </div>

            {/* Counter */}
            <div className="absolute top-12 right-12 z-50 text-white font-mono text-xl pointer-events-none drop-shadow-lg flex items-baseline gap-1">
                <span className="text-[#D4AF37] tabular-nums">0{currentIndex + 1}</span>
                <span className="text-white/20 text-sm mx-1">/</span>
                <span className="text-white/30 text-sm">0{collections.length}</span>
            </div>

            {/* Pagination dots */}
            <div className="absolute bottom-12 right-12 z-50 flex flex-col gap-3">
                {collections.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => handleJumpToSlide(i)}
                        className="group flex items-center justify-center p-2 -m-2 outline-none cursor-pointer"
                        data-cursor-hover
                        aria-label={`Jump to slide ${i + 1}`}
                    >
                        <div
                            className={`transition-all duration-700 ease-out rounded-full ${i === currentIndex
                                ? "w-2 h-8 bg-[#D4AF37] shadow-[0_0_12px_rgba(212,175,53,0.5)]"
                                : "w-1.5 h-3 bg-white/20 group-hover:bg-white/40"
                                }`}
                        />
                    </button>
                ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/[0.03] z-50">
                <div
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#C9B06B] transition-all duration-[1.4s] ease-[cubic-bezier(0.76,0,0.24,1)] shadow-[0_0_8px_rgba(212,175,53,0.3)]"
                    style={{ width: `${((currentIndex + 1) / collections.length) * 100}%` }}
                />
            </div>

            {/* Track */}
            <div
                ref={trackRef}
                className="flex h-full will-change-transform"
                style={{ width: `${collections.length * 100}vw` }}
            >
                {collections.map((item, idx) => (
                    <div
                        key={idx}
                        className="saisei-slide relative w-screen h-full flex items-center justify-center shrink-0 overflow-hidden"
                        data-cursor-explore
                    >
                        {/* Background parallax */}
                        <div className="absolute inset-0 z-0">
                            <div className="saisei-bg w-[140%] h-full relative -left-[20%]">
                                <img
                                    src={item.image}
                                    alt="bg"
                                    className="w-full h-full object-cover blur-3xl opacity-25 scale-125 saturate-150"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black opacity-80" />
                            </div>
                        </div>

                        {/* Foreground card */}
                        <div className="saisei-fg relative z-10 h-[60vh] max-h-[550px] min-h-[350px] aspect-[3/4] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.9)] rounded-lg border border-white/5 group">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2.5s] ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

                            {/* Text inside card */}
                            <div className="saisei-text-wrap absolute bottom-12 left-10 right-10">
                                <p
                                    className="text-[#C9B06B] uppercase tracking-[0.4em] text-[11px] font-semibold mb-3 drop-shadow-md"
                                    style={{ fontFamily: "var(--font-sans)" }}
                                >
                                    {item.subtitle}
                                </p>
                                <h3
                                    className="text-5xl md:text-6xl text-white mb-4 leading-[1.05] drop-shadow-xl font-light"
                                    style={{ fontFamily: "var(--font-editorial)" }}
                                >
                                    {item.title}
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-px bg-[#C9B06B]/30" />
                                    <p
                                        className="text-white/45 text-sm font-light tracking-wide"
                                        style={{ fontFamily: "var(--font-sans)" }}
                                    >
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Vignettes */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black to-transparent pointer-events-none z-40" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none z-40" />
        </section>
    );
}
