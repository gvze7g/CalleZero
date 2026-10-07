import { useState } from "react";
import { authApi } from "../api/auth";
import { showError } from "../utils/alerts";

// Registro de cuenta y paso a verificar correo
export default function useRegister(navigation) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const setField = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const handleRegister = async () => {
    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();

    if (!fullName || !email || !form.password) {
      showError("Debes completar todos los campos");
      return;
    }
    if (fullName.length < 3) {
      showError("El nombre debe tener al menos 3 caracteres");
      return;
    }
    if (form.password.length < 8) {
      showError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (!/[a-zA-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      showError("La contraseña debe combinar letras y números");
      return;
    }
    if (form.password !== form.confirmPassword) {
      showError("Las contraseñas no coinciden");
      return;
    }
    if (!accepted) {
      showError("Debes aceptar los Términos de Servicio y la Política de Privacidad");
      return;
    }

    setLoading(true);
    try {
      await authApi.register(fullName, email, form.password);
      navigation.navigate("VerifyEmail", { email });
    } catch (err) {
      showError(err.message || "No se pudo crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return { form, setField, accepted, setAccepted, loading, handleRegister };
}
