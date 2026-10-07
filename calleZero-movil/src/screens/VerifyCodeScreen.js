import { StyleSheet, Text, View } from "react-native";
import AuthScreen from "../components/AuthScreen";
import Brand from "../components/Brand";
import CodeInput from "../components/CodeInput";
import PrimaryButton from "../components/PrimaryButton";
import ResendCode from "../components/ResendCode";
import useVerifyCode from "../hooks/useVerifyCode";
import { colors, spacing } from "../theme";

export default function VerifyCodeScreen({ navigation, route }) {
  const email = route.params?.email || "";

  const { code, setCode, loading, handleVerify, resend } = useVerifyCode(navigation, email);

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

        <ResendCode onResend={resend} />
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
