import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import AddressForm from "../components/AddressForm";
import PrimaryButton from "../components/PrimaryButton";
import useAddresses from "../hooks/useAddresses";
import { colors, radius, spacing } from "../theme";

export default function AddressesScreen({ navigation }) {
  const { addresses, loading, saving, form, editingId, setField, openNew, openEdit, closeForm, save, remove, makeDefault } =
    useAddresses();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable hitSlop={10} onPress={() => (form ? closeForm() : navigation.goBack())} style={styles.hIcon}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {form ? (editingId ? "EDITAR DIRECCIÓN" : "NUEVA DIRECCIÓN") : "DIRECCIONES"}
        </Text>
        <View style={styles.hIcon} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {form ? (
          <>
            <AddressForm form={form} setField={setField} />
            <PrimaryButton label="Guardar Dirección" icon="checkmark" onPress={save} loading={saving} />
            <Pressable onPress={closeForm} style={styles.cancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
          </>
        ) : loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <>
            {addresses.map((a) => (
              <View key={a._id} style={[styles.card, a.isDefault && styles.cardDefault]}>
                <View style={styles.cardTop}>
                  <View style={styles.labelRow}>
                    <Ionicons name={a.label === "Trabajo" ? "briefcase-outline" : "home-outline"} size={16} color={colors.accent} />
                    <Text style={styles.cardLabel}>{a.label}</Text>
                    {a.isDefault && <Text style={styles.badge}>PREDETERMINADA</Text>}
                  </View>
                  <View style={styles.actions}>
                    <Pressable hitSlop={8} onPress={() => openEdit(a)}>
                      <Ionicons name="create-outline" size={19} color={colors.text} />
                    </Pressable>
                    <Pressable hitSlop={8} onPress={() => remove(a._id)}>
                      <Ionicons name="trash-outline" size={19} color={colors.danger} />
                    </Pressable>
                  </View>
                </View>
                <Text style={styles.name}>{a.fullName}</Text>
                <Text style={styles.line}>{a.address}</Text>
                <Text style={styles.line}>{[a.city, a.zip].filter(Boolean).join(", ")}</Text>
                <Text style={styles.line}>{a.phone}</Text>
                {!a.isDefault && (
                  <Pressable onPress={() => makeDefault(a._id)} style={styles.defaultBtn}>
                    <Text style={styles.defaultText}>Usar como predeterminada</Text>
                  </Pressable>
                )}
              </View>
            ))}

            {!addresses.length && (
              <View style={styles.empty}>
                <Ionicons name="location-outline" size={40} color={colors.textFaint} />
                <Text style={styles.emptyText}>Aún no tienes direcciones guardadas.</Text>
              </View>
            )}

            <PrimaryButton label="Agregar Dirección" icon="add" onPress={openNew} />
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  hIcon: { width: 32, alignItems: "center" },
  headerTitle: { color: colors.text, fontSize: 13, fontWeight: "800", letterSpacing: 2 },
  content: { padding: spacing.lg, gap: 12, paddingBottom: 60 },
  card: {
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  cardDefault: { borderColor: colors.primary },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardLabel: { color: colors.text, fontSize: 13, fontWeight: "800" },
  badge: {
    color: colors.accent,
    fontSize: 9,
    fontWeight: "800",
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.pill,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  actions: { flexDirection: "row", gap: 16 },
  name: { color: colors.text, fontSize: 13, fontWeight: "700" },
  line: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  defaultBtn: { marginTop: 10 },
  defaultText: { color: colors.accent, fontSize: 12, fontWeight: "700" },
  empty: { alignItems: "center", marginVertical: 40, gap: 12 },
  emptyText: { color: colors.textMuted, fontSize: 13 },
  cancel: { alignItems: "center", marginTop: spacing.md },
  cancelText: { color: colors.textMuted, fontSize: 13, fontWeight: "600" },
});
