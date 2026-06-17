import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function useResetPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.newPassword.trim() || !formData.confirmPassword.trim()) {
      toast.error("Completa ambas contraseñas");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("La contraseña debe tener mínimo 8 caracteres");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:4000/api/admin/recovery/new-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Contraseña actualizada correctamente");

        setTimeout(() => {
          navigate("/login");
        }, 600);

        return;
      }

      toast.error(data.message || "Error al actualizar contraseña");
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return {
    navigate,
    formData,
    showPassword,
    loading,
    handleChange,
    togglePassword,
    handleSubmit,
  };
}