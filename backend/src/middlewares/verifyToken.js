import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

export const verifyToken = (req, res, next) => {
  console.log("================================");
  console.log("URL:", req.originalUrl);
  console.log("METHOD:", req.method);
  console.log("COOKIES:", req.cookies);

  try {
    const token = req.cookies.authCookie;

    if (!token) {
      console.log("❌ No llegó token");
      return res.status(401).json({
        message: "No token, acceso denegado",
      });
    }

    const decoded = jsonwebtoken.verify(
      token,
      config.JWT.secret
    );

    console.log("✅ Token válido:", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ Error verificando token:", error.message);

    return res.status(401).json({
      message: "Token inválido",
    });
  }
};