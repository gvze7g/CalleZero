import { useCallback, useEffect, useState } from "react";
import { shopApi, productView } from "../api/shop";
import { useShop } from "../context/ShopContext";

// Productos y categorias de la pantalla Inicio
export default function useHomeShop() {
  const { addToCart, cartCount } = useShop();
  const [activeCat, setActiveCat] = useState("all");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [p, c] = await Promise.all([shopApi.products(), shopApi.categories()]);
      setProducts(p.filter((x) => x.isActive !== false && x.stock > 0).map(productView));
      setCategories(c);
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

  const recommended = products
    .filter((p) => activeCat === "all" || p.categoryId?._id === activeCat)
    .slice(0, 6);

  return {
    products,
    categories,
    recommended,
    activeCat,
    setActiveCat,
    loading,
    refreshing,
    refresh,
    addToCart,
    cartCount,
  };
}
