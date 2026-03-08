import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CollectionsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-[#201d12]">
            <Navbar />

            {/* Hero Section */}
            <div className="relative w-full h-[300px] bg-cover bg-center overflow-hidden flex items-center justify-center pt-20" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAGTP9-Aej8bwfeEB-VAJgrulpVHS00bdpI5ezR8Y9MfgZ6PjMZ4E07HjnQ16LR2RvC_jrpHFxz2tUt0LE3bbGw7SSaT_6MweINLs4CyHY0H-Lts2-aiTIEWPqnE13IDyxtmpAD6ZHOXQ9Kpq_h0MJPWdFHgcA0ezXGxn17E0dM629sEUK6WK-4lxlt6_4O9cgKiFBQXzUp5qMnreMYp323a9nv5M5cf1PnkLOxTtlh4qZuL3eZI_fA-eTcB1fuD0nlwX7KzZ_WVNBj")' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#201d12] via-transparent to-transparent"></div>
                <div className="text-center z-10 px-4">
                    <span className="text-primary text-sm tracking-[0.2em] uppercase mb-4 block font-medium">Exclusive 2024</span>
                    <h1 className="text-4xl md:text-6xl font-display text-white mb-4 tracking-tight drop-shadow-md">The Royal Bridal Collection</h1>
                    <p className="text-slate-300 max-w-xl mx-auto font-light text-sm md:text-base">Handcrafted masterpieces designed for the modern queen. Experience the purity of 916 Hallmark Gold.</p>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-grow w-full px-4 md:px-10 lg:px-20 py-10 max-w-[1600px] mx-auto bg-[#201d12]">
                {/* Breadcrumbs & Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <a className="hover:text-primary transition-colors" href="/">Home</a>
                        <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                        <a className="hover:text-primary transition-colors" href="/collections">Shop</a>
                        <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                        <span className="text-primary">Bridal Collection</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-slate-400 text-sm hidden md:inline-block">Showing 24 of 108 products</span>
                        <div className="relative group">
                            <button className="flex items-center gap-2 bg-[#2a261a] border border-[#433d28] rounded-full px-4 py-2 text-sm text-white hover:border-primary transition-colors">
                                <span>Sort by: Recommended</span>
                                <span className="material-symbols-outlined text-[16px]">expand_more</span>
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-[#2a261a] border border-[#433d28] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                                <a className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-primary" href="#">Price: Low to High</a>
                                <a className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-primary" href="#">Price: High to Low</a>
                                <a className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-primary" href="#">Newest First</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-72 flex-shrink-0 space-y-8">
                        <button className="lg:hidden w-full flex items-center justify-between bg-[#2a261a] border border-[#433d28] p-4 rounded-xl text-white mb-4">
                            <span className="font-medium">Filters</span>
                            <span className="material-symbols-outlined">filter_list</span>
                        </button>

                        <div className="hidden lg:block bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-8 sticky top-28">
                            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                <h3 className="text-lg font-display text-white font-medium">Refine Selection</h3>
                                <button className="text-xs text-primary hover:underline">Clear All</button>
                            </div>

                            {/* Material Filter */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Material</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input type="checkbox" className="peer appearance-none size-4 border border-slate-500 rounded bg-transparent checked:bg-primary checked:border-primary transition-all" />
                                            <span className="absolute text-[#201d12] opacity-0 peer-checked:opacity-100 pointer-events-none material-symbols-outlined text-[14px] left-[1px]">check</span>
                                        </div>
                                        <span className="text-sm text-slate-400 group-hover:text-primary transition-colors">22K Gold</span>
                                        <span className="ml-auto text-xs text-slate-600">(45)</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input type="checkbox" className="peer appearance-none size-4 border border-slate-500 rounded bg-transparent checked:bg-primary checked:border-primary transition-all" />
                                            <span className="absolute text-[#201d12] opacity-0 peer-checked:opacity-100 pointer-events-none material-symbols-outlined text-[14px] left-[1px]">check</span>
                                        </div>
                                        <span className="text-sm text-slate-400 group-hover:text-primary transition-colors">18K Rose Gold</span>
                                        <span className="ml-auto text-xs text-slate-600">(21)</span>
                                    </label>
                                </div>
                            </div>

                            {/* Collection Filter */}
                            <div className="space-y-3 pt-4 border-t border-white/10">
                                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Collection</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input type="checkbox" className="peer appearance-none size-4 border border-slate-500 rounded bg-transparent checked:bg-primary checked:border-primary transition-all" />
                                            <span className="absolute text-[#201d12] opacity-0 peer-checked:opacity-100 pointer-events-none material-symbols-outlined text-[14px] left-[1px]">check</span>
                                        </div>
                                        <span className="text-sm text-slate-400 group-hover:text-primary transition-colors">Temple Jewellery</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input defaultChecked type="checkbox" className="peer appearance-none size-4 border border-slate-500 rounded bg-transparent checked:bg-primary checked:border-primary transition-all" />
                                            <span className="absolute text-[#201d12] opacity-0 peer-checked:opacity-100 pointer-events-none material-symbols-outlined text-[14px] left-[1px]">check</span>
                                        </div>
                                        <span className="text-sm text-slate-400 group-hover:text-primary transition-colors">Bridal Sets</span>
                                    </label>
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Price Range</h4>
                                <div className="px-1">
                                    <div className="h-1 bg-white/20 rounded-full relative">
                                        <div className="absolute left-1/4 right-1/4 top-0 bottom-0 bg-primary rounded-full"></div>
                                        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 size-3 bg-white rounded-full cursor-pointer hover:scale-125 transition-transform shadow-[0_0_10px_rgba(212,175,53,0.5)]"></div>
                                        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 size-3 bg-white rounded-full cursor-pointer hover:scale-125 transition-transform shadow-[0_0_10px_rgba(212,175,53,0.5)]"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                                    <span>₹50k</span>
                                    <span>₹5L</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Product Card 1 */}
                            <div className="group relative bg-transparent flex flex-col cursor-pointer">
                                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg bg-[#2a261a] mb-4">
                                    <img alt="Antique gold temple necklace" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-fbbNVsP1AaRHnZm2zXYWEq8l0aoQFCQYnIFQCo9w-g6f7W1pPNW3spk7v_z2HSAfLXCnzpKyznTJ3SVr8ir099PWfnHyVnyTMGAFg2rhJzyEskcWWDAJ853Jrp1YQ7a6vEHRzysgKZOsM_3nJ9eZ7-0VcmGfVl-v-9qPDoHxhE4Bfx0WvNiiylqN7xxjPb36EHRxJiU-GP-LluNQbnP-3GEHjyvHE6BbdNtoYVAYleUDPCX1_J60pPlAl_QfH1mo4a837ern_Ydd" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                                    <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm border border-white/10 px-2 py-1 rounded text-[10px] text-white uppercase tracking-wider">New Arrival</div>
                                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <button className="w-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white py-3 rounded-full text-sm font-medium tracking-wide flex items-center justify-center gap-2 shadow-lg">
                                            <span className="material-symbols-outlined text-[18px]">visibility</span> Quick View
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-display text-white group-hover:text-primary transition-colors">Lakshmi Temple Necklace</h3>
                                        <div className="flex items-center gap-1 text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                                            <span className="material-symbols-outlined text-[14px]">verified</span><span className="text-[10px] font-bold">916</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-500">
                                        <span>Gross: 48.5g</span><span className="size-1 bg-slate-700 rounded-full"></span><span>Net: 45.2g</span>
                                    </div>
                                    <div className="pt-2 flex items-center justify-between">
                                        <span className="text-primary text-lg font-medium">₹ 3,45,000</span>
                                        <button className="text-white hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">add_shopping_cart</span></button>
                                    </div>
                                </div>
                            </div>

                            {/* Product Card 2 */}
                            <div className="group relative bg-transparent flex flex-col cursor-pointer">
                                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg bg-[#2a261a] mb-4">
                                    <img alt="Diamond choker" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYAheP_OHJBQYuIBQ-4KKG3qsc5MxirFQwWMtodLbuuvWlRBO7aHsYwgc1JD2eD4RjIwRjPifOnvm2l0mdAGSy6PiCdvGmWWKX5WLmKrDIa9RW0PCxCNkhgOYHMXibA5nhs9H7M-vBj8V9RLWL-cQfhKldcBZ-7Ap_dFPoavGzIkQY8yFH_2-OfyjM5Ios6rFB0p1LWA8dG6bq5IJh-ITKOojC__WEbqZp3ungCVFaP36VFf6Dftd7ziF88uQtY6OF0p-XDUB77b-v" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <button className="w-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white py-3 rounded-full text-sm font-medium tracking-wide flex items-center justify-center gap-2 shadow-lg">
                                            <span className="material-symbols-outlined text-[18px]">visibility</span> Quick View
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-display text-white group-hover:text-primary transition-colors">Royal Diamond Choker</h3>
                                        <div className="flex items-center gap-1 text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                                            <span className="material-symbols-outlined text-[14px]">diamond</span><span className="text-[10px] font-bold">IGI</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-500">
                                        <span>18K Rose Gold</span><span className="size-1 bg-slate-700 rounded-full"></span><span>dia: 2.4ct</span>
                                    </div>
                                    <div className="pt-2 flex items-center justify-between">
                                        <span className="text-primary text-lg font-medium">₹ 5,12,000</span>
                                        <button className="text-white hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">add_shopping_cart</span></button>
                                    </div>
                                </div>
                            </div>

                            {/* Product Card 3 */}
                            <div className="group relative bg-transparent flex flex-col cursor-pointer">
                                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg bg-[#2a261a] mb-4">
                                    <img alt="Heritage Kada" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKMq9ue4DRkB_dsoGhawlMvBs8lITdB2YW8UDCVWsneh_ZBojJA8kllI78rt-rqrVb4XapkxLyahch5KufY9iK-ouevhzdiQUXeuPJT044rgEMGiwA54U4wmjSZOFUvvqcfbpp93465kYdKxWOjUl0OFXfRYWo3ICvn3TdO1BsbvxmLRh3T2IOEyzl8bR1q1X8-E490QSVndJgAwbZ5DGk6qkCLTwQ1sFW73gRg01xOziKpV79rDw4iD5rezXJ2K8z2Zts_iL2xf6O" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                                    <div className="absolute top-3 left-3 bg-primary text-[#201d12] font-bold px-2 py-1 rounded text-[10px] uppercase tracking-wider">Best Seller</div>
                                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <button className="w-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white py-3 rounded-full text-sm font-medium tracking-wide flex items-center justify-center gap-2 shadow-lg">
                                            <span className="material-symbols-outlined text-[18px]">visibility</span> Quick View
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-display text-white group-hover:text-primary transition-colors">Heritage Kada Bangle</h3>
                                        <div className="flex items-center gap-1 text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                                            <span className="material-symbols-outlined text-[14px]">verified</span><span className="text-[10px] font-bold">916</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-500">
                                        <span>Gross: 62g</span><span className="size-1 bg-slate-700 rounded-full"></span><span>22K Pure</span>
                                    </div>
                                    <div className="pt-2 flex items-center justify-between">
                                        <span className="text-primary text-lg font-medium">₹ 4,15,000</span>
                                        <button className="text-white hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">add_shopping_cart</span></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Load More Button */}
                        <div className="flex justify-center mt-16 mb-10">
                            <button className="bg-primary hover:bg-primary/90 text-background-dark font-bold py-3 px-8 rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(212,175,53,0.3)]">
                                Load More Treasures
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
