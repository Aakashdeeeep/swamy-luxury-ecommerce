"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function LiveRates() {
    const goldRef = useRef<HTMLSpanElement>(null);
    const silverRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        // Animate from 0 to 14600 for Gold
        gsap.fromTo(goldRef.current,
            { textContent: "0" },
            {
                textContent: "14600",
                duration: 2.5,
                ease: "power2.out",
                snap: { textContent: 1 },
                stagger: 1,
                onUpdate: function () {
                    if (goldRef.current) {
                        goldRef.current.innerHTML = "GOLD 22K ₹" + Number(goldRef.current.textContent).toLocaleString();
                    }
                }
            }
        );

        // Animate from 0 to 290 for Silver
        gsap.fromTo(silverRef.current,
            { textContent: "0" },
            {
                textContent: "290",
                duration: 2.5,
                ease: "power2.out",
                snap: { textContent: 1 },
                stagger: 1,
                onUpdate: function () {
                    if (silverRef.current) {
                        silverRef.current.innerHTML = "SILVER ₹" + Number(silverRef.current.textContent).toLocaleString();
                    }
                }
            }
        );
    }, []);

    return (
        <div className="border-b border-white/5 bg-background-dark">
            <div className="max-w-[90rem] mx-auto px-6 lg:px-12 py-2 flex justify-center text-xs font-bold tracking-widest relative">
                <div className="flex items-center gap-4">
                    <div className="px-4 py-1 rounded-sm bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center gap-2 animate-shine overflow-hidden relative shine-effect shadow-[0_0_10px_rgba(212,175,55,0.1)]">
                        <span className="material-symbols-outlined text-sm">currency_rupee</span>
                        <span ref={goldRef} className="text-[10px] md:text-xs font-bold text-[#F9E58C]">GOLD 22K ₹14,600</span>
                        <span className="text-green-400 text-xs">↑</span>
                    </div>
                    <div className="px-4 py-1 rounded-sm bg-white/5 border border-white/10 text-gray-400 flex items-center gap-2 shine-effect">
                        <span className="material-symbols-outlined text-sm">water_drop</span>
                        <span ref={silverRef} className="text-[10px] md:text-xs">SILVER ₹290</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
