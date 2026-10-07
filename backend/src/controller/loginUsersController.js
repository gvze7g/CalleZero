import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import usersModel from "../models/users.js";
import { config } from "../config.js";
import { cookieOptions, AUTH_COOKIE_MAX_AGE } from "../Utils/cookieOptions.js";
import { startVerification } from "../Utils/verification.js";
import { clean, isEmail, emailQuery, MESSAGES } from "../Utils/validators.js";

const loginUsersController = {};

loginUsersController.login = async (req, res) => {
  try {
    const email = clean(req.body.email).toLowerCase();
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Correo y contraseña requeridos" });
    }
    if (!isEmail(email)) {
      return res.status(400).json({ message: MESSAGES.email });
    }

    // Verificar si el correo existe
    const userFound = await usersModel.findOne(emailQuery(email));

    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si la cuenta está bloqueada
    if (userFound.timeOut && userFound.timeOut > Date.now()) {
      return res.status(403).json({ message: "Cuenta bloqueada temporalmente" });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) {
      userFound.loginAttempts = (userFound.loginAttempts || 0) + 1;

      // Bloquear después de 5 intentos
      if (userFound.loginAttempts >= 5) {
        userFound.timeOut = Date.now() + 15 * 60 * 1000;
        userFound.loginAttempts = 0;
        await userFound.save();
        return res.status(403).json({ message: "Cuenta bloqueada por seguridad" });
      }

      await userFound.save();
      return res.status(403).json({ message: "Contraseña incorrecta" });
    }

    // Reiniciar intentos fallidos
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

    // Generar token
    const token = jsonwebtoken.sign(
      { id: userFound._id, userType: "user" },
      config.JWT.secret,
      { expiresIn: "30d" },
    );

    // Guardar token en cookie
    res.cookie("authCookie", token, cookieOptions(AUTH_COOKIE_MAX_AGE));

    console.log("Login exitoso:", email);

    // Devolvemos el token en el body para clientes sin cookies (app movil)
    return res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        id: userFound._id,
        fullName: userFound.fullName,
        email: userFound.email,
        isVerified: userFound.isVerified,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error al iniciar sesion" });
  }
};

export default loginUsersController;