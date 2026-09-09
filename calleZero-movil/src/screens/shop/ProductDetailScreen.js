import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import Tag from "../../components/shop/Tag";
import QtyStepper from "../../components/shop/QtyStepper";
// CONECTAR API: reemplazar `productDetail` por el producto recibido por params
// o por un fetch a  GET /api/product/:id  usando route.params.id
import { productDetail } from "../../data/shop";
import { colors, radius, spacing } from "../../theme";
import { useShop } from "../../context/ShopContext";

export default function ProductDetailScreen({ navigation, route }) {
  const { addToCart, favorites, toggleFavorite } = useShop();
  // Mezclamos el producto que llega por navegacion (name/price/image) sobre el
  // mock completo, para tener siempre galeria, tallas, colores, etc.
  const passed = route.params?.product || {};
  const product = {
    ...productDetail,
    ...passed,
    gallery: passed.image
      ? [passed.image, ...productDetail.gallery]
      : productDetail.gallery,
  };
  const { width } = useWindowDimensions();

  const [page, setPage] = useState(0);
  const [color, setColor] = useState(product.colors?.[0]?.id);
  const [size, setSize] = useState(product.defaultSize || product.sizes?.[2]);
  const [qty, setQty] = useState(1);

  const onScroll = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    setPage(Math.round(x / width));
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />

      {/* Header flotante */}
      <View style={styles.header}>
        <Pressable hitSlop={10} onPress={() => navigation.goBack()} style={styles.circleBtn}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </Pressable>
        <View style={styles.headerRight}>
          <Pressable hitSlop={10} style={styles.circleBtn} onPress={() => toggleFavorite(product)}>
            <Ionicons name={favorites.some(f => f.id === product.id) ? "heart" : "heart-outline"} size={18} color="#fff" />
          </Pressable>
          <Pressable hitSlop={10} style={styles.circleBtn}>
            <Ionicons name="share-social-outline" size={18} color="#fff" />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Galeria */}
        <View style={{ height: 420, backgroundColor: colors.surfaceAlt }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            {product.gallery.map((img, i) => (
              <Image key={i} source={img} style={{ width, height: 420 }} resizeMode="cover" />
            ))}
          </ScrollView>

          <View style={styles.dots}>
            {product.gallery.map((_, i) => (
              <View key={i} style={[styles.dot, i === page && styles.dotActive]} />
            ))}
          </View>
          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {String(page + 1).padStart(2, "0")}/{String(product.gallery.length).padStart(2, "0")}
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* Tag + rating */}
          <View style={styles.rowBetween}>
            <Tag label={product.tag} />
            <View style={styles.rating}>
              <Ionicons name="star" size={13} color="#F59E0B" />
              <Text style={styles.ratingText}>
                {product.rating}{" "}
                <Text style={styles.ratingMuted}>({product.reviews} Reviews)</Text>
              </Text>
            </View>
          </View>

          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{product.priceLabel || product.price}</Text>
            {product.oldPrice ? <Text style={styles.old}>{product.oldPrice}</Text> : null}
            {product.discount ? (
              <Text style={styles.discount}>{product.discount}</Text>
            ) : null}
          </View>

          {/* Color */}
          <Text style={styles.label}>SELECCIONA EL COLOR</Text>
          <View style={styles.swatches}>
            {product.colors.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => setColor(c.id)}
                style={[
                  styles.swatchRing,
                  color === c.id && { borderColor: colors.primary },
                ]}
              >
                <View style={[styles.swatch, { backgroundColor: c.value }]} />
              </Pressable>
            ))}
          </View>

          {/* Tallas */}
          <Text style={styles.label}>TALLAS</Text>
          <View style={styles.sizes}>
            {product.sizes.map((s) => (
              <Pressable
                key={s}
                onPress={() => setSize(s)}
                style={[styles.size, size === s && styles.sizeActive]}
              >
                <Text style={[styles.sizeText, size === s && styles.sizeTextActive]}>{s}</Text>
              </Pressable>
            ))}
          </View>

          {/* Descripcion */}
          <Text style={styles.label}>DESCRIPCIÓN</Text>
          <Text style={styles.desc}>{product.description}</Text>

          {/* Features */}
          <View style={styles.features}>
            {product.features.map((f) => (
              <View key={f.label} style={styles.feature}>
                <Ionicons name={f.icon} size={16} color={colors.accent} />
                <Text style={styles.featureText}>{f.label}</Text>
              </View>
            ))}
          </View>

          {/* Cantidad */}
          <Text style={styles.label}>CANTIDAD</Text>
          <QtyStepper value={qty} onChange={setQty} />
        </View>
      </ScrollView>

      {/* Barra inferior */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalValue}>{product.priceLabel || `$${(Number(product.price || 0) * qty).toFixed(2)}`}</Text>
        </View>
        <Pressable
          style={styles.addBtn}
          onPress={() => { addToCart(product, size, qty); navigation.navigate("Tabs", { screen: "Carrito" }); }}
        >
          <Ionicons name="bag-add-outline" size={18} color="#fff" />
          <Text style={styles.addText}>AÑADIR AL CARRITO</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  headerRight: { flexDirection: "row", gap: 10 },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  dots: {
    position: "absolute",
    bottom: 14,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.4)" },
  dotActive: { backgroundColor: "#fff", width: 18 },
  counter: {
    position: "absolute",
    bottom: 12,
    right: 14,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  counterText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  body: { padding: spacing.lg },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rating: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { color: colors.text, fontSize: 12, fontWeight: "700" },
  ratingMuted: { color: colors.textFaint, fontWeight: "500" },
  name: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    fontStyle: "italic",
    marginTop: spacing.md,
  },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: spacing.sm },
  price: { color: colors.text, fontSize: 20, fontWeight: "800" },
  old: { color: colors.textFaint, fontSize: 14, textDecorationLine: "line-through" },
  discount: { color: "#F59E0B", fontSize: 11, fontWeight: "800" },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  swatches: { flexDirection: "row", gap: 12 },
  swatchRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  swatch: { width: 26, height: 26, borderRadius: 13 },
  sizes: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  size: {
    minWidth: 46,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  sizeActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  sizeText: { color: colors.textMuted, fontSize: 12, fontWeight: "700" },
  sizeTextActive: { color: "#fff" },
  desc: { color: colors.textMuted, fontSize: 13, lineHeight: 20 },
  features: {
    marginTop: spacing.lg,
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
  },
  feature: { flexDirection: "row", alignItems: "center", gap: 10 },
  featureText: { color: colors.text, fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  totalLabel: { color: colors.textFaint, fontSize: 10, fontWeight: "700" },
  totalValue: { color: colors.text, fontSize: 18, fontWeight: "800" },
  addBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 50,
  },
  addText: { color: "#fff", fontSize: 13, fontWeight: "800" },
});
