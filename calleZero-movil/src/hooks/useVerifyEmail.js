import { useState } from "react";
import { authApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { showError, showInfo } from "../utils/alerts";
import { clean, isEmail, MESSAGES } from "../utils/validators";

// Verifica la cuenta y abre la sesion. Si no llega correo, se puede escribir.
export default function useVerifyEmail(navigation, initialEmail = "") {
  const { persistSession } = useAuth();
  const [email, setEmail] = useState(initialEmail);
  const [codeSent, setCodeSent] = useState(Boolean(initialEmail));
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const value = clean(email).toLowerCase();

  // Envia (o reenvia) el codigo al correo escrito
  const sendCode = async () => {
    if (!isEmail(value)) return showError(MESSAGES.email);
    setLoading(true);
    try {
      await authApi.sendVerificationCode(value);
      setCodeSent(true);
      showInfo("Te enviamos un código a tu correo.", "Código enviado");
    } catch (err) {
      showError(err.message || "No se pudo enviar el código");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!isEmail(value)) return showError(MESSAGES.email);
    if (code.length !== 6) return showError(MESSAGES.code);

    setLoading(true);
    try {
      const data = await authApi.verifyAccount(value, code);
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

  const resend = () => authApi.sendVerificationCode(value);

  return { email, setEmail, codeSent, sendCode, code, setCode, loading, handleVerify, resend };
}
