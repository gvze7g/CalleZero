import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AuthScreen from "../components/AuthScreen";
import Brand from "../components/Brand";
import CodeInput from "../components/CodeInput";
import PrimaryButton from "../components/PrimaryButton";
import ResendCode from "../components/ResendCode";
import LinkRow from "../components/LinkRow";
import { authApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { showError, showInfo } from "../utils/alerts";
import { colors, spacing } from "../theme";

export default function VerifyEmailScreen({ navigation, route }) {
  const email = route.params?.email || "";
  const { persistSession } = useAuth();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (code.length !== 6) {
      showError("Ingresa el código de 6 dígitos");
      return;
    }

    setLoading(true);
    try {
      const data = await authApi.verifyAccount(email, code);
      // Cuenta verificada: guardamos sesion y el root pasa a la app.
      if (data.token) {
        await persistSession(data.token, data.user || null);
      } else {
        showInfo("Tu cuenta fue verificada. Inicia sesión.", "Cuenta verificada", () =>
          navigation.navigate("Login")
        );
      }
    } catch (err) {
      showError(err.message || "Código incorrecto o expirado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen
      title="VERIFICAR CUENTA"
      onBack={() => navigation.goBack()}
      canGoBack={navigation.canGoBack()}
      footer={
        <LinkRow
          text="¿Correo equivocado?"
          actionLabel="Volver al registro"
          onPress={() => navigation.navigate("Register")}
        />
      }
    >
      <Brand first="CONFIRMA TU" second="CORREO" size={24} />
      <Text style={styles.subtitle}>
        Enviamos un código de 6 dígitos a{"\n"}
        <Text style={styles.email}>{email}</Text>
      </Text>

      <View style={styles.form}>
        <CodeInput value={code} onChange={setCode} />

        <View style={{ height: spacing.xl }} />

        <PrimaryButton label="Verificar Cuenta" onPress={handleVerify} loading={loading} />

        <View style={{ height: spacing.md }} />

        <ResendCode onResend={() => authApi.sendVerificationCode(email)} />
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
    marginBottom: spacing.xxl,
  },
  email: { color: colors.text, fontWeight: "700" },
  form: { marginTop: spacing.sm },
});
