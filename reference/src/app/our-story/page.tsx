"use client";

import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function OurStoryPage() {
    const pageRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const timelineRef = useRef<HTMLElement>(null);
    const craftRef = useRef<HTMLElement>(null);
    const galleryRef = useRef<HTMLElement>(null);
    const formRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        if (!pageRef.current) return;

        // --- Hero Parallax + Text Reveal ---
        if (heroRef.current) {
            const heroImg = heroRef.current.querySelector(".story-hero-img");
            if (heroImg) {
                gsap.to(heroImg, {
                    yPercent: 20,
                    scale: 1.1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: heroRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1.5,
                    },
                });
            }

            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            tl.from(".story-hero-icon", { scale: 0, opacity: 0, duration: 0.6, ease: "back.out(2)" }, 0.3);
            tl.from(".story-hero-title", { opacity: 0, y: 80, skewY: 4, duration: 1 }, 0.5);
            tl.from(".story-hero-sub", { opacity: 0, y: 30, duration: 0.8 }, 0.9);
        }

        // --- Timeline Milestones ---
        if (timelineRef.current) {
            // Journey badge
            gsap.from(".story-journey-badge", {
                opacity: 0,
                scale: 0.8,
                duration: 0.6,
                ease: "back.out(2)",
                scrollTrigger: { trigger: ".story-journey-badge", start: "top 85%" },
            });

            // Timeline decorative line draw
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

            // Each milestone from alternating sides
            const milestones = gsap.utils.toArray<HTMLElement>(".story-milestone");
            milestones.forEach((m, i) => {
                gsap.from(m, {
                    opacity: 0,
                    x: i % 2 === 0 ? -80 : 80,
                    y: 30,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: m,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                });
            });

            // Milestone dots
            const dots = gsap.utils.toArray<HTMLElement>(".story-dot");
            dots.forEach((dot) => {
                gsap.from(dot, {
                    scale: 0,
                    duration: 0.5,
                    ease: "back.out(3)",
                    scrollTrigger: { trigger: dot, start: "top 80%" },
                });
            });

            // Year numbers
            const years = gsap.utils.toArray<HTMLElement>(".story-year");
            years.forEach((y) => {
                gsap.from(y, {
                    opacity: 0,
                    scale: 0.5,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: { trigger: y, start: "top 85%" },
                });
            });
        }

        // --- Craftsmanship Section ---
        if (craftRef.current) {
            gsap.from(".craft-label", {
                opacity: 0, y: 20, duration: 0.6,
                scrollTrigger: { trigger: craftRef.current, start: "top 75%" },
            });
            gsap.from(".craft-title", {
                opacity: 0, y: 60, skewY: 3, duration: 1, ease: "power3.out",
                scrollTrigger: { trigger: craftRef.current, start: "top 75%" },
            });
            gsap.from(".craft-feature", {
                opacity: 0, x: -40, stagger: 0.2, duration: 0.8, ease: "power3.out",
                scrollTrigger: { trigger: ".craft-feature", start: "top 85%" },
            });

            // Craft image reveal
            const craftImg = craftRef.current.querySelector(".craft-image");
            if (craftImg) {
                gsap.from(craftImg, {
                    clipPath: "inset(0 0 100% 0)",
                    duration: 1.5,
                    ease: "power3.inOut",
                    scrollTrigger: { trigger: craftImg, start: "top 75%" },
                });
            }

            // Quote card
            gsap.from(".craft-quote", {
                opacity: 0, y: 40, duration: 0.8, delay: 0.5,
                scrollTrigger: { trigger: ".craft-quote", start: "top 90%" },
            });
        }

        // --- Gallery Horizontal Scroll (pinned) ---
        if (galleryRef.current) {
            const galleryTrack = galleryRef.current.querySelector(".gallery-track");
            if (galleryTrack) {
                const totalWidth = (galleryTrack as HTMLElement).scrollWidth - window.innerWidth;

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
                opacity: 0, y: 40, duration: 0.8,
                scrollTrigger: { trigger: galleryRef.current, start: "top 80%" },
            });
        }

        // --- Form Section ---
        if (formRef.current) {
            gsap.from(".form-card", {
                opacity: 0, y: 80, scale: 0.95, duration: 1, ease: "power3.out",
                scrollTrigger: { trigger: formRef.current, start: "top 70%" },
            });
            gsap.from(".form-field", {
                opacity: 0, y: 30, stagger: 0.1, duration: 0.6, ease: "power3.out",
                scrollTrigger: { trigger: ".form-field", start: "top 85%" },
            });
        }

    }, { scope: pageRef });

    return (
        <div ref={pageRef} className="bg-background-dark text-slate-100 font-display min-h-screen flex flex-col selection:bg-accent-magenta selection:text-white overflow-x-hidden">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section ref={heroRef} className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[#0A0A0A]">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-fbbNVsP1AaRHnZm2zXYWEq8l0aoQFCQYnIFQCo9w-g6f7W1pPNW3spk7v_z2HSAfLXCnzpKyznTJ3SVr8ir099PWfnHyVnyTMGAFg2rhJzyEskcWWDAJ853Jrp1YQ7a6vEHRzysgKZOsM_3nJ9eZ7-0VcmGfVl-v-9qPDoHxhE4Bfx0WvNiiylqN7xxjPb36EHRxJiU-GP-LluNQbnP-3GEHjyvHE6BbdNtoYVAYleUDPCX1_J60pPlAl_QfH1mo4a837ern_Ydd"
                            alt="Swamy Jewellery Storefront"
                            className="story-hero-img w-full h-full object-cover opacity-30 object-center mix-blend-luminosity filter blur-[2px]"
                            style={{ willChange: "transform" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/60 to-transparent"></div>
                    </div>

                    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
                        <div className="story-hero-icon size-16 rounded-full border border-primary text-primary flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(212,175,53,0.3)]">
                            <span className="material-symbols-outlined text-[32px]">history_edu</span>
                        </div>
                        <h1 className="story-hero-title text-4xl md:text-6xl lg:text-7xl font-display text-white mb-6 tracking-wide drop-shadow-md">
                            A Legacy Forged in <span className="text-primary italic font-serif">Gold</span>
                        </h1>
                        <p className="story-hero-sub text-slate-300 font-light text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Since 1995. Crafted with devotion in the heart of Vadavalli, Coimbatore.
                        </p>
                    </div>
                </section>

                {/* The Timeline Section */}
                <section ref={timelineRef} className="py-24 px-4 md:px-10 lg:px-20 max-w-[1200px] mx-auto relative">
                    {/* Decorative Line */}
                    <div className="story-timeline-line absolute left-[20px] md:left-1/2 top-24 bottom-24 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent md:-translate-x-1/2"></div>

                    <div className="story-journey-badge text-center mb-16 relative z-10 bg-[#0F0F0F] inline-block px-8 py-2 md:mx-auto md:left-1/2 md:-translate-x-1/2 rounded-full border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                        <span className="text-xs text-primary font-bold uppercase tracking-[0.3em]">Our Journey</span>
                    </div>

                    <div className="space-y-16 md:space-y-24 relative z-10">
                        {/* 1995 */}
                        <div className="story-milestone flex flex-col md:flex-row items-center justify-between group">
                            <div className="w-full md:w-[45%] md:text-right pl-12 md:pl-0 mb-6 md:mb-0 relative order-2 md:order-1">
                                <h3 className="text-2xl font-serif text-white mb-3">The Humble Beginning</h3>
                                <p className="text-slate-400 font-light leading-relaxed text-sm">Mr. Swamy established a small workshop in Vadavalli with just three artisans, focusing entirely on bespoke temple jewelry for local patrons.</p>
                            </div>
                            <div className="absolute left-[13px] md:relative md:left-auto md:w-[10%] flex justify-center items-center order-1 md:order-2">
                                <div className="story-dot size-4 rounded-full bg-primary border-4 border-[#0F0F0F] shadow-[0_0_15px_rgba(212,175,53,0.5)] group-hover:scale-150 transition-transform duration-500"></div>
                            </div>
                            <div className="w-full md:w-[45%] pl-12 md:pl-0 order-3 flex justify-start">
                                <div className="story-year text-5xl lg:text-7xl font-display text-white/5 font-bold tracking-tighter group-hover:text-primary/20 transition-colors">1995</div>
                            </div>
                        </div>

                        {/* 2008 */}
                        <div className="story-milestone flex flex-col md:flex-row items-center justify-between group">
                            <div className="w-full md:w-[45%] pl-12 md:pl-0 order-3 md:order-1 flex justify-end md:text-left">
                                <div className="story-year text-5xl lg:text-7xl font-display text-white/5 font-bold tracking-tighter group-hover:text-primary/20 transition-colors md:text-left text-right w-full">2008</div>
                            </div>
                            <div className="absolute left-[13px] md:relative md:left-auto md:w-[10%] flex justify-center items-center order-1 md:order-2">
                                <div className="story-dot size-4 rounded-full bg-accent-magenta border-4 border-[#0F0F0F] shadow-[0_0_15px_rgba(92,19,50,0.5)] group-hover:scale-150 transition-transform duration-500"></div>
                            </div>
                            <div className="w-full md:w-[45%] pl-12 md:pl-0 mb-6 md:mb-0 relative order-2 md:order-3">
                                <h3 className="text-2xl font-serif text-white mb-3 text-left">The Flagship Store</h3>
                                <p className="text-slate-400 font-light leading-relaxed text-sm text-left">Opening the doors to our iconic Vadavalli showroom, expanding our collection to include diamonds, platinum, and introducing 100% 916 Hallmark transparency.</p>
                            </div>
                        </div>

                        {/* 2015 */}
                        <div className="story-milestone flex flex-col md:flex-row items-center justify-between group">
                            <div className="w-full md:w-[45%] md:text-right pl-12 md:pl-0 mb-6 md:mb-0 relative order-2 md:order-1">
                                <h3 className="text-2xl font-serif text-white mb-3">Bridal Excellence Award</h3>
                                <p className="text-slate-400 font-light leading-relaxed text-sm">Recognized statewide for our intricate Bridal sets, specifically our mastery over Antique and Kempu stone embeddings.</p>
                            </div>
                            <div className="absolute left-[13px] md:relative md:left-auto md:w-[10%] flex justify-center items-center order-1 md:order-2">
                                <div className="story-dot size-4 rounded-full bg-white border-4 border-[#0F0F0F] shadow-[0_0_15px_rgba(255,255,255,0.5)] group-hover:scale-150 transition-transform duration-500"></div>
                            </div>
                            <div className="w-full md:w-[45%] pl-12 md:pl-0 order-3 flex justify-start">
                                <div className="story-year text-5xl lg:text-7xl font-display text-white/5 font-bold tracking-tighter group-hover:text-white/20 transition-colors">2015</div>
                            </div>
                        </div>

                        {/* Present */}
                        <div className="story-milestone flex flex-col md:flex-row items-center justify-between group">
                            <div className="w-full md:w-[45%] pl-12 md:pl-0 order-3 md:order-1 flex justify-end md:text-left">
                                <div className="story-year text-5xl lg:text-7xl font-display text-white/5 font-bold tracking-tighter group-hover:text-primary/20 transition-colors md:text-left text-right w-full">Now</div>
                            </div>
                            <div className="absolute left-[13px] md:relative md:left-auto md:w-[10%] flex justify-center items-center order-1 md:order-2">
                                <div className="story-dot size-6 rounded-full bg-gradient-to-r from-primary to-accent-magenta border-4 border-[#0F0F0F] shadow-[0_0_20px_rgba(212,175,53,0.8)] animate-pulse"></div>
                            </div>
                            <div className="w-full md:w-[45%] pl-12 md:pl-0 mb-6 md:mb-0 relative order-2 md:order-3">
                                <h3 className="text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-magenta-light mb-3 text-left">A Global Legacy</h3>
                                <p className="text-slate-400 font-light leading-relaxed text-sm text-left">Serving over 100,000 trusted families globally, bridging the gap between traditional South Indian artistry and modern luxury.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Craftsmanship Section */}
                <section ref={craftRef} className="py-20 bg-[#121212] border-y border-white/5 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-1/3 h-full bg-accent-magenta/5 blur-[100px] pointer-events-none"></div>
                    <div className="max-w-[1400px] mx-auto px-4 md:px-10 lg:px-20 grid md:grid-cols-2 gap-16 items-center z-10 relative">
                        <div>
                            <span className="craft-label text-xs text-primary font-bold uppercase tracking-[0.2em] mb-4 block">The Swamy Promise</span>
                            <h2 className="craft-title text-4xl lg:text-5xl font-display text-white mb-8">Purity Beyond <br /><span className="italic font-serif font-light opacity-80">Measure</span></h2>

                            <div className="space-y-8">
                                <div className="craft-feature flex gap-4">
                                    <div className="size-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-primary">diamond</span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium mb-2">VVS1/IF Diamonds</h4>
                                        <p className="text-slate-400 text-sm font-light">Every diamond is rigorously selected, IGI certified, ensuring flawless brilliance in every setting.</p>
                                    </div>
                                </div>
                                <div className="craft-feature flex gap-4">
                                    <div className="size-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-primary">workspace_premium</span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium mb-2">100% 916 BIS Hallmark</h4>
                                        <p className="text-slate-400 text-sm font-light">Our gold&apos;s purity is uncompromising. Every piece bears the stamp of authenticity and trust.</p>
                                    </div>
                                </div>
                                <div className="craft-feature flex gap-4">
                                    <div className="size-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-primary">handyman</span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium mb-2">Master Artisans</h4>
                                        <p className="text-slate-400 text-sm font-light">Our craftsmen descend from generations of temple jewelry makers, embedding soul into metal.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="craft-image h-[600px] rounded-2xl overflow-hidden border border-white/10 relative" data-cursor-explore style={{ clipPath: "inset(0 0 0 0)" }}>
                            <img alt="Crafting jewelry" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwVAqTJdg7IiJW-NxKSe4q-7oglYBz1zkqtb08n83kCy-LfQVq4Lc5tmjim1RunayItzC7L7xjZXiGOvWjoLbx9y0sWzBWneUdViQZ460DRpi9W1uHbXmT9HlEygduZYkBG_wA5sqxFo0byAtkyuxTfjOsvWaHBZ8PvAEDR7SGUqyxqTZx6wtgmHX-RUkS46axk1MBfOcT8OFs6nm1uKb86lcerWLjhpCKYhUwCa7dUkfw9YTeAv2Zv-A5-zeg5DAjJeEoN8BEF8Kd" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
                            <div className="craft-quote absolute bottom-10 left-10 p-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl">
                                <p className="text-white italic font-serif opacity-90">&quot;Jewelry is not just ornament; it&apos;s the preservation of culture.&quot;</p>
                                <p className="text-primary text-xs uppercase tracking-widest font-bold mt-4">- Founder, Swamy</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Boutique Store Gallery — Pinned Horizontal Scroll */}
                <section ref={galleryRef} className="relative bg-[#0A0A0A] min-h-screen overflow-hidden">
                    <div className="gallery-heading pt-24 pb-12 px-4 md:px-10 lg:px-20 flex justify-between items-end">
                        <div>
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mb-2 block">Vadavalli Showroom</span>
                            <h2 className="text-3xl font-display text-white">Experience The Boutique</h2>
                        </div>
                        <div className="hidden md:flex gap-4">
                            <span className="text-xs text-gray-500 uppercase tracking-widest self-center">Scroll to explore</span>
                            <span className="material-symbols-outlined text-primary text-sm animate-pulse">arrow_forward</span>
                        </div>
                    </div>

                    <div className="gallery-track flex gap-6 px-4 md:px-10 lg:px-20 pb-8 will-change-transform" style={{ width: "fit-content" }}>
                        <div className="shrink-0 w-[350px] md:w-[500px] aspect-[4/3] rounded-2xl overflow-hidden relative group" data-cursor-explore>
                            <img alt="Store Entry" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-fbbNVsP1AaRHnZm2zXYWEq8l0aoQFCQYnIFQCo9w-g6f7W1pPNW3spk7v_z2HSAfLXCnzpKyznTJ3SVr8ir099PWfnHyVnyTMGAFg2rhJzyEskcWWDAJ853Jrp1YQ7a6vEHRzysgKZOsM_3nJ9eZ7-0VcmGfVl-v-9qPDoHxhE4Bfx0WvNiiylqN7xxjPb36EHRxJiU-GP-LluNQbnP-3GEHjyvHE6BbdNtoYVAYleUDPCX1_J60pPlAl_QfH1mo4a837ern_Ydd" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                        </div>
                        <div className="shrink-0 w-[350px] md:w-[500px] aspect-[4/3] rounded-2xl overflow-hidden relative group" data-cursor-explore>
                            <img alt="Bridal Lounge" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYAheP_OHJBQYuIBQ-4KKG3qsc5MxirFQwWMtodLbuuvWlRBO7aHsYwgc1JD2eD4RjIwRjPifOnvm2l0mdAGSy6PiCdvGmWWKX5WLmKrDIa9RW0PCxCNkhgOYHMXibA5nhs9H7M-vBj8V9RLWL-cQfhKldcBZ-7Ap_dFPoavGzIkQY8yFH_2-OfyjM5Ios6rFB0p1LWA8dG6bq5IJh-ITKOojC__WEbqZp3ungCVFaP36VFf6Dftd7ziF88uQtY6OF0p-XDUB77b-v" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                        </div>
                        <div className="shrink-0 w-[350px] md:w-[500px] aspect-[4/3] rounded-2xl overflow-hidden relative group" data-cursor-explore>
                            <img alt="Diamond Section" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKMq9ue4DRkB_dsoGhawlMvBs8lITdB2YW8UDCVWsneh_ZBojJA8kllI78rt-rqrVb4XapkxLyahch5KufY9iK-ouevhzdiQUXeuPJT044rgEMGiwA54U4wmjSZOFUvvqcfbpp93465kYdKxWOjUl0OFXfRYWo3ICvn3TdO1BsbvxmLRh3T2IOEyzl8bR1q1X8-E490QSVndJgAwbZ5DGk6qkCLTwQ1sFW73gRg01xOziKpV79rDw4iD5rezXJ2K8z2Zts_iL2xf6O" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                        </div>
                        <div className="shrink-0 w-[350px] md:w-[500px] aspect-[4/3] rounded-2xl overflow-hidden relative group bg-surface-dark flex items-center justify-center border border-white/5">
                            <span className="text-white font-medium flex items-center gap-2"><span className="material-symbols-outlined">map</span> Get Directions</span>
                        </div>
                    </div>
                </section>

                {/* Consultation Form */}
                <section ref={formRef} className="py-24 px-4 relative overflow-hidden bg-gradient-to-br from-[#0A0A0A] to-[#1a0812]">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-magenta/5 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="form-card max-w-[800px] mx-auto relative z-10 bg-black/40 backdrop-blur-xl border border-white/10 p-8 md:p-16 rounded-3xl shadow-2xl">
                        <div className="text-center mb-10">
                            <h2 className="form-field text-3xl md:text-4xl font-display text-white mb-4">Book a Private Viewing</h2>
                            <p className="form-field text-slate-400 font-light max-w-lg mx-auto">Experience our high jewellery collection in an exclusive, uninterrupted session with our expert consultants.</p>
                        </div>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-field space-y-2">
                                    <label className="text-xs text-slate-400 uppercase tracking-widest block">Full Name</label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors focus:bg-white/10" placeholder="Anushka Sharma" />
                                </div>
                                <div className="form-field space-y-2">
                                    <label className="text-xs text-slate-400 uppercase tracking-widest block">Phone Number</label>
                                    <input type="tel" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors focus:bg-white/10" placeholder="+91 98765 43210" />
                                </div>
                            </div>
                            <div className="form-field space-y-2">
                                <label className="text-xs text-slate-400 uppercase tracking-widest block">Date of Visit</label>
                                <input type="date" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-slate-300 focus:outline-none focus:border-primary transition-colors focus:bg-white/10 [color-scheme:dark]" />
                            </div>
                            <div className="form-field space-y-2">
                                <label className="text-xs text-slate-400 uppercase tracking-widest block">Area of Interest</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors focus:bg-white/10 appearance-none">
                                    <option className="bg-[#121212]">Bridal Jewellery</option>
                                    <option className="bg-[#121212]">Diamond Solitaires</option>
                                    <option className="bg-[#121212]">Heritage Temple Collection</option>
                                    <option className="bg-[#121212]">Gold Savings Scheme</option>
                                </select>
                            </div>
                            <button type="button" className="form-field w-full bg-gradient-to-r from-primary to-primary-light text-black font-bold uppercase tracking-widest py-4 rounded-lg mt-8 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,175,53,0.3)]">
                                Request Appointment
                            </button>
                        </form>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
