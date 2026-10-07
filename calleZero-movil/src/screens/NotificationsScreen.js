import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import useNotifications from "../hooks/useNotifications";
import { colors, radius, spacing } from "../theme";

const ICONS = {
  order: "cube-outline",
  promo: "pricetag-outline",
  system: "sparkles-outline",
  user: "person-outline",
  stock: "alert-circle-outline",
};

// Tiempo relativo corto (hace 5 min, hace 2 h...)
const timeAgo = (date) => {
  const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (minutes < 1) return "ahora";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return days < 7 ? `hace ${days} d` : new Date(date).toLocaleDateString();
};

export default function NotificationsScreen({ navigation }) {
  const { notifications, unread, loading, refreshing, refresh, markRead, markAllRead } = useNotifications();

  const open = (item) => {
    markRead(item);
    if (item.link === "orders") navigation.navigate("OrderHistory");
    if (item.type === "promo") navigation.navigate("Tabs", { screen: "Carrito" });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable hitSlop={10} onPress={() => navigation.goBack()} style={styles.hIcon}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>NOTIFICACIONES</Text>
        <Pressable hitSlop={10} onPress={markAllRead} disabled={!unread} style={styles.hIcon}>
          <Ionicons name="checkmark-done" size={22} color={unread ? colors.accent : colors.textFaint} />
        </Pressable>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.text} />}
        ListHeaderComponent={
          unread ? <Text style={styles.count}>{unread} sin leer</Text> : null
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
          ) : (
            <View style={styles.empty}>
              <Ionicons name="notifications-off-outline" size={40} color={colors.textFaint} />
              <Text style={styles.emptyText}>No tienes notificaciones todavía.</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <Pressable style={[styles.card, !item.read && styles.cardUnread]} onPress={() => open(item)}>
            <View style={styles.icon}>
              <Ionicons name={ICONS[item.type] || "notifications-outline"} size={18} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.rowTop}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.time}>{timeAgo(item.createdAt)}</Text>
              </View>
              <Text style={styles.message}>{item.message}</Text>
            </View>
            {!item.read && <View style={styles.dot} />}
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    height: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  hIcon: { width: 32, alignItems: "center" },
  headerTitle: { color: colors.text, fontSize: 13, fontWeight: "800", letterSpacing: 2 },
  list: { padding: spacing.lg, gap: 10, flexGrow: 1 },
  count: { color: colors.textMuted, fontSize: 12, marginBottom: 4 },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  cardUnread: { borderColor: colors.primary },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTop: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  title: { flex: 1, color: colors.text, fontSize: 13, fontWeight: "800" },
  time: { color: colors.textFaint, fontSize: 10 },
  message: { color: colors.textMuted, fontSize: 12, lineHeight: 17, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 4 },
  empty: { alignItems: "center", marginTop: 60, gap: 12 },
  emptyText: { color: colors.textMuted, fontSize: 13 },
});
