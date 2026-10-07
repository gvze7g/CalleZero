import { useEffect, useMemo, useState } from "react";
import { shopApi, productView } from "../api/shop";
import { useShop } from "../context/ShopContext";
import { categoryFallback } from "../data/shop";

// Busqueda de productos, categorias y busquedas recientes
export default function useSearch() {
  const { recentSearches, addRecentSearch, removeRecentSearch } = useShop();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    Promise.all([shopApi.products(), shopApi.categories()])
      .then(([p, c]) => {
        setProducts(p.filter((x) => x.isActive !== false).map(productView));
        setCategories(c.filter((x) => x.isActive !== false));
      })
      .catch(() => {});
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) =>
      `${p.name} ${p.description || ""} ${p.categoryId?.name || ""}`.toLowerCase().includes(q)
    );
  }, [products, query]);

  // Cada categoria con la foto de uno de sus productos
  const categoryTiles = useMemo(
    () =>
      categories.map((c) => {
        const inCategory = products.filter((p) => p.categoryId?._id === c._id);
        return {
          id: c._id,
          name: c.name,
          label: c.name.toUpperCase(),
          tag: `${inCategory.length} ${inCategory.length === 1 ? "producto" : "productos"}`,
          image: inCategory.find((p) => p.image)?.image || categoryFallback,
        };
      }),
    [categories, products]
  );

  const submit = () => addRecentSearch(query);
  const clearRecents = () => recentSearches.forEach(removeRecentSearch);

  return {
    query,
    setQuery,
    products,
    results,
    categoryTiles,
    recentSearches,
    removeRecentSearch,
    clearRecents,
    submit,
  };
}
