import React, { useState } from "react";
import { Mail, Lock, Eye, Shield } from "lucide-react";
import { toast } from "sonner";
import AuthInput from "./AuthInput";

const LoginCard = ({ onForgotPassword, onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error("Debes llenar el correo y la contraseña");
      return;
    }

    toast.success("Inicio de sesión correcto");
    onLogin();
  };

  return (
    <div className="w-full max-w-[450px] rounded-[16px] border border-white/5 bg-[#171724] px-5 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:px-6 sm:py-8 md:px-8 md:py-9">
      
      <div className="mx-auto mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#2D2140] text-[#B56CFF] sm:h-[54px] sm:w-[54px]">
        <Shield size={22} strokeWidth={2.1} />
      </div>

      <div className="text-center">
        <h1 className="font-[Montserrat] text-[28px] sm:text-[32px] md:text-[36px] font-extrabold leading-none tracking-[-0.04em] text-white">
          Iniciar Sesión
        </h1>

        <p className="mx-auto mt-3 max-w-[300px] font-[Open_Sans] text-[13px] sm:text-[14px] md:text-[15px] leading-6 text-white/65">
          Ingresa tus credenciales para gestionar Calle Zero
        </p>
      </div>

      <form className="mt-7 sm:mt-8 space-y-4 sm:space-y-5" onSubmit={handleSubmit} noValidate>
        <AuthInput
          label="Correo Electrónico"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="nombre@callezero.com"
          icon={Mail}
        />

        <AuthInput
          label="Contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          icon={Lock}
          rightElement={<Eye size={18} strokeWidth={2} />}
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
          <label className="flex items-center gap-3 font-[Open_Sans] text-[13px] sm:text-[14px] font-semibold text-white/80">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border border-white/20 bg-transparent accent-[#B56CFF]"
            />
            <span>Recuérdame</span>
          </label>

          <button
            type="button"
            onClick={onForgotPassword}
            className="text-left sm:text-right font-[Open_Sans] text-[13px] sm:text-[14px] font-bold text-[#B56CFF] transition hover:text-[#C891FF]"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button
          type="submit"
          className="h-[48px] sm:h-[50px] w-full rounded-[12px] bg-[#B57AF6] font-[Montserrat] text-[15px] sm:text-[16px] font-extrabold text-[#1C1023] shadow-[0_10px_25px_rgba(181,122,246,0.3)] transition hover:brightness-105"
        >
          Iniciar Sesión
        </button>
      </form>

      <div className="mt-7 sm:mt-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-[#383149]" />
        <span className="font-[Open_Sans] text-[11px] sm:text-[13px] font-semibold italic tracking-[0.02em] text-white/65 text-center">
          ACCESO RESTRINGIDO
        </span>
        <div className="h-px flex-1 bg-[#383149]" />
      </div>

      <p className="mx-auto mt-6 sm:mt-7 max-w-[345px] text-center font-[Open_Sans] text-[11px] sm:text-[12px] leading-6 text-white/50">
        Este es un sistema privado de Calle Zero. El acceso no autorizado está estrictamente prohibido y sujeto a acciones legales.
      </p>
    </div>
  );
};

export default LoginCard;