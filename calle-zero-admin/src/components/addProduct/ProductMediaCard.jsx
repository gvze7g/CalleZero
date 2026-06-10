import React, { useState } from "react";
import { Upload, Maximize2 } from "lucide-react";
import SectionCard from "../shared/SectionCard";

const ProductMediaCard = () => {
    const [preview, setPreview] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        setPreview(URL.createObjectURL(file));
    };

    return (
        <SectionCard className="p-5">
            <h3 className="flex items-center gap-3 font-[Montserrat] text-[20px] font-extrabold text-white">
                <Maximize2 size={18} className="text-white/25" />
                Multimedia
            </h3>

            <label className="mt-5 flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-[12px] border border-dashed border-white/20 bg-[#20252F] p-5 text-center transition hover:border-[#B56CFF]">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />

                {preview ? (
                    <img
                        src={preview}
                        alt="Preview"
                        className="max-h-[220px] rounded-lg object-contain"
                    />
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