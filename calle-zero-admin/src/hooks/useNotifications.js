import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../lib/api.js";

// Notificaciones del panel (se actualizan cada 30 segundos)
export default function useNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [unread, setUnread] = useState(0);

    const load = useCallback(async () => {
        try {
            const res = await apiFetch("/api/notifications");
            if (!res.ok) return;
            const data = await res.json();
            setNotifications(data.notifications || []);
            setUnread(data.unread || 0);
        } catch {
            // sin conexion: se intenta en el siguiente ciclo
        }
    }, []);

    useEffect(() => {
        load();
        const id = setInterval(load, 30000);
        return () => clearInterval(id);
    }, [load]);

    const markRead = (item) => {
        if (item.read) return;
        setNotifications((list) => list.map((n) => (n._id === item._id ? { ...n, read: true } : n)));
        setUnread((n) => Math.max(0, n - 1));
        apiFetch(`/api/notifications/${item._id}/read`, { method: "PUT" }).catch(() => {});
    };

    const markAllRead = () => {
        setNotifications((list) => list.map((n) => ({ ...n, read: true })));
        setUnread(0);
        apiFetch("/api/notifications/read-all", { method: "PUT" }).catch(() => {});
    };

    return { notifications, unread, markRead, markAllRead, reload: load };
}
