"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function HeritageCollectionPage() {
    const [monthlyAmount, setMonthlyAmount] = useState<number>(10000);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-[#0A0A0A]">
            <Navbar />

            {/* Hero Section */}
            <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[#0A0A0A]">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-magenta/20 to-accent-magenta-dark/20 mix-blend-screen"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#0A0A0A]"></div>
                    {/* Decorative Background Elements */}
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-magenta/10 rounded-full blur-[80px]"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(212,175,53,0.2)]">
                        <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
                        pure 22k gold
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display text-white mb-6 uppercase tracking-wider drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                        Heritage <span className="text-gradient-magenta italic font-serif lowercase">Series</span>
                    </h1>
                    <p className="text-slate-300 font-light text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Discover the soul of Swamy Jewellery. A timeless collection passing down the authentic craftsmanship of South India through generations.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-grow w-full px-4 md:px-10 lg:px-20 py-16 max-w-[1600px] mx-auto z-10 relative">

                {/* Information Banner (Live Rates) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 flex items-center justify-between group hover:border-primary/50 transition-colors">
                        <div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Today's Rate</span>
                            <span className="text-2xl font-serif text-primary">₹7,250<span className="text-sm text-slate-400 font-sans font-light">/g</span></span>
                        </div>
                        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">trending_up</span>
                        </div>
                    </div>
                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 flex items-center justify-between group hover:border-accent/50 transition-colors">
                        <div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Purity Guaranteed</span>
                            <span className="text-xl font-display text-white">916 Hallmark</span>
                        </div>
                        <div className="size-12 rounded-full bg-accent/10 flex items-center justify-center text-accent-light group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">verified</span>
                        </div>
                    </div>
                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 flex items-center justify-between group hover:border-white/30 transition-colors">
                        <div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Craftsmanship</span>
                            <span className="text-xl font-display text-white">100% Handcrafted</span>
                        </div>
                        <div className="size-12 rounded-full bg-white/5 flex items-center justify-center text-white/70 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">pan_tool</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Gold Savings Calculator Widget */}
                    <div className="w-full lg:w-[400px] flex-shrink-0">
                        <div className="bg-gradient-to-br from-[#1E1E1E] to-[#0A0A0A] border border-white/10 rounded-3xl p-8 sticky top-28 shadow-2xl relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 size-40 bg-accent/20 rounded-full blur-[40px] pointer-events-none"></div>

                            <h3 className="text-2xl font-serif text-white mb-2">Swarna Samruddhi</h3>
                            <p className="text-xs text-slate-400 uppercase tracking-widest mb-8">Gold Savings Scheme</p>

                            <div className="space-y-8">
                                <div>
                                    <div className="flex justify-between items-end mb-4">
                                        <label className="text-sm text-slate-300 font-light">Monthly Investment</label>
                                        <span className="text-xl font-display text-primary font-medium">{formatCurrency(monthlyAmount)}</span>
                                    </div>

                                    {/* Custom Range Slider */}
                                    <div className="relative pt-1">
                                        <input
                                            type="range"
                                            min="2000"
                                            max="50000"
                                            step="1000"
                                            value={monthlyAmount}
                                            onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
                                            <span>₹2K</span>
                                            <span>₹50K</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-black/50 border border-white/5 rounded-2xl p-5 space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400">Duration</span>
                                        <span className="text-white font-medium">11 Months</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400">Total Investment</span>
                                        <span className="text-white font-medium">{formatCurrency(monthlyAmount * 11)}</span>
                                    </div>
                                    <div className="h-px bg-white/10 w-full"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-300">You Can Buy Gold Worth</span>
                                        <span className="text-xl font-display text-primary">{formatCurrency(monthlyAmount * 12)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-accent-light uppercase tracking-wider mt-2 bg-accent/10 p-2 rounded border border-accent/20">
                                        <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                                        <span>Benefit of 1 Month Installment Free!</span>
                                    </div>
                                </div>

                                <button className="w-full bg-primary hover:bg-primary-light text-background-dark font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,53,0.3)] hover:shadow-[0_0_30px_rgba(212,175,53,0.5)]">
                                    Start Saving Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                            <h2 className="text-2xl font-display text-white">Latest in Heritage</h2>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-slate-400">View:</span>
                                <button className="text-primary"><span className="material-symbols-outlined">grid_view</span></button>
                                <button className="text-slate-500 hover:text-white transition-colors"><span className="material-symbols-outlined">view_list</span></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">

                            {/* Product Card - Heritage 1 */}
                            <div className="group relative bg-[#121212] rounded-2xl border border-white/5 hover:border-primary/30 transition-all overflow-hidden flex flex-col cursor-pointer hover:shadow-2xl hover:shadow-primary/5">
                                <div className="relative w-full aspect-square overflow-hidden bg-black/40">
                                    <img alt="Kasumala Necklace" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-fbbNVsP1AaRHnZm2zXYWEq8l0aoQFCQYnIFQCo9w-g6f7W1pPNW3spk7v_z2HSAfLXCnzpKyznTJ3SVr8ir099PWfnHyVnyTMGAFg2rhJzyEskcWWDAJ853Jrp1YQ7a6vEHRzysgKZOsM_3nJ9eZ7-0VcmGfVl-v-9qPDoHxhE4Bfx0WvNiiylqN7xxjPb36EHRxJiU-GP-LluNQbnP-3GEHjyvHE6BbdNtoYVAYleUDPCX1_J60pPlAl_QfH1mo4a837ern_Ydd" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out opacity-90 group-hover:opacity-100" />
                                    <button className="absolute top-4 right-4 size-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-accent hover:border-accent transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">favorite</span>
                                    </button>
                                </div>
                                <div className="p-5 flex-grow flex flex-col justify-between">
                                    <div className="space-y-1 mb-4">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Necklace</p>
                                        <h3 className="text-lg font-display text-white group-hover:text-primary transition-colors line-clamp-1">Traditional Kasumala</h3>
                                        <p className="text-xs text-slate-400 font-light line-clamp-2">Exquisite coin necklace featuring Goddess Lakshmi motifs in 22K pure gold.</p>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                        <span className="text-primary text-lg font-medium">₹ 2,85,000</span>
                                        <button className="text-[11px] uppercase tracking-wider text-white border-b border-white hover:text-primary hover:border-primary transition-colors pb-0.5">Explore</button>
                                    </div>
                                </div>
                            </div>

                            {/* Product Card - Heritage 2 */}
                            <div className="group relative bg-[#121212] rounded-2xl border border-white/5 hover:border-primary/30 transition-all overflow-hidden flex flex-col cursor-pointer hover:shadow-2xl hover:shadow-primary/5">
                                <div className="relative w-full aspect-square overflow-hidden bg-black/40">
                                    <img alt="Manga Malai" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKMq9ue4DRkB_dsoGhawlMvBs8lITdB2YW8UDCVWsneh_ZBojJA8kllI78rt-rqrVb4XapkxLyahch5KufY9iK-ouevhzdiQUXeuPJT044rgEMGiwA54U4wmjSZOFUvvqcfbpp93465kYdKxWOjUl0OFXfRYWo3ICvn3TdO1BsbvxmLRh3T2IOEyzl8bR1q1X8-E490QSVndJgAwbZ5DGk6qkCLTwQ1sFW73gRg01xOziKpV79rDw4iD5rezXJ2K8z2Zts_iL2xf6O" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out opacity-90 group-hover:opacity-100" />
                                    <button className="absolute top-4 right-4 size-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-accent hover:border-accent transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">favorite</span>
                                    </button>
                                </div>
                                <div className="p-5 flex-grow flex flex-col justify-between">
                                    <div className="space-y-1 mb-4">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Bridal Set</p>
                                        <h3 className="text-lg font-display text-white group-hover:text-primary transition-colors line-clamp-1">Kempu Manga Malai</h3>
                                        <p className="text-xs text-slate-400 font-light line-clamp-2">Heavy bridal mango mala studded with authentic kemp stones.</p>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                        <span className="text-primary text-lg font-medium">₹ 6,55,000</span>
                                        <button className="text-[11px] uppercase tracking-wider text-white border-b border-white hover:text-primary hover:border-primary transition-colors pb-0.5">Explore</button>
                                    </div>
                                </div>
                            </div>

                            {/* Product Card - Heritage 3 */}
                            <div className="group relative bg-[#121212] rounded-2xl border border-white/5 hover:border-primary/30 transition-all overflow-hidden flex flex-col cursor-pointer hover:shadow-2xl hover:shadow-primary/5">
                                <div className="relative w-full aspect-square overflow-hidden bg-black/40">
                                    <img alt="Vanki" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1Fm3l5zMvS9v2rQ12fO9-1Qj0vN2n6T8hV6j1P9_sT5T7pQ9F6-M9-T4vK9r2xM5n_x2tL8zG9-H_8b9Vz5bK3p4vN2xM_8vN2T4vK9-T7pQ9F6-M9-T4vK9r2xM5n_x2tL8zG9" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out opacity-90 group-hover:opacity-100 fallback-bg" style={{ backgroundColor: '#1a1a1a' }} />
                                    <button className="absolute top-4 right-4 size-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-accent hover:border-accent transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">favorite</span>
                                    </button>
                                </div>
                                <div className="p-5 flex-grow flex flex-col justify-between">
                                    <div className="space-y-1 mb-4">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Armlet</p>
                                        <h3 className="text-lg font-display text-white group-hover:text-primary transition-colors line-clamp-1">Nagas Vanki</h3>
                                        <p className="text-xs text-slate-400 font-light line-clamp-2">Intricate Nagas work armlet with ruby drops for the classic bride.</p>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                        <span className="text-primary text-lg font-medium">₹ 1,75,000</span>
                                        <button className="text-[11px] uppercase tracking-wider text-white border-b border-white hover:text-primary hover:border-primary transition-colors pb-0.5">Explore</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

            </main>

            <Footer />
        </div>
    );
}
