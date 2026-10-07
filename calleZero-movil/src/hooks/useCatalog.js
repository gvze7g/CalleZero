import { useCallback, useEffect, useMemo, useState } from "react";
import { shopApi, productView } from "../api/shop";
import { useShop } from "../context/ShopContext";

export const sortOptions = ["Popular", "Novedades", "Precio: menor", "Precio: mayor"];

export const priceRanges = [
  { id: "all", label: "Todos", min: 0, max: Infinity },
  { id: "0-30", label: "Hasta $30", min: 0, max: 30 },
  { id: "30-60", label: "$30 - $60", min: 30, max: 60 },
  { id: "60+", label: "Más de $60", min: 60, max: Infinity },
];

// Catalogo con orden, filtros por categoria, precio y stock
export default function useCatalog(params = {}) {
  const { addToCart } = useShop();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [sortIndex, setSortIndex] = useState(0);
  const [selectedCats, setSelectedCats] = useState(params.category ? [params.category] : []);
  const [priceId, setPriceId] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(Boolean(params.openFilters));
  const [columns, setColumns] = useState(2);

  const load = useCallback(async () => {
    try {
      const [p, c] = await Promise.all([shopApi.products(), shopApi.categories()]);
      setProducts(p.filter((x) => x.isActive !== false).map(productView));
      setCategories(c.filter((x) => x.isActive !== false));
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

  const filtered = useMemo(() => {
    const range = priceRanges.find((r) => r.id === priceId);
    return products
      .filter((p) => !selectedCats.length || selectedCats.includes(p.categoryId?.name))
      .filter((p) => p.price >= range.min && p.price < range.max)
      .filter((p) => !inStockOnly || p.stock > 0)
      .sort((a, b) => {
        if (sortIndex === 1) return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortIndex === 2) return a.price - b.price;
        if (sortIndex === 3) return b.price - a.price;
        return b.stock - a.stock;
      });
  }, [products, selectedCats, priceId, inStockOnly, sortIndex]);

  const toggleCategory = (name) =>
    setSelectedCats((list) => (list.includes(name) ? list.filter((x) => x !== name) : [...list, name]));

  const clearFilters = () => {
    setSelectedCats([]);
    setPriceId("all");
    setInStockOnly(false);
    setSortIndex(0);
  };

  // Chips de filtros activos (para quitarlos rapido)
  const activeChips = [
    ...selectedCats.map((c) => ({ key: `c-${c}`, label: c, remove: () => toggleCategory(c) })),
    ...(priceId !== "all" ? [{ key: "price", label: priceRanges.find((r) => r.id === priceId).label, remove: () => setPriceId("all") }] : []),
    ...(inStockOnly ? [{ key: "stock", label: "Con stock", remove: () => setInStockOnly(false) }] : []),
  ];

  return {
    filtered,
    categories,
    loading,
    refreshing,
    refresh,
    addToCart,
    sort: sortOptions[sortIndex],
    sortIndex,
    setSortIndex,
    nextSort: () => setSortIndex((i) => (i + 1) % sortOptions.length),
    selectedCats,
    toggleCategory,
    priceId,
    setPriceId,
    inStockOnly,
    setInStockOnly,
    clearFilters,
    activeChips,
    filtersOpen,
    setFiltersOpen,
    columns,
    toggleColumns: () => setColumns((c) => (c === 2 ? 1 : 2)),
  };
}
