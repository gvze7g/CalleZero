import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function useProfile() {
    const navigate = useNavigate();

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
            const response = await fetch(
                "http://localhost:4000/api/orders",
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
            [field]: value,
        }));
    };

    const saveProfile = async (event) => {
        event.preventDefault();

        if (!form.fullName.trim()) {
            toast.error("El nombre es requerido");
            return;
        }

        setIsSaving(true);

        try {
            const response = await fetch(
                "http://localhost:4000/api/users/me",
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                }
            );

            if (!response.ok) {
                throw new Error("Error al actualizar");
            }

            const data = await response.json();

            setUserData(data.user);

            toast.success("Perfil actualizado correctamente");
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al actualizar el perfil");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:4000/api/logout", {
                method: "POST",
                credentials: "include",
            });

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
    };
}