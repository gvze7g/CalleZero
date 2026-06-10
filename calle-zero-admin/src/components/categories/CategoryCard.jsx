import React, { useState } from "react";
import * as Icons from "lucide-react";
import { ChevronRight, Edit3, MoreVertical, Trash2 } from "lucide-react";

const CategoryCard = ({ category, onEditCategory, onDeleteCategory }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const IconComponent = Icons.Box;

    return (
        <article className="relative rounded-[14px] border border-white/5 bg-[#1A1F2B]">
            <div className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white/5 text-white/20">
                        <IconComponent size={18} />
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="text-white/65"
                    >
                        <MoreVertical size={18} />
                    </button>
                </div>

                {isMenuOpen ? (
                    <div className="absolute right-4 top-12 z-20 w-[160px] rounded-[10px] border border-white/10 bg-[#11151D] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
                        <button
                            type="button"
                            onClick={() => {
                                onEditCategory(category);
                                setIsMenuOpen(false);
                            }}
                            className="flex w-full items-center gap-2 rounded-[8px] px-3 py-2 font-[Open_Sans] text-[13px] text-white hover:bg-white/5"
                        >
                            <Edit3 size={14} />
                            Editar
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                onDeleteCategory(category);
                                setIsMenuOpen(false);
                            }}
                            className="flex w-full items-center gap-2 rounded-[8px] px-3 py-2 font-[Open_Sans] text-[13px] text-[#FF4D73] hover:bg-white/5"
                        >
                            <Trash2 size={14} />
                            Eliminar
                        </button>
                    </div>
                ) : null}

                <h3 className="mt-8 font-[Montserrat] text-[20px] font-extrabold text-white">
                    {category.name}
                </h3>

                <p className="mt-2 min-h-[48px] font-[Open_Sans] text-[14px] leading-5 text-white/70">
                    {category.description}
                </p>

                <div className="mt-6 flex items-end justify-between">
                    <div>
                        <p className="font-[Montserrat] text-[26px] font-extrabold text-white">
                            {category.productsCount ?? 0}
                        </p>
                        <p className="font-[Open_Sans] text-[10px] font-bold uppercase text-white/55">
                            Productos
                        </p>
                    </div>

                    <span 
                        className={`rounded-full px-3 py-1 font-[Open_Sans] text-[11px] font-bold ${
                            category.isActive
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                        }`}>
                        {category.isActive ? "Activo" : "Inactivo"}
                </span>
            </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
                <p className="font-[Open_Sans] text-[11px] italic text-white/60">
                   Actualizado: {category.updatedAt ? new Date(category.updatedAt).toLocaleDateString() : "-"}
                </p>

                <button
                    type="button"
                    onClick={() => onEditCategory(category)}
                    className="flex items-center gap-1 font-[Open_Sans] text-[12px] font-bold text-white"
                >
                    Gestionar
                    <ChevronRight size={14} />
                </button>
            </div>
        </article>
    );
};

export default CategoryCard;