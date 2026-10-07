// URL de la API en linea (VITE_API_URL en .env) o el backend local
export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

// Token guardado para enviarlo como Bearer (la cookie puede bloquearse entre dominios)
const TOKEN_KEY = "cz_admin_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const apiFetch = (path, options = {}) => {
    const headers = new Headers(options.headers);
    const token = getToken();

    if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(`${API_URL}${path}`, {
        credentials: "include",
        ...options,
        headers,
    });
};
