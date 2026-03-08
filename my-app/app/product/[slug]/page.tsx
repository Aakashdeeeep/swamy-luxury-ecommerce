"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import CustomCursor from "../../../components/CustomCursor";
import Link from "next/link";
import { useProduct, getPrimaryImage } from "../../../lib/hooks";

gsap.registerPlugin(ScrollTrigger);

/* ─── Price Formatting (Indian ₹ X,XX,XXX) ─────────── */
function formatPrice(raw: string | number | null | undefined): string {
    if (!raw) return "₹ 0";
    // If already formatted with ₹ and commas, return as-is
    if (typeof raw === "string" && raw.includes("₹") && raw.includes(",")) return raw;
    const str = String(raw).replace(/[^0-9.]/g, "");
    const num = parseFloat(str);
    if (isNaN(num) || num === 0) return typeof raw === "string" ? raw : "₹ 0";
    // Indian numbering system
    const formatted = num.toLocaleString("en-IN", {
        maximumFractionDigits: 0,
        style: "currency",
        currency: "INR",
    });
    return formatted.replace("₹", "₹ ");
}

/* ─── Fallback Data ─────────────────────────────────── */
const FALLBACK_MAIN_IMAGE =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDwVAqTJdg7IiJW-NxKSe4q-7oglYBz1zkqtb08n83kCy-LfQVq4Lc5tmjim1RunayItzC7L7xjZXiGOvWjoLbx9y0sWzBWneUdViQZ460DRpi9W1uHbXmT9HlEygduZYkBG_wA5sqxFo0byAtkyuxTfjOsvWaHBZ8PvAEDR7SGUqyxqTZx6wtgmHX-RUkS46axk1MBfOcT8OFs6nm1uKb86lcerWLjhpCKYhUwCa7dUkfw9YTeAv2Zv-A5-zeg5DAjJeEoN8BEF8Kd";

const FALLBACK_THUMBNAILS = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCfFPe9PCDTnjsS_T_xRi2CDs74cQYCoHuqW_bmtisdhE-YgB-GeoNF435eGEONfZCE-pvje2-NBz3KndVkbCzdw_QuujJUtO7NBD_pVkVCu1x1LOSRNY1LRb6dBcr045H6QS3fdi9VmErCAH9H2T0ZHPvpy89AqjkF3V73g704QXBBZqzeBSrj24-fYYKyKTDQ3oXr0Cve4WoutqEj-BemR5UheMP6_X5iAdw9hhrZXv3jCBTMY87gZ3WPz-XjXfOMwO6-zqmwUTUa",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDzrL7usrA23s2Nn1NpSN3TMvTfX1FznOpEa6vmkTlsNynBBGLhD3_3OcHockhxCwTqKdjW0smYhEGpq4BXzEgxaScSri1yzxDJoLsKzmgQNN72Yk2GXNkNzqhLquBxUpm8sazw3RCF1je4tcvZzMG5iTczWOxQPY107z-g7SwJtKYV5XnJcRYGJ0KrQ4qyTKEXJbwz2uEKPR4uM3xwEbwjsxYV1VUKAu9S5SvLwjDtYnHQZ4Dkky3Mmqe0Z-HMhHOuKW96No1Lsd4-",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBg87Iff6iXTSNPoBhC7sozocy7xJsi119FpvGXxeKhAR134yY8142tVafB9UyNiKSXIlfxD6whKycEgj0I4iSEhiCJKolro2p7LlVSLyScD3tWuu_ZGj1fepsvVBl48BhlesD7WND-1Aw_iEixdISGGyZM4Y1BKZ-kRg7c9fr2zTLhmVVpV4OAAyPlySw17FscI0z1P7Bkw3-osiFw7rUWShf2E1_IqW-VOG4g8rWexgZyPTCF4Z-w9t-Q7M0nVVYfGhDUr3ortN7Q",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCdNhbT4xJKFNh_lZAib43JSQ5RxDQuALjLm-y3cS_rKaO5FQ3fxj_1H_lm3iF3ytBPNh-R009pU8jEyPN43kPrcysZhzCoTaajDRvX8fW0zApgeiLgMcfl5uVoEO7cDqusWF-axqJsoJAZkH6KZBlwCgadVN6E-KSBJgv9KyiHJbwbuSYIGMA-o2fVha50Bepb9i65nRBfoyPo63cXcFHV55tz_MpAz1T4-nXocXi7vygqelXVg58b2SBmy0P7FOUSgZS1q3cew0yZ",
];

