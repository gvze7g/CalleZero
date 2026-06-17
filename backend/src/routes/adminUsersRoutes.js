import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
} from "../controller/adminUsersController.js";

const router = express.Router();

// Proteger todas las rutas de este router
router.use(verifyToken);

// GET
router.get("/", getAllUsers);
router.get("/stats", getUserStats);
router.get("/:id", getUserById);

// POST
router.post("/", createUser);

// PUT
router.put("/:id", updateUser);

// DELETE
router.delete("/:id", deleteUser);

export default router;