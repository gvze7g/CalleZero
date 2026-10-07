import { useState } from "react";
import { useShop } from "../context/ShopContext";

// Carrito guardado en el dispositivo
export default function useCart() {
  const { cart: items, changeQuantity } = useShop();
  const [promo, setPromo] = useState("");

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemsCount = items.reduce((n, item) => n + item.quantity, 0);

  const removeItem = (item) => changeQuantity(item.id, item.size, 0);
  const setItemQuantity = (item, q) => changeQuantity(item.id, item.size, q);

  return {
    items,
    itemsCount,
    subtotal,
    total: subtotal,
    promo,
    setPromo,
    removeItem,
    setItemQuantity,
  };
}
