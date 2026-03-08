"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CustomCursor from "../../components/CustomCursor";
import TextReveal from "../../components/TextReveal";

gsap.registerPlugin(ScrollTrigger);

/* ─── Data ──────────────────────────────────────────── */
const milestones = [
    {
        year: "1998",
        title: "The Humble Beginning",
        description:
            "Mr. Swamy established a small workshop in Vadavalli with just three artisans, focusing entirely on bespoke temple jewelry for local patrons.",
        dotColor: "bg-[#D4AF37]",
        dotGlow: "shadow-[0_0_15px_rgba(212,175,53,0.5)]",
    },
    {
        year: "2008",
        title: "The Flagship Store",
        description:
            "Opening the doors to our iconic Vadavalli showroom, expanding our collection to include diamonds, platinum, and introducing 100% 916 Hallmark transparency.",
        dotColor: "bg-[#7D1C55]",
        dotGlow: "shadow-[0_0_15px_rgba(125,28,85,0.5)]",
    },
    {
        year: "2015",
        title: "Bridal Excellence Award",
        description:
            "Recognized statewide for our intricate Bridal sets, specifically our mastery over Antique and Kempu stone embeddings.",
        dotColor: "bg-white",
        dotGlow: "shadow-[0_0_15px_rgba(255,255,255,0.5)]",
    },
    {
        year: "Now",
        title: "A Global Legacy",
        description:
            "Serving over 100,000 trusted families globally, bridging the gap between traditional South Indian artistry and modern luxury.",
        dotColor: "bg-gradient-to-r from-[#D4AF37] to-[#7D1C55]",
        dotGlow: "shadow-[0_0_20px_rgba(212,175,53,0.8)]",
        isPresent: true,
    },
];

const craftFeatures = [
    {
        icon: "diamond",
        title: "VVS1/IF Diamonds",
        description:
            "Every diamond is rigorously selected, IGI certified, ensuring flawless brilliance in every setting.",
    },
    {
        icon: "workspace_premium",
        title: "100% 916 BIS Hallmark",
        description:
            "Our gold's purity is uncompromising. Every piece bears the stamp of authenticity and trust.",
    },
    {
        icon: "handyman",
        title: "Master Artisans",
        description:
            "Our craftsmen descend from generations of temple jewelry makers, embedding soul into metal.",
    },
];

const galleryImages = [
    {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-fbbNVsP1AaRHnZm2zXYWEq8l0aoQFCQYnIFQCo9w-g6f7W1pPNW3spk7v_z2HSAfLXCnzpKyznTJ3SVr8ir099PWfnHyVnyTMGAFg2rhJzyEskcWWDAJ853Jrp1YQ7a6vEHRzysgKZOsM_3nJ9eZ7-0VcmGfVl-v-9qPDoHxhE4Bfx0WvNiiylqN7xxjPb36EHRxJiU-GP-LluNQbnP-3GEHjyvHE6BbdNtoYVAYleUDPCX1_J60pPlAl_QfH1mo4a837ern_Ydd",
        alt: "Store Entry",
    },
    {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYAheP_OHJBQYuIBQ-4KKG3qsc5MxirFQwWMtodLbuuvWlRBO7aHsYwgc1JD2eD4RjIwRjPifOnvm2l0mdAGSy6PiCdvGmWWKX5WLmKrDIa9RW0PCxCNkhgOYHMXibA5nhs9H7M-vBj8V9RLWL-cQfhKldcBZ-7Ap_dFPoavGzIkQY8yFH_2-OfyjM5Ios6rFB0p1LWA8dG6bq5IJh-ITKOojC__WEbqZp3ungCVFaP36VFf6Dftd7ziF88uQtY6OF0p-XDUB77b-v",
        alt: "Bridal Lounge",
    },
    {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKMq9ue4DRkB_dsoGhawlMvBs8lITdB2YW8UDCVWsneh_ZBojJA8kllI78rt-rqrVb4XapkxLyahch5KufY9iK-ouevhzdiQUXeuPJT044rgEMGiwA54U4wmjSZOFUvvqcfbpp93465kYdKxWOjUl0OFXfRYWo3ICvn3TdO1BsbvxmLRh3T2IOEyzl8bR1q1X8-E490QSVndJgAwbZ5DGk6qkCLTwQ1sFW73gRg01xOziKpV79rDw4iD5rezXJ2K8z2Zts_iL2xf6O",
        alt: "Diamond Section",
    },
    {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpuIdqIVAN_VP5QCtN7U6JHFSH78WHgs0DNWmci-KGOydD7ffjF3tKPOvScXj1TrtLGbbaZa_dTdCqLp1ThAuu9j0-7bGlnc1jNZ4emU1Vx73u-dO0VC6q0DcENp20-BYrLWhJTJdkJ_g6S5yyg4DKBedIJJzmeV12kCTbrKzmus1RV3bbQXgcQ1Y-bxf3ojHmtAPJAMJwjsXdNXrjxwLx-fZ2lXYUmBImIrI_JwzufIVjjcP6WAzmnTjdXRCWzokKMSIN8l9DlKwv",
        alt: "Artisan Workshop",
    },
];

