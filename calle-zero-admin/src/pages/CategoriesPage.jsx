import useCategories from "../hooks/useCategories.js";
import { Plus } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import StatCard from "../components/shared/StatCard";
import Modal from "../components/shared/Modal";
import CategoriesGrid from "../components/categories/CategoriesGrid";

const CategoriesPage = () => {
    const {
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
} = useCategories();

    return (
        <AdminLayout>
            {/* HEADER */}
            <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="font-[Montserrat] text-[28px] font-extrabold text-white sm:text-[32px] md:text-[40px]">
                            Categorías
                        </h1>

                        <span className="rounded-full border border-white/10 px-3 py-1 font-[Open_Sans] text-[12px] text-white/35">
                            Admin
                        </span>
                    </div>

                    <p className="mt-2 font-[Open_Sans] text-[14px] text-white/72 sm:text-[15px]">
                        Administra las agrupaciones de productos de Calle Zero.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex h-[46px] items-center justify-center gap-2 rounded-[10px] bg-[#6F6A68] px-5 font-[Open_Sans] text-[13px] font-bold text-white transition hover:bg-[#7a7570] sm:text-[14px]"
                >
                    <Plus size={18} />
                    Nueva Categoría
                </button>
            </section>

            {/* STATS */}
            <section className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((item) => (
                    <StatCard 
                        key={item.title} 
                        title={item.title}
                        value={item.value}
                        isLoading={isLoading}
                    />
                ))}
            </section>

            {/* CATEGORÍAS GRID */}
            <CategoriesGrid
                categories={categories}
                onCreateCategory={openCreateModal}
                onEditCategory={openEditModal}
                onDeleteCategory={handleDeleteCategory}
                isLoading={isLoading}
            />

            {/* MODAL */}
            {isModalOpen && (
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
                                className="mt-2 h-[42px] w-full rounded-[8px] border border-white/10 bg-black px-4 font-[Open_Sans] text-white outline-none focus:border-white/30"
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
                                className="mt-2 h-[110px] w-full resize-none rounded-[8px] border border-white/10 bg-black p-4 font-[Open_Sans] text-white outline-none focus:border-white/30"
                                placeholder="Describe la categoría..."
                            />
                        </label>

                        <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="h-[44px] rounded-[10px] border border-white/10 bg-black font-[Open_Sans] text-[14px] font-bold text-white transition hover:bg-white/5"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="h-[44px] rounded-[10px] bg-[#6F6A68] font-[Open_Sans] text-[14px] font-bold text-white transition hover:bg-[#7a7570]"
                            >
                                {editingCategory
                                    ? "Guardar Cambios"
                                    : "Crear Categoría"}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </AdminLayout>
    );
};

export default CategoriesPage;