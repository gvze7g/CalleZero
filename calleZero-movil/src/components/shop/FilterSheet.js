import { Modal, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "../../theme";
import { priceRanges, sortOptions } from "../../hooks/useCatalog";

function Chip({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && { color: "#fff" }]}>{label}</Text>
    </Pressable>
  );
}

// Panel inferior de filtros del catalogo
export default function FilterSheet({ visible, onClose, catalog, resultsCount }) {
  const { categories, selectedCats, toggleCategory, priceId, setPriceId, inStockOnly, setInStockOnly, sortIndex, setSortIndex, clearFilters } = catalog;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>FILTROS</Text>
          <Pressable hitSlop={10} onPress={onClose}>
            <Ionicons name="close" size={22} color={colors.text} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: spacing.lg }}>
          <Text style={styles.section}>ORDENAR POR</Text>
          <View style={styles.chips}>
            {sortOptions.map((s, i) => (
              <Chip key={s} label={s} active={sortIndex === i} onPress={() => setSortIndex(i)} />
            ))}
          </View>

          <Text style={styles.section}>CATEGORÍAS</Text>
          <View style={styles.chips}>
            {categories.map((c) => (
              <Chip key={c._id} label={c.name} active={selectedCats.includes(c.name)} onPress={() => toggleCategory(c.name)} />
            ))}
          </View>

          <Text style={styles.section}>PRECIO</Text>
          <View style={styles.chips}>
            {priceRanges.map((r) => (
              <Chip key={r.id} label={r.label} active={priceId === r.id} onPress={() => setPriceId(r.id)} />
            ))}
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Solo productos disponibles</Text>
            <Switch
              value={inStockOnly}
              onValueChange={setInStockOnly}
              trackColor={{ true: colors.primary, false: colors.border }}
              thumbColor="#fff"
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.clearBtn} onPress={clearFilters}>
            <Text style={styles.clearText}>Limpiar</Text>
          </Pressable>
          <Pressable style={styles.applyBtn} onPress={onClose}>
            <Text style={styles.applyText}>Ver {resultsCount} productos</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  sheet: {
    maxHeight: "80%",
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  title: { color: colors.text, fontSize: 14, fontWeight: "800", letterSpacing: 2 },
  section: { color: colors.textMuted, fontSize: 11, fontWeight: "800", letterSpacing: 1, marginTop: spacing.lg, marginBottom: spacing.sm },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textMuted, fontSize: 12, fontWeight: "700" },
  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.xl },
  switchText: { color: colors.text, fontSize: 13, fontWeight: "600" },
  footer: { flexDirection: "row", gap: 10, marginTop: spacing.md },
  clearBtn: {
    flex: 1,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  clearText: { color: colors.text, fontWeight: "700" },
  applyBtn: { flex: 2, height: 48, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  applyText: { color: "#fff", fontWeight: "800" },
});
