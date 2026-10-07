import { StyleSheet, Text, View } from "react-native";
import AuthScreen from "../components/AuthScreen";
import Brand from "../components/Brand";
import Field from "../components/Field";
import PrimaryButton from "../components/PrimaryButton";
import useResetPassword from "../hooks/useResetPassword";
import { colors, spacing } from "../theme";

export default function ResetPasswordScreen({ navigation, route }) {
  const { email, code } = route.params || {};

  const { password, setPassword, confirm, setConfirm, loading, handleReset } =
    useResetPassword(navigation, email, code);

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
