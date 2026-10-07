import { StyleSheet, Text, View } from "react-native";
import AuthScreen from "../components/AuthScreen";
import Brand from "../components/Brand";
import CodeInput from "../components/CodeInput";
import Field from "../components/Field";
import PrimaryButton from "../components/PrimaryButton";
import ResendCode from "../components/ResendCode";
import LinkRow from "../components/LinkRow";
import useVerifyEmail from "../hooks/useVerifyEmail";
import { emailChars } from "../utils/validators";
import { colors, spacing } from "../theme";

export default function VerifyEmailScreen({ navigation, route }) {
  const { email, setEmail, codeSent, sendCode, code, setCode, loading, handleVerify, resend } =
    useVerifyEmail(navigation, route.params?.email || "");

  return (
    <AuthScreen
      title="VERIFICAR CUENTA"
      onBack={() => navigation.goBack()}
      canGoBack={navigation.canGoBack()}
      footer={
        <LinkRow
          text="¿Ya está verificada?"
          actionLabel="Inicia Sesión"
          onPress={() => navigation.navigate("Login")}
        />
      }
    >
      <Brand first="CONFIRMA TU" second="CORREO" size={24} />

      {codeSent ? (
        <>
          <Text style={styles.subtitle}>
            Enviamos un código de 6 dígitos a{"\n"}
            <Text style={styles.email}>{email}</Text>
          </Text>

          <View style={styles.form}>
            <CodeInput value={code} onChange={setCode} />
            <View style={{ height: spacing.xl }} />
            <PrimaryButton label="Verificar Cuenta" onPress={handleVerify} loading={loading} />
            <View style={{ height: spacing.md }} />
            <ResendCode onResend={resend} />
          </View>
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>
            Escribe el correo de tu cuenta y te enviaremos un código para verificarla.
          </Text>

          <View style={styles.form}>
            <Field
              label="CORREO ELECTRONICO"
              icon="mail-outline"
              value={email}
              onChangeText={(v) => setEmail(emailChars(v))}
              placeholder="nombre@callezero.com"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="send"
              onSubmitEditing={sendCode}
            />
            <PrimaryButton label="Enviar Código" onPress={sendCode} loading={loading} />
          </View>
        </>
      )}
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
