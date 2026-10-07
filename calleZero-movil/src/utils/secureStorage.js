import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// Guarda el token: SecureStore en el celular, localStorage en web
const isWeb = Platform.OS === "web";

export async function getItem(key) {
  try {
    if (isWeb) return window.localStorage.getItem(key);
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

export async function setItem(key, value) {
  try {
    if (isWeb) {
      window.localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  } catch {
  }
}

export async function deleteItem(key) {
  try {
    if (isWeb) {
      window.localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  } catch {
  }
}
