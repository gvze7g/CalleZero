import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme";

const VARIANTS = {
  NUEVO: colors.primary,
  HOT: "#EC4899",
  OFERTA: "#F59E0B",
  TOP: colors.primary,
  "-30%": "#EF4444",
};

export default function Tag({ label, style }) {
  const bg = VARIANTS[label] || colors.primary;
  return (
    <View style={[styles.tag, { backgroundColor: bg }, style]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  text: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
});
