import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "../lib/api.js";
import { isSafeText } from "../utils/validators.js";

const emptyForm = {
    code: "",
    description: "",
    discountType: "percent",
    value: "",
    minPurchase: "",
    maxUses: "",
    expiresAt: "",
    isActive: true,
};

// Estado de una promocion para mostrarlo en la tabla
export const promoStatus = (p) => {
    if (!p.isActive) return { label: "Inactiva", type: "muted" };
    if (p.expiresAt && new Date(p.expiresAt) < new Date()) return { label: "Expirada", type: "danger" };
    if (p.maxUses > 0 && p.usedCount >= p.maxUses) return { label: "Agotada", type: "low" };
    return { label: "Activa", type: "default" };
};

// CRUD de codigos promocionales (/api/promotions)
export default function usePromotions() {
    const [promotions, setPromotions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [isSaving, setIsSaving] = useState(false);

    const load = async () => {
        try {
            setIsLoading(true);
            const res = await apiFetch("/api/promotions");
            if (!res.ok) throw new Error();
            setPromotions(await res.json());
        } catch {
            toast.error("Error al cargar promociones");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const stats = useMemo(() => {
        const active = promotions.filter((p) => promoStatus(p).label === "Activa").length;
        const uses = promotions.reduce((n, p) => n + (p.usedCount || 0), 0);
        return [
            { title: "Total de códigos", value: promotions.length },
            { title: "Códigos activos", value: active },
            { title: "Usos totales", value: uses },
        ];
    }, [promotions]);

    const setField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

    const openCreate = () => {
        setEditing(null);
        setFormData(emptyForm);
        setIsModalOpen(true);
    };

    const openEdit = (p) => {
        setEditing(p);
        setFormData({
            code: p.code,
            description: p.description || "",
            discountType: p.discountType,
            value: String(p.value),
            minPurchase: p.minPurchase ? String(p.minPurchase) : "",
            maxUses: p.maxUses ? String(p.maxUses) : "",
            expiresAt: p.expiresAt ? p.expiresAt.slice(0, 10) : "",
            isActive: p.isActive,
        });
        setIsModalOpen(true);
    };

    // Devuelve el mensaje de error o null
    const validate = () => {
        const value = Number(formData.value);
        if (!/^[A-Z0-9]{3,20}$/.test(formData.code)) return "El código solo puede tener letras y números (3 a 20)";
        if (formData.description && !isSafeText(formData.description, 0, 120)) return "La descripción tiene caracteres no permitidos (máx. 120)";
        if (!formData.value || isNaN(value) || value <= 0) return "El descuento debe ser un número mayor a 0";
        if (formData.discountType === "percent" && value > 100) return "El porcentaje no puede ser mayor a 100";
        if (formData.discountType === "fixed" && value > 10000) return "El descuento no puede ser mayor a $10,000";
        if (formData.minPurchase && (isNaN(formData.minPurchase) || Number(formData.minPurchase) < 0)) return "La compra mínima debe ser 0 o más";
        if (formData.maxUses && !/^[0-9]+$/.test(formData.maxUses)) return "Los usos máximos deben ser un número entero";
        if (formData.expiresAt) {
            const end = new Date(`${formData.expiresAt}T23:59:59`);
            if (isNaN(end.getTime())) return "Fecha de expiración no válida";
            if (!editing && end < new Date()) return "La fecha de expiración debe ser futura";
        }
        return null;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const invalid = validate();
        if (invalid) {
            toast.error(invalid);
            return;
        }

        const body = {
            ...formData,
            value: Number(formData.value),
            minPurchase: Number(formData.minPurchase) || 0,
            maxUses: Number(formData.maxUses) || 0,
            expiresAt: formData.expiresAt ? `${formData.expiresAt}T23:59:59` : null,
        };

        try {
            setIsSaving(true);
            const res = await apiFetch(editing ? `/api/promotions/${editing._id}` : "/api/promotions", {
                method: editing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success(editing ? "Promoción actualizada" : "Promoción creada y notificada a los clientes");
            setIsModalOpen(false);
            load();
        } catch (error) {
            toast.error(error.message || "Error al guardar la promoción");
        } finally {
            setIsSaving(false);
        }
    };

    const toggleActive = async (p) => {
        try {
            const res = await apiFetch(`/api/promotions/${p._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !p.isActive }),
            });
            if (!res.ok) throw new Error((await res.json()).message);
            toast.success(p.isActive ? "Promoción desactivada" : "Promoción activada");
            load();
        } catch (error) {
            toast.error(error.message || "Error al actualizar");
        }
    };

    const handleDelete = async (p) => {
        if (!window.confirm(`¿Eliminar el código ${p.code}?`)) return;
        try {
            const res = await apiFetch(`/api/promotions/${p._id}`, { method: "DELETE" });
            if (!res.ok) throw new Error((await res.json()).message);
            toast.success("Promoción eliminada");
            load();
        } catch (error) {
            toast.error(error.message || "Error al eliminar");
        }
    };

    return {
        promotions,
        isLoading,
        stats,
        isModalOpen,
        setIsModalOpen,
        editing,
        formData,
        setField,
        isSaving,
        openCreate,
        openEdit,
        handleSubmit,
        toggleActive,
        handleDelete,
    };
}
