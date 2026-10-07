import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { shopApi } from "../api/shop";

// Convierte una orden del backend al formato de la tarjeta
const toCard = (o) => ({
  ...o,
  id: o._id.slice(-6).toUpperCase(),
  total: `$${Number(o.totalAmount || 0).toFixed(2)}`,
  date: new Date(o.createdAt).toLocaleDateString(),
  status: o.OrderStatus,
  statusType: o.OrderStatus === "Completado" ? "ok" : "warn",
  items: o.items.reduce((n, i) => n + (i.quantity || 1), 0),
  thumbs: [],
});

// Pedidos del usuario (GET /api/orders/mine)
export default function useOrderHistory() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await shopApi.orders(token);
      setOrders(data.map(toCard));
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = () => {
    setRefreshing(true);
    load();
  };

  return {
    active: orders.filter((o) => o.OrderStatus !== "Completado"),
    past: orders.filter((o) => o.OrderStatus === "Completado"),
    loading,
    refreshing,
    refresh,
  };
}
