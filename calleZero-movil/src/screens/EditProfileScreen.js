import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import Field from "../components/Field";
import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import { showError, showInfo } from "../utils/alerts";
import { colors, spacing } from "../theme";

/**
 * Pantalla FUNCIONAL: edita el perfil del usuario real.
 * GET /api/users/me  (ya cargado en el contexto)  ->  PUT /api/users/me
 */
export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });
  const [saving, setSaving] = useState(false);

  const setField = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    const fullName = form.fullName.trim();

    if (fullName.length < 3 || fullName.length > 50) {
      showError("El nombre debe tener entre 3 y 50 caracteres");
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        fullName,
        phone: form.phone.trim(),
        location: form.location.trim(),
      });
      showInfo("Perfil actualizado correctamente", "Listo", () => navigation.goBack());
    } catch (err) {
      showError(err.message || "No se pudo actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable hitSlop={10} onPress={() => navigation.goBack()} style={styles.hIcon}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>EDITAR PERFIL</Text>
        <View style={styles.hIcon} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Field
          label="NOMBRE COMPLETO"
          icon="person-outline"
          value={form.fullName}
          onChangeText={setField("fullName")}
          placeholder="Tu nombre"
          autoCapitalize="words"
        />

        <Field
          label="CORREO ELECTRONICO"
          icon="mail-outline"
          value={user?.email || ""}
          onChangeText={() => {}}
          editable={false}
          hint="El correo no se puede cambiar desde aquí."
        />

        <Field
          label="TELÉFONO"
          icon="call-outline"
          value={form.phone}
          onChangeText={setField("phone")}
          placeholder="+503 0000-0000"
          keyboardType="phone-pad"
        />

        <Field
          label="DIRECCIÓN / UBICACIÓN"
          icon="location-outline"
          value={form.location}
          onChangeText={setField("location")}
          placeholder="Ciudad, país"
          autoCapitalize="words"
        />

        <PrimaryButton
          label="Guardar Cambios"
          icon="checkmark"
          onPress={handleSave}
          loading={saving}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    height: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  hIcon: { width: 32, alignItems: "center" },
  headerTitle: { color: colors.text, fontSize: 13, fontWeight: "800", letterSpacing: 2 },
  content: { padding: spacing.xl },
});
