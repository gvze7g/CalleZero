import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";
import { colors, radius } from "../../theme";

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Busca sneakers, hoodies, arte...",
  autoFocus = false,
  onSubmitEditing,
}) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="search" size={18} color={colors.textFaint} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textFaint}
        autoFocus={autoFocus}
        returnKeyType="search"
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    height: 48,
  },
  input: { flex: 1, color: colors.text, fontSize: 14, paddingVertical: 0 },
});
