import { useCallback, useEffect, useMemo, useState } from "react";
import { shopApi, productView } from "../api/shop";
import { useShop } from "../context/ShopContext";

export const sortOptions = ["Popular", "Novedades", "Precio: menor", "Precio: mayor"];

// Catalogo con orden y filtro por categoria
export default function useCatalog() {
  const { addToCart } = useShop();
  const [sortIndex, setSortIndex] = useState(0);
  const [filters, setFilters] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await shopApi.products();
      setProducts(data.filter((p) => p.isActive !== false).map(productView));
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = () => {
    setRefreshing(true);
    load();
  };

  const filtered = useMemo(
    () =>
      products
        .filter((p) => !filters.length || filters.includes(p.categoryId?.name))
        .sort((a, b) => {
          if (sortIndex === 1) return new Date(b.createdAt) - new Date(a.createdAt);
          if (sortIndex === 2) return a.price - b.price;
          if (sortIndex === 3) return b.price - a.price;
          return 0;
        }),
    [products, filters, sortIndex]
  );

  const nextSort = () => setSortIndex((i) => (i + 1) % sortOptions.length);

  const toggleAllFilters = () =>
    setFilters(
      filters.length
        ? []
        : [...new Set(products.map((p) => p.categoryId?.name).filter(Boolean))]
    );

  const removeFilter = (f) => setFilters((list) => list.filter((x) => x !== f));
  const clearFilters = () => setFilters([]);

  return {
    sort: sortOptions[sortIndex],
    nextSort,
    filters,
    toggleAllFilters,
    removeFilter,
    clearFilters,
    filtered,
    loading,
    refreshing,
    refresh,
    addToCart,
  };
}
