import { useCallback, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";

// Datos de la cuenta, foto y cierre de sesion
export default function useProfile() {
  const { user, signOut, refreshUser } = useAuth();
  const { profilePhoto, saveProfilePhoto, paymentMethods } = useShop();
  const [loggingOut, setLoggingOut] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshUser();
    } catch {}
    setRefreshing(false);
  }, [refreshUser]);

  const initials = (user?.fullName || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
    } finally {
      setLoggingOut(false);
    }
  };

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) saveProfilePhoto(result.assets[0].uri);
  };

  return {
    user,
    profilePhoto,
    paymentMethods,
    initials,
    loggingOut,
    refreshing,
    onRefresh,
    handleLogout,
    pickPhoto,
  };
}
