import React from "react";
import { Layers } from "lucide-react";
import SectionCard from "../shared/SectionCard";

const ProductClassificationForm = ({
    formData,
    onChange,
    selectedSizes,
    onToggleSize,
    availableSizes,
    categories,
    errors = {},
}) => {
    return (
        <SectionCard className="p-5">
            <h3 className="flex items-center gap-3 font-[Montserrat] text-[20px] font-extrabold text-white">
                <Layers size={20} className="text-white/25" />
                Clasificación
            </h3>

            <p className="mt-2 font-[Open_Sans] text-[14px] text-white/70">
                Organice su producto por categoría y disponibilidad de tallas.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <label>
                    <span className="font-[Open_Sans] text-[14px] font-bold text-white">
                        Categoría
                    </span>

                    <select
                        value={formData.categoryId}
                        onChange={(event) =>
                            onChange("categoryId", event.target.value)
                        }
                        className="mt-2 h-[42px] w-full rounded-[8px] border border-white/10 bg-black px-4 font-[Open_Sans] text-white outline-none"
                    >
                        <option value="">
                            Seleccione una categoría
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category._id}
                                value={category._id}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>

                    {errors.categoryId && (
                        <p className="mt-1.5 text-xs text-red-400">
                            {errors.categoryId}
                        </p>
                    )}
                </label>

                <label>
                    <span className="font-[Open_Sans] text-[14px] font-bold text-white">
                        SKU (Opcional)
                    </span>

                    <input
                        value={formData.sku}
                        onChange={(event) =>
                            onChange("sku", event.target.value)
                        }
                        className="mt-2 h-[42px] w-full rounded-[8px] border border-white/10 bg-black px-4 font-[Open_Sans] text-white outline-none"
                        placeholder="CZ-001"
                    />
                </label>
            </div>

            <div className="mt-5">
                <p className="font-[Open_Sans] text-[14px] font-bold text-white">
                    Tallas Disponibles
                </p>

                <p className="mt-1 font-[Open_Sans] text-[12px] text-white/55">
                    Selecciona todas las tallas en las que se ofrece este producto.
                </p>

                <div className="mt-3 flex flex-wrap gap-3">
                    {availableSizes.map((size) => {
                        const isSelected = selectedSizes.includes(size);

                        return (
                            <button
                                type="button"
                                key={size}
                                onClick={() => onToggleSize(size)}
                                aria-pressed={isSelected}
                                className={`h-11 min-w-11 rounded-[8px] border px-4 font-[Open_Sans] text-[14px] font-bold transition ${
                                    isSelected
                                        ? "border-[#6F6A68] bg-[#6F6A68] text-white"
                                        : "border-white/10 bg-black text-white hover:border-white/25"
                                }`}
                            >
                                {size}
                            </button>
                        );
                    })}
                </div>

                {errors.size ? (
                    <p className="mt-3 text-xs text-red-400">{errors.size}</p>
                ) : (
                    <p className="mt-4 font-[Open_Sans] text-[11px] font-bold uppercase tracking-[0.12em] text-white/55">
                        {selectedSizes.length > 0
                            ? `Tallas seleccionadas: ${selectedSizes.join(", ")}`
                            : "Ninguna talla seleccionada"}
                    </p>
                )}
            </div>
        </SectionCard>
    );
};

export default ProductClassificationForm;