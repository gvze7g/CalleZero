import express from "express";
import usersProfileController from "../controller/usersProfileController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/me", verifyToken, usersProfileController.getCurrentUser);
router.put("/me", verifyToken, usersProfileController.updateProfile);

export default router;
