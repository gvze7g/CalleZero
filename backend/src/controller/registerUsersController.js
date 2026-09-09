import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import nodemailer from "nodemailer";
import userModel from '../models/users.js';
import { config } from "../config.js";

const registerUserController = {};

// Transporter reutilizable para el envio de correos
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.email.user_email,
    pass: config.email.user_password,
  },
});

// Genera un codigo numerico de 6 digitos
const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Envia el codigo de verificacion de cuenta al correo del usuario
const sendVerificationEmail = async (email, code) => {
  await transporter.sendMail({
    from: config.email.user_email,
    to: email,
    subject: "Verifica tu cuenta - Calle Zero",
    html: `
      <div style="font-family: Arial, sans-serif; background:#0a0a0a; color:#fff; padding:32px; border-radius:12px; max-width:480px; margin:0 auto; text-align:center;">
        <h2 style="margin:0 0 8px;">Bienvenido al movimiento urbano</h2>
        <p style="color:#9ca3af; margin:0 0 24px;">Usa este codigo para verificar tu cuenta:</p>
        <div style="font-size:34px; letter-spacing:10px; font-weight:bold; color:#B56CFF;">${code}</div>
        <p style="color:#6b7280; font-size:13px; margin-top:24px;">El codigo expira en 10 minutos.</p>
      </div>
    `,
  });
};

// POST /api/registerUser
// Crea la cuenta (sin verificar) y envia el codigo de verificacion
registerUserController.register = async (req, res) => {
  try {
    console.log("POST /register recibido:", req.body);

    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    // Verificar si el correo ya está registrado
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Encriptar la contraseña
    const passwordHash = await bcryptjs.hash(password, 10);

    // Codigo de verificacion de cuenta
    const verificationCode = generateCode();
    const codeExpiry = Date.now() + 10 * 60 * 1000; // 10 minutos

    // Guardar en la base de datos (reutilizamos los campos recoveryCode/Expiry)
    const newUser = await userModel.create({
      fullName,
      email,
      password: passwordHash,
      isActive: true,
      isVerified: false,
      recoveryCode: verificationCode,
      recoveryCodeExpiry: codeExpiry,
    });

    console.log("Usuario registrado:", email);

    // Enviar correo con el codigo (no bloqueamos la respuesta si falla)
    try {
      await sendVerificationEmail(email, verificationCode);
      console.log("Codigo de verificacion enviado a:", email);
    } catch (mailError) {
      console.error("Error enviando codigo de verificacion:", mailError);
    }

    // Generar token
    const token = jsonwebtoken.sign(
      { id: newUser._id, userType: "user" },
      config.JWT.secret,
      { expiresIn: "30d" },
    );

    // Guardar token en cookie (web)
    res.cookie("authCookie", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "Cuenta creada. Revisa tu correo para verificarla.",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        isVerified: newUser.isVerified,
      },
    });
  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).json({ message: "Error al registrar" });
  }
};

// POST /api/registerUser/send-code
// Reenvia el codigo de verificacion de cuenta
registerUserController.sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Correo requerido" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "La cuenta ya esta verificada" });
    }

    const verificationCode = generateCode();
    user.recoveryCode = verificationCode;
    user.recoveryCodeExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    try {
      await sendVerificationEmail(email, verificationCode);
    } catch (mailError) {
      console.error("Error enviando codigo:", mailError);
      return res.status(500).json({ message: "Error al enviar el codigo" });
    }

    return res.status(200).json({ message: "Codigo enviado a tu correo" });
  } catch (error) {
    console.error("Error en sendVerificationCode:", error);
    return res.status(500).json({ message: "Error al enviar el codigo" });
  }
};

// POST /api/registerUser/verify-code
// Verifica el codigo y activa la cuenta
registerUserController.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "La cuenta ya estaba verificada" });
    }

    if (!user.recoveryCode || user.recoveryCode !== String(code).trim()) {
      return res.status(400).json({ message: "Codigo incorrecto" });
    }

    if (!user.recoveryCodeExpiry || user.recoveryCodeExpiry < Date.now()) {
      return res.status(400).json({ message: "Codigo expirado" });
    }

    user.isVerified = true;
    user.recoveryCode = null;
    user.recoveryCodeExpiry = null;
    await user.save();

    const token = jsonwebtoken.sign(
      { id: user._id, userType: "user" },
      config.JWT.secret,
      { expiresIn: "30d" },
    );

    res.cookie("authCookie", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Cuenta verificada correctamente",
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Error en verifyEmail:", error);
    return res.status(500).json({ message: "Error al verificar la cuenta" });
  }
};

export default registerUserController;
