"use client";

interface ProductCardProps {
    title: string;
    category: string;
    imageSrc: string;
    badge?: string;
    isFirst?: boolean;
}

export default function ProductCard({ title, category, imageSrc, badge, isFirst }: ProductCardProps) {
    return (
        <div className={`group magnetic-lift ${isFirst ? '' : 'lg:mt-16'}`}>
            <div className="glass-magenta rounded-none border-0 overflow-hidden relative">
                {badge && (
                    <div className={`absolute top-4 left-4 z-20 ${badge === 'Best Seller' ? 'bg-accent-magenta text-white' : 'bg-white text-accent-magenta-dark'} text-[10px] font-bold uppercase tracking-widest px-3 py-1 shadow-[0_0_10px_rgba(80,18,55,0.5)]`}>
                        {badge}
                    </div>
                )}
                <div className="aspect-[4/5] overflow-hidden relative bg-black/40">
                    <img
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                        src={imageSrc}
                    />
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out skew-y-12 origin-bottom-left"></div>
                </div>
                <div className="p-8 text-center relative bg-gradient-to-b from-transparent to-accent-magenta-dark/20">
                    <h3 className="font-display text-xl text-white mb-2">{title}</h3>
                    <p className="text-accent-magenta-light text-sm tracking-wide font-light">{category}</p>
                    <button className="mt-6 border border-accent-magenta/40 text-white text-xs uppercase tracking-[0.2em] py-3 px-8 hover:bg-accent-magenta hover:border-accent-magenta hover:text-white transition-all w-full shadow-[0_0_15px_rgba(80,18,55,0)] hover:shadow-[0_0_15px_rgba(80,18,55,0.4)]">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}
