import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AuthScreen from "../components/AuthScreen";
import Brand from "../components/Brand";
import Field from "../components/Field";
import PrimaryButton from "../components/PrimaryButton";
import LinkRow from "../components/LinkRow";
import useRegister from "../hooks/useRegister";
import { emailChars, onlyLetters } from "../utils/validators";
import { colors, radius, spacing } from "../theme";

export default function RegisterScreen({ navigation }) {
  const { form, setField, accepted, setAccepted, loading, handleRegister } =
    useRegister(navigation);

  return (
    <AuthScreen
      title="REGISTRATE"
      onBack={() => navigation.goBack()}
      canGoBack={navigation.canGoBack()}
      footer={
        <LinkRow
          text="¿Ya eres miembro?"
          actionLabel="Inicia Sesión"
          onPress={() => navigation.navigate("Login")}
        />
      }
    >
      <Brand first="UNETE AL CLUB" second="ZERO" size={24} />
      <Text style={styles.subtitle}>
        Obtén acceso exclusivo a lanzamientos y colecciones de streetwear.
      </Text>

      <View style={styles.form}>
        <Field
          label="NOMBRE COMPLETO"
          icon="person-outline"
          value={form.fullName}
          onChangeText={(v) => setField("fullName")(onlyLetters(v))}
          placeholder="Ingresa Tu Nombre"
          autoCapitalize="words"
          textContentType="name"
        />

        <Field
          label="EMAIL ADDRESS"
          icon="mail-outline"
          value={form.email}
          onChangeText={(v) => setField("email")(emailChars(v))}
          placeholder="tu@ejemplo.com"
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
        />

        <Field
          label="CONTRASEÑA"
          icon="lock-closed-outline"
          value={form.password}
          onChangeText={setField("password")}
          placeholder="Ingresa Una Contraseña"
          secureTextEntry
          textContentType="newPassword"
          hint="Debe tener al menos 8 caracteres con una combinación de letras y números."
        />

        <Field
          label="CONFIRMAR CONTRASEÑA"
          icon="lock-closed-outline"
          value={form.confirmPassword}
          onChangeText={setField("confirmPassword")}
          placeholder="Repite La Contraseña"
          secureTextEntry
          textContentType="newPassword"
        />

        <Pressable style={styles.termsRow} onPress={() => setAccepted((a) => !a)}>
          <View style={[styles.checkbox, accepted && styles.checkboxOn]}>
            {accepted ? <Ionicons name="checkmark" size={14} color="#fff" /> : null}
          </View>
          <Text style={styles.termsText}>
            Yo acepto los <Text style={styles.termsStrong}>Términos de Servicio</Text> y{" "}
            <Text style={styles.termsStrong}>Política de Privacidad</Text>.
          </Text>
        </Pressable>

        <PrimaryButton
          label="Registrar Usuario"
          onPress={handleRegister}
          loading={loading}
        />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  form: { marginTop: spacing.xs },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: spacing.xl,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  termsText: { flex: 1, color: colors.textMuted, fontSize: 12, lineHeight: 17 },
  termsStrong: { color: colors.text, fontWeight: "700" },
});
