import React from "react";
import { X } from "lucide-react";

const Modal = ({ title, children, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="w-full max-w-[520px] rounded-[16px] border border-white/10 bg-[#1A1F2B] shadow-[0_20px_70px_rgba(0,0,0,0.55)]">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                    <h3 className="font-[Montserrat] text-[20px] font-extrabold text-white">
                        {title}
                    </h3>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-white/60 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="max-h-[75vh] overflow-y-auto p-5">{children}</div>
            </div>
        </div>
    );
};

export default Modal;