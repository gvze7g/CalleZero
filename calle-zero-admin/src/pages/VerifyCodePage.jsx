import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import AuthHeader from "../components/auth/AuthHeader";
import AuthFooter from "../components/auth/AuthFooter";
import { apiFetch } from "../lib/api.js";

const VerifyCodePage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          toast.error("Código expirado");
          navigate("/forgot-password");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (index, value) => {
    if (!/^[0-9A-Fa-f]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.toUpperCase();
    setCode(newCode);

    // Auto-focus siguiente
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullCode = code.join("");

    if (fullCode.length !== 6) {
      toast.error("Ingresa los 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const res = await apiFetch("/api/admin/recovery/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: fullCode }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Código verificado");
        setTimeout(() => navigate("/reset-password"), 600);
      } else {
        toast.error(data.message || "Código incorrecto");
      }
    } catch (error) {
      toast.error("Error de conexión");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-black text-white overflow-y-auto">
      <div className="flex min-h-screen w-full flex-col border border-[#0F1230]">
        <AuthHeader />

        <main className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 py-6 md:px-8">
          <div className="absolute h-[420px] w-[420px] rounded-full bg-[#5C139B]/20 blur-[120px]" />

          <div className="relative z-10 w-full max-w-[440px] rounded-[16px] border border-white/5 bg-[#171724] px-6 py-8 shadow-[0_0_120px_rgba(103,25,180,0.16),0_20px_60px_rgba(0,0,0,0.45)] md:px-10 md:py-10">
            <div className="absolute left-0 top-0 h-[3px] w-full rounded-t-[16px] bg-[#B56CFF]" />

            <div className="text-center">
              <h1 className="font-[Montserrat] text-[34px] font-extrabold leading-none tracking-[-0.04em] text-white md:text-[36px]">
                Verificar Código
              </h1>

              <p className="mx-auto mt-4 max-w-[320px] font-[Open_Sans] text-[15px] leading-6 text-white/65">
                Ingresa el código de 6 caracteres que recibiste en tu correo
              </p>
            </div>

            <form className="mt-9 space-y-6" onSubmit={handleSubmit} noValidate>
              {/* Inputs de código */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    maxLength={1}
                    className="h-[52px] w-[52px] sm:h-[56px] sm:w-[56px] rounded-[10px] border border-white/10 bg-[#0F0F0F] text-center font-[Montserrat] text-[24px] sm:text-[28px] font-extrabold text-[#B56CFF] outline-none transition focus:border-[#B56CFF] focus:bg-[#2D2140]"
                  />
                ))}
              </div>

              {/* Timer */}
              <div className="text-center">
                <p className="font-[Open_Sans] text-[14px] text-white/70">
                  Código vence en:{" "}
                  <span className={timeLeft < 300 ? "text-red-500 font-bold" : "text-[#B56CFF] font-bold"}>
                    {formatTime(timeLeft)}
                  </span>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-[50px] w-full rounded-[12px] bg-[#B57AF6] font-[Montserrat] text-[16px] font-extrabold text-[#1C1023] shadow-[0_10px_25px_rgba(181,122,246,0.32)] transition hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verificando..." : "Verificar Código"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="mx-auto mt-8 flex items-center gap-2 font-[Open_Sans] text-[15px] font-semibold text-white/70 transition hover:text-white"
            >
              <ChevronLeft size={18} strokeWidth={2.2} />
              <span>Volver</span>
            </button>
          </div>
        </main>

        <AuthFooter />
      </div>
    </div>
  );
};

export default VerifyCodePage;