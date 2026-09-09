import { Alert, Platform } from "react-native";

/**
 * Alertas simples. En web `Alert` de RN no muestra botones, se usa window.alert.
 */
export function showError(message, title = "Ups") {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
    return;
  }
  Alert.alert(title, message);
}

export function showInfo(message, title = "Listo", onOk) {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
    onOk?.();
    return;
  }
  Alert.alert(title, message, [{ text: "OK", onPress: onOk }]);
}
