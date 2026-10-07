import { useState } from "react";
import { authApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { showError, showInfo } from "../utils/alerts";

// Verifica la cuenta y abre la sesion
export default function useVerifyEmail(navigation, email) {
  const { persistSession } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (code.length !== 6) {
      showError("Ingresa el código de 6 dígitos");
      return;
    }

    setLoading(true);
    try {
      const data = await authApi.verifyAccount(email, code);
      if (data.token) {
        await persistSession(data.token, data.user || null);
      } else {
        showInfo("Tu cuenta fue verificada. Inicia sesión.", "Cuenta verificada", () =>
          navigation.navigate("Login")
        );
      }
    } catch (err) {
      showError(err.message || "Código incorrecto o expirado");
    } finally {
      setLoading(false);
    }
  };

  const resend = () => authApi.sendVerificationCode(email);

  return { code, setCode, loading, handleVerify, resend };
}
