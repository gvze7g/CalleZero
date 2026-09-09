import {
  Image,
  Pressable,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

// CONECTAR API: reemplazar por GET /api/orders (pedidos del usuario autenticado).
import { useAuth } from "../../context/AuthContext";
import { shopApi } from "../../api/shop";
import { colors, radius, spacing } from "../../theme";

const STATUS_COLOR = {
  warn: "#F59E0B",
  ok: colors.success,
  danger: colors.danger,
};

function OrderCard({ order }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View>
          <Text style={styles.orderLabel}>ID DE PEDIDO</Text>
          <Text style={styles.orderId}>#{order.id}</Text>
        </View>
        <Text style={styles.orderTotal}>{order.total}</Text>
      </View>

      <View style={styles.cardMid}>
        <View style={styles.thumbs}>
          {order.thumbs.slice(0, 3).map((img, i) => (
            <Image
              key={i}
              source={img}
              style={[styles.thumb, i > 0 && { marginLeft: -12 }]}
              resizeMode="cover"
            />
          ))}
        </View>
        <View style={styles.metaRight}>
          <Text style={styles.date}>{order.date}</Text>
          <View style={styles.statusRow}>
            <View
              style={[styles.dot, { backgroundColor: STATUS_COLOR[order.statusType] }]}
            />
            <Text style={[styles.status, { color: STATUS_COLOR[order.statusType] }]}>
              {order.status}
            </Text>
          </View>
          <Text style={styles.items}>{order.items} items</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <Pressable style={styles.trackBtn}>
          <Text style={styles.trackText}>Seguimiento del pedido</Text>
          <Ionicons name="arrow-forward" size={14} color="#fff" />
        </Pressable>
        <Pressable style={styles.detailBtn}>
          <Text style={styles.detailText}>Detalles</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function OrderHistoryScreen({ navigation }) {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const load = useCallback(async () => { try { setOrders(await shopApi.orders(token)); } finally { setLoading(false); setRefreshing(false); } }, [token]);
  useEffect(() => { load(); }, [load]);
  const active = orders.filter(o => !["Completado"].includes(o.OrderStatus));
  const past = orders.filter(o => o.OrderStatus === "Completado");
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable hitSlop={10} onPress={() => navigation.goBack()} style={styles.hIcon}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>HISTORIAL DE PEDIDOS</Text>
        <Pressable hitSlop={10} style={styles.hIcon}>
          <Ionicons name="filter-outline" size={20} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.text} />}
      >
        <Text style={styles.section}>EN CURSO</Text>
        {loading ? <Text style={styles.footNote}>Cargando pedidos...</Text> : active.map((o) => (
          <OrderCard key={o._id} order={{ ...o, id:o._id.slice(-6), total:`$${Number(o.totalAmount).toFixed(2)}`, date:new Date(o.createdAt).toLocaleDateString(), status:o.OrderStatus, statusType:"warn", items:o.items.length, thumbs:[] }} />
        ))}

        <View style={styles.sectionRow}>
          <Text style={styles.section}>COMPRAS PASADAS</Text>
          <Pressable hitSlop={8}>
            <Text style={styles.filterLink}>Filtro</Text>
          </Pressable>
        </View>
        {past.map((o) => (
          <OrderCard key={o._id} order={{ ...o, id:o._id.slice(-6), total:`$${Number(o.totalAmount).toFixed(2)}`, date:new Date(o.createdAt).toLocaleDateString(), status:o.OrderStatus, statusType:"ok", items:o.items.length, thumbs:[] }} />
        ))}

        <Text style={styles.footNote}>MOSTRANDO TODOS LOS PEDIDOS DE 2023</Text>
        <Pressable style={styles.loadMore}>
          <Text style={styles.loadMoreText}>Cargar pedidos antiguos</Text>
        </Pressable>
      </ScrollView>
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
  },
  hIcon: { width: 32, alignItems: "center" },
  headerTitle: { color: colors.text, fontSize: 13, fontWeight: "800", letterSpacing: 1.5 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: 40, paddingTop: spacing.sm },
  section: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterLink: { color: colors.accent, fontSize: 12, fontWeight: "600" },
  card: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: spacing.md,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  orderLabel: { color: colors.textFaint, fontSize: 9, fontWeight: "700", letterSpacing: 0.6 },
  orderId: { color: colors.text, fontSize: 14, fontWeight: "800", marginTop: 2 },
  orderTotal: { color: colors.text, fontSize: 15, fontWeight: "800" },
  cardMid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  thumbs: { flexDirection: "row", alignItems: "center" },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.surfaceAlt,
  },
  metaRight: { alignItems: "flex-end", gap: 3 },
  date: { color: colors.textMuted, fontSize: 11 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  status: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  items: { color: colors.textFaint, fontSize: 10 },
  cardActions: { flexDirection: "row", gap: 10, marginTop: spacing.md },
  trackBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
  },
  trackText: { color: "#fff", fontSize: 11, fontWeight: "800" },
  detailBtn: {
    paddingHorizontal: 16,
    height: 38,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  detailText: { color: colors.text, fontSize: 11, fontWeight: "700" },
  footNote: {
    color: colors.textFaint,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    textAlign: "center",
    marginTop: spacing.lg,
  },
  loadMore: {
    marginTop: spacing.md,
    height: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  loadMoreText: { color: colors.text, fontSize: 13, fontWeight: "700" },
});
