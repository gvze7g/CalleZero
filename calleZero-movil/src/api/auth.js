import { API_BASE } from "../config";
import { notifyUnauthorized } from "./shop";

// fetch con JSON, token Bearer y errores normalizados
async function request(path, { method = "POST", body, token } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    const err = new Error(
      "No se pudo conectar con el servidor. Revisa que el backend este corriendo."
    );
    err.cause = networkError;
    throw err;
  }

  let data = null;
  const raw = await response.text();
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = { message: raw };
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      notifyUnauthorized();
    }
    const err = new Error(data?.message || "Ocurrio un error inesperado");
    err.status = response.status;
    throw err;
  }

  return data || {};
}

export const authApi = {
  // Sesion
  login: (email, password) =>
    request("/loginUser", { body: { email, password } }),

  register: (fullName, email, password) =>
    request("/registerUser", { body: { fullName, email, password } }),

  getMe: (token) => request("/users/me", { method: "GET", token }),

  updateProfile: (token, data) =>
    request("/users/me", { method: "PUT", token, body: data }),

  logout: () => request("/logout", {}),

  // Verificacion de cuenta
  sendVerificationCode: (email) =>
    request("/registerUser/send-code", { body: { email } }),

  verifyAccount: (email, code) =>
    request("/registerUser/verify-code", { body: { email, code } }),

  // Recuperacion de contrasena
  forgotPassword: (email) =>
    request("/users/forgot-password", { body: { email } }),

  verifyRecoveryCode: (email, code) =>
    request("/users/verify-recovery-code", { body: { email, code } }),

  resetPassword: (email, code, newPassword) =>
    request("/users/verify-code", { body: { email, code, newPassword } }),
};
