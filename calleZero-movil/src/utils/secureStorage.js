import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

/**
 * Almacenamiento del token.
 * - Nativo (Android / iOS): expo-secure-store (cifrado por el sistema).
 * - Web (solo para previsualizar la UI en el navegador): localStorage.
 */
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
    // sin persistencia: la sesion durara solo mientras la app este abierta
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
    // no-op
  }
}
