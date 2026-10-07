import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuth from "./useAuth";
import { apiFetch, setToken } from "../lib/api.js";
import { isEmail, isPassword, MESSAGES } from "../utils/validators.js";

// Solo se permite escribir lo valido en cada campo
const sanitize = (name, value) => {
  if (name === "fullName") return value.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]/g, "").slice(0, 50);
  if (name === "email") return value.replace(/\s/g, "").slice(0, 100);
  if (name === "code") return value.replace(/\D/g, "").slice(0, 6);
  if (typeof value === "string") return value.slice(0, 64);
  return value;
};


export default function useLogin() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [forgotForm, setForgotForm] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: sanitize(event.target.name, event.target.value),
    });
  };

  const handleForgotChange = (event) => {
    setForgotForm({
      ...forgotForm,
      [event.target.name]: sanitize(event.target.name, event.target.value),
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      toast.error("Debes completar correo y contraseña");
      return;
    }

    if (!isEmail(form.email)) {
      toast.error(MESSAGES.email);
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiFetch("/api/loginUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Credenciales incorrectas");
        // Cuenta sin verificar: ir a verificarla
        if (data.needsVerification) {
          navigate("/verify-account", { state: { email: data.email || form.email } });
        }
        return;
      }

      setToken(data.token);
      await checkAuth();

      toast.success("Inicio de sesión exitoso");

      setTimeout(() => {
        navigate("/");
      }, 700);
    } catch (error) {
      console.error(error);
      toast.error("Error al conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotStep1 = async (event) => {
    event.preventDefault();

    if (!forgotForm.email.trim()) {
      toast.error("Ingresa tu correo");
      return;
    }

    if (!isEmail(forgotForm.email)) {
      toast.error(MESSAGES.email);
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiFetch(
        "/api/users/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: forgotForm.email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Correo no encontrado");
        return;
      }

      toast.success("Codigo enviado a tu correo");
      setForgotStep(2);
    } catch (error) {
      console.error(error);
      toast.error("Error al enviar codigo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotStep2 = async (event) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(forgotForm.code)) {
      toast.error("El código debe tener 6 dígitos");
      return;
    }

    if (
      !forgotForm.newPassword.trim() ||
      !forgotForm.confirmPassword.trim()
    ) {
      toast.error("Completa las nuevas contraseñas");
      return;
    }

    if (!isPassword(forgotForm.newPassword)) {
      toast.error(MESSAGES.password);
      return;
    }

    if (forgotForm.newPassword !== forgotForm.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiFetch(
        "/api/users/verify-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: forgotForm.email,
            code: forgotForm.code,
            newPassword: forgotForm.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Codigo inválido o expirado");
        return;
      }

      toast.success("Contraseña actualizada correctamente");

      setShowForgotPassword(false);
      setForgotStep(1);

      setForgotForm({
        email: "",
        code: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    navigate,
    isLoading,
    showForgotPassword,
    setShowForgotPassword,
    forgotStep,
    setForgotStep,
    form,
    forgotForm,
    setForgotForm,
    handleChange,
    handleForgotChange,
    handleLogin,
    handleForgotStep1,
    handleForgotStep2,
  };
}