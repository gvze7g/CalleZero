import { Pressable, StyleSheet, Text, View } from "react-native";
import Field from "./Field";
import { onlyDigits, onlyLetters, phoneChars, safeChars } from "../utils/validators";
import { colors, radius, spacing } from "../theme";

const LABELS = ["Casa", "Trabajo", "Otro"];

// Formulario de direccion (Direcciones guardadas)
export default function AddressForm({ form, setField }) {
  return (
    <View>
      <Text style={styles.label}>ETIQUETA</Text>
      <View style={styles.chips}>
        {LABELS.map((l) => (
          <Pressable
            key={l}
            onPress={() => setField("label")(l)}
            style={[styles.chip, form.label === l && styles.chipActive]}
          >
            <Text style={[styles.chipText, form.label === l && { color: "#fff" }]}>{l}</Text>
          </Pressable>
        ))}
      </View>

      <Field
        label="NOMBRE DE QUIEN RECIBE"
        icon="person-outline"
        value={form.fullName}
        onChangeText={(v) => setField("fullName")(onlyLetters(v))}
        placeholder="Nombre completo"
        autoCapitalize="words"
      />
      <Field
        label="DIRECCIÓN"
        icon="location-outline"
        value={form.address}
        onChangeText={(v) => setField("address")(safeChars(v, 150))}
        placeholder="Colonia, calle, número de casa"
        autoCapitalize="sentences"
      />
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Field
            label="CIUDAD"
            value={form.city}
            onChangeText={(v) => setField("city")(onlyLetters(v))}
            placeholder="San Salvador"
            autoCapitalize="words"
          />
        </View>
        <View style={{ width: 120 }}>
          <Field
            label="C. POSTAL"
            value={form.zip}
            onChangeText={(v) => setField("zip")(onlyDigits(v, 10))}
            placeholder="Opcional"
            keyboardType="number-pad"
          />
        </View>
      </View>
      <Field
        label="TELÉFONO"
        icon="call-outline"
        value={form.phone}
        onChangeText={(v) => setField("phone")(phoneChars(v))}
        placeholder="7777-7777"
        keyboardType="phone-pad"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.textMuted, fontSize: 11, fontWeight: "700", letterSpacing: 1.2, marginBottom: spacing.sm },
  chips: { flexDirection: "row", gap: 8, marginBottom: spacing.lg },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textMuted, fontSize: 12, fontWeight: "700" },
  row: { flexDirection: "row", gap: 10 },
});
