import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import HeroBanner from "../../components/shop/HeroBanner";
import SectionHeader from "../../components/shop/SectionHeader";
import ProductCardLarge from "../../components/shop/ProductCardLarge";
import ProductCardGrid from "../../components/shop/ProductCardGrid";
import CategoryChip from "../../components/shop/CategoryChip";
// CONECTAR API: `hotDrops` y `products` -> GET /api/product ; `heroBanner` puede
// quedar fijo o venir de un endpoint de banners/promos.
import {
  heroBanner,
  hotDrops,
  homeCategories,
  products,
} from "../../data/shop";
import { colors, spacing } from "../../theme";

export default function HomeShopScreen({ navigation }) {
  const [activeCat, setActiveCat] = useState("hoodies");
  const recommended = products.slice(0, 6);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoTile}>
          <Image
            source={require("../../../assets/logo-1.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.headerIcons}>
          <Pressable
            hitSlop={8}
            onPress={() => navigation.navigate("Buscar")}
            style={styles.iconBtn}
          >
            <Ionicons name="search" size={20} color={colors.text} />
          </Pressable>
          <Pressable hitSlop={8} style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={20} color={colors.text} />
          </Pressable>
          <Pressable
            hitSlop={8}
            onPress={() => navigation.navigate("Carrito")}
            style={styles.iconBtn}
          >
            <Ionicons name="bag-outline" size={20} color={colors.text} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HeroBanner data={heroBanner} />

        {/* HOT DROPS */}
        <View style={styles.section}>
          <SectionHeader
            title="HOT DROPS"
            action="Ver Todos"
            onAction={() => navigation.navigate("Catalog", { title: "HOT DROPS" })}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hRow}
          >
            {hotDrops.map((item) => (
              <ProductCardLarge
                key={item.id}
                product={item}
                onPress={() => navigation.navigate("ProductDetail", { product: item })}
              />
            ))}
          </ScrollView>
        </View>

        {/* Categorias */}
        <View style={styles.chipsRow}>
          {homeCategories.map((c) => (
            <CategoryChip
              key={c.id}
              label={c.label}
              active={activeCat === c.id}
              onPress={() => setActiveCat(c.id)}
            />
          ))}
        </View>

        {/* RECOMENDADO */}
        <View style={styles.section}>
          <SectionHeader
            title="RECOMENDADO"
            action="Filtrar"
            onAction={() => navigation.navigate("Catalog", { title: "RECOMENDADO" })}
          />
          <View style={styles.grid}>
            {recommended.map((p) => (
              <View key={p.id} style={styles.gridItem}>
                <ProductCardGrid
                  product={p}
                  onPress={() => navigation.navigate("ProductDetail", { product: p })}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
      <Pressable style={styles.fab}>
        <Ionicons name="add" size={26} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}

const GAP = 12;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  logoTile: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: { width: 20, height: 20, tintColor: "#fff" },
  headerIcons: { flexDirection: "row", alignItems: "center", gap: 18 },
  iconBtn: { position: "relative" },
  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: { color: "#fff", fontSize: 9, fontWeight: "800" },
  content: { paddingHorizontal: spacing.lg, paddingBottom: 110 },
  section: { marginTop: spacing.xl },
  hRow: { gap: GAP, paddingRight: spacing.lg },
  chipsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: spacing.xl,
    flexWrap: "wrap",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: { width: "48%", marginBottom: spacing.md },
  fab: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.xl,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
});
