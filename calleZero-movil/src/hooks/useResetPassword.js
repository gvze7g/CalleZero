import { useState } from "react";
import { authApi } from "../api/auth";
import { showError, showInfo } from "../utils/alerts";

// Guarda la nueva contraseña
export default function useResetPassword(navigation, email, code) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirm) {
      showError("Completa ambos campos");
      return;
    }
    if (password.length < 8) {
      showError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      showError("La contraseña debe combinar letras y números");
      return;
    }
    if (password !== confirm) {
      showError("Las contraseñas no coinciden");
      return;
    }

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