const FALLBACK_RELATED = [
    {
        name: "Vadavalli Jhumkas",
        price: "₹ 85,000",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYIDSQiGPOgJ4Gju1L-t-LNdI3lZRZNBCoJkDRHPXxFwy-VhHOigy-hcY-FPQdleh2vI7uez3EvGt8fa3wzGpayMx6BmAFAMe3y37U0DE2dRDLV_I5qVlo6bDSwhfCgTV103e-Xlc-mwjudM854wGbslkMpjrBnRCG_4smT2VANGaUtwiE1VGzJjIbX-8mndloH-jegF2A_hOcPvXouHPcXq3jaBzWYEraJbR1ftYDPde0Y7ni-RQCRZePKUPilhSn_zT-O2oG90V5",
        slug: "vadavalli-jhumkas",
    },
    {
        name: "Vadavalli Bangle",
        price: "₹ 1,20,000",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWlcXDDkYIyJNK473Is99d1wbfWbzuTFSQF1k3pn7RtjsBEYpgCKbFIPJtnYKshI5mF10ZqlsJdPqOy95gfcfOC_3JAlWGbII4zEgIKbM2ayFY6dUqweugjTp2GBW2mL2i4Sbs3wayuPxIwzt7ESat34xqCV6LdxMRAgjKReQsk3_6r-QQSiBDnUgGIQifK_wdyi6b2OChJnhroLoN5nxhFg2tQH0w-IGJAAzSr70nIJT6gN9We5fe0So5pxPYzE8AOY1WF36DK_Xq",
        slug: "vadavalli-gold-bangle",
    },
    {
        name: "Heritage Ring",
        price: "₹ 55,000",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkKWwo6Q5tQVOz8861JRJzdxsvYwEnmffrcEMwuFSUoeRdvJTGL35yHYyzsqyRY9c1aIQ-7H2LRJtIaeFu8JuG5M5c1V55DDAnMgn_4NTWbM4GNNyVf0cQaffa17wMNJfytPgvmga5xQ84xCfDmnTQHu4FeYO23y4w0dtqApixDFkkqAZRKh5cSe1I_tWOwcnN4vRwumn00kKrVduujqmbxD_hydzb3foGPIzi8mWwjYdwLTZmU8uJAXy0Jn3LwaVcM9tmc8ucSeu9",
        slug: "heritage-vanki-ring",
    },
];

const FALLBACK_SPECS = [
    { label: "Metal", value: "22K Gold (916 Hallmark)", icon: "toll" },
    { label: "Gross Weight", value: "55.0 grams", icon: "scale" },
    { label: "Net Gold Weight", value: "52.0 grams", icon: "balance" },
    { label: "Diamond", value: "VVS1/IF, IGI Certified", icon: "diamond" },
    { label: "Diamond Weight", value: "2.4 carats", icon: "straighten" },
    { label: "Stone", value: "Natural Kemp Stones", icon: "spa" },
    { label: "Finish", value: "Antique Matte + High Polish", icon: "auto_awesome" },
    { label: "Occasion", value: "Bridal, Temple, Festive", icon: "celebration" },
];

const SPEC_ICONS: Record<string, string> = {
    Metal: "toll",
    "Gross Weight": "scale",
    "Net Gold Weight": "balance",
    Diamond: "diamond",
    "Diamond Weight": "straighten",
    Stone: "spa",
    Finish: "auto_awesome",
    Occasion: "celebration",
    Purity: "verified",
    Length: "straighten",
    Width: "width",
    Default: "info",
};

