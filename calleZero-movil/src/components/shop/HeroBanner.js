import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Tag from "./Tag";
import { colors, radius } from "../../theme";

export default function HeroBanner({ data }) {
  return (
    <ImageBackground
      source={data.image}
      style={styles.wrap}
      imageStyle={styles.img}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.15)", "rgba(0,0,0,0.85)"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <Tag label={data.tag} />
        <View style={{ flex: 1 }} />
        <Text style={styles.title}>{data.title}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.subtitle}>{data.subtitle}</Text>
          <Pressable style={styles.cta}>
            <Text style={styles.ctaText}>{data.cta}</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 200,
    borderRadius: radius.lg,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  img: { borderRadius: radius.lg },
  content: { flex: 1, padding: 16 },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
    fontStyle: "italic",
    lineHeight: 28,
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    flex: 1,
  },
  cta: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.sm,
  },
  ctaText: { color: "#000", fontSize: 12, fontWeight: "800" },
});
