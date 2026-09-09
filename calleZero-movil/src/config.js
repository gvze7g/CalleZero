import Constants from "expo-constants";
import { Platform } from "react-native";

/* ============================================================================
 * ⚠️  CONFIGURACION DE LA IP DEL BACKEND  ⚠️
 * ============================================================================
 *
 * El backend (carpeta /backend) corre en el puerto 4000.
 *
 * >>> PARA CORRER LA APP EN UN CELULAR FISICO (Expo Go): <<<
 *     Pon aqui la IP LAN de la computadora donde corre el backend.
 *     Ejemplo:  const MANUAL_API_URL = "http://192.168.1.20:4000";
 *
 *     Como saber tu IP:
 *       - Windows: abre cmd y escribe  ipconfig   -> "Direccion IPv4"
 *       - Mac/Linux:  ifconfig | grep "inet "     o    ip addr
 *     El celular y la computadora deben estar en la MISMA red Wi-Fi.
 *
 *     Si lo dejas en null, la app intenta adivinar la IP automaticamente
 *     desde el servidor de Expo (funciona casi siempre con Expo Go).
 * ========================================================================== */
const MANUAL_API_URL = null; // <-- CAMBIA ESTA LINEA (ej: "http://192.168.1.20:4000")

// ---------------------------------------------------------------------------

const PORT = 4000;

// Tambien se puede definir EXPO_PUBLIC_API_URL en un archivo .env
const explicitUrl = MANUAL_API_URL || process.env.EXPO_PUBLIC_API_URL;

function guessDevHost() {
  // hostUri suele verse como "192.168.1.20:8081"
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost ||
    "";

  const host = hostUri.split(":")[0];
  return host || null;
}

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

  // iOS simulator / web
  return `http://localhost:${PORT}`;
}

export const API_URL = resolveBaseUrl();
export const API_BASE = `${API_URL}/api`;
