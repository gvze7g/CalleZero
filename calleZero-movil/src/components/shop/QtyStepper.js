import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "../../theme";

/** Selector de cantidad (- N +). Solo visual salvo que pases onChange. */
export default function QtyStepper({ value = 1, onChange, size = "md" }) {
  const small = size === "sm";
  const dec = () => onChange?.(Math.max(1, value - 1));
  const inc = () => onChange?.(value + 1);

  return (
    <View style={[styles.wrap, small && styles.wrapSm]}>
      <Pressable onPress={dec} hitSlop={6} style={styles.btn}>
        <Ionicons name="remove" size={small ? 14 : 16} color={colors.text} />
      </Pressable>
      <Text style={[styles.value, small && styles.valueSm]}>{value}</Text>
      <Pressable onPress={inc} hitSlop={6} style={styles.btn}>
        <Ionicons name="add" size={small ? 14 : 16} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.surfaceAlt,
  },
  wrapSm: { gap: 10, paddingHorizontal: 8, paddingVertical: 4 },
  btn: { alignItems: "center", justifyContent: "center" },
  value: { color: colors.text, fontSize: 14, fontWeight: "800", minWidth: 16, textAlign: "center" },
  valueSm: { fontSize: 12 },
});
