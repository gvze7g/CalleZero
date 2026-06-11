import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import userModel from "../models/users.js"; // ← CAMBIAR AQUÍ
import { config } from "../config.js";

const recoveryPasswordAdminController = {};

// Función para enviar email
const sendRecoveryEmail = (email, randomCode) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: "Código de recuperación de contraseña - Calle Zero",
    html: `
      <div style="background-color: #0F0F0F; color: white; padding: 20px; font-family: 'Open Sans', sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #B56CFF; margin: 0;">Calle Zero Admin</h1>
        </div>
        
        <div style="background-color: #171724; border: 1px solid #383149; border-radius: 12px; padding: 30px; text-align: center;">
          <h2 style="color: white; margin-top: 0;">Recuperación de Contraseña</h2>
          <p style="color: #ACACAC; margin-bottom: 20px;">Tu código de recuperación es:</p>
          
          <div style="background-color: #2D2140; border: 2px solid #B56CFF; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="font-size: 32px; font-weight: bold; color: #B56CFF; letter-spacing: 5px; margin: 0;">${randomCode.toUpperCase()}</p>
          </div>
          
          <p style="color: #ACACAC; font-size: 14px;">Este código vence en <strong>15 minutos</strong></p>
          <p style="color: #888888; font-size: 12px; margin-top: 20px;">Si no solicitaste este código, ignora este correo.</p>
        </div>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log("Error enviando email:", error);
    }
  });
};

// 1️⃣ SOLICITAR CÓDIGO
recoveryPasswordAdminController.requestCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email requerido" });
    }

    const userFound = await userModel.findOne({ email }); // ← CAMBIAR AQUÍ

    if (!userFound) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    // Generar código de 6 dígitos
    const randomCode = crypto.randomBytes(3).toString("hex").toUpperCase();

    // Guardar código en token (15 minutos)
    const token = jsonwebtoken.sign(
      { email, randomCode, verified: false },
      process.env.JWT_SECRET || "tu-secret-key",
      { expiresIn: "15m" }
    );

    res.cookie("recoveryCookie", token, { 
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      secure: false // Cambiar a true en producción con HTTPS
    });

    // Enviar email
    sendRecoveryEmail(email, randomCode);

    return res.status(200).json({ 
      success: true, 
      message: "Código enviado al correo" 
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: "Error interno" });
  }
};

// 2️⃣ VERIFICAR CÓDIGO
recoveryPasswordAdminController.verifyCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: "Código requerido" });
    }

    const token = req.cookies.recoveryCookie;

    if (!token) {
      return res.status(400).json({ success: false, message: "Token expirado" });
    }

    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET || "tu-secret-key");

    if (code.toUpperCase() !== decoded.randomCode) {
      return res.status(400).json({ success: false, message: "Código incorrecto" });
    }

    // Crear nuevo token con verified: true
    const newToken = jsonwebtoken.sign(
      { email: decoded.email, verified: true },
      process.env.JWT_SECRET || "tu-secret-key",
      { expiresIn: "15m" }
    );

    res.cookie("recoveryCookie", newToken, { 
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      secure: false
    });

    return res.status(200).json({ 
      success: true, 
      message: "Código verificado correctamente" 
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(400).json({ success: false, message: "Código expirado o inválido" });
  }
};

// 3️⃣ ESTABLECER NUEVA CONTRASEÑA
recoveryPasswordAdminController.newPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "Contraseñas requeridas" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Las contraseñas no coinciden" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "Mínimo 8 caracteres" });
    }

    const token = req.cookies.recoveryCookie;

    if (!token) {
      return res.status(400).json({ success: false, message: "Token expirado" });
    }

    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET || "tu-secret-key");

    if (!decoded.verified) {
      return res.status(400).json({ success: false, message: "Código no verificado" });
    }

    // Hashear nueva contraseña
    const passwordHash = await bcrypt.hash(newPassword, 10);

    await userModel.findOneAndUpdate( // ← CAMBIAR AQUÍ
      { email: decoded.email },
      { password: passwordHash },
      { new: true }
    );

    res.clearCookie("recoveryCookie");

    return res.status(200).json({ 
      success: true, 
      message: "Contraseña actualizada correctamente" 
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: "Error interno" });
  }
};

export default recoveryPasswordAdminController;