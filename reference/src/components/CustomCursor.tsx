"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const dot = dotRef.current;
        const ring = ringRef.current;
        const text = textRef.current;
        if (!dot || !ring || !text) return;

        // Smooth follow with GSAP
        const moveCursor = (e: MouseEvent) => {
            gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" });
            gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.35, ease: "power2.out" });
        };

        // Scale effects for interactive elements
        const onEnterInteractive = () => {
            gsap.to(ring, { scale: 1.8, borderColor: "rgba(212,175,53,0.6)", duration: 0.3, ease: "power2.out" });
            gsap.to(dot, { scale: 0, duration: 0.2 });
        };
        const onLeaveInteractive = () => {
            gsap.to(ring, { scale: 1, borderColor: "rgba(212,175,53,0.3)", duration: 0.3, ease: "power2.out" });
            gsap.to(dot, { scale: 1, duration: 0.2 });
        };

        // Explore effect for images
        const onEnterImage = () => {
            gsap.to(ring, { scale: 3, borderColor: "rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.05)", duration: 0.4, ease: "power2.out" });
            gsap.to(dot, { scale: 0, duration: 0.2 });
            gsap.to(text, { opacity: 1, duration: 0.3 });
        };
        const onLeaveImage = () => {
            gsap.to(ring, { scale: 1, borderColor: "rgba(212,175,53,0.3)", backgroundColor: "transparent", duration: 0.3, ease: "power2.out" });
            gsap.to(dot, { scale: 1, duration: 0.2 });
            gsap.to(text, { opacity: 0, duration: 0.2 });
        };

        window.addEventListener("mousemove", moveCursor);

        // Query interactive elements
        const interactives = document.querySelectorAll("a, button, input, select, label, [data-cursor-hover]");
        interactives.forEach((el) => {
            el.addEventListener("mouseenter", onEnterInteractive);
            el.addEventListener("mouseleave", onLeaveInteractive);
        });

        const images = document.querySelectorAll("[data-cursor-explore]");
        images.forEach((el) => {
            el.addEventListener("mouseenter", onEnterImage);
            el.addEventListener("mouseleave", onLeaveImage);
        });

        // MutationObserver to handle dynamically added elements
        const observer = new MutationObserver(() => {
            const newInteractives = document.querySelectorAll("a, button, input, select, label, [data-cursor-hover]");
            newInteractives.forEach((el) => {
                el.removeEventListener("mouseenter", onEnterInteractive);
                el.removeEventListener("mouseleave", onLeaveInteractive);
                el.addEventListener("mouseenter", onEnterInteractive);
                el.addEventListener("mouseleave", onLeaveInteractive);
            });
            const newImages = document.querySelectorAll("[data-cursor-explore]");
            newImages.forEach((el) => {
                el.removeEventListener("mouseenter", onEnterImage);
                el.removeEventListener("mouseleave", onLeaveImage);
                el.addEventListener("mouseenter", onEnterImage);
                el.addEventListener("mouseleave", onLeaveImage);
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            observer.disconnect();
        };
    }, []);

    return (
        <>
            {/* Tiny dot */}
            <div
                ref={dotRef}
                className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
                style={{ willChange: "transform" }}
            />
            {/* Ring follower */}
            <div
                ref={ringRef}
                className="fixed top-0 left-0 w-10 h-10 rounded-full border border-primary/30 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                style={{ willChange: "transform" }}
            >
                <span ref={textRef} className="text-[8px] text-white/80 uppercase tracking-widest opacity-0 font-bold">View</span>
            </div>
        </>
    );
}
