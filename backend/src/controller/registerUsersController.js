import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import userModel from '../models/users.js';
import roleModel from "../models/role.js";
import { config } from "../config.js";
import { cookieOptions, AUTH_COOKIE_MAX_AGE } from "../Utils/cookieOptions.js";
import { startVerification } from "../Utils/verification.js";
import notify from "../Utils/notify.js";
import { clean, isName, isEmail, isPassword, isCode, emailQuery, MESSAGES } from "../Utils/validators.js";

const registerUserController = {};

// POST /api/registerUser
// Crea la cuenta (sin verificar) y envia el codigo de verificacion
registerUserController.register = async (req, res) => {
  try {
    const fullName = clean(req.body.fullName);
    const email = clean(req.body.email).toLowerCase();
    const { password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }
    if (!isName(fullName)) return res.status(400).json({ message: MESSAGES.name });
    if (!isEmail(email)) return res.status(400).json({ message: MESSAGES.email });
    if (!isPassword(password)) return res.status(400).json({ message: MESSAGES.password });

    const existUser = await userModel.findOne(emailQuery(email));

    // Cuenta creada pero sin verificar: se reenvia el codigo
    if (existUser && !existUser.isVerified) {
      try {
        await startVerification(existUser);
      } catch (mailError) {
        console.error("Error enviando codigo:", mailError);
      }
      return res.status(200).json({
        message: "Tu cuenta ya existía sin verificar. Te enviamos un nuevo código.",
        needsVerification: true,
        email,
      });
    }

    if (existUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const clientRole = await roleModel.findOne({ name: "Cliente" });

    const newUser = await userModel.create({
      fullName,
      email,
      password: await bcryptjs.hash(password, 10),
      role: clientRole?._id,
      isActive: true,
      isVerified: false,
    });

    try {
      await startVerification(newUser);
    } catch (mailError) {
      console.error("Error enviando codigo de verificacion:", mailError);
    }

    await notify({
      audience: "admin",
      type: "user",
      title: "Nuevo usuario",
      message: `${fullName} (${email}) se registró.`,
      link: "/users",
    });

    return res.status(201).json({
      message: "Cuenta creada. Revisa tu correo para verificarla.",
      needsVerification: true,
      email,
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
    const email = clean(req.body.email).toLowerCase();

    if (!isEmail(email)) {
      return res.status(400).json({ message: MESSAGES.email });
    }

    const user = await userModel.findOne(emailQuery(email));
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "La cuenta ya esta verificada" });
    }

    try {
      await startVerification(user);
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
    const email = clean(req.body.email).toLowerCase();
    const code = clean(req.body.code);

    if (!isEmail(email)) return res.status(400).json({ message: MESSAGES.email });
    if (!isCode(code)) return res.status(400).json({ message: MESSAGES.code });

    const user = await userModel.findOne(emailQuery(email)).populate("role", "name");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "La cuenta ya estaba verificada" });
    }

    if (!user.recoveryCode || user.recoveryCode !== code) {
      return res.status(400).json({ message: "Codigo incorrecto" });
    }

    if (!user.recoveryCodeExpiry || user.recoveryCodeExpiry < Date.now()) {
      return res.status(400).json({ message: "Codigo expirado" });
    }

    user.isVerified = true;
    user.recoveryCode = null;
    user.recoveryCodeExpiry = null;
    await user.save();

    await notify({
      userId: user._id,
      audience: "user",
      type: "system",
      title: "¡Bienvenido a Calle Zero!",
      message: "Tu cuenta fue verificada. Ya puedes comprar.",
    });

    // Los admins vuelven a iniciar sesion en el panel; los clientes entran directo
    if (user.role?.name === "Administrador") {
      return res.status(200).json({ message: "Cuenta verificada correctamente", isAdmin: true });
    }

    const token = jsonwebtoken.sign(
      { id: user._id, userType: "user" },
      config.JWT.secret,
      { expiresIn: "30d" },
    );

    res.cookie("authCookie", token, cookieOptions(AUTH_COOKIE_MAX_AGE));

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
