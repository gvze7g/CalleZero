import React from "react";
import { Box } from "lucide-react";
import { toast } from "sonner";
import SectionCard from "../shared/SectionCard";

const OrdersSupportCard = () => {
  return (
    <SectionCard className="p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-white/25">
            <Box size={24} />
          </div>

          <div>
            <h3 className="font-[Montserrat] text-[18px] font-extrabold text-white">
              ¿Necesitas ayuda con un pedido?
            </h3>
            <p className="mt-2 max-w-[760px] font-[Open_Sans] text-[14px] leading-6 text-white/72">
              Si un cliente reporta un problema con su entrega en San Salvador,
              puedes contactar directamente al equipo de logística urbana desde
              el centro de soporte.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            toast.info("Cómo atender un pedido", {
              description: "Cambia el estado del pedido en la tabla. El cliente recibe una notificación automática en la app y en la tienda.",
            })
          }
          className="rounded-[10px] border border-white/10 bg-black px-5 py-3 font-[Open_Sans] text-[14px] font-bold text-white hover:bg-white/5"
        >
          Contactar Soporte
        </button>
      </div>
    </SectionCard>
  );
};

export default OrdersSupportCard;