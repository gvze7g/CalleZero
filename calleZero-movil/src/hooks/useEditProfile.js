import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { showError, showInfo } from "../utils/alerts";

// Edicion del perfil (PUT /api/users/me)
export default function useEditProfile(navigation) {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });
  const [saving, setSaving] = useState(false);

  const setField = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    const fullName = form.fullName.trim();

    if (fullName.length < 3 || fullName.length > 50) {
      showError("El nombre debe tener entre 3 y 50 caracteres");
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        fullName,
        phone: form.phone.trim(),
        location: form.location.trim(),
      });
      showInfo("Perfil actualizado correctamente", "Listo", () => navigation.goBack());
    } catch (err) {
      showError(err.message || "No se pudo actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  return { user, form, setField, saving, handleSave };
}
