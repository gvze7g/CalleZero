import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AuthScreen from "../components/AuthScreen";
import Brand from "../components/Brand";
import CodeInput from "../components/CodeInput";
import PrimaryButton from "../components/PrimaryButton";
import ResendCode from "../components/ResendCode";
import { authApi } from "../api/auth";
import { showError } from "../utils/alerts";
import { colors, spacing } from "../theme";

export default function VerifyCodeScreen({ navigation, route }) {
  const email = route.params?.email || "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (code.length !== 6) {
      showError("Ingresa el código de 6 dígitos");
      return;
    }

    setLoading(true);
    try {
      await authApi.verifyRecoveryCode(email, code);
      navigation.navigate("ResetPassword", { email, code });
    } catch (err) {
      showError(err.message || "Código incorrecto o expirado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen
      title="VERIFICAR CÓDIGO"
      onBack={() => navigation.goBack()}
      canGoBack={navigation.canGoBack()}
    >
      <Brand first="INGRESA EL" second="CÓDIGO" size={24} />
      <Text style={styles.subtitle}>
        Escribe el código de 6 dígitos que enviamos a{"\n"}
        <Text style={styles.email}>{email}</Text>
      </Text>

      <View style={styles.form}>
        <CodeInput value={code} onChange={setCode} />

        <View style={{ height: spacing.xl }} />

        <PrimaryButton label="Continuar" onPress={handleVerify} loading={loading} />

        <View style={{ height: spacing.md }} />

        <ResendCode onResend={() => authApi.forgotPassword(email)} />
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
