import { ActivityIndicator, FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import ProductCardGrid from "../../components/shop/ProductCardGrid";
import FilterSheet from "../../components/shop/FilterSheet";
import useCatalog from "../../hooks/useCatalog";
import { colors, radius, spacing } from "../../theme";

export default function CatalogScreen({ navigation, route }) {
  const title = route.params?.title || "TODOS LOS PRODUCTOS";
  const catalog = useCatalog(route.params);
  const {
    filtered,
    loading,
    refreshing,
    refresh,
    addToCart,
    sort,
    nextSort,
    activeChips,
    clearFilters,
    filtersOpen,
    setFiltersOpen,
    columns,
    toggleColumns,
  } = catalog;

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
          <Pressable hitSlop={8} onPress={toggleColumns}>
            <Ionicons name={columns === 2 ? "list-outline" : "grid-outline"} size={20} color={colors.text} />
          </Pressable>
          <Pressable hitSlop={8} onPress={() => setFiltersOpen(true)}>
            <Ionicons name="options-outline" size={20} color={activeChips.length ? colors.accent : colors.text} />
          </Pressable>
        </View>
      </View>

      {/* Barra de orden / filtros activos */}
      <View style={styles.filterBar}>
        <Pressable style={styles.sortBtn} onPress={nextSort}>
          <Ionicons name="swap-vertical" size={14} color={colors.textMuted} />
          <Text style={styles.sortText}>{sort}</Text>
        </Pressable>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {activeChips.map((c) => (
            <Pressable key={c.key} style={styles.activeChip} onPress={c.remove}>
              <Text style={styles.activeChipText}>{c.label}</Text>
              <Ionicons name="close" size={13} color="#fff" />
            </Pressable>
          ))}
        </ScrollView>

        {activeChips.length > 0 && (
          <Pressable hitSlop={6} onPress={clearFilters}>
            <Text style={styles.clear}>Limpiar</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.count}>{filtered.length} productos</Text>

      <FlatList
        key={columns}
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={columns === 2 ? styles.column : undefined}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.text} />}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
          ) : (
            <Text style={styles.empty}>No hay productos que coincidan.</Text>
          )
        }
        renderItem={({ item }) => (
          <ProductCardGrid
            product={item}
            style={columns === 2 ? styles.card : styles.cardWide}
            onAdd={() => addToCart(item, item.sizes[0])}
            onPress={() => navigation.navigate("ProductDetail", { product: item })}
          />
        )}
      />

      <FilterSheet
        visible={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        catalog={catalog}
        resultsCount={filtered.length}
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
  chips: { gap: 8, alignItems: "center" },
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
  count: { color: colors.textFaint, fontSize: 11, paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  empty: { color: colors.textMuted, textAlign: "center", marginTop: 40 },
  list: { paddingHorizontal: spacing.lg, paddingBottom: 100 },
  column: { justifyContent: "space-between" },
  card: { width: "48%", flex: 0, marginBottom: spacing.lg },
  cardWide: { width: "100%", marginBottom: spacing.xl },
});
