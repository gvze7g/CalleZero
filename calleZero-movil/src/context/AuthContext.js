import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/auth";
import { getItem, setItem, deleteItem } from "../utils/secureStorage";

const TOKEN_KEY = "callezero.token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  // Al arrancar: recuperar token guardado y validar sesion
  useEffect(() => {
    (async () => {
      try {
        const saved = await getItem(TOKEN_KEY);
        if (saved) {
          setToken(saved);
          try {
            const me = await authApi.getMe(saved);
            setUser(me);
          } catch {
            await deleteItem(TOKEN_KEY);
            setToken(null);
          }
        }
      } finally {
        setBootstrapping(false);
      }
    })();
  }, []);

  const persistSession = useCallback(async (newToken, newUser) => {
    if (newToken) {
      await setItem(TOKEN_KEY, newToken);
      setToken(newToken);
    }
    if (newUser) setUser(newUser);
  }, []);

  const signIn = useCallback(
    async (email, password) => {
      const data = await authApi.login(email, password);
      await persistSession(data.token, data.user || null);
      // Aseguramos datos completos del perfil
      if (data.token) {
        try {
          const me = await authApi.getMe(data.token);
          setUser(me);
        } catch {}
      }
      return data;
    },
    [persistSession]
  );

  // Recarga los datos del usuario desde el backend (GET /api/users/me)
  const refreshUser = useCallback(async () => {
    if (!token) return null;
    const me = await authApi.getMe(token);
    setUser(me);
    return me;
  }, [token]);

  // Actualiza el perfil (PUT /api/users/me) y refresca el estado local
  const updateProfile = useCallback(
    async (data) => {
      const res = await authApi.updateProfile(token, data);
      // el backend devuelve { message, user }
      if (res?.user) setUser(res.user);
      else await refreshUser();
      return res;
    },
    [token, refreshUser]
  );

  const signOut = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {}
    await deleteItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      bootstrapping,
      signIn,
      signOut,
      persistSession,
      refreshUser,
      updateProfile,
      setUser,
    }),
    [token, user, bootstrapping, signIn, signOut, persistSession, refreshUser, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
