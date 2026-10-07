import { useEffect, useMemo, useState } from "react";
import { shopApi, productView } from "../api/shop";
import { useShop } from "../context/ShopContext";

// Busqueda de productos y busquedas recientes
export default function useSearch() {
  const { recentSearches, addRecentSearch, removeRecentSearch } = useShop();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    shopApi
      .products()
      .then((data) => setProducts(data.filter((p) => p.isActive !== false).map(productView)))
      .catch(() => {});
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) =>
      `${p.name} ${p.description || ""} ${p.categoryId?.name || ""}`.toLowerCase().includes(q)
    );
  }, [products, query]);

  const submit = () => addRecentSearch(query);
  const clearRecents = () => recentSearches.forEach(removeRecentSearch);

  return {
    query,
    setQuery,
    products,
    results,
    recentSearches,
    removeRecentSearch,
    clearRecents,
    submit,
  };
}
