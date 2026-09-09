import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Tag from "./Tag";
import { colors, radius } from "../../theme";

/**
 * Tarjeta de producto para grid de 2 columnas (RECOMENDADO / Catalogo).
 * Solo visual.
 */
export default function ProductCardGrid({ product, onPress, onAdd, onFavorite, favorite, style }) {
  return (
    <Pressable style={[styles.card, style]} onPress={onPress}>
      <View style={styles.imageWrap}>
        {product.image ? <Image source={product.image} style={styles.image} resizeMode="cover" /> : <View style={styles.image} />}
        {product.tag ? <Tag label={product.tag} style={styles.tag} /> : null}
        <Pressable style={styles.add} hitSlop={6} onPress={onAdd}>
          <Ionicons name="add" size={18} color="#fff" />
        </Pressable>
      </View>

      <Text style={styles.brand} numberOfLines={1}>
        {product.brand}
      </Text>
      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>{product.priceLabel || `$${Number(product.price || 0).toFixed(2)}`}</Text>
        {product.oldPrice ? (
          <Text style={styles.old}>{product.oldPrice}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1 },
  imageWrap: {
    aspectRatio: 0.82,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.surfaceAlt,
    marginBottom: 8,
  },
  image: { width: "100%", height: "100%" },
  tag: { position: "absolute", top: 8, left: 8 },
  add: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    color: colors.accent,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  name: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
    marginBottom: 4,
    minHeight: 32,
  },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  price: { color: colors.text, fontSize: 13, fontWeight: "800" },
  old: {
    color: colors.textFaint,
    fontSize: 11,
    textDecorationLine: "line-through",
  },
});
