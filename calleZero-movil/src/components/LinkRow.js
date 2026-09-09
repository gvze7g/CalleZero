import { StyleSheet, Text } from "react-native";
import { colors } from "../theme";

/**
 * Texto de pie con una parte tocable resaltada.
 * <LinkRow text="No tienes una cuenta?" actionLabel="Registrate" onPress={...} />
 */
export default function LinkRow({ text, actionLabel, onPress, align = "center" }) {
  return (
    <Text style={[styles.text, { textAlign: align }]}>
      {text ? `${text} ` : ""}
      <Text style={styles.action} onPress={onPress}>
        {actionLabel}
      </Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  text: { color: colors.textMuted, fontSize: 13 },
  action: { color: colors.accent, fontWeight: "700" },
});
