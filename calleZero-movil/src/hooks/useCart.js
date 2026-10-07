import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
import { shopApi } from "../api/shop";
import { showError } from "../utils/alerts";

// Descuento del codigo aplicado sobre el subtotal actual
export const promoDiscount = (promo, subtotal) => {
  if (!promo) return 0;
  const raw = promo.discountType === "percent" ? (subtotal * promo.value) / 100 : promo.value;
  return Math.min(Math.round(raw * 100) / 100, subtotal);
};

// Carrito guardado en el dispositivo + codigo promocional
export default function useCart() {
  const { token } = useAuth();
  const { cart: items, changeQuantity, promo, setPromo } = useShop();
  const [promoInput, setPromoInput] = useState("");
  const [applying, setApplying] = useState(false);

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemsCount = items.reduce((n, item) => n + item.quantity, 0);
  const discount = promoDiscount(promo, subtotal);

  const removeItem = (item) => changeQuantity(item.id, item.size, 0);
  const setItemQuantity = (item, q) => changeQuantity(item.id, item.size, q);

  const applyPromo = async () => {
    const code = promoInput.trim();
    if (!/^[A-Z0-9]{3,20}$/.test(code)) {
      return showError("El código solo puede tener letras y números (3 a 20)");
    }
    if (!items.length) return showError("Agrega productos antes de usar un código");

    setApplying(true);
    try {
      const data = await shopApi.validatePromo(token, code, subtotal);
      setPromo({ code: data.code, discountType: data.discountType, value: data.value, description: data.description });
      setPromoInput("");
    } catch (err) {
      showError(err.message);
    } finally {
      setApplying(false);
    }
  };

  return {
    items,
    itemsCount,
    subtotal,
    discount,
    total: subtotal - discount,
    promo,
    promoInput,
    setPromoInput,
    applying,
    applyPromo,
    removePromo: () => setPromo(null),
    removeItem,
    setItemQuantity,
  };
}
