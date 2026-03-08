"use client";

import { useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HorizontalCollections from "@/components/HorizontalCollections";
import AboutTimeline from "@/components/AboutTimeline";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import TextReveal from "@/components/TextReveal";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const signatureRef = useRef<HTMLElement>(null);
  const savingsRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const holoRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // --- Signature Collection Section ---
    if (signatureRef.current) {
      // Product cards — perspective entry from below clip-mask
      gsap.fromTo(
        ".sig-card",
        {
          clipPath: "inset(100% 0 0 0)",
          opacity: 0,
        },
        {
          clipPath: "inset(0% 0 0 0)",
          opacity: 1,
          stagger: 0.15,
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: { trigger: ".sig-card", start: "top 85%" },
        }
      );

      // Cards also get a rotateX perspective entry
      gsap.fromTo(
        ".sig-card-inner",
        { rotateX: -15, transformOrigin: "bottom center" },
        {
          rotateX: 0,
          stagger: 0.15,
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: { trigger: ".sig-card", start: "top 85%" },
        }
      );
    }

    // --- Smart Savings Section ---
    if (savingsRef.current) {
      // Text reveal — each child staggers up through mask
      gsap.fromTo(
        ".savings-text > *",
        { y: 60, opacity: 0, clipPath: "inset(100% 0 0 0)" },
        {
          y: 0,
          opacity: 1,
          clipPath: "inset(0% 0 0 0)",
          stagger: 0.2,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: { trigger: savingsRef.current, start: "top 70%" },
        }
      );

      // 3D card entry from right with perspective
      const card = cardRef.current;
      if (card) {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: 120,
            rotateY: -20,
            scale: 0.9,
          },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            scale: 1,
            duration: 2,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 80%" },
          }
        );

        // Holographic gradient follows mouse
        const holo = holoRef.current;
        const handleMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -12;
          const rotateY = ((x - centerX) / centerX) * 12;

          gsap.to(card, {
            rotateX,
            rotateY,
            duration: 0.6,
            ease: "power2.out",
            transformPerspective: 1000,
          });

          // Move holographic gradient
          if (holo) {
            const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
            holo.style.background = `conic-gradient(
              from ${angle}deg at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%,
              rgba(212,175,53,0.15),
              rgba(125,28,85,0.15),
              rgba(212,175,53,0.1),
              rgba(255,255,255,0.08),
              rgba(212,175,53,0.15)
            )`;
          }
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.4)",
          });
          if (holo) {
            holo.style.background = "transparent";
          }
        };

        card.addEventListener("mousemove", handleMouseMove);
        card.addEventListener("mouseleave", handleMouseLeave);
      }

      // Shimmer sweep on savings card
      gsap.to(".savings-shimmer", {
        x: "200%",
        duration: 3,
        repeat: -1,
        repeatDelay: 4,
        ease: "power2.inOut",
      });

      // Breathing glow on card
      gsap.to(".savings-glow", {
        boxShadow: "0 0 60px rgba(212,175,53,0.15), 0 0 120px rgba(80,18,55,0.1)",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <HorizontalCollections />

      {/* Signature Collection Section */}
      <section ref={signatureRef} className="py-24 bg-surface-dark relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-accent-magenta/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-20 overflow-hidden">
            <TextReveal
              as="span"
              split="chars"
              className="text-accent-magenta-light text-[10px] uppercase tracking-[0.4em] mb-4 block"
              stagger={0.05}
              duration={1.2}
              triggerStart="top 80%"
            >
              Masterpieces
            </TextReveal>
            <TextReveal
              as="h2"
              split="chars"
              className="font-display text-4xl md:text-6xl text-white mb-6"
              stagger={0.03}
              duration={1.8}
              triggerStart="top 80%"
            >
              Signature Collection
            </TextReveal>
            <TextReveal
              as="p"
              split="words"
              className="text-gray-400 font-light max-w-2xl mx-auto"
              stagger={0.06}
              duration={1.5}
              triggerStart="top 80%"
            >
              Handpicked exclusively for the connoisseurs of fine art in Vadavalli
            </TextReveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: "1200px" }}>
            <div className="sig-card">
              <div className="sig-card-inner" style={{ transformStyle: "preserve-3d" }}>
                <ProductCard
                  isFirst={true}
                  title="Kashi Temple Mangalsutra"
                  category="Gold 22K • Antique Finish"
                  imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBB2hEfHaAS8i1kEzJtu-YVI-wZVb_b47afmVFx-jWsv11ZC-6ynIknyvhhrTFlijHulX4innZIxi89rVotc7ZriZCK8zmN8Q7e96CucpOuif6yAObtN0FWfIhW1BqGT974kqLBJq_gB1OSDbG9S1bkLaFe6gmCyRW7mquElxScFqNCD_FK2MlpN4gmoIe9MhsTpH9DA4ZJDMbOxoGh1X0cYIx-XaHZs-_jM_O6B6wTV_10mszyd0prHiI9KxTk9in_1cJ4szmZDhUm"
                  badge="Best Seller"
                />
              </div>
            </div>
            <div className="sig-card">
              <div className="sig-card-inner" style={{ transformStyle: "preserve-3d" }}>
                <ProductCard
                  isFirst={false}
                  title="Coimbatore Heritage Necklace"
                  category="Traditional Kemp Stones"
                  imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuDOGeYbZx_FxpvTFUwgfhmaSdDtGwKnkZ3x_AVaPoFmjgHk8IZLz9ldLGUR6J4J1bNFW63YUsQ_t0ebpM1k0kFNw2npDGJj_1apDqNfOSN5WNFUfYQBDE55P9-_mtDwSH19OcoqpK2nbhCegsRNZFdk1uMsn3RcPvH3ZAYdLXCkCWbYsUqNK_sjHK9bsQm-lw1h9oXti-qfLgBkIy-sEypHshe_uJMO_ST9gtvD-1qdXSFiduS3iiAeBMG9ZPJ_J78tioyIobxDY0RK"
                />
              </div>
            </div>
            <div className="sig-card">
              <div className="sig-card-inner" style={{ transformStyle: "preserve-3d" }}>
                <ProductCard
                  isFirst={true}
                  title="Vadavalli Bridal Set"
                  category="Diamond & Platinum"
                  imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuAvE0P_ptXrgxuPMTvLy-qka3RmdMqOtsupmO9MWhCICTMnkA6LhEqPEy8JwEHrorEaimJaRmK4-h9_2MKYUUgdV1RFKlk84LWlm9NU9NkQ4LJwiM54mo54L2G9Ppyi2ElDFIViFIPCV3RjaHX2nUmTKjAkUQ7aBkC9_Di22yPGKT5bbgKzyZUeRjs6LLYeo8JKqqGvTuiZFbyGFqxfUQeW6ifzM-n8JhQrf-VUGo22OWtrRYrGyZMoMZnjx2k-OYaBstl0-gIKgFPq"
                  badge="New Arrival"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <AboutTimeline />

      {/* Smart Savings Section */}
      <section ref={savingsRef} className="py-24 bg-[#0F0F0F] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="savings-text space-y-8">
              <TextReveal
                as="h2"
                split="words"
                className="font-display text-3xl md:text-5xl text-white"
                stagger={0.08}
                duration={1.8}
                triggerStart="top 75%"
              >
                Smart Savings Golden Future
              </TextReveal>
              <p className="text-gray-400 font-light text-lg">In the twelfth month, customers can utilize the total accumulated sum to buy jewellery based on the amount as applicable, <span className="text-primary font-medium">without incurring wastage</span> (up to 14%).</p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
                  <p className="text-sm text-gray-300 font-light">Flexible payment duration extension available</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
                  <p className="text-sm text-gray-300 font-light">Pay difference if price exceeds accumulated amount</p>
                </div>
              </div>

              <button className="mt-4 px-8 py-3 bg-accent-magenta-dark border border-accent-magenta/50 text-white uppercase tracking-widest text-sm hover:bg-accent-magenta transition-all flex items-center gap-2 group rounded-sm shadow-[0_0_20px_rgba(80,18,55,0.3)]">
                View Detailed Scheme
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>

            <div ref={cardRef} className="relative group magnetic-lift savings-glow" style={{ transformStyle: "preserve-3d", perspective: "1000px" }}>
              <div className="absolute inset-0 bg-accent-magenta rounded-3xl blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative w-full aspect-[1.58/1] rounded-3xl overflow-hidden bg-gradient-to-br from-[#360A24] to-[#1a0511] border border-accent-magenta/20 p-8 flex flex-col justify-between shadow-2xl">
                {/* Holographic overlay */}
                <div ref={holoRef} className="absolute inset-0 rounded-3xl pointer-events-none transition-[background] duration-300 z-[2]"></div>
                {/* Shimmer overlay */}
                <div className="savings-shimmer absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full pointer-events-none z-[3]"></div>
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-2">Premium Plan</p>
                    <h3 className="font-display text-4xl text-white">Weekly<br /><span className="italic text-primary">Savings</span></h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.1em] text-white/60 mb-2">Swamy Jewellery</p>
                    <div className="w-10 h-10 rounded-full border border-primary/50 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-sm">diamond</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-end justify-between z-10 relative">
                  <div className="text-white/40 text-sm tracking-[0.3em] font-mono">•••• •••• •••• 8842</div>
                  <button className="px-6 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F9E58C] text-black font-bold text-xs uppercase tracking-wider rounded-full shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-shadow">
                    Join Now
                  </button>
                </div>

                <div className="absolute top-0 right-0 w-64 h-64 border border-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-80 h-80 border border-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
