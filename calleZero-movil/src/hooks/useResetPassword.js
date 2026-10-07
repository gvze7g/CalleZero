import { useState } from "react";
import { authApi } from "../api/auth";
import { showError, showInfo } from "../utils/alerts";
import { isPassword, MESSAGES } from "../utils/validators";

// Guarda la nueva contraseña
export default function useResetPassword(navigation, email, code) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirm) return showError("Completa ambos campos");
    if (!isPassword(password)) return showError(MESSAGES.password);
    if (password !== confirm) return showError("Las contraseñas no coinciden");

    setLoading(true);
    try {
      await authApi.resetPassword(email, code, password);
      showInfo(
        "Tu contraseña fue actualizada. Ya puedes iniciar sesión.",
        "Contraseña actualizada",
        () => navigation.reset({ index: 0, routes: [{ name: "Login" }] })
      );
    } catch (err) {
      showError(err.message || "No se pudo actualizar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return { password, setPassword, confirm, setConfirm, loading, handleReset };
}
