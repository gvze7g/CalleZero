import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";

const ShopContext = createContext(null);
const key = (suffix, user) => `callezero.${suffix}.${user?._id || user?.id || "guest"}`;

export function ShopProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  useEffect(() => {
    let alive = true;
    Promise.all(["cart", "favorites", "searches", "photo", "payments"].map((x) => AsyncStorage.getItem(key(x, user))))
      .then(([c, f, s, photo, payments]) => { if (alive) { setCart(c ? JSON.parse(c) : []); setFavorites(f ? JSON.parse(f) : []); setRecentSearches(s ? JSON.parse(s) : []); setProfilePhoto(photo || null); setPaymentMethods(payments ? JSON.parse(payments) : []); } })
      .catch(() => {});
    return () => { alive = false; };
  }, [user?._id, user?.id]);
  const save = (name, value) => AsyncStorage.setItem(key(name, user), JSON.stringify(value)).catch(() => {});
  const addToCart = useCallback((product, size = "Única", quantity = 1) => setCart(old => {
    const id = product._id || product.id;
    const found = old.find(x => x.id === id && x.size === size);
    const next = found ? old.map(x => x === found ? { ...x, quantity: Math.min(x.quantity + quantity, product.stock || Infinity) } : x) : [...old, { id, name: product.name, price: Number(product.price), image: product.image, brand: product.brand, size, quantity, stock: product.stock }];
    save("cart", next); return next;
  }), [user]);
  const changeQuantity = useCallback((id, size, quantity) => setCart(old => { const next = quantity < 1 ? old.filter(x => !(x.id === id && x.size === size)) : old.map(x => x.id === id && x.size === size ? { ...x, quantity: Math.min(quantity, x.stock || quantity) } : x); save("cart", next); return next; }), [user]);
  const clearCart = useCallback(() => { setCart([]); save("cart", []); }, [user]);
  const toggleFavorite = useCallback((product) => setFavorites(old => { const id = product._id || product.id; const next = old.some(x => x.id === id) ? old.filter(x => x.id !== id) : [...old, product]; save("favorites", next); return next; }), [user]);
  const addRecentSearch = useCallback((term) => { const clean = term.trim(); if (!clean) return; setRecentSearches(old => { const next = [clean, ...old.filter(x => x.toLowerCase() !== clean.toLowerCase())].slice(0, 8); save("searches", next); return next; }); }, [user]);
  const removeRecentSearch = useCallback((term) => setRecentSearches(old => { const next = old.filter(x => x !== term); save("searches", next); return next; }), [user]);
  const saveProfilePhoto = useCallback((uri) => { setProfilePhoto(uri); AsyncStorage.setItem(key("photo", user), uri).catch(() => {}); }, [user]);
  const addPaymentMethod = useCallback((card) => setPaymentMethods(old => { const next = [...old, card]; save("payments", next); return next; }), [user]);
  const removePaymentMethod = useCallback((id) => setPaymentMethods(old => { const next = old.filter(x => x.id !== id); save("payments", next); return next; }), [user]);
  const value = useMemo(() => ({ cart, favorites, recentSearches, profilePhoto, paymentMethods, addToCart, changeQuantity, clearCart, toggleFavorite, addRecentSearch, removeRecentSearch, saveProfilePhoto, addPaymentMethod, removePaymentMethod, cartCount: cart.reduce((n, x) => n + x.quantity, 0) }), [cart, favorites, recentSearches, profilePhoto, paymentMethods, addToCart, changeQuantity, clearCart, toggleFavorite, addRecentSearch, removeRecentSearch, saveProfilePhoto, addPaymentMethod, removePaymentMethod]);
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
export const useShop = () => { const value = useContext(ShopContext); if (!value) throw new Error("useShop debe usarse dentro de ShopProvider"); return value; };
