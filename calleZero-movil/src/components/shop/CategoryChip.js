import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radius } from "../../theme";

export default function CategoryChip({ label, active, onPress, icon }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}
    >
      <Text style={[styles.text, active ? styles.textActive : styles.textIdle]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipIdle: { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
  text: { fontSize: 12, fontWeight: "700" },
  textActive: { color: "#fff" },
  textIdle: { color: colors.textMuted },
});
