import { useNavigate } from "react-router-dom";

export default function useForgotPassword() {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleCodeSent = () => {
    navigate("/verify-code");
  };

  return {
    handleBackToLogin,
    handleCodeSent,
  };
}