import { useState } from "react";
import { authApi } from "../api/auth";
import { showError } from "../utils/alerts";
import { clean, isEmail, MESSAGES } from "../utils/validators";

// Solicita el codigo de recuperacion
export default function useForgotPassword(navigation) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const value = clean(email).toLowerCase();
    if (!value) return showError("Ingresa tu correo");
    if (!isEmail(value)) return showError(MESSAGES.email);

    setLoading(true);
    try {
      await authApi.forgotPassword(value);
      navigation.navigate("VerifyCode", { email: value });
    } catch (err) {
      showError(err.message || "No se pudo enviar el código");
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, loading, handleSend };
}
