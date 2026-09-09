import { API_BASE } from "../config";

let onUnauthorized = null;
export const setUnauthorizedHandler = (handler) => { onUnauthorized = handler; };
export const notifyUnauthorized = () => onUnauthorized?.();

async function request(path, { method = "GET", token, body } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Revisa que el backend este corriendo.");
  }
  const raw = await response.text();
  let data = {};
  try { data = raw ? JSON.parse(raw) : {}; } catch { data = { message: raw }; }
  if (!response.ok) {
    if (response.status === 401) notifyUnauthorized();
    const error = new Error(data.message || "Ocurrió un error inesperado");
    error.status = response.status;
    throw error;
  }
  return data;
}

export const shopApi = {
  products: () => request("/product"),
  categories: () => request("/categories"),
  orders: (token) => request("/orders/mine", { token }),
  createOrder: (token, order) => request("/orders", { method: "POST", token, body: order }),
};

export function productView(product) {
  return {
    ...product,
    id: product._id || product.id,
    brand: product.categoryId?.name || "CALLE ZERO",
    price: Number(product.price || 0),
    priceLabel: `$${Number(product.price || 0).toFixed(2)}`,
    image: product.imageUrl?.[0] ? { uri: product.imageUrl[0] } : null,
    gallery: (product.imageUrl || []).map((uri) => ({ uri })),
    sizes: product.size?.length ? product.size : ["Única"],
  };
}
