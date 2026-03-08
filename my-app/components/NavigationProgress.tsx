"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { Suspense } from "react";

function ProgressBarInner() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const barRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(false);
    const prevPath = useRef(pathname);
    const tweenRef = useRef<gsap.core.Tween | null>(null);

    useEffect(() => {
        if (prevPath.current !== pathname) {
            // Path changed — complete the bar
            prevPath.current = pathname;
            if (barRef.current) {
                tweenRef.current?.kill();
                gsap.to(barRef.current, {
                    scaleX: 1,
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.out",
                    onComplete: () => {
                        gsap.to(barRef.current, {
                            opacity: 0,
                            delay: 0.15,
                            duration: 0.4,
                            onComplete: () => {
                                gsap.set(barRef.current, { scaleX: 0, opacity: 1 });
                                setActive(false);
                            },
                        });
                    },
                });
            }
        }
    }, [pathname, searchParams]);

    // Intercept all Link clicks to start the bar
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest("a");
            if (!target) return;
            const href = target.getAttribute("href");
            if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel")) return;
            if (href === pathname) return;

            // Start loading bar
            if (barRef.current) {
                tweenRef.current?.kill();
                gsap.set(barRef.current, { scaleX: 0, opacity: 1 });
                setActive(true);
                tweenRef.current = gsap.to(barRef.current, {
                    scaleX: 0.85,
                    duration: 2,
                    ease: "power1.inOut",
                });
            }
        };

        document.addEventListener("click", handleClick, { capture: true });
        return () => document.removeEventListener("click", handleClick, { capture: true });
    }, [pathname]);

    return (
        <div className="fixed top-0 left-0 w-full z-[300] pointer-events-none h-[2px]">
            <div
                ref={barRef}
                className="h-full w-full origin-left opacity-0"
                style={{
                    background: "linear-gradient(90deg, #8A6E24, #FBF5B7, #D4AF37)",
                    boxShadow: "0 0 8px rgba(212,175,55,0.6), 0 0 20px rgba(212,175,55,0.3)",
                    transform: "scaleX(0)",
                }}
            />
        </div>
    );
}

export default function NavigationProgress() {
    return (
        <Suspense fallback={null}>
            <ProgressBarInner />
        </Suspense>
    );
}
