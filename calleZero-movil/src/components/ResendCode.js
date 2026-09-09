import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme";

/**
 * Enlace "Reenviar codigo" con cuenta regresiva.
 * onResend: funcion async que reenvia el codigo.
 */
export default function ResendCode({ onResend, seconds = 30 }) {
  const [left, setLeft] = useState(seconds);
  const [busy, setBusy] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setLeft((n) => (n <= 1 ? 0 : n - 1));
    }, 1000);
    return () => clearInterval(timer.current);
  }, []);

  const handlePress = async () => {
    if (left > 0 || busy) return;
    setBusy(true);
    try {
      await onResend();
      setLeft(seconds);
    } finally {
      setBusy(false);
    }
  };

  const disabled = left > 0 || busy;

  return (
    <Pressable onPress={handlePress} disabled={disabled} hitSlop={8} style={styles.wrap}>
      <Text style={[styles.text, disabled && styles.disabled]}>
        {left > 0 ? `Reenviar código en ${left}s` : "Reenviar código"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: "center", paddingVertical: 8 },
  text: { color: colors.accent, fontSize: 13, fontWeight: "600" },
  disabled: { color: colors.textFaint },
});
