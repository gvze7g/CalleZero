import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
import { shopApi } from "../api/shop";
import { showError, showInfo } from "../utils/alerts";

export const paymentMethods = [
  { id: "apple", label: "Apple Pay", icon: "logo-apple" },
  { id: "card", label: "Tarjeta", icon: "card-outline" },
  { id: "cash", label: "Efectivo", icon: "cash-outline" },
];

// Crea el pedido con POST /api/orders
export default function useCheckout(navigation) {
  const { token, user } = useAuth();
  const { cart, clearCart } = useShop();

  // Prellenado con los datos del perfil
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    address: user?.location || "",
    city: "",
    zip: "",
    phone: user?.phone || "",
  });
  const [method, setMethod] = useState("card");
  const [placing, setPlacing] = useState(false);

  const setField = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemsCount = cart.reduce((n, item) => n + item.quantity, 0);

  const placeOrder = async () => {
    if (!cart.length) return showError("Tu carrito está vacío");
    if (!form.address.trim() || !form.city.trim() || !form.phone.trim()) {
      return showError("Completa dirección, ciudad y teléfono");
    }

    setPlacing(true);
    try {
      await shopApi.createOrder(token, {
        items: cart.map((i) => ({
          productId: i.id,
          name: i.name,
          quantity: i.quantity,
          size: i.size,
          price: i.price,
        })),
        PaymentMethod: paymentMethods.find((x) => x.id === method)?.label,
        ShippingAddress: [form.fullName, form.address, form.city, form.zip, form.phone]
          .filter((x) => x.trim())
          .join(", "),
      });
      clearCart();
      showInfo("Tu pedido fue creado correctamente", "Pedido realizado", () =>
        navigation.navigate("OrderHistory")
      );
    } catch (e) {
      showError(e.message);
    } finally {
      setPlacing(false);
    }
  };

  return {
    form,
    setField,
    method,
    setMethod,
    placing,
    placeOrder,
    subtotal,
    itemsCount,
  };
}
