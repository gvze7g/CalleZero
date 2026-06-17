import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function useAddProduct() {
    const navigate = useNavigate();
    const location = useLocation();

    const mode = location.state?.mode || "create";
    const product = location.state?.product;

    const [selectedSize, setSelectedSize] = useState("M");
    const [categories, setCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);

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

        loadCategories();
    }, []);

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleImageChange = (file) => {
        setImageFile(file);
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
            const productFormData = new FormData();

            productFormData.append("name", formData.name);
            productFormData.append("description", formData.description);
            productFormData.append("categoryId", formData.categoryId);
            productFormData.append("price", Number(formData.price));
            productFormData.append("stock", 0);
            productFormData.append("sku", formData.sku || "");
            productFormData.append("size", JSON.stringify([selectedSize]));
            productFormData.append("isActive", true);

            if (imageFile) {
                productFormData.append("image", imageFile);
            }

            const url =
                mode === "edit"
                    ? `http://localhost:4000/api/product/${product._id}`
                    : "http://localhost:4000/api/product";

            const method = mode === "edit" ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                credentials: "include",
                body: productFormData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error al guardar");
            }

            if (mode === "edit") {
                toast.success("Producto actualizado correctamente");
                toast.message(
                    "Los cambios ya están disponibles en el catálogo"
                );
            } else {
                toast.success("Producto creado correctamente");
                toast.message(
                    "El producto fue agregado al inventario"
                );
            }

            navigate("/products", {
                state: { refresh: true },
            });
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    return {
        navigate,
        mode,
        formData,
        categories,
        selectedSize,
        setSelectedSize,
        handleChange,
        handleImageChange,
        handleSubmit,
    };
}