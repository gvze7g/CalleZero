import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
      [name]: type === "checkbox" ? checked : value,
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

    if (form.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/registerUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Error al crear cuenta");
        return;
      }

      toast.success("Cuenta creada correctamente");

      setTimeout(() => {
        navigate("/login");
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