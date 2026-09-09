import express from "express";
import registerUserController from "../controller/registerUsersController.js";

const router = express.Router();

router.post("/", registerUserController.register);
router.post("/send-code", registerUserController.sendVerificationCode);
router.post("/verify-code", registerUserController.verifyEmail);

export default router;
