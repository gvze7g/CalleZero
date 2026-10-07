import { useState } from "react";
import { authApi } from "../api/auth";
import { showError } from "../utils/alerts";

// Valida el codigo de recuperacion
export default function useVerifyCode(navigation, email) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (code.length !== 6) {
      showError("Ingresa el código de 6 dígitos");
      return;
    }

    setLoading(true);
    try {
      await authApi.verifyRecoveryCode(email, code);
      navigation.navigate("ResetPassword", { email, code });
    } catch (err) {
      showError(err.message || "Código incorrecto o expirado");
    } finally {
      setLoading(false);
    }
  };

  const resend = () => authApi.forgotPassword(email);

  return { code, setCode, loading, handleVerify, resend };
}
