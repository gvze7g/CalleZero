import Constants from "expo-constants";
import { Platform } from "react-native";

const PORT = 4000;

// URL de la API en linea (EXPO_PUBLIC_API_URL en el archivo .env)
const explicitUrl = process.env.EXPO_PUBLIC_API_URL;

// IP de la PC donde corre Expo, para usar el backend local
function guessDevHost() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost ||
    "";

  const host = hostUri.split(":")[0];
  return host || null;
}

// Usa la API en linea si esta definida; si no, el backend local
function resolveBaseUrl() {
  if (explicitUrl) return explicitUrl.replace(/\/$/, "");

  const devHost = guessDevHost();

  if (devHost && devHost !== "localhost" && devHost !== "127.0.0.1") {
    return `http://${devHost}:${PORT}`;
  }

  // Emulador Android
  if (Platform.OS === "android") {
    return `http://10.0.2.2:${PORT}`;
  }

  return `http://localhost:${PORT}`;
}

export const API_URL = resolveBaseUrl();
export const API_BASE = `${API_URL}/api`;
