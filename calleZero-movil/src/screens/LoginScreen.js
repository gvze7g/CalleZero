import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AuthScreen from "../components/AuthScreen";
import Brand from "../components/Brand";
import Field from "../components/Field";
import PrimaryButton from "../components/PrimaryButton";
import LinkRow from "../components/LinkRow";
import { useAuth } from "../context/AuthContext";
import { showError } from "../utils/alerts";
import { colors, spacing } from "../theme";

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showError("Debes completar correo y contraseña");
      return;
    }

    setLoading(true);
    try {
      await signIn(email.trim().toLowerCase(), password);
      // Al autenticar, el navegador raiz cambia solo a la app.
    } catch (err) {
      showError(err.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen
      title="INICIAR SESIÓN"
      onBack={() => navigation.goBack()}
      canGoBack={navigation.canGoBack()}
      footer={
        <LinkRow
          text="No tienes una cuenta?"
          actionLabel="Registrate"
          onPress={() => navigation.navigate("Register")}
        />
      }
    >
      <Brand first="CALLE" second="ZERO" size={30} />
      <Text style={styles.subtitle}>Bienvenido al movimiento urbano</Text>

      <View style={styles.form}>
        <Field
          label="CORREO ELECTRONICO"
          icon="mail-outline"
          value={email}
          onChangeText={setEmail}
          placeholder="nombre@callezero.com"
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
        />

        <Field
          label="CONTRASEÑA"
          icon="lock-closed-outline"
          value={password}
          onChangeText={setPassword}
          placeholder="Tu contraseña"
          secureTextEntry
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={handleLogin}
        />

        <Pressable
          onPress={() => navigation.navigate("ForgotPassword")}
          hitSlop={8}
          style={styles.forgotWrap}
        >
          <Text style={styles.forgot}>Olvidaste Tu Contraseña?</Text>
        </Pressable>

        <PrimaryButton label="Iniciar Sesión" onPress={handleLogin} loading={loading} />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  form: { marginTop: spacing.sm },
  forgotWrap: { alignSelf: "flex-end", marginTop: -spacing.sm, marginBottom: spacing.xl },
  forgot: { color: colors.accent, fontSize: 12, fontWeight: "600" },
});
