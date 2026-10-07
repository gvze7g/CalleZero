import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { shopApi } from "../api/shop";

// Notificaciones del usuario; se recargan al entrar a la pantalla
export default function useNotifications() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const data = await shopApi.notifications(token);
      setNotifications(data.notifications || []);
      setUnread(data.unread || 0);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const refresh = () => {
    setRefreshing(true);
    load();
  };

  const markRead = async (item) => {
    if (item.read) return;
    setNotifications((list) => list.map((n) => (n._id === item._id ? { ...n, read: true } : n)));
    setUnread((n) => Math.max(0, n - 1));
    shopApi.readNotification(token, item._id).catch(() => {});
  };

  const markAllRead = async () => {
    setNotifications((list) => list.map((n) => ({ ...n, read: true })));
    setUnread(0);
    shopApi.readAllNotifications(token).catch(() => {});
  };

  return { notifications, unread, loading, refreshing, refresh, markRead, markAllRead };
}
