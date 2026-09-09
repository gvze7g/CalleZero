import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Tag from "./Tag";
import { radius } from "../../theme";

export default function TrendingTile({ item, style }) {
  return (
    <Pressable style={[styles.tile, style]}>
      <ImageBackground source={item.image} style={styles.bg} imageStyle={styles.img}>
        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.8)"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.content}>
          {item.tag ? <Tag label={item.tag} /> : <View />}
          <Text style={styles.label} numberOfLines={2}>
            {item.label}
          </Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    height: 110,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  bg: { flex: 1 },
  img: { borderRadius: radius.md },
  content: { flex: 1, padding: 10, justifyContent: "space-between" },
  label: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
