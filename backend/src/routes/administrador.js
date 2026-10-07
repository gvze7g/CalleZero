import express from "express";
import adminController from "../controller/adminController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.use(verifyToken, isAdmin);

router.route("/")
    .get(adminController.getAdmin);

router.route("/:id")
    .put(adminController.updateAdmin)
    .delete(adminController.deleteAdmin);

export default router;
