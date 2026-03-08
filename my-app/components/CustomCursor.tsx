"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const isTouch = useRef(false);

    useEffect(() => {
        // Detect touch device
        if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
            isTouch.current = true;
            return;
        }

        const dot = dotRef.current;
        const ring = ringRef.current;
        const text = textRef.current;
        if (!dot || !ring || !text) return;

        // Hide default cursor
        document.documentElement.style.cursor = "none";

        const moveCursor = (e: MouseEvent) => {
            gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.08, ease: "power2.out" });
            gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.3, ease: "power2.out" });
        };

        const onEnterInteractive = () => {
            gsap.to(ring, {
                scale: 2,
                borderColor: "rgba(212,175,53,0.5)",
                duration: 0.4,
                ease: "power2.out",
            });
            gsap.to(dot, { scale: 0, duration: 0.2 });
        };

        const onLeaveInteractive = () => {
            gsap.to(ring, {
                scale: 1,
                borderColor: "rgba(212,175,53,0.2)",
                duration: 0.4,
                ease: "power2.out",
            });
            gsap.to(dot, { scale: 1, duration: 0.2 });
        };

        const onEnterImage = () => {
            gsap.to(ring, {
                scale: 2.5,
                borderColor: "rgba(212,175,53,0.3)",
                backgroundColor: "rgba(212,175,53,0.04)",
                duration: 0.5,
                ease: "power2.out",
            });
            gsap.to(dot, { scale: 0, duration: 0.2 });
            gsap.to(text, { opacity: 1, scale: 1, duration: 0.3 });
        };

        const onLeaveImage = () => {
            gsap.to(ring, {
                scale: 1,
                borderColor: "rgba(212,175,53,0.2)",
                backgroundColor: "transparent",
                duration: 0.4,
                ease: "power2.out",
            });
            gsap.to(dot, { scale: 1, duration: 0.2 });
            gsap.to(text, { opacity: 0, scale: 0.8, duration: 0.2 });
        };

        window.addEventListener("mousemove", moveCursor);

        const bindEvents = () => {
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
        };

        bindEvents();

        const observer = new MutationObserver(() => bindEvents());
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            document.documentElement.style.cursor = "";
            observer.disconnect();
        };
    }, []);

    if (typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
        return null;
    }

    return (
        <>
            {/* Dot */}
            <div
                ref={dotRef}
                className="custom-cursor-dot fixed top-0 left-0 w-1.5 h-1.5 bg-[#D4AF37] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
                style={{ willChange: "transform" }}
            />
            {/* Ring with gold gradient border */}
            <div
                ref={ringRef}
                className="custom-cursor-ring fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                style={{
                    willChange: "transform",
                    border: "1px solid rgba(212,175,53,0.2)",
                }}
            >
                <span
                    ref={textRef}
                    className="text-[7px] text-[#D4AF37]/80 uppercase tracking-[0.2em] opacity-0 font-medium"
                    style={{ fontFamily: "var(--font-sans)" }}
                >
                    Discover
                </span>
            </div>
        </>
    );
}
