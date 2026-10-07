import { useState } from "react";
import { useShop } from "../context/ShopContext";
import { showError } from "../utils/alerts";

// Tarjetas guardadas en el dispositivo (sin CVV ni numero completo)
export default function usePaymentMethods() {
  const { paymentMethods, addPaymentMethod, removePaymentMethod } = useShop();
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [showForm, setShowForm] = useState(false);

  const changeNumber = (v) => setNumber(v.replace(/[^\d ]/g, "").slice(0, 19));

  const add = () => {
    const digits = number.replace(/\D/g, "");
    if (digits.length < 12 || !name.trim() || !/^\d{2}\/\d{2}$/.test(expiry)) {
      showError("Revisa el número, el titular y el vencimiento (MM/AA)");
      return;
    }
    addPaymentMethod({
      id: `${Date.now()}`,
      brand: /^4/.test(digits) ? "Visa" : "Tarjeta",
      last4: digits.slice(-4),
      name: name.trim(),
      expiry,
    });
    setNumber("");
    setName("");
    setExpiry("");
    setShowForm(false);
  };

  return {
    paymentMethods,
    removePaymentMethod,
    number,
    changeNumber,
    name,
    setName,
    expiry,
    setExpiry,
    showForm,
    setShowForm,
    add,
  };
}
