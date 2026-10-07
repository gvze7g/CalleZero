import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "../lib/api.js";
import { isName, isSafeText } from "../utils/validators.js";

export default function useCategories() {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const [stats, setStats] = useState([
        { title: "Total Categorías", value: "0" },
        { title: "Productos en Categorías", value: "0" },
        { title: "Último Lanzamiento", value: "—" },
    ]);

    const calculateStats = (categoriesData) => {
        const totalCategories = categoriesData.length;

        const totalProducts = categoriesData.reduce(
            (acc, cat) => acc + (cat.productsCount || 0),
            0
        );

        let lastLaunch = "—";

        if (categoriesData.length > 0) {
            const sorted = [...categoriesData].sort((a, b) => {
                const dateA = new Date(a.createdAt || 0);
                const dateB = new Date(b.createdAt || 0);

                return dateB - dateA;
            });

            lastLaunch = sorted[0]?.name || "—";
        }

        setStats([
            {
                title: "Total Categorías",
                value: totalCategories,
            },
            {
                title: "Productos en Categorías",
                value: totalProducts,
            },
            {
                title: "Último Lanzamiento",
                value: lastLaunch,
            },
        ]);
    };

    const loadCategories = async () => {
        try {
            setIsLoading(true);

            const response = await apiFetch(
                "/api/categories",
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Error loading categories");
            }

            const data = await response.json();

            setCategories(data);
            calculateStats(data);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar categorías");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const openCreateModal = () => {
        setEditingCategory(null);

        setFormData({
            name: "",
            description: "",
        });

        setIsModalOpen(true);
    };

    const openEditModal = (category) => {
        setEditingCategory(category);

        setFormData({
            name: category.name || "",
            description: category.description || "",
        });

        setIsModalOpen(true);
    };

    const handleDeleteCategory = async (category) => {
        try {
            const response = await apiFetch(
                `/api/categories/${category._id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Error al eliminar");
            }

            toast.success("Categoría eliminada");

            await loadCategories();
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !formData.name.trim() ||
            !formData.description.trim()
        ) {
            toast.error("Debes completar nombre y descripción");
            return;
        }
        if (!isName(formData.name, 3, 30)) {
            toast.error("El nombre solo puede tener letras y espacios (3 a 30 caracteres)");
            return;
        }
        if (!isSafeText(formData.description, 5, 300)) {
            toast.error("La descripción debe tener entre 5 y 300 caracteres válidos");
            return;
        }

        try {
            if (editingCategory) {
                const response = await apiFetch(
                    `/api/categories/${editingCategory._id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            name: formData.name,
                            description: formData.description,
                            isActive: true,
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error("Error al actualizar");
                }

                toast.success("Categoría actualizada");
            } else {
                const response = await apiFetch(
                    "/api/categories",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            name: formData.name,
                            description: formData.description,
                            isActive: true,
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error("Error al crear");
                }

                toast.success("Categoría creada");
            }

            await loadCategories();

            setIsModalOpen(false);

            setFormData({
                name: "",
                description: "",
            });
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    return {
        categories,
        isModalOpen,
        setIsModalOpen,
        editingCategory,
        isLoading,
        formData,
        setFormData,
        stats,
        openCreateModal,
        openEditModal,
        handleDeleteCategory,
        handleSubmit,
    };
}