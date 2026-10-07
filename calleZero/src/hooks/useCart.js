import { useContext, useMemo, useState } from "react";
import { toast } from "sonner";
import { CartContext } from "../context/CartContext";
import { apiFetch } from "../lib/api.js";

// Descuento del codigo aplicado sobre el subtotal
const promoDiscount = (promo, subtotal) => {
    if (!promo) return 0;
    const raw = promo.discountType === "percent" ? (subtotal * promo.value) / 100 : promo.value;
    return Math.min(Math.round(raw * 100) / 100, subtotal);
};

export default function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart debe usarse dentro de un CartProvider");
    }

    const { cart, addToCart, updateQuantity, removeItem, clearCart, promo, setPromo } = context;
    const [promoInput, setPromoInput] = useState("");
    const [isApplying, setIsApplying] = useState(false);

    const subtotal = useMemo(
        () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
        [cart]
    );

    const discount = promoDiscount(promo, subtotal);
    const total = subtotal - discount;
    const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

    // Valida el codigo con POST /api/promotions/validate
    const applyPromo = async () => {
        const code = promoInput.trim().toUpperCase();
        if (!/^[A-Z0-9]{3,20}$/.test(code)) {
            toast.error("El código solo puede tener letras y números (3 a 20)");
            return;
        }
        if (!cart.length) {
            toast.error("Agrega productos antes de usar un código");
            return;
        }

        setIsApplying(true);
        try {
            const res = await apiFetch("/api/promotions/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, subtotal }),
            });
            const data = await res.json();
            if (res.status === 401) throw new Error("Inicia sesión para usar códigos promocionales");
            if (!res.ok) throw new Error(data.message);

            setPromo({ code: data.code, discountType: data.discountType, value: data.value, description: data.description });
            setPromoInput("");
            toast.success(`Código ${data.code} aplicado`);
        } catch (error) {
            toast.error(error.message || "No se pudo aplicar el código");
        } finally {
            setIsApplying(false);
        }
    };

    return {
        cart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        discount,
        total,
        itemCount,
        promo,
        promoInput,
        setPromoInput: (v) => setPromoInput(v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 20)),
        isApplying,
        applyPromo,
        removePromo: () => setPromo(null),
    };
}
