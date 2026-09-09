import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../../theme";

export default function SectionHeader({ title, action, onAction }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.action}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
  },
  action: { color: colors.accent, fontSize: 12, fontWeight: "600" },
});
