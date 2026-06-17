import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function useProfile() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        "http://localhost:4000/api/users/me",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error cargando perfil");
      }

      const data = await response.json();

      setFormData({
        fullName: data.fullName || data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("El nombre es requerido");
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch(
        "http://localhost:4000/api/users/me",
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al actualizar");
      }

      const data = await response.json();

      toast.success("Perfil actualizado correctamente");

      setFormData({
        fullName: data.user.fullName || data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        location: data.user.location || "",
      });
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = () => {
    return formData.fullName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return {
    formData,
    isLoading,
    isSaving,
    handleChange,
    handleSubmit,
    getInitials,
  };
}