"use client";

import { useRef, useEffect, createElement, ReactNode, CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
    children: string;
    as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
    split?: "chars" | "words" | "lines";
    className?: string;
    stagger?: number;
    duration?: number;
    delay?: number;
    scrollTrigger?: boolean;
    triggerStart?: string;
    ease?: string;
    once?: boolean;
    style?: CSSProperties;
}

export default function TextReveal({
    children,
    as = "div",
    split = "chars",
    className = "",
    stagger = 0.03,
    duration = 1.8,
    delay = 0,
    scrollTrigger = true,
    triggerStart = "top 80%",
    ease = "expo.out",
    once = true,
    style: externalStyle,
}: TextRevealProps) {
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const el = containerRef.current;
        const spans = el.querySelectorAll<HTMLElement>(".tr-unit");

        if (spans.length === 0) return;

        const animConfig: gsap.TweenVars = {
            y: "110%",
            rotateX: -80,
            opacity: 0,
        };

        const toConfig: gsap.TweenVars = {
            y: "0%",
            rotateX: 0,
            opacity: 1,
            stagger,
            duration,
            delay,
            ease,
        };

        if (scrollTrigger) {
            toConfig.scrollTrigger = {
                trigger: el,
                start: triggerStart,
                toggleActions: once ? "play none none none" : "play none none reverse",
            };
        }

        gsap.set(spans, animConfig);
        gsap.to(spans, toConfig);

        return () => {
            ScrollTrigger.getAll().forEach((t) => {
                if (t.vars.trigger === el) t.kill();
            });
        };
    }, [children, stagger, duration, delay, scrollTrigger, triggerStart, ease, once]);

    // Build split content
    let units: ReactNode[] = [];

    if (split === "chars") {
        // Split into words first, then chars within each word
        const words = children.split(" ");
        words.forEach((word, wi) => {
            const chars = word.split("").map((ch, ci) => (
                <span
                    key={`${wi}-${ci}`}
                    className="tr-mask"
                    style={{
                        overflow: "hidden",
                        display: "inline-block",
                        perspective: "400px",
                    }}
                >
                    <span
                        className="tr-unit"
                        style={{
                            display: "inline-block",
                            willChange: "transform, opacity",
                            transformStyle: "preserve-3d",
                        }}
                    >
                        {ch}
                    </span>
                </span>
            ));
            units.push(...chars);
            // Add space between words
            if (wi < words.length - 1) {
                units.push(
                    <span key={`space-${wi}`} style={{ display: "inline-block", width: "0.3em" }}>
                        &nbsp;
                    </span>
                );
            }
        });
    } else if (split === "words") {
        const words = children.split(" ");
        units = words.map((word, i) => (
            <span
                key={i}
                className="tr-mask"
                style={{
                    overflow: "hidden",
                    display: "inline-block",
                    perspective: "400px",
                    marginRight: "0.3em",
                }}
            >
                <span
                    className="tr-unit"
                    style={{
                        display: "inline-block",
                        willChange: "transform, opacity",
                        transformStyle: "preserve-3d",
                    }}
                >
                    {word}
                </span>
            </span>
        ));
    } else {
        // 'lines' — treat entire text as one unit
        units = [
            <span
                key="line"
                className="tr-mask"
                style={{
                    overflow: "hidden",
                    display: "block",
                    perspective: "400px",
                }}
            >
                <span
                    className="tr-unit"
                    style={{
                        display: "block",
                        willChange: "transform, opacity",
                        transformStyle: "preserve-3d",
                    }}
                >
                    {children}
                </span>
            </span>,
        ];
    }

    return createElement(
        as,
        {
            ref: containerRef,
            className: `${className}`,
            style: { lineHeight: 1.1, ...externalStyle },
        },
        ...units
    );
}
