import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function useCategories(limit) {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    useEffect(() => {
        const loadCategories = async () => {
            setIsLoading(true);
            setLoadError(null);

            try {
                const response = await fetch("http://localhost:4000/api/categories", {
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("No se pudieron cargar las categorías");
                }

                const data = await response.json();
                setCategories(limit ? data.slice(0, limit) : data);
            } catch (error) {
                console.error(error);
                setLoadError(error.message);
                toast.error("Error al cargar categorías");
            } finally {
                setIsLoading(false);
            }
        };

        loadCategories();
    }, [limit]);

    return { categories, isLoading, loadError };
}