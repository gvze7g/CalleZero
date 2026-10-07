import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { shopApi } from "../api/shop";

export const ORDER_STEPS = ["Pendiente", "Procesando", "Enviado", "Completado"];
export const ORDER_FILTERS = ["Todos", "En curso", "Completados"];

// Convierte una orden del backend al formato de la tarjeta
const toCard = (o) => ({
  ...o,
  id: o._id.slice(-6).toUpperCase(),
  total: `$${Number(o.totalAmount || 0).toFixed(2)}`,
  date: new Date(o.createdAt).toLocaleDateString(),
  status: o.OrderStatus,
  statusType: o.OrderStatus === "Completado" ? "ok" : "warn",
  step: ORDER_STEPS.indexOf(o.OrderStatus),
  itemsList: o.items,
  items: o.items.reduce((n, i) => n + (i.quantity || 1), 0),
  thumbs: o.items
    .map((i) => i.productId?.imageUrl?.[0])
    .filter(Boolean)
    .map((uri) => ({ uri })),
});

// Pedidos del usuario (GET /api/orders/mine)
export default function useOrderHistory() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState(0);

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

  const active = orders.filter((o) => o.OrderStatus !== "Completado");
  const past = orders.filter((o) => o.OrderStatus === "Completado");

  return {
    active: filter === 2 ? [] : active,
    past: filter === 1 ? [] : past,
    total: orders.length,
    filterLabel: ORDER_FILTERS[filter],
    nextFilter: () => setFilter((f) => (f + 1) % ORDER_FILTERS.length),
    loading,
    refreshing,
    refresh,
  };
}
