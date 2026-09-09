import { useEffect, useState } from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";

import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import VerifyEmailScreen from "../screens/VerifyEmailScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import VerifyCodeScreen from "../screens/VerifyCodeScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";

import TabNavigator from "./TabNavigator";
import CatalogScreen from "../screens/shop/CatalogScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CheckoutScreen from "../screens/shop/CheckoutScreen";
import OrderHistoryScreen from "../screens/shop/OrderHistoryScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import PaymentMethodsScreen from "../screens/PaymentMethodsScreen";

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

export default function RootNavigator() {
  const { isAuthenticated, bootstrapping } = useAuth();
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), 1900);
    return () => clearTimeout(t);
  }, []);

  const showSplash = bootstrapping || !minTimePassed;

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: "slide_from_right",
        }}
      >
        {showSplash ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : isAuthenticated ? (
          <>
            <Stack.Screen name="Tabs" component={TabNavigator} />
            <Stack.Screen name="Catalog" component={CatalogScreen} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
