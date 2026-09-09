import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AuthScreen from "../components/AuthScreen";
import Brand from "../components/Brand";
import Field from "../components/Field";
import PrimaryButton from "../components/PrimaryButton";
import LinkRow from "../components/LinkRow";
import { authApi } from "../api/auth";
import { showError } from "../utils/alerts";
import { colors, radius, spacing } from "../theme";

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const setField = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const handleRegister = async () => {
    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();

    if (!fullName || !email || !form.password) {
      showError("Debes completar todos los campos");
      return;
    }
    if (fullName.length < 3) {
      showError("El nombre debe tener al menos 3 caracteres");
      return;
    }
    if (form.password.length < 8) {
      showError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (!/[a-zA-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      showError("La contraseña debe combinar letras y números");
      return;
    }
    if (form.password !== form.confirmPassword) {
      showError("Las contraseñas no coinciden");
      return;
    }
    if (!accepted) {
      showError("Debes aceptar los Términos de Servicio y la Política de Privacidad");
      return;
    }

    setLoading(true);
    try {
      await authApi.register(fullName, email, form.password);
      navigation.navigate("VerifyEmail", { email, password: form.password });
    } catch (err) {
      showError(err.message || "No se pudo crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

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
          onChangeText={setField("fullName")}
          placeholder="Ingresa Tu Nombre"
          autoCapitalize="words"
          textContentType="name"
        />

        <Field
          label="EMAIL ADDRESS"
          icon="mail-outline"
          value={form.email}
          onChangeText={setField("email")}
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
