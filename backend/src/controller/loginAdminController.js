import bcrypt from "bcryptjs"; //Encriptar
import jsonwebtoken from "jsonwebtoken"; //token

import userModel from "../models/users.js"; // ← CAMBIAR AQUÍ

import { config } from "../config.js";

const loginAdminController = {}


loginAdminController.login = async (req, res) => {
  try {
    console.log("📍 Login POST recibido:", req.body);

    //#1- Solicitar el correo y la contraseña
    const { email, password } = req.body;

    console.log("📍 Email y password extraídos:", { email, password });

    //verificar si el correo existe en la bd
    const userFound = await userModel.findOne({ email }); // ← CAMBIAR AQUÍ

    console.log("🔍 Usuario encontrado:", userFound ? userFound.email : "NO ENCONTRADO");

    //Si no lo encuentra
    if (!userFound) {
      console.log("❌ Usuario no encontrado para email:", email);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    //Verificar si la cuenta está bloqueada
    if (userFound.timeOut && userFound.timeOut > Date.now()) {
      console.log("🔒 Cuenta bloqueada para:", email);
      return res.status(403).json({ message: "Cuenta bloqueada" });
    }

    //Verificar la contraseña
    const isMatch = await bcrypt.compare(password, userFound.password);

    console.log("🔐 Contraseña coincide:", isMatch);

    if (!isMatch) {
      //Si se equivoca en la contraseña
      userFound.loginAttempts = (userFound.loginAttempts || 0) + 1;

      console.log("❌ Contraseña incorrecta. Intentos:", userFound.loginAttempts);

      //Bloquear la cuenta despues de 5 intentos fallidos
      if (userFound.loginAttempts >= 5) {
        userFound.timeOut = Date.now() + 15 * 60 * 1000;
        userFound.loginAttempts = 0;

        await userFound.save();
        console.log("🔒 Cuenta bloqueada después de 5 intentos");
        return res.status(403).json({ message: "Cuenta bloqueada" });
      }

      await userFound.save();

      return res.status(403).json({ message: "Contraseña incorrecta" });
    }

    userFound.loginAttempts = 0;
    userFound.timeOut = null;
    await userFound.save();

    console.log("✅ Login exitoso para:", email);

    //Generar el token
    const token = jsonwebtoken.sign(
      //#1- ¿que vamos a guardar?
      { id: userFound._id, userType: "user" }, // ← CAMBIAR AQUÍ
      //#2- Secret key
      config.JWT.secret,
      //#3- Tiempo de expiración
      { expiresIn: "30d" },
    );

    //Guardamos el token en una cookie
    res.cookie("authCookie", token,{
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    console.log("🎫 Token generado y guardado en cookie");

    //Listo!
    return res.status(200).json({message: "Login exitoso"})
  } catch (error) {
    console.log("💥 ERROR en login:", error)
    return res.status(500).json({message: "Internal server error", error: error.message})
  }
};

export default loginAdminController;