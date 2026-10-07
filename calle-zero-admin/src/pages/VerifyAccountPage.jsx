import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChevronLeft, Mail } from "lucide-react";
import AuthHeader from "../components/auth/AuthHeader";
import AuthFooter from "../components/auth/AuthFooter";
import AuthInput from "../components/auth/AuthInput";
import { apiFetch } from "../lib/api.js";
import { isEmail, MESSAGES } from "../utils/validators.js";

// Verificacion de cuenta con el codigo enviado al correo
const VerifyAccountPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [codeSent, setCodeSent] = useState(Boolean(location.state?.email));
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const sendCode = async (event) => {
    event?.preventDefault();
    if (!isEmail(email)) {
      toast.error(MESSAGES.email);
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch("/api/registerUser/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "No se pudo enviar el código");
        return;
      }
      toast.success("Código enviado a tu correo");
      setCodeSent(true);
    } catch {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      toast.error("Ingresa los 6 dígitos");
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch("/api/registerUser/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: fullCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Código incorrecto");
        return;
      }
      toast.success("Cuenta verificada. Ya puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 700);
    } catch {
      toast.error("Error de conexión");
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
                Verificar Cuenta
              </h1>
              <p className="mx-auto mt-4 max-w-[320px] font-[Open_Sans] text-[15px] leading-6 text-white/65">
                {codeSent
                  ? `Ingresa el código de 6 dígitos que enviamos a ${email}`
                  : "Escribe tu correo y te enviaremos un código para verificar tu cuenta"}
              </p>
            </div>

            {codeSent ? (
              <form className="mt-9 space-y-6" onSubmit={handleVerify} noValidate>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      maxLength={1}
                      className="h-[52px] w-[52px] sm:h-[56px] sm:w-[56px] rounded-[10px] border border-white/10 bg-[#0F0F0F] text-center font-[Montserrat] text-[24px] sm:text-[28px] font-extrabold text-[#B56CFF] outline-none transition focus:border-[#B56CFF] focus:bg-[#2D2140]"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="h-[50px] w-full rounded-[12px] bg-[#B57AF6] font-[Montserrat] text-[16px] font-extrabold text-[#1C1023] shadow-[0_10px_25px_rgba(181,122,246,0.32)] transition hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Verificando..." : "Verificar Cuenta"}
                </button>

                <button
                  type="button"
                  onClick={sendCode}
                  disabled={loading}
                  className="mx-auto block font-[Open_Sans] text-[14px] font-bold text-[#B56CFF] hover:text-[#C891FF]"
                >
                  Reenviar código
                </button>
              </form>
            ) : (
              <form className="mt-9 space-y-6" onSubmit={sendCode} noValidate>
                <AuthInput
                  label="Correo Electrónico"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.replace(/\s/g, "").slice(0, 100))}
                  placeholder="nombre@callezero.com"
                  icon={Mail}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="h-[50px] w-full rounded-[12px] bg-[#B57AF6] font-[Montserrat] text-[16px] font-extrabold text-[#1C1023] shadow-[0_10px_25px_rgba(181,122,246,0.32)] transition hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Enviando..." : "Enviar Código"}
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mx-auto mt-8 flex items-center gap-2 font-[Open_Sans] text-[15px] font-semibold text-white/70 transition hover:text-white"
            >
              <ChevronLeft size={18} strokeWidth={2.2} />
              <span>Volver al inicio de sesión</span>
            </button>
          </div>
        </main>

        <AuthFooter />
      </div>
    </div>
  );
};

export default VerifyAccountPage;
