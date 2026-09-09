import { useState, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  Pressable,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
// profileStats es mock: el backend no expone #pedidos / #reseñas / puntos.
// CONECTAR API: cuando exista un endpoint de estadisticas, reemplazar aqui.
import { colors, radius, spacing } from "../theme";

const ACCOUNT_ROWS = [
  {
    icon: "person-outline",
    label: "Información personal",
    hint: "Nombre, correo, número de teléfono",
    action: "edit",
  },
  {
    icon: "location-outline",
    label: "Direcciones guardadas",
    hint: "Ubicaciones de entrega predeterminadas",
  },
  {
    icon: "card-outline",
    label: "Método de pago",
    hint: "Visa que termina en 4242",
  },
];

export default function ProfileScreen({ navigation }) {
  const { user, signOut, refreshUser } = useAuth();
  const { profilePhoto, saveProfilePhoto, paymentMethods } = useShop();
  const [loggingOut, setLoggingOut] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshUser();
    } catch {}
    setRefreshing(false);
  }, [refreshUser]);

  const initials = (user?.fullName || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
    } finally {
      setLoggingOut(false);
    }
  };
  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.7 });
    if (!result.canceled) saveProfilePhoto(result.assets[0].uri);
  };

  const shopRows = [
    {
      icon: "cube-outline",
      label: "Mis pedidos",
      hint: "Seguimiento y gestión de envíos",
      onPress: () => navigation.navigate("OrderHistory"),
    },
    {
      icon: "bag-handle-outline",
      label: "Mi carrito de compras",
      hint: "Artículos que has añadido recientemente",
      onPress: () => navigation.navigate("Tabs", { screen: "Carrito" }),
    },
    {
      icon: "notifications-outline",
      label: "Notificaciones",
      hint: "Ofertas y actualizaciones de pedidos",
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>MI CUENTA</Text>
        <Ionicons name="settings-outline" size={20} color={colors.text} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.textMuted}
          />
        }
      >
        {/* Tarjeta de usuario (datos reales del backend) */}
        <View style={styles.userCard}>
          <Pressable style={styles.avatar} onPress={pickPhoto}>
            {profilePhoto ? <Image source={{ uri: profilePhoto }} style={styles.avatarImage} /> : <Text style={styles.avatarText}>{initials}</Text>}
            <View style={styles.avatarCheck}>
              <Ionicons
                name={user?.isVerified ? "checkmark" : "alert"}
                size={11}
                color="#fff"
              />
            </View>
          </Pressable>

          <Text style={styles.name}>{user?.fullName || "Miembro Zero"}</Text>
          <Text style={styles.email}>{user?.email || ""}</Text>

          <View style={styles.memberBadge}>
            <Ionicons name="diamond-outline" size={11} color={colors.accent} />
            <Text style={styles.memberText}>
              {user?.isVerified ? "Miembro Elite" : "Cuenta sin verificar"}
            </Text>
          </View>

          <Pressable
            style={styles.editBtn}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text style={styles.editText}>Editar Perfil</Text>
          </Pressable>
        </View>

        {/* Detalles de la cuenta */}
        <Text style={styles.section}>DETALLES DE LA CUENTA</Text>
        <View style={styles.group}>
          {ACCOUNT_ROWS.map((row, i) => (
            <Row
              key={row.label}
              row={row}
              last={i === ACCOUNT_ROWS.length - 1}
              onPress={
                row.action === "edit" ? () => navigation.navigate("EditProfile") : row.icon === "card-outline" ? () => navigation.navigate("PaymentMethods") : undefined
              }
            />
          ))}
        </View>

        {/* Compras */}
        <Text style={styles.section}>COMPRAS</Text>
        <View style={styles.group}>
          {shopRows.map((row, i) => (
            <Row key={row.label} row={row} last={i === shopRows.length - 1} onPress={row.onPress} />
          ))}
        </View>

        <Pressable
          onPress={handleLogout}
          disabled={loggingOut}
          style={({ pressed }) => [styles.logout, pressed && { opacity: 0.6 }]}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          <Text style={styles.logoutText}>
            {loggingOut ? "Cerrando sesión..." : "Cerrar Sesión"}
          </Text>
        </Pressable>

        <Text style={styles.version}>CALLE ZERO · v1.4.0 (2026)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ row, last, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, !last && styles.rowDivider]}
    >
      <View style={styles.rowIcon}>
        <Ionicons name={row.icon} size={18} color={colors.textMuted} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{row.label}</Text>
        {row.hint ? <Text style={styles.rowHint}>{row.hint}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textFaint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    height: 52,
  },
  headerTitle: { color: colors.text, fontSize: 14, fontWeight: "800", letterSpacing: 2 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: 100 },

  userCard: {
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginTop: spacing.sm,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  avatarText: { color: "#fff", fontSize: 22, fontWeight: "800" },
  avatarImage: { width: 72, height: 72, borderRadius: 36 },
  avatarCheck: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.success,
    borderWidth: 3,
    borderColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { color: colors.text, fontSize: 18, fontWeight: "800" },
  email: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(139,92,246,0.12)",
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: spacing.md,
  },
  memberText: { color: colors.accent, fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  editBtn: {
    marginTop: spacing.lg,
    alignSelf: "stretch",
    height: 42,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  editText: { color: colors.accent, fontSize: 13, fontWeight: "700" },

  stats: {
    flexDirection: "row",
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    marginTop: spacing.md,
    paddingVertical: spacing.lg,
  },
  stat: { flex: 1, alignItems: "center" },
  statDivider: { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: colors.border },
  statValue: { color: colors.text, fontSize: 18, fontWeight: "800" },
  statLabel: { color: colors.textMuted, fontSize: 11, marginTop: 2 },

  section: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  group: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 14 },
  rowDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  rowIcon: { width: 20, alignItems: "center" },
  rowLabel: { color: colors.text, fontSize: 14, fontWeight: "600" },
  rowHint: { color: colors.textFaint, fontSize: 11, marginTop: 2 },

  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.xl,
  },
  logoutText: { color: colors.danger, fontSize: 14, fontWeight: "700" },
  version: {
    color: colors.textFaint,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    textAlign: "center",
    marginTop: spacing.lg,
  },
});
