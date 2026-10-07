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

import { colors, radius, spacing } from "../../theme";
import useCheckout, { paymentMethods } from "../../hooks/useCheckout";
import { onlyDigits, onlyLetters, phoneChars, safeChars } from "../../utils/validators";

const money = (n) => `$${n.toFixed(2)}`;

function LabeledInput({ label, icon, value, onChangeText, keyboardType, style, placeholder }) {
  return (
    <View style={[{ marginBottom: spacing.md }, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        {icon ? <Ionicons name={icon} size={16} color={colors.textFaint} /> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholder={placeholder}
          style={styles.input}
          placeholderTextColor={colors.textFaint}
        />
      </View>
    </View>
  );
}

export default function CheckoutScreen({ navigation }) {
  const {
    form,
    setField,
    addresses,
    selectedAddress,
    pickAddress,
    method,
    setMethod,
    cards,
    cardId,
    setCardId,
    placing,
    placeOrder,
    subtotal,
    discount,
    total,
    promo,
    itemsCount,
  } = useCheckout(navigation);

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
        <View style={styles.sectionRow}>
          <Text style={styles.section}>DETALLES DE ENVÍO</Text>
          <Pressable hitSlop={8} onPress={() => navigation.navigate("Addresses")}>
            <Text style={styles.link}>Mis direcciones</Text>
          </Pressable>
        </View>

        {addresses.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.addrRow}>
            {addresses.map((a) => (
              <Pressable
                key={a._id}
                onPress={() => pickAddress(a)}
                style={[styles.addrChip, selectedAddress === a._id && styles.addrChipActive]}
              >
                <Text style={[styles.addrLabel, selectedAddress === a._id && { color: "#fff" }]}>{a.label}</Text>
                <Text style={styles.addrText} numberOfLines={1}>{a.address}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        <LabeledInput
          label="NOMBRE COMPLETO"
          icon="person-outline"
          value={form.fullName}
          onChangeText={(v) => setField("fullName")(onlyLetters(v))}
          placeholder="Nombre de quien recibe"
        />
        <LabeledInput
          label="DIRECCIÓN"
          icon="location-outline"
          value={form.address}
          onChangeText={(v) => setField("address")(safeChars(v, 150))}
          placeholder="Colonia, calle, número"
        />
        <View style={styles.rowGap}>
          <LabeledInput
            label="CIUDAD"
            value={form.city}
            onChangeText={(v) => setField("city")(onlyLetters(v))}
            placeholder="San Salvador"
            style={{ flex: 1 }}
          />
          <LabeledInput
            label="C. POSTAL"
            value={form.zip}
            onChangeText={(v) => setField("zip")(onlyDigits(v, 10))}
            placeholder="Opcional"
            keyboardType="number-pad"
            style={{ width: 110 }}
          />
        </View>
        <LabeledInput
          label="TELÉFONO"
          icon="call-outline"
          value={form.phone}
          onChangeText={(v) => setField("phone")(phoneChars(v))}
          placeholder="7777-7777"
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

        {method === "card" && (
          <View style={styles.cards}>
            {cards.map((c) => (
              <Pressable key={c.id} onPress={() => setCardId(c.id)} style={[styles.cardRow, cardId === c.id && styles.cardRowActive]}>
                <Ionicons name={cardId === c.id ? "radio-button-on" : "radio-button-off"} size={18} color={cardId === c.id ? colors.accent : colors.textFaint} />
                <Text style={styles.cardText}>{c.brand} •••• {c.last4}</Text>
                <Text style={styles.cardExp}>{c.expiry}</Text>
              </Pressable>
            ))}
            <Pressable onPress={() => navigation.navigate("PaymentMethods")}>
              <Text style={styles.link}>{cards.length ? "Administrar tarjetas" : "+ Agregar una tarjeta"}</Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.section}>RESUMEN DEL PEDIDO</Text>
        <View style={styles.summary}>
          <Line label={`Subtotal (${itemsCount} artículos)`} value={money(subtotal)} />
          <Line label="Envío" value="Gratis" accent />
          {discount > 0 && <Line label={`Descuento (${promo.code})`} value={`-${money(discount)}`} accent />}
          <View style={styles.divider} />
          <Line label="TOTAL" value={money(total)} bold />
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
            {placing ? "Creando pedido..." : `Realizar Pedido — ${money(total)}`}
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
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  link: { color: colors.accent, fontSize: 12, fontWeight: "700" },
  addrRow: { gap: 8, paddingBottom: spacing.md },
  addrChip: {
    width: 160,
    padding: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  addrChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryDark },
  addrLabel: { color: colors.text, fontSize: 12, fontWeight: "800" },
  addrText: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  cards: { gap: 8, marginTop: spacing.md },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  cardRowActive: { borderColor: colors.primary },
  cardText: { flex: 1, color: colors.text, fontSize: 13, fontWeight: "700" },
  cardExp: { color: colors.textMuted, fontSize: 11 },
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
