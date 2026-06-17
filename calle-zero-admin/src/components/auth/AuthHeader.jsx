import React from "react";
import { HelpCircle } from "lucide-react";
import logo from "../../assets/logo-1.png";

const AuthHeader = () => {
  return (
    <header className="h-[70px] border-b border-[#1A1930] px-3 sm:px-4 md:px-8">
      <div className="flex h-full items-center justify-between overflow-hidden">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <img
            src={logo}
            alt="Calle Zero"
            className="h-8 w-8 object-contain sm:h-10 sm:w-10"
          />

          <span className="truncate font-[Montserrat] text-[13px] sm:text-[16px] md:text-[20px] font-extrabold tracking-[-0.02em] text-[#B56CFF]">
            Calle Zero Admin
          </span>
        </div>

        <button
          type="button"
          className="flex shrink-0 items-center gap-1 sm:gap-2 font-[Open_Sans] text-[12px] sm:text-[14px] font-semibold text-white/85 transition hover:text-white"
        >
          <HelpCircle size={14} strokeWidth={2.2} />

          <span className="hidden xs:inline sm:inline">
            Soporte
          </span>
        </button>
      </div>
    </header>
  );
};

export default AuthHeader;