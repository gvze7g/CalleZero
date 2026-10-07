import bcrypt from "bcryptjs";
import sendEmail from "../Utils/sendEmail.js";
import UsersModel from "../models/users.js";
import { isEmail, isCode, isPassword, emailQuery, MESSAGES } from "../Utils/validators.js";

const recoveryPasswordUsersController = {};

// Paso 1: Enviar código de recuperación
recoveryPasswordUsersController.requestCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Correo requerido" });
    }
    if (!isEmail(email)) {
      return res.status(400).json({ message: MESSAGES.email });
    }

    // Validar que el correo exista
    const userFound = await UsersModel.findOne(emailQuery(email));

    if (!userFound) {
      return res.status(404).json({ message: "Correo no encontrado" });
    }

    // Generar código aleatorio
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiry = Date.now() + 10 * 60 * 1000; // 10 minutos

    // Guardar código y expiry en la BD
    userFound.recoveryCode = randomCode;
    userFound.recoveryCodeExpiry = codeExpiry;
    await userFound.save();

    // Enviar correo
    const mailOptions = {
      to: userFound.email,
      subject: "Codigo de Recuperacion - Calle Zero",
      html: `
        <h2>Recuperar Contraseña</h2>
        <p>Tu codigo de verificacion es:</p>
        <h1 style="color: #B56CFF;">${randomCode}</h1>
        <p>Este codigo expira en 10 minutos</p>
      `,
    };

    try {
      await sendEmail(mailOptions);
      console.log("Codigo enviado a:", email);
    } catch (mailError) {
      console.error("Error enviando correo:", mailError);
      return res.status(500).json({ message: "Error al enviar codigo" });
    }

    return res.status(200).json({ message: "Codigo enviado a tu correo" });
  } catch (error) {
    console.error("Error en requestCode:", error);
    return res.status(500).json({ message: "Error al solicitar codigo" });
  }
};

// Paso 2: solo validar el código
recoveryPasswordUsersController.verifyCodeOnly = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }
    if (!isEmail(email)) return res.status(400).json({ message: MESSAGES.email });
    if (!isCode(code)) return res.status(400).json({ message: MESSAGES.code });

    const user = await UsersModel.findOne(emailQuery(email));

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!user.recoveryCode || user.recoveryCode !== String(code).trim()) {
      return res.status(400).json({ message: "Codigo incorrecto" });
    }

    if (!user.recoveryCodeExpiry || user.recoveryCodeExpiry < Date.now()) {
      return res.status(400).json({ message: "Codigo expirado" });
    }

    return res.status(200).json({ message: "Codigo valido" });
  } catch (error) {
    console.error("Error en verifyCodeOnly:", error);
    return res.status(500).json({ message: "Error al validar el codigo" });
  }
};

// Paso 3: Verificar código y cambiar contraseña
recoveryPasswordUsersController.verifyCode = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }
    if (!isEmail(email)) return res.status(400).json({ message: MESSAGES.email });
    if (!isCode(code)) return res.status(400).json({ message: MESSAGES.code });
    if (!isPassword(newPassword)) return res.status(400).json({ message: MESSAGES.password });

    // Buscar usuario
    const user = await UsersModel.findOne(emailQuery(email));

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar código
    if (!user.recoveryCode || user.recoveryCode !== String(code).trim()) {
      return res.status(400).json({ message: "Codigo incorrecto" });
    }

    // Verificar si el código expiró
    if (!user.recoveryCodeExpiry || user.recoveryCodeExpiry < Date.now()) {
      return res.status(400).json({ message: "Codigo expirado" });
    }

    // Encriptar nueva contraseña
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña y limpiar código
    user.password = passwordHash;
    user.recoveryCode = null;
    user.recoveryCodeExpiry = null;
    await user.save();

    console.log("Contraseña actualizada para:", email);

    return res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error en verifyCode:", error);
    return res.status(500).json({ message: "Error al actualizar contraseña" });
  }
};

export default recoveryPasswordUsersController;