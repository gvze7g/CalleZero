import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import useOrderHistory, { ORDER_STEPS } from "../../hooks/useOrderHistory";
import { colors, radius, spacing } from "../../theme";

const STATUS_COLOR = {
  warn: "#F59E0B",
  ok: colors.success,
  danger: colors.danger,
};

// Linea de tiempo del estado del pedido
function Tracking({ step }) {
  return (
    <View style={styles.track}>
      {ORDER_STEPS.map((s, i) => (
        <View key={s} style={styles.trackStep}>
          <View style={[styles.trackDot, i <= step && styles.trackDotDone]}>
            {i <= step && <Ionicons name="checkmark" size={11} color="#fff" />}
          </View>
          <Text style={[styles.trackLabel, i <= step && { color: colors.text }]}>{s}</Text>
          {i < ORDER_STEPS.length - 1 && <View style={[styles.trackLine, i < step && styles.trackLineDone]} />}
        </View>
      ))}
    </View>
  );
}

function OrderCard({ order }) {
  const [panel, setPanel] = useState(null); // "track" | "details" | null
  const toggle = (name) => setPanel((p) => (p === name ? null : name));

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

      {panel === "track" && <Tracking step={order.step} />}

      {panel === "details" && (
        <View style={styles.details}>
          {order.itemsList.map((i, idx) => (
            <View key={idx} style={styles.detailLine}>
              <Text style={styles.detailName} numberOfLines={1}>
                {i.quantity} × {i.name} {i.size ? `(${i.size})` : ""}
              </Text>
              <Text style={styles.detailPrice}>${(i.price * i.quantity).toFixed(2)}</Text>
            </View>
          ))}
          {order.discount > 0 && (
            <View style={styles.detailLine}>
              <Text style={[styles.detailName, { color: colors.success }]}>Descuento {order.promoCode}</Text>
              <Text style={[styles.detailPrice, { color: colors.success }]}>-${order.discount.toFixed(2)}</Text>
            </View>
          )}
          <Text style={styles.detailMeta}>Pago: {order.PaymentMethod || "—"}</Text>
          <Text style={styles.detailMeta}>Envío: {order.ShippingAddress || "—"}</Text>
        </View>
      )}

      <View style={styles.cardActions}>
        <Pressable style={styles.trackBtn} onPress={() => toggle("track")}>
          <Text style={styles.trackText}>{panel === "track" ? "Ocultar seguimiento" : "Seguimiento del pedido"}</Text>
          <Ionicons name={panel === "track" ? "chevron-up" : "arrow-forward"} size={14} color="#fff" />
        </Pressable>
        <Pressable style={[styles.detailBtn, panel === "details" && { borderColor: colors.primary }]} onPress={() => toggle("details")}>
          <Text style={styles.detailText}>Detalles</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function OrderHistoryScreen({ navigation }) {
  const { active, past, total, filterLabel, nextFilter, loading, refreshing, refresh } = useOrderHistory();
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable hitSlop={10} onPress={() => navigation.goBack()} style={styles.hIcon}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>HISTORIAL DE PEDIDOS</Text>
        <Pressable hitSlop={10} style={styles.hIcon} onPress={nextFilter}>
          <Ionicons name="filter-outline" size={20} color={filterLabel === "Todos" ? colors.text : colors.accent} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.text} />}
      >
        <View style={styles.sectionRow}>
          <Text style={styles.section}>MOSTRANDO: {filterLabel.toUpperCase()}</Text>
          <Pressable hitSlop={8} onPress={nextFilter}>
            <Text style={styles.filterLink}>Cambiar filtro</Text>
          </Pressable>
        </View>

        {loading ? (
          <Text style={styles.footNote}>Cargando pedidos...</Text>
        ) : !total ? (
          <View style={styles.empty}>
            <Ionicons name="cube-outline" size={40} color={colors.textFaint} />
            <Text style={styles.emptyText}>Todavía no tienes pedidos.</Text>
            <Pressable onPress={() => navigation.navigate("Catalog", { title: "TODOS LOS PRODUCTOS" })}>
              <Text style={styles.filterLink}>Ir a comprar</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {active.length > 0 && <Text style={styles.section}>EN CURSO</Text>}
            {active.map((o) => (
              <OrderCard key={o._id} order={o} />
            ))}
            {past.length > 0 && <Text style={styles.section}>COMPRAS PASADAS</Text>}
            {past.map((o) => (
              <OrderCard key={o._id} order={o} />
            ))}
            {!active.length && !past.length && <Text style={styles.footNote}>No hay pedidos con este filtro.</Text>}
          </>
        )}
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
  empty: { alignItems: "center", gap: 10, marginTop: 40 },
  emptyText: { color: colors.textMuted, fontSize: 13 },
  track: { flexDirection: "row", marginTop: spacing.md },
  trackStep: { flex: 1, alignItems: "center" },
  trackDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  trackDotDone: { backgroundColor: colors.primary, borderColor: colors.primary },
  trackLabel: { color: colors.textFaint, fontSize: 9, fontWeight: "700", marginTop: 4 },
  trackLine: { position: "absolute", top: 9, left: "60%", right: "-40%", height: 2, backgroundColor: colors.border },
  trackLineDone: { backgroundColor: colors.primary },
  details: { marginTop: spacing.md, gap: 6, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, paddingTop: spacing.md },
  detailLine: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  detailName: { flex: 1, color: colors.text, fontSize: 12 },
  detailPrice: { color: colors.text, fontSize: 12, fontWeight: "700" },
  detailMeta: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
});