/* ─── Component ─────────────────────────────────────── */
export default function ProductDetailPage() {
    const params = useParams();
    const slug = typeof params.slug === "string" ? params.slug : "";
    const pageRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const [selectedMetal, setSelectedMetal] = useState("22k");
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [addedToBag, setAddedToBag] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [isHoveringImage, setIsHoveringImage] = useState(false);

    // Dynamic data from Supabase
    const { product, relatedProducts: dbRelated, loading } = useProduct(slug);

    // Derive display data
    const mainImage = useMemo(() => {
        if (product) return getPrimaryImage(product) ?? FALLBACK_MAIN_IMAGE;
        return FALLBACK_MAIN_IMAGE;
    }, [product]);

    const thumbnails = useMemo(() => {
        if (product?.images && product.images.length > 0) {
            return product.images
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((img) => img.url);
        }
        return FALLBACK_THUMBNAILS;
    }, [product]);

    const specs = useMemo(() => {
        if (product?.specs && product.specs.length > 0) {
            return product.specs
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((s) => ({
                    label: s.label,
                    value: s.value,
                    icon: SPEC_ICONS[s.label] ?? SPEC_ICONS.Default,
                }));
        }
        return FALLBACK_SPECS;
    }, [product]);

    const relatedProducts = useMemo(() => {
        if (dbRelated.length > 0) {
            return dbRelated.map(
                (p: {
                    title: string;
                    price?: string | null;
                    slug: string;
                    images?: { url: string; is_primary: boolean; sort_order: number }[];
                }) => ({
                    name: p.title,
                    price: formatPrice(p.price),
                    image: getPrimaryImage(p as Parameters<typeof getPrimaryImage>[0]) ?? "",
                    slug: p.slug,
                })
            );
        }
        return FALLBACK_RELATED;
    }, [dbRelated]);

    const title = product?.title ?? "Coimbatore Heritage Necklace";
    const price = formatPrice(product?.price ?? "₹ 4,50,000");
    const material = product?.material ?? "Traditional Kemp";
    const weight = product?.weight ?? "55g";
    const certification = product?.certification ?? "916";
    const certIcon = product?.cert_icon ?? "verified";
    const badge = product?.badge ?? "";
    const description =
        product?.description ??
        "An ode to the timeless artistry of the Kongu region. This heritage piece features intricate filigree work in 22K gold, accentuated by VVS1 diamonds that capture the essence of divine radiance. A heirloom crafted not just for today, but for generations.";

    const [activeImage, setActiveImage] = useState<string | null>(null);
    const displayImage = activeImage ?? mainImage;

    // Parallax on image hover
    const handleImageMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!imageContainerRef.current) return;
            const rect = imageContainerRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
            setCursorPos({ x, y });
        },
        []
    );

    /* ─── Animations ─────────────────────────────────── */
    useGSAP(
        () => {
            if (!pageRef.current) return;

            const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

            tl.from(".pdp-breadcrumb span, .pdp-breadcrumb a", {
                opacity: 0, y: -20, stagger: 0.05, duration: 0.6,
            })
            .from(".pdp-main-image", {
                opacity: 0, scale: 1.1, duration: 1.4, ease: "expo.out",
            }, 0.1)
            .from(".pdp-image-frame", {
                opacity: 0, scale: 0.95, duration: 1,
            }, 0.2)
            .from(".pdp-thumb", {
                opacity: 0, y: 30, stagger: 0.08, duration: 0.6,
            }, 0.5)
            .from(".pdp-label", {
                opacity: 0, y: 10, duration: 0.5,
            }, 0.3)
            .from(".pdp-title-word", {
                opacity: 0, y: 60, rotateX: 20, stagger: 0.08, duration: 0.8,
            }, 0.4)
            .from(".pdp-price", {
                opacity: 0, x: -30, duration: 0.7,
            }, 0.7)
            .from(".pdp-badge", {
                opacity: 0, scale: 0.8, stagger: 0.08, duration: 0.5,
            }, 0.8)
            .from(".pdp-desc", {
                opacity: 0, y: 20, duration: 0.7,
            }, 0.9)
            .from(".pdp-variant", {
                opacity: 0, y: 20, stagger: 0.06, duration: 0.5,
            }, 1.0)
            .from(".pdp-action", {
                opacity: 0, y: 20, stagger: 0.08, duration: 0.6,
            }, 1.1);

            // Specs grid
            gsap.from(".pdp-spec-card", {
                opacity: 0, y: 40, scale: 0.95,
                stagger: { each: 0.06, grid: "auto", from: "start" },
                duration: 0.7, ease: "power3.out",
                scrollTrigger: { trigger: ".pdp-specs", start: "top 85%" },
            });

            // Section headers
            gsap.utils.toArray<HTMLElement>(".pdp-section-header").forEach((el) => {
                gsap.from(el, {
                    opacity: 0, y: 30, duration: 0.8, ease: "power3.out",
                    scrollTrigger: { trigger: el, start: "top 85%" },
                });
            });

            // Related products
            gsap.from(".pdp-related-card", {
                opacity: 0, y: 50, stagger: 0.12, duration: 0.8, ease: "power3.out",
                scrollTrigger: { trigger: ".pdp-related", start: "top 85%" },
            });

            // Banner
            gsap.from(".pdp-banner", {
                opacity: 0, y: 40, duration: 1, ease: "power3.out",
                scrollTrigger: { trigger: ".pdp-banner", start: "top 85%" },
            });

            // Floating marquee
            gsap.to(".pdp-marquee-track", {
                xPercent: -50, duration: 30, ease: "none", repeat: -1,
            });
        },
        { scope: pageRef }
    );

    /* ─── Image switch animation ──────────────────────── */
    const handleImageChange = (src: string) => {
        if (src === displayImage) return;
        const imgEl = pageRef.current?.querySelector(".pdp-main-image");
        if (imgEl) {
            gsap.to(imgEl, {
                opacity: 0, scale: 1.05, duration: 0.3, ease: "power2.in",
                onComplete: () => {
                    setActiveImage(src);
                    gsap.fromTo(imgEl,
                        { opacity: 0, scale: 0.95 },
                        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
                    );
                },
            });
        } else {
            setActiveImage(src);
        }
    };

    const titleWords = title.split(" ");

    return (
        <div ref={pageRef} className="min-h-screen bg-[#030303] text-white selection:bg-[#D4AF37] selection:text-[#030303]">
            <CustomCursor />
            <div className="noise-overlay" />
            <Navbar />

            {/* ═══ FLOATING MARQUEE BAR ═══ */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#030303]/80 backdrop-blur-lg border-t border-white/[0.04] py-2 overflow-hidden pointer-events-none">
                <div className="pdp-marquee-track flex gap-12 whitespace-nowrap">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <span key={i} className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20" style={{ fontFamily: "var(--font-sans)" }}>
                            {i % 2 === 0 ? "SWAMY JEWELLERY" : "✦  HANDCRAFTED IN COIMBATORE  ✦"}
                        </span>
                    ))}
                </div>
            </div>

            <main className="pt-20 md:pt-24 pb-16">
                {/* ═══ BREADCRUMBS ═══ */}
                <div className="pdp-breadcrumb max-w-[1600px] mx-auto px-6 lg:px-12 py-6 flex items-center gap-3" style={{ fontFamily: "var(--font-sans)" }}>
                    <Link href="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-[#D4AF37] transition-colors duration-500">Home</Link>
                    <span className="text-white/15 text-xs">/</span>
                    <Link href="/collections" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-[#D4AF37] transition-colors duration-500">Collections</Link>
                    <span className="text-white/15 text-xs">/</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]/70">{title}</span>
                </div>

                {/* ═══ HERO — EDITORIAL SPLIT ═══ */}
                <section ref={heroRef} className="max-w-[1600px] mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

                        {/* ─── LEFT: IMAGE GALLERY ─── */}
                        <div className="relative">
                            <div
                                ref={imageContainerRef}
                                className="pdp-image-frame relative aspect-[3/4] bg-[#0A0A0A] rounded-2xl overflow-hidden group cursor-crosshair"
                                onMouseMove={handleImageMouseMove}
                                onMouseEnter={() => setIsHoveringImage(true)}
                                onMouseLeave={() => { setIsHoveringImage(false); setCursorPos({ x: 0, y: 0 }); }}
                            >
                                {/* Ambient glow */}
                                <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(212,175,53,0.06) 0%, transparent 60%)" }} />

                                {/* Image with parallax */}
                                <img
                                    alt={title}
                                    className="pdp-main-image absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
                                    src={displayImage}
                                    onLoad={() => setImageLoaded(true)}
                                    style={{
                                        transform: isHoveringImage
                                            ? `translate(${cursorPos.x * -0.5}px, ${cursorPos.y * -0.5}px) scale(1.05)`
                                            : "translate(0,0) scale(1)",
                                    }}
                                />

                                {/* Cinematic vignette */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_30%,rgba(3,3,3,0.5)_100%)] pointer-events-none" />

                                {/* Gold shimmer on hover */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none mix-blend-overlay"
                                    style={{ background: `radial-gradient(600px circle at ${isHoveringImage ? `${cursorPos.x + 50}%` : "50%"} ${isHoveringImage ? `${cursorPos.y + 50}%` : "50%"}, rgba(212,175,53,0.08), transparent 60%)` }}
                                />

                                {/* Corner accents */}
                                <div className="absolute top-6 left-6 w-12 h-12 border-t border-l border-[#D4AF37]/20 pointer-events-none" />
                                <div className="absolute bottom-6 right-6 w-12 h-12 border-b border-r border-[#D4AF37]/20 pointer-events-none" />

                                {badge && (
                                    <div className="absolute top-6 right-6 z-10">
                                        <div className="bg-[#D4AF37] text-[#030303] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-sans)" }}>{badge}</div>
                                    </div>
                                )}

                                {/* Image counter */}
                                <div className="absolute bottom-6 left-6 z-10">
                                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-sans)" }}>
                                        {String(thumbnails.indexOf(displayImage) + 1 || 1).padStart(2, "0")} / {String(thumbnails.length).padStart(2, "0")}
                                    </span>
                                </div>
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-3 mt-4">
                                {[mainImage, ...thumbnails].filter((v, i, a) => a.indexOf(v) === i).map((thumb, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleImageChange(thumb)}
                                        className={`pdp-thumb relative flex-1 aspect-square rounded-xl overflow-hidden transition-all duration-500 ${
                                            displayImage === thumb
                                                ? "ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-[#030303] opacity-100 scale-[1.02]"
                                                : "opacity-40 hover:opacity-80 grayscale hover:grayscale-0"
                                        }`}
                                        data-cursor-hover
                                    >
                                        <img alt={`View ${i + 1}`} className="w-full h-full object-cover" src={thumb} loading="lazy" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ─── RIGHT: PRODUCT DETAILS ─── */}
                        <div className="lg:sticky lg:top-28 lg:self-start flex flex-col gap-8 py-4 lg:py-8">
                            {/* Collection label */}
                            <div className="pdp-label flex items-center gap-4">
                                <span className="w-10 h-px bg-[#D4AF37]" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#D4AF37]/80" style={{ fontFamily: "var(--font-sans)" }}>
                                    Swamy Heritage Collection
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light leading-[0.95] tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
                                {titleWords.map((word, i) => (
                                    <span key={i} className="pdp-title-word inline-block mr-[0.3em]">{word}</span>
                                ))}
                            </h1>

                            {/* Price */}
                            <div className="pdp-price flex items-end gap-4">
                                <span className="text-4xl lg:text-5xl font-extralight tracking-wider text-[#D4AF37]" style={{ fontFamily: "var(--font-display)" }}>{price}</span>
                                <span className="text-xs text-white/30 pb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-sans)" }}>Incl. of taxes</span>
                            </div>

                            {/* Certification Badges */}
                            <div className="flex flex-wrap gap-3">
                                <div className="pdp-badge inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/[0.04]">
                                    <span className="material-symbols-outlined text-[#D4AF37] text-sm">{certIcon}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]/90" style={{ fontFamily: "var(--font-sans)" }}>
                                        {certification === "916" ? "916 Hallmark Gold" : certification === "IGI" ? "IGI Certified Diamond" : certification}
                                    </span>
                                </div>
                                <div className="pdp-badge inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02]">
                                    <span className="material-symbols-outlined text-white/50 text-sm">workspace_premium</span>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50" style={{ fontFamily: "var(--font-sans)" }}>
                                        {material} &bull; {weight}
                                    </span>
                                </div>
                            </div>

                            <div className="h-px bg-gradient-to-r from-[#D4AF37]/30 via-white/5 to-transparent" />

                            {/* Description */}
                            <p className="pdp-desc text-sm sm:text-base text-white/50 font-light leading-[1.8] tracking-wide max-w-lg" style={{ fontFamily: "var(--font-sans)" }}>
                                {description}
                            </p>

                            {/* ─── Variants Card ─── */}
                            <div className="space-y-6 bg-white/[0.015] backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-white/[0.05] relative overflow-hidden">
                                <div className="absolute -right-16 -top-16 w-48 h-48 bg-[#D4AF37]/5 blur-[80px] rounded-full pointer-events-none" />

                                {/* Metal Variant */}
                                <div className="pdp-variant">
                                    <span className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-4" style={{ fontFamily: "var(--font-sans)" }}>Metal Variant</span>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { id: "22k", name: "22K Gold", gradient: "from-[#FFD700] to-[#B8860B]" },
                                            { id: "18k", name: "18K Rose", gradient: "from-[#E6BE8A] to-[#C27A4D]" },
                                            { id: "silver", name: "Pure Silver", gradient: "from-[#E0E0E0] to-[#A9A9A9]" },
                                        ].map((metal) => (
                                            <button
                                                key={metal.id}
                                                onClick={() => setSelectedMetal(metal.id)}
                                                className={`pdp-variant relative bg-[#0A0A0A] border rounded-xl p-4 flex flex-col items-center gap-3 transition-all duration-500 group ${
                                                    selectedMetal === metal.id
                                                        ? "border-[#D4AF37]/60 shadow-[0_0_20px_rgba(212,175,53,0.12)] scale-[1.02]"
                                                        : "border-white/[0.06] hover:border-white/15 hover:bg-white/[0.02]"
                                                }`}
                                                data-cursor-hover
                                            >
                                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${metal.gradient} shadow-lg transition-transform duration-500 group-hover:scale-110`} />
                                                <span className="text-[10px] text-white/60 font-medium tracking-wide" style={{ fontFamily: "var(--font-sans)" }}>{metal.name}</span>
                                                {selectedMetal === metal.id && (
                                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37] rounded-full flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-[#030303] text-xs">check</span>
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Chain Length */}
                                <div className="pdp-variant">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]" style={{ fontFamily: "var(--font-sans)" }}>Chain Length</span>
                                        <button className="text-[10px] uppercase tracking-wider text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors border-b border-[#D4AF37]/20 pb-0.5" data-cursor-hover style={{ fontFamily: "var(--font-sans)" }}>Size Guide</button>
                                    </div>
                                    <div className="relative">
                                        <select className="w-full appearance-none bg-[#0A0A0A] text-white/80 border border-white/[0.06] rounded-xl px-5 py-3.5 focus:outline-none focus:border-[#D4AF37]/30 transition-colors cursor-pointer text-sm font-light" style={{ fontFamily: "var(--font-sans)" }}>
                                            <option>Standard — 16 inches</option>
                                            <option>Princess — 18 inches</option>
                                            <option>Matinee — 20 inches</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none text-sm">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            {/* ─── Actions ─── */}
                            <div className="space-y-4">
                                <a
                                    href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi, I'm interested in ${title} (${price}). Could you share more details?`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="pdp-action w-full bg-gradient-to-r from-[#D4AF37] via-[#F3D87E] to-[#D4AF37] text-[#030303] font-bold text-xs tracking-[0.2em] uppercase py-5 rounded-xl flex items-center justify-center gap-3 transition-all duration-500 hover:brightness-110 shadow-[0_4px_30px_rgba(212,175,53,0.25)] hover:shadow-[0_4px_50px_rgba(212,175,53,0.4)] hover:-translate-y-0.5"
                                    data-cursor-hover
                                    style={{ fontFamily: "var(--font-sans)" }}
                                >
                                    <span className="material-symbols-outlined text-base">chat</span>
                                    Enquire on WhatsApp
                                </a>

                                <div className="pdp-action grid grid-cols-5 gap-3">
                                    <button
                                        onClick={() => { setAddedToBag(true); setTimeout(() => setAddedToBag(false), 2000); }}
                                        className="col-span-4 bg-transparent border border-white/10 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/[0.04] text-white font-bold text-xs tracking-[0.2em] uppercase py-5 rounded-xl flex items-center justify-center gap-3 transition-all duration-500 hover:-translate-y-0.5"
                                        data-cursor-hover
                                        style={{ fontFamily: "var(--font-sans)" }}
                                    >
                                        <span className="material-symbols-outlined text-base">{addedToBag ? "check_circle" : "shopping_bag"}</span>
                                        {addedToBag ? "Added!" : "Add to Bag"}
                                    </button>
                                    <button
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                        className={`col-span-1 border py-5 rounded-xl flex items-center justify-center transition-all duration-500 hover:-translate-y-0.5 ${
                                            isWishlisted
                                                ? "bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#D4AF37]"
                                                : "bg-transparent border-white/10 hover:border-[#D4AF37]/40 text-white/60 hover:text-[#D4AF37]"
                                        }`}
                                        data-cursor-hover
                                    >
                                        <span className="material-symbols-outlined">{isWishlisted ? "favorite" : "favorite_border"}</span>
                                    </button>
                                </div>

                                {/* Trust row */}
                                <div className="pdp-action flex items-center justify-center gap-8 pt-3">
                                    {[
                                        { icon: "local_shipping", text: "Insured Delivery" },
                                        { icon: "shield", text: "Lifetime Warranty" },
                                        { icon: "autorenew", text: "Easy Returns" },
                                    ].map((t) => (
                                        <div key={t.text} className="flex items-center gap-2 group">
                                            <span className="material-symbols-outlined text-xs text-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-colors duration-500">{t.icon}</span>
                                            <span className="text-[9px] text-white/25 uppercase tracking-[0.15em] group-hover:text-white/50 transition-colors duration-500" style={{ fontFamily: "var(--font-sans)" }}>{t.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══ SPECIFICATIONS — VISUAL GRID ═══ */}
                <section className="pdp-specs max-w-[1600px] mx-auto px-6 lg:px-12 mt-24 lg:mt-32">
                    <div className="pdp-section-header flex items-center gap-6 mb-12">
                        <span className="w-16 h-px bg-gradient-to-r from-[#D4AF37] to-transparent" />
                        <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-white/40" style={{ fontFamily: "var(--font-sans)" }}>Product Specifications</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {specs.map((s) => (
                            <div key={s.label} className="pdp-spec-card group relative bg-white/[0.02] border border-white/[0.04] rounded-2xl p-6 hover:border-[#D4AF37]/20 hover:bg-[#D4AF37]/[0.02] transition-all duration-700 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                <div className="relative z-10">
                                    <span className="material-symbols-outlined text-[#D4AF37]/30 text-2xl mb-4 block group-hover:text-[#D4AF37]/60 transition-colors duration-500">{s.icon}</span>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25 mb-2" style={{ fontFamily: "var(--font-sans)" }}>{s.label}</p>
                                    <p className="text-sm text-white/80 font-medium leading-snug" style={{ fontFamily: "var(--font-sans)" }}>{s.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ═══ COMPLETE THE LOOK ═══ */}
                <section className="pdp-related max-w-[1600px] mx-auto px-6 lg:px-12 mt-24 lg:mt-32">
                    <div className="pdp-section-header flex items-center justify-between mb-12">
                        <div className="flex items-center gap-6">
                            <span className="w-16 h-px bg-gradient-to-r from-[#D4AF37] to-transparent" />
                            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-white/40" style={{ fontFamily: "var(--font-sans)" }}>Complete The Look</h2>
                        </div>
                        <Link href="/collections" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors duration-500 flex items-center gap-2" style={{ fontFamily: "var(--font-sans)" }}>
                            View All
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {relatedProducts.map((item) => (
                            <Link key={item.name} href={`/product/${item.slug ?? "#"}`} className="pdp-related-card group relative" data-cursor-hover>
                                <div className="aspect-[3/4] bg-[#0A0A0A] rounded-2xl overflow-hidden mb-5 relative border border-white/[0.04] group-hover:border-[#D4AF37]/15 transition-all duration-700">
                                    <img className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" src={item.image} alt={item.name} loading="lazy" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-700" />
                                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white" style={{ fontFamily: "var(--font-sans)" }}>View Piece</span>
                                        <span className="material-symbols-outlined text-[#D4AF37] text-lg">arrow_outward</span>
                                    </div>
                                </div>
                                <h3 className="text-base font-light tracking-wide text-white/80 group-hover:text-white transition-colors duration-500 mb-1" style={{ fontFamily: "var(--font-display)" }}>{item.name}</h3>
                                <p className="text-sm text-[#D4AF37]/60 font-light tracking-wider" style={{ fontFamily: "var(--font-sans)" }}>{item.price}</p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* ═══ PREMIUM SCHEME BANNER ═══ */}
                <section className="max-w-[1600px] mx-auto px-6 lg:px-12 mt-24 lg:mt-32">
                    <div className="pdp-banner relative rounded-3xl overflow-hidden border border-white/[0.04]">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0f06] via-[#0a0704] to-[#030303]" />
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/[0.04] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#D4AF37]/[0.03] rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 p-10 lg:p-16 items-center">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[#D4AF37] text-lg">diamond</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-[#D4AF37]/70 uppercase tracking-[0.3em]" style={{ fontFamily: "var(--font-sans)" }}>Premium Savings Plan</span>
                                </div>
                                <h3 className="text-3xl lg:text-4xl text-white font-light leading-tight mb-4" style={{ fontFamily: "var(--font-display)" }}>
                                    Start Your Weekly<br /><span className="text-[#D4AF37]">Gold Savings</span>
                                </h3>
                                <p className="text-sm text-white/40 font-light leading-relaxed max-w-md mb-8" style={{ fontFamily: "var(--font-sans)" }}>
                                    Join our exclusive gold scheme for wastage-free purchase. Save weekly and own your dream jewellery at the best value.
                                </p>
                                <Link href="/schemes" className="inline-flex items-center gap-3 bg-gradient-to-r from-[#D4AF37] to-[#F9E58C] text-[#030303] text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-xl shadow-[0_4px_30px_rgba(212,175,53,0.2)] hover:shadow-[0_4px_50px_rgba(212,175,53,0.4)] hover:-translate-y-0.5 transition-all duration-500" data-cursor-hover style={{ fontFamily: "var(--font-sans)" }}>
                                    Join Now
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </Link>
                            </div>

                            <div className="hidden lg:flex items-center justify-center">
                                <div className="relative">
                                    <div className="w-48 h-48 rounded-full border border-[#D4AF37]/10 flex items-center justify-center">
                                        <div className="w-36 h-36 rounded-full border border-[#D4AF37]/15 flex items-center justify-center">
                                            <div className="w-24 h-24 rounded-full border border-[#D4AF37]/20 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[#D4AF37]/40 text-4xl">savings</span>
                                            </div>
                                        </div>
                                    </div>
                                    {[0, 90, 180, 270].map((deg) => (
                                        <div key={deg} className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-[#D4AF37]/30" style={{ transform: `rotate(${deg}deg) translateX(100px) translateY(-50%)` }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <div className="gold-divider mx-auto max-w-7xl mt-12" />
            <Footer />
        </div>
    );
}
