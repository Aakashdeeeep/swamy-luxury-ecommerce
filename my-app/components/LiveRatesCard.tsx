"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import gsap from "gsap";

interface MetalPrices {
    gold: {
        price_gram_24k: number;
        price_gram_22k: number;
        price_gram_18k: number;
        change: number;
        changePercent: number;
    };
    silver: {
        price_gram: number;
        change: number;
        changePercent: number;
    };
    timestamp: number;
    source: "live" | "fallback";
}

// Fallback prices for immediate render
const INITIAL_PRICES: MetalPrices = {
    gold: { price_gram_24k: 7850, price_gram_22k: 7195, price_gram_18k: 5888, change: 45, changePercent: 0.58 },
    silver: { price_gram: 95.5, change: 1.2, changePercent: 1.27 },
    timestamp: Date.now(),
    source: "fallback",
};

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

function formatINR(value: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

function formatChange(change: number, percent: number): { text: string; isPositive: boolean } {
    const sign = change >= 0 ? "+" : "";
    return {
        text: `${sign}${change.toFixed(1)} (${sign}${percent.toFixed(2)}%)`,
        isPositive: change >= 0,
    };
}

/* ─────────────────────────────────────────────────────
   Compact Ticker — used in Navbar / top bar
   ───────────────────────────────────────────────────── */
export function LivePriceTicker() {
    const [prices, setPrices] = useState<MetalPrices>(INITIAL_PRICES);
    const [isLive, setIsLive] = useState(false);
    const tickerRef = useRef<HTMLDivElement>(null);

    const fetchPrices = useCallback(async () => {
        try {
            const res = await fetch("/api/metal-prices");
            if (res.ok) {
                const data: MetalPrices = await res.json();
                setPrices(data);
                setIsLive(data.source === "live");

                // Flash animation on update
                if (tickerRef.current) {
                    gsap.fromTo(
                        tickerRef.current,
                        { borderColor: "rgba(212,175,53,0.6)" },
                        { borderColor: "rgba(212,175,53,0.1)", duration: 1.5, ease: "power2.out" }
                    );
                }
            }
        } catch {
            /* keep fallback */
        }
    }, []);

    useEffect(() => {
        fetchPrices();
        const interval = setInterval(fetchPrices, REFRESH_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchPrices]);

    const goldChange = formatChange(prices.gold.change, prices.gold.changePercent);

    return (
        <div
            ref={tickerRef}
            className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-all duration-500"
        >
            {/* Live indicator */}
            <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-green-400 animate-pulse" : "bg-[#D4AF37]"}`} />
                <span
                    className="text-[8px] uppercase tracking-[0.15em] text-gray-500"
                    style={{ fontFamily: "var(--font-sans)" }}
                >
                    {isLive ? "Live" : "Rate"}
                </span>
            </div>

            {/* Gold 22K */}
            <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-[#D4AF37] font-bold" style={{ fontFamily: "var(--font-sans)" }}>
                    Au 22K
                </span>
                <span className="text-[10px] text-white font-medium" style={{ fontFamily: "var(--font-sans)" }}>
                    {formatINR(prices.gold.price_gram_22k)}/g
                </span>
                <span
                    className={`text-[8px] font-medium ${goldChange.isPositive ? "text-green-400" : "text-red-400"}`}
                    style={{ fontFamily: "var(--font-sans)" }}
                >
                    {goldChange.isPositive ? "▲" : "▼"}
                </span>
            </div>

            <div className="w-px h-3 bg-white/10" />

            {/* Silver */}
            <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-gray-400 font-bold" style={{ fontFamily: "var(--font-sans)" }}>
                    Ag
                </span>
                <span className="text-[10px] text-white font-medium" style={{ fontFamily: "var(--font-sans)" }}>
                    {formatINR(prices.silver.price_gram)}/g
                </span>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────
   Full Rate Card — used as a section/widget
   ───────────────────────────────────────────────────── */
export default function LiveRatesCard() {
    const [prices, setPrices] = useState<MetalPrices>(INITIAL_PRICES);
    const [isLive, setIsLive] = useState(false);
    const [lastUpdated, setLastUpdated] = useState("");
    const cardRef = useRef<HTMLDivElement>(null);

    const fetchPrices = useCallback(async () => {
        try {
            const res = await fetch("/api/metal-prices");
            if (res.ok) {
                const data: MetalPrices = await res.json();
                setPrices(data);
                setIsLive(data.source === "live");
                setLastUpdated(
                    new Date(data.timestamp).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                    })
                );
            }
        } catch {
            /* keep fallback */
        }
    }, []);

    useEffect(() => {
        fetchPrices();
        const interval = setInterval(fetchPrices, REFRESH_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchPrices]);

    const goldChange = formatChange(prices.gold.change, prices.gold.changePercent);
    const silverChange = formatChange(prices.silver.change, prices.silver.changePercent);

    return (
        <div
            ref={cardRef}
            className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl shadow-2xl"
        >
            {/* Ambient glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#D4AF37]/[0.04] rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#7D1C55]/[0.04] rounded-full blur-[80px] pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/[0.04]">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#C9B06B] text-lg">monitoring</span>
                    <h3
                        className="text-sm text-white font-light uppercase tracking-[0.2em]"
                        style={{ fontFamily: "var(--font-editorial)" }}
                    >
                        Live Metal Rates
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-green-400 animate-pulse" : "bg-[#C9B06B]"}`} />
                    <span className="text-[8px] uppercase tracking-widest text-gray-500" style={{ fontFamily: "var(--font-sans)" }}>
                        {isLive ? "Live" : "Indicative"}
                    </span>
                </div>
            </div>

            {/* Rates Grid */}
            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Gold 24K */}
                <div className="space-y-3 p-5 rounded-lg bg-white/[0.015] border border-[#D4AF37]/8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full border border-[#D4AF37]/30 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-[#D4AF37]" style={{ fontFamily: "var(--font-sans)" }}>24K</span>
                            </div>
                            <div>
                                <span className="text-xs text-white font-light block" style={{ fontFamily: "var(--font-editorial)" }}>Gold 24K</span>
                                <span className="text-[11px] text-gray-500 tracking-wider" style={{ fontFamily: "var(--font-sans)" }}>Pure Gold</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl text-[#D4AF37] font-light" style={{ fontFamily: "var(--font-editorial)" }}>
                            {formatINR(prices.gold.price_gram_24k)}
                        </span>
                        <span className="text-[11px] text-gray-500">/gram</span>
                    </div>
                    <div className={`text-[10px] font-medium ${goldChange.isPositive ? "text-green-400" : "text-red-400"}`} style={{ fontFamily: "var(--font-sans)" }}>
                        {goldChange.text}
                    </div>
                </div>

                {/* Gold 22K */}
                <div className="space-y-3 p-5 rounded-lg bg-white/[0.015] border border-[#D4AF37]/8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full border border-[#D4AF37]/20 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-[#D4AF37]/80" style={{ fontFamily: "var(--font-sans)" }}>22K</span>
                            </div>
                            <div>
                                <span className="text-xs text-white font-light block" style={{ fontFamily: "var(--font-editorial)" }}>Gold 22K</span>
                                <span className="text-[11px] text-gray-500 tracking-wider" style={{ fontFamily: "var(--font-sans)" }}>916 Hallmark</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl text-[#D4AF37] font-light" style={{ fontFamily: "var(--font-editorial)" }}>
                            {formatINR(prices.gold.price_gram_22k)}
                        </span>
                        <span className="text-[11px] text-gray-500">/gram</span>
                    </div>
                    <div className="text-[10px] text-gray-500" style={{ fontFamily: "var(--font-sans)" }}>
                        BIS 916 Hallmark Standard
                    </div>
                </div>

                {/* Gold 18K */}
                <div className="space-y-3 p-5 rounded-lg bg-white/[0.015] border border-white/[0.03]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-white/50" style={{ fontFamily: "var(--font-sans)" }}>18K</span>
                            </div>
                            <div>
                                <span className="text-xs text-white font-light block" style={{ fontFamily: "var(--font-editorial)" }}>Gold 18K</span>
                                <span className="text-[11px] text-gray-500 tracking-wider" style={{ fontFamily: "var(--font-sans)" }}>750 Hallmark</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl text-white/70 font-light" style={{ fontFamily: "var(--font-editorial)" }}>
                            {formatINR(prices.gold.price_gram_18k)}
                        </span>
                        <span className="text-[11px] text-gray-500">/gram</span>
                    </div>
                    <div className="text-[10px] text-gray-500" style={{ fontFamily: "var(--font-sans)" }}>
                        Diamond Jewelry Standard
                    </div>
                </div>

                {/* Silver */}
                <div className="space-y-3 p-5 rounded-lg bg-white/[0.015] border border-white/[0.03]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-white/50" style={{ fontFamily: "var(--font-sans)" }}>Ag</span>
                            </div>
                            <div>
                                <span className="text-xs text-white font-light block" style={{ fontFamily: "var(--font-editorial)" }}>Silver</span>
                                <span className="text-[11px] text-gray-500 tracking-wider" style={{ fontFamily: "var(--font-sans)" }}>999 Fine</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl text-white/70 font-light" style={{ fontFamily: "var(--font-editorial)" }}>
                            {formatINR(prices.silver.price_gram)}
                        </span>
                        <span className="text-[11px] text-gray-500">/gram</span>
                    </div>
                    <div className={`text-[10px] font-medium ${silverChange.isPositive ? "text-green-400" : "text-red-400"}`} style={{ fontFamily: "var(--font-sans)" }}>
                        {silverChange.text}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-white/[0.03] flex items-center justify-between">
                <span className="text-[10px] text-gray-600 tracking-wider" style={{ fontFamily: "var(--font-sans)" }}>
                    {lastUpdated ? `Updated ${lastUpdated} IST` : "Loading..."}
                </span>
                <span className="text-[10px] text-gray-600 tracking-wider" style={{ fontFamily: "var(--font-sans)" }}>
                    Source: {isLive ? "FOREX/LBMA" : "Indicative rates"} · INR/gram
                </span>
            </div>
        </div>
    );
}
