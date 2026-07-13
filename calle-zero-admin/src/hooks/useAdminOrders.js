import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const statusTypeMap = {
    Pendiente: "default",
    Procesando: "muted",
    Enviado: "default",
    Completado: "default",
};

const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("es-SV", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getInitials = (name = "") =>
    name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "??";

export default function useAdminOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    useEffect(() => {
        const loadOrders = async () => {
            setIsLoading(true);
            setLoadError(null);

            try {
                const response = await fetch("http://localhost:4000/api/orders", {
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("No se pudieron cargar los pedidos");
                }

                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error(error);
                setLoadError(error.message);
                toast.error("Error al cargar pedidos");
            } finally {
                setIsLoading(false);
            }
        };

        loadOrders();
    }, []);

    const updateStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(
                `http://localhost:4000/api/orders/${orderId}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ OrderStatus: newStatus }),
                }
            );

            if (!response.ok) {
                throw new Error("No se pudo actualizar el estado");
            }

            setOrders((prev) =>
                prev.map((order) =>
                    order._id === orderId
                        ? { ...order, OrderStatus: newStatus }
                        : order
                )
            );

            toast.success(`Estado actualizado a "${newStatus}"`);
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const rows = useMemo(() => {
        return orders.map((order) => {
            const totalUnits =
                order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

            return {
                id: `#${order._id.slice(-6).toUpperCase()}`,
                rawId: order._id,
                customer: order.UsersId?.fullName || "Cliente eliminado",
                email: order.UsersId?.email || "—",
                date: formatDate(order.createdAt),
                items: `${totalUnits} items`,
                total: `$${Number(order.totalAmount || 0).toFixed(2)}`,
                status: order.OrderStatus || "Pendiente",
                statusType: statusTypeMap[order.OrderStatus] || "default",
                avatar: getInitials(order.UsersId?.fullName),
            };
        });
    }, [orders]);

    const stats = useMemo(() => {
        const today = new Date().toDateString();

        const ordersToday = orders.filter(
            (order) => new Date(order.createdAt).toDateString() === today
        ).length;

        const pending = orders.filter(
            (order) => order.OrderStatus === "Pendiente"
        ).length;

        const monthSales = orders.reduce((total, order) => {
            const orderDate = new Date(order.createdAt);
            const now = new Date();
            const sameMonth =
                orderDate.getMonth() === now.getMonth() &&
                orderDate.getFullYear() === now.getFullYear();

            return sameMonth ? total + Number(order.totalAmount || 0) : total;
        }, 0);

        const completed = orders.filter(
            (order) => order.OrderStatus === "Completado"
        ).length;

        const completionRate =
            orders.length > 0 ? ((completed / orders.length) * 100).toFixed(1) : "0.0";

        return [
            {
                title: "Pedidos Hoy",
                value: String(ordersToday),
                helper: "Actualizado en tiempo real",
                icon: "ShoppingCart",
            },
            {
                title: "Por Procesar",
                value: String(pending),
                helper: "Requieren atención",
                icon: "Clock3",
            },
            {
                title: "Ventas del Mes",
                value: `$${monthSales.toFixed(2)}`,
                helper: "Total acumulado",
                icon: "ArrowUpDown",
            },
            {
                title: "Cumplimiento",
                value: `${completionRate}%`,
                helper: "Tasa de entrega",
                icon: "BadgeCheck",
            },
        ];
    }, [orders]);

    return { rows, stats, isLoading, loadError, updateStatus };
}