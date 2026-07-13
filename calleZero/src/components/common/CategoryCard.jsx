import React from "react";
import { ArrowUpRight } from "lucide-react";

const gradients = [
    "from-purple-600/40 via-purple-900/20 to-black",
    "from-fuchsia-600/40 via-fuchsia-900/20 to-black",
    "from-indigo-600/40 via-indigo-900/20 to-black",
    "from-violet-600/40 via-violet-900/20 to-black",
];

const hashToIndex = (str = "") => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % gradients.length;
};

const CategoryCard = ({ name, items, tag, image, onClick, compact = false }) => {
    const gradient = gradients[hashToIndex(name)];
    const initial = name?.charAt(0)?.toUpperCase();

    if (compact) {
    return (
        <article
            onClick={onClick}
            className={`group relative flex aspect-3/4 cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-linear-to-br ${gradient} p-5 transition hover:scale-[1.03] hover:border-purple-500/50`}
        >
            {/* Letra gigante centrada de fondo */}
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
                <span className="font-[Montserrat] text-[9rem] font-black leading-none text-white/5 transition group-hover:text-white/10 md:text-[10rem]">
                    {initial}
                </span>
            </div>

            <div className="relative z-10 flex justify-end">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition group-hover:bg-purple-500 group-hover:text-black">
                    <ArrowUpRight size={16} />
                </span>
            </div>

            <div className="relative z-10">
                <h3 className="font-[Montserrat] text-xl font-black leading-tight text-white md:text-2xl">
                    {name}
                </h3>

                <button className="mt-3 flex items-center gap-1 font-[Montserrat] text-xs font-semibold text-purple-300 transition group-hover:text-purple-400">
                    Ver Colección
                </button>
            </div>
        </article>
    );
    }

    return (
    <article
        onClick={onClick}
        className="group relative cursor-pointer overflow-hidden rounded-2xl"
    >
        {image ? (
            <img
                src={image}
                alt={name}
                className="h-[340px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[380px] md:h-[420px] lg:h-[480px]"
            />
        ) : (
            <div className={`flex h-[340px] items-center justify-center bg-linear-to-br ${gradient} transition duration-500 group-hover:scale-105 sm:h-[380px] md:h-[420px] lg:h-[480px]`}>
                <span className="font-[Montserrat] text-[10rem] font-black text-white/10">
                    {initial}
                </span>
            </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent" />

        {tag && (
            <span className="absolute right-4 top-4 rounded-full bg-purple-500 px-3 py-1 font-[Montserrat] text-xs text-black">
                {tag}
            </span>
        )}

        <div className="absolute bottom-5 left-5 right-5">
            {items != null && (
                <p className="mb-1 font-[Open_Sans] text-xs text-gray-400">
                    {items} ITEMS
                </p>
            )}
            <h3 className="font-[Montserrat] text-lg font-bold text-white sm:text-xl md:text-2xl">
                {name}
            </h3>
            <button className="mt-3 flex items-center gap-2 font-[Montserrat] text-sm text-white transition group-hover:text-purple-400">
                Ver todo →
            </button>
        </div>
    </article>
);
};

export default CategoryCard;