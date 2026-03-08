"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function ProductDetailsPage() {
    const [activeImage, setActiveImage] = useState("https://lh3.googleusercontent.com/aida-public/AB6AXuDwVAqTJdg7IiJW-NxKSe4q-7oglYBz1zkqtb08n83kCy-LfQVq4Lc5tmjim1RunayItzC7L7xjZXiGOvWjoLbx9y0sWzBWneUdViQZ460DRpi9W1uHbXmT9HlEygduZYkBG_wA5sqxFo0byAtkyuxTfjOsvWaHBZ8PvAEDR7SGUqyxqTZx6wtgmHX-RUkS46axk1MBfOcT8OFs6nm1uKb86lcerWLjhpCKYhUwCa7dUkfw9YTeAv2Zv-A5-zeg5DAjJeEoN8BEF8Kd");

    // Thumbnail images based on the ones from the Stitch HTML
    const thumbnails = [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCfFPe9PCDTnjsS_T_xRi2CDs74cQYCoHuqW_bmtisdhE-YgB-GeoNF435eGEONfZCE-pvje2-NBz3KndVkbCzdw_QuujJUtO7NBD_pVkVCu1x1LOSRNY1LRb6dBcr045H6QS3fdi9VmErCAH9H2T0ZHPvpy89AqjkF3V73g704QXBBZqzeBSrj24-fYYKyKTDQ3oXr0Cve4WoutqEj-BemR5UheMP6_X5iAdw9hhrZXv3jCBTMY87gZ3WPz-XjXfOMwO6-zqmwUTUa",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDzrL7usrA23s2Nn1NpSN3TMvTfX1FznOpEa6vmkTlsNynBBGLhD3_3OcHockhxCwTqKdjW0smYhEGpq4BXzEgxaScSri1yzxDJoLsKzmgQNN72Yk2GXNkNzqhLquBxUpm8sazw3RCF1je4tcvZzMG5iTczWOxQPY107z-g7SwJtKYV5XnJcRYGJ0KrQ4qyTKEXJbwz2uEKPR4uM3xwEbwjsxYV1VUKAu9S5SvLwjDtYnHQZ4Dkky3Mmqe0Z-HMhHOuKW96No1Lsd4-",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBg87Iff6iXTSNPoBhC7sozocy7xJsi119FpvGXxeKhAR134yY8142tVafB9UyNiKSXIlfxD6whKycEgj0I4iSEhiCJKolro2p7LlVSLyScD3tWuu_ZGj1fepsvVBl48BhlesD7WND-1Aw_iEixdISGGyZM4Y1BKZ-kRg7c9fr2zTLhmVVpV4OAAyPlySw17FscI0z1P7Bkw3-osiFw7rUWShf2E1_IqW-VOG4g8rWexgZyPTCF4Z-w9t-Q7M0nVVYfGhDUr3ortN7Q",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCdNhbT4xJKFNh_lZAib43JSQ5RxDQuALjLm-y3cS_rKaO5FQ3fxj_1H_lm3iF3ytBPNh-R009pU8jEyPN43kPrcysZhzCoTaajDRvX8fW0zApgeiLgMcfl5uVoEO7cDqusWF-axqJsoJAZkH6KZBlwCgadVN6E-KSBJgv9KyiHJbwbuSYIGMA-o2fVha50Bepb9i65nRBfoyPo63cXcFHV55tz_MpAz1T4-nXocXi7vygqelXVg58b2SBmy0P7FOUSgZS1q3cew0yZ"
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col selection:bg-accent-magenta selection:text-white">
            <Navbar />

            <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[calc(100vh-85px)]">

                {/* Left Side - Cinematic Image Viewer */}
                <section className="lg:col-span-7 xl:col-span-8 relative bg-[#0A0A0A] flex flex-col lg:h-[calc(100vh-85px)] lg:sticky lg:top-[85px] overflow-hidden group">
                    <div className="absolute top-6 left-6 lg:left-10 z-20 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.15em] opacity-70 mix-blend-difference text-white">
                        <a className="hover:text-accent-magenta transition-colors" href="/">Home</a>
                        <span className="text-slate-500">/</span>
                        <a className="hover:text-accent-magenta transition-colors" href="/collections/heritage">Heritage Collection</a>
                        <span className="text-slate-500">/</span>
                        <span className="text-accent-magenta-light">Coimbatore Series</span>
                    </div>

                    <div className="relative w-full h-[60vh] lg:h-full flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
                        {/* Sparkle & flare CSS should ideally be in globals.css, simulating inline here for completeness */}
                        <div className="absolute inset-0 pointer-events-none opacity-60" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 1px, transparent 1px), radial-gradient(circle at 30% 20%, rgba(212, 175, 53, 0.7) 2px, transparent 3px)', backgroundSize: '150px 150px' }}></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none mix-blend-screen" style={{ background: 'radial-gradient(circle, rgba(92, 19, 50, 0.2) 0%, rgba(0,0,0,0) 70%)' }}></div>

                        <div className="relative w-full h-full">
                            <img alt="Coimbatore Heritage Necklace" className="w-full h-full object-cover object-center transform transition-transform duration-[3000ms] ease-out group-hover:scale-105 cursor-crosshair opacity-95" src={activeImage} />
                            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/80 pointer-events-none"></div>
                        </div>

                        <div className="absolute bottom-8 right-8 flex flex-col gap-4 pointer-events-none">
                            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 flex items-center gap-3 text-white/90 shadow-2xl">
                                <span className="material-symbols-outlined text-lg animate-pulse text-accent-magenta-light">center_focus_strong</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Cinematic Zoom</span>
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-1/2 right-6 lg:right-8 -translate-y-1/2 z-20 flex flex-col gap-4">
                        {thumbnails.map((thumb, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveImage(thumb)}
                                className={`w-16 h-16 rounded overflow-hidden transition-all ${activeImage === thumb ? 'border border-accent-magenta shadow-[0_0_15px_rgba(92,19,50,0.4)] scale-110 opacity-100' : 'border border-white/10 opacity-60 hover:opacity-100 hover:border-accent-magenta/50 hover:scale-110'}`}
                            >
                                <img alt={`View ${index + 1}`} className="w-full h-full object-cover" src={thumb} />
                            </button>
                        ))}
                    </div>
                </section>

                {/* Right Side - Product Details */}
                <section className="lg:col-span-5 xl:col-span-4 bg-[#0A0A0A] border-l border-white/5 flex flex-col h-auto lg:h-[calc(100vh-85px)] lg:overflow-y-auto hide-scrollbar relative">
                    <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-[#2a1a20] to-transparent pointer-events-none opacity-40"></div>

                    <div className="relative p-8 lg:p-12 flex flex-col gap-10">
                        {/* Title and Price */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-start gap-4">
                                <h1 className="text-3xl lg:text-4xl font-display text-white font-medium leading-tight tracking-wide">
                                    COIMBATORE HERITAGE NECKLACE
                                </h1>
                                <button className="text-slate-400 hover:text-accent-magenta transition-colors mt-2">
                                    <span className="material-symbols-outlined">ios_share</span>
                                </button>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-baseline gap-4">
                                    <h2 className="text-3xl font-light text-primary font-display tracking-wide">₹ 4,50,000</h2>
                                    <span className="text-slate-500 text-sm font-light line-through decoration-slate-600/50">₹ 5,10,000</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-accent-magenta/40 bg-accent-magenta/10 shadow-[0_0_10px_rgba(92,19,50,0.2)]">
                                        <span className="material-symbols-outlined text-accent-magenta-light text-sm">verified</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent-magenta-light">IGI Certified Diamond</span>
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-white/10 bg-white/5">
                                        <span className="material-symbols-outlined text-slate-300 text-sm">workspace_premium</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">916 Hallmark Gold</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-accent-magenta/30 to-transparent w-full"></div>

                        {/* Description */}
                        <div>
                            <p className="text-slate-300 font-light leading-relaxed text-sm tracking-wide">
                                An ode to the timeless artistry of the Kongu region. This heritage piece features intricate filigree work in 22K gold, accentuated by VVS1 diamonds that capture the essence of divine radiance. A heirloom crafted not just for today, but for generations.
                            </p>
                        </div>

                        {/* Variants */}
                        <div className="space-y-8 bg-white/5 p-6 rounded-2xl border border-white/5 backdrop-blur-sm relative overflow-hidden">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-accent-magenta/20 blur-[60px] rounded-full pointer-events-none"></div>

                            <div>
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Select Metal Variant</span>
                                <div className="grid grid-cols-3 gap-3">
                                    <label className="cursor-pointer group relative">
                                        <input defaultChecked className="peer sr-only" name="metal" type="radio" />
                                        <div className="absolute inset-0 border border-primary opacity-0 peer-checked:opacity-100 rounded-lg transition-opacity pointer-events-none shadow-[0_0_10px_rgba(212,175,53,0.3)]"></div>
                                        <div className="bg-surface-dark border border-white/10 rounded-lg p-3 flex flex-col items-center gap-2 hover:bg-white/5 transition-colors peer-checked:bg-[#201d12]">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] shadow-inner"></div>
                                            <span className="text-[10px] text-slate-300 font-medium">22K Gold</span>
                                        </div>
                                    </label>
                                    <label className="cursor-pointer group relative">
                                        <input className="peer sr-only" name="metal" type="radio" />
                                        <div className="absolute inset-0 border border-primary opacity-0 peer-checked:opacity-100 rounded-lg transition-opacity pointer-events-none"></div>
                                        <div className="bg-surface-dark border border-white/10 rounded-lg p-3 flex flex-col items-center gap-2 hover:bg-white/5 transition-colors peer-checked:bg-[#201d12]">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E6BE8A] to-[#C27A4D] shadow-inner"></div>
                                            <span className="text-[10px] text-slate-300 font-medium">18K Rose</span>
                                        </div>
                                    </label>
                                    <label className="cursor-pointer group relative">
                                        <input className="peer sr-only" name="metal" type="radio" />
                                        <div className="absolute inset-0 border border-primary opacity-0 peer-checked:opacity-100 rounded-lg transition-opacity pointer-events-none"></div>
                                        <div className="bg-surface-dark border border-white/10 rounded-lg p-3 flex flex-col items-center gap-2 hover:bg-white/5 transition-colors peer-checked:bg-[#201d12]">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E0E0E0] to-[#A9A9A9] shadow-inner"></div>
                                            <span className="text-[10px] text-slate-300 font-medium">Pure Silver</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Chain Length</span>
                                    <button className="text-[10px] uppercase tracking-wider text-accent-magenta-light hover:text-white transition-colors border-b border-accent-magenta/30 pb-0.5">Size Guide</button>
                                </div>
                                <div className="relative">
                                    <select className="w-full appearance-none bg-black/40 text-white border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-magenta transition-colors cursor-pointer text-sm font-light">
                                        <option>Standard (16 inches)</option>
                                        <option>Princess (18 inches)</option>
                                        <option>Matinee (20 inches)</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-sm">expand_more</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-1 gap-4">
                            <button className="w-full bg-gradient-to-br from-[#d4af35] via-[#f3d87e] to-[#d4af35] text-black font-bold text-sm tracking-widest uppercase py-4 rounded-lg flex items-center justify-center gap-3 transition-all hover:brightness-110 shadow-[0_0_25px_rgba(212,175,53,0.4)]">
                                {/* Use an icon instead of external Whatsapp logo image to avoid broken link issues, but we'll try to use the raw asset if possible */}
                                <span className="material-symbols-outlined">chat</span>
                                Enquire on WhatsApp
                            </button>
                            <div className="grid grid-cols-5 gap-4">
                                <button className="col-span-4 bg-transparent border border-white/20 hover:border-accent-magenta hover:bg-accent-magenta/10 hover:shadow-[0_0_15px_rgba(92,19,50,0.3)] text-white font-bold text-sm tracking-widest uppercase py-4 rounded-lg flex items-center justify-center gap-3 transition-all">
                                    <span className="material-symbols-outlined">shopping_bag</span>
                                    Add to Bag
                                </button>
                                <button className="col-span-1 bg-transparent border border-white/20 hover:border-accent-magenta hover:text-accent-magenta text-white py-4 rounded-lg flex items-center justify-center transition-all">
                                    <span className="material-symbols-outlined">favorite</span>
                                </button>
                            </div>
                            <div className="flex items-center justify-center gap-6 pt-2 opacity-60">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xs text-accent-magenta">local_shipping</span>
                                    <span className="text-[10px] text-slate-300 uppercase tracking-wider">Insured Shipping</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xs text-accent-magenta">shield</span>
                                    <span className="text-[10px] text-slate-300 uppercase tracking-wider">Lifetime Warranty</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-accent-magenta/30 to-transparent w-full"></div>

                        {/* Complete The Look */}
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-6 font-display flex items-center gap-3">
                                <span className="w-8 h-px bg-accent-magenta"></span>
                                Complete The Look
                            </h3>
                            <p className="text-xs text-slate-400 mb-4 -mt-3">Matching <span className="text-accent-magenta-light">Vadavalli Bridal</span> Accessories</p>

                            <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x">
                                {/* Item 1 */}
                                <div className="min-w-[160px] group cursor-pointer snap-start">
                                    <div className="aspect-[4/5] bg-surface-dark border border-white/5 rounded-lg overflow-hidden mb-3 relative">
                                        <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYIDSQiGPOgJ4Gju1L-t-LNdI3lZRZNBCoJkDRHPXxFwy-VhHOigy-hcY-FPQdleh2vI7uez3EvGt8fa3wzGpayMx6BmAFAMe3y37U0DE2dRDLV_I5qVlo6bDSwhfCgTV103e-Xlc-mwjudM854wGbslkMpjrBnRCG_4smT2VANGaUtwiE1VGzJjIbX-8mndloH-jegF2A_hOcPvXouHPcXq3jaBzWYEraJbR1ftYDPde0Y7ni-RQCRZePKUPilhSn_zT-O2oG90V5" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                    </div>
                                    <p className="text-xs text-white font-bold uppercase tracking-wide truncate">Vadavalli Jhumkas</p>
                                    <p className="text-[11px] text-primary mt-1">₹ 85,000</p>
                                </div>
                                {/* Item 2 */}
                                <div className="min-w-[160px] group cursor-pointer snap-start">
                                    <div className="aspect-[4/5] bg-surface-dark border border-white/5 rounded-lg overflow-hidden mb-3 relative">
                                        <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWlcXDDkYIyJNK473Is99d1wbfWbzuTFSQF1k3pn7RtjsBEYpgCKbFIPJtnYKshI5mF10ZqlsJdPqOy95gfcfOC_3JAlWGbII4zEgIKbM2ayFY6dUqweugjTp2GBW2mL2i4Sbs3wayuPxIwzt7ESat34xqCV6LdxMRAgjKReQsk3_6r-QQSiBDnUgGIQifK_wdyi6b2OChJnhroLoN5nxhFg2tQH0w-IGJAAzSr70nIJT6gN9We5fe0So5pxPYzE8AOY1WF36DK_Xq" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                    </div>
                                    <p className="text-xs text-white font-bold uppercase tracking-wide truncate">Vadavalli Bangle</p>
                                    <p className="text-[11px] text-primary mt-1">₹ 1,20,000</p>
                                </div>
                                {/* Item 3 */}
                                <div className="min-w-[160px] group cursor-pointer snap-start">
                                    <div className="aspect-[4/5] bg-surface-dark border border-white/5 rounded-lg overflow-hidden mb-3 relative">
                                        <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkKWwo6Q5tQVOz8861JRJzdxsvYwEnmffrcEMwuFSUoeRdvJTGL35yHYyzsqyRY9c1aIQ-7H2LRJtIaeFu8JuG5M5c1V55DDAnMgn_4NTWbM4GNNyVf0cQaffa17wMNJfytPgvmga5xQ84xCfDmnTQHu4FeYO23y4w0dtqApixDFkkqAZRKh5cSe1I_tWOwcnN4vRwumn00kKrVduujqmbxD_hydzb3foGPIzi8mWwjYdwLTZmU8uJAXy0Jn3LwaVcM9tmc8ucSeu9" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                    </div>
                                    <p className="text-xs text-white font-bold uppercase tracking-wide truncate">Heritage Ring</p>
                                    <p className="text-[11px] text-primary mt-1">₹ 55,000</p>
                                </div>
                            </div>
                        </div>

                        {/* Premium Plan Banner */}
                        <div className="mt-8 bg-gradient-to-br from-[#2a0e1a] to-[#0A0A0A] rounded-xl border border-accent-magenta/20 p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-magenta/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-bold text-accent-magenta-light uppercase tracking-[0.2em]">Premium Plan</span>
                                    <div className="w-8 h-8 rounded-full border border-accent-magenta/50 flex items-center justify-center text-accent-magenta">
                                        <span className="material-symbols-outlined text-sm">diamond</span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-display text-white mb-1">WEEKLY SAVINGS</h3>
                                <p className="text-xs text-slate-400 mb-6">Join our exclusive gold scheme for wastage-free purchase.</p>
                                <div className="flex items-end justify-between">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-magenta/40"></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-magenta/40"></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-magenta/40"></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-magenta/40"></span>
                                    </div>
                                    <button className="bg-gradient-to-br from-[#d4af35] to-[#f3d87e] hover:brightness-110 text-black text-xs font-bold uppercase tracking-wider px-6 py-2 rounded shadow-[0_0_15px_rgba(212,175,53,0.3)] transition-all">
                                        Join Now
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </main>
        </div>
    );
}
