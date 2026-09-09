import { useRef } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius } from "../theme";

/**
 * Entrada de codigo de N digitos (por defecto 6) con cajas separadas.
 * Usa un TextInput invisible que captura el texto; las cajas son solo visuales.
 *
 * props: value (string), onChange (fn), length (number), autoFocus (bool)
 */
export default function CodeInput({ value = "", onChange, length = 6, autoFocus = true }) {
  const inputRef = useRef(null);
  const cells = Array.from({ length }, (_, i) => value[i] || "");
  const activeIndex = Math.min(value.length, length - 1);

  const handleChange = (text) => {
    onChange(text.replace(/[^0-9]/g, "").slice(0, length));
  };

  return (
    <Pressable style={styles.wrap} onPress={() => inputRef.current?.focus()}>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus={autoFocus}
        style={styles.hiddenInput}
        caretHidden
        textContentType="oneTimeCode"
      />

      <View style={styles.row}>
        {cells.map((digit, i) => {
          const isActive = i === activeIndex && value.length < length;
          return (
            <View
              key={i}
              style={[
                styles.cell,
                digit !== "" && styles.cellFilled,
                isActive && styles.cellActive,
              ]}
            >
              <Text style={styles.digit}>{digit}</Text>
            </View>
          );
        })}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "relative" },
  hiddenInput: { position: "absolute", opacity: 0, height: 1, width: 1 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  cell: {
    width: 46,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  cellFilled: { borderColor: colors.primary },
  cellActive: { borderColor: colors.borderFocus },
  digit: { color: colors.text, fontSize: 22, fontWeight: "700" },
});
