import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

import userModel from "../models/users.js";

import { config } from "../config.js";
import { cookieOptions, AUTH_COOKIE_MAX_AGE } from "../Utils/cookieOptions.js";
import { startVerification } from "../Utils/verification.js";
import { clean, isEmail, emailQuery, MESSAGES } from "../Utils/validators.js";

const loginAdminController = {};

loginAdminController.login = async (req, res) => {
  try {
    const email = clean(req.body.email).toLowerCase();
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Correo y contraseña requeridos" });
    }
    if (!isEmail(email)) {
      return res.status(400).json({ message: MESSAGES.email });
    }

    const userFound = await userModel
      .findOne(emailQuery(email))
      .populate("role", "name");

    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verifica que el usuario tenga rol de Administrador
    if (userFound.role?.name !== "Administrador") {
      return res.status(403).json({ message: "No tienes permisos de administrador" });
    }

    if (userFound.timeOut && userFound.timeOut > Date.now()) {
      return res.status(403).json({ message: "Cuenta bloqueada" });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) {
      userFound.loginAttempts = (userFound.loginAttempts || 0) + 1;

      if (userFound.loginAttempts >= 5) {
        userFound.timeOut = Date.now() + 15 * 60 * 1000;
        userFound.loginAttempts = 0;

        await userFound.save();
        return res.status(403).json({ message: "Cuenta bloqueada" });
      }

      await userFound.save();
      return res.status(403).json({ message: "Contraseña incorrecta" });
    }

    userFound.loginAttempts = 0;
    userFound.timeOut = null;
    await userFound.save();

    // Cuenta sin verificar: se envia un codigo nuevo
    if (!userFound.isVerified) {
      try {
        await startVerification(userFound);
      } catch (mailError) {
        console.error("Error enviando codigo:", mailError);
      }
      return res.status(403).json({
        message: "Tu cuenta no está verificada. Te enviamos un código a tu correo.",
        needsVerification: true,
        email: userFound.email,
      });
    }

    const token = jsonwebtoken.sign(
      { id: userFound._id, userType: "admin" },
      config.JWT.secret,
      { expiresIn: "30d" }
    );

    res.cookie("authCookie", token, cookieOptions(AUTH_COOKIE_MAX_AGE));

    // Token para usarlo como Bearer
    return res.status(200).json({ message: "Login exitoso", token });
  } catch (error) {
    console.log("💥 ERROR en login:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default loginAdminController;