import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { showError } from "../utils/alerts";

// Inicio de sesion
export default function useLogin() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showError("Debes completar correo y contraseña");
      return;
    }

    setLoading(true);
    try {
      await signIn(email.trim().toLowerCase(), password);
    } catch (err) {
      showError(err.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, password, setPassword, loading, handleLogin };
}
