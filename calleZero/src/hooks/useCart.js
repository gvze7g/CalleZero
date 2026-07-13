import { useContext, useMemo } from "react";
import { CartContext } from "../context/CartContext";

const TAX_RATE = 0.21;

export default function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart debe usarse dentro de un CartProvider");
    }

    const { cart, addToCart, updateQuantity, removeItem, clearCart } = context;

    const subtotal = useMemo(
        () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
        [cart]
    );

    const taxes = subtotal * TAX_RATE;
    const total = subtotal + taxes;
    const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

    return {
        cart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        taxes,
        total,
        itemCount,
    };
}