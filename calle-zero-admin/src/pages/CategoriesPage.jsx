import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "../components/layout/AdminLayout";
import StatCard from "../components/shared/StatCard";
import Modal from "../components/shared/Modal";
import CategoriesGrid from "../components/categories/CategoriesGrid";
import { categoryStats } from "../data/adminData";

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        products: "0",
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await fetch(
                "http://localhost:4000/api/categories"
            );

            if (!response.ok) {
                throw new Error("Error loading categories");
            }

            const data = await response.json();

            setCategories(data);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar categorías");
        }
    };

    const openCreateModal = () => {
        setEditingCategory(null);

        setFormData({
            name: "",
            description: "",
            products: "0",
        });

        setIsModalOpen(true);
    };

    const openEditModal = (category) => {
        setEditingCategory(category);

        setFormData({
            name: category.name || "",
            description: category.description || "",
            products: "0",
        });

        setIsModalOpen(true);
    };

    const handleDeleteCategory = async (category) => {
        try {
            const response = await fetch(
                `http://localhost:4000/api/categories/${category._id}`,
                {
                    method: "DELETE",
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

        try {
            if (editingCategory) {
                const response = await fetch(
                    `http://localhost:4000/api/categories/${editingCategory._id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
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
                const response = await fetch(
                    "http://localhost:4000/api/categories",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
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
                products: "0",
            });
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    return (
        <AdminLayout>
            <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="font-[Montserrat] text-[32px] font-extrabold text-white md:text-[40px]">
                            Categorías
                        </h1>

                        <span className="rounded-full border border-white/10 px-3 py-1 font-[Open_Sans] text-[12px] text-white/35">
                            Admin
                        </span>
                    </div>

                    <p className="mt-2 font-[Open_Sans] text-[15px] text-white/72">
                        Administra las agrupaciones de productos de Calle Zero.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex h-[46px] items-center justify-center gap-2 rounded-[10px] bg-[#6F6A68] px-5 font-[Open_Sans] text-[14px] font-bold text-white"
                >
                    <Plus size={17} />
                    Nueva Categoría
                </button>
            </section>

            <section className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
                {categoryStats.map((item) => (
                    <StatCard key={item.title} {...item} />
                ))}
            </section>

            <CategoriesGrid
                categories={categories}
                onCreateCategory={openCreateModal}
                onEditCategory={openEditModal}
                onDeleteCategory={handleDeleteCategory}
            />

            {isModalOpen ? (
                <Modal
                    title={editingCategory ? "Editar Categoría" : "Nueva Categoría"}
                    onClose={() => setIsModalOpen(false)}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="block">
                            <span className="font-[Open_Sans] text-[14px] font-bold text-white">
                                Nombre
                            </span>

                            <input
                                value={formData.name}
                                onChange={(event) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        name: event.target.value,
                                    }))
                                }
                                className="mt-2 h-[42px] w-full rounded-[8px] border border-white/10 bg-black px-4 font-[Open_Sans] text-white outline-none"
                                placeholder="Ej: Sneakers"
                            />
                        </label>

                        <label className="block">
                            <span className="font-[Open_Sans] text-[14px] font-bold text-white">
                                Descripción
                            </span>

                            <textarea
                                value={formData.description}
                                onChange={(event) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        description: event.target.value,
                                    }))
                                }
                                className="mt-2 h-[110px] w-full resize-none rounded-[8px] border border-white/10 bg-black p-4 font-[Open_Sans] text-white outline-none"
                                placeholder="Describe la categoría..."
                            />
                        </label>

                        <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="h-[44px] rounded-[10px] border border-white/10 bg-black font-[Open_Sans] text-[14px] font-bold text-white"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="h-[44px] rounded-[10px] bg-[#6F6A68] font-[Open_Sans] text-[14px] font-bold text-white"
                            >
                                {editingCategory
                                    ? "Guardar Cambios"
                                    : "Crear Categoría"}
                            </button>
                        </div>
                    </form>
                </Modal>
            ) : null}
        </AdminLayout>
    );
};

export default CategoriesPage;