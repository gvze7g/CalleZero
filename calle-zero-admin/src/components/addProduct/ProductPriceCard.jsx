import React from "react";
import { DollarSign } from "lucide-react";
import SectionCard from "../shared/SectionCard";

const ProductPriceCard = ({ formData, onChange, errors = {} }) => {
    const handlePriceChange = (event) => {
        let value = event.target.value;

        // Solo dígitos y un único punto decimal (sin signos, letras, etc.)
        value = value.replace(/[^0-9.]/g, "");

        // Evita más de un punto decimal
        const firstDotIndex = value.indexOf(".");
        if (firstDotIndex !== -1) {
            value =
                value.slice(0, firstDotIndex + 1) +
                value.slice(firstDotIndex + 1).replace(/\./g, "");
        }

        // Máximo 2 decimales
        if (firstDotIndex !== -1) {
            const [intPart, decimalPart] = value.split(".");
            value = `${intPart}.${decimalPart.slice(0, 2)}`;
        }

        onChange("price", value);
    };

    const handleStockChange = (event) => {
        // Solo dígitos, sin punto, sin signo negativo
        const value = event.target.value.replace(/[^0-9]/g, "");
        onChange("stock", value);
    };

    const blockInvalidKeys = (event) => {
        // Bloquea explícitamente el signo menos y la notación científica (e/E)
        if (["-", "+", "e", "E"].includes(event.key)) {
            event.preventDefault();
        }
    };

    return (
        <SectionCard className="p-5">
            <h3 className="flex items-center gap-3 font-[Montserrat] text-[20px] font-extrabold text-white">
                <DollarSign size={20} className="text-white/25" />
                Precio e Inventario
            </h3>

            <label className="mt-6 block">
                <span className="font-[Open_Sans] text-[14px] font-bold text-white">
                    Precio de Venta (USD)
                </span>
                <div className="mt-2 flex h-[42px] items-center rounded-[8px] border border-white/10 bg-black px-4">
                    <span className="font-[Open_Sans] text-white/70">$</span>
                    <input
                        value={formData.price}
                        onChange={handlePriceChange}
                        onKeyDown={blockInvalidKeys}
                        className="ml-2 w-full bg-transparent font-[Open_Sans] text-white outline-none"
                        placeholder="0.00"
                        inputMode="decimal"
                        type="text"
                    />
                </div>
                {errors.price && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.price}</p>
                )}
            </label>

            <label className="mt-5 block">
                <span className="font-[Open_Sans] text-[14px] font-bold text-white">
                    Stock Disponible
                </span>
                <div className="mt-2 flex h-[42px] items-center rounded-[8px] border border-white/10 bg-black px-4">
                    <input
                        value={formData.stock}
                        onChange={handleStockChange}
                        onKeyDown={blockInvalidKeys}
                        className="w-full bg-transparent font-[Open_Sans] text-white outline-none"
                        placeholder="0"
                        inputMode="numeric"
                        type="text"
                    />
                    <span className="font-[Open_Sans] text-[12px] text-white/50">
                        unidades
                    </span>
                </div>
                {errors.stock && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.stock}</p>
                )}
            </label>

            <div className="mt-5 flex items-center gap-3 rounded-[8px] border border-white/5 bg-[#1C2430] p-4">
                <span className="inline-flex h-[24px] items-center justify-center rounded-full border border-white/10 px-3 font-[Open_Sans] text-[12px] font-bold text-white">
                    Sugerencia
                </span>
                <p className="font-[Open_Sans] text-[12px] leading-5 text-white/70">
                    Incluye impuestos locales de El Salvador (13% IVA).
                </p>
            </div>
        </SectionCard>
    );
};

export default ProductPriceCard;