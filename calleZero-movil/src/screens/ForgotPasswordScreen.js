import { StyleSheet, Text, View } from "react-native";
import AuthScreen from "../components/AuthScreen";
import Brand from "../components/Brand";
import Field from "../components/Field";
import PrimaryButton from "../components/PrimaryButton";
import LinkRow from "../components/LinkRow";
import useForgotPassword from "../hooks/useForgotPassword";
import { colors, spacing } from "../theme";

export default function ForgotPasswordScreen({ navigation }) {
  const { email, setEmail, loading, handleSend } = useForgotPassword(navigation);

  return (
    <AuthScreen
      title="RECUPERAR CONTRASEÑA"
      onBack={() => navigation.goBack()}
      canGoBack={navigation.canGoBack()}
      footer={
        <LinkRow
          text="¿Ya la recordaste?"
          actionLabel="Inicia Sesión"
          onPress={() => navigation.navigate("Login")}
        />
      }
    >
      <Brand first="OLVIDASTE TU" second="CLAVE" size={24} />
      <Text style={styles.subtitle}>
        Ingresa el correo de tu cuenta y te enviaremos un código de verificación para
        restablecer tu contraseña.
      </Text>

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
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />

        <PrimaryButton label="Enviar Código" onPress={handleSend} loading={loading} />
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
  form: { marginTop: spacing.sm },
});
