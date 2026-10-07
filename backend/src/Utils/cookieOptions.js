import { config } from "../config.js";

// En produccion la cookie va SameSite=None + Secure (frontends en otro dominio)
export const cookieOptions = (maxAge) => ({
  httpOnly: true,
  sameSite: config.server.isProduction ? "none" : "lax",
  secure: config.server.isProduction,
  path: "/",
  ...(maxAge ? { maxAge } : {}),
});

export const AUTH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;
