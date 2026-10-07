import React from "react";
import { Type } from "lucide-react";
import SectionCard from "../shared/SectionCard";

const ProductGeneralForm = ({ formData, onChange }) => {
    return (
        <SectionCard className="p-5">
            <h3 className="flex items-center gap-3 font-[Montserrat] text-[20px] font-extrabold text-white">
                <Type size={20} className="text-white/25" />
                Información General
            </h3>

            <p className="mt-2 font-[Open_Sans] text-[14px] text-white/70">
                Nombre y descripción detallada del producto.
            </p>

            <div className="mt-6 space-y-4">
                <label className="block">
                    <span className="font-[Open_Sans] text-[14px] font-bold text-white">
                        Nombre del Producto
                    </span>
                    <input
                        value={formData.name}
                        onChange={(event) => onChange("name", event.target.value.replace(/[<>{}$\\]/g, ""))}
                        maxLength={80}
                        className="mt-2 h-[42px] w-full rounded-[8px] border border-white/10 bg-black px-4 font-[Open_Sans] text-white outline-none"
                        placeholder="Ej: Camiseta Oversize 'Urban Chaos'"
                    />
                </label>

                <label className="block">
                    <span className="font-[Open_Sans] text-[14px] font-bold text-white">
                        Descripción
                    </span>
                    <textarea
                        value={formData.description}
                        onChange={(event) => onChange("description", event.target.value.replace(/[<>{}$\\]/g, ""))}
                        maxLength={1000}
                        className="mt-2 h-[118px] w-full resize-none rounded-[8px] border border-white/10 bg-black p-4 font-[Open_Sans] text-white outline-none"
                        placeholder="Describa el material, corte y detalles del diseño..."
                    />
                </label>
            </div>
        </SectionCard>
    );
};

export default ProductGeneralForm;