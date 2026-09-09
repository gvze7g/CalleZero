import { API_BASE } from "../config";
import { notifyUnauthorized } from "./shop";

/**
 * Wrapper de fetch: agrega JSON headers, el token Bearer (si se pasa) y
 * normaliza los errores del backend a un Error con .message y .status.
 */
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

  // Actualiza el perfil del usuario autenticado (PUT /api/users/me)
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

  // -------------------------------------------------------------------------
  // TIENDA — endpoints listos para que el equipo los use al conectar la API.
  // El backend ya expone estas rutas (carpeta ../backend/src/routes).
  // Ejemplo de uso en una pantalla:
  //   const { token } = useAuth();
  //   useEffect(() => { authApi.getProducts().then(setProducts); }, []);
  // -------------------------------------------------------------------------
  getProducts: () => request("/product", { method: "GET" }),

  getProductById: (id) => request(`/product/${id}`, { method: "GET" }),

  getCategories: () => request("/categories", { method: "GET" }),

  // pedidos del usuario autenticado (requiere token)
  getOrders: (token) => request("/orders/mine", { method: "GET", token }),

  createOrder: (token, order) =>
    request("/orders", { method: "POST", token, body: order }),
};
