import { useState } from "react";
import { useShop } from "../context/ShopContext";
import { showError } from "../utils/alerts";
import { isName, onlyLetters } from "../utils/validators";

// Algoritmo de Luhn para validar el numero de tarjeta
const isCardNumber = (digits) => {
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  digits.split("").reverse().forEach((d, i) => {
    let n = Number(d);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  });
  return sum % 10 === 0;
};

// MM/AA no vencido
const isExpiry = (value) => {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
};

const cardBrand = (digits) => {
  if (/^4/.test(digits)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  return "Tarjeta";
};

// Tarjetas guardadas en el dispositivo (sin CVV ni numero completo)
export default function usePaymentMethods() {
  const { paymentMethods, addPaymentMethod, removePaymentMethod } = useShop();
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Agrupa en bloques de 4 digitos
  const changeNumber = (v) =>
    setNumber(v.replace(/\D/g, "").slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 "));

  const changeName = (v) => setName(onlyLetters(v).toUpperCase());

  // Agrega la barra de MM/AA automaticamente
  const changeExpiry = (v) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    setExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
  };

  const add = () => {
    const digits = number.replace(/\D/g, "");
    if (!isCardNumber(digits)) return showError("El número de tarjeta no es válido");
    if (!isName(name, 3, 40)) return showError("El titular solo puede tener letras (3 a 40)");
    if (!isExpiry(expiry)) return showError("La fecha de vencimiento no es válida o ya pasó (MM/AA)");
    if (paymentMethods.some((c) => c.last4 === digits.slice(-4) && c.expiry === expiry)) {
      return showError("Esa tarjeta ya está guardada");
    }

    addPaymentMethod({
      id: `${Date.now()}`,
      brand: cardBrand(digits),
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
    setName: changeName,
    expiry,
    setExpiry: changeExpiry,
    showForm,
    setShowForm,
    add,
  };
}
