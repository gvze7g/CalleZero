import express from "express";
import loginAdminController from "../controller/loginAdminController.js";
import bcrypt from "bcryptjs";
import userModel from "../models/users.js";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { verifyToken, getRequestToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.route("/").post(loginAdminController.login);

// Crear usuario (solo un administrador autenticado)
router.post("/register", verifyToken, isAdmin, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Faltan campos" });
    }

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      console.log(" Usuario ya existe:", email);
      return res.status(400).json({ message: "Usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      email,
      password: hashedPassword,
      name,
      loginAttempts: 0,
      timeOut: null
    });

    console.log(" Usuario creado:", email);

    return res.status(201).json({
      message: "Usuario creado exitosamente",
      user: { email: newUser.email, name: newUser.name }
    });

  } catch (error) {
    console.log(" Error creating user:", error);
    return res.status(500).json({ message: "Error al crear usuario", error: error.message });
  }
});

router.get("/me", (req, res) => {
  try {
    const token = getRequestToken(req);

    if (!token) {
      return res.status(401).json({ authenticated: false });
    }

    const decoded = jwt.verify(token, config.JWT.secret);

    // Solo tokens de admin
    if (decoded.userType !== "admin") {
      return res.status(403).json({ authenticated: false });
    }

    return res.status(200).json({
      authenticated: true,
      user: decoded,
    });
  } catch (error) {
    return res.status(401).json({ authenticated: false });
  }
});

export default router;