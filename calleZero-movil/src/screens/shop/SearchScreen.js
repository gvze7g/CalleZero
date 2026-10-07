import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import SearchBar from "../../components/shop/SearchBar";
import SectionHeader from "../../components/shop/SectionHeader";
import TrendingTile from "../../components/shop/TrendingTile";
import ProductCardLarge from "../../components/shop/ProductCardLarge";
import useSearch from "../../hooks/useSearch";
import { colors, radius, spacing } from "../../theme";

export default function SearchScreen({ navigation }) {
  const {
    query,
    setQuery,
    products,
    results,
    categoryTiles,
    recentSearches: recents,
    removeRecentSearch,
    clearRecents,
    submit,
  } = useSearch();

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
        <Pressable
          hitSlop={10}
          style={styles.hIcon}
          onPress={() => navigation.navigate("Catalog", { title: "FILTRAR PRODUCTOS", openFilters: true })}
        >
          <Ionicons name="options-outline" size={22} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SearchBar value={query} onChangeText={setQuery} onSubmitEditing={submit} />

        {query.trim() ? (
          <View style={styles.section}>
            <SectionHeader title={`RESULTADOS (${results.length})`} />
            {results.length ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hRow}>
                {results.map((p) => (
                  <ProductCardLarge key={p.id} product={p} onPress={() => navigation.navigate("ProductDetail", { product: p })} />
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.noResults}>No encontramos productos para "{query.trim()}".</Text>
            )}
          </View>
        ) : null}

        {/* Busquedas recientes */}
        {recents.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="BÚSQUEDAS RECIENTES"
              action="Limpiar"
              onAction={clearRecents}
            />
            <View style={styles.recentRow}>
              {recents.map((term) => (
                <View key={term} style={styles.recentChip}>
                  <Pressable onPress={() => setQuery(term)}><Text style={styles.recentText}>{term}</Text></Pressable>
                  <Pressable hitSlop={6} onPress={() => removeRecentSearch(term)}>
                    <Ionicons name="close" size={13} color={colors.textMuted} />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Categorias */}
        <View style={styles.section}>
          <SectionHeader
            title="CATEGORÍAS"
            action="Ver Todos"
            onAction={() => navigation.navigate("Catalog", { title: "TODOS LOS PRODUCTOS" })}
          />
          <View style={styles.grid}>
            {categoryTiles.map((item) => (
              <View key={item.id} style={styles.gridItem}>
                <TrendingTile
                  item={item}
                  onPress={() => navigation.navigate("Catalog", { title: item.label, category: item.name })}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Selecciones del personal */}
        <View style={styles.section}>
          <SectionHeader
            title="SELECCIONES DEL PERSONAL"
            action="Ver Todos"
            onAction={() => navigation.navigate("Catalog", { title: "SELECCIONES DEL PERSONAL" })}
          />
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
  noResults: { color: colors.textMuted, fontSize: 13 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: { width: "48%", marginBottom: spacing.md },
  hRow: { gap: 12, paddingRight: spacing.lg },
});
