import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "../../theme";

export default function ProductCardLarge({ product, onPress, onFavorite, favorite }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageWrap}>
        {product.image ? <Image source={product.image} style={styles.image} resizeMode="cover" /> : <View style={styles.image} />}
        <Pressable style={styles.heart} hitSlop={6} onPress={onFavorite}>
          <Ionicons name={favorite ? "heart" : "heart-outline"} size={16} color="#fff" />
        </Pressable>
      </View>

      <Text style={styles.brand} numberOfLines={1}>
        {product.brand}
      </Text>
      <Text style={styles.name} numberOfLines={1}>
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
  card: { width: 190 },
  imageWrap: {
    height: 210,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.surfaceAlt,
    marginBottom: 8,
  },
  image: { width: "100%", height: "100%" },
  heart: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.45)",
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
  name: { color: colors.text, fontSize: 13, fontWeight: "700", marginBottom: 3 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  price: { color: colors.text, fontSize: 13, fontWeight: "800" },
  old: {
    color: colors.textFaint,
    fontSize: 11,
    textDecorationLine: "line-through",
  },
});
