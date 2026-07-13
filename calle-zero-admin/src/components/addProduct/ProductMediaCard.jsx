import React from "react";
import { Upload, Maximize2, X } from "lucide-react";
import SectionCard from "../shared/SectionCard";

const MAX_SIZE_MB = 5;

const ProductMediaCard = ({
    previews = [null, null, null, null],
    onImageChange,
    maxImages = 4,
    error,
}) => {
    const handleFileSelect = (index, event) => {
        const file = event.target.files?.[0];
        event.target.value = ""; // permite volver a seleccionar el mismo archivo

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Por favor selecciona un archivo de imagen válido");
            return;
        }

        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            alert(`La imagen no debe pesar más de ${MAX_SIZE_MB}MB`);
            return;
        }

        onImageChange(index, file);
    };

    const handleRemoveImage = (index, e) => {
        e.preventDefault();
        onImageChange(index, null);
    };

    return (
        <SectionCard className="p-5">
            <h3 className="flex items-center gap-3 font-[Montserrat] text-[20px] font-extrabold text-white">
                <Maximize2 size={18} className="text-white/25" />
                Multimedia
            </h3>

            <p className="mt-1 font-[Open_Sans] text-[12px] text-white/60">
                Agrega hasta {maxImages} imágenes. La primera será la principal.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
                {Array.from({ length: maxImages }).map((_, index) => {
                    const preview = previews[index];

                    return (
                        <label
                            key={index}
                            className="relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-[12px] border border-dashed border-white/20 bg-[#20252F] p-3 text-center transition hover:border-white/40 hover:bg-[#262B35]"
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileSelect(index, e)}
                                className="hidden"
                            />

                            {preview ? (
                                <>
                                    <img
                                        src={preview}
                                        alt={`Producto ${index + 1}`}
                                        className="h-full w-full rounded-lg object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => handleRemoveImage(index, e)}
                                        className="absolute right-2 top-2 rounded-full bg-red-600 p-1 hover:bg-red-700"
                                    >
                                        <X size={14} className="text-white" />
                                    </button>
                                    {index === 0 && (
                                        <span className="absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                            Principal
                                        </span>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/25">
                                        <Upload size={18} />
                                    </div>

                                    <p className="mt-2 font-[Open_Sans] text-[11px] font-bold leading-4 text-white">
                                        Imagen {index + 1}
                                    </p>

                                    <p className="mt-1 font-[Open_Sans] text-[10px] leading-4 text-white/50">
                                        PNG, JPG o WEBP
                                    </p>
                                </>
                            )}
                        </label>
                    );
                })}
            </div>

            {error && (
                <p className="mt-3 font-[Open_Sans] text-[12px] text-red-400">
                    {error}
                </p>
            )}
        </SectionCard>
    );
};

export default ProductMediaCard;