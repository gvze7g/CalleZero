import React from "react";
import { Mail, Lock, Eye, Shield, Loader } from "lucide-react";
import { toast } from "sonner";
import AuthInput from "./AuthInput";

const LoginCard = ({
  email,
  password,
  onChange,
  onForgotPassword,
  onLogin,
  loading,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Debes llenar el correo y la contraseña");
      return;
    }

    onLogin();
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/5 bg-[#171724] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:p-6 md:p-8">
      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#2D2140] text-[#B56CFF] sm:h-14 sm:w-14">
        <Shield size={22} strokeWidth={2.1} />
      </div>

      <div className="text-center">
        <h1 className="font-[Montserrat] text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
          Iniciar Sesión
        </h1>

        <p className="mx-auto mt-3 max-w-xs font-[Open_Sans] text-sm leading-6 text-white/65 sm:text-[15px]">
          Ingresa tus credenciales para gestionar Calle Zero
        </p>
      </div>

      <form
        className="mt-7 space-y-4 sm:mt-8 sm:space-y-5"
        onSubmit={handleSubmit}
        noValidate
      >
        <AuthInput
          label="Correo Electrónico"
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="nombre@callezero.com"
          icon={Mail}
        />

        <AuthInput
          label="Contraseña"
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="••••••••"
          icon={Lock}
          rightElement={<Eye size={18} strokeWidth={2} />}
        />

        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-3 font-[Open_Sans] text-sm font-semibold text-white/80">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border border-white/20 bg-transparent accent-[#B56CFF]"
            />
            <span>Recuérdame</span>
          </label>

          <button
            type="button"
            onClick={onForgotPassword}
            className="text-left font-[Open_Sans] text-sm font-bold text-[#B56CFF] transition hover:text-[#C891FF] sm:text-right"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#B57AF6] font-[Montserrat] text-sm font-extrabold text-[#1C1023] shadow-[0_10px_25px_rgba(181,122,246,0.3)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50 sm:h-[52px] sm:text-base"
        >
          {loading && <Loader size={18} className="animate-spin" />}
          {loading ? "Iniciando..." : "Iniciar Sesión"}
        </button>
      </form>

      <div className="mt-7 flex items-center gap-4 sm:mt-8">
        <div className="h-px flex-1 bg-[#383149]" />

        <span className="text-center font-[Open_Sans] text-[11px] font-semibold italic tracking-wide text-white/65 sm:text-xs">
          ACCESO RESTRINGIDO
        </span>

        <div className="h-px flex-1 bg-[#383149]" />
      </div>

      <p className="mx-auto mt-6 max-w-sm text-center font-[Open_Sans] text-[11px] leading-6 text-white/50 sm:text-xs">
        Este es un sistema privado de Calle Zero. El acceso no autorizado está
        estrictamente prohibido y sujeto a acciones legales.
      </p>
    </div>
  );
};

export default LoginCard;