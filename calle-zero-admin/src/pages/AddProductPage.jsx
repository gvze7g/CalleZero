import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "../components/layout/AdminLayout";
import ProductGeneralForm from "../components/addProduct/ProductGeneralForm";
import ProductClassificationForm from "../components/addProduct/ProductClassificationForm";
import ProductPriceCard from "../components/addProduct/ProductPriceCard";
import ProductMediaCard from "../components/addProduct/ProductMediaCard";
import ProductAdviceCard from "../components/addProduct/ProductAdviceCard";
import useAddProduct from "../hooks/useAddProduct";

const AddProductPage = () => {
    const {
        navigate,
        mode,
        formData,
        categories,
        selectedSizes,
        toggleSize,
        availableSizes,
        handleChange,
        imagePreviews,
        handleImageChange,
        errors,
        handleSubmit,
        maxImages,
    } = useAddProduct();

    return (
        <AdminLayout>
            <section className="mx-auto max-w-[980px]">
                <button
                    type="button"
                    onClick={() => navigate("/products")}
                    className="flex items-center gap-2 text-white/70 hover:text-white"
                >
                    <ChevronLeft size={17} />
                    Volver a Productos
                </button>

                <h1 className="mt-6 text-[32px] font-extrabold text-white md:text-[40px]">
                    {mode === "edit"
                        ? "Editar Producto"
                        : "Agregar Nuevo Producto"}
                </h1>

                <p className="mt-2 text-white/72">
                    {mode === "edit"
                        ? "Actualiza la información del producto seleccionado."
                        : "Complete los detalles para añadir un nuevo artículo al catálogo."}
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]"
                >
                    <div className="space-y-6">
                        <ProductGeneralForm
                            formData={formData}
                            onChange={handleChange}
                            errors={errors}
                        />

                        <ProductClassificationForm
                            formData={formData}
                            onChange={handleChange}
                            selectedSizes={selectedSizes}
                            onToggleSize={toggleSize}
                            availableSizes={availableSizes}
                            categories={categories}
                            errors={errors}
                        />
                    </div>

                    <div className="space-y-6">
                        <ProductPriceCard
                            formData={formData}
                            onChange={handleChange}
                            errors={errors}
                        />

                        <ProductMediaCard
                            previews={imagePreviews}
                            onImageChange={handleImageChange}
                            maxImages={maxImages}
                            error={errors.images}
                        />

                        <button
                            type="submit"
                            className="h-[52px] w-full rounded-[10px] bg-[#6F6A68] font-bold text-white"
                        >
                            {mode === "edit"
                                ? "✓ Actualizar Producto"
                                : "✓ Guardar Producto"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                toast.info("Operación cancelada");
                                navigate("/products");
                            }}
                            className="h-[46px] w-full rounded-[10px] border border-white/10 bg-black font-bold text-white"
                        >
                            Cancelar
                        </button>
                    </div>

                    <div className="lg:col-span-2">
                        <ProductAdviceCard />
                    </div>
                </form>
            </section>
        </AdminLayout>
    );
};

export default AddProductPage;