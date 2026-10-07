import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { showError, showInfo } from "../utils/alerts";
import { clean, isName, isPhone, isSafeText, MESSAGES } from "../utils/validators";

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
    const fullName = clean(form.fullName);
    const phone = clean(form.phone);
    const location = clean(form.location);

    if (!isName(fullName)) return showError(MESSAGES.name);
    if (phone && !isPhone(phone)) return showError(MESSAGES.phone);
    if (location && !isSafeText(location, 3, 120)) return showError("La ubicación debe tener entre 3 y 120 caracteres válidos");

    setSaving(true);
    try {
      await updateProfile({ fullName, phone, location });
      showInfo("Perfil actualizado correctamente", "Listo", () => navigation.goBack());
    } catch (err) {
      showError(err.message || "No se pudo actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  return { user, form, setField, saving, handleSave };
}
