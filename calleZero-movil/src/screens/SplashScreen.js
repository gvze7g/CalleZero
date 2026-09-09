import { Image, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "../theme";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.center}>
        <View style={styles.logoTile}>
          <Image
            source={require("../../assets/logo-1.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.tagline}>U R B A N   E S S E N T I A L S</Text>
      </View>

      <Text style={styles.footer}>ESTABLECIDO 2026</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 72,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 20 },
  logoTile: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: { width: 60, height: 60, tintColor: "#FFFFFF" },
  tagline: {
    color: colors.textFaint,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
  },
  footer: {
    color: colors.textFaint,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
  },
});
