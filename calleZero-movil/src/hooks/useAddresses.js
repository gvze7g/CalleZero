import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { shopApi } from "../api/shop";
import { showError } from "../utils/alerts";
import { clean, isName, isPhone, isSafeText, isZip, MESSAGES } from "../utils/validators";

export const emptyAddress = { label: "Casa", fullName: "", address: "", city: "", zip: "", phone: "" };

// Devuelve el mensaje de error o null si la direccion es valida
export const addressError = (a) => {
  if (!isSafeText(a.label, 2, 30)) return "La etiqueta debe tener entre 2 y 30 caracteres";
  if (!isName(a.fullName)) return MESSAGES.name;
  if (!isSafeText(a.address, 5, 150)) return "La dirección debe tener entre 5 y 150 caracteres válidos";
  if (!isName(a.city, 2, 50)) return "La ciudad solo puede tener letras y espacios";
  if (clean(a.zip) && !isZip(a.zip)) return MESSAGES.zip;
  if (!isPhone(a.phone)) return MESSAGES.phone;
  return null;
};

// Direcciones guardadas del usuario (CRUD en /api/users/me/addresses)
export default function useAddresses() {
  const { token, user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null); // null = formulario cerrado
  const [editingId, setEditingId] = useState(null);

  const load = useCallback(async () => {
    try {
      setAddresses(await shopApi.addresses(token));
    } catch {
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const setField = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const openNew = () => {
    setEditingId(null);
    setForm({ ...emptyAddress, fullName: user?.fullName || "", phone: user?.phone || "" });
  };

  const openEdit = (a) => {
    setEditingId(a._id);
    setForm({ label: a.label, fullName: a.fullName, address: a.address, city: a.city, zip: a.zip, phone: a.phone });
  };

  const closeForm = () => {
    setForm(null);
    setEditingId(null);
  };

  const save = async () => {
    const data = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, clean(v)]));
    const invalid = addressError(data);
    if (invalid) return showError(invalid);

    setSaving(true);
    try {
      const res = editingId
        ? await shopApi.updateAddress(token, editingId, data)
        : await shopApi.addAddress(token, data);
      setAddresses(res.addresses);
      closeForm();
    } catch (err) {
      showError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      const res = await shopApi.deleteAddress(token, id);
      setAddresses(res.addresses);
    } catch (err) {
      showError(err.message);
    }
  };

  const makeDefault = async (id) => {
    try {
      const res = await shopApi.updateAddress(token, id, { isDefault: true });
      setAddresses(res.addresses);
    } catch (err) {
      showError(err.message);
    }
  };

  return { addresses, loading, saving, form, editingId, setField, openNew, openEdit, closeForm, save, remove, makeDefault };
}
