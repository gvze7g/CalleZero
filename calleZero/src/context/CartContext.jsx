import { createContext, useEffect, useState } from "react";
import { toast } from "sonner";

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
        const stock = Number(product.stock) || 0;

        if (stock <= 0) {
            toast.error("Este producto no tiene stock disponible");
            return;
        }

        setCart((prev) => {
            const existing = prev.find(
                (item) => item.productId === product._id && item.size === size
            );

            const currentQuantity = existing ? existing.quantity : 0;
            const requestedTotal = currentQuantity + quantity;

            if (requestedTotal > stock) {
                const canAdd = stock - currentQuantity;

                if (canAdd <= 0) {
                    toast.error(`Ya tienes en el carrito todo el stock disponible (${stock})`);
                } else {
                    toast.error(`Solo puedes agregar ${canAdd} unidad(es) más de este producto`);
                }

                return prev;
            }

            if (existing) {
                return prev.map((item) =>
                    item.productId === product._id && item.size === size
                        ? { ...item, quantity: requestedTotal, stock }
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
                    stock,
                },
            ];
        });
    };

    const updateQuantity = (productId, size, type) => {
        setCart((prev) =>
            prev.map((item) => {
                if (item.productId !== productId || item.size !== size) {
                    return item;
                }

                if (type === "increase") {
                    if (item.quantity >= item.stock) {
                        toast.error(`No hay más stock disponible (${item.stock} unidades)`);
                        return item;
                    }
                    return { ...item, quantity: item.quantity + 1 };
                }

                return { ...item, quantity: Math.max(1, item.quantity - 1) };
            })
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