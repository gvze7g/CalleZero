import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

/**
 * Titulo de marca en dos palabras, la segunda resaltada en color.
 * Ej: <Brand first="CALLE" second="ZERO" />
 */
export default function Brand({ first, second, size = 26 }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.word, { fontSize: size }]}>{first} </Text>
      <Text style={[styles.word, styles.accent, { fontSize: size }]}>{second}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-end", flexWrap: "wrap" },
  word: {
    color: colors.text,
    fontWeight: "900",
    fontStyle: "italic",
    letterSpacing: 0.5,
  },
  accent: { color: colors.accent },
});
