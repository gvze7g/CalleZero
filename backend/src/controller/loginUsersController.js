import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import usersModel from "../models/users.js";
import { config } from "../config.js";

const loginUsersController = {};

loginUsersController.login = async (req, res) => {
  try {
    console.log("POST /login recibido:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Correo y contraseña requeridos" });
    }

    // Verificar si el correo existe
    const userFound = await usersModel.findOne({ email });

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

    // Generar token
    const token = jsonwebtoken.sign(
      { id: userFound._id, userType: "user" },
      config.JWT.secret,
      { expiresIn: "30d" },
    );

    // Guardar token en cookie
    res.cookie("authCookie", token, { 
      httpOnly: true, 
      maxAge: 30 * 24 * 60 * 60 * 1000 
    });

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