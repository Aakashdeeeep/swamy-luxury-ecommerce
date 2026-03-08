import { NextResponse } from "next/server";

/* ─── GoldAPI.io free-tier integration ────────────────
   Sign up at https://www.goldapi.io (free, no card).
   Set GOLDAPI_KEY in .env.local:
     GOLDAPI_KEY=goldapi-xxxxxxxxxxxx-xxxxxxx
   Free tier: 100 requests/month, daily prices, 22K/24K per gram
   ─────────────────────────────────────────────────── */

const API_KEY = process.env.GOLDAPI_KEY || "";
const BASE_URL = "https://www.goldapi.io/api";

// In-memory cache (server-side, survives across requests in same process)
let cache: { data: MetalPrices | null; timestamp: number } = {
    data: null,
    timestamp: 0,
};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface GoldApiResponse {
    timestamp: number;
    metal: string;
    currency: string;
    exchange: string;
    symbol: string;
    prev_close_price: number;
    open_price: number;
    low_price: number;
    high_price: number;
    open_time: number;
    price: number;
    ch: number;
    chp: number;
    ask: number;
    bid: number;
    price_gram_24k: number;
    price_gram_22k: number;
    price_gram_21k: number;
    price_gram_20k: number;
    price_gram_18k: number;
}

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

// Realistic fallback prices (updated periodically) — INR per gram
const FALLBACK_PRICES: MetalPrices = {
    gold: {
        price_gram_24k: 7850,
        price_gram_22k: 7195,
        price_gram_18k: 5888,
        change: 45,
        changePercent: 0.58,
    },
    silver: {
        price_gram: 95.5,
        change: 1.2,
        changePercent: 1.27,
    },
    timestamp: Date.now(),
    source: "fallback",
};

async function fetchGoldPrice(): Promise<GoldApiResponse | null> {
    if (!API_KEY) return null;
    try {
        const res = await fetch(`${BASE_URL}/XAU/INR`, {
            headers: { "x-access-token": API_KEY, "Content-Type": "application/json" },
            next: { revalidate: 300 },
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

async function fetchSilverPrice(): Promise<GoldApiResponse | null> {
    if (!API_KEY) return null;
    try {
        const res = await fetch(`${BASE_URL}/XAG/INR`, {
            headers: { "x-access-token": API_KEY, "Content-Type": "application/json" },
            next: { revalidate: 300 },
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export async function GET() {
    // Return cache if fresh
    if (cache.data && Date.now() - cache.timestamp < CACHE_TTL) {
        return NextResponse.json(cache.data, {
            headers: {
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
            },
        });
    }

    const [gold, silver] = await Promise.all([fetchGoldPrice(), fetchSilverPrice()]);

    if (gold && silver) {
        const prices: MetalPrices = {
            gold: {
                price_gram_24k: Math.round(gold.price_gram_24k),
                price_gram_22k: Math.round(gold.price_gram_22k),
                price_gram_18k: Math.round(gold.price_gram_18k),
                change: gold.ch,
                changePercent: gold.chp,
            },
            silver: {
                price_gram: Math.round(silver.price_gram_24k * 100) / 100,
                change: silver.ch,
                changePercent: silver.chp,
            },
            timestamp: gold.timestamp * 1000,
            source: "live",
        };
        cache = { data: prices, timestamp: Date.now() };
        return NextResponse.json(prices, {
            headers: {
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
            },
        });
    }

    // Fallback
    return NextResponse.json(
        { ...FALLBACK_PRICES, timestamp: Date.now() },
        { headers: { "Cache-Control": "public, s-maxage=60" } }
    );
}
