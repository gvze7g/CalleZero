import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../theme";

export default function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  icon = "arrow-forward",
}) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.btn,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.primaryText} />
      ) : (
        <View style={styles.content}>
          <Text style={styles.label}>{label}</Text>
          {icon ? <Ionicons name={icon} size={18} color={colors.primaryText} /> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { backgroundColor: colors.primaryDark },
  disabled: { opacity: 0.5 },
  content: { flexDirection: "row", alignItems: "center", gap: 8 },
  label: { color: colors.primaryText, fontSize: 15, fontWeight: "700" },
});
