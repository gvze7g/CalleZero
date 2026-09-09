import express from "express";
import recoveryPasswordUsersController from "../controller/recoveryPasswordUsersController.js";

const router = express.Router();

router.post("/forgot-password", recoveryPasswordUsersController.requestCode);
router.post("/verify-recovery-code", recoveryPasswordUsersController.verifyCodeOnly);
router.post("/verify-code", recoveryPasswordUsersController.verifyCode);

export default router;
