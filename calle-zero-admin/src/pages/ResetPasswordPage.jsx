import { Lock, Eye, EyeOff, ChevronLeft } from "lucide-react";
import AuthHeader from "../components/auth/AuthHeader";
import AuthFooter from "../components/auth/AuthFooter";
import AuthInput from "../components/auth/AuthInput";
import resetPassword from "../hooks/useResetPassword";

const ResetPasswordPage = () => {
    const {
      navigate,
      formData,
      showPassword,
      loading,
      handleChange,
      togglePassword,
      handleSubmit,
  } = useResetPassword();

  return (
    <div className="min-h-screen w-screen bg-black text-white overflow-y-auto">
      <div className="flex min-h-screen w-full flex-col border border-[#0F1230]">
        <AuthHeader />

        <main className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 py-6 md:px-8">
          <div className="absolute h-[420px] w-[420px] rounded-full bg-[#5C139B]/20 blur-[120px]" />

          <div className="relative z-10 w-full max-w-[440px] rounded-[16px] border border-white/5 bg-[#171724] px-6 py-8 shadow-[0_0_120px_rgba(103,25,180,0.16),0_20px_60px_rgba(0,0,0,0.45)] md:px-10 md:py-10">
            <div className="absolute left-0 top-0 h-[3px] w-full rounded-t-[16px] bg-[#B56CFF]" />

            <div className="mx-auto mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#2D2140] text-[#B56CFF] sm:h-[54px] sm:w-[54px]">
              <Lock size={22} strokeWidth={2.1} />
            </div>

            <div className="text-center">
              <h1 className="font-[Montserrat] text-[34px] font-extrabold leading-none tracking-[-0.04em] text-white md:text-[36px]">
                Nueva Contraseña
              </h1>

              <p className="mx-auto mt-4 max-w-[320px] font-[Open_Sans] text-[15px] leading-6 text-white/65">
                Crea una contraseña segura para tu cuenta
              </p>
            </div>

            <form className="mt-9 space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2">
                <label className="block font-[Open_Sans] text-[13px] sm:text-[14px] font-semibold text-white/85">
                  Nueva Contraseña
                </label>

                <div className="relative flex items-center">
                  <Lock
                    size={18}
                    strokeWidth={2}
                    className="absolute left-3 sm:left-4 text-white/40 pointer-events-none"
                  />

                  <input
                    type={showPassword.newPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full h-[44px] sm:h-[46px] rounded-[10px] border border-white/10 bg-[#0F0F0F] pl-10 sm:pl-12 pr-12 font-[Open_Sans] text-[14px] sm:text-[15px] text-white placeholder-white/40 outline-none transition focus:border-white/20 focus:bg-[#171724]"
                  />

                  <button
                    type="button"
                    onClick={() => togglePassword("newPassword")}
                    className="absolute right-3 sm:right-4 text-white/40 hover:text-white/60 transition"
                  >
                    {showPassword.newPassword ? (
                      <EyeOff size={18} strokeWidth={2} />
                    ) : (
                      <Eye size={18} strokeWidth={2} />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-[Open_Sans] text-[13px] sm:text-[14px] font-semibold text-white/85">
                  Confirmar Contraseña
                </label>

                <div className="relative flex items-center">
                  <Lock
                    size={18}
                    strokeWidth={2}
                    className="absolute left-3 sm:left-4 text-white/40 pointer-events-none"
                  />

                  <input
                    type={showPassword.confirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full h-[44px] sm:h-[46px] rounded-[10px] border border-white/10 bg-[#0F0F0F] pl-10 sm:pl-12 pr-12 font-[Open_Sans] text-[14px] sm:text-[15px] text-white placeholder-white/40 outline-none transition focus:border-white/20 focus:bg-[#171724]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        confirmPassword: !prev.confirmPassword,
                      }))
                    }
                    className="absolute right-3 sm:right-4 text-white/40 hover:text-white/60 transition"
                  >
                    {showPassword.confirmPassword ? (
                      <EyeOff size={18} strokeWidth={2} />
                    ) : (
                      <Eye size={18} strokeWidth={2} />
                    )}
                  </button>
                </div>

                <p className="font-[Open_Sans] text-[12px] text-white/50">
                  ✓ Mínimo 8 caracteres
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-[50px] w-full rounded-[12px] bg-[#B57AF6] font-[Montserrat] text-[16px] font-extrabold text-[#1C1023] shadow-[0_10px_25px_rgba(181,122,246,0.32)] transition hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Guardando..." : "Actualizar Contraseña"}
              </button>
            </form>

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

export default ResetPasswordPage;