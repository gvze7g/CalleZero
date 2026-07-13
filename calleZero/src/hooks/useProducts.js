import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const DEFAULT_VISIBLE = 12;
const LOAD_MORE_STEP = 4;
const MAX_PRICE = 200;

export default function useProducts() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const categoryParam = searchParams.get("category");
    const selectedCategories = categoryParam ? categoryParam.split(",") : [];

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    const [showCategories, setShowCategories] = useState(true);
    const [showPrice, setShowPrice] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [visibleProducts, setVisibleProducts] = useState(DEFAULT_VISIBLE);
    const [price, setPrice] = useState(MAX_PRICE);
    const [priceFilterActive, setPriceFilterActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("new");
    const [viewMode, setViewMode] = useState("grid");

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
                setProducts(data);
            } catch (error) {
                console.error(error);
                setLoadError(error.message);
                toast.error("Error al cargar productos");
            } finally {
                setIsLoading(false);
            }
        };

        loadProducts();
    }, []);

    useEffect(() => {
        if (!showMobileFilters) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [showMobileFilters]);

    const availableCategories = useMemo(() => {
        const map = new Map();

        products.forEach((product) => {
            const cat = product.categoryId;
            if (cat && cat._id && !map.has(cat._id)) {
                map.set(cat._id, cat.name);
            }
        });

        return Array.from(map, ([id, name]) => ({ id, name }));
    }, [products]);

    const toggleCategory = (categoryId) => {
        let updatedCategories;

        if (selectedCategories.includes(categoryId)) {
            updatedCategories = selectedCategories.filter((c) => c !== categoryId);
        } else {
            updatedCategories = [...selectedCategories, categoryId];
        }

        if (updatedCategories.length === 0) {
            navigate("/products");
        } else {
            navigate(`/products?category=${updatedCategories.join(",")}`);
        }

        setVisibleProducts(DEFAULT_VISIBLE);
    };

    const clearFilters = () => {
        navigate("/products");
        setPrice(MAX_PRICE);
        setPriceFilterActive(false);
        setSearchTerm("");
        setSortOption("new");
        setVisibleProducts(DEFAULT_VISIBLE);
    };

    const closeMobileFiltersAndClear = () => {
        clearFilters();
        setShowMobileFilters(false);
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setVisibleProducts(DEFAULT_VISIBLE);
    };

    const handleSortChange = (value) => {
        setSortOption(value);
        setVisibleProducts(DEFAULT_VISIBLE);
    };

    const filteredProducts = useMemo(() => {
        return products
            .filter((product) =>
                selectedCategories.length > 0
                    ? selectedCategories.includes(product.categoryId?._id)
                    : true
            )
            .filter((product) =>
                priceFilterActive ? Number(product.price) <= price : true
            )
            .filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                if (sortOption === "price-low") {
                    return Number(a.price) - Number(b.price);
                }

                if (sortOption === "price-high") {
                    return Number(b.price) - Number(a.price);
                }

                return new Date(b.createdAt) - new Date(a.createdAt);
            });
    }, [products, selectedCategories, priceFilterActive, price, searchTerm, sortOption]);

    const hasFilters =
        selectedCategories.length > 0 ||
        priceFilterActive ||
        searchTerm.trim() !== "" ||
        sortOption !== "new";

    const showMore = () => {
        setVisibleProducts((prev) => prev + LOAD_MORE_STEP);
    };

    const showLess = () => {
        setVisibleProducts(DEFAULT_VISIBLE);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return {
        navigate,
        isLoading,
        loadError,
        availableCategories,
        selectedCategories,
        toggleCategory,
        showCategories,
        setShowCategories,
        showPrice,
        setShowPrice,
        showMobileFilters,
        setShowMobileFilters,
        price,
        setPrice,
        priceFilterActive,
        setPriceFilterActive,
        searchTerm,
        handleSearchChange,
        sortOption,
        handleSortChange,
        viewMode,
        setViewMode,
        filteredProducts,
        visibleProducts,
        hasFilters,
        clearFilters,
        closeMobileFiltersAndClear,
        showMore,
        showLess,
        maxPrice: MAX_PRICE,
    };
}