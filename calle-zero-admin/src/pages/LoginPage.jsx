import AuthHeader from "../components/auth/AuthHeader";
import AuthFooter from "../components/auth/AuthFooter";
import LoginCard from "../components/auth/LoginCard";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const {
  form,
  loading,
  navigate,
  handleChange,
  handleLogin,
} = useLogin();

  return (
    <div className="min-h-screen w-screen bg-black text-white overflow-y-auto">
      <div className="flex min-h-screen w-full flex-col border border-[#0F1230]">
        <AuthHeader />

        <main className="flex flex-1 items-center justify-center px-4 py-8 sm:py-10 md:px-8">
          <div className="w-full flex justify-center">
            <LoginCard
              email={form.email}
              password={form.password}
              onChange={handleChange}
              onLogin={handleLogin}
              onForgotPassword={() => navigate("/forgot-password")}
              loading={loading}
            />
          </div>
        </main>

        <AuthFooter />
      </div>
    </div>
  );
};

export default LoginPage;