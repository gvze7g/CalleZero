import React from "react";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../components/auth/AuthHeader";
import AuthFooter from "../components/auth/AuthFooter";
import LoginCard from "../components/auth/LoginCard";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-screen bg-black text-white overflow-y-auto">
      
      <div className="flex min-h-screen w-full flex-col border border-[#0F1230]">
        
        <AuthHeader />

        <main className="flex flex-1 items-center justify-center px-4 py-8 sm:py-10 md:px-8">
          <div className="w-full flex justify-center">
            <LoginCard
              onForgotPassword={() => navigate("/forgot-password")}
              onLogin={() => navigate("/dashboard")}
            />
          </div>
        </main>

        <AuthFooter />

      </div>
    </div>
  );
};

export default LoginPage;