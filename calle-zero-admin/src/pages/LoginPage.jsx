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
    <div className="h-screen overflow-hidden bg-black text-white">
      <div className="flex h-full flex-col">
        <AuthHeader />

        <main className="flex flex-1 items-center justify-center px-4 py-2">
          <div className="w-full max-w-md">
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