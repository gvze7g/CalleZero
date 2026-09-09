import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { config } from "../config.js";
import UsersModel from "../models/users.js";

const recoveryPasswordUsersController = {};

// Paso 1: Enviar código de recuperación
recoveryPasswordUsersController.requestCode = async (req, res) => {
  try {
    console.log("POST /forgot-password recibido");

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Correo requerido" });
    }

    // Validar que el correo exista
    const userFound = await UsersModel.findOne({ email });

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

    // Configurar nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user_email,
        pass: config.email.user_password,
      },
    });

    // Enviar correo
    const mailOptions = {
      from: config.email.user_email,
      to: email,
      subject: "Codigo de Recuperacion - Calle Zero",
      html: `
        <h2>Recuperar Contraseña</h2>
        <p>Tu codigo de verificacion es:</p>
        <h1 style="color: #B56CFF;">${randomCode}</h1>
        <p>Este codigo expira en 10 minutos</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error enviando correo:", error);
        return res.status(500).json({ message: "Error al enviar codigo" });
      }
      console.log("Codigo enviado a:", email);
    });

    return res.status(200).json({ message: "Codigo enviado a tu correo" });
  } catch (error) {
    console.error("Error en requestCode:", error);
    return res.status(500).json({ message: "Error al solicitar codigo" });
  }
};

// Paso 2 (opcional): Solo validar el código, sin cambiar la contraseña.
// Se usa en la app móvil para separar la pantalla de código de la de nueva contraseña.
recoveryPasswordUsersController.verifyCodeOnly = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const user = await UsersModel.findOne({ email });

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
    console.log("POST /verify-code recibido");

    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    // Buscar usuario
    const user = await UsersModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar código
    if (user.recoveryCode !== code) {
      return res.status(400).json({ message: "Codigo incorrecto" });
    }

    // Verificar si el código expiró
    if (user.recoveryCodeExpiry < Date.now()) {
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