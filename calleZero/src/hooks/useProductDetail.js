import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useCart from "./useCart";
import useAuth from "./useAuth";

export default function useProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    const [relatedProducts, setRelatedProducts] = useState([]);

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        const loadProduct = async () => {
            setIsLoading(true);
            setLoadError(null);
            setSelectedImageIndex(0);
            setSelectedSize(null);
            setQuantity(1);

            try {
                const response = await fetch(
                    `http://localhost:4000/api/product/${id}`,
                    { credentials: "include" }
                );

                if (!response.ok) {
                    throw new Error("Producto no encontrado");
                }

                const data = await response.json();
                setProduct(data);

                if (Array.isArray(data.size) && data.size.length > 0) {
                    setSelectedSize(data.size[0]);
                }
            } catch (error) {
                console.error(error);
                setLoadError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    useEffect(() => {
        const loadRelated = async () => {
            if (!product?.categoryId) return;

            try {
                const response = await fetch("http://localhost:4000/api/product", {
                    credentials: "include",
                });

                if (!response.ok) return;

                const allProducts = await response.json();
                const currentCategoryId =
                    product.categoryId._id || product.categoryId;

                const filtered = allProducts
                    .filter((p) => p._id !== product._id)
                    .filter(
                        (p) =>
                            (p.categoryId?._id || p.categoryId) ===
                            currentCategoryId
                    )
                    .slice(0, 4);

                setRelatedProducts(filtered);
            } catch (error) {
                console.error(error);
            }
        };

        loadRelated();
    }, [product]);

    const images = product?.imageUrl?.length > 0 ? product.imageUrl : [];
    const currentImage = images[selectedImageIndex];
    const availableSizes = Array.isArray(product?.size) ? product.size : [];
    const stock = Number(product?.stock) || 0;
    const isOutOfStock = stock <= 0;
    const categoryName = product?.categoryId?.name || "Calle Zero";

    const handleAddToCart = () => {
        if (isOutOfStock) {
            toast.error("Este producto no tiene stock disponible");
            return;
        }

        if (availableSizes.length > 0 && !selectedSize) {
            toast.error("Selecciona una talla");
            return;
        }

        if (!isAuthenticated) {
            toast.error("Debes iniciar sesión para agregar productos al carrito");
            navigate("/login");
            return;
        }

        addToCart(product, selectedSize || "Única", quantity);

        toast.success(
            `${product.name} añadido al carrito. ${
                selectedSize ? `Talla ${selectedSize}, ` : ""
            }cantidad ${quantity}`
        );
    };

    const handleFavorite = () => {
        setIsFavorite((prev) => !prev);

        if (!isFavorite) {
            toast.success("Producto agregado a favoritos");
        } else {
            toast.info("Producto eliminado de favoritos");
        }
    };

    const handleSizeGuide = () => {
        toast.info(
            availableSizes.length > 0
                ? `Guía de tallas: ${availableSizes.join(", ")} disponibles`
                : "No hay tallas disponibles para este producto"
        );
    };

    const increaseQuantity = () => {
        setQuantity((prev) => {
            if (prev >= stock) {
                toast.info("No hay más stock disponible");
                return prev;
            }
            return prev + 1;
        });
    };

    const decreaseQuantity = () => {
        setQuantity((prev) => Math.max(1, prev - 1));
    };

    return {
        navigate,
        product,
        isLoading,
        loadError,
        relatedProducts,
        images,
        currentImage,
        selectedImageIndex,
        setSelectedImageIndex,
        availableSizes,
        selectedSize,
        setSelectedSize,
        stock,
        isOutOfStock,
        categoryName,
        quantity,
        increaseQuantity,
        decreaseQuantity,
        isFavorite,
        handleAddToCart,
        handleFavorite,
        handleSizeGuide,
    };
}