import AuthHeader from "../components/auth/AuthHeader";
import AuthFooter from "../components/auth/AuthFooter";
import ForgotPasswordCard from "../components/auth/ForgotPasswordCard";
import useForgotPassword from "../hooks/useForgotPassword";

const ForgotPasswordPage = () => {
  const {
    handleBackToLogin,
    handleCodeSent,
  } = useForgotPassword();

  return (
    <div className="h-screen w-screen overflow-hidden bg-black text-white">
      <div className="flex h-full w-full flex-col border border-[#0F1230]">
        <AuthHeader />

        <main className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 py-6 md:px-8">
          <div className="absolute h-[420px] w-[420px] rounded-full bg-[#5C139B]/20 blur-[120px]" />

          <div className="relative z-10 w-full max-w-[440px]">
            <ForgotPasswordCard 
              onBackToLogin={handleBackToLogin}
              onCodeSent={handleCodeSent}
            />

            <p className="mt-8 text-center font-[Open_Sans] text-[15px] text-white/65">
              ¿Tienes problemas?{" "}
              <a
                href="#"
                className="font-semibold text-[#B56CFF] transition hover:text-[#C891FF]"
              >
                Contacta a Soporte Técnico
              </a>
            </p>
          </div>
        </main>

        <AuthFooter />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;