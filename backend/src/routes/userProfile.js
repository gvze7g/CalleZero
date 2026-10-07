import express from "express";
import usersProfileController from "../controller/usersProfileController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/me", verifyToken, usersProfileController.getCurrentUser);
router.put("/me", verifyToken, usersProfileController.updateProfile);

// Direcciones guardadas
router.get("/me/addresses", verifyToken, usersProfileController.getAddresses);
router.post("/me/addresses", verifyToken, usersProfileController.addAddress);
router.put("/me/addresses/:addressId", verifyToken, usersProfileController.updateAddress);
router.delete("/me/addresses/:addressId", verifyToken, usersProfileController.deleteAddress);

export default router;
