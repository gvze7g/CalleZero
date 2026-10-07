import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { showError, showInfo } from "../utils/alerts";
import { clean, isEmail, MESSAGES } from "../utils/validators";

// Inicio de sesion (si la cuenta no esta verificada, lleva a verificarla)
export default function useLogin(navigation) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const value = clean(email).toLowerCase();

    if (!value || !password) {
      showError("Debes completar correo y contraseña");
      return;
    }
    if (!isEmail(value)) {
      showError(MESSAGES.email);
      return;
    }

    setLoading(true);
    try {
      await signIn(value, password);
    } catch (err) {
      if (err.data?.needsVerification) {
        showInfo(err.message, "Verifica tu cuenta", () =>
          navigation.navigate("VerifyEmail", { email: err.data.email || value })
        );
      } else {
        showError(err.message || "Credenciales incorrectas");
      }
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, password, setPassword, loading, handleLogin };
}
