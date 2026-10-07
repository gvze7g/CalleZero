import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
import { shopApi } from "../api/shop";
import { showError, showInfo } from "../utils/alerts";
import { clean } from "../utils/validators";
import { addressError } from "./useAddresses";
import { promoDiscount } from "./useCart";

export const paymentMethods = [
  { id: "card", label: "Tarjeta", icon: "card-outline" },
  { id: "cash", label: "Efectivo", icon: "cash-outline" },
  { id: "apple", label: "Apple Pay", icon: "logo-apple" },
];

// Crea el pedido con POST /api/orders
export default function useCheckout(navigation) {
  const { token, user } = useAuth();
  const { cart, clearCart, promo, setPromo, paymentMethods: cards } = useShop();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [form, setForm] = useState({
    label: "Casa",
    fullName: user?.fullName || "",
    address: user?.location || "",
    city: "",
    zip: "",
    phone: user?.phone || "",
  });
  const [method, setMethod] = useState("card");
  const [cardId, setCardId] = useState(cards[0]?.id || null);
  const [placing, setPlacing] = useState(false);

  // Usa la direccion predeterminada si existe
  useEffect(() => {
    shopApi
      .addresses(token)
      .then((list) => {
        setAddresses(list);
        const preferred = list.find((a) => a.isDefault) || list[0];
        if (preferred) pickAddress(preferred);
      })
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    if (!cardId && cards.length) setCardId(cards[0].id);
  }, [cards]);

  const pickAddress = (a) => {
    setSelectedAddress(a._id);
    setForm({ label: a.label, fullName: a.fullName, address: a.address, city: a.city, zip: a.zip || "", phone: a.phone });
  };

  const setField = (k) => (v) => {
    setSelectedAddress(null);
    setForm((f) => ({ ...f, [k]: v }));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemsCount = cart.reduce((n, item) => n + item.quantity, 0);
  const discount = promoDiscount(promo, subtotal);
  const total = subtotal - discount;

  const placeOrder = async () => {
    if (!cart.length) return showError("Tu carrito está vacío");

    const data = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, clean(v)]));
    const invalid = addressError(data);
    if (invalid) return showError(invalid);

    if (method === "card" && !cards.length) {
      return showInfo("Agrega una tarjeta en Métodos de pago para continuar.", "Sin tarjetas", () =>
        navigation.navigate("PaymentMethods")
      );
    }

    const card = cards.find((c) => c.id === cardId);
    const paymentLabel = paymentMethods.find((x) => x.id === method)?.label;

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
        PaymentMethod: paymentLabel,
        ShippingAddress: [data.fullName, data.address, data.city, data.zip, data.phone].filter(Boolean).join(", "),
        promoCode: promo?.code,
      });
      clearCart();
      showInfo(
        method === "card" && card
          ? `Pagaste con ${card.brand} •••• ${card.last4}. Tu pedido fue creado.`
          : "Tu pedido fue creado correctamente.",
        "Pedido realizado",
        () => navigation.navigate("OrderHistory")
      );
    } catch (e) {
      // Si el codigo ya no aplica, se quita para que pueda reintentar
      if (/código|codigo/i.test(e.message)) setPromo(null);
      showError(e.message);
    } finally {
      setPlacing(false);
    }
  };

  return {
    form,
    setField,
    addresses,
    selectedAddress,
    pickAddress,
    method,
    setMethod,
    cards,
    cardId,
    setCardId,
    placing,
    placeOrder,
    subtotal,
    discount,
    total,
    promo,
    itemsCount,
  };
}
