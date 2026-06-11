import React, { useState } from "react";
import { Upload, Maximize2, X } from "lucide-react";
import SectionCard from "../shared/SectionCard";

const ProductMediaCard = ({ onImageChange }) => {
    const [preview, setPreview] = useState(null);
    const [fileName, setFileName] = useState("");

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        // Validar que sea imagen
        if (!file.type.startsWith("image/")) {
            alert("Por favor selecciona un archivo de imagen válido");
            return;
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("La imagen no debe pesar más de 5MB");
            return;
        }

        setPreview(URL.createObjectURL(file));
        setFileName(file.name);
        // Pasar el archivo al padre
        onImageChange(file);
    };

    const handleRemoveImage = () => {
        setPreview(null);
        setFileName("");
        onImageChange(null);
    };

    return (
        <SectionCard className="p-5">
            <h3 className="flex items-center gap-3 font-[Montserrat] text-[20px] font-extrabold text-white">
                <Maximize2 size={18} className="text-white/25" />
                Multimedia
            </h3>

            <label className="mt-5 flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-[12px] border border-dashed border-white/20 bg-[#20252F] p-5 text-center transition hover:border-white/40 hover:bg-[#262B35]">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />

                {preview ? (
                    <div className="relative w-full">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-h-[220px] w-full rounded-lg object-contain"
                        />
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                handleRemoveImage();
                            }}
                            className="absolute right-2 top-2 rounded-full bg-red-600 p-1 hover:bg-red-700"
                        >
                            <X size={16} className="text-white" />
                        </button>
                        <p className="mt-3 break-all text-xs text-white/60">
                            {fileName}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-white/25">
                            <Upload size={28} />
                        </div>

                        <p className="mt-5 font-[Open_Sans] text-[14px] font-bold text-white">
                            Haga clic para subir o arrastre la imagen
                        </p>

                        <p className="mt-3 font-[Open_Sans] text-[12px] leading-5 text-white/60">
                            PNG, JPG o WEBP Recomendado: 1000x1000px
                        </p>
                    </>
                )}
            </label>
        </SectionCard>
    );
};

export default ProductMediaCard;