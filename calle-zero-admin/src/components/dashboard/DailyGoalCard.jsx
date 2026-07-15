import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import SectionCard from "../shared/SectionCard";

const DailyGoalCard = ({ salesToday = 0, goal = 0, percentage = 0 }) => {
  const reached = percentage >= 100;

  return (
    <SectionCard className="relative overflow-hidden bg-[#1E1D1C] p-4 sm:p-5">
      <div className="absolute right-4 top-4 text-white/10">
        {reached ? (
          <TrendingUp size={54} strokeWidth={1.5} />
        ) : (
          <TrendingDown size={54} strokeWidth={1.5} />
        )}
      </div>

      <p className="font-[Open_Sans] text-[13px] font-bold uppercase tracking-[0.06em] text-white/20">
        LOGRO DEL DÍA
      </p>

      <h3 className="mt-3 pr-12 font-[Montserrat] text-[18px] font-extrabold text-white">
        {reached ? "Meta de ventas superada" : "Meta de ventas del día"}
      </h3>

      <p className="mt-3 max-w-[280px] font-[Open_Sans] text-[14px] leading-6 text-white/78">
        Llevas ${salesToday.toFixed(2)} de ${goal.toFixed(2)} ({percentage}% de tu objetivo diario).
      </p>
    </SectionCard>
  );
};

export default DailyGoalCard;