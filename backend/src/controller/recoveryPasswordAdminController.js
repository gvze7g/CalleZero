import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../Utils/sendEmail.js";
import userModel from "../models/users.js";
import { config } from "../config.js";
import { cookieOptions } from "../Utils/cookieOptions.js";
import { isEmail, isPassword, emailQuery, MESSAGES } from "../Utils/validators.js";

const recoveryPasswordAdminController = {};

// Función para enviar email
const sendRecoveryEmail = (email, randomCode) => {
  const mailOptions = {
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

  sendEmail(mailOptions).catch((error) => {
    console.log("Error enviando email:", error);
  });
};

// 1️⃣ SOLICITAR CÓDIGO
recoveryPasswordAdminController.requestCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email requerido" });
    }
    if (!isEmail(email)) {
      return res.status(400).json({ success: false, message: MESSAGES.email });
    }

    const userFound = await userModel.findOne(emailQuery(email));

    if (!userFound) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    // Generar código de 6 dígitos
    const randomCode = crypto.randomBytes(3).toString("hex").toUpperCase();

    // Guardar código en token (15 minutos)
    const token = jsonwebtoken.sign(
      { email, randomCode, verified: false },
      config.JWT.secret,
      { expiresIn: "15m" }
    );

    res.cookie("recoveryCookie", token, cookieOptions(15 * 60 * 1000));

    // Enviar email
    sendRecoveryEmail(userFound.email, randomCode);

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

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (code.toUpperCase() !== decoded.randomCode) {
      return res.status(400).json({ success: false, message: "Código incorrecto" });
    }

    // Crear nuevo token con verified: true
    const newToken = jsonwebtoken.sign(
      { email: decoded.email, verified: true },
      config.JWT.secret,
      { expiresIn: "15m" }
    );

    res.cookie("recoveryCookie", newToken, cookieOptions(15 * 60 * 1000));

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

    if (!isPassword(newPassword)) {
      return res.status(400).json({ success: false, message: MESSAGES.password });
    }

    const token = req.cookies.recoveryCookie;

    if (!token) {
      return res.status(400).json({ success: false, message: "Token expirado" });
    }

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (!decoded.verified) {
      return res.status(400).json({ success: false, message: "Código no verificado" });
    }

    // Hashear nueva contraseña
    const passwordHash = await bcrypt.hash(newPassword, 10);

    await userModel.findOneAndUpdate(
      emailQuery(decoded.email),
      { password: passwordHash },
      { new: true }
    );

    res.clearCookie("recoveryCookie", cookieOptions());

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