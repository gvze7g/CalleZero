import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import QtyStepper from "../../components/shop/QtyStepper";
import useCart from "../../hooks/useCart";
import { promoChars } from "../../utils/validators";
import { colors, radius, spacing } from "../../theme";

const money = (n) => `$${Math.abs(n).toFixed(2)}`;

export default function CartScreen({ navigation }) {
  const {
    items,
    itemsCount,
    subtotal,
    discount,
    total,
    promo,
    promoInput,
    setPromoInput,
    applying,
    applyPromo,
    removePromo,
    removeItem,
    setItemQuantity,
  } = useCart();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>CARRITO</Text>
        <Text style={styles.count}>{itemsCount} artículos</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {!items.length && (
          <View style={styles.empty}>
            <Ionicons name="bag-outline" size={42} color={colors.textFaint} />
            <Text style={styles.emptyText}>Tu carrito está vacío</Text>
            <Pressable onPress={() => navigation.navigate("Catalog", { title: "TODOS LOS PRODUCTOS" })}>
              <Text style={styles.emptyLink}>Ver productos</Text>
            </Pressable>
          </View>
        )}

        {items.map((item) => (
          <View key={`${item.id}-${item.size}`} style={styles.row}>
            {item.image ? <Image source={item.image} style={styles.thumb} resizeMode="cover" /> : <View style={styles.thumb} />}
            <View style={styles.info}>
              <View style={styles.infoTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.brand}>{item.brand}</Text>
                  <Text style={styles.name} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.size}>Talla: {item.size}</Text>
                </View>
                <Pressable hitSlop={8} onPress={() => removeItem(item)}>
                  <Ionicons name="close" size={16} color={colors.textFaint} />
                </Pressable>
              </View>
              <View style={styles.infoBottom}>
                <QtyStepper
                  size="sm"
                  value={item.quantity}
                  onChange={(q) => setItemQuantity(item, q)}
                />
                <Text style={styles.price}>{money(item.price * item.quantity)}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* Promo code */}
        <Text style={styles.section}>CÓDIGO PROMOCIONAL</Text>
        {promo ? (
          <View style={styles.promoApplied}>
            <Ionicons name="pricetag" size={16} color={colors.success} />
            <View style={{ flex: 1 }}>
              <Text style={styles.promoCode}>{promo.code}</Text>
              <Text style={styles.promoDesc}>
                {promo.discountType === "percent" ? `${promo.value}% de descuento` : `$${promo.value} de descuento`}
                {promo.description ? ` · ${promo.description}` : ""}
              </Text>
            </View>
            <Pressable hitSlop={8} onPress={removePromo}>
              <Ionicons name="close" size={18} color={colors.textMuted} />
            </Pressable>
          </View>
        ) : (
          <View style={styles.promoRow}>
            <View style={styles.promoInput}>
              <Ionicons name="pricetag-outline" size={16} color={colors.textFaint} />
              <TextInput
                value={promoInput}
                onChangeText={(v) => setPromoInput(promoChars(v))}
                placeholder="Código"
                placeholderTextColor={colors.textFaint}
                style={styles.promoField}
                autoCapitalize="characters"
                maxLength={20}
              />
            </View>
            <Pressable style={[styles.applyBtn, applying && { opacity: 0.6 }]} onPress={applyPromo} disabled={applying}>
              <Text style={styles.applyText}>{applying ? "..." : "APLICAR"}</Text>
            </Pressable>
          </View>
        )}

        {/* Resumen */}
        <Text style={styles.section}>RESUMEN DEL PEDIDO</Text>
        <View style={styles.summary}>
          <SummaryLine label="Subtotal" value={money(subtotal)} />
          <SummaryLine label="Envío estándar" value="Gratis" accent />
          {discount > 0 && <SummaryLine label={`Descuento (${promo.code})`} value={`-${money(discount)}`} accent />}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalValue}>{money(total)}</Text>
        </View>
        <Pressable disabled={!items.length} style={[styles.pay, !items.length && { opacity: 0.5 }]} onPress={() => navigation.navigate("Checkout")}>
          <Text style={styles.payText}>Pagar ahora</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function SummaryLine({ label, value, accent }) {
  return (
    <View style={styles.sLine}>
      <Text style={styles.sLabel}>{label}</Text>
      <Text style={[styles.sValue, accent && { color: colors.success }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  headerTitle: { color: colors.text, fontSize: 14, fontWeight: "800", letterSpacing: 2 },
  count: { color: colors.textMuted, fontSize: 12 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: 24 },
  row: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  thumb: {
    width: 78,
    height: 92,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
  },
  info: { flex: 1, justifyContent: "space-between" },
  infoTop: { flexDirection: "row", gap: 8 },
  brand: { color: colors.accent, fontSize: 9, fontWeight: "800", letterSpacing: 0.6 },
  name: { color: colors.text, fontSize: 13, fontWeight: "700", marginTop: 2 },
  size: { color: colors.textFaint, fontSize: 11, marginTop: 2 },
  infoBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  price: { color: colors.text, fontSize: 14, fontWeight: "800" },
  section: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  promoRow: { flexDirection: "row", gap: 10 },
  promoInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    height: 46,
  },
  promoField: { flex: 1, color: colors.text, fontSize: 13, paddingVertical: 0 },
  promoApplied: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.success,
    backgroundColor: colors.surfaceAlt,
  },
  promoCode: { color: colors.text, fontSize: 13, fontWeight: "800", letterSpacing: 1 },
  promoDesc: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  empty: { alignItems: "center", gap: 10, marginVertical: 40 },
  emptyText: { color: colors.textMuted, fontSize: 14 },
  emptyLink: { color: colors.accent, fontSize: 13, fontWeight: "700" },
  applyBtn: {
    paddingHorizontal: 18,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  applyText: { color: colors.text, fontSize: 12, fontWeight: "800" },
  summary: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
    gap: 10,
  },
  sLine: { flexDirection: "row", justifyContent: "space-between" },
  sLabel: { color: colors.textMuted, fontSize: 13 },
  sValue: { color: colors.text, fontSize: 13, fontWeight: "700" },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  totalLabel: { color: colors.textMuted, fontSize: 13, fontWeight: "700" },
  totalValue: { color: colors.text, fontSize: 20, fontWeight: "800" },
  pay: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  payText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
