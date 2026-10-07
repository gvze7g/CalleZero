import { useEffect, useState } from "react";
import { shopApi, productView } from "../api/shop";
import { useShop } from "../context/ShopContext";

// Detalle de producto: se refresca desde GET /api/product/:id
export default function useProductDetail(navigation, passed = {}) {
  const { addToCart, favorites, toggleFavorite } = useShop();
  const [product, setProduct] = useState(passed);

  useEffect(() => {
    if (!passed.id) return;
    shopApi
      .product(passed.id)
      .then((p) => setProduct(productView(p)))
      .catch(() => {});
  }, [passed.id]);

  const gallery = product.gallery?.length ? product.gallery : product.image ? [product.image] : [];
  const sizes = product.sizes?.length ? product.sizes : ["Única"];
  const stock = Number(product.stock) || 0;
  const outOfStock = stock <= 0;

  const [size, setSize] = useState(sizes[0]);
  const [qty, setQty] = useState(1);

  const changeQty = (v) => setQty(Math.max(1, Math.min(v, stock || 1)));
  const total = (Number(product.price || 0) * qty).toFixed(2);
  const isFavorite = favorites.some((f) => f.id === product.id);

  const addAndGoToCart = () => {
    addToCart(product, size, qty);
    navigation.navigate("Tabs", { screen: "Carrito" });
  };

  return {
    product,
    gallery,
    sizes,
    stock,
    outOfStock,
    size,
    setSize,
    qty,
    changeQty,
    total,
    isFavorite,
    toggleFavorite: () => toggleFavorite(product),
    addAndGoToCart,
  };
}
