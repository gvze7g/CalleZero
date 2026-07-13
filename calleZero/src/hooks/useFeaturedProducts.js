import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function useFeaturedProducts(limit = 4) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            setIsLoading(true);
            setLoadError(null);

            try {
                const response = await fetch("http://localhost:4000/api/product", {
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("No se pudieron cargar los productos");
                }

                const data = await response.json();
                setProducts(data.slice(0, limit));
            } catch (error) {
                console.error(error);
                setLoadError(error.message);
                toast.error("Error al cargar productos");
            } finally {
                setIsLoading(false);
            }
        };

        loadProducts();
    }, [limit]);

    return { products, isLoading, loadError };
}