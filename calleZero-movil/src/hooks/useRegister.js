import { useState } from "react";
import { authApi } from "../api/auth";
import { showError } from "../utils/alerts";
import { clean, isEmail, isName, isPassword, MESSAGES } from "../utils/validators";

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
    const fullName = clean(form.fullName);
    const email = clean(form.email).toLowerCase();

    if (!fullName || !email || !form.password || !form.confirmPassword) {
      showError("Debes completar todos los campos");
      return;
    }
    if (!isName(fullName)) return showError(MESSAGES.name);
    if (!isEmail(email)) return showError(MESSAGES.email);
    if (!isPassword(form.password)) return showError(MESSAGES.password);
    if (form.password !== form.confirmPassword) return showError("Las contraseñas no coinciden");
    if (!accepted) return showError("Debes aceptar los Términos de Servicio y la Política de Privacidad");

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
