import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiFetch, clearToken } from "../lib/api.js";
import { isName, isPhone, isSafeText, MESSAGES } from "../utils/validators.js";

// Solo se permite escribir lo valido en cada campo
const sanitize = {
    fullName: (v) => v.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]/g, "").slice(0, 50),
    phone: (v) => v.replace(/[^0-9 +-]/g, "").slice(0, 20),
    location: (v) => v.replace(/[<>{}$\\]/g, "").slice(0, 120),
};

const PHOTO_KEY = "cz_profile_photo";
import useAuth from "./useAuth";

export default function useProfile() {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [userData, setUserData] = useState(null);
    const [orderCount, setOrderCount] = useState(0);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        location: "",
    });

    useEffect(() => {
        loadUserProfile();
        loadOrderCount();
    }, []);

    const loadUserProfile = async () => {
        try {
            setIsLoading(true);

            const response = await apiFetch(
                "/api/users/me",
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("No autenticado");
            }

            const data = await response.json();

            setUserData(data);

            setForm({
                fullName: data.fullName || "",
                email: data.email || "",
                phone: data.phone || "",
                location: data.location || "",
            });
        } catch (error) {
            console.error("Error cargando perfil:", error);
            toast.error("Debes iniciar sesión para ver tu perfil");
            navigate("/login");
        } finally {
            setIsLoading(false);
        }
    };

    const loadOrderCount = async () => {
        try {
            const response = await apiFetch(
                "/api/orders/mine",
                {
                    credentials: "include",
                }
            );

            if (response.ok) {
                const data = await response.json();
                setOrderCount(data.length || 0);
            }
        } catch (error) {
            console.error("Error cargando ordenes:", error);
        }
    };

    const handleChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: sanitize[field] ? sanitize[field](value) : value,
        }));
    };

    // Foto de perfil guardada en este navegador
    const [photo, setPhoto] = useState(() => {
        try {
            return localStorage.getItem(PHOTO_KEY);
        } catch {
            return null;
        }
    });

    const changePhoto = (file) => {
        if (!file) return;
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            toast.error("Solo se permiten imágenes JPG, PNG o WEBP");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error("La imagen debe pesar menos de 2 MB");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            try {
                localStorage.setItem(PHOTO_KEY, reader.result);
            } catch {
                // sin espacio: solo se muestra en esta sesion
            }
            setPhoto(reader.result);
            toast.success("Foto actualizada");
        };
        reader.readAsDataURL(file);
    };

    const saveProfile = async (event) => {
        event.preventDefault();

        if (!form.fullName.trim()) {
            toast.error("El nombre es requerido");
            return;
        }

        if (!isName(form.fullName)) {
            toast.error(MESSAGES.name);
            return;
        }

        if (form.phone.trim() && !isPhone(form.phone)) {
            toast.error(MESSAGES.phone);
            return;
        }

        if (form.location.trim() && !isSafeText(form.location, 3, 120)) {
            toast.error("La ubicación debe tener entre 3 y 120 caracteres válidos");
            return;
        }

        setIsSaving(true);

        try {
            const response = await apiFetch(
                "/api/users/me",
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fullName: form.fullName.trim(),
                        phone: form.phone.trim(),
                        location: form.location.trim(),
                    }),
                }
            );

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || "Error al actualizar el perfil");
            }

            const data = await response.json();

            setUserData(data.user);

            toast.success("Perfil actualizado correctamente");
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message || "Error al actualizar el perfil");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await apiFetch("/api/logout", {
                method: "POST",
                credentials: "include",
            });

            clearToken();
            setUser(null);
            toast.success("Sesión cerrada");
            navigate("/");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            toast.error("Error al cerrar sesión");
        }
    };

    const getInitials = () => {
        if (!form.fullName) return "U";

        return form.fullName
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return {
        navigate,
        isLoading,
        isSaving,
        userData,
        orderCount,
        form,
        handleChange,
        saveProfile,
        handleLogout,
        getInitials,
        photo,
        changePhoto,
    };
}