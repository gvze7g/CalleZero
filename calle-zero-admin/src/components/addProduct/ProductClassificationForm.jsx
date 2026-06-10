import React from "react";
import { Layers } from "lucide-react";
import SectionCard from "../shared/SectionCard";

const sizes = ["S", "M", "L", "XL", "XXL"];

const ProductClassificationForm = ({
    formData,
    onChange,
    selectedSize,
    onSelectSize,
    categories,
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

                <div className="mt-3 flex flex-wrap gap-3">
                    {sizes.map((size) => (
                        <button
                            type="button"
                            key={size}
                            onClick={() => onSelectSize(size)}
                            className={`h-11 min-w-11 rounded-[8px] border border-white/10 px-4 font-[Open_Sans] text-[14px] font-bold ${
                                selectedSize === size
                                    ? "bg-[#6F6A68] text-white"
                                    : "bg-black text-white"
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>

                <p className="mt-4 font-[Open_Sans] text-[11px] font-bold uppercase tracking-[0.12em] text-white/55">
                    Talla seleccionada por defecto: {selectedSize}
                </p>
            </div>
        </SectionCard>
    );
};

export default ProductClassificationForm;