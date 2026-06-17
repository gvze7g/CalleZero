import React from "react";

const AuthFooter = () => {
  return (
    <footer className="flex min-h-[72px] flex-col justify-center gap-4 border-t border-[#1A1930] px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">
      <p className="text-center md:text-left font-[Open_Sans] text-[13px] md:text-[14px] text-white/70">
        © 2026 Calle Zero - El Salvador. Todos los derechos reservados.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 font-[Open_Sans] text-[13px] md:text-[14px] text-white/80">
        <a href="#" className="transition hover:text-white">
          Términos
        </a>
        <a href="#" className="transition hover:text-white">
          Privacidad
        </a>
        <span className="text-white/20">v1.0.0</span>
      </div>
    </footer>
  );
};

export default AuthFooter;