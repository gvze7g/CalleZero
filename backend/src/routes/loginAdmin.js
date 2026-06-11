import express from "express";
import loginAdminController from "../controller/loginAdminController.js";
import bcrypt from "bcryptjs";
import userModel from "../models/users.js"; // ← CAMBIAR AQUÍ

const router = express.Router();

router.route("/").post(loginAdminController.login);

// Crear usuario admin
router.post("/register", async (req, res) => {
  try {
    console.log("📍 POST /register recibido:", req.body);
    
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Faltan campos" });
    }

    const userExists = await userModel.findOne({ email }); // ← CAMBIAR AQUÍ
    if (userExists) {
      console.log("❌ Usuario ya existe:", email);
      return res.status(400).json({ message: "Usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({ // ← CAMBIAR AQUÍ
      email,
      password: hashedPassword,
      name,
      loginAttempts: 0,
      timeOut: null
    });

    console.log("✅ Usuario creado:", email);

    return res.status(201).json({
      message: "Usuario creado exitosamente",
      user: { email: newUser.email, name: newUser.name }
    });

  } catch (error) {
    console.log("💥 Error creating user:", error);
    return res.status(500).json({ message: "Error al crear usuario", error: error.message });
  }
});

export default router;