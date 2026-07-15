import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const DAILY_GOAL = 500;

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

export default function useDashboard() {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [userStats, setUserStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    useEffect(() => {
        const loadDashboard = async () => {
            setIsLoading(true);
            setLoadError(null);

            try {
                const [productsRes, ordersRes, usersRes] = await Promise.all([
                    fetch("http://localhost:4000/api/product", { credentials: "include" }),
                    fetch("http://localhost:4000/api/orders", { credentials: "include" }),
                    fetch("http://localhost:4000/api/admin/users/stats", { credentials: "include" }),
                ]);

                if (!productsRes.ok || !ordersRes.ok || !usersRes.ok) {
                    throw new Error("No se pudo cargar la información del dashboard");
                }

                const productsData = await productsRes.json();
                const ordersData = await ordersRes.json();
                const usersData = await usersRes.json();

                setProducts(productsData);
                setOrders(ordersData);
                setUserStats(usersData.stats);
            } catch (error) {
                console.error(error);
                setLoadError(error.message);
                toast.error("Error al cargar el dashboard");
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboard();
    }, []);

    // Cards superiores (Total Productos / Pedidos del Mes / Usuarios Activos)
    const stats = useMemo(() => {
        const now = new Date();

        const ordersThisMonth = orders.filter((order) => {
            const d = new Date(order.createdAt);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });

        const ordersLastMonth = orders.filter((order) => {
            const d = new Date(order.createdAt);
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
            return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
        });

        const monthChange =
            ordersLastMonth.length > 0
                ? (((ordersThisMonth.length - ordersLastMonth.length) / ordersLastMonth.length) * 100).toFixed(1)
                : null;

        return [
            {
                title: "Total Productos",
                value: String(products.length),
                helper: "en catálogo",
                icon: "Package",
            },
            {
                title: "Pedidos del Mes",
                value: String(ordersThisMonth.length),
                helper: "vs. mes anterior",
                change: monthChange !== null ? `${monthChange > 0 ? "+" : ""}${monthChange}%` : undefined,
                changeType: monthChange !== null && monthChange < 0 ? "negative" : "positive",
                icon: "ShoppingCart",
            },
            {
                title: "Usuarios Activos",
                value: String(userStats?.activeUsers ?? "—"),
                helper: `de ${userStats?.totalUsers ?? 0} totales`,
                icon: "Users",
            },
        ];
    }, [products, orders, userStats]);

    // Últimos 5 pedidos para la tabla del dashboard
    const recentOrders = useMemo(() => {
        return orders.slice(0, 5).map((order) => ({
            id: `#${order._id.slice(-6).toUpperCase()}`,
            customer: order.UsersId?.fullName || "Cliente eliminado",
            date: formatDate(order.createdAt),
            total: `$${Number(order.totalAmount || 0).toFixed(2)}`,
            status: order.OrderStatus || "Pendiente",
            statusType: statusTypeMap[order.OrderStatus] || "default",
            avatar: getInitials(order.UsersId?.fullName),
        }));
    }, [orders]);

    // Alertas de inventario (stock bajo / agotado)
    const inventoryAlerts = useMemo(() => {
        return products
            .filter((product) => Number(product.stock) < 10)
            .sort((a, b) => Number(a.stock) - Number(b.stock))
            .slice(0, 5)
            .map((product) => ({
                name: product.name,
                category: product.categoryId?.name || "Sin categoría",
                stock: Number(product.stock) <= 0 ? "Agotado" : `${product.stock} unidades`,
                type: Number(product.stock) <= 0 ? "out" : "low",
            }));
    }, [products]);

    // Meta diaria de ventas
    const dailyGoal = useMemo(() => {
        const today = new Date().toDateString();

        const salesToday = orders
            .filter((order) => new Date(order.createdAt).toDateString() === today)
            .reduce((total, order) => total + Number(order.totalAmount || 0), 0);

        const percentage = ((salesToday / DAILY_GOAL) * 100).toFixed(0);

        return { salesToday, goal: DAILY_GOAL, percentage };
    }, [orders]);

    return {
        stats,
        recentOrders,
        inventoryAlerts,
        dailyGoal,
        isLoading,
        loadError,
    };
}