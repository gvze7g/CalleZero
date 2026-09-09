import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import HomeShopScreen from "../screens/shop/HomeShopScreen";
import SearchScreen from "../screens/shop/SearchScreen";
import CartScreen from "../screens/shop/CartScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { colors } from "../theme";
import { useShop } from "../context/ShopContext";

const Tab = createBottomTabNavigator();

const ICONS = {
  Inicio: "home",
  Buscar: "search",
  Carrito: "bag",
  Perfil: "person",
};

function TabIcon({ routeName, focused, color }) {
  const { cartCount } = useShop();
  const base = ICONS[routeName];
  const name = focused ? base : `${base}-outline`;
  return (
    <View>
      <Ionicons name={name} size={22} color={color} />
      {routeName === "Carrito" ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cartCount}</Text>
        </View>
      ) : null}
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        tabBarIcon: ({ focused, color }) => (
          <TabIcon routeName={route.name} focused={focused} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Inicio" component={HomeShopScreen} />
      <Tab.Screen name="Buscar" component={SearchScreen} />
      <Tab.Screen name="Carrito" component={CartScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    height: 62,
    paddingTop: 6,
    paddingBottom: 8,
  },
  label: { fontSize: 10, fontWeight: "700" },
  badge: {
    position: "absolute",
    top: -5,
    right: -9,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: { color: "#fff", fontSize: 9, fontWeight: "800" },
});
