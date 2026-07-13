import { useState } from "react";
import { toast } from "sonner";

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

const onlyLetters = (value) => value.replace(/[^a-zA-ZÀ-ÿñÑ\s]/g, "");
const onlyDigits = (value) => value.replace(/\D/g, "");

const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);

    if (digits.length <= 2) return digits;

    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const sanitizers = {
    fullName: onlyLetters,
    city: onlyLetters,
    cardName: onlyLetters,
    zipCode: (value) => onlyDigits(value).slice(0, 10),
    cardNumber: (value) => onlyDigits(value).slice(0, 16),
    expiryDate: formatExpiry,
    ccv: (value) => onlyDigits(value).slice(0, 4),
};

export default function useCheckout({ cart, total, clearCart }) {
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
        setIsCheckoutOpen(true);
    };

    const closeCheckout = () => setIsCheckoutOpen(false);

    const submitCheckout = async (event) => {
        event.preventDefault();

        const hasEmptyFields = Object.values(checkoutForm).some(
            (value) => !value.trim()
        );

        if (hasEmptyFields) {
            toast.error("Debes completar todos los datos de pago y envío");
            return;
        }

        if (checkoutForm.cardNumber.length < 13) {
            toast.error("Número de tarjeta inválido");
            return;
        }

        if (checkoutForm.expiryDate.length < 5) {
            toast.error("Fecha de vencimiento inválida");
            return;
        }

        if (checkoutForm.ccv.length < 3) {
            toast.error("CCV inválido");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("http://localhost:4000/api/orders", {
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
                    PaymentMethod: "Simulado - Demo",
                    ShippingAddress: `${checkoutForm.address}, ${checkoutForm.city}, ${checkoutForm.zipCode}`,
                }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Debes iniciar sesión para finalizar la compra");
                }
                throw new Error("No se pudo procesar la compra");
            }

            toast.success("Compra procesada correctamente (simulada)");
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