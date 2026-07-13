import { createContext, useEffect, useState } from "react";

export const CartContext = createContext(null);

const STORAGE_KEY = "cz_cart";

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, size, quantity = 1) => {
        setCart((prev) => {
            const existing = prev.find(
                (item) => item.productId === product._id && item.size === size
            );

            if (existing) {
                return prev.map((item) =>
                    item.productId === product._id && item.size === size
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [
                ...prev,
                {
                    productId: product._id,
                    name: product.name,
                    price: Number(product.price),
                    image: product.imageUrl?.[0] || null,
                    size,
                    quantity,
                },
            ];
        });
    };

    const updateQuantity = (productId, size, type) => {
        setCart((prev) =>
            prev.map((item) =>
                item.productId === productId && item.size === size
                    ? {
                        ...item,
                        quantity:
                            type === "increase"
                                ? item.quantity + 1
                                : Math.max(1, item.quantity - 1),
                    }
                    : item
            )
        );
    };

    const removeItem = (productId, size) => {
        setCart((prev) =>
            prev.filter(
                (item) => !(item.productId === productId && item.size === size)
            )
        );
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider
            value={{ cart, addToCart, updateQuantity, removeItem, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
};