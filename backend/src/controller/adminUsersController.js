import Users from "../models/users.js";
import Role from "../models/role.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Configurar Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
    },
});

// Generar password temporal
const generateTemporaryPassword = () => {
    return crypto.randomBytes(8).toString("hex");
};

// Obtener iniciales del nombre
const getInitials = (fullName) => {
    return fullName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

// GET - Listar todos los usuarios
export const getAllUsers = async (req, res) => {
    try {
        const users = await Users.find()
            .populate("role", "name description")
            .select("-password")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            users: users.map((user) => ({
                _id: user._id,
                name: user.fullName,
                email: user.email,
                role: user.role.name,
                avatar: getInitials(user.fullName),
                date: user.createdAt.toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                }),
                status: new Date() - user.lastActivity < 300000 ? "online" : "offline",
                isActive: user.isActive,
                isVerified: user.isVerified,
            })),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener usuarios",
            error: error.message,
        });
    }
};

// GET - Obtener usuario por ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Users.findById(id)
            .populate("role", "name description")
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
            });
        }

        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.fullName,
                email: user.email,
                role: user.role.name,
                avatar: getInitials(user.fullName),
                date: user.createdAt.toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                }),
                status: new Date() - user.lastActivity < 300000 ? "online" : "offline",
                isActive: user.isActive,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener usuario",
            error: error.message,
        });
    }
};

// POST - Crear usuario (Admin)
export const createUser = async (req, res) => {
    try {
        const { fullName, email, role } = req.body;

        // Validar datos requeridos
        if (!fullName || !email || !role) {
            return res.status(400).json({
                success: false,
                message: "Completa todos los campos requeridos",
            });
        }

        // Verificar si el email ya existe
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "El email ya está registrado",
            });
        }

        // Verificar si el rol existe
        const roleDoc = await Role.findOne({ name: role });
        if (!roleDoc) {
            return res.status(400).json({
                success: false,
                message: "Rol no válido",
            });
        }

        // Generar password temporal
        const temporaryPassword = generateTemporaryPassword();
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        // Crear usuario
        const newUser = new Users({
            fullName,
            email,
            password: hashedPassword,
            role: roleDoc._id,
            isActive: true,
            isVerified: false,
        });

        await newUser.save();

        // Enviar email con credentials temporales
        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: "Bienvenido a Calle Zero - Credenciales Temporales",
            html: `
                <h2>¡Bienvenido a Calle Zero!</h2>
                <p>Tu cuenta ha sido creada por un administrador.</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Contraseña Temporal:</strong> ${temporaryPassword}</p>
                <p>Por favor, cambia tu contraseña al iniciar sesión.</p>
            `,
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.log("Error enviando email:", error);
            }
        });

        res.status(201).json({
            success: true,
            message: "Usuario creado exitosamente",
            user: {
                _id: newUser._id,
                name: newUser.fullName,
                email: newUser.email,
                role: role,
                avatar: getInitials(fullName),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al crear usuario",
            error: error.message,
        });
    }
};

// PUT - Actualizar usuario
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, role, isActive } = req.body;

        const user = await Users.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
            });
        }

        // Verificar si el nuevo email ya existe (si cambió)
        if (email && email !== user.email) {
            const existingUser = await Users.findOne({ email });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "El email ya está registrado",
                });
            }
            user.email = email;
        }

        // Verificar si el rol existe (si cambió)
        if (role && role !== user.role.toString()) {
            const roleDoc = await Role.findOne({ name: role });
            if (!roleDoc) {
                return res.status(400).json({
                    success: false,
                    message: "Rol no válido",
                });
            }
            user.role = roleDoc._id;
        }

        if (fullName) user.fullName = fullName;
        if (typeof isActive === "boolean") user.isActive = isActive;

        await user.save();

        const updatedUser = await Users.findById(id)
            .populate("role", "name description")
            .select("-password");

        res.json({
            success: true,
            message: "Usuario actualizado exitosamente",
            user: {
                _id: updatedUser._id,
                name: updatedUser.fullName,
                email: updatedUser.email,
                role: updatedUser.role.name,
                avatar: getInitials(updatedUser.fullName),
                isActive: updatedUser.isActive,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar usuario",
            error: error.message,
        });
    }
};

// DELETE - Eliminar usuario
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await Users.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
            });
        }

        await Users.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Usuario eliminado exitosamente",
            deletedUser: {
                _id: user._id,
                name: user.fullName,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar usuario",
            error: error.message,
        });
    }
};

// GET - Obtener estadísticas de usuarios
export const getUserStats = async (req, res) => {
    try {
        const totalUsers = await Users.countDocuments();
        const activeUsers = await Users.countDocuments({ isActive: true });
        const clientRole = await Role.findOne({ name: "Cliente" });
        const adminRole = await Role.findOne({ name: "Administrador" });

        const clients = await Users.countDocuments({ role: clientRole?._id });
        const admins = await Users.countDocuments({ role: adminRole?._id });

        res.json({
            success: true,
            stats: {
                totalUsers,
                activeUsers,
                clients,
                admins,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener estadísticas",
            error: error.message,
        });
    }
};