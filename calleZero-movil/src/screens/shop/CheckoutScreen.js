import { useState } from "react";
import {
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

// CONECTAR API: `checkoutDefaults` puede venir del perfil (GET /api/users/me).
// El boton "Realizar Pedido" debe hacer POST /api/orders con el carrito real.
import { checkoutDefaults, paymentMethods, checkoutSummary } from "../../data/shop";
import { colors, radius, spacing } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import { useShop } from "../../context/ShopContext";
import { shopApi } from "../../api/shop";
import { showError, showInfo } from "../../utils/alerts";

const money = (n) => `$${n.toFixed(2)}`;

function LabeledInput({ label, icon, value, onChangeText, keyboardType, style }) {
  return (
    <View style={[{ marginBottom: spacing.md }, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        {icon ? <Ionicons name={icon} size={16} color={colors.textFaint} /> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          style={styles.input}
          placeholderTextColor={colors.textFaint}
        />
      </View>
    </View>
  );
}

export default function CheckoutScreen({ navigation }) {
  const { token } = useAuth();
  const { cart, clearCart } = useShop();
  const [form, setForm] = useState(checkoutDefaults);
  const [method, setMethod] = useState(paymentMethods[1].id);
  const setField = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const [placing, setPlacing] = useState(false);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const placeOrder = async () => {
    if (!cart.length) return showError("Tu carrito está vacío");
    if (!form.address.trim() || !form.city.trim() || !form.phone.trim()) return showError("Completa dirección, ciudad y teléfono");
    setPlacing(true);
    try { await shopApi.createOrder(token, { items: cart.map(i => ({ productId: i.id, name: i.name, quantity: i.quantity, size: i.size, price: i.price })), PaymentMethod: paymentMethods.find(x => x.id === method)?.label, ShippingAddress: `${form.fullName}, ${form.address}, ${form.city}, ${form.zip}, ${form.phone}` }); clearCart(); showInfo("Tu pedido fue creado correctamente", "Pedido realizado", () => navigation.navigate("OrderHistory")); } catch (e) { showError(e.message); } finally { setPlacing(false); }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable hitSlop={10} onPress={() => navigation.goBack()} style={styles.hIcon}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>FINALIZAR COMPRA</Text>
        <View style={styles.hIcon} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.section}>DETALLES DE ENVÍO</Text>

        <LabeledInput
          label="NOMBRE COMPLETO"
          icon="person-outline"
          value={form.fullName}
          onChangeText={setField("fullName")}
        />
        <LabeledInput
          label="DIRECCIÓN"
          icon="location-outline"
          value={form.address}
          onChangeText={setField("address")}
        />
        <View style={styles.rowGap}>
          <LabeledInput
            label="CIUDAD"
            value={form.city}
            onChangeText={setField("city")}
            style={{ flex: 1 }}
          />
          <LabeledInput
            label="ZIP-CODE"
            value={form.zip}
            onChangeText={setField("zip")}
            keyboardType="number-pad"
            style={{ width: 110 }}
          />
        </View>
        <LabeledInput
          label="TELÉFONO"
          icon="call-outline"
          value={form.phone}
          onChangeText={setField("phone")}
          keyboardType="phone-pad"
        />

        <Text style={styles.section}>MÉTODO DE PAGO</Text>
        <View style={styles.methods}>
          {paymentMethods.map((m) => (
            <Pressable
              key={m.id}
              onPress={() => setMethod(m.id)}
              style={[styles.method, method === m.id && styles.methodActive]}
            >
              <Ionicons
                name={m.icon}
                size={18}
                color={method === m.id ? "#fff" : colors.textMuted}
              />
              <Text
                style={[styles.methodText, method === m.id && { color: "#fff" }]}
              >
                {m.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.section}>RESUMEN DEL PEDIDO</Text>
        <View style={styles.summary}>
          <Line label={`Subtotal (${cart.length} artículos)`} value={money(subtotal)} />
          <Line
            label="Envío"
            value={checkoutSummary.shipping === 0 ? "Gratis" : money(checkoutSummary.shipping)}
            accent={checkoutSummary.shipping === 0}
          />
          <Line label="IVA (impuestos)" value={money(checkoutSummary.tax)} />
          <View style={styles.divider} />
          <Line label="TOTAL" value={money(subtotal)} bold />
        </View>

        <Text style={styles.fine}>
          Transacción encriptada, segura y protegida. Al continuar aceptas los
          Términos de Servicio y la Política de Privacidad de Calle Zero.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={styles.placeBtn}
          disabled={placing}
          onPress={placeOrder}
        >
          <Text style={styles.placeText}>
            {placing ? "Creando pedido..." : `Realizar Pedido — ${money(subtotal)}`}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Line({ label, value, accent, bold }) {
  return (
    <View style={styles.sLine}>
      <Text style={[styles.sLabel, bold && styles.sLabelBold]}>{label}</Text>
      <Text
        style={[
          styles.sValue,
          bold && styles.sValueBold,
          accent && { color: colors.success },
        ]}
      >
        {value}
      </Text>
    </View>
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
  headerTitle: { color: colors.text, fontSize: 13, fontWeight: "800", letterSpacing: 2 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: 24, paddingTop: spacing.sm },
  section: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  label: {
    color: colors.textFaint,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 6,
  },
  inputRow: {
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
  input: { flex: 1, color: colors.text, fontSize: 14, paddingVertical: 0 },
  rowGap: { flexDirection: "row", gap: 12 },
  methods: { flexDirection: "row", gap: 10 },
  method: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  methodActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  methodText: { color: colors.textMuted, fontSize: 12, fontWeight: "700" },
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
  sLabelBold: { color: colors.text, fontSize: 14, fontWeight: "800" },
  sValue: { color: colors.text, fontSize: 13, fontWeight: "700" },
  sValueBold: { fontSize: 16, fontWeight: "800" },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  fine: {
    color: colors.textFaint,
    fontSize: 10,
    lineHeight: 15,
    marginTop: spacing.lg,
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  placeBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  placeText: { color: "#fff", fontSize: 15, fontWeight: "800" },
});
