import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import ProductCardGrid from "../../components/shop/ProductCardGrid";
// CONECTAR API: `products` -> GET /api/product (con query de orden/filtros).
import { sortOptions } from "../../data/shop";
import { shopApi, productView } from "../../api/shop";
import { useShop } from "../../context/ShopContext";
import { colors, radius, spacing } from "../../theme";

export default function CatalogScreen({ navigation, route }) {
  const title = route.params?.title || "NUEVOS LANZAMIENTOS";
  const [sortIndex, setSortIndex] = useState(0);
  const [filters, setFilters] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { addToCart } = useShop();
  const sort = sortOptions[sortIndex];
  const load = useCallback(async () => { try { const data = await shopApi.products(); setProducts(data.filter(p => p.isActive !== false).map(productView)); } finally { setLoading(false); setRefreshing(false); } }, []);
  useEffect(() => { load(); }, [load]);
  const filtered = useMemo(() => [...products].filter(p => !filters.length || filters.includes(p.categoryId?.name)).sort((a,b) => sortIndex === 2 ? a.price-b.price : sortIndex === 3 ? b.price-a.price : sortIndex === 1 ? new Date(b.createdAt)-new Date(a.createdAt) : 0), [products, filters, sortIndex]);

  const removeFilter = (f) => setFilters((list) => list.filter((x) => x !== f));

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable hitSlop={10} onPress={() => navigation.goBack()} style={styles.hIcon}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.hRight}>
          <Pressable hitSlop={8}>
            <Ionicons name="grid-outline" size={20} color={colors.text} />
          </Pressable>
          <Pressable hitSlop={8}>
            <Ionicons name="options-outline" size={20} color={colors.text} />
          </Pressable>
        </View>
      </View>

      {/* Barra de orden / filtros */}
      <View style={styles.filterBar}>
        <Pressable style={styles.sortBtn} onPress={() => setSortIndex((sortIndex + 1) % sortOptions.length)}>
          <Text style={styles.sortText}>Sort: {sort}</Text>
          <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
        </Pressable>
        <Pressable style={styles.iconPill} onPress={() => setFilters(filters.length ? [] : [...new Set(products.map(p => p.categoryId?.name).filter(Boolean))])}>
          <Ionicons name="swap-vertical" size={15} color={colors.textMuted} />
        </Pressable>

        {filters.map((f) => (
          <Pressable key={f} style={styles.activeChip} onPress={() => removeFilter(f)}>
            <Text style={styles.activeChipText}>{f}</Text>
            <Ionicons name="close" size={13} color="#fff" />
          </Pressable>
        ))}

        <View style={{ flex: 1 }} />
        <Pressable hitSlop={6} onPress={() => setFilters([])}>
          <Text style={styles.clear}>Clear all</Text>
        </Pressable>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.text} />}
        ListEmptyComponent={loading ? <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} /> : <Text style={styles.empty}>No hay productos que coincidan.</Text>}
        renderItem={({ item }) => (
          <ProductCardGrid
            product={item}
            style={styles.card}
            onAdd={() => addToCart(item, item.sizes[0])}
            onPress={() => navigation.navigate("ProductDetail", { product: item })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    height: 48,
    gap: 8,
  },
  hIcon: { width: 28 },
  headerTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  hRight: { flexDirection: "row", gap: 16 },
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  sortText: { color: colors.textMuted, fontSize: 11, fontWeight: "700" },
  iconPill: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: 7,
  },
  activeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  activeChipText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  clear: { color: colors.accent, fontSize: 11, fontWeight: "700" },
  empty: { color: colors.textMuted, textAlign: "center", marginTop: 40 },
  list: { paddingHorizontal: spacing.lg, paddingBottom: 100 },
  column: { justifyContent: "space-between" },
  card: { width: "48%", marginBottom: spacing.lg },
});
