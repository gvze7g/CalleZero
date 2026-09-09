import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import SearchBar from "../../components/shop/SearchBar";
import SectionHeader from "../../components/shop/SectionHeader";
import TrendingTile from "../../components/shop/TrendingTile";
import ProductCardLarge from "../../components/shop/ProductCardLarge";
// CONECTAR API: `trending` -> GET /api/categories ; `staffPicks` -> GET /api/product ;
// `recentSearches` normalmente es estado local guardado en el dispositivo.
import { trending } from "../../data/shop";
import { shopApi, productView } from "../../api/shop";
import { useShop } from "../../context/ShopContext";
import { colors, radius, spacing } from "../../theme";

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const { recentSearches: recents, addRecentSearch, removeRecentSearch } = useShop();
  const [products, setProducts] = useState([]);
  useEffect(() => { shopApi.products().then(data => setProducts(data.filter(p => p.isActive !== false).map(productView))).catch(() => {}); }, []);
  const results = useMemo(() => products.filter(p => `${p.name} ${p.description || ""} ${p.categoryId?.name || ""}`.toLowerCase().includes(query.toLowerCase())), [products, query]);

  const removeRecent = (term) =>
    removeRecentSearch(term);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          hitSlop={10}
          onPress={() => navigation.navigate("Inicio")}
          style={styles.hIcon}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>DESCUBRIR</Text>
        <Pressable hitSlop={10} style={styles.hIcon}>
          <Ionicons name="options-outline" size={22} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SearchBar value={query} onChangeText={setQuery} onSubmitEditing={() => addRecentSearch(query)} />

        {query.trim() ? <View style={styles.section}><SectionHeader title={`RESULTADOS (${results.length})`} /><View style={styles.hRow}>{results.map(p => <ProductCardLarge key={p.id} product={p} onPress={() => navigation.navigate("ProductDetail", { product: p })} />)}</View></View> : null}

        {/* Busquedas recientes */}
        {recents.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="BÚSQUEDAS RECIENTES"
              action="Limpiar"
              onAction={() => recents.forEach(removeRecentSearch)}
            />
            <View style={styles.recentRow}>
              {recents.map((term) => (
                <View key={term} style={styles.recentChip}>
                  <Pressable onPress={() => setQuery(term)}><Text style={styles.recentText}>{term}</Text></Pressable>
                  <Pressable hitSlop={6} onPress={() => removeRecent(term)}>
                    <Ionicons name="close" size={13} color={colors.textMuted} />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Tendencias */}
        <View style={styles.section}>
          <SectionHeader title="TENDENCIAS" action="Ver Todos" />
          <View style={styles.grid}>
            {trending.map((item) => (
              <View key={item.id} style={styles.gridItem}>
                <TrendingTile item={item} />
              </View>
            ))}
          </View>
        </View>

        {/* Selecciones del personal */}
        <View style={styles.section}>
          <SectionHeader title="SELECCIONES DEL PERSONAL" action="Ver Todos" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hRow}
          >
            {products.slice(0, 4).map((p) => (
              <ProductCardLarge key={p.id} product={p} onPress={() => navigation.navigate("ProductDetail", { product: p })} />
            ))}
          </ScrollView>
        </View>
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
  },
  hIcon: { width: 32, alignItems: "center" },
  headerTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2,
  },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: 100 },
  section: { marginTop: spacing.xl },
  recentRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  recentChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  recentText: { color: colors.textMuted, fontSize: 12, fontWeight: "600" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: { width: "48%", marginBottom: spacing.md },
  hRow: { gap: 12, paddingRight: spacing.lg },
});
