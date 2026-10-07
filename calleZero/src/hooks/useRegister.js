import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { isEmail, isName, isPassword, MESSAGES } from "../utils/validators.js";

// Solo se permite escribir lo valido en cada campo
const sanitize = (name, value) => {
  if (name === "fullName") return value.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]/g, "").slice(0, 50);
  if (name === "email") return value.replace(/\s/g, "").slice(0, 100);
  if (name === "code") return value.replace(/\D/g, "").slice(0, 6);
  if (typeof value === "string") return value.slice(0, 64);
  return value;
};
import { apiFetch } from "../lib/api.js";

export default function useRegister() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accepted: false,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : sanitize(name, value),
    });
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error("Debes completar todos los campos");
      return;
    }

    if (!form.accepted) {
      toast.error("Debes aceptar los terminos y condiciones");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (!isName(form.fullName)) {
      toast.error(MESSAGES.name);
      return;
    }

    if (!isEmail(form.email)) {
      toast.error(MESSAGES.email);
      return;
    }

    if (!isPassword(form.password)) {
      toast.error(MESSAGES.password);
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiFetch("/api/registerUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Error al crear cuenta");
        return;
      }

      toast.success(data.message || "Revisa tu correo para verificar tu cuenta");

      // Siguiente paso: verificar el correo con el codigo
      setTimeout(() => {
        navigate("/verify-account", { state: { email: form.email.trim().toLowerCase() } });
      }, 700);
    } catch (error) {
      console.error(error);
      toast.error("Error al conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    navigate,
    isLoading,
    form,
    handleChange,
    handleRegister,
  };
}