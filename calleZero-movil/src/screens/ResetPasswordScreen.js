import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AuthScreen from "../components/AuthScreen";
import Brand from "../components/Brand";
import Field from "../components/Field";
import PrimaryButton from "../components/PrimaryButton";
import { authApi } from "../api/auth";
import { showError, showInfo } from "../utils/alerts";
import { colors, spacing } from "../theme";

export default function ResetPasswordScreen({ navigation, route }) {
  const { email, code } = route.params || {};

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirm) {
      showError("Completa ambos campos");
      return;
    }
    if (password.length < 8) {
      showError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      showError("La contraseña debe combinar letras y números");
      return;
    }
    if (password !== confirm) {
      showError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(email, code, password);
      showInfo(
        "Tu contraseña fue actualizada. Ya puedes iniciar sesión.",
        "Contraseña actualizada",
        () => navigation.reset({ index: 0, routes: [{ name: "Login" }] })
      );
    } catch (err) {
      showError(err.message || "No se pudo actualizar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen
      title="NUEVA CONTRASEÑA"
      onBack={() => navigation.goBack()}
      canGoBack={navigation.canGoBack()}
    >
      <Brand first="CREA TU NUEVA" second="CLAVE" size={24} />
      <Text style={styles.subtitle}>
        Elige una contraseña segura para <Text style={styles.email}>{email}</Text>.
      </Text>

      <View style={styles.form}>
        <Field
          label="NUEVA CONTRASEÑA"
          icon="lock-closed-outline"
          value={password}
          onChangeText={setPassword}
          placeholder="Ingresa Una Contraseña"
          secureTextEntry
          textContentType="newPassword"
          hint="Debe tener al menos 8 caracteres con una combinación de letras y números."
        />

        <Field
          label="CONFIRMAR CONTRASEÑA"
          icon="lock-closed-outline"
          value={confirm}
          onChangeText={setConfirm}
          placeholder="Repite La Contraseña"
          secureTextEntry
          textContentType="newPassword"
        />

        <PrimaryButton label="Cambiar Contraseña" onPress={handleReset} loading={loading} />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  email: { color: colors.text, fontWeight: "700" },
  form: { marginTop: spacing.sm },
});
