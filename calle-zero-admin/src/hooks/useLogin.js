import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function useAdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    if (!form.email.trim() || !form.password.trim()) {
      toast.error("Completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/loginAdmin", {
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

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Error al iniciar sesión");
        setLoading(false);
        return;
      }

      toast.success("Login exitoso");

      setTimeout(() => {
        navigate("/dashboard");
      }, 600);
    } catch (error) {
      console.error(error);
      toast.error("Error al conectar con el servidor");
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    navigate,
    handleChange,
    handleLogin,
  };
}