import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

// Token desde "Authorization: Bearer" (primero) o desde la cookie
export const getRequestToken = (req) => {
  const authHeader = req.headers.authorization || "";
  const bearerToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  return bearerToken || req.cookies?.authCookie || null;
};

export const verifyToken = (req, res, next) => {
  try {
    const token = getRequestToken(req);

    if (!token) {
      return res.status(401).json({
        message: "No token, acceso denegado",
      });
    }

    req.user = jsonwebtoken.verify(token, config.JWT.secret);
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido",
    });
  }
};
