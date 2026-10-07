import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiFetch } from "../lib/api.js";
import { isName, isSafeText, isZip, MESSAGES } from "../utils/validators.js";
import useAuth from "./useAuth";

const initialForm = {
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    ccv: "",
};

const onlyLetters = (value) => value.replace(/[^a-zA-ZÀ-ÿñÑ'\s]/g, "").slice(0, 50);
const onlyDigits = (value) => value.replace(/\D/g, "");

const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);

    if (digits.length <= 2) return digits;

    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

// Agrupa el numero de tarjeta en bloques de 4
const formatCard = (value) => onlyDigits(value).slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");

const sanitizers = {
    fullName: onlyLetters,
    city: onlyLetters,
    cardName: (value) => onlyLetters(value).toUpperCase(),
    address: (value) => value.replace(/[<>{}$\\]/g, "").slice(0, 150),
    zipCode: (value) => onlyDigits(value).slice(0, 10),
    cardNumber: formatCard,
    expiryDate: formatExpiry,
    ccv: (value) => onlyDigits(value).slice(0, 4),
};

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

export default function useCheckout({ cart, total, clearCart, promo }) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkoutForm, setCheckoutForm] = useState(initialForm);

    const handleCheckoutChange = (field, value) => {
        const sanitize = sanitizers[field];
        const cleanValue = sanitize ? sanitize(value) : value;

        setCheckoutForm((prev) => ({
            ...prev,
            [field]: cleanValue,
        }));
    };

    const openCheckout = () => {
        if (cart.length === 0) {
            toast.error("Tu carrito está vacío");
            return;
        }
        if (!isAuthenticated) {
            toast.error("Inicia sesión para finalizar la compra");
            navigate("/login");
            return;
        }
        setIsCheckoutOpen(true);
    };

    const closeCheckout = () => setIsCheckoutOpen(false);

    // Devuelve el mensaje de error o null
    const validate = () => {
        const f = checkoutForm;
        if (Object.values(f).some((value) => !value.trim())) return "Debes completar todos los datos de pago y envío";
        if (!isName(f.fullName)) return MESSAGES.name;
        if (!isName(f.city, 2, 50)) return "La ciudad solo puede tener letras y espacios";
        if (!isSafeText(f.address, 5, 150)) return "La dirección debe tener entre 5 y 150 caracteres válidos";
        if (!isZip(f.zipCode)) return MESSAGES.zip;
        if (!isName(f.cardName, 3, 40)) return "El titular solo puede tener letras (3 a 40)";
        if (!isCardNumber(onlyDigits(f.cardNumber))) return "Número de tarjeta inválido";
        if (!isExpiry(f.expiryDate)) return "La fecha de vencimiento no es válida o ya pasó (MM/AA)";
        if (!/^\d{3,4}$/.test(f.ccv)) return "El CCV debe tener 3 o 4 dígitos";
        return null;
    };

    const submitCheckout = async (event) => {
        event.preventDefault();

        const invalid = validate();
        if (invalid) {
            toast.error(invalid);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await apiFetch("/api/orders", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart.map((item) => ({
                        productId: item.productId,
                        name: item.name,
                        quantity: item.quantity,
                        size: item.size,
                        price: item.price,
                    })),
                    totalAmount: total,
                    PaymentMethod: "Tarjeta",
                    ShippingAddress: `${checkoutForm.fullName}, ${checkoutForm.address}, ${checkoutForm.city}, ${checkoutForm.zipCode}`,
                    promoCode: promo?.code,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Debes iniciar sesión para finalizar la compra");
                }
                throw new Error(data.message || "No se pudo procesar la compra");
            }

            toast.success("Compra realizada correctamente");
            clearCart();
            setCheckoutForm(initialForm);
            setIsCheckoutOpen(false);
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        isCheckoutOpen,
        isSubmitting,
        checkoutForm,
        handleCheckoutChange,
        openCheckout,
        closeCheckout,
        submitCheckout,
    };
}