/* ─── Component ─────────────────────────────────────── */
export default function OurStoryPage() {
    const pageRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const timelineRef = useRef<HTMLElement>(null);
    const craftRef = useRef<HTMLElement>(null);
    const galleryRef = useRef<HTMLElement>(null);
    const formRef = useRef<HTMLElement>(null);

    // Form state
    const [formData, setFormData] = useState({ name: "", phone: "", date: "", interest: "Bridal Jewellery" });
    const [formSubmitted, setFormSubmitted] = useState(false);

    useGSAP(
        () => {
            if (!pageRef.current) return;

            /* ── Hero ──────────────────────────────── */
            if (heroRef.current) {
                const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
                tl.from(".story-hero-icon", { scale: 0, opacity: 0, duration: 0.6, ease: "back.out(2)" }, 0.3);
                tl.from(".story-hero-title", { opacity: 0, y: 80, skewY: 4, duration: 1.2 }, 0.5);
                tl.from(".story-hero-sub", { opacity: 0, y: 30, duration: 0.8 }, 0.9);
            }

            /* ── Timeline ──────────────────────────── */
            if (timelineRef.current) {
                gsap.from(".story-journey-badge", {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.6,
                    ease: "back.out(2)",
                    scrollTrigger: { trigger: ".story-journey-badge", start: "top 85%" },
                });

                const tLine = timelineRef.current.querySelector(".story-timeline-line");
                if (tLine) {
                    gsap.from(tLine, {
                        scaleY: 0,
                        transformOrigin: "top",
                        ease: "none",
                        scrollTrigger: {
                            trigger: tLine,
                            start: "top 60%",
                            end: "bottom 40%",
                            scrub: 1,
                        },
                    });
                }

                const ms = gsap.utils.toArray<HTMLElement>(".story-milestone");
                ms.forEach((m, i) => {
                    gsap.from(m, {
                        opacity: 0,
                        x: i % 2 === 0 ? -80 : 80,
                        y: 30,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: m,
                            start: "top 82%",
                            toggleActions: "play none none reverse",
                        },
                    });
                });

                gsap.utils.toArray<HTMLElement>(".story-dot").forEach((dot) => {
                    gsap.from(dot, {
                        scale: 0,
                        duration: 0.5,
                        ease: "back.out(3)",
                        scrollTrigger: { trigger: dot, start: "top 80%" },
                    });
                });

                gsap.utils.toArray<HTMLElement>(".story-year").forEach((y) => {
                    gsap.from(y, {
                        opacity: 0,
                        scale: 0.5,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: { trigger: y, start: "top 85%" },
                    });
                });
            }

            /* ── Craftsmanship ─────────────────────── */
            if (craftRef.current) {
                gsap.from(".craft-label", {
                    opacity: 0,
                    y: 20,
                    duration: 0.6,
                    scrollTrigger: { trigger: craftRef.current, start: "top 75%" },
                });
                gsap.from(".craft-title", {
                    opacity: 0,
                    y: 60,
                    skewY: 3,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: { trigger: craftRef.current, start: "top 75%" },
                });
                gsap.from(".craft-feature", {
                    opacity: 0,
                    x: -40,
                    stagger: 0.2,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: { trigger: ".craft-feature", start: "top 85%" },
                });

                const craftImg = craftRef.current.querySelector(".craft-image");
                if (craftImg) {
                    gsap.from(craftImg, {
                        clipPath: "inset(0 0 100% 0)",
                        duration: 1.5,
                        ease: "power3.inOut",
                        scrollTrigger: { trigger: craftImg, start: "top 75%" },
                    });
                }

                gsap.from(".craft-quote", {
                    opacity: 0,
                    y: 40,
                    duration: 0.8,
                    delay: 0.5,
                    scrollTrigger: { trigger: ".craft-quote", start: "top 90%" },
                });
            }

            /* ── Gallery horizontal scroll ─────────── */
            if (galleryRef.current) {
                const galleryTrack = galleryRef.current.querySelector<HTMLElement>(".gallery-track");
                if (galleryTrack) {
                    const totalWidth = galleryTrack.scrollWidth - window.innerWidth;
                    gsap.to(galleryTrack, {
                        x: -totalWidth,
                        ease: "none",
                        scrollTrigger: {
                            trigger: galleryRef.current,
                            start: "top top",
                            end: () => "+=" + totalWidth * 1.2,
                            scrub: 1,
                            pin: true,
                            anticipatePin: 1,
                        },
                    });
                }
                gsap.from(".gallery-heading", {
                    opacity: 0,
                    y: 40,
                    duration: 0.8,
                    scrollTrigger: { trigger: galleryRef.current, start: "top 80%" },
                });
            }

            /* ── Form ──────────────────────────────── */
            if (formRef.current) {
                gsap.from(".form-card", {
                    opacity: 0,
                    y: 80,
                    scale: 0.95,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: { trigger: formRef.current, start: "top 70%" },
                });
                gsap.from(".form-field", {
                    opacity: 0,
                    y: 30,
                    stagger: 0.1,
                    duration: 0.6,
                    ease: "power3.out",
                    scrollTrigger: { trigger: ".form-field", start: "top 85%" },
                });
            }
        },
        { scope: pageRef }
    );

    return (
        <div
            ref={pageRef}
            className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-[#050505] overflow-x-hidden"
        >
            <CustomCursor />
            <div className="noise-overlay" />
            <Navbar />

            <main className="flex-grow">
                {/* ─── Hero ──────────────────────────────── */}
                <section
                    ref={heroRef}
                    className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden"
                >
                    {/* Animated heritage hero background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1a0e08] via-[#0a0506] to-[#050505]">
                        <div className="hero-animated-bg">
                            <div className="glow-orb glow-orb-1" />
                            <div className="glow-orb glow-orb-2" />
                            <div className="glow-orb glow-orb-3" />
                        </div>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,53,0.08)_0%,transparent_50%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(125,28,85,0.06)_0%,transparent_40%)]" />
                        {/* Ornamental pattern overlay */}
                        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(rgba(212,175,53,0.5) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                    </div>

                    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center pt-20">
                        <div className="story-hero-icon w-16 h-16 rounded-full border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(212,175,53,0.3)]">
                            <span className="material-symbols-outlined text-[32px]">history_edu</span>
                        </div>
                        <h1
                            className="story-hero-title text-4xl md:text-6xl lg:text-7xl text-white mb-6 tracking-wide"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            A Legacy Forged in{" "}
                            <span className="text-gold-gradient italic">Gold</span>
                        </h1>
                        <p
                            className="story-hero-sub text-gray-400 font-light text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                            style={{ fontFamily: "var(--font-sans)" }}
                        >
                            Since 1998. Crafted with devotion in the heart of Vadavalli, Coimbatore.
                        </p>
                    </div>
                </section>

                {/* ─── Timeline ──────────────────────────── */}
                <section ref={timelineRef} className="py-24 px-4 md:px-10 lg:px-20 max-w-[1200px] mx-auto relative">
                    {/* Decorative line */}
                    <div className="story-timeline-line absolute left-[20px] md:left-1/2 top-24 bottom-24 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/30 to-transparent md:-translate-x-1/2" />

                    <div className="story-journey-badge text-center mb-16 relative z-10 flex justify-center">
                        <span className="bg-[#050505] inline-block px-8 py-2 rounded-full border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                            <span
                                className="text-xs text-[#D4AF37] font-bold uppercase tracking-[0.3em]"
                                style={{ fontFamily: "var(--font-sans)" }}
                            >
                                Our Journey
                            </span>
                        </span>
                    </div>

                    <div className="space-y-16 md:space-y-24 relative z-10">
                        {milestones.map((m, i) => {
                            const isEven = i % 2 === 0;
                            return (
                                <div key={m.year} className="story-milestone flex flex-col md:flex-row items-center justify-between group">
                                    {/* Left content or year */}
                                    <div className={`w-full md:w-[45%] pl-12 md:pl-0 mb-6 md:mb-0 relative ${isEven ? "md:text-right order-2 md:order-1" : "order-3 md:order-1 flex justify-end md:text-left"}`}>
                                        {isEven ? (
                                            <>
                                                <h3
                                                    className="text-2xl text-white mb-3"
                                                    style={{ fontFamily: "var(--font-display)" }}
                                                >
                                                    {m.title}
                                                </h3>
                                                <p className="text-gray-400 font-light leading-relaxed text-sm" style={{ fontFamily: "var(--font-sans)" }}>
                                                    {m.description}
                                                </p>
                                            </>
                                        ) : (
                                            <div
                                                className={`story-year text-5xl lg:text-7xl text-white/5 font-bold tracking-tighter group-hover:text-[#D4AF37]/20 transition-colors duration-700 md:text-left text-right w-full ${m.isPresent ? "group-hover:text-[#D4AF37]/20" : ""}`}
                                                style={{ fontFamily: "var(--font-display)" }}
                                            >
                                                {m.year}
                                            </div>
                                        )}
                                    </div>

                                    {/* Center dot */}
                                    <div className="absolute left-[13px] md:relative md:left-auto md:w-[10%] flex justify-center items-center order-1 md:order-2">
                                        <div
                                            className={`story-dot w-4 h-4 rounded-full ${m.dotColor} border-4 border-[#050505] ${m.dotGlow} group-hover:scale-150 transition-transform duration-500 ${m.isPresent ? "w-6 h-6 animate-pulse-slow" : ""}`}
                                        />
                                    </div>

                                    {/* Right year or content */}
                                    <div className={`w-full md:w-[45%] pl-12 md:pl-0 ${isEven ? "order-3 flex justify-start" : "mb-6 md:mb-0 relative order-2 md:order-3"}`}>
                                        {isEven ? (
                                            <div
                                                className={`story-year text-5xl lg:text-7xl text-white/5 font-bold tracking-tighter group-hover:text-[#D4AF37]/20 transition-colors duration-700`}
                                                style={{ fontFamily: "var(--font-display)" }}
                                            >
                                                {m.year}
                                            </div>
                                        ) : (
                                            <>
                                                <h3
                                                    className={`text-2xl text-white mb-3 text-left ${m.isPresent ? "text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#A33B7C]" : ""}`}
                                                    style={{ fontFamily: "var(--font-display)" }}
                                                >
                                                    {m.title}
                                                </h3>
                                                <p className="text-gray-400 font-light leading-relaxed text-sm text-left" style={{ fontFamily: "var(--font-sans)" }}>
                                                    {m.description}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <div className="gold-divider mx-auto max-w-7xl" />

                {/* ─── Craftsmanship ─────────────────────── */}
                <section ref={craftRef} className="py-24 bg-[#0A0A0A] border-y border-white/[0.04] relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-1/3 h-full bg-[#7D1C55]/[0.04] blur-[100px] pointer-events-none" />

                    <div className="max-w-[1400px] mx-auto px-4 md:px-10 lg:px-20 grid md:grid-cols-2 gap-16 items-center relative z-10">
                        <div>
                            <span
                                className="craft-label text-[10px] text-[#D4AF37] font-bold uppercase tracking-[0.3em] mb-4 block"
                                style={{ fontFamily: "var(--font-sans)" }}
                            >
                                The Swamy Promise
                            </span>

                            <TextReveal
                                as="h2"
                                split="words"
                                className="craft-title text-4xl lg:text-5xl text-white mb-10"
                                stagger={0.08}
                                duration={1.8}
                                triggerStart="top 75%"
                            >
                                Purity Beyond Measure
                            </TextReveal>

                            <div className="space-y-8">
                                {craftFeatures.map((f) => (
                                    <div key={f.title} className="craft-feature flex gap-4">
                                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-[#D4AF37]">{f.icon}</span>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium mb-2" style={{ fontFamily: "var(--font-display)" }}>
                                                {f.title}
                                            </h4>
                                            <p className="text-gray-400 text-sm font-light" style={{ fontFamily: "var(--font-sans)" }}>
                                                {f.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div
                            className="craft-image h-[500px] lg:h-[600px] rounded-2xl overflow-hidden border border-white/[0.06] relative"
                            style={{ clipPath: "inset(0 0 0 0)" }}
                            data-cursor-hover
                        >
                            <img
                                alt="Crafting jewelry"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwVAqTJdg7IiJW-NxKSe4q-7oglYBz1zkqtb08n83kCy-LfQVq4Lc5tmjim1RunayItzC7L7xjZXiGOvWjoLbx9y0sWzBWneUdViQZ460DRpi9W1uHbXmT9HlEygduZYkBG_wA5sqxFo0byAtkyuxTfjOsvWaHBZ8PvAEDR7SGUqyxqTZx6wtgmHX-RUkS46axk1MBfOcT8OFs6nm1uKb86lcerWLjhpCKYhUwCa7dUkfw9YTeAv2Zv-A5-zeg5DAjJeEoN8BEF8Kd"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                            <div className="craft-quote absolute bottom-10 left-10 right-10 md:right-auto p-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl">
                                <p className="text-white italic opacity-90" style={{ fontFamily: "var(--font-display)" }}>
                                    &quot;Jewelry is not just ornament; it&apos;s the preservation of culture.&quot;
                                </p>
                                <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.2em] font-bold mt-4" style={{ fontFamily: "var(--font-sans)" }}>
                                    — Founder, Swamy
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="gold-divider mx-auto max-w-7xl" />

                {/* ─── Gallery — Pinned Horizontal Scroll ── */}
                <section ref={galleryRef} className="relative bg-[#050505] min-h-screen overflow-hidden">
                    <div className="gallery-heading pt-24 pb-12 px-4 md:px-10 lg:px-20 flex justify-between items-end">
                        <div>
                            <span
                                className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mb-2 block"
                                style={{ fontFamily: "var(--font-sans)" }}
                            >
                                Vadavalli Showroom
                            </span>
                            <TextReveal
                                as="h2"
                                split="words"
                                className="text-3xl md:text-4xl text-white"
                                stagger={0.08}
                                duration={1.5}
                                triggerStart="top 80%"
                            >
                                Experience The Boutique
                            </TextReveal>
                        </div>
                        <div className="hidden md:flex gap-4 items-center">
                            <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-sans)" }}>
                                Scroll to explore
                            </span>
                            <span className="material-symbols-outlined text-[#D4AF37] text-sm animate-pulse">arrow_forward</span>
                        </div>
                    </div>

                    <div className="gallery-track flex gap-6 px-4 md:px-10 lg:px-20 pb-8 will-change-transform" style={{ width: "fit-content" }}>
                        {galleryImages.map((img, i) => (
                            <div
                                key={i}
                                className="shrink-0 w-[350px] md:w-[500px] aspect-[4/3] rounded-2xl overflow-hidden relative group"
                                data-cursor-hover
                            >
                                <img
                                    alt={img.alt}
                                    src={img.src}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <span className="text-[10px] text-white uppercase tracking-widest" style={{ fontFamily: "var(--font-sans)" }}>
                                        {img.alt}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {/* Directions CTA */}
                        <a
                            href="https://maps.google.com/?q=Swamy+Jewellery+Vadavalli+Coimbatore"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 w-[350px] md:w-[500px] aspect-[4/3] rounded-2xl overflow-hidden relative flex items-center justify-center bg-[#0A0A0A] border border-white/5 group hover:border-[#D4AF37]/20 transition-colors duration-500"
                        >
                            <div className="text-center">
                                <span className="material-symbols-outlined text-[#D4AF37] text-4xl mb-4 block group-hover:scale-110 transition-transform duration-500">
                                    map
                                </span>
                                <span
                                    className="text-white font-medium text-lg"
                                    style={{ fontFamily: "var(--font-display)" }}
                                >
                                    Get Directions
                                </span>
                                <p className="text-gray-500 text-xs mt-2" style={{ fontFamily: "var(--font-sans)" }}>
                                    Vadavalli, Coimbatore
                                </p>
                            </div>
                        </a>
                    </div>
                </section>

                {/* ─── Consultation Form ─────────────────── */}
                <section ref={formRef} className="py-24 px-4 relative overflow-hidden bg-gradient-to-br from-[#050505] to-[#1a0812]">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7D1C55]/[0.04] rounded-full blur-[120px] pointer-events-none" />

                    <div id="appointment" className="form-card max-w-[800px] mx-auto relative z-10 bg-black/40 backdrop-blur-xl border border-white/[0.06] p-8 md:p-16 rounded-3xl shadow-2xl">
                        <div className="text-center mb-10">
                            <h2
                                className="form-field text-3xl md:text-4xl text-white mb-4"
                                style={{ fontFamily: "var(--font-display)" }}
                            >
                                Book a Private Viewing
                            </h2>
                            <p className="form-field text-gray-400 font-light max-w-lg mx-auto" style={{ fontFamily: "var(--font-sans)" }}>
                                Experience our high jewellery collection in an exclusive, uninterrupted session with our expert consultants.
                            </p>
                        </div>

                        {formSubmitted ? (
                            <div className="text-center py-12">
                                <span className="material-symbols-outlined text-[#D4AF37] text-5xl mb-4 block">check_circle</span>
                                <h3 className="text-2xl text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>Thank You!</h3>
                                <p className="text-gray-400 font-light" style={{ fontFamily: "var(--font-sans)" }}>
                                    We&apos;ll reach out to you shortly to confirm your appointment.
                                </p>
                            </div>
                        ) : (
                        <form className="space-y-6" onSubmit={(e) => {
                            e.preventDefault();
                            const msg = `Hi, I'd like to book an appointment.\n\nName: ${formData.name}\nPhone: ${formData.phone}\nDate: ${formData.date}\nInterest: ${formData.interest}`;
                            window.open(`https://wa.me/919876543210?text=${encodeURIComponent(msg)}`, "_blank");
                            setFormSubmitted(true);
                        }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-field space-y-2">
                                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] block" style={{ fontFamily: "var(--font-sans)" }}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50 transition-colors duration-500 focus:bg-white/[0.05] text-sm"
                                        placeholder="Your Name"
                                        style={{ fontFamily: "var(--font-sans)" }}
                                    />
                                </div>
                                <div className="form-field space-y-2">
                                    <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] block" style={{ fontFamily: "var(--font-sans)" }}>
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50 transition-colors duration-500 focus:bg-white/[0.05] text-sm"
                                        placeholder="+91 98765 43210"
                                        style={{ fontFamily: "var(--font-sans)" }}
                                    />
                                </div>
                            </div>
                            <div className="form-field space-y-2">
                                <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] block" style={{ fontFamily: "var(--font-sans)" }}>
                                    Date of Visit
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-[#D4AF37]/50 transition-colors duration-500 focus:bg-white/[0.05] text-sm [color-scheme:dark]"
                                    style={{ fontFamily: "var(--font-sans)" }}
                                />
                            </div>
                            <div className="form-field space-y-2">
                                <label className="text-[10px] text-gray-400 uppercase tracking-[0.2em] block" style={{ fontFamily: "var(--font-sans)" }}>
                                    Area of Interest
                                </label>
                                <select
                                    value={formData.interest}
                                    onChange={(e) => setFormData(prev => ({ ...prev, interest: e.target.value }))}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50 transition-colors duration-500 focus:bg-white/[0.05] appearance-none text-sm"
                                    style={{ fontFamily: "var(--font-sans)" }}
                                >
                                    <option className="bg-[#050505]">Bridal Jewellery</option>
                                    <option className="bg-[#050505]">Diamond Solitaires</option>
                                    <option className="bg-[#050505]">Heritage Temple Collection</option>
                                    <option className="bg-[#050505]">Gold Savings Scheme</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="form-field w-full bg-gradient-to-r from-[#D4AF37] to-[#F9E58C] text-[#050505] font-bold uppercase tracking-[0.2em] py-4 rounded-lg mt-8 hover:brightness-110 transition-all duration-500 shadow-[0_0_25px_rgba(212,175,53,0.3)] hover:shadow-[0_0_40px_rgba(212,175,53,0.5)] text-sm"
                                data-cursor-hover
                                style={{ fontFamily: "var(--font-sans)" }}
                            >
                                Request Appointment
                            </button>
                        </form>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
