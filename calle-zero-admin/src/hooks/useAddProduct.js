import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const MAX_IMAGES = 4;
const MAX_IMAGE_SIZE_MB = 5;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function useAddProduct() {
    const navigate = useNavigate();
    const location = useLocation();

    const mode = location.state?.mode || "create";
    const product = location.state?.product;

    const [categories, setCategories] = useState([]);

    // Tallas: array de strings seleccionadas (antes era una sola)
    const [selectedSizes, setSelectedSizes] = useState(() => {
        if (Array.isArray(product?.size) && product.size.length > 0) {
            return product.size;
        }
        return [];
    });

    // OJO: el campo real en el modelo de Mongo es "imageUrl", no "images"
    const [imageFiles, setImageFiles] = useState(() => {
        const existing = product?.imageUrl || [];
        const slots = Array(MAX_IMAGES).fill(null);
        existing.slice(0, MAX_IMAGES).forEach((img, i) => {
            slots[i] = img;
        });
        return slots;
    });

    const [imagePreviews, setImagePreviews] = useState(() => {
        const existing = product?.imageUrl || [];
        const slots = Array(MAX_IMAGES).fill(null);
        existing.slice(0, MAX_IMAGES).forEach((img, i) => {
            slots[i] = img;
        });
        return slots;
    });

    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: product?.name || "",
        description: product?.description || "",
        categoryId: product?.categoryId?._id || product?.categoryId || "",
        sku: product?.code || "",
        price:
            product?.price !== undefined && product?.price !== null
                ? String(product.price)
                : "",
        stock:
            product?.stock !== undefined && product?.stock !== null
                ? String(product.stock)
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

    useEffect(() => {
        return () => {
            imagePreviews.forEach((preview) => {
                if (preview && preview.startsWith("blob:")) {
                    URL.revokeObjectURL(preview);
                }
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const toggleSize = (size) => {
        setSelectedSizes((prev) => {
            const next = prev.includes(size)
                ? prev.filter((s) => s !== size)
                : [...prev, size];
            return next;
        });

        if (errors.size) {
            setErrors((prev) => ({ ...prev, size: undefined }));
        }
    };

    const validateImageFile = (file) => {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            return "Formato no permitido. Usa JPG, PNG o WEBP";
        }
        if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
            return `La imagen no puede pesar más de ${MAX_IMAGE_SIZE_MB}MB`;
        }
        return null;
    };

    const handleImageChange = (index, file) => {
        if (index < 0 || index >= MAX_IMAGES) return;

        if (!file) {
            setImageFiles((prev) => {
                const next = [...prev];
                next[index] = null;
                return next;
            });
            setImagePreviews((prev) => {
                const next = [...prev];
                if (next[index] && next[index].startsWith("blob:")) {
                    URL.revokeObjectURL(next[index]);
                }
                next[index] = null;
                return next;
            });
            return;
        }

        const error = validateImageFile(file);
        if (error) {
            toast.error(error);
            return;
        }

        setImageFiles((prev) => {
            const next = [...prev];
            next[index] = file;
            return next;
        });

        setImagePreviews((prev) => {
            const next = [...prev];
            if (next[index] && next[index].startsWith("blob:")) {
                URL.revokeObjectURL(next[index]);
            }
            next[index] = URL.createObjectURL(file);
            return next;
        });

        setErrors((prev) => ({ ...prev, images: undefined }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "El nombre es obligatorio";
        } else if (formData.name.trim().length < 3) {
            newErrors.name = "El nombre debe tener al menos 3 caracteres";
        }

        if (!formData.categoryId || !String(formData.categoryId).trim()) {
            newErrors.categoryId = "Selecciona una categoría";
        }

        if (!formData.price || !String(formData.price).trim()) {
            newErrors.price = "El precio es obligatorio";
        } else {
            const priceNumber = Number(formData.price);
            if (Number.isNaN(priceNumber)) {
                newErrors.price = "El precio debe ser un número válido";
            } else if (priceNumber <= 0) {
                newErrors.price = "El precio debe ser mayor a 0";
            }
        }

        if (!formData.stock || !String(formData.stock).trim()) {
            newErrors.stock = "El stock es obligatorio";
        } else {
            const stockNumber = Number(formData.stock);
            if (Number.isNaN(stockNumber)) {
                newErrors.stock = "El stock debe ser un número válido";
            } else if (stockNumber < 0 || !Number.isInteger(stockNumber)) {
                newErrors.stock = "El stock debe ser un entero mayor o igual a 0";
            }
        }

        if (selectedSizes.length === 0) {
            newErrors.size = "Selecciona al menos una talla";
        }

        const hasAtLeastOneImage = imageFiles.some((img) => img !== null);
        if (!hasAtLeastOneImage) {
            newErrors.images = "Agrega al menos una imagen del producto";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error(Object.values(newErrors)[0]);
            return false;
        }

        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const productFormData = new FormData();

            productFormData.append("name", formData.name.trim());
            productFormData.append("description", formData.description.trim());
            productFormData.append("categoryId", formData.categoryId);
            productFormData.append("price", Number(formData.price));
            productFormData.append("stock", Number(formData.stock));
            productFormData.append("sku", formData.sku || "");
            productFormData.append("size", JSON.stringify(selectedSizes));
            productFormData.append("isActive", true);

            imageFiles.forEach((img) => {
                if (img instanceof File) {
                    productFormData.append("images", img);
                }
            });

            if (mode === "edit") {
                const remainingUrls = imageFiles.filter(
                    (img) => typeof img === "string"
                );
                productFormData.append(
                    "existingImages",
                    JSON.stringify(remainingUrls)
                );
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
                toast.message("Los cambios ya están disponibles en el catálogo");
            } else {
                toast.success("Producto creado correctamente");
                toast.message("El producto fue agregado al inventario");
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
        selectedSizes,
        toggleSize,
        availableSizes: AVAILABLE_SIZES,
        handleChange,
        imageFiles,
        imagePreviews,
        handleImageChange,
        errors,
        handleSubmit,
        maxImages: MAX_IMAGES,
    };
}