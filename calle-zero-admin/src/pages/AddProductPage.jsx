import React, { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AdminLayout from "../components/layout/AdminLayout";
import ProductGeneralForm from "../components/addProduct/ProductGeneralForm";
import ProductClassificationForm from "../components/addProduct/ProductClassificationForm";
import ProductPriceCard from "../components/addProduct/ProductPriceCard";
import ProductMediaCard from "../components/addProduct/ProductMediaCard";
import ProductAdviceCard from "../components/addProduct/ProductAdviceCard";

const AddProductPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const mode = location.state?.mode || "create";
    const product = location.state?.product;

    const [selectedSize, setSelectedSize] = useState("M");
    const [categories, setCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null); // ← AGREGAR ESTO

    const [formData, setFormData] = useState({
        name: product?.name || "",
        description: product?.description || "",
        categoryId: product?.categoryId?._id || product?.categoryId || "",
        sku: product?.code || "",
        price:
            product?.price !== undefined && product?.price !== null
                ? String(product.price)
                : "",
    });

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetch(
                    "http://localhost:4000/api/categories",
                    { credentials: "include" }
                );

                if (!response.ok) throw new Error("Error loading categories");

                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error(error);
                toast.error("Error al cargar categorías");
            }
        };

        loadCategories();
    }, []);

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleImageChange = (file) => {
        setImageFile(file); // ← AGREGAR ESTO
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !formData.name.trim() ||
            !formData.categoryId.trim() ||
            !formData.price.trim()
        ) {
            toast.error("Completa nombre, categoría y precio");
            return;
        }

        try {
            // ← CAMBIAR A FormData
            const productFormData = new FormData();
            productFormData.append("name", formData.name);
            productFormData.append("description", formData.description);
            productFormData.append("categoryId", formData.categoryId);
            productFormData.append("price", Number(formData.price));
            productFormData.append("stock", 0);
            productFormData.append("size", JSON.stringify([selectedSize]));
            productFormData.append("isActive", true);

            if (imageFile) {
                productFormData.append("file", imageFile); // ← AGREGAR IMAGEN
            }

            const url =
                mode === "edit"
                    ? `http://localhost:4000/api/product/${product._id}`
                    : "http://localhost:4000/api/product";

            const method = mode === "edit" ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                credentials: "include",
                body: productFormData, // ← SIN headers Content-Type
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error al guardar");
            }

            // 🔥 TOASTS PRO
            if (mode === "edit") {
                toast.success("Producto actualizado correctamente");
                toast.message("Los cambios ya están disponibles en el catálogo");
            } else {
                toast.success("Producto creado correctamente");
                toast.message("El producto fue agregado al inventario");
            }

            navigate("/products", { state: { refresh: true } });

        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

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
                        />

                        <ProductClassificationForm
                            formData={formData}
                            onChange={handleChange}
                            selectedSize={selectedSize}
                            onSelectSize={setSelectedSize}
                            categories={categories}
                        />
                    </div>

                    <div className="space-y-6">
                        <ProductPriceCard
                            formData={formData}
                            onChange={handleChange}
                        />

                        <ProductMediaCard onImageChange={handleImageChange} /> {/* ← AGREGAR PROP */}

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